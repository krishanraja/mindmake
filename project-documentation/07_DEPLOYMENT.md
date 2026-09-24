# Deployment topology and operating contract

Reviewed 24 September 2026. Current deployment/version/rollback identities:
[06_CURRENT_STATE.md](06_CURRENT_STATE.md). Procedure:
[07_DEPLOY_RUNBOOK.md](07_DEPLOY_RUNBOOK.md). History: history/LOG.md only.

## Frontend

Vercel project mindmake serves https://mindmake.co from krishanraja/mindmake.
main auto-promotes. Node 22.x and npm ci use the committed lockfile. Vite
prerenders indexed routes and generates sitemap/crawler text. Preview protection
stays enabled: use authenticated preview access, not weakened project security.
VITE_ values are build-time; changing them requires a rebuild.

www.mindmake.co, themindmaker.ai and www.themindmaker.ai redirect to the apex,
preserving path/query. Canonical non-root paths omit trailing slashes.
Publication: https://mindmakerlive.substack.com. CTRL is a separate project;
its hosts/functions are not this website's deployment scope.

Browser settings: VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY,
VITE_SUPABASE_PROJECT_ID and VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED.
Values belong in managed environments, never committed local files.

## Backend

Project bkyuxvschuwngtcdhsyg. Versions/source evidence are in current state.

| Function | JWT | Contract |
|---|---|---|
| submit-mindmake-brief | off | Company-first brief, verification and delivery |
| enrich-company | on | Server-called domain-bound enrichment |
| mindmake-personal-read | off | Retained personal-read API and human handoff |
| get-ai-news | off | Retained cache API, not the approved homepage composition |
| send-follow-ups | off | Cron-secret-guarded scheduled sender |
| aa-price-snapshot | off | Cron-secret-guarded daily price recorder |

Deploy full import closures, preserve JWT flags and independently read back
source. Browser endpoints enforce origin/body allowlists and rate limits.
Never loosen controls or add anonymous write policies for a canary. Preserve
domain corroboration, literal factual reads and first-party source titles.
The owned-domain alias affects research/signatures, never recipient addresses.

supabase/migrations defines retention, follow-up uniqueness, service-role-only
tables and public wrappers for private routines. Before schema changes inspect
remote migration history and obtain authority. Do not replay launch journals or
run supabase db push by assumption. File contents do not prove a live job exists.

Scheduled functions authenticate x-mindmake-cron-secret. The symbolic secret is
mindmake_cron_secret in Vault and MINDMAKE_CRON_SECRET in the function environment;
they must agree. Never put values in migrations, reports or transcripts.
Read live cron configuration before changing it.

## Delivery and privacy

05_LEAD_DELIVERY_SPEC.md owns payloads, email cap, retention and failure paths.
CONTACT_EMAIL in src/lib/publicLinks.ts owns contact links. Do not invent branded
mailboxes or claim current DNS/Resend health from an old snapshot. Actual release
INBOX proof covers its tested sender/recipient, not every provider or future cron.

Managed keys include RESEND_API_KEY, MINDMAKE_RATE_LIMIT_SALT,
MINDMAKE_VERIFICATION_SECRET, MINDMAKE_BRIEF_FROM, MINDMAKE_OPERATOR_EMAIL,
MINDMAKE_PUBLIC_URL, MINDMAKE_ALLOWED_ORIGINS, MINDMAKE_CRON_SECRET,
ARTIFICIALANALYSIS_API_KEY and enrichment-provider keys. Retrieve only through
the authorized runtime; log sanitized outcomes, never values.

Accepted/queued is not inbox delivery. Operational checks inspect function
errors, rate-limit spikes and provider bounces, with inbox receipts only when
sends are authorized. This runbook does not create an active monitor.

## Rollback boundaries

Frontend and backend deploy separately. Use the known-good frontend deployment;
preserve prior backend closures and check request compatibility before rollback.
Never drop data or purge live queues. Holding sends, changing DNS/certificates,
credentials or access requires scoped authority and a recovery plan, not an
automatic workaround.
