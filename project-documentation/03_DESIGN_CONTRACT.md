# Mindmake design contract

Current at the 24 September 2026 production release. This is a current contract, not a change diary. Superseded specifications, incidents and original documents belong in `history/LOG.md`. Deployment identity and measured release results live in `06_CURRENT_STATE.md` and `website-redesign/RELEASE-2026-09-24.md`.

## Approval precedence

The published homepage is the accepted R3 synthesis, compiled from its immutable source, with the two explicitly requested pinned scroll builds. Preserve its approved copy, positioning, layout, imagery, labels and device-specific choices. Do not reconstruct it from these prose rules or use an older generic rule to undo an accepted component. A new visual or commercial decision requires explicit approval and a traceable decision record.

`src/pages/Index.tsx` mounts `src/components/homepage-release/markup.ts`, `runtime.js` and `pinnedChapters.ts`. Their styles are `component-styles.css`, `page.css`, `integration.css` and `pinnedChapters.css`. The compiler, approved-source manifest and route lock are release gates; generated output is not an independent design source.

The homepage contains opening, history, authority, leadership dividend, route choice and footer, with its navigation overlay. `/new-age-leadership` remains a companion route. The homepage itself carries the historical argument and human/AI organisation: these are not companion-only content. Do not add the former founder portrait, logo strip, testimonial deck or other retired homepage sections because an old inventory listed them.

## Durable visual and editorial rules

- Everything on the page is proof, an instrument the visitor operates, or art direction that helps the idea land. Remove decoration that does none of these.
- Use plain English addressed to the reader. A heading must communicate without a paragraph decoding it. Concrete benefits, mechanisms and nouns beat internal strategy shorthand.
- Preserve approved copy exactly. For new copy, avoid doom, flattery, unexplained jargon, AI antithesis templates, em dashes, American spellings, and instructions narrating an obvious control. Do not run mechanical style replacement over an accepted headline or a verbatim quote.
- No duplicative pre-headings, decorative chapter straps or backup instructions. Functional labels may name a control, category, object, value or axis. Approved R3 labels remain where accepted; this is not permission to scatter new eyebrows around them.
- Every button or option names the whole choice. If meaningful wording will not fit, repair the control rather than abbreviating away the meaning.
- A fact carried by an image, axis, count or control is not repeated as explanatory copy. Preserve accessible names and useful alt text.
- Practice voice is “we”; use the brand spelling from the approved brand assets and `01_CANON.md`. Founder/reference permissions and verbatim client quotes remain governed by canon and `04_PROOF.md`, not a mandate to reinsert biography on the homepage.
- No public prices, automatic publication subscription, diary link or unapproved commercial promise. Lead behavior and its known limitations are in `05_LEAD_DELIVERY_SPEC.md`.

## Alignment, space and device-specific layout

The visible left edge of the logo aligns with the hero/content grid. Shared gutters govern masthead and section content; a broken logo or an alignment variant that violates this rule is not a review option.

Headings, controls, icons and cards have separate measured space. Text never overlaps its custom icon, another heading, a sticky header, a bottom control or browser-safe-area padding. In a card row, HUMAN/AGENT/HYBRID/SYSTEM labels share a horizontal baseline independently of title wrapping. Unequal title lengths must not vertically re-centre the whole card group.

Mobile is its own composition, not a compressed desktop diagram. Keep type legible, use the available width, eliminate unexplained empty space, and place the control beside the state it changes. Natural content height takes precedence over a forced viewport height when the content cannot fit. A large desktop screen does not exempt short laptop heights, browser chrome, landscape or zoomed text from testing.

One section carries one intelligible idea. A pinned chapter can use extra scroll distance while holding one readable screen; it must not become several empty screens. The org chart, history stories and leadership benefits must remain understandable without reading instructions about how to use them.

## Palette, typography and assets

The existing system uses ink, raised ink and paper, mint for the selected/answer state and amber for changed/evidence accents. Shared tokens live in `src/styles/mindmake.css`; the approved homepage has its own compiled component styles. Read those actual sources rather than treating an older hexadecimal table as authority to repaint R3.

The self-hosted faces are Archivo, Newsreader, IBM Plex Mono and Source Serif 4. Typeface role and scale in the approved composition are locked. Structural introductory copy and expressive story questions must remain visibly differentiated; a generic “serif only three times” rule must not overwrite the accepted serif headings.

Ground-aware colors must remain readable on both ink and paper. Mint as a filled surface is distinct from mint as text. Meaningful body text meets AA contrast; small labels are not exempt. Source labels and consent/error copy must not become faint decorative captions.

Use approved films/posters and real logo assets, never broken paths or generic stand-ins. Case-study machinery is illustrative, not client footage. Keep essential content independent of successful film loading; paused/reduced-motion states retain the poster and controls. Attendance brands are not advisory clients.

## Motion and scroll behavior

Entrance choreography is sanctioned only when content remains readable if the reveal never fires. Script failure, an unavailable observer and reduced motion must retain readable content and operable controls; choreography cannot be a prerequisite for access.

The two approved homepage pins are history and leadership dividend. Their native sticky geometry and scroll-driven state progression live in `pinnedChapters.ts`; the runtime supplies direct controls. They advance through the complete approved sequence, release at the end and reverse naturally. Do not replace them with long stacked story panels or intercept wheel/touch input into an inescapable trap.

Test both scroll directions, every intermediate state, entry and exit, rapid navigation, and direct control selection. Verify headings and body fit inside the actual remaining viewport below the fixed masthead. Runtime enhancement must never trap focus or expose hidden duplicate variants to assistive technology.

Reduced motion, narrow/short layouts and unavailable observers follow their implemented accessible fallback rather than being forced through a desktop animation. Without JavaScript, server-rendered content remains available through the static presentation. Do not claim every enhanced panel is simultaneously visible: active-state panels intentionally differ, and their fallback/control path is part of the contract.

Shared components may use `useScrollDriver.ts` for reversible scrub and `useReveal.ts` for arrivals. Other approved adapters also use IntersectionObserver; there is no one-file observer claim. The invariant is readable content and operable controls if animation fails, not a fixed count of API occurrences.

Ambient film, drift, split-flap and instrument motion should be visibly purposeful at normal motion settings, pause when appropriate, and stop for reduced motion. Do not invent motion just to satisfy an obsolete universal “every viewport must move” demand. Auto-rotating benefits begin when visible, pause for interaction as implemented, and keep deliberate controls. Story reading must not be rushed by an unrelated timer.

Hover, press and focus-visible states are required for interactive components. Touch feedback must answer promptly; keyboard focus remains visible. Motion must not replace the true text with an inaccessible decoy. The split-flap pattern keeps real characters in the DOM, painting only the transient visual layer separately.

## Shared component implementation

Use low-specificity resets such as `:where()` so defaults do not silently outrank component rules. Layout and typography must be checked in the rendered cascade, not inferred from isolated CSS declarations. Font loading, posters and hydration must not cause content to jump or begin blank.

The shared instrument family, proof drum, story index, native details groups, board and route-specific signatures remain available where actually used. Their code under `src/components/mindmake/` and shared styles is not the homepage inventory. Do not reintroduce a retired component simply because it exists in the repository.

Proof has three separate kinds: anonymous client outcomes, consented named career references, and attendee brands. Never merge them. `04_PROOF.md` owns permissions and quotations; `04_PROOF_RECORDS.md` owns anonymised engagement records. Machinery pictures explain kinds of change, not the measured size of client outcomes.

Source news headlines remain the source's words with attribution. Authored analysis is held to house voice. A stale or failed live feed cannot appear fresh; timestamps and counts must reflect the same filtered collection. Company research is a separate provenance-controlled pipeline described in the lead specification.

## Locked product routes

The AI Brain signature has four reversible views: Decision, the actual twenty-node Brain, Evidence and Correction. Evidence keeps sources, instructions, relationships and standing attached. Correction shows the actual rule before and after change. Desktop may pin; portrait phones use a readable natural-height document.

The AI GTM signature carries one market signal through response, product, price, positioning, people and customer test. Desktop keeps signal-to-choice and the commercial map related; phones stack linked decisions instead of squeezing a matrix.

The active manifest selected by `scripts/qa/approved-route-lock-check.mjs` is the enforceable source of truth for signatures, fixtures and review surfaces. Its default currently selects `quality/route-lock/approved-production-r19.json`, which carries the phone action bar's restoration and stylesheet ownership on top of r18's Decision Balance route restriction and r17's delivered-surface correction pass and states that its own owner approval and verification are outstanding; `quality/route-lock/approved-production-r16.json` is the last approved record and identifies what is live, alongside `06_CURRENT_STATE.md`. The checker can select an explicitly scoped manifest through `MINDMAKE_ROUTE_LOCK_MANIFEST`. `approved-production-r1.json` is historical original-signature provenance, not the current enforced lock. `qa:approved-routes`, its self-test, build and the independent route-lock workflow enforce the selected record. A newly approved change needs a new recorded revision, not a silent edit of approval evidence.

## Failure and accessibility behavior

Dead ends offer an honest next step: a panel when the road is closed, a quiet line alongside a working retry. Any humour is at the machine's expense, never the visitor's. An apology is readable body copy, not faint caption text. Tone tokens resolve correctly on the current surface.

Lead dialogs must handle nested confirmation, focus containment/restoration, background inertness, validation errors and reachable download controls. Test opened interactions, not only a screenshot of a closed page. `05_LEAD_DELIVERY_SPEC.md` owns the handoff and delivery truth.

Use semantic buttons/links, accessible names, focus-visible outlines and sufficient contrast. No keyboard or scroll trap. Zoom, reduced motion and script/observer failures must preserve a usable route through content. Automated checks cannot certify physical assistive technology.

## Acceptance and durable release gates

Run the current release commands in `07_DEPLOY_RUNBOOK.md`, not an obsolete checklist of retired screens. Required evidence includes immutable R3 compilation/lock checks, approved route locks and self-tests, scoped lint/type checks, full unit suite, production build, and three-browser pin/route/feedback matrices. Review real desktop and mobile screenshots including bottom-of-page and expanded interaction states. Pixel and geometry checks supplement human inspection, not replace it.

After deployment verify the public artifact identity, routes/assets/redirects, both pins and fallbacks, navigation/cookie/footer interactions and the designated live lead flow. Email acceptance is not inbox delivery. Backend evidence, exact cleanup and actual brief download are documented separately.

The 24 September release has one explicit owner-approved exception: physical iPhone VoiceOver and Android TalkBack were not performed. This is not a pass and not a permanent waiver. No claim of “impossible to violate” or universal perfection is valid; enforceable gates fail closed within their recorded coverage, and new evidence must be added for new failure classes.
