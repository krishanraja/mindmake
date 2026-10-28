# Mindmake current state

Current as of 28 October 2026. This file owns live identities, what was
verified and when, and the known limits. It is current delivery truth, not a
changelog: superseded lines live only in [history/LOG.md](history/LOG.md), and
the whole text this file replaced on 26 October 2026 is kept verbatim in
[history/ARCHIVE.md](history/ARCHIVE.md#archive-2026-10-26-06-current-state-md).
A dated reading below is true on its date, not forever: retrieve the live
deployment before any deployment or rollback.
Commercial authority: 00_NORTH_STAR.md and 01_CANON.md. Design: 03_DESIGN_CONTRACT.md.
Accepted surface and change guards: website-redesign/STATE.md.

## Live release

- Public site: https://mindmake.co. Repository krishanraja/mindmake; a merge to
  main promotes production automatically, documentation-only commits included
  (they do not change the application).
- Vercel project: prj_GqamX3psD0cGpGCDXRu0ljET7zap; team: team_iXZBozK4Ss7NHuyNk8L9wmO6.
- Production follows main, so every commit there deploys, documentation
  included; GitHub's deployment record names the deployment for each commit.
- Latest application release: PR #256, the brief's "Keep the private brief"
  at the bottom right, bigger and pulsing with no line beneath it, and the
  analytics question asked inside the brief, merged on 28 October 2026 on
  Krish's approval (his words: "I also want the green button in the bottom
  right, bigger, pulsing and without the accompanying text beneath it." and
  his choice "Ask inside the brief"); GitHub's deployment record for its merge
  commit names the production deployment. Rollback: the preceding
  production, `ec08a0b` (PR #255). No backend change.
- PR #255 (28 October 2026): the brief request records which growth placement
  it came from and `/privacy` says so, on Krish's approval ("Yes do number
  two"), after the migration and `submit-mindmake-brief` v24 (Backend, below).
- PR #254 (28 October 2026): the brief's steps in Google Analytics after
  Allow and a growth placement's tag held in page memory (Analytics, below).
- PR #250 (26 October 2026), the brief in fewer clicks, merge `6b86220` on
  Krish's approval ("Approved. Merge #250, deploy the brief function, and read
  both back."), production deployment
  mindmake-8wmgynped-krish-rajas-projects.vercel.app: from the homepage hero,
  the footer and `/ai-gtm` on a phone the brief reaches "Check your email." in
  8 clicks (11 on desktop and 14 on a phone before), read back that day.
- The releases before it, newest first, each read back in history/LOG.md under
  its date: PR #248 (26 October 2026, Krish's phone review of S6), PR #246
  (24 October 2026, CI runner pin, no site change), PR #245 (24 October 2026,
  S6, three sections on every page), PR #244 (21 October 2026, the answer hub
  and machine-readable discovery) and PRs #242 and #243 (19 October 2026, the
  two legal entities).
- Main's post-merge route lock on `ad6c1b1` (run 40367119390, the
  documentation audit) passed its source job and its Linux Chromium leg on
  `ubuntu-24.04`. Firefox and WebKit results
  are not read (CLAUDE.md, Krish, 2026-09-26).

## What the live site is

Read back on https://mindmake.co on 26 October 2026. `website-redesign/STATE.md`
owns the accepted detail and `01_CANON.md` the exact copy.

- `/`: the R3 opening (film, a headline that turns through six lines and rests
  on "Promote your AI from intern to chief of staff.", both doors, **Start
  building your AI brain** with "Free and private. It starts with a read of
  your business." beneath, and a publication line), then three sections:
  "Right now, your AI is an intern." with the four eras as a carousel on their
  pictures, "A chief of staff knows how you think." with the organisation and
  the three practice scenes as a carousel, and "Built on your real work. Yours
  to keep." with three results on their stories' pictures; then the footer.
  Nothing on it pins, and the opening grows to hold everything it carries.
- `/ai-brain`: "An AI that thinks like you.", one panel in three beats, what a
  Brain holds beside private to you, the 30 days, the story chooser (seventeen
  stories in five situations, never pinned, the whole story in a sheet), "What
  stays with you" and one line to the revenue engine.
- `/ai-gtm`: "Make your pricing, positioning and team AI-native." in three
  sections on the r47 rebuild (`AI-GTM-R47-OWNER-REVIEW-001`, accepted:
  "I approve the /ai-gtm rebuild"); nothing pins; **Start building your AI
  revenue engine**.
- `/new-age-leadership`: the approved companion. It keeps its own pinned
  history, reach and practice chapters, the story chooser from the same source
  and "The returned hour".
- Shell pages: `/case-studies` (eight verified stories), `/blog` with
  `/blog/:slug`, the answers at `/answers/:slug` (`/answers` redirects to
  `/blog`), `/faq`, `/about`, `/contact`, `/privacy`, `/terms` and the unlisted,
  noindex `/alumni`. The sitemap lists 36 URLs.
- Every page carries the same masthead (logo, Subscribe, menu) and footer.
  Navigation labels: Home, Build your AI brain, Build your AI revenue engine,
  Success stories, Ideas you can use, Questions we get asked, About us and
  Media, and the one action, Start building your AI brain (Start building your
  AI revenue engine on `/ai-gtm`; `START_LABEL` and `START_LABEL_GTM` in
  `src/lib/publicLinks.ts`).
- www.mindmake.co, themindmaker.ai and www.themindmaker.ai redirect to
  mindmake.co preserving path and query. Canonical non-root routes omit
  trailing slashes.

## Visitor journey

Every way in opens the same company-first LeadBrief. A button that names no
door opens it at the AI brain's door; the `/ai-gtm` buttons open the revenue
engine's. The steps: "Let’s get started." with a work email and **Get
building** (and "Not ready yet? Subscribe to Make Your Mind Up, free" beneath);
name and business role (a first.last or first_last address fills both names);
the corroborated company read; the problem and the returned-time choice, each
one tap that moves on; the brief preview; **Keep the private brief**, straight
to the address and the optional, unticked publication-interest box; the
six-digit code; the delivered brief, on screen and downloadable as
self-contained HTML. On a phone the brief's leaves turn with two arrows beside
"1 of 4" in its header. On a phone the focused field stays between the header
and the keyboard (`npm run qa:lead-keyboard`, 390x844 and 320x568).
`05_LEAD_DELIVERY_SPEC.md` owns the payloads, privacy and failure paths.

Publication interest in the brief subscribes nobody. "Subscribe for free" does,
from six places: a badge beside Media in both menus, a Subscribe button beside
the menu in every masthead, a footer button, the brief's first step, its success
step and a line at the foot of the homepage opening naming one issue. Each opens
https://makeyourmindup.ai, where its own Subscribe free button is.

The personal-read API remains deployed, but is not a second form in this
frontend. The retained daily-news API is not evidence that a live board is
rendered anywhere on the site.

Analytics: Plausible (cookieless) counts every visit. Google Analytics
(`G-SMXQH8E4CM`) is consent-gated from `index.html`: nothing is requested from
Google and no cookie is set until the visitor chooses Allow on the privacy
notice, stored as `mindmake_consent=analytics`; Decline stores `essential`. The
older `accepted` answer was given to a Plausible-only notice and never counts
as a yes. On a laptop the notice is a card on the left of the bottom band; on a
phone it docks under the masthead. `/privacy` section 5 names both tools and
carries "Change your analytics choice".

Since 28 October 2026 (PR #256) a brief asks the same question on its first
screen when no answer is stored ("Can we count your visit with Google
Analytics?", Allow and Decline, inside the panel), because a brief opened
straight away covered the notice. Both answer through `src/lib/consent.ts`
(the same key, Allow loading the tag, Decline dropping a held placement tag);
the page notice stays away while a brief is open; Allow there sends
`brief_open` and the current `brief_step` once; nothing in the brief waits on
the answer.

Since 28 October 2026 Google Analytics also receives the brief's steps, only
once Allow has loaded the tag on that page (`trackBrief` in
`src/lib/analytics.ts`): `brief_open`, `brief_step` with a fixed step name
(`company`, `profile`, `reading`, `pressure`, `capacity`, `preview`,
`contact`, `verify`, `success`) and `brief_submit` when a code is sent, each
with `brief_route`, never a name, address, company or typed text. Nothing is
queued before Allow. Which of them count as key events is set in the
Analytics property, not in this repository. Plausible's `scoping_request` is
unchanged. A growth placement's tag (`utm_source=growth-<path>` with
`utm_medium=referral`, the shape growth-mindmake places) is read from the
arrival address by the head script into page memory and queued before the
config, so the first page view after Allow carries it; any other source or
medium is not held, nothing of it is written to the device, and Decline drops
it (`src/lib/visitTag.ts`). `/start` keeps the query string at the edge (a 307
to `/?...&start=1`) and in the client route. Since 28 October 2026 (PR #255)
the brief request records the same held tag beside its entry route:
`placement` in the request, `utm_source` and `utm_medium` on the private
request row, read from page memory only and never from the address, and
`/privacy` section 2 says so. With no tag, or after Decline, both are null;
the function rejects any other shape and the row's CHECK constraints hold the
same rule.

## Discovery and machine-readable surfaces

`npm run qa:discoverability -- --base=https://mindmake.co`, bound to `86dcf6d`,
passed on 26 October 2026 at 15:27 UTC: 36 routes, initial and hydrated heads,
and 42 metadata assets, no failures
(`artifacts/homepage-release/discoverability-mindmake.co-2026-10-26T15-27-26.825Z.json`).
Read the same day:

- `/answers/feed.xml` serves an Atom feed of all thirteen answers in full.
  `llms.txt` carries the plain summary and both ways in; `llms-full.txt`
  carries every answer, read and `/faq` question in full.
- `robots.txt` names fifteen AI crawlers in their own group, with the same
  rules as everyone else. Training-crawler policy was not changed.
- Structured data: answer pages carry Article, FAQPage and BreadcrumbList tied
  to the one `#organization` node; `/faq` carries an FAQPage; `/about` carries
  the practice as a ProfessionalService and its founder as a Person.
- `.github/workflows/answers-weekly.yml` opens the weekly brief issue from
  `answer-backlog.json`. Cadence and the quality bar are in `01_CANON.md`,
  "The answer pages".

Technical eligibility is not evidence of indexing, ranking or AI citation.

## Backend

Project bkyuxvschuwngtcdhsyg. Versions read back 26 October 2026 with the
Supabase CLI (`functions list`), and `submit-mindmake-brief` again on 28
October 2026, the only function deployed since; its source was read back and
matches the PR #255 head file for file:

| Function | Version | JWT | Scope |
|---|---|---|---|
| enrich-company | 45 | on | Domain-bound, corroborated literal company evidence |
| submit-mindmake-brief | 24 | off | Verified brief, visitor/operator delivery, truthful day-14 disclosure/enqueue; sends the code before the company research behind the brief (26 October 2026); records a growth placement's tag (28 October 2026) |
| mindmake-personal-read | 26 | off | Retained personal read and human handoff |
| get-ai-news | 71 | off | Retained cache API |
| send-follow-ups | 6 | off | Cron sender; not invoked in release testing |
| aa-price-snapshot | 4 | off | Daily price recorder |

`submit-mindmake-brief` v24 was deployed on 28 October 2026 from the PR #255
branch commit `5f31a69`, before that PR's merge, because the function rejects
unknown keys and had to accept `placement` before the site sends it (Krish:
"Yes do number two"). All 15 downloaded files match that commit. It runs after
the migration `mindmake_brief_placement` (repository file
`20261028120000_mindmake_brief_placement.sql`), which added the two nullable
columns and their CHECK constraints and redefined the RPC's insert only;
both were read back. Rollback: v23, which matched main `c03b21c` file for file
on 28 October 2026; the two columns are nullable and v23 ignores them. A live
proof the same day: a request carrying `growth-podcast` recorded
`growth-podcast` and `referral`, one with no tag recorded two nulls, and one
with `growth-Podcast` was refused 400 with no row. Both codes went to the
designated inbox only and neither was confirmed; the two synthetic rows were
deleted by request id and zero read back (their two one-way rate-limit
records expire within 48 hours).

v23 was deployed from main `6b86220` on 26 October 2026 on Krish's approval
("Approved. Merge #250, deploy the brief function, and read both back."). Read back the same day on
https://mindmake.co: "Send the code" answered in 2.5 s on desktop and 1.5 s on a
phone (34.6 s before), the code reached the designated inbox, and the same
request replayed 45 s later answered `verification_required` without a new
email (assembly no longer in progress and not failed).

The last end-to-end delivery proof is older: on 24 September 2026 a
frontend canary on submit v20 completed research, verification, visitor
results and operator digest in INBOX, one ready brief and exactly one correctly
due follow-up, and a download matching the visible brief; exact synthetic rows
were removed and zero verified
([backend receipt](website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md),
dated history). No later end-to-end delivery is recorded.

The owned themindmaker.ai alias maps to mindmake.co for research and
signatures only, never recipients. Arbitrary redirects and lookalikes are not
trusted. [05_LEAD_DELIVERY_SPEC.md](05_LEAD_DELIVERY_SPEC.md) owns payload,
privacy, retention, email and failure-path contracts.

## Gates for the latest release

PR #255 passed locally before its merge: the unit suite (705 tests),
typecheck, lint, qa:approved-routes and its self-test, qa:docs,
qa:website-restart, qa:homepage-handoff, qa:plain-language,
qa:website-feedback, qa:material-review:self-test, the build, qa:line-breaks
(all 36 indexed pages, `/privacy` among them), qa:homepage-release:pre-merge
(10 cases), qa:lead-keyboard (237 observations) and qa:lead-contrast (2,514
measurements), `deno check` of the function's closure and its ten Deno tests.
`npm run qa:material-review -- quality/website-redesign/material-review-candidate.json`
fails closed on its stale September receipts, identically on `c03b21c`; the
candidate does not cover `/privacy`, whose one clause Krish approved in
substance. Its exact-head checks passed before the merge: approved-routes and
the Vercel preview (the browser matrix runs on main, after the merge). The required gate list is in `CLAUDE.md`.

The active source lock is `quality/route-lock/approved-production.lock.json`,
generated by `npm run qa:approved-routes:update` and checked by
`scripts/qa/approved-route-lock-check.mjs`. It continues r48; the numbered
manifests r1 to r48 are frozen evidence, not a description of today's site.
Preserve the deterministic adapter and accepted source.

## Open work and evidence limits

- A person confirming a brief code since `submit-mindmake-brief` v23 has not
  been observed; it is the remaining end-to-end proof of the 26 October
  release. Follow-up enqueue and due time are proven; an actual future
  scheduled delivery is not. Preserve the transactional email cap and truthful
  follow-up disclosure in 05.
- Physical iPhone VoiceOver and Android TalkBack have never been run. Krish's
  exception covered the 24 September 2026 release only; every later release,
  #245, #248 and #250 included, shipped without them. Emulation is not physical
  proof.
- A phone held sideways with the keyboard up has too little height for the
  brief, and a physical phone keyboard is unproven until Krish repeats the walk
  on a phone.
- Search Console and Bing property ownership and submissions were not verified.
  Indexing, search traffic, ranking and AI citation need external measurement;
  no ranking or citation is claimed. Social platform cache refreshes were not
  externally verified.
- Dependency audit on 26 October 2026: 25 package entries (17 high, 7 moderate,
  1 low, none critical). No visitor-reachable blocker was confirmed in the
  bounded review of 24 September 2026 (then 23 entries); this is not a clean
  audit, and compatibility-tested upgrades remain.
- `main` has no branch protection and no rulesets (read 26 October 2026).
  Checked workflows fail closed; privileged bypass remains possible, so a
  violation is not claimed impossible.
- `/case-studies#record-<id>` does not open a record on a desktop, where the
  panel is `display: none` until the story is expanded; it opens on a phone
  (re-checked live at 1440x900 and 390x844 on 26 October 2026).
- Two QA scripts assert retired surfaces and are not release gates:
  `scripts/qa/full-route-continuity-check.mjs` (the deleted `#archive-title`
  and the retired Brain chapters) and
  `scripts/qa/locked-material-production-check.mjs` (the retired Brain
  chapters). The Brain's current proof is `src/test/brain-narrative.test.ts`
  and `qa:line-breaks`.
- The feedback ledger (`website-redesign/feedback-ledger.json`, a record, not a
  merge gate) has two open rows waiting on Krish,
  `LEAD-BRIEF-INTELLIGENCE-001` and `LEAD-BRIEF-DELIVERABLE-001`, and none
  awaiting review: the 31 implemented rows (25 `S6-*` and six older ones) were
  accepted on 26 October 2026 (Krish: "Yes, mark all 31 feedback ledger rows
  as accepted, citing this message.").

Do not promote old DNS/mailbox, CTRL-host or cache observations into fresh facts
without new readback. CONTACT_EMAIL in src/lib/publicLinks.ts is the approved
contact source. Older operational findings remain in the history ledger.
