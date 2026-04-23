# CLAUDE.md — Mindmaker Repository Guide

**Last Updated:** 2026-04-23
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive**, not prescriptive. For strategic intent, read `project-documentation/mindmaker_rebuild_brief_v4.md` (v4/v5 combined — the barbell pivot + Operator's Edge).

---

## Brand North Star

Mindmaker is the **anti-consultancy for leaders who are done being sold AI and ready to use it**. The voice is confident, lightly cynical, deeply helpful — premium through substance, not stiffness. Stripe's design sensibility meets Anthony Bourdain's authenticity.

Mindmaker is a **barbell**: cohort at the low end, enterprise at the high end, no middle tier. No 1:1 sprints on the public site. No fractional executive roles. No ongoing retainers. No production IT work. Every offer has a fixed scope, a fixed outcome, and a finish line.

---

## Non-Negotiables

### Visual systems
- `src/components/NewHero.tsx` — rotating headline + gradient + looping background video (`/rising-cities.mp4`) + pulsing mint blur. Eyebrow reframe: "Questions I hear every week."
- `src/components/Animations/ParticleBackground.tsx` — global particle field mounted in `Index.tsx`.
- `.glass-card` / `.editorial-card` Tailwind utilities.
- `src/components/InitialConsultModal.tsx` — the single conversion surface. Opened globally via `window.dispatchEvent(new CustomEvent('openConsultModal', { detail: { preselected?: string } }))`.
- Testimonial structure in `src/components/TrustSection.tsx`.

### Technical infrastructure
- Supabase edge functions in `supabase/functions/`:
  - `nervous-decision-machine` (Claude Haiku 4.5 — powers `/tool`)
  - `get-ai-news`, `get-market-sentiment`, `get-model-data`
  - `send-contact-email`, `send-lead-email`, `send-leadership-insights-email`
  - `create-consultation-hold`
- `SessionDataContext` (`src/contexts/SessionDataContext.tsx`) threads qualification data into the global consult modal.
- Design system in `tailwind.config.ts` + `src/index.css`.

### Color WCAG rule (CRITICAL)
- **Never** use `text-mint` on white/light backgrounds.
- Use `text-foreground` / `text-ink` on light backgrounds.
- Use `text-dark-card-*` utilities on dark backgrounds.
- Mint (`#7ef4c2`) is for highlights and CTAs only.

---

## Homepage scroll order

Authoritative source: `src/pages/Index.tsx`.

1. `Navigation` — fixed top, hides on scroll-down via `useScrollDirection`.
2. `NewHero` — rotating headlines + "Book a call" + "See how I work" CTAs. Subheadline: "Cohorts and enterprise sprints that turn AI chaos into direction."
3. `YFork` — "Two ways I work." → `/cohort` ($3,500) vs `/enterprise` (from $15,000).
4. `BigProblem` — existential urgency frame.
5. `TrustSection` — Krish bio, headshot, testimonials carousel.
6. `FrameworkJourney` — three-panel animated MindSet → MindMap → MindMake.
7. `OperatorsEdge` (v5) — typography-only credential section, dark bg, three proof tiles (Architecture / Optimization / Memory), CTA to Revenue Architecture + secondary link to `/operator`. "BEYOND PATTERN RECOGNITION" now the dominant wordmark.
8. `OperatorsBrief` — the Live Intel homepage teaser. Minimal on purpose: a continuous CSS-marquee `PriceTicker` with the canonical 7 models, a rotating plain-English interpretation line underneath (3 takes, 8s cross-fade), a compact Nervous Decision input (via `nervous-decision/Input`), and a muted "Open the full dashboard →" link to `/signal`. No card grid, no blog column — those live on `/signal` only.
9. `SimpleCTA` — final CTA.
10. `Footer`.

Case studies (anonymised, COHORT-STYLE / ENTERPRISE tagged) are merged into `TrustSection`'s carousel. `ProofStrip` and `SignalDeskPreview` are deleted.

Global overlays mounted in `src/App.tsx`:
- `InitialConsultModal` — opened via the `openConsultModal` custom event.
- `PreCallQualifier` — floating pill, 3-step intake → pre-loads consult modal.
- `CookieConsent`.

**Not on the homepage:** VendorLandscape, AINewsTicker, ActionsHub, decision-tool launchers, the ChatBot, the Engine Room / mm-ctrl visualization, or the old TheProblem sprint chooser. All removed per rebuild brief v3.

---

## Pages and routing

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded via `React.lazy`.

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. |
| `/cohort` | `Cohort` | The AI Decision Cohort ($3,500/seat, quarterly). Primary leader surface. |
| `/enterprise` | `Enterprise` | The Signal Session ($15k) + The Revenue Architecture ($60-100k). |
| `/operator` | `Operator` | (v5) How I operate — 14-agent OS credential page. |
| `/signal` | `Brief` | Live Intel — the full dashboard: extended live-price ticker, plain-English interpretation grid, classified card archive (WATCH / SKIP / CALL / TAKE with filters + search), blog column, full Nervous Decision Machine. Route preserved for inbound URLs. |
| `/leaders` | `LeadershipInsights` | Decision Readiness Diagnostic. Unlinked from nav/footer but still reachable by direct URL for deep-links. |
| `/leadership-insights` | `LeadershipInsights` | Alias. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | Blog index + post. |
| `/faq` | `FAQ` | |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all. |

**Client-side redirects (301-equivalent via `<Navigate replace />`):**
- `/tool` → `/signal#decision` (page deleted; decision machine now lives inside the Live Intel dashboard)
- `/builder-economy` → `https://www.thebuildereconomy.com` via `ExternalRedirect` (page deleted; canonical site is the separate domain)
- `/sprints` → `/cohort`
- `/sprint/4-week` → `/cohort?inquiry=1:1`
- `/sprint/90-day` → `/cohort?inquiry=1:1`
- `/builder-sprint` → `/cohort?inquiry=1:1`
- `/war-room` → `/enterprise#revenue-architecture`
- `/strategy-day` → `/enterprise#signal-session`
- `/fractional-caio` → `/enterprise`
- Legacy: `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`.

On `/cohort?inquiry=1:1`: a banner surfaces the 1:1 inquiry-only path for buyers specifically seeking private engagements, without advertising the offer on the main page.

No `/pricing` page — pricing lives in context on `/cohort` and `/enterprise`.

---

## Navigation structure

File: `src/components/Navigation.tsx`. Primary CTA: **"Book a call"** (no conditional label).

- **Cohort** (direct link): `/cohort`.
- **Enterprise** (dropdown): The Signal Session → `/enterprise#signal-session`, The Revenue Architecture → `/enterprise#revenue-architecture`.
- **Live Intel** (link): `/signal`.
- **Resources** (dropdown): How I operate → `/operator`, Blog → `/blog`, The Builder Economy (Podcast) → external `www.thebuildereconomy.com`, Lightning Lessons (external Maven links).

The second top-level link is labelled **"Live Intel"** and points at `/signal`. The Decision Readiness Diagnostic is no longer linked from nav or footer.
- **About** (dropdown): FAQ → `/faq`, Contact → `/contact`, Privacy → `/privacy`.

---

## Pricing (canonical)

| Offer | Price |
|---|---|
| The AI Decision Cohort | $3,500 / seat (or 2× $1,800 split) |
| The Signal Session | $15,000 |
| The Revenue Architecture | $60,000 – $100,000 (scope-dependent) |

Internal (not shown on site): Revenue Architecture floor $60k, ceiling $125k for extended scope; cohort min viable enrollment = 8 seats, cap = 15.

Payment terms (small muted text below price): cohort = "Full payment or 2x split"; Signal Session = "Payment on kickoff"; Revenue Architecture = "50/50 at kickoff and delivery".

---

## The Nervous Decision Machine

Components: `src/components/nervous-decision/Input.tsx` (compact + full sizes) and `src/components/nervous-decision/Artifact.tsx`. Embedded inside `OperatorsBrief` on the homepage and inside `Brief.tsx` at `/signal`. No standalone page — `/tool` has been deleted.
Edge function: `supabase/functions/nervous-decision-machine/index.ts`.
Model: `claude-haiku-4-5-20251001`, max 1500 tokens, system prompt enforces JSON output schema + Krish's voice. 1-hour per-IP rate limit + global request ceiling as a soft circuit breaker. Requires `ANTHROPIC_API_KEY` on the Supabase project.

---

## Pre-Call Qualifier

Component: `src/components/PreCallQualifier.tsx`. Replaces the old ChatBot. Floating pill bottom-right on every page ("Warm up before your call"). 3-step drawer → keyword-classified sprint recommendation → pre-loads consult modal via `SessionDataContext.setQualificationData`. Answers can also be saved to `localStorage` under `mindmaker:pre-call-qualifier` — no email capture.

---

## Live Intel

Renamed from "The Operator's Brief" (previously "Signal Desk") for straightforward nav clarity — this is live model pricing and weekly calls.

- Homepage teaser: `src/components/OperatorsBrief.tsx`. Minimal — continuous marquee `PriceTicker` + rotating interpretation line + compact Nervous Decision input + footer link to the dashboard. No cards, no blog column.
- Full dashboard: `src/pages/Brief.tsx` at `/signal`. Extended ticker, 3-card interpretation grid, the full classified archive with filter pills + search, a blog column, and the full-size Nervous Decision input with example chips.
- Shared: `src/components/PriceTicker.tsx` (CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`). `src/components/nervous-decision/` has `Input.tsx`, `Artifact.tsx`, `types.ts`.
- Model allowlist lives inside `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`. Current canonical set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini. Update here when a new frontier model is worth surfacing.
- Archive page: `src/pages/Brief.tsx` at route `/signal` (URL preserved for inbound). Filter pills for WATCH / SKIP / CALL / TAKE plus search.
- Taxonomy: **WATCH** (worth acting on), **SKIP** (hype / ignore), **CALL** (a decision is overdue), **TAKE** (Krish's opinion). Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.
- Data source: still inlined sample cards for now. `get-ai-news` edge function schema remains in place for eventual dynamic feed.

---

## Homepage Y-fork

`src/components/YFork.tsx`. Two glass-cards side by side, each with a single full-width CTA:
- **The Cohort** — "Make your AI decisions with 15 other senior leaders." $3,500 per seat. CTA → `/cohort`.
- **Enterprise** — "Your AI capabilities, translated into revenue." From $15,000. CTA → `/enterprise`.

`NewHero`'s secondary CTA "See how I work" smooth-scrolls to `#y-fork`. Hero eyebrow reads "DECISION BLOCKERS I HEAR EVERY WEEK".

The next-cohort date is displayed on `/cohort` only. When Supabase `cohort_dates` is wired up, replace the literal in `Cohort.tsx`.

---

## Operator's Edge (v5)

Homepage section: `src/components/OperatorsEdge.tsx`. Dark-bg section between `FrameworkJourney` and `OperatorsBrief`. The heading "Beyond *pattern* recognition" is retypeset to match the FrameworkJourney header scale exactly — `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`, partial-mint treatment on "pattern" only, no drop-shadow glow. Reads as a clear new section via the `WHO YOU'RE WORKING WITH` eyebrow, hairline top border, and gradient background tonal shift. Lead line is the anti-consultant statement (pulled from a top-of-file constant so Krish can edit in one place). Three glass tiles (Architecture / Optimization / Memory) follow. Primary CTA to `/enterprise#revenue-architecture`, secondary muted link to `/operator`.

Dedicated page: `src/pages/Operator.tsx` at `/operator`. Hero (text + `Krish-Headshot.png`) → thesis (looping `ctrl-demo-video.mp4` left of text, no tool names listed) → 5-cluster static agent diagram (14 named agents) → four extractable lessons → `On stage` strip with three `krish-stage-*` images → commercial crossover. Page ends at the crossover CTA. OG type `article`. Tracked via `plausible('operator_page_cta_clicked')` on the Revenue Architecture CTA.

**Design guardrails:** no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards. Every claim must pass the CMO-15-second test.

---

## Voice & tone

### Use
- Build, systems, working, deploy, literacy, decision, sprint, friction.
- Concrete verbs: ship, decide, make, cut, filter.
- Second person, specific numbers.

### Avoid
- Transformation, synergy, leverage, ecosystem, journey (as a noun), revolutionary, cutting-edge.
- Passive voice, vague benefit words ("optimize", "enhance", "maximize").

### Archetype
Your smartest, most cynical friend who runs AI transformation every day and genuinely loves building things. Confident, not arrogant. Cynical, not negative. Helpful, not pushy.

---

## Development notes

- Package manager / build: `npm` + Vite (`vite.config.ts`).
- Lint: `npm run lint`. Build: `npm run build` (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/prerender.mjs`).
- Routing: React Router v6 (`BrowserRouter` in `App.tsx`).
- State: `@tanstack/react-query` + `SessionDataContext`.
- Styling: Tailwind + shadcn/ui components in `src/components/ui/`.
- Theme: `next-themes` with `attribute="class"` (dark mode class-based).
- All CTAs should route through `InitialConsultModal` via the `openConsultModal` event unless the feature explicitly needs its own flow.
- LLM discoverability: `public/llms.txt` + allow-list for GPTBot / ClaudeBot / PerplexityBot / Google-Extended in `public/robots.txt`.

---

## Related documentation

- `project-documentation/mindmaker_rebuild_brief_v4.md` — the v4/v5 brief (barbell pivot + Operator's Edge) that shapes the current site.
- `project-documentation/mindmaker_rebuild_brief_v3.md` — the prior v3 brief, preserved for diffing.
- `project-documentation/EXECUTIVE_SUMMARY.md`, `PURPOSE.md` — brand thesis + positioning.
- `project-documentation/SPRINTS.md` — full sprint library (Builder + Orchestrator tracks).
- `project-documentation/ICP.md` — ideal customer profiles.
- `project-documentation/BRANDING.md`, `VISUAL_GUIDELINES.md`, `DESIGN_SYSTEM.md` — brand + visual systems.
- `project-documentation/ARCHITECTURE.md`, `DEPLOYMENT.md` — technical architecture + deploy flow.

---

**End of CLAUDE.md**
