# Design and interaction contract

Superseded on 28 August 2026 by the site rebuild.

The binding contract now lives in `project-documentation/DESIGN_CONTRACT.md`. Read it there. It carries the tokens, the three type roles, the three motion layers with their floor and their ban, the component inventory and the acceptance checklist.

This file is kept as a pointer so anything still linking to it lands in the right place.

## What changed, and why

The pre-rebuild contract froze a set of surfaces by hash: the V5 motion study, the Brain and GTM gateway triple, and the V8 homepage mock. It also described a stepped scroll journey system built from `StepJourney`, `StepScene`, `StepFilm`, `CompoundingTimeline`, `WorkingUnderstandingCompare` and `ScrollMark`.

The rebuild retired all of it. The stepped journeys made comprehension depend on watching an animation play out, which the motion law now bans outright, and the frozen prototypes described a cream site whose ground the rebuild replaced with ink. The prototypes are preserved in git history rather than on disk.

Two rules from the old contract survive in the new one, restated rather than deleted:

- Motion has to earn its place by clarifying the message or the interaction. Movement added only for decoration is a regression. The rebuild adds the equal and opposite rule: a still viewport is also a regression.
- Mobile is recomposed, not shrunk, with 44 by 44 pixel minimum touch targets and one shared content edge.

The eyebrow ban is the one rule the rebuild deliberately replaced. Small mono labels are now a named type role: they name an object, a control, a value or an axis, and they are what make the live surfaces read as instruments. They are still never decorative pre-headings above a real heading.
