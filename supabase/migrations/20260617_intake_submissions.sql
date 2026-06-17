-- Mindmaker pre-session intake capture
-- Table: public.intake_submissions
-- Writes happen only from the submit-intake Edge Function (service role). RLS denies everything else.

create table if not exists public.intake_submissions (
  id                uuid primary key default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  source            text,
  client_slug       text,
  name              text,
  role              text,
  company           text,
  email             text,
  link              text,
  seat              text,
  confidence_now    int,
  business_oneliner text,
  north_star        text,
  value_frame       text,
  wish              text,
  anything_else     text,
  responses         jsonb,
  meta              jsonb
);

alter table public.intake_submissions enable row level security;

-- No policies for anon/authenticated => only the service role (used by the Edge Function) can read/write.
-- This mirrors public.testimonials.

create index if not exists intake_submissions_created_at_idx on public.intake_submissions (created_at desc);
create index if not exists intake_submissions_client_slug_idx on public.intake_submissions (client_slug);
