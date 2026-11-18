-- Every buyer is a lead for one personal check-in (Krish, 18 November 2026).
-- No marketing: nothing here sends anything. The operator checks in by hand.
alter table public.kit_purchases
  add column check_in_due date not null default ((now() at time zone 'utc')::date + 7),
  add column check_in_status text not null default 'due'
    check (check_in_status in ('due', 'checked in', 'happy', 'free session offered', 'free session held', 'not needed')),
  add column check_in_note text check (check_in_note is null or length(check_in_note) <= 2000),
  add column check_in_at timestamptz,
  add column promise_version text not null default 'concierge-2026-11-18';

-- The check-ins to do, oldest first. Refunded buyers stay in: they are the ones to offer a free session.
create view public.kit_concierge_queue with (security_invoker = true) as
  select id, email, kit_slug, status as purchase_status, created_at, refunded_at, check_in_due, check_in_status, check_in_note
  from public.kit_purchases
  where check_in_status in ('due', 'free session offered')
  order by check_in_due, created_at;
revoke all on public.kit_concierge_queue from anon, authenticated;
grant select on public.kit_concierge_queue to service_role;
