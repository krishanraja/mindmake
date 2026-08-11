# Mindmaker Sales Playbook
*The single ground-truth document for AI sales and marketing agents working the Mindmaker book.*

**Last Updated:** 2026-08-11

> If you are an AI sales or marketing agent, outbound, inbound, content, retargeting, lifecycle, paid, or organic, this is the document you ground on. It is opinionated, structured for retrieval, and biased toward action. Use `OFFERS.md`, `ICP.md`, `VALUE_PROP.md`, `OUTCOMES.md`, and `BRANDING.md` for deeper canon. Use `Master_Messaging_and_FAQ.md` for full pitches and FAQ.

---

## 1. The ladder

Two engagements. Nothing else is for sale. **A capped advisory practice: a small number of engagements a year.**

| | The Handover | The Teardown |
|---|---|---|
| Duration | Six weeks plus a Day 90 recheck | Ten business days |
| Client time | Real. A stream lead carries work between sessions | Under two hours, total |
| USD | $18,000 / $30,000 / $50,000 by headcount | $9,500 |
| GBP | £14,000 / £23,500 / £39,000 | £7,500 |
| AUD | $27,500 / $45,500 / $76,000 | $14,500 |
| Bought | Always through a call | Self-serve. The price is published |
| Cap | Six a year, across every client | None |

Canonical prices are in `src/lib/offers.ts`. **Quote them exactly**, in the currency the buyer uses. They are set prices per market, never conversions, so never compute one from another.

**The Teardown is the gate.** Every Handover starts with one.

Funds and operating partners buying for a portfolio company are a **third door** into the same two engagements at the same prices. Fund-level terms are set on the call, never published.

---

## 2. ICP signals

**One ICP: companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product.** The seat accountable for whether it sells, not the seat accountable for whether it ships.

### Firmographic

| Attribute | Range |
|---|---|
| Employees | 50 to 5,000, sweet spot 100 to 1,000 |
| Stage | Series B to public, or mid-market privately held |
| Revenue | $10M to $500M, sweet spot $25M to $250M |
| Budget authority | Can sign for the relevant decision without a committee |

**Geography is not a qualifier.** The site sells internationally, which is why it carries three currencies. Do not add a market qualifier to any copy, meta tag or structured-data field.

### Psychographic

- Pitched fourteen AI tools this quarter, committed to none.
- Says some version of "I should understand this but I don't."
- Presents AI strategies to boards they cannot execute.
- Watches an AI-native competitor moving faster.
- Trusts peers more than vendors.
- Can name the decision in one sentence when pushed, and has been avoiding writing it down.

### The buying trigger worth watching for
The same decision appearing on a third consecutive leadership agenda. That is the moment a Teardown becomes obvious to them, and before it they will tell you they are "still gathering input".

---

## 3. Pain to rung mapping (for routing inbound)

Two questions, in this order: **how formed is the decision**, and **how big is the company**.

| What they say | Rung | Route |
|---|---|---|
| "We can't decide whether to build or buy." | Teardown | Self-serve. Price is published |
| "The board wants an AI roadmap by quarter-end." | Teardown | Self-serve |
| "I've been pitched fourteen tools and committed to none." | Teardown | Self-serve |
| "We shipped it and we can't sell it." | Handover, band by headcount | Always the call |
| "Nobody can explain what we sell any more." | Handover | Always the call |
| "Our pricing is guesswork and the pipeline is empty." | Handover | Always the call |
| "One of our portfolio companies is stuck." | Same two, per portfolio company | The call, at `/capital` |
| "We want someone in the business a few days a month." | None | Walk. No fractional roles |
| "We need this built and deployed." | None | Walk, and name a partner |
| "We should do some AI stuff." | None | Free on-ramp. Come back with a decision |

**The default is the Teardown.** It is the honest first spend for almost everyone, and it is the gate. Routing someone straight to six weeks because the company is large is the most common way to get this wrong.

---

## 4. Value drivers

### The Teardown
- **Speed.** Ten business days against a decision that has been open for months.
- **Cost of their time.** Under two hours. This is the driver most buyers respond to and most sellers under-use.
- **Defensibility.** A written position with the reasoning attached, which is what they actually need for the board conversation.
- **Honesty.** It will tell them not to spend more. Say this early; it is the most persuasive thing about it.

### The Handover
- **A finish line.** A date fixed before it starts, in a category where nothing ends.
- **Week five.** Non-dependency made falsifiable rather than claimed. Lead with this.
- **The cap.** Six a year. Not scarcity theatre: it is what one person can do personally, and it explains why the person they met is the person they get.
- **Ownership.** The context layer is theirs, in plain text and version control, not rented.

---

## 5. ROI framing

Do not build ROI models on invented numbers. Two framings that use only what is true:

**The Teardown, against the cost of being wrong.** The comparison is not "is this worth $9,500", it is "what does another quarter of this argument cost, or the wrong vendor commitment". For a company at this size, one wrong platform decision is worth multiples of the engagement. Let them do that arithmetic themselves rather than doing it for them.

**The Handover, against the alternative bid.** Ask a management consultancy for the same scope and the bid comes back multiples higher, over a longer window, with associates doing the work. The honest version of this comparison is about who does the work and when it ends, not just the number.

**Real outcomes, never presented as typical:** a $254K POC contracted with a major US publisher; 40% production-time and 75% setup-time reduction with a 22% revenue lift, in 45 days with no new headcount; a $250K budget defended with the first production workflow live in 90 days.

---

## 6. Discovery Question Bank (use on calls and in qualifying content)

### Open the call
- "What's the decision you've been putting off?"
- "Walk me through what's actually on your desk this quarter."
- "What does the board / your CEO / your investors want to hear that you can't tell them confidently?"

### Qualifying for the Teardown
- "Can you name the decision in one sentence?"
- "What's the cost of getting this wrong?"
- "Who else inside the company is on the hook for this?"
- "What have you tried so far? What's been pitched at you?"
- "If a peer with your exact problem walked in, what would you ask them?"

### Qualifying for the Handover
- "When did you ship it? What has the commercial outcome been since?"
- "What is the gap between the tech and the revenue?"
- "Who owns pricing? Who owns positioning? Are they the same person?"
- "What does your sales team say is the hardest part of selling this?"
- "Who inside the company will carry the work between our sessions?" (If nobody can be named, this is not ready.)
- "How many people are in the company?" (This sets the band. Ask it plainly; it is the difference between two real numbers.)

### Disqualification probes
- "Are you looking for ongoing capacity, or a defined engagement with a finish line?" (Disqualify if ongoing)
- "Are you looking for a deliverable, or for someone to run it for you long-term?" (Disqualify if "run it for us")
- "Do you have budget authority, or do you need to escalate?" (Note the cycle implications)

---

## 8. Channel templates

Rewritten August 2026. Every one of these previously sold an offer that no longer exists.

### Email outbound: trigger-based

> Subject: the [decision] you keep not making
>
> Saw [trigger: the funding round, the launch, the hire, the board deck]. Usually right about now the question stops being technical and starts being commercial.
>
> I take one real decision apart in ten business days. Yours comes back as the claims it is actually resting on, each checked against evidence, with the parts only you can decide separated from the parts the world decides. Under two hours of your time. $9,500, and the price is on the site.
>
> It regularly ends with me telling people not to spend anything else. If that is useful, reply and I will send the one page it produces.

### Email follow-up: no decision yet

> Subject: still gathering input?
>
> Thinking about [their decision in their words]. The tell that it is ready is usually that it has appeared on a third leadership agenda without moving.
>
> When it gets there, ten business days and under two hours of your time settles it. No rush from me: it is a worse purchase when the decision is not real yet.

### Retargeting and paid, short

**Headline:** "Bring the decision you keep not making."
**Sub:** "Ten business days. Under two hours of your time. A one-page memo you can send on. $9,500."

**Headline (Handover variant):** "Six weeks. Then I leave and you keep it."
**Sub:** "Week five I don't attend, because a system that only runs when I'm in the room is not a system. Six a year."

### Lifecycle: after a Teardown is booked

> 1. A short kickoff to confirm the one decision. Fifteen minutes.
> 2. Then nothing from you for a while. That is intentional.
> 3. The memo lands inside ten business days, with three claims under a 90-day watch.
> 4. If it says you do not need anything else, that is the honest answer and there is no follow-up sell.

### Content hook: LinkedIn, blog, podcast

The durable angle is the method, not the offer: decisions rest on claims nobody writes down; averaging four models into one confident answer hides the part worth looking at; the difference between what the world decides and what only you can decide.

---

## 9. Competitive Positioning Grid

| vs. | Their pitch | Our counter |
|---|---|---|
| **McKinsey / BCG / Deloitte** | 6-month engagement, 40-slide deck, $400k+, researchers | Fixed scope, 30 days, $60–100k, operator-led, no associates |
| **Fractional CAIO / CTO / CMO** | Ongoing retainer, fractional capacity | Finish line. We never sell capacity. |
| **AI training and cohort courses** | Curriculum, lectures, certifications | Mindmaker does not sell training. The output is a decision in writing, or a rebuilt commercial layer. |
| **AI tool vendors** | "Our tool is the answer" | Tool-agnostic. Trade-off analysis. No referral fees. |
| **Doing nothing** | "We'll figure it out next quarter" | The compounding cost of unmade decisions vs the price of resolving them. |

---

## 10. Disqualifiers (when to walk away cleanly)

Walk away politely from any of the following. Sending the wrong buyer through the funnel hurts the brand more than the missed deal helps it.

- Wants ongoing capacity / fractional executive role
- Wants implementation / deployment / production IT / managed services
- Wants tool recommendations without trade-off analysis
- Wants a 6-month engagement
- Pre-revenue or pre-product
- Cannot name a decision or commercial symptom in a sentence
- IC-level title with no budget authority
- Vendor co-sell partnership pitch (we're tool-agnostic)
- "We just want training, a workshop or a keynote", refer to the podcast or Mindmaker LIVE. Mindmaker does not sell training.

When you walk, walk warmly: "That's not what we sell, but here's what I'd suggest instead, [specific recommendation, named partner if applicable]." Brand currency compounds when you say no honestly.

---

## 11. Routing logic (for AI agents handling inbound)

```
IF wants_ongoing_capacity OR fractional_role OR retainer:
  walk warmly. name an alternative. no price.

ELSE IF wants_implementation OR production_IT:
  walk. refer a partner.

ELSE IF cannot_name_a_decision:
  free on-ramp only (the Diagnosis Room, the Sunday brief).
  no paid push. tell them to come back when a real fork shows up.

ELSE IF wants_a_product_not_an_engagement:
  route to CTRL at ctrl.themindmaker.ai.
  quote NO price: separate product, separate site.

ELSE IF decision_is_made AND commercial_machine_is_broken:
  route to The Handover, band by headcount.
  ALWAYS book the call. never self-serve.
  still starts with a Teardown; frame as the sequence.

ELSE IF fund OR operating_partner OR family_office:
  same two engagements, per portfolio company. route to /capital.
  fund-level terms set on the call, never quoted.

ELSE IF headcount > 5000:
  no published price. book the call.

ELSE:
  route to The Teardown. this is the default.
  price is published; self-serve is fine.
```

**Never** invent a price, convert between currencies, or offer a discount.

---

## 12. Lead Email Anatomy (what `send-lead-email` produces)

The primary "Book a call" flow now opens the **Diagnosis Room (Mindy)**, where the visitor's nervous decision is diagnosed in conversation. The `ScopingModal` ("Scope it with me") remains the secondary booking surface on the offer pages; it posts to the `notify-scoping-request` edge function: a structured intake email to Krish with the prospect's name, work email, company & role, the AI decision/problem, what success looks like in 30 days, and optional notes.

The richer `send-lead-email` lead-intelligence email below is produced by the legacy consult-modal path (now `/alumni` only). It contains:

- Prospect name, email, job title
- Selected program (preselected from the page or the modal dropdown)
- Commitment level (from the modal)
- Audience type and path type (derived)
- Session engagement data
- Company research via Gemini with Google Search grounding (skipped for personal email domains)
- 3× retry with exponential backoff for delivery reliability

When you (an AI sales agent) help craft the prospect's reply or follow-up, mirror the framing Mindy surfaced in the Diagnosis Room: "You said your decision is [X], your timeline is [Y], and the stakes are [Z]. Based on that, here's what I'd suggest…"

---

## 13. Sales Hygiene Rules

- **Never invent client names or numbers.** Use only the published proof points (Captify $0→$12M, Nine Entertainment $9M→$61M, Microsoft 2010 first global automated campaigns, 14-agent OS).
- **Never reference retired offers.** No 4-Week Sprint, 90-Day Sprint, Builder Sprint, Builder Session, Leadership Lab, Portfolio Partner, Fractional CAIO. No "Signal Desk" or "The Brief" as a nav label.
- **Never reference a retired offer.** The six-rung ladder is gone. If it is not the Teardown or the Handover, it does not exist.
- **Never use vendor-pitch language.** No "transformation", "synergy", "leverage" (as verb), "journey" (as abstract noun), "innovative", "revolutionary", "cutting-edge".
- **Always anchor on a finish line.** Every offer has one. Mention it.
- **Never quote a price that is not in `src/lib/offers.ts`,** and never convert between currencies.
- **Always close with a single CTA.** "Bring me one real decision" by default. The Handover always routes to the call.

---

## 14. Quick reference card (paste this into agent prompts)

```
COMPANY:    Mindmaker (themindmaker.ai)
FOUNDER:    Krish Raja
POSITION:   The anti-consultancy for leaders done being sold AI.
SHAPE:      A capped advisory practice. A small number of engagements a year.

OFFERS (two, largest first):
  The Handover   USD $18,000 / $30,000 / $50,000    by headcount: <100, 100-250, 250-5000
                 GBP  £14,000 /  £23,500 /  £39,000
                 AUD  $27,500 /  $45,500 /  $76,000
                 6 weeks + Day 90 recheck. Week 5 Krish does not attend.
                 Capped at 6 a year. ALWAYS via the call. Starts with a Teardown.

  The Teardown   USD $9,500   GBP £7,500   AUD $14,500
                 10 business days, under 2 hours of client time.
                 One-page memo + 3 claims under a 90-day watch.
                 The entry rung AND the gate. Self-serve; price is published.

  /capital       Same two, per portfolio company, for funds and operating
                 partners. Fund-level terms set on the call, never quoted.

  CTRL           Separate product, own site, own pricing. NOT sold here.
                 Quote no CTRL price.

PRICES: set per market, NOT conversions. Quote exactly, in the currency asked
        for. Never convert. Never invent. NEVER DISCOUNT.
        Canonical source: src/lib/offers.ts

ICP:    50 to 5,000 people, sweet spot 100 to 1,000.
        Buyer is the CEO, CRO or VP Product. Never the CTO.
        No geographic qualifier, ever. Three currencies is why.

BRAND FRAMEWORK:  Mind Set -> Mind Map -> Mind Make
PRIMARY CTA:      "Bring me one real decision" (opens the Diagnosis Room)

DO NOT SELL:
  - Fractional roles
  - Retainers
  - Implementation / production IT
  - Training, courses, certifications
  - Tool recommendations without trade-off analysis
  - Anything without a finish line

DO NOT PUBLISH:
  - Any discount, credit or urgency offer
  - Any price not in src/lib/offers.ts
  - Any geographic market claim
  - Any client name. The POC is "a major US publisher", always

PROOF:
  - $254K POC contracted with a major US publisher
  - Nine Entertainment: data and automation revenue $9M -> $61M in 3 years
  - Captify APAC: $0 -> $12M ARR at 22% EBITDA as first hire
  - Nexxen (SingTel): APAC platform revenue $4M -> $38M across 12 markets
  - Mindmaker OS: 14 agents, 45 workflows, in production, licensed to 3 businesses
```

---

## 15. Related Documentation

- `OFFERS.md`. full offer detail, scope, format, deliverables
- `ICP.md`. full ICP profiles with disqualifiers
- `ICP_ACCOUNTABLE_DELEGATOR.md`. deep archetype of the buyer ("The Accountable Delegator")
- `VALUE_PROP.md`. positioning, differentiators, competitive framing
- `OUTCOMES.md`. buyer outcomes by offer with leading and lagging indicators
- `BRANDING.md`. voice, tone, terminology standards
- `Master_Messaging_and_FAQ.md`. canonical pitches and FAQ
- `mindmaker_rebuild_brief_v4.md`. strategic intent (v4 barbell pivot + v5 Operator's Edge)
- `../CLAUDE.md`. authoritative codebase reference

---

**End of SALES_PLAYBOOK**
