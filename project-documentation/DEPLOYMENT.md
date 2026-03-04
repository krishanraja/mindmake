# Deployment Checklist

**Last Updated:** 2026-03-03

This document outlines the pre-deploy and post-deploy verification steps for the Mindmaker project.

---

## Pre-Deploy Checklist

Run these checks before every deployment:

### 1. Build & Type Checks
- [ ] `npm run build` passes with no errors
- [ ] TypeScript compilation succeeds with no type errors
- [ ] ESLint passes with no warnings/errors

### 2. Environment Variables
- [ ] All required secrets are configured in Lovable Cloud/Supabase:
  - `GOOGLE_SERVICE_ACCOUNT_KEY` (Vertex AI RAG - required for chatbot)
  - `OPENAI_API_KEY` (market sentiment, lead enrichment)
  - `RESEND_API_KEY` (email delivery - required for lead capture)
  - `LOVABLE_API_KEY` (AI gateway for news ticker - auto-provisioned)
  - `STRIPE_SECRET_KEY` (payments - optional, currently paused)

### 3. Edge Functions
- [ ] All edge functions have CORS headers configured
- [ ] All edge functions handle OPTIONS preflight requests
- [ ] All edge functions return 200 on error with fallback data (anti-fragile design)
- [ ] Logging is present for all key branches
- [ ] Mode detection logic is correct (Builder Profile, Try It, Chat)

### 4. Database (if applicable)
- [ ] Migrations have been applied
- [ ] RLS policies are in place for all tables
- [ ] No breaking schema changes without migration

### 5. Frontend
- [ ] All routes are accessible (see route list below)
- [ ] Mobile responsive layouts verified (375px, 640px, 1024px)
- [ ] No console errors on page load
- [ ] All external links working
- [ ] No horizontal scrollbar on hero (check with hard refresh)
- [ ] Side drawers/sheets positioned below navbar
- [ ] Text contrast WCAG AA compliant on dark backgrounds

### 6. Design System Compliance
- [ ] No hardcoded colors (use tokens)
- [ ] Dark backgrounds use `.dark-cta-card` or `text-dark-card-*` utilities
- [ ] No `text-white/80` on dark backgrounds
- [ ] Critical CSS in `@layer components` (not inline styles)
- [ ] **No `text-mint` on white/light backgrounds** (critical WCAG rule)

### 7. Brand Compliance
- [ ] All CTAs say "What's your nervous decision?" (primary CTA)
- [ ] Framework language: Mind Set → Mind Map → Mind Make (everywhere)
- [ ] Product names: "4-Week Sprint" and "90-Day Sprint" (not old names)
- [ ] Chatbot branded as "Ask Mindmaker" (not "Chat with Krish")
- [ ] Diagnostic labeled "Decision Readiness Diagnostic" (not "AI Leadership Benchmark")
- [ ] No removed product references (Builder Session, Leadership Lab, Portfolio)
- [ ] Voice/tone follows anti-consultancy guidelines (see BRANDING.md)

---

## Route Verification

All these routes should be accessible:

| Route | Page | Status |
|-------|------|--------|
| `/` | Landing page | Must load |
| `/sprints` | Sprint overview | Must load |
| `/sprint/4-week` | 4-Week Sprint detail | Must load |
| `/sprint/90-day` | 90-Day Sprint detail | Must load |
| `/leaders` | Decision Readiness Diagnostic | Must load |
| `/leadership-insights` | Diagnostic (alias) | Must load |
| `/blog` | Blog listing | Must load |
| `/blog/:slug` | Blog post | Must load |
| `/builder-economy` | Thought leadership | Must load |
| `/faq` | FAQ | Must load |
| `/privacy` | Privacy policy | Must load |
| `/terms` | Terms of service | Must load |
| `/contact` | Contact | Must load |

### Redirects (Should redirect correctly)
| Old Route | Expected Redirect |
|-----------|------------------|
| `/builder-session` | `/` |
| `/leadership-lab` | `/` |
| `/portfolio-program` | `/` |
| `/builder-sprint` | `/sprints` |
| `/individual` | `/` |
| `/team` | `/` |
| `/builder` | `/` |

---

## Post-Deploy Checklist

Run these checks after every deployment:

### 1. Health Check
- [ ] Homepage loads without errors
- [ ] Navigation works (all links functional)
- [ ] "Ask Mindmaker" chatbot responds to messages
- [ ] AI news ticker displays headlines with SIGNAL/NOISE/DECISION/TAKE categories

### 2. Regression Check
- [ ] Decision Readiness Diagnostic works end-to-end
- [ ] Sprint detail pages load (4-week and 90-day)
- [ ] Sprint overview/chooser page loads
- [ ] "What's your nervous decision?" CTA opens InitialConsultModal
- [ ] Calendly booking modal opens after form submission
- [ ] Blog pages load correctly
- [ ] Homepage scroll experience flows properly (7 blocks)

### 3. Edge Function Verification
- [ ] `chat-with-krish`: Send test message, verify response
- [ ] `get-ai-news`: Check network tab for successful fetch
- [ ] `send-lead-email`: (test environment only) Submit test lead
- [ ] `send-leadership-insights-email`: (test) Complete diagnostic and unlock

### 4. Log Scan
- [ ] Check Lovable Cloud logs for any errors
- [ ] Verify no 500 errors in edge function logs
- [ ] Check for rate limiting issues
- [ ] Verify no authentication failures (Vertex AI)

### 5. Performance
- [ ] Page load under 3s on desktop
- [ ] No layout shift during scroll
- [ ] Animations smooth (60fps)
- [ ] No scrollbar flash on page load

### 6. Accessibility
- [ ] Text contrast passes WCAG AA on all pages
- [ ] Focus states visible on interactive elements
- [ ] Screen reader announces dialog content

---

## Environment Secrets Reference

### Required Secrets

| Secret | Purpose | Provider |
|--------|---------|----------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | Vertex AI RAG authentication | Google Cloud |
| `RESEND_API_KEY` | Email delivery | Resend |
| `OPENAI_API_KEY` | Market sentiment, company research | OpenAI |

### Auto-Provisioned Secrets

| Secret | Purpose | Notes |
|--------|---------|-------|
| `LOVABLE_API_KEY` | AI Gateway (news ticker) | Auto-provisioned with Lovable Cloud |
| `SUPABASE_URL` | Database connection | Auto-configured |
| `SUPABASE_PUBLISHABLE_KEY` | Client API key | Auto-configured |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin API key | Auto-configured |

### Optional Secrets

| Secret | Purpose | Status |
|--------|---------|--------|
| `STRIPE_SECRET_KEY` | Payment processing | Currently paused |

---

## Secret Configuration Guide

### Google Service Account Key
```json
{
  "type": "service_account",
  "project_id": "gen-lang-client-0174430158",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token"
}
```
- Store as raw JSON (not base64 encoded)
- Ensure service account has Vertex AI permissions
- Project ID must match: `gen-lang-client-0174430158`

### Resend API Key
- Get from: https://resend.com/api-keys
- Format: `re_...`
- Ensure sending domain is verified (not using test domain)

### OpenAI API Key
- Get from: https://platform.openai.com/api-keys
- Format: `sk-...`
- Monitor usage to avoid quota issues

---

## Rollback Procedure

If critical issues are found post-deploy:

1. **Identify the issue** via logs and console
2. **Revert to previous commit** in Lovable
3. **Verify rollback** by running post-deploy checklist
4. **Document the issue** in COMMON_ISSUES.md

---

## Deployment Schedule

- **Preview deployments**: Automatic on every code change
- **Production**: Manual review after preview verification

---

## Edge Function Deployment

Edge functions auto-deploy when code is pushed. Allow 30-60 seconds for deployment.

### Verifying Deployment
1. Check Lovable Cloud logs for deployment timestamp
2. Test function endpoint directly
3. Verify secrets are available via `Deno.env.get()`

### Troubleshooting
- If function returns 404: Wait 60 seconds, then retry
- If secrets not found: Check Supabase Dashboard → Settings → Secrets
- If CORS errors: Verify OPTIONS handler and headers

---

## Contact

For deployment issues, check:
- `project-documentation/COMMON_ISSUES.md`
- `project-documentation/ARCHITECTURE.md`
- Edge function logs in Lovable Cloud
- Supabase Dashboard logs

---

**End of DEPLOYMENT**
