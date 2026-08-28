-- The two-email cap, and the personal read that feeds it.
--
-- A visitor who converts through either journey receives exactly two emails:
-- the results email they asked for, and one follow-up fourteen days later.
-- Nothing else, ever. The queue below is what makes the second one possible
-- without a drip sequence: one row per lead, deleted once it has been used.
--
-- Both tables are private by construction. RLS is on with no policies, so only
-- the service role reaches them, and no anon policy is added to anything that
-- already exists.

-- ---------------------------------------------------------------------------
-- The follow-up queue
-- ---------------------------------------------------------------------------

create table if not exists public.follow_up_queue (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null check (source in ('brief', 'personal-read')),
  send_after timestamptz not null,
  sent_at timestamptz,
  attempts smallint not null default 0,
  created_at timestamptz not null default now(),
  -- One follow-up per address per source. A returning visitor never stacks a
  -- second one, which is what keeps the cap true rather than aspirational.
  unique (email, source)
);

alter table public.follow_up_queue enable row level security;
revoke all on public.follow_up_queue from public, anon, authenticated;

create index if not exists follow_up_queue_due_idx
  on public.follow_up_queue (send_after)
  where sent_at is null;

comment on table public.follow_up_queue is
  'Day-14 follow-up, one per lead. Rows are purged after send: see mindmake_purge_follow_ups.';

-- ---------------------------------------------------------------------------
-- The personal read
-- ---------------------------------------------------------------------------

create table if not exists public.mindmake_personal_reads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  q1 text not null check (q1 in ('writing', 'chasing', 'admin', 'deciding')),
  q2 text not null check (q2 in ('network', 'pipeline', 'content', 'decisions')),
  -- Only what the email needed. The LinkedIn URL is not kept beyond fulfilment
  -- unless the enrichment result already embeds it.
  enrichment jsonb,
  delivered_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.mindmake_personal_reads enable row level security;
revoke all on public.mindmake_personal_reads from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Abuse limits for the personal read
--
-- The same shape as the brief endpoint's limiter: the edge function sends
-- one-way HMAC identifiers, never a raw address or IP, and the counting
-- happens here.
-- ---------------------------------------------------------------------------

create table if not exists private.mindmake_personal_read_rate_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  ip_identifier_hash text not null check (ip_identifier_hash ~ '^[0-9a-f]{64}$'),
  email_identifier_hash text not null check (email_identifier_hash ~ '^[0-9a-f]{64}$')
);

alter table private.mindmake_personal_read_rate_events enable row level security;
revoke all on private.mindmake_personal_read_rate_events from public, anon, authenticated, service_role;

create index if not exists mindmake_personal_read_rate_ip_idx
  on private.mindmake_personal_read_rate_events (ip_identifier_hash, created_at desc);
create index if not exists mindmake_personal_read_rate_email_idx
  on private.mindmake_personal_read_rate_events (email_identifier_hash, created_at desc);

create or replace function private.mindmake_consume_personal_read_rate(
  p_ip_hash text,
  p_email_hash text,
  p_now timestamptz default now()
) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email_recent integer;
  v_ip_recent integer;
  v_ip_daily integer;
begin
  -- Ordered advisory locks, as in the brief limiter, so two concurrent
  -- requests for the same pair cannot deadlock against each other.
  perform pg_advisory_xact_lock(hashtext('mindmake_personal_read_ip'), hashtext(p_ip_hash));
  perform pg_advisory_xact_lock(hashtext('mindmake_personal_read_email'), hashtext(p_email_hash));

  select count(*) into v_email_recent
  from private.mindmake_personal_read_rate_events
  where email_identifier_hash = p_email_hash and created_at > p_now - interval '1 hour';
  if v_email_recent >= 3 then return false; end if;

  select count(*) into v_ip_recent
  from private.mindmake_personal_read_rate_events
  where ip_identifier_hash = p_ip_hash and created_at > p_now - interval '10 minutes';
  if v_ip_recent >= 5 then return false; end if;

  select count(*) into v_ip_daily
  from private.mindmake_personal_read_rate_events
  where ip_identifier_hash = p_ip_hash and created_at > p_now - interval '1 day';
  if v_ip_daily >= 20 then return false; end if;

  insert into private.mindmake_personal_read_rate_events (ip_identifier_hash, email_identifier_hash)
  values (p_ip_hash, p_email_hash);
  return true;
end;
$$;

revoke all on function private.mindmake_consume_personal_read_rate(text, text, timestamptz)
  from public, anon, authenticated;
grant execute on function private.mindmake_consume_personal_read_rate(text, text, timestamptz)
  to service_role;

-- ---------------------------------------------------------------------------
-- Retention
--
-- A used follow-up row has done its whole job, so it goes. The public privacy
-- notice states this schedule.
-- ---------------------------------------------------------------------------

create or replace function private.mindmake_purge_follow_ups()
returns table (sent_deleted integer, stale_deleted integer, rate_events_deleted integer, reads_deleted integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_sent integer;
  v_stale integer;
  v_rate integer;
  v_reads integer;
begin
  delete from public.follow_up_queue
  where sent_at is not null and sent_at < now() - interval '7 days';
  get diagnostics v_sent = row_count;

  -- A row that never sent after repeated attempts is dropped rather than
  -- retried forever, so a stuck address cannot become a second sequence.
  delete from public.follow_up_queue
  where sent_at is null and created_at < now() - interval '60 days';
  get diagnostics v_stale = row_count;

  delete from private.mindmake_personal_read_rate_events
  where created_at < now() - interval '48 hours';
  get diagnostics v_rate = row_count;

  delete from public.mindmake_personal_reads
  where created_at < now() - interval '12 months';
  get diagnostics v_reads = row_count;

  return query select v_sent, v_stale, v_rate, v_reads;
end;
$$;

revoke all on function private.mindmake_purge_follow_ups() from public, anon, authenticated;
grant execute on function private.mindmake_purge_follow_ups() to service_role;
