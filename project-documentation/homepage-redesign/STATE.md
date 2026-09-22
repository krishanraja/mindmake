# Homepage redesign state

This is the single current-state record for the homepage redesign and its local production implementation. Deployed production truth remains in `project-documentation/06_CURRENT_STATE.md`.

## Preflight

STATE_ROUTE: `project-documentation/homepage-redesign/STATE.md`

SOURCE_LAYERS:

- durable doctrine: `00_NORTH_STAR.md`, `01_CANON.md`, `03_DESIGN_CONTRACT.md`;
- current project state: `NOW.md`, `06_CURRENT_STATE.md`, repository revision `2d8caff1874b4b568fa89980304f736b81b05d07`;
- external evidence: production capture `artifacts/award-panel/2026-09-12-production-v2` and rubric `quality/award-panel/rubric.v1.json`;
- history: `project-documentation/history/LOG.md`, not current guidance;
- obsolete: retired offers, old names, public duration and pricing, public diary routes, and superseded design locks.

PRODUCT_TRUTH: Mindmake is a principal-led AI and commercial strategy practice for leaders who can move a material decision. The homepage presents two adjacent public doors, Build your AI brain and Build your AI GTM, leading to one paid proof with private price and duration.

NON_GOALS:

- no commit, merge, preview deployment or production deployment without a separate gate;
- no new offer, product, price, duration, calendar route or chatbot;
- no redesign of the door pages in this homepage slice;
- no replacement of the established Mindmake visual world.

SURFACE_DEPENDENCIES:

1. Homepage primary state and responsive interaction model.
2. Homepage start drawer and route continuity.
3. Door pages and shared conversion flow.
4. Shared design-system and content-contract changes.
5. Production implementation and release.

VERTICAL_SLICE: A responsive, clickable homepage prototype that lets a first-time visitor understand Mindmake, distinguish the two doors and reach a bounded start state without touching production.

FIRST_SURFACE: Homepage, primary state at 1440 by 900 and 390 by 844, with responsive checks at 1024 by 768, 320 by 568 and 844 by 390.

## Build record

TARGET: isolated worktree `mindmake-award-panel`, branch `codex/award-judging-panel`, revision `2d8caff1874b4b568fa89980304f736b81b05d07`.

CURRENT_RUNTIME: Windows, PowerShell, Node 22.23.0. The production site was captured on 12 September 2026. The exact production deployment revision is not confirmed against this worktree, so runtime findings remain production observations rather than source attribution.

SOURCE_OF_TRUTH: this file for redesign progress; `project-documentation/homepage-redesign/DECISIONS.md` for append-only concept decisions.

AUTHORITY: local research, concept generation, prototype files, local homepage implementation and local verification are authorised. Commit, merge, preview deployment, production deployment and external writes are not authorised.

PASS_SIGNALS:

- three concept spines differ pairwise on at least two of sequencing, user agency, primary interaction, information structure and state model;
- two independent judges agree on a winning feasible spine, or a fresh tiebreaker resolves material disagreement;
- the synthesis renders at all five target viewports without overflow, clipped action or inaccessible controls;
- the initial viewport contains sufficient information to identify the practice, intended buyer, two doors and next action;
- keyboard order, visible focus, reduced motion and drawer recovery pass in the prototype;
- the rendered prototype is shown cold to Krish before production implementation.

ROLLBACK: the implementation remains uncommitted on `codex/award-judging-panel`. The approved prototype remains isolated under `prototypes/homepage-vnext/`, and the local homepage change set can be identified from the implementation hashes below without touching unrelated working-tree changes.

READBACK: file hashes, local browser captures, accessibility checks, interaction checks and the repo-owned award-panel rubric.

STATUS: artifact `homepage-vnext-r2-mobile` is explicitly locked by Krish and implemented in the local production application. Routine correction `homepage-vnext-r2.4-gradient` preserves the approved composition while replacing the blanket mobile film darkness with a directional radial fade behind the copy and a separate lower fade behind the route controls. Krish accepted that treatment on 14 September 2026. Blind pre-release judging of the local candidate is complete: 7.4 overall, 7.7 desktop and 7.4 mobile, with art direction strongest and buyability/trust weakest. The candidate remains uncommitted and undeployed. The baseline interaction prototype `start-flow-vnext` is preserved unchanged. Krish approved its routine safe-bottom revision, `start-flow-vnext-r2`, for local implementation on 15 September 2026. That approved sequence is now implemented and locally verified in the real LeadBrief. Krish accepted the first material AI Brain route direction, `ai-brain-vnext-r1`. Its corrected paired prototype passes all hard gates and reaches the award-shortlist band: 8.46 desktop, 8.40 mobile and 8.43 across ten assignments. The accepted direction is now implemented locally on the real `/ai-brain` route with the production LeadBrief drawer, exact approved proof and a responsive four-state decision sequence. It remains uncommitted and undeployed.

## Current phase

PHASE: 10, local production implementation of the accepted AI Brain route is complete and awaiting paired owner review.

LOCKED:

- Mindmake name and established visual world;
- two adjacent public doors and one paid proof;
- private price and duration;
- no public diary link or chatbot;
- only the homepage is in the current material approval scope;
- artifact `homepage-vnext-r2-mobile`, including the distinct desktop and mobile opening compositions, route replacement states and Start here drawer or phone sheet;
- the approved artifact and QA hashes recorded in `CONCEPT_TRACE.md`.
- `ai-brain-vnext-r1` is the accepted route reference; its desktop and mobile treatments, responsive drawer correction and final award-panel evidence must travel together into implementation.

RISKS:

- simplifying the homepage could remove proof needed for a high-consideration purchase;
- a novel interaction could become technology theatre;
- the live lead flow is more complex than the prototype and must not be misrepresented;
- the prototype Start flow is deliberately local and simplified, while production must retain the real lead-flow data and recovery behaviour;
- a technically correct port can still regress the approved density, distinction, type composition or mobile choreography.

VERIFICATION: the built application passes `qa:homepage-fidelity` with zero failures across 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. The mobile scrim gate verifies both the protected copy opacity and a rendered image-reveal endpoint of 0.08, as well as full film-frame coverage. Fresh 390 by 844 and 320 by 568 pixel renders show the headline and paragraph retaining the dark reading field while the cabinet reappears across the right and lower middle. Desktop remains unchanged. The fidelity run now also opens the full-screen menu at every target viewport, verifies viewport coverage, overflow, background inertness, focus entry and Escape focus restoration, and captures paired 1440 by 900 and 390 by 844 menu renders. That new gate reproduced a timing defect: the old 160 ms visibility transition kept menu links unfocusable when the 20 ms focus handoff ran. `mindmake.css` now makes visibility immediate on open and delays it only on close; the regression passes. `qa:chrome` passes 8 sizes by 2 pages by 2 text scales using installed Chrome. The production build passes. Lint passes with zero errors and the same two pre-existing warnings. The full Vitest run now reports 456 passing and 8 failing tests; all eight failures are existing contract, discoverability and answer-route failures in unrelated answer-page and social-manifest work. The focused LeadBrief and route-history run passes 30 of 30 tests. The production-flow fidelity gate now opens both approved entry states at all six viewports and reports zero failures: desktop stays a bounded 700-pixel right drawer; mobile is a full-width phone sheet; headings do not spider; the five-stage path does not overflow; every visible control is at least 44 pixels; the company read starts before personal details finish; the page behind the dialog is inert; there is no internal or horizontal overflow; and the action remains above the 48-pixel desktop, 28-pixel mobile, 14-pixel compact and 24-pixel shallow-landscape reserves. The live production flow retains all eight real divisions and switches to the native selector where the complete set cannot fit without scrolling. Final rendered evidence is under `C:\Users\krish\.scratch\mindmake-start-flow-implementation-2026-09-15-r5`. Final hashes: `LeadBrief.tsx` `97657381ef50532e27037c8e1e68646168a07b89ac7a88f8f77a3765350b2da8`; `mindmake-brief.css` `83b67bc36f0945a7e4d06b9fe89cde00f8c497d8518559c7fa09cf357b2d8634`; `LeadBrief.test.tsx` `f1f34121a620ed7fa2d5470d609468e9ed3f46011c14787b50124aa6c46fedce`; `homepage-fidelity-check.mjs` `3bfcd3f6cb56c5af37b1cd00c808eea349f2d769edc9c4fa945343a57a9c340a`. The exact `r2.3` homepage baseline remains preserved at `C:\Users\krish\.scratch\mindmake-homepage-production\locked-baselines\homepage-vnext-r2.3-before-gradient-fade`. No commit or deployment has occurred.

AI BRAIN REVIEW EVIDENCE: `qa:ai-brain-prototype` passes at 1440 by 900, 1024 by 768, 901 by 700, 900 by 700, 834 by 814, 390 by 844, 375 by 812, 320 by 568 and 844 by 390 with no horizontal overflow, clipped action, spidery heading, undersized control, drawer safe-bottom failure or rail/title collision. All four decision states are reversible by scroll and direct selection. Reduced motion exposes the full semantic sequence as static content. Validation, focus, proof disclosure and the handoff to `/ai-brain?start=brain` pass. The blind ten-assignment panel scores 8.46 desktop and 8.40 mobile with all hard gates clear. Paired renders and all state captures are under `C:\Users\krish\.scratch\mindmake-ai-brain-vnext-r1`. Exact hashes and evidence are in `BRAIN_CONCEPT_TRACE.md` and `BRAIN_AWARD_PANEL_R1.md`.

AI BRAIN PRODUCTION EVIDENCE: `qa:ai-brain-fidelity` passes with zero failures at 1440 by 900, 1024 by 768, 961 by 700, 960 by 700, 834 by 814, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. It checks the exact opening-screen fit, brand and menu alignment, a single shared horizontal origin across header, hero, decision sequence, proof, ownership, close and footer, non-spidery headings, all four reversible states, sheet containment, proof disclosure, production drawer focus and inertness, bottom containment, deep-link opening and reduced-motion static content. The shared-origin gate was added after owner review exposed that the route's 90rem composition and the shared 1104px footer container created a 120px desktop misalignment that the earlier containment-only checks missed. The repaired built output passes the same nine-view matrix with a maximum allowed anchor spread of 2px and includes dedicated desktop, mobile, compact and landscape close-plus-footer captures. The built route passes no-JavaScript reachability and clipping checks. The aliveness gate passes at 390 and 1440 after the approved decision line was carried quietly through proof and close; those transforms are disabled for reduced motion. The production build and prerender pass. The focused route suite passes 67 of 67. Lint reports zero errors and the existing two warnings. The full suite returns to its existing eight unrelated answer-content, social-manifest and duplicate-heading failures after the route contract was updated. Evidence is under `C:\Users\krish\.scratch\mindmake-ai-brain-production`. Implementation hashes: `AiBrain.tsx` `5c340151f72023b224303d0a92afd347a2883f1d5685e81ed39ebe74885281d0`; `mindmake-brain-vnext.css` `50311a581b17f69ca7d63c5249d17f0e5947af270baf78839abd02b65a90c5a7`; fidelity gate `fc5b880c536a5827e5f2c2796321e6adfa4231cece437dc68c17828ca927e898`.

NEXT_OWNER: Krish retains production implementation, commit and release authority.

NEXT_ACTION: review the implemented production `/ai-brain` route in the paired desktop and mobile surface. If accepted, the next material design slice is `/ai-gtm`; commit, preview deployment and production deployment remain separate approval gates.

## 2026-09-15 autonomous continuation

CURRENT_REVIEW_SET:

- `prototypes/ai-gtm-vnext-r3/review.html`: Countermove Table, cleared by three independent judges and a 12-viewport deterministic gate;
- `prototypes/ai-brain-vnext-r2/review.html`: actual Brain-in-action extension, cleared by visual and commercial-contract judges and a nine-viewport deterministic gate.

PHASE: paired owner review of two isolated prototypes. The current production routes remain the previously verified local implementations and were not changed in this continuation.

AUTONOMOUS FIXES COMPLETED: lossy prototype handoffs, cross-layer focus restoration, reduced-motion imagery, footer destinations, small evidence text, responsive breakpoint discontinuity, non-canonical Brain language, false repair scope, mismatched proof copy, undersized compact controls, hidden map feedback and transient horizontal type shearing.

CURRENT AUTHORITY WALL: no commit, merge, preview deployment, production port or public release. The next action after owner review is a separately authorised production implementation decision for AI GTM, AI Brain r2, both or neither.

## 2026-09-16 accepted route lock and continuation

PHASE: 8, local production implementation of the approved Brain r5 and GTM r6 route pair.

CURRENT TRUTH: Krish approved both current paired prototypes with “looks great, lock and continue”. `quality/ai-brain/approved-vnext-r5.json` and `quality/ai-gtm/approved-vnext-r6.json` are the immutable visual and interaction references. The earlier production Brain implementation and the existing GTM page are superseded only for this local implementation slice. Deployed production remains unchanged.

LOCKED:

- AI Brain r5 across desktop and mobile, including the actual synthetic Brain fixture, twenty nodes, eighteen relationships, graph-fit behaviour and four reversible states;
- AI GTM r6 across desktop and mobile, including five signals, fifteen plain-English response choices, continuous ticker and customer-test resolution;
- the product-wide rule that controls name the complete choice without assumed context;
- the existing production lead-flow, route-history, recovery and data-handling contracts;
- no new public offer, price, duration, guarantee or product ladder.

AUTHORITY: local source changes, deterministic tests, production-route browser verification and paired local review are authorised. Commit, merge, preview deployment, production deployment and publication are not authorised.

RISKS: the production port can regress the accepted density or mobile choreography, duplicate prototype-only logic instead of using application state, or weaken the real lead-flow contract. The implementation must fail closed on any undeclared visual or behavioural departure.

VERIFICATION: pass the lock-hash readback; focused React tests; production build; route fidelity at 1440 by 900, 1440 by 700, 1920 by 800, 1024 by 768, 430 by 932, 390 by 844, 320 by 568 and 844 by 390; keyboard, focus, reduced-motion, overflow and drawer checks; paired desktop and mobile rendered review; and a semantic comparison against both approved manifests.

NEXT_OWNER: `krish-build` for local implementation, followed by `ux-testing-agent` and `verification-loop` for the production-route verdict.

NEXT_ACTION: port the locked pair into the real `/ai-brain` and `/ai-gtm` routes without reopening design, then present the paired production renders. Release remains a separate approval gate.

## 2026-09-16 locked route production implementation complete

PHASE: 9, paired owner review of the locally implemented production routes.

IMPLEMENTED:

- `/ai-brain` now carries the approved r5 opening, actual twenty-node Brain fixture, eighteen relationships, ten sources, responsive graph fit, evidence inspection, reversible correction, exact approved proof and the real LeadBrief drawer;
- `/ai-gtm` now carries the approved r6 opening, continuous five-signal live read, fifteen complete plain-English response choices, linked product, price, positioning and people consequences, customer tests, proof and the real LeadBrief drawer;
- route CSS is namespaced to prevent either visual system leaking into the other route;
- the GTM drawer visibly carries the visitor's selected signal and response without changing the version 2 backend payload;
- the mobile GTM stage navigation now computes a fixed-interface offset rather than leaving the selected response below a dead viewport;
- prototype-only selectors omitted during the React port were restored, so the mobile Brain inspector and SVG sizing receive the locked responsive rules.

VERIFICATION: `scripts/qa/route-lock-production-check.mjs` passes with zero failures at 1440 by 900, 1440 by 700, 1920 by 800, 1024 by 768, 430 by 932, 390 by 844, 320 by 568 and 844 by 390 on both routes. It verifies first-screen fit, logo and menu alignment, horizontal overflow, five doubled ticker signals, fifteen distinct responses, response labels of at most two lines, mobile full-width choices, Brain counts, graph top density, inspector containment, keyboard node selection, all stages, correction, proof disclosure, drawer containment, focus, inertness, Escape recovery, carried GTM context, reduced motion and paired production review frames. Final rendered evidence is under `C:\Users\krish\.scratch\mindmake-route-lock-production-final`. TypeScript, targeted ESLint and the production build including SSR, sitemap, llms and prerender pass. The focused route and brief tests pass; the complete suite is back at its existing baseline of 465 passing and eight unrelated failures in answer content, social manifests and answer-route headings.

IMPLEMENTATION HASHES:

- `AiBrain.tsx`: `613565abcc4d9c678c52eed7d581f233b6220f0b240c44ac5f3727700f9c67c4`;
- `AiGtm.tsx`: `b5a02439b6f9a25be9b30693c206bff75afa6b1dcd517badd1ba7a1920f6f3bf`;
- `mindmake-brain-r5.css`: `3a5d80b8ef9a431256c06b6664b3c342fa60d7e094342a44f57307b8db3c1fb8`;
- `mindmake-gtm-r6.css`: `1012b6e4a067b0ed4b81800d92607fe4553008ef3ff715cca646424b1b0a2cb5`;
- `brain-fixture.json`: `02fa968575d7000874f0f10a09123336ad6ec3f7bf373dcd351fbb7e7ef2b1b9`;
- `gtm-signals.json`: `5ab7fac6ce8ebdab6b69b73f60e184a7e4df8d923d97edd29c38872648c3bf7f`;
- production route gate: `42b92f3edecd12aebcc5b2964091f3e525ef38ec3004644fed66a9eef8176977`.

NEXT_OWNER: Krish for paired production-route review. Commit, preview, deployment and publication remain unapproved.

NEXT_ACTION: review `prototypes/ai-brain-vnext-r5/production-review.html` and `prototypes/ai-gtm-vnext-r6/production-review.html`. If accepted, the next gate is an explicit release decision, not another visual iteration.

## 2026-09-16 locked route visibility repair

PHASE: 9, repaired local production candidate awaiting owner review.

ROOT CAUSE: the first React port preserved two prototype assumptions that were not true on the production routes. Brain paper-state headings inherited the global light-on-dark heading colour and the Correction layout detached its content to the bottom of a tall panel. GTM reveal blocks retained prototype opacity defaults but did not receive the prototype IntersectionObserver state. The earlier gate inspected descendant styles without multiplying ancestor opacity, so hidden content could pass while occupying visible blank space.

REPAIR: production now gives Brain paper states explicit ink colours, keeps Correction content contiguous, switches compact portrait to natural-height active panels, and prevents scroll position from overriding explicit compact and landscape stage selection. GTM production reveal blocks now render visible without depending on prototype-only JavaScript. The locked interaction model, fixture and public copy remain unchanged. The same safe Brain layout repairs were applied to the locked prototype CSS and stage controller.

VERIFICATION: `qa:locked-routes` passes 72 effective-visibility, contrast, clipping, overflow and paired-frame observations across 1440 by 900, 1440 by 700, 390 by 844 and 320 by 568. The independent eight-viewport production gate passes both routes, including 844 by 390 landscape. Both locked prototype gates, the plain-language gate, TypeScript, targeted ESLint, the production build, 59 focused tests and the built no-JavaScript routes pass. The complete suite remains at the pre-existing baseline of 465 passing and eight unrelated answer-content, discoverability and answer-route failures. Final regression evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression`.

REPAIR HASHES:

- `AiBrain.tsx`: `b5d97a8e2d14315d82bf6e4c1adfa3547e254f3870d6ec641725daf2d8c9b72f`;
- `AiGtm.tsx`: `f80b9fec6c9da4bd409ed1173d2eb6b5d3bf614400cd2f474ff4627d03a6d59f`;
- `mindmake-brain-r5.css`: `4f2426ac83e2e1985a7d471d9472a4e8384ef622525acbb550c92a81664a75ec`;
- `mindmake-gtm-r6.css`: `97ea949239da1ca6d7f069f7f906b3ff6b77f76af6b9558d912ca6884daa094f`;
- eight-viewport production gate: `385519b093f5d58a94e1992a08583a009f2e8efd68177fc485e2d7768929b6b0`;
- effective-visibility regression gate: `f141561e928df33ee77491ff2a3772c07b3bf9f4e6741540bfc37b7ca9218823`.

NEXT_ACTION: owner review of the repaired paired production pages. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 Brain composition and grid repair

PHASE: 9, repaired AI Brain production candidate awaiting owner review.

ROOT CAUSE: the visibility repair proved that content existed but did not prove that the content used the available frame. The desktop Brain sequence also used a 1440-pixel local container while the shared header used the 1240-pixel shell, so the logo and section heading could both be internally aligned yet disagree by 52 pixels. Those were acceptance-gate omissions, not intentional whitespace.

REPAIR: the Brain sequence now uses the shared shell width and gutter. Decision is a two-part working portrait with the actual decision and four live Brain measures. Evidence is a full-height, numbered trace of the source, instruction and relationship behind the judgement. Correction is an explicit before-and-after authority map showing what still requires human release and what may remain delegated. Mobile and shallow landscape use dedicated natural-height compositions rather than a compressed desktop canvas. The accepted four-state sequence, Brain fixture and public promise remain intact.

VERIFICATION: the locked-route gate now measures meaningful direct-child occupancy as well as effective visibility. Decision, Evidence and Correction must occupy at least 58 percent of the available desktop or shallow frame, and the brand-to-section horizontal origin may differ by no more than 12 pixels. It passes 72 observations across desktop, shallow, mobile and compact review sizes. The independent production gate passes eight viewports. TypeScript, production build and prerender, 59 focused tests, plain-language checks and built no-JavaScript reachability pass. Rendered evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression`.

REPAIR HASHES:

- `AiBrain.tsx`: `f9aba57b7083ede7d99db42e1bb907fdb58d51603112b6ba517843d289696f2d`;
- `mindmake-brain-r5.css`: `4eeed4a55a8eb3aed474ed80e6cbd9556c3eab3d09486a2b718b2aa5921372e2`;
- occupancy and alignment gate: `a55466caeec127c29ee8417743c6d492e68bc06b875b95b6527a6138efd20501`.

NEXT_ACTION: owner review of the repaired AI Brain production page. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 signature real-estate repair

PHASE: 9, paired Brain and GTM production candidate ready for owner review.

ROOT CAUSE: the preceding composition gate measured the area of large containers and could therefore reward an oversized empty box. It also compared the logo with a section shell instead of the first visible glyph. That produced false confidence while the Decision, Evidence and Correction states still parked small content inside large frames. This supersedes the earlier occupancy claim.

REPAIR:

- Brain Decision is now a connected working portrait built from the actual fixture: current synthesis, three linked meanings, their statements and live record counts;
- Brain Evidence is a traceable source-to-instruction-to-relationship chain, and Correction is a readable before-and-after authority map with the changed rule visibly marked;
- the actual twenty-node living Brain remains the centrepiece, including its selectable nodes, relationships, evidence inspector and motion;
- portrait phones use natural-height active documents instead of shrinking desktop boards into one viewport;
- GTM now shows the full reasoning crossing from market signal to selected response, then propagates it through product, price, positioning and people before resolving in a customer test;
- Brain and GTM hero copy, section copy and brand now use the same visible shell edge. GTM retains its stage rail outside that shared edge;
- phase emphasis no longer makes the surrounding GTM instrument unreadable.

VERIFICATION: `qa:locked-routes` passes 72 prototype and production observations across 1440 by 900, 1440 by 700, 390 by 844 and 320 by 568. Its acceptance logic now measures internal component gaps, visible hero and section origins, effective opacity, contrast, clipping and horizontal overflow. The independent production gate passes both routes at eight viewports including shallow desktop and landscape. The paired visual states were inspected at desktop, mobile and compact sizes. TypeScript, the production build and prerender, 89 focused tests, the plain-language gate and built no-JavaScript reachability for both routes pass. Evidence is under `C:\Users\krish\.scratch\mindmake-locked-route-regression` and `C:\Users\krish\.scratch\mindmake-route-lock-production-final`.

REPAIR HASHES:

- `AiBrain.tsx`: `01d4c5178c956b032f603ab710d69f375980ca2e83feed636033fa540bdaf663`;
- `AiGtm.tsx`: `727321f10b6e5106fb96028b9528badfb69625050e3b73f53cf30fcc00d9cb6f`;
- `mindmake-brain-r5.css`: `32563b03aef30c343e3fc99447703852d99ca0d0c9d85cb81a2c866ba2264850`;
- `mindmake-gtm-r6.css`: `e85bbed6918d71cc8edcab44f0f02b365d12ea23e4b48708139032362addbc81`;
- signature regression gate: `574c49793ad4a105c6b36138fa180d36b2604f6a211e9042053746e1154c8f92`.

NEXT_ACTION: owner review of the refreshed Brain and GTM production pages. Commit, preview, deployment and publication remain unapproved.

## 2026-09-16 production route approval lock

PHASE: 10, approved local production routes protected against silent regression.

APPROVAL: Krish accepted the paired Brain and GTM production renders with “this now looks good, lock and proceed, ensuring the system cannot fall apart moving forward”.

LOCK:

- `quality/route-lock/approved-production-r1.json` freezes fourteen production, data, review, QA and CI files by SHA-256 and records the minimum Brain and GTM structural contracts;
- `scripts/qa/approved-route-lock-check.mjs` fails when any approved file hash changes, a fixture loses required records, an approved instrument disappears or banned commercial shorthand returns;
- `scripts/qa/approved-route-lock-self-test.mjs` deliberately supplies a bad manifest and proves the guard fails closed;
- the normal `npm run build` invokes the approved-route guard before TypeScript or bundling;
- `.github/workflows/approved-route-lock.yml` independently runs the guard, its fail-closed self-test, the language contract, focused route tests and the production build on pushes and pull requests;
- `project-documentation/03_DESIGN_CONTRACT.md` now defines the signature-real-estate rule and the immutable manifest revision policy.

VERIFICATION: the approved-route guard passes fourteen locked files and exact structural counts of twenty Brain meanings, eighteen relationships, ten sources, three corrections, five GTM signals and fifteen response choices. The negative self-test detects deliberate drift in `AiBrain.tsx`. The combined route lock passes 72 rendered observations, eight production viewports per route and the plain-language contract. The production build and prerender pass with the lock in the default build path. Built no-JavaScript checks find no clipped content on either route.

LOCK HASHES:

- production manifest: `dc2c2cc8b6b52b314fbf54eef5539bcf969cc36310142c07b18eca9d382636e4`;
- approved-route checker: `d5d1a40c2a54e1eb8cff6e745c252cdd84ee2d9d296a1c41386091b838a51bae`;
- fail-closed self-test: `9f363a59b9d20a2fbfa6f10b510788011d258591e83ab578b550e3d007d504c5`;
- CI workflow: `163b253b1289d447f629a5066062108aceefa79e6b249b39636423a9d9f412b6`.

NEXT_ACTION: the approved production experience is locally frozen. A future visual change must use a new locked-revision manifest and rerun the complete route gate. Commit, preview deployment and production release remain separate authority gates.
