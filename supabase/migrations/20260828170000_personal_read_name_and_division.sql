-- ---------------------------------------------------------------------------
-- The personal read learns who it is reading
--
-- The read used to be keyed on a LinkedIn URL the visitor pasted in, which most
-- people have to go and find. It now takes a name, a work email and the part of
-- the business they work in: the email gives the company, and the name plus that
-- company resolves the person through the same provider that used to want the
-- URL. The division is what the read is pointed at.
--
-- Names are new personal data on this table. The public privacy notice was
-- amended in the same change to say so, and the retention schedule that already
-- covers this table covers them: nothing new is kept for longer.
--
-- Division carries a check constraint mirroring the allowlist the edge function
-- parses against, the same way q1 and q2 already do, so the database refuses a
-- value the parser would have refused. Existing rows predate all three columns
-- and are left null rather than backfilled with a guess.
-- ---------------------------------------------------------------------------

alter table public.mindmake_personal_reads
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists division text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.mindmake_personal_reads'::regclass
      and conname = 'mindmake_personal_reads_division_check'
  ) then
    alter table public.mindmake_personal_reads
      add constraint mindmake_personal_reads_division_check
      check (division is null or division in (
        'leadership', 'sales', 'marketing', 'product',
        'engineering', 'operations', 'finance', 'people'
      ));
  end if;
end $$;

-- A name is free text from a browser, so it gets a ceiling here as well as in
-- the parser. The parser is the gate; this is the floor under it.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.mindmake_personal_reads'::regclass
      and conname = 'mindmake_personal_reads_name_length_check'
  ) then
    alter table public.mindmake_personal_reads
      add constraint mindmake_personal_reads_name_length_check
      check (
        (first_name is null or char_length(first_name) <= 80)
        and (last_name is null or char_length(last_name) <= 80)
      );
  end if;
end $$;

comment on column public.mindmake_personal_reads.first_name is
  'Given name, as typed. Used to resolve the person and to address the one email.';
comment on column public.mindmake_personal_reads.last_name is
  'Family name, as typed. Used with the email domain to resolve the person.';
comment on column public.mindmake_personal_reads.division is
  'Allowlisted part of the business. Points the read at the work, not the company.';
