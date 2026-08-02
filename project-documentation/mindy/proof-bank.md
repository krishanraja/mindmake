<!-- Last Updated: 2026-08-02 -->
# Proof Bank

Anonymized, keyed proof for the Mindy proposal generator. Every entry is a real or illustrative engagement reduced to sector and role only. The numbers are kept; the names are gone.

## How the generator selects

The proposal generator pulls **three** entries and never writes its own. It keys on, in priority order:

1. **`mode`** — the engagement shape, mapped to the live offer the visitor is being routed toward.
2. **`icp`** — who the buyer is. One of: `leader` (an individual executive), `enterprise` (a company team or function), `capital` (a fund, family office, or operating partner), `sme` (a small or founder-led company buying bespoke enablement), `founder` (a solo operator or very small team).
3. **`industry`** — the nearest sector. Exa finds structurally similar companies; the generator matches on this tag last, as a tie-breaker, not a gate.

Selection rule of thumb: match `mode` first (hard), `icp` second (strong), `industry` third (soft, nearest-neighbour). If fewer than three entries share a `mode`, widen to an adjacent mode in the same family (`reposition`/`os`, `signal-session`/`immersion`, `revenue-architecture`/`bespoke-enablement`, `cohort`/`workshop`).

### Field schema

Each entry carries: `id`, `mode`, `icp`, `industry`, `situation`, `the-call`, `the-work`, `outcome` (numbers kept), and a one-line `pull-quote` attributed to role only.

### `mode` values

| mode | engagement shape | nearest live offer |
|---|---|---|
| `reposition` | sharpen the commercial story, ICP, pricing, buyer | bespoke / Revenue Architecture |
| `rebuild` | replace cost and rebuild the operating model for a founder-led business | bespoke enablement |
| `os` | stand up an autonomous multi-agent operating system | Revenue Architecture |
| `cohort` | the AI-Fluent Executive, individual leader literacy and judgement | Cohort ($2,000–$3,000) |
| `workshop` | one skill, one low-risk session | Workshops ($500–$1,000) |
| `signal-session` | one commercial question resolved fast | Signal Session ($10,000–$20,000) |
| `revenue-architecture` | commercialise an AI product or rebuild a GTM motion | Revenue Architecture ($50,000–$100,000+) |
| `immersion` | a shared team starting point in a half-day | AI Immersion ($10,000–$15,000) |
| `bespoke-enablement` | scoped live for an SME or founder-led team | Bespoke enablement ($8,000–$25,000, pilots from $2,000) |
| `ctrl` | the product: portable context, briefing, thinking | CTRL (free, upgrades from $29) |
| `alumni` | continuity for a cohort graduate | Alumni Pass (~$1,500/year) |

### Anonymization note

These are reduced to sector and role. The real-engagement entries (R-01 to R-09) carry verified numbers from work on record. The bank entries (B-01 to B-26) are illustrative, drawn from the per-offer case bank. Mindy may quote the numbers; Mindy never re-attaches a name. No entry is ever presented as a named client.

---

## Real engagements (anonymized, verified numbers)

### R-01

- **id:** R-01
- **mode:** reposition
- **icp:** enterprise
- **industry:** data infrastructure / first-party identity
- **situation:** A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but in a collapsing category. Buyers in the US and EMEA had stopped paying for cookie-replacement tools and started asking what comes next for the open web.
- **the-call:** Reposition the entire commercial surface. Move the lens from third-party-cookie defence to first-party publisher infrastructure for an AI-mediated internet. Rewrite the pitch, the personas, the partner story, and the price point.
- **the-work:** New ICP, messaging, and sales-enablement workflows. Taught the team to vibe-code and built a central AI brain that feeds every seller so they build their own enablement tools instead of needing an enablement team to exist. 43 outbound campaigns across US, EMEA, and APAC with four distinct personas. Partnership architecture with a major creative-and-media services group. A POC scope built for a major US media publisher around Safari addressability and conversion-API measurement. A new thought-leadership cadence on agentic browsing and open-web monetisation. The work of at least 10 people, done by one operator plus one supporting resource.
- **outcome:** $254K POC contracted with a major US media publisher. Pipeline rebuilt with three further major publishers and a large classifieds marketplace. Category narrative shifted from defence to offence.
- **pull-quote:** "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver." — CRO, data-infrastructure company

### R-02

- **id:** R-02
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / digital publishing
- **situation:** A top-10 US digital publisher. An SVP-level operator with a board mandate to deliver an AI roadmap by end of quarter. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.
- **the-call:** Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not from the vendor decks. Kill, build, or pause every option on the table with a written rationale.
- **the-work:** A three-decision board memo. One vendor killed, one workflow built internally, one vendor paused with a re-evaluation date. An AI editorial-ops pipeline shipped by their own team in 45 days, zero new headcount. Two of the paused vendors agreed to build bespoke automations so the planned headcount reduction landed with minimal disruption to customers.
- **outcome:** 40% production-time reduction on syndicated content. 75% reduction in campaign setup time downstream. 22% revenue lift across the affected ad inventory. Built by the in-house team, not a vendor.
- **pull-quote:** "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it." — Head of Operations, digital publisher

### R-03

- **id:** R-03
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / legacy broadcast
- **situation:** A legacy broadcast business. The Head of Strategy was asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different AI tool. The CFO threatening to pull the budget. Product teams building what they thought should be built, not what the leaders asked for or what would sell.
- **the-call:** Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line. Put AI decisions on the executive agenda so they stop landing on her desk. Build a product-strategy incubator inside the business that arms staff equally with AI, to observe who resists, who embraces, and whose dormant skills come alive ahead of a future restructure.
- **the-work:** A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.
- **outcome:** Budget defended at the next review. First production AI workflow live in 90 days. The role pivoted from fractional fire-fighter to ongoing advisory.
- **pull-quote:** "He took the problems that matched our business goals and our leadership needs and brought them together into a very thoughtful programme." — President, broadcast business

### R-04

- **id:** R-04
- **mode:** rebuild
- **icp:** sme
- **industry:** coaching / corporate training
- **situation:** A senior operator running a coaching and corporate-training practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.
- **the-call:** AI is the forcing function. Rebuild the entire commercial stack in eight weeks: brand, site, productized offers, lead capture, content engine, outbound. Use Claude Projects as the writing OS so context never has to be re-explained.
- **the-work:** A new brand. Three production-ready site concepts shipped in one prompt each. A productized coaching ladder ($2K to $8K) and a corporate workshop ($3K). ManyChat lead capture. An L&D outbound system. Reusable Claude Projects for voice, video scripts, and corporate outreach. The 80-percent rule installed as the publishing standard.
- **outcome:** Five videos shipped in week one. The corporate workshop offer live and priced. New site in final review. First L&D outbound batch sent. The founder back to enjoying the craft instead of running it by hand.
- **pull-quote:** "He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need." — CEO, coaching practice

### R-05

- **id:** R-05
- **mode:** rebuild
- **icp:** founder
- **industry:** content / wellbeing
- **situation:** A breathwork content founder, pivoting to a research-led content brand on breathwork and performance. Privacy-conscious, energy-managed, with no appetite for autonomy until a human-in-the-loop system was proven. Needed a content engine that compounds without burning out the founder.
- **the-call:** Build a low-cost, voice-first content engine the founder owns. Claude Projects for voice, Gemini for formatting, Google Scholar and ResearchGate for the studies. Manual first, automated only once the system worked end-to-end. Phase the build so the founder kept enjoying it.
- **the-work:** A three-phase roadmap. Phase one: a voice-to-research content engine producing research-backed posts in under 45 minutes. Phase two: Reddit seeding, corporate L&D outreach, journalist sourcing. Phase three: a publishing pipeline, an evidence library, and an SEO flywheel.
- **outcome:** Total AI stack cost ~$20 per month, replacing what would otherwise be a five-figure agency retainer. Time per research-backed post compressed from days to under an hour. The founder owns the system end-to-end and can evolve it without the operator. Posting cadence went from roughly once a month to most days.
- **pull-quote:** "I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me." — Founder, breathwork content brand

### R-06

- **id:** R-06
- **mode:** reposition
- **icp:** sme
- **industry:** advisory / TMT
- **situation:** A global TMT advisory operating across APAC, EMEA, and the Americas. Deep boardroom relationships and a sharp newsletter brand, but a commercial surface that was speaking, not selling. No productized AI offer for clients. No formal investment thesis to deploy alongside its portfolio.
- **the-call:** Turn the firm's expertise into AI products clients can buy. Codify strategic product development as the core advisory wedge. In parallel, write the ventures thesis: who the firm backs, why, and at what stage. Two stacked offers, one operating model.
- **the-work:** AI-powered customer-experience work packaged as a sellable engagement, not a keynote. A productized advisory ladder under the firm's advisory brand. A ventures thesis written and stood up under a new ventures arm, focused on CTO-led founders. The newsletter and creative arm rewired as distribution for both.
- **outcome:** Advisory repositioned from thought leadership to productized strategic product development, with AI podcasts as the first product launched. Fund One launched with a defined CTO-led thesis, now focused on application-layer AI ventures built around compounding data assets.
- **pull-quote:** "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable." — Managing Partner, TMT advisory

### R-07

- **id:** R-07
- **mode:** os
- **icp:** founder
- **industry:** AI / business operations
- **situation:** An operator running multiple ventures who needed the company to run without sitting at the centre of every task. The bottleneck was judgement applied to repeatable work, not the work itself.
- **the-call:** Don't build a copilot. Build a self-healing, multi-agent operating system that runs the company while the operator makes Go / No-Go calls. Internal actions run autonomously; anything that leaves the building waits for a human.
- **the-work:** A layered cognitive stack with strict boundaries between data, logic, and reasoning. Supabase as the source of truth for agent identities, task queues, and execution state. 37+ deterministic workflows as the rails, with a non-deterministic swarm for outbound, editorial, competitive sweeps, and guest scouting. Persistent Markdown and JSON memory across all agents so context never has to be re-explained. A failure-to-system engine that writes a permanent rule and drafts the fix the second time anything breaks.
- **outcome:** A 14-agent autonomous operating system, built up from two agents. Morning briefs land before the operator does. The OS presents the data, recommends the play, and executes on approval. A senior strategic partner, a technical ops team, and an outbound sales force in one stack, run by one person across multiple ventures.
- **pull-quote:** "I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product." — Operator-advisor, AI business

### R-08

- **id:** R-08
- **mode:** signal-session
- **icp:** enterprise
- **industry:** media / advertising
- **situation:** A major media publisher with a commercial team that wanted to build an in-house AI ad product and an engineering team that wanted to partner. The CRO had been refereeing for two quarters, and the cost of indecision was a missed selling season.
- **the-call:** Settle build versus buy in a day. Run structured pressure-testing in one room until the logic resolves, rather than handing down a verdict.
- **the-work:** One day of structured pressure-testing with the room working the logic together. The answer landed clearly: partner now, revisit build in twelve months once the data position was stronger.
- **outcome:** A clear go decision in a single day. Roughly a year of engineering time not spent on the wrong thing. Partner agreement signed the following month.
- **pull-quote:** "One day. One decision. No more Monday debates. That's the entire review." — CRO, media company

### R-09

- **id:** R-09
- **mode:** revenue-architecture
- **icp:** enterprise
- **industry:** adtech / data
- **situation:** An adtech firm with a strong first-party data asset and an AI layer on top, and no clear way to sell either. Positioning was technical, pricing was a guess, and the pipeline was empty.
- **the-call:** Commercialise the data-plus-AI product, not talk about it. Produce positioning a buyer can repeat, a defensible price, and a sales playbook inside the sprint window.
- **the-work:** A 30-day sprint that rebuilt positioning around a single repeatable line, set a defensible price against the value at stake, and produced a sales playbook the team could run without the founder in the room. First pilots sourced before the engagement closed.
- **outcome:** Clear positioning and pricing. First two pilots signed inside the window. A playbook the sales team runs without the founder present.
- **pull-quote:** "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me." — Founder, adtech firm

---

## Case bank (illustrative, per-offer)

### Cohort — the AI-Fluent Executive

### B-01

- **id:** B-01
- **mode:** cohort
- **icp:** leader
- **industry:** B2B software
- **situation:** A VP of Marketing at a mid-market B2B software company with three martech vendors pitching AI features and a board asking when the spend would land. She had watched the demos, run two pilots, and still could not tell which was real. The decision had been open for four months.
- **the-call:** Stop waiting to feel ready. Build a decision framework she trusts more than the vendor decks, then make the call.
- **the-work:** By week three she had a framework she trusted. She killed both pilots, redirected the budget to one tool plus an internal workflow she built herself, and presented the call to the board with reasoning instead of vibes.
- **outcome:** Decision made in week 3. Two pilots cancelled, roughly $180K a year recovered. First working automation shipped by her, not a vendor.
- **pull-quote:** "I stopped waiting to feel ready. The framework was the permission to decide." — VP Marketing, B2B software

### B-02

- **id:** B-02
- **mode:** cohort
- **icp:** leader
- **industry:** logistics
- **situation:** A Head of Operations at a regional logistics firm. His team had brought him eleven different AI tools to approve. He was the single point of judgement and he knew he was guessing. Every request stalled on his desk.
- **the-call:** Stop being the bottleneck. Build an evaluation standard the team can run before tools reach him.
- **the-work:** He left with an evaluation standard he could hand to the team so they pre-qualified tools before they reached him. He went from gatekeeper to setting the rules of the game.
- **outcome:** Tool sprawl cut from eleven to three. A written evaluation standard the team now runs without him. Approval cycle dropped from weeks to days.
- **pull-quote:** "I used to be the bottleneck and told myself that meant I mattered. Now the team moves without me and I sleep better." — Head of Operations, logistics firm

### B-03

- **id:** B-03
- **mode:** cohort
- **icp:** leader
- **industry:** healthtech
- **situation:** A Chief of Staff at a healthtech scaleup whose CEO wanted a clear read on the company's AI posture for a board meeting. She was expected to produce it and did not feel qualified to have an opinion.
- **the-call:** Build a board-ready readiness memo and the confidence to defend it in the room.
- **the-work:** She left with a readiness memo and the confidence to defend it. The CEO asked her to stand up an internal AI council off the back of it.
- **outcome:** Board memo delivered and approved. Now chairs the company's internal AI council. Pulled into AI strategy as part of the remit.
- **pull-quote:** "I walked in hoping not to embarrass myself in front of the board. I walked out running the council." — Chief of Staff, healthtech scaleup

### B-04

- **id:** B-04
- **mode:** cohort
- **icp:** leader
- **industry:** infrastructure software
- **situation:** A Director of Engineering at an infrastructure startup who could build anything but could not decide which AI bets were worth his team's quarter. He kept defaulting to whatever was loudest in his feed.
- **the-call:** The work is judgement under uncertainty, not the tech. Decide which bets are real and cut the rest.
- **the-work:** He cut two speculative projects and committed properly to one, with a clearer way to say no to his own team's pet ideas.
- **outcome:** Two speculative builds stopped. One real bet resourced properly. A clearer filter for his own team's ideas.
- **pull-quote:** "I assumed AI literacy was a beginner course for people who can't code. It was about judgement, which I was apparently short on." — Director of Engineering, infrastructure startup

### B-05

- **id:** B-05
- **mode:** cohort
- **icp:** leader
- **industry:** legal / professional services
- **situation:** A Head of People at a regional law firm who watched every other function start using AI and felt the gap widening. She did not want a strategy. She wanted to stop feeling left behind.
- **the-call:** Get a working grasp of where AI fits the people function and the confidence to lead the response rather than react to it.
- **the-work:** She got a working grasp of where AI fit her function and led the firm's people-side response. First AI-assisted hiring workflow went live.
- **outcome:** First AI-assisted hiring workflow live. Now leads the firm's people-side AI policy. Stopped dreading the topic in leadership meetings.
- **pull-quote:** "I'd been quietly terrified of being left behind. I'm not anymore, and that on its own was worth the fee." — Head of People, law firm

### B-06

- **id:** B-06
- **mode:** cohort
- **icp:** leader
- **industry:** enterprise software
- **situation:** An SVP of Sales at an enterprise software company who kept telling his reps to use AI to work smarter and had no idea how to do it himself. The credibility gap was starting to show.
- **the-call:** Build the exact workflows you want the team to adopt, so you can teach from having done it.
- **the-work:** He built the workflows he wanted his team to adopt and could demo them cold. The team took it more seriously once he could show, not tell.
- **outcome:** Three rep-facing workflows built and demoed. Adoption across the team after he could show, not tell. Pipeline review time cut noticeably.
- **pull-quote:** "I came to sharpen my team and ended up sharpening myself first. Nobody warns you that's the order it happens in." — SVP Sales, enterprise software

### Signal Session

### B-07

- **id:** B-07
- **mode:** signal-session
- **icp:** capital
- **industry:** private equity
- **situation:** An Operating Partner at a mid-market PE fund who suspected the portfolio was AI-exposed but had no structured way to rank where. Every portco CEO claimed to be on top of it and he had no way to verify.
- **the-call:** Produce a triage across the portfolio, scored on risk and opportunity, with a recommended action for each company.
- **the-work:** A triage across all fourteen companies, scored on risk and opportunity, with a recommended action for each.
- **outcome:** Fourteen portcos ranked and prioritised. Two flagged for deeper commercial work. A repeatable scoring method the fund now reuses each quarter.
- **pull-quote:** "I now have a defensible way to tell my LPs which companies are exposed. I did not have that the day before." — Operating Partner, PE fund

### B-08

- **id:** B-08
- **mode:** signal-session
- **icp:** capital
- **industry:** venture capital
- **situation:** A General Partner at an early-stage venture fund about to deploy against an AI thesis he half believed. He wanted someone to push back hard before the capital moved, not after.
- **the-call:** Stress-test the thesis until the weak parts fall off and a sharper version remains.
- **the-work:** The day stress-tested the thesis to the point where the weak parts fell off and a sharper version remained. He deployed against that one.
- **outcome:** A sharpened investment thesis. Two prospective deals reframed before term sheets. A clearer filter for the next twenty pitches.
- **pull-quote:** "I went in ready to call most of it hype. I left with a thesis I'd actually back." — General Partner, venture fund

### B-09

- **id:** B-09
- **mode:** signal-session
- **icp:** enterprise
- **industry:** insurance
- **situation:** A CTO at an enterprise insurer whose eighteen-month AI program had quietly stalled. Nobody wanted to be the one to call it. He needed to know whether to fund it harder or shut it down.
- **the-call:** Cut through the internal politics and produce a straight recommendation with the reasoning attached.
- **the-work:** The session cut through the politics and produced a straight recommendation with reasoning. He acted on it within the week.
- **outcome:** A stalled program given a clear decision. Budget redirected to two viable use cases. An internal stalemate broken in a day.
- **pull-quote:** "I needed someone to tell me whether to kill it or fund it. I got a straight answer. First one in eighteen months." — CTO, enterprise insurer

### B-10

- **id:** B-10
- **mode:** signal-session
- **icp:** capital
- **industry:** family office
- **situation:** A Principal at a single-family office considering a direct investment into an AI company, with no in-house way to judge whether the commercial story held up.
- **the-call:** Give them an operator's read on the business model, not a banker's, and surface the questions they should be asking the founders.
- **the-work:** An operator's read on the business model and a set of sharper questions for the founders.
- **outcome:** An investment decision made with eyes open. A diligence checklist the office now reuses. One follow-on conversation reframed entirely.
- **pull-quote:** "Measured, specific, and refreshingly free of jargon. I made the investment. I would not have without the day." — Principal, single-family office

### B-11

- **id:** B-11
- **mode:** signal-session
- **icp:** capital
- **industry:** fintech
- **situation:** A founder at a Series B fintech whose leadership team had four competing views on the AI roadmap and a habit of restarting the debate every Monday. Three side projects ran in parallel, none owned, none shipping.
- **the-call:** Force one prioritised roadmap and named owners against each item in a single session.
- **the-work:** The session forced one prioritised roadmap with named owners. The two weakest side projects were closed in the room.
- **outcome:** A single roadmap, owners assigned, two side projects killed. Exec alignment reached in a day after months of drift.
- **pull-quote:** "We'd been going in circles for two quarters. Took six hours in a room with someone who'd actually shipped this to stop us." — Founder, Series B fintech

### Revenue Architecture

### B-12

- **id:** B-12
- **mode:** revenue-architecture
- **icp:** enterprise
- **industry:** B2B SaaS
- **situation:** A Series C B2B SaaS company that had shipped an AI feature six months earlier. Usage was fine. Revenue attached to it was almost zero because it was buried in the base plan and the sales team did not know how to sell it.
- **the-call:** Rebuild the packaging into a usage-based tier, rewrite the sales narrative around one outcome, and give the team a working motion.
- **the-work:** The sprint rebuilt packaging into a usage-based tier, rewrote the sales narrative around a single outcome, and gave the team a working motion to sell against.
- **outcome:** Attach rate moved from low single digits to roughly a third of new deals over the quarter. Sales stopped treating it as a footnote. New pricing live inside 30 days.
- **pull-quote:** "Attach rate went from a rounding error to a third of new deals. My CFO stopped asking what the feature was for." — CFO-adjacent product owner, B2B SaaS

### B-13

- **id:** B-13
- **mode:** revenue-architecture
- **icp:** capital
- **industry:** industrial services
- **situation:** A PE-backed industrial services group. The fund wanted an AI-enabled service line stood up inside one portco, with a commercial engine that could be templated across others. The portco had the capability but no route to market.
- **the-call:** Define the offer, price it, build the outbound motion, and produce a playbook the fund can lift into the next company.
- **the-work:** The sprint defined the offer, priced it, built the outbound motion, and produced a reusable playbook.
- **outcome:** One new commercial service line with a defined engine. Early pipeline generated inside the sprint window. A reusable template for two more portcos.
- **pull-quote:** "We didn't get a strategy deck. We got a service line that books revenue. Big difference." — Operating Partner, PE-backed industrial group

### B-14

- **id:** B-14
- **mode:** revenue-architecture
- **icp:** enterprise
- **industry:** telco
- **situation:** An enterprise telco with an AI customer-service product the sales team kept improvising around. Every rep pitched it differently and win rates reflected the chaos.
- **the-call:** Build one narrative, one pricing structure, and one motion, then train the team against it.
- **the-work:** The sprint built one narrative, one pricing structure, and one motion, then trained the team. The improvising stopped.
- **outcome:** A single GTM motion adopted across the team. Win rate on the product up over the following quarter. Onboarding time for new reps cut.
- **pull-quote:** "Thirty days, and the team stopped winging it. That consistency is worth more than what we paid." — Sales leader, enterprise telco

### B-15

- **id:** B-15
- **mode:** revenue-architecture
- **icp:** enterprise
- **industry:** media
- **situation:** A regional media company that had built an AI content tool and spent a year arguing about whether to subscribe it or license it. The argument was the product strategy, which was the problem.
- **the-call:** Model both routes, pick one with the numbers attached, package it, and ship it inside the window.
- **the-work:** The sprint modelled both routes, picked one with the numbers attached, packaged it, and shipped it.
- **outcome:** A monetisation model chosen and live. First paying accounts inside two months. A year-long internal debate closed.
- **pull-quote:** "We'd been arguing subscription versus licensing for a year. Settled it, priced it, shipped it." — Product owner, regional media company

### B-16

- **id:** B-16
- **mode:** revenue-architecture
- **icp:** enterprise
- **industry:** logistics
- **situation:** A logistics platform with an internal AI tool that worked beautifully and no idea it was sellable until customers started asking for it. Building it and selling it were not the same skill.
- **the-call:** Productise it: positioning, pricing, packaging, and a route to market that does not depend on the engineers.
- **the-work:** The sprint productised it, with positioning, pricing, packaging, and a route to market independent of the engineering team.
- **outcome:** An internal tool packaged as a standalone product. First external deals signed. A new revenue line that did not exist before the sprint.
- **pull-quote:** "We built the tool. We had no clue how to sell it. Turns out those are completely different jobs." — Product leader, logistics platform

### AI Immersion

### B-17

- **id:** B-17
- **mode:** immersion
- **icp:** enterprise
- **industry:** retail
- **situation:** A 12-person product team at a multi-brand retailer with a roadmap full of AI ideas and no shared way to judge them. Every planning session turned into the same circular argument.
- **the-call:** Give them one language for evaluating use cases and force a shortlist with owners attached before they leave the room.
- **the-work:** The half-day gave them one evaluation language and forced a shortlist with owners attached.
- **outcome:** Three prioritised use cases, owners assigned, the rest parked with a reason. A shared vocabulary that survived the next planning cycle.
- **pull-quote:** "Half a day, and the circular roadmap argument finally ended. Three use cases, owners, done." — Product lead, multi-brand retailer

### B-18

- **id:** B-18
- **mode:** immersion
- **icp:** enterprise
- **industry:** professional services
- **situation:** The leadership team at a professional services firm. Each partner had a private view on AI and none had said it out loud. Clients were starting to ask what the firm's position was, and there was no answer.
- **the-call:** Surface the disagreements, resolve the ones worth resolving, and produce firm-wide principles plus a 90-day plan.
- **the-work:** The session surfaced the disagreements, resolved the ones worth resolving, and produced signed firm-wide principles and a 90-day plan.
- **outcome:** Written AI principles the partners actually signed. A 90-day plan with named leads. A consistent answer when clients ask.
- **pull-quote:** "Getting eight partners to agree on anything is a minor miracle. We left with signed principles." — Partner, professional services firm

### B-19

- **id:** B-19
- **mode:** immersion
- **icp:** enterprise
- **industry:** healthcare
- **situation:** The clinical leadership team at a hospital system. They needed agreement on where AI was acceptable in their workflows and where it was not. They wanted boundaries they could all defend, not a pitch.
- **the-call:** Produce shared use boundaries grounded in their own risk tolerance, with the easy wins separated from the no-go zones.
- **the-work:** The session produced shared use boundaries grounded in their own risk tolerance, with easy wins separated from no-go zones.
- **outcome:** Agreed use boundaries across the team. Three low-risk use cases approved to start. The contentious ones ruled out, on the record.
- **pull-quote:** "We needed boundaries we could all stand behind, not a sales pitch for AI. That's exactly what we got." — Clinical lead, hospital system

### B-20

- **id:** B-20
- **mode:** immersion
- **icp:** enterprise
- **industry:** marketing / advertising
- **situation:** The creative and strategy team at a marketing agency, using AI in roughly a dozen uncoordinated ways and trusting almost none of the output. Quality swung wildly between people.
- **the-call:** Produce one shared playbook for how AI gets used on client work.
- **the-work:** The half-day produced one shared usage playbook, which steadied the output and lowered the background anxiety.
- **outcome:** One shared usage playbook. Output quality steadied across the team. A clear line on what never goes near a client deliverable.
- **pull-quote:** "The team was using AI twelve different ways and trusting none of it. Now there's one playbook and a lot less stress." — Team lead, marketing agency

### Workshops

### B-21

- **id:** B-21
- **mode:** workshop
- **icp:** founder
- **industry:** consumer software
- **situation:** A solo founder at an early-stage consumer app who wanted the cohort but found the fee a stretch before he had proof the approach worked for him. A single workshop was a risk he could take.
- **the-call:** Take the low-risk first taste. Ship one working tool in the session and decide from there.
- **the-work:** He shipped his first working automation during the session and used the method on two more the same week. Two months later he enrolled on the cohort and the credit came off the price.
- **outcome:** First automation shipped same day. Converted to the cohort with the workshop credit applied. The feeder did its job.
- **pull-quote:** "I couldn't stretch to the cohort yet. The workshop got me a working tool and the nerve to come back." — Solo founder, consumer app

### B-22

- **id:** B-22
- **mode:** workshop
- **icp:** leader
- **industry:** manufacturing
- **situation:** A Director of Finance at a mid-market manufacturer who did not want a strategy. She wanted a working AI assistant for financial analysis and a clear way to know it was trustworthy.
- **the-call:** Build one working tool and a check she can run on its output. No strategy, no decks.
- **the-work:** She left with a built assistant and a check she could run on its output. She brought two colleagues to the next workshop.
- **outcome:** One working tool, used the next day. Two referrals into the next session. No oversell, no decks.
- **pull-quote:** "I wanted one thing that worked. I got one thing that worked." — Director of Finance, manufacturer

### B-23

- **id:** B-23
- **mode:** workshop
- **icp:** leader
- **industry:** nonprofit
- **situation:** An Operations Manager at a mid-size nonprofit on a real budget. Every dollar had to justify itself, and the workshop fee needed to pay back fast.
- **the-call:** Build a reporting workflow that returns more in saved hours than it costs, inside the week.
- **the-work:** She left with a reporting workflow that cut a recurring manual task most of the way out of her week. It paid for itself in saved hours by Friday.
- **outcome:** One manual reporting task largely automated. Hours returned to the team every week. Approval secured for a second seat next quarter.
- **pull-quote:** "On our budget, the fee has to earn its place. This one did, twice over, by the end of the week." — Operations Manager, nonprofit

### CTRL

### B-24

- **id:** B-24
- **mode:** ctrl
- **icp:** leader
- **industry:** startup / technology
- **situation:** A CEO of a 20-person startup who was retyping the same background into every AI tool each session and getting generic output because the tools did not know his world.
- **the-call:** Capture context once, make it portable, and anchor the morning to actual priorities.
- **the-work:** He voiced his context into the Memory Web in a couple of minutes, exported it to both tools, and started getting answers that fit. The Daily Briefing replaced his scattered morning scan.
- **outcome:** Portable context across every AI tool he uses. Mornings anchored to his actual priorities. Upgraded to the paid tier inside two weeks.
- **pull-quote:** "I stopped retyping my whole life into a chatbot every morning. That sentence undersells how much time it gives back." — CEO, 20-person startup

### B-25

- **id:** B-25
- **mode:** ctrl
- **icp:** founder
- **industry:** consulting
- **situation:** An independent strategy consultant who rebuilt context from scratch for every client engagement, with the quality of his AI-assisted work swinging on how much he had remembered to feed it.
- **the-call:** Build a Memory Web per client and export tailored context at the start of each engagement.
- **the-work:** He built a Memory Web per client and exported tailored context into his tools per engagement. Prep time dropped and output stopped being inconsistent.
- **outcome:** Repeatable per-client context. Prep time down noticeably per engagement. Consistent quality regardless of how busy the week was.
- **pull-quote:** "Every client gets consistent thinking from me now, not whatever I happened to type that day." — Independent strategy consultant

### Alumni Pass

### B-26

- **id:** B-26
- **mode:** alumni
- **icp:** leader
- **industry:** SaaS
- **situation:** A cohort graduate, Head of Data at a SaaS company, who six months on hit a deployment he could not get past internally. Instead of guessing, he brought it to a quarterly alumni session.
- **the-call:** Bring the live blocker to the room rather than guessing alone.
- **the-work:** The room had three people who had solved the same thing. He left with a path and shipped the following week.
- **outcome:** A stalled deployment unblocked in one session. The annual pass paid for itself in a single afternoon.
- **pull-quote:** "I was stuck for a fortnight. One session, three people who'd already solved it, unstuck by the afternoon." — Head of Data, SaaS company
