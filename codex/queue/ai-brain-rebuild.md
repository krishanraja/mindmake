---
venture: mindmake
status: queued
---
# /ai-brain rebuilt to match the homepage, with a 3D brain

**Why.** Krish, 2026-11-28: the hero film must play; the brain must look far
better (faceted glass, after the Engram spec) and light up region by region as
each part of the page scrolls in; type arrives as in the scroll-type spec,
reskinned to mind/make; the page shares the homepage's look and UX; far fewer
paragraphs.

**Inputs.** `src/assets/brain/brain.glb` (Meshy image-to-3D via Higgsfield,
Draco), the brain still, `film-02-loop.{webm,mp4}`, `FilmPlate.tsx`,
`useReveal.ts`, `scrollBuild.ts`.

**Build.** See the session plan, Part 2. Regions: North Star, Vision,
Judgement, Taste, Standards, Preferences (the same six the ways cards name).
`/ai-brain#<part>` lights a part on arrival. No WebGL: the still. Reduced
motion: no lean, static pose.

**Gates.** As ways-cards, plus first-second-check (no video under reduced
motion) and a zero-render idle once settled.
