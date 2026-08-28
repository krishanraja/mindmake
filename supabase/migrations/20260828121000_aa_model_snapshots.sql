-- A daily snapshot of published model prices and quality.
--
-- This renders nothing today. It exists because the price history the future
-- cost-curve section needs cannot be back-filled later: every day it does not
-- run is a day missing from the curve. Service-role only, like everything else
-- the site writes.

create table if not exists public.aa_model_snapshots (
  snapshot_date date not null,
  model_id text not null,
  name text,
  creator text,
  input_price_per_m numeric,
  output_price_per_m numeric,
  intelligence numeric,
  tokens_per_sec numeric,
  ttft_s numeric,
  raw jsonb,
  created_at timestamptz not null default now(),
  primary key (snapshot_date, model_id)
);

alter table public.aa_model_snapshots enable row level security;
revoke all on public.aa_model_snapshots from public, anon, authenticated;

create index if not exists aa_model_snapshots_model_idx
  on public.aa_model_snapshots (model_id, snapshot_date desc);

comment on table public.aa_model_snapshots is
  'Daily published model prices and quality. Written by the aa-price-snapshot function at 11:00 UTC.';
