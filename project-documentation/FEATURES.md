# Features

**Last Updated:** 2026-06-21

---

## Product Offerings

Mindmaker is a **ladder**: free Lightning Lessons → paid Workshops ($599) → the AI-Fluent Executive Cohort ($2,500) → Enterprise sprints ($15k–$100k+) → the Alumni Pass ($1,500/yr) as continuity, with Capital as a third door for funds. Every offer has a fixed scope and finish line. Public pricing is ranges only; exact figures are set on the call. Full detail in [OFFERS.md](./OFFERS.md) and [COMMERCIAL_REFERENCE.md](./COMMERCIAL_REFERENCE.md). Sales-grade detail in [SALES_PLAYBOOK.md](./SALES_PLAYBOOK.md).

### 1. The AI-Fluent Executive (Cohort): $2,500/seat (hosted on Maven)
**Status:** Live
**Route:** `/cohort`
**Implementation:** `src/pages/Cohort.tsx`
**Maven URL (canonical enrolment):** `https://maven.com/mindmaker/the-ai-fluent-executive`

**For:** Senior leaders (CEO/COO/CFO/CPO/CCO/CMO/GM/VP-level/founder-operator) wrestling with one nervous AI decision.

**Format:** 4 weeks (mostly async) + 4 × 90-min live sessions. 10–15 seats per cohort. Quarterly cadence.

**Curriculum:** Diagnose → Decompose → Decide → Deploy.
- Week 1. Diagnose. Name the real decision (peer-guided diagnosis session)
- Week 2. Decompose. Surface the real trade-offs (peer pressure-test of the options)
- Week 3. Decide. Commit out loud (memo peer review and commitment)
- Week 4. Deploy. Ship the first concrete step (show-and-tell, accountability, alumni onboarding)

**Outcome:** A board-ready 1-page decision memo + trade-off analysis doc + lifetime access to CTRL (Mindmaker's flagship memory-web app) + 90-day cohort Slack access + lifetime curriculum + alumni network.

**Payment terms:** Full payment or 2× $1,250 split. Collected by Maven.

The next-cohort date renders literally on `/cohort` (`nextCohort` const in `Cohort.tsx`). Cohort dates are managed in code for now; a future Supabase `cohort_dates` table will replace the literal.

The page surfaces:
- A "Hosted on Maven" pill linking to the Maven URL
- A "Reserve my seat on Maven" CTA pointing directly to the Maven URL (bypasses the consult call when the buyer already knows the cohort is the right fit)
- A muted "Book a call instead" path via the global `ScopingModal` (`openScopingModal`)

---

### 2. The Signal Session: $15,000
**Status:** Live
**Route:** `/enterprise#signal-session`
**Implementation:** `src/pages/Enterprise.tsx` (anchor section)

**For:** Founders / CEOs / CCOs / CROs / CPOs at companies commercializing AI product or AI-enabled capability.

**Format:** One intensive day (on-site or remote) + 2 weeks pre-work + **15–20 page Commercial Narrative delivered within 48 hours**.

**Outcome:**
- The Commercial Narrative (15–20 pages, 48-hour delivery)
- Commercial positioning framework (2 pages, ready for the team)
- Sales narrative + objection handling guide
- Pricing model sketch with 2–3 packaging options
- 30-day commercial roadmap with named owners and milestones

**Payment terms:** Payment on kickoff.

**Best for:** Teams with AI capabilities needing rapid alignment before committing to a larger build. Often used as the entry point before a Revenue Architecture engagement. Books typically within 2–3 weeks.

---

### 3. The Revenue Architecture: $60,000–$100,000
**Status:** Live
**Route:** `/enterprise#revenue-architecture`
**Implementation:** `src/pages/Enterprise.tsx` (anchor section)

**For:** Enterprise buyers ready for a commercial rebuild. Typically $10M–$1B+ revenue.

**Format:** **30 days (4–5 calendar weeks)**, multi-session. Kickoff workshop on-site or remote; weekly working sessions + async deliverables. Krish-led, no associate model.

**Outcome:**
- 30–40 page client-branded commercial strategy document
- Product marketing framework (positioning, messaging, competitive differentiation)
- Revenue model with multiple pricing scenarios, tested against business reality
- Packaging and tiering structure (2–3 ship-ready options)
- 90-day GTM playbook (channels, sales process, enablement materials)
- Product roadmap aligned to commercial milestones
- Board-ready presentation deck (Krish presents if requested)
- 30-day post-engagement follow-up session included

**Payment terms:** 50/50 at kickoff and delivery.

**Cadence note:** new engagements start at the next monthly cohort opening, book a call to check current availability.

---

### 4. The AI Immersion: $12,000 (inquiry-only)
**Status:** Live (inquiry-only, not in main nav)
**Route:** `/immersion`
**Implementation:** `src/pages/Immersion.tsx`

**For:** CEO sponsors with up to 8 senior leaders who need to resolve specific shared AI tensions in a single afternoon.

**Format:** 4-hour facilitated session (on-site or remote) + 45-minute pre-alignment call with the sponsor + pre-session brief 48 hours before + 2-page board-ready summary within 5 business days. Diagnose → Decompose → Decide → Deploy protocol. Private, no recording, Chatham House rules.

**Outcome:** Three named decisions, three named owners, three named deadlines. 2-page summary that's board-ready and shareable upward without redaction.

**Payment terms:** $12,000 flat. Travel additional for on-site. Full payment at booking or 50/50 at booking + delivery.

**CTA:** "Request a date", opens the scoping modal preselected to "immersion".

---

### Inquiry-Only: 1:1 Engagements

Triggered by `/cohort?inquiry=1:1`. A muted banner surfaces a Contact link. No public pricing, no public page, not promoted. Handled per engagement.

---

## Retired Offers (do not reference)

| Retired | Redirect |
|---|---|
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
| `/tool` (standalone Nervous Decision Machine) | `/signal#decision` |
| `/builder-economy` | external `https://www.thebuildereconomy.com` |

---

## Website Features

### Homepage scroll (`/`)

Authoritative: `src/pages/Index.tsx`. Order:

1. `NewHero`. rotating headlines, eyebrow "Decision blockers I hear every week", looping `/rising-cities.mp4` background, mint pulse, particle background. Primary CTA "Book a call" (Diagnosis Room, express) + secondary "Work through your decision with Mindy" (Diagnosis Room, full) + tertiary "Or start with a free lesson →" / "See how I work →" (`/operator`).
2. `BigProblem`. existential urgency frame (three large interactive flip cards; card CTA opens the `ScopingModal`).
3. `TrustSection`. Krish bio + headshot + testimonials carousel (COHORT-STYLE / ENTERPRISE tagged).
4. `FrameworkJourney`. three-panel animated Mind Set → Mind Map → Mind Make.
5. `OperatorsEdge`. v5 typography-only credential section ("Beyond pattern recognition"). Three proof tiles (Architecture / Optimization / Memory). Primary CTA to Revenue Architecture, secondary link to `/operator`.
6. `OperatorsBrief`. Live Intel homepage teaser. CSS-marquee PriceTicker + rotating interpretation line (3 takes, 8s cross-fade) + compact Nervous Decision input + muted "Open the full dashboard →" link to `/signal`.
7. `MindMakerLiveSection`. Substack newsletter subscribe surface.
8. `SimpleCTA`. final CTA ("What's your nervous decision?"), opens the Diagnosis Room.
9. `Footer`.

The retired `YFork` second fork is no longer rendered.

### Global overlays

Mounted in `src/App.tsx`:
- `DiagnosisRoom`. **the primary "Book a call" conversion surface** (the on-site Mindy experience). Opened via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode } }))` (`mode`: `express` | `full`). Lazy + only mounted when open. Also a standalone page at `/start`. See "The Diagnosis Room (Mindy)" below.
- `ScopingModal`. secondary booking surface, still dispatched by the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and `/case-studies` via `openScopingModal`. 6-field "Scope it with me" intake posting to `notify-scoping-request`.
- `InitialConsultModal`. legacy conversion surface, kept mounted but only `/alumni` still dispatches `openConsultModal`
- `CookieConsent`
- `ErrorBoundary` wrapping the route `Suspense`
- The retired `PreCallQualifier` floating pill is no longer mounted.

### Navigation

File: `src/components/Navigation.tsx`. Primary CTA button: **"Book a call"** with mint pulse dot (opens the Diagnosis Room in express mode; the mobile menu also offers "Or think it through with Mindy first" → full mode).

- **Workshops** (direct link): `/workshops`
- **Cohort** (direct link): `/cohort`
- **Enterprise** (dropdown): The Signal Session, The Revenue Architecture, The AI Immersion, and "For funds & operating partners" → Capital
- **Mindmaker LIVE** (direct link, wordmark): `/signal`
- **Resources** (dropdown): How I operate, Case studies, New Age Leadership, Library, The Builder Economy (Podcast) [external], Lightning Lessons (5 Maven URLs via `LightningLessons` component)
- **About** (dropdown): Contact, Privacy, Terms

Hides on scroll-down via `useScrollDirection`.

### Lightning Lessons (external Maven courses)

Surfaced in the Resources dropdown via the `LightningLessons` component. Five courses:
1. Build Your AI's Permanent Identity
2. Build an Autonomous Business with AI
3. Vibe Coding for Leaders: The Unfair Advantage
4. Build Your Agentic Org Chart
5. Build Your AI Chief of Staff

---

## The Diagnosis Room (Mindy)

**Status:** Live (June 2026). The primary on-site conversion surface.

**What it is:** a full-screen immersive experience where **Mindy** (the on-site guide, reasoning in Krish's voice) diagnoses a visitor's nervous AI decision and forks to three honest exits. Replaces the retired `PreCallQualifier` pill and `YFork` second fork.

**Entry:** the `openDiagnosisRoom` event (`detail: { source_page, seedDecision?, mode? }`) from the nav "Book a call", the hero CTAs, and `SimpleCTA`; plus the standalone page at `/start`. Two modes: `express` (rushes to booking) and `full` (runs the full diagnosis). A pre-session intake form can be presented before the Opener; responses are captured by the `submit-intake` edge function and emailed to Krish.

**Front end** (`src/components/diagnosis/`): `DiagnosisRoom` (orchestrator), `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar`, `CompanyField` (company name typeahead, calls `company-search`), `BrushPainter` (brush-stroke loading animation for proposal generation), `logoLuminance.ts` (co-brand contrast helper), the `useDiagnosisSession` state machine, and `types.ts`. Phases: `opener` → `reading` → `reflect` → `chat` → `brief` → `fork` → `proposal` (plus `express-book`). The room auto-advances through phases (brief, fork, proposal) when Mindy signals readiness, without requiring the visitor to click through manually.

**Three honest exits:**
1. **Keep chatting** (learn).
2. **Book a free 15-min call** → Calendly.
3. **Generate / download a co-branded proposal** ("Mindmaker × [company]" one-pager, PDF via Browserless).

**Back end** (4 edge functions + voice): `enrich-company` (company dossier; identity-depth co-brand paint + full-depth synthesis; free-email → graceful degrade), `mindy-chat` (Claude reasoning turn, voice-gated strict JSON), `generate-proposal` (co-branded one-pager + Browserless PDF), `session-digest` (Resend: full intelligence to Krish + opt-in visitor proposal copy), and `transcribe` (Whisper voice input).

**Privacy:** the dossier's `scale.*` (employeeCount, sizeBand, trancoRank, icp, recommendedMode) is internal routing only, never surfaced to the visitor, never in the visitor copy; only Krish's digest gets the full dossier + transcript.

**Knowledge & guardrails:** Mindy's Brain Pack in [`mindy/`](./mindy/), system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing-range model, proof bank, `CANON.md`, voice-lint. Pricing is ranges only; the honest down-sell rubric can recommend a cheaper rung or a free lesson; anything above ~$12k books the call rather than self-serves.

**Analytics:** `diagnosis_room_*` Plausible events across the funnel.

---

## The AI-Fluent Executive (Cohort) (`/cohort`)

- Offer detail, curriculum structure (Diagnose → Decompose → Decide → Deploy, Weeks 1–4), enrolment flow
- "Hosted on Maven" pill + "Reserve my seat on Maven" CTA route directly to `https://maven.com/mindmaker/the-ai-fluent-executive`
- Next-cohort date currently literal in `Cohort.tsx` (`nextCohort` const); future: Supabase `cohort_dates` table
- `/cohort?inquiry=1:1` query param surfaces the private-engagement banner
- Refund policy: full refund up to 7 days before start; 50% refund up to day one; no refund after day one

---

## Enterprise (`/enterprise`)

- Entry point (Signal Session, $15k, 1 day + 48h delivery) and flagship (Revenue Architecture, $60–100k, 30 days) detailed on one page
- Anchor links `#signal-session`, `#revenue-architecture` for deep-links and redirects
- Comparison table (duration / price / format / best-for / primary output) at the bottom
- "Informed by someone operating one, not just theorizing about it" credential line links to `/operator`

---

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
- Thesis, looping `/ctrl-demo-video.mp4` (autoplay, loop, muted, playsInline) left of body copy (3 paragraphs)
- 5-cluster typography agent diagram listing 14 named agents (Zara, Kai, Nero, Maya, Ravi, Theo, Sol, June, Marcus, Iris, Otto, Ash, Lin, Noor)
- Four extractable lessons (agents-not-employees / memory-as-commercial-decision / cost-as-product-feature / orchestration-fail-points)
- "On stage" strip with three `krish-stage-*` images, auto-advancing every 3.5s, pauses on hover
- Commercial crossover CTA → `/enterprise#revenue-architecture`. Tracked via `plausible('operator_page_cta_clicked')`.

**Design guardrails:** no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards. Every claim passes the CMO-15-second test.

**SEO:** OG type `article`.

---

## The AI Immersion Page (`/immersion`)

Inquiry-only. Linked from the scoping modal preselect (`preselected: "immersion"`).

Structure:
- Hero, "Three decisions. One afternoon. Real alignment." with "Request a date" CTA
- 3-phase format breakdown (alignment / session / summary) with icons
- FAQ block addressing format, virtual-vs-onsite, group size cap, recording policy, travel
- $12,000 pricing card with payment terms

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

- Heading "Beyond *pattern* recognition" (partial-mint treatment on "pattern" only)
- Heading scale matches `FrameworkJourney` exactly: `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`
- Eyebrow "WHO YOU'RE WORKING WITH"
- Three glass tiles: Architecture / Optimization / Memory
- Primary CTA → `/enterprise#revenue-architecture`
- Secondary muted link → `/operator`
- Lead line (the anti-consultant statement) lives in a top-of-file constant for easy single-edit updates

---

## Homepage Y-Fork (RETIRED June 2026)

`src/components/YFork.tsx` (the second homepage fork, "Start where your question actually is.") was removed from `Index.tsx` so the homepage funnels into the one Diagnosis Room journey. The file remains in the tree but is no longer imported. Its three intents (sharpen / resolve / rebuild) are now served by Mindy's diagnosis and the nav (`/workshops`, `/cohort`, `/enterprise`, `/capital`). `NewHero`'s "See how I work →" now links to `/operator` (it previously smooth-scrolled to the Y-fork).

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

- Primary entry point: **the Diagnosis Room (Mindy)**, opened via `openDiagnosisRoom` from the nav "Book a call" (express), the hero (express + full), and `SimpleCTA`. The session ends in a digest (`session-digest` → Resend) and one of three exits (chat / Calendly / proposal).
- Secondary: the global `ScopingModal` (`openScopingModal`, 6-field "Scope it with me" intake → `notify-scoping-request` → emails krish@themindmaker.ai + persists). Still dispatched by the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and `/case-studies`.
- `InitialConsultModal` (`openConsultModal`) is legacy, now dispatched only by `/alumni`.
- Direct-link bypasses: Cohort `Reserve my seat on Maven` (Maven URL), Lightning Lessons (Maven URLs), Builder Economy (external).
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
- `create-consultation-hold`. Stripe (currently bypassed; Cohort payment via Maven)
- `company-search`. Brandfetch typeahead for the company name field in the Diagnosis Room Opener. Returns `{ results: [ { name?, domain, iconUrl? } ] }` for queries 2+ characters. Per-IP rate limit.
- `submit-intake`. pre-session intake form → inserts into `intake_submissions` table + emails Krish via Resend. Honeypot field discards bots silently.
- `submit-testimonial`. public testimonial capture → inserts into `testimonials` table + emails Krish via Resend. Honeypot field discards bots silently.

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
- **Ink** `#0e1a2b` + **Mint** `#7ef4c2`. the two-color system
- Inter Variable (body) + Space Grotesk Variable (display)
- WCAG rule: never `text-mint` on light backgrounds
- `.glass-card`, `.editorial-card`, `.dark-cta-card` utilities

---

## Retired Features (do not reference)

- ChatBot / "Chat with Krish" / "Ask Mindmaker", replaced by `PreCallQualifier`, which is itself now retired
- `PreCallQualifier` floating pill + homepage `YFork` second fork, both retired June 2026 (superseded by the Diagnosis Room). Files remain in the tree but are unmounted.
- `/tool` standalone page, deleted
- `ActionsHub` drawer and Interactive decision tools (BuilderAssessment, TryItWidget, AIDecisionHelper, FrictionMapBuilder, PortfolioBuilder), unmounted
- `VendorLandscape`, `AINewsTicker`, `TheProblem`, `ProductLadder`. replaced
- Engine Room / mm-ctrl visualization, never built for homepage; lives nowhere public
- CTRL as a Mindmaker product, not on site (the demo loop on `/operator` is illustrative only)
- "Signal Desk" naming, renamed to Live Intel
- "The Brief" as a nav label, renamed to Live Intel
- 8–12 week Revenue Architecture timeline, replaced by 30-day intensive
- 5–10 page Signal Session thesis, replaced by 15–20 page Commercial Narrative within 48 hours
- "All Enterprise" footer link, dropped (commit 226ecf1)

---

**End of FEATURES**
