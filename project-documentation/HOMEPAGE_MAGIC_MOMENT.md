# Homepage Magic Moment

Status: product premise and editorial decision-plate visual direction approved by Krish on 12 August 2026. The company-to-pressure flow mock is ready for visual review. Implementation remains gated.

Last verified: 2026-08-23 — still an unimplemented proposal; Index.tsx has no Decision Underneath tool.

## The call

Build a two-input **Decision Underneath** demonstration.

1. The visitor enters or picks their company.
2. Mindmaker researches the business and offers two or three pressures that are specific to it. The visitor taps the one that feels closest.

Mindmaker then names the business decision underneath that pressure, shows why it may matter now, and gives one useful test. The result ends with `Book a fit call`.

Do not begin with email, LinkedIn, a blank chat box, or a request to explain the problem.

## Why this wins

The first input supplies public truth. The second supplies private recognition.

Public research alone cannot know what is really happening inside a business. A leader's vague sentence alone produces something that feels like ChatGPT. Combining researched company facts with one human tap gives enough truth to make a strong read without asking the visitor to do the diagnosis.

It demonstrates Mindmaker's real job:

> Turn a broad AI pressure into the business decision that needs to be made.

It does not demonstrate automation ideas, a general website audit, or a clever chatbot.

## Options considered

Scores use 1 as weak and 5 as strong.

| Route | Low input | Wow | Different | Trust | Leads to paid work | Can build from the current system | Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| Company plus predicted pressure | 5 | 5 | 5 | 4 | 5 | 4 | 28 |
| One written problem plus an AI reframe | 4 | 3 | 2 | 4 | 4 | 5 | 22 |
| Company-only AI opportunity scan | 5 | 4 | 2 | 3 | 3 | 4 | 21 |
| Public say-do gap detector | 5 | 5 | 5 | 2 | 5 | 2 | 24 |

The public say-do gap route is sharper but too risky. Public evidence cannot reliably show what a team is doing inside the company. It can become part of the deeper `/intake` after the leader supplies private evidence.

## State of use

- A senior leader lands on the homepage between other tasks.
- They may know something feels wrong but not know what to ask for.
- They are likely to distrust a generic AI quiz.
- The experience must work one-handed on a phone.
- The first useful result should arrive in well under 90 seconds.

## The interaction

### State 1: Name the business

Prompt:

> See what AI may be changing in your business.

Input label:

> Company or website

Use the existing company search. Do not ask for an email.

### State 2: Show that Mindmaker understands the business

As soon as the company resolves, paint the company mark beside Mindmaker and show one plain sentence:

> It looks like [Company] makes money by [plain description of the real business model].

This is more useful than repeating the company's tagline. Offer a quiet `Not quite` correction, but do not make correction a required step.

While deeper research runs, show only real completed work:

- Reading what you sell.
- Checking how the business makes money.
- Looking at what has changed recently.
- Testing where the pressure may sit.

Never run a fake progress animation.

### State 3: Ask for one tap

Prompt:

> Which feels closest?

Generate two or three company-specific choices. They must be concrete enough that a leader recognises their situation, but careful enough not to claim private knowledge.

The choices are predicted from the selected company domain. The system first reads the business model, products, public actions, recent changes, and visible market pressure. It then creates the few pressure options most likely to matter to that specific business. The visitor does not choose from a permanent generic list.

Example shape for a media business:

- AI search may weaken the traffic that feeds our current model.
- Our trusted content and data could make more money in a new form.
- We are testing AI, but it is not yet changing how the business grows.

Always offer `Something else` with voice or one short sentence as a fallback.

The pressure choices are not generic Product, Pricing, Positioning, and People buttons. Those are Mindmaker's lenses behind the scenes.

### State 4: The magic moment

Place the result directly under the selected pressure.

The first and largest line is:

> The decision underneath

Then name a real choice, not a topic. A useful decision has at least two paths and a cost to waiting.

Example shape:

> Do you protect the model that works today, or turn your strongest data and knowledge into something customers will pay for before the market moves around you?

Follow with four small parts:

1. **Why this may matter now.** Up to two current, linked facts.
2. **Where the pressure may sit.** Show the relevant parts of Product, Pricing, Positioning, and People as causes, limits, or unknowns. Do not use fake scores.
3. **What may already be valuable.** Name the business's useful data, knowledge, trust, access, product, or distribution that AI could strengthen.
4. **A useful first test.** One action that could reduce uncertainty within 21 days.

Add one honest line:

> What I cannot know from the outside: [the one private fact that would most change this read].

This honesty should increase the desire to speak to Krish. It shows where public AI research ends and Mindmaker's work begins.

### State 5: The business bridge

Use one main action:

> Book a fit call

Support it with:

> Krish will check the read with you and work out whether it is worth solving in a focused Sprint.

After the useful result, offer two quiet secondary actions:

- Download this read.
- Watch this decision for four weeks.

Only ask for an email after the result, when the visitor chooses one of those actions. Keep the watch consent separate from Mindmaker Live.

## Output contract

The result should be generated into a fixed shell. The model supplies bounded fields, not a free-form answer.

```text
company_read
  business_model
  confirmed_public_facts[]
  source_links[]

pressure_choices[]
  label
  reason_for_choice
  four_p_tags[]
  evidence_refs[]

selected_result
  decision_underneath
  paths[]
  cost_of_waiting
  why_now[]
  valuable_assets[]
  contribution_map
    product
    pricing
    positioning
    people
  weak_assumption
  first_21_day_test
  most_important_unknown
```

Every displayed fact must point to a source or to the visitor's selected pressure. Inferences must be written as inferences.

## What the current system already provides

- Company search by name.
- Fast company identity, logo, and colours.
- A plain company description.
- Products, industry, and selected technology signals.
- Recent company news from several providers.
- Source links and confidence information.
- The existing co-brand reveal.
- Voice input, motion, sound, haptics, and reduced-motion support.
- Reasoning patterns for finding the real decision, honest paths, the weak assumption, and a first test.

## What is still missing

The current dossier can support the first reveal, but it is not enough for the full promise. A later build needs a narrow commercial-read function that:

- Reads the company's main product and pricing pages when available.
- Explains how the business appears to make money in plain language.
- Finds current changes that affect that model.
- Creates two or three careful pressure choices.
- Produces the fixed result contract after the visitor's tap.
- Keeps evidence, inference, and the visitor's own signal separate.

It can reuse the current providers and reasoning system. It should not reuse the old automation examples, offer routing, or proposal output.

No Supabase change is authorised by this document.

## Visual direction

Retain the strongest parts of the existing Diagnosis Room rather than replacing them:

- The dark forest room and mint signal colour.
- The company and Mindmaker co-brand reveal.
- The sense that an artefact is being built live.
- Haptic selection and restrained sound.
- One question at a time on mobile.

Change the interaction from chat to a live evidence map.

On desktop, the company and pressure choice sit on the left while the read builds on the right. On mobile, each state takes the screen and the selected pressure folds open into the verdict at the point of the tap.

The visual movement should come from real state change:

- The company mark resolves.
- Checked facts arrive as small source marks.
- Two or three pressure paths form.
- The unselected paths fall away after the tap.
- The remaining path reorganises into the decision and its evidence.

Avoid chat bubbles, glowing orbs, fake typing, generic dashboards, score gauges, and decorative network graphs.

### Visual concept selected for the first mock

Three materially different spines were considered:

1. A constellation map that draws connections between the decision and the four business areas.
2. A live control-room view with a research feed and an analysis panel.
3. An editorial decision plate that assembles evidence, the decision, the unknown, and the test into one premium artefact.

The editorial decision plate wins. The constellation risks generic AI theatre. The control room risks looking like analytics software. The editorial plate can carry strong motion, remain legible, and keep its structure when emailed or printed.

The first visual mock is `prototypes/mindmaker-decision-artifact-v1.html`. It shows the completed result and the email capture state using a fictional company and clearly labelled sample content.

Krish approved this visual direction on 12 August 2026. The same prototype now includes the next material mock at `?flow=1`: company-domain input, an honestly labelled simulated research build, three predicted pressure choices, a short or spoken fallback, and the transition into the approved result.

This prototype deliberately uses one token and component layer for the entry flow and result. The new flow is pending Krish's visual approval. It does not authorise production implementation or live research, storage, email, subscription, or Supabase work.

### Homepage integration direction

The standalone `?flow=1` entry experience is not the approved homepage design system. Krish rejected its familiar AI-site typography and staged screen-by-screen build.

The current homepage integration mock is `prototypes/mindmaker-homepage-component-led-v2.html`. It keeps the editorial decision result, but places the input and result inside a normally scrolling page built from real photographs, redacted CTRL evidence and the existing ink and emerald identity. The free read grows in place. It does not take over the whole page or turn the homepage into an intake form.

The page uses the current public assets only as visual evidence. Its copy, exact typography, layout and motion remain proposed until Krish gives explicit visual approval.

## One final design system

The prototype is visual evidence, not a second production design system.

Implementation must merge the approved visual language into Mindmaker's existing system, then remove the obsolete duplicates. The end state is one set of:

- Brand colour tokens.
- Type tokens.
- Spacing and width rules.
- Borders, rules, paper surfaces, and dark-room surfaces.
- Buttons, fields, tags, source marks, and panels.
- Motion timing and reduced-motion rules.
- Focus, hover, pressed, loading, error, and disabled states.

The canonical production tokens remain in the current Tailwind and global CSS system until a deliberate consolidation changes that source of truth. Do not copy the prototype's raw CSS into a parallel component layer.

Before implementation:

1. Inventory the existing tokens and shared components actually used by public routes.
2. Map every approved prototype primitive to an existing token, an intentional replacement, or a genuinely new shared token.
3. Build shared components from that map.
4. Migrate public surfaces to those components.
5. Remove old components and temporary aliases only after route, responsive, accessibility, and visual checks pass.

Final deduplication checks must reject:

- Brand colours hard-coded outside the canonical token source, except inside approved image assets.
- Two components that perform the same button, panel, tag, source, or modal job.
- Duplicate keyframes or motion timings with different names.
- Page-local versions of shared spacing, type, focus, or state rules.
- Old and new homepage systems both remaining reachable.

## Email and saved artefact

Email appears only after the useful result. The visitor can choose `Email this read` from the artefact header or footer.

The email panel asks for one email address and promises:

- A private responsive link to the same artefact.
- A clean PDF copy for forwarding or keeping.

The four-week Decision Watch is a separate, unchecked choice. Without that choice, the email address is used once to deliver the artefact. Mindmaker Live remains separate and is not silently selected.

The later implementation should:

- Store the result once and render the webpage, email summary, and PDF from the same structured result.
- Use a short-lived signed link or another private token, with no email address or company name in the URL.
- Make the email useful without images, while linking to the full interactive version.
- Include the decision, the honest unknown, the 21-day test, the source links, and the selected pressure.
- Record transactional delivery separately from watch consent.
- Make unsubscribe stop the watch immediately without deleting the saved read.
- Avoid sending a PDF attachment when mailbox or security rules make a secure download link safer. The email can link to the generated PDF in that case.

## Sparse and failure states

If the company cannot be found, allow a website address or a short spoken description.

If research is sparse, say so and use broader pressure choices. Never invent specificity to preserve the effect.

If recent news is weak, omit `Why now` rather than showing old or irrelevant material.

If the system cannot name a sound decision, give the best question to take into the fit call. A careful partial read is better than a polished false one.

## Success test

Test the demonstration with at least:

- A large media company.
- A small creator or publishing business.
- A coaching or consulting business.
- A software company.
- A company with little public information.

It passes when:

- At least four of five leaders say the business description is broadly right.
- At least four of five find one predicted pressure recognisable.
- At least three of five can repeat the decision Mindmaker found in their own words.
- No tester mistakes the result for a general AI opportunity scan or automation audit.
- No displayed fact lacks a source or is presented with more certainty than the evidence allows.
- The full path can be completed one-handed on a phone in under 90 seconds.
- The result makes the boundary between a free read and Krish's paid work clear.

## The sharper alternative

After the main route is proven, the result can offer one optional challenge:

> You said this is the pressure. Public signs point somewhere else. Want to test that?

This begins to demonstrate the say-do gap method. It should not ship in the first version because it needs stronger evidence and carries more credibility risk.
