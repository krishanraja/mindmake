---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-20
head: 2c67997
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
business** on `/ai-gtm`). The publication, **Make Your
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

## Where it is right now (as of 2026-11-20)

<!-- north-star-state {"week_of":"2026-11-02","week_target":"private","current":"private","current_as_of":"2026-11-02","current_source":"Control Center revenue_events (Stripe, account mindmaker_llc), read-only","urgency":4,"urgency_reason":"at 28% of this week's target"} --> **North Star number: U4, far behind.** Cash collected by Mindmake, trailing 4 weeks: at 28% of this week's target (figures private). A bold swing every day; work that does not move the number waits.

The approved R3 homepage and companion surfaces are live at https://mindmake.co,
with `/parts`, `/brain-modules` and `/case-studies` use-case discovery added
since 14 November 2026. Member-code checkout is merged but its edge functions
are not deployed.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md).

Keep the accepted composition, copy, imagery, controls and responsive choices.
Since S6 (24 October 2026) every page is three sections: the problem, how it
works, and what the reader gets and how they know it works. Between the R3
opening and the footer the homepage carries "Right now, your AI is an intern."
(the four eras, a carousel on their pictures) and "We build yours with you in
30 days." (results, a floating Brain orb asking where to start, and a band
for exploring what leaders built); "An AI chief of staff knows how you think."
moved to `/ai-brain` on 11 November 2026; nothing on the homepage pins. No
section is taller than a desktop screen (`qa:section-heights`). The AI Brain stories are a
chooser on `/ai-brain` that never pins: eighteen stories in five situations,
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

- 2026-11-19: brain modules went on sale at `/brain-modules` (PRs #316, #317),
  with a "Measure your AI judgement" check, the "2-minute AI upgrade toolkit"
  and an "Our media" channel (#318). Paying makeyourmindup members can redeem
  a free module with the coupon `mymu-member-module` (#319). A live probe
  then showed Stripe records a promotion code on the session with its coupon
  empty, so the first webhook check "would have refused every real member";
  the webhook now reads the coupon from Stripe (#320), and the hosted code box
  came off the normal checkout (#321) because it refused even valid codes
  from a cloud machine seen as a Mexican visitor under Adaptive Pricing.
  Member links (`/brain-modules/<slug>?code=...`) apply the code instead.
  Not deployed: `kits-checkout` and `kits-webhook` are edge functions
  deployed by hand.
- 2026-11-18: seven parts of the AI brain went on sale at `/parts` (#306,
  #314, #315) with a buyer lead capture, the promise and proof, and the line
  "brain modules are software, not a prompt or a skill". Krish's reason for
  building it: "This needs to be a world class lead magnet site in terms of
  conversion rates, but not tacky looking". The parts research engine behind
  the sample reports is paused: UK sources work, but report quality is
  unstable across live runs (r17 to r22), so the next step is a replayable
  record-and-replay bench before any more fixes
  (`project-documentation/parts-research-next-steps.md`).
- 2026-11-18: "Krish's Mission" (`project-documentation/krishs-mission/`, #312)
  holds thirteen working files: the ladder from purpose to the business number,
  the pitch sentence he chose, proposed copy for his surfaces, and every open
  decision. The homepage "Prefer to ...?" nudge underline now matches the
  phrase on screen (#310, #311).
- 2026-11-17: the canon's thesis is "AI makes strong judgement stronger and
  weak judgement weaker. Mindmake builds the strong kind." (#308), with its
  evidence and a short "Why Krish started it". The first lead magnet, the
  judgement audit "Who decided?" (#309, #313), is built at `/who-decided`:
  six steps, a private read with no score, nothing typed leaves the page.
  It was unlisted and noindex when last recorded; going live waits on Krish
  reviewing it rendered.
- 2026-11-15: use cases, results and client quotes have one record each
  (`src/data/useCases.ts`, `src/data/testimonials.ts`, #301), and
  `/case-studies` finds a reader's use case by type, situation, role, result
  or search, then the eighteen approved client quotes. The cold email opt-out
  link on mindmake.co forwards to Control Center (#303), and `/privacy` gained
  "If Mindmake emailed you first" (#302).
- 2026-11-14: the SendLinks recipient page is served at `/l/<link>` (PR #300),
  from `public/l/index.html`, with `/l/config.js` coming from
  `api/sendlinks-config.js`, which reads `SENDLINKS_OPEN_BASE` so the SendLinks
  address is never committed to this public repository. `/l/` is noindex,
  no-referrer and no-store. The page's source is `krishanraja/sendlinks`
  `web/recipient/`; the route lock was regenerated for the intended edit.
- 2026-11-13: Microsoft Clarity is in the head of every page, behind the same
  Allow as Google Analytics (Krish: "Copy and paste the Clarity code into the
  <head> element of site"). Allow now covers two tools, so the page notice
  asks "Analytics cookies?" and the brief "Can we use analytics cookies on your
  visit?"; `/privacy` sections 4 and 5 name Clarity; the brief's panel is
  masked from recordings. Aimed at the North Star: recordings and heatmaps of
  where consenting readers stop between the hero and "Check your email."
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
- Next: Krish approves deploying `kits-checkout` and `kits-webhook`, then one
  live member-code checkout to his own address proves the module path end to
  end. Open: his answers in `project-documentation/krishs-mission/11-open-decisions.md`
  and his review of `/who-decided` rendered.
- Waiting on Krish: a rendered mock of the corroborated company read and one
  name for the lead-brief deliverable, before that second release is built
  (`LEAD-BRIEF-INTELLIGENCE-001`, `LEAD-BRIEF-DELIVERABLE-001` in the feedback
  ledger), and one brief started and confirmed on a phone, the end-to-end
  proof of the 26 October deploy. The code of 14:33 UTC that day came from a
  speed test, not a brief, and expired unused. Also: confirm a fresh SendLinks
  link opens at `https://mindmake.co/l/<link>` on his phone. The canon
  still says seventeen stories at `00_NORTH_STAR.md:83-86`, and whether R-07 in
  `04_PROOF_RECORDS.md` stays is his call; the steward does not edit either.

No new public prices, durations, claims, sections or routes without scope.
Do not ask the owner to reapprove settled selections or quietly choose new ones.
- North Star check (2026-11-16): holds.

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
