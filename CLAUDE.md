# Mindmake repository guide

Last updated: 26 August 2026.

This file is a contributor guard. Read `project-documentation/MINDMAKE_CANON.md`, `project-documentation/REBUILD_STATE.md` and `project-documentation/BRANDS_AND_TESTIMONIALS.md` before changing a public page.

## Current commercial contract

- The outward-facing brand is Mindmake.
- Mindmake helps a leader extend their judgment with AI and turn it into a better business result.
- The two public doors are `Build Your AI Brain` and `Build Your AI GTM`.
- Both lead into one paid 30-day proof. The price is private.
- CTRL is Mindmake's product and proof layer, not a third offer.
- There is no public diary link or `Book a fit call` CTA.
- The only primary action is `Start here`.
- The primary path starts with a company website, gives the visitor a useful read and recommendation, asks one easy question, then offers the private brief by email.
- Newsletter consent is separate and unticked.
- The version-two private hand-off exists in source only and remains fail-closed. Do not present it as live until the preview migration, security checks, complete email matrix, retention cleanup, exact origins and symbolic secret configuration pass.
- The browser may send only the visitor email, company domain and allowlisted choice identifiers. Company research, recommendation assembly, verification codes, visitor delivery and Krish's private fit summary are server-owned.
- `prototypes/mindmake-judgement-thread-motion-study-v5.html` is the approved visual and interaction floor for the opening sequence, working-understanding act, judgement thread, two-route gateway and first CTRL proof. Its locked SHA-256 is `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`.
- The Brain and GTM gateway is the exact frozen candidate 7 V2 contract recorded in `project-documentation/MINDMAKE_CANON.md`. Its wording, composition and door-separation motion are not a suggestion to reinterpret.
- V8 remains the breadth reference only for routes, proof and content not yet rebuilt through V5. Where V5 and V8 overlap, V5 wins.

## Do not reintroduce

- The Teardown, The Handover, the 21-day Sprint or any earlier offer ladder.
- Public prices, discounts or currency switching.
- A public Calendly or direct diary path.
- A chatbot or simulated AI answer that makes the practice look automated.
- Attendee brands described as clients.
- Offer labels on case studies.
- The removed private amount or the removed 22 percent result.
- An uncapped Steph quote. Missing or failed consent data must hide it.
- Em dashes or unexplained business and technical terms in public copy.
- Eyebrows or equivalent decorative pre-heading chrome. This includes kickers, overlines, chapter numbers, decorative counters, status straps, proof badges and small pre-headings above or beside a real heading. Renaming or changing the case does not make them acceptable. A small label may remain only when it directly names an object, control, value or axis.

Legacy offer and AI-flow code may still exist outside the active route tree. Treat it as dormant, not as current product truth. Do not edit Supabase, the CTRL repository or the control centre as part of the website rebuild.

## Active structure

- `project-documentation/MINDMAKE_CANON.md`: current commercial and conversion truth.
- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage.
- `src/pages/AiBrain.tsx`: personal capability route.
- `src/pages/AiGtm.tsx`: commercial capability route.
- `src/pages/CaseStudies.tsx`: approved proof archive.
- `src/components/mindmake/`: the deduplicated public design and conversion system.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces.

## Required checks

Run the focused route, conversion and disclosure tests, the production build, lint comparison, desktop and 390px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

For any change to a surface covered by V5, compare it directly with that approved artifact and run both a source scan and a rendered DOM scan for the banned eyebrow family. Motion must clarify the message or the interaction. Movement added only for decoration is a regression.

The existing lint baseline is recorded in `project-documentation/REBUILD_STATE.md`. Do not add new lint problems.

Stop before manual production promotion.
