---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-27
head: 19c81d2
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
standards, judgement and memory. The public brand is mind/make; Mindmake is the
company. Two doors, Build your AI brain and Build your AI business, lead to one
privately scoped paid proof. The homepage line is **AI can copy almost anything
except your taste.** (Krish, 25 November 2026; "AI chief of staff" is retired
everywhere). The way in is **Start building your AI brain** (**Start building
your AI business** on `/ai-gtm`). The publication, **Make Your Mind Up** at
https://makeyourmindup.ai, is for readers not ready yet. CTRL is the invite-only
toolkit used with a client inside the 30-day Sprint; it has no public signup,
waitlist or launch date. The whole account is "Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md).

This repository is the site at https://mindmake.co and `project-documentation/`,
the numbered canon and the one source of truth for the business. Numbered documents own business truth;
[CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) own how work is done here.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer: a leader who shapes creative
work, culture or sport (media first) and can move a decision and the result
behind it.
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md) and
[01_CANON.md](project-documentation/01_CANON.md) own buyers, offers, claims and
approved copy; read them before writing anything public. The site is the front
door to both doors and to the proof, so every public word here is a claim the
business stands behind. Everything in `never_publish` above stays off it.

## Where it is right now (as of 2026-11-27)

<!-- north-star-state {"week_of":"2026-11-02","week_target":"private","current":"private","current_as_of":"2026-11-02","current_source":"Control Center revenue_events (Stripe, account mindmaker_llc), read-only","urgency":4,"urgency_reason":"at 28% of this week's target"} --> **North Star number: U4, far behind.** Cash collected by Mindmake, trailing 4 weeks: at 28% of this week's target (figures private). A bold swing every day; work that does not move the number waits.

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md).

Keep the accepted composition, copy, imagery, controls and responsive choices.
Since S6 (24 October 2026) every page is three sections: the problem, how it
works, and what the reader gets and how they know it works. Nothing on the
homepage pins and no section is taller than a desktop screen
(`qa:section-heights`). Stories are organised by six wishes (what the reader
wants to do more of) across `/case-studies`, the homepage, `/ai-brain`,
`/ai-gtm` and `/new-age-leadership`: real records keep their facts and quotes,
and twelve clearly labelled EXAMPLE cards cover six worlds (music is out of
v1). `/ai-brain` explains what an AI brain is with a liquid Brain and five
parts; `/ai-gtm` leads with production, distribution and monetisation for
creative and media owners. `/new-age-leadership` keeps its pinned chapters.
Generate the homepage adapter from the immutable R3 source, never reconstruct
it from older components.

Brain modules are live at `/brain-modules` and sold there; the judgement
audit ("Who decided?") and `/2-minute-ai-upgrade-toolkit` are unlisted pages.
`/parts` carries the parts research pilot (paused, see Next). Live state and
limits: `06_CURRENT_STATE.md`.

Since 26 October 2026 the brief takes 8 clicks from the homepage hero to
"Check your email." and sends the code before the research behind it. The last
end-to-end delivery proof (verification, visitor and operator INBOX delivery,
persistence, one due follow-up and a downloaded brief) is from 24 September
2026; a code confirmed by a person since the 26 October function deploy is not
yet recorded. That proof is not permission for additional sends.

A live discoverability readback on 26 October 2026 passed on all 36 routes and
42 metadata assets.

## What changed recently

- 2026-11-26: a run of browser findings that had failed verification on main
  since at least #336 was cleared (PRs #338 to #343). Safari does not focus a
  clicked button, so the brief returned focus to the body on close; presses are
  now recorded from page load (`src/lib/lastPressed.ts`). At 320x568 `/ai-brain`
  began under the 64px fixed header and its heading overlapped it. CI's jsdom
  has no Path2D, so mounting the new `/ai-brain` threw and failed the
  approved-routes job after #337; the Brain now paints only where canvas exists.
  On a phone the cookie notice docks under the masthead (Krish, 2026-10-24);
  on desktop it sits after the footer (Krish, 2026-11-25).
- 2026-11-26: One motion system and a clearer journey (PR #337): shared easings,
  a breathing Brain, homepage wish chips that open the stories already
  filtered, and one next step at the end of every page. Plain language for
  readers who have never used AI on `/ai-brain`.
- 2026-11-25: Krish repositioned the site for creative work, culture and sport.
  Rulings: mind/make is the public brand; "AI chief of staff" is retired
  everywhere; the offers are AI Immersion and the 30-day Sprint; the homepage
  h1 is "AI can copy almost anything except your taste."; the exit-card price
  is gone; existing founder mentions stay and none are added. Canon, search
  metadata, `/ai-brain` and `/ai-gtm` moved together (commits a97bbe9c to
  0f7a074a).
- 2026-11-23: phone-only dark wash behind the hero's publication line, because
  the line was hard to read over the bright photo (issue #335, PR #336, Krish
  approved the change to the locked homepage file; the route lock moved with
  it). Keep it in any later phone hero, or replace it with something that
  passes the same legibility check.
- 2026-11-20: brain modules went on sale at `/brain-modules` ($59 one-off, eight
  modules, Claude Desktop only), with every payment method, a thank-you page, a
  designed receipt and a one-click `.mcpb` install page (PRs #316 to #332).
  A live probe showed Stripe records a promotion code on the session with its
  coupon empty, so the first webhook check would have refused every real
  member; the webhook now reads the coupon from Stripe. Membership for the free
  codes is read live from Stripe, with `kit_members` as override.

## What is next and what is waiting on Krish

- Brain modules: merged and deployed, not yet proven by a real card purchase, a
  clean-machine install or the Substack welcome emails (Cowork). Next
  (2026-11-20): Krish buys one module with his own card, refunds it, and reads
  the thank-you page, the email on his phone and the install page. Held claims
  for brand-new members need a manual `kits-members` recheck until a scheduled
  one exists. The module code lives in the private mindmake-kits repository.
- Waiting on Krish: the open decisions in
  `project-documentation/krishs-mission/11-open-decisions.md` (D2, D4, D6, D7
  first); his review of the judgement audit results and the AI Brain draft
  before publication; whether R-07 in `04_PROOF_RECORDS.md` stays, and a check
  of `00_NORTH_STAR.md` lines 83 to 86 (once seventeen stories) against the
  eighteen client quotes.
- `/parts` research: start a new session from
  `project-documentation/parts-research-next-steps.md` and build the
  record-and-replay bench before any more engine fixes.
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
