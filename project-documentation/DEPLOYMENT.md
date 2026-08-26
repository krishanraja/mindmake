# Mindmake deployment

Last updated: 26 August 2026, after the production launch pass.

This file records how the live Mindmake site is deployed and how to change it
safely. The full launch runbook that produced this state is `HANDOVER/06`.

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
  for Supabase project `bkyuxvschuwngtcdhsyg` (Mindmaker AI).
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` unset, so the private email hand-off
  stays off. Enabling it is Gate E: a deliberate new build with the value
  `true`, promotion, and one synthetic end-to-end lead from `mindmake.co`.

Launch identifiers:

- Merged commit `e520952a182d29312fa2878dd3f963740c1dccb7` (pull request #141).
- Production deployment `dpl_7KNTh3AhLsRKCbxUbq6oGeQ7EiH6`.
- Rollback target `dpl_8on1i3DsoG2FY7ikYwU1GYAu3svx` (the previous site).

## Lead backend

Supabase project `bkyuxvschuwngtcdhsyg` runs the private brief pipeline:

- Migrations `20260826123007_mindmake_brief_requests` (private schema, RLS,
  service-role-only RPCs) and `20260826180000_mindmake_brief_retention`
  (daily purge via pg_cron job `mindmake-brief-retention-daily`).
- Functions `submit-mindmake-brief` (verify_jwt off; its own origin, honeypot,
  rate-limit and verification controls are all live-tested) and
  `enrich-company` (carries the comma-scrub fix).
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
| Site regression | Promote `dpl_8on1i3DsoG2FY7ikYwU1GYAu3svx` from the Vercel dashboard |
| Domain or certificate failure | Detach the affected domain from the project; the previous state is recorded in `HANDOVER` evidence |
| V2 function failure | Keep the flag off (it is off); revert the function version in Supabase if needed; never drop the lead tables |
| Email failure | Keep V2 off, repair sender configuration, rerun the synthetic matrix |

`VITE_` values are build-time: changing an environment variable alone changes
nothing until a new build is promoted.
