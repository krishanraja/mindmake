# Mindmake repository guide

Last updated: 1 September 2026.

This file is a contributor guard, not the source of truth. The source of truth
is `project-documentation/`, and it is read in order: `00_NORTH_STAR.md` first,
then `01_CANON.md`. Where this file, a code comment, or anything else disagrees
with those two, those two are right.

Before changing a public page, read `00_NORTH_STAR.md`, `01_CANON.md`,
`03_DESIGN_CONTRACT.md`, `04_PROOF.md` and `06_CURRENT_STATE.md`.

## The naming law

Mindmake is the only name for the business. CTRL is the product. The publication
runs exactly two channels, **The Money of AI** and **Built with AI**. Mindmaker
LLC is the registered legal entity and appears only in the privacy notice and the
terms. `themindmaker.ai` and `mindmakerlive.substack.com` are infrastructure
addresses, never names. Anything else that looks like a brand name in this
repository is dead: delete it rather than working around it.

## Current commercial contract

- The outward-facing brand is Mindmake. The site speaks as "we" and "mind/make", never in one person's name.
- Mindmake builds systems that hold a leader's judgement and belong to the client afterwards. The enemy is the oracle (a consultant selling an answer the leader could have reached alone) and the mirror (AI that takes a leader's thinking and hands it back unchanged). "Instruments, not oracles" is internal design language, never site copy.
- The two public doors are `Build your AI brain` and `Build your AI GTM`. The four GTM levers are product, price, positioning and people. A client can start with either and cross to the other.
- Both lead into one paid 30-day proof. The price is private.
- CTRL is Mindmake's product and proof layer, not a third offer. It is named on `/ai-brain` only, never linked, never priced. Its four live captures appear on that page and nowhere else.
- There is no public diary link or `Book a fit call` CTA. One way in per screen: `Start here` on the door pages, and on the homepage the two doors by name, adjacent and in one control group. Each door carries its own four pressure questions, and every `Start here` used to pass none, so a visitor starting on the homepage got a generic set belonging to neither. Opened without a door, the dialog asks which before the four details.
- The private email hand-off is live: four details (first name, last name, work email, division), declarative read with tailored server-signed pressure choices, one easy question, verified work email, then the branded proposal on screen, by email and as an attached document, with a private fit digest to the operator. On screen the proposal wears the step's own surface; paper is for the email and the attachment. `src/test/proposal-on-screen.test.tsx` holds it there, because it was once removed for a whole commit without a gate objecting.
- The browser may send only the visitor's first and last name, their work email, the company domain derived from it, allowlisted choice identifiers (the division and the read's two answers) and the server-signed tailored-choice pair. Company research, tailored choices, recommendation assembly, verification codes, visitor delivery and the operator's fit digest are server-owned.
- Every read carries the honesty framing: an illustrative example of how the Mindmake brain reads a business from the outside, not advice, written as a statement that never asks the visitor anything.
- A converting visitor receives exactly two emails, ever: the results email, and one follow-up fourteen days later. No drip, no newsletter from this site. The publication is a separate opt-in.
- `/ai-gtm` carries a live daily market board fed by the public `get-ai-news` function. Everything on it is public, including the point-of-view line. Daily freshness with a visible timestamp is a standing commitment, and staleness is labelled rather than hidden.
- The publication is a separate opt-in with exactly two channels, described in `project-documentation/02_PUBLICATION.md`.

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
- The operator's personal name in the site's voice. Founder-led, practice voice (28 August 2026): he appears in the founder section at the foot of the homepage, in the framing of the proof, and inside verbatim quotes. Everywhere else there is no first person, no biography, no portrait and no "why him" argument standing in for evidence. Quotes are never edited, for spelling or anything else, and a shortened quote is an exact substring. The four CTRL captures keep their account chrome, and they are images.
- The retired journey engine: stepped scroll journeys, numbered step rails, the Capture / Encode / Amplify / Uncover / Keep ladder, hand-drawn scroll marks, and "Not an agency. Not a coach." The stage photograph came back on 28 August 2026 with the founder section and belongs there, cropped to him; it is not a hero and appears nowhere else.
- Scroll-progress bars, whatever they are filling. Entrance choreography was banned here until 29 August 2026 and is now sanctioned through `src/hooks/useReveal.ts` alone: see the motion law in the design contract for the guarantees that came with the lift, all of which reduce to the content being readable if the reveal never fires.

## Active structure

- `project-documentation/`: the whole source of truth, read in numbered order. `README.md` there is the index.
- `src/hooks/useAmbientMotion.ts`: whether a visitor is served moving footage at all.
- `src/assets/films/`: six films, both formats each, posters taken from frame one.
- `src/App.tsx`: public route contract and retired-route fallbacks.
- `src/pages/Index.tsx`: homepage. `src/pages/AiBrain.tsx` and `src/pages/AiGtm.tsx`: the two doors. `src/pages/CaseStudies.tsx`: approved proof archive.
- `src/components/mindmake/HumanHandoff.tsx` with `src/content/handoff.ts`: the offer of a person at the end of each of the nine dead ends. `05_LEAD_DELIVERY_SPEC.md` lists them and the two paths that deliberately have none.
- `src/components/mindmake/`: the public design and conversion system, including the film plate, the marquee, the ask bar, the questions section (`ObjectionChips`, which is a stack and not a drum since 1 September 2026), the live board, the shared details capture (`DetailsJourney`, used by both `BrainJourney` and `GtmJourney`), and the lead journey (`LeadBrief`, `MindmakeProposal`, `proposalContent`, `privateBriefHtml`, `leadDelivery`, `companyRead`). Also `OneAtATime`, the stack where one row is open: a real `<details>` group, so the accordion runs with no script and every answer is in the markup, which is what the drum it replaced was not. Also `StoryIndex`, the card index: eight client stories as a deck you flick, driven by `useDragDrum` through its `write` option, which lands the offset on a custom property so CSS can put every card in one grid cell, and its `span` option, because a deck's travel is every card but the first and not a rail's `count * pitch - viewport`, which goes negative on a laptop and clamps the whole thing to a standstill. Also `Build`, the group that assembles with scroll position rather than arriving once; it is what took `qa:alive` green and `Arrive` cannot replace it. Also `ClimbLadder`, `ProcessTrack` and `LeverPanel`, the three scrubbed section builds. Also `Instrument` (the six-mark set), `ProofDrum` with `useDragDrum` (the 33 voices), `StoryFigure` (the five proof diagrams), `FounderNote`, `SubscribeBand`, `MindmakeBrand`, `MobileChapter` and `MobileActionBar`.
- `src/data/testimonials.ts`: all 33 quotes, verbatim, each with a one-line excerpt that is an exact substring. Deliberately outside the copy gates, because the house style governs our voice and not what other people wrote; `src/test/testimonials.test.ts` enforces the rule that does apply.
- `src/hooks/useScrollDriver.ts`: the one scroll primitive. `src/lib/analytics.ts`: the site's event wrapper. `src/lib/askCorpus.ts` and `src/content/answers.json`: the curated answer corpus behind the ask bar and `/faq`.
- `src/styles/mindmake.css` (tokens, base, chrome, secondary pages) and `src/styles/mindmake-instruments.css` (the instrument components). `src/styles/mindmake-brief.css` holds the lead dialog's structure and then its tone arc, in that order, in the file the component imports itself. It is one file for a reason: the structure used to live in `mindmake.css`, a rewrite of that file deleted all of it, and the dialog kept its colours while losing its shape.
- `src/data/rebuildProof.ts`: proof data used by the rebuild.
- `supabase/functions/` with `_shared/`: the live edge functions.
- `src/entry-server.tsx` with `src/main.tsx`: the two ends of the static render. Every indexed route is rendered to real markup at build time and the browser hydrates it, so first paint is the page rather than a likeness of it. The two files describe one tree and `src/test/ssg-hydration.test.tsx` holds them to it: a wrapper in one and not the other is a hydration failure, and a hydration failure throws the whole server render away.
- `src/hooks/useReveal.ts` with `src/components/mindmake/Arrive.tsx`: the one entrance primitive and the wrapper that staggers a group with it.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces. The build fails when the prerender and sitemap route sets disagree, and the prerendered copy has to match the pages.

## Required checks

Run the focused route, conversion and disclosure tests (the public contract, backend core, price and disclosure suites), the production build, the lint comparison, and desktop and 390px browser checks. Confirm visible focus, reduced motion, no overflow, no browser errors and one-hop redirects.

Browser gates run against the built output, at 1440 and 390: `npm run qa:alive` (no still viewport at rest, and a second scrubbed pass requiring position-driven change in all three thirds of a page; the at-rest pass now reads how much of the viewport moves, not only whether anything in it does), `npm run qa:images` (no upscaling, and density floors), `npm run qa:rhythm` (no two sections sharing a ground unbroken), `scripts/qa/card-geometry-check.mjs` (equal heights, aligned rows, no reflow on open, and every deck and rail arrow actually moves what it drives), `scripts/qa/one-way-in-check.mjs` (never two primary actions on screen), `scripts/qa/redirect-check.mjs` (every retired route lands in one hop), `scripts/qa/dialog-shape-check.mjs` (the lead dialog is a dialog and not the page), `scripts/qa/handoff-check.mjs` (two dead ends driven for real, so the offer of a person is legible and focusable on both grounds), `npm run qa:entrance` (the first second, cold and throttled: the ground never goes light, the page is never replaced after it paints, React does not fail to hydrate, and something is moving when it lands), `npm run qa:nojs` (scripting off: every answer the page renders is in the served markup, and nothing the browser laid out is clipped away inside a box that cannot be scrolled), `npm run qa:screens` (eight sizes from 360x800 to 1920x1080: no section past 1.35 screens, nothing clipped, nothing sideways, no fixed chrome over the primary action), `npm run qa:deadcss` (no declaration a component makes is beaten by a `.mm-site` reset, across thirteen properties on five pages), and the typecheck the build already runs.

`qa:screens` exists because every other browser gate runs at 1440 and 390, which is a laptop and one phone, and the range is where the failures are. Measured before it: 17 of 26 sections were over one screen at 360px, the homepage's proof strip ran 2.61, and the homepage's own hero ran 1.47 screens on a 1280x800 laptop, so the first screen of the site did not contain the first screen of the site. Its exemptions are named with a reason, the way `qa:rhythm` names its own.

`qa:nojs` exists because every other check on this site, unit and browser alike, runs JavaScript. `.mm-drum` was `overflow: hidden` while the drum's position was a transform written by a hook, so with scripting off it showed one card and clipped the rest with no scrollbar: on the questions drum that was one answer of eight and 2,308px of unreachable copy, for months, on the section a reader goes to when they have a question. Nothing was looking.

**Every gate asks for `/path/`, not `/path`, and this is load-bearing.** `vite preview` serves the second from the SPA fallback, which is the homepage's markup. With JavaScript on the router paints over it a render late, so most gates measured the right page by luck. The entrance gate did not: it handed React the homepage's HTML and the router's own page and reported the mismatch as a defect in the site, 16 hydration failures on `/ai-brain` and 13 on `/ai-gtm`, stable across runs and indistinguishable from the two real hydration failures that gate was built to catch. `scripts/qa/lib/asked.mjs` holds the one line that fixes it, and the reasoning.

Every one of them runs both widths. Until 29 August this text said so while `qa:alive` and `qa:images` defaulted to `--width 1440` and `qa:rhythm` had no width flag at all, so the three gates that decide whether the site feels alive and whether its images are sharp had only ever been run on a laptop. Each npm script now runs both widths in turn; the first readings at 390 were clean, which does not make the gap harmless, only lucky.

The last three exist because every other gate measures a page at rest, and neither the lead dialog nor a failure state is on a page at rest. On 28 August 2026 the whole dialog layout was deleted from `mindmake.css` and shipped: every test passed, every gate passed, and the main conversion surface rendered full-bleed for a day. On 29 August the entrance was found to be a white document for seven hundred milliseconds before the site arrived, on every page, because the built stylesheet is injected after the critical inline style and set an off-white page ground. Anything that only appears after an interaction, or only during one, needs a gate that performs it.

`qa:entrance` reads the browser's error stream as well as its frames, and the two catch different things. On 30 August every prerendered page was failing to hydrate and React was rebuilding each one from nothing; at 1440 the frames saw it as the page being replaced a second after it painted, and at 390 they saw nothing at all, because the rebuild landed on markup that looked the same. A gate that only photographs the page cannot tell a working render from a discarded one.

The inline block in `index.html` is the ink ground and nothing else. It used to be forty lines styling a hand-written first screen, and three bugs came from that screen being a likeness rather than the thing; the pages are rendered from the components now, so the likeness and its second copy of the design are gone. What is left has to stay in step with `--mm-ink`, because the built stylesheet is render-blocking and the ground has to be right before it lands. `src/test/first-screen.test.ts` holds the value in all three places it appears and fails if a hand-written first screen comes back.

Gate floors are calibrated from readings, not chosen; each script says how. If one fails, the page is usually what is wrong. When the gate is what is wrong, fix the measurement and say so in the commit rather than lowering a floor.

For any change to a public surface, run both a source scan and a rendered DOM scan for the banned families: the operator's name, the banned vocabulary and the antithesis templates. `src/test/copy-restraint.test.ts` reads the server render of seven routes for three habits the eye does not catch: copy about its own copy, copy narrating a control, and the same sentence said twice on one page. The design contract's "The design says it, so the sentence goes" is the rule; that file is the gate. A site-wide reset must carry no specificity: write it `:where(.mm-site) :where(p, h2, ...)`, never `.mm-site p`, because (0,1,1) is above every single-class rule here and a default that outranks its own components is an override. Seventeen declarations were dead that way on 2 September 2026, and `npm run qa:deadcss` is what stops the eighteenth. Where a number is already in a picture, a count already in a numbered row, or an instruction already in the shape of a control, printing it again is not thoroughness. For anything that arrives on scroll, load the page with JavaScript disabled and confirm every word of it is readable. Motion must clarify the message or the interaction. Movement added only for decoration is a regression, and so is a still viewport.

For any change to the lead pipeline, run `src/test/mindmake-brief-backend-core.test.ts`, redeploy with the function's full import closure, verify the deployed body and prove one synthetic end-to-end lead from `https://mindmake.co`.

`npm run qa:alive` is **green** as of 2 September 2026, 28 viewports at 390 and 25 at 1440, and it had been red since it was written. Its worklist was the two try-it panels and `/ @844px`, and this file previously said those wanted a set-piece rather than a fix. That was wrong. What they wanted was to **build**: `src/components/mindmake/Build.tsx` puts `useScrollDriver`'s `--mm-p` on a group so its children assemble with scroll position and come apart again on the way back, which is the gate's second half. `Arrive` cannot do it, because a reveal fires once and a section that has arrived is a photograph. Keep it green; if a viewport goes still, give that section a build rather than lowering a floor.

Three things about that gate are worth knowing before reading a number out of it. Its rule was `mean >= 0.15 || peak >= 8`, and `peak` reads the busiest 0.05% of pixels, so one forty-pixel instrument ticking in a frozen screen of text satisfied it; it counts moving cells now. It photographed a stopped page, which can only ever see the ambient layer, so it was failing `ClimbLadder`, `ProcessTrack` and the fork band for being position-driven, which is what the contract asks them to be; a viewport is alive now if something moves in it at rest **or** something in it builds as you scroll through it. And it sampled 1.8 seconds while the plate light sweep is a 9.5 second cycle that parks for 4.3 of them, so the same viewport read 0.125 on one run and 1.611 on the next; the window is 6.4 seconds now. Any reading recorded before 30 August is only trustworthy where the motion was continuous.

The gate also serves `get-ai-news` from `scripts/qa/fixtures/`. Without it the board on `/ai-gtm` renders "The read is rebuilding" from a session that cannot reach Supabase, and a reading about the network gets recorded as a design defect.

The current baselines, recorded in `project-documentation/06_CURRENT_STATE.md`: 395 tests, 0 lint errors and 2 warnings, 0 type errors. Short prose balances by default (`text-wrap: balance` at (0,0,0) on prose elements, which Chrome applies up to six line boxes and drops past); only `.mm-voice-panel blockquote` opts back into `pretty`. Do not add new lint problems. Point the typecheck at `tsconfig.app.json`: the root config carries `"files": []` and checks nothing.

For any change to the films or the film plate, confirm in a browser that every
loop decodes and plays when scrolled into view, and that a reduced-motion
visitor has no video mounted at all.

Deployment and promotion follow `project-documentation/07_DEPLOY_RUNBOOK.md`,
whose launch steps are ordered for a reason. Do not change live Supabase, send
real email from new code paths, alter domains or delete deployed functions
without the matching verification.
