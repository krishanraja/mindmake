# Deployment Checklist

**Last Updated:** 2026-08-16

Pre-deploy and post-deploy verification for the Mindmaker project.

This checklist reflects the single-offer commercial model (the 21-day Sprint, sold via "Book a fit call") that replaced the Handover / Teardown ladder and Diagnosis Room on 2026-08-12. See root `CLAUDE.md` for the authoritative current QA checklist; this document is the deploy-specific companion to it and should not contradict it.

---

## Pre-Deploy Checklist

### 1. Build & type checks
- [ ] `npm run build` passes with no errors (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/generate-llms.mjs` → `scripts/prerender.mjs`)
- [ ] TypeScript compilation succeeds in strict mode
- [ ] `npm run lint` passes with no new problems versus the baseline recorded in `REBUILD_STATE.md`

### 2. Environment variables
Required for the **live** site (routes in `src/App.tsx` plus the standalone static pages `public/intake/index.html` and `public/testimonials/index.html`):
- [ ] `RESEND_API_KEY`. email delivery for `send-contact-email` (`/contact`) and `submit-intake` (`/intake`)
- [ ] `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY`. required by every edge function below; auto-provisioned by Lovable Cloud
- [ ] `GOOGLE_AI_API_KEY`. preferred model for `personalize-intake` (`/intake` microcopy personalisation). **Note:** the previous version of this doc named this secret `GEMINI_API_KEY`; the code (`supabase/functions/_shared/enrich/llm.ts`) reads `GOOGLE_AI_API_KEY`. Confirm the secret is provisioned under the correct name in Supabase before relying on personalisation
- [ ] `ANTHROPIC_API_KEY`. fallback model for `personalize-intake` if `GOOGLE_AI_API_KEY` is absent or fails
- [ ] `LOVABLE_API_KEY`. auto-provisioned AI gateway. Not referenced by any currently deployed edge function (`grep -rl LOVABLE_API_KEY supabase/functions/` returns nothing); keep provisioned but do not treat as a live-site blocker

Not required for the live site, still present for dormant/legacy functions and components (Diagnosis Room, `ScopingModal`, `InitialConsultModal`, `Teardown.tsx`, `Handover.tsx`, `Capital.tsx`, `Brief.tsx`, `useOpenAIContext`, `CtrlWaitlistPopover`; none are mounted in `src/App.tsx`):
- [ ] `ANTHROPIC_API_KEY` also powers `mindy-chat`, `nervous-decision-machine`, `generate-proposal` (Diagnosis Room only)
- [ ] `OPENAI_API_KEY`. used by `transcribe` (Diagnosis Room voice input) and `get-market-sentiment` (`useOpenAIContext`, an unmounted hook). Not the same purpose the previous version of this doc described ("market sentiment + lead enrichment fallback" was inaccurate: `send-lead-email` does not call OpenAI)
- [ ] `STRIPE_SECRET_KEY`. `create-consultation-hold` only, reachable solely from the Diagnosis Room fork flow. Nothing on the live site charges through it

**Ambiguity flagged, not resolved:** `enrich-company` (used live by `/intake`) also reads `BRANDFETCH_API_KEY`, `BRANDFETCH_CLIENT_ID`, `BUILTWITH_API_KEY`, `PEOPLEDATALABS_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY`, and `EXA_API_KEY` (via `_shared/enrich/*.ts`). `get-model-data` reads `ARTIFICIALANALYSIS_API_KEY`. Neither set was ever tracked in this doc's Secrets Reference, and confirming which are actually provisioned versus silently degrading was outside this pass's scope. Flagging for Krish rather than guessing at status.

### 3. Edge functions
- [ ] All functions handle OPTIONS preflight + CORS headers
- [ ] All functions return 200 on error with fallback data (anti-fragile design) where that pattern applies
- [ ] Current deployed function list matches `ls supabase/functions/` (includes `personalize-intake`, undocumented in the prior version of this file)

### 4. Frontend routes
Routes as defined in `src/App.tsx`:

**Live pages (render a page):**
- [ ] `/` (Index). Homepage
- [ ] `/sprint` (Sprint). The one public paid offer
- [ ] `/case-studies` (CaseStudies). Approved proof archive
- [ ] `/operator` (Operator). OG type is `article`
- [ ] `/blog`, `/blog/:slug`
- [ ] `/library` (Library)
- [ ] `/new-age-leadership` (NewAgeLeadership). Essay; `OrgChart` lazy-loaded
- [ ] `/contact` (Contact). General messages only, does not replace the fit call
- [ ] `/privacy`, `/terms`
- [ ] `/alumni` (Alumni). Invitation-only continuity. **MUST be `noindex` and unlinked from nav and footer.** Confirm the SEO meta tag and check `vercel.json`'s header rule for `alumni`
- [ ] `*` (NotFound)
- [ ] `/` and `/operator`: the CTRL demo (`CTRL_DEMO_VIDEO_URL` in `src/lib/publicLinks.ts`, rendered via `src/components/CtrlDemoVideo.tsx`) loads, plays muted, pauses and resumes, and fails gracefully

**Redirects, not pages** (no route in this list should render a component; verify each is a redirect, not a 404, and not a 200 render of removed content):
- [ ] `/start`, `/decision` → external, `BOOKING_URL` (Calendly) via `ExternalRedirect`
- [ ] `/signal`, `/builder-economy` → external, `MINDMAKER_LIVE_URL` (`https://live.themindmaker.ai`)
- [ ] `/teardown`, `/handover`, `/capital`, `/tool` → `/sprint`
- [ ] `/faq` → `/library?tab=questions`
- [ ] Legacy offer-ladder paths → `/sprint`: `/workshops`, `/workshops/:slug`, `/enterprise`, `/immersion`, `/cohort`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program`
- [ ] Cross-check against `vercel.json`: real 301/302s are edge-level and independent of the in-app `Navigate`/`ExternalRedirect` fallbacks. `/start` and `/decision` are `permanent: false` (302) in `vercel.json`; the rest of the redirect table is `permanent: true` (301). Confirm this split is intentional before treating every redirect as a 301

### 5. Design system compliance
- [ ] No hardcoded hex colors (use design tokens)
- [ ] No `text-mint` on white or light backgrounds (WCAG fail)
- [ ] No `text-white/80` or opacity variants on dark backgrounds, use `.dark-cta-card` or `text-dark-card-*`
- [ ] Side drawers / sheets positioned below navbar via `.sheet-navbar-aware`

### 6. Brand compliance
- [ ] Primary CTA everywhere is **"Book a fit call"**, rendered via `src/components/BookFitCall.tsx`, pointing at `BOOKING_URL` from `src/lib/publicLinks.ts`
- [ ] No Diagnosis Room, `ScopingModal`, or `InitialConsultModal` mounted anywhere in `src/App.tsx` or the live pages it routes to
- [ ] One public offer: the Sprint at `/sprint`. No Handover/Teardown/Capital offer labels on live pages. CTRL appears only as a Sprint deliverable, never a second offer
- [ ] No public price, discount, or currency switcher anywhere on the live site
- [ ] No retired offer name (Teardown, Handover, the Diagnosis Room) reachable from a live page. Legacy code may still exist under dormant pages/components (`Teardown.tsx`, `Handover.tsx`, `Capital.tsx`, `Brief.tsx`, `src/components/diagnosis/*`, `ScopingModal.tsx`, `InitialConsultModal.tsx`, `BigProblem.tsx`); treat as dormant, not current product truth, and do not link to it from a live page
- [ ] `/alumni` is not linked from nav or footer
- [ ] No floating Pre-Call Qualifier pill, no homepage Y-fork, no ChatBot (these were archived with the offer-ladder pivot)
- [ ] No em dash anywhere in public copy. `git grep -In "—"` returns nothing outside `src/_archive/`
- [ ] No unexplained business or technical term in public copy

### 7. Content verification
- [ ] No price string renders anywhere on the live site (the price is not public)
- [ ] CTRL is described as a Sprint deliverable, with no price on this site
- [ ] Testimonials render only from the consent-gated source; an uncapped or unconsented quote must not render; missing or failed consent data hides it, not a fallback default
- [ ] Attendee brands are described as attendees, not clients

### 8. SEO & LLM discoverability
- [ ] `public/sitemap.xml` regenerated by build (`scripts/generate-sitemap.mjs`)
- [ ] `public/llms.txt` regenerated by build (`scripts/generate-llms.mjs`)
- [ ] `public/robots.txt` allow-list includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- [ ] `/operator` OG type is `article`
- [ ] Prerendered output from `scripts/prerender.mjs` matches the current route tree (no prerendered HTML left over for a retired route)

---

## Post-Deploy Checklist

### 1. Health check
- [ ] Homepage loads without errors
- [ ] Navigation works (the four-choice main navigation in `src/components/Navigation.tsx`)
- [ ] `/blog`, `/library`, `/new-age-leadership`, `/operator`, and the other lazy routes render correctly
- [ ] Desktop and 390px browser checks pass: visible focus, `prefers-reduced-motion` respected, no horizontal overflow, no browser console errors

### 2. Conversion regression check
- [ ] **"Book a fit call"** opens the verified `BOOKING_URL` destination from every mount point (`BookFitCall.tsx` consumers: `Navigation.tsx`, `Footer.tsx`, `Index.tsx`, `Sprint.tsx`, `Operator.tsx`, `CaseStudies.tsx`, `Blog.tsx`, `BlogPost.tsx`, `NewAgeLeadership.tsx`, `Contact.tsx`)
- [ ] The BookFitCall click event fires (confirm the event name/contract in `src/components/BookFitCall.tsx` against whatever analytics currently consumes it)
- [ ] `/start` and `/decision` land on the Calendly `BOOKING_URL` in one hop
- [ ] `/signal` and `/builder-economy` land on `https://live.themindmaker.ai` in one hop
- [ ] Contact form on `/contact` submits and invokes `send-contact-email` successfully; this is separate from the fit-call flow and does not replace it

### 3. Edge function verification (live-reachable functions only)
- [ ] `send-contact-email`: (test env) submit `/contact`, verify receipt
- [ ] `submit-intake`, `enrich-company`, `personalize-intake`: (test env) submit `/intake`, verify receipt and that personalisation degrades cleanly to the deterministic fallback on failure
- [ ] `submit-testimonial`: (test env) submit `/testimonials`, verify persistence

### 4. Redirect check
Real 301/302s live in `vercel.json` and are only exercised by Vercel's edge, so this is a post-deploy check and cannot be done locally. If `src/test/redirects.test.ts` still exists, confirm it asserts the config; this step then confirms the edge honours it.

- [ ] Every row in the "redirects, not pages" list above resolves in one hop: 301 for the rows marked `permanent: true`, 302 for `/start` and `/decision`
- [ ] No redirect lands on a path that is itself redirected
- [ ] `/alumni` still returns 200 and is still `noindex`

### 5. Log scan
- [ ] Check Lovable Cloud logs for errors
- [ ] No 500s in edge function logs
- [ ] No Anthropic rate-limit errors from `personalize-intake`

### 6. Performance
- [ ] Page load under 3s on desktop
- [ ] No layout shift during homepage scroll
- [ ] CTRL demo video loads without flash, on both `/` and `/operator`
- [ ] No horizontal scrollbar on hero (regression check)

### 7. Accessibility
- [ ] Text contrast passes WCAG AA on every page (check dark sections especially: Hero, `/operator`)
- [ ] Focus states visible on all interactive elements
- [ ] Any scrolling/marquee-style element respects `prefers-reduced-motion`

---

## Secrets Reference

### Required for the live site
| Secret | Purpose | Provider |
|--------|---------|----------|
| `RESEND_API_KEY` | Email delivery for `send-contact-email` (`/contact`) and `submit-intake` (`/intake`) | Resend |
| `GOOGLE_AI_API_KEY` | Preferred model for `personalize-intake` (`/intake`). Previously mis-documented as `GEMINI_API_KEY`; confirm the Supabase secret is actually named `GOOGLE_AI_API_KEY` | Google AI |
| `ANTHROPIC_API_KEY` | Fallback model for `personalize-intake` | Anthropic |

### Auto-provisioned (Lovable Cloud)
| Secret | Purpose |
|--------|---------|
| `LOVABLE_API_KEY` | AI gateway. Not referenced by any function currently in `supabase/functions/`; keep provisioned, not a live-site blocker |
| `SUPABASE_URL` | Database connection |
| `SUPABASE_PUBLISHABLE_KEY` | Client API key |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key |

### Not required for the live site, present for dormant/legacy functions
| Secret | Purpose | Dormant surface |
|--------|---------|--------|
| `ANTHROPIC_API_KEY` (additional use) | `mindy-chat`, `nervous-decision-machine`, `generate-proposal` | Diagnosis Room (`src/components/diagnosis/*`), not mounted in `src/App.tsx` |
| `OPENAI_API_KEY` | `transcribe` (voice input); `get-market-sentiment` (via the unmounted `useOpenAIContext` hook) | Diagnosis Room voice input; no live mount point for market sentiment |
| `STRIPE_SECRET_KEY` | `create-consultation-hold` | Diagnosis Room booking fork only. Nothing on the live site charges through it |

### Flagged, not fully audited this pass
`enrich-company` (live, via `/intake`) and `get-model-data` (dormant, via `PriceTicker`/`LiveDecisionPreview`) read additional secrets: `BRANDFETCH_API_KEY`, `BRANDFETCH_CLIENT_ID`, `BUILTWITH_API_KEY`, `PEOPLEDATALABS_API_KEY`, `PERPLEXITY_API_KEY`, `NEWSAPI_API_KEY`, `EXA_API_KEY`, `ARTIFICIALANALYSIS_API_KEY`, none of which were ever in this table before this pass. Since `enrich-company` is live via `/intake`, its provisioning status should be confirmed with Krish rather than assumed; not resolved here to avoid guessing at what's actually configured in Supabase.

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
- **Production:** manual promote after preview verification. Stop before manual production promotion and confirm with Krish first.

---

## Contact / Support

- Lovable Cloud logs
- Supabase dashboard logs
- `COMMON_ISSUES.md` and `ARCHITECTURE.md` in this directory

---

**End of DEPLOYMENT**
