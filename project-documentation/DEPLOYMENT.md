# Deployment Checklist

**Last Updated:** 2026-08-02

Pre-deploy and post-deploy verification for the Mindmaker project.

---

## Pre-Deploy Checklist

### 1. Build & type checks
- [ ] `npm run build` passes with no errors (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/prerender.mjs`)
- [ ] TypeScript compilation succeeds in strict mode
- [ ] `npm run lint` passes with no warnings
- [ ] `npm run test` (vitest) passes, incl. the `enrich-company` Dossier contract test

### 2. Environment variables
All required secrets configured in Lovable Cloud / Supabase:
- [ ] `ANTHROPIC_API_KEY`. required for the Nervous Decision Machine (Claude Haiku 4.5), Mindy's reasoning turn, and the shared Gemini→Anthropic completion fallback used by `enrich-company`, `personalize-intake`, and the unified lead pipeline's "operator's read"
- [ ] `GEMINI_API_KEY`. preferred for company enrichment (Google Search grounding), now shared in-process by `enrich-company`, `personalize-intake`, and every unified-lead-pipeline adapter (`send-lead-email`, `send-contact-email`, `send-leadership-insights-email`, `notify-scoping-request`, `notify-ctrl-waitlist`, `submit-intake`, `submit-testimonial`, `session-digest`) — not just `send-lead-email`
- [ ] `OPENAI_API_KEY`. market sentiment, lead enrichment fallback, and `get-ai-news` Plan B curation
- [ ] `PERPLEXITY_API_KEY`, `BRAVE_SEARCH_API`. `get-ai-news` Plan A / Plan B fallback chain
- [ ] `RESEND_API_KEY`. email delivery
- [ ] `STRIPE_SECRET_KEY`. optional, currently bypassed (Cohort payment runs via Maven)

### 3. Edge functions
- [ ] All functions handle OPTIONS preflight + CORS headers
- [ ] All functions return 200 on error with fallback data (anti-fragile design)
- [ ] `nervous-decision-machine` rate limiter configured (1-hour per IP + global ceiling)
- [ ] `personalize-intake` returns `{ fragments: {} }` (not an error) on missing/invalid input, so `/intake` never shows a broken personalization state
- [ ] `/intake` and `/testimonials` static forms load, submit, and (for `/intake`) run enrichment + personalization without blocking submission if either fails

### 4. Frontend routes
All routes in `src/App.tsx` accessible:

**Live pages:**
- [ ] `/` (Index). homepage
- [ ] `/workshops` (Workshops). Mindmaker Workshops index, 5 sub-pages
- [ ] `/workshops/build-your-ai-chief-of-staff`. Workshop sub-page
- [ ] `/workshops/map-your-agentic-org-chart`. Workshop sub-page
- [ ] `/workshops/vibe-coding-for-leaders`. Workshop sub-page
- [ ] `/workshops/build-an-autonomous-business-function`. Workshop sub-page
- [ ] `/workshops/give-your-ai-memory`. Workshop sub-page
- [ ] `/cohort` (Cohort). The AI-Fluent Executive ($2,500/seat, 4 weeks). "Hosted on Maven" pill + "Reserve my seat on Maven" → `https://maven.com/mindmaker/the-ai-fluent-executive`
- [ ] `/enterprise` (Enterprise). Signal Session ($15k, 1 day + 48h delivery) + Revenue Architecture ($60–100k, **30 days**)
- [ ] `/capital` (Capital). Third door for funds and operating partners
- [ ] `/case-studies` (CaseStudies). filterable, anonymised COHORT-STYLE / ENTERPRISE client proof
- [ ] `/start` (DiagnosisRoom). standalone Diagnosis Room (Mindy)
- [ ] `/operator` (Operator). v5 credential page; `/ctrl-demo-video.mp4` autoplay-loop verified
- [ ] `/signal` (Brief). Live Intel
- [ ] `/library` (Library). Library + FAQ tab
- [ ] `/immersion` (Immersion). AI Immersion ($12k, inquiry-only)
- [ ] `/alumni` (Alumni). Alumni Pass ($1,500/year, invitation-only). **MUST be `noindex` and unlinked from nav and footer.** Confirm SEO meta tag.
- [ ] `/new-age-leadership` (NewAgeLeadership). long-form thought leadership; OrgChart lazy-loaded
- [ ] `/leaders`, `/leadership-insights` (LeadershipInsights). diagnostic, unlinked from nav
- [ ] `/blog`, `/blog/:slug`. blog
- [ ] `/contact`, `/privacy`, `/terms`. support pages
- [ ] `/faq` redirects to `/library?tab=questions`

**Redirects:**
- [ ] `/tool` → `/signal#decision`
- [ ] `/builder-economy` → `https://www.thebuildereconomy.com` (external)
- [ ] `/sprints` → `/cohort`
- [ ] `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint` → `/cohort?inquiry=1:1`
- [ ] `/war-room` → `/enterprise#revenue-architecture`
- [ ] `/strategy-day` → `/enterprise#signal-session`
- [ ] `/fractional-caio` → `/enterprise`
- [ ] `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`

### 5. Design system compliance
- [ ] No hardcoded hex colors (use design tokens)
- [ ] No `text-mint` on white or light backgrounds (WCAG fail)
- [ ] No `text-white/80` or opacity variants on dark backgrounds, use `.dark-cta-card` or `text-dark-card-*`
- [ ] Side drawers / sheets positioned below navbar via `.sheet-navbar-aware`

### 6. Brand compliance
- [ ] Primary CTA everywhere is **"Book a call"** (no conditional labels, not "What's your nervous decision?")
- [ ] Cohort `/cohort` page surfaces "Hosted on Maven" pill and "Reserve my seat on Maven" CTA pointing to the canonical Maven URL
- [ ] The primary "Book a call" CTA (nav, hero, `SimpleCTA`) opens the Diagnosis Room (Mindy) via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { mode: 'express' } }))`
- [ ] The secondary `ScopingModal` opens via `window.dispatchEvent(new CustomEvent('openScopingModal'))` from the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and `/case-studies` (the legacy `InitialConsultModal` / `openConsultModal` path is used only by `/alumni`)
- [ ] Framework language: Mind Set → Mind Map → Mind Make (unchanged)
- [ ] Offers labelled correctly: **The AI-Fluent Executive (Cohort)**, **The Signal Session**, **The Revenue Architecture**, **The AI Immersion**
- [ ] No references to retired offers (4-Week Sprint, 90-Day Sprint, Builder Sprint, Leadership Lab, Portfolio Partner, Fractional CAIO)
- [ ] `/signal` labelled **"Live Intel"** in nav (NOT "The Brief", NOT "Signal Desk")
- [ ] Taxonomy on `/signal` is **WATCH / SKIP / CALL / TAKE** (not SIGNAL / NOISE / DECISION / TAKE)
- [ ] Decision Readiness Diagnostic (`/leaders`) is **not** linked from nav or footer
- [ ] `/immersion` is **not** linked from main nav (inquiry-only)
- [ ] No floating Pre-Call Qualifier pill and no homepage Y-fork render anywhere (both retired and unmounted; no ChatBot anywhere). The Diagnosis Room (Mindy) is the single conversion journey.
- [ ] **Workshops** is the first item in the nav (slot 1)
- [ ] Resources dropdown includes How I operate, Library, The Builder Economy (external), Lightning Lessons (5 Maven URLs)
- [ ] **The five Lightning Lesson URLs** match the canonical set in `LightningLessons.tsx` and the mobile menu in `Navigation.tsx`
- [ ] **The dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` does not appear anywhere** (codebase, docs, sitemap)
- [ ] **Stripe price IDs** in `src/lib/stripe-prices.ts` match the canonical set (Cohort full + 2× split, 5 Workshops, Alumni Pass)
- [ ] No "All Enterprise" link in nav or footer

### 7. Content verification
- [ ] Cohort next-cohort date and seats-remaining updated in `Cohort.tsx` `nextCohort` const (literal until Supabase `cohort_dates` wired up)
- [ ] Cohort framework is **Diagnose → Decompose → Decide → Deploy** (4 weeks)
- [ ] Cohort H1 reads **"The AI-Fluent Executive"** (NOT "The AI Decision Cohort")
- [ ] $500 workshop-credit callout (`code WORKSHOP`) appears on `/cohort` near the price card
- [ ] CTRL is listed in "What you keep" on `/cohort` and "What's included" on each `/workshops/[slug]`
- [ ] Pricing shown in context: $599 (Workshops), $2,500 (Cohort), $15,000 (Signal Session), $60,000–$100,000 (Revenue Architecture), $12,000 (Immersion), $1,500/year (Alumni Pass)
- [ ] **Revenue Architecture duration says "30 days (4–5 calendar weeks)"**. not 8–12 weeks
- [ ] **Signal Session deliverable says "Commercial Narrative, 15–20 pages, within 48 hours"**. not 5–10 pages, not 5 business days
- [ ] Payment terms rendered below each price: Cohort = "Full payment or 2× $1,250 split"; Signal Session = "Payment on kickoff"; Revenue Architecture = "50/50 at kickoff and delivery"; Immersion = "Full at booking or 50/50"
- [ ] Testimonials in `TrustSection.tsx` tagged COHORT-STYLE or ENTERPRISE
- [ ] Operator's Edge lead line matches current anti-consultant statement (top-of-file constant in `OperatorsEdge.tsx`)
- [ ] `/operator` demo video file `public/ctrl-demo-video.mp4` exists and autoplays

### 8. SEO & LLM discoverability
- [ ] `public/sitemap.xml` regenerated by build
- [ ] `public/llms.txt` present
- [ ] `public/robots.txt` allow-list includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- [ ] `/operator` OG type is `article`

---

## Post-Deploy Checklist

### 1. Health check
- [ ] Homepage loads without errors
- [ ] Navigation works (Cohort / Enterprise / **Live Intel** / Resources / About)
- [ ] `PriceTicker` renders and scrolls on both `/` and `/signal`
- [ ] Nervous Decision Machine returns a response on both homepage and `/signal`
- [ ] `/immersion` and `/new-age-leadership` lazy-load and render correctly
- [ ] `Cohort` page Maven pill and "Reserve my seat on Maven" CTA both link to `https://maven.com/mindmaker/the-ai-fluent-executive`

### 2. Conversion regression check
- [ ] "Book a call" CTA opens the Diagnosis Room (Mindy) via `openDiagnosisRoom` from the nav, hero, and `SimpleCTA`; the standalone `/start` page loads the same surface
- [ ] Diagnosis Room (Mindy) diagnoses the decision and forks to three exits (keep chatting, book a free 15-min Calendly call, generate/download a co-branded proposal); the `diagnosis_room_*` Plausible events fire
- [ ] Secondary `ScopingModal` ("Scope it with me") opens from the offer pages, the `BigProblem` cards, and `/case-studies` (legacy `InitialConsultModal` / `openConsultModal` is used only on `/alumni`)
- [ ] ScopingModal submission invokes `notify-scoping-request` (emails krish@themindmaker.ai + persists)
- [ ] Decision Readiness Diagnostic (`/leaders`) completes end-to-end; unlock form sends `send-leadership-insights-email`

### 3. Edge function verification
- [ ] `nervous-decision-machine`: valid prompt returns typed JSON artefact
- [ ] `get-ai-news`: `/signal` editorial archive populates
- [ ] `get-model-data`: PriceTicker populates with canonical 7 models
- [ ] `send-lead-email`: (test env) submit lead, verify receipt
- [ ] `send-leadership-insights-email`: (test env) complete diagnostic + unlock, verify dual email
- [ ] `notify-scoping-request`: (test env) submit the ScopingModal, verify krish@themindmaker.ai receipt
- [ ] `notify-ctrl-waitlist`: (test env) join the CTRL waitlist, verify krish@themindmaker.ai receipt

### 4. Redirect check
- [ ] `/tool` redirects to `/signal#decision`
- [ ] `/builder-economy` redirects to external `thebuildereconomy.com`
- [ ] `/sprints` redirects to `/cohort`
- [ ] `/sprint/4-week` and `/sprint/90-day` redirect to `/cohort?inquiry=1:1`, and banner surfaces
- [ ] `/war-room`, `/strategy-day`, `/fractional-caio` redirect to `/enterprise` anchors

### 5. Log scan
- [ ] Check Lovable Cloud logs for errors
- [ ] No 500s in edge function logs
- [ ] No Anthropic rate-limit errors from Nervous Decision Machine

### 6. Performance
- [ ] Page load under 3s on desktop
- [ ] No layout shift during homepage scroll
- [ ] Hero video loads without flash
- [ ] No horizontal scrollbar on hero (regression check)

### 7. Accessibility
- [ ] Text contrast passes WCAG AA on every page (check dark sections especially: Hero, Operator's Edge, SimpleCTA, `/operator`)
- [ ] Focus states visible on all interactive elements
- [ ] `PriceTicker` respects `prefers-reduced-motion`

---

## Secrets Reference

### Required
| Secret | Purpose | Provider |
|--------|---------|----------|
| `ANTHROPIC_API_KEY` | Nervous Decision Machine, Mindy's reasoning turn, shared completion fallback (`enrich-company`, `personalize-intake`, unified lead pipeline's operator's read) | Anthropic |
| `GEMINI_API_KEY` | Company enrichment synthesis with Google Search grounding (preferred), shared by `enrich-company`, `personalize-intake`, and every unified-lead-pipeline adapter | Google AI |
| `OPENAI_API_KEY` | Market sentiment, lead enrichment fallback, `transcribe` (Whisper), `get-ai-news` Plan B curation | OpenAI |
| `PERPLEXITY_API_KEY` | `get-ai-news` Plan A (primary) | Perplexity |
| `RESEND_API_KEY` | Email delivery | Resend |

### Auto-provisioned (Supabase)
| Secret | Purpose |
|--------|---------|
| `SUPABASE_URL` | Database connection |
| `SUPABASE_PUBLISHABLE_KEY` | Client API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key |

### Optional (enrichment/analysis degrades gracefully if unset)
| Secret | Status |
|--------|--------|
| `STRIPE_SECRET_KEY` | Payment holds, currently bypassed (Cohort payment runs through Maven) |
| `BRANDFETCH_API_KEY` / `BRANDFETCH_CLIENT_ID` | Company co-brand paint + `company-search` typeahead (either works) |
| `PEOPLEDATALABS_API_KEY`, `BUILTWITH_API_KEY`, `EXA_API_KEY`, `NEWSAPI_API_KEY` | Full-depth company enrichment (`enrich-company`) |
| `BRAVE_SEARCH_API` | `get-ai-news` Plan B fallback |
| `BROWSERLESS_API_KEY` | `generate-proposal` PDF rendering; falls back to client-side print on failure |
| `AUDIENCE_IMPORT_SECRET` | Gates `import-audience-csv` |

---

## Rollback Procedure

If critical issues surface post-deploy:

1. Identify via Lovable Cloud logs + browser console
2. Revert to previous commit in Lovable (or `git revert` + push)
3. Run post-deploy checklist against rolled-back version
4. Document in `COMMON_ISSUES.md`

Edge functions redeploy automatically on code push (30–60s propagation).

---

## Deployment Schedule

- **Preview deployments:** automatic on every push
- **Production:** manual promote after preview verification

---

## Contact / Support

- Lovable Cloud logs
- Supabase dashboard logs
- `COMMON_ISSUES.md` and `ARCHITECTURE.md` in this directory

---

**End of DEPLOYMENT**
