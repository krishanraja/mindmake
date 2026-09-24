---
repo: krishanraja/mindmake
product: Mindmake
as_of: 2026-09-24
head: 0653dfd
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

Every AI a leader buys already knows the market; none of them know the leader, and Mindmake builds the one that does, so the leader keeps their edge as the market moves. Mindmake is a principal-led AI and commercial strategy practice run by Krish Raja. It helps a leader use AI to extend their judgement, taste and expertise, then turn that stronger capability into a better business result. This repository is two things: the site at `mindmake.co` (React and TypeScript on Vite, every indexed route rendered to markup at build time, promoted on Vercel, with six Supabase edge functions behind the lead pipeline and the live board), and `project-documentation/`, the canon for the whole business. Every other repository Krish runs defers to that canon on prices, offers, buyers and claims.

## Who it is for and why it matters for Mindmake

This is Mindmake itself, so the buyer is the canon's buyer. `00_NORTH_STAR.md`: "A founder, principal, portfolio owner, investor or senior commercial leader who can move a decision on their own, and whose decisions are big enough that getting them right matters." Buyer groups in `01_CANON.md`: founder, CEO, CRO or whoever owns revenue, strategy leader. The gate: "The person must own, or be able to move, the decision and the business result behind it."

The pain, in the canon's words: "the leader gets faster at drafting and no better at deciding, and the gap between what they know and what their tools know keeps widening." The hinge a writer may use: "You can hand over the work. You cannot hand over the understanding." The rule for the register: "Write for ambition as much as for pressure." Never doom, never commands, never boasting.

What is sold, exactly as canon locks it:

- Two public doors. **Build your AI brain**: "Encode your taste and judgement, amplify your strengths, uncover your blind spots." **Build your AI GTM**: "Create an AI-native GTM model across product, price, positioning or people." Either can be the way in; either can lead to the other.
- One paid proof behind both. The price is private, the length is agreed with it and neither appears on the site. The only primary action on the site is **Start here**. The approved headline is "Build the business that can think with you."
- CTRL is the product and proof layer, never a third thing to buy, never linked, never priced.

Copy-grade definition, safe to quote: "an AI brain is a working system that holds your taste, judgement, standards, memory and trusted context, and uses them on your real work." Everything in `never_publish` above stays out of any piece, whatever the source.

## Where it is right now (as of 2026-09-24)

- **Live** at `mindmake.co`. The approved R3 homepage, with native scroll-pinned history (four reversible states) and leadership-dividend (five stages) progression, is production: commit `9e79e35`, deployment `dpl_GcehNF5XMtFagREZ9Y5pKhHLQyJZ`, verified 24 September 2026 16:20 UTC. Recoverable prior release: `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`. `project-documentation/06_CURRENT_STATE.md`, "Live release".
- **26 public routes and 32 metadata assets** passed post-publication readback at 16:20 UTC; the redirect check covered six representative redirects. `www.mindmake.co`, `themindmaker.ai` and `www.themindmaker.ai` redirect to `mindmake.co` preserving path and query.
- **A delivered-surface correction pass is on the branch, not live.** `quality/route-lock/approved-production-r17.json` records six confirmed defects found on the R3 release (see "What changed recently") and states its own owner approval and candidate verification are outstanding. Production still runs the `approved-production-r16.json` lock.
- **Backend**, project `bkyuxvschuwngtcdhsyg`: `enrich-company` v44, `submit-mindmake-brief` v21, `mindmake-personal-read` v25 redeployed and verified this release; `get-ai-news` v70, `send-follow-ups` v5 and `aa-price-snapshot` v3 unchanged and not redeployed. `06_CURRENT_STATE.md`, "Backend".
- **Owner's release-only exception**: physical iPhone Safari VoiceOver and Android Chrome TalkBack remain unperformed; Krish's exception covers only the 24 September release, not future work.
- **Dependency audit**: 23 flagged package entries (16 high, 5 moderate, 2 low). The bounded applicability review found no confirmed visitor-reachable blocker in this static release; that is not a clean audit, and compatibility-tested upgrades remain open.
- **Known nonblocking gap, on a branch and not live**: desktop initial navigation can outline the hero H1; mobile initial focus stays on BODY.
- **Not established**: Search Console/Bing property ownership, indexing, ranking and AI citation outcomes. A crawlable, technically eligible release is not evidence of any of those.

## What changed recently

- 2026-09-24 **R3 published live: history and leadership-dividend now scroll-pinned** (pull request #170, merge `3ee77c9`, production `dpl_EZigNAi6Uc6Apcq75XsFnHETt5W8`). The approved copy, imagery and composition were preserved; the only requested behaviour change was native scroll-pinned progression, four reversible history states and five leadership-dividend stages, both releasing naturally with reduced-motion and short-height fallbacks. 531 tests, 208 route cases and twelve motion/fallback cases passed on Linux and macOS before publication. `website-redesign/RELEASE-2026-09-24.md`.
- 2026-09-24 **Backend re-verified end to end on the new frontend** (`enrich-company` v44, `submit-mindmake-brief` v21, `mindmake-personal-read` v25). A live canary reached actual visitor and operator inbox delivery, persistence, one correctly due follow-up and a downloaded brief matching the screen; the synthetic identities used were deleted and zero verified remaining. No live follow-up cron was invoked. `website-redesign/BACKEND-RELEASE-EVIDENCE-2026-09-24.md`.
- 2026-09-24 **A self-run correction pass found six real defects in the shipped R3 release**, none of them part of the accepted design: the header wordmark sat up to 60px off a route's own content edge, the menu's start action was not centred in its box, the footer's row gap and height scaled with the viewport instead of holding drawn proportions, no heading kept a focus ring on a cold load, four routes lost their own styling with JavaScript off because their stylesheets sat in lazy chunks the prerendered head never referenced, and `/case-studies` was missing a plain-language lede. A seventh reported item, a missing sitemap, did not reproduce. Recorded in `quality/route-lock/approved-production-r17.json`; not yet approved or promoted.
- 2026-09-24 **No-JavaScript routes given a real fallback, and a QA false negative fixed** (`d787954`). `/ai-brain`, `/ai-gtm`, `/case-studies` and `/new-age-leadership` previously rendered unstyled with scripting off; a detector was also wrongly reporting the mobile menu drawer as closed. Both are corrected and covered by `scripts/qa/no-js-check.mjs`.
- 2026-09-24 **Owner explicitly excepted physical iPhone VoiceOver and Android TalkBack for this release only.** Browser emulation and keyboard testing are not substitutes and are not reported as physical-device passes. `website-redesign/RELEASE-2026-09-24.md`, "Release-only accessibility exception".
- 2026-09-17 **Film libraries organised by release month** (`6af2005`, pull request #169). The six live films moved from `src/assets/films/` into `src/assets/films/aug2026/` without changing bytes. A sealed September library of six loops landed alongside it and is not live: nothing on the site imports it yet.
- 2026-09-08 **The answer surface, built to be quoted** (#160 to #164). `/answers` and `/answers/:slug`, server rendered, one format module shared by the site, the sitemap, `llms.txt`, the social plates and the prerender. Four questions shipped the same day; a same-day follow-up repaired all four after the generator glued the closing front-matter fence to the first line of prose.
- 2026-09-08 **The cross-repo canon reaches this repository** (#158, #159, #166, #167). `AGENTS.md` now carries the krish-canon block rendered from `krishanraja/ai-harness`, marker-delimited with its own sha256. A same-day fix corrected `AGENTS.md`'s own claim that `NOW.md` is reconciled on every push to `main`: the push trigger validates only, the nightly run reconciles.
- 2026-09-07 **The thirty-three, revised** (#156, #157). Krish revised the client testimonials to what people actually wrote; ten excerpts stopped being exact substrings of the quotes they came from and were cut again from the revised text. The story deck now reads its quotes from `src/data/testimonials.ts` at import instead of holding its own copies.

## What is next and what is waiting on Krish

- Next: review and, if approved, promote the delivered-surface correction pass; `quality/route-lock/approved-production-r17.json` records its own owner approval and candidate verification as outstanding.
- Next: the two physical assistive-technology checks (iPhone VoiceOver, Android TalkBack) that the 24 September release-only exception deferred.
- Waiting on Krish (`01_CANON.md`, "Open commercial work"): compile the evidence trail for a "leaders helped" figure and approve the public phrasing before any count is published.
- Waiting on Krish: the revisit trigger (ten `Start here` briefs, or three sent proposals) and the assumptions to watch on the pricing card have not yet been hit; tracked, not yet a decision point.
- Open, not scheduled: compatibility-tested upgrades for the 23 flagged dependency entries.

## Read next

1. `project-documentation/00_NORTH_STAR.md`: why the business exists, what it believes, who it is for, the aesthetic, the voice, the naming law. It outranks everything.
2. `project-documentation/01_CANON.md`: the commercial truth: the two doors, the buyer, the offer, private pricing, the conversion path, what is not sold.
3. `project-documentation/02_PUBLICATION.md`: the publication's two channels: mandate, register, formats, gates.
4. `project-documentation/03_DESIGN_CONTRACT.md`: binding design and motion rules, and the acceptance checklist.
5. `project-documentation/04_PROOF.md`: what may be claimed: approved attendee brands, client outcomes, consent-gated quotes, named references.
6. `project-documentation/04_PROOF_RECORDS.md`: internal engagement records behind the public proof. Never public copy.
7. `project-documentation/05_LEAD_DELIVERY_SPEC.md`: exactly what a lead receives, when, and what happens when a step fails.
8. `project-documentation/06_CURRENT_STATE.md`: what is live right now, at which identifiers, with verification baselines and open items.
9. `project-documentation/07_DEPLOYMENT.md`: how the site, domains, backend and email identity are deployed and rolled back.
10. `project-documentation/07_DEPLOY_RUNBOOK.md`: the repeatable release procedure.
11. `project-documentation/website-redesign/STATE.md`: the accepted R3 change-guard, exact locked surface and pre-change checks.
12. `project-documentation/website-redesign/RELEASE-2026-09-24.md`: the R3 release authority, evidence pointers and the release-only accessibility exception.
13. `AGENTS.md` and `CLAUDE.md`: repository execution guards and required QA gates.

## Do not trust

- `project-documentation/history/LOG.md` for anything about today. It is history; `06_CURRENT_STATE.md` is the only current-state truth, and a figure in the log is a reading on its own date.
- `project-documentation/history/LOG.md` itself, between 7 and 24 September 2026: several non-steward commits wrote directly into it instead of one dated entry per run, combining a date with a free-text title on the same heading line, leaving entries out of strict newest-first order, and pasting whole superseded documents in with their own internal headings rather than moving them into separate archived files. One heading also carries a dash character the repository's own rules forbid. The docs steward does not rewrite this log; the shape of it is a decision for Krish.
- `_corpus/mindmake-collaboration-method-observations.md`: internal working notes captured 23 August 2026, before the rebuild; its own header says it is not a public offer or a finished method. Not part of the read order and not a current-state claim.
