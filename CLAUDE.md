# Mindmake repository guide

Last updated: 28 August 2026.

This file is a contributor guard. Read `project-documentation/MINDMAKE_CANON.md`, `project-documentation/CURRENT_STATE.md`, `project-documentation/DESIGN_CONTRACT.md` and `project-documentation/BRANDS_AND_TESTIMONIALS.md` before changing a public page.

## Current commercial contract

- The outward-facing brand is Mindmake. The site speaks as "we" and "mind/make", never in one person's name.
- Mindmake builds systems that hold a leader's judgement and belong to the client afterwards. The enemy is the oracle (a consultant selling an answer the leader could have reached alone) and the mirror (AI that takes a leader's thinking and hands it back unchanged). "Instruments, not oracles" is internal design language, never site copy.
- The two public doors are `Build your AI brain` and `Build your AI GTM`. The four GTM levers are product, price, positioning and people. A client can start with either and cross to the other.
- Both lead into one paid 30-day proof. The price is private.
- CTRL is Mindmake's product and proof layer, not a third offer. It is named on `/ai-brain` only, never linked, never priced. Its four live captures appear on that page and nowhere else.
- There is no public diary link or `Book a fit call` CTA. The only primary action is `Start here`.
- The private email hand-off is live: company website, declarative read with tailored server-signed pressure choices, one easy question, verified work email, then the branded proposal on screen, by email and as an attached document, with a private fit digest to the operator.
- The browser may send only the visitor email, company domain, allowlisted choice identifiers and the server-signed tailored-choice pair. Company research, tailored choices, recommendation assembly, verification codes, visitor delivery and the operator's fit digest are server-owned.
- Every read carries the honesty framing: an illustrative example of how the Mindmake brain reads a business from the outside, not advice, written as a statement that never asks the visitor anything.
- A converting visitor receives exactly two emails, ever: the results email, and one follow-up fourteen days later. No drip, no newsletter from this site. The publication is a separate opt-in.
- `/ai-gtm` carries a live daily market board fed by the public `get-ai-news` function. Everything on it is public, including the point-of-view line. Daily freshness with a visible timestamp is a standing commitment, and staleness is labelled rather than hidden.
- The rebuild brief of 27 and 28 August 2026 is the current design and copy truth. Where an older repository document disagrees with it, the brief wins and the document gets updated.

## Do not reintroduce

- The Teardown, The Handover, the 21-day Sprint or any earlier offer ladder.
- Public prices, discounts or currency switching.
- A public Calendly or direct diary path.
- A chatbot or simulated AI answer that makes the practice look automated. The company read is served research presented honestly, never a conversation.
- Attendee brands described as clients. Offer labels on case studies.
- The removed private amount or the removed 22 percent result.
- An uncapped Steph quote. Missing or failed consent data must hide it.
- A public count of leaders helped, until the lock's evidence trail is compiled and approved.
- Em dashes, American spellings such as `judgment`, or unexplained business and technical terms in public copy.
- Doom, fear or failure framing about the reader's business. Commands to the reader. Boasting about what we are about to do. Cryptic headings that need the paragraph below them to decode. The voice is a helpful expert explaining something clearly, and a twelve-year-old should follow every sentence.
- Eyebrows. No small pre-heading above a hero or a section title, under any class name and in any case. A small label may remain only where it names an object, a control, a value or an axis.
- The operator's personal name in the site's voice: no first person, no biography, no portrait. He is named once, as the person the named references worked with. The four CTRL captures keep their account chrome, and they are images.
- The retired journey engine: stepped scroll journeys, numbered step rails, the Capture / Encode / Amplify / Uncover / Keep ladder, hand-drawn scroll marks, the stage photograph, and "Not an agency. Not a coach."
- Entrance choreography of any kind. Scroll-triggered reveals, fades, slides, staggered builds and scroll-progress bars are banned; see the motion law in the design contract.

## Active structure

- `project-documentation/MINDMAKE_CANON.md`: current commercial and conversion truth.
- `project-documentation/CURRENT_STATE.md`: live identifiers and verification baselines.
- `project-documentation/DESIGN_CONTRACT.md`: binding design rules, the motion law and the acceptance checklist.
- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage. `src/pages/AiBrain.tsx` and `src/pages/AiGtm.tsx`: the two doors. `src/pages/CaseStudies.tsx`: approved proof archive.
- `src/components/mindmake/`: the public design and conversion system, including the film plate, the marquee, the ask bar, the objection chips, the live board, the two journeys, and the lead journey (`LeadBrief`, `MindmakeProposal`, `proposalContent`, `privateBriefHtml`, `leadDelivery`, `companyRead`).
- `src/hooks/useScrollDriver.ts`: the one scroll primitive. `src/lib/analytics.ts`: the site's event wrapper. `src/lib/askCorpus.ts` and `src/content/answers.json`: the curated answer corpus behind the ask bar and `/faq`.
- `src/styles/mindmake.css` (tokens, base, chrome, secondary pages) and `src/styles/mindmake-instruments.css` (the instrument components). `src/styles/mindmake-brief.css` styles the lead dialog.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `supabase/functions/` with `_shared/`: the live edge functions.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces. The build fails when the prerender and sitemap route sets disagree, and the prerendered copy has to match the pages.

## Required checks

Run the focused route, conversion and disclosure tests (the public contract, backend core, price and disclosure suites), the production build, the lint comparison, and desktop and 375px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

For any change to a public surface, run both a source scan and a rendered DOM scan for the banned families: the operator's name, the banned vocabulary, the antithesis templates, and entrance motion. Motion must clarify the message or the interaction. Movement added only for decoration is a regression, and so is a still viewport.

For any change to the lead pipeline, run `src/test/mindmake-brief-backend-core.test.ts`, redeploy with the function's full import closure, verify the deployed body and prove one synthetic end-to-end lead from `https://mindmake.co`.

The current lint baseline is 0 errors and 2 warnings, recorded in `project-documentation/CURRENT_STATE.md`. Do not add new lint problems.

Stop before manual production promotion.
