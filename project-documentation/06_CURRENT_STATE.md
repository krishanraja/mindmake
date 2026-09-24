# Mindmake current state

Last updated: 24 September 2026 (approved R3 live and actual lead-to-download canary verified).

This file is the current delivery truth for `mindmake.co`: what is live, at which identifiers, and what remains open. Why the business exists is in `00_NORTH_STAR.md`. Commercial truth is in `01_CANON.md`. Design truth is in `03_DESIGN_CONTRACT.md`. The dated record of past deployments, repairs and readings that used to sit below the open items is in `history/LOG.md`, newest first; nothing there describes today.

## Current release status — 24 September 2026

The approved R3 production adapter is **live** at `https://mindmake.co`. PR #170 merged as `3ee77cf9956f98dd73f69d0b48745930335e74e1`; production deployment is `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8` (`mindmake-bh0d8hczk-krish-rajas-projects.vercel.app`). Pre-publish CI passed 531 tests, 208 route cases and nine navigation supplements, plus all motion/fallback cases on Linux and macOS. Actual public readback and the live three-engine scroll matrix passed. Current authority, evidence and rollback anchor are in [RELEASE-2026-09-24](website-redesign/RELEASE-2026-09-24.md); older identifiers below are historical.

The bounded backend repair **is deployed** to project `bkyuxvschuwngtcdhsyg`: `enrich-company` v44, `submit-mindmake-brief` v20, `mindmake-personal-read` v25. The final two version increments correct type-only lint errors; emitted runtime JavaScript is unchanged and all deployed source files were read back. Exact-domain provider checks and independently corroborated identity gate the company read. Factual descriptions quote literal corroborated provider evidence, not model paraphrases; news uses literal first-party source titles. The documented owned alias `themindmaker.ai` canonicalizes to `mindmake.co` for research/signatures only, never the recipient address. Arbitrary redirects and lookalike domains are not trusted.

Fresh canonical and legacy reads passed. Earlier backend preparation used the previous frontend and the public personal-read API; those receipts remain separate. After promotion, the actual new company-first frontend journey passed company research, profile/problem/time selection, brief preview, email verification and success. Verification, visitor brief and operator digest all reached the designated INBOX. The persisted brief was ready and exactly one day-14 follow-up existed. The actual success-screen download contained 15 fragments matching the live brief, had no external requests, and passed desktop/mobile overflow and visual checks. Evidence, captured synthetic IDs and cleanup, exact function versions, source readback and limits: [backend release evidence](website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md), including its final live-frontend addendum. No cron sender was invoked.

The backend targeted suite passed 67 tests across three files; all three Deno closures passed. The full release matrix passed separately. Physical iPhone VoiceOver and Android TalkBack remain unperformed under the owner's release-only exception. The authorized npm audit recorded 23 advisory package entries; bounded and independent applicability reviews found no confirmed visitor-reachable blocker in this static release, while leaving dependency upgrades open. Neither exception nor advisory triage is a blanket quality/security claim.

## Historical frontend baseline — recorded 7 September 2026

**The rebuild is live.** The homepage, `/ai-brain` and `/ai-gtm` were rebuilt, the six films were installed, and it was promoted to production on 28 August 2026. The edge rewrite of 5 September 2026 (what the work answers, said once, with no public duration) is the latest promotion.

- Site status: **LIVE**. `https://mindmake.co` launched 26 August 2026 and now serves the rebuild.
- Production: commit `6d39665` on `main` (5 September 2026, "The edge rewrite: what the work answers, said once, with no public duration", pull request #154), Vercel production deployment `dpl_ZU6oQorQQcgpiD5YHARRFZHLo3Rg` on project `mindmake` (`prj_GqamX3psD0cGpGCDXRu0ljET7zap`). The chain of deployments before it, from the 28 August rebuild (`dpl_HAoncV1RF3hcvcanqo7Yvc4tuAng`, pull request #152) to the 4 September builds, is in `history/LOG.md` under 2026-09-07 and 2026-09-04.
- Rollback target: `dpl_5saD1mJed9NpT9oXA6wgGHSUPGnz`, the 4 September build for commit `0704583` ("What a crawler and a share card are given"), which is the production deployment the edge rewrite replaced. Never `dpl_AFyoEwjLzuG3wr93xuXAYFhVay9a` (3 September): that build carries the curtain defect recorded in the LOG under 2026-09-04, and rolling back to it would ship that again.
- Verified live after the 5 September promotion: the new hero on `/`, the private answer on `/`, `/ai-brain/`, `/ai-gtm/` and `/faq/`, `llms.txt` carrying the new first line, and no duration promise on any of them. `submit-mindmake-brief` v16 was deployed after the promotion in the runbook's order and probed live (a wrong origin is 403, an unexpected field is 400 naming it). One synthetic end-to-end lead from `https://mindmake.co` ran clean: verification code delivered and confirmed, visitor and operator deliveries both queued, the results email carrying "A USEFUL FIRST PROOF" and the new pressure line, exactly one `follow_up_queue` row due fourteen days out. Both rows were then deleted and read back as gone.
- On `main` after the promotion, all 7 September 2026: Krish's revision of the thirty-three testimonials (`20ef51f`, declared canon), the excerpts cut again so every one is an exact substring of the revised quote (`ad345f4`), the story deck reading its quotes and roles from `src/data/testimonials.ts` at import so there is one copy of every quote (`eb06329`, pull request #156), and the media CRO's story swapped for one that fits the revised quote, same record R-08, id `expensive-decision` to `day-one` (`218dc14`, pull request #157). `04_PROOF.md` and `04_PROOF_RECORDS.md` carry the same text. A merge to `main` builds and promotes production; no production readback of these is recorded here. The record is in `history/LOG.md` under 2026-09-07.
- Domains are unchanged: `mindmake.co` is canonical (Vercel DNS); `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` 308-redirect to the apex in one hop with path and query preserved. The publication stays at `https://mindmakerlive.substack.com`. CTRL serves at `ctrl.mindmake.co`.
- Routes did not change with the rebuild: it replaced what the three pages say and how they behave, not the route contract, so every redirect and crawler surface keeps its shape. Since 4 September 2026 one URL form is canonical: `vercel.json` sets `trailingSlash: false`, so `/ai-brain/` is a 308 to `/ai-brain`; `/intake` and `/testimonials` redirect permanently; `/start` and `/decision` stay temporary on purpose, as short links people type.

## Current approved release journey

The homepage is the accepted R3 composition: opening, historical stories, work and organisation, leadership dividend, the AI Brain / AI GTM route choice, and footer. Its history and dividend chapters use native reversible scroll-pinned sequences, with natural-flow controls for reduced-motion or insufficient-height viewports. The separate new-age leadership route remains the approved companion page.

Both public doors and the homepage open the same production `LeadBrief`. The visitor enters a work email, adds their name and business role, sees the corroborated company read, chooses a problem and where returned time would help, then sees what AI can carry, what stays with them and a useful first proof. Keeping the brief is an explicit action followed by email verification. The delivered proposal remains visible and downloadable independently of email delivery. No step silently subscribes the visitor to the publication.

The older personal-read API remains deployed and was separately verified; it is not evidence of a distinct personal-read form in this new frontend. The historical live-board layout described below is not the approved R3 homepage. Current public labels are Results, Thinking, Questions leaders ask, Before you start, Media and Start here.

## Historical visitor journey (recorded 7 September 2026)

Two doors, one paid proof, and two ways to be read.

Both doors ask for the same four things, in the same component, with the same rules: first name, last name, work email and the part of the business they work in. The company comes out of the email's domain, so nobody types it twice, and a personal address is refused on both sides with a message that puts the limitation on us rather than on the visitor. What each page does with those four things is different, and deliberately so.

- **The company read** (`/ai-gtm`): the details hand to the existing brief pipeline, unchanged, and the six-digit code still stands between the visitor and anything reaching us. This is the Gate E hand-off approved on 27 August 2026, reached from a new place. The read the visitor came for is the preview step. The branded proposal then arrives on screen, by email and as a self-contained attachment, as the canon promises; on screen it wears the step's own surface, and paper is for the email and the attachment. `src/test/proposal-on-screen.test.tsx` holds it there, because on 29 August 2026 it was removed for a whole commit without a gate objecting and put back the same day.
- **Every dead end** (site-wide): nine paths can fail, and each one now ends in
  an apology, a dry line about our own machine and one way to reach a person
  rather than in a line of grey text with nothing under it. The offer posts to
  `mindmake-personal-read`, which tells the operator and sends the visitor
  nothing, because two emails ever is a published promise and a handoff is
  neither of them. `05_LEAD_DELIVERY_SPEC.md` lists the nine, the two paths that
  deliberately have none, and the three things about the action that are there
  to stop it failing for the reasons the read did.
- **The personal read** (`/ai-brain`): the server resolves the company from the email domain and the person from their name plus that company, and the read assembles on screen in the same grid the company read uses. It used to want a LinkedIn URL, which most people have to go and find, and composed a preview locally from two template lines, so everyone who tapped the same chips saw the same thing. A read that resolves the company but not the person says so on the page rather than passing itself off as more than it is. The preview now costs a paid provider call, so it sits behind the same rate limiter the send does.
- **The live board** (`/ai-gtm` and the homepage): since 2 September 2026 a departures board on both surfaces, rows rather than cards, filtered by the part of the business the reader runs (the site's own eight divisions, the same list the lead dialog asks for) and by industry. It reads the retained window rather than the day: seven days on the homepage, 28 on `/ai-gtm`. Every row carries its own age, the stamp beside the heading carries the read time and the item count, the row count follows the screen's height (three rows below 700px, four on a tall phone, eight on a laptop), and every headline is written out in full in the markup before anything turns. If the read is unavailable the section shows a heading and one honest line; it never renders an empty frame. Fed by the public `get-ai-news` function from the daily cache.
- **The why** (`/new-age-leadership`): the argument page, rebuilt on 2 September 2026 as a set of the site's own instruments with one line on each, linked once from the homepage. It is the one page whose job is the reason rather than the brief.

Every visitor who converts receives exactly two emails: the results they asked for, and one follow-up fourteen days later. Nothing else, ever. The mechanism is a unique row per address per journey, not a policy anyone has to remember.

## Lead and data backend

Supabase project `bkyuxvschuwngtcdhsyg`.

| Function | Version | verify_jwt | Role |
|---|---|---|---|
| `submit-mindmake-brief` | v20 | off | Verified code, company brief, visitor/operator delivery and day-14 enqueue; uses the corroborated literal company read and owned-alias choice binding |
| `enrich-company` | v44 | on | Exact-domain and corroborated identity; literal factual read and first-party source titles; tailored choices retained |
| `get-ai-news` | v70 | off | Live board/cache read; version read back on 24 September, not redeployed by this repair |
| `mindmake-personal-read` | v25 | off | Personal read, results email and follow-up enqueue; canonical owned-domain lookup; existing handoff retained |
| `send-follow-ups` | v5 | off | The day-14 follow-up. Cron only. v5 (5 September 2026) carries the duration-free proposal copy; both of its files read back byte-identical to the repository |
| `aa-price-snapshot` | v3 | off | Daily model prices. Cron only; version read back on 24 September, not redeployed by this repair |

- Migrations added: `mindmake_follow_up_and_personal_read`, `aa_model_snapshots`, `mindmake_scheduled_jobs`, `mindmake_public_rpc_wrappers`. All four are idempotent and all four are registered in the remote migration history, so the repository and the database agree. On 29 August 2026 `handoff_reason` was added to `public.mindmake_personal_reads`, `q1` and `q2` became nullable under `mindmake_personal_reads_shape_check`, and the table still carries zero policies.
- New tables are RLS-on with no policies, reachable only by the service role. No existing policy was loosened and no anon policy was added to anything.
- Scheduled jobs: `mindmake-brief-retention-daily` (`17 2 * * *`), `mindmake-follow-up-daily` (`20 9 * * *`), `mindmake-aa-price-snapshot-daily` (`0 11 * * *`). The two new jobs call their function over HTTP with the Vault secret `mindmake_cron_secret` in the `x-mindmake-cron-secret` header, and each function refuses without it. This is the pattern the project's eight existing jobs already use.
- Price history: 624 rows for 28 August 2026, the first day. This is the one thing here that cannot be back-filled, which is why it runs before anything renders it.
- Configuration names are unchanged from Gate E, plus `MINDMAKE_CRON_SECRET` for the two scheduled functions.
- Retention: unverified brief requests purge after 7 days, rate-limit hashes after 48 hours, verified records at 12 months, sent follow-up rows after 7 days, unsent rows after 60 days, personal reads at 12 months. The privacy notice states the same schedule.
- `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED` is `true` in production, so the three dead ends inside the lead dialog exist on the live site rather than only in a build with the flag on.

## Historical verification baselines — 5–7 September 2026

Last measured 5 September 2026, against the built output, for the edge rewrite. The readings that set each gate's floor, and every earlier baseline, are in `history/LOG.md` under the date they were taken.

- Tests: **450 across 29 files**, all passing.
- Typecheck: **0 errors**, against `tsconfig.app.json`, and the build runs it first.
  An earlier version of this file claimed `tsc` was clean when it had never run:
  the root `tsconfig.json` carries `"files": []` with project references, so
  `npx tsc --noEmit` checked nothing and exited 0 over seventeen real errors.
  Never point the typecheck at the root config.
- Lint: **0 errors, 2 warnings** (react-refresh advisories in two long-standing files). Do not add new problems.
- Build: prerenders **21 indexed routes**; the sitemap and prerender parity check runs inside the build. One social plate per indexed page and post, 21 in all, painted by a browser and committed, and `src/test/discoverability.test.ts` fails until a changed headline is repainted with `npm run social-plates`.
- Browser gates, every one green at 1440 and 390 on the built output: rhythm (45 sections across 4 pages), screens (8 sizes, 4 pages, nothing past 1.35), one way in (10 pairs), no-JS (5 pages, 50 answers present), cards (18 on `/`, 33 on the archive), images, dead CSS, chrome (its own eight sizes and two text scales), dialog shape, handoff, redirects, entrance (clean on every path, page replaced 0x), and aliveness (30 viewports at 1440, 33 at 390). What each gate measures, why it exists and how its floor was calibrated is in `CLAUDE.md` under "Required checks".
- Quotes (7 September 2026): every excerpt in `src/data/testimonials.ts` is an exact substring of its revised full quote and within the 108-character cap, and each of the eight client stories in `src/data/rebuildProof.ts` names its voice and takes the whole quote and the role from that file; `src/test/testimonials.test.ts` holds both. Measured on the rail at nine widths from 320 to 1920 on `/` and `/case-studies/`: every card equal at 177.3px from 360 up, nothing clipped. Tests 450 across 29 files, lint 0 errors and 2 warnings, typecheck 0 errors, unchanged; cards, screens and no-JS gates green on the built output.
- Rendered DOM of the seven routes scanned: no duration promise, no em dash, no `judgment`, the operator's name only in the founder section, the drum heading and quotes.
- The two-email cap was proven rather than asserted on 29 August 2026: three successful sends to one address produced exactly one queue row, and the fourth was rate-limited. Test rows were deleted afterwards.
- Historical 7 September position: the V5 motion study, gateway candidate and V8 mock locks had been removed. **Superseded on 24 September:** the accepted R3 prototype is immutable, its production adapter is deterministically compiled and drift checked, and the current release requires source-bound browser evidence. See the release record above; the old no-lock statement is not current policy.

## Names you will meet, and what they are

None of these is a brand. They are identifiers that exist in live infrastructure
or in the project's own history, and they are listed so nobody has to guess.

| You will see | What it is |
|---|---|
| `themindmaker.ai` | An older domain that 308-redirects to `mindmake.co`. It runs Google Workspace, so `krish@themindmaker.ai` is the only mailbox that actually receives, which is why the site's contact links point there. |
| `mindmakerlive.substack.com` | Where the publication is hosted. An address, not a name. |
| `Mindmaker LLC` | The registered legal entity. It appears in the privacy notice and the terms and nowhere else. |
| `Mindmaker AI` | The Supabase project's display name in that dashboard. Cosmetic, and renaming it is not worth a migration. |
| `makeyourmindup.ai` | An older CTRL host. `ctrl.themindmaker.ai` still redirects there; open item 8 is to repoint it at `ctrl.mindmake.co`. |
| `mm-ctrl` | The Vercel project that serves CTRL. Not this repository. |
| `/signal`, `/builder-economy` | Retired routes that now redirect to the publication. They were earlier names for editorial strands; the publication's only channels are The Money of AI and Built with AI. |
| `get-model-data` | A deployed edge function with no caller in this repository. Open item 6. |
| `aa-price-snapshot`, `ARTIFICIALANALYSIS_API_KEY` | The daily price recorder and its data source, Artificial Analysis, a published model price and benchmark index. |
| `Gate E` | The owner's approval, on 27 August 2026, that the private email hand-off could go live. The gate letters are a historical sequence and only E still matters. |
| `Legacy Ascend` | The programme a named reference took part in, and the consent record her quotes are gated on. If that record is missing, the quotes do not render. |
| `Lightning Lesson` | A third-party teaching format the founder has run, counted in the evidence trail for the retired reach claim. |
| `mind/make` | The wordmark as it is set in the header, with a slash. It is a typographic treatment of Mindmake, not a second name. |
| The enemy pair, the ladder, the fork, the board | Homepage and door-page sections. The enemy pair is the oracle and the mirror cards resolved by one claim (the `mm-enemy` class now carries the three things the work answers on the homepage); the board is the live daily market read on `/ai-gtm` and the homepage. The ladder (the three levels of value, `ClimbLadder`, the site's one pinned climb) and the fork (`ForkBand`, the paper band where a visitor picked a starting point) were deleted from `/ai-brain` on 5 September 2026 because they made the argument the homepage and `/new-age-leadership` already make; the names survive only in the record. |
| `mm-covered`, `.mm-curtain` | The entrance's root marker and the fifteen ink strips it keys, two names on purpose since 4 September 2026. `var CURTAIN` in `index.html` is the one switch. |

## Historical open-item register — retained from 7 September 2026

These entries retain their original dated context; they are not a claim that only one item remains for the 24 September release. Current release gates and the narrowly scoped physical-AT exception are recorded above and in the release record.

1. **The branded mailboxes are the one thing still owed.** See item 3. Everything else the rebuild needed is live.
2. **The day-14 follow-up is live, and the first one can send on 11 September 2026.** `submit-mindmake-brief` v13 was deployed straight after the 28 August promotion, so the enqueue and the privacy notice describing it went live together. The deployed body was verified to carry it. `follow_up_queue` was empty at that moment, so nothing predates the notice.
3. **The branded mailboxes do not exist yet, and the site does not pretend they do.** `mindmake.co` has no MX record, so `hello@mindmake.co` and `privacy@mindmake.co` would bounce. Every contact link therefore reads one constant, `CONTACT_EMAIL` in `src/lib/publicLinks.ts`, currently set to the mailbox that does receive. To switch: add the MX record, create the two aliases, change that one constant.
4. **The films are the real delivery.** Six films landed on 28 August 2026, each with an mp4, a webm and a poster taken from its own first frame. Loops are silent and under 1.7MB; the sixty-second proof film on `/ai-brain` is click-to-play and fetches nothing until asked. A twenty-second cut of the proof film also exists in the delivery and is not used on the site yet.
5. **Credential rotation**: rotate the GitHub, Vercel, Supabase and Resend credentials shared during this and the launch sessions.
6. **`get-model-data` v24 is still deployed** with no caller in this repository. Retiring it needs CTRL-side confirmation first.
7. **Physical device checks**: iOS Safari, Android Chrome, VoiceOver and TalkBack remain a post-launch checklist; emulation evidence was accepted for launch.
8. **CTRL old host**: repoint `ctrl.themindmaker.ai` to `https://ctrl.mindmake.co` after one confirmed authenticated CTRL login on the new host.
9. The `themindmaker.ai` Resend domain still shows a failed verification; legacy senders on that domain stay unreliable until its DNS is repaired or the domain is retired from Resend.

Carried from the dated entries, still open on 7 September 2026. The reasoning behind each is in `history/LOG.md` under the date given.

10. **Method wording awaits Krish** (3 September): the one sentence on the method on the brain door, and the "How it learns you." section on `/ai-brain`, were proposed for sign-off. The method is described, never named, per the canon.
11. **CTRL is not yet writing `affects` and `stance`** into `live_headlines_cache` (read directly on 2 September: every retained day reports 0 with either), so the board's role filter still runs on the projection from subject categories. The board's `pov` line stays off until it is written in a voice this site can publish: on the day it was measured 25 of 29 were commands addressed to the reader and 9 carried American spellings. Both are upstream changes to CTRL's classifier, and the addendum asking for them is written. Nothing on this side is waiting; the moment a row carries the fields, they flow.
12. **`get-ai-news` returned one day for a seven-day request** on 3 September. The heading and the stamp are honest either way; the window question is upstream.
13. **`/new-age-leadership` (340KB) and `/blog/:slug` (124KB) stay lazy** against a 348KB entry bundle, and were never measured for the hydration cost. Deliberate, and not known to cost anything, which is not the same as known to be free.
14. **`src/index.css` styles bare `h1` to `h6`, `p` and `small`**, and the privacy strip (4 September) was the third live defect that file has caused. Removing those rules is not a no-op: measured across five pages, paragraphs move from 16px to 17px and the blog's `small` from 14px to 8.4px, because the design system's own defaults have been dead underneath them. That is a change with a visual pass attached.
15. **Share cards**: nothing here can say how a share looks on LinkedIn or on X until one is posted; both cache by URL, so the first share of each page fetches the new plate. A post's plate uses its category's film until it earns a still of its own. The 404 for an unknown route is Vercel's plain text; a branded page would be `dist/404.html`, which the prerender does not write yet.
16. **A face that lands after the 700ms hold can rewrap a line** that sits near its column's edge (seen once on the hero claim through the forwarder on 4 September). Metric fallbacks match average width, not every string. A known limit, recorded rather than fixed by tuning one string.
17. **Pre-existing and out of scope** (3 September): retired routes hydrate the homepage's prerendered markup against a different route; whether a privacy notice is needed at all for cookieless analytics.
18. **Resolved 24 September: wrong-company read for `themindmaker.ai`.** The historical 5 September failure was reproduced and repaired with domain/name corroboration, literal factual evidence and the documented owned-domain alias. Fresh live canonical and legacy reads returned Mindmake; the actual personal-read send passed. The earlier wrong-founder result must not be treated as acceptable provider behavior or current output.
19. **A story that ran on two days is shown once** on the board. Nothing upstream promises an id is unique across days; 28 days of live data had no duplicate on 2 September, which is not a guarantee.
20. **The three-question form on `/ai-brain`** ran 1.88 screens and is exempt from the screen budget by name (last measured 1 September). Making it two steps would fix the height and change a working conversion surface, which is a decision rather than a fix.
