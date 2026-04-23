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
7. `ProofStrip` — three anonymised case studies tagged COHORT-STYLE / ENTERPRISE. Dual CTA below: "Join the next cohort" + "Book an enterprise call".
8. `OperatorsEdge` (v5) — typography-only credential section, dark bg, three proof tiles (Architecture / Optimization / Memory), CTA to Revenue Architecture + secondary link to `/operator`.
9. `SignalDeskPreview` — 6 SIGNAL / NOISE / DECISION / TAKE cards + link to `/signal`.
10. `NervousDecisionMachine` — embedded demo tool (also lives at `/tool`). Footer now points at `/cohort`.
11. `SimpleCTA` — final CTA.
12. `Footer`.

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
| `/signal` | `Signal` | Signal Desk archive with filters + search. |
| `/tool` | `Tool` | The Nervous Decision Machine. |
| `/leaders` | `LeadershipInsights` | **Decision Readiness Diagnostic** (primary URL). |
| `/leadership-insights` | `LeadershipInsights` | Alias. |
| `/builder-economy` | `BuilderEconomy` | Long-form thesis piece. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | Blog index + post. |
| `/faq` | `FAQ` | |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all. |

**Client-side redirects (301-equivalent via `<Navigate replace />`):**
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
- **Enterprise** (dropdown): The Signal Session → `/enterprise#signal-session`, The Revenue Architecture → `/enterprise#revenue-architecture`, All Enterprise → `/enterprise`.
- **Signal** (link): `/signal`.
- **Resources** (dropdown): How I operate → `/operator`, Decision Readiness Diagnostic → `/leaders`, Blog → `/blog`, Builder Economy → `/builder-economy`, Lightning Lessons (external Maven links).
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

Component: `src/components/NervousDecisionMachine.tsx` (used inline on homepage and on `/tool`).
Edge function: `supabase/functions/nervous-decision-machine/index.ts`.
Model: `claude-haiku-4-5-20251001`, max 1500 tokens, system prompt enforces JSON output schema + Krish's voice. 1-hour per-IP rate limit + global request ceiling as a soft circuit breaker. Requires `ANTHROPIC_API_KEY` on the Supabase project.

---

## Pre-Call Qualifier

Component: `src/components/PreCallQualifier.tsx`. Replaces the old ChatBot. Floating pill bottom-right on every page ("Warm up before your call"). 3-step drawer → keyword-classified sprint recommendation → pre-loads consult modal via `SessionDataContext.setQualificationData`. Answers can also be saved to `localStorage` under `mindmaker:pre-call-qualifier` — no email capture.

---

## Signal Desk

- `/signal` (page): filterable archive of SIGNAL / NOISE / DECISION / TAKE cards.
- `src/components/SignalDeskPreview.tsx`: homepage 6-card grid, links to `/signal`.
- Data source: currently sample data inlined in the component. The `get-ai-news` edge function schema is still in place for later extension to TAKE cards (per rebuild brief §3.5).

---

## Homepage Y-fork

`src/components/YFork.tsx`. Two glass-cards side by side:
- **The Cohort** — "Make your AI decisions with 15 other senior leaders." $3,500 per seat. CTA → `/cohort` + "Next cohort: [DATE]".
- **Enterprise** — "Your AI capabilities, translated into revenue." From $15,000. CTA → `/enterprise` + Book a call.

`NewHero`'s secondary CTA "See how I work" smooth-scrolls to `#y-fork`.

The next-cohort label is currently a literal in `YFork.tsx` and `Cohort.tsx`. When Supabase `cohort_dates` is wired up, replace both with a shared data source.

---

## Operator's Edge (v5)

Homepage section: `src/components/OperatorsEdge.tsx`. Dark-bg, typography-only section between `ProofStrip` and `SignalDeskPreview`. Three glass tiles (Architecture / Optimization / Memory). Primary CTA to `/enterprise#revenue-architecture`, secondary muted link to `/operator`.

Dedicated page: `src/pages/Operator.tsx` at `/operator`. Hero → thesis → 5-cluster static agent diagram (14 named agents) → four extractable lessons → commercial crossover → final CTA. OG type `article`. Tracked via `plausible('operator_page_cta_clicked')` on the Revenue Architecture CTA.

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
