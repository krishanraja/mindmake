# Mindmake World-Class Website Panel

This folder owns the versioned quality standard for judging the public website. It exists so neither the builder nor one reviewing model can invent the standard after seeing the work.

`rubric.v2.json` is the active rubric. It raises the world-class threshold and adds explicit scrutiny for high-value real estate, cognitive pacing, micro-layout integrity, intelligent action consequences and signature delight. `rubric.v1.json` remains immutable for historical runs. Set `MINDMAKE_AWARD_RUBRIC` to the repository-relative or absolute rubric path only when validating or aggregating an older run.

The panel has five independent jurors. Each returns one desktop and one mobile specialist scorecard, giving ten scored lenses:

- art direction;
- inspiration and originality;
- immersion, interaction and haptic quality;
- buyability and trust;
- UX, content and technical quality.

The rubric synthesises current public criteria from The Webby Awards, Awwwards, CSS Design Awards and WCAG, then adds the commercial test an awards rubric usually misses: can a qualified visitor understand and begin buying the product?

## Commands

```sh
npm run qa:award-panel:validate
npm run qa:award-panel:capture -- --url https://mindmake.co --run-id 2026-09-12-production
npm run qa:award-panel:aggregate -- artifacts/award-panel/2026-09-12-production
```

The capture command creates a neutral evidence bundle under `artifacts/award-panel/<run-id>/`. That directory is ignored by Git. Each independent juror writes its two JSON files into the `submissions/` folder. Aggregation refuses partial panels, invalid attestations, missing dimensions, missing evidence, duplicate scorecards, incorrect juror assignments or unknown criteria.

Capture refuses to reuse an existing run ID. This prevents old submissions from being silently applied to newly captured evidence. When Playwright's bundled Chromium is unavailable, set `PLAYWRIGHT_CHROMIUM` to the absolute path of the local Chrome or Chromium executable.

## Changing the standard

Create a new rubric version. Do not silently edit a rubric after a site has been judged against it. A changed threshold, judge, weight, source or gate produces `rubric.v2.json` and a new run. Previous runs retain the exact rubric version and SHA-256 hash they used.

The current threshold is intentionally severe. World-class winner requires at least 9.2 on both surfaces, every judge at 8.8 or higher, and every hard gate passed by every judge who assessed it.
