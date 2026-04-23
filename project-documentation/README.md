# Mindmaker Project Documentation

**Last Updated:** 2026-04-23

---

## What Mindmaker Is

**The anti-consultancy for leaders done being sold AI.** A barbell business with two audiences and no middle:

| Audience | Offer | Price | Route |
|----------|-------|-------|-------|
| AI leaders with a nervous decision | The AI Decision Cohort | $3,500 / seat | `/cohort` |
| Companies commercializing AI products | The Signal Session | $15,000 | `/enterprise#signal-session` |
| Same, flagship engagement | The Revenue Architecture | $60,000–$100,000 | `/enterprise#revenue-architecture` |

No 1:1 sprint products on the public site. No fractional roles. No retainers. No production IT. Every offer has a fixed scope, a fixed outcome, and a finish line.

For the strategic intent behind the current shape of the business, read `mindmaker_rebuild_brief_v4.md` (v4/v5 combined).

---

## Documentation Index

### Business and positioning
| Document | Description |
|----------|-------------|
| [PURPOSE.md](./PURPOSE.md) | Mission, vision, what we do and don't sell |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, objection handling, competitive framing |
| [ICP.md](./ICP.md) | The two ICPs (AI leaders, AI products) and anti-ICPs |
| [OFFERS.md](./OFFERS.md) | Full detail on Cohort, Signal Session, Revenue Architecture |
| [OUTCOMES.md](./OUTCOMES.md) | Buyer outcomes by offer |
| [BRANDING.md](./BRANDING.md) | Voice, tone, terminology standards, retired products |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Sales pitches, FAQ, objection handling |
| [mindmaker_rebuild_brief_v4.md](./mindmaker_rebuild_brief_v4.md) | Authoritative strategic brief (v4 barbell pivot + v5 Operator's Edge) |

### Technical
| Document | Description |
|----------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Tech stack, routes, data flows, edge functions |
| [FEATURES.md](./FEATURES.md) | Feature catalogue (pages, components, overlays) |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Colors, typography, components, WCAG rules |
| [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md) | Layout patterns, card styles, animation rules |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Pre-deploy / post-deploy checklists |
| [COMMON_ISSUES.md](./COMMON_ISSUES.md) | Known issues, troubleshooting |
| [REPLICATION_GUIDE.md](./REPLICATION_GUIDE.md) | Step-by-step replication guide |

### History and decisions
| Document | Description |
|----------|-------------|
| [HISTORY.md](./HISTORY.md) | Chronological change history |
| [DECISIONS_LOG.md](./DECISIONS_LOG.md) | Architecture and design decision records |

### Research (not business content)
| Document | Description |
|----------|-------------|
| [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md) | Research: LLM critical-thinking framework synthesis (not a Mindmaker business summary) |
| [LLM_CRITICAL_THINKING_TRAINING.md](./LLM_CRITICAL_THINKING_TRAINING.md) | Research: AI reasoning training manual |

> These two files are research artefacts kept for reference. They are not authoritative descriptions of the Mindmaker business. Use `PURPOSE.md` + `VALUE_PROP.md` + `OFFERS.md` for that.

---

## Start Here

### For brand, copy, and sales
1. [BRANDING.md](./BRANDING.md) — voice, terminology, retired products
2. [VALUE_PROP.md](./VALUE_PROP.md) — positioning and objections
3. [ICP.md](./ICP.md) — the two audiences
4. [OFFERS.md](./OFFERS.md) — pricing, scope, format, outcomes
5. [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) — sales pitches and FAQ
6. [PURPOSE.md](./PURPOSE.md) — mission and anti-goals

### For development
1. [ARCHITECTURE.md](./ARCHITECTURE.md) — tech stack, routes, edge functions
2. [FEATURES.md](./FEATURES.md) — what exists
3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) — tokens, components, contrast rules
4. [DEPLOYMENT.md](./DEPLOYMENT.md) — deploy checklists

### For troubleshooting
1. [COMMON_ISSUES.md](./COMMON_ISSUES.md)
2. [DECISIONS_LOG.md](./DECISIONS_LOG.md)
3. [HISTORY.md](./HISTORY.md)

### For brand implementation (root-level)
- [`../CLAUDE.md`](../CLAUDE.md) — authoritative state-of-the-codebase reference for agents

---

## Key Concepts

### Framework (unchanged)
**Mind Set → Mind Map → Mind Make.** Used across all offers.

| Phase | Meaning | Outcome |
|-------|---------|---------|
| Mind Set | Clarity | Cut the noise. Know what matters. |
| Mind Map | Leverage | Build your edge. Multiply strengths. |
| Mind Make | Direction | Decide. Ship. Measure. |

### Offers (replaces the old 4-Week / 90-Day Sprint framing)

| Offer | Price | Duration |
|-------|-------|----------|
| The AI Decision Cohort | $3,500 / seat (or 2× $1,800) | ~5 weeks elapsed |
| The Signal Session | $15,000 | 1 day + pre-work + written thesis |
| The Revenue Architecture | $60,000–$100,000 | 8–12 weeks |

### ICPs (replaces the old Builder / Orchestrator split)
- **AI leaders** — senior operators making AI decisions (Cohort buyer)
- **AI products** — companies commercializing AI capability (Enterprise buyer)

### Brand voice
**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA
**"Book a call"** — everywhere. Opens the global `InitialConsultModal` via the `openConsultModal` event. No conditional labels. No more "What's your nervous decision?" as a CTA button.

---

## Retired Concepts (do not reference)

- 4-Week Sprint, 90-Day Sprint, Extended Sprint
- Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO (redirects `/fractional-caio` → `/enterprise`)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot (replaced by `PreCallQualifier`)
- "Signal Desk" (renamed to The Operator's Brief at `/signal`)
- SIGNAL / NOISE / DECISION / TAKE taxonomy (renamed to WATCH / SKIP / CALL / TAKE)
- CTRL (portable context app) as a headline Mindmaker product
- Builder Economy as a Mindmaker product (now an external sister domain at `thebuildereconomy.com`)
- `/tool` standalone page (deleted; Nervous Decision Machine now lives at `/signal#decision` and embedded on homepage `OperatorsBrief`)

See [BRANDING.md](./BRANDING.md) for complete terminology standards.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) and `mindmaker_rebuild_brief_v4.md` as source of truth

---

**End of Documentation Index**
