# Common Issues

**Last Updated:** 2026-02-25

---

## Brand & Content Issues

### Issue: Old Product Names in Copy
**Symptom:** References to "Builder Session", "Leadership Lab", "Portfolio Program"
**Cause:** Legacy copy not updated to new brand spec
**Solution:** Replace with current product names:
- "Builder Session" → removed (no replacement)
- "Leadership Lab" → mentioned post-engagement only, not a public product
- "Portfolio Program" → by referral only, no public page
- Use "4-Week Sprint" and "90-Day Sprint" exclusively

**Prevention:** Check all copy against BRANDING.md terminology standards

---

### Issue: Old CTA Language
**Symptom:** "Book a discovery call", "Book your session", etc.
**Cause:** Legacy CTA copy not updated
**Solution:** Primary CTA everywhere: "What's your nervous decision?"
**Supporting CTAs:** "Start the Conversation", "Start 4-Week Sprint", "Start 90-Day Sprint"

**Prevention:** Check BRANDING.md for approved CTA language

---

### Issue: Mint Text on Light Backgrounds
**Symptom:** Text using `text-mint` class on white/light backgrounds is hard to read
**Cause:** Mint (#7ef4c2) has poor contrast ratio against light backgrounds
**Solution:** Never use `text-mint` on light backgrounds. Use `text-foreground` or `text-ink` instead.

**WCAG Rule:**
```tsx
// NEVER DO THIS on light backgrounds
<div className="bg-background">
  <p className="text-mint">Can't read this</p>
</div>

// DO THIS instead
<div className="bg-background">
  <p className="text-foreground">Readable text</p>
</div>

// Mint is OK on dark backgrounds
<div className="bg-ink">
  <p className="text-mint">This is fine</p>
</div>
```

---

## Recently Fixed Issues

### FIXED: Hero Scrollbar Flash on Page Load (2026-01-08 - PERMANENT FIX)
**Symptom:** Horizontal scrollbar briefly appeared during first ~2 seconds of page load
**Root Cause:** 17 contributing factors including CSS race conditions, font loading, animation overflow, and viewport units

**Permanent Solution:** Defense-in-depth architecture with 7 overlapping prevention layers:
1. HTML-level inline CSS preventing overflow before any stylesheets load
2. New `@layer hero` that loads BEFORE base layer
3. Removed all inline `<style>` tags from component
4. `hero-decoration` class on all background elements with overflow containment
5. Removed Framer Motion `y` transforms (opacity-only animations)
6. Replaced `min-h-screen` (100vh) with `min-h-[100dvh]` for mobile
7. CSS fallback for older browsers

---

### FIXED: Side Drawer Content Cut Off (2026-01-06)
**Symptom:** "Actions" header hidden behind navbar on desktop
**Solution:** CSS variables for navbar height + `.sheet-navbar-aware` class

---

### FIXED: Text Contrast on Dark Backgrounds (2026-01-05)
**Symptom:** `text-white/80` on dark ink backgrounds failed WCAG AA
**Solution:** `.dark-cta-card` class and `text-dark-card-*` utilities

**Prevention:** Never use `text-white/80` on dark backgrounds. Use `.dark-cta-card` or `text-dark-card-*`.

---

### FIXED: Builder Profile Returns Generic Output
**Symptom:** Profile shows generic outputs instead of CEO-grade insights
**Cause:** `widgetMode: 'tryit'` triggering wrong system prompt
**Solution:** Mode detection from message content, minimal system prompt for Builder Profile

---

## Edge Function Issues

### Issue: GOOGLE_SERVICE_ACCOUNT_KEY Not Working
**Symptom:** "Ask Mindmaker" chatbot returns fallback message
**Cause:** Service account key not configured or malformed JSON
**Solution:**
1. Verify `GOOGLE_SERVICE_ACCOUNT_KEY` exists in Supabase secrets
2. Ensure value is valid JSON (not base64 encoded)
3. Check service account has Vertex AI permissions
4. Verify project ID matches: `gen-lang-client-0174430158`

---

### Issue: LOVABLE_API_KEY Not Configured
**Symptom:** AI news ticker shows only fallback headlines
**Cause:** `LOVABLE_API_KEY` not provisioned
**Solution:**
1. Verify Lovable Cloud is enabled
2. Check if `LOVABLE_API_KEY` exists in secrets
3. Try disabling and re-enabling Lovable Cloud

---

### Issue: Email Send Failures (Resend)
**Symptom:** Leads not receiving confirmation
**Cause:** Resend API failure, rate limiting, or domain not verified
**Solution:**
1. Check Resend dashboard for delivery status
2. Verify sending domain is verified
3. Check edge function logs for retry attempts

---

### Issue: Edge Function Not Found (404)
**Symptom:** `Failed to send request to Edge Function`
**Solution:** Wait 30-60 seconds after code push for deployment

---

### Issue: CORS Preflight Failure
**Symptom:** OPTIONS request returns error
**Solution:**
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

---

## Frontend Issues

### Issue: Old URLs Return 404
**Symptom:** `/builder-session`, `/leadership-lab`, `/portfolio-program` show 404
**Cause:** Pages removed but redirects not configured
**Solution:** Redirects are configured in App.tsx:
```typescript
<Route path="/builder-session" element={<Navigate to="/" replace />} />
<Route path="/leadership-lab" element={<Navigate to="/" replace />} />
<Route path="/portfolio-program" element={<Navigate to="/" replace />} />
<Route path="/builder-sprint" element={<Navigate to="/sprints" replace />} />
```
**Note:** If 404 still appears, verify these routes exist in App.tsx

---

### Issue: Modal State Persists After Navigation
**Symptom:** Modal opens automatically on page load
**Cause:** React state not cleaned up on unmount
**Solution:** Add cleanup in useEffect

---

### Issue: Hardcoded Colors Break Theme
**Symptom:** Elements don't respect design system
**Cause:** Using `bg-[#hexcode]` instead of semantic tokens
**Solution:** Use `bg-mint`, `text-ink`, etc.

---

## Design System Issues

### Issue: Poor Text Contrast on Dark Backgrounds
**Solution:**
```tsx
// NEVER on dark backgrounds
<div className="bg-ink">
  <p className="text-white/80">Hard to read</p>
</div>

// CORRECT
<div className="dark-cta-card">
  <h2>Heading is white</h2>
  <p>Body text is high-contrast off-white</p>
</div>
```

---

### Issue: Inconsistent Spacing
**Solution:** Use spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80

---

## Build Issues

### Issue: Build Fails with TypeScript Error
**Solution:**
1. Check error message for specific file/line
2. Verify imports are correct
3. Run `npm run build` locally before pushing

### Issue: Missing Dependency Error
**Solution:** `npm install [package-name] --save`

---

## Known Limitations

### No User Authentication
**Impact:** Can't track user history, save preferences
**Workaround:** Use Calendly for identity
**Future:** Implement Supabase Auth when needed

### Manual Stripe Capture
**Status:** Stripe integration paused — direct Calendly booking

---

## Debugging Checklist

When investigating issues:

1. Check browser console for errors
2. Check network tab for failed requests
3. Check Supabase/Lovable Cloud logs for edge function errors
4. Verify environment variables are set
5. Test on mobile viewport (375px width)
6. Hard refresh to clear cache
7. Verify edge functions deployed (check timestamp)
8. Check for TypeScript errors in build
9. Verify correct system prompt being used (for AI features)
10. Check Vertex AI/OpenAI quota and limits
11. Verify WCAG contrast on dark backgrounds
12. Check for CSS layer/specificity conflicts
13. Verify no old product names in new copy
14. Verify brand voice compliance (see BRANDING.md)

---

**End of COMMON_ISSUES**
