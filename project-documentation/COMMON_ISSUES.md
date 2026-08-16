# Common Issues

**Last Updated:** 2026-08-16

---

## Brand & Content Issues

### Issue: Retired product names, prices, or URLs in copy
**Symptom:** Copy anywhere that names The Teardown, The Handover, or any other offer besides the Sprint; quotes a public price or currency conversion; mentions a discount; or implies CTRL is a second purchase.

**Cause:** The repo pivoted on 2026-08-12 from a two-offer ladder (The Handover / The Teardown, sold via the Diagnosis Room) to one public offer. Anything written before 2026-08-12 is suspect on offer name, price and CTA. See `project-documentation/DECISIONS_LOG.md` (2026-08-12 entry) and root `CLAUDE.md`.

**Fix:** The canonical commercial contract is now:

- **One public paid offer:** a focused **21-day Sprint**, at `/sprint` (`src/pages/Sprint.tsx`).
- **The price is not public.** No price, discount, currency conversion, or currency switcher may appear in live copy.
- **CTRL** is a Sprint deliverable, not a second offer. Do not quote a CTRL price or sell it as a standalone plan.
- **The Handover and The Teardown are retired.** `src/pages/Handover.tsx`, `src/pages/Teardown.tsx`, `src/pages/Capital.tsx`, and `src/components/CurrencySwitcher.tsx` still exist in the tree but are not imported by `src/App.tsx` — they are dormant, not live. Do not link to them, and do not treat their presence in the repo as evidence they're current.
- Every legacy offer route (`/teardown`, `/handover`, `/capital`, `/workshops`, `/enterprise`, `/cohort`, `/immersion`, `/leaders`, `/leadership-insights`, `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint`, `/war-room`, `/strategy-day`, `/fractional-caio`, and more) now redirects straight to `/sprint`, both at the edge (`vercel.json`) and in-app (`src/App.tsx`, the `ToSprint` fallback).

The build still enforces price hygiene: `src/test/price-single-source.test.ts` fails if a price string appears outside `src/lib/offers.ts` (which now holds only dormant legacy figures, not a public Sprint price), and `src/test/public-disclosure.test.ts` guards against other sensitive leaks. Verify against the current test suite rather than assuming the old six-rung price table still applies.

---

### Issue: Wrong CTA copy, or a CTA wired to a modal instead of the fit call
**Symptom:** A main sales action reads `"Book a call"`, `"What's your nervous decision?"`, "Scope it with me", or any other label; or a button dispatches `openDiagnosisRoom`, `openScopingModal`, or `openConsultModal`.
**Cause:** Legacy CTA/wiring from before the 2026-08-12 pivot, when the site sold two offers through the Diagnosis Room (Mindy), `ScopingModal`, and `InitialConsultModal`.
**Solution:** The one canonical CTA is **`"Book a fit call"`**, rendered by `src/components/BookFitCall.tsx`. Every main sales action across the live site (nav, hero, `/sprint`) must render `<BookFitCall />`, not a custom button. It links directly to `BOOKING_URL` from `src/lib/publicLinks.ts` (a Calendly URL) with a `?utm_source=<source>` param, opens in a new tab, and fires a `fit_call_clicked` Plausible event — it does not open any in-page modal.

**The Diagnosis Room (Mindy), `ScopingModal`, and `InitialConsultModal` are paused and unmounted.** Their components (`src/components/diagnosis/`, `src/components/ScopingModal.tsx`, `src/components/InitialConsultModal.tsx`) still exist in the tree and are still referenced from dormant pages/components (`BigProblem.tsx`, `TwoDoors.tsx`, `NewHero.tsx`, `SimpleCTA.tsx`, `ProductExpandCard.tsx`, `Teardown.tsx`, `Handover.tsx`, `Capital.tsx`), but none of those dormant components are imported by `src/pages/Index.tsx` or mounted in `src/App.tsx`, and the `openDiagnosisRoom` / `openScopingModal` / `openConsultModal` custom events have no live listener. Treat any code path that dispatches them as dead, not as a bug to route traffic through.

Note: the phrase "the nervous decision you've been avoiding" may still be fine as body copy on a dormant/archived page, but must never be the live CTA button label.

---

### Issue: `/signal` expected to render an in-app dashboard
**Symptom:** A link or test expects `/signal` to show a WATCH / SKIP / CALL / TAKE (or SIGNAL / NOISE / DECISION / TAKE) taxonomy, filter pills, or any in-app Live Intel page.
**Cause:** `/signal` used to route to `src/pages/Brief.tsx`, an in-app "Live Intel" dashboard with that card taxonomy. That routing was removed in the 2026-08-12 pivot.
**Solution:** `/signal` is now a **permanent external redirect** straight to `https://live.themindmaker.ai` (`MINDMAKER_LIVE_URL` in `src/lib/publicLinks.ts`), configured both in `vercel.json` and as an `ExternalRedirect` route in `src/App.tsx`. `/builder-economy` redirects to the same external URL. `src/pages/Brief.tsx` and its WATCH/SKIP/CALL/TAKE taxonomy still exist in the source tree but are not routed to from `App.tsx` — grep confirms the taxonomy string only appears in that dormant file and in `src/components/OperatorsBrief.tsx` (also unreferenced from any live page). Treat both as dead code, not as the current `/signal` behaviour.

---

### Issue: Nav label expected to say "Live Intel", "The Brief", or "Signal Desk"
**Symptom:** A link or test looks for a "Live Intel" (or older) text label in `Navigation.tsx`.
**Cause:** Same pre-pivot Live Intel dashboard concept.
**Solution:** The live nav (`src/components/Navigation.tsx`) has no "Live Intel" text label. It shows two text links ("The Sprint", "Results"), an image-only "Mindmaker Live" pill linking externally to `MINDMAKER_LIVE_URL`, and the `BookFitCall` button — matching root `CLAUDE.md`'s "four-choice main navigation".

---

### Issue: a retired route renders a page instead of redirecting
**Symptom:** `/cohort`, `/workshops`, `/enterprise`, `/immersion`, `/teardown`, `/handover`, `/capital`, `/leaders`, `/tool`, etc. shows content rather than landing on `/sprint`.
**Cause:** A legacy page component was wired back into a `<Route>` in `src/App.tsx`, or the `redirects` block in `vercel.json` was edited without the matching in-app fallback.
**Solution:** Both layers have to agree, and `src/test/redirects.test.ts` checks this. The real 301 lives in `vercel.json` (destination `/sprint` for internal legacy routes; the Calendly URL for `/start` and `/decision`; `https://live.themindmaker.ai` for `/signal` and `/builder-economy`) and is only exercised by Vercel's edge. The React Router entry in `src/App.tsx` is the in-app fallback — most legacy paths map to a shared `ToSprint` component (`<Navigate to="/sprint" replace />`), and it returns 200 with the SPA shell, which is expected and not the bug. `src/pages/Teardown.tsx`, `Handover.tsx`, and `Capital.tsx` still exist as files but are not referenced by any `<Route>` in `App.tsx` — they are dormant, not archived-and-excluded, so a careless re-add is a real risk. Confirm `App.tsx` before assuming a route is live.

---

### Issue: Floating qualifier pill, homepage Y-fork, or Diagnosis Room journey still renders
**Symptom:** The old `PreCallQualifier` floating pill, the `YFork` three-intent-card layout, or any Diagnosis Room (Mindy) overlay appears on the homepage.
**Cause:** A retired or paused component left mounted.
**Solution:** `PreCallQualifier.tsx` / `YFork.tsx` were archived in August 2026 and are not imported. The Diagnosis Room (`src/components/diagnosis/`) is a separate, later pause (2026-08-12): it is not archived, but it is not mounted in `src/App.tsx` or imported by `src/pages/Index.tsx` either. The homepage's only live sales action is the `BookFitCall` button — confirm `Index.tsx` and `App.tsx` render neither the old fork/pill nor the Diagnosis Room.

---

### Issue: Builder Economy positioned as a Mindmaker product, or linked to the wrong domain
**Symptom:** Copy says "Mindmaker arms the leaders of the Builder Economy" or similar, or `/builder-economy` links to `thebuildereconomy.com`.
**Cause:** Pre-pivot framing/destination.
**Solution:** `/builder-economy` now redirects to **`https://live.themindmaker.ai`** (`MINDMAKER_LIVE_URL`), the same destination as `/signal` — not to a separate `thebuildereconomy.com` domain. Verify current wording/destination against `src/lib/publicLinks.ts`, `src/App.tsx`, and `vercel.json` before writing copy about it; do not assume the old sister-domain framing still holds.

---

### Issue: `/tool` page linked internally, or expected to lead to a live decision tool
**Symptom:** An internal link points to `/tool` or `/signal#decision` expecting a working Nervous Decision Machine.
**Cause:** `/tool` was the standalone Nervous Decision Machine page; the machine was also embedded on the homepage and on the old `/signal` dashboard. Both are gone.
**Solution:** `/tool` now redirects to `/sprint` (`ToSprint` in `src/App.tsx`). The Nervous Decision Machine (`src/components/nervous-decision/`, the `OperatorsBrief` teaser, the `get-model-data`/`nervous-decision-machine` edge functions) is not imported by any live page — `Index.tsx` does not render it. Do not link to it or promise it live; if it needs to come back, that's a product decision, not a link fix.

---

### Issue: Decision Readiness Diagnostic linked from nav or footer, or expected at a direct URL
**Symptom:** A link to `/leaders` or `/leadership-insights` appears in `Navigation.tsx`/`Footer.tsx`, or is expected to render a standalone diagnostic page.
**Cause:** Pre-pivot framing, when the diagnostic was a deep-link lead-gen surface reachable by direct URL.
**Solution:** `src/pages/LeadershipInsights.tsx` no longer exists in the codebase. `/leaders` and `/leadership-insights` now redirect straight to `/sprint` (both at the `vercel.json` edge and via `ToSprint` in `src/App.tsx`). Do not re-add either as a standalone route or link to it as a diagnostic; direct visitors to `/sprint` instead.

---

### Issue: Mint text on light backgrounds (WCAG fail)
**Symptom:** `text-mint` used on `bg-background` or any white/light surface.
**Solution:** Never `text-mint` on light. Use `text-foreground` or `text-ink` on light; `text-dark-card-*` on dark.

---

## Edge Function Issues

**Note:** Both issues below concern features that are dormant on the live site as of 2026-08-12 — neither `nervous-decision/`, `PriceTicker.tsx`, nor `OperatorsBrief.tsx` (which wires them together) is imported by `src/pages/Index.tsx` or routed to from `src/App.tsx` (`/signal` is now an external redirect, not `Brief.tsx`). Treat these as backend troubleshooting for a paused feature, not as a live-site bug, unless the feature has been explicitly remounted.

### Issue: Nervous Decision Machine returns no response
**Symptom:** The (currently unmounted) machine returns fallback or nothing when exercised directly against the edge function.
**Cause:** Missing `ANTHROPIC_API_KEY` or rate limit hit.
**Solution:**
1. Verify `ANTHROPIC_API_KEY` set in Supabase secrets
2. Check `nervous-decision-machine` logs for 429 (per-IP rate limit is 1 hour) or global ceiling trip
3. Verify the configured model ID is still valid

---

### Issue: PriceTicker shows empty / stale data
**Symptom:** `PriceTicker.tsx` renders blank or old models (only reachable today via dormant `OperatorsBrief.tsx` / `Brief.tsx`, not the live site).
**Cause:** `get-model-data` edge function failure or `ALLOWED_MODEL_IDS` allowlist drift.
**Solution:**
1. Check `get-model-data` logs
2. Verify `ALLOWED_MODEL_IDS` in `src/hooks/useModelData.ts` matches the current canonical model set

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
**Solution:** Redirects are defined in `src/App.tsx` — most legacy paths map through the shared `ToSprint` component (`<Navigate to="/sprint" replace />`); `/start`, `/decision`, `/signal`, and `/builder-economy` use `ExternalRedirect` instead. There is no `HashRedirect` component in the current tree — if you find a stale reference to one, it predates the 2026-08-12 pivot. If 404 still appears, verify `App.tsx` has the correct `<Route>` entry, and cross-check `vercel.json`.

---

### Issue: Builder Economy link returns internal 404 or loops
**Symptom:** `/builder-economy` not redirecting externally.
**Cause:** `ExternalRedirect` component missing or misconfigured.
**Solution:** Verify `src/App.tsx` has `<Route path="/builder-economy" element={<ExternalRedirect to={MINDMAKER_LIVE_URL} />} />` (destination `https://live.themindmaker.ai`, imported from `src/lib/publicLinks.ts` — not `thebuildereconomy.com`).

---

### Issue: `ScopingModal` expected to open from a button
**Symptom:** A CTA is expected to dispatch `openScopingModal` and open a modal, but nothing happens.
**Cause:** `ScopingModal` is paused as of 2026-08-12. `src/App.tsx` does not mount `<ScopingModal />` (or `<InitialConsultModal />`) as a global overlay, so no listener exists for `openScopingModal` or `openConsultModal` anywhere in the live app.
**Solution:** This is expected, not a bug. The only live sales action is `BookFitCall` (a plain link, no event dispatch). If a scoping/consult flow needs to come back, that is a product decision requiring the components to be remounted in `App.tsx`, not a wiring fix.

---

### Issue: "Book a fit call" doesn't open a modal, or `/start` doesn't render a page
**Symptom:** Clicking "Book a fit call" doesn't open an in-page Diagnosis Room, or navigating to `/start` shows a redirect instead of a page.
**Cause:** Expecting pre-pivot behaviour. Both are correct as designed post-2026-08-12.
**Solution:** `BookFitCall` (`src/components/BookFitCall.tsx`) is a plain `<a>` tag that opens `BOOKING_URL` (Calendly, from `src/lib/publicLinks.ts`) in a new tab — it does not dispatch any event or open a modal. `DiagnosisRoom` is not mounted in `src/App.tsx`. `/start` and `/decision` are both `ExternalRedirect`s straight to `BOOKING_URL`, not routes that render a page component; that's expected, not a blank-page bug.

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

### Prices live in exactly one file, and the Sprint has none there
`src/lib/offers.ts` is the only place a price may appear, and `src/test/price-single-source.test.ts` fails the build if a figure shows up anywhere in `src/`, `public/`, `scripts/` or `index.html`. That includes the prerendered crawler bodies and `llms.txt`, both of which are generated from it at build time. As of 2026-08-12 the live Sprint offer has **no public price at all** — `offers.ts` still holds the dormant legacy Teardown/Handover figures used only by the unmounted `Teardown.tsx`/`Handover.tsx` pages. Do not add a Sprint price to `offers.ts` (or anywhere else) without an explicit product decision to make pricing public; if a price looks wrong on the live site, the fix is almost always to remove it, not to update a figure.

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
9. If touching the dormant Nervous Decision Machine, verify its system prompt in `nervous-decision-machine` still matches current positioning before any future remount
10. Check Anthropic / OpenAI quota + rate limits
11. Verify WCAG contrast on dark backgrounds
12. Confirm every main sales action renders `<BookFitCall />` and not a dispatch of `openDiagnosisRoom` / `openScopingModal` / `openConsultModal`
13. Verify no retired offer names (The Handover, The Teardown), public prices, or currency switching in new copy
14. Verify brand voice compliance (see `BRANDING.md`)

---

**End of COMMON_ISSUES**
