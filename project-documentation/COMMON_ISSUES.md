# Common Issues

**Last Updated:** 2026-08-23

---

## Brand & Content Issues

### Issue: Retired product names, prices, or URLs in copy
**Symptom:** Copy anywhere that names an offer other than the Sprint, quotes any price at all, mentions a discount, or implies a geographic market.

**Cause:** The old offer ladder (The Teardown, The Handover, The Capital track) was retired in July and August 2026 and the estate is large. Anything written before 2026-08-11 is suspect on offer name, price and format.

**Fix:** The canonical fact is now much simpler:

- **One public paid offer: the 21-day Sprint**, at `/sprint`.
- **The price is not public.** It is agreed on the fit call. No figure, currency symbol or "starting at" phrasing should appear anywhere on the live site.
- **No discounts.** No credit, no percentage off, no urgency offer.
- **No geographic market claim** anywhere, including meta tags and structured data.
- **CTRL** is a Sprint deliverable, not a second offer, and is never quoted with its own price on this site.
- `src/lib/offers.ts` (the old Handover/Teardown pricing) still exists in the repo but is dormant, not imported by any routed page, and not a live price source.

The build enforces most of this. `src/test/price-single-source.test.ts` fails if a blocked price or old-offer-name pattern appears on any file in its `ACTIVE_BUYING_SURFACES` list (`Index.tsx`, `Sprint.tsx`, `CaseStudies.tsx`, `Operator.tsx`, `Contact.tsx`, `Navigation.tsx`, `Footer.tsx`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`, `index.html`).

---

### Issue: `"What's your nervous decision?"` used as a CTA button
**Symptom:** Button copy reads "What's your nervous decision?" somewhere.
**Cause:** Legacy CTA from the pre-v4 branding.
**Solution:** Replace with **"Book a fit call"**, rendered via the shared `src/components/BookFitCall.tsx` component. It links straight to Calendly (`BOOKING_URL` in `src/lib/publicLinks.ts`), opens in a new tab, and fires the `fit_call_clicked` Plausible event. There is no second booking flow, `ScopingModal`, or Diagnosis Room step in front of it; every main sales action on the site should use this one component rather than a bespoke button.

Note: the phrase "what's your nervous decision" can still appear in body copy as a diagnostic question ("What's the nervous decision you've been avoiding?"), but never as a CTA button label.

---

### Issue: Wrong Live Intel taxonomy / nav label still says "The Brief" or "Live Intel"
**Symptom:** Cards labelled SIGNAL / NOISE / DECISION / TAKE, or a nav slot reading "The Brief", "Signal Desk", or "Live Intel".
**Cause:** Stale reference to `src/pages/Brief.tsx`, an old internal page that predates the current build.
**Solution:** Mindmaker Live is now fully external, at `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL` in `src/lib/publicLinks.ts`). There is no internal Live Intel page, no `/signal` content, and no `Brief.tsx` route mounted in `src/App.tsx` — `/signal` and `/builder-economy` are both `ExternalRedirect`s straight to that domain. `Navigation.tsx` links to it only as an image pill (`mindmaker-live-pill.png`), not a text nav label, alongside the two real nav links, **"The Sprint"** (`/sprint`) and **"Results"** (`/case-studies`). `src/pages/Brief.tsx` still exists as a file but is not imported by `App.tsx` — treat it as dead code, not a page to fix taxonomy on.

---

### Issue: a retired route renders a page instead of redirecting
**Symptom:** `/cohort`, `/workshops`, `/teardown`, `/handover`, `/capital` or any other retired path shows content rather than landing on `/sprint` (or, for `/start`, `/decision`, `/signal`, `/builder-economy`, on their external destination).
**Cause:** The page component was restored from `src/_archive/` or imported into `App.tsx` directly, or the `redirects` block in `vercel.json` was edited without a matching `<Route>` in `App.tsx`.
**Solution:** Every retired path (the ~22-entry array in `src/App.tsx`, e.g. `/teardown`, `/handover`, `/capital`, `/tool`, `/workshops`, `/cohort`, `/enterprise`, etc.) is mapped to the shared `ToSprint` component (`const ToSprint = () => <Navigate to="/sprint" replace />;`). Three other routes are not "retired" but do redirect: `/start` and `/decision` go to Calendly, and `/signal` and `/builder-economy` go to `https://live.themindmaker.ai`, all four via `ExternalRedirect`; `/faq` redirects in-app to `/library?tab=questions`. `vercel.json`'s `redirects` block must agree with all of this so the real 301 (exercised only at Vercel's edge, not locally) matches the in-app fallback. `src/test/redirects.test.ts` asserts the config. `src/pages/Teardown.tsx`, `Handover.tsx` and `Capital.tsx` still exist as files in `src/pages/` but are dead code, not imported or routed by `App.tsx` — a stray import of one of them into `App.tsx` is the bug to look for. `src/_archive/` holds a separate set of retired components (see `src/_archive/README.md`); those are excluded from `tsconfig.app.json` and eslint.

---

### Issue: Floating qualifier pill or homepage Y-fork still renders
**Symptom:** The old `PreCallQualifier` floating pill or the `YFork` "Start where your question actually is." three intent cards appears on the homepage.
**Cause:** `PreCallQualifier.tsx` or `YFork.tsx` left mounted. Both are retired.
**Solution:** Both components moved to `src/_archive/components/` in August 2026 and neither is imported. The homepage funnels into the single **"Book a fit call"** action (`src/components/BookFitCall.tsx` → Calendly). `src/components/diagnosis/` (the Diagnosis Room) still exists as a file tree but is paused and unmounted, not the live conversion surface — confirm `App.tsx` and `Index.tsx` do not render it either.

---

### Issue: Builder Economy positioned as a Mindmaker product
**Symptom:** Copy says "Mindmaker arms the leaders of the Builder Economy" or similar, or links `/builder-economy` internally.
**Cause:** Pre-v4 framing.
**Solution:** Mindmaker Live has one external home, `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL` in `src/lib/publicLinks.ts`). Both `/builder-economy` and `/signal` redirect there via `ExternalRedirect` in `src/App.tsx`. There is no separate `thebuildereconomy.com` domain and no internal Resources dropdown — the nav is just "The Sprint" / "Results" plus the Mindmaker Live pill and `BookFitCall`.

---

### Issue: `/tool` page linked internally
**Symptom:** An internal link points to `/tool`.
**Cause:** `/tool` was the standalone Nervous Decision Machine page, now deleted; that page is dormant/unrouted.
**Solution:** `/tool` redirects to `/sprint` (it's in the retired-paths list in `App.tsx` and `vercel.json`). Link internally to `/sprint` directly rather than to `/tool`.

---

### Issue: Decision Readiness Diagnostic (`/leaders`) linked from nav, footer, or copy
**Symptom:** A link to `/leaders` or `/leadership-insights` appears anywhere on the live site.
**Cause:** Pre-rebuild framing, when the diagnostic was a lead-gen surface reachable by direct URL.
**Solution:** `/leaders` and `/leadership-insights` are both now in the retired-paths list in `App.tsx` and `vercel.json` and redirect to `/sprint`. There is no live diagnostic page to deep-link to; remove any link or campaign URL that still targets `/leaders`.

---

### Issue: Mint text on light backgrounds (WCAG fail)
**Symptom:** `text-mint` used on `bg-background` or any white/light surface.
**Solution:** Never `text-mint` on light. Use `text-foreground` or `text-ink` on light; `text-dark-card-*` on dark.

---

## Edge Function Issues

### Issue: Nervous Decision Machine / PriceTicker return no response or stale data
**Symptom:** The Nervous Decision Machine returns a fallback, or `PriceTicker.tsx` renders blank or old models.
**Cause:** Both surfaces are dormant. Neither the Nervous Decision Machine component nor `PriceTicker` is rendered by anything in the current live route tree in `src/App.tsx` — they back unrouted pages (`Brief.tsx`, the homepage's old `OperatorsBrief` section, etc.).
**Solution:** This is expected behaviour, not a bug, unless one of those surfaces has been deliberately remounted. If it has, check `ANTHROPIC_API_KEY` / `nervous-decision-machine` logs for the machine, and `get-model-data` logs plus `ALLOWED_MODEL_IDS` in `src/hooks/useModelData.ts` for the ticker.

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
**Symptom:** `/sprint/4-week`, `/war-room`, `/fractional-caio` etc. show 404 instead of landing on `/sprint`.
**Cause:** Redirect not configured.
**Solution:** In-app redirects are defined in `src/App.tsx`: the retired-paths array is mapped to `<Route key={path} path={path} element={<ToSprint />} />`, where `const ToSprint = () => <Navigate to="/sprint" replace />;`. `/faq` uses its own `<Navigate>` to `/library?tab=questions`. The real 301s live in `vercel.json` and only fire at Vercel's edge. If 404 still appears, verify the path is actually present in both the `App.tsx` array and `vercel.json`'s `redirects` block — a path present in only one will 404 depending on how it's reached.

---

### Issue: Builder Economy or Mindmaker Live link returns internal 404 or loops
**Symptom:** `/builder-economy` or `/signal` not redirecting externally.
**Cause:** `ExternalRedirect` component missing or misconfigured, or pointed at the wrong URL.
**Solution:** Verify `ExternalRedirect` is used and points at `MINDMAKER_LIVE_URL` from `src/lib/publicLinks.ts` (`https://live.themindmaker.ai`): `<Route path="/builder-economy" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />` and the same for `/signal`.

---

### Issue: `BookFitCall` link doesn't open Calendly correctly
**Symptom:** Clicking "Book a fit call" does nothing, opens a blank tab, or lands somewhere other than Calendly.
**Cause:** A page rendered its own ad hoc CTA instead of the shared `src/components/BookFitCall.tsx` component, or `publicLinks.ts`'s `BOOKING_URL` was edited without updating the test that pins it.
**Solution:** Every main sales action should render `<BookFitCall source="..." />`, never a bespoke `<a>` or button. It builds its `href` from `BOOKING_URL` in `src/lib/publicLinks.ts` (`https://calendly.com/krish-raja/mindmaker-meeting`) plus a `utm_source` from the `source` prop, opens in a new tab (`target="_blank" rel="noopener noreferrer"`), and fires the `fit_call_clicked` Plausible event before navigating (wrapped in try/catch so a blocked analytics script can't break the link). `src/test/price-single-source.test.ts` asserts the button text and `publicLinks.ts` URL stay in sync — check that test if the link target legitimately needs to change.

Note: `/start` and `/decision` also route to `BOOKING_URL`, but via `ExternalRedirect` in `App.tsx` (a full-page `window.location.replace`), not via `BookFitCall`. If one of those routes fails to redirect, the fix is in `App.tsx`'s `ExternalRedirect`, not the button component.

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

### No price is published anywhere
There is one public paid offer, the 21-day Sprint, and its price is agreed on the fit call, not published on the site. `src/lib/offers.ts` (the old Handover/Teardown price data) still exists in the repo but is dormant — nothing routed imports it, and it is not a live price source. The actual enforcement mechanism is `src/test/price-single-source.test.ts`, which fails the build if a blocked price pattern (a dollar figure, or an old offer name) shows up on any file in its `ACTIVE_BUYING_SURFACES` list, which includes `scripts/generate-llms.mjs` and `scripts/prerender.mjs` — so the prerendered crawler bodies and `llms.txt` are covered too, since both are generated at build time. If a price shows up on the live site, it is a regression to remove, not a figure to correct.

---

## Debugging Checklist

When investigating issues:

1. Check browser console for errors
2. Check network tab for failed requests
3. Check Lovable Cloud / Supabase logs for edge function errors
4. Verify secrets (`RESEND_API_KEY`, `LOVABLE_API_KEY`; `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` only matter if a dormant AI surface is remounted)
5. Test on mobile viewport (375px width)
6. Hard refresh to clear cache
7. Verify edge functions deployed (check timestamp, 30–60s propagation)
8. Check for TypeScript errors in build
9. Verify WCAG contrast on dark backgrounds
10. Confirm `BookFitCall` links to `BOOKING_URL` from `src/lib/publicLinks.ts` and fires `fit_call_clicked`
11. Verify no retired product names in new copy
12. Verify brand voice compliance (see `BRANDING.md`)

---

**End of COMMON_ISSUES**
