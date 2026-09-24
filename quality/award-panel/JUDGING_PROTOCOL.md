# Blind judging protocol

This system judges the public website as an unfamiliar entrant. It does not judge effort, intent, iteration history or repository sophistication.

## Separation

Each of six independent jurors receives only:

1. the matching public production or immutable preview URL;
2. its assigned surface, viewports, route-coverage group and lens from `rubric.v3.json`;
3. the frozen candidate-bound evidence packet, this protocol and `submission.schema.v3.json`.

Each juror must use a fresh execution context with a distinct executor identity. A random token or written attestation alone does not establish independence. The juror must not receive previous audits, owner feedback, proposed repairs, source code, internal business documents or another juror's verdict. Each juror returns two specialist scorecards, one desktop and one mobile, using its assignments in `rubric.v3.json`. A submission that cannot prove the blindness, candidate identity and context requirements is invalid, not discounted.

## Required judging sequence

1. Begin at `/` with storage, cookies and cache cleared.
2. Observe the first load without interacting. Record what is understood after 10 seconds.
3. Attempt to answer: what is this, who is it for, what can I buy and what should I do next?
4. Follow the primary route far enough to understand the proposed exchange. Do not submit a real form.
5. Traverse every route in the judge's `routeCoverage` group. Record a journey trace for each route before scoring.
6. For every major section, state its visitor job, the belief or action it advances, its handoff and whether another section already performs the same job.
7. Inspect the two primary offer routes, proof route, manifesto, Ideas, Answers, FAQ, Contact and legal routes when required by the assigned coverage group.
8. Exercise menu, contextual onward routes, primary CTA, overlays, disclosures, filters and keyboard or touch paths where relevant.
9. Inspect the route in real time. Full-page screenshots support layout inspection but cannot prove pacing, timed transitions, scroll causality or journey coherence.
10. Record at least three adversarial scrutiny findings before scoring. A broad positive impression cannot overwrite a concrete defect.
11. Judge only observable matching-candidate behaviour. A source-code hypothesis is not evidence.
12. Score every assigned dimension independently before writing the summary.
13. Return two schema-valid JSON submissions, one for each assigned surface. Every claim requires matching route, viewport, action, expectation, observation and frozen observation IDs. The complete route group includes representative Blog and Answers detail routes, not only their indexes. Only a hard gate's named owners certify it; other jurors may include advisory evidence.

Under rubric v3, each juror must inspect both the smallest unit of failure and the complete assembled journey. This includes line breaks, contrast, label alignment, content reserves, touch behavior, transition endpoints, recovery states, section purpose, narrative progression, repeated mechanisms, contextual onward routes and the consequence of every visible control.

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

Each surface score is the mean of its six specialist scores. The site score is the lower of mobile and desktop. The weaker surface controls because a world-class website cannot abandon one intended context.

The highest award band whose thresholds are all met wins. A failed or inconclusive hard gate from one of its named owners makes the relevant surface ineligible for the three award-ready bands. All twelve valid scorecards from all six independent jurors are required for a final verdict.

The aggregate also verifies every cited evidence file against its SHA-256 hash and refuses absolute paths or paths outside the immutable run directory. It rejects stale evidence, changed candidates, duplicate or incomplete submissions, unknown or unconsumed observations, reused juror contexts, duplicate executor identities, route/viewport-mismatched claims and duplicate scorecards. Critical-dimension zeroes, unresolved scrutiny, low confidence and incomplete physical-device evidence fail closed.

## Human calibration

The panel is an adversarial decision aid, not a substitute for human taste. When all mechanical and blind judging gates pass, Krish supplies the final personal response to the rendered surface. Human preference cannot override a hard failure, and model consensus cannot certify Krish's taste.

This blind panel is deliberately only one half of release judgment. A separate continuity panel receives `quality/website-redesign/continuity-contract.v1.json` and checks the accumulated owner rulings and known regressions. Blind jurors must never see that contract. Continuity guardians must never disclose their verdicts to blind jurors. Release requires both panels, deterministic gates and Krish's material visual approval.
