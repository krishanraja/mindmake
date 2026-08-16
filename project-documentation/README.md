# Mindmaker Project Documentation

**Last Updated:** 2026-08-16

---

## What Mindmaker is

Mindmaker helps leaders make hard commercial decisions as AI changes their market.

**One public paid offer: a focused 21-day Sprint** at `/sprint`. No public price; bought through a fit call. CTRL by Mindmaker is the Sprint's living deliverable, not a second offer, and is not sold separately on this site.

The Handover and The Teardown, the two-engagement ladder this practice sold from early August until 2026-08-12, are retired. See [DECISIONS_LOG.md](./DECISIONS_LOG.md) for the reasoning and [HISTORY.md](./HISTORY.md) for what changed in the code.

Every main sales action says **"Book a fit call"** and uses the shared `src/components/BookFitCall.tsx` component, which always opens the verified URL in `src/lib/publicLinks.ts`. There is no other booking flow: the Diagnosis Room (Mindy), `ScopingModal` and `InitialConsultModal` are paused and unmounted, though their code still exists in the repository. Contact is for general messages and does not replace the fit call. Mindmaker Live has one external home, `https://live.themindmaker.ai`.

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The single document an AI sales/marketing agent should ground on. ICP signals, pain narratives, objection bank, channel-specific message templates, qualifying questions, disqualifiers. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Canonical pitch for the Sprint + master FAQ + objection handling. |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, competitive framing. |
| [ICP.md](./ICP.md) | The buyer: a founder, CEO, CRO or strategy leader with a stuck product, price, go-to-market or company decision. |
| [ICP_ACCOUNTABLE_DELEGATOR.md](./ICP_ACCOUNTABLE_DELEGATOR.md) | The psychographic depth behind `ICP.md`: what the buyer is actually feeling, including why the fraud feeling is rational rather than neurotic. |
| [OFFERS.md](./OFFERS.md) | Full detail on the Sprint: what it is, what it collects, what it is not. |
| [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md) | The durable commercial reference (the `mindmaker` Claude skill): the buyer journey, ICPs, the CTRL product, the Substack, the sales motion, and the Mindmaker vs Mindmaker OS boundary. |
| [BRANDS_AND_TESTIMONIALS.md](./BRANDS_AND_TESTIMONIALS.md) | **The current, single source for public proof**: approved attendee brands, the eight verified client outcome stories, and career references. Other documents should point here rather than copy these lists. |
| [OUTCOMES.md](./OUTCOMES.md) | Buyer outcomes for the Sprint, with leading and lagging indicators. Aspirational figures are labelled inline. |
| [PROOF_INVENTORY.md](./PROOF_INVENTORY.md) | Historical working detail behind the proof rebuild, including verified engagements never published. Superseded as the *current* source by `BRANDS_AND_TESTIMONIALS.md`; still useful for future proof decisions. |
| [BRANDING.md](./BRANDING.md) | Voice, tone, terminology standards, retired products. |
| [PURPOSE.md](./PURPOSE.md) | Mission, vision, what we do and don't sell. |
| [mindy/](./mindy/) | **Mindy's Brain Pack**, dormant. Designed for the Diagnosis Room, which is paused and unmounted. Kept for if and when that feature resumes; do not ground a current commercial answer on it. |

### For developers and agents working on the codebase

| Document | What it gives you |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, routes, data flows, edge functions, and what's live versus dormant. |
| [FEATURES.md](./FEATURES.md) | Feature catalogue (pages, components, overlays), with dormant/paused code called out separately. |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens, components, WCAG rules. |
| [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) | Layout patterns, card styles, animation rules. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Pre-deploy / post-deploy checklists. |
| [COMMON_ISSUES.md](./COMMON_ISSUES.md) | Known issues, troubleshooting. |
| [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) | Step-by-step replication guide, with dormant-feature-set steps marked optional. |

### Rebuild working documents (2026-08-12 pivot)

Working audits and design gates from the move to one Sprint. Several describe proposals or comparisons rather than shipped state; read the status line at the top of each before treating anything in it as current.

| Document | What it gives you |
|---|---|
| [REBUILD_STATE.md](./REBUILD_STATE.md) | The rebuild's working state, authority log, and phase status. The most granular still-live process record. |
| [CTA_PATH_AUDIT.md](./CTA_PATH_AUDIT.md) | The read-only audit that found the site's competing booking paths and drove the move to one `Book a fit call` action. Verification results for the shipped fix are recorded at the bottom. |
| [INTELLIGENCE_AUDIT.md](./INTELLIGENCE_AUDIT.md) | Separates the useful intelligence layers already built (enrichment, proof selection, model pricing) from the retired offer logic wrapped around them. |
| [INTAKE_REPLACEMENT_SCOPE.md](./INTAKE_REPLACEMENT_SCOPE.md) | Proposed scope for a future `/intake` replacement. **Not approved for implementation.** |
| [HOMEPAGE_COMPARISON_MATRIX.md](./HOMEPAGE_COMPARISON_MATRIX.md) | The design gate used to compare homepage mock revisions against the shipped baseline. |
| [HOMEPAGE_MOTION_STORYBOARD.md](./HOMEPAGE_MOTION_STORYBOARD.md) | Motion contract proposed for a homepage mock revision. |
| [HOMEPAGE_MAGIC_MOMENT.md](./HOMEPAGE_MAGIC_MOMENT.md) | The approved product premise for a "Decision Underneath" homepage demonstration. **Implementation remains gated**; this is not describing shipped behaviour (the homepage AI demonstration is currently paused). |
| [SIGNATURE_INTERACTION_DIVERGENCE.md](./SIGNATURE_INTERACTION_DIVERGENCE.md) | Design-language decision record: a visual direction accepted, its first interaction rejected. |
| [PROPOSED_MINDMAKER_SKILL_UPDATE.md](./PROPOSED_MINDMAKER_SKILL_UPDATE.md) | A proposed rewrite of the external `mindmaker` Claude skill's commercial core. **Proposal only; do not apply from this repository.** |
| [MINDMAKER_LIVE.md](./MINDMAKER_LIVE.md) | What Mindmaker Live is: the publication and distribution arm, not a service offer or a second buying path. |

### History and decisions

| Document | What it gives you |
|---|---|
| [HISTORY.md](./HISTORY.md) | Chronological change history. Entries are written at the time and left alone afterwards; only the top entry describes the current state. |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Every material decision with its reasoning and review trigger. Start here when something looks odd. |
| [mindmaker_rebuild_brief_v4.md](./mindmaker_rebuild_brief_v4.md) | **Historical archive, superseded 2026-08-11.** The v4/v5 strategic brief. The positioning in it largely survives; every offer, price and duration in it does not. |
| [PRICE_TRUTH_AUDIT.md](./PRICE_TRUTH_AUDIT.md) | **Historical record.** The state of the estate before the August 2026 reprice. Superseded twice over: the two-rung ladder it documents fixing is itself now retired. |

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
3. [VALUE_PROP.md](./VALUE_PROP.md), positioning and objections
4. [ICP.md](./ICP.md), the audience
5. [OFFERS.md](./OFFERS.md), the Sprint's scope, format and outcomes. There is no public price to cite
6. [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md), canonical pitch and FAQ
7. [PURPOSE.md](./PURPOSE.md), mission and anti-goals

### For development
1. [ARCHITECTURE.md](./ARCHITECTURE.md), tech stack, routes, edge functions
2. [FEATURES.md](./FEATURES.md), what exists, and what's dormant
3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), tokens, components, contrast rules
4. [DEPLOYMENT.md](./DEPLOYMENT.md), deploy checklists

### For troubleshooting
1. [COMMON_ISSUES.md](./COMMON_ISSUES.md)
2. [DECISIONS_LOG.md](./DECISIONS_LOG.md)
3. [HISTORY.md](./HISTORY.md)

### For agents working on the codebase
- [`../CLAUDE.md`](../CLAUDE.md), authoritative state-of-the-codebase reference

---

## Key Concepts

### Framework
**Mind Set → Mind Map → Mind Make.**

| Phase | Meaning | Outcome |
|---|---|---|
| Mind Set | Clarity | Cut the noise. Name the real decision. |
| Mind Map | Leverage | Map options. Trade-off analysis. Rule out what doesn't matter. |
| Mind Make | Direction | Decide. Document. Ship. |

### The offer

One 21-day Sprint. No public price. Bought through a fit call. Full detail: [OFFERS.md](./OFFERS.md).

### ICP

A founder, CEO, CRO or strategy leader making a consequential product, price, go-to-market or company decision as AI changes their market. Full detail: [ICP.md](./ICP.md).

### Brand voice

**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA

**"Book a fit call"**, everywhere, via the shared `src/components/BookFitCall.tsx` component, which links to the verified URL in `src/lib/publicLinks.ts`. There is no conditional label, no modal, and no AI gate before it. The Diagnosis Room (Mindy), `ScopingModal` and `InitialConsultModal` are paused and unmounted; their code remains in the repository as dormant, not current, product truth.

---

## Retired Concepts (do not reference)

- **The Handover and The Teardown**, and the entire six-rung ladder they were the last two rungs of. Retired 2026-08-12. The record is in [DECISIONS_LOG.md](./DECISIONS_LOG.md). The operative rule is simpler than a list: if it is not the Sprint, it does not exist.
- Published prices in any currency, currency switching, and any discount, credit or urgency offer. There is no public price for the Sprint.
- The Diagnosis Room (Mindy) as the primary, or any, live conversion surface, and its CTA copy ("Bring me one real decision", "Book a call" opening a chat overlay). It is paused and unmounted. The only live sales action is `BookFitCall`.
- `ScopingModal` ("Scope it with me") and `InitialConsultModal` as live booking surfaces. Neither is mounted in `src/App.tsx`.
- 4-Week Sprint, 90-Day Sprint, Extended Sprint (unrelated to the current 21-day Sprint), Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO, Fractional CTO, Fractional CMO (we do not sell fractional roles)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot, and the `PreCallQualifier` that replaced it (both retired; archived to `src/_archive/components/`)
- Homepage `YFork` second fork (archived to `src/_archive/components/`)
- CTRL as a headline Mindmaker product, or as anything with a price quoted on this site. It is the Sprint's deliverable.
- Builder Economy as a Mindmaker product. It's Krish's separate podcast/creator project; `/builder-economy` now redirects to Mindmaker Live, not `thebuildereconomy.com`
- Attendee brands described as clients. See [BRANDS_AND_TESTIMONIALS.md](./BRANDS_AND_TESTIMONIALS.md).
- Offer labels on case studies
- The removed private amount or the removed 22 percent result
- An uncapped Steph quote. Missing or failed consent data must hide it
- War Room, Strategy Day, Fractional CAIO (URLs redirect to `/sprint`)

See [BRANDING.md](./BRANDING.md) for complete terminology standards and [CLAUDE.md](../CLAUDE.md) for the authoritative "do not reintroduce" list.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- There is no public price; do not cite one in any document
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) as source of truth

---

**End of Documentation Index**
