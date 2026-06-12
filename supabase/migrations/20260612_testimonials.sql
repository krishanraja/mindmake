-- Mindmaker testimonials capture table.
-- Reusable across clients: one row per submitted reflection.

create table if not exists public.testimonials (
  id                 uuid primary key default gen_random_uuid(),
  created_at         timestamptz not null default now(),
  source             text,                       -- e.g. 'sprint'
  client_slug        text,                       -- e.g. 'steph-darmanin'
  name               text,
  role               text,
  company            text,
  link               text,
  email              text,
  permission         text check (permission in ('free','edits','private')),
  willing_reference  boolean not null default false,
  confidence_before  int check (confidence_before between 1 and 10),
  confidence_after   int check (confidence_after between 1 and 10),
  nps                int check (nps between 0 and 10),     -- would-recommend, 0 to 10
  rating             int check (rating between 1 and 5),   -- overall stars
  summary_line       text,                       -- the pull-quote answer
  responses          jsonb not null default '[]'::jsonb,  -- full Q&A
  meta               jsonb not null default '{}'::jsonb
);

create index if not exists testimonials_created_at_idx on public.testimonials (created_at desc);
create index if not exists testimonials_client_slug_idx on public.testimonials (client_slug);

-- Lock it down. RLS on with no anon/authenticated policy = default deny.
-- The Edge Function uses the service role key, which bypasses RLS, so it can
-- still insert. The public anon key cannot read or write this table directly.
alter table public.testimonials enable row level security;
