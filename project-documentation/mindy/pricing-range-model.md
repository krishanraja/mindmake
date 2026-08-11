<!-- Last Updated: 2026-08-11 -->
# Pricing Spec

*Layer 1 pin and cross-cutting guardrail. The prices Mindy is allowed to say, and the rules that stop her inventing, converting, or discounting one. The deployable copy of this file is `PRICING_CARD` in `supabase/functions/_shared/mindy/knowledge.ts`, and the canonical source for the figures themselves is `src/lib/offers.ts`.*

**This replaced a two-mode range model in August 2026.** The old spec routed buyers between a productised ladder and a bespoke scoping engine (hours times a rate band, floors, a value cross-check), and published ranges only because the ladder had six rungs with negotiable scope. Both are gone. There are two engagements, their prices are on the website, and Mindy quotes them exactly.

---

## 1. The two rungs

Largest first, deliberately, everywhere. Every comparison should say the bigger number before the smaller one. That governs the order things are said in, not which Handover band applies. It also holds when the Teardown is the recommendation: the Handover figure is still said first, then the Teardown figure, then the recommendation.

**Picking the Handover band.** Headcount decides it, and nothing else does. Not revenue, not the size of the decision, not how senior the buyer sounds, and never simply the first band on the page. Under 100 people is the first rung, 100 to 250 the second (so a 200-person company sits there), 250 to 5,000 the third, and above 5,000 there is no published price at all. A headcount sitting exactly on a boundary gets both adjacent bands named and the exact one confirmed on the call, never a figure invented in between.

| Engagement | USD | GBP | AUD |
|---|---|---|---|
| The Handover, 250 to 5,000 people | $50,000 | £39,000 | $76,000 |
| The Handover, 100 to 250 people | $30,000 | £23,500 | $45,500 |
| The Handover, under 100 people | $18,000 | £14,000 | $27,500 |
| The Teardown | $9,500 | £7,500 | $14,500 |

**The Teardown.** Ten business days, one decision, under two hours of the client's time. The entry rung and the gate: every Handover starts with one.

**The Handover.** Six weeks plus a Day 90 recheck, capped at six a year. Week five Krish does not attend, on purpose.

CTRL is a separate product with its own pricing, on its own site. Mindy does not quote a CTRL price.

---

## 2. Set prices per market, never conversions

The GBP and AUD columns are not the USD column converted. Each figure is a deliberate round number in its own market, chosen to be a number a buyer there would find normal.

This matters operationally, not just philosophically:

- **Mindy answers in the currency she is asked in.** "How much in pounds" gets the GBP figure, not a dollar figure with an apology.
- **She never computes one currency from another.** No arithmetic, no "roughly", no live rate.
- **She never invents a fourth currency.** Asked about one that is not listed: give the USD price and say the exact figure for their market is set on the call.
- **There is no FX logic anywhere in the estate**, and a test fails the build if any appears. A rate lookup would make a published price a function of the morning's spot rate, and would silently change a number a client is already holding a proposal for.

---

## 3. The router

1. Disqualifier present (fractional role, retainer, production IT or implementation, ongoing capacity, pre-revenue with no decision, an IC with no budget)? Walk warmly with a free alternative. No price.
2. No nameable decision? No sale. A free on-ramp only, and tell them to come back when a real fork shows up. Do not sell a Teardown to someone with nothing to tear down.
3. Tooling-shaped, low stakes, wants a product rather than an engagement? CTRL, self-serve, no price quoted here.
4. One nameable decision, unresolved, with a real cost of getting it wrong? **The Teardown.** This is the default and the honest first spend for almost everyone.
5. The decision is already made, and what is broken is how the business decides and sells? **The Handover**, at the band for their headcount, always via the call. It still starts with a Teardown, so frame it as the sequence rather than as an upsell.
6. A fund, family office or operating partner asking for a portfolio company? The same two engagements, priced per portfolio company. Fund-level and multi-company terms are set on the call, never quoted by Mindy.
7. Above 5,000 people, or scope outside the two engagements? No price. Book the call.

---

## 4. Hard rules

### 4.1 A price question is answered in the turn it is asked
The highest-priority rule on this page. It beats the reflect-then-reason order and it beats whatever phase the conversation is in. Lead the reply with the figure, then reframe, then ask the next question. Rung still unclear: give the Handover band for their headcount and the Teardown. Headcount unknown: give the Teardown price and the whole Handover ladder, and ask for headcount after the numbers rather than instead of them.

### 4.2 Published prices, quoted exactly
The figures are on the website. Refusing to say a number a visitor can read two clicks away insults them, and the ranges-only rule that used to apply here died with the ladder that needed it.

### 4.3 Answer in the currency asked for, and default to the one on screen
The Diagnosis Room passes the visitor's selected currency through to Mindy as a `Currency for this session` line, so the figure she says matches the figure the page is showing. A currency the visitor names themselves beats the page. These stay set prices per market: nothing is converted, nothing is computed from another currency, and no fourth currency exists. Asked about a market that is not one of the three, the answer is the USD figure plus the fact that their market's exact price is set on the call.

### 4.4 Never invent a number
Not on the card means it does not exist. Anything outside the two engagements, a retainer, implementation, ongoing capacity, or genuinely custom scope: stop quoting and book the call.

### 4.5 Never discount
Mindy has no discount to give. No published credit, no percentage off, no "if you decide this week".

Krish keeps a discretionary credit as a closing tool, which he can offer on a call when it helps. **It is deliberately not in this file, not on the site, and not in Mindy's knowledge.** A card he plays is worth more than a discount everyone expects, and a published discount trains buyers to wait for it.

If price is the obstacle, the honest moves are the smaller rung, the free door, or the call, in that order.

### 4.6 The Handover is never self-serve
Six weeks of someone's operating model goes through a conversation. The Teardown can be recommended and bought without one.

---

## 5. Where the numbers live

`src/lib/offers.ts` is the single source of truth. Every price on the site, in the prerendered crawler bodies, and in `llms.txt` is interpolated from it, and a test fails the build if a price string appears anywhere else in the web surface.

Mindy is the one exception, because the edge functions are Deno and deploy separately, so she cannot import that file. Her copy of the figures lives in `PRICING_CARD`. `src/test/mindy-knowledge.test.ts` closes that gap from the other side: it fails if Mindy states a price that is not in `offers.ts`, or if any current price is missing from her card in any of the three currencies.

**When repricing:** change `offers.ts`, then `PRICING_CARD`, then this file. The test will tell you if you missed one.
