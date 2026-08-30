# Mindmake deployment

Last updated: 30 August 2026, after the site rebuild's backend landed. This file and `07_DEPLOY_RUNBOOK.md` overlap more than the README's split implies (both restate the function/verify_jwt table, the RPC-wrapper rule and the cron rollback command); a merge is worth considering, but that is a structural call for Krish, not made in this pass.

This file records how the live Mindmake site is deployed and how to change it
safely. Current identifiers live in `06_CURRENT_STATE.md`, and the ordered
launch steps live in `07_DEPLOY_RUNBOOK.md`.

## Live topology

| Surface | Owner | Behaviour |
|---|---|---|
| `mindmake.co` | Vercel project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`, team `team_iXZBozK4Ss7NHuyNk8L9wmO6`) | Canonical public site |
| `www.mindmake.co` | Same project | 308 redirect to the apex, path and query preserved |
| `themindmaker.ai`, `www.themindmaker.ai` | Same project (DNS at Cloudflare, records point at Vercel) | 308 redirect to `https://mindmake.co`, path and query preserved |
| `mindmakerlive.substack.com` | Substack | The publication. `/signal` and `/builder-economy` redirect here. `content.mindmake.co` is not in use (owner decision, 26 August 2026) |
| `ctrl.mindmake.co` | Vercel project `mm-ctrl` | Serves the CTRL product |
| `ctrl.themindmaker.ai` | Vercel project `mm-ctrl` | Still 308 redirects to `makeyourmindup.ai`; repoint to `ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host |

`mindmake.co` DNS is hosted on Vercel DNS (`ns1/ns2.vercel-dns.com`). The zone
also carries the Resend DKIM record (`resend._domainkey`), the return-path
records on `send.mindmake.co` (MX plus SPF TXT) and `_dmarc` with `p=none`.
There is no MX on the apex: no mailbox exists at `@mindmake.co`.

## Build and promote

Vercel builds from GitHub (`krishanraja/mindmake`). A merge to `main` builds
and promotes production. The production build uses:

- `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` / `VITE_SUPABASE_PROJECT_ID`
  for Supabase project `bkyuxvschuwngtcdhsyg` (its display name in Supabase is
  still the legacy "Mindmaker AI").
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=true`: the private email hand-off is
  live. Gate E was approved by Krish and closed on 27 August 2026 with a
  synthetic end-to-end lead from `mindmake.co`.

Identifiers: the launch merged commit was
`e520952a182d29312fa2878dd3f963740c1dccb7` (pull request #141, production
`dpl_7KNTh3AhLsRKCbxUbq6oGeQ7EiH6`). The current production deployment and
rollback target are recorded in `06_CURRENT_STATE.md` and move with each merge.

## Backend

Supabase project `bkyuxvschuwngtcdhsyg`. Six functions belong to the site;
everything else in the project belongs to CTRL and is not ours to touch.

| Function | verify_jwt | Called by |
|---|---|---|
| `submit-mindmake-brief` | off | The browser, for the company read |
| `enrich-company` | on | `submit-mindmake-brief` |
| `get-ai-news` | off | The browser, for the live board and the homepage proof card |
| `mindmake-personal-read` | off | The browser, for the personal read |
| `send-follow-ups` | off | pg_cron only |
| `aa-price-snapshot` | off | pg_cron only |

Deploys go through the Supabase Management API with the function's **full
import closure**; after every deploy, verify the deployed body against the
repository and run one synthetic call. Current versions live in
`06_CURRENT_STATE.md` and move with each deploy.

The two browser-called new functions check a strict origin allowlist before
they do any work, and rate-limit on one-way HMAC identifiers rather than on a
raw address or IP. `get-ai-news` reads only the daily cache when asked for the
board, so the board can never invent a fresher answer than the one it has.

The two cron-called functions are reached over HTTP by pg_cron with the Vault
secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each
refuses without it. This is the project's established pattern and it is why
they carry `verify_jwt` off: the guard is in the function, and the secret is
never in a migration.

- Migrations: `mindmake_brief_requests`, `mindmake_brief_retention`,
  `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`,
  `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`,
  `personal_read_name_and_division`, `personal_read_handoff`. All are
  idempotent and all are registered in the remote migration history.
- Every table the site writes is RLS-on with **no policies**, so only the
  service role reaches it. Adding an anon policy to any of them is a
  regression, not a convenience.
- PostgREST reaches only the `public` and `graphql_public` schemas, so a
  routine in `private` needs a thin public wrapper to be callable from an edge
  function. That is what `mindmake_public_rpc_wrappers` is for; a new private
  routine needs the same treatment or it will fail with a 503 at runtime.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`),
  `mindmake-follow-up-daily` (`20 9 * * *`),
  `mindmake-aa-price-snapshot-daily` (`0 11 * * *`).
- Configuration names (values live only in Supabase): `RESEND_API_KEY`,
  `MINDMAKE_RATE_LIMIT_SALT`, `MINDMAKE_VERIFICATION_SECRET`,
  `MINDMAKE_BRIEF_FROM` (`Mindmake <briefs@mindmake.co>`),
  `MINDMAKE_OPERATOR_EMAIL` (`krish@themindmaker.ai`),
  `MINDMAKE_PUBLIC_URL` (`https://mindmake.co`),
  `MINDMAKE_ALLOWED_ORIGINS` (`https://mindmake.co,https://www.mindmake.co`),
  `MINDMAKE_CRON_SECRET`, `ARTIFICIALANALYSIS_API_KEY`, and the enrichment
  provider keys.

### The two-email cap

The public pages promise a visitor exactly two emails: the results they asked
for, and one follow-up fourteen days later. That promise is held by mechanism,
not by discipline: `follow_up_queue` is unique on `(email, source)`, so a
returning visitor cannot stack a second row; each send is keyed on the row's
id, so a re-run cannot duplicate; and `sent_at` is written only when the
provider accepted. A used row is deleted after seven days.

Anything that would add a third send, whether a sequence, a nurture or a list
import, breaks a published promise. `src/test/mindmake-brief-backend-core.test.ts` and
`src/test/brief2-email-cap.test.ts` walk every function to catch a new sender,
so adding one fails the suite before it can ship.

Email identity: `mindmake.co` is verified in Resend; SPF, DKIM and DMARC all
pass in a real inbox. Reply-To on verification and visitor emails is
`krish@themindmaker.ai`; the operator email goes To that mailbox with the
verified visitor address as Reply-To. The old `themindmaker.ai` Resend domain
shows a failed verification and legacy senders on it are unreliable.

Retention: unverified requests purge after 7 days, rate-limit hashes after
48 hours, verified records 12 months after their last update, sent follow-up
rows after 7 days, unsent follow-up rows after 60 days, and personal reads at
12 months. Deletion requests come through the published contact address and a
manually verified private process.

Operations: check the Resend logs and the Supabase function logs daily for
failures, rate-limit spikes and bounces. A provider `queued` response is not
proof of inbox delivery.

## Rollback

Per surface, never all at once:

| Failure | Action |
|---|---|
| Site regression | Promote the rollback deployment named in `06_CURRENT_STATE.md` from the Vercel dashboard |
| Domain or certificate failure | Detach the affected domain from the project and re-attach after the certificate re-issues |
| V2 function failure | Revert the function to its previous version in Supabase; never drop the lead tables. If the failure leaks bad content to visitors, ship a build with the flag off while the function is repaired |
| Email failure | Repair sender configuration and rerun the synthetic matrix before trusting deliveries again |
| A follow-up must not go out yet | Hold the job rather than deleting queued rows: `select cron.alter_job((select jobid from cron.job where jobname = 'mindmake-follow-up-daily'), active := false);` |
| The board is wrong or stale | Nothing to roll back. It reads only the daily cache, states its own age, and collapses to one honest line if the read is unavailable. Repair the cache, not the page |

`VITE_` values are build-time: changing an environment variable alone changes
nothing until a new build is promoted.
