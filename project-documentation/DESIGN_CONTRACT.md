# Mindmake design contract

Last updated: 28 August 2026. This file replaces the pre-rebuild contract in full. It binds the public site: the homepage, `/ai-brain`, `/ai-gtm`, and every secondary page that shares the system.

The intent behind these rules is the north star: everything on the page is proof, an instrument the visitor operates, or art direction that makes the proof feel premium. Anything that is none of the three does not ship.

## The five non-negotiables

1. **No operator name in public copy.** The site speaks as "we" and "mind/make". Testimonials attribute by role and company. The only approved exception is the four CTRL product captures, where the operator's own account chrome is the proof; the rule governs copy, never those images.
2. **The three-second rule.** Every section lands its point in the headline alone, for a non-technical scroller. No line depends on the section above it. Banned vocabulary in public copy: ingest, orchestrate, agentic, harness, semantic, RAG, LLM, and "inference" except where the GTM board prices it. Also banned everywhere: the AI-cliche antithesis templates. No "not X, but Y". No "X. Not Y." tags. No "never just X". When a sentence leans on a negation to praise something, delete the negation and state the fact.
3. **The motion law.** Motion only ever changes a relationship between things that are already present. See the motion system below. Entrance choreography is banned outright.
4. **One accent system.** Mint means "this is the answer". Amber means "this moved since yesterday". Nothing else on the site is coloured. The serif speaks only the claim. The mono speaks only numbers, sources, timestamps and labels.
5. **The two-email cap.** A visitor who converts receives exactly one results email and exactly one follow-up fourteen days later. Nothing else, ever.

## Tokens

Ground and surfaces: `--mm-ink #0a100d`, `--mm-ink2 #111a16`, `--mm-ink3 #18241f`, `--mm-line #22322b`, `--mm-hair #1a2620`. Paper, for method bands only: `--mm-paper #f2f1ea`, `--mm-paper2 #fbfaf5`, `--mm-paper-line #dedcd0`.

Text on ink: `--mm-tx #e6ede8`, `--mm-tx2 #b0c0b7`, `--mm-mut #788c82`. On paper: `--mm-tx-d #131c17`, `--mm-tx2-d #4a554e`, `--mm-mut-d #7c857a`.

Accents: `--mm-mint #7fe3b4` with `--mm-mint-dim #3e8e68` and `--mm-mint-wash #12291f`; `--mm-amber #e0a44a` with `--mm-amber-wash #2b2113`.

Components read the ground-aware aliases (`--mm-bg`, `--mm-fg`, `--mm-rule` and their siblings) rather than the raw palette, so `.mm-on-paper` inverts a whole subtree by redefining five values.

## Type roles

Three faces, one job each. All self-hosted through `@fontsource`, never a remote stylesheet.

- **Grotesque (Archivo), structure.** All headings, nav, cards, buttons. Weights 600 to 800, tracking tight on display sizes.
- **Serif (Newsreader), the claim only.** Three or four times per page, always the emotional payoff line, usually in mint. Never a section heading, never nav, never body. Class: `.mm-claim`.
- **Mono (IBM Plex Mono), data.** Numbers, sources, timestamps, category tags, small labels. Uppercase with wide letter-spacing. Class: `.mm-label`. Mono is what makes the live surfaces read as instruments.

Source Serif 4 remains the body face. The hero pattern everywhere is a grotesque setup line and a serif mint payoff line, on or beside the film plate.

## Motion: the site is never still

Three layers. All three are required on every page.

**Ambient**, always moving, meaning nothing: film loops, the drift and light sweep inside any plate, the marquee, the live dot's pulse. This layer has a floor as well as a cap. Every viewport-height of every page contains at least one ambient element in motion; a fully still viewport is a bug of the same severity as a scroll reveal.

**Scroll**, relationships between things already present. One primitive implements it: `src/hooks/useScrollDriver.ts` writes `--mm-p` (0 to 1) onto registered elements, and CSS reads that value. The sanctioned devices are film inside the still, parallax across one sentence, sticky focus (a column pins while cards pass and non-active cards dim), one marquee per page at most, and counting values on the live board. Scroll never triggers an element's entrance.

**Touch**, everything answers the hand within about 100ms. Cards warm their border toward mint and lift one pixel. Chips fill on hover and press down on click. Tabs slide a mint indicator between states. Fork cards draw their tick when picked. Text links draw their underline. Focus-visible always shows the mint outline. A component shipped without hover, press and focus responses is unfinished, exactly as unfinished as a component with no mobile layout.

**Banned outright, and this is the entire ban:** entrance choreography. Staggered list builds, scroll-triggered fades or slides, numbered step reveals, progress bars tied to scroll position. `IntersectionObserver` does not appear on any rebuilt surface; the contract test enforces its absence, which is what makes the ban checkable.

Under `prefers-reduced-motion`, the ambient layer falls back to posters and stopped bands, counters render final values, and parallax flattens. The touch layer stays, with transitions swapped for instant state changes.

## Components

Every component ships with its hover, press and focus-visible states. None are optional.

Film plate, doors, enemy pair and answer block, marquee, objection chips, ask bar, live board (lane tiles, item cards, industry chips, timestamp with live dot), fork band on paper, ladder, shape cards, journey modules, proof viewer, close block. They live in `src/components/mindmake/` and are styled in `src/styles/mindmake-instruments.css`. Tokens, base and chrome live in `src/styles/mindmake.css`.

## Accessibility

Mint focus-visible outlines on every interactive element. Body text meets AA on both grounds; mint on ink is for large text and chrome, never body text. Every film plate carries a descriptive `aria-label`. Objection chips are buttons, the ask bar is a labelled input, and the fork is keyboard-operable.

## The acceptance checklist

Every public change runs all of it.

1. Focused tests, then the full suite, then `npm run build` and `npx eslint .` no worse than the recorded baseline.
2. Desktop and 375px checks in both scroll directions, with no horizontal overflow and no browser console errors.
3. The Krish gate: a case-insensitive search across public surfaces returns nothing.
4. The motion gate: no `IntersectionObserver` and no entrance animation on a rebuilt surface.
5. The aliveness gate: scroll each page at reading pace and confirm every viewport holds something in motion, then crawl every interactive element with a mouse and a keyboard and confirm each answers.
6. The three-second gate: read every headline with its serif payoff, standalone. Then the banned-word and antithesis scans.
7. The board honesty gate: the timestamp renders from the cache date, staleness is labelled past 26 hours, and a failed fetch collapses the section cleanly.
8. Reduced motion: posters, stopped bands, final counter values, and every control still operable.
