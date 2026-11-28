---
venture: mindmake
status: built-by-claude
built_on: claude/relaxed-goodall-qzhcbj
---
# Ways cards on the homepage

**Why.** One proof section instead of three (Krish, 2026-11-28): "Ways an AI
brain can level you up." with "you" underlined, a rail of tilt cards that turn
over like a holo card. Fronts bright and beautiful, backs fun to read, all in
the brand.

**Inputs.** `src/assets/ways/ways-*-r01-800.webp` (GPT Image 2.6, Higgsfield,
job ids in the closeout note); the vividsites Tilt Card and Holo Card
snippets; `src/data/useCases.ts`, `src/data/examples.ts`.

**Build.** `src/data/ways.ts`, `src/lib/tiltCard.ts`,
`src/styles/vs-tilt-card.css`, `homepageSections.ts` `#ways` and `#words`.
Fronts under ten words and never more than two lines at 360, 390, 1280, 1440.
Both faces one size. House faces only.

**Gates.** typecheck, lint, unit suite, build, qa:line-breaks (flips every
card), qa:card-contrast (card fronts), qa:homepage-release:pre-merge,
qa:approved-routes.
