# CANON.md: Mindy's source-of-truth and de-poison file

**Purpose.** This is the de-poison file for Mindy's knowledge base. When Mindy retrieves something that disagrees with this document, this document wins (within the precedence order below). It exists to stop retired facts (old prices, old durations, old framework names) from leaking into a client-facing answer.

**Last reconciled:** 2026-08-11, against `src/lib/offers.ts` and the live site, after the reprice to two rungs in three currencies.

**Scope.** This governs what Mindy treats as true about Mindmaker's offers, pricing, ICPs, and product. It does not change the voice rules or the anonymisation rule, which sit in their own files and are non-negotiable regardless of anything here.

---

## 1. Precedence order (what wins when sources conflict)

When two sources disagree, resolve top-down. Higher beats lower.

1. **`src/lib/offers.ts`.** The single source of truth for every price, in every currency, and for what each engagement collects. Everything on the site, in the prerendered crawler bodies and in `llms.txt` is interpolated from it. If any document disagrees with this file about a number, the document is stale.
2. **`supabase/functions/_shared/mindy/knowledge.ts`.** What Mindy actually deploys with. A test fails the build if it states a price that is not in `offers.ts`, so these two cannot drift apart silently.
3. **`CLAUDE.md`**, the descriptive repo guide, kept current with what is actually shipped (routing, components, navigation).
4. **`SALES_PLAYBOOK.md`** and **`VALUE_PROP.md`**, the canonical commercial framing (positioning, objection handling, proof points, what each engagement is and is not).
5. **This CANON.md**, which resolves residual conflicts and flags the ones that need a human.
6. **Everything else in `project-documentation/`**, authoritative for detail but subordinate to 1 to 5.
7. **The blocklist in Section 4**, never used for retrieval at all.

Maven was removed from this list in August 2026. It was the top authority because the Cohort and Workshops transacted there, and neither offer exists now. Nothing on the current ladder transacts through a third party.

Rule of thumb for Mindy: **prices come from `offers.ts`; positioning and objection answers come from the playbook; this file breaks ties and lists the landmines.** Prices are published, so Mindy states them exactly, in the currency she is asked in, and never converts between currencies.

---

## 2. Canonical current facts

### 2.1 The offer architecture (two rungs)

Two paid engagements. Mindmaker is a capped advisory practice: a small number of engagements a year. Both are fixed-scope with a finish line.

| Rung | Engagement | What it is | Route | Sold via |
|---|---|---|---|---|
| The rebuild | **The Handover** | Six weeks rebuilding how the business decides and sells, plus a Day 90 recheck. Week five Krish does not attend. Capped at six a year. | `/handover` | Book a call. Never self-serve. |
| The gate | **The Teardown** | Ten business days on one real decision, under two hours of client time. Ends in a one-page memo and three claims under a 90-day watch. | `/teardown` | Self-serve, price published |
| The third door | **The same two, for portfolio companies** | Identical engagements, priced per portfolio company. Fund-level terms set on the call. | `/capital` | Book a call |
| The product | **CTRL** | An AI-native chief of staff. A separate product with its own pricing, on its own site. | `ctrl.themindmaker.ai` | Not sold here |

Presented largest first everywhere. Every Handover starts with a Teardown; nobody buys six weeks without both sides seeing how one decision goes first.

**Everything else was retired in July and August 2026** and must never be quoted. The retired names are deliberately not listed in this file, because this file is a retrieval source: writing them here is the most likely way one ends up in a client-facing answer. The full record is in `DECISIONS_LOG.md`. The operative rule is simpler than a list anyway: **if an engagement is not in the table above, it does not exist.**

### 2.2 The ICP

Collapsed to one in August 2026, because only one has a live surface.

**Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells.** Not the CTO, because this is commercial work and engineering and commercial are different problems.

Funds, family offices and operating partners are a **door**, not a separate ICP. They buy the same two engagements on behalf of a portfolio company that fits the description above.

The archetype behind the buyer is documented in `ICP_ACCOUNTABLE_DELEGATOR.md`, which is still accurate and is the best-written file in the estate.

### 2.3 CTRL (the product)

CTRL is a separate product with its own site and its own pricing, and **this site does not sell it.** In August 2026 its pricing and upgrade path were removed from themindmaker.ai entirely, on the reasoning that CTRL is the mechanism rather than a revenue line, and that AI-native SaaS retention under $50 a month runs around 23% gross revenue retention, which is the worst band there is.

What remains here:

- CTRL is a **Teardown deliverable**: "a CTRL workspace with your decision map in it." That is the sharpest CTRL sentence on the site and it stays.
- CTRL is a **product link**, not a purchase: `ctrl.themindmaker.ai`.
- **Mindy never quotes a CTRL price.** Not a tier, not a free-tier framing, not an upgrade path. If asked, she points at the product's own site.

Before the removal this site carried three contradictory CTRL prices at once ($49/month in `llms.txt`, a $29 one-time plus $9/month in Mindy's knowledge, and "upgrades from $29" in the repo guide). None of them are quoted here now, which resolves the contradiction rather than picking a winner.

### 2.4 Pricing is PUBLISHED, and quoted exactly

This reversed in August 2026. The ranges-only policy existed because a six-rung ladder had negotiable scope; both the ladder and the policy are gone.

**The full price surface, and the only pricing Mindy shows a client:**

| Engagement | USD | GBP | AUD |
|---|---|---|---|
| The Handover, 250 to 5,000 people | $50,000 | £39,000 | $76,000 |
| The Handover, 100 to 250 people | $30,000 | £23,500 | $45,500 |
| The Handover, under 100 people | $18,000 | £14,000 | $27,500 |
| The Teardown | $9,500 | £7,500 | $14,500 |

Canonical source: `src/lib/offers.ts`. If this table and that file ever disagree, the file is right.

**Set prices per market, never conversions.** The GBP and AUD columns are not the USD column converted; each is a deliberate figure in its own market. Mindy answers in the currency she is asked in, never computes one from another, and never invents a fourth. There is no FX logic anywhere in the estate and a test fails the build if any appears.

**No discounts.** Mindy has no credit, no percentage off and no urgency offer. Krish keeps a discretionary credit as a closing tool for a live call; it is deliberately absent from the site, this file, and Mindy's knowledge, because a published discount trains buyers to wait for it.

**Above the ladder.** Anything outside the two engagements, a retainer, implementation, ongoing capacity, or a company above 5,000 people: stop quoting and book the call.

### 2.5 Payment

- **The Teardown** is the only self-serve rung, and its price is published.
- **The Handover** always goes through a call. Six weeks of an operating model is not a self-serve purchase.
- **Maven is gone.** It was the payment rail for the Cohort and Workshops, and neither exists. Nothing on the current ladder transacts through a third party.
- **Fund-level and multi-company terms** are set on the call, never quoted by Mindy.

### 2.6 Things Mindmaker does NOT sell (hard guardrails)

No public 1:1 sprint product (inquiry-only). No fractional executive roles (CAIO/CTO/CMO/CRO). No ongoing retainers or month-to-month work. No production IT, deployment, integration, or managed services. No hourly billing. No tool recommendations without trade-off analysis. No ghostwritten board decks. No vendor referral fees. Every offer has a fixed scope, a fixed outcome, and a finish line.

---

## 3. Settled corrections (do not regress to these)

This section used to hold a table of superseded prices, durations and names. It was removed in August 2026 for the same reason as the blocklist: a de-poison file that lists poisoned facts is a retrieval risk, and every entry in it described an offer that no longer exists.

The historical record lives in `DECISIONS_LOG.md`, which is the right place for it and is not indexed for retrieval.

The only correction that still matters operationally: **if a retrieved document states a price, a duration, an offer name or a discount that is not in Section 2 of this file, the document is stale and Section 2 wins.**

---

## 4. Do-NOT-index blocklist (exclude from retrieval entirely)

These carry retired facts or are not Mindmaker business content. **They must not be indexed for Mindy's retrieval.** If any is already in the vector store, purge it.

1. **Every description of the retired ladder.** The six-rung ladder retired in July and August 2026, in full: its offer names, prices, durations and formats. The names are not written here on purpose (see Section 2.1). Mindy must not quote any of them even if a retrieved document describes them in the present tense. `DECISIONS_LOG.md` holds the record and is not indexed.
2. **Any ranges-only pricing instruction.** Prices are published now. A retrieved instruction to withhold a number is stale.
3. **Any published discount.** The 20% publicity discount and the proposed credit escalator were both removed. A retrieved mention of either is stale.
4. **Any CTRL price.** CTRL is not sold on this site.
5. **`mindmaker_rebuild_brief_v4.md`**, the v4/v5 strategic brief. Strategic-intent archive only.
6. **`EXECUTIVE_SUMMARY.md`** (now `research/LLM_CHAIN_OF_THOUGHT.md`) and **`LLM_CRITICAL_THINKING_TRAINING.md`**, research artefacts rather than business content.
7. **The old portfolio deck facts**, which carry retired numbers.

General rule for retrieval: prefer the living `project-documentation/` set, `CLAUDE.md`, and `src/lib/offers.ts`. Treat anything dated before 2026-08-11 as suspect on price, offer name, and format.

---

## 5. RESOLVED: the framework name (Krish confirmed 2026-06-09, still current)

**"Mind Set, Mind Map, Mind Make" is the canonical Mindmaker framework.** It is the spine that spans both engagements, rendered on the homepage by `FrameworkJourney.tsx` and used as the framework language across the documentation. It is the name Mindy uses when asked what the Mindmaker framework is.

How it maps onto the current ladder:

- **A Teardown is the Mind Map step done properly on one decision.** The decision comes apart into the claims it rests on, each checked, each consideration classed.
- **A Handover runs the whole arc across the business.** Mind Set in weeks one and two, Mind Map in week three, Mind Make in weeks four to six.

The four-D curriculum ("Diagnose, Decompose, Decide, Deploy") that used to sit beside it was the week-by-week delivery detail of a retired offer. It went with that offer and should not be quoted.

### Other stale-fact landmines

The list that sat here catalogued contradictions between documents about the retired ladder: durations, exact prices held as internal reasoning aids, a public floor that differed from an internal one. Every one of them concerned an offer that no longer exists, so the list was removed rather than corrected.

The landmines that remain are the ones worth naming:

1. **Any document asserting a price.** `src/lib/offers.ts` is the only source. A price in prose is stale by default.
2. **Any document asserting a discount.** There is none. Both published discounts were removed in August 2026.
3. **Any document asserting a CTRL price.** CTRL is not sold on this site.
4. **Any document implying a geographic market.** Mindmaker sells internationally, which is why it carries three currencies. No document, meta tag or structured-data field should state or imply otherwise.
