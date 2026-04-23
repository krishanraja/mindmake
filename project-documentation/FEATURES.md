# Features

**Last Updated:** 2026-04-23

---

## Product Offerings

Mindmaker is a barbell: three public offers, no middle tier, every offer with a fixed scope and finish line. Full detail lives in [OFFERS.md](./OFFERS.md).

### 1. The AI Decision Cohort — $3,500/seat
**Status:** Live
**Route:** `/cohort`
**Implementation:** `src/pages/Cohort.tsx`

**For:** Senior leaders (CEO/COO/CFO/CPO/CCO/CMO/GM/VP-level) wrestling with an AI decision.

**Format:** ~5 weeks elapsed — 3 weeks async + 3 live sessions. 10–15 seats per cohort. Quarterly cadence.

**Outcome:** A board-ready position on one nervous decision (1-page decision memo), trade-off analysis, peer network.

**Payment terms:** Full payment or 2× $1,800 split.

The next-cohort date renders literally on `/cohort` for now. When Supabase `cohort_dates` is wired up, replace the literal.

---

### 2. The Signal Session — $15,000
**Status:** Live
**Route:** `/enterprise#signal-session`
**Implementation:** `src/pages/Enterprise.tsx` (anchor section)

**For:** Founders / CEOs / CCOs / CROs / CPOs at companies commercializing AI product or AI-enabled capability.

**Format:** One intensive day (on-site or remote) + 2 weeks pre-work + written thesis delivered within 5 business days after.

**Outcome:** Prioritized commercial thesis (written ~5–10 pages), top-3 commercial problems for next 90 days, clear read on whether Revenue Architecture is warranted.

**Payment terms:** Payment on kickoff.

---

### 3. The Revenue Architecture — $60,000–$100,000
**Status:** Live
**Route:** `/enterprise#revenue-architecture`
**Implementation:** `src/pages/Enterprise.tsx` (anchor section)

**For:** Enterprise buyers ready for a commercial rebuild.

**Format:** 8–12 weeks elapsed. Kickoff workshop on-site; weekly working sessions + async deliverables. Krish-led, no associate model.

**Outcome:** Positioning, pricing, packaging, GTM motion, ICP refresh, 12-month commercial roadmap, board narrative.

**Payment terms:** 50/50 at kickoff and delivery.

---

### Inquiry-Only: 1:1 Engagements

Triggered by `/cohort?inquiry=1:1`. A muted banner surfaces a Contact link. No public pricing, no public page, not promoted. Handled per engagement.

---

## Retired Offers (do not reference)

| Retired | Redirect |
|---------|----------|
| 4-Week Sprint | `/sprint/4-week` → `/cohort?inquiry=1:1` |
| 90-Day Sprint | `/sprint/90-day` → `/cohort?inquiry=1:1` |
| Sprints overview | `/sprints` → `/cohort` |
| Builder Sprint | `/builder-sprint` → `/cohort?inquiry=1:1` |
| Builder Session | `/builder-session` → `/` |
| Leadership Lab | `/leadership-lab` → `/` |
| Portfolio Partner | `/portfolio-program` → `/` |
| War Room | `/war-room` → `/enterprise#revenue-architecture` |
| Strategy Day | `/strategy-day` → `/enterprise#signal-session` |
| Fractional CAIO | `/fractional-caio` → `/enterprise` |

---

## Website Features

### Homepage scroll (`/`)

Authoritative: `src/pages/Index.tsx`. Order:

1. `NewHero` — rotating headlines, eyebrow "Questions I hear every week", looping `/rising-cities.mp4` background, mint pulse, particle background. Primary CTA "Book a call", secondary "See how I work" (smooth-scrolls to Y-fork).
2. `YFork` — "Two ways I work." Card A = The Cohort ($3,500, `/cohort`). Card B = Enterprise (from $15,000, `/enterprise`).
3. `BigProblem` — existential urgency frame.
4. `TrustSection` — Krish bio + headshot + testimonials carousel (COHORT-STYLE / ENTERPRISE tagged).
5. `FrameworkJourney` — three-panel animated Mind Set → Mind Map → Mind Make.
6. `OperatorsEdge` — v5 typography-only credential section ("Beyond pattern recognition"). Three proof tiles (Architecture / Optimization / Memory). Primary CTA to Revenue Architecture, secondary link to `/operator`.
7. `OperatorsBrief` — homepage teaser for The Operator's Brief. CSS-marquee PriceTicker + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted link to full dashboard.
8. `SimpleCTA` — final CTA.
9. `Footer`.

### Global overlays

Mounted in `src/App.tsx`:
- `InitialConsultModal` — the single conversion surface. Opened via `window.dispatchEvent(new CustomEvent('openConsultModal', { detail: { preselected?: string } }))`
- `PreCallQualifier` — floating pill bottom-right. 3-step intake drawer → keyword-classified offer recommendation → pre-loads modal via `SessionDataContext.setQualificationData`. Answers saved to `localStorage` under `mindmaker:pre-call-qualifier`, no email capture.
- `CookieConsent`

### Navigation

File: `src/components/Navigation.tsx`. Primary CTA button: **"Book a call"** (no conditional label).

- **Cohort** (direct link): `/cohort`
- **Enterprise** (dropdown): Signal Session, Revenue Architecture, All Enterprise
- **The Brief** (link): `/signal`
- **Resources** (dropdown): How I operate, Blog, Builder Economy (external), Lightning Lessons (external)
- **About** (dropdown): FAQ, Contact, Privacy

Hides on scroll-down via `useScrollDirection`.

---

## The AI Decision Cohort (`/cohort`)

- Offer detail, curriculum structure, enrollment flow
- Next-cohort date currently literal, future: Supabase `cohort_dates` table
- `/cohort?inquiry=1:1` query param surfaces the private-engagement banner

---

## Enterprise (`/enterprise`)

- Entry point (Signal Session) and flagship (Revenue Architecture) detailed on one page
- Anchor links `#signal-session`, `#revenue-architecture` for deep-links and redirects
- "Informed by someone operating one, not just theorizing about it" credential line reinforces the Operator's Edge

---

## The Operator's Brief (`/signal`)

Renamed from "Signal Desk" to avoid overlap with Krish's separate business, Signal & Noise.

**Homepage teaser (`OperatorsBrief.tsx`):** minimal. PriceTicker (continuous CSS-marquee) + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted "Open the full dashboard →" link.

**Full dashboard (`Brief.tsx`):**
- Extended PriceTicker
- 3-card plain-English interpretation grid
- Classified card archive with filter pills (WATCH / SKIP / CALL / TAKE) + search
- Blog column
- Full-size Nervous Decision input with example chips

**Shared components:**
- `PriceTicker.tsx` — CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`
- `nervous-decision/Input.tsx` (compact + full sizes)
- `nervous-decision/Artifact.tsx`, `types.ts`

**Model allowlist:** `src/hooks/useModelData.ts` exports `ALLOWED_MODEL_IDS`. Canonical set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini.

**Taxonomy:**
- **WATCH** — worth acting on
- **SKIP** — hype / ignore
- **CALL** — a decision is overdue
- **TAKE** — Krish's opinion

Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.

---

## The Nervous Decision Machine

Embedded only — no standalone page. `/tool` redirects to `/signal#decision`.

**Components:**
- `src/components/nervous-decision/Input.tsx` — compact (for homepage teaser) + full (for `/signal`) sizes
- `src/components/nervous-decision/Artifact.tsx` — renders the typed response schema

**Edge function:** `supabase/functions/nervous-decision-machine/index.ts`
- Model: `claude-haiku-4-5-20251001`
- Max 1500 tokens
- JSON output schema enforced in system prompt
- Krish's voice enforced in system prompt
- 1-hour per-IP rate limit + global request ceiling as a soft circuit breaker
- Requires `ANTHROPIC_API_KEY`

---

## The Operator Page (`/operator`)

(v5) Typography-only credential page showing Krish as a practitioner running an actual agentic organization.

Structure: Hero → thesis (no tool names listed) → 5-cluster static agent diagram (14 named agents) → four extractable lessons → commercial crossover. Page ends at the crossover CTA.

**Design guardrails:**
- No scrolling logs
- No terminal aesthetics
- No ASCII art
- No interactive dashboards
- Every claim passes the CMO-15-second test

**SEO:** OG type `article`. Plausible event `operator_page_cta_clicked` tracks clicks on the Revenue Architecture CTA.

---

## The Operator's Edge Section (homepage)

`src/components/OperatorsEdge.tsx`. Dark-bg section between `FrameworkJourney` and `OperatorsBrief`.

- Heading "Beyond *pattern* recognition" (partial-mint treatment on "pattern" only)
- Heading scale matches `FrameworkJourney` exactly: `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`
- Eyebrow "WHO YOU'RE WORKING WITH"
- Three glass tiles: Architecture / Optimization / Memory
- Primary CTA → `/enterprise#revenue-architecture`
- Secondary muted link → `/operator`
- Lead line (the anti-consultant statement) lives in a top-of-file constant for easy single-edit updates

---

## Homepage Y-Fork

`src/components/YFork.tsx`. Two glass-cards side by side.

- **Card A — The Cohort.** "Make your AI decisions with 15 other senior leaders." $3,500 per seat. CTA → `/cohort`.
- **Card B — Enterprise.** "Your AI capabilities, translated into revenue." From $15,000. CTA → `/enterprise`.

`NewHero`'s secondary CTA "See how I work" smooth-scrolls to `#y-fork`. Hero eyebrow reads "Questions I hear every week" (previous "DECISION BLOCKERS I HEAR EVERY WEEK" was normalised).

---

## Decision Readiness Diagnostic (`/leaders`)

**Status:** Live but unlinked from nav and footer. Reachable by direct URL for deep-links and outbound campaigns.

**Routes:** `/leaders`, `/leadership-insights` (alias).

**Flow:**
1. Intro screen with value prop
2. 6 Likert-scale questions (auto-advance)
3. Optional 5-question personalization or skip
4. Generation phase (progress animation, never regresses)
5. Results: Decision Readiness Score + tier, top 3 nervous decisions (curated from answers), recommended next step
6. Collapsible form to unlock full results via email (`send-leadership-insights-email` edge function)

**Tiers:** AI-Leader (80–100), AI-Advanced (65–79), AI-Proficient (50–64), AI-Developing (35–49), AI-Emerging (0–34).

---

## Booking Flow

- Single entry point: `InitialConsultModal` opened via `openConsultModal` custom event
- All CTAs route through this modal (except PreCallQualifier which pre-loads it)
- Stripe $50 hold paused — direct Calendly booking
- Lead enrichment via OpenAI company research in `send-lead-email`
- Email delivery via Resend with exponential-backoff retry

---

## Blog (`/blog`, `/blog/:slug`)

- Blog listing with featured posts
- Individual post pages with SEO metadata
- Responsive, WCAG-compliant dark CTA cards

---

## Edge Functions (live)

- `nervous-decision-machine` — Anthropic Haiku 4.5
- `get-ai-news` — Operator's Brief content (Lovable AI Gateway)
- `get-market-sentiment` — OpenAI
- `get-model-data` — frontier model price and spec feed
- `send-lead-email` — OpenAI enrichment + Resend
- `send-contact-email` — Resend
- `send-leadership-insights-email` — Resend (dual delivery)
- `create-consultation-hold` — Stripe (currently bypassed)

---

## SEO and LLM Discoverability

- Meta + Open Graph on all pages (`SEO.tsx`)
- Structured data (Schema.org JSON-LD)
- `scripts/generate-sitemap.mjs` + `scripts/prerender.mjs` run during `npm run build`
- `public/llms.txt` for LLM summaries
- `public/robots.txt` allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- Plausible event `operator_page_cta_clicked` on Revenue Architecture CTA from `/operator`

---

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md).

Key points:
- **Ink** `#0e1a2b` + **Mint** `#7ef4c2` — the two-color system
- Inter Variable (body) + Space Grotesk Variable (display)
- WCAG rule: never `text-mint` on light backgrounds
- `.glass-card`, `.editorial-card`, `.dark-cta-card` utilities

---

## Retired Features (do not reference)

- ChatBot / "Chat with Krish" / "Ask Mindmaker" — replaced by `PreCallQualifier`
- `/tool` standalone page — deleted
- `ActionsHub` drawer and Interactive decision tools (BuilderAssessment, TryItWidget, AIDecisionHelper, FrictionMapBuilder, PortfolioBuilder) — unmounted
- `VendorLandscape`, `AINewsTicker`, `TheProblem`, `ProductLadder` — replaced
- Engine Room / mm-ctrl visualization — never built for homepage; lives nowhere public
- CTRL as a Mindmaker product — not on site
- Signal Desk naming — renamed to The Operator's Brief

---

**End of FEATURES**
