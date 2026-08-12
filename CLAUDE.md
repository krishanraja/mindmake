# Mindmaker repository guide

Last updated: 12 August 2026.

This file is a contributor guard. Read `README.md`, `project-documentation/REBUILD_STATE.md` and `project-documentation/BRANDS_AND_TESTIMONIALS.md` before changing a public page.

## Current commercial contract

- Mindmaker helps leaders make hard commercial decisions as AI changes their market.
- There is one public paid offer: a focused 21-day Sprint.
- The price is not public.
- CTRL is a Sprint deliverable, not a second offer.
- Every main sales action says `Book a fit call` and uses `src/components/BookFitCall.tsx`.
- The verified public destination is held in `src/lib/publicLinks.ts`.
- The Diagnosis Room and homepage AI demonstration are paused and unmounted.
- Contact is for general messages. It does not replace the fit call.
- Mindmaker Live has one external home: `https://live.themindmaker.ai`.

## Do not reintroduce

- The Teardown, The Handover or any earlier offer ladder.
- Public prices, discounts or currency switching.
- A second booking flow, sales modal or AI gate before Calendly.
- Attendee brands described as clients.
- Offer labels on case studies.
- The removed private amount or the removed 22 percent result.
- An uncapped Steph quote. Missing or failed consent data must hide it.
- Em dashes or unexplained business and technical terms in public copy.

Legacy offer and AI-flow code may still exist outside the active route tree. Treat it as dormant, not as current product truth. Do not edit Supabase, the CTRL repository or the control centre as part of the website rebuild.

## Active structure

- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage.
- `src/pages/Sprint.tsx`: the offer.
- `src/pages/CaseStudies.tsx`: approved proof archive.
- `src/components/Navigation.tsx`: four-choice main navigation.
- `src/components/BookFitCall.tsx`: shared sales action and click event.
- `src/lib/publicLinks.ts`: public external destinations.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces.

## Required checks

Run the focused route and disclosure tests, the production build, lint comparison, desktop and 390px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

The existing lint baseline is recorded in `project-documentation/REBUILD_STATE.md`. Do not add new lint problems.

Stop before manual production promotion.
