-- Read-only fingerprints of brief takers for Control Center (records.brief_takers, protocol 1.41.0).
-- Control Center reads this through the service role so growth-mindmake never cold emails a brief taker.
-- The existing private table stays private. This read returns only fingerprints.
-- Every extant request counts, including unverified or failed delivery requests:
-- uncertainty must not put a brief requester into cold outreach.
begin;

create or replace function public.mindmake_brief_takers()
returns table (email_sha256 text)
language sql
stable
security definer
set search_path = ''
as $$
  select distinct pg_catalog.encode(
    pg_catalog.sha256(pg_catalog.convert_to('email:' || pg_catalog.lower(pg_catalog.btrim(email)), 'UTF8')),
    'hex'
  ) as email_sha256
  from private.mindmake_brief_requests
  order by email_sha256;
$$;

revoke all on function public.mindmake_brief_takers() from public, anon, authenticated;
grant execute on function public.mindmake_brief_takers() to service_role;

commit;
