# CANON.md — Mindy's source-of-truth and de-poison file

**Purpose.** This is the de-poison file for Mindy's knowledge base. When Mindy retrieves something that disagrees with this document, this document wins (within the precedence order below). It exists to stop retired facts (old prices, old durations, old framework names) from leaking into a client-facing answer.

**Last reconciled:** 2026-07-19 against `C:/Users/krish/.mm-arch/CLAUDE.md` (dated 2026-06-03) and `project-documentation/` (OFFERS, OUTCOMES, VALUE_PROP, HISTORY, DECISIONS_LOG).

**Scope.** This governs what Mindy treats as true about Mindmaker's offers, pricing, ICPs, and product. It does not change the voice rules or the anonymisation rule, which sit in their own files and are non-negotiable regardless of anything here.

---

## 1. Precedence order (what wins when sources conflict)

When two sources disagree, resolve top-down. Higher beats lower.

1. **The live Maven page** (`maven.com/mindmaker/the-ai-fluent-executive` and the live Workshop listings). Maven is where the Cohort and Workshops actually transact, so its current price, duration, and curriculum are ground truth for those offers. If Maven says something different from any doc, Maven is right and the doc is stale.
2. **`.mm-arch/CLAUDE.md`** — the descriptive repo guide, kept current with what is actually shipped on the live site (routing, components, the live pricing table, navigation).
3. **`SALES_PLAYBOOK.md`** and **`VALUE_PROP.md`** — the canonical commercial framing (positioning, objection handling, proof points, what each offer is and is not).
4. **This CANON.md** — resolves residual conflicts between the above and flags the ones that need a human. Where 1–3 are silent or contradict each other on a fact, the "canonical current facts" in Section 2 are the answer Mindy gives.
5. **Everything else in `project-documentation/`** (OFFERS, OUTCOMES, ICP, OUTCOMES, HISTORY, DECISIONS_LOG, etc.) — authoritative for detail, but subordinate to 1–4 when they disagree.
6. **The blocklist in Section 4** — never used for retrieval at all.

Rule of thumb for Mindy: **prices and the exact cohort curriculum come from Maven and CLAUDE.md; positioning and objection answers come from the playbook; this file breaks ties and lists the landmines.** And per Krish's standing instruction, Mindy presents **ranges only** to clients (Section 2.4) — even when an exact number appears in a source, Mindy does not quote it.

---

## 2. Canonical current facts

### 2.1 The offer architecture (a ladder, not a single product)

Free at the top, continuity at the bottom. Every rung is fixed-scope with a finish line.

| Rung | Offer | What it is | Route | Sold via |
|---|---|---|---|---|
| Free | **Lightning Lessons** | Free entry lessons (Maven instructor page) | external Maven links | Maven |
| Entry-paid | **Workshops** (×5) | One-day, build-with-me; walk out with a real artefact deployed on your real surface | `/workshops` (+ 5 sub-pages) | Maven |
| Qualifying | **The AI-Fluent Executive (Cohort)** | Quarterly peer decision room; leave with a board-ready memo | `/cohort` | **Maven** |
| Margin (Enterprise) | **The Signal Session** | One-day commercial diagnosis + Commercial Narrative within 48h | `/enterprise#signal-session` | Site / book a call |
| Margin (Enterprise) | **The Revenue Architecture** | 30-day commercial rebuild | `/enterprise#revenue-architecture` | Site / book a call |
| Margin (Enterprise, inquiry-only) | **The AI Immersion** | 4-hour exec-team alignment + 2-page summary | `/immersion` | Inquiry only |
| Capital (third door) | **Signal Session / Revenue Architecture, repositioned for funds** | Same formats, fund-level framing | `/capital` | Book a call |
| Continuity | **The Alumni Pass** | Annual continuity, invitation-only, `noindex`, unlinked | `/alumni` | Direct Stripe link from Krish |

The five Workshops: Build Your AI Chief of Staff · Map Your Agentic Org Chart · Vibe Coding for Leaders · Build an Autonomous Business Function · Give Your AI Memory.

**The "four-offer architecture"** people refer to is the commercial spine: **Cohort + Signal Session + Revenue Architecture + (Immersion)**, with **Workshops** as the paid entry rung, **CTRL** as the product, and the **Alumni Pass** as continuity. Capital is not a fifth offer — it is the same Signal Session and Revenue Architecture formats sold to funds and family offices.

### 2.2 The three ICPs (plus a retention layer)

Three audiences, no overlap, plus alumni.

1. **AI Leaders** — senior operators (CEO/COO/CFO/CPO/CCO/CMO/GM/VP/founder-operator) either ready to build (→ Workshops) or sitting on one nervous AI decision (→ Cohort). Deep archetype: "The Accountable Delegator."
2. **AI Products** — companies that have shipped AI capability but can't translate it into revenue predictably (→ Signal Session → Revenue Architecture).
3. **Executive Teams** — a CEO sponsoring a 4–8 person leadership group stuck on shared AI tensions (→ AI Immersion, inquiry-only).
4. **Alumni** (retention layer, not an acquisition path) — anyone who completed any of the above (→ Alumni Pass, invitation-only).

The old "Builder vs Orchestrator" split is **retired** along with the public 1:1 sprint product. 1:1 work is inquiry-only via `/cohort?inquiry=1:1`.

### 2.3 CTRL (the product) — added to canon because OFFERS.md omits the pricing

OFFERS.md, VALUE_PROP.md, and SALES_PLAYBOOK.md only ever describe CTRL as a *benefit* ("lifetime access to CTRL, Mindmaker's flagship memory-web app"). The standalone product pricing is not in the offer docs, so it is canonised here:

- **CTRL is free to start.** Upgrades are paid.
- **Diagnostic: $29 one-time** (a one-off paid upgrade).
- **Edge Pro: $9 / month recurring** (the recurring tier).
- CTRL is bundled as **lifetime access** with Workshops, the Cohort, and the Alumni Pass — that bundle is a benefit, not a separate purchase.
- A CTRL waitlist exists on the marketing site (`CtrlWaitlistPopover` → `notify-ctrl-waitlist`).

(If the live CTRL product surface ever shows different numbers, the live product wins and this entry is updated.)

### 2.4 Pricing is RANGES ONLY — this is the live policy

Exact prices have been **removed from the live site and from generated proposals.** Mindy shows **ranges only** and **never quotes an exact figure to a client.** The exact number is set by Krish on the call. The internal exact prices still exist in the docs (e.g. $599, $2,500, $15,000) and are useful for Mindy's own reasoning, but they are **not for client output.**

**Public range card (the only pricing Mindy shows a client):**

| Offer | Range shown |
|---|---|
| Lightning Lessons | Free |
| Workshops | $500–$1,000 |
| AI-Fluent Executive (Cohort) | $2,000–$3,000 |
| Bespoke enablement | $8,000–$25,000 (pilots from $2,000) |
| Signal Session | $10,000–$20,000 |
| AI Immersion | $10,000–$15,000 |
| Revenue Architecture | $50,000–$100,000+ |
| Alumni Pass | ~$1,500 / year |
| CTRL | Free; upgrades from $29 |

**Two pricing modes by buyer:**
- **Productized ladder** for individuals + enterprise/capital (the range card above).
- **Bespoke enablement** for SMEs / founder-led teams (the DoThinkDo / coaching-practice / TMT-advisory class), scoped live.

**Bespoke scoping model (internal logic, never the exact output):** rate band $220/hr SME floor, $300 mid, $400 well-resourced. Hours come from what needs *building* (deliverables/streams) vs teaching; pilot ≈ 1 stream / 6h, full ≈ 30–40h. Hours × rate → band (±25%), floored: pilot $2k–$5k by size, full bespoke from $8k. Value cross-check ≈ 2–5% of the value at stake; take the higher. Frame: "I price against the value of the decision, not my hours." **Ceiling guardrail:** present bands up to ~$100k; above that, or any retainer / implementation / custom-terms / true bespoke over-ceiling request → **stop quoting and book the call.** Roll-forward: a pilot credits to the full engagement; a full engagement carries into Phase 2.

### 2.5 Maven, payment, and the Workshop credit

- The **Cohort is Maven-collected.** Enrolment, payment, the cohort Slack, and the alumni community all run on Maven. **There is no in-site split-pay** — any payment split (e.g. the historical 2× instalment) is handled by Maven at checkout, not by the Mindmaker site. The site describes the offer; Maven runs the transaction.
- **Workshops** are also paid on Maven (14-day Maven Guarantee).
- The **Alumni Pass** is the **only** product the site itself charges, via a direct Stripe link Krish sends post-engagement (no live checkout on the page).
- **Workshop credit:** Workshop alumni get **$500 off the AI-Fluent Executive Cohort** with code **`WORKSHOP`** at Maven checkout, valid **90 days** post-workshop. (Mindy may name the credit and the code; it does not quote the resulting net price as an exact figure.)

### 2.6 Things Mindmaker does NOT sell (hard guardrails)

No public 1:1 sprint product (inquiry-only). No fractional executive roles (CAIO/CTO/CMO/CRO). No ongoing retainers or month-to-month work. No production IT, deployment, integration, or managed services. No hourly billing. No tool recommendations without trade-off analysis. No ghostwritten board decks. No vendor referral fees. Every offer has a fixed scope, a fixed outcome, and a finish line.

---

## 3. Settled corrections (do not regress to these)

These were already reconciled in `DECISIONS_LOG.md` (2026-05-15 v6 restructure) and `HISTORY.md`. They are settled; the *old* value on the left is a stale-fact landmine.

| Retired fact | Current fact |
|---|---|
| Cohort name "The AI Decision Cohort" | **The AI-Fluent Executive** |
| Cohort price **$3,500** | **$2,500** (shown to clients as the **$2,000–$3,000 range**) |
| Cohort duration **3 weeks** | **4 weeks** (mostly async + 4 × 90-min live) |
| Cohort seats **15** (as a fixed number) | **10–15 seats** (min viable 8, cap 15) |
| Revenue Architecture **8–12 weeks** | **30 days (4–5 calendar weeks)** |
| Maven URL `maven.com/aimindmaker/ai-decision-intensive` | `maven.com/mindmaker/the-ai-fluent-executive` |
| "Builder vs Orchestrator" ICP split + public 1:1 sprints | Retired; 1:1 is inquiry-only at `/cohort?inquiry=1:1` |
| Diagnostic name "AI Leadership Benchmark" | **Decision Readiness Diagnostic** (`/leaders`) |

---

## 4. Do-NOT-index blocklist (exclude from retrieval entirely)

These files carry retired facts or are not Mindmaker business content. **They must not be indexed for Mindy's retrieval.** If any of them is already in the vector store, purge it.

1. **`mindmaker_rebuild_brief_v4.md`** — v4/v5 strategic brief. Pre-dates the v6 ladder restructure; carries the retired Cohort price/duration/framework and the barbell (no Workshops, no Alumni Pass, no range-only pricing). Strategic-intent archive only.
2. **`EXECUTIVE_SUMMARY.md`** — research artefact, not current business content.
3. **`LLM_CRITICAL_THINKING_TRAINING.md`** — research artefact, not Mindmaker business content.
4. **The old portfolio deck facts** ("FINAL Mindmaker Case Studies" deck and any copy derived from it) — they carry retired numbers: **$3,500 cohort, 3-week duration, 15 seats.** Use the anonymised case bank and the named-case file under the anonymisation rule instead, never the deck's stale facts.

General rule for retrieval: prefer the *living* `project-documentation/` set and CLAUDE.md; treat anything dated before the 2026-05-15 v6 restructure as suspect on price/duration/framework.

---

## 5. RESOLVED — the cross-offer framework name (Krish confirmed 2026-06-09)

**Krish confirmed 2026-06-09: KEEP "Mind Set → Mind Map → Mind Make" as the canonical cross-offer Mindmaker brand framework (option A, layered). "Diagnose → Decompose → Decide → Deploy" remains only as the cohort's internal week-by-week curriculum detail. Mindy uses Mind Set / Mind Map / Mind Make when naming the framework.**

The two are layered on purpose, each in its own lane:

- **"Mind Set → Mind Map → Mind Make"** — the cross-offer brand framework, the spine that spans every offer. Rendered on the **homepage** by `FrameworkJourney.tsx`, used as the **all-offers framework table** in `OFFERS.md`, and as the "portable framework" language in `OUTCOMES.md`. **This is the name Mindy uses when asked what the Mindmaker framework is.**
- **"Diagnose → Decompose → Decide → Deploy"** — the *cohort curriculum weeks* only (the Week 1–4 table in `OFFERS.md`, `VALUE_PROP.md`, and the Immersion protocol). It is the Maven-canonical week-by-week delivery detail of the Cohort, not the brand framework. Mindy uses it only when describing how the cohort runs week by week.

So when Mindy names the Mindmaker framework, it says **Mind Set → Mind Map → Mind Make**. When it describes how the cohort is delivered across its four weeks, it says **Diagnose → Decompose → Decide → Deploy**.

### Other stale-fact landmines hit during reconciliation

1. **`OUTCOMES.md` "3-week Cohort"** — the Anti-Outcomes list (line ~165) still says *"30-day Revenue Architecture, 1-day Signal Session, 4-hour Immersion, **3-week Cohort**."* This contradicts the canonical **4-week** cohort duration. The fix is settled in DECISIONS_LOG (3→4 weeks); this is a leftover in OUTCOMES. Mindy says **4 weeks**.
2. **`OUTCOMES.md` emotional arc / "week 3" finish** — the arc and "Immediate (end of cohort, week 3)" framing are written against the old 3-week model. The cohort finishes at **week 4 (Deploy)**. Mindy says the cohort ends at week 4.
3. **`OUTCOMES.md` "Mind Set → Mind Map → Mind Make" framework references** — these are correct brand-framework language per the Section 5 resolution (the canonical cross-offer framework), not cohort curriculum. No fix needed.
4. **CTRL pricing absent from the offer docs** — OFFERS/VALUE_PROP/SALES_PLAYBOOK describe CTRL only as a bundled benefit. The $29 one-time / $9-mo product pricing exists *only* in this CANON (Section 2.3) and the mindmaker skill; if a doc later contradicts it, the live CTRL product surface wins.
5. **Exact prices live throughout the docs** — every doc still carries exact figures ($599, $2,500, $15k, $60–100k, $12k, $1,500). These are **internal reasoning aids only.** Per the range-only policy, Mindy must never surface them as exact numbers to a client; it converts to the range card in Section 2.4.

---

**End of CANON.md**
