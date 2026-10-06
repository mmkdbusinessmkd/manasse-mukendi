-- Run once in a dedicated Supabase project. No clients or administrator seeded.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table private.admin_users (
  singleton boolean primary key default true check (singleton),
  user_id uuid not null unique references auth.users(id) on delete cascade
);
revoke all on private.admin_users from public, anon, authenticated;
create function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from private.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;
create table public.clients (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
  name text not null check(length(name) between 1 and 160),
  company text not null default '' check(length(company)<=160),
  whatsapp text not null default '' check(length(whatsapp)<=40),
  email text not null default '' check(length(email)<=254),
  client_type text not null default '' check(length(client_type)<=100),
  status text not null default 'actif' check(status in ('actif','termine','pause')),
  start_date date, end_date date, notes text not null default '' check(length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(id,owner_id), check(end_date is null or start_date is null or end_date>=start_date)
);
create table public.missions (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), client_id uuid not null,
  title text not null check(length(title) between 1 and 180),
  description text not null default '' check(length(description)<=10000), service text not null default '' check(length(service)<=160),
  start_date date, end_date date, due_date date,
  amount_cents bigint not null check(amount_cents between 0 and 99999999999),
  currency text not null default 'USD' check(currency in ('USD','EUR','CDF')),
  status text not null default 'actif' check(status in ('actif','termine','suspendu')),
  frequency text not null default 'ponctuel' check(frequency in ('ponctuel','mensuel')),
  payment_terms text not null default '' check(length(payment_terms)<=3000), notes text not null default '' check(length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(client_id,owner_id) references public.clients(id,owner_id) on delete restrict,
  unique(id,client_id,owner_id), unique(id,client_id,owner_id,currency),
  check(end_date is null or start_date is null or end_date>=start_date)
);
create table public.payments (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), client_id uuid not null, mission_id uuid not null,
  amount_cents bigint not null check(amount_cents between 1 and 99999999999), currency text not null check(currency in ('USD','EUR','CDF')),
  paid_on date not null, method text not null default '' check(length(method)<=100), notes text not null default '' check(length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(mission_id,client_id,owner_id,currency) references public.missions(id,client_id,owner_id,currency) on delete restrict
);
create table public.tasks (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), client_id uuid not null, mission_id uuid,
  title text not null check(length(title) between 1 and 180), description text not null default '' check(length(description)<=10000),
  priority text not null default 'normale' check(priority in ('faible','normale','urgente')), due_date date,
  status text not null default 'a_faire' check(status in ('a_faire','en_cours','termine')), notes text not null default '' check(length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(client_id,owner_id) references public.clients(id,owner_id) on delete restrict,
  foreign key(mission_id,client_id,owner_id) references public.missions(id,client_id,owner_id) on delete restrict
);
create table public.deliverables (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), client_id uuid not null, mission_id uuid,
  title text not null check(length(title) between 1 and 180), content_type text not null default '' check(length(content_type)<=100),
  planned_on date, delivered_on date,
  status text not null default 'a_faire' check(status in ('a_faire','en_cours','livre','validation','valide')),
  url text not null default '' check(length(url)<=2000 and (url='' or url ~ '^https?://')),
  notes text not null default '' check(length(notes)<=10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(client_id,owner_id) references public.clients(id,owner_id) on delete restrict,
  foreign key(mission_id,client_id,owner_id) references public.missions(id,client_id,owner_id) on delete restrict,
  check(status not in ('livre','validation','valide') or delivered_on is not null)
);
create table public.notes (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id), client_id uuid not null, mission_id uuid,
  title text not null check(length(title) between 1 and 180), body text not null check(length(body) between 1 and 10000),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(client_id,owner_id) references public.clients(id,owner_id) on delete restrict,
  foreign key(mission_id,client_id,owner_id) references public.missions(id,client_id,owner_id) on delete restrict
);
create function private.stamp_update() returns trigger language plpgsql set search_path='' as $$
begin
  new.updated_at=clock_timestamp(); new.created_at=old.created_at;
  if new.owner_id<>old.owner_id or new.id<>old.id then raise exception 'Immutable identity' using errcode='23514'; end if;
  return new;
end $$;
revoke all on function private.stamp_update() from public;
-- Lock the parent mission to serialize payments and prevent overpayment.
create function private.check_payment() returns trigger language plpgsql set search_path='' as $$
declare agreed bigint; received bigint;
begin
  if TG_OP='UPDATE' and (new.mission_id<>old.mission_id or new.client_id<>old.client_id or new.currency<>old.currency) then
    raise exception 'Payment relationship is immutable' using errcode='23514';
  end if;
  select amount_cents into agreed from public.missions where id=new.mission_id and client_id=new.client_id and owner_id=new.owner_id and currency=new.currency for update;
  if agreed is null then raise exception 'Invalid mission' using errcode='23503'; end if;
  select coalesce(sum(amount_cents),0) into received from public.payments where mission_id=new.mission_id and id<>new.id;
  if received+new.amount_cents>agreed then raise exception 'Payment exceeds balance' using errcode='23514'; end if;
  return new;
end $$;
create trigger payment_balance before insert or update on public.payments for each row execute function private.check_payment();
revoke all on function private.check_payment() from public;
create function private.check_mission_amount() returns trigger language plpgsql set search_path='' as $$
begin
  if new.amount_cents < (select coalesce(sum(amount_cents),0) from public.payments where mission_id=old.id) then
    raise exception 'Amount below received payments' using errcode='23514';
  end if;
  return new;
end $$;
create trigger mission_balance before update on public.missions for each row execute function private.check_mission_amount();
revoke all on function private.check_mission_amount() from public;
do $$ declare t text; begin
  foreach t in array array['clients','missions','payments','tasks','deliverables','notes'] loop
    execute format('alter table public.%I enable row level security', t);
    execute format('alter table public.%I force row level security', t);
    execute format('revoke all on public.%I from public, anon, authenticated', t);
    execute format('grant select, insert, update, delete on public.%I to authenticated', t);
    execute format('create policy owner_admin on public.%I for all to authenticated using ((select public.is_admin()) and owner_id=(select auth.uid())) with check ((select public.is_admin()) and owner_id=(select auth.uid()))', t);
    execute format('create index on public.%I (owner_id)', t);
    if t<>'clients' then execute format('create index on public.%I (client_id)', t); end if;
    execute format('create trigger stamp_update before update on public.%I for each row execute function private.stamp_update()', t);
  end loop;
end $$;
create index on public.tasks(owner_id,due_date);
create index on public.deliverables(owner_id,planned_on);
create index on public.payments(mission_id);
create index on public.payments(owner_id,paid_on);
create index on public.missions(owner_id,due_date);
commit;
