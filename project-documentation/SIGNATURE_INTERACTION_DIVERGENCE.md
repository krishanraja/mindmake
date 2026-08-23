# Mindmaker Signature Interaction Divergence

Status: Decision X-ray visual language accepted; first interaction rejected

Date: 2026-08-23

## Design contract

```text
STATE OF USE: A business leader reaches the homepage on desktop or mobile. They are curious, time-poor and unsure whether their problem is really about AI.
USER + ACTION: The leader sees valuable thinking before typing, gives at most one company input and one tap, understands the commercial decision Mindmaker would test, then sends the result or books a fit call.
GOVERNING RULE: The experience must demonstrate how Krish turns public signs and leader judgement into a sharper commercial decision. It must not look or read like chat.
DATA TRUTH: The mock has fixed sample evidence only. It cannot claim to have researched an entered company. The intended live build will need current public research and explicit source marks.
MATERIALITY: Material signature component.
BRAND + VOICE: Preserve the current Mindmaker wordmark, ink, mint, light contrast, crisp card chrome, cinematic depth, direct voice and plain British English.
AUTHORITY: Local design mock only. No Supabase, CTRL, public site, deployment or production change.
PROOF: First paint must be full and useful. Check desktop 1440 and mobile 390, keyboard, touch, reduced motion, sample, loading, unavailable and result states.
```

## Sanitised brief

Create a homepage interaction that makes Mindmaker's method visible. A visitor should understand that a surface problem such as startup pressure or blocked growth can hide a more important decision about product, pricing, positioning or people. The visitor should do almost no work. The experience should feel intelligent before input, make its evidence legible and end with a useful 21-day test and one important unknown. It must be distinctive without inventing live data, avoid a chat layout, avoid a form beside an empty result panel, avoid oversized copy that creates phantom height and preserve the strongest parts of the current Mindmaker system.

## Three independent concept spines

### Candidate A: Decision X-ray

- Sequencing: A complete worked example is visible on first paint. A mint scan passes over three public signs, which light up and connect to four pressure lenses. One lens opens to reveal the hidden decision and 21-day test.
- User agency: The visitor can scrub the scan, tap a public sign or choose one pressure lens. A company domain later replaces the worked example after real research.
- Primary interaction: Scan and inspect.
- Information structure: Business surface on the left, evidence path in the centre, decision at the exact pressure point on the right.
- State model: Useful sample first, then personal loading, sourced result, unavailable research and retry. No blank state.
- Current-system reuse: Cinematic ink field, mint chrome, flip discovery, source marks, voice, haptics and restrained particle depth.

### Candidate B: The Decision Press

- Sequencing: Public signs arrive as strips of copy. The visitor chooses a pressure. A mechanical press stamps the evidence and prints a one-page decision plate from below.
- User agency: Choose which pressure goes under the press, then pull one lever to print the result.
- Primary interaction: Assemble and press.
- Information structure: Editorial evidence strips above, physical press in the centre, printed decision plate below.
- State model: Worked front page first, then personalised issue, print-in-progress, complete plate and email handoff.
- Current-system reuse: Light publication surfaces, hard ink/mint contrast, Mindmaker Live editorial character and card flip mechanics.

### Candidate C: The Four-P Control Room

- Sequencing: Live signs enter four moving lanes. The visitor reroutes one sign through Product, Pricing, Positioning or People. The system shows how the chosen route changes the question and test.
- User agency: Switch and route.
- Primary interaction: A physical four-way junction.
- Information structure: Signal feed on the left, decision junction in the middle, test and unknown on the right.
- State model: Continuous sample feed, selected route, conflicting evidence, paused feed and sourced company result.
- Current-system reuse: Existing live price ticker, CTRL system proof, animated system lines, mint operational chrome and optional sound.

The three differ on sequencing, agency, primary interaction and information structure. Styling differences are not carrying the divergence.

## Feasibility pass

| Constraint | A | B | C |
| --- | --- | --- | --- |
| Sample is useful on first paint | Pass | Pass | Pass |
| One domain plus one tap in live version | Pass | Pass | Pass |
| Decision sits where the user acts | Pass | Partial, result moves below | Pass |
| Mobile can remain one-handed | Pass, swipe and tap | Partial, press metaphor needs height | Pass, but junction may become fiddly |
| Honest without live research | Pass with clear sample label | Pass with sample edition | Pass with sample feed |
| Can reuse existing React and Framer Motion | Pass | Pass | Pass |
| Does not resemble a generic AI generator | Pass | Pass | Risk, can look like a dashboard |

## Adversarial score

Scores use a five-point scale. Credibility risk is scored with five as safest.

| Candidate | Five-second comprehension | Ownability | Preserves current strengths | Mobile | Data honesty | Build ease | Credibility risk | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A: Decision X-ray | 5 | 5 | 5 | 4 | 5 | 4 | 5 | 33 |
| B: Decision Press | 4 | 5 | 4 | 3 | 5 | 4 | 4 | 29 |
| C: Four-P Control Room | 4 | 4 | 5 | 3 | 4 | 4 | 3 | 27 |

## Call

Build Candidate A as the next material mock. It explains the Mindmaker method most directly, keeps the decision beside the pressure the visitor selects, is alive before input and gives the current flip-card language a more meaningful job.

The sharper alternative is Candidate B. It has more theatre and stronger editorial ownership, but the printed result moves away from the point of action and the physical metaphor becomes taller and more difficult on mobile.

Candidate C is rejected for now. It preserves the operator-system feel but risks looking like another AI control dashboard.

## Relume contribution

Relume's generated consultancy page and style guide remain rejected. The component library was used only to test one structural idea: a compact application shell can keep company identity, evidence navigation and the live decision in one viewport. Its blank main-content pattern was explicitly rejected because the Mindmaker experience must be full and useful on first paint.

## Decision X-ray first reaction

Krish's exact first reaction on 12 August 2026:

> "it looks nice, but I think the UX needs to simplify this drastically, and show it knows their business, it still feels like ChatGPT and still feels like a whole new page rather than an interactive demo"

Classification:

| Owner | Finding |
| --- | --- |
| Product rule | The visitor was asked to operate the four-part method instead of receiving the benefit of it. |
| Interaction | Picking Product, Pricing, Positioning or People felt like prompting a model. |
| Information structure | Evidence, framework and result were all exposed at once. |
| Frame execution | A full page and large result plate made the demo feel like a destination. |
| Data truth | A made-up company could show output shape but could not prove that Mindmaker understands the visitor's real business. |

## Revised product rule

The homepage demo is an inline expansion inside the hero. It has one input and one confirmation:

1. The visitor gives a company website.
2. The demo builds a compact business fingerprint in place: what the company sells, how it earns money and the useful edge it appears to have.
3. The system makes one predicted pressure visible in a single sentence.
4. The visitor confirms or corrects that pressure with one tap.
5. One decision appears directly beside the confirmation.

Product, pricing, positioning and people remain hidden inside the analysis. They are not controls. Long prose, a separate result page, a framework explanation and a chat-shaped answer are rejected.

The local material mock uses Mindmaker itself as the clearly labelled worked example. It may demonstrate the final interaction and information shape, but it must not pretend to research an arbitrary entered domain until the live research layer is connected.
