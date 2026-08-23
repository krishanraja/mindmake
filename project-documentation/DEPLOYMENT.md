# Deployment Checklist

**Last Updated:** 2026-08-23

Pre-deploy and post-deploy verification for the Mindmaker project.

---

## Pre-Deploy Checklist

### 1. Build & type checks
- [ ] `npm run build` passes with no errors (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/prerender.mjs`)
- [ ] TypeScript compilation succeeds in strict mode
- [ ] `npm run lint` passes with no warnings

### 2. Environment variables
See **Secrets Reference** below for the full breakdown. At minimum for the current route tree:
- [ ] `RESEND_API_KEY`. email delivery, required for `send-contact-email`
- [ ] `LOVABLE_API_KEY`. AI gateway (auto-provisioned)
- [ ] `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, `OPENAI_API_KEY`. only needed if a dormant AI surface (Nervous Decision Machine, Diagnosis Room, `InitialConsultModal`) is deliberately remounted
- [ ] `STRIPE_SECRET_KEY`. Optional, currently bypassed. Nothing on the site charges through it

### 3. Edge functions
- [ ] All functions handle OPTIONS preflight + CORS headers
- [ ] All functions return 200 on error with fallback data (anti-fragile design)
- [ ] `send-contact-email` (the one live edge function) works end to end

### 4. Frontend routes
All routes in `src/App.tsx` accessible (cross-check against `vercel.json`):

**Live pages:**
- [ ] `/` (Index). Homepage
- [ ] `/sprint` (Sprint). The one public paid offer, the 21-day Sprint. No public price
- [ ] `/case-studies` (CaseStudies). Approved proof archive
- [ ] `/operator` (Operator)
- [ ] `/blog`, `/blog/:slug` (Blog, BlogPost)
- [ ] `/library` (Library)
- [ ] `/new-age-leadership` (NewAgeLeadership)
- [ ] `/contact` (Contact). General messages only, does not replace the fit call
- [ ] `/privacy`, `/terms`
- [ ] `/alumni` (Alumni). Invitation-only continuity. **MUST be `noindex` and unlinked from nav and footer.** Confirm the SEO meta tag
- [ ] `*` (NotFound)

**External redirects (`ExternalRedirect`, client-side `window.location.replace`):**
- [ ] `/start` → Calendly (`BOOKING_URL` in `src/lib/publicLinks.ts`)
- [ ] `/decision` → Calendly (`BOOKING_URL`)
- [ ] `/signal` → `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL`)
- [ ] `/builder-economy` → `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL`)

**In-app redirect:**
- [ ] `/faq` → `/library?tab=questions`

**Retired routes must 301 at the Vercel edge (`vercel.json`) and not render app content:**
- [ ] `/teardown`, `/handover`, `/capital`, `/tool` → `/sprint`
- [ ] `/workshops` and `/workshops/:path*` → `/sprint`
- [ ] `/enterprise`, `/immersion`, `/cohort`, `/leaders`, `/leadership-insights` → `/sprint`
- [ ] `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio` → `/sprint`
- [ ] `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/sprint`
- [ ] Every path in the retired list is a permanent (301) redirect in `vercel.json` and also has a matching in-app `<Route ... element={<ToSprint />} />` (or `<ExternalRedirect />`/`<Navigate />` for `/start`, `/decision`, `/signal`, `/faq`, `/builder-economy`) in `src/App.tsx`, so a client-side navigation lands correctly even without hitting the edge

### 5. Design system compliance
- [ ] No hardcoded hex colors (use design tokens)
- [ ] No `text-mint` on white or light backgrounds (WCAG fail)
- [ ] No `text-white/80` or opacity variants on dark backgrounds, use `.dark-cta-card` or `text-dark-card-*`
- [ ] Side drawers / sheets positioned below navbar via `.sheet-navbar-aware`

### 6. Brand compliance
- [ ] The single main sales action everywhere is **"Book a fit call"**, rendered only via the shared `src/components/BookFitCall.tsx` (links straight to Calendly, `BOOKING_URL` in `src/lib/publicLinks.ts`; fires the `fit_call_clicked` Plausible event)
- [ ] No `ScopingModal`, no second booking flow, no sales modal or AI gate before Calendly, anywhere in the routed app
- [ ] There is one public paid offer: the 21-day Sprint at `/sprint`. No Handover / Teardown labels appear anywhere live. `CTRL` appears only as a Sprint deliverable, never as a second offer
- [ ] No retired offer name (The Handover, The Teardown) on a live buying surface. `src/test/price-single-source.test.ts` enforces this against `ACTIVE_BUYING_SURFACES`
- [ ] Nav (`Navigation.tsx`) is exactly two links, **"The Sprint"** to `/sprint` and **"Results"** to `/case-studies`, plus a Mindmaker Live pill linking externally to `https://live.themindmaker.ai` and the `BookFitCall` CTA. No dropdowns
- [ ] Mindmaker Live has one external home, `https://live.themindmaker.ai`; there is no internal `/signal` or `/builder-economy` content, both are `ExternalRedirect`
- [ ] `/alumni` is not linked from nav or footer
- [ ] The Diagnosis Room (`src/components/diagnosis/`) and the homepage AI demonstration are paused and unmounted; confirm neither renders anywhere in the routed app
- [ ] No em dash anywhere. `git grep -In "\u2014"` returns nothing
- [ ] No unexplained business or technical term in public copy
- [ ] No geographic market claim in copy, meta or structured data, and no office or location block

### 7. Content verification
- [ ] No price string appears anywhere public. The price is agreed on the fit call, not published. `src/test/price-single-source.test.ts` fails the build if a blocked price/offer pattern appears on any file in `ACTIVE_BUYING_SURFACES` (`Index.tsx`, `Sprint.tsx`, `CaseStudies.tsx`, `Operator.tsx`, `Contact.tsx`, `Navigation.tsx`, `Footer.tsx`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`, `index.html`)
- [ ] `src/lib/offers.ts` (old Handover/Teardown pricing) is dormant, not imported by any routed page, and not a live price source
- [ ] No currency switcher or currency conversion anywhere on the site
- [ ] CTRL appears as a Sprint deliverable, with no price on this site
- [ ] Testimonials render only from `publishable_testimonials`, the consent-gated Supabase view (`src/hooks/useTestimonials.ts`); missing or failed consent data hides the testimonial, it does not fall back to an unconsented quote

### 8. SEO & LLM discoverability
- [ ] `public/sitemap.xml` regenerated by build
- [ ] `public/llms.txt` present
- [ ] `public/robots.txt` allow-list includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- [ ] `/operator` OG type is `article`

---

## Post-Deploy Checklist

### 1. Health check
- [ ] Homepage loads without errors
- [ ] Navigation works (**The Sprint** / **Results** / Mindmaker Live pill / `BookFitCall`)
- [ ] `/new-age-leadership`, `/sprint` and the other lazy routes render correctly
- [ ] `/signal` and `/builder-economy` land on `https://live.themindmaker.ai`

### 2. Conversion regression check
- [ ] `BookFitCall` renders as **"Book a fit call"** everywhere it appears (nav, mobile nav, and every in-page CTA) and every instance links to the same Calendly URL (`BOOKING_URL` in `src/lib/publicLinks.ts`)
- [ ] The link opens in a new tab, carries a `utm_source` matching its `source` prop, and fires the `fit_call_clicked` Plausible event on click
- [ ] No second booking flow, sales modal, or AI gate intercepts the click before Calendly loads

### 3. Edge function verification
- [ ] `send-contact-email`: (test env) submit `/contact`, verify receipt

Most other functions under `supabase/functions/` (`nervous-decision-machine`, `get-ai-news`, `get-model-data`, `notify-scoping-request`, `notify-ctrl-waitlist`, `send-lead-email`, `send-leadership-insights-email`, the Diagnosis Room functions, etc.) back dormant, unrouted components (`Brief.tsx`, `ScopingModal.tsx`, `CtrlWaitlistPopover.tsx`, `InitialConsultModal.tsx`, the Diagnosis Room, `src/_archive/`) — none is called from anything in the live route tree in `src/App.tsx`. Nothing there needs to pass for a deploy; verify only if one of those surfaces is deliberately remounted.

### 4. Redirect check
Real 301s live in `vercel.json` and are only exercised by Vercel's edge, so this is a post-deploy check and cannot be done locally. `src/test/redirects.test.ts` asserts the config; this confirms the edge honours it.

- [ ] Every row in the retired-routes list above returns **301**, not 200 and not 302
- [ ] No redirect lands on a path that is itself redirected
- [ ] `/alumni` still returns 200 and is still `noindex`

### 5. Log scan
- [ ] Check Lovable Cloud logs for errors
- [ ] No 500s in edge function logs

### 6. Performance
- [ ] Page load under 3s on desktop
- [ ] No layout shift during homepage scroll
- [ ] Hero video loads without flash
- [ ] No horizontal scrollbar on hero (regression check)

### 7. Accessibility
- [ ] Text contrast passes WCAG AA on every page (check the dark (`bg-ink`) sections on the homepage especially: hero, the Sprint pitch section, and the closing CTA)
- [ ] Focus states visible on all interactive elements
- [ ] Reduced motion respected on every animated element on the live route tree

---

## Secrets Reference

### Required
| Secret | Purpose | Provider |
|--------|---------|----------|
| `RESEND_API_KEY` | Email delivery for `send-contact-email` (the one live edge function on the current route tree) | Resend |

### Only needed if a dormant surface is remounted
| Secret | Purpose | Provider |
|--------|---------|----------|
| `ANTHROPIC_API_KEY` | Nervous Decision Machine, Diagnosis Room (Mindy) — both dormant | Anthropic |
| `GEMINI_API_KEY` | Lead enrichment with Google Search grounding — dormant (`InitialConsultModal.tsx`) | Google AI |
| `OPENAI_API_KEY` | Market sentiment + lead enrichment fallback — dormant | OpenAI |

### Auto-provisioned (Lovable Cloud)
| Secret | Purpose |
|--------|---------|
| `LOVABLE_API_KEY` | AI gateway |
| `SUPABASE_URL` | Database connection; also read client-side by `src/hooks/useTestimonials.ts` to query the `publishable_testimonials` consent-gated view |
| `SUPABASE_PUBLISHABLE_KEY` | Client API key; same testimonials read path |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key |

### Optional
| Secret | Status |
|--------|--------|
| `STRIPE_SECRET_KEY` | Payment holds, currently bypassed. Nothing on the site charges through it |

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
