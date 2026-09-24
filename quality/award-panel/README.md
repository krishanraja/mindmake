# Mindmake World-Class Website Panel

This folder owns the versioned quality standard for judging the public website. It exists so neither the builder nor one reviewing model can invent the standard after seeing the work.

`rubric.v3.json` is the active rubric. It adds independent narrative-and-journey and art-and-design-system ownership, route-level conversion guidance, experiential-duplication and contextual-IA hard gates, executor provenance and claim-to-observation binding. `rubric.v1.json` and `rubric.v2.json` remain immutable for historical runs. Set `MINDMAKE_AWARD_RUBRIC` to the repository-relative or absolute rubric path only when validating or aggregating an older run.

The panel has six independent jurors. Each returns one desktop and one mobile specialist scorecard, giving twelve scored lenses:

- art direction and design-system integrity;
- narrative, storyboarding and complete-journey direction;
- inspiration and originality;
- immersion and device-native interaction;
- conversion architecture and trust;
- UX, accessibility and technical quality.

The rubric synthesises current public criteria from The Webby Awards, Awwwards, CSS Design Awards and WCAG, then adds the commercial test an awards rubric usually misses: can a qualified visitor understand and begin buying the product?

## Commands

```sh
npm run qa:award-panel:validate
npm run qa:award-panel:capture -- --url https://mindmake.co --run-id 2026-09-12-production
npm run qa:award-panel:capture:validate -- artifacts/award-panel/2026-09-12-production
npm run qa:award-panel:aggregate -- artifacts/award-panel/2026-09-12-production
npm run qa:award-panel:status -- artifacts/award-panel/2026-09-12-production
```

The capture command creates a neutral evidence bundle under `artifacts/award-panel/<run-id>/`. It captures all thirteen canonical route patterns, using representative current Blog and Answers detail routes, at the primary desktop and mobile viewports in Chromium, WebKit and Firefox; it adds the full signature-route viewport matrix and records a section-level storyboard inventory. Every passing observation carries hash-verified evidence copied inside that immutable run directory. Each genuinely independent juror writes its two JSON files into the `submissions/` folder. Aggregation refuses partial panels, self-asserted or duplicate executor identities, missing route traces, mismatched route/viewport citations, invalid attestations, missing or altered evidence, missing dimensions, unresolved scrutiny, zero dimensions, duplicate scorecards, incorrect assignments or unknown criteria.

`npm run qa:website-restart` validates the recovery contract and judge definitions only. It never means judges ran. A site has a blind-panel verdict only when a candidate-bound run contains all twelve valid submissions and `award-panel-result.json` exists.

Capture refuses to reuse an existing run ID. This prevents old submissions from being silently applied to newly captured evidence. When Playwright's bundled Chromium is unavailable, set `PLAYWRIGHT_CHROMIUM` to the absolute path of the local Chrome or Chromium executable.

## Changing the standard

Create a new numbered rubric version. Do not silently edit a rubric after a site has been judged against it. A changed threshold, judge, weight, source or gate produces a new rubric file and a new run. Previous runs retain the exact rubric version and SHA-256 hash they used.

The current threshold is intentionally severe. World-class winner requires at least 9.2 on both surfaces, every judge at 8.8 or higher, and every hard gate passed by every judge who assessed it.
