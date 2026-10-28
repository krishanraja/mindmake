-- Which growth placement a brief request came from (Krish, 2026-10-28:
-- "Yes do number two"; /privacy section 2 says the brief stores it).
--
-- Two nullable columns beside entry_route, filled only from the placement tag
-- the browser holds in page memory (src/lib/visitTag.ts) and that
-- submit-mindmake-brief has already held to the engine's shape. The CHECK
-- constraints are the same rule a third time: the source is growth-<path> in
-- lower-case words joined by hyphens, at most 40 characters, the medium is
-- exactly referral, and the two are both present or both absent. Existing rows
-- and requests with no placement record nulls.
--
-- The RPC is redefined only to insert the two values; every other line is
-- byte-for-byte the definition of 20260826123007, which was read back live
-- and matched before this change. Retention is unchanged: the columns live and
-- are deleted with their row.

alter table private.mindmake_brief_requests
  add column if not exists utm_source text,
  add column if not exists utm_medium text;

alter table private.mindmake_brief_requests
  drop constraint if exists mindmake_brief_requests_utm_source_check,
  drop constraint if exists mindmake_brief_requests_utm_medium_check,
  drop constraint if exists mindmake_brief_requests_utm_pair_check;

alter table private.mindmake_brief_requests
  add constraint mindmake_brief_requests_utm_source_check
    check (
      utm_source is null
      or (char_length(utm_source) <= 40 and utm_source ~ '^growth-[a-z]+(-[a-z]+)*$')
    ),
  add constraint mindmake_brief_requests_utm_medium_check
    check (utm_medium is null or utm_medium = 'referral'),
  add constraint mindmake_brief_requests_utm_pair_check
    check ((utm_source is null) = (utm_medium is null));

comment on column private.mindmake_brief_requests.utm_source is
  'The growth placement the visit arrived from (growth-<path>), from the tag held in page memory only. Null when none.';
comment on column private.mindmake_brief_requests.utm_medium is
  'Always referral when utm_source is set; null otherwise.';

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
      utm_source,
      utm_medium,
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
      p_payload ->> 'utm_source',
      p_payload ->> 'utm_medium',
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

revoke all on function private.mindmake_brief_rpc(text, jsonb)
  from public, anon, authenticated, service_role;
grant execute on function private.mindmake_brief_rpc(text, jsonb) to service_role;
