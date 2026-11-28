---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-28
head: acc79bbf
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
builds an AI brain for the people who shape creative work, culture and sport,
media first: a working system that holds their taste, standards, judgement and
memory. The headline turns through six lines and opens on **AI can copy almost
anything except your taste.** Two doors, **Build your AI brain** ("Put your
taste and judgement to work on your next call.") and **Build your AI
business** ("Make, share and earn from your work with AI."), lead to the
offers, AI Immersion and the 30-day Sprint, priced privately. The way in is
**Start building your AI brain** (**Start building your AI business** on
`/ai-gtm`). The publication, **Make Your Mind Up** at
https://makeyourmindup.ai, is for readers not ready yet. CTRL is the toolkit we
use with clients inside the Sprint; it has no signup, waitlist or standalone
use. The positioning was approved on 25 November 2026 and is live since PR
#337. The whole account is "Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md).

This repository is the site at https://mindmake.co and `project-documentation/`,
the numbered canon and the one source of truth for the business. Numbered documents own business truth;
[CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) own how work is done here.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer: a person who shapes
creative work, culture or sport and can move a decision on their own, such as a
publisher, commissioning editor, creative producer or studio owner. Media comes
first, then entertainment, sport, arts and creative businesses; the people who
make the calls first, the people who make the work second. Music is outside v1.
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md) and
[01_CANON.md](project-documentation/01_CANON.md) own buyers, offers, claims and
approved copy; read them before writing anything public. The site is the front
door to both doors and to the proof, so every public word here is a claim the
business stands behind. Everything in `never_publish` above stays off it.

## Where it is right now (as of 2026-11-28)

<!-- north-star-state {"week_of":"2026-11-02","week_target":"private","current":"private","current_as_of":"2026-11-02","current_source":"Control Center revenue_events (Stripe, account mindmaker_llc), read-only","urgency":4,"urgency_reason":"at 28% of this week's target"} --> **North Star number: U4, far behind.** Cash collected by Mindmake, trailing 4 weeks: at 28% of this week's target (figures private). A bold swing every day; work that does not move the number waits.

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md).

Keep the accepted composition, copy, imagery, controls and responsive choices.
Between the R3 opening and the footer the homepage carries "Every new
technology asks us to change how we think." (the four eras, a carousel on
their pictures), "We build yours with you in 30 days." (with "A rule worth
keeping" and the chooser "What would you do more of?", six wishes that each
open `/case-studies?wish=<id>`) and "What the work made possible." (three
results, two client voices, "Explore what leaders built", "Start your brief"
and "Inside an AI brain →"); nothing on the homepage pins. `/ai-brain` opens on
"Teach your AI what experience taught you.", then "The questions only you can
answer." and the liquid Brain (North Star and five parts) under "Your AI brain
knows how you think.", then the 30-day Sprint and the stories by wish in a
sheet. `/ai-gtm` opens on "Make it, share it, and get paid for it." and covers
production, distribution and monetisation. Stories are grouped by six wishes:
eighteen use cases and twelve labelled illustrative examples. One motion system
runs site-wide. `/new-age-leadership` keeps its pinned chapters. Generate the
adapter from the immutable R3 source, never reconstruct it from older
components.

Since 26 October 2026 the brief takes 8 clicks from the homepage hero to
"Check your email." and sends the code before the research behind it. The last
end-to-end delivery proof (verification, visitor and operator INBOX delivery,
persistence, one due follow-up and a downloaded brief) is from 24 September
2026; a code confirmed by a person since the 26 October function deploy is not
yet recorded. That proof is not permission for additional sends.

A live discoverability readback on 26 October 2026 passed on all 36 routes and
42 metadata assets.

## What changed recently

- 2026-11-25 to 26: the creative repositioning (PRs #337 to #343, merge `19c81d25` on 26 November) is live. New headline, audience, door names and copy across `/`, `/ai-brain` and `/ai-gtm`; stories grouped by six wishes with twelve labelled examples; one motion system; the cookie notice docks under the masthead on phones again (Krish's 24 October ruling). Browser verification on main passed in Chromium, Firefox and WebKit (run 45755491040 on `19c81d25`). Detail: [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
- 2026-11-14: the SendLinks recipient page is served at `/l/<link>` (PR #300), from `public/l/index.html`, with `/l/config.js` coming from `api/sendlinks-config.js`, which reads `SENDLINKS_OPEN_BASE` so the SendLinks address is never committed to this public repository. `/l/` is noindex, no-referrer and no-store. The page's source is `krishanraja/sendlinks` `web/recipient/`; the route lock was regenerated for the intended edit.
- 2026-11-23: on phones the publication line at the foot of the homepage hero sits on a dark wash so it stays readable over the bright photo. Krish approved the edit to the locked homepage file that day; the route lock moved with it.
- 2026-11-20: brain modules went live at mindmake.co/brain-modules (detail under next). The catalogue was redesigned so a priced module is on the opening screen: at 390px the production page measured 9,189px tall and the built candidate 2,401px. Member codes were fixed after a live probe showed Stripe records a promotion code with its coupon empty, which would have refused every real member. The header shows "Media" up to 700px wide and "Our media channel" above.
- 2026-11-18: Krish's Mission, a working pack of thirteen files in `project-documentation/krishs-mission/`, holds the ladder from purpose to the business number, the chosen pitch sentence, CTRL, proposed surface copy and every open decision. No live copy, route or price changed. The parts research pilot paused for a replayable test bench; report quality is unstable across live runs (`project-documentation/parts-research-next-steps.md`).
- 2026-11-17: Krish chose the judgement audit "Who decided?" as the first lead magnet; it is built at `/who-decided`, unlisted and noindex, awaiting his review. The canon's "Why this exists" now carries his thesis, with its sources. Ruling (Krish, 2026-11-17): "This needs to be a world class lead magnet site in terms of conversion rates, but not tacky looking".
- 2026-11-15: use cases, results and client quotes have one record each (`src/data/useCases.ts`, `src/data/testimonials.ts`, PR #301), and `/case-studies` finds a use case by type, situation, role, result or search. Krish to update `00_NORTH_STAR.md:83-86` (still says seventeen stories) and decide whether R-07 in `04_PROOF_RECORDS.md` stays.

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
- In play: CTRL, now framed as the toolkit used with clients inside the Sprint
  (25 November 2026), and the first outreach drafts (a post, a note to his network, a Make Your Mind Up
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
