# Release runbook

Current procedure, reviewed 24 September 2026. Not a deployment journal.
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
  qa:website-feedback, qa:material-review:self-test and qa:plain-language.
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

These run after the merge, not before it. Ruling (Krish, 2026-09-25): the
browser matrix is not a pre-merge gate and nothing waits on it. CI runs it on
main against the commit Vercel promotes; a failure there is fixed forward or
rolled back, both of which take minutes.

Use the exact built artifact. Full route smoke runs Chromium/Firefox on Linux
and WebKit on macOS. Require expected counts and navigation supplements. Do not
substitute a smaller matrix when it runs; local smoke is additive evidence and
is never required before landing a change.

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

1. Freeze the exact candidate commit; require its CI, independent review and
   applicable material approval. Keep failed runs as failures.
2. Preserve frontend deployment and affected backend rollback closures.
3. Merge to main; Vercel auto-promotes. Do not deploy an arbitrary local
   worktree. Match build/commit and production alias.
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
