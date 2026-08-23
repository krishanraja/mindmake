# Architecture

> This file now leads with the **current** architecture: real routes, real navigation, the one Sprint offer, and the actual booking flow (visitor → `BookFitCall` → Calendly). Sections explicitly marked **Historical (pre-rebuild)** describe the earlier Diagnosis Room / Nervous Decision Machine / ladder-of-offers system. That code is largely still in the repo but is dormant and unrouted — treat it as technical history, not current product truth. For the current public contract, also see `README.md`, `CLAUDE.md`, `REBUILD_STATE.md` and `CTA_PATH_AUDIT.md`.

**Last Updated:** 2026-08-23

---

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
│   │   ├── Sprint.tsx                # /sprint, the one public paid offer
│   │   ├── Handover.tsx              # dormant, /handover now redirects to /sprint
│   │   ├── Capital.tsx               # dormant, /capital now redirects to /sprint
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
│   │   └── rebuildProof.ts           # attendeeBrands + clientStories proof data
│   ├── lib/
│   │   └── publicLinks.ts            # verified public destinations (BOOKING_URL, MINDMAKER_LIVE_URL)
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

### Direct pages

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. |
| `/sprint` | `Sprint` | The one public paid offer. 21-day Sprint, price not public. |
| `/case-studies` | `CaseStudies` | Approved proof archive. |
| `/operator` | `Operator` | "How I operate." 14-agent OS credential page, looping CTRL demo video. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | |
| `/library` | `Library` | Resources, including the FAQ/questions tab. |
| `/new-age-leadership` | `NewAgeLeadership` | Essay on agentic org design. |
| `/contact` | `Contact` | General messages. Does not replace the fit call. |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `/alumni` | `Alumni` | Invitation-only continuity. Hidden from nav and footer, `noindex`, direct URL only. |
| `*` | `NotFound` | Catch-all 404. |

### External redirects (`ExternalRedirect`, via `window.location.replace`)

| Route | Destination |
|---|---|
| `/start` | `BOOKING_URL` (Calendly) |
| `/decision` | `BOOKING_URL` (Calendly) |
| `/signal` | `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`) |
| `/builder-economy` | `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`) |

### In-app redirects (`<Navigate replace />`)

| Route | Redirects to |
|---|---|
| `/faq` | `/library?tab=questions` |

### Retired paths → `/sprint`

All render `<ToSprint />` (`<Navigate to="/sprint" replace />`): `/teardown`, `/handover`, `/capital`, `/tool`, `/workshops`, `/workshops/:slug`, `/enterprise`, `/immersion`, `/cohort`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` — roughly 22 paths in total.

No `/pricing` page. There is one public paid offer (see Pricing below).

---

## Homepage Scroll Order

Authoritative source: `src/pages/Index.tsx`. Verified 2026-08-23. Everything renders inline in the page file — there are no separate `NewHero` / `BigProblem` / `TrustSection` / `FrameworkJourney` / `OperatorsEdge` / `OperatorsBrief` / `MindMakerLiveSection` / `SimpleCTA` section components on this page.

1. `Navigation`. Fixed top, hides on scroll-down via `useScrollDirection`.
2. Hero. Dark (`bg-ink`) section with a looping `/rising-cities.mp4` background, eyebrow, H1 ("Make the right call as AI changes your business."), primary `BookFitCall` + a secondary link to `/sprint`, and a stage-photo collage.
3. Attendee-brands strip. "Mindmaker has helped over 4000 leaders…" heading + a row of attendee logos from `attendeeBrands` (`src/data/rebuildProof.ts`).
4. Problem-framing section. Two-card grid ("Faster startups are taking your market." / "You can grow, but something is holding you back.").
5. Sprint pitch section (`#work-with-me`, dark). "One decision. 21 days." copy, a `BookFitCall`, a 4-up grid of decision types (Product / Price / Go to market / Company), a 3-up outcome list, and a link to `/sprint`.
6. CTRL demo section. `CtrlDemoVideo` component in a framed card, plus copy on keeping the thinking (not just the answer) and a consent-gated Steph Darmanin quote (hidden unless her testimonial consent is present via `useTestimonials`).
7. Client-results carousel. First four `clientStories` (`src/data/rebuildProof.ts`) in a horizontally-scrolling card row, with a link to `/case-studies`.
8. Krish bio section. Headshot, "Built in business, not in a slide deck." copy, and an Ashley Wales-Brown quote.
9. Final CTA section (dark). Closing copy + `BookFitCall`.
10. `Footer`.

`ParticleBackground` is mounted behind all of it. There are no global overlays mounted in `App.tsx` — no Diagnosis Room, no `ScopingModal`, no `InitialConsultModal`.

---

## Navigation Structure

Authoritative source: `src/components/Navigation.tsx`. No dropdowns.

| Element | Label | Type | Destination |
|---|---|---|---|
| Logo | Mindmaker | Direct link | `/` |
| 1 | The Sprint | Direct link | `/sprint` |
| 2 | Results | Direct link | `/case-studies` |
| 3 | Mindmaker Live (wordmark pill) | External link | `MINDMAKER_LIVE_URL`, new tab |
| CTA | **Book a fit call** | `BookFitCall` component | `BOOKING_URL` (Calendly), new tab, `utm_source` per placement |

The mobile menu (`lg:hidden`, hamburger toggle) mirrors the same two links, the Live pill and the `BookFitCall` CTA. A separate button toggles light/dark theme. The nav hides on scroll-down via `useScrollDirection`. There is no `openDiagnosisRoom` dispatch anywhere in this component.

The footer (`src/components/Footer.tsx`) groups links as **Work** (The Sprint / Results / How I operate), **Read** (Mindmaker Live / Library / Articles / New Age Leadership), **Company** (Contact / Privacy / Terms), plus its own `BookFitCall`.

---

## Pricing

There is **one** public paid offer: the 21-day Sprint at `/sprint`. The price is not public — it is agreed on the fit call. CTRL is a deliverable produced during the Sprint, not a second offer or a separately priced product on this site. `src/lib/offers.ts` (Handover/Teardown price data) still exists in the repo but is dormant — nothing in the live route tree reads from it.

---

## Data Flows

### Current flow: fit call booking

Nothing on this site takes a payment and there is no on-site qualification, gate, chat, or modal in front of booking. Every primary CTA across the live route tree is the same `BookFitCall` component (`src/components/BookFitCall.tsx`), placed with a `source` string (hero, sprint pitch, results, final CTA, nav, footer, operator page, etc.) and pointed at `BOOKING_URL` (Calendly, from `src/lib/publicLinks.ts`).

```
1. Visitor clicks "Book a fit call" anywhere on the site
   └─> plausible('fit_call_clicked', { props: { source } }) fires if analytics are present
       (booking still works if analytics are blocked — the try/catch never blocks the link)
   └─> new tab opens to `${BOOKING_URL}?utm_source=<source>` (Calendly)

2. Visitor books directly on Calendly. No dossier, no session, no digest email pipeline.
```

`/start` and `/decision` also resolve straight to `BOOKING_URL` via `ExternalRedirect`. `/signal` and `/builder-economy` resolve to `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`) the same way — external redirects, not internal pages.

### Historical (pre-rebuild): Diagnosis Room booking flow

The Diagnosis Room, `ScopingModal`, and `InitialConsultModal` described below are **not mounted anywhere in the current route tree**. Their component files and edge functions still exist in the repo (dormant, unrouted) and are documented here only as technical history of the earlier conversion system.

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

The legacy path (formerly `/alumni` only) dispatched `openConsultModal` → `InitialConsultModal` → `send-lead-email` (company research, skipped for personal email domains) → Calendly redirect. The `ScopingModal` fallback dispatched `openScopingModal` → `notify-scoping-request` (emails Krish).

#### Diagnosis Room phases & privacy contract (historical)

Room phases (`RoomPhase` in `diagnosis/types.ts`): `opener` → `reading` (enrichment) → `reflect` (dossier reveal) → `chat` → `brief` (kept one-screen decision brief) → `fork` → `proposal`; `express-book` is the express shortcut. The session state machine is `useDiagnosisSession.ts`.

**Privacy:** `dossier.scale.*` (`employeeCount`, `sizeBand`, `trancoRank`, `icp`, `recommendedMode`) is **internal routing only**, stripped from every view, never recited by Mindy, never in the visitor proposal/digest copy. Only Krish's internal digest receives the full dossier + transcript. Mindy's knowledge/guardrails live in `project-documentation/mindy/` (Brain Pack).

#### Nervous Decision Machine flow (historical)

Was embedded inside `OperatorsBrief` on the homepage and inside `Brief.tsx` at `/signal`, when `/signal` was still an internal page rather than an external redirect.

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

#### Decision Readiness Diagnostic flow (historical, `/leaders`)

`/leaders` and `/leadership-insights` are now retired paths that redirect to `/sprint` (see Application Routes). This flow describes the page as it existed before the redirect.

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

#### Live Intel dashboard flow (historical, `/signal`)

`/signal` is now an external redirect to `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`), not an internal dashboard. This describes the internal `Brief.tsx` page as it existed before the redirect.

- Extended `PriceTicker` using canonical `ALLOWED_MODEL_IDS` from `src/hooks/useModelData.ts`
- 3-card plain-English interpretation grid
- Classified card archive (WATCH / SKIP / CALL / TAKE) with filter pills + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

Price and model data flowed through the `get-model-data` edge function. Editorial cards were inline; `get-ai-news` schema was preserved for a future dynamic feed.

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

### `personalize-intake`
- Progressive enhancement for the static `/intake` form. Given a SAFE company dossier (never `dossier.scale.*`) plus the visitor's seat, generates one or two tiny voice-linted microcopy fragments (`business_reflect`, `aspiration_nudge`)
- Deterministic fallback always exists on the page; any failure, empty input, or off-voice output returns `{ fragments: {} }` and the static copy is used instead
- Deployed with `verify_jwt = false` (called from the static page with the anon key)
- Secret: `ANTHROPIC_API_KEY` (via the shared `enrich/llm.ts` client)

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
- Plausible events (`window.plausible(...)` if present): `fit_call_clicked`, fired by `BookFitCall` everywhere it's used, tagged with a `source` placement string. The historical `operator_page_cta_clicked` and `diagnosis_room_*` funnel events are no longer fired — that tracking code is dormant along with the Diagnosis Room.

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
