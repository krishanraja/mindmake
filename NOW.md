---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-25
head: f7439bf
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

## Where it is right now (as of 2026-11-25)

<!-- north-star-state {"week_of":"2026-11-02","week_target":"private","current":"private","current_as_of":"2026-11-02","current_source":"Control Center revenue_events (Stripe, account mindmaker_llc), read-only","urgency":4,"urgency_reason":"at 28% of this week's target"} --> **North Star number: U4, far behind.** Cash collected by Mindmake, trailing 4 weeks: at 28% of this week's target (figures private). A bold swing every day; work that does not move the number waits.

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
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

A discoverability readback on 26 October 2026 passed on all 36 routes.

## What changed recently

- 2026-11-23: on phones the publication line at the foot of the homepage hero
  sits on a dark wash, because it was hard to read over the bright photo (#336).
  Krish approved the edit to the locked homepage file that day and the route
  lock moved with it. Keep the wash in any later redesign of the phone hero, or
  replace it with something that passes the same legibility check.
- 2026-11-21: the AI Brain draft shows how keeping the reason for a discount
  changes the next renewal decision (#334); the homepage introduces the next
  decision and `/ai-gtm` leads with the build-or-partner story. The judgement
  audit result gives the reader one finding, one reusable rule and a worked
  example of compounding, ending in a fresh AI brain brief (#333). Both wait on
  Krish's review before publication.
- 2026-11-20: brain modules went live (#319 to #331): a $59 module on the
  opening screen of the catalogue (the production page measured 9,189px tall at
  390px wide, the built candidate 2,401px), free codes for makeyourmindup
  members, membership read live from Stripe, a designed receipt and one-click
  install. The header link reads "Media" up to 700px wide and "Our media
  channel" above it. Detail is under "next" below.
- 2026-11-19: a live probe showed Stripe records a promotion code on the
  session with its coupon empty, so the first webhook check would have refused
  every real member; the webhook now reads the code's coupon from Stripe, and
  member links apply the code at checkout because the hosted code box refused
  valid codes from a cloud machine seen as a Mexican visitor.
- 2026-11-17 to 18: Krish chose the thesis "AI makes strong judgement stronger
  and weak judgement weaker. Mindmake builds the strong kind." for the canon's
  "Why this exists", and "Who decided?" (`/who-decided`, unlisted, noindex)
  was built as the first lead magnet, a private read with no score that
  leaves nothing on the server. `project-documentation/krishs-mission/` holds
  the thirteen-file mission pack. The unpublished `/parts` candidate reached r5
  and the parts research pilot is paused for a record-and-replay bench
  (`project-documentation/parts-research-next-steps.md`); report quality was
  unstable across live runs.
- 2026-11-15: use cases and the eighteen client quotes have one record each
  (#301) and `/case-studies` finds a use case by type, situation, role or search.
- 2026-11-13 to 14: Microsoft Clarity sits behind the same Allow as Google
  Analytics, aimed at where readers stop before "Check your email."; the
  SendLinks page is served at `/l/<link>` (#300). Earlier entries are in the LOG.

## What is next and what is waiting on Krish

- Brain modules, 20 November: live and on sale at mindmake.co/brain-modules
  ($59 one-off, eight modules, Claude Desktop only, ticked before buying).
  Checkout takes every payment method; `MAKEMYMINDUP` (one free module) and
  `MAKEMYMINDUP-FOREVER` (every module) are permanent codes for the member's
  own address. Membership is read live from Stripe's Substack subscriptions
  (founding or paid) with `kit_members` as override; Krish's four addresses are
  unlimited. After paying: thank-you page, designed receipt email, one-click
  install page (`/brain-modules/download`, a `.mcpb` the buyer opens in Claude
  Desktop). Lead magnets: "Measure your AI judgement" and the brain modules,
  both on `/2-minute-ai-upgrade-toolkit`. Merged and deployed; not yet proven by
  a real card purchase, a clean-machine install, or the Substack welcome emails
  (Cowork). Held claims for brand-new members need a manual `kits-members`
  recheck until a scheduled one is built. The module code lives in the private
  mindmake-kits repository. Detail: `now-notes/2026-11-20-brain-modules-live.md`.

- Krish to update `00_NORTH_STAR.md` lines 83 to 86 (still says seventeen
  stories) and decide whether R-07 in `04_PROOF_RECORDS.md` stays.
- Firecrawl (page reading) and Parallel (web search) keys exist in the Supabase
  edge function secrets, unused, no spend; use only when a task needs a cited
  page, and record the source of any claim that rests on one.
- Waiting on Krish to review: the catalogue design, the AI Brain draft, the
  judgement audit results and "Who decided?" before it goes live and joins the
  navigation, and his founding story's exact words.
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
  speed test, not a brief, and expired unused. Also: confirm a fresh SendLinks
  link opens at `https://mindmake.co/l/<link>` on his phone.

No new public prices, durations, claims, sections or routes without scope.
Do not ask the owner to reapprove settled selections or quietly choose new ones.
- North Star check (2026-11-23): holds.

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
