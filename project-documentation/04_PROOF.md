# Mindmake brand and testimonial proof

Policy/placement reviewed 24 September 2026. Approved quotation source remains
`src/data/testimonials.ts`; this review does not expand consent or change words.

This file is the single project source for attendee brands, client outcomes, Steph Darmanin's consent-gated excerpts, and named career references. Other project documents must point here rather than copy these lists. The rendered data lives in `src/data/rebuildProof.ts` and must match this file.

## The thirty-three, and the two rules that hold them

The approved testimonial set lives in
`src/data/testimonials.ts`, in four families that never mix: five session
attendees, four named clients with consent on record, fourteen anonymised client
outcomes, ten named career references. A session attendee is not a client and a
career reference is not an AI-era outcome; the cards carry the label that says
which, and `src/test/testimonials.test.ts` checks the counts.

**Quotes are never edited.** Not for spelling, not for house style, not to
remove the founder's name. The rules that govern our own voice stop at the
quotation mark, which is why that file sits outside the copy gates and says so
at the exclusion. House style never overrides source wording.

**A shortened quote is an exact substring.** Thirty-three quotes of wildly
different lengths cannot share a rail, and the alternative to an excerpt is a
paraphrase attributed to a named person. Every excerpt is checked against its
full text by a test, so a rewrite cannot pass as an extract.

The eight stories read their quote and role from `src/data/testimonials.ts`.
Do not maintain a separately edited quote in the story deck.

**Named clients, consent-gated.** Steph Darmanin and Dipti Divekar are named
clients with recorded consent, which crosses the "client outcomes stay
anonymous" rule above. The exception is narrow and mechanical: a client in the
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

## Permitted attendance-logo treatment

BBC, Hearst and Condé Nast are an approved compact media selection. This is
permission, not a required R3 homepage section. If an approved surface uses it,
use official artwork with the attendance qualifier, no client implication and
no logo links. Motion stops for reduced-motion users. Preserve the accepted
homepage rather than inserting an earlier proof-stack design.

## Verified client outcome stories, exactly 8

The words in quotation marks are verbatim. Keep each client anonymous at role and sector unless a later consent record explicitly changes that. The internal engagement records behind these stories are in `04_PROOF_RECORDS.md`.

Each story references a voice in `src/data/testimonials.ts` and reads its quote
and role from there. The id after each attribution below identifies that voice.

### 1. Land the answer in a day, then leave

Two quarters of argument over build or partner ended in one day in the room. The partner agreement was signed the following month, and build comes back for review in twelve months, once the data is stronger.

> “Krish knows how to add value immediately which contnues to compound, and is honest about the benefits of continuing to work with him. He doesn't want to loiter.”
>
> CRO, media company (`media-cro`)

### 2. Turn expertise into something clients can buy

A respected advisory firm moved from ideas to a clear offer clients could buy and launched a defined investment plan.

> “We had expertise everyone respected but needed to add products aroudn that. He turned the pitch into something sellable, which then evolved our pitch.”
>
> Partner, media advisory (`media-advisory-partner`)

### 3. Make the product simple enough to sell

Positioning and pricing were rebuilt in 30 days. The first two pilots were signed during the work.

> “We had a brilliant product nobody could buy, because nobody could explain it. We're now clear on who we are in the new world.”
>
> Founder, adtech firm (`martech-founder`)

### 4. Rebuild the business, then hand it back

An eight-week rebuild covered brand, offers, lead capture, content and outreach. Five videos shipped in week one.

> “The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need.”
>
> Founder and CEO, executive coaching practice (`coaching-founder`)

### 5. Own the system instead of renting the operator

A founder-owned content system cut research-backed publishing from days to under an hour. Publishing moved from roughly monthly to most days.

> “Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days because I focus on building an AI engine around what I do and what I get bottlenecked by. It's helping me be seen by my customers.”
>
> Founder, research and content brand (`wellness-founder`)

### 6. Change how the team decides

A publisher moved from 14 competing AI vendors to three decisions, then shipped the chosen workflow with its own team and no new hires.

> “We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing.”
>
> Head of Operations, top-10 US digital publisher (`publisher-ops`)

### 7. Tie every AI choice back to the business

Eleven of fourteen tools were stopped, the budget was defended and the first working system went live inside 90 days.

> “It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program.”
>
> President, legacy broadcast business (`broadcast-president`)

### 8. Change direction before the market moves

A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.

> “We set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.”
>
> CRO, data-infrastructure company (`data-infra-cro`)

## Steph Darmanin, consent-gated named proof

Steph Darmanin is a separate client from the anonymous executive coaching practice above. Her use is approved. The production gate is the checked-in `consent: "recorded"` value and `publishableTestimonials` filter in `src/data/testimonials.ts`, not a live Legacy Ascend lookup. Missing recorded consent excludes the named client entry. Legacy Ascend is historical consent provenance; a withdrawal or unresolved permission requires removing publication eligibility before any further release. Do not claim a runtime consent service exists.

Place the excerpts where they support the surrounding message. Never group all of them together.

### Ownership after Mindmake leaves

> “What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.”
>
> Steph Darmanin, Performance Coach

### Contrast with old outsourced support

> “I have invested thousands before that resulted in terribly disappointing outcomes. The website support came to a halt once the paid engagement ended and ultimately I had to pull the plug and start over. With Mindmaker, I was empowered to own the skills.”
>
> Steph Darmanin, Performance Coach

(The word "Mindmaker" inside this quote is her verbatim wording from the time and stays unchanged.)

### On value for money

> “In 10 years of group and private mentorships, this has been the most valuable investment I have made in myself and my business.”
>
> Steph Darmanin, Performance Coach

### Beside the rebuild story

> “By week 4, I realised I was overdelivering for clients with less effort, and that clarity led me to create new offers with tiered pricing that accurately reflects the value of the service I provide.”
>
> Steph Darmanin, Performance Coach

## Approved named career references

The ten current career references, their exact original words, excerpts and roles
are owned by [src/data/testimonials.ts](../src/data/testimonials.ts), family
`reference`. Excerpts must remain exact substrings of their originals. These are
career references, not Mindmake client outcomes. Use them only after client proof
or on the operator/about surface. This file does not maintain a second condensed
quote collection. The previous nine-reference prose is preserved, unchanged, in
[the historical ledger](history/LOG.md).

## Placement authority

The approved R3 homepage controls its proof placement. No additional logo strip,
result cards, founder block or testimonial deck is required by this file. Results
remain on `/case-studies`; other placements require their scoped approval. Steph
excerpts stay consent-gated and never form an unapproved new section.

## Guardrails

- Do not use attendee brands to redefine the advisory customer.
- Do not call an attendee organisation a client.
- Do not turn a career reference into a client result.
- Do not invent names, numbers, brands or outcomes.
- Keep approved quotation text verbatim.
- Public framing around quotes must use short, common words.
- No public count of leaders helped until the evidence trail is compiled and approved.
