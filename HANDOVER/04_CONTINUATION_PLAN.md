# Continuation plan for Claude Code

Follow this order. Do not begin with a visual redesign or a repository-wide cleanup.

## Phase 0: establish the checkpoint

1. Check the active branch:

```powershell
git branch --show-current
git status --short --branch
git log -5 --oneline
```

Expected branch: `codex/mindmake-homepage-mock`.

2. Verify the frozen hashes:

```powershell
Get-FileHash -Algorithm SHA256 -LiteralPath `
  'prototypes\mindmake-judgement-thread-motion-study-v5.html', `
  'prototypes\mindmake-brain-gtm-gateway-candidate-7-v2.html', `
  'src\components\mindmake\BrainGtmGateway.tsx', `
  'src\styles\mindmake-gateway.css'
```

3. Read every file in `HANDOVER`, then the source records listed in `HANDOVER/README.md`.

4. Check divergence before pulling or merging:

```powershell
git fetch origin
git rev-list --left-right --count HEAD...origin/main
```

At handover creation, the five-video `origin/main` delta had already been integrated safely at `2c3def0`. Never reset, checkout or overwrite the rebuild if new divergence appears.

## Phase 1: reproduce the checkpoint evidence

Run:

```powershell
npm test -- --run
npx tsc --noEmit
npm run build
```

Then run the public contract and source-diff checks already used by the repository. Inspect `package.json`, `src/test/mindmake-public-contract.test.ts` and the commands recorded in `project-documentation/REBUILD_STATE.md` before inventing new scripts.

Interpret output honestly:

- stale Browserslist data is a warning;
- Vite React plugin option deprecations are warnings;
- the full lint baseline is not clean;
- active changes must not add a lint error or warning beyond the recorded baseline.

If a frozen hash or public-contract assertion fails, stop and inspect before fixing. Do not regenerate a frozen source from memory.

## Phase 2: inspect the current user experience without changing it

Start the local server on a known port and record it:

```powershell
npm run dev -- --host 127.0.0.1 --port 43121
```

Check at minimum:

- `/`
- `/ai-brain`
- `/ai-gtm`
- `/case-studies`
- `/blog`
- one article
- `/faq`
- `/new-age-leadership`
- `/contact`
- `/privacy`
- `/terms`

Viewports:

- 1440 by 1000
- 390 by 844
- 320 by 568
- 844 by 390

Confirm the QA findings in file 03. The first task is to reproduce the pass, not create a new direction.

## Phase 3: create a Vercel preview

The checkpoint branch should be pushed before Claude begins. If it is not, stop and ask rather than silently committing unrelated work.

Create or use a branch preview only. Do not point `mindmake.co`, `themindmaker.ai`, `content.mindmake.co` or `ctrl.mindmake.co` at it.

Preview checks:

1. Every indexed route returns the intended HTML and title.
2. Unknown direct URLs return a real HTTP 404, not only a client-side not-found screen.
3. Sitemap, `llms.txt`, canonical URLs and prerender output use the right public domain.
4. All redirects are one hop.
5. No old booking, offer or private-money copy appears.
6. No browser error, broken asset or media failure appears.
7. The exact gateway still matches the frozen source at 1440, 390 and 320 pixels.
8. The flag-off Start-here journey gives a complete useful download without collecting contact identity, storing a lead or sending a hand-off email. Its company-domain call to `enrich-company` remains expected and must match the privacy wording.

Do not merge merely because the Vercel build is green.

## Phase 4: make V2 lead delivery real in preview only

Do this only after the front-end preview is stable and Krish approves moving into the private hand-off gate.

### Database

1. Apply `supabase/migrations/20260826123007_mindmake_brief_requests.sql` to the preview project only.
2. Run database lint and security advisers.
3. Prove browser roles cannot read the private schema.
4. Prove browser roles cannot call private RPCs.
5. Obtain Gate-B approval for the proposed purge periods, deletion process and matching privacy wording in file 06, then implement and verify them before publishing those periods.

### Edge Function

Deploy `submit-mindmake-brief` to preview only.

Required symbolic secrets and configuration:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `MINDMAKE_RATE_LIMIT_SALT`
- `MINDMAKE_VERIFICATION_SECRET`
- `MINDMAKE_BRIEF_FROM`
- `MINDMAKE_OPERATOR_EMAIL`
- `MINDMAKE_PUBLIC_URL`
- `MINDMAKE_ALLOWED_ORIGINS`
- the configured enrichment-provider keys used by `enrich-company`

Never put secret values in the repository, handover, screenshots or command output.

### Required end-to-end matrix

Use synthetic inboxes and synthetic company data where possible.

Test:

- initial request;
- valid verification;
- invalid code;
- expired code;
- locked code;
- resend;
- changed email;
- double-click and retry idempotency;
- visitor email failure with operator success;
- operator email failure with visitor success;
- provider timeout and safe fallback;
- comma-integrity regression in both delivered briefs;
- allowed preview origin;
- rejected unknown origin;
- publication choice off;
- publication interest on without auto-subscription;
- no duplicate lead, visitor email or operator email after retries.

Only after this matrix passes may `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` be true on a preview deployment.

## Phase 5: physical mobile and accessibility gates

Before production:

- iOS Safari on a physical phone;
- Android Chrome on a physical phone;
- VoiceOver on iOS;
- TalkBack on Android;
- on-screen keyboard at every brief input;
- safe-area behaviour;
- download behaviour;
- mobile video behaviour;
- menu plus privacy notice;
- route navigation and browser Back;
- reduced motion;
- touch swipe and snap rails.

Do not replace these gates with resized desktop Chrome screenshots.

## Phase 6: final content and proof check

1. Verify every quote against `BRANDS_AND_TESTIMONIALS.md`.
2. Keep customer outcomes, testimonials and attendance proof separate.
3. Confirm Steph consent at runtime or omit Steph.
4. Check every public claim for current evidence.
5. Run current-source evidence research before publishing new AI GTM market claims.
6. Verify `https://content.mindmake.co` as the existing Substack publication. Keep the homepage's plain `Read and subscribe` link to that destination; do not add a second embedded form, marketing database or subscriber relationship.
7. Confirm the two editorial pillar wordmarks work on light and dark surfaces.
8. Keep newsletter choice separate, optional and unticked.

## Phase 7: repository and documentation hygiene

Run the exact hygiene process in file 05 only after the preview and dependency audit pass. Cleanup is not a visual redesign and must not change frozen output.

## Phase 8: release-candidate approval boundary

Present:

- preview URL;
- automated results;
- visual evidence;
- lead-delivery evidence;
- physical-device evidence;
- privacy and retention implementation against the Gate-B-approved schedule in file 06;
- exact cleanup diff;
- known residual issues.

Then use file 06 as the continuous production and domain runbook. It defines separate approvals for:

1. merge to `main`;
2. production backend configuration;
3. public-site promotion and core-domain routing;
4. publication and CTRL subdomains;
5. enabling production V2.

Do not bundle those approvals.

## Phase 9: execute the one-pass launch runbook

Continue with `06_ONE_PASS_LAUNCH_DOMAIN_AND_LEAD_RUNBOOK.md`. Complete its access preflight, preview backend, preview front end, V2 email matrix, retention implementation, email authentication, source reconciliation, release-candidate QA, production rollout, domain cutover, rollback verification and final repository hygiene.

Do not ask Krish to choose between already settled destinations. The topology and rollback rules are fixed in file 06. The sender, mailbox and retention periods are explicit launch defaults, not hidden assumptions: confirm them at Gate B together with provider access and privacy wording. The only route resolved through evidence rather than preference is `/builder-economy`, using file 06's ownership check.

Krish may grant every named gate in one explicit approval. Even then, execute the gates sequentially, preserve the evidence at each boundary and stop on any failed check.

## Safe Git practices

- Do not use `git add .` or `git add -A` in the current dirty repository.
- Never stage the accidental zero-byte file `x.name)`.
- Do not use `git reset --hard` or checkout to discard changes.
- Preserve user and prior-agent changes unless their removal is explicitly part of the reviewed cleanup batch.
- Inspect `git diff --cached --stat` and `git diff --cached --check` before every commit.
- Scan the staged diff for secrets before every commit.
- Use conventional commit messages.
- Push the continuation branch, not `main`.

## Suggested continuation commits

If further work is needed after the checkpoint, keep it reviewable:

1. `fix(preview): resolve verified route or interaction defects`
2. `feat(leads): verify private Mindmake brief handoff`
3. `fix(content): reconcile final claims and publication path`
4. `chore(repo): remove approved legacy code and assets`
5. `docs(mindmake): leave one current source of truth`

Do not mix a visual redesign, database rollout and mass deletion in one commit.
