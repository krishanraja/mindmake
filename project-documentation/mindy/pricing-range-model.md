<!-- Last Updated: 2026-07-12 (verified against CANON.md §2.4 and the public range card; no drift found) -->
# Pricing and Range Spec

Machine-usable formalisation of the Mindmaker pricing model for Mindy and the proposal generator. This document encodes the model exactly as set; it invents no new numbers. Every figure here comes from the canonical ladder or the bespoke scoping rules already in force.

**Two hard facts that govern everything below.**

1. Mindy never quotes an exact figure to a client. Client-facing output is always a range. The exact number is set by Krish on the call.
2. Pricing has been removed from the live site and from generated proposals. Only ranges are shown. The proposal renders a band, never a single price.

This spec is the source of truth for the `the hours and the price` section of the proposal and for any price language Mindy speaks. If a request falls outside what this spec covers, the answer is not a guess. The answer is "book the call".

---

## 1. Two-mode routing

Every buyer resolves to exactly one of two pricing modes before any number is computed. The router reads buyer signals (set silently from enrichment plus the decision the user names) and selects the mode. Mode selection is deterministic: run the productised test first, and only fall to bespoke if it fails.

### Mode A — Productised ladder

Fixed-scope, fixed-outcome offers off the canonical ladder. Used for individuals, leaders buying a personal decision, enterprise, and capital. The price is a pinned figure or a pinned band; Mindy shows the band, never the pinned figure.

**Buyer signals that select Mode A:**

- The decision maps cleanly to one rung on the offer ladder (see §3).
- The buyer is an individual or a single budget-holding leader buying for themselves (-> Workshop / Cohort).
- The buyer is enterprise or capital with a company-level commercial question on a shipped AI capability, or a full commercialisation rebuild (-> Signal Session / Revenue Architecture).
- The work has a hard finish line and a standard deliverable set already named on the ladder.
- They want a product they can buy, not an engagement scoped to their org.

### Mode B — Bespoke enablement

Live-scoped enablement engagements for SMEs and founder-led teams. This is the DoThinkDo / Steph / Meliora class: the work is built around the client's own functions and streams, the deliverables are partly bespoke, and the price is computed live from what needs building. Mindy shows a pilot band and a full band; the exact fee is set on the call.

**Buyer signals that select Mode B:**

- An SME or founder-led team that wants AI embedded across their own named functions or streams, not a fixed product.
- The ask is "scope the whole thing for my business" / "the full roadmap across the business" / "rebuild how we work with AI" at a team level below enterprise scale.
- Deliverables depend on the client's specific streams (a brain per stream, use cases in their tools, a policy and roadmap for their org).
- There is real building to do, not only teaching, and the shape of it varies by client.
- The buyer does not map to a single clean rung because the engagement spans several functions at once.

### Router decision order

```
1. Disqualifier present (fractional role, ongoing retainer, production IT/implementation,
   pre-revenue with no decision, IC with no budget)?
     -> Neither mode. Walk away warmly with a named free alternative. No price.
2. Decision maps to a single ladder rung (§3)?
     -> Mode A (productised). Show the rung's band.
3. SME / founder-led team wanting AI embedded across their own streams/functions?
     -> Mode B (bespoke). Run the scoping engine (§2).
4. Enterprise/capital company-level question or full commercial rebuild?
     -> Mode A, Signal Session or Revenue Architecture band. Always via the call.
5. Ambiguous, high-stakes, or above the ceiling (§4)?
     -> Stop quoting. Book the call.
```

---

## 2. The bespoke scoping engine (Mode B)

A step-by-step the proposal generator can execute. It takes three inputs, runs the math, applies floors and a value cross-check, and returns a pilot band, a full band, and a Phase 2 line. It never returns a single number.

### Inputs

**Input 1 — Business-size band -> rate.** Read business size from enrichment (headcount, funding, evident resourcing) and pick the rate floor.

| Business size | Rate (per hour) |
|---|---|
| SME / small founder-led team (the floor) | $220 |
| Mid-sized, reasonably resourced | $300 |
| Well-resourced | $400 |

Default to the SME floor of $220 when size is unclear. Round down, not up, when between bands. The rate is a planning input, never shown to the client as a per-hour price unless framed exactly as the engagement's implied rate inside a fixed, capped fee.

**Input 2 — Deliverables -> hours.** Hours come from what needs *building* (deliverables and streams), not from what needs *teaching*. Teaching time rides inside the engagement; it does not drive the hour count on its own.

| Scope | Hours | Basis |
|---|---|---|
| Pilot (one stream) | ~6 hours | One stream: build its brain, put 2-3 use cases into live use. |
| Full bespoke | ~30-40 hours | All streams plus the company-wide layer (one policy, one cross-stream roadmap, coaching across the org). |

Count one stream as roughly one unit of pilot work (~6h). The full engagement is not the streams stapled together; it is cheaper per hour than the sum of pilots because the streams share one foundation. Budget the full engagement at the lower end of the 30-40h window and carry the upper end as overrun the engagement absorbs.

**Input 3 — Value at stake.** Estimate the value of the decision or the work to the client (revenue freed, cost avoided, hours returned, a roadmap they would otherwise commission). This is the cross-check, not the primary driver.

### The math

```
rate        = rate_for_business_size(size)          # Input 1
hours       = hours_for_deliverables(streams)       # Input 2
base        = hours * rate

band_low    = base * 0.75                            # -1 25%
band_high   = base * 1.25                            # +25%

# Apply floors (the band can never sit below the floor for its size)
pilot_floor = 2000   if SME-small ... up to 5000 by size   # pilot floor: $2k-$5k by size
full_floor  = 8000                                  # full bespoke floors at $8,000

# Value cross-check
value_low   = value_at_stake * 0.02                 # 2%
value_high  = value_at_stake * 0.05                 # 5%
# Take the HIGHER of (hours-based band) and (value-based band).

band_final  = max( floor_for_scope, hours_band, value_band )
```

**Rules applied in order:**

1. Compute the hours x rate base, then the +/- 25% band around it.
2. Floor it. A pilot floors at $2,000 and rises to $5,000 by business size. The full bespoke engagement floors at $8,000.
3. Run the value cross-check at 2-5% of the value at stake. Where the value band is higher than the hours band, take the value band. The framing is "I price against the value of the decision, not my hours."
4. Never let the final band drop below the floor for its scope.
5. Keep it conservative. When in doubt, present the lower, more defensible band and let the call move it up.

### Outputs

The engine returns three things, all as ranges:

- **Pilot band** — one stream, ~6 hours. Floors $2,000 (rising to $5,000 by size). The taste before going further.
- **Full band** — all streams plus the company-wide layer, ~30-40 hours. Floors $8,000.
- **Phase 2** — never priced. Always rendered as **"scoped together"**, off the Phase 1 roadmap and momentum. Not part of today's ask.

### Roll-forward credit logic (Mode B)

- The pilot credits in full toward the full engagement. Whatever the client pays for the pilot comes off the full, so the most they ever pay to reach the full engagement is the full band itself.
- The full engagement carries into Phase 2. Phase 2 carries forward on the roadmap and the momentum, not as a leftover discount.
- Always state this in the proposal: "Whatever you pay rolls forward, so there is no wrong place to begin."

---

## 3. Public site range card

The site renders this table. Ranges only. No exact figure is shown anywhere on the public surface.

| Offer | Range |
|---|---|
| Lightning Lessons | Free |
| Workshops | $500 - $1,000 |
| AI-Fluent Executive | $2,000 - $3,000 |
| Bespoke enablement | $8,000 - $25,000 (pilots from $2,000) |
| Signal Session | $10,000 - $20,000 |
| AI Immersion | $10,000 - $15,000 |
| Revenue Architecture | $50,000 - $100,000+ |
| Alumni Pass | ~$1,500 / year |
| CTRL | Free, upgrades from $29 |

Render notes for the site:

- These are display ranges for the public range card. They are wider and rounder than the internal pinned figures on purpose, so the exact number stays a call conversation.
- The Alumni Pass is invitation-only and is never surfaced cold, even though it carries a range here.
- CTRL routes to its own live subdomain; "upgrades from $29" is the one-time Diagnostic taste, with Edge Pro as the recurring SKU. Do not invert them.

---

## 4. Hard rules

These are inviolable. Mindy and the proposal generator enforce all four.

### 4.1 Never an exact figure, client-facing

Mindy never speaks or writes a single exact price to a client. Every client-facing price is a range. The proposal renders a band. The exact number is set by Krish on the call. If a user pushes for "just give me the number," the honest line is that the number is set on the call against the value of their specific decision, and here is the band it sits inside.

### 4.2 The ~$100k ceiling guardrail

Present bands up to roughly $100,000. Above that, stop quoting and book the call. Also stop quoting and book the call for any of:

- A retainer or any ongoing engagement.
- Implementation or production build work.
- Custom terms, non-standard scope, or anything that does not map to the ladder or the bespoke engine.

When the ceiling or any of these trips, the output is not a wider band. It is: "This is past where I price in the room. Book the call and we set the scope and the number together. First conversation is free."

### 4.3 Roll-forward credit (all modes)

- **Bespoke (Mode B):** pilot credits in full to the full engagement; full carries into Phase 2. (See §2.)
- **Productised (Mode A):** the Workshop-to-Cohort credit applies where it exists ($500 off the AI-Fluent Executive with code WORKSHOP, valid 90 days post-workshop). Surface it only after a Workshop is the recommendation, never as a cold discount.
- The principle is always the same: whatever a buyer pays at a smaller rung rolls forward, so starting small is never the wrong place to begin.

### 4.4 Conservative and defensible by default

Where two bands are valid, present the lower one. Where size is unclear, default to the floor rate. Where value is uncertain, lean on the hours band. The call can always move a number up. A band that was too high erodes trust before the call ever happens.

---

## 5. Worked examples

Three archetypes, run end to end through the router and the engine. Every band below is derived only from the rates, hours, floors, and cross-checks in this spec.

### Example 1 — A 12-person creative agency

**Signals:** SME, founder-led, ~12 staff. Wants AI embedded across its teams (creative, accounts, new business). Spans several functions, no single clean rung.

**Routing:** Disqualifier check passes. No single ladder rung fits a multi-function embed. SME wanting AI across its own streams -> **Mode B, bespoke.**

**Engine:**

- Rate: SME floor -> **$220/hr**.
- Hours: pilot one stream ~6h; full across ~3-4 streams plus the company-wide layer -> budget **~36h**.
- Base (full): 36 x $220 = $7,920. Band +/- 25% = $5,940 - $9,900.
- Floor: full bespoke floors at $8,000. Band lifts to **$8,000 - $9,900**.
- Pilot: 6 x $220 = $1,320; floored to the $2,000 pilot floor for an SME -> **$2,000**.
- Value cross-check: a small agency freeing senior hours and a roadmap it would otherwise commission. Modest value at stake; the hours band is the higher, defensible figure, so we keep it.

**Quoted, end to end:**

- Pilot band: **from $2,000** (one stream, ~6 hours).
- Full band: **$8,000 - $10,000** (all streams plus the company-wide layer, ~36 hours).
- Phase 2: scoped together, off the Phase 1 roadmap.
- Roll-forward: the pilot comes off the full, so the most you ever pay to reach the full engagement is the full band.

### Example 2 — A Series B fintech with a shipped-but-unsold AI feature

**Signals:** Well-resourced, enterprise-scale, post-Series B. The decision is a single company-level commercial question on a shipped AI capability: a feature is built but not attaching in the sales motion.

**Routing:** Disqualifier check passes. This is a fast, single company-level commercial question on a shipped AI capability -> **Mode A, productised: the Signal Session.** (It is also the honest diagnostic gate for whether the larger Revenue Architecture is warranted.)

**Engine:** Mode A reads the pinned band off the ladder; no bespoke math. The public range card shows the Signal Session at **$10,000 - $20,000**. Always via the call.

**Quoted, end to end:**

- Recommended rung: the Signal Session, **$10,000 - $20,000**.
- Always via the free call (this is a $12k+ fit, so the call is the qualification, not friction).
- If the gap turns out to be a full commercialisation rebuild rather than one question, ladder via the Signal Session first, then Revenue Architecture (**$50,000 - $100,000+**, anchored at the floor, never the top). Anything above ~$100k or any custom/retainer scope trips the ceiling guardrail: stop quoting, set it on the call.

### Example 3 — A solo founder / coach

**Signals:** Solo operator, coaching or content practice (the Steph / Remindful class). Wants to rebuild how they work with AI: a content engine, a productised offer, the founder back to the craft rather than running it manually. One person, one set of streams.

**Routing:** Disqualifier check passes (not a fractional role, not a retainer, has a real decision). Not a single clean productised rung; a founder-led team wanting AI embedded across their own (few) streams -> **Mode B, bespoke**, at the smallest size.

**Engine:**

- Rate: SME floor -> **$220/hr**.
- Hours: a solo founder usually starts at the pilot. One stream (the content engine, say) ~6h. A "full" here is small, perhaps 1-2 streams plus a light company-wide layer.
- Pilot: 6 x $220 = $1,320; floored to **$2,000** (the SME pilot floor).
- Full (if they want the whole rebuild): even a light full engagement floors at **$8,000**.
- Value cross-check: real but modest (hours freed, a five-figure agency retainer avoided, the founder enjoying the work again). The floor is the binding number, so we present the floor.

**Quoted, end to end:**

- Start at the pilot: **from $2,000** (one stream, ~6 hours). This is the honest, conservative starting point for a solo founder.
- Full rebuild, if they want it: **from $8,000**.
- Phase 2: scoped together, later.
- Down-sell note: if the founder lights up at faster outputs but will not reinvest the time, Mindy recommends a tool and CTRL Free, not a bespoke engagement. The honest no protects the band's credibility.

---

## 6. Quick-reference summary

- Two modes. Productised ladder (individuals, enterprise, capital) vs bespoke enablement (SMEs, founder-led teams). Router runs productised-first, falls to bespoke.
- Bespoke math: `hours x rate`, +/- 25% band, floor it (pilot $2k-$5k by size, full from $8k), cross-check at 2-5% of value, take the higher. Outputs a pilot band, a full band, and a "scoped together" Phase 2.
- Public range card is the only price surface, and it shows ranges only.
- Never an exact figure client-facing. Ceiling at ~$100k; above it or any retainer/implementation/custom-terms, stop quoting and book the call.
- Roll-forward everywhere: pilot credits to full, full carries into Phase 2, Workshop credits to Cohort.
- Conservative by default. Present the lower band; the call moves it up.
