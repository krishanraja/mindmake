# Common Issues

**Last Updated:** 2026-08-09

> **Status (August 2026 overhaul):** the "check these values" list further down references the pre-August Cohort price ($2,500, now a $2,000–$3,000 range) and durations for Signal Session/Revenue Architecture, both now unsold. The primary CTA label is "Bring me one real decision" (was "Book a call"; "Book a call" still appears in body copy). See `CLAUDE.md` and `OFFERS.md` for current state before treating any specific figure below as live.

---

## Brand & Content Issues

### Issue: Retired product names, prices, or URLs in copy
**Symptom:** References to "The AI Decision Cohort" (the v6 rename moved this to "The AI-Fluent Executive"), "$3,500" Cohort price (now $2,500), "3 weeks" Cohort duration (now 4 weeks), "Name → Map → Make" Cohort framework (now Diagnose → Decompose → Decide → Deploy), the dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` (live URL is `maven.com/mindmaker/the-ai-fluent-executive`), "4-Week Sprint", "90-Day Sprint", "Builder Sprint", "Builder Session", "Leadership Lab", "Portfolio Partner", "Fractional CAIO", "Signal Desk", "Ask Mindmaker" / "Chat with Krish", `"What's your nervous decision?"` as a CTA button label, "The Brief" as a nav label, "8–12 week Revenue Architecture", or "5–10 page Signal Session thesis".

**Cause:** Legacy copy not updated to current spec.

**Solution:** Replace with current terminology:
- Cohort name → **The AI-Fluent Executive** (NOT "The AI Decision Cohort")
- Cohort price → **$2,500** (NOT $3,500). 2× split → **$1,250 × 2** (NOT $1,800 × 2)
- Cohort duration → **4 weeks** (NOT 3 weeks)
- Cohort curriculum → **Diagnose → Decompose → Decide → Deploy** (NOT Name → Map → Make)
- Maven Cohort URL → **`maven.com/mindmaker/the-ai-fluent-executive`** (NOT `maven.com/aimindmaker/ai-decision-intensive`)
- Workshops → **Mindmaker Workshops** (5 named: Build Your AI Chief of Staff · Map Your Agentic Org Chart · Vibe Coding for Leaders · Build an Autonomous Business Function · Give Your AI Memory)
- Alumni → **The Alumni Pass** ($1,500/year, invitation-only, `noindex`, unlinked from nav and footer)
- Other offers → **The Signal Session**, **The Revenue Architecture**, **The AI Immersion**
- `/signal` nav label → **Mindmaker LIVE** (rendered as a wordmark; body copy may still use "Live Intel" or "The Operator's Brief")
- Revenue Architecture duration → **30 days (4–5 calendar weeks)**, not 8–12 weeks
- Signal Session deliverable → **15–20 page Commercial Narrative within 48 hours**, not 5–10 pages within 5 days
- Primary CTA label → **"Book a call"** (everywhere, no conditional labels)
- Cohort enrolment CTA → **"Reserve my seat on Maven"** points directly at `https://maven.com/mindmaker/the-ai-fluent-executive`
- Workshop enrolment CTA → **"Enrol on Maven"** when published, **"Get notified"** while a workshop is not yet live on Maven
- Alumni CTA → **"Request an invitation"** (preselects `'alumni'` in the consult modal)
- ChatBot surface → retired; replaced by the Diagnosis Room (Mindy), the primary conversion surface (`src/components/diagnosis/`, opened via `openDiagnosisRoom`; also a standalone page at `/start`). The old `PreCallQualifier` floating pill is also retired and no longer mounted.

See `BRANDING.md` and `FEATURES.md` for the complete retired-concepts list.

---

### Issue: `"What's your nervous decision?"` used as a CTA button
**Symptom:** Button copy reads "What's your nervous decision?" somewhere.
**Cause:** Legacy CTA from the pre-v4 branding.
**Solution:** Replace with `"Book a call"`. The primary "Book a call" CTA (nav, hero, `SimpleCTA`) opens the Diagnosis Room (Mindy) via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, mode: 'express' } }))`. The secondary `ScopingModal` ("Scope it with me") opens via `window.dispatchEvent(new CustomEvent('openScopingModal'))` from the offer pages, the `BigProblem` cards, and `/case-studies`. The legacy `InitialConsultModal` / `openConsultModal` path is retained only for `/alumni`.

Note: the phrase "what's your nervous decision" can still appear in body copy as a diagnostic question ("What's the nervous decision you've been avoiding?"), but never as a CTA button label.

---

### Issue: Wrong Live Intel taxonomy
**Symptom:** Cards labelled SIGNAL / NOISE / DECISION / TAKE.
**Cause:** Old taxonomy.
**Solution:** Use WATCH / SKIP / CALL / TAKE. This is enforced in `src/pages/Brief.tsx` filter pills and card badges.

---

### Issue: Nav label still says "The Brief" or "Signal Desk"
**Symptom:** Second top-level nav slot reads "The Brief" or "Signal Desk".
**Cause:** Nav copy not updated to v4/v5 latest.
**Solution:** Nav label is **"Live Intel"** (`Navigation.tsx`). The body-copy term "The Operator's Brief" is still acceptable in editorial copy on `/signal`, but the nav label is "Live Intel".

---

### Issue: Cohort enrolment routes to consult modal instead of Maven
**Symptom:** "Reserve my seat" button on `/cohort` opens `InitialConsultModal` rather than going to Maven.
**Cause:** Maven URL constant missing or button not pointing to it.
**Solution:** The "Reserve my seat on Maven" CTA in `Cohort.tsx` should point directly to the `MAVEN_COHORT_URL` constant (`https://maven.com/mindmaker/the-ai-fluent-executive`). The "Book a call" path remains, but the primary Cohort enrolment CTA is direct-to-Maven.

---

### Issue: Floating qualifier pill or homepage Y-fork still renders
**Symptom:** The old `PreCallQualifier` floating pill or the `YFork` "Start where your question actually is." three intent cards appears on the homepage.
**Cause:** `PreCallQualifier.tsx` or `YFork.tsx` left mounted. Both are retired.
**Solution:** Neither component is imported anymore (the .tsx files remain in the tree but are not mounted). The homepage now funnels into the single Diagnosis Room (Mindy) journey. Confirm `App.tsx` and `Index.tsx` do not render `PreCallQualifier` or `YFork`. See `src/components/diagnosis/` for the live conversion surface.

---

### Issue: Builder Economy positioned as a Mindmaker product
**Symptom:** Copy says "Mindmaker arms the leaders of the Builder Economy" or similar, or links `/builder-economy` internally.
**Cause:** Pre-v4 framing.
**Solution:** Builder Economy is now a **separate sister domain** at `thebuildereconomy.com`. `/builder-economy` route redirects externally via `ExternalRedirect`. Reference it only in the Resources dropdown as "The Builder Economy (Podcast)".

---

### Issue: `/tool` page linked internally
**Symptom:** An internal link points to `/tool`.
**Cause:** `/tool` was the standalone Nervous Decision Machine page, now deleted.
**Solution:** Link to `/signal#decision` instead. The Nervous Decision Machine is now embedded on the homepage `OperatorsBrief` and on `/signal`.

---

### Issue: Decision Readiness Diagnostic linked from nav or footer
**Symptom:** A link to `/leaders` appears in `Navigation.tsx` or `Footer.tsx`.
**Cause:** Pre-v4 framing, the diagnostic was a primary lead-gen surface.
**Solution:** The diagnostic is unlinked from nav and footer by design. It's reachable only by direct URL (`/leaders` or `/leadership-insights`) for deep-link and outbound campaigns. Do not re-add to nav.

---

### Issue: Mint text on light backgrounds (WCAG fail)
**Symptom:** `text-mint` used on `bg-background` or any white/light surface.
**Solution:** Never `text-mint` on light. Use `text-foreground` or `text-ink` on light; `text-dark-card-*` on dark.

---

## Edge Function Issues

### Issue: Nervous Decision Machine returns no response
**Symptom:** `/signal` or homepage machine returns fallback or nothing.
**Cause:** Missing `ANTHROPIC_API_KEY` or rate limit hit.
**Solution:**
1. Verify `ANTHROPIC_API_KEY` set in Supabase secrets
2. Check `nervous-decision-machine` logs for 429 (per-IP rate limit is 1 hour) or global ceiling trip
3. Verify model ID `claude-haiku-4-5-20251001` still valid

---

### Issue: PriceTicker shows empty / stale data
**Symptom:** `PriceTicker.tsx` renders blank or old models.
**Cause:** `get-model-data` edge function failure or `ALLOWED_MODEL_IDS` allowlist drift.
**Solution:**
1. Check `get-model-data` logs
2. Verify `ALLOWED_MODEL_IDS` in `src/hooks/useModelData.ts` matches current canonical set (Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini)

---

### Issue: Email send failures (Resend)
**Symptom:** Leads not receiving emails, Krish not receiving notifications.
**Cause:** Resend API failure, rate limiting, or domain not verified.
**Solution:**
1. Check Resend dashboard for delivery status
2. Verify sending domain is verified (not using Resend test domain)
3. Check edge function logs for retry backoff (3 attempts)

---

### Issue: Edge function 404 after deploy
**Symptom:** "Failed to send request to Edge Function".
**Cause:** Propagation lag.
**Solution:** Wait 30–60 seconds after push.

---

### Issue: CORS preflight failure
**Solution:** Ensure OPTIONS handler returns:
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
```

---

## Frontend Issues

### Issue: Old URLs return 404
**Symptom:** `/sprint/4-week`, `/war-room`, `/fractional-caio` etc. show 404.
**Cause:** Redirect not configured.
**Solution:** Redirects are defined in `src/App.tsx` via `<HashRedirect />` and `<Navigate />`. See `ARCHITECTURE.md` for the full redirect map. If 404 still appears, verify `App.tsx` has the correct `<Route>` entry.

---

### Issue: Builder Economy link returns internal 404 or loops
**Symptom:** `/builder-economy` not redirecting externally.
**Cause:** `ExternalRedirect` component missing or misconfigured.
**Solution:** Verify `ExternalRedirect` is used: `<Route path="/builder-economy" element={<ExternalRedirect to="https://www.thebuildereconomy.com" />} />`.

---

### Issue: `ScopingModal` doesn't open from a button
**Symptom:** CTA click does nothing.
**Cause:** Button not dispatching the custom event.
**Solution:** Use `window.dispatchEvent(new CustomEvent('openScopingModal', { detail: { source_page, preselected?, qualifierAnswers? } }))`. The modal listens globally from `src/App.tsx`. (The legacy `InitialConsultModal` listens for `openConsultModal` and is now dispatched only from `/alumni`.)

---

### Issue: Diagnosis Room (Mindy) doesn't open from "Book a call"
**Symptom:** "Book a call" click does nothing, or the standalone `/start` page is blank.
**Cause:** `DiagnosisRoom` not mounted, or the button not dispatching the custom event.
**Solution:** Confirm `<DiagnosisRoom />` is mounted in `src/App.tsx` (lazy / SSG-safe) alongside the other global overlays, and that the CTA dispatches `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode: 'express' } }))`. The `/start` route renders the same surface as a standalone page.

---

### Issue: Hardcoded colors break theme
**Symptom:** Elements ignore design tokens.
**Solution:** Use `bg-mint`, `text-ink`, `border-border`, never `bg-[#7ef4c2]` or `text-[#0e1a2b]`.

---

## Design System Issues

### Issue: Poor text contrast on dark backgrounds
**Solution:**
```tsx
// NEVER
<div className="bg-ink">
  <p className="text-white/80">Hard to read</p>
</div>

// CORRECT
<div className="dark-cta-card">
  <h2>Heading is white</h2>
  <p>Body text is high-contrast off-white</p>
</div>
```

### Issue: Operator's Edge heading looks larger/smaller than FrameworkJourney
**Symptom:** Visual inconsistency between sections.
**Solution:** Exact class on both headings: `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`. Mint treatment applies only to the word "pattern" in Operator's Edge.

---

## Build Issues

### Issue: Build fails with TypeScript error
**Solution:**
1. Check error message for file/line
2. Verify imports
3. Run `npm run build` locally before pushing

### Issue: Sitemap not regenerated
**Cause:** `scripts/generate-sitemap.mjs` failed silently during `npm run build`.
**Solution:** Check build log for sitemap step. Build chain is Vite → `generate-sitemap.mjs` → `prerender.mjs`.

---

## Known Limitations

### No user authentication
No user accounts; all bookings via Calendly. No plan to change unless a client portal is built.

### Stripe authorization hold bypassed
`create-consultation-hold` exists but is not wired into the booking flow. Direct Calendly booking is live.

### Cohort date hardcoded
The next-cohort date is a literal in `Cohort.tsx`. When Supabase `cohort_dates` is wired up, replace the literal. Until then, update on each cohort release.

---

## Debugging Checklist

When investigating issues:

1. Check browser console for errors
2. Check network tab for failed requests
3. Check Lovable Cloud / Supabase logs for edge function errors
4. Verify secrets (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `RESEND_API_KEY`, `LOVABLE_API_KEY`)
5. Test on mobile viewport (375px width)
6. Hard refresh to clear cache
7. Verify edge functions deployed (check timestamp, 30–60s propagation)
8. Check for TypeScript errors in build
9. Verify correct system prompt on `nervous-decision-machine`
10. Check Anthropic / OpenAI quota + rate limits
11. Verify WCAG contrast on dark backgrounds
12. Confirm `ScopingModal` listens for `openScopingModal` custom event (the legacy `InitialConsultModal` / `openConsultModal` path is dispatched only from `/alumni`)
13. Verify no retired product names in new copy
14. Verify brand voice compliance (see `BRANDING.md`)

---

**End of COMMON_ISSUES**
