# Mindmake design contract

Last updated: 28 August 2026. This file replaces the pre-rebuild contract in full. It binds the public site: the homepage, `/ai-brain`, `/ai-gtm`, and every secondary page that shares the system.

The intent behind these rules is the north star: everything on the page is proof, an instrument the visitor operates, or art direction that makes the proof feel premium. Anything that is none of the three does not ship.

## The five non-negotiables

1. **No operator name in public copy.** The site speaks as "we" and "mind/make". Testimonials attribute by role and company. The only approved exception is the four CTRL product captures, where the operator's own account chrome is the proof; the rule governs copy, never those images.
2. **The voice: a helpful expert, in plain English.** Every section lands its point in the headline alone, for a non-technical reader. A twelve-year-old should follow every sentence on the site.

   What the voice does. It starts from the reader's situation and describes it the way they would. It is generous about the alternatives, because consultants and the tools people already pay for are genuinely useful and saying otherwise reads as a sales pitch. It names what the reader gains. It explains the mechanism in one plain sentence. It uses concrete nouns: standards, past decisions, hours, drafts, sources.

   What the voice never does. No doom, no fear, no telling a reader their business is failing ("your price has not moved yet"). No commands ("you decide", "own the way you decide"). No boasting or spectacle ("watch us read your business"). No cryptic headings that need the paragraph underneath to decode them ("three places the money moves"). No metaphor doing the work a plain noun could do.

   Banned vocabulary in public copy: ingest, orchestrate, agentic, harness, semantic, RAG, LLM, and "inference" except where the GTM board prices it. Banned constructions: the AI-cliche antithesis templates ("not X, but Y", "X. Not Y.", "never just X"), em dashes, and American spellings.
3. **The motion law.** Motion only ever changes a relationship between things that are already present. See the motion system below. Entrance choreography is banned outright.
4. **One accent system.** Mint means "this is the answer". Amber means "this moved since yesterday". Nothing else on the site is coloured. The serif speaks only the claim. The mono speaks only numbers, sources, timestamps and labels.
5. **The two-email cap.** A visitor who converts receives exactly one results email and exactly one follow-up fourteen days later. Nothing else, ever.

## Tokens

Ground and surfaces: `--mm-ink #0a100d`, `--mm-ink2 #111a16`, `--mm-ink3 #18241f`, `--mm-line #22322b`, `--mm-hair #1a2620`. Paper, for method bands only: `--mm-paper #f2f1ea`, `--mm-paper2 #fbfaf5`, `--mm-paper-line #dedcd0`.

Text on ink: `--mm-tx #e6ede8`, `--mm-tx2 #b0c0b7`, `--mm-mut #788c82`. On paper: `--mm-tx-d #131c17`, `--mm-tx2-d #4a554e`, `--mm-mut-d #7c857a`.

Accents: `--mm-mint #7fe3b4` with `--mm-mint-dim #3e8e68` and `--mm-mint-wash #12291f`; `--mm-amber #e0a44a` with `--mm-amber-wash #2b2113`.

Components read the ground-aware aliases (`--mm-bg`, `--mm-fg`, `--mm-rule` and their siblings) rather than the raw palette, so `.mm-on-paper` inverts a whole subtree by redefining five values.

## Type roles

Four faces, one job each. Three carry meaning and the fourth is simply the body text. All self-hosted through `@fontsource`, never a remote stylesheet.

- **Grotesque (Archivo), structure.** All headings, nav, cards, buttons. Weights 600 to 800, tracking tight on display sizes.
- **Serif (Newsreader), the claim only.** Three or four times per page, always the emotional payoff line, usually in mint. Never a section heading, never nav, never body. Class: `.mm-claim`.
- **Mono (IBM Plex Mono), data.** Numbers, sources, timestamps, category tags, small labels. Uppercase with wide letter-spacing. Class: `.mm-label`. Mono is what makes the live surfaces read as instruments.
- **Body serif (Source Serif 4), running text.** Paragraphs and long copy. It carries no meaning of its own, which is exactly what keeps the claim serif above it meaningful.

The hero pattern everywhere is a grotesque setup line and a serif mint payoff line, on or beside the film plate.

## Motion: the site is never still

Three layers. All three are required on every page.

**Ambient**, always moving, meaning nothing: film loops, the drift and light sweep inside any plate, the marquee, the live dot's pulse. This layer has a floor as well as a cap. Every viewport-height of every page contains motion a person can actually see; a fully still viewport is a bug of the same severity as a scroll reveal.

The floor is measured, not asserted. `scripts/qa/aliveness-check.mjs` photographs each viewport twice, 900ms apart, and compares the pixels; below a mean per-channel change of 0.15 out of 255, the viewport is still. An earlier version of this gate asked the browser whether an animation existed, and the site passed it while showing a visitor nothing, because a 7 percent alpha glow satisfies `getAnimations()` and satisfies nobody. Presence of an animation is not the rule. Perceptibility is.

**Scroll**, relationships between things already present. One primitive implements it: `src/hooks/useScrollDriver.ts` writes `--mm-p` (0 to 1) onto registered elements, and CSS reads that value. It offers two ranges: `centre`, a gentle two-viewport ramp for parallax where only the differential matters, and `read`, which completes while the element is still on screen, because a build has to be finished by the time someone is looking at it.

The sanctioned devices are film inside the still, parallax across one sentence, sticky focus (a column pins while cards pass and non-active cards dim), one marquee per page at most, and these **scrubbed builds**:

- **Read-lit text** (`ScrubText`). A sentence lights word by word as it rises. Every word is in the DOM at full size throughout; only presence changes.
- **Assembling rows.** Cards rise into place and draw their rule in sequence, each owning a slice of the range.
- **Settling values** (`CountingValue`). A figure settles into its true number as you arrive. It starts from a fraction of the real value rather than from nothing, because these are real figures and a number reading 0 when it is 149 is briefly a lie.

The rule that separates a build from a reveal, and the reason the ban below is untouched: **state is driven by position, never triggered by an event.** Scroll up and every one of these runs backwards. Nothing is ever absent, so nothing has to arrive.

**Touch**, everything answers the hand within about 100ms. Cards warm their border toward mint and lift one pixel. Chips fill on hover and press down on click. Tabs slide a mint indicator between states. Fork cards draw their tick when picked. Text links draw their underline. Focus-visible always shows the mint outline. A component shipped without hover, press and focus responses is unfinished, exactly as unfinished as a component with no mobile layout.

**Banned outright, and this is the entire ban:** entrance choreography. Staggered list builds, scroll-triggered fades or slides, numbered step reveals, progress bars tied to scroll position. `IntersectionObserver` does not appear on any rebuilt surface; the contract test enforces its absence, which is what makes the ban checkable.

The scrubbed builds above were adopted on 28 August 2026 after the two models were built side by side on the same content and compared. The ban did not have to move an inch to allow them, which is the argument for them: a build needs no observer, starts from no absent state, and reverses. A reveal needs all three.

Under `prefers-reduced-motion`, the ambient layer falls back to posters and stopped bands, and every scrubbed build reports a completed pass: the sentence is fully lit, the row is assembled, the figure reads its true number, and parallax flattens. The touch layer stays, with transitions swapped for instant state changes.

## The eyebrow ban

No small pre-heading above a hero or a section title, anywhere on the site. Kickers, overlines, chapter numbers, decorative counters, status straps and proof badges are all the same thing under different names, and renaming one or changing its case does not make it acceptable. If a label is worth reading it belongs in the heading; if it is not, it should not be on the page.

A small label may remain only where it names an object, a control, a value or an axis: a lane name on the board, a question number in a journey, a category tag on a card. The contract test enforces the shape of the ban by rejecting any label element immediately followed by a heading.

## Proof

Three families, never mixed, because merging them would be the easiest lie on the page.

- **Client outcomes** are anonymous, by role and sector, because that is what those clients agreed to. One person sits in two families at once: a named reference who was also a client, and whose named quotes run only under a consent record that fails closed. `04_PROOF.md` governs her wording, and she is the only such case.
- **Named references** are people who have worked with the founder, named with their consent, and always described as exactly that rather than passed off as client results.
- **Attendee brands** are attendance and say so on the page. They are never described as clients and never linked.

The site speaks as "we" throughout. The founder is named in the reference section's heading and nowhere else: no first-person voice, no biography, no portrait. The four CTRL captures keep their visible account chrome, because that is what proves the engine is real.

## Components

Every component ships with its hover, press and focus-visible states. None are optional.

Film plate, doors, enemy pair and answer block, marquee, objection chips, ask bar, live board (lane tiles, item cards, industry chips, timestamp with live dot), fork band on paper, ladder, shape cards, journey modules, proof viewer, close block. They live in `src/components/mindmake/` and are styled in `src/styles/mindmake-instruments.css`. Tokens, base and chrome live in `src/styles/mindmake.css`.

## Accessibility

Mint focus-visible outlines on every interactive element. Body text meets AA on both grounds; mint on ink is for large text and chrome, never body text. Every film plate carries a descriptive `aria-label`. Objection chips are buttons, the ask bar is a labelled input, and the fork is keyboard-operable.

## The acceptance checklist

Every public change runs all of it.

1. Focused tests, then the full suite, then `npm run build` and `npx eslint .` no worse than the recorded baseline.
2. Desktop and 375px checks in both scroll directions, with no horizontal overflow and no browser console errors.
3. The Krish gate: a case-insensitive search across public surfaces returns nothing except the three declared exceptions, which the contract test encodes. Those are: the reference section's heading, where he is named once as the person those people worked with; a verbatim quote that used an older name, because quotes are never edited; and the contact mailbox in `src/lib/publicLinks.ts`, which is on the older domain because that is the one that receives mail.
4. The motion gate: no `IntersectionObserver` and no entrance animation on a rebuilt surface.
5. The aliveness gate: scroll each page at reading pace and confirm every viewport holds something in motion, then crawl every interactive element with a mouse and a keyboard and confirm each answers.
6. The three-second gate: read every headline with its serif payoff, standalone. Then the banned-word and antithesis scans.
7. The board honesty gate: the timestamp renders from the cache date, staleness is labelled past 26 hours, and a failed fetch collapses the section cleanly.
8. Reduced motion: posters, stopped bands, final counter values, and every control still operable.
