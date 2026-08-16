# Branding

**Last Updated:** 2026-08-16

---

## Brand Position

**The anti-consultancy for leaders who are done being sold AI and ready to use it.**

Mindmaker helps leaders make hard commercial decisions as AI changes their market. There is one public paid offer: a focused, flexible, scoped 21-day Sprint, bought through a fit call. The price is not public. CTRL by Mindmaker is the living Sprint deliverable, not a second offer. Nothing ongoing.

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
- **Specific**. "21 days", "no homework", not "enterprise engagements"
- **Finish-line honest**. the Sprint has a fixed end, and we say so
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

No conditional labels. No "Bring me one real decision" (retired with the old offer ladder). Every main sales action renders the shared `BookFitCall` component (`src/components/BookFitCall.tsx`), which links straight to `BOOKING_URL` from `src/lib/publicLinks.ts` (a Calendly page), opens in a new tab, and fires a `fit_call_clicked` click event. There is no modal, gate or chat surface in front of it. `/start` and `/decision` redirect straight to the same booking URL as pages.

The **Diagnosis Room (Mindy)** is paused and unmounted. Its code may still exist outside the active route tree; do not describe any live CTA as opening it, and do not reference `openDiagnosisRoom`, `ScopingModal`/`openScopingModal`, or `InitialConsultModal`/`openConsultModal` as part of the current buying journey.

**Supporting language:**
- Contact (`/contact`) is for general messages. It does not replace the fit call and should never be worded as an alternative purchase path.
- Mindmaker Live is referenced by its own pill/link to `https://live.themindmaker.ai`, never bundled into fit-call copy.
- Any other supporting CTA copy (e.g. an `/operator` link) must be verified against the live page before use; do not restate retired labels like "See The Handover", "See The Teardown", "For funds and portfolio companies" or "Request a date" — their routes now redirect to `/sprint`.

---

## Copy Guidelines

### Headlines
- **Name the decision or the commercial symptom**, not the abstract benefit
- **Be specific**. "21 days", "one decision", "no homework"
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
| "1:1 sprint that turns AI chaos into direction" | "A focused 21-day Sprint on the one decision that's stuck." |
| Any retired offer name ("The Handover", "The Teardown") | "The Sprint". Nothing else exists as a public paid offer |
| "Bring me one real decision" or "Book a call" (any primary CTA button) | "Book a fit call" |
| "Chat with Krish" / "Ask Mindmaker" / any CTA described as opening the Diagnosis Room | The Diagnosis Room (Mindy) is paused and unmounted. Route the CTA to `BookFitCall` instead |
| "Signal Desk" / "The Brief" / "The Operator's Brief" (as a nav label) | **"Live Intel"** *(unverified for 2026-08-16: `/signal` now redirects externally to Mindmaker Live rather than to an internal Live Intel page, and Navigation.tsx carries no "Live Intel" text label. Flagged for Krish, not changed here as it is outside this pass's offer/CTA scope.)* |
| A published price, a currency switcher, or any figure "in `src/lib/offers.ts`" | Nothing. There is no public price. `src/lib/offers.ts` is legacy and outside the active route tree |
| Any discount, credit or "X% off" | Nothing. There is no published discount |

---

## Word Choices

### Use
- Sprint, decision, claim, evidence, finish line, fit call
- Build, systems, working, deploy, decide, ship, commit, cut, filter
- Clarity, direction, confidence, decision, trade-off, board-ready
- Positioning, pricing, packaging, GTM, commercial, revenue
- Operator, practitioner, in the room, at the P&L
- Specific numbers: "21 days", "no homework", "14-agent OS". There is no public price, so no fee figure is ever typed by hand

### Never use
- Transformation, digital, synergy, leverage (as a verb), ecosystem, journey (as a generic noun)
- Innovative, revolutionary, cutting-edge, next-generation
- Fractional (we don't do it, don't even use the word to describe what we avoid, unless explicitly handling the objection)
- "We help you…", prefer "You will…" or the direct verb
- Optimize, enhance, maximize, holistic, paradigm
- "Bring me one real decision" as a CTA (retired), "Chat with Krish", "Sprint 4-Week", "Sprint 90-Day", "Builder Economy" (as a Mindmaker product, it's now an external sister domain)
- "Signal Desk" or "The Brief" as a nav label (the live label is **"Live Intel"**) — *see the flag on the Live Intel row above; unverified whether this label is still live on any current page*

---

## Terminology Standards

- **The Sprint**. Capital S when naming the offer. The one public paid engagement, at `/sprint`. No public price; bought through a fit call.
- **CTRL** (also "CTRL by Mindmaker"). All caps. The living Sprint deliverable, not a second offer and never quoted with a price here.
- **Mindmaker LIVE**. The publication, at `live.themindmaker.ai`. Two formats: **Built** and **Paid**. It has paid tiers, so never describe it as free.
- Never "course", "class", "programme" or "training". Mindmaker does not sell training.
- **The Handover** and **The Teardown** are retired. See "Retired products and names" below; do not use these as current terminology.

---

## Product Naming

| Engagement | Public price | One-liner |
|---|---|---|
| The Sprint | None. Bought through a fit call | A focused, flexible, scoped 21-day engagement on the one decision that's stuck. |

There is no price table on the public site. Do not quote a figure, a currency, a range or a headcount-based tier anywhere in public copy. `src/lib/offers.ts` still holds the old Handover/Teardown price literals but is legacy code outside the active route tree; it is not a source for current copy.

### Retired products and names (do not reference)

- **The Handover** and **The Teardown**, and the two-offer ladder they formed, retired 2026-08-12 in favour of the single 21-day Sprint (see `DECISIONS_LOG.md`, 2026-08-12 entry). Their old prices and durations (six weeks, ten business days, headcount tiers) are not current and must not be quoted as live. Their routes (`/handover`, `/teardown`, `/capital`) redirect to `/sprint`.
- The entire six-rung ladder that preceded the Handover/Teardown pair, retired in July and August 2026. The named record is in `DECISIONS_LOG.md`, deliberately nowhere else, because most of these docs are indexed for retrieval
- The third-party course platform that used to collect payment, and every URL pointing at it
- 4-Week Sprint / 90-Day Sprint / Extended Sprint, retired from public site in v4 barbell pivot
- Builder Sprint / Builder Session, retired
- Leadership Lab, retired as a named product
- Portfolio Partner, retired as a named product
- Fractional CAIO, never existed as an offer; `/fractional-caio` redirects to `/sprint`
- War Room, Strategy Day, and every offer name from the retired six-rung ladder. URLs redirect; the names are in `DECISIONS_LOG.md`
- The Diagnosis Room (Mindy) and the homepage AI demonstration are paused and unmounted, not retired outright; do not describe either as the current conversion surface

### Builder Economy

The Builder Economy is **not a Mindmaker product**. It's Krish's podcast / creator project at `thebuildereconomy.com`. Reference it via the `/builder-economy` redirect, which points externally to Mindmaker Live. *(Flagged: the previous "Resources dropdown" no longer exists in `Navigation.tsx` — current nav is "The Sprint", "Results", the Mindmaker Live link and Book a fit call, with no dropdown. Confirm with Krish where Builder Economy should be surfaced, if at all, before writing copy that assumes a nav placement.)* Do not position Mindmaker as "arming the leaders of the Builder Economy" on the main site, that was old framing.

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
- Specific + direct: "Your Sprint fit call, confirmed"
- Outcome-focused: "the decision, in writing, with its reasoning attached"
- No clickbait, no FOMO
- No "cohort" language. Mindmaker does not run cohorts; `/cohort` redirects to `/sprint`

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

*Flagged for Krish: `/signal` now redirects externally to `https://live.themindmaker.ai` (`src/App.tsx`), and the component that renders this taxonomy (`src/pages/Brief.tsx`) is not registered in the current route tree. Treat the table below as describing dormant code, not a live page, until confirmed otherwise; left unchanged here because it is outside this pass's offer/CTA scope.*

The classified archive on `/signal` (when live) uses these four categories:

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
- Don't reference retired products (The Handover, The Teardown, 4-Week Sprint, 90-Day Sprint, Leadership Lab, Portfolio Partner, Fractional CAIO) as current
- Don't reintroduce the Handover/Teardown offer ladder, a second booking flow, a sales modal, or an AI gate before the fit-call link
- Don't describe any CTA as opening the Diagnosis Room; it is paused and unmounted
- Don't position Mindmaker as fractional capacity of any kind
- Don't promise ROI numbers without a verifiable case study behind them
- Don't use "transformation", "synergy", "leverage" (as verb), "journey" (as abstract noun)
- Don't quote a public price, a discount, or a currency switch for the Sprint. There is no public price and none of these exist
- Don't label `/signal` as "The Brief" or "Signal Desk" in nav, the label is **"Live Intel"** *(see flag above)*

---

**End of BRANDING**
