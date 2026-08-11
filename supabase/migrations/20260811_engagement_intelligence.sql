-- Engagement intelligence: what each engagement systematically collects.
--
-- WHY THIS EXISTS
-- Advisory that produces only fees is a day rate with extra steps. What makes
-- the practice worth something later is the one structured thing it
-- accumulates that nobody else can assemble: how a set of comparable
-- companies actually priced and packaged, what converted, what had to change,
-- and what commercial constraint the answer had to live inside.
--
-- The shape matters. This is deliberately TYPED COLUMNS, not one memo per
-- engagement. A memo per client is a folder of documents nobody queries. The
-- point is to be able to ask "across every Handover at 100 to 250 people,
-- what was the constraint that survived the rebuild" and get an answer,
-- which needs the answers in comparable slots.
--
-- The offer definition in src/lib/offers.ts names what each rung collects
-- (Offer.collects). This table is where those answers land.
--
-- PRIVACY
-- Service-role only, same as public.testimonials and public.intake_submissions:
-- RLS on, no anon or authenticated policy, so default deny. None of this is
-- ever exposed to the site, quoted by Mindy, or included in a proposal. It is
-- retained as an anonymised pattern layer, which is why company_label is a
-- coarse descriptor rather than a name.
--
-- TODO(krish): the engagement terms need a confidentiality and consent clause
-- covering aggregated, anonymised retention before any real row is written.
-- That needs your sign-off and probably a lawyer's. The schema ships; the
-- terms change does not.

create table if not exists public.engagement_intelligence (
  id                     uuid primary key default gen_random_uuid(),
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  -- Which rung, and which price tier it was sold at. Free text rather than a
  -- foreign key: offers.ts is the source of truth for the ladder and it lives
  -- in the front-end repo, so a DB-side enum would drift the moment it is
  -- repriced.
  offer_id               text not null check (offer_id in ('teardown', 'handover')),
  tier_id                text,
  currency               text check (currency in ('USD', 'GBP', 'AUD')),

  -- Coarse descriptors only. No company name, no contact, no email.
  company_label          text,
  sector                 text,
  headcount_band         text,

  engagement_started_on  date,
  engagement_ended_on    date,

  -- The four capture slots, mirroring OfferCollects in src/lib/offers.ts.
  pricing_and_packaging  text,
  what_converted         text,
  what_had_to_change     text,
  commercial_constraint  text,

  -- Structured extras that are worth querying rather than reading.
  -- e.g. {"cycle_length_days": 45, "competitor": "incumbent suite"}
  structured             jsonb not null default '{}'::jsonb,

  -- Set when the client has agreed in writing to anonymised aggregate use.
  -- Nothing should be aggregated out of a row where this is false.
  retention_consented    boolean not null default false,
  consent_note           text,

  meta                   jsonb not null default '{}'::jsonb
);

create index if not exists engagement_intelligence_offer_idx
  on public.engagement_intelligence (offer_id, created_at desc);
create index if not exists engagement_intelligence_sector_idx
  on public.engagement_intelligence (sector);
create index if not exists engagement_intelligence_consent_idx
  on public.engagement_intelligence (retention_consented)
  where retention_consented;

comment on table public.engagement_intelligence is
  'What each engagement systematically captures. Typed columns so it can be queried across clients, not a memo per engagement. Service-role only, never surfaced to the site or to Mindy.';

-- Lock it down. RLS on with no anon/authenticated policy is default deny.
alter table public.engagement_intelligence enable row level security;
