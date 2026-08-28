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
| `get-ai-news` | v67 | false | The browser, for the board and the homepage card |
| `mindmake-personal-read` | v2 | false | The browser, from `/ai-brain` |
| `send-follow-ups` | v2 | false | pg_cron, daily at 09:20 UTC |
| `aa-price-snapshot` | v1 | false | pg_cron, daily at 11:00 UTC |
| `submit-mindmake-brief` | v12 | false | Still `main`'s body. The repository's day-14 enqueue is held back on purpose |

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

## Launch steps, in order

1. **Create the two mailboxes.** `hello@mindmake.co` and `privacy@mindmake.co`.
   The site routes visitor contact to them and there is no MX on the apex today.

2. **Promote the build.**

3. **Deploy `submit-mindmake-brief` last, from the merged repository.** Its
   deployed v12 body is still `main`'s: it does not enqueue the day-14
   follow-up. That is deliberate. The enqueue creates an obligation to send an
   email that the currently published privacy notice does not describe, and the
   notice that does describe it ships with the rebuild, so the mechanism must
   not precede the promise. Deploying it in the same session as the promotion
   is what keeps the two-email cap honest from the first lead.

   Deploy through the Management API with the full import closure, then verify
   the deployed body carries `queueFollowUp` and run one synthetic lead.

If the promotion is rolled back after step 3, roll this function back too. A
follow-up queued by a build that is no longer live is a promise nothing on the
site is making any more:

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
