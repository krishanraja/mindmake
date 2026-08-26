-- Private V2 request, verification and delivery state for Mindmake briefs.
-- The browser has no table access. The Edge Function uses one service-role RPC
-- whose privileged implementation lives outside the exposed public schema.

create schema if not exists private;

create table if not exists private.mindmake_brief_requests (
  id                              uuid primary key default gen_random_uuid(),
  created_at                      timestamptz not null default now(),
  updated_at                      timestamptz not null default now(),

  version                         smallint not null default 2 check (version = 2),
  request_id                      text not null unique
    check (
      request_id ~* '^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|mindmake-[a-z0-9](?:[a-z0-9-]{5,118}[a-z0-9])?)$'
    ),
  request_payload_sha256          text not null
    check (request_payload_sha256 ~ '^[0-9a-f]{64}$'),

  email                           text not null
    check (char_length(email) between 3 and 254 and email = lower(email)),
  company_domain                  text not null
    check (char_length(company_domain) between 3 and 253 and company_domain = lower(company_domain)),
  pressure_id                     text not null
    check (pressure_id in (
      'customers-can-do-more-without-us',
      'price-no-longer-matches-value',
      'team-building-faster-than-it-can-choose',
      'real-problem-still-unclear',
      'important-context-lives-in-my-head',
      'avoid-work-that-needs-my-judgement',
      'searching-for-things-i-should-know',
      'need-room-for-important-decisions',
      'product-moving-faster-than-message',
      'price-still-reflects-old-work',
      'team-has-too-many-possible-moves'
    )),
  returned_time_id                text not null
    check (returned_time_id in (
      'grow-this-business',
      'help-more-companies',
      'build-my-ai-skill',
      'make-room-for-important-decisions'
    )),
  entry_route                     text not null check (entry_route in ('home', 'brain', 'gtm')),
  publication_requested           boolean not null,
  consent_wording_version         text not null
    check (consent_wording_version = 'mindmake-publication-consent-v1'),
  consent_recorded_at             timestamptz not null default now(),

  -- Only server research is stored. Narrative is rebuilt from allowlisted IDs
  -- by core.ts after successful confirmation.
  company_research                jsonb
    check (
      company_research is null
      or (
        jsonb_typeof(company_research) = 'object'
        and octet_length(company_research::text) <= 65536
      )
    ),
  assembly_state                  text not null default 'pending'
    check (assembly_state in ('pending', 'sending', 'ready', 'failed')),
  assembly_attempts               smallint not null default 0
    check (assembly_attempts between 0 and 3),
  assembly_attempted_at           timestamptz,
  assembly_claim_token            uuid,

  -- Raw IP addresses and user agents are never stored.
  rate_limit_ip_hash              text not null check (rate_limit_ip_hash ~ '^[0-9a-f]{64}$'),
  rate_limit_email_hash           text not null check (rate_limit_email_hash ~ '^[0-9a-f]{64}$'),
  user_agent_hash                 text check (user_agent_hash is null or user_agent_hash ~ '^[0-9a-f]{64}$'),

  -- The six-digit code is never stored. The nonce is not secret and lets the
  -- Edge Function reproduce the same code for an idempotent request retry.
  verification_nonce              uuid not null,
  verification_code_hash          text not null check (verification_code_hash ~ '^[0-9a-f]{64}$'),
  verification_expires_at         timestamptz not null,
  verification_failed_attempts    smallint not null default 0
    check (verification_failed_attempts between 0 and 5),
  verified_at                     timestamptz,

  verification_delivery          text not null default 'pending'
    check (verification_delivery in ('pending', 'sending', 'queued', 'failed')),
  verification_delivery_id       text,
  verification_attempts          smallint not null default 0
    check (verification_attempts between 0 and 3),
  verification_attempted_at      timestamptz,
  verification_claim_token       uuid,

  visitor_delivery               text not null default 'pending'
    check (visitor_delivery in ('pending', 'sending', 'queued', 'failed')),
  visitor_delivery_id            text,
  visitor_attempts               smallint not null default 0
    check (visitor_attempts between 0 and 3),
  visitor_attempted_at           timestamptz,
  visitor_claim_token            uuid,

  operator_delivery              text not null default 'pending'
    check (operator_delivery in ('pending', 'sending', 'queued', 'failed')),
  operator_delivery_id           text,
  operator_attempts              smallint not null default 0
    check (operator_attempts between 0 and 3),
  operator_attempted_at          timestamptz,
  operator_claim_token           uuid,

  check (
    (entry_route = 'home' and pressure_id in (
      'customers-can-do-more-without-us',
      'price-no-longer-matches-value',
      'team-building-faster-than-it-can-choose',
      'real-problem-still-unclear'
    ))
    or (entry_route = 'brain' and pressure_id in (
      'important-context-lives-in-my-head',
      'avoid-work-that-needs-my-judgement',
      'searching-for-things-i-should-know',
      'need-room-for-important-decisions'
    ))
    or (entry_route = 'gtm' and pressure_id in (
      'customers-can-do-more-without-us',
      'product-moving-faster-than-message',
      'price-still-reflects-old-work',
      'team-has-too-many-possible-moves'
    ))
  )
);

create table if not exists private.mindmake_brief_rate_events (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  ip_identifier_hash    text not null check (ip_identifier_hash ~ '^[0-9a-f]{64}$'),
  email_identifier_hash text not null check (email_identifier_hash ~ '^[0-9a-f]{64}$')
);

create index if not exists mindmake_brief_requests_created_idx
  on private.mindmake_brief_requests (created_at desc);
create index if not exists mindmake_brief_requests_unverified_expiry_idx
  on private.mindmake_brief_requests (verification_expires_at)
  where verified_at is null;
create index if not exists mindmake_brief_requests_publication_interest_idx
  on private.mindmake_brief_requests (created_at desc)
  where publication_requested;
create index if not exists mindmake_brief_rate_events_ip_idx
  on private.mindmake_brief_rate_events (ip_identifier_hash, created_at desc);
create index if not exists mindmake_brief_rate_events_email_idx
  on private.mindmake_brief_rate_events (email_identifier_hash, created_at desc);

comment on table private.mindmake_brief_requests is
  'Private V2 Mindmake brief requests. Email verification gates two independent server-rendered deliveries.';
comment on column private.mindmake_brief_requests.publication_requested is
  'Unverified publication interest only. This is never a subscription instruction and must never trigger an automatic import.';
comment on column private.mindmake_brief_requests.verification_code_hash is
  'HMAC of the request, normalised email and six-digit code. The code itself is never stored.';

alter table private.mindmake_brief_requests enable row level security;
alter table private.mindmake_brief_rate_events enable row level security;

revoke all on schema private from public, anon, authenticated;
revoke all on table private.mindmake_brief_requests
  from public, anon, authenticated, service_role;
revoke all on table private.mindmake_brief_rate_events
  from public, anon, authenticated, service_role;

create or replace function private.mindmake_consume_brief_rate(
  p_ip_hash text,
  p_email_hash text,
  p_now timestamptz
)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_ip_lock bigint;
  v_email_lock bigint;
  v_count bigint;
begin
  if p_ip_hash !~ '^[0-9a-f]{64}$' or p_email_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid rate identifier' using errcode = '22023';
  end if;

  v_ip_lock := pg_catalog.hashtextextended('mindmake:ip:' || p_ip_hash, 0);
  v_email_lock := pg_catalog.hashtextextended('mindmake:email:' || p_email_hash, 0);
  if v_ip_lock <= v_email_lock then
    perform pg_catalog.pg_advisory_xact_lock(v_ip_lock);
    if v_email_lock <> v_ip_lock then
      perform pg_catalog.pg_advisory_xact_lock(v_email_lock);
    end if;
  else
    perform pg_catalog.pg_advisory_xact_lock(v_email_lock);
    perform pg_catalog.pg_advisory_xact_lock(v_ip_lock);
  end if;

  select pg_catalog.count(*) into v_count
  from private.mindmake_brief_rate_events as event
  where event.email_identifier_hash = p_email_hash
    and event.created_at >= p_now - interval '1 hour';
  if v_count >= 4 then return false; end if;

  select pg_catalog.count(*) into v_count
  from private.mindmake_brief_rate_events as event
  where event.ip_identifier_hash = p_ip_hash
    and event.created_at >= p_now - interval '10 minutes';
  if v_count >= 6 then return false; end if;

  select pg_catalog.count(*) into v_count
  from private.mindmake_brief_rate_events as event
  where event.ip_identifier_hash = p_ip_hash
    and event.created_at >= p_now - interval '1 day';
  if v_count >= 30 then return false; end if;

  insert into private.mindmake_brief_rate_events (
    id,
    created_at,
    ip_identifier_hash,
    email_identifier_hash
  ) values (
    pg_catalog.gen_random_uuid(),
    p_now,
    p_ip_hash,
    p_email_hash
  );
  return true;
end;
$$;

create or replace function private.mindmake_brief_rpc(
  p_operation text,
  p_payload jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_now timestamptz := pg_catalog.clock_timestamp();
  v_row private.mindmake_brief_requests%rowtype;
  v_token uuid;
  v_kind text;
  v_state text;
  v_attempts integer;
  v_attempted_at timestamptz;
  v_current_token uuid;
  v_ok boolean;
  v_stale_seconds integer;
  v_existing_outcome text := 'existing';
begin
  if p_payload is null or pg_catalog.jsonb_typeof(p_payload) <> 'object' then
    raise exception 'RPC payload must be an object' using errcode = '22023';
  end if;

  if p_operation = 'begin' then
    if (p_payload ->> 'request_payload_sha256') !~ '^[0-9a-f]{64}$'
      or (p_payload ->> 'verification_code_hash') !~ '^[0-9a-f]{64}$'
      or (p_payload ->> 'rate_limit_ip_hash') !~ '^[0-9a-f]{64}$'
      or (p_payload ->> 'rate_limit_email_hash') !~ '^[0-9a-f]{64}$'
      or (
        p_payload ->> 'user_agent_hash' is not null
        and (p_payload ->> 'user_agent_hash') !~ '^[0-9a-f]{64}$'
      )
    then
      raise exception 'Invalid hashed identifier' using errcode = '22023';
    end if;

    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('mindmake:request:' || (p_payload ->> 'request_id'), 0)
    );
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.request_id = p_payload ->> 'request_id'
    for update;

    if found then
      if v_row.request_payload_sha256 <> p_payload ->> 'request_payload_sha256' then
        return pg_catalog.jsonb_build_object('outcome', 'conflict');
      end if;
      if v_row.verified_at is not null then
        return pg_catalog.jsonb_build_object(
          'outcome', 'already_confirmed',
          'row', pg_catalog.to_jsonb(v_row)
        );
      end if;

      if v_row.verification_expires_at <= v_now then
        if not private.mindmake_consume_brief_rate(
          p_payload ->> 'rate_limit_ip_hash',
          p_payload ->> 'rate_limit_email_hash',
          v_now
        ) then
          return pg_catalog.jsonb_build_object('outcome', 'rate_limited');
        end if;

        update private.mindmake_brief_requests
        set verification_nonce = (p_payload ->> 'verification_nonce')::uuid,
            verification_code_hash = p_payload ->> 'verification_code_hash',
            verification_expires_at = v_now + interval '10 minutes',
            verification_failed_attempts = 0,
            verification_delivery = 'pending',
            verification_delivery_id = null,
            verification_attempts = 0,
            verification_attempted_at = null,
            verification_claim_token = null,
            rate_limit_ip_hash = p_payload ->> 'rate_limit_ip_hash',
            rate_limit_email_hash = p_payload ->> 'rate_limit_email_hash',
            user_agent_hash = p_payload ->> 'user_agent_hash',
            updated_at = v_now
        where id = v_row.id
        returning * into v_row;
        v_existing_outcome := 'renewed';
      end if;

      if v_row.assembly_state = 'ready' and v_row.company_research is not null then
        return pg_catalog.jsonb_build_object(
          'outcome', v_existing_outcome,
          'row', pg_catalog.to_jsonb(v_row)
        );
      end if;

      v_stale_seconds := greatest(
        30,
        least(600, coalesce((p_payload ->> 'stale_seconds')::integer, 120))
      );
      if v_row.assembly_state = 'sending'
        and v_row.assembly_attempted_at > v_now - pg_catalog.make_interval(secs => v_stale_seconds)
      then
        return pg_catalog.jsonb_build_object(
          'outcome', 'processing',
          'row', pg_catalog.to_jsonb(v_row)
        );
      end if;
      if v_row.assembly_attempts >= 3 then
        return pg_catalog.jsonb_build_object(
          'outcome', 'assembly_failed',
          'row', pg_catalog.to_jsonb(v_row)
        );
      end if;

      v_token := pg_catalog.gen_random_uuid();
      update private.mindmake_brief_requests
      set assembly_state = 'sending',
          assembly_attempts = assembly_attempts + 1,
          assembly_attempted_at = v_now,
          assembly_claim_token = v_token,
          updated_at = v_now
      where id = v_row.id
      returning * into v_row;
      return pg_catalog.jsonb_build_object(
        'outcome', 'assemble',
        'claim_token', v_token,
        'row', pg_catalog.to_jsonb(v_row)
      );
    end if;

    if not private.mindmake_consume_brief_rate(
      p_payload ->> 'rate_limit_ip_hash',
      p_payload ->> 'rate_limit_email_hash',
      v_now
    ) then
      return pg_catalog.jsonb_build_object('outcome', 'rate_limited');
    end if;

    v_token := pg_catalog.gen_random_uuid();
    insert into private.mindmake_brief_requests (
      version,
      request_id,
      request_payload_sha256,
      email,
      company_domain,
      pressure_id,
      returned_time_id,
      entry_route,
      publication_requested,
      consent_wording_version,
      consent_recorded_at,
      assembly_state,
      assembly_attempts,
      assembly_attempted_at,
      assembly_claim_token,
      rate_limit_ip_hash,
      rate_limit_email_hash,
      user_agent_hash,
      verification_nonce,
      verification_code_hash,
      verification_expires_at
    ) values (
      2,
      p_payload ->> 'request_id',
      p_payload ->> 'request_payload_sha256',
      p_payload ->> 'email',
      p_payload ->> 'company_domain',
      p_payload ->> 'pressure_id',
      p_payload ->> 'returned_time_id',
      p_payload ->> 'entry_route',
      (p_payload ->> 'publication_requested')::boolean,
      p_payload ->> 'consent_wording_version',
      v_now,
      'sending',
      1,
      v_now,
      v_token,
      p_payload ->> 'rate_limit_ip_hash',
      p_payload ->> 'rate_limit_email_hash',
      p_payload ->> 'user_agent_hash',
      (p_payload ->> 'verification_nonce')::uuid,
      p_payload ->> 'verification_code_hash',
      v_now + interval '10 minutes'
    )
    returning * into v_row;
    return pg_catalog.jsonb_build_object(
      'outcome', 'assemble',
      'claim_token', v_token,
      'row', pg_catalog.to_jsonb(v_row)
    );

  elsif p_operation = 'finish_assembly' then
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.id = (p_payload ->> 'row_id')::uuid
    for update;
    if not found then return pg_catalog.jsonb_build_object('outcome', 'not_found'); end if;

    v_token := (p_payload ->> 'claim_token')::uuid;
    if v_row.assembly_state <> 'sending' or v_row.assembly_claim_token is distinct from v_token then
      return pg_catalog.jsonb_build_object(
        'outcome', 'stale_claim',
        'row', pg_catalog.to_jsonb(v_row)
      );
    end if;
    v_ok := (p_payload ->> 'ok')::boolean;
    if v_ok then
      if pg_catalog.jsonb_typeof(p_payload -> 'company_research') <> 'object' then
        raise exception 'Company research must be an object' using errcode = '22023';
      end if;
      update private.mindmake_brief_requests
      set company_research = p_payload -> 'company_research',
          assembly_state = 'ready',
          assembly_claim_token = null,
          updated_at = v_now
      where id = v_row.id
      returning * into v_row;
    else
      update private.mindmake_brief_requests
      set assembly_state = 'failed',
          assembly_claim_token = null,
          updated_at = v_now
      where id = v_row.id
      returning * into v_row;
    end if;
    return pg_catalog.jsonb_build_object('outcome', 'finished', 'row', pg_catalog.to_jsonb(v_row));

  elsif p_operation = 'confirm' then
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtextextended('mindmake:request:' || (p_payload ->> 'request_id'), 0)
    );
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.request_id = p_payload ->> 'request_id'
      and request.email = p_payload ->> 'email'
    for update;
    if not found then return pg_catalog.jsonb_build_object('outcome', 'invalid'); end if;

    if v_row.verified_at is null and v_row.verification_failed_attempts >= 5 then
      return pg_catalog.jsonb_build_object('outcome', 'locked');
    end if;
    if v_row.verification_code_hash <> p_payload ->> 'verification_code_hash' then
      if v_row.verified_at is null then
        update private.mindmake_brief_requests
        set verification_failed_attempts = least(5, verification_failed_attempts + 1),
            updated_at = v_now
        where id = v_row.id
        returning * into v_row;
      end if;
      return pg_catalog.jsonb_build_object('outcome', 'invalid');
    end if;
    if v_row.verified_at is not null then
      return pg_catalog.jsonb_build_object(
        'outcome', 'already_confirmed',
        'row', pg_catalog.to_jsonb(v_row)
      );
    end if;
    if v_row.verification_expires_at <= v_now then
      return pg_catalog.jsonb_build_object('outcome', 'expired');
    end if;
    if v_row.assembly_state <> 'ready' or v_row.company_research is null then
      return pg_catalog.jsonb_build_object('outcome', 'not_ready');
    end if;

    update private.mindmake_brief_requests
    set verified_at = v_now,
        updated_at = v_now
    where id = v_row.id
    returning * into v_row;
    return pg_catalog.jsonb_build_object('outcome', 'verified', 'row', pg_catalog.to_jsonb(v_row));

  elsif p_operation = 'claim_delivery' then
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.id = (p_payload ->> 'row_id')::uuid
    for update;
    if not found then return pg_catalog.jsonb_build_object('outcome', 'not_found'); end if;

    v_kind := p_payload ->> 'delivery_kind';
    v_stale_seconds := greatest(
      30,
      least(600, coalesce((p_payload ->> 'stale_seconds')::integer, 120))
    );
    if v_kind = 'verification' then
      if v_row.verified_at is not null then
        return pg_catalog.jsonb_build_object('outcome', 'not_claimed', 'row', pg_catalog.to_jsonb(v_row));
      end if;
      if v_row.verification_expires_at <= v_now then
        return pg_catalog.jsonb_build_object('outcome', 'expired', 'row', pg_catalog.to_jsonb(v_row));
      end if;
      v_state := v_row.verification_delivery;
      v_attempts := v_row.verification_attempts;
      v_attempted_at := v_row.verification_attempted_at;
      v_current_token := v_row.verification_claim_token;
    elsif v_kind = 'visitor' then
      if v_row.verified_at is null or v_row.assembly_state <> 'ready' then
        return pg_catalog.jsonb_build_object('outcome', 'not_verified', 'row', pg_catalog.to_jsonb(v_row));
      end if;
      v_state := v_row.visitor_delivery;
      v_attempts := v_row.visitor_attempts;
      v_attempted_at := v_row.visitor_attempted_at;
      v_current_token := v_row.visitor_claim_token;
    elsif v_kind = 'operator' then
      if v_row.verified_at is null or v_row.assembly_state <> 'ready' then
        return pg_catalog.jsonb_build_object('outcome', 'not_verified', 'row', pg_catalog.to_jsonb(v_row));
      end if;
      v_state := v_row.operator_delivery;
      v_attempts := v_row.operator_attempts;
      v_attempted_at := v_row.operator_attempted_at;
      v_current_token := v_row.operator_claim_token;
    else
      raise exception 'Unsupported delivery kind' using errcode = '22023';
    end if;

    if v_state = 'queued' then
      return pg_catalog.jsonb_build_object('outcome', 'not_claimed', 'row', pg_catalog.to_jsonb(v_row));
    end if;
    if v_attempts >= 3 then
      return pg_catalog.jsonb_build_object('outcome', 'exhausted', 'row', pg_catalog.to_jsonb(v_row));
    end if;
    if v_state = 'sending'
      and v_attempted_at > v_now - pg_catalog.make_interval(secs => v_stale_seconds)
    then
      return pg_catalog.jsonb_build_object('outcome', 'not_claimed', 'row', pg_catalog.to_jsonb(v_row));
    end if;

    v_token := pg_catalog.gen_random_uuid();
    if v_kind = 'verification' then
      update private.mindmake_brief_requests
      set verification_delivery = 'sending',
          verification_attempts = verification_attempts + 1,
          verification_attempted_at = v_now,
          verification_claim_token = v_token,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    elsif v_kind = 'visitor' then
      update private.mindmake_brief_requests
      set visitor_delivery = 'sending',
          visitor_attempts = visitor_attempts + 1,
          visitor_attempted_at = v_now,
          visitor_claim_token = v_token,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    else
      update private.mindmake_brief_requests
      set operator_delivery = 'sending',
          operator_attempts = operator_attempts + 1,
          operator_attempted_at = v_now,
          operator_claim_token = v_token,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    end if;
    return pg_catalog.jsonb_build_object(
      'outcome', 'claimed',
      'claim_token', v_token,
      'row', pg_catalog.to_jsonb(v_row)
    );

  elsif p_operation = 'finish_delivery' then
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.id = (p_payload ->> 'row_id')::uuid
    for update;
    if not found then return pg_catalog.jsonb_build_object('outcome', 'not_found'); end if;

    v_kind := p_payload ->> 'delivery_kind';
    v_token := (p_payload ->> 'claim_token')::uuid;
    v_ok := (p_payload ->> 'ok')::boolean;
    if v_kind = 'verification' then
      v_state := v_row.verification_delivery;
      v_current_token := v_row.verification_claim_token;
    elsif v_kind = 'visitor' then
      v_state := v_row.visitor_delivery;
      v_current_token := v_row.visitor_claim_token;
    elsif v_kind = 'operator' then
      v_state := v_row.operator_delivery;
      v_current_token := v_row.operator_claim_token;
    else
      raise exception 'Unsupported delivery kind' using errcode = '22023';
    end if;

    if v_state <> 'sending' or v_current_token is distinct from v_token then
      return pg_catalog.jsonb_build_object(
        'outcome', 'stale_claim',
        'row', pg_catalog.to_jsonb(v_row)
      );
    end if;

    if v_kind = 'verification' then
      update private.mindmake_brief_requests
      set verification_delivery = case when v_ok then 'queued' else 'failed' end,
          verification_delivery_id = case when v_ok then p_payload ->> 'delivery_id' else null end,
          verification_claim_token = null,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    elsif v_kind = 'visitor' then
      update private.mindmake_brief_requests
      set visitor_delivery = case when v_ok then 'queued' else 'failed' end,
          visitor_delivery_id = case when v_ok then p_payload ->> 'delivery_id' else null end,
          visitor_claim_token = null,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    else
      update private.mindmake_brief_requests
      set operator_delivery = case when v_ok then 'queued' else 'failed' end,
          operator_delivery_id = case when v_ok then p_payload ->> 'delivery_id' else null end,
          operator_claim_token = null,
          updated_at = v_now
      where id = v_row.id returning * into v_row;
    end if;
    return pg_catalog.jsonb_build_object('outcome', 'finished', 'row', pg_catalog.to_jsonb(v_row));

  elsif p_operation = 'get' then
    select * into v_row
    from private.mindmake_brief_requests as request
    where request.id = (p_payload ->> 'row_id')::uuid;
    if not found then return pg_catalog.jsonb_build_object('outcome', 'not_found'); end if;
    return pg_catalog.jsonb_build_object('outcome', 'found', 'row', pg_catalog.to_jsonb(v_row));
  end if;

  raise exception 'Unsupported Mindmake brief RPC operation' using errcode = '22023';
end;
$$;

-- PostgREST can call only the public invoker wrapper. The privileged function
-- remains in the private schema and is executable only by service_role.
create or replace function public.mindmake_brief_rpc(
  p_operation text,
  p_payload jsonb
)
returns jsonb
language sql
security invoker
set search_path = ''
as $$
  select private.mindmake_brief_rpc(p_operation, p_payload);
$$;

revoke all on function private.mindmake_consume_brief_rate(text, text, timestamptz)
  from public, anon, authenticated, service_role;
revoke all on function private.mindmake_brief_rpc(text, jsonb)
  from public, anon, authenticated, service_role;
revoke all on function public.mindmake_brief_rpc(text, jsonb)
  from public, anon, authenticated, service_role;

grant usage on schema private to service_role;
grant execute on function private.mindmake_brief_rpc(text, jsonb) to service_role;
grant execute on function public.mindmake_brief_rpc(text, jsonb) to service_role;
