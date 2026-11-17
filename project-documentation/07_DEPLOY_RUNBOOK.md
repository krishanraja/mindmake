# Release runbook

Current procedure, reviewed 26 October 2026. Not a deployment journal. The
required gate list is in [CLAUDE.md](../CLAUDE.md), "Verification"; this file
puts those gates in release order.
[06_CURRENT_STATE.md](06_CURRENT_STATE.md) owns live/rollback identities;
[07_DEPLOYMENT.md](07_DEPLOYMENT.md) owns topology and authority boundaries.

## Establish scope

Read the numbered canon, current state, website-redesign/STATE.md and active
immutable route manifest. Preserve R3 and companion pages. Inspect git status,
keep unrelated work and name the exact authorized delta. Use this checkout,
not an unverified ambient server. Match authenticated GitHub/Vercel/Supabase
targets before mutation. Secrets never belong in logs or documentation.
Publication, real sends, backend and account changes require explicit scope.

## Source and build

Use Node 22.x (at least 22.18), npm ci and the committed package-lock.json.
Vercel installCommand is npm ci. Keep vercel.json compact: the platform
normalizes it and exact configuration bytes are release-bound.

- Run the deterministic homepage adapter --check; never hand-edit generated R3.
- Run qa:approved-routes and its negative self-test, qa:homepage-handoff,
  qa:website-feedback, qa:material-review:self-test, qa:plain-language,
  qa:docs and qa:website-restart.
- Run typecheck against tsconfig.app.json, lint, full units and npm run build.
  Root tsconfig alone is not a typecheck.
- Metadata changes require discoverability tests, route/canonical parity,
  built-head readback and visual inspection of social/icon artwork.
  Run `npm run qa:discoverability -- --base=<built-or-live-origin>` with
  `QA_REVISION` set to its source commit. It compares all source-indexed routes,
  waits for actual client metadata execution, exercises a deliberate regression,
  and checks share assets. This is technical eligibility, not search inclusion.
  For a local Vite built preview only, add `--directory-index` to inspect the
  generated per-route HTML rather than its clean-path SPA fallback. That mode
  is loopback-only. Production checks must use actual clean URLs without it.
- Permitted changes to locked files are declared by regenerating
  `quality/route-lock/approved-production.lock.json` with
  `npm run qa:approved-routes:update` in the same commit, which says why.
  Never regenerate to absorb an unintended edit. The numbered manifests
  r1 to r48 are frozen history and are never rewritten.

## Browser and journey gates

Before merging, on the exact built artifact and on Chromium only: qa:line-breaks
and qa:homepage-release:pre-merge; qa:card-contrast when the homepage's picture
cards change; qa:lead-keyboard and qa:lead-contrast when the brief changes.

The three-engine browser matrix runs after the merge, not before it. Ruling
(Krish, 2026-09-25): it is not a pre-merge gate and nothing waits on it. CI runs
it on main against the commit Vercel promotes (Chromium and Firefox on Linux,
pinned to ubuntu-24.04 since 24 October 2026, WebKit on macOS); agents read its
Chromium result only (Krish, 2026-09-26), and a failure there is fixed forward
or rolled back, both of which take minutes. Require expected counts and
navigation supplements. Local smoke is additive evidence and is never required
before landing a change.

For pinned builds verify every visible state, stable geometry, forward/reverse
traversal, entry and natural release. Test reduced motion, short screens,
keyboard controls and no-script readability. Before merging, run
qa:homepage-release:pre-merge (Chromium) and its negative evidence controls;
the three-engine qa:homepage-release runs on main after the merge. Screenshots or attributes alone cannot pass.
Review desktop/mobile frames for fixed-chrome clearance, overlap, contrast,
focus and overflow. Recheck the specific defect, not merely a nearby route.

Lead changes require backend units and Deno checks for affected import closures.
Deploy only changed full closures to the verified project with original JWT
flags, then independently read back source. Do not modify unrelated CTRL
functions, policies or schemas to make a test pass.

Authorized live canaries use only the designated inbox and synthetic data.
Require actual inbox receipts, persistence, one due follow-up and the actual
success-screen download matching the visible brief. Never invoke live cron to
test a future email. Delete only exact test IDs and read back zero. Do not
retain verification codes/full private bodies. Head/docs-only edits need no sends.

## Promote and verify

1. Freeze the exact candidate commit; require its exact-head CI and Krish's
   approval of any material change. Merging itself is pre-authorised (CLAUDE.md,
   2026-09-24), and no AI review round is run unless Krish asks for one. Keep
   failed runs as failures.
2. Preserve frontend deployment and affected backend rollback closures.
3. Merge to main; Vercel auto-promotes. Do not deploy an arbitrary local
   worktree. Match build/commit and production alias. A merge never deploys a
   Supabase function: deploy a changed function from main with its original JWT
   flag, on Krish's go, and read its source back.
4. Read public HTML, assets, redirects and runtime behavior. For discoverability,
   include head, robots, sitemap, icons and social images.
5. Update current state/receipts; put chronology only in history/LOG.md.

The physical VoiceOver/TalkBack exception belongs to the recorded R3 release;
it is not a standing waiver or a successful test.

## Search and AI discovery operations

Page components own metadata; build-time rendering exposes their real text and
structured data without waiting for client JavaScript. The route list,
sitemap and optional llms directory must agree. Never invent schema claims or
update lastmod simply because a build ran. Robots search eligibility is separate
from consent for model-training crawlers; do not change either policy by guess.

Use verified Search Console/Bing property access for indexing, queries, traffic
and AI-citation measurements when available. A healthy crawlable release does
not prove indexing, ranking, citations, referrals or conversion improvement.
Social-platform cache refresh and actual platform posts are external checks;
image/metadata HTTP readback alone does not certify their final rendering.

## Recovery

Use the recorded frontend rollback for a confirmed regression. For backend
regressions, check compatibility and redeploy the preserved full source closure
with original JWT flags. Never drop tables or delete live lead/queue records.
Holding cron, changing domains, credentials or access needs scoped authority and
a recovery path. Verify the affected public flow again after recovery.

## AI brain parts test and launch sequence

The 17 November 2026 AI brain parts candidate is source-only, test-only and unapproved.
Verification is in `quality/parts/verification.json`; website-redesign/STATE.md
owns its design state and links the material-review manifest.

1. In a workspace where Node can spawn build tools and Chromium, use the required
   Node 22 runtime and `npm ci`. Run `npm run qa:website-restart`, units, lint,
   typecheck and `npm run build`. Set `MINDMAKE_QA_SCRATCH` to a permitted
   temporary directory if needed. Run `npm run qa:parts:production` before
   replacing dist with a preview build. Preserve and restore `public/llms.txt`
   and `public/sitemap.xml` after both builds. Run `npm run test:kits` for the
   focused catalogue, route and mocked commerce cases.
2. Run `npm run build:parts-preview`, then `npm run qa:parts:capture`. Capture
   requires the integrated prerendered `/parts/fact-check-board-update` page, freezes every dist file
   in the manifest and records both routes at 375x812 and 1440x900. Finish
   required site gates, readiness, continuity and independent specialist
   receipts. Unit checks cannot substitute for these receipts.
3. Issue the receipt with
   `npm run qa:material-review -- quality/website-redesign/kits-material-review-candidate.json --issue quality/parts/presentation-receipt.json`.
   Present only through
   `npm run review:material -- quality/website-redesign/kits-material-review-candidate.json`.
   A separately authorised protected Vercel preview must bind the same source
   commit and built bytes; record deployment, URL and commit beside the receipt.
   A different build needs new receipts. Krish approves the actual render.
4. Verify each part's real `.mcpb`: install on Mac and Windows, own-file task
   and output checks, and no calls to Mindmake. All seven catalogue entries
   are `ready` by Krish's 17 November ruling; that status does not prove package
   acceptance. Keep the pages unlisted until his rendered approval. Coordinate
   the `/who-decided` destination with `feat/who-decided`, Mindmake PR #309,
   before final acceptance. The seven report checks and human-judgement
   sentences are supplied verbatim; no copy fallback remains.
5. With separate authority for the named test project, apply
   `supabase/migrations/20261116110417_kits_commerce.sql`. Verify the three
   tables, service-role-only RPC access, RLS, the private `kits` bucket and
   absence of client policies exposing its objects. Upload versioned files
   privately; deploy `kits-checkout`, `kits-webhook` and `kits-download` with
   the JWT flags in `supabase/config.toml`.
6. Create one test Stripe Product and active one-time Price per part of the AI brain,
   5900 cents USD. Set `STRIPE_SECRET_KEY` to an `sk_test_` key,
   `KITS_STRIPE_PRICES_JSON` to a slug-to-Price map and `KITS_FILES_JSON` to
   a slug-to-private-object-path map. Register snapshot events
   `checkout.session.completed` and `charge.refunded` at `kits-webhook`;
   configure its `STRIPE_WEBHOOK_SECRET`. Live keys/events are rejected.
7. Configure server-only `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, a separate
   random `KITS_DOWNLOAD_SECRET` of at least 32 characters, `RESEND_API_KEY`,
   `MINDMAKE_BRIEF_FROM`, `MINDMAKE_PUBLIC_URL` and exact
   `MINDMAKE_ALLOWED_ORIGINS`. The frontend uses the existing
   `VITE_SUPABASE_URL` and publishable key. Set `KITS_EMAIL_ENABLED=true` only
   for an approved test send. No service secret belongs in Vite variables.
8. Prove test checkout, an authorised receipt, private download, renewal,
   duplicate and out-of-order events, retry and an operator's Stripe refund.
   Read back purchase/event rows and the actual designated inbox. Refunds
   block new signed URLs; existing URLs remain usable for their seven-day
   lifetime. No self-serve refund endpoint exists. Reconcile any uncertain
   email older than 23 hours against Resend before retrying: the handler stops
   before the provider's 24-hour idempotency window ends.
9. Going live requires a separately approved code change replacing the hard
   test-only guard with explicit production-mode validation, live Stripe
   Products/Prices and webhook registration, production migration/functions,
   private uploads and variables, part-package acceptance, current render receipts
   and Krish's yes to publish. A live key alone will not enable sales. Keep
   `KITS_PREVIEW_BUILD` unset and Vercel's environment `production`; read back
   live HTML and verify the seven approved parts.

The current task authorises none of the external mutations or sends above.
No real provider transaction, database persistence or inbox delivery has been
verified in this worktree. Only synthetic mocked provider tests have run.
