# Mindmaker Project Documentation

**Last Updated:** 2026-05-17

---

## What Mindmaker Is

**The anti-consultancy for leaders done being sold AI.** A ladder with a free entry, paid rungs, and a continuity layer. No retainers. No fractional roles. Every offer has a fixed scope, a fixed outcome, and a finish line.

| Audience | Offer | Price | Duration | Route |
|---|---|---|---|---|
| Cold leader not yet ready to talk | Lightning Lessons (5 free sessions) | Free | 45 min each | External Maven |
| Leader ready to build something this quarter | Mindmaker Workshops (×5) | $599 / workshop | 1 day each | `/workshops` (enrolment on Maven) |
| Senior leader with a nervous AI decision | The AI-Fluent Executive (Cohort) | $2,500 / seat | 4 weeks (mostly async) + 4 live 90-min sessions | `/cohort` (enrolment on Maven) |
| Company commercializing an AI product | The Signal Session | $15,000 | 1 day intensive + 48h written delivery | `/enterprise#signal-session` |
| Same, flagship engagement | The Revenue Architecture | $60,000–$100,000 | 30 days (4–5 calendar weeks) | `/enterprise#revenue-architecture` |
| Executive team needing fast alignment | The AI Immersion (inquiry-only) | $12,000 | 4-hour facilitated session + 5-day summary | `/immersion` |
| Mindmaker alumni (any engagement) | The Alumni Pass (invitation-only) | $1,500 / year | Annual, recurring | `/alumni` (unlinked from nav and footer) |

For the strategic intent behind the v4 barbell pivot and v5 Operator's Edge, read `mindmaker_rebuild_brief_v4.md`. The v6 ladder restructure (May 2026) added Workshops, Alumni Pass, and repriced and renamed the Cohort; see `HISTORY.md` and `DECISIONS_LOG.md`.

---

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The single document an AI sales/marketing agent should ground on. ICP signals, pain narratives, ROI math, objection bank, channel-specific message templates, qualifying questions, disqualifiers, competitive grid. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Canonical pitches by offer + master FAQ + objection handling. |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, competitive framing. |
| [ICP.md](./ICP.md) | The two primary ICPs (AI leaders, AI products) + the executive-team ICP for Immersion. Anti-ICPs. |
| [OFFERS.md](./OFFERS.md) | Full detail on Cohort, Signal Session, Revenue Architecture, Immersion. |
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
| Mindmaker Workshops (×5) | $599 / workshop | One day each | Hosted on **Maven**; 14-day Maven Guarantee |
| The AI-Fluent Executive (Cohort) | $2,500 / seat (or 2× $1,250) | 4 weeks (mostly async) + 4 × 90-min live sessions | Hosted on **Maven** at `maven.com/mindmaker/the-ai-fluent-executive` |
| The Signal Session | $15,000 | 1 day intensive + 48-hour Commercial Narrative delivery (15–20 pages) | Direct invoice; payment on kickoff |
| The Revenue Architecture | $60,000–$100,000 | 30 days (4–5 calendar weeks), multi-session | Direct invoice; 50/50 at kickoff and delivery |
| The AI Immersion | $12,000 (flat) | 4-hour facilitated session + 2-page summary within 5 business days | Inquiry-only; full at booking or 50/50 |
| The Alumni Pass | $1,500 / year | Annual, recurring | Invitation-only; Stripe-billed, cancel anytime |

### ICPs

- **AI leaders**. senior operators making AI decisions (Workshop buyer → Cohort buyer)
- **AI products**. companies commercializing AI capability (Signal Session → Revenue Architecture buyer)
- **Executive teams**. CEO-sponsored leadership groups needing fast alignment (Immersion buyer)
- **Alumni**. anyone who completed any engagement (Alumni Pass)

### Brand voice

**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA

**"Book a call"**, everywhere. Opens the global `InitialConsultModal` via the `openConsultModal` event. No conditional labels.

---

## Retired Concepts (do not reference)

- 4-Week Sprint, 90-Day Sprint, Extended Sprint
- Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO, Fractional CTO, Fractional CMO (we do not sell fractional roles)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot (replaced by `PreCallQualifier`)
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
