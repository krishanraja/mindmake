# Blind judging protocol

This system judges the public website as an unfamiliar entrant. It does not judge effort, intent, iteration history or repository sophistication.

## Separation

Each of five independent jurors receives only:

1. the public production URL;
2. its assigned surface, viewports and lens from `rubric.v1.json`;
3. this protocol and `submission.schema.json`.

Each juror must use a fresh context. It must not receive previous audits, owner feedback, proposed repairs, source code, internal business documents or another juror's verdict. Each juror returns two specialist scorecards, one desktop and one mobile, using its assignments in `rubric.v1.json`. A submission that cannot make the four blindness attestations is invalid, not discounted.

## Required judging sequence

1. Begin at `/` with storage, cookies and cache cleared.
2. Observe the first load without interacting. Record what is understood after 10 seconds.
3. Attempt to answer: what is this, who is it for, what can I buy and what should I do next?
4. Follow the primary route far enough to understand the proposed exchange. Do not submit a real form.
5. Traverse the complete homepage at every assigned viewport.
6. Inspect the two primary offer routes, proof route, FAQ and contact route when relevant to the assigned lens.
7. Exercise menu, primary CTA, overlays, disclosures, filters and keyboard path where relevant.
8. Judge only observable production behaviour. A source-code hypothesis is not evidence.
9. Score every assigned dimension independently before writing the summary.
10. Return two schema-valid JSON submissions, one for each assigned surface. Every score requires route, viewport, observation and a concrete raise condition. Only a hard gate's named owners certify it; other jurors may include advisory gate evidence, but it does not affect eligibility.

Under rubric v2, each juror must also inspect the smallest relevant unit of failure: individual line breaks, label alignment, content reserves, touch behavior, transition endpoints, recovery states and the consequence of every visible control. A broad positive impression cannot override a concrete hard-gate failure.

## Scoring discipline

- Use one decimal place.
- A 7 is strong professional work, not a polite default.
- A 9 requires exceptional resolution across the full assigned lens, not one impressive moment.
- Do not increase a score because the site is ambitious or content-rich.
- Do not reduce a score merely because the aesthetic is not personally preferred.
- Penalise the observable consequence: confusion, delay, distrust, genericity, fatigue, inaccessibility or technical failure.
- Keep mobile and desktop evidence separate. Do not let one surface inherit the other surface's strengths.
- Haptic quality means tactile response, direct manipulation, physical continuity and appropriate feedback. Vibration is neither required nor automatically valuable.

## Aggregation

`scripts/qa/award-panel-aggregate.mjs` recomputes each judge score from its weighted dimensions. It does not trust a self-reported overall score.

Each surface score is the mean of its five specialist scores. The site score is the lower of mobile and desktop. The weaker surface controls because a world-class website cannot abandon one intended context.

The highest award band whose thresholds are all met wins. A failed or inconclusive hard gate from one of its named owners makes the relevant surface ineligible for the three award-ready bands. All ten valid scorecards from all five independent jurors are required for a final verdict.

## Human calibration

The panel is an adversarial decision aid, not a substitute for human taste. When all mechanical and blind judging gates pass, Krish supplies the final personal response to the rendered surface. Human preference cannot override a hard failure, and model consensus cannot certify Krish's taste.

This blind panel is deliberately only one half of release judgment. A separate continuity panel receives `quality/website-redesign/continuity-contract.v1.json` and checks the accumulated owner rulings and known regressions. Blind jurors must never see that contract. Continuity guardians must never disclose their verdicts to blind jurors. Release requires both panels, deterministic gates and Krish's material visual approval.
