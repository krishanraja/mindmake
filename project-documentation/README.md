# Mindmaker Project Documentation

**Last Updated:** 2026-06-28

---

## What Mindmaker is

**The anti-consultancy for leaders done being sold AI.** A **capped advisory practice**: a small number of engagements a year.

Two paid engagements, presented largest first:

| Buyer situation | Engagement | USD | Duration | Route |
|---|---|---|---|---|
| The decision is made; how the business decides and sells is what is broken | **The Handover** | $18,000 / $30,000 / $50,000 by headcount | Six weeks + a Day 90 recheck | `/handover` |
| One nameable decision, unresolved, real cost of getting it wrong | **The Teardown** | $9,500 | Ten business days, under two hours of client time | `/teardown` |
| A fund or operating partner asking for a portfolio company | The same two, per portfolio company | Same | Same | `/capital` |

Also published in GBP and AUD, as **set prices per market, not conversions**. Canonical source: `src/lib/offers.ts`.

Every Handover starts with a Teardown. The Handover is capped at six a year and always goes through a call. No retainers, no fractional roles, no implementation, no training, and **no published discounts**.

CTRL is a separate product with its own site and its own pricing, and is not sold here.

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The single document an AI sales/marketing agent should ground on. ICP signals, pain narratives, ROI math, objection bank, channel-specific message templates, qualifying questions, disqualifiers, competitive grid. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Canonical pitches by offer + master FAQ + objection handling. |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, competitive framing. |
| [ICP.md](./ICP.md) | The two primary ICPs (AI leaders, AI products) + the executive-team ICP for Immersion. Anti-ICPs. |
| [ICP_ACCOUNTABLE_DELEGATOR.md](./ICP_ACCOUNTABLE_DELEGATOR.md) | Deep psychographic and skill-gap archetype of the cohort/leader buyer ("The Accountable Delegator"), the depth behind ICP 1. Research-grounded; cross-refs ICP.md and SALES_PLAYBOOK.md. |
| [OFFERS.md](./OFFERS.md) | Full detail on both engagements, and what each one collects. |
| [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md) | The durable commercial reference (the `mindmaker` Claude skill): the full buyer-journey ladder, three ICPs, the CTRL product, the Substack, Stripe, the sales motion, and the Mindmaker vs Mindmaker OS boundary. |
| [mindy/](./mindy/) | **Mindy's Brain Pack**, the system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing-range model, proof bank, `CANON.md` (de-poison / source of truth), and voice-lint that govern the Diagnosis Room. |
| [OUTCOMES.md](./OUTCOMES.md) | Buyer outcomes by offer, with leading and lagging indicators. |
| [BRANDING.md](./BRANDING.md) | Voice, tone, terminology standards, retired products. |
| [PURPOSE.md](./PURPOSE.md) | Mission, vision, what we do and don't sell. |

### For developers and agents working on the codebase

| Document | What it gives you |
|---|---|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, routes, data flows, edge functions. |
| [FEATURES.md](./FEATURES.md) | Feature catalogue (pages, components, overlays). |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Tokens, components, WCAG rules. |
| [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) | Layout patterns, card styles, animation rules. |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Pre-deploy / post-deploy checklists. |
| [COMMON_ISSUES.md](./COMMON_ISSUES.md) | Known issues, troubleshooting. |
| [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) | Step-by-step replication guide. |

### History and decisions

| Document | What it gives you |
|---|---|
| [HISTORY.md](./HISTORY.md) | Chronological change history. |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Architecture and design decision records. |
| [mindmaker_rebuild_brief_v4.md](./mindmaker_rebuild_brief_v4.md) | Authoritative strategic brief (v4 barbell pivot + v5 Operator's Edge). |

### Research artefacts (not Mindmaker business content)

| Document | What it gives you |
|---|---|
| [research/LLM_CHAIN_OF_THOUGHT.md](./research/LLM_CHAIN_OF_THOUGHT.md) | LLM critical-thinking framework synthesis (research, not Mindmaker positioning). |
| [research/LLM_CRITICAL_THINKING_TRAINING.md](./research/LLM_CRITICAL_THINKING_TRAINING.md) | AI reasoning training manual (research). |

> Research files are kept for reference. They are not authoritative descriptions of the Mindmaker business. Use `PURPOSE.md` + `VALUE_PROP.md` + `OFFERS.md` + `SALES_PLAYBOOK.md` for that.

---

## Start Here

### For brand, copy, sales, and marketing
1. [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md), the single ground-truth doc for any sales or marketing AI agent
2. [BRANDING.md](./BRANDING.md), voice, terminology, retired products
3. [VALUE_PROP.md](./VALUE_PROP.md), positioning and objections
4. [ICP.md](./ICP.md), the audiences
5. [OFFERS.md](./OFFERS.md), pricing, scope, format, outcomes
6. [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md), canonical pitches and FAQ
7. [PURPOSE.md](./PURPOSE.md), mission and anti-goals

### For development
1. [ARCHITECTURE.md](./ARCHITECTURE.md), tech stack, routes, edge functions
2. [FEATURES.md](./FEATURES.md), what exists
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

### Framework (unchanged across every offer)
**Mind Set → Mind Map → Mind Make.**

| Phase | Meaning | Outcome |
|---|---|---|
| Mind Set | Clarity | Cut the noise. Name the real decision. |
| Mind Map | Leverage | Map options. Trade-off analysis. Rule out what doesn't matter. |
| Mind Make | Direction | Decide. Document. Ship. |

### Offers (canonical pricing and duration)

| Engagement | Price (USD) | Duration | Payment |
|---|---|---|---|
| The Handover | $18,000 / $30,000 / $50,000 by headcount | Six weeks + Day 90 recheck | Direct invoice, 50/50 at kickoff and delivery |
| The Teardown | $9,500 | Ten business days | Direct invoice, on kickoff |


### ICPs

- **AI leaders**. senior operators making AI decisions (Cohort buyer)
- **One ICP**: companies of 50 to 5,000 people, sweet spot 100 to 1,000, where the buyer is the CEO, CRO or VP Product
- **Executive teams**. CEO-sponsored leadership groups needing fast alignment (Immersion buyer)

### Brand voice

**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA

**"Book a call"**, everywhere. Opens **the Diagnosis Room (Mindy)** via the `openDiagnosisRoom` event (express mode from the nav, full mode from the hero secondary). No conditional labels. `ScopingModal` ("Scope it with me", `openScopingModal`) is a retained fallback; the legacy `InitialConsultModal` / `openConsultModal` path is alumni-only.

---

## Retired Concepts (do not reference)

- 4-Week Sprint, 90-Day Sprint, Extended Sprint
- Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO, Fractional CTO, Fractional CMO (we do not sell fractional roles)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot (retired; the `PreCallQualifier` that replaced it is itself now retired, superseded by the Diagnosis Room)
- Homepage `YFork` second fork and the `PreCallQualifier` floating pill (both retired June 2026; the homepage now funnels into the Diagnosis Room)
- "Signal Desk" naming (renamed to **Live Intel** at `/signal`)
- "The Brief" / "The Operator's Brief" as a nav label (the nav label is now **"Live Intel"**; "The Operator's Brief" can still appear as a body-copy reference for the editorial taxonomy on `/signal`)
- SIGNAL / NOISE / DECISION / TAKE taxonomy (renamed to WATCH / SKIP / CALL / TAKE)
- CTRL (portable context app) as a headline Mindmaker product
- Builder Economy as a Mindmaker product (now an external sister domain at `thebuildereconomy.com`)
- `/tool` standalone page (deleted; Nervous Decision Machine now lives inside `/signal` and embedded on the homepage)
- War Room, Strategy Day, Fractional CAIO (URLs redirect to the current engagements)
- **The entire six-rung ladder retired in July and August 2026.** The names are deliberately not repeated here, because this file is indexed for retrieval and writing them is the most likely way one reaches a client. The record is in [DECISIONS_LOG.md](./DECISIONS_LOG.md). The operative rule is simpler than a list: if an engagement is not The Teardown or The Handover, it does not exist.
- Ranges-only pricing (prices are published now, in three currencies)
- Any published discount, credit or urgency offer

See [BRANDING.md](./BRANDING.md) for complete terminology standards.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- Prices come from `src/lib/offers.ts`, never from a document
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) as source of truth

---

**End of Documentation Index**
