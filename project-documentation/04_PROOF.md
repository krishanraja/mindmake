# Mindmake brand and testimonial proof

Last updated: 30 August 2026. Proof permissions approved 2026-08-11; career-reference set extended by Krish 2026-08-27.

This file is the single project source for attendee brands, client outcomes, the named clients' consent-gated excerpts, and named career references. Other project documents must point here rather than copy these lists. Verified client outcome stories and attendee brands render from `src/data/rebuildProof.ts` and must match this file. The thirty-three testimonials described below (sessions, named clients, career references) render from `src/data/testimonials.ts`; `rebuildProof.ts` carries an older, unused `careerReferences` array that duplicates the approved nine and has drifted from what actually ships (see below), and should be deleted once someone confirms nothing still reads it.

## The thirty-three, and the two rules that hold them

Added 28 August 2026. Every testimonial the practice holds now lives in
`src/data/testimonials.ts`, in four families that never mix: five session
attendees, four named clients with consent on record, fourteen anonymised client
outcomes, ten named career references. A session attendee is not a client and a
career reference is not an AI-era outcome; the cards carry the label that says
which, and `src/test/testimonials.test.ts` checks the counts.

**Quotes are never edited.** Not for spelling, not for house style, not to
remove the founder's name. The rules that govern our own voice stop at the
quotation mark, which is why that file sits outside the copy gates and says so
at the exclusion. An earlier version of this data had been anglicised and
name-stripped to pass those gates, and a quote edited to fit a style guide is
not a quote.

**A shortened quote is an exact substring.** Thirty-three quotes of wildly
different lengths cannot share a rail, and the alternative to an excerpt is a
paraphrase attributed to a named person. Every excerpt is checked against its
full text by a test, so a rewrite cannot pass as an extract.

**Named clients, consent-gated.** Steph Darmanin, Dipti Divekar, James Gately
and Louisa Thrave are named clients with recorded consent, which crosses the
"client outcomes stay anonymous" rule above. The exception is narrow and mechanical: a client in the
`client` family renders only where `consent` reads `recorded`, and
`publishableTestimonials` drops any that does not. A named client without
consent is dropped rather than anonymised, because an anonymised version of a
quote somebody gave under their own name is a different quote.

## Public framing

Use this headline:

> Mindmake has helped leaders across media, software and advisory with what's next in AI.

The earlier "over 4000 leaders" count is retired from public copy under the claim control in `01_CANON.md`: a count returns only when the section 6 evidence trail is compiled and Krish approves it.

Use this line immediately above the brand grid:

> Attended by people from organisations including

The organisations below are attendance proof. They are not Mindmake advisory clients and must never be described as clients.

## Approved attendee brands, exactly 16

1. Walmart
2. PepsiCo
3. P&G
4. BMW
5. Boeing
6. Pfizer
7. Visa
8. American Express
9. Goldman Sachs
10. Deloitte
11. PwC
12. L'Oréal
13. Adidas
14. BBC
15. Hearst
16. Condé Nast

All 16 organisations remain approved attendance proof. They are not all required on the homepage.

## Current homepage logo selection

Use the media organisations from the approved list for the current homepage direction:

1. BBC
2. Hearst
3. Condé Nast

Use official logo artwork in a compact one-line strip. The strip may move gently when that helps the page, but must pause for reduced-motion users and must not make the organisations look like advisory clients. Do not link the logos.

## Verified client outcome stories, exactly 8

The words in quotation marks are verbatim. Keep each client anonymous at role and sector unless a later consent record explicitly changes that. The internal engagement records behind these stories are in `04_PROOF_RECORDS.md`.

### 1. Settle the expensive decision

One day to a clear build-or-partner decision, avoiding roughly a year of engineering on the wrong path.

> “One day. One decision. No more Monday debates. That's the entire review.”
>
> CRO, media company

### 2. Turn expertise into something clients can buy

A respected advisory firm moved from ideas to a clear offer clients could buy and launched a defined investment plan.

> “We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable.”
>
> Partner, Venture Capital Firm

### 3. Make the product simple enough to sell

Positioning and pricing were rebuilt in 30 days. The first two pilots were signed during the work.

> “We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me.”
>
> Founder, adtech firm

### 4. Rebuild the business, then hand it back

An eight-week rebuild covered brand, offers, lead capture, content and outreach. Five videos shipped in week one.

> “He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need.”
>
> Founder and CEO, executive coaching practice

### 5. Own the system instead of renting the operator

A founder-owned content system cut research-backed publishing from days to under an hour. Publishing moved from roughly monthly to most days.

> “I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me.”
>
> Founder, research and content brand

### 6. Change how the team decides

A publisher moved from 14 competing AI vendors to three decisions, then shipped the chosen workflow with its own team and no new hires.

> “We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it.”
>
> Head of Operations, top-10 US digital publisher

### 7. Tie every AI choice back to the business

Eleven of fourteen tools were stopped, the budget was defended and the first working system went live inside 90 days.

> “It's been a good journey to bring him problems that match our business goals and leadership needs, and watch them come together in a very thoughtful programme.”
>
> President, legacy broadcast business

### 8. Change direction before the market moves

A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.

> “He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.”
>
> CRO, data-infrastructure company

## Named clients, consent-gated

**Needs Krish's confirmation before this section is treated as settled.** The previous version of this section carried four excerpts under Steph Darmanin's name and described the gate as failing closed against an external "Legacy Ascend consent record." Neither survives a check against the live code:

- The actual mechanism is mechanical, not a lookup: each entry in `src/data/testimonials.ts` in the `client` family carries a hand-set `consent?: "recorded"` field, and `publishableTestimonials` drops any `client` entry where that field is anything other than `"recorded"`. There is no external record it queries and nothing to be "absent, private, unavailable or errors" — a maintainer sets or removes the literal field. Whatever real-world consent process stands behind that field (Legacy Ascend or otherwise) lives outside this repository.
- Three of the four excerpts previously listed here do not match what `src/data/testimonials.ts` attributes to Steph Darmanin today. The quote beginning "What's unique about Krish is that he never lets you become reliant on him" is coded under **Dipti Divekar**. The quote about outsourced support that "came to a halt once the paid engagement ended" is coded, in different wording, under **James Gately**. Only the value-for-money and week-4 excerpts have no match under any name in code at all. Steph Darmanin's own coded quote ("Everyone wants to learn AI skills... a kind and dedicated accountability partner") does not appear anywhere in the previous version of this section.

Until that is resolved with Krish against the original consent records, treat the excerpts below — reproduced verbatim from `src/data/testimonials.ts`, the file that actually renders — as the current source, and do not reuse the four excerpts above under Steph Darmanin's name.

Place excerpts where they support the surrounding message. Never group all four names together.

### Steph Darmanin, Performance Coach

> “Everyone wants to learn AI skills, but it can be complex and overwhelming to go it alone. There are also a lot of smoke and mirrors out there, with many people claiming to be experts and appearing genuine in their promise to help you, but end up not following through on their commitments. Working with Krish was the opposite. You get much more than what you're expecting, learn from a kind and dedicated accountability partner, and the process is simple and straightforward.”

### Dipti Divekar, Performance Coach

> “What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.”

### James Gately, Founder, FinTech

> “Previous support came to a halt once the paid engagement ended, and ultimately I had to pull the plug and start over. With mind/make, I was empowered on how to own the what I do next, which has brought me immense pride and satisfaction.”

### Louisa Thrave, CEO, Media

> “If you're deciding what next step to take to drive stronger business outcomes, and weighing up between a marketing professional, a sales expert, or an AI coach, choose mindmake. You'll get all three.”

## Approved named career references, exactly 10

These are career references. They are not Mindmake client outcomes. Use them only after client proof or on the operator/about surface. The source is the professional recommendation set Krish supplied; the three references added on 27 August 2026 (Rob Hudson, Michael Ricciardone, Marie-Anne Leung Kam) were selected by Krish for their communication and human-approach themes and condensed faithfully from that set. Joseph Kinchin is a tenth reference that is already live in `src/data/testimonials.ts` and rendering on the homepage and case-studies proof drums; he was missing from this list until this pass added him to match the code.

### Lizzie Young

Chief Executive, Commercial Radio & Audio

> “A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together.”

### Rob Hudson

National Sales Director, Media, REA Group

> “A unique ability to make data products accessible to everyone in the room, not just the digital people. A genuine passion for helping clients solve business problems, and above all very personable and approachable.”

### Michael Ricciardone

Country Manager, ANZ, MoEngage

> “Articulate, engaging and entertaining. He breaks down the barriers marketers face with data and technology using relevant examples and stories, then presents clear solutions. Full of support, always keen to educate.”

### Melinda Heffernan

Ad Channel Partnerships Director APAC, Taboola

> “He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him.”

### Chris Spencer

Lead Account Executive, Enterprise, Culture Amp

> “An industry expert who turns knowledge into actionable plans and crafted solutions for clients.”

### Ashley Wales-Brown

Digital Commerce Director, Mars United Commerce

> “Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty.”

### Matt Paine

Managing Partner, Lamington Digital

> “Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward.”

### Marie-Anne Leung Kam

Director, 2 Square Talent

> “An outstanding leader with a clear vision, a collaborative approach and a knack for driving innovation. I could not recommend him more highly.”

### Vincent Pelillo

Regional Managing Director, Channel Factory

> “Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%.”

### Joseph Kinchin

Business Development Director, ROAS media

> “Krish has proven himself a leading thinker in the ever evolving Programmatic and Data industry. His deep understand of both data and tech allows him concisely articulating the problems and solutions that are relevant for the present and in the future. In both roles where Krish has serviced us he has driven positive advertising outcomes through tangible advancements.”

## Homepage proof stack

1. The approved reach headline (no count).
2. The attendance qualifier and the current three-logo media strip: BBC, Hearst and Condé Nast. The full 16-brand set remains approved for other attendance-proof uses.
3. Three result previews from the outcome stories, with the full archive on the case-studies route.
4. One proof drum (`ProofDrum`) carrying all thirty-three testimonials, sessions, named clients, outcomes and career references together, swipe-first on touch widths, each card labelled by family. There is no separate career-only deck; that changed when the drum unified the proof set.
5. The four named clients' excerpts appear only where `consent` reads `recorded` and are never grouped together under one name.

## Guardrails

- Do not use attendee brands to redefine the advisory customer.
- Do not call an attendee organisation a client.
- Do not turn a career reference into a client result.
- Do not invent names, numbers, brands or outcomes.
- Keep approved quotation text verbatim.
- Public framing around quotes must use short, common words.
- No public count of leaders helped until the evidence trail is compiled and approved.
