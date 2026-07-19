# Architecture

**Last Updated:** 2026-07-19

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
- Anthropic Claude API (Mindy's reasoning in `mindy-chat`, proposal prose in `generate-proposal`, the Nervous Decision Machine Haiku 4.5, and the Anthropic fallback leg of the shared Gemini→Anthropic text helper, `_shared/enrich/llm.ts`)
- Google Gemini (`gemini-2.5-flash`, via `_shared/enrich/llm.ts`): the dossier synthesis paragraph in `enrich-company`/the lead pipeline, and every lead digest's "operator's read". Falls back to Anthropic Haiku 4.5 on any failure
- OpenAI API (Whisper voice transcription for the Diagnosis Room; market sentiment; `get-ai-news` fallback). No longer used for lead enrichment
- Company-enrichment vendors behind the shared dossier orchestrator (`_shared/enrich/orchestrate.ts`, used by both `enrich-company` and every lead-capture surface): Brandfetch (identity/logo/colours), People Data Labs (size), Tranco (rank), BuiltWith (stack), Perplexity / Exa / NewsAPI (currency + proof matching)
- Browserless (proposal HTML → PDF in `generate-proposal`)
- Lovable AI Gateway (Live Intel content, `get-ai-news` fallback path)
- **CTRL shared pool** (`live_headlines_cache`, read by `get-ai-news`; `portfolio-pulse`, read by `PortfolioPulse.tsx`): cross-product infrastructure shared with CTRL and Make Your Mind Up. Implementation lives outside this repo; canonical record is the `mm-ctrl` repo's `docs/PORTFOLIO-HIVE-MIND.md`
- Resend (transactional email delivery)
- Calendly (scheduling: the Diagnosis Room "book a call" exit + the legacy consult modal)
- **Maven** (Cohort enrolment, payment, cohort Slack, alumni network)
- Stripe (payment holds, currently bypassed; Cohort payment flows through Maven)

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
│   │   ├── PortfolioPulse.tsx        # The Cohort Signal, /signal only; anonymised cross-product hive-mind widget
│   │   ├── LightningLessons.tsx      # 5 Maven Lightning Lesson links
│   │   ├── SimpleCTA.tsx             # final CTA; opens the Diagnosis Room
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── ScopingModal.tsx          # retained fallback booking path (openScopingModal)
│   │   ├── InitialConsultModal.tsx   # legacy conversion surface (openConsultModal); /alumni only
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SEO.tsx
│   │   # YFork.tsx + PreCallQualifier.tsx still exist but are no longer imported/mounted.
│   ├── pages/
│   │   ├── Index.tsx                 # homepage (eager-loaded)
│   │   ├── Workshops.tsx + workshops/ # /workshops index + 5 sub-pages
│   │   ├── Cohort.tsx                # The AI-Fluent Executive (Cohort) (Maven enrolment)
│   │   ├── Enterprise.tsx            # Signal Session + Revenue Architecture + Immersion
│   │   ├── Capital.tsx               # /capital (third door for funds)
│   │   ├── Operator.tsx              # /operator, 14-agent OS credential
│   │   ├── CaseStudies.tsx           # /case-studies, filterable anonymised proof
│   │   ├── Brief.tsx                 # Live Intel, /signal
│   │   ├── Immersion.tsx             # /immersion. AI Immersion ($12k, inquiry-only)
│   │   ├── Alumni.tsx                # /alumni. Alumni Pass (invitation-only, noindex)
│   │   ├── Library.tsx               # /library (includes FAQ tab)
│   │   ├── NewAgeLeadership.tsx      # /new-age-leadership, long-form thought leadership
│   │   ├── LeadershipInsights.tsx    # Decision Readiness Diagnostic, /leaders
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
│   │   ├── _shared/
│   │   │   ├── lead/                  # unified lead pipeline: types.ts (LeadEvent), adapters.ts (per-source mappers), pipeline.ts (dispatchLead/processLead), render.ts (one digest renderer), operator-read.ts, escape.ts
│   │   │   ├── http/                  # cors.ts, resend.ts (shared Resend send helper)
│   │   │   ├── enrich/                # orchestrate.ts (assembleDossier, shared by enrich-company + the lead pipeline), llm.ts (Gemini→Anthropic completeText), synthesize.ts, types.ts, + vendor clients
│   │   │   ├── mindy/, proposal/      # Diagnosis Room reasoning + proposal-generation logic
│   │   │   └── vertex-client.ts, company-research.ts, audience.ts, retry.ts, timeout.ts, validation.ts, logger.ts
│   │   ├── mindy-chat/                # Claude, Mindy's reasoning turn
│   │   ├── enrich-company/            # thin HTTP wrapper over _shared/enrich/orchestrate.ts
│   │   ├── generate-proposal/         # co-branded one-pager + Browserless PDF
│   │   ├── session-digest/            # unified lead pipeline (dossier already built client-side, enrich.skip); visitor proposal copy sent independently
│   │   ├── transcribe/                # OpenAI Whisper (voice input)
│   │   ├── nervous-decision-machine/  # Anthropic Haiku 4.5
│   │   ├── get-ai-news/               # Live Intel content (Lovable AI Gateway)
│   │   ├── get-market-sentiment/
│   │   ├── get-model-data/            # frontier-model price and spec feed
│   │   ├── send-lead-email/           # unified lead pipeline (dispatchLead + fromLead); persists the resolved dossier into leads.company_research
│   │   ├── send-contact-email/        # unified lead pipeline (dispatchLead + fromContact)
│   │   ├── send-leadership-insights-email/  # visitor score-card (own template, unchanged) + Krish notification via the unified lead pipeline
│   │   ├── notify-scoping-request/    # ScopingModal intake → unified lead pipeline
│   │   ├── notify-ctrl-waitlist/      # CTRL waitlist → unified lead pipeline
│   │   ├── import-audience-csv/       # Substack subscriber CSV → audience_contacts
│   │   ├── create-consultation-hold/  # Stripe, currently bypassed
│   │   ├── company-search/            # Brandfetch Search API typeahead for the Diagnosis Room opener
│   │   ├── submit-intake/             # pre-session intake form → inserts row + unified lead pipeline digest
│   │   └── submit-testimonial/        # public testimonial submission form → inserts row + unified lead pipeline digest
│   ├── migrations/
│   └── config.toml
├── public/
│   ├── llms.txt                       # LLM discoverability
│   ├── robots.txt                     # allow-list for GPTBot / ClaudeBot / PerplexityBot / Google-Extended
│   ├── sitemap.xml                    # generated by scripts/generate-sitemap.mjs
│   ├── rising-cities.mp4              # hero background video
│   ├── ctrl-demo-video.mp4            # /operator demo loop
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
| `/` | `Index` | Homepage, eager-loaded. CTAs open the Diagnosis Room |
| `/start` | `DiagnosisRoom` (full page) | The Diagnosis Room (Mindy) as a standalone page; closing it navigates to `/` |
| `/workshops` | `Workshops` | Mindmaker Workshops index. Five $599 one-day workshops on Maven. |
| `/workshops/build-your-ai-chief-of-staff` | `workshops/BuildYourAIChiefOfStaff` | Workshop sub-page. CTA: "Enrol on Maven" or "Get notified". |
| `/workshops/map-your-agentic-org-chart` | `workshops/MapYourAgenticOrgChart` | Workshop sub-page. |
| `/workshops/vibe-coding-for-leaders` | `workshops/VibeCodingForLeaders` | Workshop sub-page. |
| `/workshops/build-an-autonomous-business-function` | `workshops/BuildAnAutonomousBusinessFunction` | Workshop sub-page. |
| `/workshops/give-your-ai-memory` | `workshops/GiveYourAIMemory` | Workshop sub-page. |
| `/cohort` | `Cohort` | The AI-Fluent Executive (Cohort) ($2,500/seat, 4 weeks). Enrolment on **Maven** at `maven.com/mindmaker/the-ai-fluent-executive`. Banner appears on `?inquiry=1:1`. |
| `/enterprise` | `Enterprise` | The Signal Session ($15k, 1 day + 48h delivery) + The Revenue Architecture ($60–100k, 30 days). Anchors `#signal-session`, `#revenue-architecture`. |
| `/capital` | `Capital` | Third door for funds and operating partners. Same Signal Session and Revenue Architecture engagement formats, repositioned for fund-level buyers. |
| `/operator` | `Operator` | (v5) How I operate, 14-agent OS credential page. Looping `/ctrl-demo-video.mp4`. |
| `/case-studies` | `CaseStudies` | Filterable anonymised client case studies (COHORT-STYLE / ENTERPRISE). Linked from Resources nav + footer. |
| `/signal` | `Brief` | **Live Intel**, full dashboard. Extended PriceTicker, interpretation grid, classified archive (WATCH/SKIP/CALL/TAKE), blog column, Nervous Decision Machine. |
| `/library` | `Library` | Library of resources, FAQ, etc. |
| `/immersion` | `Immersion` | **AI Immersion** ($12k, inquiry-only). 3-phase format: alignment / 4-hour session / 2-page summary in 5 days. |
| `/alumni` | `Alumni` | **The Alumni Pass** ($1,500/year, invitation-only). Hidden from nav and footer; reachable by direct URL only. SEO `noindex`. |
| `/new-age-leadership` | `NewAgeLeadership` | Long-form thought leadership: agent-native org chart, hybrid teams, agent-first functions, emergent agent-native roles. Lazy-loaded `OrgChart` + `AgathaStory`. |
| `/leaders`, `/leadership-insights` | `LeadershipInsights` | Decision Readiness Diagnostic, unlinked from nav, reachable by URL |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | |
| `/faq` | `Library` (redirect via Navigate) | Aliased to `/library?tab=questions`. |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all |

**Stripe price constants** are stored in `src/lib/stripe-prices.ts`. The Workshop and Cohort price IDs are referential only (Maven collects payment for those). The Alumni Pass is the only product the site itself charges via Stripe; the live checkout flow is invitation-gated and not shipped from the page.

### Client-side redirects (via `<Navigate replace />` / `<HashRedirect />` / `<ExternalRedirect />`)

| Old path | Redirects to | Mechanism |
|---|---|---|
| `/tool` | `/signal#decision` | Navigate (page deleted; machine now embedded on homepage + `/signal`) |
| `/builder-economy` | `https://www.thebuildereconomy.com` | `ExternalRedirect` (Builder Economy is a separate sister domain) |
| `/sprints` | `/cohort` | HashRedirect |
| `/sprint/4-week` | `/cohort?inquiry=1:1` | HashRedirect |
| `/sprint/90-day` | `/cohort?inquiry=1:1` | HashRedirect |
| `/builder-sprint` | `/cohort?inquiry=1:1` | HashRedirect |
| `/war-room` | `/enterprise#revenue-architecture` | HashRedirect |
| `/strategy-day` | `/enterprise#signal-session` | HashRedirect |
| `/fractional-caio` | `/enterprise` | HashRedirect |
| `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` | `/` | Navigate |

On `/cohort?inquiry=1:1`, a banner surfaces the inquiry-only private-engagement path without advertising it on the main page.

No `/pricing` page, pricing lives in context on `/cohort`, `/enterprise`, and `/immersion`.

---

## Homepage Scroll Order

Authoritative source: `src/pages/Index.tsx`. Verified 2026-06-09.

1. `Navigation`. fixed top, hides on scroll-down via `useScrollDirection`
2. `NewHero`. rotating headlines, eyebrow "Decision blockers I hear every week", primary "Book a call" (opens the Diagnosis Room in express mode) + secondary "Work through your decision with Mindy" (full mode) + tertiary "Or start with a free lesson →" / "See how I work →" (`/operator`) links
3. `BigProblem`. existential urgency frame (three large interactive flip cards)
4. `TrustSection`. Krish bio, headshot, testimonials carousel (COHORT-STYLE / ENTERPRISE tagged)
5. `FrameworkJourney`. three-panel animated MindSet → MindMap → MindMake
6. `OperatorsEdge`. v5 typography-only credential section ("Beyond pattern recognition")
7. `OperatorsBrief`. Live Intel homepage teaser (PriceTicker + rotating interpretation + compact Nervous Decision input + muted link to `/signal`)
8. `MindMakerLiveSection`. Substack newsletter subscribe surface
9. `SimpleCTA`. final CTA ("What's your nervous decision?"), opens the Diagnosis Room
10. `Footer`

The retired `YFork` second fork is no longer rendered (the homepage funnels into the one Diagnosis Room journey).

### Global overlays (mounted in `src/App.tsx`)

- `DiagnosisRoom`. **the primary conversion surface**, opened via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode? } }))` (`mode`: `express` | `full`). Lazy + only mounted when open so SSG prerender never instantiates it. Also a standalone page at `/start`.
- `ScopingModal`. secondary booking surface, still dispatched by the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and `/case-studies` via `openScopingModal` (6-field "Scope it with me" intake posting to `notify-scoping-request`)
- `InitialConsultModal`. legacy conversion surface, kept mounted but only `/alumni` still dispatches `openConsultModal`
- `CookieConsent`
- `ErrorBoundary`. wraps `<Suspense>` around routes
- The retired `PreCallQualifier` floating pill is no longer mounted.

---

## Navigation Structure

Authoritative source: `src/components/Navigation.tsx`. Primary CTA: **"Book a call"** with mint pulse dot.

| Slot | Label | Type | Destination |
|---|---|---|---|
| 1 | Workshops | Direct link | `/workshops` |
| 2 | Cohort | Direct link | `/cohort` |
| 3 | Enterprise | Dropdown | The Signal Session → `/enterprise#signal-session`, The Revenue Architecture → `/enterprise#revenue-architecture`, The AI Immersion → `/enterprise#immersion`, "For funds & operating partners" → Capital → `/capital` |
| 4 | **Mindmaker LIVE** | Direct link (wordmark) | `/signal` |
| 5 | Resources | Dropdown | How I operate → `/operator`, Case studies → `/case-studies`, New Age Leadership → `/new-age-leadership`, Library → `/library`, The Builder Economy (Podcast) → external `thebuildereconomy.com`, Lightning Lessons (5 external Maven URLs via the `LightningLessons` component) |
| 6 | About | Dropdown | Contact → `/contact`, Privacy → `/privacy`, Terms → `/terms` |
| CTA | Book a call | Button | Dispatches `openDiagnosisRoom` (express mode); the mobile menu also offers "Or think it through with Mindy first" (full mode) |

Decision Readiness Diagnostic (`/leaders`) is deliberately **not** in nav or footer. The Immersion (`/immersion`) is reachable via the Enterprise dropdown, the footer, or direct URL.

---

## Pricing (canonical)

| Offer | Price | Duration |
|---|---|---|
| The AI-Fluent Executive (Cohort) | $2,500 / seat (or 2× $1,250 split) | 4 weeks (mostly async) + 4 × 90-min live sessions |
| The Signal Session | $15,000 | 1 day intensive + 48-hour Commercial Narrative (15–20 pages) |
| The Revenue Architecture | $60,000–$100,000 | **30 days (4–5 calendar weeks)**, multi-session |
| The AI Immersion (inquiry) | $12,000 (flat; travel additional) | 4-hour session + 2-page summary within 5 business days |

Internal floor/ceiling (not on site): Cohort min viable enrollment = 8, cap = 15; Revenue Architecture floor $60k, ceiling $125k for extended scope.

Payment terms (small muted text below price on each page): Cohort = "Full payment or 2× split" (Maven collects); Signal Session = "Payment on kickoff"; Revenue Architecture = "50/50 at kickoff and delivery"; Immersion = "Full at booking or 50/50 at booking + delivery".

---

## Data Flows

### Booking / conversion flow (current), the Diagnosis Room

Stripe $50 hold bypassed. Cohort payment flows entirely through Maven; Enterprise / Immersion payment is invoiced direct. Every "Book a call" CTA opens the Diagnosis Room (Mindy); `ScopingModal` is a retained fallback.

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
   ├── book a free 15-min call → Calendly (CALENDLY_URL) → endSession('book-call')
   └── generate a co-branded proposal → invoke('generate-proposal', { ..., format:'html'|'pdf' })
       └─> "Mindmaker × [company]" one-pager; PDF via Browserless (print-fallback on failure)

5. On a meaningful end: supabase.functions.invoke('session-digest', { ...transcript, endedVia })
   └─> Krish digest via the unified lead pipeline (dossier already built client-side, no re-enrichment);
       if opted in + valid email + proposal exists, a separate visitor-facing email sends their proposal copy
```

The legacy path (now `/alumni` only) dispatches `openConsultModal` → `InitialConsultModal` → `send-lead-email` → Calendly redirect. The `ScopingModal` fallback dispatches `openScopingModal` → `notify-scoping-request`. Cohort enrolment can bypass the call entirely via the `/cohort` "Reserve my seat on Maven" CTA → `https://maven.com/mindmaker/the-ai-fluent-executive`.

### Lead capture flow (unified pipeline, every non-Diagnosis-Room surface)

Every other lead-capture surface (`send-lead-email`, `send-contact-email`, `notify-scoping-request`, `notify-ctrl-waitlist`, `submit-intake`, `submit-testimonial`, and `send-leadership-insights-email`'s Krish-side notification) used to be its own bespoke edge function reimplementing CORS, Resend, and an HTML/text builder, with no company research on most paths. As of 2026-07-06 they are thin adapters over one shared pipeline:

```
1. Edge function validates the request + persists its own DB row (leads / intake / testimonial / etc.)
2. It maps its payload to a canonical LeadEvent (adapters.ts: fromLead / fromContact / fromScoping /
   fromCtrlWaitlist / fromIntake / fromTestimonial / fromLeadershipInsights / fromSessionDigest)
3. dispatchLead(event) — backgrounded via EdgeRuntime.waitUntil (awaited fallback if unavailable),
   so the form response returns instantly. Inside, processLead():
   a. resolveDossier — reuses assembleDossier() in-process (no HTTP hop): prebuilt dossier (Diagnosis
      Room) → work-email domain → self-reported company name (Brandfetch name search) → null
   b. generateOperatorRead — 2-3 sentence Krish-voice note (who / what they want / next move),
      Gemini→Anthropic, best-effort, Krish-only (may reference dossier scale/ICP)
   c. renderLeadDigest — one consistent HTML shell for every source, with the proposal attached if present
   d. sendResendEmail → krish@themindmaker.ai; failures are logged and never surface to the caller
4. Optional onComplete callback (e.g. send-lead-email patches leads.company_research + email_sent)
```

This never throws back to the caller: a lead capture must not 5xx because enrichment or email hiccuped. `send-lead-email` no longer does its own Gemini-with-Google-Search-grounding research or OpenAI fallback; that bespoke path was retired in favour of the shared orchestrator.

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

Price and model data flows through `get-model-data` edge function. Editorial cards render from the CTRL shared pool via `get-ai-news`/`useLiveBrief` when available, with the inlined samples as a floor. The Cohort Signal widget (`PortfolioPulse.tsx`, between the interpretation grid and the archive) surfaces the anonymised cross-product portfolio pulse via the `portfolio-pulse` function.

---

## Edge Functions

Location: `supabase/functions/[function-name]/index.ts`. All functions set `verify_jwt = false` in `supabase/config.toml`. Shared Diagnosis Room logic lives in `_shared/{mindy,enrich,proposal}/`; the shared lead-capture back end lives in `_shared/{lead,http}/`.

### `mindy-chat` (Diagnosis Room)
- Mindy's conversational reasoning turn. Composes the Brain Pack (system prompt + reasoning guide + fit rubric + pricing card) + a formatted dossier block, calls Claude, parses a strict-JSON turn, runs the runtime voice gate
- Returns `reply`, `phase`, `quickReplies`, `recommendation`, `decisionBrief`, `readyForProposal`, `readyForCall`. The dossier's `scale.*` is fenced as INTERNAL ROUTING and never returned
- Secret: `ANTHROPIC_API_KEY`

### `enrich-company` (Diagnosis Room)
- Thin HTTP wrapper over `_shared/enrich/orchestrate.ts` (`assembleDossier`), the shared dossier orchestrator also used in-process by the unified lead pipeline. Fans out to enrichment clients, merges partials, derives an internal ICP routing signal, and (full depth) writes a one-paragraph synthesis in Krish's voice via `_shared/enrich/llm.ts`
- `depth:'identity'` → Brandfetch + Tranco (fast co-brand paint); `depth:'full'` → adds PDL + BuiltWith + currency, then Gemini/Anthropic synthesis. Free-email domains → `{ skipped:'free-email' }`
- This function keeps the HTTP concerns: CORS, per-IP rate limiting, global request ceiling, visitor-country geo resolution, in-memory result cache (1h TTL). A missing vendor key just disables that one tool (dossier degrades, never fails)
- Secrets (all optional): `BRANDFETCH_API_KEY`, `PEOPLEDATALABS_API_KEY`, `BUILTWITH_API_KEY`, `EXA_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`

### `generate-proposal` (Diagnosis Room)
- Builds the co-branded "Mindmaker × [company]" one-pager. Deterministic shell + dossier + selected proof, with reflective prose in one Claude call, voice-linted
- `format:'html'` (default) returns `{ html, payload, proposalId }`; `format:'pdf'` renders via Browserless → `{ pdfBase64, proposalId }`, or on failure `{ html, …, pdfFallback:true }` for client print
- Secrets: `ANTHROPIC_API_KEY`, `BROWSERLESS_API_KEY`

### `session-digest` (Diagnosis Room)
- Fires on a meaningful end (`chat` / `book-call` / `proposal`). The Krish digest now flows through the unified lead pipeline (`processLead` + the `fromSessionDigest` adapter) so it matches every other lead notification: same shell, same dossier + internal-routing block, same transcript styling, proposal attached. The dossier is already built client-side, so the pipeline does not re-enrich (`enrich.skip`)
- If the visitor opted in + supplied a valid email + a proposal exists, a separate, independent send emails them ONLY their proposal (never the routing block, never the transcript)
- Secret: `RESEND_API_KEY` (+ the pipeline's enrichment/LLM secrets, though enrichment is skipped here)

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
- As of 2026-06-29 ("Hive A'"), tries the CTRL shared pool first: reads CTRL's corroborated `live_headlines_cache` (the same pool CTRL's own Home reads, "one brain, one pool") and maps CTRL's nine AI-native categories onto WATCH/SKIP/CALL/TAKE. Falls back to Perplexity real-time curation, then OpenAI-curated Brave Search results, then static headlines
- `Brief.tsx` renders this live pool via the `useLiveBrief` hook when available, with the inlined sample cards as the floor
- Secrets: `PERPLEXITY_API_KEY` (primary fallback), `BRAVE_SEARCH_API`, `OPENAI_API_KEY`, `LOVABLE_API_KEY` (auto-provisioned)

### `get-market-sentiment`
- Market sentiment analysis (OpenAI)
- Secret: `OPENAI_API_KEY`

### `get-model-data`
- Frontier-model price and spec feed for `PriceTicker` and `/signal` interpretation grid
- Allowlist lives in `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`

### `send-lead-email`
- Lead submissions from the consult modal (legacy `/alumni` path). Persists a `leads` row + audience contact, then hands off to the unified lead pipeline (`dispatchLead` + `fromLead`), which researches the company in-process and emails Krish one consistent digest. The resolved dossier is written back into `leads.company_research`; `email_sent`/`email_sent_at` are patched once the send completes
- Personal email domains fall back to Brandfetch name search on the self-reported company, not to no research at all
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, + the shared enrichment/LLM keys (`GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`, and the `enrich-company` vendor keys)

### `send-contact-email`
- Contact form submissions. Same unified lead pipeline (`dispatchLead` + `fromContact`); response contract `{ success, leadId }` unchanged
- Secrets: `RESEND_API_KEY` + the shared enrichment/LLM keys

### `send-leadership-insights-email`
- Decision Readiness Diagnostic (`/leaders`) unlock. Sends TWO emails: the visitor's styled score-card (own template, unchanged) and a Krish notification now routed through the unified lead pipeline (`fromLeadershipInsights`), so it carries company research + an operator's read like every other lead digest
- Secrets: `RESEND_API_KEY` + the shared enrichment/LLM keys

### `notify-scoping-request`
- Powers the `ScopingModal` submissions (the secondary booking surface); persists the request, then notifies Krish via the unified lead pipeline (`fromScoping`)
- Secrets: `RESEND_API_KEY` + the shared enrichment/LLM keys

### `notify-ctrl-waitlist`
- CTRL waitlist signups (`CtrlWaitlistPopover`); persists the signup, then notifies Krish via the unified lead pipeline (`fromCtrlWaitlist`) so even a bare email gets researched into a real digest
- Secrets: `RESEND_API_KEY` + the shared enrichment/LLM keys

### `create-consultation-hold` (bypassed)
- Stripe authorization hold, currently bypassed; Cohort payment runs entirely through Maven
- Secret: `STRIPE_SECRET_KEY`

### `company-search`
- Thin, fast typeahead for the Diagnosis Room opener. Takes a partial company name, queries the Brandfetch Search API, and returns ranked matches with name, registrable domain, and CDN icon URL
- Empty or very short queries degrade gracefully to empty results (200). Per-IP rate limit: 80 requests / 5 min
- Secrets: `BRANDFETCH_API_KEY` or `BRANDFETCH_CLIENT_ID` (either works)

### `submit-intake`
- Receives pre-session intake form submissions. Inserts a row into the intake table, then emails Krish a researched digest via the unified lead pipeline (`fromIntake`) — previously a plain-text monospace brief
- Deployed with `verify_jwt = false` (public form). Mirrors the `submit-testimonial` structure
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` + the shared enrichment/LLM keys

### `submit-testimonial`
- Public testimonial submission endpoint. Inserts a row into `public.testimonials`, then emails Krish a researched digest via the unified lead pipeline (`fromTestimonial`) — previously a plain-text transcript. Includes a honeypot field for bot prevention
- Deployed with `verify_jwt = false`. Validates permission level (free / edits / private)
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` + the shared enrichment/LLM keys

---

## State Management

- **Routing / URL state:** React Router v6 (`BrowserRouter` in `App.tsx`)
- **Server state:** TanStack Query (5-minute stale time)
- **Form state:** React Hook Form + Zod schemas
- **Context state:** `SessionDataContext` threads qualifier answers into the conversion modals. The Diagnosis Room holds its own session in `useDiagnosisSession` (dossier, transcript, recommendation, decision brief, proposal). `ThemeProvider` (next-themes) handles dark mode via class attribute.
- **Local storage:** none required by the Diagnosis Room (session is in-memory; digests are server-side). The retired `PreCallQualifier` used `mindmaker:pre-call-qualifier`.
- **No user authentication:** All bookings via Calendly or Maven; no user accounts

---

## Database

- Supabase connected, minimal usage
- Tables: `leads` (`company_research` now stores an enrichment `Dossier`, previously a `CompanyResearch` shape; jsonb tolerates the change), `company_research_cache` (legacy table; the current orchestrator caches in-memory instead — not confirmed dead, flagged for cleanup), `audience_contacts` (Substack CSV import, upserted on email + source), `testimonials` (public submissions via `submit-testimonial`)
- RLS policies on all tables

---

## Performance

- Route-based code splitting via React Router + `React.lazy` (everything except Index)
- Vite automatic chunking
- Variable fonts (Inter Variable, Space Grotesk Variable), preloaded
- Lucide React icons (SVG, tree-shakeable)
- TanStack Query 5-min stale time
- Hero background video (`/rising-cities.mp4`) preloaded
- Operator demo video (`/ctrl-demo-video.mp4`) inline autoplay-loop-muted-playsInline
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
  - `operator_page_cta_clicked`. Revenue Architecture CTA from `/operator`
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
| `ANTHROPIC_API_KEY` | Mindy reasoning, proposal prose, Nervous Decision Machine, and the fallback leg of the shared Gemini→Anthropic text helper (dossier synthesis + every lead digest's operator's read) | Yes |
| `GOOGLE_AI_API_KEY` | Gemini (`gemini-2.5-flash`) dossier synthesis and lead-digest operator's read, via `_shared/enrich/llm.ts`. Shared by `enrich-company` and every lead-capture edge function | Recommended |
| `OPENAI_API_KEY` | Whisper transcription (`transcribe`), market sentiment, `get-ai-news` fallback. No longer used for lead enrichment | Yes |
| `RESEND_API_KEY` | Email delivery, all lead-capture functions + `session-digest`, via the shared `_shared/http/resend.ts` helper | Yes |
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
| `STRIPE_SECRET_KEY` | Payment holds (bypassed; Cohort payment via Maven) | Optional |
| `SUPABASE_*` | Auto-configured by Lovable Cloud | Auto |

\* Each missing `enrich-company` key just disables that one tool; the dossier degrades but does not fail.

---

**End of ARCHITECTURE**
