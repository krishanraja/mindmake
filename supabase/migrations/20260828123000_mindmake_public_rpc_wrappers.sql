-- Public wrappers for the two private routines the edge functions call.
--
-- PostgREST only exposes the public and graphql_public schemas, so a function
-- in `private` cannot be reached over the REST interface. The brief pipeline
-- already solves this with a thin public wrapper around a security-definer
-- routine, and these follow that pattern exactly: the wrapper is invoker
-- rights, does nothing itself, and is executable only by the service role.

create or replace function public.mindmake_consume_personal_read_rate(
  p_ip_hash text,
  p_email_hash text
) returns boolean
language sql
security invoker
set search_path = ''
as $$
  select private.mindmake_consume_personal_read_rate(p_ip_hash, p_email_hash, now());
$$;

revoke all on function public.mindmake_consume_personal_read_rate(text, text)
  from public, anon, authenticated;
grant execute on function public.mindmake_consume_personal_read_rate(text, text) to service_role;

create or replace function public.mindmake_purge_follow_ups()
returns table (sent_deleted integer, stale_deleted integer, rate_events_deleted integer, reads_deleted integer)
language sql
security invoker
set search_path = ''
as $$
  select * from private.mindmake_purge_follow_ups();
$$;

revoke all on function public.mindmake_purge_follow_ups() from public, anon, authenticated;
grant execute on function public.mindmake_purge_follow_ups() to service_role;
