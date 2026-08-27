# Mindmake repository guide

Last updated: 27 August 2026.

This file is a contributor guard. Read `project-documentation/MINDMAKE_CANON.md`, `project-documentation/CURRENT_STATE.md`, `project-documentation/DESIGN_CONTRACT.md` and `project-documentation/BRANDS_AND_TESTIMONIALS.md` before changing a public page.

## Current commercial contract

- The outward-facing brand is Mindmake.
- Mindmake helps a leader extend their judgement with AI and turn it into a better business result.
- The two public doors are `Build Your AI Brain` and `Build Your AI GTM`. The four GTM levers are product, price, positioning and people.
- Both lead into one paid 30-day proof. The price is private.
- CTRL is Mindmake's product and proof layer, not a third offer.
- There is no public diary link or `Book a fit call` CTA.
- The only primary action is `Start here`.
- The private email hand-off is live (Gate E approved and closed, 27 August 2026): company website, declarative read with tailored server-signed pressure choices, one easy question, verified work email, then the branded proposal on screen, by email and as an attached document, with a private fit digest to Krish.
- The browser may send only the visitor email, company domain, allowlisted choice identifiers and the server-signed tailored-choice pair. Company research, tailored choices, recommendation assembly, verification codes, visitor delivery and Krish's private fit digest are server-owned.
- Every read carries the honesty framing: an illustrative example of how the Mindmake brain reads a business from the outside, not advice, written as a statement that never asks the visitor anything.
- `prototypes/mindmake-judgement-thread-motion-study-v5.html` is the approved visual and interaction floor for the opening sequence, working-understanding act, judgement thread, two-route gateway and first CTRL proof. Its locked SHA-256 is `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`.
- The Brain and GTM gateway is the exact frozen candidate 7 V2 contract recorded in `project-documentation/MINDMAKE_CANON.md`. Its wording, composition and door-separation motion are not a suggestion to reinterpret.
- V8 remains the breadth reference only for homepage proof and testimonial range not yet rebuilt through V5. Where V5 and V8 overlap, V5 wins.

## Do not reintroduce

- The Teardown, The Handover, the 21-day Sprint or any earlier offer ladder.
- Public prices, discounts or currency switching.
- A public Calendly or direct diary path.
- A chatbot or simulated AI answer that makes the practice look automated. The company read is served research presented honestly, never a conversation.
- Attendee brands described as clients.
- Offer labels on case studies.
- The removed private amount or the removed 22 percent result.
- An uncapped Steph quote. Missing or failed consent data must hide it.
- A public count of leaders helped, until the lock's evidence trail is compiled and approved.
- Em dashes or unexplained business and technical terms in public copy.
- A conversational or self-correcting voice in the company read ("tell me if I am wrong" and its family), or American spellings such as `judgment` in any public or generated copy.
- Eyebrows or equivalent decorative pre-heading chrome. This includes kickers, overlines, chapter numbers, decorative counters, status straps, proof badges and small pre-headings above or beside a real heading. Renaming or changing the case does not make them acceptable. A small label may remain only when it directly names an object, control, value or axis. A full-bleed background numeral marking a numbered step section is a second approved exception; it must never shrink into a small label, kicker or counter.

## Active structure

- `project-documentation/MINDMAKE_CANON.md`: current commercial and conversion truth.
- `project-documentation/CURRENT_STATE.md`: live identifiers and verification baselines.
- `project-documentation/DESIGN_CONTRACT.md`: binding design rules and the acceptance checklist.
- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage. `src/pages/AiBrain.tsx` and `src/pages/AiGtm.tsx`: the stepped door journeys. `src/pages/CaseStudies.tsx`: approved proof archive.
- `src/components/mindmake/`: the public design and conversion system, including the journey engine (`StepJourney`, `StepScene`, `StepFilm`, `CompoundingTimeline`), the marks (`ScrollMark`, frozen `ScrollEvidenceMark`), the comparison (`WorkingUnderstandingCompare`), and the lead journey (`LeadBrief`, `MindmakeProposal`, `proposalContent`, `privateBriefHtml`, `leadDelivery`, `companyRead`).
- `src/styles/mindmake.css`, `mindmake-journey.css`, `mindmake-brief.css`, and the frozen `mindmake-gateway.css`.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `supabase/functions/enrich-company` and `supabase/functions/submit-mindmake-brief` with `_shared/`: the two live edge functions.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces.

## Required checks

Run the focused route, conversion and disclosure tests (the journey contract, public contract, backend core, price and disclosure suites), the production build, lint comparison, desktop and 390px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

For any change to a surface covered by V5, compare it directly with that approved artifact and run both a source scan and a rendered DOM scan for the banned eyebrow family. Motion must clarify the message or the interaction. Movement added only for decoration is a regression.

For any change to the lead pipeline, run `src/test/mindmake-brief-backend-core.test.ts`, redeploy with the function's full import closure, verify the deployed body and prove one synthetic end-to-end lead from `https://mindmake.co`.

The current lint baseline is 0 errors and 4 warnings, recorded in `project-documentation/CURRENT_STATE.md`. Do not add new lint problems.

Stop before manual production promotion.
