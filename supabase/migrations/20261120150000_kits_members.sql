-- Who may use the makeyourmindup codes (Krish, 2026-11-20): MAKEMYMINDUP is for paid members, one module each;
-- MAKEMYMINDUP-FOREVER is for founding members, every module. The list is loaded from Substack's own export.
create or replace function public.kits_email_key(p_email text) returns text
language sql immutable as $$
  select case
    when split_part(lower(btrim(p_email)), '@', 2) in ('gmail.com', 'googlemail.com')
      then replace(split_part(split_part(lower(btrim(p_email)), '@', 1), '+', 1), '.', '') || '@gmail.com'
    else split_part(split_part(lower(btrim(p_email)), '@', 1), '+', 1) || '@' || split_part(lower(btrim(p_email)), '@', 2)
  end
$$;

create table if not exists public.kit_members (
  email_key text primary key,
  tier text not null check (tier in ('paid', 'founding')),
  loaded_at timestamptz not null default now()
);
-- A free claim by someone not (yet) on the list: told kindly, never given a module, released when the list catches up.
create table if not exists public.kit_member_requests (
  session_id text primary key,
  email text not null,
  email_key text not null,
  kit_slug text not null,
  coupon text not null,
  created_at timestamptz not null default now(),
  released_at timestamptz
);
alter table public.kit_members enable row level security;
alter table public.kit_member_requests enable row level security;
revoke all on public.kit_members, public.kit_member_requests from anon, authenticated;

alter table public.kit_purchases add column if not exists email_key text generated always as (public.kits_email_key(email)) stored;
create index if not exists kit_purchases_member_claims on public.kit_purchases (email_key) where payment_intent like 'member\_%';
