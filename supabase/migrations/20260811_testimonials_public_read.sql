-- Publishable testimonials: a consent-gated read path.
--
-- WHY THIS EXISTS
-- public.testimonials has carried a `permission` column since June 2026
-- ('free' | 'edits' | 'private'). It is the only place consent is recorded
-- anywhere in the estate, and nothing on the site read it. So the site
-- published nothing from it, which was safe, and had no way to publish
-- anything from it, which was the actual problem: consent was being collected
-- and then not used.
--
-- The table is RLS default-deny with no anon policy, and that stays. Opening
-- it up would expose name, email, and the full response payload of every
-- submission, consented or not.
--
-- Instead: a view that exposes ONLY consented rows and ONLY the fields needed
-- to render a quote. No email, ever. No raw responses. No rows where
-- permission is 'private', 'edits' (which means the client wants to approve
-- wording first, so it is not publishable as-is), or null.
--
-- A row also has to carry a substantive summary_line to appear. That is not
-- decoration: the table currently holds a test submission with swapped fields
-- and a one-word summary, and a length floor keeps that kind of row off the
-- site without needing anyone to remember to delete it.

create or replace view public.publishable_testimonials as
select
  id,
  created_at,
  role,
  company,
  summary_line,
  rating,
  nps
from public.testimonials
where permission = 'free'
  and summary_line is not null
  and length(btrim(summary_line)) >= 40;

comment on view public.publishable_testimonials is
  'Consent-gated, PII-reduced read path for the site. Only permission = free rows with a substantive summary_line. Never exposes name, email, link or the raw responses payload.';

-- The view runs with the invoker's permissions, so it cannot be used to escape
-- the base table's RLS by accident.
alter view public.publishable_testimonials set (security_invoker = on);

-- Because security_invoker is on, the anon role needs a read policy on the base
-- table for the view to return anything. Scope that policy to exactly the rows
-- the view exposes, so the grant can never be wider than the view.
drop policy if exists "anon reads consented testimonials" on public.testimonials;
create policy "anon reads consented testimonials"
  on public.testimonials
  for select
  to anon, authenticated
  using (
    permission = 'free'
    and summary_line is not null
    and length(btrim(summary_line)) >= 40
  );

grant select on public.publishable_testimonials to anon, authenticated;

-- NOTE: the policy above permits selecting consented ROWS from the base table,
-- including columns the view omits. Column-level grants keep the sensitive
-- ones out of reach of the anon key even on a direct table query.
revoke select on public.testimonials from anon, authenticated;
grant select (id, created_at, role, company, summary_line, rating, nps)
  on public.testimonials to anon, authenticated;

-- `permission` is in the grant list on purpose, and it is the one column here
-- that is not rendered. The view is security_invoker, so its WHERE clause is
-- evaluated as the calling role, which means anon has to be able to read the
-- column the clause tests or the view returns 42501 instead of rows. This
-- exposes nothing new: the RLS policy above already restricts anon to rows
-- where permission = 'free', so the only value anon can ever read back is the
-- one it had to satisfy to see the row at all.
grant select (permission) on public.testimonials to anon, authenticated;
