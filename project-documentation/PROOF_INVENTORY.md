<!-- Generated 2026-08-05. Updated 2026-08-11. A working document for the proof rebuild, not a canonical reference. -->

> **Status, 2026-08-11, superseded.** Three findings were acted on at that checkpoint. The private money disclosure referenced in the original record has now been removed and is not approved for public use. Current proof authority is `BRANDS_AND_TESTIMONIALS.md` and `MINDMAKE_CANON.md`.
# Proof Inventory

Everything Mindmaker currently holds as client proof, in one place, so it can be re-collated.

**Sources merged here**
1. `src/data/caseStudies.ts`. What renders on `/case-studies` and the homepage carousel. 11 case studies (5 rich, 6 quote-only), 10 senior-peer endorsements, 1 aggregate results band.
2. `project-documentation/mindy/proof-bank.md`. What Mindy draws on when generating proposals. 9 real engagements (R-01 to R-09) and 26 illustrative ones (B-01 to B-26).

**Not merged, because it could not be reached**
- The `testimonials` Supabase table on project `bkyuxvschuwngtcdhsyg`. It holds structured submissions including a `permission` field, and it is the only place consent is recorded. Check it before publishing anything named.
- The "named originals" referenced in the header of `caseStudies.ts`. They are kept offline and are not in this repository.

---

## Read this first

Three things that change how the rebuild should go.

### 1. Five real engagements have never appeared on the site

The proof bank holds nine real engagements with verified numbers. Only four of them have a public counterpart. These five are on record and invisible:

| ID | What it was | The number |
|---|---|---|
| R-01 | Repositioned a first-party identity business for an AI-mediated web | **Retired private money disclosure removed** |
| R-06 | Turned a TMT advisory's expertise into products clients could buy | Fund One launched with a defined thesis |
| R-07 | Built a 14-agent autonomous operating system | 37+ workflows, one operator, multiple ventures |
| R-08 | Settled build-versus-buy for a major media publisher | ~1 year of engineering not spent wrong |
| R-09 | Commercialised an adtech data-plus-AI product | First two pilots signed inside a 30-day window |

R-01 is the largest contracted number Mindmaker holds and it is nowhere on the website.

### 2. The bank is 74% fiction, and it is not labelled that way outside its own file

Of the 35 proof-bank entries, **9 are real (R-\*) and 26 are illustrative (B-\*)**. The distinction lives only in a note partway down `proof-bank.md`. When re-collating, do not let a B-entry cross into the case studies file. Part 3 below lists them separately for exactly this reason.

### 3. Nothing currently published records consent

Every entry on the site is anonymised to role plus sector. The file header says named originals exist offline and should only be flipped to named "with that client's sign-off." No sign-off is recorded anywhere in the repo. The `testimonials` table has a `permission` field (`free` / `edits` / `private`) built for this, and nothing on the site reads from it.

So "who can I name" is currently answerable only from memory or inbox. That is the gap worth closing during this rebuild.

---

# Part 1: Live on the site now

## 1a. Rich case studies (5)

These render as full Situation → The Call → The Work cards.

---

### CS-1 · `us-publisher-roadmap`
**Overlaps proof bank R-02.**

- **Tagged:** Teardown · Decide
- **Attribution:** Head of Operations · Top-10 US digital publisher
- **Sector label:** Digital publishing
- **Headline:** 14 AI vendors, one board mandate, three decisions

**Metrics**
| Value | Label |
|---|---|
| 40% | faster production ops |
| 75% | less campaign setup time |
| 22% | revenue lift on affected inventory |

**Situation.** An SVP-level operator with a board mandate to deliver an AI roadmap by quarter-end. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.

**The Call.** Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not the vendor decks. Kill, build, or pause every option on the table with a written rationale.

**The Work.** A three-decision board memo: one vendor killed, one workflow built internally, one paused with a re-evaluation date. The AI editorial-ops pipeline shipped by their own team in 45 days, with zero new headcount.

**Quote.** "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing."
*Head of Operations, top-10 US digital publisher*

---

### CS-2 · `broadcast-operating-agreement`
**Overlaps proof bank R-03.**

- **Tagged:** Teardown · Reposition
- **Attribution:** President · Legacy broadcast business
- **Sector label:** Broadcast media
- **Headline:** From 14 tools and a threatened budget to a one-page operating agreement

**Metrics**
| Value | Label |
|---|---|
| 11 killed | of 14 AI tools |
| 90 days | to first production workflow |
| Budget | defended at next review |

**Situation.** A Head of Strategy asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different tool, and the CFO threatening to pull the budget.

**The Call.** Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line, put AI decisions on the executive agenda, and stand up a product-strategy incubator inside the business.

**The Work.** A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.

**Quote.** "It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program."
*President, legacy broadcast business*

---

### CS-3 · `coaching-practice-rebuild`
**Overlaps proof bank R-04.**

- **Tagged:** Handover · Rebuild
- **Attribution:** Founder & CEO · Executive coaching practice
- **Sector label:** Coaching & advisory
- **Headline:** A full commercial stack rebuilt in eight weeks

**Metrics**
| Value | Label |
|---|---|
| 8 weeks | to rebuild the stack |
| 5 videos | shipped in week one |
| $2K–$8K | productized offer ladder |

**Situation.** A senior operator running a coaching and corporate-consulting practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.

**The Call.** AI is the forcing function. Rebuild the entire commercial stack in eight weeks (brand, site, productized offers, lead capture, content engine and outbound) on a reusable writing OS so context never has to be re-explained.

**The Work.** A new brand and production-ready site concepts shipped one prompt each. A productized coaching ladder ($2K–$8K) and a corporate workshop, lead capture, an L&D outbound system, and reusable projects for voice, video scripts and outreach.

**Quote.** "The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need."
*Founder & CEO, executive coaching practice*

---

### CS-4 · `content-engine-founder-owned`
**Overlaps proof bank R-05.**

- **Tagged:** Handover · Rebuild
- **Attribution:** Founder · Research & content brand
- **Sector label:** Research & content
- **Headline:** A founder-owned content engine for about $20 a month

**Metrics**
| Value | Label |
|---|---|
| ~$20/mo | total AI stack cost |
| <1 hr | per research-backed post (was days) |
| Owned | end-to-end by the founder |

**Situation.** A founder pivoting to a research-led content brand. Privacy-conscious, energy-managed, and no appetite for autonomy until the human-in-the-loop system was proven. They needed a content engine that compounds without burning them out.

**The Call.** Build a low-cost, voice-first content engine the founder owns. Manual first, automated only after the system worked end-to-end, phased so the founder kept enjoying it.

**The Work.** A three-phase roadmap: a voice-to-research engine producing research-backed posts in under 45 minutes, then seeding and outreach, then a publishing pipeline, evidence library and SEO flywheel.

**Quote.** "Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days. It's helping me be seen by my customers."
*Founder, research & content brand*

---

### CS-5 · `series-b-build-vs-buy`
**No proof-bank counterpart. Site-only.**

- **Tagged:** Teardown · Decide
- **Attribution:** Founder · Series B adtech
- **Sector label:** Build vs buy
- **Headline:** Proof the build was the wrong decision

**Metrics**
| Value | Label |
|---|---|
| 5 months | of engineering saved |
| v1 | with 3 paying design partners |

**Situation.** Six months into a custom AI build, with investors asking hard questions. They wanted to build an assistant that knew their business.

**The Call.** Pressure-test the build before another quarter of engineering. Decide build versus buy on the evidence, not the ambition.

**The Work.** Proof the build was the wrong decision, a scope change, and a repositioning around a smaller use case customers were already paying for. v1 shipped with three paying design partners in 60 days.

**No quote on this one.**

---

## 1b. Quote-only cards (6)

Short cards. Each carries a single headline metric. **None has a proof-bank counterpart.**

---

### CS-6 · `q-board-questions`
- **Tagged:** Teardown · Board confidence
- **Attribution:** GTM Leader · Series C SaaS
- **Headline:** I stopped dreading board AI questions.
- **Metric:** 0, board AI questions I now dread

> "Before the session I was fielding questions about our AI strategy and honestly making it up as I went. Krish helped me get clear on the three decisions that actually mattered. Now when the board asks, I have real answers."
> *GTM Leader, Series C SaaS*

---

### CS-7 · `q-14-to-3`
- **Tagged:** Teardown · Tool sprawl
- **Attribution:** VP of Operations
- **Headline:** We went from 14 tools to 3 systems that actually work.
- **Metric:** 14 → 3, AI tools that actually work

> "Everyone on the team was experimenting with AI: ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The cohort forced us to decide what's actually strategic and what's just noise."
> *VP of Operations*

---

### CS-8 · `q-build-vs-buy`
- **Tagged:** Teardown · Build vs buy
- **Attribution:** Founder · Early-stage FinTech
- **Headline:** I finally knew what to build versus buy.
- **Metric:** 6mo, of going in circles, resolved

> "I'd been going in circles for six months. Do we build our own AI underwriting model or use a vendor API? Krish didn't hand me a recommendation. He gave me the framework to decide for myself."
> *Founder, early-stage FinTech*

---

### CS-9 · `q-board-confidence`
- **Tagged:** Teardown · Board confidence
- **Attribution:** CEO · Mid-market services
- **Headline:** For the first time I wasn't guessing in a board conversation on AI.
- **Metric:** ✓, board confidence, first time

> "I went into a board conversation on AI the week after our session and for the first time I wasn't guessing. I had the questions, I knew what to push on, and I didn't get cornered."
> *CEO, mid-market services*

---

### CS-10 · `q-vendor-kill`
- **Tagged:** Teardown · Vendor decisions
- **Attribution:** COO · B2B technology
- **Headline:** We killed a vendor proposal in ten minutes.
- **Metric:** 10 min, to kill a bad vendor proposal

> "I expected another AI discussion. It wasn't. We killed a vendor proposal in about ten minutes because the assumptions didn't hold up. I forwarded the notes straight to my team and we moved on."
> *COO, B2B technology*

---

### CS-11 · `q-two-workflows`
- **Tagged:** Teardown · Execution
- **Attribution:** Head of Ops · Scale-up
- **Headline:** I built two workflows that I now use every day.
- **Metric:** 2, workflows I now use every single day

> "I actually built two workflows in the session that I now use every day. Not experiments, real systems that made my week calmer almost immediately."
> *Head of Ops, scale-up*

---

## 1c. Senior-peer endorsements (10)

Career references rather than client outcomes. They speak to translating complexity, leadership and teaching. Currently anonymised to role plus sector.

| # | Quote | Attribution |
|---|---|---|
| E-1 | "An outstanding leader with a clear vision and a knack for driving innovation, a true professional at the forefront of the digital tech industry." | Talent Director, global ad-tech |
| E-2 | "A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together." | Chief Executive, national audio industry body |
| E-3 | "He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him." | Partnerships Director APAC, content-recommendation platform |
| E-4 | "Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%." | Regional MD, video-advertising technology |
| E-5 | "A leading thinker in programmatic and data, who concisely articulates the problems and solutions that matter now and next." | Business Development Director, programmatic media |
| E-6 | "An industry expert across programmatic, performance and audience who turns knowledge into actionable plans and crafted solutions for clients." | Enterprise Account Executive, employee-experience SaaS |
| E-7 | "Articulate, engaging and entertaining. He breaks down the barriers advertisers face with data and tech and presents clear solutions." | Country Manager ANZ, marketing-technology platform |
| E-8 | "Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty." | Digital Commerce Director, retail-media agency |
| E-9 | "A unique ability to make programmatic and data accessible to everyone in the room, not just the 'digital' people." | National Sales Director, digital marketplace |
| E-10 | "Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward." | Managing Partner, data & digital consultancy |

## 1d. Aggregate results band

Four numbers shown as a strip. All four are drawn from CS-1 through CS-4.

| Value | Label |
|---|---|
| 22% | revenue lift on affected inventory |
| 40% | faster production ops, no new headcount |
| 90 days | to a defensible production workflow |
| ~$20/mo | founder-owned content engine |

---

# Part 2: Real engagements in the proof bank

Nine entries, verified numbers, currently used only by Mindy's proposal generator. Four overlap the site and carry **more detail here than the public version**. Five have never been published.

---

### R-01 · Identity and data infrastructure
**🔴 Never published. Largest contracted number Mindmaker holds.**

- **Mode:** reposition · **ICP:** enterprise · **Industry:** data infrastructure / first-party identity

**Situation.** A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but in a collapsing category. Buyers in the US and EMEA had stopped paying for cookie-replacement tools and started asking what comes next for the open web.

**The Call.** Reposition the entire commercial surface. Move the lens from third-party-cookie defence to first-party publisher infrastructure for an AI-mediated internet. Rewrite the pitch, the personas, the partner story, and the price point.

**The Work.** New ICP, messaging, and sales-enablement workflows. Taught the team to vibe-code and built a central AI brain that feeds every seller so they build their own enablement tools instead of needing an enablement team to exist. 43 outbound campaigns across US, EMEA, and APAC with four distinct personas. Partnership architecture with a major creative-and-media services group. A POC scope built for a major US publisher around Safari addressability and conversion-API measurement. A new thought-leadership cadence on agentic browsing and open-web monetisation. The work of at least 10 people, done by one operator plus one supporting resource.

**Outcome.** Retired private money disclosure removed. This record is not approved for public use.

> "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver."
> *CRO, data-infrastructure company*

---

### R-02 · Media / digital publishing
**Published as CS-1. This version has detail the site drops.**

- **Mode:** reposition · **ICP:** enterprise

**Situation.** A top-10 US digital publisher. An SVP-level operator with a board mandate to deliver an AI roadmap by end of quarter. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.

**The Call.** Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not from the vendor decks. Kill, build, or pause every option on the table with a written rationale.

**The Work.** A three-decision board memo. One vendor killed, one workflow built internally, one vendor paused with a re-evaluation date. An AI editorial-ops pipeline shipped by their own team in 45 days, zero new headcount. **Two of the paused vendors agreed to build bespoke automations so the planned headcount reduction landed with minimal disruption to customers.** ← not on the site

**Outcome.** 40% production-time reduction on syndicated content. 75% reduction in campaign setup time downstream. 22% revenue lift across the affected ad inventory. Built by the in-house team, not a vendor.

> "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it."
> *Head of Operations, digital publisher*

---

### R-03 · Media / legacy broadcast
**Published as CS-2. This version has detail the site drops.**

- **Mode:** reposition · **ICP:** enterprise

**Situation.** A legacy broadcast business. The Head of Strategy was asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different AI tool. The CFO threatening to pull the budget. **Product teams building what they thought should be built, not what the leaders asked for or what would sell.** ← not on the site

**The Call.** Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line. Put AI decisions on the executive agenda so they stop landing on her desk. **Build a product-strategy incubator inside the business that arms staff equally with AI, to observe who resists, who embraces, and whose dormant skills come alive ahead of a future restructure.** ← softened on the site

**The Work.** A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.

**Outcome.** Budget defended at the next review. First production AI workflow live in 90 days. **The role pivoted from fractional fire-fighter to ongoing advisory.**

> "He took the problems that matched our business goals and our leadership needs and brought them together into a very thoughtful programme."
> *President, broadcast business*

---

### R-04 · Coaching / corporate training
**Published as CS-3. This version has detail the site drops.**

- **Mode:** rebuild · **ICP:** sme

**Situation.** A senior operator running a coaching and corporate-training practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.

**The Call.** AI is the forcing function. Rebuild the entire commercial stack in eight weeks: brand, site, productized offers, lead capture, content engine, outbound. Use Claude Projects as the writing OS so context never has to be re-explained.

**The Work.** A new brand. Three production-ready site concepts shipped in one prompt each. A productized coaching ladder ($2K to $8K) **and a corporate workshop ($3K)**. ManyChat lead capture. An L&D outbound system. Reusable Claude Projects for voice, video scripts, and corporate outreach. **The 80-percent rule installed as the publishing standard.**

**Outcome.** Five videos shipped in week one. The corporate workshop offer live and priced. New site in final review. First L&D outbound batch sent. The founder back to enjoying the craft instead of running it by hand.

> "He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need."
> *CEO, coaching practice*

---

### R-05 · Content / wellbeing
**Published as CS-4. This version names the vertical (breathwork).**

- **Mode:** rebuild · **ICP:** founder

**Situation.** A breathwork content founder, pivoting to a research-led content brand on breathwork and performance. Privacy-conscious, energy-managed, with no appetite for autonomy until a human-in-the-loop system was proven. Needed a content engine that compounds without burning out the founder.

**The Call.** Build a low-cost, voice-first content engine the founder owns. Claude Projects for voice, Gemini for formatting, Google Scholar and ResearchGate for the studies. Manual first, automated only once the system worked end-to-end. Phase the build so the founder kept enjoying it.

**The Work.** A three-phase roadmap. Phase one: a voice-to-research content engine producing research-backed posts in under 45 minutes. Phase two: Reddit seeding, corporate L&D outreach, journalist sourcing. Phase three: a publishing pipeline, an evidence library, and an SEO flywheel.

**Outcome.** Total AI stack cost ~$20 per month, **replacing what would otherwise be a five-figure agency retainer**. Time per research-backed post compressed from days to under an hour. The founder owns the system end-to-end and can evolve it without the operator. Posting cadence went from roughly once a month to most days.

> "I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me."
> *Founder, breathwork content brand*

---

### R-06 · Advisory / TMT
**🔴 Never published.**

- **Mode:** reposition · **ICP:** sme

**Situation.** A global TMT advisory operating across APAC, EMEA, and the Americas. Deep boardroom relationships and a sharp newsletter brand, but a commercial surface that was speaking, not selling. No productized AI offer for clients. No formal investment thesis to deploy alongside its portfolio.

**The Call.** Turn the firm's expertise into AI products clients can buy. Codify strategic product development as the core advisory wedge. In parallel, write the ventures thesis: who the firm backs, why, and at what stage. Two stacked offers, one operating model.

**The Work.** AI-powered customer-experience work packaged as a sellable engagement, not a keynote. A productized advisory ladder under the firm's advisory brand. A ventures thesis written and stood up under a new ventures arm, focused on CTO-led founders. The newsletter and creative arm rewired as distribution for both.

**Outcome.** Advisory repositioned from thought leadership to productized strategic product development, with AI podcasts as the first product launched. Fund One launched with a defined CTO-led thesis, now focused on application-layer AI ventures built around compounding data assets.

> "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable."
> *Partner, Venture Capital Firm*

---

### R-07 · AI / business operations
**🔴 Never published as a case study. This is Krish's own OS, see `/operator`.**

- **Mode:** os · **ICP:** founder

**Situation.** An operator running multiple ventures who needed the company to run without sitting at the centre of every task. The bottleneck was judgement applied to repeatable work, not the work itself.

**The Call.** Don't build a copilot. Build a self-healing, multi-agent operating system that runs the company while the operator makes Go / No-Go calls. Internal actions run autonomously; anything that leaves the building waits for a human.

**The Work.** A layered cognitive stack with strict boundaries between data, logic, and reasoning. Supabase as the source of truth for agent identities, task queues, and execution state. 37+ deterministic workflows as the rails, with a non-deterministic swarm for outbound, editorial, competitive sweeps, and guest scouting. Persistent Markdown and JSON memory across all agents so context never has to be re-explained. A failure-to-system engine that writes a permanent rule and drafts the fix the second time anything breaks.

**Outcome.** A 14-agent autonomous operating system, built up from two agents. Morning briefs land before the operator does. The OS presents the data, recommends the play, and executes on approval. A senior strategic partner, a technical ops team, and an outbound sales force in one stack, run by one person across multiple ventures.

> "I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product."
> *Operator-advisor, AI business*

---

### R-08 · Media / advertising
**🔴 Never published. The cleanest one-day-decision proof in the bank.**

- **Mode:** signal-session · **ICP:** enterprise

**Situation.** A major media publisher with a commercial team that wanted to build an in-house AI ad product and an engineering team that wanted to partner. The CRO had been refereeing for two quarters, and the cost of indecision was a missed selling season.

**The Call.** Settle build versus buy in a day. Run structured pressure-testing in one room until the logic resolves, rather than handing down a verdict.

**The Work.** One day of structured pressure-testing with the room working the logic together. The answer landed clearly: partner now, revisit build in twelve months once the data position was stronger.

**Outcome.** A clear go decision in a single day. Roughly a year of engineering time not spent on the wrong thing. Partner agreement signed the following month.

> "One day. One decision. No more Monday debates. That's the entire review."
> *CRO, media company*

---

### R-09 · Adtech / data
**🔴 Never published.**

- **Mode:** revenue-architecture · **ICP:** enterprise

**Situation.** An adtech firm with a strong first-party data asset and an AI layer on top, and no clear way to sell either. Positioning was technical, pricing was a guess, and the pipeline was empty.

**The Call.** Commercialise the data-plus-AI product, not talk about it. Produce positioning a buyer can repeat, a defensible price, and a sales playbook inside the sprint window.

**The Work.** A 30-day sprint that rebuilt positioning around a single repeatable line, set a defensible price against the value at stake, and produced a sales playbook the team could run without the founder in the room. First pilots sourced before the engagement closed.

**Outcome.** Clear positioning and pricing. First two pilots signed inside the window. A playbook the sales team runs without the founder present.

> "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me."
> *Founder, adtech firm*

---

# Part 3: Illustrative bank (NOT real)

**26 entries, B-01 to B-26.** These are composed examples written so Mindy's proposal generator always has three entries to select from, whatever offer a visitor is routed toward. They are **not** client work and must never cross into the case studies file or any public page.

They are deliberately **not reproduced here**, so that copying out of this document cannot accidentally publish fiction as proof. If you want to review or retire them, they are in `project-documentation/mindy/proof-bank.md` from line 154.

Distribution by offer:

The 26 illustrative `B-` entries were deleted from both the proof index and the proof bank in August 2026. Only the nine verified `R-` engagements remain. See the header of `supabase/functions/_shared/mindy/proof-index.ts`.


**Worth deciding during the rebuild:** with nine real engagements documented, whether the illustrative bank still earns its place. Its only job is to guarantee the generator has three matches per mode. Nine real entries plus a widened match rule may cover that, and every illustrative entry retired is one less way for fiction to leak into a proposal.

---

# Part 4: What to decide

Ordered by how much they cost if decided late.

**1. The tagging dimension. DONE 2026-08-11.** Case studies are retagged to `engagement: Teardown | Handover`, with each record noting inline what it was retagged from. The unused `theme: Reposition | Rebuild | Decide` field remains, and is the better long-term dimension for the reason this note originally gave: themes describe what the work did and survive a reprice, offer names do not. The proof bank went further and now tags work *shapes* (decide, reposition, rebuild, os) rather than SKUs, with the rungs mapped on top.

**2. Named or anonymous, per entry.** Nothing on the site is named and no consent is recorded in the repo. Check the `testimonials` table's `permission` column first, then route new requests through the existing `submit-testimonial` form rather than email so consent is captured structurally.

**3. Historical recommendation, superseded.** The earlier recommendation to publish R-01 is withdrawn. Its private money disclosure has been removed.

**4. Reconcile the four overlaps.** R-02 through R-05 exist in two places that have already drifted. Pick one as canonical or they will drift again.

**5. Retire or keep the illustrative bank.** See Part 3.

**6. Historical recommendation, superseded.** Do not lead the results band with the retired private money disclosure.
