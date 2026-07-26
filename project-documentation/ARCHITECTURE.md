# Architecture

**Last Updated:** 2026-07-26

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
- Google Gemini (company synthesis inside the shared `_shared/enrich/orchestrate.ts` dossier orchestrator, used by `enrich-company` and, in-process, by every lead-capture function via the unified lead pipeline; `_shared/enrich/llm.ts` provides a Gemini→Anthropic text-completion fallback, also reused by `personalize-intake`)
- OpenAI API (Whisper voice transcription for the Diagnosis Room; market sentiment; Brave-Search-curation fallback inside `get-ai-news`)
- Company-enrichment vendors for the shared dossier orchestrator: Brandfetch (identity/logo/colours), People Data Labs (size), Tranco (rank), BuiltWith (stack), Perplexity / Exa / NewsAPI (currency + proof matching)
- Browserless (proposal HTML → PDF in `generate-proposal`)
- CTRL's shared `live_headlines_cache` (read directly from the shared Supabase project by `get-ai-news`, Plan A0, before falling through to Perplexity → Brave/OpenAI → static); a sibling `portfolio-pulse` edge function (deployed from the `mm-ctrl` repo, not this one) backs the public Cohort Signal widget
- Resend (transactional email delivery, via the shared `_shared/http/resend.ts` helper)
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
│   │   ├── PortfolioPulse.tsx        # "The Cohort Signal" - anonymised cross-product hive-mind widget on /signal
│   │   ├── NewHero.tsx               # rotating headlines; CTAs open the Diagnosis Room
│   │   ├── BigProblem.tsx            # three interactive flip cards
│   │   ├── TrustSection.tsx          # Krish bio + testimonials carousel
│   │   ├── FrameworkJourney.tsx      # Mind Set → Mind Map → Mind Make
│   │   ├── OperatorsEdge.tsx         # v5 credential section
│   │   ├── OperatorsBrief.tsx        # homepage Live Intel teaser
│   │   ├── PriceTicker.tsx           # CSS-marquee model price ticker
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
│   │   ├── useLiveBrief.ts           # feeds Brief.tsx from get-ai-news; falls back to inline sample archive
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
│   │   │   ├── mindy/                 # knowledge.ts, proof-index.ts, voice-lint.ts
│   │   │   ├── enrich/                # brandfetch.ts, builtwith.ts, currency.ts, pdl.ts, tranco.ts, synthesize.ts, types.ts
│   │   │   │                          #   orchestrate.ts - the dossier fan-out/merge core (extracted out of enrich-company)
│   │   │   │                          #   llm.ts - shared Gemini→Anthropic text-completion fallback (enrich synthesis + personalize-intake)
│   │   │   ├── proposal/              # deliverables.ts, template.ts, types.ts
│   │   │   ├── lead/                  # types.ts, escape.ts, render.ts, operator-read.ts, pipeline.ts (dispatchLead), adapters.ts
│   │   │   ├── http/                  # cors.ts, resend.ts
│   │   │   └── audience.ts, retry.ts, timeout.ts, validation.ts, logger.ts
│   │   │       # company-research.ts and vertex-client.ts are orphaned: no function imports either since the
│   │   │       # lead-pipeline unification (2026-07-06) moved that research path onto _shared/enrich/orchestrate.ts.
│   │   ├── mindy-chat/                # Claude, Mindy's reasoning turn
│   │   ├── enrich-company/            # thin wrapper over _shared/enrich/orchestrate.ts
│   │   ├── generate-proposal/         # co-branded one-pager + Browserless PDF
│   │   ├── session-digest/            # thin lead-pipeline adapter (fromSessionDigest); Krish digest + opt-in visitor copy
│   │   ├── transcribe/                # OpenAI Whisper (voice input)
│   │   ├── nervous-decision-machine/  # Anthropic Haiku 4.5
│   │   ├── get-ai-news/               # Live Intel content: CTRL shared pool → Perplexity → Brave+OpenAI → static
│   │   ├── get-market-sentiment/
│   │   ├── get-model-data/            # frontier-model price and spec feed
│   │   ├── send-lead-email/           # thin lead-pipeline adapter (fromLead); stores Dossier in leads.company_research
│   │   ├── send-contact-email/        # thin lead-pipeline adapter (fromContact)
│   │   ├── send-leadership-insights-email/ # Krish notification via fromLeadershipInsights; visitor score-card email unchanged
│   │   ├── notify-scoping-request/    # thin lead-pipeline adapter (fromScoping)
│   │   ├── notify-ctrl-waitlist/      # thin lead-pipeline adapter (fromCtrlWaitlist)
│   │   ├── import-audience-csv/       # Substack subscriber CSV → audience_contacts
│   │   ├── create-consultation-hold/  # Stripe, currently bypassed
│   │   ├── company-search/            # Brandfetch Search API typeahead for the Diagnosis Room opener
│   │   ├── submit-intake/             # thin lead-pipeline adapter (fromIntake)
│   │   ├── submit-testimonial/        # thin lead-pipeline adapter (fromTestimonial)
│   │   └── personalize-intake/        # generates 2 voice-linted microcopy fragments for public/intake from the dossier
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
│   ├── intake/index.html              # adaptive pre-session intake form: prefills from enrich-company, personalizes via
│   │                                  #   personalize-intake, voice input (Web Speech API); posts to submit-intake
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
   └─> emails Krish the FULL intelligence; if opted in + proposal exists, emails the visitor their copy
```

The legacy path (now `/alumni` only) dispatches `openConsultModal` → `InitialConsultModal` → `send-lead-email` (Gemini company research with Google Search grounding, skipped for personal email domains) → Calendly redirect. The `ScopingModal` fallback dispatches `openScopingModal` → `notify-scoping-request` (emails Krish). Cohort enrolment can bypass the call entirely via the `/cohort` "Reserve my seat on Maven" CTA → `https://maven.com/mindmaker/the-ai-fluent-executive`.

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
- **The Cohort Signal** (`PortfolioPulse.tsx`), between the interpretation grid and the archive: the anonymised cross-product "portfolio pulse" aggregate (what leaders across Mindmaker/CTRL/Make Your Mind Up are wrestling with, nine AI-native lanes as share bars). Counts/shares only, categorised server-side; self-hides below 12 leaders; null during SSG. Backing `portfolio-pulse` function is deployed from the sibling `mm-ctrl` repo, not this one. Canonical record: `mm-ctrl/docs/PORTFOLIO-HIVE-MIND.md`
- Classified card archive (WATCH / SKIP / CALL / TAKE) with filter pills + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

Price and model data flows through `get-model-data` edge function. The classified archive is fed live by `src/hooks/useLiveBrief.ts`, which calls `get-ai-news`; it falls back to the inline sample archive only if that call fails or returns nothing. `get-ai-news` itself tries, in order: CTRL's shared `live_headlines_cache` (same Supabase project, "one brain, one pool") → Perplexity → Brave Search + OpenAI curation → a static fallback. Note the edge function's own internal category labels are still the retired SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE vocabulary; `useLiveBrief.ts` remaps them client-side to the current WATCH/SKIP/CALL/TAKE taxonomy.

---

## Edge Functions

Location: `supabase/functions/[function-name]/index.ts`. All functions set `verify_jwt = false` in `supabase/config.toml`. Shared Diagnosis Room logic lives in `_shared/{mindy,enrich,proposal}/`; shared lead-capture logic lives in `_shared/{lead,http}/`.

**The unified lead pipeline (added 2026-07-06).** Eight functions below (`send-lead-email`, `send-contact-email`, `send-leadership-insights-email`, `notify-scoping-request`, `notify-ctrl-waitlist`, `submit-intake`, `submit-testimonial`, `session-digest`) are thin adapters: each maps its own payload to a canonical `LeadEvent` (`_shared/lead/adapters.ts`) and calls `dispatchLead`/`processLead` (`_shared/lead/pipeline.ts`), which auto-enriches the company in-process (reusing the `_shared/enrich/orchestrate.ts` dossier orchestrator), generates an AI "operator's read," and sends Krish one consistently-formatted digest via `_shared/http/resend.ts`. Endpoint URLs, DB writes, and response shapes are unchanged from before the unification; the email send is backgrounded (`EdgeRuntime.waitUntil`, with an awaited fallback). None of these functions do their own company research anymore — the old Gemini-with-Google-Search-grounding pattern some of them used is gone.

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
- Fires on a meaningful end (`chat` / `book-call` / `proposal`). Krish's side is now a thin lead-pipeline adapter (`fromSessionDigest` → `processLead`, which does NOT re-enrich since the full dossier already exists) sending the FULL session (contact, recommendation, decision brief, full dossier incl. `scale`, transcript, proposal HTML attachment) on the same shared template as every other lead notification. If the visitor opted in + supplied a valid email + a proposal exists, a separate, unchanged visitor-facing template emails them ONLY their proposal
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

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
- Powers Live Intel's classified archive (rendered taxonomy: WATCH / SKIP / CALL / TAKE), invoked live by `src/hooks/useLiveBrief.ts` on `/signal`
- Plan A0: reads CTRL's shared `live_headlines_cache` table on the same Supabase project first. Falls through to Plan A (Perplexity), then Plan B (Brave Search + OpenAI curation), then Plan C (static fallback) if a prior plan fails or is empty
- The function's own internal category vocabulary is still SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE (not yet renamed); the client remaps to WATCH/SKIP/CALL/TAKE
- Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (shared-pool read), `PERPLEXITY_API_KEY`, `BRAVE_SEARCH_API`, `OPENAI_API_KEY`, `ARTIFICIALANALYSIS_API_KEY`

### `get-market-sentiment`
- Market sentiment analysis (OpenAI)
- Secret: `OPENAI_API_KEY`

### `get-model-data`
- Frontier-model price and spec feed for `PriceTicker` and `/signal` interpretation grid
- Allowlist lives in `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`

### `send-lead-email`
- Thin lead-pipeline adapter (`fromLead`). Used by the legacy `/alumni` consult path. Personal email domains still skip company research (now handled inside the shared orchestrator, not locally). Stores the enrichment `Dossier` in `leads.company_research`
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, plus the enrichment keys below

### `send-contact-email`
- Thin lead-pipeline adapter (`fromContact`) for contact form submissions
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `send-leadership-insights-email`
- Krish's lead notification now goes through the shared pipeline (`fromLeadershipInsights`); the visitor-facing score-card email keeps its own dedicated template
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `notify-scoping-request`
- Powers the `ScopingModal` submissions (the secondary booking surface); thin lead-pipeline adapter (`fromScoping`)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `notify-ctrl-waitlist`
- CTRL waitlist signups (`CtrlWaitlistPopover`); thin lead-pipeline adapter (`fromCtrlWaitlist`)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `create-consultation-hold` (bypassed)
- Stripe authorization hold, currently bypassed; Cohort payment runs entirely through Maven
- Secret: `STRIPE_SECRET_KEY`

### `company-search`
- Thin, fast typeahead for the Diagnosis Room opener. Takes a partial company name, queries the Brandfetch Search API, and returns ranked matches with name, registrable domain, and CDN icon URL
- Empty or very short queries degrade gracefully to empty results (200). Per-IP rate limit: 80 requests / 5 min
- Secrets: `BRANDFETCH_API_KEY` or `BRANDFETCH_CLIENT_ID` (either works)

### `submit-intake`
- Receives pre-session intake form submissions from `public/intake/index.html`. Inserts a row into the intake table; Krish's notification is now a thin lead-pipeline adapter (`fromIntake`) instead of its own plain-text brief
- Deployed with `verify_jwt = false` (public form)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `submit-testimonial`
- Public testimonial submission endpoint. Inserts a row into `public.testimonials`; Krish's notification is now a thin lead-pipeline adapter (`fromTestimonial`) instead of its own plain-text transcript. Includes a honeypot field for bot prevention
- Deployed with `verify_jwt = false`. Validates permission level (free / edits / private)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `personalize-intake`
- Turns a safe company dossier (never `dossier.scale.*`) plus the visitor's seat into two tiny, bespoke, voice-linted microcopy fragments (`business_reflect`, `aspiration_nudge`) for `public/intake/index.html`. Progressive enhancement only: on any failure, empty input, or off-voice output it returns `{ fragments: {} }` and the static page's own deterministic copy is used
- Runs the same `lintVoice()` gate as Mindy's Diagnosis Room output, on a third surface outside the room entirely
- Deployed with `verify_jwt = false` (called from the static page with the anon key)
- Secrets: `GOOGLE_AI_API_KEY` / `ANTHROPIC_API_KEY` (via `_shared/enrich/llm.ts`'s fallback)

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
- Tables: `leads`, `company_research_cache`, `audience_contacts` (Substack CSV import, upserted on email + source), `testimonials` (public submissions via `submit-testimonial`), `intake_submissions` (public submissions via `submit-intake`)
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
| `ANTHROPIC_API_KEY` | Mindy reasoning, proposal prose, Nervous Decision Machine, `enrich`/`personalize-intake` LLM fallback | Yes |
| `GOOGLE_AI_API_KEY` | Gemini company synthesis (shared enrichment orchestrator, used by `enrich-company` and every lead-pipeline function) | Recommended |
| `OPENAI_API_KEY` | Whisper transcription, market sentiment, `get-ai-news` Brave-curation fallback | Yes |
| `RESEND_API_KEY` | Email delivery, via the shared `_shared/http/resend.ts` helper (`session-digest` + all lead-pipeline functions) | Yes |
| `SUPABASE_URL` | Required by every lead-pipeline function (in-process enrichment) and `get-ai-news`'s CTRL shared-pool read | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Same as above | Yes |
| `BROWSERLESS_API_KEY` | Proposal HTML → PDF (`generate-proposal`) | Recommended |
| `BRANDFETCH_API_KEY` | Company identity / logo / colours (enrichment orchestrator); typeahead search (`company-search`) | Optional* |
| `BRANDFETCH_CLIENT_ID` | Alternative credential for Brandfetch (`company-search` accepts either) | Optional* |
| `PEOPLEDATALABS_API_KEY` | Company size / routing signal | Optional* |
| `BUILTWITH_API_KEY` | Tech-stack signal | Optional* |
| `EXA_API_KEY` | Proof matching + currency | Optional* |
| `PERPLEXITY_API_KEY` | Company currency / recent signals; `get-ai-news` Plan A | Optional* |
| `NEWSAPI_API_KEY` | Recent news for the dossier | Optional* |
| `BRAVE_SEARCH_API` | `get-ai-news` Plan B curation source | Optional |
| `ARTIFICIALANALYSIS_API_KEY` | `get-ai-news` model-performance context | Optional |
| `AUDIENCE_IMPORT_SECRET` | Gate for `import-audience-csv` | Optional |
| `STRIPE_SECRET_KEY` | Payment holds (bypassed; Cohort payment via Maven) | Optional |

\* Each missing enrichment key just disables that one tool; the dossier degrades but does not fail.

**Note:** `GEMINI_API_KEY` and `LOVABLE_API_KEY`, both previously listed here, are referenced nowhere in the current codebase (`grep -rn "GEMINI_API_KEY\|LOVABLE_API_KEY" supabase/` returns no hits) — remove either from your `.env` if migrating from an older deploy.

---

**End of ARCHITECTURE**
