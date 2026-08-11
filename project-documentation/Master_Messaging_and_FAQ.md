# Mindmaker Master Messaging & FAQ Document
*Core source of truth for product marketing, sales, content, and outbound*

**Last Updated:** 2026-08-11

**Goal:** One document a salesperson, content writer, or AI agent can open and get every pitch, position, and objection answer right. Supersedes the earlier CTRL / 1:1-sprint-era version. For strategic intent, read `mindmaker_rebuild_brief_v4.md`. For agent-grade sales detail (ICP signals, ROI math, channel templates), read `SALES_PLAYBOOK.md`. For durable commercial reference, read `COMMERCIAL_REFERENCE.md`; for how the Diagnosis Room reasons, read the `mindy/` Brain Pack.

---

## PART 1: THE CORE NARRATIVE (WHO IS KRISH, WHO IS MINDMAKER)

### Mindmaker one-liner
**The anti-consultancy for leaders done being sold AI.**

### Mindmaker in a paragraph
Mindmaker is a capped advisory practice: a small number of engagements a year. Two of them. The Teardown takes one real decision apart over ten business days, using under two hours of the client's time, and ends in a one-page memo plus three claims under a 90-day watch. The Handover spends six weeks rebuilding how the business decides and sells, then ends on a date fixed at the start, with a week where Krish does not attend and a Day 90 recheck. Prices are published, in three currencies. Every Handover starts with a Teardown. No fractional executive roles. No retainers. No production IT. No training. Every engagement has a fixed scope, a fixed price and a finish line.

### Krish one-liner
Sixteen years commercialising content, media and IP businesses. Now he builds the AI systems that run them.

### The credential pivot (outbound and sales)
"I started coding at Microsoft. I've spent my career running commercial P&Ls and building systems. I scaled Captify APAC from $0 to $12M ARR. I took Nine Entertainment's data revenue from $9M to $61M. Today I run Mindmaker with a 14-agent OS that automates the output of a 30-person team. I'm an operator who builds the future live, not a researcher writing about it."

### Proof points (factual context, never boastful)
- A $254K POC contracted with a major US publisher. The client is never named; this is the approved wording.
- Nine Entertainment: data and automation revenue from $9M to $61M in three years, 70+ products launched, a $55M P&L at 22% EBITDA.
- Captify APAC: $0 to $12M ARR at 22% EBITDA as first hire, team to 18.
- Nexxen (SingTel): APAC platform revenue from $4M to $38M across twelve markets.
- Microsoft UK: automated media campaigns deployed in 2010.
- Mindmaker OS: 14 agents, 45 workflows, in production, licensed to three businesses. See `/operator`.

### The positioning vs the market
I am not an advisor. I am an operator. I do not sell 40-slide decks, ongoing retainers, fractional-executive gigs or training. I sell two things: ten business days taking one decision apart, and six weeks rebuilding how a business decides and sells. Both have a published price and a date they end.

---

## PART 2: THE CORE PAIN

One ICP. Companies of 50 to 5,000 people where the buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells.

### What they are actually experiencing

- Fourteen AI tools pitched this quarter, none committed to.
- A board asking for an AI strategy they cannot execute.
- A product that works and a commercial story that does not, where the deck has been rewritten four times and nobody has said out loud that no one can explain what the company sells.
- The same decision relitigated in three consecutive leadership meetings.
- An AI-native competitor moving faster, and the cost of catching up compounding quietly.

### How they say it

- "I need to deliver an AI strategy and I don't know where to start."
- "Everyone on my team is using something different. It's chaos."
- "Should we build our own or buy off the shelf?"
- "How do I know if this is delivering anything or just hype?"
- "I'm nervous about getting locked into the wrong vendor."

### The thing underneath

They can describe the decision in one sentence when pushed, and they have been avoiding writing it down, because writing it down makes it a thing they are now accountable for having an answer to. The archetype is in `ICP_ACCOUNTABLE_DELEGATOR.md`, and the important finding there is that the fraud feeling is **rational rather than neurotic**: they genuinely are being asked to make a call in a domain where their experience does not transfer cleanly.

### The shared enemy

Consultants, LLMs and the next hyped tool sell point solutions built to extract your judgment, not build it.

---

## PART 3: THE OFFERS (CANONICAL PITCHES)

Canonical prices live in `src/lib/offers.ts`. Quote them exactly, in the currency the buyer asks in. They are set prices per market, never conversions.

### The Handover: $18,000 / $30,000 / $50,000 USD by company size

**The pitch.** Six weeks. Then I leave and you keep it.

Consultants are built so the engagement never ends. This one is built to end, on a date you know at the start. Week 1 we load and correct your context, which is mostly discovering what the organisation believes that is no longer true. Week 2 is an adversarial pre-mortem: we assume the plan failed and work backwards to why. Week 3 is the fork, rebuilding go-to-market, pricing and positioning, or setting the build order if you are already AI-native. Week 4 you drive and I correct. **Week 5 I do not attend at all**, because a system that only runs when I am in the room is not a system, and you should find that out while there is still time to fix it. Week 6 is exit. A Day 90 recheck is included.

Capped at six a year, across every client. That is the honest number for work I do personally.

**Who it is for.** Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product. Never the CTO: this is commercial work.

**Always through a call.** Six weeks of your operating model is not a self-serve purchase.

### The Teardown: $9,500 USD

**The pitch.** Bring the decision you keep not making.

Ten business days. Under two hours of your time. Your decision comes apart into the claims it is actually resting on, and most turn out to rest on four or five nobody has written down. Every claim is checked against live evidence and comes back with a reliability tier. Every consideration is classed External (the world decides), Only you (no amount of research helps), or Nobody yet (the answer does not exist and waiting will not produce it). Four models cross-examine it, and where they disagree you see the disagreement, because averaging four models into one confident answer hides exactly the part you needed to look at.

You keep a one-page memo you can forward, and three claims under a 90-day watch so you know what should change your mind.

**It is also the gate.** Every Handover starts here, and it has talked people out of the six weeks as often as into it.

### For funds and portfolio companies

The same two engagements, priced per portfolio company. Fund-level and multi-company terms are set on the call, never published. At `/capital`.

### CTRL

A separate product with its own site and its own pricing. Not sold here. It shows up as a Teardown deliverable and as a link.

---

## PART 4: HOMEPAGE AND SITE NARRATIVE

- **Hero enemy statement:** "Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it." Do not rewrite this.
- **Primary CTA everywhere:** "Bring me one real decision", which opens the **Diagnosis Room (Mindy)** via the `openDiagnosisRoom` event.
- **Two doors (`TwoDoors`):** do it yourself with CTRL, or do it with Krish. CTRL carries no price here; it is a separate product on its own site.
- **Operator's Edge:** "Beyond pattern recognition". Positions Krish as someone running an actual agentic organisation. Links to `/operator`.
- **Live Intel (homepage teaser):** continuous price ticker, a rotating plain-English interpretation line, a compact Nervous Decision Machine input, and a muted link to `/signal`. Component: `OperatorsBrief.tsx`.
- **Live Intel (full dashboard at `/signal`):** extended ticker, interpretation grid, the classified archive (WATCH / SKIP / CALL / TAKE) with filters and search, blog column, full-size Nervous Decision Machine.
- **New Age Leadership** at `/new-age-leadership`: long-form thought leadership on agent-native org charts. Funnels to `/teardown` and `/operator`.
- **Proof:** the $254K POC with a major US publisher leads the results band on `/case-studies` and appears on `/handover` and `/start`. The client is never named.

### Navigation (current)

| Slot | Label | Behaviour |
|---|---|---|
| 1 | Work with me | Dropdown, largest first: The Handover, The Teardown, For funds and portfolio companies |
| 2 | **Mindmaker LIVE** | Direct link to `/signal` |
| 3 | Resources | Dropdown: How I operate, Case studies, New Age Leadership, Library, The Builder Economy (external) |
| 4 | About | Dropdown: Contact, Privacy, Terms |
| CTA | Bring me one real decision | Opens the Diagnosis Room via `openDiagnosisRoom` |

Footer carries the same three "Work with me" links.

`/alumni` is unlinked and noindex, reachable by direct URL only. Ten retired routes are 301s; their page components are in `src/_archive/`.

---

## PART 5: MASTER FAQ & OBJECTION HANDLING

### "Why shouldn't we just hire McKinsey / BCG / Deloitte / Accenture?"
They sell six-figure decks built by researchers over six months. I am an operator. I have run P&Ls, taken data revenue from $9M to $61M, scaled a business from $0 to $12M ARR, and I run a 14-agent AI operating system in production today. I do not hand you research. I hand you a decision you can defend, or a rebuilt commercial layer, with a date it ends. Ask a management consultancy for the Handover's scope and the bid comes back multiples higher with associates doing the work.

### "$9,500 for ten days of work I barely see?"
You are paying for the two hours of your time it costs, not the ten days of mine. The output is a decision in writing with its reasoning attached, and three claims under a watch so you know what would reopen it. Set that against the cost of the wrong vendor commitment, or another quarter of the same argument.

### "Why is the Handover only six weeks?"
Because I am not running discovery for six months. Six weeks is enough when there is no associate handover and no committee draft cycle. Longer engagements outlive the problem they were hired to solve, and they create the dependency this one is designed to avoid.

### "Why do you not attend in week five?"
Because everyone claims their work leaves you independent, and almost nobody tests it. Week five is where you find out whether the system runs without me, while there is still a week left to fix it if it does not. If it fails that week, that is the most valuable information in the engagement.

### "Can we skip the Teardown and go straight to the Handover?"
No. It is the gate for both of us. It is how you find out whether six weeks with me is worth it, and how I find out whether I can actually help. It has talked people out of the Handover as often as into it.

### "Can we do a fractional CAIO / CTO / CMO / CRO arrangement?"
No. Mindmaker does not do fractional roles. Every engagement has a fixed scope and a finish line. If ongoing capacity is what you need, hire a full-time executive or a different firm. I would rather send you elsewhere than take a mandate I cannot execute cleanly.

### "Can we just delegate this to our IT or RevOps team?"
You can delegate execution. You cannot delegate the decision. Agentic AI is not a SaaS tool; it changes the shape of workflows and organisation design. If you separate business acumen from the AI decision, the strategy fails. That is why this is sold to the person on the hook, not the person deploying the tool.

### "We're already on ChatGPT Enterprise / Copilot / Gemini. Isn't that enough?"
A model subscription is not a strategy. It is a software commitment that may or may not match your actual commercial problem. The Teardown tells you what you are actually committing to and why. The Handover rebuilds the commercial layer around the capability, whatever vendor you chose.

### "How do we pick vendors? The market moves too fast."
Vendor selection is downstream of a clearer question: what decision are you actually making? Once you know that, vendor evaluation takes a week rather than a quarter.

### "Is there a discount?"
No. There is no published credit, no percentage off and no urgency offer, and the agent on the site cannot give you one either. A published discount trains everyone to wait for it. If the price is the obstacle, the honest answers are the smaller engagement, the free Diagnosis Room, or nothing at all.

### "Why are the GBP and AUD prices not the dollar price converted?"
Because they are set prices for those markets, chosen as numbers a buyer there would find normal. Converting would make the published price a function of the morning's exchange rate, and would change a number you might already be holding a proposal for. There is no FX logic anywhere in this site by design.

### "Can Mindmaker build / deploy / integrate for us?"
No. Explicitly out of scope. This is the commercial and decision layer. Deployment, production IT, managed services and integration are not offered, and the right partner gets named at handover if that is what is needed next.

### "What's the most sensitive question you get in closed rooms?"
"Who do I replace versus who do I empower when agents get this good?" It is an organisational design question with career consequences. Navigating it needs someone who has run teams through change, not a researcher.

### "What is the Builder Economy?"
A podcast and creator project at `thebuildereconomy.com`. It is not a Mindmaker product.

### "What is Mindmaker LIVE?"
The publication, at `live.themindmaker.ai`. Two formats: **Built**, on why someone built the thing they built, and **Paid**, on who is actually getting paid in a shift and by what mechanism. It has free and paid tiers, so never describe it as free.

### "Do you ever recommend specific tools?"
Trade-off analysis, not recommendations. The buyer decides. No vendor referral fees, ever.

### "How does the Diagnosis Room (Mindy) work?"
Every "Bring me one real decision" opens a full-screen on-site experience where Mindy works through the visitor's one nervous AI decision, recommends the right rung (and will honestly recommend the cheaper one or none at all), and forks to three honest exits: keep chatting, book a free 15-minute call, or generate a co-branded proposal. Prices are published, so she quotes them exactly, in the currency asked for. The Handover always routes to the call.

### "What happened to the workshops, the cohort and the enterprise sprints?"
Retired in July and August 2026. The practice is now two engagements and a cap. Old links redirect.

---

## PART 6: WHAT MINDMAKER DOES NOT SELL (say it clearly)

- No training, courses or certifications
- No fractional executive roles (fractional CAIO, CTO, CMO, CRO)
- No published discounts
- No ongoing retainers or month-to-month work
- No production IT, deployment, integration, or managed services
- No hourly billing
- No tool recommendations without trade-off analysis
- No 40-slide strategy decks
- No ghostwritten board decks
- No vendor referral fees

---

**End of Master Messaging & FAQ**
