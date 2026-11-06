---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-11-05
head: a2cba1f
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

## Where it is right now (as of 2026-11-05)

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
(the four eras, a carousel on their pictures), "A chief of staff knows how you
think." (the organisation and a carousel of practice scenes) and "Built on
your real work. Yours to keep."; nothing on it pins. The AI Brain stories are a
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

- 2026-11-06: Krish asked for more logos, homepage quotes that send readers to
  the results, and "no section should be bigger than a desktop screen on
  desktop. This is imperative." The `/case-studies` rail now carries all 16
  approved attendee brands as a slow loop; the homepage's last section carries
  one client voice at a time beside the way in, ending in "See every result";
  and every homepage section after the opening fits below the masthead from
  1280x620 to 2560x1440 (the how picture had stood 976px tall at 1866x900).
  Below about 680px of window height the R3 opening keeps its own floor.
- 2026-11-04: after Krish's review of the live site (S7, PRs #265 to #269),
  the story cards lie on their own pictures, every section fits one screen,
  copy is in plain words, nothing is set in italic, and one library,
  "What you can do with it.", serves both products on `/case-studies`.
  The homepage and then `/ai-brain` and `/ai-gtm` build as they are read, with
  a quick pen drawing two strokes under each heading's last line, approved
  from phone recordings ("Merge"). Every heading sits on the logo's left edge,
  enforced by `qa:alignment`.
- 2026-11-04: Krish on first visits: "Some of the images take up to 10 seconds
  to load on a user's first visit. That is completely unacceptable." Pictures
  are now sized to the screen and films wait their turn (`qa:first-visit`,
  PR #271). Then S8 (#275, #276): `/ai-gtm`, `/ai-brain` and the chief of staff
  section carry one idea per section, approved from now-and-planned mocks
  ("the rest of it looks good"), with icons, detail one tap away and shorter
  phone pages (`/ai-gtm` 4,710 to 4,079px at 390 wide). Ledger row `S8-CALM-001`.
- 2026-11-02: a feedback form for DoThinkDo staff went live at `/feedback/dtd`
  (PRs #258 to #264), unlisted and noindex, one screen at a time, speaking as
  Krish. It was reworked six times in a day from his live use: Next sat below
  the fold at 1536x730, 1280x620, 1100x560 and 360x780, so the card now never
  exceeds the window; a Let's go tap made before hydration reloaded onto the
  welcome, so an inline script keeps it; two-gap starters were "fiddly" and
  glitchy, so starters are one-gap openings and the server refuses an
  unfinished sentence. Responses are emailed, nothing is stored.
- 2026-11-02: the form asks permission to quote, unticked. Krish first asked
  for a pre-ticked box; a pre-ticked box is not valid consent under UK GDPR
  (the brief's publication choice is unticked for the same reason), so he
  chose an unticked box beside the name, with no name meaning anonymous
  attribution. The server accepts yes only against `dtd-quote-consent-v1`.
- 2026-11-02: `/alumni` was served the homepage first with JavaScript off
  ("Promote your AI from intern to chief of staff."), because it was rewritten
  to the prerendered homepage. It and `/feedback/dtd` are now prerendered as
  unlisted pages; the sitemap is still 36 URLs and the route lock was
  regenerated for the intended `prerender.mjs` and `vercel.json` edits.
- 2026-10-28: the brief's "Keep the private brief" sits at the bottom right
  of the preview card, bigger and pulsing, with no line beneath it, and the
  brief's first screen asks for analytics consent itself when none is stored,
  because a brief opened from a `?start=1` link covered the page notice
  (PR #256; Krish: "I also want the green button in the bottom right, bigger,
  pulsing and without the accompanying text beneath it." and "Ask inside the
  brief"). Ledger rows `BRIEF-KEEP-001` and `BRIEF-CONSENT-001` await his
  review of the result.
- 2026-10-28: the brief request records which growth placement it came from
  (`utm_source=growth-<path>`, `utm_medium=referral`, from the tag held in
  page memory only, null otherwise), and `/privacy` section 2 says so, on
  Krish's yes ("Yes do number two"). Migration, `submit-mindmake-brief` v24
  and PR #255, in that order.

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
- North Star check (2026-10-28): holds.

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
