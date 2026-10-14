begin;
-- Addresses are optional and may be shared. Preserve all existing owner,
-- snapshot and numbering safeguards; an agreed due date may be in the past.
create or replace function public.issue_invoice(p_id uuid,p_version timestamptz) returns uuid
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
  if inv.due_date is null then raise exception 'Payment due date required' using errcode='23514'; end if;
  yr=extract(year from day);
  insert into private.invoice_counters(year,last_number) values(yr,1) on conflict(year) do update set last_number=private.invoice_counters.last_number+1 returning last_number into counter;
  update public.invoices set state='issued',number='MM-'||yr||'-'||lpad(counter::text,greatest(6,length(counter::text)),'0'),issued_on=day,updated_at=clock_timestamp() where id=p_id;
  return p_id;
end $$;
commit;
