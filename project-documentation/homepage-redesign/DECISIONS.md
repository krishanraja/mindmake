# Homepage redesign decisions

Append-only record for decisions made during the homepage redesign. A candidate, recommendation or panel preference is not a lock. Only Krish can approve the material rendered surface.

## 2026-09-13, exploration opened

Status: active, not locked.

Decision: stop iterative repair of the current homepage composition and run fresh concept divergence before producing a new mock.

Reason: the current production panel separates strong art direction and originality from materially weaker mobile interaction, commercial clarity and information architecture. Further local polishing would preserve the mechanism causing the gap.

Approval scope: Krish authorised concept and prototype work with “Ok go”. This does not authorise production implementation, commit, merge or deployment.

Revisit trigger: independent concept judging fails the diversity gate or no feasible concept meets the commercial, brand and accessibility invariants.

## 2026-09-13, first concept round rejected

Status: rejected, not locked.

Decision: do not prototype candidates A, B or C.

Reason: both independent judges failed the set's diversity gate. Candidates A and C used the same diagnostic workbench structure under different metaphors. Candidate B was materially different but introduced interaction before route commitment and carried small-screen crowding risk. A winner vote cannot rescue an invalid comparison set.

Revisit trigger: none. Any useful quality must return through a structurally different concept, not a repair of this round.

## 2026-09-13, second concept round selected for prototype

Status: selected for prototype, not approved for production.

Decision: use candidate F, The Threshold Room, as the interaction spine. Use candidate D's causal proof sequence inside the selected route. Use candidate E's physical discipline only as art direction, not as its drawer-based information architecture.

Reason: two fresh judges, in different candidate orders, independently passed the diversity gate and selected F. Both found it the clearest and easiest to buy because Brain and GTM are immediate destinations and the selected route replaces the shared state. Both failed E on short-screen and enlarged-text feasibility. Both failed D on first-viewport density and delayed route clarity.

Rendered interpretation: one contained arrival screen, two adjacent route doors, one decisive light-to-paper transition, one route-specific proof receipt and a progressive Start here drawer. The route is a page state with browser history, not a trapped modal. Production code and the live lead flow are untouched.

Approval boundary: Krish must approve the rendered surface cold before any production implementation. Commit, merge and deployment remain unauthorised.

## 2026-09-13, paired responsive treatments required

Status: active review rule for this redesign.

Decision: every material Mindmake website concept and revision must be presented as a matched desktop and mobile treatment. Essential interaction states must appear in both when they are part of the decision.

Reason: Krish's first reaction to the threshold prototype was positive, followed by the direct instruction to show both mobile and desktop treatments in future. A desktop-only review defers a material design decision and makes mobile quality impossible to judge at the approval wall.

Scope: Mindmake website review artifacts. This does not by itself make the rule cross-venture doctrine.

Revisit trigger: Krish explicitly changes the review format for a named surface.

## 2026-09-13, route typography and prototype delivery corrected

Status: corrected frame-level execution, not a production lock.

Exact reaction: “prototype does not load” and “make sure text never spiders over awkwardly like this screen shot, it should be sized thoughtfully”.

Classification: frame-level execution and presentation reliability. The selected Threshold Room interaction spine is unchanged.

Decision: route display headings use authored semantic line groups, bounded viewport-aware scale, balanced wrapping, normal word breaking and fixed mobile content gutters. Supporting display copy is capped against narrow-screen spidery wrapping. The prototype and its browser suite open directly from the local HTML file rather than depending on a temporary HTTP process.

Acceptance: Brain and GTM headings must stay within the viewport, use no more than three lines, never end in a one-word orphan, and maintain at least 42 percent line-width balance. Key route copy must not produce three consecutive one-word lines. These conditions apply at 1440 by 900, 1024 by 768, 390 by 844, 320 by 568, 844 by 390 and the 200 percent text fixture.

Approval boundary: this correction is shown as paired desktop and mobile evidence. Production implementation, commit, merge and deployment remain unauthorised.

## 2026-09-13, mobile homepage becomes a distinct composition

Status: material same-spine revision in progress, not locked.

Exact reaction: “Nice, I generally like it, but am keen to see what the homepage looks like on mobile” and “without just squashing the desktop version”.

Classification: responsive behaviour and visual hierarchy. This is the first material revision within the selected Threshold Room spine.

Decision: render the mobile homepage opening as its own primary composition while preserving the same product truth, two route choices, route replacement interaction and desktop treatment. Present the revised mobile opening beside the unchanged desktop reference before explaining the design response.

Approval boundary: the revision remains an isolated prototype. Production implementation, commit, merge and deployment remain unauthorised.

## 2026-09-13, homepage direction locked

Status: approved for local implementation, not approved for release.

Exact approval: “looks good, lets move ahead with this.”

Decision: lock artifact `homepage-vnext-r2-mobile` as the homepage direction across desktop and mobile. The lock covers the opening composition, the Brain and GTM route choices, route-state replacement with browser history, the compact route-specific proof state and the Start here drawer or phone sheet.

Locked artifact hashes:

- HTML: `2ba6ee81152deda2ec0148c7d72c3f98279f76607d7d0013d5c3bb695886d780`
- CSS: `f3fdaf5dfad0c6876276c4dcf645f834d6d6b9903bfc368fc92d6bce7a1be093`
- JavaScript: `01be166b2564d54643d7d41eb7b7788a50373c0e9af62ac6b50b0fbb919450b6`
- browser suite: `a2b0257ed72139ea8c7a57b96a79e30ab822bae8989ae19830de94eca3b4be62`

Reason: the revision gives mobile its own composition, makes the two routes immediate, keeps the page bounded, preserves the physical instrument world and avoids reducing the mobile experience to stacked desktop columns.

Carry-forward conditions:

- the approved desktop and mobile renders, hashes and interaction checks are the implementation fidelity contract;
- do not restore a long chapter stack, duplicate explanations, generic cards, an always-open form, desktop-to-mobile stacking or spidery typography;
- production may adapt mechanics to the current application architecture and real lead flow, but any material visual, interaction or meaning change needs a new paired rendered approval;
- no new public claim, price, duration, diary route or additional copy enters through implementation;
- a technically passing build fails this lock if it is denser, more generic, more verbose, less distinctive or weaker on mobile than the approved artifact.

Revisit trigger: the current application cannot reproduce the locked behaviour without a material conflict in product truth, accessibility or the real lead flow. Surface that conflict before changing the concept.

Approval boundary: local production implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, paired review and bottom-chrome safety made enforceable

Status: routine correction within the accepted start-flow spine, awaiting Krish's review.

Exact reaction: “good, but it does underlap the taskbar at the bottom. I also ALWAYS want to see how you design for mobile in EVERY mock, this feature in particular looked horrible previously”.

Classification: frame-level execution and review reliability. The progressive start-flow sequence, content and responsive interaction model are unchanged.

Evidence: the desktop prototype positioned the privacy and recovery line against the browser viewport rather than reserving space for the Codex app's bottom chrome. The 13 September paired-treatment rule existed in this record but had not been made a required review artifact, so a later mock was still presented desktop-first.

Decision: every material mock review opens on a paired desktop-and-mobile review surface and retains direct links to both live treatments. Saved paired evidence is part of the review packet. Responsive validation measures the entire bottom action rail, not only the primary button, against a system-chrome exclusion zone.

Acceptance: the complete action rail remains above the reserved bottom zone with no internal or horizontal overflow at 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390. The revised render measures 48 pixels of bottom clearance at desktop, 28 pixels at 390 by 844, 14 pixels at 320 by 568 and 21 to 22 pixels in shallow landscape.

Approval boundary: `start-flow-vnext-r2` is a revised review artifact. It has not been ported into the production application. Commit, merge and deployment remain unauthorised.

## 2026-09-15, progressive start flow approved for local implementation

Status: approved for local production implementation, not approved for release.

Exact approval: “ok this looks good”.

Decision: lock `start-flow-vnext-r2` as the responsive interaction direction for Start here. The lock covers the company-first progressive sequence, desktop drawer, mobile phone sheet, compact native role selector, full action-rail bottom clearance and paired desktop-and-mobile review requirement.

Implementation boundary: port the approved behaviour into the real LeadBrief while preserving its existing validation, history, recovery and data-handling contract. Implementation may adapt mechanics to the application architecture but may not materially change copy, sequence, composition or responsive behaviour without a new paired review.

Approval boundary: local implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, progressive start flow implemented and locally verified

Status: implemented in the local application, awaiting Krish's paired desktop and mobile review.

Decision: the real LeadBrief now separates Company and You. The work email starts the existing public-company read; first name, last name and the existing eight-part division taxonomy are collected while it runs. The remaining Problem, Time, Brief, verification, retry and recovery contract is unchanged.

Responsive implementation: desktop uses the approved bounded right drawer. Mobile uses a full-width phone sheet. The full eight-option role set remains visible as chips where it fits and becomes a native selector on phones and shorter viewports. This is the smallest production adaptation needed to preserve the approved no-scroll composition without deleting real choices or shrinking controls.

Accessibility implementation: focus enters the first useful field on fine pointers and the step heading on coarse pointers, all page content behind the open drawer becomes inert and hidden from assistive technology, the mobile selector participates in the focus trap, errors remain linked to their fields, Escape closes the drawer and focus returns to the trigger.

Evidence: the focused LeadBrief and route-history suite passes 30 of 30 tests. Typecheck and the production build pass. Lint reports zero errors and the same two pre-existing fast-refresh warnings. The production-flow browser gate passes the company and personal-details states at 1440 by 900, 1024 by 768, 390 by 844, 375 by 812, 320 by 568 and 844 by 390 with no internal or horizontal overflow, no spidery heading, no target below 44 pixels, correct background isolation and the required bottom reserves. Final captures are under `C:\Users\krish\.scratch\mindmake-start-flow-implementation-2026-09-15-r5`.

Repository limitation: the full suite reports 456 passing and 8 failing tests. The failures are in unrelated answer-page content, discoverability metadata and an answer-route duplicate-heading case already present in the wider dirty worktree; none touches the start-flow files or its focused suite.

Approval boundary: local implementation only. Commit, merge, preview deployment, production deployment and public release remain unauthorised.

## 2026-09-15, AI Brain material route mock opened

Status: rendered for paired owner review, not approved for production.

Exact authority: “agreed, go”.

Decision: render the first material AI Brain route as one real decision moving through Prepared, Challenged, Decided and Kept. The interaction demonstrates the crossing from leader judgement to challenged decision to carried work to reusable standard. It does not expose a corpus, product ladder, process diagram or sequence of generic feature cards.

Commercial boundary: use the GTM analysis to make the result tangible, not to publish new offers or unsupported claims. The route retains the approved R-05 proof and the one-paid-proof public model.

Responsive boundary: the paired review is mandatory. Desktop uses a state rail and large decision sheet. Mobile uses a horizontal state control and full-width sheet; it is not the desktop composition stacked vertically.

Evidence: `project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md` records the structural alternatives, feasibility proof, QA targets, hashes and screenshot location.

Approval boundary: the isolated `ai-brain-vnext-r1` prototype is now at the cold owner-reaction wall. `AiBrain.tsx` remains unchanged. No production implementation, commit, merge or deployment is authorised.

## 2026-09-15, AI Brain route accepted and responsive drawer correction required

Status: direction accepted; routine correction and blind re-judging in progress.

Exact approval: “looks good, proceed”.

Exact correction: “there are some visual issues”, with a rendered drawer capture showing the question colliding with the progress rail at an intermediate frame.

Classification: frame-level responsive execution, not a change to the accepted Decision Desk concept.

Root cause: the drawer centred a fixed-height content stack and sized its display type from the page viewport. At intermediate width or compressed height, the overflowing stack rose above its own row and crossed the progress rail. The original QA set sampled either side of the failing geometry without testing the boundary itself.

Decision: make the drawer a three-row grid, keep every screen in normal flow beneath the progress rail, size display type from the drawer container, switch the route composition at its measured 960-pixel space requirement, and add explicit 901, 900 and 834-pixel fixtures. The primary action must also progress or produce linked recovery feedback; an inert button fails the award-panel critical-action gate even inside a prototype.

Acceptance: no rail/title overlap, internal scroll, clipped focus ring, undersized action, bottom-chrome underlap or horizontal overflow across the nine viewport fixtures. Early user scrolling cannot be reset after load. Exactly one decision panel is visually and semantically exposed at a time. Empty and malformed email states focus and announce the error; a valid email reaches the approved You state and a bounded completion state. The proof quote remains hidden until requested.

Approval boundary: this correction may be applied to the accepted isolated prototype and independently re-judged. Production route implementation, commit, merge and deployment remain separate gates.

## 2026-09-15, AI Brain correction clears the independent panel

Status: accepted prototype corrected and award-shortlist eligible; production route unchanged.

Decision: the responsive correction is the new `ai-brain-vnext-r1` reference. In addition to removing the intermediate rail/title collision, it closes the panel's truth, primary-task, focus, motion-safety and critical-action gates. The prototype now hands off to the real Brain brief rather than ending in a preview loop, and reduced-motion users receive all four decision states as static content.

Panel result: 8.46 desktop, 8.40 mobile and 8.43 across ten assignments. Every hard gate passes. The result is Award shortlist under `quality/award-panel/rubric.v1.json`; it is not labelled world-class winner because neither surface reaches 8.6 and the 7.7 commercial assignments remain below the winner's 8.0 individual floor.

Commercial ceiling: the remaining limit is evidence, not interface ornament. The public proof is a truthful but identity-withheld founder report, and the isolated prototype cannot preserve entered details into the live application. Neither limitation authorises invented proof, public pricing, a public duration or a speculative product ladder.

Evidence: `BRAIN_AWARD_PANEL_R1.md`, `BRAIN_CONCEPT_TRACE.md` and `C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1/`.

Approval boundary: no production `AiBrain.tsx` change, commit, merge, preview deployment or production deployment is included in this decision.

## 2026-09-15, accepted AI Brain direction implemented locally

Status: production route implementation complete and locally verified; awaiting paired owner review.

Exact authority: “I like this! continue”.

Decision: replace the long production `/ai-brain` chapter stack with the accepted `ai-brain-vnext-r1` composition. The route now makes one consequential decision tangible through Prepared, Challenged, Decided and Kept, reveals the founder's exact attributed outcome only on request, states ownership once, and opens the real LeadBrief as the approved responsive drawer.

Responsive implementation: desktop retains the state rail and large decision sheet. At the measured boundary mobile recomposes to a horizontal state control and full-width sheet. Compact portrait and shallow landscape have their own type and geometry constraints; this is not the desktop layout collapsed into one column. A paired production review surface lives at `prototypes/ai-brain-vnext-r1/production-review.html`.

Motion implementation: the held decision sequence remains the central scroll build. A slight proof-panel travel and close-block rise carry the build through the later page without adding copy, cards or spectacle. The film plate and drawers retain ambient life. Reduced motion removes the transforms and renders all four decision states as static content.

Performance boundary: the 60-second Film 05 proof is not mounted or fetched by the Brain route. The ownership section uses its poster and the existing lightweight plate drift, preserving life without charging every visitor for a four-megabyte WebM they did not request.

Evidence: `qa:ai-brain-fidelity` passes nine viewports with no failures. The built no-JavaScript gate reports no clipping. Aliveness passes at 390 and 1440. The focused route suite passes 67 of 67. Typecheck, production build and prerender pass; lint has zero errors and the existing two warnings. The full suite returns the pre-existing eight unrelated failures only. Captures are under `C:\Users\krish\.scratch\mindmake-ai-brain-production`.

## 2026-09-15, AI Brain route grid corrected after owner review

Owner correction: “still misalignments, why can't you fix things properly even though I have said this 3+ times now?”

Classification: design-system defect and acceptance-gate defect inside the approved route. The page sections used a 90rem composition while the shared footer retained the site's 1104px container. At 1440 pixels this put the footer 120 pixels inside the closing section's left edge. The existing route gate checked containment and header centring, but did not compare alignment anchors across section boundaries.

Decision: preserve the accepted composition and make `--brain-edge` the single horizontal grid contract for the route's header, hero, decision sequence, proof, ownership section, close and footer. Compact portrait and shallow landscape may change the value of that token, but may not introduce independent outer gutters. Add a deterministic cross-section anchor check with a maximum 2px spread at every supported viewport, plus rendered close-and-footer captures on desktop, mobile, compact portrait and landscape.

Evidence: the original screenshot reproduces the mismatch. After the repair, both the development route and the freshly built output pass all nine fidelity viewports with zero failures. Typecheck and production build pass. Lint reports zero errors and the same two existing warnings. The four dedicated close-and-footer renders were visually inspected. No copy, sequence, motion, drawer behaviour or offer meaning changed.

Approval boundary: local implementation only. No commit, merge, preview deployment, production deployment or public release is authorised.

## 2026-09-15, AI GTM concept reset selects a comparison spine

Status: selected for prototype, not approved for production.

Exact reactions: “surely you can look for yourself and see this is not ready to show me? everything is cut off and falling outside boxes” and “i dont get the awkward text wrapping for hero and sub hero text”, followed by the direction to use live examples and a business-question-anchored news layer.

Classification: the first revision failed responsive execution. The second retained the same explanatory press spine, awkward character-count-led typography and a disconnected signal layer. Two material challenges trigger a fresh concept reset rather than another local patch.

Decision: select The Countermove Table for one paired prototype. A dated market move becomes a fixed evidence boundary. The visitor compares three credible responses and sees Product, Price, Positioning and People change together before one route becomes a customer test. This replaces the rejected rail, tape, press and four-stop scroll sequence.

Evidence: three independent generators produced a visitor-operated signal instrument, a causal scroll crossing and a comparative decision room. Two fresh blinded judges, in different candidate orders, passed the diversity gate and independently selected the comparative concept. Both classified the other two as disguised repetitions of the rejected spine. Full provenance, scores, discarded strengths and synthesis boundaries are recorded in `GTM_CONCEPT_TRACE.md`.

Live-data boundary: the first prototype uses primary-source observations verified on 15 September 2026 and labels dates, sources and limits. It demonstrates a bounded evidence fixture, not an implemented real-time feed. Quiet, stale, unavailable and conflicted states remain required for production.

Responsive boundary: the headline uses authored semantic line groups and one route-wide alignment token. Desktop may show the comparison simultaneously. Mobile shows one response at natural height and never squeezes a desktop matrix into the phone.

Approval boundary: the isolated `ai-gtm-vnext-r3` prototype must be rendered and shown cold in paired desktop and mobile views. Production route implementation, commit, merge and deployment remain unauthorised.

## 2026-09-15, AI GTM Countermove Table clears the review panel

Status: isolated prototype ready for owner review; production unchanged.

Decision: preserve the selected Countermove Table as the AI GTM reference. Three checked market signals each open three credible commercial responses across Product, Price, Positioning and People, then resolve to one customer test. “Market signals” and “Sources checked” are the truthful public labels; the prototype does not claim a live feed.

Correction result: the handoff now retains domain, signal and response; menu-to-drawer focus restores correctly; reduced motion keeps static poster imagery; footer links resolve; buyer, deliverable and paid proof are explicit; evidence metadata and shallow-landscape controls meet the legibility and target floors; and the 960/961 boundary uses one composition.

Panel: SHOW at 8.3 desktop and 8.3 mobile from the rendered award judge, 86/100 desktop and 82/100 mobile from the commercial judge, and A- with no P1 or P2 findings from responsive QA. The deterministic 12-viewport gate passes every signal, response, evidence state, drawer path and reduced-motion state with zero failures.

Production condition: reverify sources by 15 October 2026, make source expiry explicit, and connect preserved context to the real brief. No production implementation, commit, merge or deployment is authorised.

## 2026-09-15, AI Brain r2 demonstrates the living Brain contract

Status: isolated prototype ready for owner review; production unchanged.

Decision: retain the accepted scroll-built decision sheet but replace the abstract Prepared, Challenged, Decided and Kept sequence with Portrait, Map, Evidence and Change. Use the actual synthetic Brain fixture, persistently disclose that boundary, and remove the separate ownership chapter rather than lengthening the page.

Truth correction: the rendered map uses approved Aim, Pattern, Standard and Qualifies vocabulary. The change view separates automatic private portrait, map and retrieval rebuilds from human review for consequential or shared work. Company, person, role and decision persist into a truthful in-place prototype receipt rather than a lossy production jump. The close names one paid proof, a working first version and ownership in the buyer’s accounts. The public proof claims only the founder-reported publishing outcome.

Panel: SHOW at 8.4 desktop and 8.2 mobile from the rendered award judge, 89/100 desktop and 85/100 mobile from the commercial and contract judge, and A with no P1 or P2 findings from responsive QA. The deterministic nine-viewport gate passes all four Brain views, node inspection, proof disclosure, drawer states, focus recovery, reduced motion and paired review with zero failures.

Approval boundary: this decision covers the isolated paired prototype only. Porting it into `AiBrain.tsx`, committing, merging or deploying requires a separate gate.

## 2026-09-16, AI Brain r5 and AI GTM r6 locked for implementation

Status: both paired route prototypes are approved and locked for local production implementation.

Exact approval: “looks great, lock and continue”.

Decision: lock `ai-brain-vnext-r5` and `ai-gtm-vnext-r6` together as the current route references. Their desktop and mobile treatments travel together. The Brain lock includes the actual twenty-node synthetic Brain fixture, its eighteen relationships, the consolidated section title, the dynamically fitted graph and the Decision, Brain, Evidence and Correction sequence. The GTM lock includes five dated market signals, fifteen plain-English response choices, one customer-test resolution, the continuous signal ticker and the full-width mobile response controls.

Judgement rule: every visible control must name the whole choice in language a first-time visitor can understand. Internal strategy shorthand such as “Keep the seat”, “Meter the work” and “Price the result” is prohibited across active product surfaces. If a clear label does not fit, the component changes rather than the meaning being abbreviated.

Evidence: both browser gates pass eight viewports with zero failures. The plain-language gate passes all active targets. Exact artifact, fixture, paired-review and QA hashes are recorded in `quality/ai-brain/approved-vnext-r5.json` and `quality/ai-gtm/approved-vnext-r6.json`.

Carry-forward conditions:

- implementation must preserve the accepted interaction and responsive compositions rather than reconstructing them from screenshots;
- the production lead flow, route history, recovery and data contracts remain intact;
- the Brain fixture remains byte-identical unless a separately approved data revision replaces it;
- no extra explanatory chapter, generic card stack, public price, duration, guarantee or product ladder may enter during the port;
- every production review remains paired at desktop and mobile and must pass the same compact, shallow-landscape and reduced-motion checks.

Approval boundary: local production implementation and verification are authorised. Commit, merge, preview deployment, production deployment and public release remain unauthorised.
