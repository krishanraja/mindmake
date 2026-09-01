# Mindmake design contract

Last updated: 1 September 2026. This file replaces the pre-rebuild contract in full. It binds the public site: the homepage, `/ai-brain`, `/ai-gtm`, and every secondary page that shares the system.

The intent behind these rules is the north star: everything on the page is proof, an instrument the visitor operates, or art direction that makes the proof feel premium. Anything that is none of the three does not ship.

## The five non-negotiables

1. **No operator name in public copy.** The site speaks as "we" and "mind/make". Testimonials attribute by role and company. The only approved exception is the four CTRL product captures, where the operator's own account chrome is the proof; the rule governs copy, never those images.
2. **The voice: a helpful expert, in plain English.** Every section lands its point in the headline alone, for a non-technical reader. A twelve-year-old should follow every sentence on the site.

   What the voice does. It starts from the reader's situation and describes it the way they would. It is generous about the alternatives, because consultants and the tools people already pay for are genuinely useful and saying otherwise reads as a sales pitch. It names what the reader gains. It explains the mechanism in one plain sentence. It uses concrete nouns: standards, past decisions, hours, drafts, sources.

   What the voice never does. No doom, no fear, no telling a reader their business is failing ("your price has not moved yet"). No commands ("you decide", "own the way you decide"). No boasting or spectacle ("watch us read your business"). No cryptic headings that need the paragraph underneath to decode them ("three places the money moves"). No metaphor doing the work a plain noun could do.

   Banned vocabulary in public copy: ingest, orchestrate, agentic, harness, semantic, RAG, LLM, and "inference" except where the GTM board prices it. Banned constructions: the AI-cliche antithesis templates ("not X, but Y", "X. Not Y.", "never just X"), em dashes, and American spellings.
3. **The motion law.** Motion changes how something is presented, never whether it is there. See the motion system below. Entrance choreography is sanctioned; content that is only readable once it has fired is not.
4. **One accent system.** Mint means "this is the answer". Amber means "this moved since yesterday". Nothing else on the site is coloured. The serif speaks only the claim. The mono speaks only numbers, sources, timestamps and labels.
5. **The two-email cap.** A visitor who converts receives exactly one results email and exactly one follow-up fourteen days later. Nothing else, ever.

## Tokens

Ground and surfaces: `--mm-ink #0a100d`, `--mm-ink2 #111a16`, `--mm-ink3 #18241f`, `--mm-line #22322b`, `--mm-hair #1a2620`. Paper, for method bands only: `--mm-paper #f2f1ea`, `--mm-paper2 #fbfaf5`, `--mm-paper-line #dedcd0`.

Text on ink: `--mm-tx #e6ede8`, `--mm-tx2 #b0c0b7`, `--mm-mut #788c82`. On paper: `--mm-tx-d #131c17`, `--mm-tx2-d #4a554e`, `--mm-mut-d #7c857a`.

Accents: `--mm-mint #7fe3b4` with `--mm-mint-dim #3e8e68` and `--mm-mint-wash #12291f`; `--mm-amber #e0a44a` with `--mm-amber-wash #2b2113`. Both accents have a paper form, `--mm-mint-d #2f6f51` and `--mm-amber-d #9a5a1c`, because the ink versions fall to 3.8:1 and below on the proposal's paper, under what its 11px labels need. Same two meanings, darkened.

Grounds: three, alternating down every page. `--mm-ink` is the default, `--mm-ink-raise #1e2c26` is the second, a 1.32:1 step that is nothing as a hairline and unmistakable across a band, and `--mm-paper` is the break. `.mm-on-raise` redefines `--mm-line` and `--mm-mut` for its own subtree, because the instrument components read the palette directly and on the lighter ground a rule sits at 1.08:1 and muted text drops to 4.07:1. The section seam is `--mm-seam #30463d`, separate from `--mm-hair` because that one also draws inside articles where a louder rule would shout. `--mm-section` is the one spacing scale and `.mm-block` reads it.

**No two consecutive sections share a ground** unless something else separates them: a full-bleed band carrying its own image, or a visible seam. `npm run qa:rhythm` enforces it and names its exemptions.

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

**Scroll**, relationships between things already present. One primitive implements it: `src/hooks/useScrollDriver.ts` writes `--mm-p` (0 to 1) onto registered elements, and CSS reads that value. It offers three ranges: `centre`, a gentle two-viewport ramp for parallax where only the differential matters; `read`, which completes while the element is still on screen, because a build has to be finished by the time someone is looking at it; and `pin`, which maps 0 to 1 across exactly the distance a sticky child holds still for, so a held section spends all of its motion while it is the only thing on screen. `pin` falls back to `read` when the section is not tall enough to hold anything, which is the narrow phone, where the pin is off; without that fallback it divides by what is left of a short section and snaps between 0 and 1 with nothing in between.

The sanctioned devices are film inside the still, parallax across one sentence, sticky focus (a column pins while cards pass and non-active cards dim), the pinned section (the same sticky positioning given a longer range: everything present from first paint, nothing waiting on an event, and it reverses on the way back up), one marquee per page at most, **the instrument set**, **the drum**, and these **scrubbed builds**:

- **Read-lit text** (`ScrubText`). A sentence lights word by word as it rises. Every word is in the DOM at full size throughout; only presence changes.
- **Assembling rows.** Cards rise into place and draw their rule in sequence, each owning a slice of the range.
- **Settling values** (`CountingValue`). A figure settles into its true number as you arrive. It starts from a fraction of the real value rather than from nothing, because these are real figures and a number reading 0 when it is 149 is briefly a lie.
- **The climb** (`ClimbLadder`). Three levels drawn as a staircase, held on screen while a lamp climbs it. The section is taller than the screen and its contents are sticky inside it, so three steps cost one screen of looking rather than three of scrolling. The cards *are* the staircase: they are laid out at equal height and shifted visually, and the lamp climbs the line between the first card's top corner and the last one's, so the graphic and the boxes cannot fall out of register. An SVG staircase drawn above them was tried first and could not be aligned, because an SVG scales in its own coordinate system and DOM boxes do not, so the two agreed at exactly one window width.
- **The track** (`ProcessTrack`). Two parts of one process on one line: solid and capped where the work is finite, dashed and uncapped where it is open-ended, with a marker travelling the whole line as you read. The dashes drift on their own, which is the ambient layer and is what open-ended looks like when nobody is watching.
- **The lever panel** (`LeverPanel`). The four GTM levers as four dials in one frame, needles swinging together across the read, each from its own rest angle so they never read as one object or as a measurement of anything.

What none of them do is fill. A bar that tracks scroll position is banned whatever it is filling, so in every one of these the thing that changes position is an object and the thing that changes state is an accent. Nothing is dimmed to the point of being hard to read, so a visitor who never scrolls, or who asked for reduced motion and gets the completed pass, has lost the movement and none of the content.

The rule that separates a build from a reveal, and the reason the ban below is untouched: **state is driven by position, never triggered by an event.** Scroll up and every one of these runs backwards. Nothing is ever absent, so nothing has to arrive.

**The instrument set** (`Instrument.tsx`) is six marks from the world the films live in: a chart-room gauge, a pen recorder, a split-flap, a card drawer, a sheet rail, a level stack. One 48-unit grid, one stroke weight, one mint part each. Each is placed for what it means, not for variety: the drawer is what is kept, the recorder what is being read, the gauge what it costs, the flap what changes, the rail who does the work, the levels what compounds. Every major section heading carries the mark for the kind of thing it is.

None of them draws itself on. A stroke that animates its dash offset from nothing is entrance choreography and its first state is absent. Each is complete at first paint and then does the slow, meaningless thing the real object would do while nobody is looking. **And it does it continuously:** a mark that rests for most of its cycle is a static mark wearing an animation, which is how the flap and the levels shipped wrong the first time.

**The stack** (`OneAtATime.tsx`), adopted 1 September 2026, is where one row is open and every title stays on screen. It is the touch layer rather than a build or an arrival: nothing here is driven by scroll, nothing is gated behind reaching it, and the whole thing is a real `<details>` group, so a browser runs the accordion with no script loaded and every answer is in the markup either way. Opening a row swaps two panels at once over 200ms with no fade, which is the reference measured frame by frame rather than guessed at. The line down the left is the track's sentence turned on its side: solid above the open row, dashed and drifting below it, which is both what "not opened yet" looks like and the section's ambient layer.

Two rules it deliberately does not break. The numbers sit **inside** the control they label, which is the carve-out the eyebrow ban keeps open for a question number; a number above a heading would be an eyebrow and this is not one. And it is not the retired numbered step rail: that was a scroll journey with an ordering claim, and this is a list the reader's hand drives, in any order, with nothing hidden from anyone who never touches it.

Where it replaced the drum, and why, is in `ObjectionChips.tsx`. The short version: a drum is right for thirty-three short quotes you graze past and wrong for eight questions you look up, and `.mm-drum` was hiding seven answers of eight from anyone without JavaScript.

**The drum** (`useDragDrum.ts`) is the proof carousel, and it is four states in one loop. It drifts when left alone, stops dead and tracks the hand on a pointer down, keeps the speed you gave it and loses it to friction on release, and springs to the nearest card below walking pace. Past either end it resists at a third of the pull rather than stopping, which is what tells a hand where the end is. Haptics tick once per card crossing the centre, on touch, and only while the hand's own action is still playing out.

**Touch**, everything answers the hand within about 100ms. Cards warm their border toward mint and lift one pixel. Chips fill on hover and press down on click. Tabs slide a mint indicator between states. Fork cards draw their tick when picked. Text links draw their underline. Focus-visible always shows the mint outline. A component shipped without hover, press and focus responses is unfinished, exactly as unfinished as a component with no mobile layout.

**Arrival**, sanctioned 29 August 2026. Staggered builds, fades and slides on arrival, reveals that fire once as you reach them. One primitive implements all of it: `src/hooks/useReveal.ts`.

This was banned outright until that date, and the ban had a real argument: a scrubbed build needs no observer, starts from no absent state, and reverses, and a reveal needs all three. It was lifted on Krish's instruction, having been asked for three times. What the ban was also protecting is not lifted, because it was never really about choreography:

**Every revealed element stays readable if the reveal never fires.** Copy here has to work for a crawler that runs nothing, a screen reader, a visitor who asked for reduced motion, and somebody landing halfway down a page from a search result. A reveal whose first state is genuinely absent breaks all four, and breaks them silently, because whoever built it always arrives at the top with a working observer. So the primitive guarantees, and `src/test/reveal-contract.test.tsx` holds, that:

- the DOM is always complete, and only opacity and transform ever change;
- CSS defaults to revealed, so no JavaScript means nothing hidden;
- nothing already on screen is ever hidden, so a mid-page landing is whole;
- a passive scroll pass reveals anything the reader reaches, so a silently broken observer costs nothing at all. This was a two-second timer first, which was wrong twice over: on any real page every element was revealed before the reader had scrolled to one, so no arrival ever happened, and it guaranteed a moment rather than the reader's own position;
- reduced motion hides nothing at all.

`IntersectionObserver` appears in exactly one file, and the contract test holds it there. That is what replaced the old check: the ban was checkable because the observer appeared nowhere, and this is checkable because it appears in one place with the guarantees attached to it.

**An arrival travels on an animation, never on a transition.** `transition` is a single property and every card family worth revealing already owns it for its own hover fade, in `mindmake-instruments.css`, which loads after `mindmake.css` at the same specificity. The card's declaration replaced the reveal's outright and the first three arrivals shipped snapping into place; nothing failed and nothing looked broken, the cards simply appeared. An animation cannot be overwritten by a transition, so the two layers stop competing for one property. The fill mode is `backwards`, which holds the first frame through the stagger delay and then lets go: `forwards` would pin `transform: none` on the element for the rest of the page's life and quietly outrank anything that wanted to move it later.

**A page runs a ground arc, not an alternation.** Three grounds exist: ink, raise and paper. Ink and raise are one step apart at 1.32:1, which is a surface change at a seam and nothing at all across a screen, so a page that alternates only those two for its whole length has no arc and reads as one colour from the hero down. Paper is a full inversion and is the only ground a reader feels arriving. Every page carries at least one, spaced so the light passages break the page into movements rather than sitting next to each other.

Until 30 August 2026 paper was used **once in the entire application**, on one band of `/ai-brain`, and the reason was mechanical rather than editorial: the ground redefined five surface tokens while 64 rules read `--mm-tx2`, 56 read `--mm-line` and 31 read `--mm-ink2` directly, so a section moved onto paper kept its dark cards and turned their headings dark on top of them. Both non-default grounds now redefine the raw palette for their own subtree, which is what `.mm-on-raise` had always done and `.mm-on-paper` had not.

**The accent has two roles and only one of them follows the ground.** `--mm-mint-bright` is the accent as a surface — a filled button, a pressed chip, the marquee band, a resolved bar in a figure — and it always carries `--mm-mint-ink` and stays bright on every ground, because a mint button on paper is still a mint button. `--mm-mint` is the accent as text and line, and a ground may redefine it: #7fe3b4 on cream is 1.2:1. One element runs against the grain of its section, the dark head of a fork band, and it puts the ink palette back for its own subtree.

**Still banned:** progress bars tied to scroll position, whatever they are filling. A bar that fills is a measurement of the reader rather than of anything on the page.

The scrubbed builds above were adopted on 28 August 2026 after the two models were built side by side on the same content and compared, and they remain the default. A build that can be scrubbed should be: it reverses, it needs no observer, and a visitor who never scrolls has lost nothing. Arrival is for the things a scrub cannot express.

Under `prefers-reduced-motion`, the ambient layer falls back to posters and stopped bands, every scrubbed build reports a completed pass, and every arrival is simply already there: the sentence is fully lit, the row is assembled, the figure reads its true number, and parallax flattens. The touch layer stays, with transitions swapped for instant state changes.

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
4. The motion gate: `IntersectionObserver` in one file only, and every revealed element readable with it never firing. Disable JavaScript, then load each page and read it end to end.
5. The aliveness gate: scroll each page at reading pace and confirm every viewport holds something in motion, then crawl every interactive element with a mouse and a keyboard and confirm each answers.
6. The three-second gate: read every headline with its serif payoff, standalone. Then the banned-word and antithesis scans.
7. The board honesty gate: the timestamp renders from the cache date, staleness is labelled past 26 hours, and a failed fetch collapses the section cleanly.
8. Reduced motion: posters, stopped bands, final counter values, and every control still operable.
9. The interaction gate: open the lead dialog and drive one dead end to the offer
   of a person, at 1440 and 390. Every gate above this one measures a page at
   rest, and neither the dialog nor a failure state is on a page at rest: on
   28 August 2026 the whole dialog layout was deleted and shipped with every
   test and every gate passing. `scripts/qa/dialog-shape-check.mjs` and
   `scripts/qa/handoff-check.mjs` are that gate, and anything else that only
   appears after an interaction needs one of its own.

## What a dead end looks like

Nine things on this site can fail, and each one ends in an apology, one dry line
where our own machine is the butt of the joke, and one way to reach a person.
Never the visitor as the butt: a joke at the expense of somebody who has just
been let down is a second insult, and levity is not the point of the panel, the
button under it is.

The shape follows the situation. A **panel** where the road is definitively
closed, so the offer is one click. A **quiet line** where a working retry is
sitting right there, so a second door does not shout over the first. The panel
carries no ground of its own: every colour resolves through the dialog's tone
tokens first and the page's second, so it wears the surface it lands on. The
proposal learned that the hard way, as dark text on a dark ground.

An apology is body copy, not a caption. The dialog had a caption colour and no
secondary-text colour, so the offer's second line sat at 3.4:1 on paper before it
was measured. Both now exist, `--mmb-muted` and `--mmb-fg2`, and the second is
what a sentence uses.
