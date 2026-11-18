-- Prepared only. Do not apply until the named test project is approved.
create table public.kit_purchases (
  id uuid primary key default gen_random_uuid(),
  session_id text not null unique,
  payment_intent text not null unique,
  kit_slug text not null,
  email text not null,
  file_path text not null,
  amount_cents integer not null default 5900 check (amount_cents = 5900),
  currency text not null default 'usd' check (currency = 'usd'),
  status text not null default 'paid' check (status in ('paid', 'refunded')),
  created_at timestamptz not null default now(),
  refunded_at timestamptz,
  delivery_payload jsonb,
  delivery_attempt uuid,
  delivery_lease_until timestamptz,
  delivery_started_at timestamptz,
  email_sent_at timestamptz
);
create table public.kit_stripe_events (
  event_id text primary key,
  event_type text not null,
  purchase_id uuid references public.kit_purchases(id),
  received_at timestamptz not null default now()
);
-- Retain refunds that arrive before checkout.session.completed.
create table public.kit_refunds (
  payment_intent text primary key,
  refunded_at timestamptz not null default now()
);
alter table public.kit_purchases enable row level security;
alter table public.kit_stripe_events enable row level security;
alter table public.kit_refunds enable row level security;
revoke all on public.kit_purchases, public.kit_stripe_events, public.kit_refunds from anon, authenticated;
grant all on public.kit_purchases, public.kit_stripe_events, public.kit_refunds to service_role;

insert into storage.buckets (id, name, public) values ('kits', 'kits', false)
on conflict (id) do update set public = false;
-- No client policies on storage.objects: only service_role may issue signed URLs.

create function public.kits_record_event(p_event_id text, p_event_type text, p_purchase jsonb, p_refund_intent text)
returns uuid language plpgsql security invoker set search_path = public as $$
declare v_id uuid; v_intent text; v_inserted text;
begin
  v_intent := coalesce(p_refund_intent, p_purchase->>'payment_intent');
  -- Serialise purchase/refund races, even before a purchase row exists.
  perform pg_advisory_xact_lock(hashtextextended(v_intent, 0));
  insert into kit_stripe_events(event_id, event_type) values (p_event_id, p_event_type)
    on conflict do nothing returning event_id into v_inserted;
  if v_inserted is null then
    select purchase_id into v_id from kit_stripe_events where event_id = p_event_id;
    return v_id;
  end if;
  if p_event_type = 'charge.refunded' then
    insert into kit_refunds(payment_intent) values (p_refund_intent) on conflict do nothing;
    update kit_purchases set status = 'refunded', refunded_at = now()
      where payment_intent = p_refund_intent returning id into v_id;
  elsif p_event_type = 'checkout.session.completed' then
    insert into kit_purchases(session_id, payment_intent, kit_slug, email, file_path, status, refunded_at)
      values (p_purchase->>'session_id', v_intent, p_purchase->>'kit_slug', p_purchase->>'email', p_purchase->>'file_path',
        case when exists(select 1 from kit_refunds where payment_intent = v_intent) then 'refunded' else 'paid' end,
        (select refunded_at from kit_refunds where payment_intent = v_intent))
      on conflict (session_id) do nothing;
    select id into v_id from kit_purchases where session_id = p_purchase->>'session_id';
  else raise exception 'Unsupported kit event';
  end if;
  update kit_stripe_events set purchase_id = v_id where event_id = p_event_id;
  return v_id;
end $$;

create function public.kits_claim_delivery(p_id uuid) returns jsonb
language plpgsql security invoker set search_path = public as $$
declare p kit_purchases;
begin
  select * into p from kit_purchases where id = p_id for update;
  if p.id is null or p.status <> 'paid' or p.email_sent_at is not null then return null; end if;
  if p.delivery_lease_until > now() then raise exception 'Delivery busy; retry'; end if;
  -- Resend idempotency lasts 24 hours. An uncertain older send needs operator
  -- reconciliation, not another send outside that window.
  if p.delivery_started_at < now() - interval '23 hours' then raise exception 'Delivery reconciliation required'; end if;
  update kit_purchases set delivery_lease_until = now() + interval '120 seconds', delivery_attempt = gen_random_uuid(),
    delivery_started_at = coalesce(delivery_started_at, now()) where id = p_id returning * into p;
  return to_jsonb(p);
end $$;
create function public.kits_prepare_delivery(p_id uuid, p_payload jsonb, p_attempt uuid) returns jsonb
language plpgsql security invoker set search_path = public as $$
declare p kit_purchases;
begin
  update kit_purchases set delivery_payload = coalesce(delivery_payload, p_payload)
    where id = p_id and delivery_attempt = p_attempt and delivery_lease_until > now() returning * into p;
  return to_jsonb(p);
end $$;
create function public.kits_finish_delivery(p_id uuid, p_success boolean, p_attempt uuid) returns void
language sql security invoker set search_path = public as $$
  update kit_purchases set delivery_lease_until = null,
    email_sent_at = case when p_success then coalesce(email_sent_at, now()) else email_sent_at end where id = p_id and delivery_attempt = p_attempt;
$$;
revoke all on function public.kits_record_event(text,text,jsonb,text), public.kits_claim_delivery(uuid), public.kits_prepare_delivery(uuid,jsonb,uuid), public.kits_finish_delivery(uuid,boolean,uuid) from public, anon, authenticated;
grant execute on function public.kits_record_event(text,text,jsonb,text), public.kits_claim_delivery(uuid), public.kits_prepare_delivery(uuid,jsonb,uuid), public.kits_finish_delivery(uuid,boolean,uuid) to service_role;
