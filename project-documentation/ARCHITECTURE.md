# Architecture

**Last Updated:** 2026-07-12

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
- Anthropic Claude API (Mindy's reasoning in `mindy-chat`, proposal prose in `generate-proposal`, the Nervous Decision Machine (Haiku 4.5), and the Gemini→Anthropic completion fallback shared by every enrichment/lead-digest text call)
- Google Gemini (`gemini-2.5-flash`, primary model behind the shared `_shared/enrich/llm.ts` `completeText` helper: the `enrich-company` dossier synthesis line AND the unified lead pipeline's "operator's read". Falls back to Anthropic Haiku 4.5 on failure)
- OpenAI API (Whisper voice transcription for the Diagnosis Room; market sentiment)
- Company-enrichment vendors for the `enrich-company` dossier (also reused in-process by the unified lead pipeline via `_shared/enrich/orchestrate.ts`): Brandfetch (identity/logo/colours, also company-name search), People Data Labs (size), Tranco (rank), BuiltWith (stack), Perplexity / Exa / NewsAPI (currency + proof matching)
- Browserless (proposal HTML → PDF in `generate-proposal`)
- Lovable AI Gateway (Operator's Brief / Live Intel content)
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
│   │   ├── _shared/                   # incl. mindy/, enrich/, proposal/ (Diagnosis Room logic), lead/, http/ (unified lead pipeline); also audience.ts, retry.ts, timeout.ts, validation.ts, logger.ts. vertex-client.ts and company-research.ts are unused leftovers from the pre-pipeline lead-enrichment path (superseded by enrich/orchestrate.ts); no function imports them
│   │   ├── mindy-chat/                # Claude, Mindy's reasoning turn
│   │   ├── enrich-company/            # company dossier orchestrator
│   │   ├── generate-proposal/         # co-branded one-pager + Browserless PDF
│   │   ├── session-digest/            # Resend, intelligence email to Krish + opt-in visitor copy
│   │   ├── transcribe/                # OpenAI Whisper (voice input)
│   │   ├── nervous-decision-machine/  # Anthropic Haiku 4.5
│   │   ├── get-ai-news/               # Live Intel content (Lovable AI Gateway)
│   │   ├── get-market-sentiment/
│   │   ├── get-model-data/            # frontier-model price and spec feed
│   │   ├── send-lead-email/           # unified lead pipeline: dossier enrichment + Resend digest
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
   └─> emails Krish the FULL intelligence; if opted in + proposal exists, emails the visitor their copy
```

The legacy path (now `/alumni` only) dispatches `openConsultModal` → `InitialConsultModal` → `send-lead-email` (unified lead pipeline enrichment, full-depth dossier for work-email domains, skipped/degraded for personal email domains) → Calendly redirect. The `ScopingModal` fallback dispatches `openScopingModal` → `notify-scoping-request` (unified pipeline, emails Krish). Cohort enrolment can bypass the call entirely via the `/cohort` "Reserve my seat on Maven" CTA → `https://maven.com/mindmaker/the-ai-fluent-executive`.

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
- **The Cohort Signal** (`src/components/PortfolioPulse.tsx`), between the interpretation grid and the archive. Calls a `portfolio-pulse` edge function (not defined in this repo's `supabase/functions/`; it lives on the shared Supabase project alongside CTRL/Make Your Mind Up, per `mm-ctrl/docs/PORTFOLIO-HIVE-MIND.md`) which categorises, server-side, "the decision you keep not making" answers from Make Your Mind Up's intake into nine AI-native lanes and returns only anonymised counts/shares (no PII, no raw text). The component self-hides below 12 total respondents (`MIN_VISIBLE`) and renders nothing on fetch failure, so a thin room never reads as weakness and the page is prerender-safe
- Classified card archive (WATCH / SKIP / CALL / TAKE) with filter pills + search
- Blog column (featured posts)
- Full-size Nervous Decision input with example chips

Price and model data flows through `get-model-data` edge function. `get-ai-news` first reads CTRL's shared, pre-corroborated headline pool (`live_headlines_cache`, gathered once/day by CTRL's `live-headlines` function on the same Supabase project) and maps CTRL's nine AI-native categories onto the WATCH/SKIP/CALL/TAKE taxonomy; on an empty/unreachable shared pool it falls through to its original Perplexity → Brave Search → static-headline ladder. Editorial archive cards on `/signal` are currently inline in `Brief.tsx`; the `get-ai-news` schema is preserved for the eventual dynamic feed.

---

## Edge Functions

Location: `supabase/functions/[function-name]/index.ts`. All functions set `verify_jwt = false` in `supabase/config.toml`. Shared Diagnosis Room logic lives in `_shared/{mindy,enrich,proposal}/`.

### The unified lead pipeline (`_shared/lead/`, `_shared/http/`)

Every lead-capture edge function (`send-contact-email`, `send-lead-email`, `send-leadership-insights-email`, `notify-scoping-request`, `notify-ctrl-waitlist`, `submit-intake`, `submit-testimonial`, and the Diagnosis Room's `session-digest`) is a **thin adapter**: it validates its own payload, persists its own row(s), then maps the payload to a canonical `LeadEvent` and hands off to the shared pipeline core. Endpoint URLs, DB writes, and response shapes are unchanged from before the refactor; only the email-generation internals moved.

- **`_shared/lead/types.ts`**. the `LeadEvent` shape (`source`, `sourceLabel`, `contact`, `groups` of labelled fields, optional `transcript`, `proposal`, `prebuiltDossier`, `enrich` override) plus `makeLeadEvent()`.
- **`_shared/lead/adapters.ts`**. one pure mapper per source (`fromContact`, `fromLead`, `fromLeadershipInsights`, `fromScoping`, `fromCtrlWaitlist`, `fromIntake`, `fromTestimonial`, `fromSessionDigest`) turning each function's raw payload into a `LeadEvent`. No I/O.
- **`_shared/lead/pipeline.ts`**. `processLead(event)` resolves the dossier (prebuilt → work-email enrichment via `_shared/enrich/orchestrate.ts` → self-reported company name as a fallback for personal-email leads), generates the operator's read, renders the digest, and sends it via Resend. `dispatchLead(event, opts, onComplete?)` wraps that in `EdgeRuntime.waitUntil` when available so the caller's response returns instantly; falls back to an awaited call otherwise so the work is never dropped. Both are best-effort and never throw.
- **`_shared/lead/operator-read.ts`**. `generateOperatorRead()`, the 2-3 sentence Krish-voiced note at the top of every digest (who this is, what they want, the sharpest next move), grounded in the dossier + submitted fields via the shared `completeText` (Gemini→Anthropic) helper. Krish-only; may reference the dossier's internal `scale`/ICP fields.
- **`_shared/lead/render.ts`**. `renderLeadDigest()`, the single HTML email renderer used by every source: hero (company name/logo) → operator's read → contact → company dossier (+ amber "internal routing" callout) → submitted fields → transcript (if any) → proposal note (if any) → reply CTA. Per-source emoji in the subject line for inbox scanability. The hero uses a solid `background-color` + `bgcolor` attribute (not just a CSS gradient) so the white heading and emerald eyebrow stay legible in email clients (Outlook, Gmail dark mode) that strip `background-image`.
- **`_shared/lead/escape.ts`**. HTML-escaping + `looksLikeEmail()` guard shared by render/pipeline.
- **`_shared/http/resend.ts`**. the one shared Resend sender: `re_`-key guard, 3-attempt exponential backoff (1s/2s/4s), a stack-safe chunked base64 encoder for attachments.
- **`_shared/http/cors.ts`**. shared CORS headers + `handlePreflight()` / `json()` helpers.
- **`_shared/enrich/orchestrate.ts`**. `assembleDossier()`, the fan-out/merge/routing/synthesis logic extracted out of `enrich-company` so both the HTTP function AND the lead pipeline call it in-process (no cross-function HTTP hop). Has its own 1-hour result cache. `enrich-company/index.ts` is now a thin HTTP wrapper over this module (CORS, per-IP rate limit, the request ceiling, and visitor-country geo resolution only).
- **`_shared/enrich/llm.ts`**. `completeText()`, the shared Gemini (`gemini-2.5-flash`) → Anthropic (`claude-haiku-4-5-20251001`) completion fallback with a voice scrub (strips em/en dashes). Used by both the dossier synthesis line and the lead pipeline's operator's read.

Every lead digest goes to `krish@themindmaker.ai` from `Mindmaker Leads <leads@themindmaker.ai>`, with `reply_to` set to the lead's email when present, and a proposal HTML attachment when one exists on the event.

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
- Fires on a meaningful end (`chat` / `book-call` / `proposal`). The Krish digest now runs through the unified lead pipeline (`processLead` + `fromSessionDigest`) so it uses the same shell, dossier rendering, and transcript styling as every other lead notification. The dossier is already built client-side, so the pipeline call sets `enrich.skip` and does not re-enrich. If the visitor opted in + supplied a valid email + a proposal exists, a separate, independent send emails them ONLY their proposal (short warm note, no routing layer, no transcript) via `_shared/http/resend.ts` directly
- Rate limit: 20 req / IP / 10 min (in-memory) + a global request ceiling
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
- Persists a `leads` row + audience contact immediately (so the lead is captured even if enrichment/email fails), then hands off to the unified lead pipeline (`dispatchLead` + `fromLead`) with `depth: 'full'` enrichment. Used by the legacy `/alumni` consult path (`InitialConsultModal`)
- The resolved dossier is written back into `leads.company_research` once the background task completes (this column now stores a `Dossier`, not the old `CompanyResearch` shape; both are jsonb so the schema tolerates it)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, plus the `enrich-company` secrets (all optional, degrade gracefully)

### `send-contact-email`
- Contact form submissions. Thin adapter (`fromContact`) over the unified lead pipeline
- Secret: `RESEND_API_KEY`

### `send-leadership-insights-email`
- Dual email delivery: diagnostic results to user + a lead notification to Krish via the unified pipeline (`fromLeadershipInsights`, `depth: 'full'`)
- Secret: `RESEND_API_KEY`

### `notify-scoping-request`
- Powers the `ScopingModal` submissions (the secondary booking surface). Persists the request to `scoping_requests`, records the audience contact, then hands off to the unified lead pipeline (`fromScoping`, `depth: 'full'`) for the Krish digest
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `notify-ctrl-waitlist`
- CTRL waitlist signups (`CtrlWaitlistPopover`). Persists to `ctrl_waitlist`, then hands off to the unified lead pipeline (`fromCtrlWaitlist`, `depth: 'full'`)
- Secrets: `RESEND_API_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### `create-consultation-hold` (bypassed)
- Stripe authorization hold, currently bypassed; Cohort payment runs entirely through Maven
- Secret: `STRIPE_SECRET_KEY`

### `company-search`
- Thin, fast typeahead for the Diagnosis Room opener. Takes a partial company name, queries the Brandfetch Search API, and returns ranked matches with name, registrable domain, and CDN icon URL
- Empty or very short queries degrade gracefully to empty results (200). Per-IP rate limit: 80 requests / 5 min
- Secrets: `BRANDFETCH_API_KEY` or `BRANDFETCH_CLIENT_ID` (either works)

### `submit-intake`
- Receives pre-session intake form submissions (static `/intake` form). Inserts a row into `public.intake_submissions`, then hands off to the unified lead pipeline (`fromIntake`, `depth: 'full'`) which emails Krish a formatted brief (Snapshot / What they do / North star / Role-aware handoff / remaining chip answers)
- Deployed with `verify_jwt = false` (public form). Mirrors the `submit-testimonial` structure
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

### `submit-testimonial`
- Public testimonial submission endpoint (static `/testimonials` form). Inserts a row into `public.testimonials`, then hands off to the unified lead pipeline (`fromTestimonial`, `depth: 'identity'` — a reflection doesn't need full enrichment). Includes a honeypot field for bot prevention
- Deployed with `verify_jwt = false`. Validates permission level (free / edits / private)
- Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

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
- Tables defined in this repo's migrations: `leads` (incl. `company_research` jsonb, now a `Dossier`), `company_research_cache` (legacy cache table for the old research path; not written by any current function), `scoping_requests` (`ScopingModal` submissions), `ctrl_waitlist` (`CtrlWaitlistPopover` signups), `testimonials` (public submissions via `submit-testimonial`), `intake_submissions` (pre-session intake via `submit-intake`), `blog_posts`
- `audience_contacts` (Substack CSV import via `import-audience-csv`, upserted on email + source; also written by `recordSiteAudienceContact` from every lead-capture adapter) is a shared table on the same Supabase project; its `CREATE TABLE` is not in this repo's `supabase/migrations/` (UNVERIFIED which repo owns it — likely CTRL/mm-ctrl, given the "shared pool" pattern used elsewhere)
- RLS policies on all tables; `scoping_requests`/`ctrl_waitlist` allow anonymous insert, `testimonials`/`intake_submissions` deny all client access (service-role only, used by their edge functions)

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
| `ANTHROPIC_API_KEY` | Mindy reasoning, proposal prose, Nervous Decision Machine, and the fallback leg of the shared Gemini→Anthropic `completeText` helper (dossier synthesis + lead-digest operator's read) | Yes |
| `GOOGLE_AI_API_KEY` | Gemini (`gemini-2.5-flash`), the primary leg of `completeText`: dossier synthesis (`enrich-company`) AND every lead digest's operator's read (unified pipeline) | Recommended |
| `OPENAI_API_KEY` | Whisper transcription, market sentiment | Yes |
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
| `STRIPE_SECRET_KEY` | Payment holds (bypassed; Cohort payment via Maven) | Optional |
| `SUPABASE_*` | Auto-configured by Lovable Cloud | Auto |

\* Each missing `enrich-company` key just disables that one tool; the dossier degrades but does not fail.

---

**End of ARCHITECTURE**
