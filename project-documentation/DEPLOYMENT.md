# Rewrite pending. Contains superseded material.

Parts of this file describe earlier routes, domains, email flows or offers. Trust `project-documentation/MINDMAKE_CANON.md` and `project-documentation/REBUILD_STATE.md` first. This file is rewritten from the deployed end state at launch closure (see HANDOVER/06 outcome 1).

---

# Deployment Checklist

**Last Updated:** 2026-08-26

Pre-deploy and post-deploy verification for the Mindmake project.

## Current Mindmake release contract

The checklist below this section records the superseded 11 August Mindmaker architecture. It is retained as history and must not be used to release the current Mindmake rebuild.

- [ ] `prototypes/mindmake-judgement-thread-motion-study-v5.html` still matches SHA-256 `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`.
- [ ] The candidate 7 V2 prototype, React component and stylesheet still match the three hashes recorded in `MINDMAKE_CANON.md`. Their copy, composition and door-separation motion are unchanged.
- [ ] No public eyebrow exists outside the frozen gateway's approved `Pick your starting point` label.
- [ ] Header, wordmark and every homepage section share one measured content edge. Desktop, phone, tablet and short landscape show no clipped copy, hidden action, document-width overflow or sub-44-pixel control.
- [ ] Every scroll-linked movement explains a change in meaning, reverses with scroll and has an equally clear reduced-motion state.
- [ ] Customer outcomes, attendance proof and career testimonials appear once each and remain clearly distinguished.
- [ ] The primary action is `Start here`; there is no public diary, Calendly link or public price.
- [ ] The visitor receives a useful company read and recommendation before contact is requested.
- [ ] With `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=false`, the journey asks for no email, sends nothing and preserves the complete local download.
- [ ] The preview migration is applied and database lint, advisers, grants and private-RPC boundaries pass. Anonymous and signed-in browsers cannot read the private schema.
- [ ] The version-two Edge Function uses exact allowed origins and configured secret references, accepts only identifier fields and owns research, verification and brief assembly.
- [ ] Request, resend, changed-email, valid, invalid, expired and locked-code paths pass. Visitor and operator email successes and failures are tested independently with synthetic inboxes and retries do not duplicate a lead or message.
- [ ] Publication interest is separate and unticked, remains interest only and never creates a manual or automatic subscription.
- [ ] The retention schedule is agreed and any deletion process promised publicly is implemented and verified before the hand-off flag changes.
- [ ] Physical iOS Safari and Android Chrome checks pass, including keyboard, safe-area, download, video, VoiceOver or TalkBack and reduced-motion behaviour.
- [ ] Preview route, crawler, sitemap, accessibility, mobile, email and real HTTP 404 checks pass.
- [ ] Merge, domain change, flag enablement and production promotion each receive their own explicit approval.

---

## Historical pre-deploy checklist, superseded

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
- [ ] `STRIPE_SECRET_KEY`. Optional, currently bypassed. Nothing on the site charges through it

### 3. Edge functions
- [ ] All functions handle OPTIONS preflight + CORS headers
- [ ] All functions return 200 on error with fallback data (anti-fragile design)
- [ ] `nervous-decision-machine` rate limiter configured (1-hour per IP + global ceiling)

### 4. Frontend routes
All routes in `src/App.tsx` accessible:

**Live pages:**
- [ ] `/` (Index). Homepage
- [ ] `/start` (DiagnosisRoom). Standalone Diagnosis Room (Mindy)
- [ ] `/teardown` (Teardown). One price, currency switcher, the four-step method
- [ ] `/handover` (Handover). Three bands by headcount, currency switcher, week five, Day 90 recheck, the Teardown gate
- [ ] `/capital` (Capital). The same two engagements, per portfolio company, fund terms on the call
- [ ] Homepage and `/operator`: `/CTRL-demo-aug-26.mp4` loads, plays muted, pauses and resumes, and fails gracefully
- [ ] `/case-studies` (CaseStudies). Filterable by Teardown / Handover; consent-gated testimonials
- [ ] `/signal` (Brief). Live Intel
- [ ] `/library` (Library). Library + FAQ tab
- [ ] `/new-age-leadership` (NewAgeLeadership). Essay; `OrgChart` lazy-loaded
- [ ] `/alumni` (Alumni). Invitation-only continuity. **MUST be `noindex` and unlinked from nav and footer.** Confirm the SEO meta tag.
- [ ] `/blog`, `/blog/:slug`, `/contact`, `/privacy`, `/terms`
- [ ] `*` (NotFound)

**Retired routes must 301, not 404 and not render:**
- [ ] `/workshops` and `/workshops/:slug` → `/teardown`
- [ ] `/enterprise`, `/immersion` → `/handover`
- [ ] `/cohort`, `/leaders`, `/leadership-insights` → `/start`
- [ ] `/sprints`, `/sprint/4-week`, `/builder-sprint`, `/strategy-day` → `/teardown`
- [ ] `/sprint/90-day`, `/war-room`, `/fractional-caio` → `/handover`
- [ ] `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`
- [ ] `/faq` → `/library?tab=questions`, `/tool` → `/signal#decision`, `/builder-economy` → the external domain

### 5. Design system compliance
- [ ] No hardcoded hex colors (use design tokens)
- [ ] No `text-mint` on white or light backgrounds (WCAG fail)
- [ ] No `text-white/80` or opacity variants on dark backgrounds, use `.dark-cta-card` or `text-dark-card-*`
- [ ] Side drawers / sheets positioned below navbar via `.sheet-navbar-aware`

### 6. Brand compliance
- [ ] Primary CTA everywhere is **"Bring me one real decision"**, and it opens the Diagnosis Room via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page } }))`
- [ ] The secondary `ScopingModal` opens via `openScopingModal` from the `BigProblem` cards and `/case-studies`. The legacy `InitialConsultModal` / `openConsultModal` path is used only by `/alumni`
- [ ] Offers labelled correctly: **The Handover**, **The Teardown**. Nothing else is for sale, and the Handover is always presented first
- [ ] No retired offer name anywhere outside `DECISIONS_LOG.md` and `src/_archive/`. `npm test` enforces this for Mindy's layer
- [ ] Nav is **Work with me** (Handover, Teardown, funds), **Mindmaker LIVE** → `/signal`, **Resources**, **About**
- [ ] `/signal` labelled **"Live Intel"** on the page, **Mindmaker LIVE** in the nav (NOT "The Brief", NOT "Signal Desk")
- [ ] Taxonomy on `/signal` is **WATCH / SKIP / CALL / TAKE**
- [ ] `/alumni` is not linked from nav or footer
- [ ] No floating Pre-Call Qualifier pill, no homepage Y-fork, no ChatBot. The Diagnosis Room is the single conversion journey
- [ ] **Stripe identifiers** in `src/lib/stripe-prices.ts` hold the Alumni Pass and nothing else
- [ ] No em dash anywhere. `git grep -In "\u2014"` returns nothing
- [ ] No geographic market claim in copy, meta or structured data, and no office or location block

### 7. Content verification
- [ ] Every price interpolated from `src/lib/offers.ts`. `npm test` fails if a price string appears anywhere else
- [ ] All twelve figures correct in all three currencies on `/teardown`, `/handover` and `/capital`
- [ ] Currency switcher present on `/teardown`, `/handover` and `/capital`; the choice persists across navigation and reload
- [ ] No currency conversion anywhere. These are set prices per market
- [ ] CTRL appears as a Teardown deliverable and a product link, with no price on this site
- [ ] The retired private money disclosure is absent. This historical checklist no longer authorises publishing it
- [ ] `PriceTicker` renders and scrolls on both `/` and `/signal`
- [ ] Nervous Decision Machine returns a response on both the homepage and `/signal`
- [ ] Testimonials render only from `publishable_testimonials`, the consent-gated view

### 8. SEO & LLM discoverability
- [ ] `public/sitemap.xml` regenerated by build
- [ ] `public/llms.txt` present
- [ ] `public/robots.txt` allow-list includes GPTBot, ClaudeBot, PerplexityBot, Google-Extended
- [ ] `/operator` OG type is `article`

---

## Historical post-deploy checklist, superseded

### 1. Health check
- [ ] Homepage loads without errors
- [ ] Navigation works (Work with me / **Mindmaker LIVE** / Resources / About)
- [ ] `PriceTicker` renders and scrolls on both `/` and `/signal`
- [ ] Nervous Decision Machine returns a response on both homepage and `/signal`
- [ ] `/new-age-leadership`, `/signal` and the other lazy routes render correctly

### 2. Conversion regression check
- [ ] The "Bring me one real decision" CTA opens the Diagnosis Room (Mindy) via `openDiagnosisRoom` from the nav, hero and `SimpleCTA`; the standalone `/start` page loads the same surface
- [ ] Diagnosis Room (Mindy) diagnoses the decision and forks to three exits (keep chatting, book a fit call, generate/download a co-branded proposal); the `diagnosis_room_*` Plausible events fire
- [ ] Secondary `ScopingModal` opens from the `BigProblem` cards and `/case-studies` (legacy `InitialConsultModal` / `openConsultModal` is used only on `/alumni`)
- [ ] ScopingModal submission invokes `notify-scoping-request` (emails krish@themindmaker.ai + persists)

### 3. Edge function verification
- [ ] `nervous-decision-machine`: valid prompt returns typed JSON artefact
- [ ] `get-ai-news`: `/signal` editorial archive populates
- [ ] `get-model-data`: PriceTicker populates with canonical 7 models
- [ ] `send-lead-email`: (test env) submit lead, verify receipt
- [ ] `send-leadership-insights-email`: (test env) complete diagnostic + unlock, verify dual email
- [ ] `notify-scoping-request`: (test env) submit the ScopingModal, verify krish@themindmaker.ai receipt
- [ ] `notify-ctrl-waitlist`: (test env) join the CTRL waitlist, verify krish@themindmaker.ai receipt

### 4. Redirect check
Real 301s live in `vercel.json` and are only exercised by Vercel's edge, so this is a post-deploy check and cannot be done locally. `src/test/redirects.test.ts` asserts the config; this confirms the edge honours it.

- [ ] Every row in the retired-routes list above returns **301**, not 200 and not 302
- [ ] No redirect lands on a path that is itself redirected
- [ ] `/alumni` still returns 200 and is still `noindex`

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
