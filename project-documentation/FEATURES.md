# Features

**Last Updated:** 2026-08-26

> **Current authority.** The active public product has two doors, `Build Your AI Brain` and `Build Your AI GTM`, one action, `Start here`, and no public diary. Either door may lead to one privately priced 30-day proof. The version-two private hand-off is source-only and fail-closed until the gates in `DEPLOYMENT.md` pass. The feature catalogue below records the superseded 11 August system and is retained only as technical history.

---

## Historical 11 August feature catalogue, superseded

## Product Offerings

Mindmaker is a **capped advisory practice** with two engagements: The Handover (six weeks, priced by headcount) and The Teardown (ten business days, $9,500 USD), plus a third door at `/capital` for funds buying on behalf of a portfolio company. Every engagement has a fixed scope, a published price and a finish line. Prices are published in three currencies as set prices per market, and come from `src/lib/offers.ts`. Full detail in [OFFERS.md](./OFFERS.md). Sales-grade detail in [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md).

### 1. The Handover

**Price:** USD $18,000 (under 100 people) / $30,000 (100 to 250) / $50,000 (250 to 5,000). Also GBP and AUD, as set prices per market. Canonical source: `src/lib/offers.ts`.
**Duration:** Six weeks, plus a Day 90 recheck.
**Cap:** Six a year, across every client. Stated publicly.
**Gate:** A completed Teardown, always.
**Route:** `/handover`. Always via the call, never self-serve.

**The six weeks:** load and correct context, adversarial pre-mortem, the fork (rebuild GTM/pricing/positioning, or set the build order), the client drives, **Krish does not attend in week five**, exit.

**Buyer:** the CEO, CRO or VP Product at a company of 50 to 5,000 people. Never the CTO.

### 2. The Teardown

**Price:** USD $9,500. Also GBP and AUD.
**Duration:** Ten business days. Under two hours of the client's time.
**Route:** `/teardown`. Self-serve; the price is published.

**Method:** the decision comes apart into its load-bearing claims; each is checked against live evidence with a reliability tier; each consideration is classed External / Only you / Nobody yet; four models cross-examine it with disagreements preserved rather than averaged.

**Output:** a one-page memo, the claim map, the classed considerations, the cross-examination, three claims under a 90-day watch, and a CTRL workspace with the decision map in it.

**It is also the gate**, and it has talked people out of the Handover as often as into it.

### 3. Funds and portfolio companies

The same two engagements, priced per portfolio company, at `/capital`. Fund-level and multi-company terms are set on the call and never published.

### 4. CTRL

A separate product with its own site and its own pricing. Not sold here. Appears as a Teardown deliverable and as a link.

---

## Retired offers (do not reference)

Every route below is a real 301 in `vercel.json`, with a client-side fallback in `App.tsx`. Page components live in `src/_archive/`.

| Retired route | Redirects to |
|---|---|
| `/workshops` and its five children | `/teardown` |
| `/enterprise` | `/handover` |
| `/immersion` | `/handover` |
| `/cohort` | `/start` |
| `/leaders`, `/leadership-insights` | `/start` |
| `/sprints`, `/sprint/4-week`, `/builder-sprint` | `/teardown` |
| `/sprint/90-day` | `/handover` |
| `/war-room`, `/fractional-caio` | `/handover` |
| `/strategy-day` | `/teardown` |
| `/builder-session`, `/leadership-lab`, `/portfolio-program`, `/individual`, `/team`, `/builder` | `/` |
| `/tool` | `/signal` |
| `/builder-economy` | `https://www.thebuildereconomy.com` |

`/alumni` is **not** retired. It is invitation-only, noindex and unlinked, reachable by direct URL.

The offer names behind these routes are deliberately not written out here. `DECISIONS_LOG.md` holds the record. If an engagement is not The Teardown or The Handover, it does not exist.

---

## Website Features

### Homepage scroll (`/`)

Authoritative: `src/pages/Index.tsx`. Order:

1. `NewHero`. rotating headlines, eyebrow "Decision blockers I hear every week", looping `/rising-cities.mp4` background, emerald pulse, particle background. Primary CTA "Book a call" (Diagnosis Room, express) + secondary "Work through your decision with Mindy" (Diagnosis Room, full) + tertiary "Or start with a free lesson →" / "See how I work →" (`/operator`).
2. `BigProblem`. existential urgency frame (three large interactive flip cards; card CTA opens the `ScopingModal`).
3. `TrustSection`. Krish bio + headshot + testimonials carousel (COHORT-STYLE / ENTERPRISE tagged).
4. `FrameworkJourney`. three-panel animated Mind Set → Mind Map → Mind Make.
5. `OperatorsEdge`. Typography-only credential section ("Beyond pattern recognition"). Three proof tiles (Architecture / Optimization / Memory). Primary CTA to `/handover`, secondary link to `/operator`.
6. `OperatorsBrief`. Live Intel homepage teaser. CSS-marquee PriceTicker + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted "Open the full dashboard →" link to `/signal`.
7. `MindMakerLiveSection`. Substack newsletter subscribe surface.
8. `SimpleCTA`. final CTA ("What's your nervous decision?"), opens the Diagnosis Room.
9. `Footer`.

The retired `YFork` second fork is no longer rendered. The component is in `src/_archive/components/`.

### Global overlays

Mounted in `src/App.tsx`:
- `DiagnosisRoom`. **the primary "Book a call" conversion surface** (the on-site Mindy experience). Opened via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode } }))` (`mode`: `express` | `full`). Lazy + only mounted when open. Also a standalone page at `/start`. See "The Diagnosis Room (Mindy)" below.
- `ScopingModal`. Secondary booking surface, dispatched by the `BigProblem` cards and `/case-studies` via `openScopingModal`. 6-field "Scope it with me" intake posting to `notify-scoping-request`.
- `InitialConsultModal`. legacy conversion surface, kept mounted but only `/alumni` still dispatches `openConsultModal`
- `CookieConsent`
- `ErrorBoundary` wrapping the route `Suspense`
- The retired `PreCallQualifier` floating pill is no longer mounted. The component is in `src/_archive/components/`.

### Navigation

File: `src/components/Navigation.tsx`. Primary CTA button: **"Bring me one real decision"**, which opens the Diagnosis Room.

- **Work with me** (dropdown, largest first): The Handover, The Teardown, For funds and portfolio companies
- **Mindmaker LIVE** (direct link, rendered as a wordmark): `/signal`
- **Resources** (dropdown): How I operate, Case studies, New Age Leadership, Library, The Builder Economy (external)
- **About** (dropdown): Contact, Privacy, Terms

The footer carries the same three "Work with me" links.

Hides on scroll-down via `useScrollDirection`.

---

## The Diagnosis Room (Mindy)

**Status:** Live (June 2026). The primary on-site conversion surface.

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

## The Handover (`/handover`)

- H1: "Six weeks. Then I leave and you keep it." Do not rewrite this.
- Three price bands by headcount, with one currency switcher for the whole ladder.
- The six weeks, with week five (Krish does not attend) given its own emphasis.
- The Teardown gate stated plainly, with the Teardown's price interpolated.
- A now-retired private proof disclosure, under the hero. This is historical and must not return publicly.
- Structured data: one `AggregateOffer`, USD only.

## The Teardown (`/teardown`)

- H1: "Bring the decision you keep not making."
- One price, one currency switcher, the four-step method, and what the client keeps.
- Structured data: one `Offer`, USD only.

## Capital (`/capital`)

- The same two engagements, priced per portfolio company, with its own currency switcher.
- Fund-level terms stated as set on the call, never published.
- A fit section that says plainly when this is the wrong call.

## Live Intel (`/signal`)

Renamed from "Signal Desk" → "The Brief" → **"Live Intel"** for plain-English nav clarity. The body-copy term "The Operator's Brief" is still acceptable in editorial copy, but the nav label is "Live Intel".

**Homepage teaser (`OperatorsBrief.tsx`):** minimal. PriceTicker (continuous CSS-marquee) + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted "Open the full dashboard →" link.

**Full dashboard (`Brief.tsx`):**
- Extended PriceTicker
- 3-card plain-English interpretation grid
- Classified card archive with filter pills (WATCH / SKIP / CALL / TAKE) + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

**Shared components:**
- `PriceTicker.tsx`. CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`
- `nervous-decision/Input.tsx` (compact + full sizes)
- `nervous-decision/Artifact.tsx`, `types.ts`

**Model allowlist:** `src/hooks/useModelData.ts` exports `ALLOWED_MODEL_IDS`. Canonical set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini.

**Taxonomy:**
- **WATCH**. worth acting on
- **SKIP**. hype / ignore
- **CALL**. a decision is overdue
- **TAKE**. Krish's opinion

Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.

---

## The Nervous Decision Machine

Embedded only, no standalone page. `/tool` redirects to `/signal#decision`.

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
- Commercial crossover CTA → `/handover`. Tracked via `plausible('operator_page_cta_clicked')`.

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
- Closing: Mind Set → Mind Map → Mind Make framework → CTA to `/cohort` (decide on your team) or `/operator` (see the OS)
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

- Primary entry point: **the Diagnosis Room (Mindy)**, opened via `openDiagnosisRoom` from the nav, the hero and `SimpleCTA`, and reachable directly at `/start`. The session ends in a digest (`session-digest` → Resend) and one of three exits (chat / Calendly / proposal).
- Secondary: the global `ScopingModal` (`openScopingModal`, six-field intake → `notify-scoping-request` → emails krish@themindmaker.ai + persists). Dispatched by the `BigProblem` cards and `/case-studies`.
- `InitialConsultModal` (`openConsultModal`) is legacy, now dispatched only by `/alumni`.
- Direct-link bypasses: The Builder Economy (external sister domain), CTRL (`ctrl.themindmaker.ai`).
- Email delivery via Resend.

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
- `submit-testimonial`. public testimonial submission → inserts into `testimonials` table + emails Krish; honeypot bot protection

---

## SEO and LLM Discoverability

- Meta + Open Graph on all pages (`SEO.tsx`)
- Structured data (Schema.org JSON-LD); `Article` schema on `/new-age-leadership` and `/operator`
- `scripts/generate-sitemap.mjs` + `scripts/prerender.mjs` run during `npm run build`
- `public/llms.txt` for LLM summaries
- `public/robots.txt` allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- Plausible events: `operator_page_cta_clicked`, and the Diagnosis Room funnel `diagnosis_room_*` (start, express_start, switch_to_full, view_brief, fork, book_call, generate_proposal, pdf_downloaded, digest_sent)

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
