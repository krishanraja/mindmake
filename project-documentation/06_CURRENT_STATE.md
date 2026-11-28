# Mindmake current state

Current as of 27 November 2026. This file owns live identities, what was
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
- Latest application release: the creative repositioning, PRs #337 to #343,
  merged on 26 November 2026 (merge `19c81d25`, PR #343; GitHub's production
  deployment record for that commit reports success at 04:30 UTC). Positioning
  and copy approved by Krish on 25 November 2026 (`00_NORTH_STAR.md`). #337
  repositioned the site for the people who shape creative work, culture and
  sport: the headline "AI can copy almost anything except your taste.", the
  doors Build your AI brain and Build your AI business, a rebuilt `/ai-brain`
  (the liquid Brain), `/ai-gtm` refocused on making, sharing and earning,
  every story organised by six wishes with twelve labelled examples, and one
  motion system across the site. #338 to #343 were fixes forward: route tests
  given time to render the new `/ai-brain` (#338), the phone media line and
  Safari focus return after the brief (#339 to #341), the fixed header cleared
  on small phones (#340), the core navigation check following the homepage
  menu's real links (#342), and the `/new-age-leadership` gutter with the
  cookie notice back under the masthead on phones (#343, Krish's 24 October
  ruling). Rollback: `2774ead8` (PR #342) for the last fix, `f7439bf1` (PR
  #336) for the whole repositioning. No change under `supabase/`, `api/` or
  `vercel.json` between `f7439bf1` and `19c81d25`. A production
  readback of the live pages after the merge: not read.
- Releases between PR #277 (6 November 2026) and PR #336 (23 November 2026)
  are not itemised in this file; GitHub's merged pull requests are the record.
- PR #277 (merge `9353eba`, 6 November 2026): all 16 attendee brands on the
  `/case-studies` rail and every homepage section fitting below the masthead
  on a desktop. Detail in history/LOG.md, 27 November 2026.
- PR #256 (28 October 2026): the brief's "Keep the private brief"
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
- Main's post-merge route lock on `19c81d25` (run 45755491040, "Approved
  route lock") passed all four jobs: approved-routes and browser-verification
  in Chromium and Firefox on `ubuntu-24.04` and in WebKit on `macos-latest`.
  It is the first release recorded here with Firefox and WebKit read as
  passing.

## What the live site is

Read from the source at `19c81d25` on 27 November 2026; a live readback after
the merge is not recorded. `website-redesign/STATE.md` owns the accepted
detail and `01_CANON.md` the exact copy.

- `/`: the R3 opening (film, a headline that turns through six lines and rests
  on "AI can copy almost anything except your taste.", the lede "So we build
  your AI brain out of it, for the people who shape creative work, culture and
  sport.", one door (the AI brain's; 28 November 2026), **Start building your AI brain** with "Free and
  private. It starts with a read of your business." beneath, and a publication
  line), then four sheets (28 November 2026): "Every new technology asks us
  to change how we think." with the four eras as a carousel on their
  pictures; "Ways an AI brain can level you up.", six tilt cards, one per wish,
  each a bright picture and a promise under ten words that turns over to its
  anchor story (`src/data/ways.ts`); "In their words.", the client quotes one
  at a time, the 4000+ count and the logo rail; and "We build yours with you
  in 30 days." with "A rule worth keeping", one client voice, "Start your
  brief" and "Inside an AI brain →"; then the footer. Nothing on it pins.
- `/ai-brain` (`src/pages/AiBrainLocked.tsx`, title "Build your AI brain";
  rebuilt 28 November 2026): the hero film playing again, "Teach your AI
  what experience taught you." and one sentence; the homepage's sheets; "The
  questions only you can answer." with one question; "Your AI brain knows how
  you think." with three tiles; the 30-day Sprint; and beside the words the
  AI brain in 3D, lighting the part each passage is about as the reader
  scrolls (North Star, Vision, Taste, Judgement, Preferences, Standards).
- `/ai-gtm` retired on 28 November 2026 and redirects to `/ai-brain`; its
  three levers are the last three ways cards on the homepage.
- Both offer pages and the homepage: "Prefer to …?" with "See how we compare
  →" opens the comparison set. On the door pages it sits beside "Explore the
  stories"; on the homepage it floats in the hero on a wide screen and leads
  the first sheet on a phone. `03_DESIGN_CONTRACT.md` owns the rules.
- Every way in that opens the brief in place keeps a tap made before the page
  has started and opens the brief as the page starts (11 November 2026,
  `src/lib/earlyStart.ts`); before, a tap in those seconds did nothing.
- `/new-age-leadership`: the approved companion. It keeps its own pinned
  history, reach and practice chapters, the story chooser from the same source
  and "The returned hour".
- `/case-studies` retired on 28 November 2026 and redirects to `/#ways`
  (`/testimonials` to `/#words`).
- Shell pages: `/2-minute-ai-upgrade-toolkit`,
  `/blog` with `/blog/:slug` (indexed, absent from the menu), the answers at
  `/answers/:slug` (`/answers` redirects to `/blog`), `/faq`, `/about`,
  `/contact`, `/privacy`, `/terms` and the unlisted, noindex `/alumni`. Sitemap
  count at this head: not read.
- `/optout/<token>` (Ruling, Krish, 2026-11-15: the opt-out link lives on a mindmake.co path that forwards to
  Control Center): the one-click opt-out link under every cold email. `vercel.json` rewrites it, token unchanged and
  method kept, to Control Center's `/api/optout`, which owns the page and the deletion; it is noindex, never cached
  and sends no referrer. Nothing links to it until Control Center switches cold email on.
- `/feedback/dtd` (Krish, 2026-11-02): an unlisted, noindex feedback form for
  DoThinkDo staff, one screen at a time (Krish, 2026-11-02): pick what they
  liked, one screen per pick, then the same for what to do better, then send.
  Each comment screen offers starter sentences with blanks that must be
  finished in the person's own words; the server refuses a leftover blank. The
  `submit-dtd-feedback` edge function emails every response to the address in
  its `DTD_FEEDBACK_TO` secret and stores nothing. It speaks as Krish, first
  person, opening on a note from him, and is prerendered as an unlisted page
  (`unlistedPages` in `scripts/prerender.mjs`) so it never paints the
  homepage first. `/alumni` is prerendered the same way, so neither unlisted
  page is served the homepage shell. Starters are sentence openings with one
  gap at the end; a comment that stops where a starter stops is refused.
  An unticked box beside the name asks permission to quote the response in
  Mindmake's materials (wording version `dtd-quote-consent-v1`); the email
  records yes with name, yes anonymous or no, and the exact sentence agreed.
- Every page carries the same masthead (logo, Subscribe, menu) and footer.
  Navigation labels (`PRIMARY_ROUTES` in `src/lib/publicLinks.ts`): Home,
  Build your AI brain, Your 2-minute AI upgrade toolkit, Questions we get
  asked and About us (28 November 2026), and the one action, Start building
  your AI brain (`START_LABEL`).
- www.mindmake.co, themindmaker.ai and www.themindmaker.ai redirect to
  mindmake.co preserving path and query. Canonical non-root routes omit
  trailing slashes.

## Visitor journey

Every way in opens the same company-first LeadBrief. A button that names no
door opens it at the AI brain's door. The steps: "Let’s get started." with a work email and **Get
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
as a yes. On a phone the notice docks under the masthead, full width (Krish, 24
October 2026, restored in PR #343); on a desktop it sits after the footer so it
never covers content (Krish, 25 November 2026). `/privacy` sections 4 and 5 name every tool
and section 5 carries "Change your analytics choice", which also clears
Clarity's `_clck` and `_clsk`.

Since 13 November 2026 Microsoft Clarity (project `zd4m5xlj05`) loads under
the same Allow (owner request: "Copy and paste the Clarity code into the
<head>"). Clarity's own snippet sits unchanged inside `mmLoadClarity` in the
`index.html` head, called for a stored `analytics` answer and from either
Allow (`src/lib/consent.ts`); before that nothing is requested from Microsoft.
Once loaded it is sent `consentv2` with analytics granted and advertising
denied. The brief's panel carries `data-clarity-mask="True"`, so recordings
show its movement and never its words; Clarity's own default masks every
input elsewhere. Because Allow now covers two tools, the page notice asks
"Analytics cookies?" with the Privacy link that names them. QA runs store
`accepted`, `declined` or `essential`, so they never load Clarity or Google.

Since 28 October 2026 (PR #256) a brief asks the same question on its first
screen when no answer is stored ("Can we use analytics cookies on your
visit?", Allow and Decline, inside the panel), because a brief opened
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

The repositioning (PRs #337 to #343) passed main's post-merge route lock on
`19c81d25` (run 45755491040): approved-routes and browser-verification in
Chromium, Firefox and WebKit. Local gate results for each of the seven pull
requests are not read here; each pull request's own checks are on GitHub. The
docs steward's validate job failed on the first run for that commit
(45755491446) and passed on a later run (45930560310). The required gate list
is in `CLAUDE.md`.

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
  #337 to #343 included, shipped without them. Automated WebKit on macOS now
  passes on main; neither it nor emulation is physical proof.
- A live readback of `/`, `/ai-brain`, `/ai-gtm` and `/case-studies` after the
  26 November 2026 merge is not recorded.
- Under review and not yet live: a Vision/Craft discovery concept awaiting Krish's
  approval. Nothing of it is in `src/`.
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
