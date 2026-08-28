-- The two daily jobs the rebuild adds.
--
-- Both follow the pattern already used on this project: pg_cron calls the
-- function over HTTP with a shared secret read from Vault, and the function
-- checks that header before doing anything. The secret is inserted once, by
-- hand, and never lives in a migration.
--
-- cron.schedule upserts by job name, so replaying this migration cannot create
-- a duplicate schedule.

create extension if not exists pg_net;
create extension if not exists pg_cron;

-- 11:00 UTC: record what published models cost today. This cannot be
-- back-filled, so a missed day is a permanent gap in the price history.
select cron.schedule(
  'mindmake-aa-price-snapshot-daily',
  '0 11 * * *',
  $$
  select net.http_post(
    url := 'https://bkyuxvschuwngtcdhsyg.supabase.co/functions/v1/aa-price-snapshot',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-mindmake-cron-secret', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'mindmake_cron_secret'
        order by created_at desc
        limit 1
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
  $$
);

-- 09:20 UTC: send any follow-up whose fourteen days are up, then purge what
-- has been used. Deliberately not on the hour, so it does not compete with the
-- rest of the project's scheduled work.
select cron.schedule(
  'mindmake-follow-up-daily',
  '20 9 * * *',
  $$
  select net.http_post(
    url := 'https://bkyuxvschuwngtcdhsyg.supabase.co/functions/v1/send-follow-ups',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-mindmake-cron-secret', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'mindmake_cron_secret'
        order by created_at desc
        limit 1
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 300000
  );
  $$
);
