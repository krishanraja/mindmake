# Branding

**Last Updated:** 2026-08-23

---

## Brand Position

**The anti-consultancy for leaders who are done being sold AI and ready to use it.**

Mindmaker has one public paid offer: a focused 21-day Sprint. Krish studies one important commercial decision, challenges the current view, checks the evidence and makes the call with the client. The client keeps the decision and its reasoning in CTRL, a deliverable the Sprint produces, not a deck that goes stale and not a second product. The scope and fee are agreed after a fit call; the price is not public.

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
- **Specific**. "ten business days", "six weeks", "under two hours of your time", "six a year", not "enterprise engagements"
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

**Primary CTA everywhere:** **"Book a fit call"**

Every main sales action uses `src/components/BookFitCall.tsx`, which links directly to the verified Calendly destination held in `src/lib/publicLinks.ts` (`BOOKING_URL`). There is no `openDiagnosisRoom` event live in the route tree, and no `ScopingModal` / `openScopingModal` secondary booking surface. There is no second booking flow, sales modal or AI gate before Calendly. The Diagnosis Room (Mindy) and the homepage AI demonstration are paused and unmounted.

**Supporting CTAs:**
- Contact is for general messages. It does not replace the fit call.
- "See how I work", secondary hero CTA, links to `/operator`
- "Open the full dashboard →", muted link from homepage `OperatorsBrief` to `/signal`

---

## Copy Guidelines

### Headlines
- **Name the decision or the commercial symptom**, not the abstract benefit
- **Be specific**. "ten business days", "six weeks", "one real decision", "under two hours"
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
| "1:1 sprint that turns AI chaos into direction" | "Six weeks rebuilding how the business decides and sells, and ten business days on one real decision." |
| Any retired offer name | "The Handover" or "The Teardown". Nothing else exists |
| "What's your nervous decision?" or "Book a call" (primary CTA button) | "Bring me one real decision" |
| "Chat with Krish" / "Ask Mindmaker" | (chatbot retired; the `PreCallQualifier` that replaced it is now retired too, superseded by the **Diagnosis Room (Mindy)**) |
| "AI Leadership Benchmark" / "Decision Readiness Diagnostic" | Retired. `/leaders` 301s to `/start`, and the Diagnosis Room does this job now |
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
- Specific numbers: "ten business days", "six weeks", "Day 90", "six a year", "14-agent OS", "under two hours". Actual fees come from `src/lib/offers.ts` and are never typed by hand

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
- **CTRL**. All caps. A deliverable of the Sprint that the client keeps, not a separate product and not a second offer. Never quoted with a price on its own.
- **Mindmaker LIVE**. The publication, at `live.themindmaker.ai`. Two formats: **Built** and **Paid**. It has paid tiers, so never describe it as free.
- Never "course", "class", "programme" or "training". Mindmaker does not sell training.

---

## Product Naming

**The Sprint.** The one public paid offer. 21 days, judgement-led, one important commercial decision. Price is agreed after the fit call and never published. Canonical source: `src/pages/Sprint.tsx`.

CTRL is a deliverable the Sprint produces, kept by the client. It is not a separately named or separately priced product on the public site.

### Retired products and names (do not reference)

- The Teardown and The Handover, the former two-offer ladder with published USD/GBP/AUD prices. Retired 12 August 2026 and unified into the single 21-day Sprint. `/teardown` and `/handover` redirect to `/sprint`.
- Capital, the former "third door" for funds and portfolio companies. Retired 12 August 2026. `/capital` redirects to `/sprint`.
- The Diagnosis Room (Mindy) as the primary CTA, its `openDiagnosisRoom` event, and `ScopingModal` (`openScopingModal`) as a live secondary booking surface. Both are paused and unmounted; the single CTA everywhere is "Book a fit call" via `BookFitCall.tsx`.
- The entire six-rung ladder, retired in July and August 2026. The named record is in `DECISIONS_LOG.md`, deliberately nowhere else, because most of these docs are indexed for retrieval
- The third-party course platform that used to collect payment, and every URL pointing at it
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
