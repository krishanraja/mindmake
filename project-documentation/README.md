# Mindmaker Project Documentation

**Last Updated:** 2026-08-23

---

## What Mindmaker is

Krish Raja's commercial decision practice. It helps founders and business leaders make hard product, price, sales and company decisions as AI changes their market. The work protects the expertise, judgement and taste already inside the business, then uses AI to make those strengths more useful. It is not an automation shop, a training course or an open-ended consultancy.

There is one public paid engagement:

| | |
|---|---|
| Engagement | A flexible, scoped 21-day Sprint |
| Buyer | Founder, CEO, CRO or strategy leader |
| Format | A private CTRL workspace, not a deck |
| Bought | Through a fit call |
| Public price | None. Scope and fee are agreed after the fit call |

CTRL by Mindmaker is the living deliverable the client keeps at the end of the Sprint. It is not a second offer on themindmaker.ai. Canonical source for the offer: `project-documentation/OFFERS.md` and `src/pages/Sprint.tsx`.

**The Teardown and The Handover are retired.** Both existed as a two-offer ladder with published per-currency prices until 12 August 2026, when the site was rebuilt around the single Sprint above. `/teardown`, `/handover` and `/capital` now redirect straight to `/sprint`; `src/lib/offers.ts` (their old pricing data) is dormant, not canonical for anything live.

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The one route to a sale, fit-call qualifying questions, best-fit signals, how to explain the Sprint, what not to sell, proof discipline, follow-up rules. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | The one-line pitch, a short explanation of the Sprint, and the master FAQ (including "why isn't the price published"). |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning and differentiators for the single-Sprint offer. |
| [ICP.md](./ICP.md) | The four buyer groups (Founder, CEO, CRO, strategy leader), best-fit moments, and poor-fit signals. |
| [ICP_ACCOUNTABLE_DELEGATOR.md](./ICP_ACCOUNTABLE_DELEGATOR.md) | The psychographic depth behind `ICP.md`: what the buyer is actually feeling, including why the fraud feeling is rational rather than neurotic. |
| [OFFERS.md](./OFFERS.md) | The Sprint in full: buyer, trigger, Krish's work, client time, finish state, format, and confirmation that Teardown/Handover are retired. |
| [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md) | The durable commercial reference (the `mindmaker` Claude skill): what Mindmaker is, the offer, best-fit moments, and the buyer journey ending at `Book a fit call`. |
| [mindy/](./mindy/) | **Mindy's Brain Pack**: the system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing model, proof bank, `CANON.md`, and voice-lint that governed the Diagnosis Room. **The Diagnosis Room is paused and unmounted** — every file in this folder now carries a status banner saying so; treat the whole folder as historical until it is reconciled and remounted. |
| [OUTCOMES.md](./OUTCOMES.md) | Buyer outcomes, with leading and lagging indicators. Aspirational figures are labelled inline. |
| [PROOF_INVENTORY.md](./PROOF_INVENTORY.md) | A working proof-rebuild document, now marked historical/non-actionable — its case-study source file was deleted and two of its recommended figures are permanently blocked from publication. The current proof source is `BRANDS_AND_TESTIMONIALS.md` / `src/data/rebuildProof.ts`. |
| [BRANDING.md](./BRANDING.md) | Voice, tone, terminology standards, retired products. |
| [PURPOSE.md](./PURPOSE.md) | Mission, vision, what we do and don't sell. |

### For developers and agents working on the codebase

| Document | What it gives you |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, current routes, data flows, edge functions. Historical (pre-12-Aug) architecture is kept in clearly labelled sections. |
| [FEATURES.md](./FEATURES.md) | Feature catalogue (pages, components, overlays), current state first, retired/paused features labelled. |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens, components, WCAG rules, current CTA pattern. |
| [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) | Layout patterns, card styles, animation rules. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Pre-deploy / post-deploy checklists against the current route table. |
| [COMMON_ISSUES.md](./COMMON_ISSUES.md) | Known issues, troubleshooting. |
| [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) | Step-by-step replication guide. |

### History and decisions

| Document | What it gives you |
|---|---|
| [HISTORY.md](./HISTORY.md) | Chronological change history. |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Every material decision with its reasoning and review trigger. **The only file that names the retired offers.** Start here when something looks odd. |
| [mindmaker_rebuild_brief_v4.md](./mindmaker_rebuild_brief_v4.md) | **Historical archive.** The v4/v5 strategic brief. The positioning in it largely survives; every offer, price and duration named in it was retired in July and August 2026, including in the 12 August pivot to the single Sprint. |
| [PRICE_TRUTH_AUDIT.md](./PRICE_TRUTH_AUDIT.md) | **Historical record**, gutted to a short marker. The state of the estate before the August 2026 reprice. Explicitly points forward to the current one-Sprint, no-public-price model as its superseding source — do not use it as current commercial evidence. |
| [REBUILD_STATE.md](./REBUILD_STATE.md) | State tracker for the 12 August rebuild: what's merged, what's still open (unwired CTRL demo clips, the orphaned `/intake` page). |

### Design and homepage audits (12 August rebuild)

| Document | What it gives you |
|---|---|
| [CTA_PATH_AUDIT.md](./CTA_PATH_AUDIT.md) | Trace of every call-to-action on the live site back to `BookFitCall`/Calendly. |
| [HOMEPAGE_COMPARISON_MATRIX.md](./HOMEPAGE_COMPARISON_MATRIX.md) | Paused design gate. The AI-demo workstream it governs was paused, not passed. |
| [HOMEPAGE_MAGIC_MOMENT.md](./HOMEPAGE_MAGIC_MOMENT.md) | An approved-but-unimplemented homepage interaction proposal. |
| [HOMEPAGE_MOTION_STORYBOARD.md](./HOMEPAGE_MOTION_STORYBOARD.md) | Motion language proposed for a rejected mock (V3); the ideas remain candidates for any future mock. |
| [INTAKE_REPLACEMENT_SCOPE.md](./INTAKE_REPLACEMENT_SCOPE.md) | Proposed scope only, not approved for implementation. Notes that the current `/intake` page is still live via a Vercel rewrite. |
| [INTELLIGENCE_AUDIT.md](./INTELLIGENCE_AUDIT.md) | Working product audit of the current `/intake` intelligence flow. |
| [SIGNATURE_INTERACTION_DIVERGENCE.md](./SIGNATURE_INTERACTION_DIVERGENCE.md) | Local design-mock record only; no live-site authority. |
| [BRANDS_AND_TESTIMONIALS.md](./BRANDS_AND_TESTIMONIALS.md) | Proof permissions and the approved homepage selection. Read before changing a public page — named directly in `CLAUDE.md`. |
| [MINDMAKER_LIVE.md](./MINDMAKER_LIVE.md) | The one external Mindmaker Live destination and a note on the dormant raw-Substack-embed component. |
| [PROPOSED_MINDMAKER_SKILL_UPDATE.md](./PROPOSED_MINDMAKER_SKILL_UPDATE.md) | Proposal only, still pending a decision on whether it's been applied to the live `mindmaker` skill outside this repo. |

### Research artefacts (not Mindmaker business content)

| Document | What it gives you |
|---|---|
| [research/](./research/) | Two long documents on training language models to reason well. **Not Mindmaker business content, and on `CANON.md`'s do-not-index blocklist.** See [research/README.md](./research/README.md). |

> Research files are kept for reference. They are not authoritative descriptions of the Mindmaker business, and grounding a commercial answer on them is the single easiest way to produce confident nonsense. Use `PURPOSE.md` + `VALUE_PROP.md` + `OFFERS.md` + `SALES_PLAYBOOK.md` for that.

---

## Start Here

### For brand, copy, sales, and marketing
1. [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md), the single ground-truth doc for any sales or marketing AI agent
2. [BRANDING.md](./BRANDING.md), voice, terminology, retired products
3. [VALUE_PROP.md](./VALUE_PROP.md), positioning
4. [ICP.md](./ICP.md), the four buyer groups
5. [OFFERS.md](./OFFERS.md), the Sprint's scope, format and outcomes. The price is never published; it is agreed on the fit call
6. [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md), the pitch and FAQ
7. [PURPOSE.md](./PURPOSE.md), mission and anti-goals

### For development
1. [ARCHITECTURE.md](./ARCHITECTURE.md), tech stack, current routes, edge functions
2. [FEATURES.md](./FEATURES.md), what exists today
3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), tokens, components, contrast rules
4. [DEPLOYMENT.md](./DEPLOYMENT.md), deploy checklists

### For troubleshooting
1. [COMMON_ISSUES.md](./COMMON_ISSUES.md)
2. [DECISIONS_LOG.md](./DECISIONS_LOG.md)
3. [HISTORY.md](./HISTORY.md)

### For agents working on the codebase
- [`../CLAUDE.md`](../CLAUDE.md), authoritative state-of-the-codebase reference. Read it first; it is short and it wins any disagreement with a file in this folder.

---

## Key Concepts

### Framework (unchanged across every offer)
**Mind Set → Mind Map → Mind Make.**

| Phase | Meaning | Outcome |
|---|---|---|
| Mind Set | Clarity | Cut the noise. Name the real decision. |
| Mind Map | Leverage | Map options. Trade-off analysis. Rule out what doesn't matter. |
| Mind Make | Direction | Decide. Document. Ship. |

### The offer (canonical)

| | |
|---|---|
| Engagement | The Sprint |
| Duration | 21 days, scope bends around the decision |
| Public price | None — agreed on the fit call |
| Deliverable | A private CTRL workspace the client keeps |

### Buyers

The four buyer groups, per `ICP.md`: **Founder, CEO, CRO** (the leader responsible for revenue), and **strategy leader**. The person must own, or be able to move, the decision and the business result behind it. The first sales wedge is media, data, creative, publishing and content businesses; this is a sales focus, not the public brand position.

### Brand voice

**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA

**"Book a fit call"**, everywhere, rendered by the shared `BookFitCall` component (`src/components/BookFitCall.tsx`), which links directly to Calendly (`BOOKING_URL` in `src/lib/publicLinks.ts`) in a new tab. There is no modal, no gate, and no AI conversation before that link. The Diagnosis Room (Mindy) and the homepage AI demonstration are paused and unmounted — see `CLAUDE.md` and `mindy/README.md`.

---

## Retired Concepts (do not reference)

- **The Teardown and The Handover**, and any earlier two-or-more-offer ladder. Retired 12 August 2026. `/teardown`, `/handover`, `/capital` and `/tool` now redirect to `/sprint`.
- Published per-currency (USD/GBP/AUD) pricing, and any currency switcher. `src/lib/offers.ts` and `src/components/CurrencySwitcher.tsx` still exist as dormant files but are not part of the live site.
- The Diagnosis Room ("Mindy") and any AI-gate CTA (`openDiagnosisRoom`, `ScopingModal`, `openScopingModal`, `InitialConsultModal`, `openConsultModal`) as a live booking path. Paused and unmounted as of the 12 August rebuild.
- 4-Week Sprint, 90-Day Sprint, Extended Sprint
- Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO, Fractional CTO, Fractional CMO (we do not sell fractional roles)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot (retired; the `PreCallQualifier` that replaced it is itself now retired, superseded by the Diagnosis Room, which is itself now paused)
- Homepage `YFork` second fork and the `PreCallQualifier` floating pill (both retired June 2026, archived to `src/_archive/components/` in August 2026)
- "Signal Desk" naming (renamed to **Live Intel** at `/signal`, which is now an external redirect to `https://live.themindmaker.ai`, not an internal page)
- "The Brief" / "The Operator's Brief" as a nav label (the nav label is now **"Live Intel"**; "The Operator's Brief" can still appear as a body-copy reference for the editorial taxonomy)
- SIGNAL / NOISE / DECISION / TAKE taxonomy (renamed to WATCH / SKIP / CALL / TAKE)
- CTRL (portable context app) as a headline Mindmaker product — it is the Sprint's deliverable
- Builder Economy as a Mindmaker product (now an external sister domain at `thebuildereconomy.com`)
- War Room, Strategy Day, Fractional CAIO, `/workshops`, `/enterprise`, `/immersion`, `/cohort`, `/leaders` and the rest of the pre-12-Aug retired-path list (URLs redirect to the current Sprint)
- Any published discount, credit or urgency offer

See [BRANDING.md](./BRANDING.md) for complete terminology standards.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- No price is ever published in a document or on the site — it is agreed on the fit call
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) as source of truth

---

**End of Documentation Index**
