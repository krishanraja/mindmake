-- Scoping requests for high-value engagements (Signal Session, Revenue Architecture, Immersion)
create table if not exists scoping_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company_role text not null,
  decision_or_problem text not null,
  success_in_30_days text not null,
  notes text,
  source_page text not null,
  source_campaign text,
  user_agent text
);

alter table scoping_requests enable row level security;

create policy "Allow anonymous insert into scoping_requests"
  on scoping_requests
  for insert
  to anon
  with check (true);

-- CTRL waitlist (product not yet shipped, captures interest from homepage)
create table if not exists ctrl_waitlist (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null,
  name text,
  source_page text
);

alter table ctrl_waitlist enable row level security;

create policy "Allow anonymous insert into ctrl_waitlist"
  on ctrl_waitlist
  for insert
  to anon
  with check (true);
