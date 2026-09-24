# AI Brain route award panel, round one

Date: 15 September 2026  
Rendered candidate: `prototypes/ai-brain-vnext-r1/`  
Rubric: `quality/award-panel/rubric.v1.json`

## Method

The ten assignments were judged separately across desktop and mobile. Judges received only the rendered candidate, neutral rubric, assigned viewports and browser evidence. They did not inspect repository source, owner reactions, iteration history or another judge's result. After the first verdict, only the evidenced failures were corrected and the owning judges rechecked those gates. Visual scores below are the conservative pre-correction values; later pacing, label and landscape-legibility corrections did not lower them.

## Final scorecard

| Surface | Assignment | Score |
|---|---|---:|
| Desktop | Art direction | 8.5 |
| Desktop | Inspiration and originality | 8.6 |
| Desktop | Immersion and interaction | 8.8 |
| Desktop | Buyability and trust | 7.7 |
| Desktop | UX, content and technical | 8.7 |
| Mobile | Art direction | 8.4 |
| Mobile | Inspiration and originality | 8.5 |
| Mobile | Immersion and haptic | 8.7 |
| Mobile | Buyability and trust | 7.7 |
| Mobile | UX, content and technical | 8.7 |

- Desktop surface score: **8.46**.
- Mobile surface score: **8.40**.
- Ten-assignment mean: **8.43**.
- Lowest individual assignment: **7.7**.
- Final band under the repository rubric: **Award shortlist**.

It is not a world-class winner under this rubric: that band requires each surface to reach 8.6 and every judge to reach 8.0.

## Hard gates

| Gate | Final result | Rendered evidence |
|---|---|---|
| Truth | Pass | Prototype status is explicit; company-read copy describes readiness, not a completed operation; the proof claim is no broader than the disclosed founder report. |
| Primary task | Pass | The preview completes and “Continue to the live brief” opens `/ai-brain?start=brain` with the production company step visible. |
| Responsive integrity | Pass | Nine fixtures, including 901/900 boundaries, 834 intermediate, 320 portrait and 844 landscape, have no material clipping, overlap, horizontal overflow or unreachable action. |
| Keyboard and focus | Pass | Menu state is exposed; focus enters, advances, traps and restores logically; invalid fields retain focus; the proof disclosure works by keyboard. |
| Motion safety | Pass | Reduced motion exposes all four decision states as a semantic static sequence, hides paused films and runs no animations. |
| Critical failure | Pass | All rendered controls and the production handoff resolve without runtime or HTTP failure. |

## Failures found and corrected

1. Intermediate drawer type crossed the progress rail. The drawer now uses a three-row layout, container-relative type and a measured 960-pixel composition boundary.
2. The form was initially inert. Empty and malformed input now produces linked recovery; valid input advances through You and the preview.
3. The preview implied a company read without performing one. Status language now describes the live handoff truthfully.
4. The preview ended with only Start again. It now links to the real Brain brief and the browser gate verifies the destination opens.
5. The public proof claim exceeded its disclosed quote. The visible claim is now limited to the founder-reported frequency change and recurring bottlenecks.
6. Reduced-motion mode visually and semantically hid three states. It now renders all four once in a static vertical sequence.
7. The pinned sequence was overlong, mobile state labels were faint and landscape auxiliary type was compressed. The scroll span was reduced and those labels were strengthened.

## Remaining ceiling

There is no P1 or hard-gate blocker. Two commercial limitations keep this below winner territory:

- proof is still a single identity-withheld founder report without independent corroboration;
- the prototype-to-live handoff intentionally saves nothing, so the visitor re-enters their email in the real brief.

Publishing price, duration or a speculative product ladder is not proposed as a score-fixing tactic; the current public product contract deliberately keeps those private.

## Reproduction

- Run `npm run qa:ai-brain-prototype` against the local server on port 4192.
- Expected result: nine viewport records and `"failures": []`.
- Captures: `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1/`.
- Paired review: `prototypes/ai-brain-vnext-r1/review.html`.
