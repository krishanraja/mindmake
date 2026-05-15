# Deployment Checklist

**Last Updated:** 2026-04-26

Pre-deploy and post-deploy verification for the Mindmaker project.

---

## Pre-Deploy Checklist

### 1. Build & type checks
- [ ] `npm run build` passes with no errors (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/prerender.mjs`)
- [ ] TypeScript compilation succeeds in strict mode
- [ ] `npm run lint` passes with no warnings

### 2. Environment variables
All required secrets configured in Lovable Cloud / Supabase:
- [ ] `ANTHROPIC_API_KEY`. required for the Nervous Decision Machine (Claude Haiku 4.5)
- [ ] `GEMINI_API_KEY`. preferred for `send-lead-email` company research with Google Search grounding
- [ ] `OPENAI_API_KEY`. market sentiment + lead enrichment fallback
- [ ] `RESEND_API_KEY`. email delivery
- [ ] `LOVABLE_API_KEY`. AI gateway (auto-provisioned)
- [ ] `STRIPE_SECRET_KEY`. optional, currently bypassed (Cohort payment runs via Maven)

### 3. Edge functions
- [ ] All functions handle OPTIONS preflight + CORS headers
- [ ] All functions return 200 on error with fallback data (anti-fragile design)
- [ ] `nervous-decision-machine` rate limiter configured (1-hour per IP + global ceiling)

### 4. Frontend routes
All routes in `src/App.tsx` accessible:

**Live pages:**
- [ ] `/` (Index). homepage
- [ ] `/cohort` (Cohort). AI Decision Cohort. "Hosted on Maven" pill + "Reserve my seat on Maven" → `https://maven.com/aimindmaker/ai-decision-intensive`
- [ ] `/enterprise` (Enterprise). Signal Session ($15k, 1 day + 48h delivery) + Revenue Architecture ($60–100k, **30 days**)
- [ ] `/operator` (Operator). v5 credential page; `/ctrl-demo-video.mp4` autoplay-loop verified
- [ ] `/signal` (Brief). Live Intel
- [ ] `/immersion` (Immersion). AI Immersion ($12k, inquiry-only)
- [ ] `/new-age-leadership` (NewAgeLeadership). long-form thought leadership; OrgChart lazy-loaded
- [ ] `/leaders`, `/leadership-insights` (LeadershipInsights). diagnostic, unlinked from nav
- [ ] `/blog`, `/blog/:slug`. blog
- [ ] `/faq`, `/contact`, `/privacy`, `/terms`. support pages

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
- [ ] All other CTAs route through `InitialConsultModal` via `window.dispatchEvent(new CustomEvent('openConsultModal'))`
- [ ] Framework language: Mind Set → Mind Map → Mind Make (unchanged)
- [ ] Offers labelled correctly: **The AI Decision Cohort**, **The Signal Session**, **The Revenue Architecture**, **The AI Immersion**
- [ ] No references to retired offers (4-Week Sprint, 90-Day Sprint, Builder Sprint, Leadership Lab, Portfolio Partner, Fractional CAIO)
- [ ] `/signal` labelled **"Live Intel"** in nav (NOT "The Brief", NOT "Signal Desk")
- [ ] Taxonomy on `/signal` is **WATCH / SKIP / CALL / TAKE** (not SIGNAL / NOISE / DECISION / TAKE)
- [ ] Decision Readiness Diagnostic (`/leaders`) is **not** linked from nav or footer
- [ ] `/immersion` is **not** linked from main nav (inquiry-only)
- [ ] Pre-Call Qualifier floating pill renders on every page (no ChatBot anywhere). Confirms 3 chip-based stages: decision → timeline → stakes.
- [ ] Resources dropdown includes **New Age Leadership** at the top, then How I operate, Blog, Builder Economy (external), Lightning Lessons (4 Maven URLs)
- [ ] No "All Enterprise" link in nav or footer

### 7. Content verification
- [ ] Cohort next-cohort date and seats-remaining updated in `Cohort.tsx` `nextCohort` const (literal until Supabase `cohort_dates` wired up)
- [ ] Pricing shown in context: $3,500 (Cohort), $15,000 (Signal Session), $60,000–$100,000 (Revenue Architecture), $12,000 (Immersion)
- [ ] **Revenue Architecture duration says "30 days (4–5 calendar weeks)"**. not 8–12 weeks
- [ ] **Signal Session deliverable says "Commercial Narrative, 15–20 pages, within 48 hours"**. not 5–10 pages, not 5 business days
- [ ] Payment terms rendered below each price: Cohort = "Full payment or 2× $1,800 split"; Signal Session = "Payment on kickoff"; Revenue Architecture = "50/50 at kickoff and delivery"; Immersion = "Full at booking or 50/50"
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
- [ ] `Cohort` page Maven pill and "Reserve my seat on Maven" CTA both link to `https://maven.com/aimindmaker/ai-decision-intensive`

### 2. Conversion regression check
- [ ] "Book a call" CTA opens `InitialConsultModal` from every page
- [ ] `PreCallQualifier` floating pill opens drawer, completes 3-step intake, pre-loads modal
- [ ] Modal submission invokes `send-lead-email`; Calendly opens with pre-filled identity
- [ ] Decision Readiness Diagnostic (`/leaders`) completes end-to-end; unlock form sends `send-leadership-insights-email`

### 3. Edge function verification
- [ ] `nervous-decision-machine`: valid prompt returns typed JSON artefact
- [ ] `get-ai-news`: `/signal` editorial archive populates
- [ ] `get-model-data`: PriceTicker populates with canonical 7 models
- [ ] `send-lead-email`: (test env) submit lead, verify receipt
- [ ] `send-leadership-insights-email`: (test env) complete diagnostic + unlock, verify dual email

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
| `ANTHROPIC_API_KEY` | Nervous Decision Machine | Anthropic |
| `GEMINI_API_KEY` | Lead enrichment with Google Search grounding (preferred) | Google AI |
| `OPENAI_API_KEY` | Market sentiment + lead enrichment fallback | OpenAI |
| `RESEND_API_KEY` | Email delivery | Resend |

### Auto-provisioned (Lovable Cloud)
| Secret | Purpose |
|--------|---------|
| `LOVABLE_API_KEY` | AI gateway |
| `SUPABASE_URL` | Database connection |
| `SUPABASE_PUBLISHABLE_KEY` | Client API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key |

### Optional
| Secret | Status |
|--------|--------|
| `STRIPE_SECRET_KEY` | Payment holds, currently bypassed (Cohort payment runs through Maven) |

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
