# Homepage concept trace

This record makes the reset reproducible. It does not turn a judge preference into owner approval.

## Brief

- Sanitised brief: `SANITIZED_BRIEF.md`
- Brief revision: 2026-09-13
- SHA-256: `ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc`
- Production reference revision: `2d8caff1874b4b568fa89980304f736b81b05d07`

## Divergence round one

- Generator outputs: candidates A, B and C in `candidates/`.
- Result: rejected before rendering.
- Pairwise finding: two independent judges found A and C to be the same diagnostic workbench structure with different metaphors.
- Reset decision: a second generator round received three missing structural territories instead of revision notes on the first concepts.

## Divergence round two

| Generator | Candidate | Territory | SHA-256 |
|---|---|---|---|
| `concept_proof_object` | D, The Proof Bench | proof as navigation object | `038a7e552051ac1ec303534e5fe0d01f5a5095487cac707000cb802094cb4d4a` |
| `concept_spatial_object` | E, The Decision Cabinet | one bounded spatial object | `998f4dc2efd7267b9d9c3a88f394c089adfac93992dfab897cffcb9784ee5b8d` |
| `concept_decisive_transition` | F, The Threshold Room | immediate route destinations and decisive replacement | `99255b9a03680bb1c629dab42f1045b5722449daf82cda8e3a16348790c9aa21` |

Pairwise distance passed in both verdicts:

- D versus E differs on the proof inspection sequence, free-order agency, primary control, page structure and retained state.
- D versus F differs on proof-first versus route-first sequencing, manipulation versus commitment and scrolling continuation versus replacement state.
- E versus F differs on free-order compartment inspection versus one consequential route choice, persistent spatial map versus a dedicated destination and mutually exclusive drawers versus route history.

## Independent judging

| Judge | Candidate order | Winner | Runner-up | Diversity | SHA-256 |
|---|---|---|---|---|---|
| `judge_three` | E, D, F | F | E | pass | `3ca1830a509c86819d5d64bbcd223f56009bc3b2a55a086d5c02761cdcee11e6` |
| `judge_four` | F, E, D | F | D | pass | `cc93191de03861931c4cff56656d9c63c9556f5e87a2cbfe327c94a0c16a1fb9` |

Disguised repetition finding: E risked recreating the rejected diagnostic workbench through a central content switcher. D risked restoring the rejected long chapter continuation and repeated door group. F remained distinct only if the selected route replaced the shared state and its chamber stayed compact.

Constraint regression finding: both judges failed E on 320 by 568, 844 by 390 and enlarged-text feasibility. Both failed D on first-viewport information density and route clarity. F passed subject to rendered proof of adjacent labels, history, focus behaviour and small-screen fit.

Discarded strengths to restore: the private-observatory atmosphere, archival imagery, confident Archivo and Newsreader contrast and one meaningful light-to-dark transition. The long chapter stack, delayed action, repeated choice state, dense proof and hidden controls stay discarded.

No tiebreaker was required because both fresh judges selected F and passed the set's diversity gate.

## Selected synthesis

- Spine: candidate F.
- From D: one compact, route-specific causal receipt showing standards or expertise in, a working object and the observed result. No drag control and no sticky afterlife.
- From E: walnut, brass, paper and fixed spatial discipline. No cabinet dashboard and no drawer-based homepage navigation.
- Opening state: practice, buyer, plain distinction, Brain and GTM and the shared paid-proof line in one viewport.
- Route state: route-specific heading, one distinction, one approved outcome, what remains working and one Start here action.
- Start state: a right-side drawer on larger screens and full-screen sheet on phones, with one question at a time. Prototype data stays local and nothing is sent.

## Feasibility and rendered evidence

- Isolated artifact: `prototypes/homepage-vnext/`, not imported into the application.
- Artifact revision: `homepage-vnext-r2-mobile`, 2026-09-13.
- HTML SHA-256: `2ba6ee81152deda2ec0148c7d72c3f98279f76607d7d0013d5c3bb695886d780`
- CSS SHA-256: `f3fdaf5dfad0c6876276c4dcf645f834d6d6b9903bfc368fc92d6bce7a1be093`
- JavaScript SHA-256: `01be166b2564d54643d7d41eb7b7788a50373c0e9af62ac6b50b0fbb919450b6`
- Browser suite: `scripts/qa/homepage-prototype-check.mjs`.
- Browser suite SHA-256: `a2b0257ed72139ea8c7a57b96a79e30ab822bae8989ae19830de94eca3b4be62`.
- Render targets: 1440 by 900, 1024 by 768, 390 by 844, 320 by 568 and 844 by 390.
- Passed checks: one-screen opening state, no horizontal overflow, both route actions in the first viewport, mobile-specific stacked route controls, mobile claim-to-control separation, minimum 44-pixel targets, Menu in natural Tab order, overlay focus trap, focus restoration, route history, Escape, reduced motion, 200 percent text reflow, route-heading line count, one-word orphan prevention, line-width balance and spidery text-flow prevention.
- Presentation path: direct local file URL, with no temporary server dependency.
- Repository checks: all concept and verdict schemas pass; `git diff --check` passes; the production typecheck, client build, SSR build, sitemap, llms and prerender pipeline completes.
- Screenshot evidence: `C:/Users/krish/.scratch/mindmake-homepage-vnext/`.
- Paired review evidence: `homepage-vnext-r2-desktop-1440x900.png`, `homepage-vnext-r2-mobile-390x844.png` and narrow-state `homepage-vnext-r2-mobile-320x568.png`.
- Production application at the approval point: unchanged by the prototype.

## Local production port

- Ported after Krish's explicit approval, without commit, merge or deployment.
- Production root: `src/pages/Index.tsx`, SHA-256 `b826ad851da6bff07d3a3972d86d5ad904ddea421b47c944e8965735738b8f78`.
- Isolated homepage system: `src/styles/mindmake-home-vnext.css`, SHA-256 `3af07ac577fc093164986ab6b469bdf09a2f046d1bbe6657d2aa62506ed09391`.
- Fidelity contract: `quality/homepage/approved-vnext-r2.json`, SHA-256 `a1e46f9ee2e2ea2c41825b458eafa31fc156d56a02d9e5609b77042154670eb2`.
- Production browser gate: `scripts/qa/homepage-fidelity-check.mjs`, SHA-256 `32e000a255f26386b4e5613d94531b4e9060b2519b9797742bdda24f39602869`.
- The simplified prototype Start state was not copied. The approved interaction now opens the existing lead journey as a right drawer on larger screens and a full-screen sheet on phones, with the chosen Brain or GTM route carried into it.
- The homepage is deliberately immediate and no longer waits behind the long-form route curtain. The entrance gate and homepage fidelity gate enforce that distinction.
- Built-output evidence: `C:/Users/krish/.scratch/mindmake-homepage-production/`.

## Revision count

- Concept reset rounds: two. The first was rejected; the second selected one spine.
- Post-selection material spine revisions: one. The mobile opening became a distinct full-viewport composition; the selected interaction spine and desktop treatment are unchanged.
- Render correction cycles: three, limited to hidden-state CSS, short-landscape fit, enlarged-text reflow, route-title composition and file-based presentation reliability.

## Approval state

Approved by Krish for local implementation on 13 September 2026 with “looks good, lets move ahead with this.” The approved scope is artifact `homepage-vnext-r2-mobile` across desktop, mobile, route replacement and Start here drawer or phone sheet states. Commit, merge, preview deployment, production deployment and release remain separate gates.
