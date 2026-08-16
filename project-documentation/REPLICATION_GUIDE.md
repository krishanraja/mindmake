# Replication Guide

**Last Updated:** 2026-08-16

---

## Overview

Step-by-step instructions to replicate the Mindmaker platform. Follow in order.

**Read this before following any step below.** The repo pivoted its commercial model on 2026-08-12 (see root `CLAUDE.md` and `project-documentation/DECISIONS_LOG.md`) from a two-offer ladder sold through the Diagnosis Room, `ScopingModal`, and `InitialConsultModal` to **one public offer** (a 21-day Sprint at `/sprint`, no public price) sold through a single **"Book a fit call"** CTA (`src/components/BookFitCall.tsx`). Verified against `src/App.tsx`: none of the Diagnosis Room, `ScopingModal`, `InitialConsultModal`, `Brief.tsx` (Live Intel / `/signal`), `Teardown.tsx`, `Handover.tsx`, or `Capital.tsx` components are imported or routed to any more. Their source files still exist in the repo, and several steps below still describe setting them up — those steps are marked **"Optional — dormant feature set"** and are not required to stand up the current live site. Skip them for a baseline replication unless you are deliberately reviving a paused feature.

**Prerequisites:**
- Node.js 18+
- npm
- Git
- Lovable account (`lovable.dev`), or Vercel + Supabase if going non-Lovable
- Calendly account (required — every live sales action links here via `BOOKING_URL`)
- Resend account (required, for the live contact/testimonial/intake emails)
- Anthropic and OpenAI accounts (optional — only needed if reviving the paused Diagnosis Room / Nervous Decision Machine feature set; see Phase 5)

**Note:** Stripe integration exists (`create-consultation-hold`) but is currently bypassed. Not required for initial setup.

---

## Phase 1: Environment Setup

### Step 1: Create Lovable project
```
1. Go to lovable.dev
2. New Project → "mindmaker"
```

### Step 2: Enable Lovable Cloud
Provisioning a Supabase project takes 2–3 min. Note the `project_id` in `supabase/config.toml`.

### Step 3: Connect GitHub (recommended)
Bidirectional sync via the Lovable GitHub App.

---

## Phase 2: Base Configuration

### Step 4: Install dependencies
```bash
npm install react@18.3.1 react-dom@18.3.1
npm install @tanstack/react-query@5
npm install react-router-dom@6
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install framer-motion@12
npm install lucide-react
npm install tailwindcss@3 tailwindcss-animate
npm install class-variance-authority clsx tailwind-merge
npm install @supabase/supabase-js
npm install zod react-hook-form
npm install sonner
npm install next-themes
npm install react-helmet
```

Verified against `package.json` (2026-08-16): the live dependency is **`react-helmet`** (`^6.1.0`), not `react-helmet-async` as this step previously said. `package.json` also carries several dependencies this list doesn't mention (`date-fns`, `embla-carousel-react`, `react-markdown`, `reactflow`, `vaul`, `pdfmake`, `@tailwindcss/typography`, `canvas`, `playwright`, among others) — treat this list as a minimum, not exhaustive, set and cross-check `package.json` directly before a real install.

### Step 5: Configure Tailwind
Copy `tailwind.config.ts` from the repo. See `DESIGN_SYSTEM.md` for tokens.

### Step 6: Set up design system
Copy `src/index.css` from the repo. See `DESIGN_SYSTEM.md`.

---

## Phase 3: Core Components

### Step 7: shadcn/ui components
Copy files from `src/components/ui/`.

### Step 8: Layout components (required)
```
src/components/Navigation.tsx          # "The Sprint" / "Results" links + external Mindmaker Live pill + BookFitCall
src/components/Footer.tsx
src/components/BookFitCall.tsx         # the one live sales-action button (links to Calendly, no modal)
src/components/CookieConsent.tsx
```

**Optional — dormant feature set, not mounted in `src/App.tsx`:**
```
src/components/diagnosis/              # Diagnosis Room (Mindy); paused 2026-08-12, unmounted
src/components/ScopingModal.tsx        # secondary "Scope it with me" surface; paused, unmounted
src/components/InitialConsultModal.tsx # legacy surface; paused, unmounted (previously dispatched from /alumni)
```
These still exist in the tree and are still referenced by other dormant components, but `App.tsx` mounts none of them. Only build these if you are deliberately reviving the paused conversion surfaces.

### Step 9: Page components
**Required — matches the live route tree in `src/App.tsx` (verified 2026-08-16):**
```
src/pages/Index.tsx                    # homepage (eager-loaded)
src/pages/Sprint.tsx                   # /sprint — the one public offer
src/pages/CaseStudies.tsx              # /case-studies — approved proof archive
src/pages/Operator.tsx                 # /operator
src/pages/Blog.tsx, BlogPost.tsx       # /blog, /blog/:slug
src/pages/Library.tsx                  # /library
src/pages/NewAgeLeadership.tsx         # /new-age-leadership
src/pages/Contact.tsx                  # /contact
src/pages/Privacy.tsx, Terms.tsx       # /privacy, /terms
src/pages/Alumni.tsx                   # /alumni
src/pages/NotFound.tsx                 # catch-all
```

**Optional — dormant, not referenced by any `<Route>` in `App.tsx`:**
```
src/pages/Teardown.tsx                 # The Handover / Teardown ladder retired 2026-08-12
src/pages/Handover.tsx
src/pages/Capital.tsx
src/pages/Brief.tsx                    # old in-app Live Intel dashboard; /signal is now an external redirect
```
`/leaders`, `/leadership-insights`, `/workshops`, `/enterprise`, `/cohort`, `/immersion`, and other legacy paths have no page component at all any more — they resolve to a shared `<Navigate to="/sprint" replace />` fallback in `App.tsx`, not a dedicated page.

### Step 10: Homepage section components
**As of 2026-08-16, `src/pages/Index.tsx` does not import any of the components previously listed here** (`NewHero`, `BigProblem`, `TrustSection`, `TwoDoors`, `OperatorsEdge`, `OperatorsBrief`, `PriceTicker`, `SimpleCTA` are all unreferenced from the live homepage). Its actual imports are:
```
src/components/Navigation.tsx
src/components/Footer.tsx
src/components/BookFitCall.tsx
src/components/SEO.tsx
src/components/Animations/ParticleBackground.tsx
src/components/CtrlDemoVideo.tsx           # shared /CTRL-demo-aug-26.mp4 player
src/hooks/useTestimonials.ts
src/data/rebuildProof.ts                   # proof data used by the rebuild
```
The older component list above is **optional — dormant feature set**: useful only if reviving the pre-pivot homepage build, and even then, verify each component still compiles against the current design tokens before relying on this list.

### Step 10b: New Age Leadership components (required)
```
src/components/new-age/OrgChart.tsx    # interactive agent-native org chart (lazy-loaded)
src/components/new-age/AgathaStory.tsx # embedded narrative + completion beacon
```
Both are imported by the live `src/pages/NewAgeLeadership.tsx`.

### Step 11: Nervous Decision Machine components — Optional, dormant feature set
```
src/components/nervous-decision/Input.tsx     # compact + full sizes
src/components/nervous-decision/Artifact.tsx
src/components/nervous-decision/types.ts
```
Not imported by any live page (its only referrers are `OperatorsBrief.tsx` and `Brief.tsx`, both dormant). Skip for a baseline replication of the current site.

### Step 11b: Diagnosis Room (Mindy) — Optional, dormant feature set, paused 2026-08-12
```
src/components/diagnosis/                      # full-screen on-site experience; not mounted in App.tsx as of 2026-08-12
```
When it was live, Mindy diagnosed the visitor's one nervous AI decision and forked to three exits: keep chatting, book a call, or generate/download a co-branded "Mindmaker × [company]" proposal, backed by the `mindy-chat`, `enrich-company`, `generate-proposal`, `session-digest`, and `transcribe` edge functions (see Phase 4). None of that is reachable on the live site today. Build this only if explicitly reviving the paused journey.

### Step 12: Global context + hooks
**Required:**
```
src/hooks/useScrollDirection.ts         # navbar hide/show; used by the live Navigation.tsx
src/hooks/useTestimonials.ts            # used by Index.tsx and CaseStudies.tsx
```

**Optional — dormant, only referenced from unmounted components:**
```
src/contexts/SessionDataContext.tsx     # only consumed by the dormant InitialConsultModal.tsx
src/hooks/useModelData.ts               # ALLOWED_MODEL_IDS allowlist; only consumed by dormant PriceTicker.tsx / LiveDecisionPreview.tsx
src/hooks/useLeadershipInsights.ts      # only consumed by the archived src/_archive/pages/LeadershipInsights.tsx
```

---

## Phase 4: Edge Functions

**Note (2026-08-16):** Root `CLAUDE.md` says not to edit Supabase, the CTRL repository, or the control centre as part of the website rebuild. Treat this whole phase as reference for what exists, not a to-do list to reproduce wholesale — build only the functions the pages you're actually standing up call.

**Required for the live site (still reachable from `src/` or the static `/testimonials` and `/intake` pages under `public/`, per `vercel.json` rewrites):**
```
supabase/functions/send-contact-email/index.ts         # Contact.tsx (/contact)
supabase/functions/submit-testimonial/index.ts         # testimonial submission (public /testimonials page + CaseStudies/Index carousel)
supabase/functions/submit-intake/index.ts               # public /intake page
```

**Optional — dormant, only reachable from unmounted components or edge functions with no live caller (verify current need before building):**
```
supabase/functions/nervous-decision-machine/index.ts  # Nervous Decision Machine; not imported by any live page
supabase/functions/get-ai-news/index.ts                # Operator's Brief content; OperatorsBrief.tsx is dormant
supabase/functions/get-market-sentiment/index.ts
supabase/functions/get-model-data/index.ts             # PriceTicker feed; PriceTicker.tsx is dormant
supabase/functions/send-lead-email/index.ts            # OpenAI enrichment + Resend
supabase/functions/send-leadership-insights-email/index.ts  # only used by the archived LeadershipInsights.tsx
supabase/functions/notify-scoping-request/index.ts     # ScopingModal intake; ScopingModal is unmounted
supabase/functions/notify-ctrl-waitlist/index.ts       # CtrlWaitlistPopover; only referenced from an archived component
supabase/functions/mindy-chat/index.ts                 # Diagnosis Room (Mindy) conversation; paused
supabase/functions/enrich-company/index.ts             # Diagnosis Room company enrichment; paused
supabase/functions/generate-proposal/index.ts          # Diagnosis Room co-branded proposal generation; paused
supabase/functions/session-digest/index.ts             # Diagnosis Room session digest; paused
supabase/functions/transcribe/index.ts                 # Whisper voice input for the Diagnosis Room; paused
supabase/functions/create-consultation-hold/index.ts   # Stripe (bypassed; not wired into any live flow)
supabase/functions/company-search/index.ts              # Brandfetch typeahead for the Diagnosis Room opener; paused
```

If a step below (Anthropic, OpenAI) exists only to support functions in the optional list, it is itself optional for a baseline replication of the current live site.

### Step 15: Configure functions
```toml
# supabase/config.toml
project_id = "your-project-id"

[functions.nervous-decision-machine]
verify_jwt = false

[functions.get-ai-news]
verify_jwt = false

[functions.get-market-sentiment]
verify_jwt = false

[functions.get-model-data]
verify_jwt = false

[functions.send-lead-email]
verify_jwt = false

[functions.send-contact-email]
verify_jwt = false

[functions.send-leadership-insights-email]
verify_jwt = false

[functions.notify-scoping-request]
verify_jwt = false

[functions.notify-ctrl-waitlist]
verify_jwt = false

[functions.create-consultation-hold]
verify_jwt = false

[functions.submit-intake]
verify_jwt = false

[functions.submit-testimonial]
verify_jwt = false
```

---

## Phase 5: Integrations

### Step 16: Anthropic — Optional, only needed for the dormant AI feature set
Needed only if reviving the Nervous Decision Machine or Diagnosis Room (Mindy), which call Anthropic per `supabase/functions/nervous-decision-machine`, `mindy-chat`, and the `_shared/enrich/` helpers. Not required for a baseline replication of the current live site.
1. `console.anthropic.com` → API Keys → create key
2. Supabase: Settings → Secrets → add `ANTHROPIC_API_KEY`

### Step 17: OpenAI — Optional, only needed for the dormant AI/lead-enrichment feature set
Needed only for `send-lead-email` and the Diagnosis Room enrichment functions. Not required for the live site's contact, testimonial, or intake forms.
1. `platform.openai.com` → API keys
2. Supabase: add `OPENAI_API_KEY`

### Step 18: Resend — Required
Backs the live `send-contact-email`, `submit-testimonial`, and `submit-intake` functions.
1. `resend.com` → API keys
2. Verify sending domain
3. Supabase: add `RESEND_API_KEY`

### Step 19: Calendly — Required
1. Create the fit-call event type in Calendly.
2. Set its URL as `BOOKING_URL` in `src/lib/publicLinks.ts` — this is the single verified destination every `BookFitCall` click opens directly (no redirect URL to configure on a modal; there is no modal in the live flow).

### Step 19b: Payments
There is no checkout to build. As of 2026-08-12 the Sprint is the one public engagement, its price is not public, and it does not transact on the site — every path to booking runs through the `BookFitCall` CTA to Calendly. (The old note about the Teardown's published price and the Handover's call-only path describes the retired two-offer ladder and no longer applies; The Handover and The Teardown are retired and unrouted.)

`src/lib/stripe-prices.ts` holds identifiers and never prices (prices live in `src/lib/offers.ts`, and a test enforces that). One entry remains, for the invitation-only continuity product on `/alumni`, and even that has no in-page checkout: eligibility is confirmed first and a payment link is sent out of band.

### Step 20: Plausible (optional)
The one verified live event is **`fit_call_clicked`**, fired by `src/components/BookFitCall.tsx` with a `source` prop (nav, hero, `/sprint`, etc.) on every "Book a fit call" click. The previously documented `operator_page_cta_clicked` event no longer appears in `src/pages/Operator.tsx` — verify against the current source before relying on it. The `diagnosis_room_*` events belong to the paused Diagnosis Room journey and are not fired by any mounted component.

---

## Phase 6: Routing

**Rewritten 2026-08-16 to match the live `src/App.tsx` exactly** (the block previously here — `Workshops`, `Cohort`, `Enterprise`, `Immersion`, `LeadershipInsights`, `HashRedirect`, standalone `/start` Diagnosis Room, `/signal` → `Brief` — described the pre-2026-08-12 route tree and no components with those names remain wired into `App.tsx`; several, like `Workshops`/`Cohort`/`Enterprise`/`Immersion`/`LeadershipInsights`, have no page component in `src/pages/` at all any more):

```tsx
// Live pages
<Route path="/" element={<Index />} />
<Route path="/sprint" element={<Sprint />} />              {/* the one public offer */}
<Route path="/case-studies" element={<CaseStudies />} />
<Route path="/operator" element={<Operator />} />

// External redirects — ExternalRedirect calls window.location.replace()
<Route path="/start" element={<ExternalRedirect to={BOOKING_URL} />} />
<Route path="/decision" element={<ExternalRedirect to={BOOKING_URL} />} />
<Route path="/signal" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />
<Route path="/builder-economy" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />

<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/library" element={<Library />} />
<Route path="/new-age-leadership" element={<NewAgeLeadership />} />
<Route path="/contact" element={<Contact />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/alumni" element={<Alumni />} />

// Internal redirects to /sprint — const ToSprint = () => <Navigate to="/sprint" replace />
<Route path="/teardown" element={<ToSprint />} />
<Route path="/handover" element={<ToSprint />} />
<Route path="/capital" element={<ToSprint />} />
<Route path="/tool" element={<ToSprint />} />
<Route path="/faq" element={<Navigate to="/library?tab=questions" replace />} />

// Legacy paths, all mapped to ToSprint via a single .map() over this array:
// "/workshops", "/enterprise", "/immersion", "/cohort", "/leaders", "/leadership-insights",
// "/sprints", "/sprint/4-week", "/sprint/90-day", "/builder-sprint", "/war-room",
// "/strategy-day", "/fractional-caio", "/individual", "/team", "/builder",
// "/builder-session", "/leadership-lab", "/portfolio-program"
<Route path="/workshops/:slug" element={<ToSprint />} />

<Route path="*" element={<NotFound />} />
```

`BOOKING_URL` and `MINDMAKER_LIVE_URL` come from `src/lib/publicLinks.ts`. Only `Index` is eager-loaded; every other page is `lazy()`-loaded.

### Global overlays
Mount inside `BrowserRouter`, outside `<Routes>`:
```tsx
<CookieConsent />
```
That's the only one. `DiagnosisRoom`, `ScopingModal`, and `InitialConsultModal` are **not** mounted as global overlays as of 2026-08-12 — do not add them back without an explicit product decision to revive the paused journeys.

---

## Phase 7: Testing

### Step 21: Local test flows
**Rewritten 2026-08-16 to test the live route tree and CTA contract; the previous list tested the pre-2026-08-12 two-offer ladder and Diagnosis Room journey, none of which is reachable any more.** Root `CLAUDE.md`'s "Required checks" section is the authoritative current test contract — run the focused route and disclosure tests, the production build, lint comparison, and desktop/390px browser checks. As a baseline, verify end-to-end:
1. Homepage (`/`) loads and every main sales action renders `<BookFitCall />`, labelled "Book a fit call"
2. "Book a fit call" (nav, mobile nav, hero) opens Calendly (`BOOKING_URL` from `publicLinks.ts`) in a new tab with the expected `?utm_source=<source>` param — it does not open any in-page modal
3. `/sprint` loads and its own "Book a fit call" CTA works the same way
4. `/case-studies` loads with the approved proof archive; no offer labels on case studies, no attendee brands described as clients
5. `/operator` loads
6. `/start` and `/decision` redirect straight to Calendly; `/signal` and `/builder-economy` redirect straight to `https://live.themindmaker.ai` — none of the three renders an in-app page
7. All legacy routes (`/teardown`, `/handover`, `/capital`, `/tool`, `/workshops`, `/enterprise`, `/cohort`, `/immersion`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program`) redirect to `/sprint`; `/faq` redirects to `/library?tab=questions`
8. No public price, discount, or currency switcher appears anywhere on the live site
9. No Diagnosis Room, `ScopingModal`, or `InitialConsultModal` UI renders anywhere, and no button dispatches `openDiagnosisRoom` / `openScopingModal` / `openConsultModal`
10. `/blog`, `/blog/:slug`, `/library`, `/new-age-leadership`, `/contact`, `/privacy`, `/terms`, `/alumni` all load
11. Mobile works (390px, per root `CLAUDE.md`'s required checks) and desktop works
12. No `text-mint` on light backgrounds anywhere
13. Visible focus states, reduced-motion support, no layout overflow, no browser console errors, and one-hop redirects (per root `CLAUDE.md`)

---

## Phase 8: Deployment

### Step 22: Deploy
1. Lovable: click Publish, or push to GitHub for auto-deploy
2. Wait for CDN propagation
3. Test live URL against the Phase 7 flows

### Step 23: Final smoke tests
- All navigation links work
- All redirects work, including `/builder-economy` → external
- Edge functions respond (check Lovable logs)
- No console errors on any page
- Analytics (Plausible) recording `fit_call_clicked` on "Book a fit call" clicks

---

## Post-Launch Checklist

**Required:**
- [ ] Custom domain connected
- [ ] SSL verified
- [ ] Analytics installed (Plausible recommended)
- [ ] Error tracking (Sentry or similar)
- [ ] Legal pages reviewed
- [ ] WCAG AA compliance verified

**Recommended:**
- [ ] Uptime monitoring
- [ ] Email deliverability monitoring (Resend dashboard)
- [ ] CRM integration (lead pipeline)

---

## Support Resources

- Lovable Docs, `docs.lovable.dev`
- Supabase Docs, `supabase.com/docs`
- Anthropic API Docs, `docs.anthropic.com`
- Tailwind Docs, `tailwindcss.com/docs`
- React Docs, `react.dev`
- Authoritative codebase reference, `CLAUDE.md` (repo root)
- Strategic brief, `project-documentation/mindmaker_rebuild_brief_v4.md`

---

**End of REPLICATION_GUIDE**
