# Features

**Last Updated:** 2026-08-16

---

## Product Offering

Mindmaker is a one-person commercial decision practice with **one public paid offer**: the 21-day Sprint at `/sprint`. There is no published price. The engagement is bought through a fit call, never self-serve.

**Buyer:** a founder, CEO, CRO or strategy leader with a stuck product, price, go-to-market or company decision as AI changes their market.

**What happens:** Krish does the research, challenge, modelling and coordination; the client gives decisions and introductions. There is no fixed workshop plan — the decision sets the work. Four stated steps on `/sprint`: find what is really stuck, challenge the choices, make the call, start the first real action.

**What the client leaves with:** the decision made and the trade-offs written down, the evidence and reasoning kept in a private CTRL workspace, the first material action already under way, and a clearer way to make the next decision. It is explicitly not a deck.

**Fit / not-fit**, stated on `/sprint`:
- Good fit: the decision affects revenue, product or the shape of the company; AI has changed the facts; a senior leader can decide and open doors; the business wants a fixed end date, not a retainer.
- Not a fit: general AI training or a certificate, a fractional executive role or open retainer, production IT work or a list of automations, or a deck that makes a decision look finished without starting the work.

**CTRL by Mindmaker** is the living Sprint deliverable (a private workspace holding the business context, decision, evidence and reasoning), not a second product and not sold separately. It has its own repository and is out of scope for this website rebuild.

This is a full pivot from a prior two-offer ladder (The Handover / The Teardown) sold via an on-site AI chat overlay ("the Diagnosis Room" / Mindy). That model was retired 2026-08-12 — see `project-documentation/DECISIONS_LOG.md`, entry "2026-08-12: One 21-day Sprint and one fit-call path". See "Dormant and paused code" below for what that retirement left behind in the repository.

---

## Retired offer routes (do not reference as live)

Every route below is a real 301 in `vercel.json`, with a matching client-side fallback (`<Route ... element={<ToSprint />} />` or a redirect component) in `src/App.tsx`. The retired page components (`Teardown.tsx`, `Handover.tsx`, `Capital.tsx`, and others already moved to `src/_archive/`) still exist in the repository but are not reachable through routing.

| Retired route | Redirects to |
|---|---|
| `/teardown`, `/handover`, `/capital` | `/sprint` |
| `/workshops` and `/workshops/:slug` | `/sprint` |
| `/enterprise`, `/immersion`, `/cohort` | `/sprint` |
| `/leaders`, `/leadership-insights` | `/sprint` |
| `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint` | `/sprint` |
| `/war-room`, `/strategy-day`, `/fractional-caio` | `/sprint` |
| `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` | `/sprint` |
| `/tool` | `/sprint` |
| `/start`, `/decision` | the Calendly booking URL (temporary redirect, not permanent) |
| `/signal`, `/builder-economy` | `https://live.themindmaker.ai` (permanent) |
| `/faq` | `/library?tab=questions` (permanent) |

The offer names behind the retired routes are deliberately not the current commercial story. `DECISIONS_LOG.md` holds the record. The only current paid engagement is the Sprint.

`/alumni` is **not** retired — it is a live route, noindex, invitation-framed, and not linked from the primary nav or footer (see below).

---

## Website Features

### Homepage (`/`)

Authoritative: `src/pages/Index.tsx`. It hand-rolls its sections directly (no `NewHero` / `BigProblem` / `TrustSection` / `FrameworkJourney` / `OperatorsEdge` / `OperatorsBrief` / `MindMakerLiveSection` / `SimpleCTA` composition — that older component set is not imported here). Current order:

1. **Hero.** Ink background, looping `/rising-cities.mp4` at low opacity, eyebrow "Krish Raja's commercial decision practice", H1 "Make the right call as AI changes your business." Primary CTA is `BookFitCall` (`source="homepage-hero"`) plus a secondary text link "See the 21-day Sprint" to `/sprint`. A stat card claims "17+ years in data, technology and product strategy."
2. **Reach / attendee-brand strip** (`aria-labelledby="reach-title"`). H2 "Mindmaker has helped over 4000 leaders with what's next in AI." followed by "Attended by people from organisations including" and a 3-logo grid from `attendeeBrands` in `src/data/rebuildProof.ts` (BBC, Hearst, Condé Nast — the homepage subset of the 16 approved attendance brands in `BRANDS_AND_TESTIMONIALS.md`).
3. **"When to call Mindmaker"** (`id="call-title"`). Two editorial cards: faster startups taking the market, and being able to grow but something holding the business back.
4. **Sprint section** (`id="sprint-title"`, `id="work-with-me"`). Eyebrow "One paid offer", H2 "One decision. 21 days." A `decisions` grid (Product / Price / Go to market / Company), a `BookFitCall` (`source="homepage-sprint"`), a 3-item outcome list, and a link to `/sprint`.
5. **CTRL section** (`id="ctrl-title"`). `CtrlDemoVideo` component, H2 "You keep the thinking, not just the answer." Two bullet points (see the whole decision / keep your judgement). Conditionally shows a Steph Darmanin quote gated by `useTestimonials()` consent (see "Proof" below).
6. **Client results** (`id="results-title"`). H2 "Decisions that changed the work.", a horizontally-scrolling strip of the first 4 stories from `clientStories` (`src/data/rebuildProof.ts`), and a link to `/case-studies` ("See all eight stories").
7. **Krish bio section** (`id="krish-title"`). Headshot, H2 "Built in business, not in a slide deck.", two paragraphs of bio copy, and a named career-reference quote from Ashley Wales-Brown.
8. **Final CTA.** H2 "One hard decision. / One clear place to start.", `BookFitCall` (`source="homepage-final"`).
9. **Footer.**

### Navigation

File: `src/components/Navigation.tsx`. A flat **4-choice nav**, no dropdowns:
- **The Sprint** → `/sprint`
- **Results** → `/case-studies`
- **Mindmaker LIVE** → external link (`MINDMAKER_LIVE_URL`, opens in a new tab, rendered as an image pill, not text)
- **Book a fit call** → `BookFitCall` (`source="navigation"` desktop, `source="mobile-navigation"` in the mobile menu)

Also carries a light/dark theme toggle. Hides on scroll-down via `useScrollDirection`. The mobile menu repeats the same three links plus the CTA.

`src/components/Footer.tsx` groups links as: **Work** (The Sprint, Results, How I operate), **Read** (Mindmaker Live, Library, Articles, New Age Leadership), **Company** (Contact, Privacy, Terms), plus a `BookFitCall` (`source="footer"`).

### Booking flow

There is exactly one sales action across the live site: **"Book a fit call"**, rendered everywhere by the shared `src/components/BookFitCall.tsx` component. It links to `BOOKING_URL` from `src/lib/publicLinks.ts` (`https://calendly.com/krish-raja/mindmaker-meeting`) with a `?utm_source=<source>` query param identifying the call site, opens in a new tab, and fires a `fit_call_clicked` Plausible event with the source in `props`. If `window.plausible` is unavailable the click still opens the booking link (analytics failure never blocks booking).

`source` values seen in the live route tree: `homepage-hero`, `homepage-sprint`, `homepage-final`, `navigation`, `mobile-navigation`, `footer`, `sprint-hero`, `sprint-final`, `case-studies-final`, `operator-final`, `contact-card`, `contact-success`.

There is no modal, no in-page booking widget, and no AI gate in front of the calendar. `/contact` (see below) is a separate general-message form that explicitly tells the visitor to use the fit call instead if they want to talk about the Sprint. `/alumni` links straight to `BOOKING_URL` with its own UTM tag, not through `BookFitCall`.

---

## Live pages

### The Sprint (`/sprint`)

`src/pages/Sprint.tsx`. H1 "One hard business decision. Settled in 21 days." Sections: hero with a "What you bring" side card, a 4-step "How the 21 days work" grid (find what is stuck / challenge the choices / make the call / start the first real action), a "What you leave with" 4-item list, a two-column "A good fit" / "Not a good fit" card, and a final CTA. Three `BookFitCall` instances (`sprint-hero`, `sprint-final`, plus the nav/footer ones). No price, no currency switcher, no structured-data offer object was found in the file as read.

### Client results (`/case-studies`)

`src/pages/CaseStudies.tsx`. H1 "The decision, and what changed next." Renders all 8 `clientStories` from `src/data/rebuildProof.ts` as cards (title, outcome, quote, attribution), an `ItemList` JSON-LD naming the 8 stories, a conditionally-shown full-width Steph Darmanin quote (same consent gate as the homepage), a "Career references, not client results" section rendering `careerReferences` (6 named references), and a final CTA (`case-studies-final`). Copy is explicit that clients stay anonymous and attendee brands are proof, not client claims.

### How I operate (`/operator`)

`src/pages/Operator.tsx`. Typography-led credential page. H1 "How Mindmaker works behind the scenes." Sections: hero with headshot and "Most advisors sell frameworks they read. I run the frameworks I sell."; a thesis section next to `CtrlDemoVideo`; a static 5-group, 14-agent typography diagram (`agentGroups` — Business development: Zara/Kai/Nero; Content: Maya/Ravi/Theo; Revenue: Sol/June; Operations: Marcus/Iris/Otto; Monitoring: Ash/Lin/Noor); four numbered "extractable lessons"; an auto-advancing (3.5s, pause-on-hover) stage-photo carousel built on the shared `Carousel` UI primitive (not a bespoke effect); and a commercial-crossover CTA (`operator-final`) into the Sprint. `SEO` uses `ogType="article"`.

### Contact (`/contact`)

`src/pages/Contact.tsx`. General-message form only — explicitly not a booking flow ("Use the form for a general message. If you want to talk about the Sprint, book a fit call instead."). Submits `{ name, email, message, company?, role? }` to the `send-contact-email` edge function via `supabase.functions.invoke`. Two `BookFitCall` instances (`contact-card`, `contact-success`) sit alongside the form as the recommended path for Sprint conversations. A code comment records that a "Global Offices" block (Brooklyn/London/Sydney) was removed 2026-08-11 as a false claim — Mindmaker has no physical offices.

### Alumni (`/alumni`)

`src/pages/Alumni.tsx`. `noindex`. Framed as an "Alumni Pass" continuity offer (workshop re-attendance, a quarterly memo, an alumni Slack, cohort first-refusal, lifetime CTRL access) for people who have already completed a Mindmaker engagement. Its only CTA is "Request an invitation", linking directly to `BOOKING_URL` with its own `?utm_source=alumni` tag — **not** through `BookFitCall` and **not** through any modal. A code comment records that Stripe billing for this pass is configured (`src/lib/stripe-prices.ts`, `STRIPE_PRODUCTS.alumniPass`) but live checkout from this page is not shipped; Krish sends a Stripe Payment Link out of band after confirming eligibility. `vercel.json` marks `/alumni` `noindex, nofollow` alongside `/testimonials` and `/intake`.

### Blog (`/blog`, `/blog/:slug`)

Listing with featured posts and individual post pages with SEO metadata. Not re-verified line-by-line in this pass beyond confirming the routes are live in `src/App.tsx`.

### Library, New Age Leadership, Privacy, Terms

Live routes (`/library`, `/new-age-leadership`, `/privacy`, `/terms`). Not re-verified line-by-line in this pass; flagging here rather than repeating the prior doc's (now-unverifiable) structural claims about them, since the instructions for this pass named a specific file list to check and these were not on it.

### Static noindex forms outside the SPA route tree

Two static HTML pages are rewritten in via `vercel.json` (`/testimonials` → `/testimonials/index.html`, `/intake` → `/intake/index.html`) and marked `noindex, nofollow`. They are not React routes and not linked from the live nav:
- **`/intake`**: a pre-session intake form. Posts to `submit-intake`. Also calls `enrich-company` (company dossier) and the new `personalize-intake` function (see below) for optional AI-personalised microcopy, with a deterministic fallback if either call fails or returns nothing.
- **`/testimonials`**: a public testimonial-submission form posting to `submit-testimonial`.

These are reachable by direct URL and technically live, but are not part of the marketing funnel described above.

---

## Proof

Canonical source: `project-documentation/BRANDS_AND_TESTIMONIALS.md`, consumed in code via `src/data/rebuildProof.ts` (exports `attendeeBrands`, `clientStories`, `careerReferences`). **`src/data/caseStudies.ts` and `src/components/proof/CaseStudyCard.tsx` were deleted** in commit `cda3c70` and must not be referenced as current.

- **8 verified client outcome stories**, anonymised to role + sector (e.g. "CRO, media company"), used in full on `/case-studies` and as the first 4 on the homepage.
- **16 approved attendee brands** total (Walmart, PepsiCo, P&G, BMW, Boeing, Pfizer, Visa, American Express, Goldman Sachs, Deloitte, PwC, L'Oréal, Adidas, BBC, Hearst, Condé Nast); **3 shown on the homepage** (BBC, Hearst, Condé Nast). These are attendance proof, never described as clients.
- **6 named career references**, used on `/case-studies` and one (Ashley Wales-Brown) on the homepage bio section.
- **Steph Darmanin quotes** are consent-gated at runtime: `useTestimonials()` (`src/hooks/useTestimonials.ts`) reads a `publishable_testimonials` Supabase view (only rows with `permission = 'free'`), and the homepage / case-studies pages only render her quote if a consented row matches "legacy ascend" in company or role. Missing, private, or errored consent data hides the quote entirely — it never renders unconditionally.

---

## Dormant and paused code (not live, do not describe as current)

The following remain in the repository as unmounted or unrouted files, not moved to `src/_archive/`. Confirmed by reading `src/App.tsx`: none of them are imported there, and grepping the live page/component set (`Index.tsx`, `Sprint.tsx`, `CaseStudies.tsx`, `Operator.tsx`, `Navigation.tsx`, `Footer.tsx`, `Contact.tsx`, `Alumni.tsx`) turns up no dispatch of `openDiagnosisRoom`, `openScopingModal`, or `openConsultModal`.

- **The Diagnosis Room (Mindy)** — `src/components/diagnosis/*` (`DiagnosisRoom`, `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar`, `CompanyField`, `BrushPainter`, `logoLuminance.ts`, `useDiagnosisSession`), plus `ScopingModal.tsx` and `InitialConsultModal.tsx`. Per `DECISIONS_LOG.md`, this and the homepage AI demonstration are explicitly **paused**, not deleted.
- **Homepage components no longer composed into `Index.tsx`**: `NewHero.tsx`, `BigProblem.tsx`, `TwoDoors.tsx`, `SimpleCTA.tsx`, `ProductExpandCard.tsx`.
- **Retired offer pages**: `src/pages/Teardown.tsx`, `Handover.tsx`, `Capital.tsx` (all now 301 to `/sprint`).
- **`src/pages/Brief.tsx`** — the old "Live Intel" dashboard. `/signal` no longer routes to it; `/signal` now permanently redirects off-site to `https://live.themindmaker.ai`.
- **`src/lib/offers.ts`, `CurrencySwitcher.tsx`, `CurrencyContext.tsx`, `stripe-prices.ts`** — legacy pricing/currency infrastructure, referenced only by the dormant offer pages (and `Alumni.tsx`'s dormant Stripe product config for the alumni pass) and their own tests. Not used by any live public page's price display, since no live page shows a public price.
- **`CtrlWaitlistPopover.tsx`** — only referenced from the archived `src/_archive/components/YFork.tsx`, not from any live component.
- **`useOpenAIContext.ts` / `useRealisticCounters.ts`** — only reference each other; not imported by any live page or component.

---

## Edge functions

From `ls supabase/functions/`: `_shared`, `company-search`, `create-consultation-hold`, `enrich-company`, `generate-proposal`, `get-ai-news`, `get-market-sentiment`, `get-model-data`, `import-audience-csv`, `mindy-chat`, `nervous-decision-machine`, `notify-ctrl-waitlist`, `notify-scoping-request`, `personalize-intake`, `send-contact-email`, `send-lead-email`, `send-leadership-insights-email`, `session-digest`, `submit-intake`, `submit-testimonial`, `transcribe`. All remain deployed; deployment status is not the same as being called from a live surface.

**Called from the live route tree:**
- `send-contact-email` — from `Contact.tsx`'s form.
- `submit-intake` and `personalize-intake` — from the static `/intake` form (`public/intake/index.html`). `personalize-intake` is new since the last FEATURES.md pass: given a "safe" company dossier (never the internal `dossier.scale.*` routing fields) and the visitor's seat, it asks an LLM for two short, voice-linted microcopy fragments (`business_reflect`, `aspiration_nudge`) for the intake form, with strict anti-fabrication rules and a deterministic-fallback (`{ fragments: {} }`) on any missing input, timeout, or off-voice output. It reuses `_shared/enrich/llm.ts` and `_shared/mindy/voice-lint.ts`.
- `submit-testimonial` — from the static `/testimonials` form.
- `enrich-company` — also called from the static `/intake` form (company dossier used to power `personalize-intake`), independent of the paused Diagnosis Room's own use of it.

**Not verified as called from any live page in this pass, and grepped as dormant** (only referenced from paused/archived components, `_archive/`, or nothing at all): `mindy-chat`, `generate-proposal`, `session-digest`, `transcribe`, `company-search`, `nervous-decision-machine`, `create-consultation-hold` (Diagnosis Room stack); `get-ai-news`, `get-model-data` (old Live Intel dashboard, `Brief.tsx`); `notify-scoping-request` (`ScopingModal`); `notify-ctrl-waitlist` (`CtrlWaitlistPopover`, itself only used by the archived `YFork.tsx`); `send-lead-email` (`InitialConsultModal` / `emailNotification.ts`, not imported by any live page); `get-market-sentiment` (`useOpenAIContext` → `useRealisticCounters`, not imported by any live page); `import-audience-csv` (Substack CSV import, no live-page caller found — likely operated out of band, not verified).

`send-leadership-insights-email` — referenced from `src/_archive/pages/LeadershipInsights.tsx` only; the live `/leadership-insights` route now 301s to `/sprint`. Treat as dormant, though not independently re-checked for other callers beyond the grep above.

---

## SEO and LLM Discoverability

- Meta + Open Graph on all pages via `src/components/SEO.tsx`; `ogType="article"` set on `/operator`.
- `scripts/generate-sitemap.mjs` runs at build time and is already reconciled to the pivot: it lists `/`, `/sprint`, `/operator`, `/case-studies`, `/new-age-leadership`, `/blog`, `/library`, `/contact`, `/privacy`, `/terms` plus blog slugs, and its own comments explicitly exclude `/alumni` (invitation-only, noindex) and note that the old offer/workshop routes are now 301s and do not belong in a sitemap.
- `public/llms.txt` is already reconciled to the pivot: it describes the Sprint, CTRL, the 8 client-result stories, `/operator`, Mindmaker Live, and the fit-call booking link — no mention of the old ladder.
- `public/robots.txt` still contains explicit `Allow:` lines for `/cohort`, `/enterprise`, `/leaders`, `/faq` — all now-retired or redirected routes. This is very likely stale (harmless in effect, since the blanket `Allow: /` already covers everything, and Google honours the redirect regardless) but it was **not** reconciled as part of the 2026-08-12 pivot and is worth a deliberate look, not a guess, before calling SEO fully caught up. Flagging rather than silently correcting since this file is outside the docs-only scope of this pass.
- `public/robots.txt` explicitly allow-lists GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, and CCBot.

---

## Design System

See `DESIGN_SYSTEM.md` and `VISUAL_GUIDELINES.md`. Unchanged by the 2026-08-12 pivot.

Key points:
- **Ink** `#0e1a2b` + **Emerald** `#00D9B6` (HSL `171 100% 43%`) — the two-colour system. The signature accent moved from mint to portfolio emerald on 2026-06-29 for cross-product cohesion (Mindmaker + CTRL + Make Your Mind Up); legacy `mint` tokens/classes are retained as aliases to emerald (prefer `emerald*` in new code). WHY + WCAG proof: `prototypes/brand-emerald-proof.{html,md}`.
- Inter Variable (body) + Space Grotesk Variable (display).
- WCAG rule: never bright emerald (`text-mint` / `text-emerald`) as text on light backgrounds; use `text-emerald-deep` (`#06746d`, AA 5.21) for accent text/links on light.
- `.glass-card`, `.editorial-card`, `.dark-cta-card` utilities.

---

## Not independently re-verified in this pass

Per the scope given for this reconciliation, only `src/App.tsx`, `src/pages/Index.tsx`, `src/components/Navigation.tsx`, `src/pages/Sprint.tsx`, `src/pages/CaseStudies.tsx`, `src/pages/Operator.tsx`, `src/pages/Contact.tsx`, `src/pages/Alumni.tsx`, and `supabase/functions/personalize-intake` were read in full, plus targeted greps to confirm what is/isn't imported or called live. The following were **not** opened and their structure/copy should not be assumed accurate beyond "the route is live per `App.tsx`":
- `/blog`, `/blog/:slug`, `/library`, `/new-age-leadership`, `/privacy`, `/terms` page internals.
- Whether `import-audience-csv` has an out-of-band (e.g. manual/CLI) caller rather than a code caller.
- Whether `/robots.txt`'s stale `Allow:` lines were a deliberate leave-in or an oversight — ask Krish rather than assuming either.

---

**End of FEATURES**
