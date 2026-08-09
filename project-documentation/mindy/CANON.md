# CANON.md — Mindy's source-of-truth and de-poison file

**Purpose.** This is the de-poison file for Mindy's knowledge base. When Mindy retrieves something that disagrees with this document, this document wins (within the precedence order below). It exists to stop retired facts (old prices, old durations, old framework names) from leaking into a client-facing answer.

**Last reconciled:** 2026-08-09 against the live `krishanraja/mindmaker` codebase (`App.tsx`, `Navigation.tsx`, `Footer.tsx`, `src/lib/offers.ts`, `Teardown.tsx`, `Handover.tsx`, `Cohort.tsx`, `public/llms.txt`) and `project-documentation/` (`OFFERS.md`, `COMMERCIAL_REFERENCE.md`, `HISTORY.md`, `DECISIONS_LOG.md`).

**Scope.** This governs what Mindy *should* treat as true about Mindmaker's offers, pricing, ICPs, and product. It does not change the voice rules or the anonymisation rule, which sit in their own files and are non-negotiable regardless of anything here.

---

## 0. URGENT — this document describes the target state, not what Mindy currently does

This reconciliation pass (2026-08-09) updated §2 below to match the live site's commercial architecture as of the August 2026 overhaul. **It did not, and could not, update the deployed reasoning Mindy actually runs on** (`supabase/functions/_shared/mindy/knowledge.ts`), because that's application source code, out of scope for a docs-only pass. That file has its own header claiming it mirrors this Brain Pack verbatim; as of this reconciliation, it does not.

**Concretely, right now, Mindy in production:**
- Still recommends and prices The Signal Session, The Revenue Architecture, The AI Immersion, and Workshops — four offers that were unsold from the live site on 2026-08-05/06 and carry no public price anymore.
- Has no knowledge that The Teardown ($3,500 fixed) or The Handover ($30k/$50k banded) exist, even though `public/llms.txt`, the nav, the footer, and the homepage `TwoDoors` section all now lead with them as the two Krish-delivered offers.
- Still treats pricing as ranges-only everywhere, when the live site now publishes exact/banded prices for the Teardown and the Handover by design.

This means the site's primary conversion surface is currently telling visitors about a product line Krish stopped selling, and staying silent about the one he's actually selling. **This is a functional gap requiring an engineering change (resyncing `knowledge.ts` to this file), not something a documentation pass can close.** Flag it to Krish before treating any Mindy transcript, proposal, or session-digest as representative of the current offer set. The facts below are what `knowledge.ts` should be updated to say.

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

### 2.1 The offer architecture (current, August 2026 — see §0 for the sync gap)

One method, sold two ways, plus a peer-cohort option. Every live rung is fixed-scope with a finish line.

| Rung | Offer | What it is | Route | Sold via |
|---|---|---|---|---|
| Free | **Lightning Lessons** | Free entry lessons (Maven instructor page) | external Maven links | Maven |
| Entry, do-it-with-Krish | **The Teardown** | 10 business days, one decision decomposed into evidence-checked claims | `/teardown` | Direct, $3,500 fixed |
| Margin, do-it-with-Krish (gated on Teardown) | **The Handover** | 6-week rebuild, capped 6/year | `/handover` | Direct, $30k (<250 people) / $50k (250-5,000) |
| Qualifying, peer format | **The AI-Fluent Executive (Cohort)** | Quarterly peer decision room; leave with a board-ready memo | `/cohort` | **Maven** ($2,000-$3,000/seat range; sold out) |
| Self-serve | **CTRL** | Free to start, portable AI context | `ctrl.themindmaker.ai` | Free / Edge Pro subscription |

**Unsold as of 2026-08-05/06** — route files exist, still work by direct URL, no longer priced, discoverable, or in nav/footer/sitemap: Workshops (×5, Build Your AI Chief of Staff · Map Your Agentic Org Chart · Vibe Coding for Leaders · Build an Autonomous Business Function · Give Your AI Memory), The Signal Session (`/enterprise#signal-session`), The Revenue Architecture (`/enterprise#revenue-architecture`), The AI Immersion (`/immersion`), Capital (`/capital`, same Signal Session/Revenue Architecture formats for funds), The Alumni Pass (`/alumni`). **If Mindy is ever asked about any of these, the honest answer is that Mindmaker isn't currently selling it — never quote their old prices as live.**

**The retired "four-offer architecture / three-ICP" framing** (Cohort + Signal Session + Revenue Architecture + Immersion, with Workshops as entry and Alumni Pass as continuity) described the pre-August ladder. It is no longer the live offer set.

### 2.2 The ICPs (current, August 2026)

1. **AI Leaders** — senior operators (CEO/COO/CFO/CPO/CCO/CMO/GM/VP/founder-operator, and for The Handover specifically CEO/CRO/VP Product) with one nervous AI decision. → The Teardown, then The Handover, or the Cohort. Deep archetype: "The Accountable Delegator."
2. **AI Products / Capital allocators** — companies that have shipped AI capability but can't translate it into revenue predictably, or funds wanting portfolio companies AI-ready. This ICP's dedicated offers (Signal Session, Revenue Architecture, Capital's fund-level framing) are **unsold**. There's no confirmed current routing for this buyer — the plausible path is The Handover if the company is under 5,000 people, but this is unverified. If a visitor's signals match this ICP, be honest that the enterprise/capital-specific offers aren't currently for sale rather than quoting a retired price; don't invent a routing.
3. **Executive Teams** — previously the AI Immersion buyer; `/immersion` is unsold, same gap as #2.

The old "Builder vs Orchestrator" split is **retired** along with the public 1:1 sprint product. 1:1 work is inquiry-only via `/cohort?inquiry=1:1`.

### 2.3 CTRL (the product) — added to canon because OFFERS.md omits the pricing

OFFERS.md, VALUE_PROP.md, and SALES_PLAYBOOK.md only ever describe CTRL as a *benefit* ("lifetime access to CTRL, Mindmaker's flagship memory-web app"). The standalone product pricing is not in the offer docs, so it is canonised here:

- **CTRL is free to start.** Upgrades are paid.
- **Diagnostic: $29 one-time** (a one-off paid upgrade).
- **Edge Pro: recurring tier, price unreconciled** — this section previously said $9/month; `public/llms.txt` (rewritten 2026-08-05) says $49/month. Confirm against the live CTRL product or the `mm-ctrl` repo before quoting either figure to a client.
- CTRL is bundled as **lifetime access** with Workshops, the Cohort, and the Alumni Pass — that bundle is a benefit, not a separate purchase.
- A CTRL waitlist exists on the marketing site (`CtrlWaitlistPopover` → `notify-ctrl-waitlist`).

(If the live CTRL product surface ever shows different numbers, the live product wins and this entry is updated.)

### 2.4 Pricing: ranges for the Cohort, exact/banded for the Teardown and the Handover — "ranges only" is retired as a universal rule

From June 2026 to August 2026 the live site showed ranges only, never an exact figure, and this section said so unconditionally. **That changed 2026-08-05/06.** The Teardown ($3,500 fixed) and The Handover ($30,000 under 250 people / $50,000 for 250-5,000) now publish an exact or banded price directly on their pages and in `public/llms.txt`, on Krish's explicit decision to "publish both prices with the Diagnosis Room as the door." The Cohort still shows a range ($2,000-$3,000/seat) because Maven, not the site, sets its exact per-seat figure. **Once `knowledge.ts` is resynced to this file, Mindy should state the Teardown and Handover prices exactly as published, and continue showing the Cohort as a range.**

**Public price card (once resynced — what Mindy should show a client):**

| Offer | Price shown |
|---|---|
| Lightning Lessons | Free |
| The Teardown | $3,500 fixed |
| The Handover | $30,000 (under 250 people) / $50,000 (250-5,000), gated on a completed Teardown |
| AI-Fluent Executive (Cohort) | $2,000-$3,000 range (sold out; Maven waitlist) |
| CTRL | Free; upgrades unreconciled, see §2.3 |
| Bespoke enablement | $8,000-$25,000 (pilots from $2,000) — this mode's fit against the current offer set is unverified, see §2.4a |

**Unsold, no live price to show:** Workshops, Signal Session, AI Immersion, Revenue Architecture, Alumni Pass. If a visitor asks about any of these, be honest that they're not currently sold rather than quoting a stale range.

### 2.4a Two pricing modes by buyer — unverified against the August 2026 architecture

The two-mode framework below (productised ladder vs. bespoke enablement) was designed around the pre-August offer set. Whether "Mode A, productised" should now mean the Teardown/Handover/Cohort specifically, and how the bespoke-enablement mode (§2 of `pricing-range-model.md`) interacts with a Teardown-gated Handover, has not been decided by Krish as part of this documentation pass — flag it rather than assume. The mechanics as designed:
- **Productized ladder** for individuals + enterprise/capital (the range card above).
- **Bespoke enablement** for SMEs / founder-led teams (the DoThinkDo / coaching-practice / TMT-advisory class), scoped live.

**Bespoke scoping model (internal logic, never the exact output):** rate band $220/hr SME floor, $300 mid, $400 well-resourced. Hours come from what needs *building* (deliverables/streams) vs teaching; pilot ≈ 1 stream / 6h, full ≈ 30–40h. Hours × rate → band (±25%), floored: pilot $2k–$5k by size, full bespoke from $8k. Value cross-check ≈ 2–5% of the value at stake; take the higher. Frame: "I price against the value of the decision, not my hours." **Ceiling guardrail:** present bands up to ~$100k; above that, or any retainer / implementation / custom-terms / true bespoke over-ceiling request → **stop quoting and book the call.** Roll-forward: a pilot credits to the full engagement; a full engagement carries into Phase 2.

### 2.5 Maven, payment, and the Workshop credit

- The **Cohort is Maven-collected**, and currently **sold out** (next cohort Nov 19-Dec 13, 2026; CTAs route to Maven's waitlist). Enrolment, payment, the cohort Slack, and the alumni community all run on Maven. **There is no in-site split-pay** — any payment split (e.g. the historical 2× instalment) is handled by Maven at checkout, not by the Mindmaker site. The site describes the offer; Maven runs the transaction.
- **The Teardown and The Handover are invoiced directly.** Neither has a Stripe product (`src/lib/stripe-prices.ts` covers only Cohort, Workshops, and Alumni Pass).
- **Workshops** (unsold as of 2026-08-05, see §2.1) were paid on Maven (14-day Maven Guarantee) when live.
- The **Alumni Pass** (unsold as of 2026-08-05) was the only product the site itself charged, via a direct Stripe link Krish sent post-engagement.
- **Workshop credit** ($500 off the Cohort with code `WORKSHOP`, valid 90 days post-workshop) is inert while Workshops are unsold — don't offer it.

### 2.6 Things Mindmaker does NOT sell (hard guardrails)

No public 1:1 sprint product (inquiry-only). No fractional executive roles (CAIO/CTO/CMO/CRO). No ongoing retainers or month-to-month work. No production IT, deployment, integration, or managed services. No hourly billing. No tool recommendations without trade-off analysis. No ghostwritten board decks. No vendor referral fees. Every offer has a fixed scope, a fixed outcome, and a finish line.

---

## 3. Settled corrections (do not regress to these)

These were already reconciled in `DECISIONS_LOG.md` (2026-05-15 v6 restructure, 2026-08-05/06 commercial overhaul) and `HISTORY.md`. They are settled; the *old* value on the left is a stale-fact landmine.

| Retired fact | Current fact |
|---|---|
| Cohort name "The AI Decision Cohort" | **The AI-Fluent Executive** |
| Cohort price flat **$2,500** | **$2,000–$3,000 range** (corrected 2026-08-05 to match Maven; a flat $2,500 was itself a correction of the earlier $3,500) |
| Cohort duration **3 weeks** | **4 weeks** (mostly async + 4 × 90-min live) |
| Cohort seats **15** (as a fixed number) | **10–15 seats** (min viable 8, cap 15); currently sold out |
| Revenue Architecture **8–12 weeks** | **30 days (4–5 calendar weeks)** — historical; The Revenue Architecture is itself unsold as of 2026-08-05 |
| Maven URL `maven.com/aimindmaker/ai-decision-intensive` | `maven.com/mindmaker/the-ai-fluent-executive` |
| "Builder vs Orchestrator" ICP split + public 1:1 sprints | Retired; 1:1 is inquiry-only at `/cohort?inquiry=1:1` |
| Diagnostic name "AI Leadership Benchmark" | **Decision Readiness Diagnostic** (`/leaders`) |
| **"Ranges only" as a universal client-facing pricing rule** | **Retired for the Teardown and the Handover** (exact/banded prices published on-site since 2026-08-05/06); still true for the Cohort |
| **Workshops, Signal Session, Revenue Architecture, Immersion, Alumni Pass as sold/live offers** | **Unsold as of 2026-08-05/06.** Routes exist, reachable by direct URL, no longer priced, discoverable, or in nav/footer/sitemap. Replaced in the live ladder by **The Teardown** ($3,500) and **The Handover** ($30k/$50k, gated on Teardown) |
| Nav CTA **"Book a call"** | **"Bring me one real decision"** (nav label, changed August 2026; "Book a call" still appears in body copy elsewhere) |

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

- **"Mind Set → Mind Map → Mind Make"** — the cross-offer brand framework, the spine that spans every offer. Previously rendered on the **homepage** by `FrameworkJourney.tsx`; that component moved off the homepage in the August 2026 overhaul (replaced there by `TwoDoors.tsx`) and now renders only on `/new-age-leadership`. Also used as the **all-offers framework table** in `OFFERS.md`, and as the "portable framework" language in `OUTCOMES.md`. **This is still the name Mindy uses when asked what the Mindmaker framework is.**
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
