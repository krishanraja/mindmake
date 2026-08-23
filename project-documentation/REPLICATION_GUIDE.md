# Replication Guide

**Last Updated:** 2026-08-23

---

## Overview

Step-by-step instructions to replicate the Mindmaker platform. Follow in order.

**Prerequisites:**
- Node.js >=22.18.0 (see `package.json` `engines`)
- npm
- Git
- Lovable account (`lovable.dev`), or Vercel + Supabase if going non-Lovable
- Calendly account
- Anthropic, OpenAI, Resend accounts

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

### Step 5: Configure Tailwind
Copy `tailwind.config.ts` from the repo. See `DESIGN_SYSTEM.md` for tokens.

### Step 6: Set up design system
Copy `src/index.css` from the repo. See `DESIGN_SYSTEM.md`.

---

## Phase 3: Core Components

### Step 7: shadcn/ui components
Copy files from `src/components/ui/`.

### Step 8: Layout components
```
src/components/Navigation.tsx          # two links, "The Sprint" (/sprint) and "Results" (/case-studies), plus a Mindmaker Live image pill (external, https://live.themindmaker.ai) and the BookFitCall CTA. No dropdowns.
src/components/Footer.tsx
src/components/BookFitCall.tsx         # the single shared sales action, links straight to Calendly (BOOKING_URL in src/lib/publicLinks.ts)
src/components/CookieConsent.tsx
```
Note: `src/components/diagnosis/` (the Diagnosis Room), `src/components/ScopingModal.tsx` and `src/components/InitialConsultModal.tsx` still exist in the repo but are dormant — none is mounted by the current `App.tsx`. Do not replicate them as part of the live conversion path; see Step 11b.

### Step 9: Page components
```
src/pages/Index.tsx                    # homepage (eager-loaded)
src/pages/Sprint.tsx                   # /sprint, the one public paid offer (the 21-day Sprint), no public price
src/pages/CaseStudies.tsx              # /case-studies, approved proof archive
src/pages/Operator.tsx                 # 14-agent OS credential page (shared /CTRL-demo-aug-26.mp4 player)
src/pages/NewAgeLeadership.tsx         # /new-age-leadership thought leadership
src/pages/Blog.tsx, BlogPost.tsx
src/pages/Library.tsx, Alumni.tsx, Contact.tsx, Privacy.tsx, Terms.tsx
src/pages/NotFound.tsx
```
Note: `src/pages/Teardown.tsx`, `Handover.tsx`, `Capital.tsx` and `Brief.tsx` still exist as files but are dormant/legacy — not imported or routed by the current `App.tsx`. Do not treat them as core pages to replicate; they document the pre-rebuild offer ladder and the old internal Live Intel page.

### Step 10: Homepage sections
`src/pages/Index.tsx` builds the homepage as inline JSX sections rather than importing separate section components: a hero with `BookFitCall` and a link to `/sprint`; an attendee-logos strip (`src/data/rebuildProof.ts`); a "when to call Mindmaker" problem frame; a Sprint pitch section (`#work-with-me`) with a second `BookFitCall`; a CTRL section using `src/components/CtrlDemoVideo.tsx`, gated by `useTestimonials`; a client-results carousel pulling from `clientStories`; a Krish bio section; and a closing CTA with a third `BookFitCall`.

Note: `src/components/NewHero.tsx`, `BigProblem.tsx`, `TwoDoors.tsx`, `OperatorsEdge.tsx`, `OperatorsBrief.tsx`, `PriceTicker.tsx` and `SimpleCTA.tsx` still exist as files but are dormant — none is imported by `Index.tsx` or any other routed page. Do not replicate them as the current homepage structure; they document an earlier version of the site.

### Step 10b: New Age Leadership components
```
src/components/new-age/OrgChart.tsx    # interactive agent-native org chart (lazy-loaded)
src/components/new-age/AgathaStory.tsx # embedded narrative + completion beacon
```

### Step 11: Dormant AI-surface components (do not build these first)
```
src/components/nervous-decision/       # Nervous Decision Machine input + artifact rendering
src/components/diagnosis/              # Diagnosis Room (Mindy)
src/components/ScopingModal.tsx
src/components/InitialConsultModal.tsx
```
All of the above still exist in the repo and are functional in isolation, but none is mounted anywhere in the current `src/App.tsx` — the Diagnosis Room and the homepage AI demonstration are explicitly paused and unmounted. Skip this step for a faithful replication of the live site; only build it if the goal is to resurrect one of these surfaces on purpose. The Diagnosis Room was backed by the `mindy-chat`, `enrich-company`, `generate-proposal`, `session-digest`, and `transcribe` (Whisper voice input) edge functions (see Phase 4) and forked to three exits (keep chatting, book a fit call, generate/download a co-branded proposal).

### Step 12: Global context + hooks
```
src/hooks/useScrollDirection.ts         # navbar hide/show, used live by Navigation.tsx
src/hooks/useTestimonials.ts            # reads the consent-gated publishable_testimonials Supabase view
```
`src/contexts/SessionDataContext.tsx`, `src/hooks/useModelData.ts` and `src/hooks/useLeadershipInsights.ts` still exist but back the dormant Diagnosis Room / PriceTicker / `/leaders` surfaces respectively — not required for the live route tree.

---

## Phase 4: Edge Functions

### Step 13: Create Nervous Decision Machine function
```
supabase/functions/nervous-decision-machine/index.ts
```
- Model: `claude-haiku-4-5-20251001`
- Max 1500 tokens
- JSON output schema in system prompt
- Krish's voice enforced
- 1-hour per-IP rate limit + global ceiling (soft circuit breaker)
- Secret: `ANTHROPIC_API_KEY`

### Step 14: Create other functions
```
supabase/functions/get-ai-news/index.ts               # Operator's Brief content
supabase/functions/get-market-sentiment/index.ts
supabase/functions/get-model-data/index.ts            # PriceTicker feed
supabase/functions/send-lead-email/index.ts           # OpenAI enrichment + Resend
supabase/functions/send-contact-email/index.ts
supabase/functions/send-leadership-insights-email/index.ts
supabase/functions/notify-scoping-request/index.ts    # ScopingModal intake → emails krish@themindmaker.ai (Resend)
supabase/functions/notify-ctrl-waitlist/index.ts       # CTRL waitlist signup → emails krish@themindmaker.ai (Resend)
supabase/functions/mindy-chat/index.ts                 # Diagnosis Room (Mindy) conversation
supabase/functions/enrich-company/index.ts             # Diagnosis Room company enrichment
supabase/functions/generate-proposal/index.ts          # Diagnosis Room co-branded proposal generation
supabase/functions/session-digest/index.ts             # Diagnosis Room session digest
supabase/functions/transcribe/index.ts                 # Whisper voice input for the Diagnosis Room
supabase/functions/create-consultation-hold/index.ts  # Stripe (bypassed)
supabase/functions/company-search/index.ts             # Brandfetch Search API typeahead (Diagnosis Room opener)
supabase/functions/submit-intake/index.ts              # pre-session intake form → row + email brief to Krish
supabase/functions/submit-testimonial/index.ts         # public testimonial submission → testimonials table + email Krish
```

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

### Step 16: Anthropic
1. `console.anthropic.com` → API Keys → create key
2. Supabase: Settings → Secrets → add `ANTHROPIC_API_KEY`

### Step 17: OpenAI
1. `platform.openai.com` → API keys
2. Supabase: add `OPENAI_API_KEY`

### Step 18: Resend
1. `resend.com` → API keys
2. Verify sending domain
3. Supabase: add `RESEND_API_KEY`

### Step 19: Calendly
1. Create event type: "Mindmaker Initial Consultation"
2. 30–45 minutes
3. Set redirect URL in `InitialConsultModal` flow

### Step 19b: Payments
There is no checkout to build. Neither engagement transacts on the site: the Teardown price is published and the deal is invoiced direct, and the Handover always goes through a call. The third-party course platform that used to collect payment went with the six-rung ladder in August 2026.

`src/lib/stripe-prices.ts` holds identifiers and never prices (prices live in `src/lib/offers.ts`, and a test enforces that). One entry remains, for the invitation-only continuity product on `/alumni`, and even that has no in-page checkout: eligibility is confirmed first and a payment link is sent out of band.

### Step 20: Plausible (optional)
Track `operator_page_cta_clicked` on the `/operator` crossover CTA, and the `diagnosis_room_*` events on the Diagnosis Room (Mindy) journey.

---

## Phase 6: Routing

`src/App.tsx` (transcribed from the actual current file; verify against it directly before relying on this):

```tsx
const ToSprint = () => <Navigate to="/sprint" replace />;

<Routes>
  {/* Direct routes */}
  <Route path="/" element={<Index />} />
  <Route path="/sprint" element={<Sprint />} />
  <Route path="/case-studies" element={<CaseStudies />} />
  <Route path="/operator" element={<Operator />} />

  {/* External redirects, via ExternalRedirect (window.location.replace) */}
  <Route path="/start" element={<ExternalRedirect to={BOOKING_URL} />} />
  <Route path="/decision" element={<ExternalRedirect to={BOOKING_URL} />} />
  <Route path="/signal" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />
  <Route path="/builder-economy" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />
  {/* BOOKING_URL and MINDMAKER_LIVE_URL both come from src/lib/publicLinks.ts */}

  {/* More direct routes */}
  <Route path="/blog" element={<Blog />} />
  <Route path="/blog/:slug" element={<BlogPost />} />
  <Route path="/library" element={<Library />} />
  <Route path="/new-age-leadership" element={<NewAgeLeadership />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/privacy" element={<Privacy />} />
  <Route path="/terms" element={<Terms />} />
  <Route path="/alumni" element={<Alumni />} /> {/* unlinked from nav and footer; SEO noindex */}

  {/* A few retired paths get their own explicit route */}
  <Route path="/teardown" element={<ToSprint />} />
  <Route path="/handover" element={<ToSprint />} />
  <Route path="/capital" element={<ToSprint />} />
  <Route path="/tool" element={<ToSprint />} />
  <Route path="/faq" element={<Navigate to="/library?tab=questions" replace />} />

  {/* The rest of the retired paths are generated from an array */}
  {[
    "/workshops", "/enterprise", "/immersion", "/cohort", "/leaders",
    "/leadership-insights", "/sprints", "/sprint/4-week", "/sprint/90-day",
    "/builder-sprint", "/war-room", "/strategy-day", "/fractional-caio",
    "/individual", "/team", "/builder", "/builder-session",
    "/leadership-lab", "/portfolio-program",
  ].map((path) => <Route key={path} path={path} element={<ToSprint />} />)}
  <Route path="/workshops/:slug" element={<ToSprint />} />

  <Route path="*" element={<NotFound />} />
</Routes>
```

`vercel.json`'s `redirects` block mirrors this same retired-path list as real 301s (302 for `/start` and `/decision`, since those go to a booking link rather than a permanent destination), exercised at Vercel's edge rather than in the SPA. Keep the two in sync; `src/test/redirects.test.ts` checks this.

### Global overlays
Mount inside `BrowserRouter` but outside `<Routes>`:
```tsx
<ScrollToTop />
<CookieConsent />
```
There is no modal or overlay in front of the booking flow — `BookFitCall` links straight out to Calendly. `src/components/diagnosis/`, `ScopingModal.tsx` and `InitialConsultModal.tsx` are not mounted here or anywhere else in `App.tsx`.

---

## Phase 7: Testing

### Step 21: Local test flows
Verify end-to-end:
1. `/sprint` renders the Sprint page with no public price string anywhere on it
2. Homepage loads and every `BookFitCall` instance (hero, Sprint section, closing CTA, nav, mobile nav) renders **"Book a fit call"** and links to the same Calendly URL (`BOOKING_URL` in `src/lib/publicLinks.ts`), opening in a new tab
3. No second booking flow, sales modal, or AI gate intercepts a `BookFitCall` click before Calendly loads
4. Every retired path (see the array in Phase 6) redirects client-side to `/sprint`; `/faq` redirects to `/library?tab=questions`
5. `/start` and `/decision` redirect externally to the Calendly URL; `/signal` and `/builder-economy` redirect externally to `https://live.themindmaker.ai`
6. `/case-studies` renders the approved proof archive with no offer label (no "Teardown"/"Handover") on any case
7. `/operator` loads
8. `/alumni` is reachable directly, returns `noindex`, and is not linked from `Navigation.tsx` or `Footer.tsx`
9. Testimonials on the homepage render only consent-gated quotes from `publishable_testimonials`; with no consented rows, the section renders nothing rather than an error
10. Mobile works (390px and 375px)
11. No `text-mint` on light backgrounds anywhere
12. No em dash anywhere in public copy (`git grep -In "—"` over `src/`)

---

## Phase 8: Deployment

### Step 22: Deploy
1. Lovable: click Publish, or push to GitHub for auto-deploy
2. Wait for CDN propagation
3. Test live URL against the Phase 7 flows

### Step 23: Final smoke tests
- All navigation links work
- All redirects work, including `/builder-economy` and `/signal` to `https://live.themindmaker.ai`, and `/start`/`/decision` to Calendly
- `send-contact-email` responds (check Lovable logs)
- No console errors on any page
- Analytics (Plausible) recording `fit_call_clicked` on every `BookFitCall` click

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
