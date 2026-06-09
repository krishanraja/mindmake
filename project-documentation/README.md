# Mindmaker Project Documentation

**Last Updated:** 2026-06-09

---

## What Mindmaker Is

**The anti-consultancy for leaders done being sold AI.** A **ladder**, not a single product: free Lightning Lessons → paid Workshops ($599) → the AI-Fluent Executive Cohort ($2,500) → Enterprise sprints ($15k–$100k+) → the Alumni Pass ($1,500/yr) as continuity. Capital is a third door for funds, sharing the Signal Session and Revenue Architecture formats. No retainers. No fractional roles. Public pricing is ranges only; exact figures are set by Krish on the call.

| Audience | Offer | Public range | Duration | Route |
|---|---|---|---|---|
| Senior leader, getting sharper on AI | Mindmaker Workshops (×5) | $500–$1,000 / workshop | 1 day each, Maven-hosted | `/workshops` |
| Senior leader with a nervous AI decision | The AI-Fluent Executive (Cohort) | $2,000–$3,000 / seat | 4 weeks (mostly async) + 4 live 90-min sessions | `/cohort` |
| Company commercializing an AI product | The Signal Session | $10,000–$20,000 | 1 day intensive + 48h written delivery | `/enterprise#signal-session` |
| Same, flagship engagement | The Revenue Architecture | $50,000–$100,000+ | 30 days (4–5 calendar weeks) | `/enterprise#revenue-architecture` |
| Executive team needing fast alignment | The AI Immersion (inquiry) | $10,000–$15,000 | 4-hour facilitated session + 5-day summary | `/immersion` |
| Alumni of any paid offer | The Alumni Pass (invitation-only) | ~$1,500 / year | Annual continuity | `/alumni` |

Every offer has a fixed scope, a fixed outcome, and a finish line.

The primary on-site conversion surface is **the Diagnosis Room (Mindy)**, a full-screen experience that diagnoses one nervous AI decision and forks to three honest exits (keep chatting / book a free 15-min call / download a co-branded proposal). Mindy's knowledge and guardrails live in [`mindy/`](./mindy/); the durable commercial reference is [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md).

For the strategic intent behind the current shape of the business, read `mindmaker_rebuild_brief_v4.md` (v4 barbell pivot + v5 Operator's Edge), then the v6 ladder restructure and the June 2026 Diagnosis Room consolidation in `HISTORY.md` / `DECISIONS_LOG.md`.

---

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The single document an AI sales/marketing agent should ground on. ICP signals, pain narratives, ROI math, objection bank, channel-specific message templates, qualifying questions, disqualifiers, competitive grid. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Canonical pitches by offer + master FAQ + objection handling. |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, competitive framing. |
| [ICP.md](./ICP.md) | The two primary ICPs (AI leaders, AI products) + the executive-team ICP for Immersion. Anti-ICPs. |
| [ICP_ACCOUNTABLE_DELEGATOR.md](./ICP_ACCOUNTABLE_DELEGATOR.md) | Deep psychographic and skill-gap archetype of the cohort/leader buyer ("The Accountable Delegator"), the depth behind ICP 1. Research-grounded; cross-refs ICP.md and SALES_PLAYBOOK.md. |
| [OFFERS.md](./OFFERS.md) | Full detail on Cohort, Signal Session, Revenue Architecture, Immersion. |
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
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | LLM critical-thinking framework synthesis (research, not Mindmaker positioning). |
| [LLM_CRITICAL_THINKING_TRAINING.md](./LLM_CRITICAL_THINKING_TRAINING.md) | AI reasoning training manual (research). |

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

| Offer | Price | Duration | Hosting / payment |
|---|---|---|---|
| The AI-Fluent Executive (Cohort) | $2,500 / seat (or 2× $1,250) | 4 weeks (mostly async) + 4 × 90-min live sessions | Hosted on **Maven** at `maven.com/mindmaker/the-ai-fluent-executive` |
| The Signal Session | $15,000 | 1 day intensive + 48-hour Commercial Narrative delivery (15–20 pages) | Direct invoice; payment on kickoff |
| The Revenue Architecture | $60,000–$100,000 | 30 days (4–5 calendar weeks), multi-session | Direct invoice; 50/50 at kickoff and delivery |
| The AI Immersion | $12,000 (flat) | 4-hour facilitated session + 2-page summary within 5 business days | Inquiry-only; full at booking or 50/50 |

### ICPs

- **AI leaders**. senior operators making AI decisions (Cohort buyer)
- **AI products**. companies commercializing AI capability (Signal Session → Revenue Architecture buyer)
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
- War Room, Strategy Day (old names for Revenue Architecture and Signal Session; URLs redirect)
- 8–12 week Revenue Architecture timeline (replaced by 30-day intensive)
- 5–10 page Signal Session thesis (replaced by 15–20 page Commercial Narrative within 48 hours)

See [BRANDING.md](./BRANDING.md) for complete terminology standards.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) and `mindmaker_rebuild_brief_v4.md` as source of truth

---

**End of Documentation Index**
