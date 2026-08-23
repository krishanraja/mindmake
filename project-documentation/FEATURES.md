# Features

**Last Updated:** 2026-08-23

---

## Product Offerings

Mindmaker has **one public paid offer**: the 21-day Sprint, at `/sprint` (`src/pages/Sprint.tsx`). The price is not public — it is agreed on the fit call. Every main sales action on the site is the same "Book a fit call" CTA (`src/components/BookFitCall.tsx`), pointed at the verified Calendly destination in `src/lib/publicLinks.ts`.

**The Sprint:** one decision, 21 days. Krish researches it, challenges it, models the choices, and makes the call with the client. The client supplies decisions and introductions; there is no homework. CTRL — a private workspace holding the business context, the decision, the evidence and the reasoning — is produced **as a deliverable of the Sprint**, not sold or priced separately on this site.

The Handover, The Teardown, Capital, and the wider offer ladder described in the historical sections further down this file no longer exist as live pages or prices. `/handover`, `/teardown`, `/capital`, `/tool`, and every other retired path now redirect straight to `/sprint` (see "Application Routes" in `ARCHITECTURE.md` and the retired-path list in `CLAUDE.md`). Do not reintroduce published prices, a second offer, or the ladder.

---

## Retired offers (do not reference)

Every path below is a real client-side redirect in `src/App.tsx` (`<Navigate to="/sprint" replace />`), and the underlying page components no longer render: `/teardown`, `/handover`, `/capital`, `/tool`, `/workshops` and `/workshops/:slug`, `/enterprise`, `/immersion`, `/cohort`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program`. All ~22 of them redirect to `/sprint` — there is no longer a route-specific redirect map (e.g. `/tool` used to go to `/signal`; it now goes to `/sprint` like everything else).

`/alumni` is **not** retired. It is invitation-only, noindex and unlinked, reachable by direct URL.

The offer names behind these retired routes are deliberately not written out in prose elsewhere in this file. If an engagement is not the 21-day Sprint, it does not exist.

---

## Website Features

### Homepage scroll (`/`)

Authoritative: `src/pages/Index.tsx`. Verified 2026-08-23. Everything renders inline in the page file — there are no separate `NewHero` / `BigProblem` / `TrustSection` / `FrameworkJourney` / `OperatorsEdge` / `OperatorsBrief` / `MindMakerLiveSection` / `SimpleCTA` section components any more. Order:

1. `Navigation`, fixed top, hides on scroll-down.
2. Hero. Dark section, looping `/rising-cities.mp4` background, eyebrow "Krish Raja's commercial decision practice", H1 "Make the right call as AI changes your business.", primary `BookFitCall` CTA + secondary "See the 21-day Sprint →" link to `/sprint`, plus a stage-photo collage and a "17+ years" stat card.
3. Attendee-brands strip. "Mindmaker has helped over 4000 leaders with what's next in AI." heading + a row of attendee logos from `attendeeBrands` (`src/data/rebuildProof.ts`).
4. Problem-framing section. Two-card grid: "Faster startups are taking your market." / "You can grow, but something is holding you back."
5. Sprint pitch section (`#work-with-me`, dark). "One decision. 21 days." copy, a `BookFitCall`, a 4-up grid of decision types (Product / Price / Go to market / Company), a 3-up outcome list, and a "See how the Sprint works →" link to `/sprint`.
6. CTRL demo section. `CtrlDemoVideo` component in a framed dark card, copy on keeping the thinking (not just the answer), and a Steph Darmanin quote that only renders when her testimonial consent is present (checked via `useTestimonials`) — see CLAUDE.md's "uncapped Steph quote" guard.
7. Client-results carousel. First four `clientStories` (`src/data/rebuildProof.ts`) in a horizontally-scrolling card row, with a "See all eight stories →" link to `/case-studies`.
8. Krish bio section. Headshot, "Built in business, not in a slide deck." copy, and an Ashley Wales-Brown quote.
9. Final CTA section (dark). Closing copy + `BookFitCall`.
10. `Footer`.

`ParticleBackground` is mounted behind all of it.

### Global overlays

There are none. `src/App.tsx` mounts only `CookieConsent` alongside the router. There is no Diagnosis Room, `ScopingModal`, or `InitialConsultModal` mounted anywhere in the live route tree — those files still exist in the repo but are dormant and unrouted. See "The Diagnosis Room (Mindy)" below for that history.

### Navigation

File: `src/components/Navigation.tsx`. No dropdowns.

- **The Sprint** → `/sprint`
- **Results** → `/case-studies`
- **Mindmaker Live** (wordmark pill, direct external link, new tab) → `https://live.themindmaker.ai`
- **Book a fit call** (`BookFitCall` CTA) → Calendly, new tab

The mobile menu mirrors the same two links, the Live pill, and the `BookFitCall` CTA. A separate icon button toggles light/dark theme. There is no "Bring me one real decision" text anywhere in this component — the CTA copy is always "Book a fit call".

The footer (`src/components/Footer.tsx`) groups: **Work** (The Sprint, Results, How I operate) / **Read** (Mindmaker Live, Library, Articles, New Age Leadership) / **Company** (Contact, Privacy, Terms), plus its own `BookFitCall`.

Hides on scroll-down via `useScrollDirection`.

---

## The Diagnosis Room (Mindy) — historical, not current

**Status:** Paused and unmounted, per `CLAUDE.md`. It is **not** live and is **not** the primary (or any) on-site conversion surface — that role belongs to `BookFitCall` → Calendly (see "Booking Flow" below). The component files and edge functions described in this section still exist in the repo but nothing in the live route tree renders or dispatches them. Kept here as technical history of the earlier conversion system.

**What it is:** a full-screen immersive experience where **Mindy** (the on-site guide, reasoning in Krish's voice) diagnoses a visitor's nervous AI decision and forks to three honest exits. Replaces the retired `PreCallQualifier` pill and `YFork` second fork, both now in `src/_archive/components/`.

**Entry:** the `openDiagnosisRoom` event (`detail: { source_page, seedDecision?, mode? }`) from the nav "Book a call", the hero CTAs, and `SimpleCTA`; plus the standalone page at `/start`. Two modes: `express` (rushes to booking) and `full` (runs the full diagnosis).

**Front end** (`src/components/diagnosis/`): `DiagnosisRoom` (orchestrator), `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar`, `CompanyField` (company search typeahead), `BrushPainter` (opener aurora visual effect), `logoLuminance.ts` (logo contrast helper), the `useDiagnosisSession` state machine, `types.ts`, and `index.ts`. Phases: `opener` → `reading` → `reflect` → `chat` → `brief` → `fork` → `proposal` (plus `express-book`).

**Three honest exits:**
1. **Keep chatting** (learn).
2. **Book a fit call** → Calendly.
3. **Generate / download a co-branded proposal** ("Mindmaker × [company]" one-pager, PDF via Browserless).

**Back end** (4 edge functions + voice): `enrich-company` (company dossier; identity-depth co-brand paint + full-depth synthesis; free-email → graceful degrade), `mindy-chat` (Claude reasoning turn, voice-gated strict JSON), `generate-proposal` (co-branded one-pager + Browserless PDF), `session-digest` (Resend: full intelligence to Krish + opt-in visitor proposal copy), and `transcribe` (Whisper voice input).

**Privacy:** the dossier's `scale.*` (employeeCount, sizeBand, trancoRank, icp, recommendedMode) is internal routing only, never surfaced to the visitor, never in the visitor copy; only Krish's digest gets the full dossier + transcript.

**Knowledge & guardrails:** Mindy's Brain Pack in [`mindy/`](./mindy/): system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing model, proof bank, `CANON.md`, voice-lint. Prices are published, so she quotes the exact figure, in the currency the page is showing unless the visitor names another, and she answers a price question in the turn it is asked. She never converts between currencies and never discounts. The Handover always routes to the call. `src/test/mindy-knowledge.test.ts` fails the build if her layer names a retired offer or states a price that is not in `offers.ts`.

**Company search typeahead:** the `CompanyField` component in `Opener.tsx` calls `company-search` as the user types a company name. Results come from Brandfetch Search API and include logo + domain. The selected company pre-fills enrichment so `enrich-company` can run on domain rather than waiting for an email address. Adaptive logo contrast via `logoLuminance.ts` ensures the co-brand paint is legible against the dark room background.

**Pre-session intake form:** a static HTML form at `/public/intake/index.html` collects structured pre-session context (seat, AI confidence, value frame, aspiration, business context, north star, role-aware handoff) before a confirmed engagement. Posts to the `submit-intake` edge function which emails Krish a formatted brief and persists the row.

**Testimonial collection:** a static HTML form at `/public/testimonials/index.html` accepts public testimonial submissions. Posts to `submit-testimonial`, which inserts into `public.testimonials` and emails Krish. Includes a honeypot field and validates permission level (free / edits / private).

**Analytics:** `diagnosis_room_*` Plausible events across the funnel.

---

## The Handover (`/handover`) — retired redirect

`/handover` is **not a live page**. It is one entry in the retired-path redirect list in `src/App.tsx`: `<Route path="/handover" element={<ToSprint />} />`, which sends every visitor straight to `/sprint`. No content renders. The bullet points below (H1, price bands, the six weeks, the Teardown gate, the $254K POC, structured data) describe the page as it existed before the rebuild and are kept only as history:

- H1 was "Six weeks. Then I leave and you keep it."
- Three price bands by headcount, with one currency switcher for the whole ladder.
- The six weeks, with week five (Krish does not attend) given its own emphasis.
- The Teardown gate stated plainly, with the Teardown's price interpolated.
- The $254K POC with a major US publisher, under the hero. The client was never named.
- Structured data: one `AggregateOffer`, USD only.

## The Teardown (`/teardown`) — retired redirect

`/teardown` is **not a live page**. It redirects straight to `/sprint` via the same `ToSprint` route. Historical description of the retired page:

- H1 was "Bring the decision you keep not making."
- One price, one currency switcher, the four-step method, and what the client kept.
- Structured data: one `Offer`, USD only.

## Capital (`/capital`) — retired redirect

`/capital` is **not a live page**. It redirects straight to `/sprint` via the same `ToSprint` route. Historical description of the retired page:

- The same two engagements, priced per portfolio company, with its own currency switcher.
- Fund-level terms stated as set on the call, never published.
- A fit section that said plainly when it was the wrong call.

## Live Intel (`/signal`) — external redirect, not an internal page

`/signal` and `/builder-economy` are now **external redirects** to Mindmaker Live (`https://live.themindmaker.ai`), rendered via `ExternalRedirect` in `src/App.tsx`. There is no internal `Brief.tsx` dashboard route any more, and `/builder-economy` no longer points at a separate `thebuildereconomy.com` sister domain — both paths point at the same Mindmaker Live destination. Mindmaker Live has one external home: `https://live.themindmaker.ai`.

The description below is history of the earlier internal dashboard, renamed along the way from "Signal Desk" → "The Brief" → "Live Intel":

**Former homepage teaser (`OperatorsBrief.tsx`):** minimal. PriceTicker (continuous CSS-marquee) + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted "Open the full dashboard →" link.

**Former full dashboard (`Brief.tsx`):**
- Extended PriceTicker
- 3-card plain-English interpretation grid
- Classified card archive with filter pills (WATCH / SKIP / CALL / TAKE) + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

**Shared components (still in repo, dormant):**
- `PriceTicker.tsx`. CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`
- `nervous-decision/Input.tsx` (compact + full sizes)
- `nervous-decision/Artifact.tsx`, `types.ts`

**Model allowlist:** `src/hooks/useModelData.ts` exports `ALLOWED_MODEL_IDS`.

**Taxonomy:**
- **WATCH**. worth acting on
- **SKIP**. hype / ignore
- **CALL**. a decision is overdue
- **TAKE**. Krish's opinion

Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.

---

## The Nervous Decision Machine — historical, not current

Not embedded anywhere in the live route tree. `/tool` is now one of the retired paths that redirects to `/sprint` (not `/signal#decision`), and `/signal` itself is an external redirect to Mindmaker Live rather than an internal page. The components and edge function below still exist in the repo but are dormant.

**Components:**
- `src/components/nervous-decision/Input.tsx`. compact (for homepage teaser) + full (for `/signal`) sizes
- `src/components/nervous-decision/Artifact.tsx`. renders the typed response schema

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

Structure:
- Hero, "How I operate" eyebrow, "The operating system behind Mindmaker." H1, Krish headshot, "Most advisors sell frameworks they read. I run the frameworks I sell." subhead
- Thesis, looping `/CTRL-demo-aug-26.mp4` in the shared accessible player left of body copy (3 paragraphs)
- 5-cluster typography agent diagram listing 14 named agents (Zara, Kai, Nero, Maya, Ravi, Theo, Sol, June, Marcus, Iris, Otto, Ash, Lin, Noor)
- Four extractable lessons (agents-not-employees / memory-as-commercial-decision / cost-as-product-feature / orchestration-fail-points)
- "On stage" strip with three `krish-stage-*` images, auto-advancing every 3.5s, pauses on hover
- Commercial crossover CTA. `BookFitCall` (`source="operator-final"`) → Calendly. `/handover` no longer exists as a page; it now redirects to `/sprint`.

**Design guardrails:** no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards. Every claim passes the CMO-15-second test.

**SEO:** OG type `article`.

---

## New Age Leadership Page (`/new-age-leadership`)

Long-form thought leadership; promoted from hidden into the Resources nav (commit 226ecf1).

Structure:
- Hero with word-by-word animated headline ("Your next org chart has agents on it. Here's what that looks like.")
- Lazy-loaded `OrgChart` component (interactive agent-native org diagram)
- Three category cards: Hybrid teams / Agent-first functions / Emergent agent-native roles
- Embedded `AgathaStory` narrative + `PageCompletionBeacon` (engagement tracking signal)
- Closing: a `BookFitCall` + "See how I operate" link to `/operator`, then a "How you get there" framing section, the `FrameworkJourney` (Mind Set → Mind Map → Mind Make) component, and a final soft-CTA section with another `BookFitCall`
- Schema.org `Article` JSON-LD

---

## Operator's Edge Section (homepage)

`src/components/OperatorsEdge.tsx`. Dark-bg section between `FrameworkJourney` and `OperatorsBrief`.

- Heading "Beyond *pattern* recognition" (partial-emerald treatment on "pattern" only)
- Heading scale matches `FrameworkJourney` exactly: `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`
- Eyebrow "WHO YOU'RE WORKING WITH"
- Three glass tiles: Architecture / Optimization / Memory
- Primary CTA → `/enterprise#revenue-architecture`
- Secondary muted link → `/operator`
- Lead line (the anti-consultant statement) lives in a top-of-file constant for easy single-edit updates

---

## Homepage Y-Fork (RETIRED June 2026)

`YFork.tsx` (the second homepage fork, "Start where your question actually is.") was removed from `Index.tsx` so the homepage funnels into the one Diagnosis Room journey, and moved to `src/_archive/components/` in August 2026. Its three intents are now served by Mindy's diagnosis and by the "Work with me" nav (`/handover`, `/teardown`, `/capital`).

---

## Decision Readiness Diagnostic (`/leaders`) — historical, not current

**Status:** Retired. `/leaders` and `/leadership-insights` are now both in the retired-path list in `src/App.tsx` and redirect straight to `/sprint`; no diagnostic content renders at either URL any more.

**Former routes:** `/leaders`, `/leadership-insights` (alias).

**Flow (as it existed before the redirect):**
1. Intro screen with value prop
2. 6 Likert-scale questions (auto-advance)
3. Optional 5-question personalization or skip
4. Generation phase (progress animation, never regresses)
5. Results: Decision Readiness Score + tier, top 3 nervous decisions (curated from answers), recommended next step
6. Collapsible form to unlock full results via email (`send-leadership-insights-email` edge function)

**Tiers:** AI-Leader (80–100), AI-Advanced (65–79), AI-Proficient (50–64), AI-Developing (35–49), AI-Emerging (0–34).

---

## Booking Flow

- Single entry point: **`BookFitCall`** (`src/components/BookFitCall.tsx`), used everywhere a sales action appears (nav, footer, hero, sprint pitch, results, final CTA, operator page). It links straight to `BOOKING_URL` (Calendly, from `src/lib/publicLinks.ts`) with a `?utm_source=<source>` tag and fires a `fit_call_clicked` Plausible event if analytics are present.
- `/start` and `/decision` also resolve straight to `BOOKING_URL` via an `ExternalRedirect`.
- There is no on-site qualification step, modal, or gate before Calendly, and no digest email pipeline tied to booking.
- Contact (`/contact`) is for general messages and does not replace the fit call.
- **Historical:** the Diagnosis Room (`openDiagnosisRoom`, ending in a `session-digest` email + one of three exits), the `ScopingModal` (`openScopingModal` → `notify-scoping-request`), and `InitialConsultModal` (`openConsultModal`) described the earlier multi-surface booking system. None of them are dispatched anywhere in the current route tree. See "The Diagnosis Room (Mindy)" above.

---

## Blog (`/blog`, `/blog/:slug`)

- Blog listing with featured posts
- Individual post pages with SEO metadata
- Responsive, WCAG-compliant dark CTA cards

---

## Edge Functions (live)

Diagnosis Room (shared logic in `_shared/{mindy,enrich,proposal}/`):
- `mindy-chat`. Anthropic Claude, Mindy's reasoning turn (strict-JSON, voice-gated)
- `enrich-company`. company dossier orchestrator (Brandfetch + PDL + Tranco + BuiltWith + Perplexity/Exa/NewsAPI + Gemini/Anthropic synthesis); `scale.*` is internal routing only
- `generate-proposal`. co-branded "Mindmaker × [company]" one-pager; HTML + Browserless PDF
- `session-digest`. Resend, full intelligence to Krish + opt-in proposal copy to the visitor
- `transcribe`. OpenAI Whisper, Diagnosis Room voice input

Other:
- `nervous-decision-machine`. Anthropic Haiku 4.5
- `get-ai-news`. Live Intel content (Lovable AI Gateway, schema preserved)
- `get-market-sentiment`. OpenAI
- `get-model-data`. frontier model price and spec feed
- `send-lead-email`. Gemini company research + Resend (legacy `/alumni` path)
- `send-contact-email`. Resend
- `send-leadership-insights-email`. Resend (dual delivery)
- `notify-scoping-request`. powers the `ScopingModal`; emails krish@themindmaker.ai via Resend + persists
- `notify-ctrl-waitlist`. CTRL waitlist signups (`CtrlWaitlistPopover`); emails krish@themindmaker.ai via Resend
- `import-audience-csv`. Substack subscriber CSV → shared `audience_contacts` table (secret-gated)
- `create-consultation-hold`. Stripe, currently bypassed. Nothing on the site charges through it
- `company-search`. Brandfetch Search API typeahead for the Diagnosis Room opener (name → domain + icon; rate-limited; degrades gracefully)
- `submit-intake`. pre-session intake form handler → inserts row + emails Krish a formatted SNAPSHOT brief
- `personalize-intake`. progressive enhancement for the static `/intake` form; turns a SAFE company dossier + seat into one or two voice-linted microcopy fragments, with a deterministic fallback on any failure
- `submit-testimonial`. public testimonial submission → inserts into `testimonials` table + emails Krish; honeypot bot protection

---

## SEO and LLM Discoverability

- Meta + Open Graph on all pages (`SEO.tsx`)
- Structured data (Schema.org JSON-LD); `Article` schema on `/new-age-leadership` and `/operator`
- `scripts/generate-sitemap.mjs` + `scripts/prerender.mjs` run during `npm run build`
- `public/llms.txt` for LLM summaries
- `public/robots.txt` allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- Plausible events: `fit_call_clicked` (fired by `BookFitCall` everywhere it's used, tagged with a `source` placement string). The `operator_page_cta_clicked` event and the Diagnosis Room funnel `diagnosis_room_*` events described in the historical section above are no longer fired — that tracking code is dormant along with the Diagnosis Room itself.

---

## Design System

See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) and [VISUAL_GUIDELINES.md](./VISUAL_GUIDELINES.md).

Key points:
- **Ink** `#0e1a2b` + **Emerald** `#00D9B6` (HSL `171 100% 43%`). the two-color system. Signature accent moved from mint to portfolio emerald on 2026-06-29 for three-product brand cohesion (Mindmaker + CTRL + Make Your Mind Up); the legacy `mint` tokens/classes are retained as aliases to emerald (prefer `emerald*` in new code). WHY + WCAG proof: `prototypes/brand-emerald-proof.{html,md}`
- Inter Variable (body) + Space Grotesk Variable (display)
- WCAG rule: never bright emerald (`text-mint` / `text-emerald`) as text on light backgrounds; use `text-emerald-deep` (`#06746d`, full AA 5.21) for accent text/links on light
- `.glass-card`, `.editorial-card`, `.dark-cta-card` utilities

---

## Retired Features (do not reference)

- ChatBot / "Chat with Krish" / "Ask Mindmaker", replaced by `PreCallQualifier`, which is itself now retired
- `PreCallQualifier` floating pill + homepage `YFork` second fork, both retired June 2026 (superseded by the Diagnosis Room) and moved to `src/_archive/components/` in August 2026.
- `/tool` standalone page, deleted
- `ActionsHub` drawer and Interactive decision tools (BuilderAssessment, TryItWidget, AIDecisionHelper, FrictionMapBuilder, PortfolioBuilder), unmounted
- `VendorLandscape`, `AINewsTicker`, `TheProblem`, `ProductLadder`. replaced
- Engine Room / mm-ctrl visualization, never built for homepage; lives nowhere public
- CTRL as a Mindmaker product, not on site (the demo loop on `/operator` is illustrative only)
- "Signal Desk" naming, renamed to Live Intel
- "The Brief" as a nav label, renamed to Live Intel
- The entire six-rung ladder retired in July and August 2026. Names are in `DECISIONS_LOG.md`, not here
- "All Enterprise" footer link, dropped (commit 226ecf1)

---

**End of FEATURES**
