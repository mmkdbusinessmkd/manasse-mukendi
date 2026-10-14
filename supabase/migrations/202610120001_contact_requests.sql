begin;
create table public.contact_requests (
  id uuid primary key,
  owner_id uuid not null references auth.users(id),
  name text not null check(length(name) between 2 and 160),
  email text not null check(length(email) between 3 and 254),
  phone text not null check(phone ~ '^\+[1-9][0-9]{7,14}$'),
  service text not null check(length(service) between 1 and 160),
  message text not null default '' check(length(message)<=5000),
  entreprise text not null default '' check(length(entreprise)<=160),
  secteur text not null default '' check(length(secteur)<=160),
  site_ou_reseaux text not null default '' check(length(site_ou_reseaux)<=1000),
  probleme_communication text not null default '' check(length(probleme_communication)<=3000),
  motivation_programme text not null default '' check(length(motivation_programme)<=3000),
  status text not null default 'nouveau' check(status in ('nouveau','en_cours','contacte','archive')),
  notes text not null default '' check(length(notes)<=5000),
  payload_hash text not null check(length(payload_hash)=64),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.contact_requests enable row level security;
alter table public.contact_requests force row level security;
revoke all on public.contact_requests from public, anon, authenticated;
grant select on public.contact_requests to authenticated;
grant update(status,notes) on public.contact_requests to authenticated;
create policy inbox_owner on public.contact_requests for select to authenticated
  using ((select public.is_admin()) and owner_id=(select auth.uid()));
create policy inbox_update on public.contact_requests for update to authenticated
  using ((select public.is_admin()) and owner_id=(select auth.uid()))
  with check ((select public.is_admin()) and owner_id=(select auth.uid()));
create trigger stamp_update before update on public.contact_requests for each row execute function private.stamp_update();
create index on public.contact_requests(owner_id, created_at desc);
create index on public.contact_requests(owner_id, status);

-- Only short-lived, irreversible source fingerprints are retained for throttling.
create table private.contact_request_limits (key text not null, created_at timestamptz not null default now());
alter table private.contact_request_limits enable row level security;
alter table private.contact_request_limits force row level security;
create index on private.contact_request_limits(key,created_at);
revoke all on private.contact_request_limits from public, anon, authenticated;

-- No anonymous database access: the website server alone may call this function.
create function public.receive_contact_request(p_id uuid, p_hash text, p_ip_hash text, p_email_hash text, p_data jsonb)
returns boolean language plpgsql security definer set search_path='' as $$
declare existing_hash text; owner uuid; k text;
begin
  if length(p_hash)<>64 or length(p_ip_hash)<>64 or length(p_email_hash)<>64 then raise exception 'Invalid fingerprint' using errcode='22023'; end if;
  -- Serialize retries and rate checks across concurrent requests / server instances.
  perform pg_catalog.pg_advisory_xact_lock(73421012);
  select payload_hash into existing_hash from public.contact_requests where id=p_id;
  if found then
    if existing_hash<>p_hash then raise exception 'Submission changed' using errcode='23505'; end if;
    return false;
  end if;
  delete from private.contact_request_limits where created_at < now()-interval '1 day';
  if (select count(*) from private.contact_request_limits where key='total' and created_at>now()-interval '1 hour')>=100
    or (select count(*) from private.contact_request_limits where key='ip:'||p_ip_hash and created_at>now()-interval '1 hour')>=5
    or (select count(*) from private.contact_request_limits where key='email:'||p_email_hash and created_at>now()-interval '1 hour')>=3
  then raise exception 'Too many requests' using errcode='P0429'; end if;
  select user_id into owner from private.admin_users where singleton;
  if owner is null then raise exception 'Inbox unavailable' using errcode='P0503'; end if;
  insert into public.contact_requests(id,owner_id,payload_hash,name,email,phone,service,message,entreprise,secteur,site_ou_reseaux,probleme_communication,motivation_programme)
  values(p_id,owner,p_hash,p_data->>'name',p_data->>'email',p_data->>'phone',p_data->>'service',coalesce(p_data->>'message',''),coalesce(p_data->>'entreprise',''),coalesce(p_data->>'secteur',''),coalesce(p_data->>'site_ou_reseaux',''),coalesce(p_data->>'probleme_communication',''),coalesce(p_data->>'motivation_programme',''));
  foreach k in array array['total','ip:'||p_ip_hash,'email:'||p_email_hash] loop
    insert into private.contact_request_limits(key) values(k);
  end loop;
  return true;
end $$;
revoke all on function public.receive_contact_request(uuid,text,text,text,jsonb) from public, anon, authenticated;
grant execute on function public.receive_contact_request(uuid,text,text,text,jsonb) to service_role;
commit;
