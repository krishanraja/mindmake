# QA, release and repository hygiene

The end state is not merely a working website. The repository must leave one clear current product truth, preserve useful history deliberately and remove dead public code and assets without destroying evidence or reintroducing a regression.

## Checkpoint QA result

The local front end passed the current automated and visual checkpoint.

Latest targeted automated result:

- 3 test files passed;
- 30 tests passed;
- lead brief, homepage integration and V2 backend core were included;
- the punctuation regression that previously inserted commas after every word is pinned.

Latest visual rerun:

- no unresolved P0, P1 or P2 in the tested scope;
- six key routes passed at 1440, 390 and 320 pixels;
- the 320 pixel privacy-banner menu gap is fixed;
- mobile Start-here focus returns to the visible Menu button;
- the frozen gateway is intact;
- flag-off brief works through useful download without contact identity, lead storage or hand-off delivery; its expected company-domain enrichment call remains visible and privacy-consistent;
- route videos play with no media error.

This does not replace preview, physical-device or V2 provider testing.

## Release gate checklist

### Front-end preview

- [ ] Branch preview builds.
- [ ] All indexed routes return the correct page and title.
- [ ] Unknown direct URL returns real HTTP 404.
- [ ] Sitemap and prerender route sets match.
- [ ] Canonical URLs and crawler text use the intended domain.
- [ ] One-hop redirects.
- [ ] No public diary, price, retired offer or sensitive amount.
- [ ] No browser errors, broken media or overflow.
- [ ] Frozen hashes match.
- [ ] Gateway visually matches at 1440, 390 and 320 pixels.
- [ ] Reduced motion preserves meaning.
- [ ] Flag-off brief downloads correctly, collects no contact identity, stores no lead and sends no hand-off email. Its expected `enrich-company` company-domain call matches the privacy notice.

### V2 private brief in preview

- [ ] Preview migration applied.
- [ ] Database lint and security advisers pass.
- [ ] Private schema cannot be read by browser roles.
- [ ] Private RPCs cannot be called by browser roles.
- [ ] Exact allowed origins configured, with no wildcard.
- [ ] Verification sender and operator recipient checked.
- [ ] Request, resend, changed email, valid, invalid, expired and locked code paths pass.
- [ ] Visitor and operator email failures are independent.
- [ ] Retry and double-click create no duplicate lead or email.
- [ ] Delivered company read preserves normal spaces and punctuation.
- [ ] Publication interest is separate and causes no subscription.
- [ ] Retention and deletion behaviour match public wording.
- [ ] Feature flag enabled only on the tested preview.

### Email identity and retention

- [ ] Gate B explicitly approves the proposed periods, purge mechanism and matching privacy wording before they are published or enabled.
- [ ] Launch-default sender `Mindmake <briefs@mindmake.co>` is verified in Resend, or an explicitly approved replacement is configured.
- [ ] `krish@mindmake.co` can receive operator mail, or an explicitly approved alias/recipient is configured.
- [ ] Verification and visitor emails use `krish@mindmake.co` as Reply-To. Operator emails are sent To the operator mailbox and use the verified visitor email as Reply-To.
- [ ] Existing MX remains intact.
- [ ] Exactly one valid SPF policy exists.
- [ ] DKIM passes for the transactional sender.
- [ ] DMARC alignment passes in a synthetic inbox.
- [ ] After Gate-B approval, unverified requests purge after the approved period. Proposed default: 7 days.
- [ ] After Gate-B approval, rate-event hashes purge after the approved period. Proposed default: 48 hours.
- [ ] After Gate-B approval, verified lead, consent and delivery records purge after the approved period. Proposed default: 12 months unless deleted earlier through the verified private process.
- [ ] Daily purge is private, idempotent and monitored.
- [ ] Privacy wording matches the implemented schedule and providers.

### Domains and hosting boundaries

- [ ] Current NS, A, AAAA, CNAME, MX, TXT and CAA records are recorded before mutation.
- [ ] Current production deployment and every rollback target are recorded.
- [ ] `mindmake.co` serves the reviewed `mindmake` Vercel deployment.
- [ ] `www.mindmake.co` redirects path-for-path and query-for-query to the apex.
- [ ] `themindmaker.ai` and `www.themindmaker.ai` redirect path-for-path and query-for-query to the apex.
- [ ] `content.mindmake.co` serves the existing Substack publication and its subscribe flow.
- [ ] `mindmakerlive.substack.com` remains available as provider fallback.
- [ ] `ctrl.mindmake.co` serves the existing CTRL product from its own hosting project.
- [ ] CTRL auth, API, session, callback and deep-link checks pass before the old CTRL host redirects.
- [ ] `ctrl.themindmaker.ai` redirects path-for-path and query-for-query only after the new CTRL host is healthy.
- [ ] No wildcard DNS record or accidental cross-project hostname exists.
- [ ] Certificates, redirect hops, canonical URLs and cache behaviour pass from two networks.

### Physical devices and accessibility

- [ ] iOS Safari.
- [ ] Android Chrome.
- [ ] VoiceOver.
- [ ] TalkBack.
- [ ] Keyboard-only desktop pass.
- [ ] On-screen keyboard at every brief step.
- [ ] Safe-area and browser-bar behaviour.
- [ ] Menu, consent notice and Start-here focus restoration.
- [ ] Video playback and fallback.
- [ ] Download on both mobile platforms.

### Content and legal

- [ ] All claims have current evidence.
- [ ] Customer outcomes, testimonials and attendee proof stay separate.
- [ ] Steph appears only with available consent.
- [ ] Quotes remain verbatim.
- [ ] Privacy notice names actual providers and behaviour.
- [ ] Retention period is approved and implementable.
- [ ] Publication URL and embed are verified.
- [ ] Newsletter choice is separate, optional and unticked.
- [ ] No personalised recurring nurture is implied or activated.

### Approval boundary

- [ ] Krish reviews preview.
- [ ] Krish separately approves merge.
- [ ] Krish separately approves production configuration.
- [ ] Krish separately approves production promotion and core-domain routing.
- [ ] Krish separately approves publication and CTRL subdomains.
- [ ] Krish separately approves enabling production V2.

## Documentation hygiene target

The final repository must have one obvious current truth.

### Current authority files

Keep these concise and current:

- `CLAUDE.md`: contributor guard and non-negotiables.
- `project-documentation/MINDMAKE_CANON.md`: business, offer, conversion, voice and design truth.
- `project-documentation/REBUILD_STATE.md`: current implementation and release state.
- `project-documentation/BRANDS_AND_TESTIMONIALS.md`: proof rights and wording.
- `project-documentation/MINDMAKE_LEAD_DELIVERY_SPEC.md`: private lead-delivery contract.
- `project-documentation/MINDMAKE_REBUILD_QA_2026-08-23.md`: latest evidence and open gates.
- `project-documentation/README.md`: authority map and archive index.

### Historical records

`DECISIONS_LOG.md` and old research can retain superseded decisions only when clearly labelled as history. A future contributor must not mistake an old route, price or offer for the current contract.

After the implementation is stable:

1. Move superseded documents to `project-documentation/archive/` or add a large first-line `SUPERSEDED` banner and link to `MINDMAKE_CANON.md`.
2. Keep dated rationale that explains why a direction was rejected.
3. Remove duplicate current-state summaries once their useful detail has moved into the canon or rebuild state.
4. Update every live document's `Last updated` date.
5. Update `project-documentation/README.md` so the authority order is explicit.
6. Run a link check across every Markdown file.

### Explicit contradiction queue

These were found during handover audit. Do not let Claude infer product truth from them.

| Current conflicting surface | Superseded material present | Required final action |
|---|---|---|
| `project-documentation/BRANDING.md` | Mindmaker Live, `live.themindmaker.ai`, paid tiers and Builder Economy sister-domain guidance | Move durable brand history to the archive, mark the file `SUPERSEDED`, or replace it with a short pointer to `MINDMAKE_CANON.md`. |
| `project-documentation/ARCHITECTURE.md` | `thebuildereconomy.com`, old Resources navigation, `ScopingModal`, old email and CTRL waitlist architecture | Rewrite from the actual final route and deployment graph. Keep only architecture that exists after cleanup. |
| `project-documentation/FEATURES.md` | Old Builder Economy route, `ScopingModal`, CTRL waitlist and `ctrl.themindmaker.ai` | Rewrite from imported routes and deployed functions after the dead-code audit. |
| `project-documentation/DEPLOYMENT.md` | Tests for old scoping and CTRL email flows | Replace with the file-06 environment, V2, email, domain and rollback procedure. |
| `project-documentation/CTA_PATH_AUDIT.md` | Old production URL and Mindmaker Live journey | Update to the final `Start here`, Media and private-brief path or archive as dated evidence. |
| `project-documentation/COMMON_ISSUES.md`, `REPLICATION_GUIDE.md`, `MINDMAKER_LIVE.md`, `mindmaker_rebuild_brief_v4.md`, `HOMEPAGE_COMPARISON_MATRIX.md` | Old brand, route and domain instructions | Archive with a first-line `SUPERSEDED` banner and pointer to the current canon; retain only if the dated history is useful. |
| `project-documentation/mindy/` | Old CTRL hostname, pricing and self-serve direction | Remove from current authority. Archive or rewrite only after confirming whether any internal Mindy material is still used outside the public build. |
| `scripts/TEST_EMAIL_FLOWS.md`, `scripts/test-email-flows.ts`, `scripts/send-test-emails.ts` | Old operator mailbox and legacy email surfaces | Delete if their imports and package scripts are dead; otherwise rewrite tests for `submit-mindmake-brief` and synthetic recipients. |
| `.env.example` | `operator@mindmake.co` placeholder | After Gate-B mailbox confirmation, change the example to the approved operator mailbox; retain secrets as symbolic values only. |
| `src/lib/publicLinks.ts`, `src/components/mindmake/MindmakeShell.tsx`, `src/pages/Index.tsx`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`, `vercel.json` and redirect tests | Raw Substack destination | Change active public links to `https://content.mindmake.co` after the custom domain is verified. Resolve `/builder-economy` separately with the ownership check in file 06. |
| Dormant `InitialConsultModal`, `ScopingModal`, `CtrlWaitlistPopover`, `TwoDoors`, retired offer pages and related utilities | Old mailbox, booking, CTRL and offer destinations | Prove they are not imported by the final route graph, then delete them and their tests/assets as one reviewed batch. Do not mechanically change their strings and leave dead code behind. |

After this queue is processed, rerun the scans below plus:

```powershell
rg -n -i "live\.themindmaker\.ai|mindmakerlive\.substack\.com|thebuildereconomy\.com|ctrl\.themindmaker\.ai|krish@themindmaker\.ai|operator@mindmake\.co" `
  README.md CLAUDE.md HANDOVER project-documentation src public scripts vercel.json .env.example
```

Allowed remaining matches are limited to:

- a clearly labelled archive or dated decision history;
- the operational Substack fallback in file 06;
- an explicit redirect test proving an old hostname reaches the new one.

### Contradiction scan

Use the scan as a review list, not a blind replacement:

```powershell
rg -n -i "254k|book a fit call|calendly|21-day|21 day|sprint|diagnosis room|the teardown|the handover|improve what you sell|mindmaker live|legacy ascend|public price" `
  README.md CLAUDE.md HANDOVER project-documentation -g "*.md"
```

Allowed matches:

- a clearly marked historical decision;
- a warning that says not to reintroduce something;
- the canonical statement that no public diary or price exists.

Every other match must be removed, corrected or archived.

Search public source and generated files separately:

```powershell
rg -n -i "254k|book a fit call|calendly|21-day|21 day|the teardown|the handover|improve what you sell|legacy ascend" `
  src public scripts index.html vercel.json
```

The public scan should return only intentional tests or redirect protections.

## Code and asset hygiene target

Do not run mass deletion before preview passes.

### Active route audit

Start from `src/App.tsx`. For every page and component candidate:

1. Search imports with `rg`.
2. Check dynamic imports and data references.
3. Check tests and scripts.
4. Check CSS selectors and media references.
5. Remove one coherent batch.
6. Run full tests, build, crawler checks and visual QA.

Likely dormant legacy areas include old Sprint, Teardown, Handover, Capital, booking and superseded homepage components. Their presence is not authority to expose them again.

### Prototype policy

Keep permanently:

- frozen V5;
- frozen candidate 7 V2;
- any small asset required for those files;
- V8 only while it remains necessary as breadth evidence.

For every other prototype:

- extract the lesson into `DECISIONS_LOG.md` or `_corpus`;
- archive it outside the active prototype set or delete it only after explicit approval;
- do not leave dozens of numbered files that look equally current.

A recommended final active structure is:

```text
prototypes/
  approved/
    mindmake-judgement-thread-motion-study-v5.html
    mindmake-brain-gtm-gateway-candidate-7-v2.html
  archive/
    README.md
```

Changing paths of frozen files also requires updating their recorded paths and hash tests. Do that only as one explicit cleanup change.

### Public media

The build currently copies substantial legacy media from `public`. A previous audit estimated about 73 MiB of unused public media.

For each file:

1. Search source, CSS, HTML, scripts and generated output.
2. Check whether it is a fallback for an approved prototype.
3. Check case-sensitive path behaviour for Vercel.
4. Remove only the proven-unused set.
5. Build and crawl every route.
6. Open all video and image surfaces on preview.

Do not purge old brand assets until the new wordmark, owl icon, favicon, social image, email brief and publication surfaces have all been verified.

### Accidental and local-only files

- Never stage `x.name)`. It is an accidental zero-byte file.
- Do not commit local QA screenshots, browser profiles, provider inbox data or secrets.
- Keep scratch evidence under the configured scratch or visualisation directory, not the repository.
- Review `_corpus/` separately. It is internal evidence and must not leak client data or become public build input.

## Git hygiene

Before each commit:

```powershell
git diff --cached --stat
git diff --cached --check
git status --short
```

Also scan the staged diff for common credential patterns and inspect every added binary by path and expected hash.

Never use `git add -A` in this repository until the accidental file and historical prototype set have been resolved.

After the final cleanup:

```powershell
git status --short --branch
git ls-files | Sort-Object
npm test -- --run
npx tsc --noEmit
npm run build
npm run lint
```

Compare lint with the recorded baseline. The goal is no new issue, then a separate deliberate lint-debt reduction if desired.

## Final definition of clean

The job is clean only when:

- one current canon exists;
- every historical contradiction is labelled or archived;
- public routes expose no retired offer or booking path;
- dead code is removed after dependency proof;
- unused media is removed after preview proof;
- frozen design sources remain exact;
- generated crawler files match routes;
- the private lead pipeline's claims match real behaviour;
- no credential, client data or private amount is committed;
- tests, build, route, accessibility, mobile and provider checks pass;
- the branch is reviewable in logical commits;
- production promotion remains a separate explicit decision.
