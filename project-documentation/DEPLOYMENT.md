# Mindmake deployment

Last updated: 27 August 2026, after Gate E and the Round D cleanse.

This file records how the live Mindmake site is deployed and how to change it
safely. Current identifiers live in `CURRENT_STATE.md`; history lives in
`DECISIONS_LOG.md`.

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
rollback target are recorded in `CURRENT_STATE.md` and move with each merge.

## Lead backend

Supabase project `bkyuxvschuwngtcdhsyg` runs the private brief pipeline:

- Migrations `20260826123007_mindmake_brief_requests` (private schema, RLS,
  service-role-only RPCs) and `20260826180000_mindmake_brief_retention`
  (daily purge via pg_cron job `mindmake-brief-retention-daily`).
- Functions `submit-mindmake-brief` v11 (verify_jwt off; its own origin,
  honeypot, rate-limit, verification and tailored-signature controls are all
  live-tested) and `enrich-company` v35 (declarative synthesis, tailored
  choice generation, currency meta-talk guard). Deploys go through the
  Supabase Management API with the function's full import closure; after
  every deploy, verify the deployed body and run one synthetic lead.
- Configuration names (values live only in Supabase): `RESEND_API_KEY`,
  `MINDMAKE_RATE_LIMIT_SALT`, `MINDMAKE_VERIFICATION_SECRET`,
  `MINDMAKE_BRIEF_FROM` (`Mindmake <briefs@mindmake.co>`),
  `MINDMAKE_OPERATOR_EMAIL` (`krish@themindmaker.ai`),
  `MINDMAKE_PUBLIC_URL` (`https://mindmake.co`),
  `MINDMAKE_ALLOWED_ORIGINS` (`https://mindmake.co,https://www.mindmake.co`).

Email identity: `mindmake.co` is verified in Resend; SPF, DKIM and DMARC all
pass in a real inbox. Reply-To on verification and visitor emails is
`krish@themindmaker.ai`; the operator email goes To that mailbox with the
verified visitor address as Reply-To. The old `themindmaker.ai` Resend domain
shows a failed verification and legacy senders on it are unreliable.

Retention: unverified requests purge after 7 days, rate-limit hashes after
48 hours, verified records 12 months after their last update. Deletion
requests come through the published contact address and a manually verified
private process.

Operations: check the Resend logs and the Supabase function logs daily for
failures, rate-limit spikes and bounces. A provider `queued` response is not
proof of inbox delivery.

## Rollback

Per surface, never all at once:

| Failure | Action |
|---|---|
| Site regression | Promote the rollback deployment named in `CURRENT_STATE.md` from the Vercel dashboard |
| Domain or certificate failure | Detach the affected domain from the project and re-attach after the certificate re-issues |
| V2 function failure | Revert the function to its previous version in Supabase; never drop the lead tables. If the failure leaks bad content to visitors, ship a build with the flag off while the function is repaired |
| Email failure | Repair sender configuration and rerun the synthetic matrix before trusting deliveries again |

`VITE_` values are build-time: changing an environment variable alone changes
nothing until a new build is promoted.
