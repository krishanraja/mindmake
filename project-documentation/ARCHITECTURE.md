# Rewrite pending. Contains superseded material.

Parts of this file describe earlier routes, domains, email flows or offers. Trust `project-documentation/MINDMAKE_CANON.md` and `project-documentation/REBUILD_STATE.md` first. This file is rewritten from the deployed end state at launch closure (see HANDOVER/06 outcome 1).

---

# Architecture

> **Current authority, 26 August 2026.** The current architecture is summarised below and governed by `MINDMAKE_CANON.md`, `MINDMAKE_LEAD_DELIVERY_SPEC.md`, `REBUILD_STATE.md` and `DEPLOYMENT.md`. Everything from `Historical pre-rebuild architecture, superseded` onward records the old Mindmaker system. Its Sprint, Teardown, Handover, Mindy, Diagnosis Room, Calendly, public price and route statements are technical history only.

**Last Updated:** 2026-08-26

---

## Current Mindmake architecture

- Public routes present two doors: `Build Your AI Brain` and `Build Your AI GTM`.
- The only primary action is `Start here`. There is no public diary, fit-call button or direct Calendly path.
- The conversion journey is value-first: company website, useful company read and recommendation, one easy question, then an optional private brief by email.
- The browser contract is identifier-only. It may send the visitor email, company domain and allowlisted choice identifiers. The server owns company research, recommendation assembly, verification codes, the visitor brief, Krish's private fit summary and independent delivery attempts.
- Publication interest is a separate, unticked field. It records interest only and never subscribes or imports a person.
- The version-two private hand-off exists in source only and remains fail-closed. With its public flag off, the journey asks for no email, sends nothing and preserves the complete local download.
- The hand-off flag stays off until the preview migration, private-schema grants and advisers, complete request and email matrix, retention cleanup, exact allowed origins and symbolic secret configuration pass.
- The V5 artifact is the visual and interaction floor. The candidate 7 V2 Brain and GTM gateway is an exact frozen contract. Their paths and hashes are recorded in `MINDMAKE_CANON.md`.

## Historical pre-rebuild architecture, superseded

## Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript (strict mode)
- Vite 5.x (build tool)
- TailwindCSS 3.x + `tailwindcss-animate`
- Radix UI (headless components, via shadcn/ui)
- Framer Motion (animations)
- React Router DOM 6.x
- TanStack Query (data fetching and caching)
- React Helmet (SEO)
- Zod (validation)
- `next-themes` (class-based dark mode)

**Backend:**
- Supabase Edge Functions (Deno runtime)

**Third-party services:**
- Anthropic Claude API (Mindy's reasoning in `mindy-chat`, proposal prose in `generate-proposal`, and the Nervous Decision Machine, Haiku 4.5)
- Google Gemini (company synthesis in `enrich-company`; lead enrichment via Google Search grounding inside `send-lead-email`)
- OpenAI API (Whisper voice transcription for the Diagnosis Room; market sentiment; legacy lead-enrichment helper)
- Company-enrichment vendors for the `enrich-company` dossier: Brandfetch (identity/logo/colours), People Data Labs (size), Tranco (rank), BuiltWith (stack), Perplexity / Exa / NewsAPI (currency + proof matching)
- Browserless (proposal HTML → PDF in `generate-proposal`)
- Lovable AI Gateway (Operator's Brief / Live Intel content)
- Resend (transactional email delivery)
- Calendly (scheduling: the Diagnosis Room "book a call" exit + the legacy consult modal)
- Stripe (the Alumni Pass only, invitation-gated, no live checkout on the page)

**Hosting & deployment:**
- Lovable Cloud / Vercel (frontend auto-deploy)
- Supabase Cloud (edge functions)
- GitHub integration (bidirectional sync)

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── Animations/
│   │   │   └── ParticleBackground.tsx  # global particle field
│   │   ├── diagnosis/                # The Diagnosis Room (Mindy), primary conversion surface
│   │   │   ├── DiagnosisRoom.tsx     # orchestrator/overlay (lazy, SSG-safe)
│   │   │   ├── Opener.tsx, Conversation.tsx, DossierReveal.tsx, DecisionBrief.tsx
│   │   │   ├── Fork.tsx, ProposalView.tsx, ExpressBooking.tsx
│   │   │   ├── MicButton.tsx, MindyAvatar.tsx
│   │   │   ├── CompanyField.tsx      # company search typeahead (Brandfetch Search API)
│   │   │   ├── BrushPainter.tsx      # visual effect layer (opener aurora)
│   │   │   ├── logoLuminance.ts      # logo contrast helper (dark/light logo selection)
│   │   │   ├── useDiagnosisSession.ts # the room state machine
│   │   │   ├── types.ts              # edge-function contracts (scale.* is internal-only)
│   │   │   └── index.ts              # barrel exports
│   │   ├── nervous-decision/         # Nervous Decision Machine
│   │   │   ├── Input.tsx             # compact + full sizes
│   │   │   ├── Artifact.tsx
│   │   │   └── types.ts
│   │   ├── new-age/                  # /new-age-leadership components
│   │   │   ├── OrgChart.tsx          # interactive agent-native org chart (lazy)
│   │   │   └── AgathaStory.tsx       # embedded narrative + completion beacon
│   │   ├── proof/                    # CaseStudyCard (for /case-studies)
│   │   ├── NewHero.tsx               # rotating headlines; CTAs open the Diagnosis Room
│   │   ├── BigProblem.tsx            # three interactive flip cards
│   │   ├── TrustSection.tsx          # Krish bio + testimonials carousel
│   │   ├── FrameworkJourney.tsx      # Mind Set → Mind Map → Mind Make
│   │   ├── OperatorsEdge.tsx         # v5 credential section
│   │   ├── OperatorsBrief.tsx        # homepage Live Intel teaser
│   │   ├── PriceTicker.tsx           # CSS-marquee model price ticker
│   │   ├── SimpleCTA.tsx             # final CTA; opens the Diagnosis Room
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── ScopingModal.tsx          # retained fallback booking path (openScopingModal)
│   │   ├── InitialConsultModal.tsx   # legacy conversion surface (openConsultModal); /alumni only
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SEO.tsx
│   │   # YFork.tsx, PreCallQualifier.tsx, ModuleExplorer.tsx and LightningLessons.tsx
│   │   # moved to src/_archive/components/ in August 2026. See its README.
│   ├── pages/
│   │   ├── Index.tsx                 # homepage (eager-loaded)
│   │   # Workshops.tsx + workshops/, Cohort.tsx, Enterprise.tsx, Immersion.tsx and
│   │   # LeadershipInsights.tsx moved to src/_archive/pages/ in August 2026. Their
│   │   # routes are real 301s in vercel.json. See src/_archive/README.md.
│   │   ├── Handover.tsx              # /handover. Three price bands by headcount
│   │   ├── Capital.tsx               # /capital. The same two, per portfolio company
│   │   ├── Operator.tsx              # /operator, 14-agent OS credential
│   │   ├── CaseStudies.tsx           # /case-studies, filterable anonymised proof
│   │   ├── Brief.tsx                 # Live Intel, /signal
│   │   ├── Alumni.tsx                # /alumni. Invitation-only continuity, noindex
│   │   ├── Library.tsx               # /library (includes FAQ tab)
│   │   ├── NewAgeLeadership.tsx      # /new-age-leadership, long-form thought leadership
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Contact.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   └── NotFound.tsx
│   ├── hooks/
│   │   ├── useModelData.ts           # ALLOWED_MODEL_IDS allowlist
│   │   ├── useLeadershipInsights.ts
│   │   ├── useScrollDirection.ts     # navbar hide/show
│   │   └── ...
│   ├── contexts/
│   │   └── SessionDataContext.tsx    # threads qualification data into modal
│   ├── data/
│   ├── lib/
│   ├── integrations/supabase/
│   ├── utils/
│   │   └── calendly.ts
│   ├── index.css                     # design tokens
│   ├── App.tsx                       # routing + global overlays
│   └── main.tsx
├── supabase/
│   ├── functions/
│   │   ├── _shared/                   # incl. mindy/, enrich/, proposal/ (Diagnosis Room logic); also vertex-client.ts, company-research.ts, audience.ts, retry.ts, timeout.ts, validation.ts, logger.ts
│   │   ├── mindy-chat/                # Claude, Mindy's reasoning turn
│   │   ├── enrich-company/            # company dossier orchestrator
│   │   ├── generate-proposal/         # co-branded one-pager + Browserless PDF
│   │   ├── session-digest/            # Resend, intelligence email to Krish + opt-in visitor copy
│   │   ├── transcribe/                # OpenAI Whisper (voice input)
│   │   ├── nervous-decision-machine/  # Anthropic Haiku 4.5
│   │   ├── get-ai-news/               # Live Intel content (Lovable AI Gateway)
│   │   ├── get-market-sentiment/
│   │   ├── get-model-data/            # frontier-model price and spec feed
│   │   ├── send-lead-email/           # Gemini company research + Resend
│   │   ├── send-contact-email/
│   │   ├── send-leadership-insights-email/
│   │   ├── notify-scoping-request/    # ScopingModal intake → Krish
│   │   ├── notify-ctrl-waitlist/      # CTRL waitlist → Krish
│   │   ├── import-audience-csv/       # Substack subscriber CSV → audience_contacts
│   │   ├── create-consultation-hold/  # Stripe, currently bypassed
│   │   ├── company-search/            # Brandfetch Search API typeahead for the Diagnosis Room opener
│   │   ├── submit-intake/             # pre-session intake form → inserts row + emails Krish a brief
│   │   └── submit-testimonial/        # public testimonial submission form → inserts row + emails Krish
│   ├── migrations/
│   └── config.toml
├── public/
│   ├── llms.txt                       # LLM discoverability
│   ├── robots.txt                     # allow-list for GPTBot / ClaudeBot / PerplexityBot / Google-Extended
│   ├── sitemap.xml                    # generated by scripts/generate-sitemap.mjs
│   ├── rising-cities.mp4              # hero background video
│   ├── CTRL-demo-aug-26.mp4            # Shared CTRL demo loop
│   ├── Krish-Headshot.png             # /operator + TrustSection
│   ├── krish-stage-{1,2,3}.{jpg,png}  # /operator stage carousel
│   ├── intake/index.html              # static pre-session intake form (posts to submit-intake)
│   ├── testimonials/index.html        # static testimonial submission form (posts to submit-testimonial)
│   └── ...
├── scripts/
│   ├── generate-sitemap.mjs
│   └── prerender.mjs
├── project-documentation/
├── CLAUDE.md                          # authoritative codebase reference
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## Application Routes

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded via `React.lazy`.

### Live pages

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. CTAs open the Diagnosis Room. |
| `/start` | `DiagnosisRoom` (full page) | The Diagnosis Room (Mindy) as a standalone page. |
| `/teardown` | `Teardown` | The Teardown. One price, currency switcher, the four-step method. |
| `/handover` | `Handover` | The Handover. Three bands by headcount, the six weeks, the Teardown gate and a now-retired private proof disclosure. |
| `/capital` | `Capital` | The third door. The same two engagements, priced per portfolio company; fund terms on the call. |
| `/operator` | `Operator` | How I operate. The 14-agent OS credential page. Looping `/CTRL-demo-aug-26.mp4`. |
| `/case-studies` | `CaseStudies` | Filterable anonymised proof, by Teardown / Handover. Consent-gated testimonials. |
| `/signal` | `Brief` | **Live Intel**, full dashboard. PriceTicker, interpretation grid, classified archive (WATCH/SKIP/CALL/TAKE), Nervous Decision Machine. |
| `/library` | `Library` | Resources, including the FAQ tab. |
| `/new-age-leadership` | `NewAgeLeadership` | Essay on agentic org design. Lazy-loaded `OrgChart` + `AgathaStory`. |
| `/alumni` | `Alumni` | Invitation-only continuity. Hidden from nav and footer, `noindex`, direct URL only. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all |

**Stripe identifiers** are stored in `src/lib/stripe-prices.ts`, which holds identifiers and never prices (prices live in `src/lib/offers.ts`, and a test enforces that). The Alumni Pass is the only entry left in it, and the only thing the site itself charges via Stripe. Even that is invitation-gated rather than a live checkout. The Workshop and Cohort identifiers were removed in August 2026 with the six-rung ladder.

### Client-side redirects (via `<Navigate replace />` / `<HashRedirect />` / `<ExternalRedirect />`)

| Old path | Redirects to | Mechanism |
|---|---|---|
| `/tool` | `/signal#decision` | Navigate |
| `/builder-economy` | `https://www.thebuildereconomy.com` | `ExternalRedirect`, a separate sister domain |
| `/faq` | `/library?tab=questions` | Navigate |
| `/workshops`, `/workshops/:slug` | `/teardown` | HashRedirect |
| `/enterprise`, `/immersion` | `/handover` | HashRedirect |
| `/cohort`, `/leaders`, `/leadership-insights` | `/start` | HashRedirect |
| `/sprints`, `/sprint/4-week`, `/builder-sprint`, `/strategy-day` | `/teardown` | HashRedirect |
| `/sprint/90-day`, `/war-room`, `/fractional-caio` | `/handover` | HashRedirect |
| `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` | `/` | Navigate |

**These are the client-side fallback only.** The real 301s live in `vercel.json` `redirects`, which is what a crawler and a cold visitor hit. The React Router entries exist so in-app navigation to a retired path still lands somewhere sensible, and they return HTTP 200 with the SPA shell rather than a redirect status. `src/test/redirects.test.ts` asserts the two layers agree, that every edge redirect is permanent, and that nothing redirects to a path that is itself redirected.

No `/pricing` page. Pricing lives in context on `/teardown`, `/handover` and `/capital`, each with a `CurrencySwitcher`.

---

## Homepage Scroll Order

Authoritative source: `src/pages/Index.tsx`. Verified 2026-08-11.

1. `Navigation`. Fixed top, hides on scroll-down via `useScrollDirection`.
2. `NewHero`. Rotating headlines, looping `/rising-cities.mp4`, primary CTA "Bring me one real decision" (opens the Diagnosis Room).
3. `BigProblem`. Three large interactive flip cards. The cards dispatch `ScopingModal`.
4. `TwoDoors`. Do it yourself with CTRL, or do it with Krish. No CTRL price on this site.
5. `TrustSection`. Krish bio, headshot, testimonials carousel.
6. `OperatorsEdge`. Dark-background typography-only credential section. CTA to `/handover`.
7. `OperatorsBrief`. Live Intel teaser: marquee `PriceTicker`, rotating interpretation line, compact Nervous Decision input, link to `/signal`.
8. `SimpleCTA`. Final CTA, opens the Diagnosis Room.
9. `Footer`.

`ParticleBackground` is mounted behind all of it.

**Not on the homepage:** `FrameworkJourney` (moved to `/new-age-leadership`), `MindMakerLiveSection`, `VendorLandscape`, `AINewsTicker`, `ActionsHub`, the ChatBot, and the retired `YFork` / `PreCallQualifier` (both in `src/_archive/components/`).

Global overlays mounted in `src/App.tsx`: `DiagnosisRoom` (lazy, only mounted when open so the prerender never instantiates it), `ScopingModal`, `InitialConsultModal`, `CookieConsent`.

---

## Navigation Structure

Authoritative source: `src/components/Navigation.tsx`. Primary CTA: **"Book a call"** with mint pulse dot.

| Slot | Label | Type | Destination |
|---|---|---|---|
| 1 | Workshops | Direct link | `/workshops` |
| 2 | Cohort | Direct link | `/cohort` |
| 1 | Work with me | Dropdown | The Handover → `/handover`, The Teardown → `/teardown`, For funds and portfolio companies → `/capital` |
| 4 | **Mindmaker LIVE** | Direct link (wordmark) | `/signal` |
| 5 | Resources | Dropdown | How I operate → `/operator`, Case studies → `/case-studies`, New Age Leadership → `/new-age-leadership`, Library → `/library`, The Builder Economy (Podcast) → external `thebuildereconomy.com` |
| 6 | About | Dropdown | Contact → `/contact`, Privacy → `/privacy`, Terms → `/terms` |
| CTA | Book a call | Button | Dispatches `openDiagnosisRoom` (express mode); the mobile menu also offers "Or think it through with Mindy first" (full mode) |

Decision Readiness Diagnostic (`/leaders`) is deliberately **not** in nav or footer. The Immersion (`/immersion`) is reachable via the Enterprise dropdown, the footer, or direct URL.

---

## Pricing (canonical)

| Engagement | Price (USD) | Duration |
|---|---|---|
| The Handover | $18,000 / $30,000 / $50,000 by headcount | Six weeks + a Day 90 recheck |
| The Teardown | $9,500 | Ten business days, under two hours of client time |

Also published in GBP and AUD as set prices per market. Canonical source: `src/lib/offers.ts`. A test fails the build if a price string appears anywhere else in the web surface.


The Handover is capped at six a year, and the cap is stated publicly because it is part of the offer.

Payment: The Teardown on kickoff. The Handover 50/50 at kickoff and delivery. **No discounts are published anywhere.**

---

## Data Flows

### Booking / conversion flow (current), the Diagnosis Room

Nothing on this site takes a payment. The Teardown price is published and self-serve in the sense that the buyer knows the number before they talk to anyone, but the transaction itself is invoiced direct. The Handover always goes through a call. Every primary CTA opens the Diagnosis Room (Mindy); `ScopingModal` is a retained fallback dispatched by the `BigProblem` cards and `/case-studies`.

```
1. User clicks "Book a call" / "Work through your decision with Mindy" anywhere on site
   └─> window.dispatchEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode } })
   └─> DiagnosisRoom opens (lazy). mode 'express' rushes to booking; 'full' runs the diagnosis.

2. Opener: visitor states one nervous AI decision (+ optional work email; mic input via `transcribe`)
   └─> if a non-free work email: supabase.functions.invoke('enrich-company', { email, depth:'identity' })
       └─> fast Brandfetch + Tranco dossier → the co-brand "gasp"; full depth enriches in the background
       └─> free-email (gmail, etc.) → { skipped:'free-email' } → graceful degrade, no gasp

3. Conversation: supabase.functions.invoke('mindy-chat', { messages, dossier, sessionId, mode })
   └─> Claude reasons in Krish's voice; returns reply, phase, quickReplies, recommendation,
       decisionBrief, readyForProposal, readyForCall (strict JSON, voice-gated)
   └─> the dossier's scale.* routing layer is NEVER surfaced client-side

4. Fork → one of three honest exits:
   ├── keep chatting (learn)
   ├── book a fit call → Calendly (CALENDLY_URL) → endSession('book-call')
   └── generate a co-branded proposal → invoke('generate-proposal', { ..., format:'html'|'pdf' })
       └─> "Mindmaker × [company]" one-pager; PDF via Browserless (print-fallback on failure)

5. On a meaningful end: supabase.functions.invoke('session-digest', { ...transcript, endedVia })
   └─> emails Krish the FULL intelligence; if opted in + proposal exists, emails the visitor their copy
```

The legacy path (now `/alumni` only) dispatches `openConsultModal` → `InitialConsultModal` → `send-lead-email` (company research, skipped for personal email domains) → Calendly redirect. The `ScopingModal` fallback dispatches `openScopingModal` → `notify-scoping-request` (emails Krish).

### Diagnosis Room phases & privacy contract

Room phases (`RoomPhase` in `diagnosis/types.ts`): `opener` → `reading` (enrichment) → `reflect` (dossier reveal) → `chat` → `brief` (kept one-screen decision brief) → `fork` → `proposal`; `express-book` is the express shortcut. The session state machine is `useDiagnosisSession.ts`.

**Privacy:** `dossier.scale.*` (`employeeCount`, `sizeBand`, `trancoRank`, `icp`, `recommendedMode`) is **internal routing only**, stripped from every view, never recited by Mindy, never in the visitor proposal/digest copy. Only Krish's internal digest receives the full dossier + transcript. Mindy's knowledge/guardrails live in `project-documentation/mindy/` (Brain Pack).

### Nervous Decision Machine Flow

Embedded inside `OperatorsBrief` on homepage and inside `Brief.tsx` at `/signal`. No standalone page, `/tool` redirects to `/signal#decision`.

```
1. User types a nervous decision prompt (compact or full input)
2. supabase.functions.invoke('nervous-decision-machine', { prompt })
3. Edge function calls Anthropic API
   └─> Model: claude-haiku-4-5-20251001, max 1500 tokens
   └─> System prompt enforces JSON schema + Krish's voice
   └─> 1-hour per-IP rate limit + global request ceiling (soft circuit breaker)
   └─> Requires ANTHROPIC_API_KEY
4. Response renders via Artifact.tsx (typed schema in types.ts)
```

### Decision Readiness Diagnostic Flow (`/leaders`)

Route unlinked from nav; deep-link only.

```
1. Intro → 6 Likert-scale questions (auto-advance)
2. Optional: 5 personalization questions, or skip
3. Generation phase with progress animation (never regresses)
4. Results (calculated client-side):
   ├── Decision Readiness Score + tier
   ├── Top 3 nervous decisions (curated from answer patterns)
   └── Collapsible unlock form → send-leadership-insights-email
5. Edge function delivers user results + lead notification to Krish
```

### Live Intel (`/signal`) Flow

- Extended `PriceTicker` using canonical `ALLOWED_MODEL_IDS` from `src/hooks/useModelData.ts` (current set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini)
- 3-card plain-English interpretation grid
- Classified card archive (WATCH / SKIP / CALL / TAKE) with filter pills + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

Price and model data flows through `get-model-data` edge function. Editorial cards currently inline; `get-ai-news` schema preserved for future dynamic feed.

---

## Edge Functions

Location: `supabase/functions/[function-name]/index.ts`. All functions set `verify_jwt = false` in `supabase/config.toml`. Shared Diagnosis Room logic lives in `_shared/{mindy,enrich,proposal}/`.

### `mindy-chat` (Diagnosis Room)
- Mindy's conversational reasoning turn. Composes the Brain Pack (system prompt + reasoning guide + fit rubric + pricing card) + a formatted dossier block, calls Claude, parses a strict-JSON turn, runs the runtime voice gate
- Returns `reply`, `phase`, `quickReplies`, `recommendation`, `decisionBrief`, `readyForProposal`, `readyForCall`. The dossier's `scale.*` is fenced as INTERNAL ROUTING and never returned
- Secret: `ANTHROPIC_API_KEY`

### `enrich-company` (Diagnosis Room)
- The dossier orchestrator. Fans out to enrichment clients, merges partials, derives an internal ICP routing signal, and (full depth) writes a one-paragraph synthesis in Krish's voice
- `depth:'identity'` → Brandfetch + Tranco (fast co-brand paint); `depth:'full'` → adds PDL + BuiltWith + currency, then Gemini/Anthropic synthesis. Free-email domains → `{ skipped:'free-email' }`
- In-memory result cache (1h TTL), per-IP rate limit, global ceiling. A missing key just disables that tool (dossier degrades, never fails)
- Secrets (all optional): `BRANDFETCH_API_KEY`, `PEOPLEDATALABS_API_KEY`, `BUILTWITH_API_KEY`, `EXA_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`

### `generate-proposal` (Diagnosis Room)
- Builds the co-branded "Mindmaker × [company]" one-pager. Deterministic shell + dossier + selected proof, with reflective prose in one Claude call, voice-linted
- `format:'html'` (default) returns `{ html, payload, proposalId }`; `format:'pdf'` renders via Browserless → `{ pdfBase64, proposalId }`, or on failure `{ html, …, pdfFallback:true }` for client print
- Secrets: `ANTHROPIC_API_KEY`, `BROWSERLESS_API_KEY`

### `session-digest` (Diagnosis Room)
- Fires on a meaningful end (`chat` / `book-call` / `proposal`). Emails Krish the FULL session (contact, recommendation, decision brief, full dossier incl. `scale`, transcript, proposal HTML attachment); if the visitor opted in + supplied a valid email + a proposal exists, emails them ONLY their proposal. The two sends are independent
- Secret: `RESEND_API_KEY`

### `transcribe` (Diagnosis Room)
- Server-side voice transcription for the mic input. Base64 audio → OpenAI Whisper (`whisper-1`) → `{ text }`. ~8MB cap, per-IP rate limit
- Secret: `OPENAI_API_KEY`

### `import-audience-csv`
- Ingests a Substack subscriber CSV export into the shared `audience_contacts` table (`source='mindmaker_live'`); paid subscribers flagged. Upserts on (email, source)
- Gated by `AUDIENCE_IMPORT_SECRET` (x-import-secret header). Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `AUDIENCE_IMPORT_SECRET`

### `nervous-decision-machine`
- Powers the Nervous Decision Machine embedded on homepage + `/signal`
- Anthropic Claude (`claude-haiku-4-5-20251001`)
- 1500 token max, JSON output schema, Krish's voice enforced in system prompt
- 1-hour per-IP rate limit + global request ceiling (soft circuit breaker)
- Secret: `ANTHROPIC_API_KEY`

### `get-ai-news`
- Powers Live Intel editorial feed (taxonomy: WATCH / SKIP / CALL / TAKE)
- Currently archive cards inline in `Brief.tsx`; schema preserved for future dynamic feed
- Secret: `LOVABLE_API_KEY` (auto-provisioned)

### `get-market-sentiment`
- Market sentiment analysis (OpenAI)
- Secret: `OPENAI_API_KEY`

### `get-model-data`
- Frontier-model price and spec feed for `PriceTicker` and `/signal` interpretation grid
- Allowlist lives in `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`

### `send-lead-email`
- Captures and enriches lead data (Gemini company research with Google Search grounding; OpenAI as fallback). Used by the legacy `/alumni` consult path
- Resend API for delivery, 3× retry with exponential backoff
- Personal email domains skip the company-research step
- Secrets: `RESEND_API_KEY`, `GEMINI_API_KEY` (preferred), `OPENAI_API_KEY` (fallback)

### `send-contact-email`
- Contact form submissions
- Secret: `RESEND_API_KEY`

### `send-leadership-insights-email`
- Dual email delivery: diagnostic results to user + lead notification to Krish
- Secret: `RESEND_API_KEY`

### `notify-scoping-request`
- Powers the `ScopingModal` submissions (the secondary booking surface); emails krish@themindmaker.ai via Resend + persists the request
- Secret: `RESEND_API_KEY`

### `notify-ctrl-waitlist`
- CTRL waitlist signups (`CtrlWaitlistPopover`); emails krish@themindmaker.ai via Resend
- Secret: `RESEND_API_KEY`

### `create-consultation-hold` (bypassed)
- Stripe authorization hold, currently bypassed. Nothing on the site charges through it.
- Secret: `STRIPE_SECRET_KEY`

### `company-search`
- Thin, fast typeahead for the Diagnosis Room opener. Takes a partial company name, queries the Brandfetch Search API, and returns ranked matches with name, registrable domain, and CDN icon URL
- Empty or very short queries degrade gracefully to empty results (200). Per-IP rate limit: 80 requests / 5 min
- Secrets: `BRANDFETCH_API_KEY` or `BRANDFETCH_CLIENT_ID` (either works)

### `submit-intake`
- Receives pre-session intake form submissions. Inserts a row into the intake table and emails Krish a formatted brief (SNAPSHOT section: seat, AI confidence, value frame, aspiration, business one-liner, north star, role-aware handoff, remaining chip answers)
- Deployed with `verify_jwt = false` (public form). Mirrors the `submit-testimonial` structure
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### `submit-testimonial`
- Public testimonial submission endpoint. Inserts a row into `public.testimonials` and emails Krish a notification. Includes a honeypot field for bot prevention
- Deployed with `verify_jwt = false`. Validates permission level (free / edits / private)
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

---

## State Management

- **Routing / URL state:** React Router v6 (`BrowserRouter` in `App.tsx`)
- **Server state:** TanStack Query (5-minute stale time)
- **Form state:** React Hook Form + Zod schemas
- **Context state:** `SessionDataContext` threads qualifier answers into the conversion modals. The Diagnosis Room holds its own session in `useDiagnosisSession` (dossier, transcript, recommendation, decision brief, proposal). `ThemeProvider` (next-themes) handles dark mode via class attribute.
- **Local storage:** none required by the Diagnosis Room (session is in-memory; digests are server-side). The retired `PreCallQualifier`, now archived, used `mindmaker:pre-call-qualifier`.
- **No user authentication:** all bookings via Calendly; no user accounts

---

## Database

- Supabase connected, minimal usage
- Tables: `leads`, `company_research_cache`, `audience_contacts` (Substack CSV import, upserted on email + source), `testimonials` (public submissions via `submit-testimonial`)
- RLS policies on all tables

---

## Performance

- Route-based code splitting via React Router + `React.lazy` (everything except Index)
- Vite automatic chunking
- Variable fonts (Inter Variable, Space Grotesk Variable), preloaded
- Lucide React icons (SVG, tree-shakeable)
- TanStack Query 5-min stale time
- Hero background video (`/rising-cities.mp4`) preloaded
- CTRL demo video (`/CTRL-demo-aug-26.mp4`) inline, muted and responsive, with play/pause and a load-error fallback
- CSS-marquee `PriceTicker` (no native scrollbar, pauses on hover, respects `prefers-reduced-motion`)
- `OrgChart` on `/new-age-leadership` is `Suspense`-lazy-loaded so it doesn't block hero LCP

---

## SEO & LLM Discoverability

- Meta + Open Graph across all pages via `SEO.tsx`
- Structured data (Schema.org JSON-LD); `/new-age-leadership` ships `Article` schema with `mainEntityOfPage`
- `scripts/generate-sitemap.mjs` generates `public/sitemap.xml` during build
- `scripts/prerender.mjs` prerenders key routes post-build
- `public/llms.txt` for LLM summaries
- `public/robots.txt` allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `/operator` OG type set to `article`
- Plausible events (`window.plausible(...)` if present):
  - `operator_page_cta_clicked`. The commercial crossover CTA from `/operator`
  - `diagnosis_room_*`. the Diagnosis Room funnel: `diagnosis_room_start`, `diagnosis_room_express_start`, `diagnosis_room_switch_to_full`, `diagnosis_room_view_brief`, `diagnosis_room_fork`, `diagnosis_room_book_call`, `diagnosis_room_generate_proposal`, `diagnosis_room_pdf_downloaded`, `diagnosis_room_digest_sent`

---

## Build & Deploy

```bash
npm run dev     # Vite dev server
npm run lint    # ESLint
npm run build   # Vite build → generate-sitemap.mjs → prerender.mjs → dist/
```

Push to GitHub triggers Lovable / Vercel auto-deploy. Edge functions auto-deploy (30–60s propagation).

---

## Secrets Reference

| Secret | Purpose | Required |
|---|---|---|
| `ANTHROPIC_API_KEY` | Mindy reasoning, proposal prose, Nervous Decision Machine | Yes |
| `GOOGLE_AI_API_KEY` | Gemini company synthesis (`enrich-company`) | Recommended |
| `GEMINI_API_KEY` | Lead enrichment with Google Search grounding (`send-lead-email`) | Yes (preferred) |
| `OPENAI_API_KEY` | Whisper transcription, market sentiment, enrichment fallback | Yes |
| `RESEND_API_KEY` | Email delivery (`session-digest` + `send-*`) | Yes |
| `BROWSERLESS_API_KEY` | Proposal HTML → PDF (`generate-proposal`) | Recommended |
| `BRANDFETCH_API_KEY` | Company identity / logo / colours (`enrich-company`); typeahead search (`company-search`) | Optional* |
| `BRANDFETCH_CLIENT_ID` | Alternative credential for Brandfetch (`company-search` accepts either) | Optional* |
| `PEOPLEDATALABS_API_KEY` | Company size / routing signal | Optional* |
| `BUILTWITH_API_KEY` | Tech-stack signal | Optional* |
| `EXA_API_KEY` | Proof matching + currency | Optional* |
| `PERPLEXITY_API_KEY` | Company currency / recent signals | Optional* |
| `NEWSAPI_API_KEY` | Recent news for the dossier | Optional* |
| `AUDIENCE_IMPORT_SECRET` | Gate for `import-audience-csv` | Optional |
| `LOVABLE_API_KEY` | AI Gateway (auto-provisioned by Lovable Cloud) | Auto |
| `STRIPE_SECRET_KEY` | Payment holds, bypassed. Nothing on the site charges through it | Optional |
| `SUPABASE_*` | Auto-configured by Lovable Cloud | Auto |

\* Each missing `enrich-company` key just disables that one tool; the dossier degrades but does not fail.

---

**End of ARCHITECTURE**
