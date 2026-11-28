# Mindmake brand and testimonial proof

Policy/placement reviewed 26 September 2026. Approved quotation source remains
`src/data/testimonials.ts`; this review does not expand consent or change words.

This file is the single project source for the rules on attendee brands, use cases and their results, client quotes and named career references. Other project documents must point here rather than copy these lists. The words themselves live in one record each: use cases and results in `src/data/useCases.ts`, every quote in `src/data/testimonials.ts`.

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

Every use case and result reads its quote and role from `src/data/testimonials.ts`
by id. Do not maintain a separately edited quote anywhere else.

**Named clients, consent-gated.** Steph Darmanin, Dipti Divekar, James Gates
and Louisa Thrave are named clients with recorded consent, which crosses the
"client outcomes stay anonymous" rule above. The exception is narrow and mechanical: a client in the
`client` family renders only where `consent` reads `recorded`, and
`publishableTestimonials` drops any that does not. A named client without
consent is dropped rather than anonymised, because an anonymised version of a
quote somebody gave under their own name is a different quote.

## Public framing

Use this headline:

> Mindmake has helped leaders across media, software and advisory with what's next in AI.

Ruling (Krish, 2026-09-26): the count returns above the brand grid. The line runs a figure up to 4000+ and then reads:

> 4000+ leaders who have adopted mind/make thinking, from businesses including

Krish approved the count on 26 September 2026; the section 6 evidence trail behind it has not yet been compiled, and should be before the figure is used anywhere else. Use this line immediately above the brand grid (`src/components/mindmake/LeaderCount.tsx`).

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

Since 6 November 2026 (Krish: "add more logos to the carousel") the rail under
the count in "In their words." on the homepage (moved from `/case-studies` on 28 November 2026) carries all 16, media first, as one slow loop that
pauses under a pointer and stands still, swipeable, with reduced motion
(`src/components/mindmake/LogoRail.tsx`). The 13 added marks are each brand's
own artwork from its Brandfetch kit, drawn as one flat mark; P&G's roundel and
BMW's blue quarters are knocked out so the flat mark still reads.

## Use cases and the results on the record

Since 15 November 2026 every use case and every result has one record, and
every page reads it from there. The words live only in
[src/data/useCases.ts](../src/data/useCases.ts); quotes live only in
[src/data/testimonials.ts](../src/data/testimonials.ts). This file does not
keep a second copy of either, and `src/test/use-case-parity.test.ts` holds
both to Krish's cleaned content file of that date, word for word.

- **Eighteen use cases, C-01 to C-18, in six wishes** (since 25 November
  2026, replacing the five situations; `SITUATIONS` in `src/data/useCases.ts`).
  Back the work you believe in (2), Take the money without giving away the
  ending (none yet, only illustrative examples), Make the big call well (4),
  Try the idea you would never have reached (4), Hand over a brief (5) and
  Keep what makes your work yours (3). Eleven sit at the AI brain door and
  seven at the AI business door. Twelve illustrative examples in
  `src/data/examples.ts` are labelled as examples and are never client
  evidence. Each use case owns its heading, outcome, starting point, what we did,
  picture and, only where the client said it, one line of their own words.
- **Eight carry their result on the record inside the same entry.** There is
  no separate results inventory. Keep each client anonymous at role and sector
  unless a later consent record explicitly changes that. The internal
  engagement records behind them are in `04_PROOF_RECORDS.md`.

| Use case | Result | Quote |
| --- | --- | --- |
| C-01 | `own-system` | `wellness-founder` |
| C-02 | `hand-back` | `coaching-founder` |
| C-08 | `simple-product` | `martech-founder` |
| C-11 | `market-moves` | `data-infra-cro` |
| C-15 | `day-one` | `media-cro` |
| C-16 | `sellable-expertise` | `media-advisory-partner` |
| C-17 | `team-decides` | `publisher-ops` |
| C-18 | `business-first` | `broadcast-president` |

- **One client to a card.** A use case joined to a result quotes that same
  client; a test fails if a quote and a result are different clients. The
  head of operations (C-09) quotes `scaleup-ops` without a result on the
  record.
- **Evidence is recorded, not labelled.** Each record says what it rests on:
  a result on the record, or the practice's own account of the engagement
  (C-09 with the client's quote, C-10 with a figure). "At least five times
  faster than AI alone" (C-10) is the owner's figure from that engagement;
  every other figure is a result's own.
- **The results are history, not a promise.** Keep each result's scope as
  recorded; never turn one into a guarantee for the next client, and never
  join a personal and a company result into a cause that the record does not
  state.
- **Wording resolved on 15 November 2026:** C-11 is the CRO who "struggles with
  spreadsheets"; the data company's result is a paid publisher test, with no
  payment amount; its quote is the Chief Revenue Officer's. C-09 and C-10 could
  be shortened where that reads better and loses no meaning (Krish, 15
  November 2026); the shorter forms were approved on the rendered page the
  same day. C-18 has no line of its own, so its story shows its result's
  quote, the broadcaster's own excerpt.
- **History.** The chooser was approved on 16 October 2026 ("Approved, ship
  it", `AI-BRAIN-STORIES-FINDER-001`), the fintech leader and the investor on
  24 October 2026 (`S6-STORIES-NEW-001`; the fintech leader was first written
  up as insurance until Krish corrected it on 11 November 2026), and the
  advisory firm's card on 4 November 2026.
- No caveat, eyebrow, asterisk or label marks any of them as anything other
  than true (Krish, 15 October 2026). The one exception, approved on the
  rendered `/case-studies` on 15 November 2026, is the status label "Result on
  the record" at the foot of a card that holds one (on the homepage's cards
  since 28 November 2026, when `/case-studies` retired).

## Quotes on the site

- **The public client collection is eighteen quotes:** the four named clients
  with consent on record and the fourteen client outcomes
  (`publicClientQuotes`). Session comments and career references are kept in
  the same file and never mixed into it.
- **Five are featured, in this order:** `coaching-founder`, `saas-gtm`,
  `divekar`, `fintech-founder`, `scaleup-ops`. The part shown is the quote's
  `featured` excerpt.
- **Every shorter part is named on its quote's record:** the rail excerpt, the
  featured excerpt and the part shown on a use case (`useCaseExcerpts`). Each
  is an exact substring of the full quote.
- **Named clients are consent-gated.** A `client` renders only where `consent`
  reads `recorded`; `publishableTestimonials` drops any that does not. A named
  client without consent is dropped rather than anonymised.
- Earlier variants of named clients' quotes, including the Steph Darmanin
  section this file carried until 15 November 2026, are preserved in
  [history/ARCHIVE.md](history/ARCHIVE.md) and logged in
  [history/LOG.md](history/LOG.md). They are not working copy.


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
result cards, founder block or testimonial deck is required by this file. A
result lives on its use case, and every surface that shows one reads it from
`src/data/useCases.ts`; the use cases and their results are on `/ai-brain`,
`/ai-gtm` and `/new-age-leadership`, and on the homepage one anchor story per
wish on the back of its card ("Ways an AI brain can level you up.", Krish, 28
November 2026, `src/data/ways.ts`) with the client quotes after it, each under
its scoped approval. Named-client quotes stay
consent-gated and never form an unapproved new section.

## Guardrails

- Do not use attendee brands to redefine the advisory customer.
- Do not call an attendee organisation a client.
- Do not turn a career reference into a client result.
- Do not invent names, numbers, brands or outcomes.
- Keep approved quotation text verbatim.
- Public framing around quotes must use short, common words.
- No count of leaders helped beyond the one approved 4000+ line above the brand
  grid until its evidence trail is compiled.
