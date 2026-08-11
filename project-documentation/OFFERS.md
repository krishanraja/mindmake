<!-- Last Updated: 2026-08-11 -->
# Offers: The Full Guide

Two paid engagements. Nothing else is for sale.

**Mindmaker is a capped advisory practice. A small number of engagements a year.** That framing is honest to a buyer, and it is also the thing that stops the cap reading as false scarcity: six Handovers a year is what one person can do personally, and saying so is more useful than pretending capacity is unlimited.

Canonical prices live in `src/lib/offers.ts`. Every price on the site, in the prerendered crawler bodies, and in `llms.txt` is interpolated from that file, and a test fails the build if a price string appears anywhere else in the web surface. If this document and that file ever disagree, the file is right.

---

## The ladder

Presented largest first, everywhere. Every comparison surface says the bigger number before the smaller one.

| | The Handover | The Teardown |
|---|---|---|
| **What** | Six weeks rebuilding how the business decides and sells | Ten business days on one real decision |
| **Client time** | Real. A stream lead has to carry work between sessions. | Under two hours, total |
| **Ends with** | A business that runs it without me, plus a Day 90 recheck | A one-page memo and three claims under a 90-day watch |
| **USD** | $18,000 / $30,000 / $50,000 by size | $9,500 |
| **GBP** | £14,000 / £23,500 / £39,000 | £7,500 |
| **AUD** | $27,500 / $45,500 / $76,000 | $14,500 |
| **How it is bought** | Always through a call | Self-serve. The price is published |
| **Cap** | Six a year, across every client | None |

GBP and AUD are **set prices per market, not conversions.** Each figure is a deliberate round number in its own market. There is no FX logic in the estate and there must never be: a rate lookup would make a published price a function of the morning's spot rate, and would silently change a number a client is already holding a proposal for.

**The Teardown is the gate.** Every Handover starts with one. Nobody buys six weeks without both sides seeing how one decision goes first, and it has talked people out of the Handover as often as into it. That is the feature, not a disclaimer.

---

## 1. The Teardown

### Position
The entry rung and the gate. One decision, taken apart properly.

### Tagline
Bring the decision you keep not making.

### For
Someone with a nameable decision, unresolved, where the cost of getting it wrong is real. Usually a build-versus-buy call, a vendor commitment, a board narrative, or a replace-versus-redeploy question.

### Format
Ten business days from kickoff. Under two hours of the client's time in total, which is the point: the work happens without occupying them.

### The method
1. **The decision comes apart.** Broken into the claims it is actually resting on. Most decisions rest on four or five, and most people have never written them down.
2. **Every claim gets checked** against live evidence, and comes back with a reliability tier, so it is visible which parts are load-bearing and which are just repeated.
3. **Every consideration gets classed.** External, meaning the world decides. Only you, meaning no amount of research helps. Or nobody yet, meaning the answer does not exist and waiting will not produce it.
4. **Four models cross-examine it.** Where they disagree, the disagreement is preserved. Averaging four models into one confident answer hides exactly the part worth looking at.

### What you walk out with
- A one-page memo you can send to whoever reads it next.
- The decision mapped to its load-bearing claims, each with a reliability tier.
- Every consideration classed External, Only you, or Nobody yet.
- The four-model cross-examination with disagreements preserved, not averaged.
- Three claims placed under a 90-day watch, so you know what would change your mind.
- A CTRL workspace with the decision map in it.

### What it is not
Not a workshop. Not a discovery phase. Not a deck. Not a research report: the output is a decision with its reasoning attached, and it will sometimes tell you not to spend anything else.

---

## 2. The Handover

### Position
The rebuild. Six weeks on how the business decides and sells, then it ends.

### Tagline
Six weeks. Then I leave and you keep it.

### For
Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells. Not the CTO, because this is commercial work, and engineering and commercial are different problems.

The signal is that the decision is already made and what is actually broken is how the business decides and sells: positioning, pricing, the sales motion, or the build order.

### Format
Six weeks on dates fixed at the start, plus a Day 90 recheck. Gated on a completed Teardown. Capped at six a year.

### The six weeks
- **Week 1.** Load and correct your context. Most of it is discovering what the organisation believes that is no longer true.
- **Week 2.** Adversarial pre-mortem. Assume the plan failed, work backwards to why. The cheapest week of the six.
- **Week 3.** The fork. Not AI-native yet: rebuild go-to-market, pricing and positioning. Already AI-native: set the build order instead.
- **Week 4.** You drive. You run it, I watch and correct.
- **Week 5. I do not attend.** The load-bearing week. If it only works when I am in the room, we both find out while there is still time to fix it.
- **Week 6.** Exit. You keep the system, the context and the way of deciding.
- **Day 90.** A recheck, included. A handover that decays quietly is not a handover.

### What you walk out with
- A way of deciding your team runs themselves, on their own decisions.
- A rebuilt commercial layer: positioning, pricing and the sales motion, with the reasoning written down rather than held in someone's head.
- A context layer you own, in plain text and version control, model-agnostic and not rented from a platform.

### What it is not
Not a retainer. Not a fractional executive seat. Not implementation or production IT. Not an engagement that quietly continues: it ends on a date you know before it starts, and week five exists to prove it can.

---

## 3. The third door: funds and portfolio companies

Not a separate offer. The same two engagements, bought by a fund, family office or operating partner on behalf of a portfolio company, priced per portfolio company at the same figures.

Fund-level and multi-company terms are **set on the call**, never published. The shape changes with how many companies, over what window, and who inside the fund carries the work between engagements, and none of that is knowable from a page. Publishing a volume discount would also reinstate the published discount that was deliberately removed everywhere else.

Lives at `/capital`.

---

## 4. CTRL

A separate product with its own site and its own pricing. **This site does not sell it.**

CTRL appears here in exactly two ways: as a Teardown deliverable ("a CTRL workspace with your decision map in it"), and as a product link. No price, no tier, no upgrade path.

---

## What each engagement collects

New in August 2026, and the most commercially important thing in this document.

Advisory that produces only fees is a day rate with extra steps. What makes the practice worth something later is the one structured thing it accumulates that nobody else can assemble: how a set of comparable companies actually priced and packaged, what converted, what had to change, and what commercial constraint the answer had to live inside.

So every engagement defines, **in the offer definition itself**, what it captures and retains. It lives in `src/lib/offers.ts` as `Offer.collects` rather than in a process document, because a process document does not get read, and every engagement page, proposal and internal handoff resolves through that object.

Four slots, mirrored by typed columns in `public.engagement_intelligence`:

| Slot | The Teardown | The Handover |
|---|---|---|
| Pricing and packaging | The price the decision was already carrying | The full commercial architecture as found |
| What converted | Which claim, once tested, moved the decision | Which repositioning produced a signed outcome |
| What had to change | The belief that did not survive evidence | The GTM assumption that had to be abandoned |
| Commercial constraint | The boundary the answer had to fit inside | The constraint that survived the rebuild |

**This is internal.** It never appears in marketing copy, it is not a selling point, and a test fails the build if any of it reaches the DOM. Retained as an anonymised pattern layer, never as an identifiable account.

`TODO(krish): the engagement terms need a confidentiality and consent clause covering aggregated, anonymised retention before a real row is written. Needs your sign-off and probably a lawyer's. The schema ships; the terms change does not.`

---

## Pricing policy

- **Published, and quoted exactly.** The figures are on the website. Refusing to say a number a visitor can read two clicks away insults them. The ranges-only policy that used to apply here was retired along with the six-rung ladder that needed it.
- **Answer in the currency asked for.** Set prices per market, never conversions.
- **No discounts.** There is no published credit, no percentage off, no urgency offer. Krish keeps a discretionary credit as a closing tool for a live call; it is deliberately absent from the site, the FAQ and Mindy's knowledge base, because a published discount trains every buyer to wait for it.
- **The Handover is never self-serve.**
- **Outside the two engagements**, including anything above 5,000 people, a retainer, implementation or ongoing capacity: no price, book the call.

---

## What Mindmaker does not sell

No fractional executive roles. No ongoing retainers. No production IT or implementation work. No training. No multi-session programmes with no finish line.

Every engagement has a fixed scope, a fixed price and a date it ends.

---

## Retired

The six-rung ladder (free lessons, the five one-day workshops, the executive cohort, the one-day commercial diagnosis, the 30-day commercial rebuild, the half-day team immersion, and the annual alumni pass) was retired in July and August 2026. The named record is in `DECISIONS_LOG.md`.

The page components are in `src/_archive/`, and every route that served them is a 301. They are not coming back without a decision, and a decision belongs in the log before it belongs in a diff.
