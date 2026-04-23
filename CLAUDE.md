# CLAUDE.md — Mindmaker Repository Guide

**Last Updated:** 2026-04-23
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive**, not prescriptive. For strategic intent, read `project-documentation/mindmaker_rebuild_brief_v3.md` — the brief that produced the current shape of the site.

---

## Brand North Star

Mindmaker is the **anti-consultancy for leaders who are done being sold AI and ready to use it**. The voice is confident, lightly cynical, deeply helpful — premium through substance, not stiffness. Stripe's design sensibility meets Anthony Bourdain's authenticity.

Mindmaker sells **sprints and blueprints, not calendar hours**. No fractional executive roles. No ongoing retainers. No production IT work. Every offer has a fixed scope, a fixed outcome, and a finish line.

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
2. `NewHero` — rotating headlines + "Book a call" + "See how I work" CTAs.
3. `YFork` — "Two ways I work." → `/sprints` vs `/enterprise`.
4. `BigProblem` — existential urgency frame.
5. `TrustSection` — Krish bio, headshot, testimonials carousel.
6. `FrameworkJourney` — three-panel animated MindSet → MindMap → MindMake.
7. `ProofStrip` — three anonymized case studies.
8. `SignalDeskPreview` — 6 SIGNAL / NOISE / DECISION / TAKE cards + link to `/signal`.
9. `NervousDecisionMachine` — embedded demo tool (also lives at `/tool`).
10. `SimpleCTA` — final "What's your nervous decision?" CTA.
11. `Footer`.

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
| `/sprints` | `Sprints` | Builder + Orchestrator tracks, 4 engagement cards (4-week/90-day × Builder/Orchestrator). |
| `/enterprise` | `Enterprise` | The Signal Session + The Revenue Architecture. |
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
- `/sprint/4-week` → `/sprints#builder`
- `/sprint/90-day` → `/sprints#builder`
- `/builder-sprint` → `/sprints#builder`
- `/war-room` → `/enterprise#revenue-architecture`
- `/strategy-day` → `/enterprise#signal-session`
- `/fractional-caio` → `/enterprise`
- Legacy: `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`.

No `/pricing` page — pricing lives in context on `/sprints` and `/enterprise`.

---

## Navigation structure

File: `src/components/Navigation.tsx`. Primary CTA: **"Book a call"** (no conditional label).

- **Sprints** (dropdown): Builder Sprint → `/sprints#builder`, Orchestrator Sprint → `/sprints#orchestrator`, All Sprints → `/sprints`.
- **Enterprise** (dropdown): The Signal Session → `/enterprise#signal-session`, The Revenue Architecture → `/enterprise#revenue-architecture`, All Enterprise → `/enterprise`.
- **Signal** (link): `/signal`.
- **Resources** (dropdown): Decision Readiness Diagnostic → `/leaders`, Blog → `/blog`, Builder Economy → `/builder-economy`, Lightning Lessons (external Maven links).
- **About** (dropdown): FAQ → `/faq`, Contact → `/contact`, Privacy → `/privacy`.

---

## Pricing (canonical)

| Offer | Price |
|---|---|
| 4-Week Builder Sprint | $18,000 |
| 4-Week Orchestrator Sprint | $18,000 |
| 90-Day Builder Sprint | $60,000 |
| 90-Day Orchestrator Sprint | $60,000 |
| The Signal Session | $15,000 |
| The Revenue Architecture | $60,000 – $80,000 (scope-dependent) |

Payment terms (small muted text below price): sprints = "Payment 50/50 at kickoff and midpoint"; enterprise = "Payment on kickoff, final on delivery".

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
- **1:1 Sprints** — "Your nervous decision, resolved." From $18,000. CTA → `/sprints` + Book a call.
- **Enterprise** — "Your AI capabilities, translated into revenue." From $15,000. CTA → `/enterprise` + Book a call.

`NewHero`'s secondary CTA "See how I work" smooth-scrolls to `#y-fork`.

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

- `project-documentation/mindmaker_rebuild_brief_v3.md` — the v3 rebuild brief that produced this site.
- `project-documentation/EXECUTIVE_SUMMARY.md`, `PURPOSE.md` — brand thesis + positioning.
- `project-documentation/SPRINTS.md` — full sprint library (Builder + Orchestrator tracks).
- `project-documentation/ICP.md` — ideal customer profiles.
- `project-documentation/BRANDING.md`, `VISUAL_GUIDELINES.md`, `DESIGN_SYSTEM.md` — brand + visual systems.
- `project-documentation/ARCHITECTURE.md`, `DEPLOYMENT.md` — technical architecture + deploy flow.

---

**End of CLAUDE.md**
