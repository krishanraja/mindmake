# Mindmake design contract

Last updated: 27 August 2026.

The binding design rules for every public Mindmake surface. `MINDMAKE_CANON.md` holds the same rules in business context; where wording differs, the canon wins. This file replaces the retired pre-rebuild `DESIGN_SYSTEM.md` and `VISUAL_GUIDELINES.md`.

## Frozen surfaces

Verify these before and after any change near them.

- `prototypes/mindmake-judgement-thread-motion-study-v5.html` is the approved visual and interaction floor for the homepage opening, working-understanding act, judgement thread and first CTRL proof. SHA-256 `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`.
- The Brain and GTM gateway is a frozen contract: `prototypes/mindmake-brain-gtm-gateway-candidate-7-v2.html` (`5A3F68994BFBD2AF412D95776515CF8F7884150FE49991364DDC680E3B418E42`), `src/components/mindmake/BrainGtmGateway.tsx` and `src/styles/mindmake-gateway.css`, whose current pins live in `src/test/mindmake-public-contract.test.ts`. Wording, composition and the door-separation motion are not a suggestion to reinterpret.
- `src/components/mindmake/ScrollEvidenceMark.tsx` and the homepage evidence mark stay byte-stable; the contract test pins their internals.
- `prototypes/mindmake-homepage-mock-v8.html` remains the breadth reference for routes, proof and content not rebuilt through V5. Where V5 and V8 overlap, V5 wins.

## The eyebrow ban

Eyebrows are prohibited across the whole public design system: kickers, overlines, chapter numbers, decorative counters, status straps, proof badges and small pre-headings above or beside a real heading, under any class name and in any case. If the information matters, make it the heading, normal copy or a functional label attached directly to the object, control, value or axis it names. Two approved exceptions only:

1. The `Pick your starting point` label inside the frozen gateway.
2. The full-bleed background step numeral on the door pages, permitted only where numbered sections form a real sequence of steps. It must never shrink into a small label, kicker or counter.

Every round runs both a source scan and a rendered DOM scan for the banned family.

## The journey system

The door pages are stepped, numbered scroll journeys built on one engine:

- `StepJourney` drives an rAF engine writing `--mm-step-progress`, `--mm-step-p1/p2/p3`; unpinned stages receive complete states, so reduced motion, short landscape, very short portrait, prerender and script-free renders are finished pages.
- `StepScene` composes each step: the full-bleed numeral in its own cropped layer, the copy column, an optional note. `StepFilm` carries real footage through the shared user-controlled media frame (`preload="none"`, pauses off screen); labels naming stable objects sit beside the frame, never over footage.
- `CompoundingTimeline` scrubs Day 30 to 60 to 90 with scroll until the first tap or drag, then belongs to the visitor. Day 30 is the only startable state; 60 and 90 are labelled earned. No prices, no named later periods, no durations for sale.
- The working-understanding comparison (`WorkingUnderstandingCompare`) renders the locked argument as four columns of question/answer pairs closing on the hinge line "Not the understanding." It stacks to a single column on phones with no in-container horizontal scroll.

## Hand-drawn marks

`ScrollMark` is the one annotation primitive (circle, underline, bracket; scroll, step and reveal drivers). Marks are sparing, attach only to stable claim lines, never sit over footage or changing interfaces, reverse with scroll where scroll drives them, and render complete under reduced motion. Movement added only for decoration is a regression.

## Motion doctrine

Motion must change what the visitor understands. Scroll-linked motion reverses when the visitor scrolls back. Reduced-motion mode keeps the same meaning without relying on animation. Fit-screen scenes use the visible canvas below the fixed header; on short or narrow screens the composition changes rather than shrinking controls or hiding copy.

## Mobile doctrine

Mobile is a recomposed experience, not a smaller desktop page.

- One shared content edge from the wordmark through every section; no section invents a new left alignment.
- At 900 pixels wide or below the measured consent notice is top chrome; its rendered height is reserved via `--mm-stage-chrome` until accepted.
- Every control keeps a touch target of at least 44 by 44 pixels.
- Horizontal rails reveal part of the next card, support swiping, keep controls stable and state their end explicitly.
- Headings must not orphan, truncate or form accidental narrow stacks.
- The brief dialog responds to `visualViewport`, the on-screen keyboard and safe-area insets; Back, close, history and Escape behave predictably without retaining private input.

## Voice on the page

British English, short sentences, words a ten-year-old can follow, no em dashes, no `thesis`, no eyebrow-style labels, no public prices, no Calendly or diary links. Every public section must teach something useful, show credible proof or help the visitor make a clearer choice. The company read and everything generated from it is declarative: it never asks the visitor anything or invites a correction.

## Acceptance checklist

For any change to a public surface:

1. Focused route, conversion and disclosure tests; the full suite before merge.
2. Production build (sitemap, llms, prerender) and `tsc` clean; lint no worse than the recorded baseline in `CURRENT_STATE.md`.
3. Desktop and 390-pixel browser checks; both scroll directions; reduced motion; visible focus; no overflow; no browser errors; one-hop redirects.
4. Source and rendered scans for the banned eyebrow family.
5. Containment audit at or under the recorded baseline (the approved gateway door slide only).
6. Frozen-surface hash verification.
7. For V5-covered surfaces, a direct comparison against the approved artifact.
