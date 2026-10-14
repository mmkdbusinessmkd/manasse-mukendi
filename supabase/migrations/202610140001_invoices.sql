begin;
create table public.invoice_settings (
  owner_id uuid primary key references auth.users(id),
  name text not null check(length(name) between 1 and 160),
  email text not null check(length(email)<=254), phone text not null check(length(phone)<=40),
  address text not null default '' check(length(address)<=600),
  registration text not null default '' check(length(registration)<=500),
  tax_note text not null default '' check(length(tax_note)<=1000),
  payment_details text not null default '' check(length(payment_details)<=1500)
);
create table public.invoices (
  id uuid primary key default gen_random_uuid(), owner_id uuid not null references auth.users(id),
  mission_id uuid not null unique, client_id uuid not null,
  state text not null default 'draft' check(state in ('draft','issued')),
  number text unique, issued_on date, due_date date,
  description text not null check(length(description) between 1 and 3000),
  client_address text not null default '' check(length(client_address)<=600),
  client_registration text not null default '' check(length(client_registration)<=500),
  issuer jsonb not null, customer jsonb not null,
  amount_cents bigint not null check(amount_cents between 1 and 99999999999),
  currency text not null check(currency in ('USD','EUR','CDF')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  foreign key(mission_id,client_id,owner_id) references public.missions(id,client_id,owner_id) on delete restrict,
  check((state='draft' and number is null and issued_on is null) or (state='issued' and number is not null and issued_on is not null))
);
create index on public.invoices(owner_id,created_at desc);
create index on public.invoices(client_id);
create table private.invoice_counters (year integer primary key, last_number integer not null check(last_number>0));
alter table public.invoice_settings enable row level security;
alter table public.invoice_settings force row level security;
alter table public.invoices enable row level security;
alter table public.invoices force row level security;
alter table private.invoice_counters enable row level security;
alter table private.invoice_counters force row level security;
revoke all on public.invoice_settings,public.invoices,private.invoice_counters from public,anon,authenticated;
grant select,insert,update on public.invoice_settings to authenticated;
grant select on public.invoices to authenticated;
create policy owner_settings on public.invoice_settings for all to authenticated using ((select public.is_admin()) and owner_id=(select auth.uid())) with check ((select public.is_admin()) and owner_id=(select auth.uid()));
create policy owner_invoices on public.invoices for select to authenticated using ((select public.is_admin()) and owner_id=(select auth.uid()));

-- Only these RPCs may write invoices. They authenticate again and serialize per mission.
create function public.prepare_invoice(p_mission uuid) returns uuid
language plpgsql security definer set search_path='' as $$
declare m public.missions; c public.clients; settings jsonb; result uuid;
begin
  if not public.is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
  select * into m from public.missions where id=p_mission and owner_id=auth.uid() for update;
  if m.id is null or m.amount_cents<=0 then raise exception 'Invalid mission amount' using errcode='23514'; end if;
  select id into result from public.invoices where mission_id=m.id;
  if result is not null then return result; end if;
  select * into c from public.clients where id=m.client_id and owner_id=auth.uid();
  select to_jsonb(s)-'owner_id' into settings from public.invoice_settings s where owner_id=auth.uid();
  insert into public.invoices(owner_id,mission_id,client_id,description,due_date,issuer,customer,amount_cents,currency)
  values(auth.uid(),m.id,m.client_id,m.title,m.due_date,coalesce(settings,'{}'::jsonb),jsonb_build_object('name',c.name,'company',c.company,'email',c.email,'phone',c.whatsapp),m.amount_cents,m.currency) returning id into result;
  return result;
end $$;

create function public.save_invoice_draft(p_id uuid,p_version timestamptz,p_description text,p_address text,p_registration text,p_due date) returns uuid
language plpgsql security definer set search_path='' as $$
declare inv public.invoices; m public.missions; c public.clients; settings jsonb;
begin
  if not public.is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
  select * into inv from public.invoices where id=p_id and owner_id=auth.uid();
  if inv.id is null then raise exception 'Not authorized' using errcode='42501'; end if;
  select * into m from public.missions where id=inv.mission_id for update;
  select * into inv from public.invoices where id=p_id for update;
  if inv.state<>'draft' or inv.updated_at<>p_version then raise exception 'Refresh invoice' using errcode='P0409'; end if;
  select * into c from public.clients where id=m.client_id;
  select to_jsonb(s)-'owner_id' into settings from public.invoice_settings s where owner_id=auth.uid();
  update public.invoices set description=trim(p_description),client_address=trim(p_address),client_registration=trim(p_registration),due_date=p_due,
    issuer=coalesce(settings,'{}'::jsonb),customer=jsonb_build_object('name',c.name,'company',c.company,'email',c.email,'phone',c.whatsapp),
    amount_cents=m.amount_cents,currency=m.currency,updated_at=clock_timestamp() where id=p_id;
  return p_id;
end $$;

create function public.issue_invoice(p_id uuid,p_version timestamptz) returns uuid
language plpgsql security definer set search_path='' as $$
declare inv public.invoices; m public.missions; c public.clients; settings jsonb; counter integer; day date := (now() at time zone 'Africa/Kinshasa')::date; yr integer;
begin
  if not public.is_admin() then raise exception 'Not authorized' using errcode='42501'; end if;
  select * into inv from public.invoices where id=p_id and owner_id=auth.uid();
  if inv.id is null then raise exception 'Not authorized' using errcode='42501'; end if;
  select * into m from public.missions where id=inv.mission_id for update;
  select * into inv from public.invoices where id=p_id for update;
  if inv.state='issued' then return inv.id; end if;
  if inv.updated_at<>p_version then raise exception 'Refresh invoice' using errcode='P0409'; end if;
  select * into c from public.clients where id=m.client_id for share;
  select to_jsonb(s)-'owner_id' into settings from public.invoice_settings s where owner_id=auth.uid() for share;
  if settings is distinct from inv.issuer or inv.amount_cents<>m.amount_cents or inv.currency<>m.currency or
    inv.customer is distinct from jsonb_build_object('name',c.name,'company',c.company,'email',c.email,'phone',c.whatsapp) then
    raise exception 'Refresh invoice' using errcode='P0409';
  end if;
  if coalesce(trim(inv.issuer->>'address'),'')='' or coalesce(trim(inv.issuer->>'tax_note'),'')='' or trim(inv.client_address)='' or inv.due_date is null or inv.due_date<day then
    raise exception 'Complete billing information' using errcode='23514';
  end if;
  yr=extract(year from day);
  insert into private.invoice_counters(year,last_number) values(yr,1) on conflict(year) do update set last_number=private.invoice_counters.last_number+1 returning last_number into counter;
  update public.invoices set state='issued',number='MM-'||yr||'-'||lpad(counter::text,greatest(6,length(counter::text)),'0'),issued_on=day,updated_at=clock_timestamp() where id=p_id;
  return p_id;
end $$;
-- Once issued, the agreed amount and parties must not silently change underneath the invoice.
create function private.lock_invoiced_mission() returns trigger language plpgsql security definer set search_path='' as $$
begin
  if (new.amount_cents,new.currency,new.client_id) is distinct from (old.amount_cents,old.currency,old.client_id) and exists(select 1 from public.invoices where mission_id=old.id and state='issued') then
    raise exception 'Issued invoice: agreed amount and client are immutable' using errcode='23514';
  end if;
  return new;
end $$;
create trigger invoiced_mission before update on public.missions for each row execute function private.lock_invoiced_mission();
revoke all on function private.lock_invoiced_mission() from public;
revoke all on function public.prepare_invoice(uuid), public.save_invoice_draft(uuid,timestamptz,text,text,text,date), public.issue_invoice(uuid,timestamptz) from public,anon,authenticated;
grant execute on function public.prepare_invoice(uuid), public.save_invoice_draft(uuid,timestamptz,text,text,text,date), public.issue_invoice(uuid,timestamptz) to authenticated;
commit;
