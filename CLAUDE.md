# CLAUDE.md — Mindmaker Repository Guide

**Last Updated:** 2026-04-20
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive**, not prescriptive. For historical brand-vision context, see `project-documentation/EXECUTIVE_SUMMARY.md`, `project-documentation/PURPOSE.md`, and `project-documentation/BRANDING.md`.

---

## Brand North Star

Mindmaker positions itself as the **anti-consultancy for leaders who are done being sold AI and ready to use it**. The voice is confident, lightly cynical, deeply helpful — premium through substance, not stiffness. Think Stripe's design sensibility meets Anthony Bourdain's authenticity.

---

## Non-Negotiables (do not touch without reason)

### Visual systems
- `src/components/NewHero.tsx` — rotating headline + gradient + looping background video (`/rising-cities.mp4`) + pulsing mint blur.
- `src/components/Animations/ParticleBackground.tsx` — global particle field mounted in `Index.tsx`.
- `.glass-card` / `.editorial-card` Tailwind utilities.
- Scroll + snap behavior on the homepage.
- `src/components/AINewsTicker.tsx` — fed by the `get-ai-news` Supabase edge function.
- `src/components/InitialConsultModal.tsx` — the single conversion surface. Opened globally via `window.dispatchEvent(new CustomEvent('openConsultModal'))`.
- Testimonial structure in `src/components/TrustSection.tsx`.

### Technical infrastructure
- Chatbot (`src/components/ChatBot/*`) — Vertex AI RAG + Gemini, powered by the `chat-with-krish` edge function. Branded **"Ask Mindmaker"**.
- Supabase edge functions in `supabase/functions/`:
  - `chat-with-krish`, `get-ai-news`, `get-market-sentiment`, `get-model-data`,
  - `send-contact-email`, `send-lead-email`, `send-leadership-insights-email`,
  - `create-consultation-hold`.
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
2. `NewHero` — rotating headlines + philosophical statement + dual CTA.
3. `BigProblem` — existential urgency frame.
4. `TrustSection` — Krish bio, headshot, testimonials carousel.
5. `FrameworkJourney` — three-panel animated performance of **MindSet → MindMap → MindMake**.
6. `VendorLandscape` (from `src/components/Interactive/`) — live model comparisons.
7. `TheProblem` (id `#products`) — sprint chooser (4-Week vs 90-Day).
8. `AINewsTicker` — SIGNAL / NOISE / DECISION / TAKE classifier ticker.
9. `SimpleCTA` — "You've been pitched enough." + final "What's your nervous decision?" CTA.
10. `Footer`.

Global overlays mounted in `src/App.tsx`:
- `InitialConsultModal` — opened via the `openConsultModal` custom event.
- `ActionsHub` — decision tools launcher (builder quiz, decision helper, friction map, portfolio builder).
- `CookieConsent`.

---

## Hero copy (current)

File: `src/components/NewHero.tsx`.

**Rotating headlines** (`headlines` array, 5 s interval):
1. "If there were 3 of me, I'd be able to get everything done."
2. "I need to deliver an AI strategy - where do I start?"
3. "What if I could give every employee an AI coworker?"
4. "14 tools pitched this quarter. I use none of them."
5. "I want to build an AI assistant that actually knows our business."
6. "Should we build our own AI tools or buy off the shelf?"
7. "Everyone on my team is using different AI tools. It's chaos."
8. "I want AI doing the boring work so my team does the real work."
9. "How do I know if AI is delivering ROI or just hype?"
10. "I keep imagining what my company looks like with AI embedded everywhere."
11. "I'm nervous about getting locked into the wrong vendor."
12. "I should probably understand this better than I do."

**Philosophical statement (mint):** "Everyone's selling AI. Nobody's helping you think."

**Subheadline:** "1:1 sprints that turn AI chaos into direction."

**Primary CTA:** "Tackle your million dollar decision" → opens `InitialConsultModal`.
**Secondary CTA:** "Learn how you can level up" → smooth-scrolls to `#products`.

Note: the navigation bar and `SimpleCTA` use a different CTA label — **"What's your nervous decision?"** — intentionally, so the same message lands in multiple registers across the scroll.

---

## Sprint chooser (homepage `#products`)

File: `src/components/TheProblem.tsx`.

Header: **"Choose your sprint."**
Subheader: "Whether you're hands-on or hands-off, both paths start with clarity and end with decisions that stick."

Two cards rendered from the `sprints` array:

| Card | Tagline | Route |
|---|---|---|
| 4-Week Sprint | One decision. Four weeks. Board-ready. | `/sprint/4-week` |
| 90-Day Sprint | The full journey. MindSet → MindMap → MindMake. | `/sprint/90-day` |

Each card shows outcomes, a primary CTA that opens the consult modal, and a "Learn more" ghost button that navigates to the detail page. Below the grid, a "Not sure which sprint?" prompt opens the consult modal.

> There is no separate `ProductLadder.tsx` file — that concept lives entirely inside `TheProblem.tsx`.

---

## Framework Journey

File: `src/components/FrameworkJourney.tsx`.

Three-panel scroll-triggered animation (Framer Motion + `useInView`):

1. **MindSet → Clarity.** Chaos of scattered tool labels compresses into "3 Decisions That Matter."
2. **MindMap → Leverage.** SVG node graph assembles node-by-node, edges drawn via `pathLength`.
3. **MindMake → Direction.** Document materializes with ROI + cost-to-build tiles.

Replaces the older "ChaosToClarity" component (now removed).

---

## Pages and routing

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded via `React.lazy`.

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded (critical path). |
| `/sprints` | `Sprints` | Full Builder vs Orchestrator sprint library (tabbed). |
| `/sprint/4-week` | `Sprint4Week` | 4-week sprint detail + emotional arc. |
| `/sprint/90-day` | `Sprint90Day` | 90-day sprint detail + monthly arc + "Extended Sprint" note. |
| `/leaders` | `LeadershipInsights` | **Decision Readiness Diagnostic** (primary URL). |
| `/leadership-insights` | `LeadershipInsights` | Alias of the above. |
| `/war-room` | `WarRoom` | Enterprise: AI War Room offer. |
| `/fractional-caio` | `FractionalCAIO` | Enterprise: fractional CAIO engagement. |
| `/strategy-day` | `StrategyDay` | Enterprise: one-day strategy intensive. |
| `/builder-economy` | `BuilderEconomy` | Long-form thesis piece. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | Blog index + post. |
| `/faq` | `FAQ` | |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all. |

**Redirects:**
- `/individual` → `/`
- `/team` → `/`
- `/builder` → `/`
- `/builder-session` → `/`
- `/leadership-lab` → `/`
- `/portfolio-program` → `/`
- `/builder-sprint` → `/sprints`

No `/diagnostic` route exists. The diagnostic is at `/leaders` (preferred) and `/leadership-insights`.

---

## Navigation structure

File: `src/components/Navigation.tsx`.

Three top-level dropdowns + a primary CTA button. On wide screens the button reads **"What's your nervous decision?"**; on narrow screens it collapses to **"Book a call"**. Both fire the `openConsultModal` event.

**Sprints**
- 4-Week Sprint → `/sprint/4-week`
- 90-Day Sprint → `/sprint/90-day`
- All Sprints → `/sprints`

**Resources**
- Decision Tools → opens `ActionsHub` via the `openActionsHub` event
- Blog → `/blog`
- Live Learnings → `https://live.themindmaker.ai/` (external)
- Free Lightning Lessons → inline `LightningLessons` submenu (external Maven links)

**About**
- FAQ → `/faq`
- Contact → `/contact`
- Privacy → `/privacy`

Enterprise offers (`/war-room`, `/fractional-caio`, `/strategy-day`) and the `BuilderEconomy` page are reachable via direct link, SEO, and in-page CTAs — they are not in the top nav by design.

---

## Decision tools (ActionsHub dialogs)

Mounted globally in `src/App.tsx` via `ActionsHub` + a shared `Dialog`. Each tool has a compact embedded mode and a full modal mode:

- `BuilderAssessment` (`src/components/Interactive/BuilderAssessment.tsx`) — Builder Profile Quiz.
- `TryItWidget` / `AIDecisionHelper` (`src/components/Interactive/AIDecisionHelper.tsx`) — AI Decision Helper.
- `FrictionMapBuilder` (`src/components/Interactive/FrictionMapBuilder.tsx`) — Friction Map Builder.
- `PortfolioBuilder` (`src/components/Interactive/PortfolioBuilder.tsx`) — "Model out your starting points."

The dialog header shows a "LIVE" badge and "Powered by Mindmaker Methodology" subtitle on desktop.

---

## Media easter egg components

Folder: `src/components/MediaEasterEggs/`. Built and ready for use; integration is per-page and opportunistic.

- `VideoDrawer.tsx` — thumbnail → full-screen slide-out video player. Hover or click trigger.
- `AudioPlayer.tsx` — collapsed floating pill that expands on hover; play/pause + title.
- `ArtifactPreview.tsx` — glass-card tile with hover-reveal preview → click-to-expand full artifact modal.
- `ExpandableQuote.tsx` — short pull-quote card that expands to the full quote on click.

---

## Chatbot

Folder: `src/components/ChatBot/`. Branded **"Ask Mindmaker"** (see `ChatPanel.tsx:75`, `ChatButton.tsx:28`). Quick replies prime the user toward sprint selection and the Builder/Orchestrator identification.

Backend: `supabase/functions/chat-with-krish` (Vertex AI RAG + Gemini).

---

## Decision Readiness Diagnostic

File: `src/pages/LeadershipInsights.tsx`. Titled **"Decision Readiness Diagnostic"** (SEO title at line 169, on-page header at line 457). Reachable at `/leaders` and `/leadership-insights`.

Output surfaces Builder vs Orchestrator identification and feeds into sprint recommendation logic.

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
- Lint: `npm run lint`.
- Build: `npm run build`.
- Routing: React Router v6 (`BrowserRouter` in `App.tsx`).
- State: `@tanstack/react-query` + `SessionDataContext`.
- Styling: Tailwind + shadcn/ui components in `src/components/ui/`.
- Theme: `next-themes` with `attribute="class"` (dark mode class-based).
- All CTAs should route through `InitialConsultModal` via the `openConsultModal` event unless the feature explicitly needs its own flow.

---

## Related documentation

- `README.md` — short public-facing project overview.
- `project-documentation/EXECUTIVE_SUMMARY.md` — brand thesis + positioning.
- `project-documentation/PURPOSE.md` — mission / "why Mindmaker."
- `project-documentation/SPRINTS.md` — full sprint library (Builder + Orchestrator tracks).
- `project-documentation/ICP.md` — ideal customer profiles.
- `project-documentation/BRANDING.md`, `VISUAL_GUIDELINES.md`, `DESIGN_SYSTEM.md` — brand + visual systems.
- `project-documentation/ARCHITECTURE.md`, `DEPLOYMENT.md` — technical architecture + deploy flow.
- `DESIGN_SYSTEM_GUIDE.md`, `MINDMAKER_DESIGN_SYSTEM_GUIDE.md` — legacy design system notes (may overlap with `project-documentation/DESIGN_SYSTEM.md`).

---

**End of CLAUDE.md**
