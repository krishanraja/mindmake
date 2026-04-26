# Replication Guide

**Last Updated:** 2026-04-26

---

## Overview

Step-by-step instructions to replicate the Mindmaker platform. Follow in order.

**Prerequisites:**
- Node.js 18+
- npm
- Git
- Lovable account (`lovable.dev`) — or Vercel + Supabase if going non-Lovable
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
npm install react-helmet-async
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
src/components/Navigation.tsx          # Cohort / Enterprise / The Brief / Resources / About
src/components/Footer.tsx
src/components/InitialConsultModal.tsx # single conversion surface (openConsultModal event listener)
src/components/PreCallQualifier.tsx    # floating pill, 3-step intake
src/components/CookieConsent.tsx
```

### Step 9: Page components
```
src/pages/Index.tsx                    # homepage (eager-loaded)
src/pages/Cohort.tsx                   # The AI Decision Cohort (Maven enrolment)
src/pages/Enterprise.tsx               # Signal Session + Revenue Architecture (30 days)
src/pages/Operator.tsx                 # 14-agent OS credential page (autoplay /ctrl-demo-video.mp4)
src/pages/Brief.tsx                    # Live Intel (/signal)
src/pages/Immersion.tsx                # AI Immersion ($12k, inquiry-only)
src/pages/NewAgeLeadership.tsx         # /new-age-leadership thought leadership
src/pages/LeadershipInsights.tsx       # Decision Readiness Diagnostic (unlinked from nav)
src/pages/Blog.tsx, BlogPost.tsx
src/pages/FAQ.tsx, Contact.tsx, Privacy.tsx, Terms.tsx
src/pages/NotFound.tsx
```

### Step 10: Homepage section components
```
src/components/NewHero.tsx             # rotating headlines + Book a call CTA
src/components/YFork.tsx               # Cohort vs Enterprise cards
src/components/BigProblem.tsx          # existential urgency frame
src/components/TrustSection.tsx        # Krish bio + testimonials carousel
src/components/FrameworkJourney.tsx    # Mind Set → Mind Map → Mind Make
src/components/OperatorsEdge.tsx       # v5 credential section
src/components/OperatorsBrief.tsx      # Live Intel homepage teaser
src/components/PriceTicker.tsx         # CSS-marquee model price ticker
src/components/LightningLessons.tsx    # 4 Maven Lightning Lesson links (Resources nav)
src/components/SimpleCTA.tsx
```

### Step 10b: New Age Leadership components
```
src/components/new-age/OrgChart.tsx    # interactive agent-native org chart (lazy-loaded)
src/components/new-age/AgathaStory.tsx # embedded narrative + completion beacon
```

### Step 11: Nervous Decision Machine components
```
src/components/nervous-decision/Input.tsx     # compact + full sizes
src/components/nervous-decision/Artifact.tsx
src/components/nervous-decision/types.ts
```

### Step 12: Global context + hooks
```
src/contexts/SessionDataContext.tsx     # threads qualifier data into modal
src/hooks/useModelData.ts               # ALLOWED_MODEL_IDS allowlist
src/hooks/useScrollDirection.ts         # navbar hide/show
src/hooks/useLeadershipInsights.ts
```

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
supabase/functions/create-consultation-hold/index.ts  # Stripe (bypassed)
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

[functions.create-consultation-hold]
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

### Step 19b: Maven (Cohort enrolment)
1. Create the cohort offering on Maven (or use the existing `https://maven.com/aimindmaker/ai-decision-intensive`)
2. Update `MAVEN_COHORT_URL` constant in `src/pages/Cohort.tsx`
3. Verify the "Hosted on Maven" pill and the "Reserve my seat on Maven" CTA both link to the URL

### Step 20: Plausible (optional)
Track `operator_page_cta_clicked` on `/operator` Revenue Architecture CTA, and `pre_call_qualifier_completed` on the PreCallQualifier book-a-call action.

---

## Phase 6: Routing

`src/App.tsx`:

```tsx
// Live routes
<Route path="/" element={<Index />} />
<Route path="/cohort" element={<Cohort />} />
<Route path="/enterprise" element={<Enterprise />} />
<Route path="/operator" element={<Operator />} />
<Route path="/signal" element={<Brief />} />
<Route path="/immersion" element={<Immersion />} />
<Route path="/new-age-leadership" element={<NewAgeLeadership />} />
<Route path="/leaders" element={<LeadershipInsights />} />
<Route path="/leadership-insights" element={<LeadershipInsights />} />
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/contact" element={<Contact />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />

// Internal redirects (HashRedirect preserves query + hash)
<Route path="/tool" element={<Navigate to="/signal#decision" replace />} />
<Route path="/sprints" element={<HashRedirect to="/cohort" />} />
<Route path="/sprint/4-week" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
<Route path="/sprint/90-day" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
<Route path="/builder-sprint" element={<HashRedirect to="/cohort?inquiry=1:1" />} />
<Route path="/war-room" element={<HashRedirect to="/enterprise#revenue-architecture" />} />
<Route path="/strategy-day" element={<HashRedirect to="/enterprise#signal-session" />} />
<Route path="/fractional-caio" element={<HashRedirect to="/enterprise" />} />

// External redirect
<Route path="/builder-economy" element={<ExternalRedirect to="https://www.thebuildereconomy.com" />} />

// Legacy cleanup
<Route path="/individual" element={<Navigate to="/" replace />} />
<Route path="/team" element={<Navigate to="/" replace />} />
<Route path="/builder" element={<Navigate to="/" replace />} />
<Route path="/builder-session" element={<Navigate to="/" replace />} />
<Route path="/leadership-lab" element={<Navigate to="/" replace />} />
<Route path="/portfolio-program" element={<Navigate to="/" replace />} />

<Route path="*" element={<NotFound />} />
```

### Global overlays
Mount inside `BrowserRouter` but outside `<Routes>`:
```tsx
<InitialConsultModal />
<PreCallQualifier />
<CookieConsent />
```

---

## Phase 7: Testing

### Step 21: Local test flows
Verify end-to-end:
1. Homepage loads with rotating headlines + "Book a call" CTA
2. YFork shows Cohort ($3,500) and Enterprise (from $15k) cards
3. Framework Journey animation plays
4. Operator's Edge renders with "Beyond pattern recognition" at correct scale
5. Operator's Brief teaser shows PriceTicker + rotating interpretation + compact NDM input
6. `/cohort` loads with offer detail and inquiry-only banner when `?inquiry=1:1` present
7. `/enterprise` loads with `#signal-session` and `#revenue-architecture` anchors
8. `/operator` loads with 14-agent static diagram, no scrolling logs
9. `/signal` loads full Operator's Brief dashboard with WATCH / SKIP / CALL / TAKE filter pills
10. Nervous Decision Machine returns typed response on both homepage and `/signal`
11. "Book a call" CTA opens `InitialConsultModal` from every surface
12. `PreCallQualifier` pill opens drawer, completes 3-step intake, pre-loads modal
13. `/leaders` diagnostic completes end-to-end
14. All redirects function (see Phase 6)
15. Mobile works (375px)
16. No `text-mint` on light backgrounds anywhere

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
- Analytics (Plausible) recording `operator_page_cta_clicked`

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
- [ ] Cohort dates → Supabase table (replace `Cohort.tsx` literal)

---

## Support Resources

- Lovable Docs — `docs.lovable.dev`
- Supabase Docs — `supabase.com/docs`
- Anthropic API Docs — `docs.anthropic.com`
- Tailwind Docs — `tailwindcss.com/docs`
- React Docs — `react.dev`
- Authoritative codebase reference — `CLAUDE.md` (repo root)
- Strategic brief — `project-documentation/mindmaker_rebuild_brief_v4.md`

---

**End of REPLICATION_GUIDE**
