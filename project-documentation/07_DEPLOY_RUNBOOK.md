# Deploy runbook: the rebuild's backend

Written 28 August 2026, after the work below was applied and verified against
the live project. It is here so the same steps can be repeated, checked or
rolled back by someone who was not in the room.

Project: `bkyuxvschuwngtcdhsyg`. Everything below is additive. No existing
policy was loosened, no anon policy was added to any table, and the four new
tables are RLS-on with no policies, which means service role only.

## What is deployed

| Function | Version | verify_jwt | Called by |
|---|---|---|---|
| `get-ai-news` | v68 | false | The browser, for the board and the homepage card |
| `mindmake-personal-read` | v20 | false | The browser, from `/ai-brain`, and every dead end on the site |
| `send-follow-ups` | v2 | false | pg_cron, daily at 09:20 UTC |
| `aa-price-snapshot` | v1 | false | pg_cron, daily at 11:00 UTC |
| `submit-mindmake-brief` | v14 | false | Still `main`'s body. The repository's day-14 enqueue is held back on purpose |

`get-ai-news` gained a board view and kept its previous response byte for byte.
The two scheduled functions are public at the edge and guarded in code on the
`x-mindmake-cron-secret` header, which is the pattern the project's other
scheduled functions already use.

## Migrations applied, in order

1. `20260828120000_mindmake_follow_up_and_personal_read.sql`: `follow_up_queue`,
   `mindmake_personal_reads`, the private rate-event table and its consume
   function, and the purge routine.
2. `20260828121000_aa_model_snapshots.sql`: the daily price table.
3. `20260828122000_mindmake_scheduled_jobs.sql`: `pg_net` and `pg_cron`, then
   the two jobs. `cron.schedule` upserts by name, so replaying is safe.
4. `20260828123000_mindmake_public_rpc_wrappers.sql`: public wrappers for the
   two private routines. PostgREST reaches only the public schema, so an edge
   function cannot call a routine in `private` directly. This mirrors the
   wrapper the brief pipeline already uses.
5. `20260828170000_personal_read_name_and_division.sql`, applied 29 August 2026
   and registered as `20260829065615 personal_read_name_and_division`: three
   nullable columns on `mindmake_personal_reads` for the visitor's name and
   division, with a check constraint on the division mirroring the allowlist the
   edge function parses against, and a length ceiling on the names. Additive, so
   the function still running the old body was unaffected by it. RLS unchanged:
   still on, still no policies.

## The one secret

`mindmake_cron_secret` exists in two places and must hold the same value:

- Supabase Vault, read by the cron jobs when they build the request header.
- The function environment as `MINDMAKE_CRON_SECRET`, read by the two scheduled
  functions when they check it.

It was generated at deploy time and never written to the repository. To rotate
it, create a new Vault secret under the same name and update the function
secret to match; the jobs read the newest row.

## How this was verified

- `aa-price-snapshot` rejected a wrong header with 403, then recorded 624 models
  for 2026-08-28.
- `send-follow-ups` rejected a wrong header, then ran clean against an empty
  queue.
- `mindmake-personal-read` rejected a disallowed origin, an unexpected body key
  and an out-of-range answer, then delivered a real email.

### The 29 August deploy, verified against the live function

Ordered so the incompatibility window was as short as it could be. The old site
sent `linkedin_url` and the new function refuses it; the new site sends
`first_name` and the old function refused that, so some window was unavoidable.
The migration went first (additive, so it changed nothing for the running
function), then the merge to `main`, and the function went out the moment Vercel
had promoted. The window was the seconds between those last two, and it touched
only the read button on `/ai-brain`.

- The deployed body was checked, not the deploy call's response: the bundle
  carries `personal-email`, `buildRead`, `DIVISION_LINES` and
  `FREE_EMAIL_DOMAINS`, and the three remaining `linkedin_url` occurrences are
  the comment saying the field is gone plus the two that read the URL out of
  PDL's answer.
- Contract probes against the live function: `linkedin_url` returns
  `unexpected:linkedin_url`, a gmail address returns `personal-email`, a missing
  or unknown division returns `division`, an empty name returns `first_name`,
  and a disallowed origin returns 403.
- **The PDL swap was measured, not assumed.** Name plus the email's domain
  resolved two of three very public test subjects: Benioff at salesforce.com and
  Collison at stripe.com came back with role and company; Nadella at
  microsoft.com returned 404, "No records were found matching your request".
  A fallback that also tried the domain's bare label was built, deployed and
  removed again, because every match came back on the domain and the second call
  therefore only ever ran on a miss, which is the worst place to spend a paid
  call.
- The first version of `enrichProfile` logged nothing on failure, so a swap that
  had stopped resolving anybody would have looked exactly like a run of
  hard-to-find people. It logs the provider's status and message now, and
  nothing about the person.
- PDL returns lowercase, so the read opened with "You are chief executive
  officer at salesforce". A provider's storage convention is not a fact about
  the company: `present()` capitalises all-lowercase words and leaves anything
  already carrying a capital alone, so eBay and iRobot survive it.
- One synthetic end-to-end lead to `krish@themindmaker.ai` from
  `https://mindmake.co`: delivered, the stored row carried the name, the division
  and the resolved role and company, and it produced exactly **one**
  `follow_up_queue` row due fourteen days out. Both test rows were deleted
  afterwards.
- Three successful sends to the same address produced exactly **one**
  `follow_up_queue` row, which is the two-email cap holding in practice rather
  than in prose. The fourth send inside the hour returned 429.
- `get-ai-news` returned 28 days and 417 corroborated items on the board view,
  and its legacy headline response unchanged.
- The synthetic rows were deleted afterwards. The price history was kept,
  because it cannot be back-filled.

## Rolling back

Each function has a version history in the Supabase dashboard; redeploying the
previous version is the fastest reversal. To stop the new scheduled work
without touching the functions:

```sql
select cron.unschedule('mindmake-aa-price-snapshot-daily');
select cron.unschedule('mindmake-follow-up-daily');
```

Dropping the tables is not part of a rollback: `aa_model_snapshots` holds price
history that cannot be recovered once deleted.

## Launch, as it happened

All three steps ran on 28 August 2026, in this order, except the first.

1. **The mailboxes were not created**, because `mindmake.co` still has no MX
   record. Rather than ship contact links that bounce, every one of them now
   reads `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, pointing at the mailbox
   that receives. To finish: add the MX record, create
   `hello@mindmake.co` and `privacy@mindmake.co`, then change that one constant.

2. **The build was promoted.** Merge `7557254`, deployment
   `dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`.

3. **`submit-mindmake-brief` was deployed last**, from merged `main`, with its
   full eighteen-file import closure. It went to v13, and the deployed body was
   verified to carry `queueFollowUp`, `follow_up_queue`, `FOLLOW_UP_DAYS = 14`
   and the `email,source` conflict target. The queue was empty at that moment,
   so no follow-up predates the privacy notice that describes it.

If the promotion is ever rolled back, roll this function back too. A follow-up
queued by a build that is no longer live is a promise nothing on the site is
making any more:

```sql
select cron.alter_job(
  (select jobid from cron.job where jobname = 'mindmake-follow-up-daily'),
  active := false
);
```

Hold the job; never delete queued rows. A visitor who asked for their read is
owed the follow-up, just not from a site that has reverted.

## Still outstanding

- `get-model-data` remains deployed and unused. The marketing repository has no
  callers. It should be retired once someone confirms the CTRL side does not
  call it either.
- The migrations are registered in the remote migration history under their
  names rather than their file timestamps, which is how this project has always
  applied them. `supabase db push` is not the deploy path here; the Management
  API is.

## Release, 29 August 2026: the handoff

Two changes ship together. The order matters for the same reason it did on
28 August: the browser calls the function directly, so the function has to
understand the new action before a build that sends it is live, and the
database has to accept the new column before the function writes it.

1. **The migration first.** `20260829120000_personal_read_handoff.sql` adds
   `handoff_reason` to `public.mindmake_personal_reads`, relaxes `q1` and `q2`
   from required-always to required-together, and indexes the handoff rows the
   operator-notice cap counts. It adds no policy and collects no new personal
   data. Applied through the Management API, as every migration on this project
   is: `supabase db push` is not the deploy path here.

2. **Then the merge and the promotion.** Wait for Vercel to finish before the
   next step, because a build that offers a person while the function still
   rejects `action: "handoff"` would put a dead end at the end of a dead end.

3. **Then the function**, from merged `main`, with its full **sixteen-file**
   import closure: `mindmake-personal-read/index.ts` and `core.ts`, plus
   `_shared/http/resend.ts`, `_shared/logger.ts`, `_shared/retry.ts`,
   `_shared/timeout.ts`, `_shared/security/hmac.ts` and the eight files under
   `_shared/enrich/`. Verify the deployed body carries `parseHandoff`,
   `renderHandoffNotice` and `HANDOFF_NOTICE_WINDOW_MS`, then prove one
   synthetic handoff from `https://mindmake.co` and delete its row.

Rolling back the promotion means rolling this function back too, for the same
reason as the follow-up queue: an offer of a person that no live build makes any
more. The row is harmless either way, so nothing needs deleting.

### The dialog's shape

The same release repairs the lead dialog, whose entire structural CSS was
deleted by the strip commit of 28 August and shipped. It is a stylesheet-only
change with no backend or configuration to it, so it rides the promotion in step
2 and needs nothing of its own. `06_CURRENT_STATE.md` records what happened.
