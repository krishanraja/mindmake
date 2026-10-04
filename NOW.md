---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-10-04
head: 8d71663
lifecycle: live
production_url: https://mindmake.co
state_doc: project-documentation/06_CURRENT_STATE.md
history_log: project-documentation/history/LOG.md
truth_files: []
authority_order: [project-documentation/00_NORTH_STAR.md, project-documentation/01_CANON.md, project-documentation/02_PUBLICATION.md, project-documentation/03_DESIGN_CONTRACT.md, project-documentation/04_PROOF.md, project-documentation/04_PROOF_RECORDS.md, project-documentation/05_LEAD_DELIVERY_SPEC.md, project-documentation/06_CURRENT_STATE.md, project-documentation/07_DEPLOYMENT.md, project-documentation/07_DEPLOY_RUNBOOK.md]
steward: https://github.com/krishanraja/control-center/blob/main/docs/steward/RUNBOOK.md
never_publish: [the private price and the internal rate card, the cash floor and the volume ceiling, the internal budget anchors, any proof duration beyond the public 30-day shape, the internal month shape and hour envelope, client names outside the consented proof set, anything in 04_PROOF_RECORDS.md, the buyer archetype and its name, the private routing observation, the internal sales wedge, the method's name, availability or a start date, deployment ids, the Supabase project id, credential and secret names, the operator's mailbox address]
---
# Mindmake: current handoff

## What it is

Mindmake is a principal-led AI and commercial strategy practice. Two doors,
Build your AI brain and Build your AI GTM, lead to one privately scoped paid
proof. The approved headline is **Build the human + AI business that augments your vision.**

This repository is the site at https://mindmake.co and `project-documentation/`,
the numbered canon for the business. Numbered documents own business truth;
[CLAUDE.md](CLAUDE.md) and [AGENTS.md](AGENTS.md) own how work is done here.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer: a founder, principal
or senior commercial leader who can move a decision and the result behind it.
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md) and
[01_CANON.md](project-documentation/01_CANON.md) own buyers, offers, claims and
approved copy; read them before writing anything public. The site is the front
door to both doors and to the proof, so every public word here is a claim the
business stands behind. Everything in `never_publish` above stays off it.

## Where it is right now (as of 2026-10-04)

The approved R3 homepage and companion surfaces are live at https://mindmake.co.
The canonical live deployment, rollback, backend versions and evidence limits
are in [06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md).
Do not repeat deployment journals here. History lives only in
[history/LOG.md](project-documentation/history/LOG.md).

Keep the accepted composition, copy, imagery, controls and responsive choices.
Between the opening and the route, the homepage carries the R3 history
chapter (four pinned eras, from writing to satnav) and then the three new-age
leadership chapters (r41): the reach chapter in both its states, the system in
practice, and what the AI Brain makes possible with the returned hour. They
share one source with /new-age-leadership and pin by scroll in both directions.
Generate the adapter from the immutable R3 source, never reconstruct it from
older components.

The production company-first lead journey passed through actual verification,
visitor/operator INBOX delivery, persistence, one due follow-up and downloaded
brief inspection. That proof is not permission for additional sends.

Technical discovery metadata/social/icon verification and current-document
consolidation are live. All 26 public routes and 32 metadata assets passed
post-publication verification.

## What changed recently

- 2026-10-04: a fix to the hero headline rotation (#233). Since the smoother
  rotation of 27 September, every turn after the first flashed two different
  headlines stacked for a beat. Each turn copies the current line as an
  outgoing "ghost" that should lift away while the next headline rises in; the
  copy carried the `is-entering` class the previous turn had left on the line,
  so its rows matched the higher-specificity rule and ran the rise-in
  animation instead, fading in over the incoming headline before being removed
  mid-animation. The ghost now has that class stripped
  (`src/components/homepage-release/heroRotation.ts`).
- 2026-10-03: the public contact address changed to krish@mindmake.co (#232),
  Krish's ruling ("krish@mindmake.co is the public contact address, replacing
  krish@themindmaker.ai, which still redirects to it"). The old address had
  been chosen only because mindmake.co had no MX record and mail to it
  bounced; the domain now receives. Every contact link and the privacy notice
  read the one `CONTACT_EMAIL` constant, so it was a one-line change.
- 2026-09-27: motion made smoother across the site, from Krish ("The rotation
  animation is so blunt, needs to be much smoother. Same with the page
  transitions and loading"). The hero headlines now cross row by row instead
  of emptying between them; page changes crossfade over 720ms with a 10px
  rise instead of a hard-edged wipe, the masthead held still under its own
  view-transition name (a same-day fix after main's Chromium check failed
  #230: the open homepage menu drew a second masthead, and a duplicate
  transition name made Chromium refuse the navigation); and film or image
  media that has not painted when a page mounts fades up instead of cutting
  in, most visibly the /ai-brain film, never held back more than 2.5s
  (`MediaArrival.tsx`). The hero rotation gained two filtering headlines,
  "High standards deserve an AI that knows yours." and "AI can copy almost
  anything except your taste.", and dropped "Become the leader your business
  needs next.", from Krish's brief that the headlines should "filter out
  people that don't self-identify with this." Separately, `qa:chrome` had
  silently measured Chrome's own error page since the preview it assumed was
  already running never started; it now serves the built site itself and
  fails by name on a real load failure, and running for real for the first
  time it caught a genuine defect, the r31 consent notice breaking into two
  rows at 360px, now fixed.
- 2026-09-26 (later still): a fix forward after main's Chromium verification
  failed on #223. Above a phone the logo and footer had taken the homepage's
  wider gutter instead of each page's own content edge (`qa:logo-alignment`);
  a page's last footer link could sit under the cookie notice at the page end
  (`qa:release-routes`), so fixed bottom chrome now keeps a reader who reaches
  the end at the end (`src/lib/bottomReserve.ts`); and a short landscape
  screen's cookie notice, which had published about 330px of reserve and
  lifted the action bar off screen, now reserves nothing there and clears the
  masthead.
- Krish accepted the month's reading pace on `/ai-brain` from his phone
  ("Its good"); `AI-BRAIN-MONTH-PACE-001` is accepted.
- 2026-09-26 (later): one masthead and one footer on every page; every
  Media and Subscribe link goes to makeyourmindup.ai; the homepage history
  opener leads its chapter and the eras hold still; squashed headings and the
  /case-studies cards fixed on phones; the lead flow stays clear of the phone
  keyboard.
- 2026-09-26: the homepage's history questions became quotations, its reach,
  practice and returned-hour headings stopped over-wrapping, the returned
  hour's first answer is struck through in red by scroll, and the closing
  chapter carries "Own your judgement, and amplify it." over the hero's film
  (#217). The approved R5 prototype baseline was restored to its recorded
  bytes (#218).
- 2026-09-26: the homepage's search title, share card and `llms.txt` carry the
  hero headline; the returned hour reads "into"; each history era names its
  event ("370 BC · Writing is invented" and three to match); a twenty-viewport
  audit fixed eleven layout defects; the verbatim 24 September originals moved from the log to
  [history/ARCHIVE.md](project-documentation/history/ARCHIVE.md) so the docs
  steward passes; Chromium alone verifies a change (Krish).
- 2026-09-25: the history chapter was reinstated ahead of the leadership
  chapters (r41); menus, labels and the About page changed (r47); /ai-gtm was
  rebuilt (r47) and /ai-brain took BRAIN-NARRATIVE-S4 (r48); one type system
  runs across the site; the hero plays the Archive Engine r07 loop.

## What is next and what is waiting on Krish

- Physical iPhone VoiceOver and Android TalkBack remain outstanding under the
  owner's release-only exception.
- Search-console ownership, indexing, ranking and AI citation outcomes are not
  established by technical checks. Require fresh evidence for those claims.
- Dependency advisories remain upgrade work, not a clean audit.
- The 4000+ attendance count Krish approved on 26 September 2026
  (`04_PROOF.md`) still needs its section 6 evidence trail compiled before the
  figure is used anywhere beyond the approved line above the brand grid.
- Waiting on Krish: a rendered mock of the corroborated company read and one
  name for the lead-brief deliverable, before that second release is built
  (`LEAD-BRIEF-INTELLIGENCE-001`, `LEAD-BRIEF-DELIVERABLE-001` in the feedback
  ledger).

No new public prices, durations, claims, sections or routes without scope.
Do not ask the owner to reapprove settled selections or quietly choose new ones.

## Read next

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
- A build, an exit code or a screenshot alone as proof of behaviour, and an
  older receipt relabelled as new verification.
- Prices, durations, dates or availability from memory. The canon and the live
  source own them, and most of them are never published.
