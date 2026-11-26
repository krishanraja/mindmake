---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-26
head: 77b1bef
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
builds a leader who shapes creative work, culture or sport their own AI
brain: a working system that holds their taste, standards, judgement and
memory. The homepage headline is "AI can copy almost anything except your
taste." (Ruling, Krish, 2026-11-25); the public brand and wordmark is
mind/make, and Mindmake stays the company's name. The offers are AI Immersion
and the 30-day Sprint; CTRL is the invite-only toolkit used with a client
inside the Sprint, with no public signup, waitlist or launch date. "AI chief of
staff" is retired everywhere. The publication, **Make Your Mind Up** at
https://makeyourmindup.ai, is for readers not ready yet. The whole account is
"Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md).

This repository is the site at https://mindmake.co and `project-documentation/`,
the numbered canon and the one source of truth for the business. Numbered
documents own business truth; [CLAUDE.md](CLAUDE.md) and
[AGENTS.md](AGENTS.md) own how work is done here.

## Who it is for and why it matters for Mindmake

This is Mindmake itself. Since 25 November 2026 the audience is the people who
shape creative work, culture and sport: media first; the people who make the
calls lead, the people who make the work second; music is out of v1 (Ruling,
Krish, 2026-11-25). [00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md)
and [01_CANON.md](project-documentation/01_CANON.md) own buyers, offers, claims
and approved copy; read them before writing anything public. The site is the
front door to the proof, so every public word here is a claim the business
stands behind. Everything in `never_publish` above stays off it.

## Where it is right now (as of 2026-11-26)

<!-- north-star-state {"week_of":"2026-11-02","week_target":"private","current":"private","current_as_of":"2026-11-02","current_source":"Control Center revenue_events (Stripe, account mindmaker_llc), read-only","urgency":4,"urgency_reason":"at 28% of this week's target"} --> **North Star number: U4, far behind.** Cash collected by Mindmake, trailing 4 weeks: at 28% of this week's target (figures private). A bold swing every day; work that does not move the number waits.

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md). Keep the accepted
composition, copy, imagery, controls and responsive choices; generate the
adapter from the immutable R3 source, never reconstruct it from older
components. Every page is three sections (S6, 24 October 2026): the problem,
how it works, and what the reader gets and how they know it works. Nothing on
the homepage pins; no section is taller than a desktop screen
(`qa:section-heights`). `/new-age-leadership` keeps its pinned chapters.

Stories are organised by what the reader wants to do more of: six wishes
replace the earlier five situations across `/case-studies`, the homepage proof,
`/ai-brain`, `/ai-gtm` and `/new-age-leadership`. Real records keep their facts
and quotes; twelve clearly labelled EXAMPLE cards cover the six worlds.
`/ai-brain` explains what an AI brain is (the liquid Brain, a North Star and
five parts, each a plain question) for readers who have never used AI;
`/ai-gtm` leads with content production, distribution and monetisation for
creative and media owners. `/case-studies` finds a reader's use case by type,
situation, role, result or search, then shows the approved client quotes (one
record each in `src/data/useCases.ts` and `src/data/testimonials.ts`).

Brain modules are live and on sale at mindmake.co/brain-modules ($59 one-off,
Claude Desktop only). Checkout takes every payment method; `MAKEMYMINDUP` (one
free module) and `MAKEMYMINDUP-FOREVER` (every module) are for members' own
addresses, with membership read live from Stripe and `kit_members` as override.
After paying: a thank-you page, a designed receipt, a one-click install page.
Merged and deployed, but not proven by a real card purchase, a clean-machine
install or the Substack welcome emails. Held claims for brand-new members need
a manual `kits-members` recheck. The module code lives in the private
mindmake-kits repository. The free "Who decided?" judgement audit
(`/who-decided`, unlisted, noindex) and the unpublished `/parts` candidate are
built but not announced; both wait on Krish's review of the rendered pages.
The "Prefer to ...?" compare nudge and the shared header ("Media" up to 700px,
"Our media channel" above) are live.

Since 26 October 2026 the brief takes 8 clicks from the homepage hero to
"Check your email." and sends the code before the research behind it. The last
end-to-end delivery proof is from 24 September 2026; a code confirmed by a
person since the 26 October function deploy is not yet recorded. That proof is
not permission for additional sends. A live discoverability readback on 26
October 2026 passed on all 36 routes and 42 metadata assets; routes and
metadata have changed since and that readback has not been repeated.

## What changed recently

- 2026-11-26: two standing browser failures fixed (PRs #339, #340). The phone
  media line kept its dark wash by shifting its box 12px off the wordmark's
  edge; the wash is now drawn behind it. Safari does not focus a clicked
  button, so the brief returned focus to the body on close; presses are now
  recorded from page load (`src/lib/lastPressed.ts`). `/ai-brain` at 320x568
  began under the 64px fixed header. Both had failed browser verification on
  main since at least #336.
- 2026-11-26: the new `/ai-brain` room failed CI after #337 because jsdom has no
  `Path2D`, so mounting it threw. The liquid Brain now paints only where canvas
  and `Path2D` exist, and the six parts stay working buttons elsewhere (PR
  #338). Also from #337: one motion system and one next step at the end of
  every page, homepage wish chips that open stories already filtered, a calmer
  type scale, and fixed chrome no longer over text.
- 2026-11-25: the repositioning (PR #337 and its commits): taste leads the
  homepage and search metadata, the staffing title is retired, the exit-card
  price is gone, and the public canon was aligned with creative decision-makers
  (Rulings, Krish, 2026-11-25, quoted in the commits and in 01_CANON.md). The
  route lock moved with the intended edits.
- 2026-11-23: on phones the homepage hero's publication line sits on a dark
  wash so it stays readable over the bright photo (PR #336). Krish approved the
  edit to the locked homepage file; keep the wash in any later phone hero.
- 2026-11-20: brain modules went on sale and the member codes work end to end
  (PRs #316 to #329). A live probe showed Stripe records a promotion code on the
  session with its coupon empty, so the first webhook check would have refused
  every real member; the webhook now reads the coupon from Stripe. At 390px the
  redesigned catalogue measured 2,401px against 9,189px for the old page.
- 2026-11-13: Microsoft Clarity is in the head of every page, behind the same
  Allow as Google Analytics, aimed at where consenting readers stop between the
  hero and "Check your email." `/privacy` sections 4 and 5 name Clarity.

## What is next and what is waiting on Krish

- Next (2026-11-23): keep the phone hero wash in any later redesign, or replace
  it with something that passes the same legibility check. Open reviews for
  Krish: the `/who-decided` and `/parts` pages on the protected preview, the
  judgement audit results, the AI Brain decision story draft, and his founding
  story's exact words before it is published.
- Brain modules: Krish buys one with his own card (then refunds it) and reads
  the thank-you page, the email on his phone and the install page.
- Krish answers the open decisions in
  `project-documentation/krishs-mission/11-open-decisions.md`, starting with
  D2, D4, D6 and D7. He also updates `00_NORTH_STAR.md` where it still says
  seventeen stories and decides whether R-07 in `04_PROOF_RECORDS.md` stays.
- The Parts research pilot is paused for a replayable test bench; the handoff
  is `project-documentation/parts-research-next-steps.md`.
- Physical iPhone VoiceOver and Android TalkBack have never been run; every
  release since 24 September 2026 shipped without them.
- Search-console ownership, indexing, ranking and AI citation outcomes are not
  established by technical checks. Require fresh evidence for those claims.
- Dependency advisories remain upgrade work, not a clean audit.
- The 4000+ attendance count approved on 26 September 2026 (`04_PROOF.md`)
  needs its section 6 evidence trail before use beyond the approved line on
  `/case-studies`.
- In play: the CTRL pilot with leaders, by invitation from Krish only, and the
  first outreach drafts, each waiting for his yes to that exact send.
- Waiting on Krish: a rendered mock of the corroborated company read and one
  name for the lead-brief deliverable (`LEAD-BRIEF-INTELLIGENCE-001`,
  `LEAD-BRIEF-DELIVERABLE-001`), and one brief started and confirmed on a phone.
  Also: confirm a fresh SendLinks link opens at `https://mindmake.co/l/<link>`.
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
- Anything that still says "AI chief of staff", two doors, or the old headline
  as current: retired 25 November 2026 (see 01_CANON.md).
- Prices, durations, dates or availability from memory. The canon and the live
  source own them, and most of them are never published.
