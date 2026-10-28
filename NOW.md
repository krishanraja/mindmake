---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-10-26
head: 5f550d6
lifecycle: live
production_url: https://mindmake.co
state_doc: project-documentation/06_CURRENT_STATE.md
history_log: project-documentation/history/LOG.md
truth_files: []
authority_order: [project-documentation/00_NORTH_STAR.md, project-documentation/01_CANON.md, project-documentation/02_PUBLICATION.md, project-documentation/03_DESIGN_CONTRACT.md, project-documentation/04_PROOF.md, project-documentation/04_PROOF_RECORDS.md, project-documentation/05_LEAD_DELIVERY_SPEC.md, project-documentation/06_CURRENT_STATE.md, project-documentation/07_DEPLOYMENT.md, project-documentation/07_DEPLOY_RUNBOOK.md]
steward: https://github.com/krishanraja/ai-harness/blob/main/docs/steward/RUNBOOK.md
never_publish: [the private price and the internal rate card, the cash floor and the volume ceiling, the internal budget anchors, any proof duration beyond the public 30-day shape, the internal month shape and hour envelope, client names outside the consented proof set, anything in 04_PROOF_RECORDS.md, the buyer archetype and its name, the private routing observation, the internal sales wedge, the method's name, availability or a start date, deployment ids, the Supabase project id, credential and secret names, the operator's mailbox address]
---
# Mindmake: current handoff

## What it is

Mindmake is a small AI and commercial strategy practice run by Krish Raja. It
builds a leader their own AI brain: a working system that holds their taste,
standards, judgement and memory. Two doors, Build your AI brain and Build your
AI revenue engine, lead to one privately scoped paid proof. The headline turns
through six lines and opens on **Promote your AI from intern to chief of
staff.** The way in is **Start building your AI brain** (**Start building your AI
revenue engine** on `/ai-gtm`). The publication, **Make Your
Mind Up** at https://makeyourmindup.ai, is for readers not ready yet. CTRL, the
product the work runs on, is in a private pilot with leaders. The whole account
is "Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md).

This repository is the site at https://mindmake.co and `project-documentation/`,
the numbered canon and the one source of truth for the business. Numbered documents own business truth;
[CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) own how work is done here.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer: a founder, principal
or senior commercial leader who can move a decision and the result behind it.
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md) and
[01_CANON.md](project-documentation/01_CANON.md) own buyers, offers, claims and
approved copy; read them before writing anything public. The site is the front
door to both doors and to the proof, so every public word here is a claim the
business stands behind. Everything in `never_publish` above stays off it.

## Where it is right now (as of 2026-10-26)

<!-- north-star-state {"week_of": "2026-10-26", "week_target": "private", "current": "private", "current_as_of": "2026-10-23", "current_source": "Control Center revenue_events (Stripe, account mindmaker_llc), read-only", "urgency": 3, "urgency_reason": "at 71% of this week's target"} --> **North Star number: U3, well behind.** Cash collected by Mindmake, trailing 4 weeks: at 71% of this week's target (figures private). Two experiments a week, growth output doubled.

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md).

Keep the accepted composition, copy, imagery, controls and responsive choices.
Since S6 (24 October 2026) every page is three sections: the problem, how it
works, and what the reader gets and how they know it works. Between the R3
opening and the footer the homepage carries "Right now, your AI is an intern."
(the four eras, a carousel on their pictures), "A chief of staff knows how you
think." (the organisation and a carousel of practice scenes) and "Built on
your real work. Yours to keep."; nothing on it pins. The AI Brain stories are a
chooser on `/ai-brain` that never pins: seventeen stories in five situations,
the whole story in a sheet. `/new-age-leadership` keeps its pinned chapters.
Generate the adapter from the immutable R3 source, never reconstruct it from
older components.

Since 26 October 2026 the brief takes 8 clicks from the homepage hero to
"Check your email." and sends the code before the research behind it. The last
end-to-end delivery proof (verification, visitor and operator INBOX delivery,
persistence, one due follow-up and a downloaded brief) is from 24 September
2026; a code confirmed by a person since the 26 October function deploy is not
yet recorded. That proof is not permission for additional sends.

A live discoverability readback on 26 October 2026 passed on all 36 routes and
42 metadata assets.

## What changed recently

- 2026-10-28: the brief request records which growth placement it came from
  (`utm_source=growth-<path>`, `utm_medium=referral`, from the tag held in
  page memory only, null otherwise), and `/privacy` section 2 says so, on
  Krish's yes ("Yes do number two"). Migration, `submit-mindmake-brief` v24
  and PR #255, in that order.
- 2026-10-28: Google Analytics hears the brief's steps (`brief_open`,
  `brief_step`, `brief_submit`, fixed names only) after Allow, and a growth
  placement's `utm_source=growth-<path>&utm_medium=referral` is held in page
  memory until the banner is answered, never on the device, dropped on
  Decline. `/start` keeps its query string in the client as at the edge. No
  visible text changed.
- 2026-10-26: the documentation was audited against the live site on Krish's
  instruction ("ensure the documentation is 100% up to scratch, and that an AI
  agent reading the documentation cannot possibly misinterpret or read stale
  version of this business"). `06_CURRENT_STATE.md` was rewritten to current
  truth only, and it and the accepted state were archived verbatim in
  `history/ARCHIVE.md`; the canon's copy table, the North Star's placement and
  proof lines, the README, CLAUDE.md's gates, the runbook and the design
  contract now match what mindmake.co serves. No site code or copy changed.
- 2026-10-26: the brief in fewer clicks (#250) and `submit-mindmake-brief` v23.
  From Krish's live test of every call to action: no door question, a choice
  that moves on, "Keep the private brief" straight to the address, the leaf
  arrows in the brief's header on a phone, and the code sent at once, 2.5 s on
  a desktop where it took 34.6 s. 8 clicks from the hero to the code, down from
  11 on a desktop and 14 on a phone. Ledger row `BRIEF-CLICKS-001`.
- 2026-10-26: Krish's phone review of S6 (#248): the opening grows to fit, the
  eras and practice scenes are carousels, the eras and results sit on their
  pictures under measured contrast (`qa:card-contrast`), Subscribe sits beside
  the menu in every masthead, `/ai-gtm`'s way in is left-aligned and the
  brief's first step reads "Let’s get started." Ledger rows `S6P-01` to
  `S6P-07`, accepted.
- 2026-10-24: every page became three sections (S6, #245). Krish's ruling:
  every page says "what problem it solves, how it solves it, and what the
  reader gets and how they know it works", with the spine "intern to chief of
  staff" and a bold, visionary tone. The homepage's pinned history, reach,
  practice, stories, returned-hour and route chapters left it; `/ai-brain`
  gained a one-panel opening, a seventeen-story finder and a receipt;
  `/ai-gtm` lost every pin. The way in is one button, "Start building your AI
  brain", replacing "Get your free AI brief".
  A second ruling: no word alone on a line, and no component that changes size
  when a reader makes a choice, so `qa:line-breaks` now covers 1280 and 360
  wide, clicks every swapping control and fails size changes. Its 25 `S6-*`
  feedback rows were accepted on 26 October 2026.
- 2026-10-24: the Linux browser legs of CI were pinned to ubuntu-24.04 (#246).
  GitHub moved `ubuntu-latest` to 26.04 and the pinned Playwright 1.60.0
  "does not support chromium on ubuntu26.04-x64", so both legs stopped before
  any case ran. Lift the pin when Playwright supports the newer runner.
- 2026-10-18: the North Star was set and every session was anchored to it.
  `00_NORTH_STAR.md` gained a Horizon: by March 2027 Mindmake is the first name
  a PE or VC backed media, adtech or data leader hears when they ask who can
  build an AI that knows them, and twelve leaders run one they would vouch for
  out loud. CLAUDE.md and AGENTS.md now tell each session to read it first, say
  which part the task moves and close by noting what moved. Krish's ruling:
  "North Star timeframes assume agents do the work, not humans." The same day
  superseded branches (older documentation reconciliations, two dated steward
  branches, an abandoned canon sync) were merged as history only (#241),
  because they predate the 16 October rewrite; the current canon and the
  accepted site were kept byte for byte. No site code or copy changed.
## What is next and what is waiting on Krish

- Physical iPhone VoiceOver and Android TalkBack have never been run. The
  owner's exception covered the 24 September 2026 release only; every release
  since shipped without them.
- Search-console ownership, indexing, ranking and AI citation outcomes are not
  established by technical checks. Require fresh evidence for those claims.
- Dependency advisories remain upgrade work, not a clean audit.
- The 4000+ attendance count Krish approved on 26 September 2026
  (`04_PROOF.md`) still needs its section 6 evidence trail compiled before the
  figure is used anywhere beyond the approved line above the brand grid on
  `/case-studies`.
- In play: the CTRL pilot with leaders, by invitation from Krish only, and the
  first outreach drafts (a post, a note to his network, a Make Your Mind Up
  sign-off), each waiting for his yes to that exact send.
- Next: Change 3, the brief names one thing AI could carry in the reader's
  own week, shown rendered before it is built
  ([STATE.md](project-documentation/website-redesign/STATE.md), "Open").
- Waiting on Krish: a rendered mock of the corroborated company read and one
  name for the lead-brief deliverable, before that second release is built
  (`LEAD-BRIEF-INTELLIGENCE-001`, `LEAD-BRIEF-DELIVERABLE-001` in the feedback
  ledger), and one brief started and confirmed on a phone, the end-to-end
  proof of the 26 October deploy. The code of 14:33 UTC that day came from a
  speed test, not a brief, and expired unused.

No new public prices, durations, claims, sections or routes without scope.
Do not ask the owner to reapprove settled selections or quietly choose new ones.
- North Star check (2026-10-26): holds.
- North Star check (2026-10-28): holds. The placement record lets a brief be
  read against the growth path that brought it; it moves no number by itself.

## Read next

0. [North Star](project-documentation/00_NORTH_STAR.md): the Horizon every
   session works toward; only Krish changes it.
1. [Documentation index](project-documentation/README.md): numbered commercial,
   design, proof, lead and deployment owners. Private fields stay private.
2. [Accepted release state](project-documentation/website-redesign/STATE.md):
   exact approved surface and current verification requirements.
3. [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md): repository execution guards.
4. [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md): verified
   live identity, backend and open limits.

## Do not trust

- [history/ARCHIVE.md](project-documentation/history/ARCHIVE.md) and anything
  quoted from it: superseded originals, kept verbatim as evidence, never
  current guidance.
- The frozen route-lock manifests r1 to r48 and
  `quality/website-redesign/homepage-handoff.v1.json` as a description of
  today's page: they are history and a recovery baseline.
- `project-documentation/homepage-redesign/`: every file there is history.
  `ROUTE-CONTINUITY-R3.md` is a byte-locked snapshot of 17 September 2026 that
  older manifests hash; it says there is no `/about` route and names retired
  labels, and none of that is current.
- The dated evidence files in `project-documentation/website-redesign/`
  (`RELEASE-2026-09-24.md`, `BACKEND-RELEASE-EVIDENCE-2026-09-24.md`) as
  today's state: they are receipts of their date.
- A build, an exit code or a screenshot alone as proof of behaviour, and an
  older receipt relabelled as new verification.
- Prices, durations, dates or availability from memory. The canon and the live
  source own them, and most of them are never published.
