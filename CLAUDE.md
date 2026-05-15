# CLAUDE.md: Mindmaker Repository Guide

**Last Updated:** 2026-05-15
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive**, not prescriptive. For strategic intent, read `project-documentation/mindmaker_rebuild_brief_v4.md` (v4/v5 combined, the barbell pivot + Operator's Edge). The v6 ladder restructure (May 2026) layered Workshops at the entry rung, renamed the Cohort to "The AI-Fluent Executive" and repriced it to $2,500 over 4 weeks, and added the invitation-only Alumni Pass; see `project-documentation/HISTORY.md` and `project-documentation/DECISIONS_LOG.md` for the full reasoning.

---

## Brand North Star

Mindmaker is the **anti-consultancy for leaders who are done being sold AI and ready to use it**. The voice is confident, lightly cynical, deeply helpful, premium through substance, not stiffness. Stripe's design sensibility meets Anthony Bourdain's authenticity.

Mindmaker is structured as a **ladder**: free Lightning Lessons at the top, paid Workshops at $599 as the entry rung, the AI-Fluent Executive Cohort at $2,500 as the qualifying step, Enterprise sprints from $15,000 as the margin engine, and the Alumni Pass at $1,500/year as continuity. Capital is a third door for funds and family offices, sharing the Signal Session and Revenue Architecture engagement formats but priced and positioned for fund-level buyers. No 1:1 sprints on the public site. No fractional executive roles. No ongoing retainers. No production IT work. Every offer has a fixed scope, a fixed outcome, and a finish line.

---

## Non-Negotiables

### Visual systems
- `src/components/NewHero.tsx`. rotating headline + gradient + looping background video (`/rising-cities.mp4`) + pulsing mint blur. Eyebrow reframe: "Questions I hear every week."
- `src/components/Animations/ParticleBackground.tsx`. global particle field mounted in `Index.tsx`.
- `.glass-card` / `.editorial-card` Tailwind utilities.
- `src/components/InitialConsultModal.tsx`. the single conversion surface. Opened globally via `window.dispatchEvent(new CustomEvent('openConsultModal', { detail: { preselected?: string } }))`.
- Testimonial structure in `src/components/TrustSection.tsx`.

### Technical infrastructure
- Supabase edge functions in `supabase/functions/`:
  - `nervous-decision-machine` (Claude Haiku 4.5, powers `/tool`)
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

1. `Navigation`. fixed top, hides on scroll-down via `useScrollDirection`.
2. `NewHero`. rotating headlines + "Book a call" + "See how I work" CTAs + tertiary "Or start with a free lesson →" link to the Maven instructor page. Subheadline: "Workshops, cohorts, and enterprise sprints that turn AI chaos into direction."
3. `YFork`. "Three doors. Pick yours." → `/workshops` (from $599) vs `/cohort` ($2,500/seat) vs `/enterprise` (from $15,000). Capital is no longer surfaced on the homepage tri-fork; it remains in the Enterprise nav dropdown and at `/capital`.
4. `BigProblem`. existential urgency frame.
5. `TrustSection`. Krish bio, headshot, testimonials carousel.
6. `FrameworkJourney`. three-panel animated MindSet → MindMap → MindMake.
7. `OperatorsEdge` (v5). typography-only credential section, dark bg, three proof tiles (Architecture / Optimization / Memory), CTA to Revenue Architecture + secondary link to `/operator`. "BEYOND PATTERN RECOGNITION" now the dominant wordmark.
8. `OperatorsBrief`. the Live Intel homepage teaser. Minimal on purpose: a continuous CSS-marquee `PriceTicker` with the canonical 7 models, a rotating plain-English interpretation line underneath (3 takes, 8s cross-fade), a compact Nervous Decision input (via `nervous-decision/Input`), and a muted "Open the full dashboard →" link to `/signal`. No card grid, no blog column, those live on `/signal` only.
9. `SimpleCTA`. final CTA.
10. `Footer`.

Case studies (anonymised, COHORT-STYLE / ENTERPRISE tagged) are merged into `TrustSection`'s carousel. `ProofStrip` and `SignalDeskPreview` are deleted.

Global overlays mounted in `src/App.tsx`:
- `InitialConsultModal`. opened via the `openConsultModal` custom event.
- `PreCallQualifier`. floating pill, 3-step intake → pre-loads consult modal.
- `CookieConsent`.

**Not on the homepage:** VendorLandscape, AINewsTicker, ActionsHub, decision-tool launchers, the ChatBot, the Engine Room / mm-ctrl visualization, or the old TheProblem sprint chooser. All removed per rebuild brief v3.

---

## Pages and routing

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded via `React.lazy`.

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. |
| `/workshops` | `Workshops` | Index of the five $599 one-day Workshops, hosted on Maven. |
| `/workshops/build-your-ai-chief-of-staff` | `workshops/BuildYourAIChiefOfStaff` | Workshop sub-page. |
| `/workshops/map-your-agentic-org-chart` | `workshops/MapYourAgenticOrgChart` | Workshop sub-page. |
| `/workshops/vibe-coding-for-leaders` | `workshops/VibeCodingForLeaders` | Workshop sub-page. |
| `/workshops/build-an-autonomous-business-function` | `workshops/BuildAnAutonomousBusinessFunction` | Workshop sub-page. |
| `/workshops/give-your-ai-memory` | `workshops/GiveYourAIMemory` | Workshop sub-page. |
| `/cohort` | `Cohort` | The AI-Fluent Executive ($2,500/seat, 4 weeks, quarterly). Primary leader surface. Maven URL: `https://maven.com/mindmaker/the-ai-fluent-executive`. |
| `/enterprise` | `Enterprise` | The Signal Session ($15k) + The Revenue Architecture ($60-100k) + The AI Immersion. |
| `/capital` | `Capital` | The third door. Same Signal Session and Revenue Architecture engagement formats, repositioned for funds, family offices, and operating partners. Signal Session from $15k; Revenue Architecture $60-100k per portfolio company with a fund-level discount for 3+ engagements per 12 months. |
| `/operator` | `Operator` | (v5) How I operate, 14-agent OS credential page. |
| `/signal` | `Brief` | Live Intel, the full dashboard: extended live-price ticker, plain-English interpretation grid, classified card archive (WATCH / SKIP / CALL / TAKE with filters + search), blog column, full Nervous Decision Machine. Route preserved for inbound URLs. |
| `/library` | `Library` | Library of resources, includes FAQ tab. |
| `/alumni` | `Alumni` | The Alumni Pass ($1,500/year, invitation-only). **Hidden from nav and footer.** SEO `noindex`. Reachable by direct URL only, sent post-engagement. |
| `/leaders` | `LeadershipInsights` | Decision Readiness Diagnostic. Unlinked from nav/footer but still reachable by direct URL for deep-links. |
| `/leadership-insights` | `LeadershipInsights` | Alias. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | Blog index + post. |
| `/faq` | redirects to `/library?tab=questions` | |
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

No `/pricing` page, pricing lives in context on `/cohort`, `/enterprise`, and `/capital`.

---

## Navigation structure

File: `src/components/Navigation.tsx`. Primary CTA: **"Book a call"** (no conditional label).

- **Workshops** (direct link, slot 1): `/workshops`.
- **Cohort** (direct link): `/cohort`.
- **Enterprise** (dropdown): The Signal Session → `/enterprise#signal-session`, The Revenue Architecture → `/enterprise#revenue-architecture`, The AI Immersion → `/enterprise#immersion`, plus a "For funds & operating partners" section linking to Capital → `/capital`.
- **Mindmaker LIVE** (link, rendered as a wordmark): `/signal`.
- **Resources** (dropdown): How I operate → `/operator`, Library → `/library`, The Builder Economy (Podcast) → external `www.thebuildereconomy.com`, Lightning Lessons (5 external Maven links).
- **About** (dropdown): Contact → `/contact`, Privacy → `/privacy`, Terms → `/terms`.

The Decision Readiness Diagnostic and FAQ pages are no longer linked from nav. Both remain reachable by direct URL.

---

## Pricing (canonical)

| Offer | Price |
|---|---|
| Mindmaker Workshops (×5) | $599 / workshop |
| The AI-Fluent Executive (Cohort) | $2,500 / seat (or 2× $1,250 split) |
| The Signal Session (Enterprise) | $15,000 |
| The Revenue Architecture (Enterprise) | $60,000 to $100,000 (scope-dependent) |
| The Signal Session (Capital) | From $15,000 (fund-level or per portfolio company) |
| The Revenue Architecture (Capital) | From $60,000 per portfolio company; fund-level discount for 3+ engagements per 12 months |
| The AI Immersion (inquiry-only) | $12,000 (flat) |
| The Alumni Pass (invitation-only) | $1,500 / year recurring |

Internal (not shown on site): Revenue Architecture floor $60k, ceiling $125k for extended scope; cohort min viable enrollment = 8 seats, cap = 15.

Payment terms (small muted text below price): Workshops = paid via Maven with a 14-day Maven Guarantee; Cohort = "Full payment or 2× $1,250 split"; Signal Session = "Payment on kickoff"; Revenue Architecture = "50/50 at kickoff and delivery"; Alumni Pass = $1,500/year recurring via Stripe, cancel anytime.

Stripe price IDs for all offers are stored in `src/lib/stripe-prices.ts`. Workshop and Cohort IDs are referential only (Maven collects payment); the Alumni Pass is the only product the site itself charges via Stripe.

**Workshop credit:** Workshop alumni get $500 off the AI-Fluent Executive Cohort with code `WORKSHOP` at Maven checkout, valid 90 days post-workshop.

---

## The Nervous Decision Machine

Components: `src/components/nervous-decision/Input.tsx` (compact + full sizes) and `src/components/nervous-decision/Artifact.tsx`. Embedded inside `OperatorsBrief` on the homepage and inside `Brief.tsx` at `/signal`. No standalone page, `/tool` has been deleted.
Edge function: `supabase/functions/nervous-decision-machine/index.ts`.
Model: `claude-haiku-4-5-20251001`, max 1500 tokens, system prompt enforces JSON output schema + Krish's voice. 1-hour per-IP rate limit + global request ceiling as a soft circuit breaker. Requires `ANTHROPIC_API_KEY` on the Supabase project.

---

## Pre-Call Qualifier

Component: `src/components/PreCallQualifier.tsx`. Replaces the old ChatBot. Floating pill bottom-right on every page ("Warm up before your call"). 3-step drawer → keyword-classified sprint recommendation → pre-loads consult modal via `SessionDataContext.setQualificationData`. Answers can also be saved to `localStorage` under `mindmaker:pre-call-qualifier`, no email capture.

---

## Live Intel

Renamed from "The Operator's Brief" (previously "Signal Desk") for straightforward nav clarity, this is live model pricing and weekly calls.

- Homepage teaser: `src/components/OperatorsBrief.tsx`. Minimal, continuous marquee `PriceTicker` + rotating interpretation line + compact Nervous Decision input + footer link to the dashboard. No cards, no blog column.
- Full dashboard: `src/pages/Brief.tsx` at `/signal`. Extended ticker, 3-card interpretation grid, the full classified archive with filter pills + search, a blog column, and the full-size Nervous Decision input with example chips.
- Shared: `src/components/PriceTicker.tsx` (CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`). `src/components/nervous-decision/` has `Input.tsx`, `Artifact.tsx`, `types.ts`.
- Model allowlist lives inside `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`. Current canonical set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini. Update here when a new frontier model is worth surfacing.
- Archive page: `src/pages/Brief.tsx` at route `/signal` (URL preserved for inbound). Filter pills for WATCH / SKIP / CALL / TAKE plus search.
- Taxonomy: **WATCH** (worth acting on), **SKIP** (hype / ignore), **CALL** (a decision is overdue), **TAKE** (Krish's opinion). Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.
- Data source: still inlined sample cards for now. `get-ai-news` edge function schema remains in place for eventual dynamic feed.

---

## Homepage Y-fork

`src/components/YFork.tsx`. Section headline "Three doors. Pick yours." Three glass-cards in a `md:grid-cols-3` row, each with a single full-width CTA:
- **Workshops**. "Build alongside me in one day." From $599. CTA → `/workshops`.
- **The AI-Fluent Executive (Cohort)**. "Make your nervous AI decision with 15 senior leaders." $2,500 per seat. CTA → `/cohort`.
- **Enterprise**. "Build the engine. Or rebuild it." From $15,000. CTA → `/enterprise`.

Capital is no longer surfaced on the homepage tri-fork; it remains in the Enterprise nav dropdown ("For funds & operating partners") and at `/capital`.

`NewHero`'s secondary CTA "See how I work" smooth-scrolls to `#y-fork`. Hero eyebrow reads "DECISION BLOCKERS I HEAR EVERY WEEK".

The next-cohort date is displayed on `/cohort` only. When Supabase `cohort_dates` is wired up, replace the literal in `Cohort.tsx`.

---

## Operator's Edge (v5)

Homepage section: `src/components/OperatorsEdge.tsx`. Dark-bg section between `FrameworkJourney` and `OperatorsBrief`. The heading "Beyond *pattern* recognition" is retypeset to match the FrameworkJourney header scale exactly, `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`, partial-mint treatment on "pattern" only, no drop-shadow glow. Reads as a clear new section via the `WHO YOU'RE WORKING WITH` eyebrow, hairline top border, and gradient background tonal shift. Lead line is the anti-consultant statement (pulled from a top-of-file constant so Krish can edit in one place). Three glass tiles (Architecture / Optimization / Memory) follow. Primary CTA to `/enterprise#revenue-architecture`, secondary muted link to `/operator`.

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

- `project-documentation/mindmaker_rebuild_brief_v4.md`. the v4/v5 brief (barbell pivot + Operator's Edge) that shaped the current site. Note: Capital was added as a third door after this brief was written; see the "Pages and routing" and "Pricing" sections above for the live structure.
- `project-documentation/README.md`. index of all project documentation.
- `project-documentation/PURPOSE.md`, `VALUE_PROP.md`. mission, positioning, differentiators.
- `project-documentation/OFFERS.md`. full offer guide (Cohort, Signal Session, Revenue Architecture). Supersedes the deleted `SPRINTS.md`.
- `project-documentation/ICP.md`. the two ICPs (AI leaders / AI products) and anti-ICPs.
- `project-documentation/OUTCOMES.md`. buyer outcomes by offer.
- `project-documentation/Master_Messaging_and_FAQ.md`. sales pitches and objection handling.
- `project-documentation/BRANDING.md`, `VISUAL_GUIDELINES.md`, `DESIGN_SYSTEM.md`. brand + visual systems.
- `project-documentation/ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`. technical architecture, feature catalogue, and deploy flow.
- `project-documentation/EXECUTIVE_SUMMARY.md`, `LLM_CRITICAL_THINKING_TRAINING.md`. research artefacts (not Mindmaker business content).

---

**End of CLAUDE.md**
