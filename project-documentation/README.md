# Mindmaker Project Documentation

**Last Updated:** 2026-08-09

---

## What Mindmaker Is

**The anti-consultancy for leaders done being sold AI.** As of the August 2026 overhaul, one method sold two ways: build the brain that holds your business, self-serve via **CTRL** or with Krish through **The Teardown** ($3,500) then **The Handover** ($30k–$50k). **The AI-Fluent Executive Cohort** ($2,000–$3,000/seat) runs alongside as the peer-cohort option, currently sold out. **Workshops, Enterprise (Signal Session/Revenue Architecture), Capital, the AI Immersion, and the Alumni Pass were unsold** on 2026-08-05/06: the pages still exist and work by direct URL, but carry no price and are out of nav, footer, and the sitemap. No retainers. No fractional roles.

| Audience | Offer | Public price | Duration | Route |
|---|---|---|---|---|
| A leader with one real decision to make, wants Krish's method directly | The Teardown | **$3,500 fixed** | 10 business days, <2h of client time | `/teardown` |
| Same, ready to rebuild how the business runs on the decision | The Handover (gated on a completed Teardown) | **$30,000** under 250 people / **$50,000** for 250–5,000 | 6 weeks | `/handover` |
| Senior leader wanting a peer decision room | The AI-Fluent Executive (Cohort) | $2,000–$3,000 / seat (range; Maven sets the exact price) | 4 weeks (mostly async) + 4 live 90-min sessions | `/cohort` (sold out, waitlist on Maven) |
| Anyone, self-serve | CTRL | Free; Edge Pro $49/month | Ongoing | `ctrl.themindmaker.ai` |
| *Unsold, reachable by direct URL only, no public price* | Workshops (×5), Enterprise (Signal Session + Revenue Architecture), Capital, The AI Immersion, The Alumni Pass | — | — | `/workshops`, `/enterprise`, `/capital`, `/immersion`, `/alumni` |

Every live offer has a fixed scope, a fixed outcome, and a finish line. Both Teardown and Handover carry a 20% publicity discount (client approves how the work is portrayed).

The primary on-site conversion surface is **the Diagnosis Room (Mindy)**, a full-screen experience that diagnoses one nervous AI decision and forks to three honest exits (keep chatting / book a free 15-min call / download a co-branded proposal, confirmed still live in `Fork.tsx`). **Known gap:** Mindy's deployed reasoning has not been updated for this overhaul — it still recommends and prices the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder and has no knowledge of the Teardown or the Handover. See [`mindy/CANON.md`](./mindy/CANON.md) §0. The durable commercial reference is [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md).

For the strategic intent behind earlier eras of the business, read `mindmaker_rebuild_brief_v4.md` (v4 barbell pivot + v5 Operator's Edge) and the v6 ladder restructure in `HISTORY.md` / `DECISIONS_LOG.md`. Both predate the August 2026 overhaul and no longer describe the live offer architecture; read them as historical record, not current state.

---

## Documentation Index

### For sales and marketing AI agents (start here)

| Document | What it gives you |
|---|---|
| [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md) | The single document an AI sales/marketing agent should ground on. ICP signals, pain narratives, ROI math, objection bank, channel-specific message templates, qualifying questions, disqualifiers, competitive grid. |
| [Master_Messaging_and_FAQ.md](./Master_Messaging_and_FAQ.md) | Canonical pitches by offer + master FAQ + objection handling. |
| [VALUE_PROP.md](./VALUE_PROP.md) | Positioning, differentiators, competitive framing. |
| [ICP.md](./ICP.md) | The ICPs: AI leaders (live, Teardown/Handover/Cohort), plus AI products and executive teams (their dedicated offers are unsold; routing is an open gap). Anti-ICPs. |
| [ICP_ACCOUNTABLE_DELEGATOR.md](./ICP_ACCOUNTABLE_DELEGATOR.md) | Deep psychographic and skill-gap archetype of the leader buyer ("The Accountable Delegator"), the depth behind ICP 1. Research-grounded; cross-refs ICP.md and SALES_PLAYBOOK.md. |
| [OFFERS.md](./OFFERS.md) | Full detail on The Teardown, The Handover, and the Cohort (live); Signal Session, Revenue Architecture, Immersion, Workshops, Alumni Pass (unsold, retained for reference). |
| [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md) | The durable commercial reference (the `mindmaker` Claude skill): the current offer architecture, ICPs, the CTRL product, the Substack, Stripe, the sales motion, and the Mindmaker vs Mindmaker OS boundary. |
| [PRICE_TRUTH_AUDIT.md](./PRICE_TRUTH_AUDIT.md) | Point-in-time audit (2026-08-05) of price/claim contradictions that drove the August 2026 overhaul. Historical record, resolved. |
| [PROOF_INVENTORY.md](./PROOF_INVENTORY.md) | Working inventory (2026-08-05) merging case-study and proof-bank data ahead of a proof rebuild. Not yet re-collated; no proof tagged to the Teardown/Handover yet. |
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
| [mindmaker_rebuild_brief_v4.md](./mindmaker_rebuild_brief_v4.md) | Historical strategic brief (v4 barbell pivot + v5 Operator's Edge). Pre-dates the v6 ladder restructure and the August 2026 Teardown/Handover overhaul; strategic-intent archive only, not current state. |

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

### Offers (canonical pricing and duration, live August 2026)

| Offer | Price | Duration | Hosting / payment |
|---|---|---|---|
| The Teardown | $3,500 fixed | 10 business days | Direct, gated on the Diagnosis Room; no Stripe checkout, invoiced manually |
| The Handover | $30,000 (<250 people) / $50,000 (250–5,000) | 6 weeks; gated on a completed Teardown; capped 6/year | Direct, invoiced manually |
| The AI-Fluent Executive (Cohort) | $2,000–$3,000 / seat (range) | 4 weeks (mostly async) + 4 × 90-min live sessions | Hosted on **Maven** at `maven.com/mindmaker/the-ai-fluent-executive`; currently sold out |

**Unsold as of 2026-08-05/06** (routes still exist, no public price, out of nav/footer/sitemap): The Signal Session, The Revenue Architecture, The AI Immersion, the five Workshops, The Alumni Pass. See `OFFERS.md` for the full detail these used to carry and `DECISIONS_LOG.md` for why.

### ICPs

- **AI leaders**. senior operators making AI decisions (Teardown/Handover/Cohort buyer)
- **AI products / capital allocators**. previously routed to the Signal Session and Revenue Architecture on `/enterprise` and `/capital`; both pages are now unsold, so this ICP currently has no dedicated live offer beyond the Teardown/Handover/Diagnosis Room path. Flagged in `ICP.md` as needing Krish's confirmation on how this ICP is served now.
- **Executive teams**. previously the AI Immersion buyer; `/immersion` is now unsold, same gap as above.

### Brand voice

**Confident + Cynical + Helpful.** Operator, not advisor. Stripe meets Bourdain.

### Primary CTA

**"Bring me one real decision"** in the nav (changed from "Book a call" in the August 2026 nav rebuild); other surfaces (`SimpleCTA`, `TwoDoors`) use their own copy but dispatch the same `openDiagnosisRoom` event (express mode from the nav, full mode from the hero/mobile secondary and `TwoDoors`). `ScopingModal` ("Scope it with me", `openScopingModal`) is a retained fallback on the unsold offer pages and on `Cohort.tsx`. `InitialConsultModal` / `openConsultModal` is **not** alumni-only — it's also opened directly from `/contact` and every blog post.

---

## Retired Concepts (do not reference)

- 4-Week Sprint, 90-Day Sprint, Extended Sprint
- Builder Sprint, Builder Session
- Leadership Lab, Portfolio Partner (as named public products)
- Fractional CAIO, Fractional CTO, Fractional CMO (we do not sell fractional roles)
- "Builder vs Orchestrator" ICP framing
- "Chat with Krish" / "Ask Mindmaker" chatbot (retired; the `PreCallQualifier` that replaced it is itself now retired, superseded by the Diagnosis Room)
- Homepage `YFork` second fork (three-door "Start where your question actually is.") and the `PreCallQualifier` floating pill (both retired June 2026, confirmed still unmounted). **Don't confuse `YFork` with `TwoDoors.tsx`**, a different, currently-live homepage component added August 2026 ("do it yourself with CTRL" vs. "do it with me" via Teardown/Handover).
- "Signal Desk" naming (renamed to **Live Intel** at `/signal`)
- "The Brief" / "The Operator's Brief" as a nav label (the nav label is now **"Live Intel"** / **"Mindmaker LIVE"**; "The Operator's Brief" can still appear as a body-copy reference for the editorial taxonomy on `/signal`)
- SIGNAL / NOISE / DECISION / TAKE taxonomy (renamed to WATCH / SKIP / CALL / TAKE)
- CTRL (portable context app) as a headline Mindmaker product
- Builder Economy as a Mindmaker product (now an external sister domain at `thebuildereconomy.com`)
- `/tool` standalone page (deleted; Nervous Decision Machine now lives inside `/signal` and embedded on the homepage)
- War Room, Strategy Day (old names for Revenue Architecture and Signal Session; URLs redirect; both target pages are themselves now unsold)
- 8–12 week Revenue Architecture timeline (replaced by 30-day intensive, itself now unsold)
- 5–10 page Signal Session thesis (replaced by 15–20 page Commercial Narrative within 48 hours, itself now unsold)
- **"Ranges only" as a universal pricing rule** (retired for the Teardown and the Handover, which publish exact/banded prices on-site as of August 2026; still true for the Cohort)
- **`FrameworkJourney` on the homepage** (moved off the homepage scroll in August 2026, replaced by `TwoDoors`; the component still renders on `/new-age-leadership`)
- **`MindMakerLiveSection`** (no longer imported anywhere in the codebase; confirmed dead code)
- **"Book a call" as the primary nav CTA label** (replaced by "Bring me one real decision" in the August 2026 nav rebuild)
- **Enterprise / Capital nav dropdown and the Workshops nav link** (removed from `Navigation.tsx` and `Footer.tsx` in the August 2026 unselling; the pages still exist, just unlinked)

See [BRANDING.md](./BRANDING.md) for complete terminology standards.

---

## Document Conventions

- **Last Updated** date at the top of each document
- Technical decisions live in [DECISIONS_LOG.md](./DECISIONS_LOG.md)
- Changes live chronologically in [HISTORY.md](./HISTORY.md)
- All brand decisions reference [../CLAUDE.md](../CLAUDE.md) and `mindmaker_rebuild_brief_v4.md` as source of truth

---

**End of Documentation Index**
