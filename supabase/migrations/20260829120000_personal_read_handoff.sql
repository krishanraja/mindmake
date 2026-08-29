-- ---------------------------------------------------------------------------
-- A visitor the site could not help
--
-- Nine things on this site can fail, and every one of them used to end in a
-- line of grey text with nothing under it. The worst was the honest one: the
-- read gate deciding a company could not be written about well enough to send,
-- saying so, and leaving somebody who had typed four true details with no way
-- forward at all. Refusing to send something generic is right. Refusing and
-- then closing the door is a lead we asked to leave.
--
-- A handoff row is that person asking for a human instead. It is the same
-- person on the same journey, so it lives on the same table rather than a new
-- one: a row carrying handoff_reason with delivered_at null is somebody the
-- machine could not help, and one carrying delivered_at is somebody it could.
--
-- The reason carries a check constraint mirroring the allowlist the edge
-- function parses against, exactly as division, q1 and q2 already do, so the
-- database refuses a value the parser would have refused.
--
-- RLS is unchanged: still on, still no policies, still service role only. No
-- new personal data is collected. A name, a work address and a division are
-- what the read already stores and what the retention schedule already covers.
-- ---------------------------------------------------------------------------

alter table public.mindmake_personal_reads
  add column if not exists handoff_reason text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.mindmake_personal_reads'::regclass
      and conname = 'mindmake_personal_reads_handoff_reason_check'
  ) then
    alter table public.mindmake_personal_reads
      add constraint mindmake_personal_reads_handoff_reason_check
      check (handoff_reason is null or handoff_reason in (
        'read-refused', 'read-failed', 'read-rate-limited', 'send-failed',
        'personal-email', 'code-not-sent', 'code-not-accepted',
        'delivery-failed', 'ask-unmatched'
      ));
  end if;
end $$;

-- Six of the nine dead ends are on pages that never ask the two week-one
-- questions, so a handoff arrives without them. They stop being required and
-- start being required together: a row is either a read, with both answers, or
-- a handoff, with a reason. Nothing may be half of each.
alter table public.mindmake_personal_reads
  alter column q1 drop not null,
  alter column q2 drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.mindmake_personal_reads'::regclass
      and conname = 'mindmake_personal_reads_shape_check'
  ) then
    alter table public.mindmake_personal_reads
      add constraint mindmake_personal_reads_shape_check
      check (
        (handoff_reason is not null and q1 is null and q2 is null)
        or (handoff_reason is null and q1 is not null and q2 is not null)
      );
  end if;
end $$;

-- The operator notice is capped at one per address per hour, counted off these
-- rows rather than off the read limiter. That meter caps paid provider calls
-- and results emails, and one reason somebody asks for a person is that they
-- already tripped it: spending their read budget on a request for help would be
-- the dead end that fails to fail.
create index if not exists mindmake_personal_reads_handoff_idx
  on public.mindmake_personal_reads (email, created_at desc)
  where handoff_reason is not null;

comment on column public.mindmake_personal_reads.handoff_reason is
  'Which dead end sent them here, from the edge function allowlist. Null on a delivered read.';
