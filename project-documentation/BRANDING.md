# Branding

**Last Updated:** 2026-06-29

---

## Brand Position

**The anti-consultancy for leaders who are done being sold AI and ready to use it.**

Mindmaker is a capped advisory practice: a small number of engagements a year. Two of them. The Handover rebuilds how a business decides and sells over six weeks, then ends. The Teardown takes one real decision apart in ten business days, and is the gate for the Handover. Every engagement has a fixed scope, a published price and a finish line. Nothing ongoing.

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

---

## Brand Voice

**Confident + Cynical + Helpful**

Your smartest, most cynical friend who runs AI transformation every day and genuinely loves building things.

- **Confident**, not arrogant
- **Cynical**, not negative
- **Helpful**, not pushy
- **Premium** through substance, not stiffness
- **Operator-led**, not advisor-led. Krish has run P&Ls and runs a live 14-agent OS

---

## Tone Attributes

### What we are
- **Direct**. name the decision, don't dance around it
- **Cynical**. we've seen every vendor pitch; we know what's real
- **Specific**. "10–15 seats", "30 days", "$60–100k", not "enterprise engagements"
- **Finish-line honest**. every offer has a fixed end, and we say so
- **Premium without stiffness**. confident prose, no corporate rigor mortis

### What we're not
- **Corporate**. no buzzwords, no "leverage", no "transformation", no "synergy"
- **Salesy**. no hype, no FOMO, no artificial urgency
- **Academic**. no jargon, no theoretical frameworks
- **Fractional**. we never position as fractional capacity

---

## Framework Language

**Mind Set → Mind Map → Mind Make**, the core framework, unchanged, used everywhere.

| Phase | Meaning | Outcome |
|---|---|---|
| Mind Set | Clarity | Cut the noise. Know what matters. |
| Mind Map | Leverage | Build your edge. Multiply what you're good at. |
| Mind Make | Direction | Decide. Ship. Measure. |

---

## CTA Language

**Primary CTA everywhere:** **"Book a call"**

No conditional labels. No "What's your nervous decision?" (retired, it tested as too therapist-y for enterprise buyers). No "Start the Conversation". Just "Book a call", which opens the **Diagnosis Room (Mindy)** via the `openDiagnosisRoom` event. `ScopingModal` (`openScopingModal`) is the secondary booking surface, still used on the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` homepage cards, and `/case-studies`. (`InitialConsultModal` / `openConsultModal` is legacy, retained only for `/alumni`.)

**Cohort-specific direct CTA:** **"Reserve my seat on Maven"**, points directly at `https://maven.com/mindmaker/the-ai-fluent-executive` for buyers who already know the cohort is the right fit and want to skip the consult call.

**Supporting CTAs:**
- "See the cohort" → `/cohort`
- "Explore enterprise" → `/enterprise`
- "See how I work", secondary hero CTA, links to `/operator`
- "Open the full dashboard →", muted link from homepage `OperatorsBrief` to `/signal`
- "Request a date". Immersion page CTA, opens the scoping modal preselected to "immersion"

---

## Copy Guidelines

### Headlines
- **Name the decision or the commercial symptom**, not the abstract benefit
- **Be specific**. "$2,500 per seat", "10–15 leaders", "30 days", "48 hours"
- **Use concrete verbs**. decide, ship, rebuild, cut, filter, commit
- **Avoid feeling words** as crutches, "calm clarity" is OK once per page, not a refrain

### Body copy
- Short sentences, 15–20 words max
- Active voice. Second person.
- Concrete examples over abstract benefits
- Never promise ROI numbers we can't cite

### Example transformations

| OLD | NEW |
|---|---|
| "1:1 sprint that turns AI chaos into direction" | "A Maven-hosted cohort for leaders making AI decisions. Enterprise sprints for AI products." |
| Any retired offer name | "The Handover" or "The Teardown". Nothing else exists |
| "What's your nervous decision?" (CTA button) | "Book a call" |
| "Chat with Krish" / "Ask Mindmaker" | (chatbot retired; the `PreCallQualifier` that replaced it is now retired too, superseded by the **Diagnosis Room (Mindy)**) |
| "AI Leadership Benchmark" | "Decision Readiness Diagnostic" (`/leaders`, unlinked from nav) |
| "Signal Desk" / "The Brief" / "The Operator's Brief" (as a nav label) | **"Live Intel"** (as the nav label and page H1) |
| "Builder vs Orchestrator" | "AI leaders vs AI products" (the homepage `YFork` that carried this split is now retired, superseded by the Diagnosis Room) |
| A price not in `src/lib/offers.ts` | The published price for that rung, in the currency asked for |
| Any discount, credit or "X% off" | Nothing. There is no published discount |

---

## Word Choices

### Use
- Teardown, Handover, decision, claim, evidence, finish line, capped
- Build, systems, working, deploy, decide, ship, commit, cut, filter
- Clarity, direction, confidence, decision, trade-off, board-ready
- Positioning, pricing, packaging, GTM, commercial, revenue
- Operator, practitioner, in the room, at the P&L
- Specific numbers: "$2,500", "$15k", "$60–100k", "$12k", "10–15 leaders", "14-agent OS", "30 days", "48 hours"
- Maven (when referring to Cohort enrollment, Slack, alumni community)

### Never use
- Transformation, digital, synergy, leverage (as a verb), ecosystem, journey (as a generic noun)
- Innovative, revolutionary, cutting-edge, next-generation
- Fractional (we don't do it, don't even use the word to describe what we avoid, unless explicitly handling the objection)
- "We help you…", prefer "You will…" or the direct verb
- Optimize, enhance, maximize, holistic, paradigm
- "Chat with Krish", "Sprint 4-Week", "Sprint 90-Day", "Builder Economy" (as a Mindmaker product, it's now an external sister domain)
- "Signal Desk" or "The Brief" as a nav label (the live label is **"Live Intel"**)

---

## Terminology Standards

- **The Handover**. Capital H, definite article. Not "the handover engagement", not "the six-week programme".
- **The Teardown**. Capital T, definite article. Not "the audit", not "the diagnostic", not "the assessment".
- **CTRL**. All caps. A separate product on its own site, never a Mindmaker tier and never quoted with a price here.
- **Mindmaker LIVE**. The publication, at `live.themindmaker.ai`. Two formats: **Built** and **Paid**. It has paid tiers, so never describe it as free.
- Never "course", "class", "programme" or "training". Mindmaker does not sell training.

---

## Product Naming

| Engagement | Price (USD) | One-liner |
|---|---|---|
| The Handover | $18,000 / $30,000 / $50,000 by headcount | Six weeks. Then I leave and you keep it. |
| The Teardown | $9,500 | Bring the decision you keep not making. |

Also GBP and AUD, as set prices per market. Canonical source: `src/lib/offers.ts`.


### Retired products and names (do not reference)

- **The AI Decision Cohort**, retired in v6 (May 2026); replaced by **The AI-Fluent Executive**
- **Name → Map → Make**, retired Cohort framework; replaced by **Diagnose → Decompose → Decide → Deploy**
- **3-week Cohort**, retired duration; the Cohort is now 4 weeks
- **maven.com/aimindmaker/ai-decision-intensive**, dead Maven URL; live URL is **maven.com/mindmaker/the-ai-fluent-executive**
- 4-Week Sprint / 90-Day Sprint / Extended Sprint, retired from public site in v4 barbell pivot
- Builder Sprint / Builder Session, retired
- Leadership Lab, retired as a named product
- Portfolio Partner, retired as a named product
- Fractional CAIO, never existed as an offer; `/fractional-caio` redirects to `/enterprise`
- War Room, Strategy Day, Fractional CAIO, and every offer name from the retired six-rung ladder. URLs redirect; the names are in `DECISIONS_LOG.md`

### Builder Economy

The Builder Economy is **not a Mindmaker product**. It's Krish's podcast / creator project at `thebuildereconomy.com`. Reference it via the Resources dropdown and `/builder-economy` redirect (which points externally). Do not position Mindmaker as "arming the leaders of the Builder Economy" on the main site, that was old framing.

---

## The Operator's Edge (v5 credential line)

Mindmaker sits against management consultancies (McKinsey, BCG, Deloitte, Accenture) and AI-strategy boutiques. The differentiator is that Krish is an operator, not an advisor.

Default credential line:
> "Informed by someone operating a real agentic organization, not theorizing about one."

14-agent OS reference is used on `/operator` and the homepage `OperatorsEdge` section. Never referenced as a product or for sale.

**Guardrails on `/operator` and OperatorsEdge:**
- Typography-only. No scrolling logs, no terminal aesthetics, no ASCII art, no live dashboards.
- Every claim passes the CMO-15-second test. If it reads as "too deep in the weeds," cut it.

---

## Email / Communication Style

### Subject lines
- Specific + direct: "Cohort enrolment, next starts July 14, 2026"
- Outcome-focused: "the decision, in writing, with its reasoning attached"
- No clickbait, no FOMO

### Email body
```
[Name],

[Outcome / context in 1 sentence]

[Details in 2–3 short paragraphs]

[Clear next action]

Krish
```

### Signature
```
Krish Raja
Founder, Mindmaker
themindmaker.ai
```

---

## Visual Brand Elements

### Logo usage
- Mindmaker icon (standalone) or full wordmark (with text)
- Use on Ink or white backgrounds
- Minimum size: 120px width

### Color application
- **Emerald (#00D9B6, HSL `171 100% 43%`):** the signature accent, used sparingly. CTAs, accents, highlights on dark backgrounds. (The legacy `mint` token/`#7ef4c2` is retained only as an alias to emerald.)
- **Ink (#0e1a2b):** primary for text and structure
- **Generous white space**. never cramped

The signature accent changed from mint to **portfolio emerald** on 2026-06-29: Mindmaker adopted CTRL's emerald in a brand-cohesion pass so the three sibling products (Mindmaker, CTRL, Make Your Mind Up) read as one house over one MindmakerOS token contract. WHY + full WCAG derivation: `prototypes/brand-emerald-proof.{html,md}`.

### Contrast rule (critical)
**Never use bright emerald (`text-mint` / `text-emerald`) as text on white or light backgrounds** - it fails WCAG, exactly as mint did. For accent text/links on light backgrounds use **`text-emerald-deep`** (`#06746d`, full AA 5.21), or `text-foreground` / `text-ink`; `text-dark-card-*` utilities on dark backgrounds.

Bright emerald is an accent (fills, CTA backgrounds, dark-bg accents, focus ring), not a text color on light surfaces.

### Photography
- Real people, not stock
- Candid, not posed
- Krish headshot in `TrustSection.tsx` and `/operator`

---

## Live Intel: taxonomy

The classified archive on `/signal` uses these four categories:

| Category | Meaning | Example |
|---|---|---|
| **WATCH** | Worth acting on | "Long-context workflows just became viable" |
| **SKIP** | Hype or noise, ignore | "Another AI company raised money" |
| **CALL** | A decision is overdue | "Time to reevaluate your LLM vendor costs" |
| **TAKE** | Krish's opinion / analysis | "80% using AI ≠ 80% using it well" |

Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set. Do not reference the old names.

---

## Brand Don'ts

- Don't oversell, let outcomes speak
- Don't use FOMO or artificial urgency
- Don't use emojis (including in copy on site or in docs unless explicitly requested)
- Don't use exclamation marks, one per page max
- Don't be cute, no puns, no clever wordplay
- Don't apologize, confident in value
- Don't reference retired products (4-Week Sprint, 90-Day Sprint, Leadership Lab, Portfolio Partner, Fractional CAIO)
- Don't position Mindmaker as fractional capacity of any kind
- Don't promise ROI numbers without a verifiable case study behind them
- Don't use "transformation", "synergy", "leverage" (as verb), "journey" (as abstract noun)
- Don't quote a price that is not in `src/lib/offers.ts`, and never convert between currencies
- Don't mention a discount. There is no published one
- Don't label `/signal` as "The Brief" or "Signal Desk" in nav, the label is **"Live Intel"**

---

**End of BRANDING**
