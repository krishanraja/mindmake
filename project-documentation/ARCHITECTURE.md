# Architecture

> Companion docs: `README.md` and `CLAUDE.md` hold the short public-contract summary; this file is the fuller technical map. `project-documentation/REBUILD_STATE.md` holds the rebuild's working state and authority log.

**Last Updated:** 2026-08-16

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

**Third-party services actually reachable from the live site:**
- Resend (`send-contact-email` on `/contact`; `submit-intake` and `submit-testimonial` on the two static forms below)
- Anthropic Claude (`personalize-intake`, optional microcopy for the static `/intake` form)
- Brandfetch (`enrich-company`, called by `/intake` for company identity lookup)
- Calendly (`BOOKING_URL` in `src/lib/publicLinks.ts` — the destination of every "Book a fit call" action, site-wide)
- Plausible (`window.plausible`, loaded externally; see SEO section for the events actually fired from live pages)

**Third-party services wired only into dormant code** (present in the repo, deployed as edge functions in some cases, but not reachable from any live route — see "Dormant code" below and the Edge Functions section):
- Google Gemini / OpenAI (`enrich-company` full-depth synthesis, `send-lead-email`, `get-market-sentiment`, `transcribe`)
- People Data Labs, Tranco, BuiltWith, Perplexity, Exa, NewsAPI (`enrich-company` dossier enrichment)
- Browserless (`generate-proposal` PDF rendering)
- Lovable AI Gateway (`get-ai-news`)
- Stripe (`create-consultation-hold`; also `src/lib/stripe-prices.ts`, referenced only in a code comment on `/alumni`, not imported there)

**Hosting & deployment:**
- Vercel (frontend build and hosting; `vercel.json` holds redirects, headers and rewrites)
- Supabase Cloud (edge functions, Postgres)
- GitHub (source of truth; the repo also mentions a Lovable Cloud / GitHub sync in its history — not re-verified here)

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── Animations/
│   │   │   └── ParticleBackground.tsx  # global particle field, mounted on Index
│   │   ├── new-age/                  # /new-age-leadership components (live)
│   │   │   ├── OrgChart.tsx          # interactive agent-native org chart (lazy)
│   │   │   └── AgathaStory.tsx       # embedded narrative + `page_completed` beacon
│   │   ├── Navigation.tsx            # 4-choice nav, no dropdowns
│   │   ├── Footer.tsx
│   │   ├── BookFitCall.tsx           # shared sales action -> BOOKING_URL, `fit_call_clicked`
│   │   ├── SEO.tsx
│   │   ├── CtrlDemoVideo.tsx         # looping CTRL demo, used on Index + Operator
│   │   ├── FrameworkJourney.tsx      # Mind Set -> Mind Map -> Mind Make, used on /new-age-leadership
│   │   ├── BlogPostCard.tsx, FAQAccordion.tsx, MindMakerWordmark.tsx  # small shared pieces
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── diagnosis/                # Diagnosis Room (Mindy). Not imported by any live route.
│   │   ├── nervous-decision/         # Nervous Decision Machine. Not imported by any live route.
│   │   ├── NewHero.tsx, BigProblem.tsx, TwoDoors.tsx, SimpleCTA.tsx, OperatorsEdge.tsx,
│   │   │   OperatorsBrief.tsx, PriceTicker.tsx, LiveDecisionPreview.tsx, ProductExpandCard.tsx,
│   │   │   ProductExpandSection.tsx, MindMakerLiveSection.tsx, ScopingModal.tsx,
│   │   │   InitialConsultModal.tsx, CtrlWaitlistPopover.tsx, CurrencySwitcher.tsx,
│   │   │   JourneyInfoCarousel.tsx, PortfolioPulse.tsx, WhitepaperPromo.tsx,
│   │   │   SubstackSubscribeForm.tsx, MediaEasterEggs/
│   │   │   # Old two-offer-ladder and Diagnosis Room UI. Not imported by App.tsx, Index.tsx,
│   │   │   # or any live page. Dormant, not current truth (see note below).
│   ├── pages/
│   │   ├── Index.tsx                 # / — homepage, eager-loaded
│   │   ├── Sprint.tsx                # /sprint — the one paid offer
│   │   ├── CaseStudies.tsx           # /case-studies — approved proof archive
│   │   ├── Operator.tsx              # /operator — 14-agent OS credential page
│   │   ├── Blog.tsx, BlogPost.tsx    # /blog, /blog/:slug
│   │   ├── Library.tsx               # /library (includes the FAQ tab)
│   │   ├── NewAgeLeadership.tsx      # /new-age-leadership
│   │   ├── Alumni.tsx                # /alumni — invitation-only, noindex
│   │   ├── Contact.tsx               # /contact — general messages, not a sales action
│   │   ├── Privacy.tsx, Terms.tsx
│   │   ├── NotFound.tsx              # catch-all
│   │   ├── Teardown.tsx, Handover.tsx, Capital.tsx, Brief.tsx
│   │   │   # Old offer pages + the old /signal dashboard page. Not routed in App.tsx.
│   │   │   # /teardown, /handover, /capital now redirect to /sprint; /signal now redirects
│   │   │   # externally to Mindmaker Live. These files are dormant, not current truth.
│   ├── hooks/
│   │   ├── useTestimonials.ts        # reads the `publishable_testimonials` view (consent-gated)
│   │   ├── useBlogPosts.ts, useScrollDirection.ts, use-mobile.tsx, use-toast.ts, ...
│   │   ├── useLiveBrief.ts, useOpenAIContext.ts, useModelData.ts, useRealisticCounters.ts
│   │   │   # Power the dormant Live Intel dashboard / Nervous Decision Machine. Not imported
│   │   │   # from any live page.
│   ├── contexts/
│   │   ├── SessionDataContext.tsx    # threads qualifier answers into InitialConsultModal — dormant
│   │   └── CurrencyContext.tsx       # dormant, used only by Teardown/Handover/Capital + CurrencySwitcher
│   ├── data/
│   │   ├── rebuildProof.ts           # attendee brands, client stories — used by Index + CaseStudies
│   │   └── blogPosts.ts
│   ├── lib/
│   │   ├── publicLinks.ts            # BOOKING_URL, MINDMAKER_LIVE_URL, SPRINT_PATH — canonical destinations
│   │   ├── utils.ts, haptics.ts, sound.ts
│   │   ├── offers.ts, stripe-prices.ts  # dormant. Old per-offer USD/GBP/AUD prices and Stripe ids.
│   ├── integrations/supabase/
│   ├── utils/
│   │   └── calendly.ts
│   ├── index.css                     # design tokens
│   ├── App.tsx                       # routing + global overlays (ErrorBoundary, CookieConsent only)
│   ├── main.tsx
│   └── _archive/                     # explicitly archived pages/components (August 2026), see its README
│       ├── pages/  Cohort.tsx, Enterprise.tsx, Immersion.tsx, LeadershipInsights.tsx, Workshops.tsx, workshops/
│       └── components/  LightningLessons.tsx, ModuleExplorer.tsx, PreCallQualifier.tsx, YFork.tsx
├── supabase/
│   ├── functions/                    # see "Edge Functions" below for live vs dormant-but-deployed
│   │   ├── _shared/                  # incl. mindy/, enrich/, proposal/ (Diagnosis Room logic, dormant)
│   │   ├── mindy-chat/, enrich-company/, generate-proposal/, session-digest/, transcribe/,
│   │   │   company-search/           # Diagnosis Room support functions
│   │   ├── nervous-decision-machine/, get-ai-news/, get-market-sentiment/, get-model-data/
│   │   ├── send-lead-email/, send-leadership-insights-email/, notify-scoping-request/,
│   │   │   notify-ctrl-waitlist/, create-consultation-hold/, import-audience-csv/
│   │   ├── send-contact-email/       # live — called from /contact
│   │   ├── submit-intake/, submit-testimonial/, personalize-intake/  # live — called from the static forms
│   │   └── (config.toml also references a `chat-with-krish` function that has no directory here — flagged below)
│   ├── migrations/
│   └── config.toml
├── public/
│   ├── llms.txt                       # LLM discoverability
│   ├── robots.txt                     # allow-list for GPTBot / ClaudeBot / PerplexityBot / Google-Extended
│   ├── sitemap.xml                    # generated by scripts/generate-sitemap.mjs
│   ├── rising-cities.mp4              # homepage hero background video
│   ├── CTRL-demo-aug-26.mp4           # CTRL demo loop, Index + Operator
│   ├── Krish-Headshot.png, krish-stage-{1,2,3}.{jpg,png}
│   ├── intake/index.html              # static pre-session intake form (live, noindex, direct URL only)
│   │                                  # posts to submit-intake; also calls enrich-company + personalize-intake
│   ├── testimonials/index.html        # static testimonial submission form (live, noindex, direct URL only)
│   └── ...
├── scripts/
│   ├── generate-sitemap.mjs
│   ├── generate-llms.mjs
│   └── prerender.mjs
├── project-documentation/
├── CLAUDE.md                          # authoritative codebase reference
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

**Dormant code, not in the active route tree.** Per root `CLAUDE.md`: legacy offer and AI-flow code may still exist in `src/` outside the routes actually mounted in `src/App.tsx`. Treat it as technical history, not current product truth, and do not build on it without confirming with Krish first. This includes: `src/pages/Teardown.tsx`, `Handover.tsx`, `Capital.tsx`, `Brief.tsx`; all of `src/components/diagnosis/*` (`DiagnosisRoom`, `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar`, `CompanyField`, `BrushPainter`, `logoLuminance.ts`, `useDiagnosisSession.ts`); all of `src/components/nervous-decision/*`; `ScopingModal.tsx`, `InitialConsultModal.tsx`, `BigProblem.tsx`, `TwoDoors.tsx`, `SimpleCTA.tsx`, `NewHero.tsx`, `ProductExpandCard.tsx`, `ProductExpandSection.tsx`, `OperatorsEdge.tsx`, `OperatorsBrief.tsx`, `PriceTicker.tsx`, `LiveDecisionPreview.tsx`, `CtrlWaitlistPopover.tsx`, `MindMakerLiveSection.tsx`, `CurrencySwitcher.tsx`; `src/contexts/CurrencyContext.tsx`, `SessionDataContext.tsx`; `src/lib/offers.ts`, `stripe-prices.ts`; `src/hooks/useLiveBrief.ts`, `useOpenAIContext.ts`, `useModelData.ts`, `useRealisticCounters.ts`; everything under `src/_archive/`.

One exception worth flagging: `FrameworkJourney.tsx` is imported by both the dormant `OperatorsEdge.tsx` **and** the live `NewAgeLeadership.tsx` page, so the component itself is live (via `/new-age-leadership`) even though one of its two call sites is dormant.

---

## Application Routes

Authoritative source: `src/App.tsx`, verified 2026-08-16. Non-homepage live pages are lazy-loaded via `React.lazy`.

### Live pages

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. Primary CTA is `BookFitCall` throughout. |
| `/sprint` | `Sprint` | The one public paid offer, the 21-day Sprint. |
| `/case-studies` | `CaseStudies` | Approved proof archive. |
| `/operator` | `Operator` | How Krish operates. 14-agent OS credential page. Looping `/CTRL-demo-aug-26.mp4`. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | |
| `/library` | `Library` | Resources, including the FAQ tab. |
| `/new-age-leadership` | `NewAgeLeadership` | Essay on agentic org design. Lazy-loaded `OrgChart` + `AgathaStory`. |
| `/contact` | `Contact` | General messages. Calls `send-contact-email`. Not a sales action. |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `/alumni` | `Alumni` | Invitation-only continuity. Hidden from nav and footer, `noindex`, direct URL only. |
| `*` | `NotFound` | Catch-all |

Two additional live pages are static HTML, not part of the React app, and are only reachable by direct URL (both `noindex, nofollow` per `vercel.json` headers):

| Path | File | Notes |
|---|---|---|
| `/intake` | `public/intake/index.html` | Pre-session intake form. Calls `submit-intake`, and optionally `enrich-company` + `personalize-intake` for company-aware microcopy. |
| `/testimonials` | `public/testimonials/index.html` | Public testimonial submission form. Calls `submit-testimonial`. |

### Redirect-only routes (in `src/App.tsx`)

| Route(s) | Destination | Mechanism |
|---|---|---|
| `/start`, `/decision` | `BOOKING_URL` (Calendly) | `ExternalRedirect` (client-side `window.location.replace`) |
| `/signal`, `/builder-economy` | `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`) | `ExternalRedirect` |
| `/teardown`, `/handover`, `/capital`, `/tool` | `/sprint` | `<Navigate replace />` |
| `/faq` | `/library?tab=questions` | `<Navigate replace />` |
| `/workshops`, `/workshops/:slug`, `/enterprise`, `/immersion`, `/cohort`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` | `/sprint` | `<Navigate replace />` |

**These React Router entries are the client-side fallback only** — they exist so in-app navigation to a retired path still lands somewhere sensible, and they return HTTP 200 with the SPA shell. The real redirects a crawler or a cold visitor hits are the ones in `vercel.json` `redirects`, which are **not all identical in kind**:

- `/start` and `/decision` → `https://calendly.com/krish-raja/mindmaker-meeting` — **non-permanent (302)**, straight to Calendly (not to `/sprint` and not routed through `BOOKING_URL`'s UTM tagging).
- `/signal` → `https://live.themindmaker.ai`, `/builder-economy` → `https://live.themindmaker.ai` — **permanent (301)**.
- Every other listed legacy path → `/sprint` — **permanent (301)**.

No `/pricing` page and no `/pricing`-style route anywhere in `src/App.tsx` or `vercel.json`.

---

## Homepage Scroll Order

Authoritative source: `src/pages/Index.tsx`, verified 2026-08-16. The page hand-rolls its sections directly rather than composing named section components.

1. `Navigation`. Fixed top.
2. Hero. Ink background, looping `/rising-cities.mp4` at low opacity, headline "Make the right call as AI changes your business." Primary CTA `BookFitCall` (`source="homepage-hero"`) plus a secondary link to `/sprint`.
3. `#reach-title`. "Mindmaker has helped over 4000 leaders with what's next in AI," with the three attendee-brand logos from `attendeeBrands` (`src/data/rebuildProof.ts`).
4. `#call-title`. "The problem is commercial. AI has changed the answer." Two static editorial cards (no flip interaction, no `BigProblem`).
5. `#sprint-title` (`id="work-with-me"`). "One decision. 21 days." The Sprint pitch: four decision types (Product, Price, Go to market, Company), three outcome chips, `BookFitCall` (`source="homepage-sprint"`), and a link to `/sprint`.
6. `#ctrl-title`. "You keep the thinking, not just the answer." `CtrlDemoVideo`, CTRL explanation. Steph Darmanin's testimonial renders here only if `useTestimonials()` returns a consented row matching "legacy ascend" — otherwise the quote is omitted, not shown unattributed.
7. `#results-title`. "Decisions that changed the work." First four `clientStories` from `rebuildProof.ts`, with a link to `/case-studies`.
8. `#krish-title`. "Built in business, not in a slide deck." Krish's headshot, bio, and Ashley Wales-Brown's testimonial (static, no consent gate — it is a career reference, not a client quote).
9. Final CTA section. "One hard decision. One clear place to start." `BookFitCall` (`source="homepage-final"`).
10. `Footer`.

`ParticleBackground` is mounted behind the whole page.

**Not on the homepage:** `NewHero`, `BigProblem`, `TwoDoors`, `TrustSection`, `FrameworkJourney`, `OperatorsEdge`, `OperatorsBrief`, `SimpleCTA`, `MindMakerLiveSection` — none of these named components are imported by `Index.tsx`. It is hand-authored JSX with its own ids, not a composition of the old section components.

No global overlays are mounted in `src/App.tsx` besides `ErrorBoundary` and `CookieConsent`. There is no `DiagnosisRoom`, `ScopingModal`, or `InitialConsultModal` mounted anywhere reachable from a live route.

---

## Navigation Structure

Authoritative source: `src/components/Navigation.tsx`, verified 2026-08-16. Four choices, no dropdowns.

| Slot | Label | Destination |
|---|---|---|
| 1 | The Sprint | `/sprint` |
| 2 | Results | `/case-studies` |
| 3 | Mindmaker LIVE (wordmark pill) | External, `MINDMAKER_LIVE_URL`, opens in a new tab |
| 4 (CTA) | Book a fit call | `BookFitCall` (`source="navigation"`), opens `BOOKING_URL` in a new tab |

Mobile menu repeats the same four items in the same order (`source="mobile-navigation"` on the CTA). `Footer.tsx` repeats the same links plus Operator, Library, Articles, New Age Leadership, Contact, Privacy, Terms, and its own `BookFitCall` (`source="footer"`).

`/operator`, `/alumni`, `/intake`, `/testimonials`, `/privacy`, and `/terms` are reachable but are **not** in the primary nav; `/alumni`, `/intake` and `/testimonials` are also excluded from the footer and are `noindex`.

---

## Pricing

No public price anywhere on the site. The Sprint is bought through a fit call, not a listed number. Per root `CLAUDE.md`: the removed private amount and the removed 22 percent result must not be reintroduced, and there is no currency switching in the live app (`CurrencySwitcher.tsx` and `CurrencyContext.tsx` are dormant, used only by the retired `Teardown`/`Handover`/`Capital` pages). `src/lib/offers.ts` and `src/lib/stripe-prices.ts` still hold the old per-engagement USD/GBP/AUD figures and Stripe identifiers, but nothing in the live route tree imports them for display.

The canonical statement of the current commercial contract is `project-documentation/OFFERS.md` (confirmed present in this repository). `CLAUDE.md`'s "Current commercial contract" section and `README.md`'s "Public journey" section are the short public-facing summaries of the same contract.

---

## Data Flows

### Booking / conversion flow (current)

Every primary sales action on every live page is the same component, `BookFitCall.tsx`:

```
1. Visitor clicks "Book a fit call" (Navigation, Footer, Index, Sprint, Operator,
   CaseStudies, Blog, BlogPost, NewAgeLeadership, or Alumni's own link to BOOKING_URL)
   └─> <a href={`${BOOKING_URL}?utm_source=${source}`} target="_blank">
   └─> onClick fires window.plausible?.('fit_call_clicked', { props: { source } })
       (best-effort; booking still works if analytics is blocked)
2. Calendly opens in a new tab. Nothing on this site itself takes the booking;
   there is no in-app booking modal, gate, or qualifying step before Calendly.
```

`source` values seen in the live code: `homepage-hero`, `homepage-sprint`, `homepage-final`, `navigation`, `mobile-navigation`, `footer`. Individual pages (Sprint, Operator, CaseStudies, etc.) pass their own `source` string to the same component — each page's exact string was not individually re-verified for this pass.

`/start` and `/decision` are a second, separate booking entry point: they redirect straight to the same Calendly URL (see Application Routes above), but as a **direct edge redirect** in `vercel.json`, not through `BookFitCall`, so a visitor arriving that way does not get the `utm_source` tag or the `fit_call_clicked` event.

### Contact flow

```
1. Visitor fills the /contact form
2. supabase.functions.invoke('send-contact-email', { ...formFields })
3. Edge function sends via Resend
```
Contact is explicitly for general messages; per `CLAUDE.md` it does not replace the fit call.

### Static intake / testimonial forms

These are outside the React app (`public/intake/index.html`, `public/testimonials/index.html`), reachable only by direct URL, and excluded from index/nav/footer:

```
/intake:
  1. Optional company-aware personalisation:
     fetch(enrich-company) with depth:'identity' -> Brandfetch/Tranco dossier
     fetch(personalize-intake) with the resulting SAFE dossier fields (never dossier.scale.*)
       -> { fragments: { business_reflect?, aspiration_nudge? } }, each voice-linted;
          on any failure, empty input, or off-voice output the page falls back to its
          own static copy — this is progressive enhancement, not a required step.
  2. fetch(submit-intake) on submit -> inserts a row + emails Krish a formatted brief

/testimonials:
  1. fetch(submit-testimonial) on submit -> inserts a row into public.testimonials
     + emails Krish a notification. Honeypot field for bot prevention.
```

### Diagnosis Room, Nervous Decision Machine, Live Intel — dormant

`src/components/diagnosis/*`, `src/components/nervous-decision/*`, and the old `/signal` dashboard (`src/pages/Brief.tsx`) are fully wired end to end (session state machine, edge functions, Plausible events) but **not reachable from any live route**. `DiagnosisRoom` is not mounted in `App.tsx`; nothing imports `Brief.tsx`; `OperatorsBrief`/`PriceTicker`/`LiveDecisionPreview` (the components that embedded the Nervous Decision Machine) are not imported by `Index.tsx` or any live page. Treat their internal data-flow documentation, if needed again, as historical rather than re-documenting it here — see git history for the prior version of this file if the mechanics need to be resumed.

### New Age Leadership org chart

```
Live, on /new-age-leadership only:
- OrgChart.tsx fires trackEvent('chart_node_clicked', { node }) and
  trackEvent('chart_toggle_flipped', { to }) via window.plausible
- AgathaStory.tsx fires window.plausible?.('page_completed') on story completion
```

---

## Edge Functions

Location: `supabase/functions/[function-name]/index.ts`.

**Flag for Krish:** `supabase/config.toml` only sets `verify_jwt = false` for 12 functions (`chat-with-krish`, `get-ai-news`, `get-market-sentiment`, `create-consultation-hold`, `send-lead-email`, `send-contact-email`, `send-leadership-insights-email`, `nervous-decision-machine`, `import-audience-csv`, `submit-testimonial`, `submit-intake`, `personalize-intake`). It also references a `chat-with-krish` function that has **no corresponding directory** in `supabase/functions/` — likely a stale config entry for a renamed or removed function, not re-verified further here. The remaining functions below (`mindy-chat`, `enrich-company`, `generate-proposal`, `session-digest`, `transcribe`, `get-model-data`, `notify-scoping-request`, `notify-ctrl-waitlist`, `company-search`) have no entry in `config.toml`, which on Supabase normally defaults to `verify_jwt = true` (anonymous calls rejected) rather than the previous version of this document's blanket claim that all functions have `verify_jwt = false`. This needs Krish or whoever owns the Supabase project to confirm actual deployed settings — it wasn't re-derived from anything other than reading this file.

### Called from a live page or a live static form

- **`send-contact-email`** — `/contact` form submissions. Secret: `RESEND_API_KEY`.
- **`submit-intake`** — `/intake` static form. Inserts a row + emails Krish a formatted brief. Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **`submit-testimonial`** — `/testimonials` static form. Inserts a row into `public.testimonials` + emails Krish. Secrets: `RESEND_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- **`enrich-company`** — called by `/intake` (`depth:'identity'`) for a fast Brandfetch/Tranco company lookup, and separately by the dormant Diagnosis Room (`depth:'full'`, which also uses PDL/BuiltWith/Gemini/Anthropic — that deeper path is not reachable from `/intake`). Secrets (all optional, degrade gracefully): `BRANDFETCH_API_KEY`, `PEOPLEDATALABS_API_KEY`, `BUILTWITH_API_KEY`, `EXA_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY`, `GOOGLE_AI_API_KEY`, `ANTHROPIC_API_KEY`.
- **`personalize-intake`** — called by `/intake` for two small voice-linted microcopy fragments (`business_reflect`, `aspiration_nudge`), built from the same SAFE dossier fields `enrich-company` returned (never `dossier.scale.*`). Fails closed to `{ fragments: {} }` on any error, empty input, or off-voice output, and the page has its own static copy either way. Secret: whatever `_shared/enrich/llm.ts`'s `completeText` requires (not independently re-verified — likely `ANTHROPIC_API_KEY`, shared with `mindy-chat`).

### Deployed but not called from the live site (dormant)

- **`mindy-chat`** — Mindy's Diagnosis Room reasoning turn. Only caller is `useDiagnosisSession.ts`. Secret: `ANTHROPIC_API_KEY`.
- **`generate-proposal`** — Diagnosis Room co-branded proposal + PDF. Only caller is `useDiagnosisSession.ts`. Secrets: `ANTHROPIC_API_KEY`, `BROWSERLESS_API_KEY`.
- **`session-digest`** — Diagnosis Room end-of-session email to Krish. Only caller is `useDiagnosisSession.ts`. Secret: `RESEND_API_KEY`.
- **`transcribe`** — Diagnosis Room mic input (OpenAI Whisper). Only called from `diagnosis/*` components. Secret: `OPENAI_API_KEY`.
- **`company-search`** — Diagnosis Room opener typeahead (Brandfetch Search API). Only caller is `diagnosis/CompanyField.tsx`. Secrets: `BRANDFETCH_API_KEY` or `BRANDFETCH_CLIENT_ID`.
- **`nervous-decision-machine`** — powers `nervous-decision/Input.tsx`, itself only used by the dormant `OperatorsBrief.tsx` and the dormant `Brief.tsx` page. Secret: `ANTHROPIC_API_KEY`.
- **`get-ai-news`** — powers `useLiveBrief.ts`, only used by the dormant `Brief.tsx` page. Secret: `LOVABLE_API_KEY`.
- **`get-market-sentiment`** — powers `useOpenAIContext.ts`, only used by the dormant `useRealisticCounters.ts`, which itself is not imported anywhere. Secret: `OPENAI_API_KEY`.
- **`get-model-data`** — powers `useModelData.ts`, only used by the dormant `PriceTicker.tsx` / `LiveDecisionPreview.tsx`.
- **`send-lead-email`** — only caller is the dormant `InitialConsultModal.tsx` (plus a dead helper `src/utils/emailNotification.ts` that nothing imports). Secrets: `RESEND_API_KEY`, `GEMINI_API_KEY` (preferred), `OPENAI_API_KEY` (fallback).
- **`send-leadership-insights-email`** — only caller is `src/_archive/pages/LeadershipInsights.tsx`, explicitly archived. Secret: `RESEND_API_KEY`.
- **`notify-scoping-request`** — only caller is the dormant `ScopingModal.tsx`. Secret: `RESEND_API_KEY`.
- **`notify-ctrl-waitlist`** — only caller is `CtrlWaitlistPopover.tsx`, which itself is only imported by the archived `src/_archive/components/YFork.tsx`. Secret: `RESEND_API_KEY`.
- **`create-consultation-hold`** — Stripe authorization hold. No caller found anywhere in `src/`. Secret: `STRIPE_SECRET_KEY`.
- **`import-audience-csv`** — no caller found in `src/` or `public/`; presumably invoked out-of-band (an admin script or manual call), not part of any page flow. Gated by `AUDIENCE_IMPORT_SECRET`. Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `AUDIENCE_IMPORT_SECRET`.

---

## State Management

- **Routing / URL state:** React Router v6 (`BrowserRouter` in `App.tsx`)
- **Server state:** TanStack Query (`useTestimonials`, `useBlogPosts`, etc.)
- **Form state:** React Hook Form + Zod schemas where used (e.g. `/contact`)
- **Context state:** `ThemeProvider` (next-themes) handles dark mode via class attribute — this is the only context provider mounted in `App.tsx`. `SessionDataContext` and `CurrencyContext` still exist in `src/contexts/` but are dormant: nothing in the live route tree wraps a provider around them (their only consumers are the dormant `InitialConsultModal.tsx`/`useDiagnosisSession.ts` and `CurrencySwitcher.tsx`/`Teardown`/`Handover`/`Capital`, respectively).
- **No user authentication:** all bookings via Calendly; no user accounts

---

## Database

- Supabase connected, minimal usage
- Migrations present: `leads`, `company_research_cache`, `blog_posts`, a scoping-and-waitlist migration, `testimonials` (plus a later `testimonials_public_read` migration adding the `publishable_testimonials` view), `intake_submissions`, and an `engagement_intelligence` migration (2026-08-11) — the last one's exact table/column shape was not opened for this pass.
- `useTestimonials.ts` reads `publishable_testimonials`, a view that exposes only consent-gated (`permission = 'free'`) rows — this is the mechanism behind the Steph Darmanin quote's conditional rendering on the homepage.
- RLS policies expected on all tables; not individually re-verified here.

---

## Performance

- Route-based code splitting via React Router + `React.lazy` (everything except `Index`)
- Vite automatic chunking
- Hero background video (`/rising-cities.mp4`) on Index
- CTRL demo video (`CtrlDemoVideo.tsx`, `/CTRL-demo-aug-26.mp4`) inline, muted and responsive, on Index and Operator
- `OrgChart` on `/new-age-leadership` is lazy-loaded so it doesn't block hero LCP
- Not independently re-verified for this pass: specific font-loading and icon-library claims from the prior version of this document (Inter Variable / Space Grotesk Variable, Lucide React, TanStack Query stale time). `lucide-react` and TanStack Query are both still real dependencies per `package.json`.

---

## SEO & LLM Discoverability

- `SEO.tsx` used across live pages for meta + Open Graph
- `scripts/generate-sitemap.mjs` generates `public/sitemap.xml` during build
- `scripts/generate-llms.mjs` generates `public/llms.txt` during build
- `scripts/prerender.mjs` prerenders key routes post-build
- `public/robots.txt` allow-list for GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- `vercel.json` sets `X-Robots-Tag: noindex, nofollow` on `/testimonials`, `/intake`, `/alumni`, and `index, follow` everywhere else
- Plausible events actually fired from live code:
  - `fit_call_clicked` (`BookFitCall.tsx`, with a `source` prop identifying where it was clicked) — the one conversion event on the live buying path
  - `chart_node_clicked`, `chart_toggle_flipped` (`new-age/OrgChart.tsx`, on `/new-age-leadership`)
  - `page_completed` (`new-age/AgathaStory.tsx`, on `/new-age-leadership`)
  - All `diagnosis_room_*` and `operator_page_cta_clicked` events referenced in the prior version of this document belong to dormant code and are not fired from any live route today.

---

## Build & Deploy

```bash
npm run dev     # Vite dev server
npm run lint    # ESLint
npm run build   # vite build -> generate-sitemap.mjs -> generate-llms.mjs -> prerender.mjs -> dist/
npm test        # Vitest
```

Deployment mechanics (auto-deploy trigger, propagation time) were not re-verified for this pass; `README.md` states work happens on a working branch with a preview required before merge, and that production promotion is manual and not authorised by the rebuild in progress. See `project-documentation/REBUILD_STATE.md` for the current authority state.

---

## Secrets Reference

| Secret | Purpose | Status |
|---|---|---|
| `RESEND_API_KEY` | Email delivery: `send-contact-email` (live), `submit-intake`/`submit-testimonial` (live), plus `session-digest`/`send-lead-email`/`send-leadership-insights-email`/`notify-scoping-request`/`notify-ctrl-waitlist` (all dormant) | **Required for live site** |
| `SUPABASE_SERVICE_ROLE_KEY` | `submit-intake`, `submit-testimonial`, also `import-audience-csv` | **Required for live site** |
| `ANTHROPIC_API_KEY` | `personalize-intake` (live, optional enhancement); also `mindy-chat`, `generate-proposal`, `nervous-decision-machine` (dormant) | Required for the live `/intake` personalisation to work; `/intake` degrades gracefully without it |
| `BRANDFETCH_API_KEY` / `BRANDFETCH_CLIENT_ID` | `enrich-company` (live, via `/intake`, `depth:'identity'`); `company-search` (dormant) | Recommended for live — `/intake` degrades gracefully without it |
| `GOOGLE_AI_API_KEY`, `PEOPLEDATALABS_API_KEY`, `BUILTWITH_API_KEY`, `EXA_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY` | `enrich-company` full-depth synthesis | Only reached via the dormant Diagnosis Room path, not via `/intake`'s `identity`-depth call — effectively dormant for the live site |
| `GEMINI_API_KEY`, `OPENAI_API_KEY` | `send-lead-email`, `get-market-sentiment`, `transcribe` | Dormant-only |
| `BROWSERLESS_API_KEY` | `generate-proposal` | Dormant-only |
| `LOVABLE_API_KEY` | `get-ai-news` | Dormant-only |
| `STRIPE_SECRET_KEY` | `create-consultation-hold` | Dormant-only, no caller found |
| `AUDIENCE_IMPORT_SECRET` | Gate for `import-audience-csv` | Only relevant if that function is still invoked out-of-band |
| `SUPABASE_*` (URL, anon key) | General Supabase client config | **Required for live site** |

---

**End of ARCHITECTURE**
