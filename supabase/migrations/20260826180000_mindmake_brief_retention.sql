-- Scheduled private retention for Mindmake brief data.
-- Approved schedule (Gate B1, 26 August 2026):
--   unverified requests delete 7 days after creation;
--   rate-limit event hashes delete after 48 hours;
--   verified request, consent and delivery records delete 12 months after
--   their last update, unless deleted earlier through the verified manual
--   deletion process handled at the published contact address.
-- The purge is private. Browser roles cannot execute it and no public
-- wrapper exists. Each delete is bounded by an indexed cutoff, so reruns
-- and retries are idempotent.

create or replace function private.mindmake_purge_brief_data()
returns table (
  unverified_deleted integer,
  rate_events_deleted integer,
  verified_deleted integer
)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_unverified integer;
  v_rate integer;
  v_verified integer;
begin
  delete from private.mindmake_brief_requests
    where verified_at is null
      and created_at < now() - interval '7 days';
  get diagnostics v_unverified = row_count;

  delete from private.mindmake_brief_rate_events
    where created_at < now() - interval '48 hours';
  get diagnostics v_rate = row_count;

  delete from private.mindmake_brief_requests
    where verified_at is not null
      and updated_at < now() - interval '12 months';
  get diagnostics v_verified = row_count;

  return query select v_unverified, v_rate, v_verified;
end;
$$;

revoke all on function private.mindmake_purge_brief_data()
  from public, anon, authenticated;

-- cron.schedule upserts by job name, so this migration cannot create a
-- duplicate schedule when replayed.
select cron.schedule(
  'mindmake-brief-retention-daily',
  '17 2 * * *',
  $$select private.mindmake_purge_brief_data();$$
);
