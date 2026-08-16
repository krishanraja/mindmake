<!-- Last Updated: 2026-08-11 -->
# Proof Bank

> **Status, 2026-08-16: dormant, not live.** The Diagnosis Room and its proposal generator are paused and unmounted (`CLAUDE.md`, `DECISIONS_LOG.md` 2026-08-12). The current public proof source is `project-documentation/BRANDS_AND_TESTIMONIALS.md` and `src/data/rebuildProof.ts`. The verified R-01 to R-09 entries below still carry real, useful detail (see `PROOF_INVENTORY.md`), but this file is not what the live site draws on.

Anonymized, keyed proof for the Mindy proposal generator. **Every entry is a real engagement that happened**, reduced to sector and role only. The numbers are kept; the names are gone.

**Only verified engagements belong in this file.** In August 2026 the 26 illustrative `B-` entries were deleted. They were 74% of the bank, they were labelled as illustrative only inside this one file, and Mindy draws on the bank to generate co-branded proposals a prospect reads and may forward. That meant a prospect could receive a document citing an engagement that never happened. If you cannot point at the invoice, it does not go in, and a shorter bank is the correct outcome rather than a problem to solve by topping it back up.

## How the generator selects

The proposal generator pulls **up to three** entries and never writes its own. With a verified-only bank it may legitimately return fewer, and the proposal template renders one to three tiles. Two real entries is a correct result. It keys on, in priority order:

1. **`mode`**, the engagement shape, mapped to the live rung the visitor is being routed toward.
2. **`icp`**, who the buyer is. One of: `leader` (an individual executive), `enterprise` (a company team or function), `capital` (a fund, family office, or operating partner), `sme` (a small or founder-led company buying bespoke enablement), `founder` (a solo operator or very small team).
3. **`industry`**, the nearest sector. Exa finds structurally similar companies; the generator matches on this tag last, as a tie-breaker, not a gate.

Selection rule of thumb: match `mode` first (hard), `icp` second (strong), `industry` third (soft, nearest-neighbour). If fewer than three entries share a `mode`, widen to the adjacent modes in the same family, in the order the family lists them. If that still comes up short, the last resort is the whole bank, so an unrecognised mode degrades to the best general proof rather than to an empty proof section.

### Field schema

Each entry carries: `id`, `mode`, `icp`, `industry`, `situation`, `the-call`, `the-work`, `outcome` (numbers kept), a one-line `pull-quote`, and an `attribution` of role and sector only.

### `mode` values

`mode` describes the **shape of the work**, never the SKU. Offer names change; the shape of the work does not. That separation is deliberate: when the ladder was repriced in August 2026, the entries did not have to be re-tagged, only the two rung rows below.

| mode | engagement shape |
|---|---|
| `decide` | one commercial question taken apart and settled |
| `reposition` | sharpen the commercial story, ICP, pricing, buyer |
| `rebuild` | replace cost and rebuild the operating model |
| `os` | stand up an autonomous multi-agent operating system |

The two live rungs map onto those shapes rather than carrying entries of their own:

| rung | reaches for, in order |
|---|---|
| `teardown` | `decide`, then `reposition` |
| `handover` | `reposition`, then `rebuild`, then `os` |

### Anonymization note

These are reduced to sector and role. Every entry (R-01 to R-09) carries verified numbers from work on record. Mindy may quote the numbers; Mindy never re-attaches a name. No entry is ever presented as a named client.

---

## Real engagements (anonymized, verified numbers)

### R-01

- **id:** R-01
- **mode:** reposition
- **icp:** enterprise
- **industry:** data infrastructure / first-party identity
- **situation:** A first-party identity and data-infrastructure company with patented identity tech and a strong APAC pipeline, but in a collapsing category. Buyers in the US and EMEA had stopped paying for cookie-replacement tools and started asking what comes next for the open web.
- **the-call:** Reposition the entire commercial surface. Move the lens from third-party-cookie defence to first-party publisher infrastructure for an AI-mediated internet. Rewrite the pitch, the personas, the partner story, and the price point.
- **the-work:** New ICP, messaging, and sales-enablement workflows. Taught the team to vibe-code and built a central AI brain that feeds every seller so they build their own enablement tools instead of needing an enablement team to exist. 43 outbound campaigns across US, EMEA, and APAC with four distinct personas. Partnership architecture with a major creative-and-media services group. A POC scope built for a major US publisher around Safari addressability and conversion-API measurement. A new thought-leadership cadence on agentic browsing and open-web monetisation. The work of at least 10 people, done by one operator plus one supporting resource.
- **outcome:** $254K POC contracted with a major US publisher. Pipeline rebuilt with three further major publishers and a large classifieds marketplace. Category narrative shifted from defence to offence.
- **pull-quote:** "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver."
- **attribution:** CRO, data-infrastructure company

### R-02

- **id:** R-02
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / digital publishing
- **situation:** A top-10 US digital publisher. An SVP-level operator with a board mandate to deliver an AI roadmap by end of quarter. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.
- **the-call:** Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not from the vendor decks. Kill, build, or pause every option on the table with a written rationale.
- **the-work:** A three-decision board memo. One vendor killed, one workflow built internally, one vendor paused with a re-evaluation date. An AI editorial-ops pipeline shipped by their own team in 45 days, zero new headcount. Two of the paused vendors agreed to build bespoke automations so the planned headcount reduction landed with minimal disruption to customers.
- **outcome:** 40% production-time reduction on syndicated content. 75% reduction in campaign setup time downstream. 22% revenue lift across the affected ad inventory. Built by the in-house team, not a vendor.
- **pull-quote:** "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it."
- **attribution:** Head of Operations, digital publisher

### R-03

- **id:** R-03
- **mode:** reposition
- **icp:** enterprise
- **industry:** media / legacy broadcast
- **situation:** A legacy broadcast business. The Head of Strategy was asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different AI tool. The CFO threatening to pull the budget. Product teams building what they thought should be built, not what the leaders asked for or what would sell.
- **the-call:** Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line. Put AI decisions on the executive agenda so they stop landing on her desk. Build a product-strategy incubator inside the business that arms staff equally with AI, to observe who resists, who embraces, and whose dormant skills come alive ahead of a future restructure.
- **the-work:** A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.
- **outcome:** Budget defended at the next review. First production AI workflow live in 90 days. The role pivoted from fractional fire-fighter to ongoing advisory.
- **pull-quote:** "He took the problems that matched our business goals and our leadership needs and brought them together into a very thoughtful programme."
- **attribution:** President, broadcast business

### R-04

- **id:** R-04
- **mode:** rebuild
- **icp:** sme
- **industry:** coaching / corporate training
- **situation:** A senior operator running a coaching and corporate-training practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.
- **the-call:** AI is the forcing function. Rebuild the entire commercial stack in eight weeks: brand, site, productized offers, lead capture, content engine, outbound. Use Claude Projects as the writing OS so context never has to be re-explained.
- **the-work:** A new brand. Three production-ready site concepts shipped in one prompt each. A productized coaching ladder ($2K to $8K) and a corporate workshop ($3K). ManyChat lead capture. An L&D outbound system. Reusable Claude Projects for voice, video scripts, and corporate outreach. The 80-percent rule installed as the publishing standard.
- **outcome:** Five videos shipped in week one. The corporate workshop offer live and priced. New site in final review. First L&D outbound batch sent. The founder back to enjoying the craft instead of running it by hand.
- **pull-quote:** "He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need."
- **attribution:** CEO, coaching practice

### R-05

- **id:** R-05
- **mode:** rebuild
- **icp:** founder
- **industry:** content / wellbeing
- **situation:** A breathwork content founder, pivoting to a research-led content brand on breathwork and performance. Privacy-conscious, energy-managed, with no appetite for autonomy until a human-in-the-loop system was proven. Needed a content engine that compounds without burning out the founder.
- **the-call:** Build a low-cost, voice-first content engine the founder owns. Claude Projects for voice, Gemini for formatting, Google Scholar and ResearchGate for the studies. Manual first, automated only once the system worked end-to-end. Phase the build so the founder kept enjoying it.
- **the-work:** A three-phase roadmap. Phase one: a voice-to-research content engine producing research-backed posts in under 45 minutes. Phase two: Reddit seeding, corporate L&D outreach, journalist sourcing. Phase three: a publishing pipeline, an evidence library, and an SEO flywheel.
- **outcome:** Total AI stack cost ~$20 per month, replacing what would otherwise be a five-figure agency retainer. Time per research-backed post compressed from days to under an hour. The founder owns the system end-to-end and can evolve it without the operator. Posting cadence went from roughly once a month to most days.
- **pull-quote:** "I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me."
- **attribution:** Founder, breathwork content brand

### R-06

- **id:** R-06
- **mode:** reposition
- **icp:** sme
- **industry:** advisory / TMT
- **situation:** A global TMT advisory operating across APAC, EMEA, and the Americas. Deep boardroom relationships and a sharp newsletter brand, but a commercial surface that was speaking, not selling. No productized AI offer for clients. No formal investment thesis to deploy alongside its portfolio.
- **the-call:** Turn the firm's expertise into AI products clients can buy. Codify strategic product development as the core advisory wedge. In parallel, write the ventures thesis: who the firm backs, why, and at what stage. Two stacked offers, one operating model.
- **the-work:** AI-powered customer-experience work packaged as a sellable engagement, not a keynote. A productized advisory ladder under the firm's advisory brand. A ventures thesis written and stood up under a new ventures arm, focused on CTO-led founders. The newsletter and creative arm rewired as distribution for both.
- **outcome:** Advisory repositioned from thought leadership to productized strategic product development, with AI podcasts as the first product launched. Fund One launched with a defined CTO-led thesis, now focused on application-layer AI ventures built around compounding data assets.
- **pull-quote:** "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable."
- **attribution:** Partner, Venture Capital Firm

### R-07

- **id:** R-07
- **mode:** os
- **icp:** founder
- **industry:** AI / business operations
- **situation:** An operator running multiple ventures who needed the company to run without sitting at the centre of every task. The bottleneck was judgement applied to repeatable work, not the work itself.
- **the-call:** Don't build a copilot. Build a self-healing, multi-agent operating system that runs the company while the operator makes Go / No-Go calls. Internal actions run autonomously; anything that leaves the building waits for a human.
- **the-work:** A layered cognitive stack with strict boundaries between data, logic, and reasoning. Supabase as the source of truth for agent identities, task queues, and execution state. 37+ deterministic workflows as the rails, with a non-deterministic swarm for outbound, editorial, competitive sweeps, and guest scouting. Persistent Markdown and JSON memory across all agents so context never has to be re-explained. A failure-to-system engine that writes a permanent rule and drafts the fix the second time anything breaks.
- **outcome:** A 14-agent autonomous operating system, built up from two agents. Morning briefs land before the operator does. The OS presents the data, recommends the play, and executes on approval. A senior strategic partner, a technical ops team, and an outbound sales force in one stack, run by one person across multiple ventures.
- **pull-quote:** "I built fourteen agents and it started with two. Half the ops pod exists to watch the other half. The management layer is the actual product."
- **attribution:** Operator-advisor, AI business

### R-08

- **id:** R-08
- **mode:** decide
- **icp:** enterprise
- **industry:** media / advertising
- **situation:** A major media publisher with a commercial team that wanted to build an in-house AI ad product and an engineering team that wanted to partner. The CRO had been refereeing for two quarters, and the cost of indecision was a missed selling season.
- **the-call:** Settle build versus buy in a day. Run structured pressure-testing in one room until the logic resolves, rather than handing down a verdict.
- **the-work:** One day of structured pressure-testing with the room working the logic together. The answer landed clearly: partner now, revisit build in twelve months once the data position was stronger.
- **outcome:** A clear go decision in a single day. Roughly a year of engineering time not spent on the wrong thing. Partner agreement signed the following month.
- **pull-quote:** "One day. One decision. No more Monday debates. That's the entire review."
- **attribution:** CRO, media company

### R-09

- **id:** R-09
- **mode:** reposition
- **icp:** enterprise
- **industry:** adtech / data
- **situation:** An adtech firm with a strong first-party data asset and an AI layer on top, and no clear way to sell either. Positioning was technical, pricing was a guess, and the pipeline was empty.
- **the-call:** Commercialise the data-plus-AI product, not talk about it. Produce positioning a buyer can repeat, a defensible price, and a sales playbook inside the sprint window.
- **the-work:** A 30-day sprint that rebuilt positioning around a single repeatable line, set a defensible price against the value at stake, and produced a sales playbook the team could run without the founder in the room. First pilots sourced before the engagement closed.
- **outcome:** Clear positioning and pricing. First two pilots signed inside the window. A playbook the sales team runs without the founder present.
- **pull-quote:** "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me."
- **attribution:** Founder, adtech firm
