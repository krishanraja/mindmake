---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-09-25
head: e5a17d7
lifecycle: live
production_url: https://mindmake.co
state_doc: project-documentation/06_CURRENT_STATE.md
history_log: project-documentation/history/LOG.md
truth_files: []
authority_order: [project-documentation/00_NORTH_STAR.md, project-documentation/01_CANON.md, project-documentation/02_PUBLICATION.md, project-documentation/03_DESIGN_CONTRACT.md, project-documentation/04_PROOF.md, project-documentation/04_PROOF_RECORDS.md, project-documentation/05_LEAD_DELIVERY_SPEC.md, project-documentation/06_CURRENT_STATE.md, project-documentation/07_DEPLOYMENT.md, project-documentation/07_DEPLOY_RUNBOOK.md]
steward: https://github.com/krishanraja/control-center/blob/main/docs/steward/RUNBOOK.md
never_publish: [the private price and the internal rate card, the cash floor and the volume ceiling, the internal budget anchors, the duration of the proof and the internal month shape and hour envelope, client names outside the consented proof set, anything in 04_PROOF_RECORDS.md, the buyer archetype and its name, the private routing observation, the internal sales wedge, the method's name, availability or a start date, deployment ids, the Supabase project id, credential and secret names, the operator's mailbox address]
---
# Mindmake: where it is right now

## What it is
Mindmake is Krish Raja's principal-led AI and commercial strategy practice, sold at mindmake.co under the headline "Build the business that can think with you." Two doors, Build your AI brain and Build your AI GTM, both lead to one privately scoped paid proof.

## Who it is for and why it matters for Mindmake
The buyer is a founder, principal, portfolio owner, investor or senior commercial leader who already has twenty years of judgement built up and wants an AI that compounds that judgement rather than a generic assistant that ignores it. For a content or lead-generation agent: Mindmake is the named product, and the site's own proof (`04_PROOF.md`, eight verified client outcome stories) is the only attributable evidence to quote. Do not name the private buyer archetype or quote a price; both are withheld deliberately (see `never_publish`).

## Where it is right now (as of 2026-09-25)
Live and verified: the approved R3 homepage at https://mindmake.co, carrying the opening, the R3 history chapter (four pinned eras), the three new-age leadership chapters shared with `/new-age-leadership`, the AI Brain and AI GTM routes, and the shell footer. `06_CURRENT_STATE.md` is the operational source of truth and was last reconciled against commit `71f9164` (PR #212); the newest merge, PR #213 (commit `e5a17d7`, smoother era transitions and a stable pinned frame on phones), is recorded in the history log and changes no claim `06_CURRENT_STATE.md` makes, so it needed no further edit there.

Built but not yet separately owner-reviewed: the `/ai-gtm` r47 rebuild is live, but Krish's review of it is still open as `AI-GTM-R47-OWNER-REVIEW-001` in the feedback ledger. Blocked or outstanding: physical iPhone VoiceOver and Android TalkBack passes remain unperformed under the owner's release-only exception; Search Console/Bing property ownership and any indexing, ranking or AI-citation claim remain unverified; the dependency audit (23 entries) remains upgrade work, not a clean audit.

## What changed recently
- 2026-09-25: The homepage history chapter's era changes now dissolve instead of cutting, and the pinned frame holds still on a phone. Krish's own words on the prior build: "These section transitions are quite jittery. Is there any way to make them smooth as butter?" The frame was resizing mid-scroll because it was sized in `dvh` and the phone's address bar kept changing that value. PR #213, commit `e5a17d7`.
- 2026-09-25: The lead dialog is usable on a phone. Krish: "The keyboard interaction on this lead capture form on mobile is absolutely horrendous... there's a fake MindMake logo in the top left... it doesn't actually properly parse the email." The header now carries the real logo, a `first.last@` or `first_last@` work address prefills both name fields without ever overwriting a typed name, and the focused field stays clear of the keyboard. PR #212, commit `71f9164`.
- 2026-09-25: Every page now renders in the AI Brain page's own type system (Newsreader for reading copy, Archivo for actions, Plex Mono for labels), after an audit of every visible text node found the shell pages had been set in the wrong face since an earlier pass misread which font the AI Brain page actually used. PR #210, commit `e711cf4`.
- 2026-09-25: The homepage hero now plays the Archive Engine r07 film loop. Krish rejected the r06 local Blender render after seeing the moving result and ordered its complete removal from the repository; it consumed no generative-video credits and is not an approved visual reference. PR #211 (r07) and PR #202 (the r06 revert).
- 2026-09-25: `/ai-gtm` was rebuilt (r47) on the site's own design system after Krish rejected the live GTM-PLAIN-R2 page as "the most confusing user experience... no visual hierarchy of sections... no scroll builds." His review of the rebuild is open as `AI-GTM-R47-OWNER-REVIEW-001`. PR #204, commit `bac8797`.
- 2026-09-25: The AI Brain page was rewritten to speak to the reader (BRAIN-NARRATIVE-S4), on Krish's "it feels like it speaks TO the user directly, as opposed to just being a product showcase with facts everywhere." Five chapters (You, Inside, Sharper, Private, Business) replace the retired source-check and correction chapters. PR #205, commit `0257388`.
- 2026-09-25: The menu was relabelled in plain wording (Success stories, Ideas you can use, Quick AI tips, Questions we get asked, About us) and a new `/about` page shipped with Krish's own career record and named references. PR #207, commit `7dcf330`.
- 2026-09-25: Quick AI tips merged into one filterable `/blog` list with every longer read, newest first; `/answers` now redirects there permanently. PR #208, commit `e580625`.
- 2026-09-25: Google Analytics (consent-gated) now runs alongside the existing cookieless Plausible count; nothing is requested from Google until the visitor chooses Allow on the privacy notice. PR #182 to #184.
- 2026-09-25: Krish ruled that Chromium alone gates a merge; Firefox and WebKit run on main after the merge, never before it, and an open feedback-ledger item no longer blocks a branch. Recorded in `CLAUDE.md` and `07_DEPLOY_RUNBOOK.md`.

## What is next and what is waiting on Krish
Single next action: Krish's review of the `/ai-gtm` r47 rebuild, `AI-GTM-R47-OWNER-REVIEW-001` in the feedback ledger, is still open. Also waiting on Krish: the physical iPhone VoiceOver and Android TalkBack passes his release-only exception deferred, and a decision on the compatibility-tested dependency upgrades the bounded audit left outstanding.

## Read next
1. [CLAUDE.md](CLAUDE.md): execution guardrails, required verification gates and the standing merge authorisation.
2. [project-documentation/README.md](project-documentation/README.md): the numbered documentation index and precedence order.
3. [project-documentation/00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md): purpose, values and positioning (canon, never edited by the steward).
4. [project-documentation/01_CANON.md](project-documentation/01_CANON.md): accepted copy, offer, buyers and private commercial terms (canon, never edited by the steward).
5. [project-documentation/06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md): live identities, verified evidence and open limits; the operational source of truth.
6. [project-documentation/website-redesign/STATE.md](project-documentation/website-redesign/STATE.md): the accepted R3 implementation guard and change contract.
7. [project-documentation/history/LOG.md](project-documentation/history/LOG.md): the single historical ledger.

## Do not trust
Nothing currently in the tree claims to be current and disagrees with another document. `project-documentation/homepage-redesign/STATE.md` and the other short files in that directory are intentional locator stubs (per `project-documentation/README.md`) pointing to their replacement; they are not unlabelled duplicates.

The one open structural problem is in `project-documentation/history/LOG.md` itself: the 2026-09-24 documentation consolidation (commit `ff8f8d3`) appended roughly 7,000 lines of former documents' full bodies, with their own subheadings, instead of flat dated log entries or separate archived files with a Historical banner. This makes about 200 of the file's `##` headings non-date headings and puts several dates out of chronological order. None of it misstates current fact, and no content was altered, but it fails this repo's own steward validator (`node .steward/scripts/steward/validate.mjs`) on structure. Restructuring it correctly means splitting each former document into its own banner-bearing file under `project-documentation/history/` without losing any of its content, which is beyond this run's budget; it is reported here rather than rewritten by guess.
