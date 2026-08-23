# CTA and Path Audit

Status: complete for the local production build

Last verified: 2026-08-23 — re-confirmed against current App.tsx/Navigation.tsx/Footer.tsx/rebuildProof.ts, no drift.

## QA target

- Repository: `C:\Users\krish\dev\mindmaker`
- Remote: `https://github.com/krishanraja/mindmaker`
- Source branch: `codex/mindmaker-rebuild`
- Source revision: `3bee2b3ec0a5973f62c0f325514d98eb8ee3d877`, plus uncommitted rebuild work kept separate during diagnosis
- Deployment: `https://www.themindmaker.ai`
- Deployed revision: `3bee2b3ec0a5973f62c0f325514d98eb8ee3d877`
- Identity match: confirmed for the current production baseline
- Primary user: a founder, CEO, CRO or strategy leader with a consequential commercial decision shaped by AI
- Promise: understand what Mindmaker does, trust the proof, see the one Sprint and book a short fit call
- Viewports: desktop at 1440 by 900 and mobile at 390 by 844
- Access: public pages only, no account or private data
- Test data: none
- Write authority: read-only audit, followed by the already authorised repository implementation
- Stop points: do not submit forms, book a meeting, send messages, run paid AI work or change production data
- Evidence location: this file and redacted screenshots under `C:\Users\krish\.scratch\mindmaker-cta-audit`
- Pass signal: every public buying route reaches one clear Sprint explanation or the same verified booking page, with no retired offer, price, duplicate destination, hidden modal gate or AI detour competing with the call

## High-value tasks

1. Understand the business and buyer fit from the first screen.
2. Find the one paid offer and understand its shape.
3. Review proof without confusing attendee brands, clients and career references.
4. Book a fit call from any main sales page.
5. Reach Mindmaker Live, Contact and useful background material without entering a second buying path.
6. Follow an old Teardown, Handover, Start or Signal link and reach the correct current destination.

## Verified transaction destination

Krish confirmed `https://calendly.com/krish-raja/mindmaker-meeting` as the public entry point on 12 August 2026. A live read that day confirmed that the page resolves to a 30-minute Calendly event owned by Krish Raja and titled `MindMaker`. No booking was made.

The event description currently says that Mindmaker builds AI-forward leaders and businesses. The destination is correct, but the copy is broader than the site's commercial-decision position. Any Calendly copy change sits outside this repository.

## Current route and CTA findings

### P1: The site has five competing ways to start

- Status: verified on the production revision
- Routes: `/`, `/case-studies`, `/signal`, `/contact`, `/start` and most sales pages
- Observed:
  - The main navigation and hero open the Diagnosis Room in two different modes.
  - Case studies open a separate scoping modal.
  - Contact asks the visitor to complete a general form.
  - Live Intel links straight to Calendly under `Free 15-min diagnostic`.
  - The old `/start` route opens a full-screen AI conversation.
- Consequence: the visitor must decide how to begin before they understand what they are buying. Tracking and intent are split across different mechanisms.
- Repair: use `Book a fit call` for every main sales action and send each one to the same verified page. Keep Contact for general messages only.

### P1: The live sales path sells offers that the current brief retired

- Status: verified
- Routes: `/teardown`, `/handover`, `/capital`, `/operator`, `/case-studies`, the homepage and the global footer
- Observed: Teardown and Handover remain in the page copy, filters, links, crawler copy and old redirect destinations.
- Consequence: a buyer can compare and enter products that Mindmaker no longer sells.
- Repair: publish one `/sprint` page. Redirect both retired offer routes and their downstream legacy routes to it.

### P1: The homepage does not state the business in its first heading

- Status: verified
- Route: `/`
- Observed: the first heading rotates through buyer worries. The tested first state was `If there were 3 of me, I'd be able to get everything done.` The actual offer appears much later.
- Consequence: the first screen can read as broad AI coaching or automation help. It does not establish a commercial decision practice or a 21-day Sprint.
- Repair: state the buyer, problem and job in the first screen. Use one main call action.

### P2: One publication has two public destinations

- Status: verified
- Routes: every page through navigation and footer
- Observed: `Mindmaker LIVE` points to both `/signal` and `https://live.themindmaker.ai`. The internal route calls itself `Live Intel` and also contains its own decision tool and direct booking label.
- Consequence: visitors cannot know whether Mindmaker Live is a publication, a dashboard or another product.
- Repair: use the branded publication URL everywhere. Redirect `/signal` to that URL. Keep useful articles reachable outside the buying path.

### P2: Proof is mixed with old product labels and unsupported public framing

- Status: verified
- Routes: `/` and `/case-studies`
- Observed: outcome cards are tagged Teardown or Handover, the archive has offer filters, and the homepage still publishes the removed 22 percent result. The live archive shows eleven records rather than the eight approved stories.
- Consequence: proof looks like a product catalogue and conflicts with the approved proof source.
- Repair: publish the eight approved stories in a static result-led grid. Keep attendee brands, client outcomes and career references clearly separate.

### P2: The verified booking event uses broader positioning

- Status: verified at the Calendly landing page. No booking was made.
- Destination: `https://calendly.com/krish-raja/mindmaker-meeting`
- Observed: the event is 30 minutes. Its title is `MindMaker` and its description says Mindmaker builds AI-forward leaders and businesses.
- Consequence: the final step can undo the site's commercial-decision position and attract the wrong call.
- Repair outside this repository: consider naming it `Mindmaker fit call` and describing it as a short check on the decision, fit and useful next step.

### P2: CTA labels describe mechanisms instead of one next step

- Status: verified
- Examples: `Bring me one real decision`, `Run a trained decision simulation`, `Build this with me`, `Pick up the pen`, `Open CTRL`, `Open the Diagnosis Room`, `Free 15-min diagnostic`, `What's your nervous decision?`, `Send Message` and `Book a call`.
- Consequence: visitors cannot form a stable expectation of what a click will do.
- Repair: reserve `Book a fit call` for sales. Use literal labels for content, Contact and external products.

## Conversion architecture selected for implementation

1. The homepage explains Mindmaker and the buyer's stuck moment.
2. The Sprint section and `/sprint` page explain the one paid engagement.
3. Proof appears before the final ask and uses only the approved source.
4. Every main sales action says `Book a fit call` and opens the same verified destination.
5. Contact stays available for a general message but leaves the main buying path.
6. Mindmaker Live always opens the branded publication.
7. CTRL is shown only as the private workspace left with the client, not as another purchase.
8. The AI demonstration and Diagnosis Room do not appear in this release.

## Implemented controls

- The main navigation now has four choices: The Sprint, Results, Mindmaker Live and Book a fit call.
- Contact, How I operate, the Library and legal pages live in the footer rather than the main buying path.
- Every active sales page uses the same shared booking control and verified calendar URL.
- Every retired offer route reaches `/sprint` in one hop at both the edge and client router.
- Old article footers are replaced at render time so both stored and local posts point to the fit call, without changing Supabase.
- A focused test suite blocks retired offer names, old public prices, the removed sensitive amount, the removed 22 percent result and route drift.

## External follow-up

- Update the Calendly event title and description after the repository release. This audit does not authorise changing the Calendly account.

## Verification result

- Production build: passed.
- Focused route, offer and disclosure tests: 8 passed.
- Desktop browser: passed at 1280 by 720 with no horizontal overflow or browser error.
- Mobile browser: passed at 390 by 844 with no horizontal overflow or browser error.
- Mobile menu: four clear choices, with the fit call visually strongest.
- Public routes checked: homepage, Sprint, results, operator, contact, library, blog and an article.
- Proof archive: exactly eight client stories. Steph content stayed hidden when consent was unavailable.
- Logo assets: BBC, Hearst and Condé Nast loaded as real wordmarks.
- Client-side retired route: `/teardown` reached `/sprint` in one hop.
- Full test suite: four known local-storage environment failures remain. The rebuild-specific tests pass.
- Full lint: the recorded baseline remains. This rebuild added no lint problem.
