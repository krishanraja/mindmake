# CLAUDE.md: Mindmaker Repository Guide

**Last Updated:** 2026-08-09
**Purpose:** Describe the current state of the Mindmaker codebase so agents and contributors can navigate it without reverse-engineering the tree.

This file is **descriptive**, not prescriptive. For strategic intent on the earlier barbell/ladder eras, read `project-documentation/mindmaker_rebuild_brief_v4.md` (v4/v5 combined) and the v6 ladder restructure notes in `project-documentation/HISTORY.md` / `project-documentation/DECISIONS_LOG.md`. Both are historical: the site's live commercial architecture changed materially on 2026-08-05/06 (see next paragraph) and no longer matches the barbell or the v6 ladder as those docs describe them.

**The August 2026 overhaul (current state).** The public paid ladder is now two Krish-delivered offers plus the Cohort: **The Teardown** ($3,500 fixed, `/teardown`) and **The Handover** ($30,000 under 250 people / $50,000 for 250–5,000, `/handover`, gated on a completed Teardown), alongside **The AI-Fluent Executive (Cohort)** ($2,000–$3,000/seat range, `/cohort`, Maven-hosted, currently sold out). **Workshops, Enterprise, Capital, the AI Immersion, and the Alumni Pass were unsold**, Krish's word for the state: the route files stay in the repo and stay reachable by direct link, but they are removed from Navigation.tsx and Footer.tsx, `noindex`'d via `vercel.json`, and dropped from the sitemap and prerender lists. Nothing was deleted; nothing on those pages is discoverable or, for the ones with prices, still shows a price. `src/lib/offers.ts` is the new canonical source for Teardown/Handover pricing. See "The Ladder (current)" below.

The June 2026 update collapsed the funnel into **one journey: the Diagnosis Room (Mindy)**, still true. Every "Book a call" CTA opens an immersive on-site experience where Mindy diagnoses the visitor's nervous AI decision and forks to three honest exits (keep chatting, book a free 15-min call, or download a co-branded proposal, confirmed still live in `src/components/diagnosis/Fork.tsx`). The second homepage fork (`YFork`) and the `PreCallQualifier` floating pill remain retired (unmounted, dead code, safe to ignore). **Gap to know about:** the Diagnosis Room's actual deployed reasoning (`supabase/functions/_shared/mindy/knowledge.ts`, mirrored from `project-documentation/mindy/*.md`) has not been updated for the August overhaul. Mindy still reasons and prices from the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder and has no knowledge of the Teardown or the Handover, the two offers the rest of the site now sells. This is the single highest-priority sync gap in the codebase: the primary conversion surface doesn't know the current product. See `project-documentation/mindy/CANON.md` §0.

---

## Brand North Star

Mindmaker is the **anti-consultancy for leaders who are done being sold AI and ready to use it**. The voice is confident, lightly cynical, deeply helpful, premium through substance, not stiffness. Stripe's design sensibility meets Anthony Bourdain's authenticity.

### The Ladder (current, August 2026)

One method, sold two ways, per `public/llms.txt` and the homepage `TwoDoors` section: build the brain that holds your business, either self-serve via **CTRL** (free, Edge Pro $49/month) or with Krish through **The Teardown** ($3,500, ten business days, one decision) then **The Handover** ($30k–$50k, six weeks, gated on a completed Teardown, capped at 6/year). **The AI-Fluent Executive Cohort** ($2,000–$3,000/seat, quarterly, Maven-hosted) sits alongside as the peer-cohort option. Both Teardown and Handover carry a 20% discount for publicity permission, with the client approving how they're portrayed. **Workshops, Enterprise (Signal Session/Revenue Architecture), Capital, the AI Immersion, and the Alumni Pass are unsold** as of 2026-08-05/06: still in the repo and reachable by direct URL, no longer in nav, footer, sitemap, or (where they carried one) a published price. No 1:1 sprints on the public site. No fractional executive roles. No ongoing retainers. No production IT work. Every live offer has a fixed scope, a fixed outcome, and a finish line.

---

## Non-Negotiables

### Visual systems
- `src/components/NewHero.tsx`. rotating headline + gradient + looping background video (`/rising-cities.mp4`) + pulsing mint blur. Eyebrow: "Decision blockers I hear every week."
- `src/components/Animations/ParticleBackground.tsx`. global particle field mounted in `Index.tsx`.
- `.glass-card` / `.editorial-card` Tailwind utilities.
- `src/components/diagnosis/`. **the Diagnosis Room (Mindy)**, the primary conversion surface. A full-screen immersive experience opened globally via `window.dispatchEvent(new CustomEvent('openDiagnosisRoom', { detail: { source_page, seedDecision?, mode? } }))` (`mode` is `"express"` or `"full"`). Also a standalone page at `/start`. See "The Diagnosis Room (Mindy)" below.
- `src/components/ScopingModal.tsx`. the **secondary** conversion surface. Still the active booking path on the unsold offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`, all still routed but out of nav/footer, see "The Ladder" above), the `BigProblem` cards, and `/case-studies`; `Cohort.tsx` also opens it directly for 1:1-inquiry, cohort-enrollment, and cohort-waitlist asks. The nav/hero/final-CTA now open the Diagnosis Room instead. A 6-field "Scope it with me" intake (name, work email, company & role, the AI decision/problem, success in 30 days, optional notes) that posts to the `notify-scoping-request` edge function. Opened via `window.dispatchEvent(new CustomEvent('openScopingModal', { detail: { source_page, preselected?, qualifierAnswers? } }))`.
- `src/components/InitialConsultModal.tsx`. **not alumni-only** — correcting a stale claim in earlier docs. Globally mounted in `App.tsx` and opened via the `openConsultModal` event from `/alumni` (`preselected: "alumni"`), but `Contact.tsx` and `BlogPost.tsx` also import the component directly and open it from local state (their own CTAs, not the global event). So three live surfaces open it: Alumni, Contact, and every blog post.
- Testimonial structure in `src/components/TrustSection.tsx`.

### Technical infrastructure
- Supabase edge functions in `supabase/functions/`:
  - **Diagnosis Room (Mindy):** `mindy-chat` (Claude reasoning turn), `enrich-company` (thin HTTP wrapper over the shared `_shared/enrich/orchestrate.ts` dossier orchestrator; the fan-out logic now lives there so the lead pipeline can enrich in-process), `generate-proposal` (co-branded one-pager + Browserless PDF), `session-digest` (Krish digest now via the unified lead pipeline + opt-in visitor copy), `transcribe` (OpenAI Whisper voice input), `company-search` (Brandfetch Search API company-name typeahead for the opener, 80/IP/5 min rate limit). Shared logic lives in `supabase/functions/_shared/{mindy,enrich,proposal,lead,http}/`. The Gemini→Anthropic completion fallback is shared via `_shared/enrich/llm.ts`. **Not yet synced to the August 2026 offer change:** `_shared/mindy/knowledge.ts` (Mindy's deployed reasoning + pricing) still reflects the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder and has no knowledge of the Teardown or the Handover. See `project-documentation/mindy/CANON.md` §0.
  - `nervous-decision-machine` (Claude Haiku 4.5, powers the Nervous Decision Machine)
  - `get-ai-news`, `get-market-sentiment`, `get-model-data`
  - **Unified lead pipeline:** every lead-capture function (`send-contact-email`, `send-lead-email`, `send-leadership-insights-email`, `notify-scoping-request`, `notify-ctrl-waitlist`, `submit-intake`, `submit-testimonial`, and the Diagnosis Room's `session-digest`) is now a thin adapter that maps its payload to a canonical `LeadEvent` and hands off to the shared core in `supabase/functions/_shared/lead/` (`adapters.ts` → `pipeline.ts` `dispatchLead`). The pipeline auto-researches the company (reusing the enrichment orchestrator in-process), generates an AI "operator's read", and sends Krish ONE consistent, well-formatted digest via the shared Resend helper. Endpoint URLs, DB writes, and response shapes are unchanged; the email send is backgrounded (`EdgeRuntime.waitUntil`, with an awaited fallback). Shared modules: `_shared/lead/{types,escape,render,operator-read,pipeline,adapters}.ts` and `_shared/http/{cors,resend}.ts`. `send-lead-email` now stores an enrichment `Dossier` in `leads.company_research`. Visitor-facing emails (the `/leaders` score card, the session-digest opt-in proposal copy) are preserved on their own templates.
  - `import-audience-csv` (Substack subscriber CSV → shared `audience_contacts` table; gated by `AUDIENCE_IMPORT_SECRET`)
  - `create-consultation-hold`
  - `personalize-intake` (new, undocumented until this pass): powers the adaptive generative pass on `public/intake/index.html`, building on questions from the URL and prior answers.
- `SessionDataContext` (`src/contexts/SessionDataContext.tsx`) threads qualification data into the global conversion modal(s).
- Design system in `tailwind.config.ts` + `src/index.css`.

### Color WCAG rule (CRITICAL)
- **Signature accent is now portfolio EMERALD `#00D9B6` (`171 100% 43%`), not mint.** Mindmaker adopted CTRL's emerald in the 2026-06-29 brand-cohesion pass so the three sibling products (Mindmaker, CTRL, Make Your Mind Up) read as one house over one MindmakerOS token contract. The legacy `--mint*` CSS tokens + the Tailwind `mint` colour key are kept as ALIASES to emerald (zero-churn migration), so existing `text-mint`/`bg-mint`/`shadow-mint-*` still work and now render emerald; prefer the new `emerald*` keys in new code. WHY + the full WCAG derivation: `prototypes/brand-emerald-proof.{html,md}`.
- **Never** use bright emerald (`text-mint`/`text-emerald`) on white/light backgrounds - it fails contrast on light exactly like mint did.
- For text/links on light backgrounds use **`text-emerald-deep`** (`#06746d`, `176 90% 24%`): full AA (5.21), an upgrade over the old under-spec `mint-dark` (AA-large only). Or use `text-foreground` / `text-ink`.
- Use `text-dark-card-*` utilities on dark backgrounds.
- Bright emerald (`#00D9B6`) is for fills, CTA backgrounds (ink text on emerald = AAA), dark-bg accents, shadows, and the focus ring only.

---

## Homepage scroll order

Authoritative source: `src/pages/Index.tsx`.

1. `Navigation`. fixed top, hides on scroll-down via `useScrollDirection`.
2. `NewHero`. rotating headlines + CTAs opening the Diagnosis Room.
3. `BigProblem`. existential urgency frame, built as three large interactive flip cards (a fate on the front, what Mindmaker does about it on the back).
4. `TwoDoors` (added August 2026, `src/components/TwoDoors.tsx`). "The two doors. One method, sold two ways." Two cards: **Do it yourself** (CTRL, external link to `ctrl.themindmaker.ai` with UTM tags) and **Do it with me** (The Teardown, then The Handover; CTA opens the Diagnosis Room in `full` mode). This is a different "two doors" from the retired `YFork` three-door pattern below, don't conflate them.
5. `TrustSection`. Krish bio, headshot, testimonials carousel.
6. `OperatorsEdge` (v5). typography-only credential section, dark bg, three proof tiles (Architecture / Optimization / Memory), CTA to `/enterprise#revenue-architecture` + secondary link to `/operator`. "BEYOND PATTERN RECOGNITION" now the dominant wordmark. **Flag:** its primary CTA still points at `/enterprise`, one of the unsold, unlinked, `noindex`'d pages (see "The Ladder" above) — this CTA was not repointed to `/teardown` or the Diagnosis Room during the August overhaul and is worth Krish's attention.
7. `OperatorsBrief`. the Live Intel homepage teaser. Minimal on purpose: a continuous CSS-marquee `PriceTicker` with the canonical 7 models, a rotating plain-English interpretation line underneath (3 takes, 8s cross-fade), a compact Nervous Decision input (via `nervous-decision/Input`), and a muted "Open the full dashboard →" link to `/signal`. No card grid, no blog column, those live on `/signal` only.
8. `SimpleCTA`. final CTA ("What's your nervous decision?"), opens the Diagnosis Room.
9. `Footer`.

`FrameworkJourney` (three-panel animated Mind Set → Mind Map → Mind Make) is **no longer on the homepage**; `TwoDoors` replaces its slot. The component still exists and is still rendered on `/new-age-leadership`. `MindMakerLiveSection` (the old Substack-embed homepage section) is **no longer imported anywhere** — confirmed via repo-wide search — and is dead code, safe to ignore or remove.

Case studies (anonymised, COHORT-STYLE / ENTERPRISE tagged) are merged into `TrustSection`'s carousel, and have a dedicated filterable page at `/case-studies`. **Gap:** the case-study data (`src/data/caseStudies.ts`) still tags every entry `"Cohort"`, `"Signal Session"`, or `"Revenue Architecture"` and links to `/enterprise#signal-session`; nothing is tagged to the Teardown or the Handover yet. `ProofStrip` and `SignalDeskPreview` are deleted.

Global overlays mounted in `src/App.tsx`:
- `DiagnosisRoom`. **the primary conversion surface**, opened via the `openDiagnosisRoom` custom event. Lazy + only mounted when open so the SSG prerender never instantiates it.
- `ScopingModal`. secondary booking surface, still dispatched by the unsold offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and `/case-studies` via `openScopingModal`.
- `InitialConsultModal`. kept mounted; opened via `openConsultModal` from `/alumni`, and directly from local state on `/contact` and every blog post (not alumni-only, see "Non-Negotiables" above).
- `CookieConsent`.

**Not on the homepage:** VendorLandscape, AINewsTicker, ActionsHub, decision-tool launchers, the ChatBot, the Engine Room / mm-ctrl visualization, the old TheProblem sprint chooser, the retired `YFork` second fork, and the retired `PreCallQualifier` floating pill. (`YFork.tsx` and `PreCallQualifier.tsx` still exist in the tree, are not imported anywhere, and are confirmed dead code.)

---

## Pages and routing

Authoritative source: `src/App.tsx`. Non-homepage pages are lazy-loaded via `React.lazy`.

| Route | Page | Notes |
|---|---|---|
| `/` | `Index` | Homepage, eager-loaded. |
| `/start` | `DiagnosisRoom` (full page) | The Diagnosis Room (Mindy) as a standalone page. Same immersive overlay; closing it navigates back to `/`. |
| `/teardown` | `Teardown` | **New, August 2026.** $3,500 fixed, ten business days, one decision. Claims-based method: the decision breaks into load-bearing claims each checked against live evidence with a reliability tier; considerations classed External / Only you / Nobody yet; four models cross-examine with disagreements preserved. Ends in a one-page memo, a decision-to-claims map, and three claims under a 90-day watch, plus a CTRL workspace + 30 days of Edge Pro. Framed as the gate for The Handover. 20% publicity discount (`PUBLICITY_DISCOUNT` in `src/lib/offers.ts`). Single CTA opens the Diagnosis Room in `full` mode; no separate contact form. In nav ("Work with me" dropdown) and footer. |
| `/handover` | `Handover` | **New, August 2026.** $30,000 under 250 people, $50,000 for 250–5,000, both from `src/lib/offers.ts`. Six weeks, gated on a completed Teardown. Week 1 load/correct context, week 2 adversarial pre-mortem, week 3 the fork (GTM/pricing/positioning rebuild, or build-order if already AI-native), week 4 client drives, week 5 Krish does not attend, week 6 exit + Day-90 recheck. Capped at 6/year (`HANDOVER_ANNUAL_CAP`), stated publicly. Sold to CEO/CRO/VP Product, never the CTO. Same 20% publicity discount and single Diagnosis-Room CTA as Teardown. In nav and footer. |
| `/cohort` | `Cohort` | The AI-Fluent Executive, **$2,000–$3,000/seat range** (corrected from a flat $2,500 on 2026-08-05 to match the live Maven page), 4 weeks, quarterly. Next cohort (Nov 19–Dec 13, 2026) is hardcoded **sold out** (`soldOut: true`, `Cohort.tsx`); CTAs point to Maven's waitlist. Maven URL: `https://maven.com/mindmaker/the-ai-fluent-executive`. In nav (direct link) and footer. |
| `/workshops` (+5 sub-pages) | `Workshops`, `workshops/*` | **Unsold, August 2026.** Route files present and still work if visited directly; removed from Navigation.tsx and Footer.tsx, `noindex,nofollow` via `vercel.json`, dropped from the sitemap. Not currently for sale anywhere the site itself surfaces. |
| `/enterprise` | `Enterprise` | **Unsold, August 2026** (same treatment as Workshops above). Previously The Signal Session ($15k) + The Revenue Architecture ($60-100k) + The AI Immersion; no longer priced or discoverable. `OperatorsEdge`'s homepage CTA still points here (flagged above). |
| `/capital` | `Capital` | **Unsold, August 2026** (same treatment). Was the third door for funds/family offices, same Signal Session/Revenue Architecture formats. |
| `/operator` | `Operator` | (v5) How I operate, 14-agent OS credential page. |
| `/case-studies` | `CaseStudies` | Filterable, anonymised client case studies (COHORT-STYLE / ENTERPRISE tagged — not yet updated for Teardown/Handover, see homepage section above). Linked from the Resources nav dropdown and the footer. |
| `/signal` | `Brief` | Live Intel, the full dashboard: extended live-price ticker, plain-English interpretation grid, classified card archive (WATCH / SKIP / CALL / TAKE with filters + search), blog column, full Nervous Decision Machine. Route preserved for inbound URLs. |
| `/library` | `Library` | Library of resources, includes FAQ tab. |
| `/alumni` | `Alumni` | The Alumni Pass. **Unsold, August 2026** (was already hidden from nav/footer and `noindex` pre-August; now also dropped from the sitemap). Reachable by direct URL only. |
| `/immersion` | `Immersion` | **Unsold, August 2026** (same treatment as Workshops/Enterprise/Capital). App.tsx's own code comment still says "linked from footer, not nav" — that comment is stale; `Footer.tsx` no longer links it. |
| `/new-age-leadership` | `NewAgeLeadership` | "New Age Leadership" essay on agentic org design (Agatha narrative + interactive org chart + `FrameworkJourney`, now the only place that component renders). Linked from the Resources nav dropdown and the footer. |
| `/leaders` | `LeadershipInsights` | Decision Readiness Diagnostic. Unlinked from nav/footer but still reachable by direct URL for deep-links. |
| `/leadership-insights` | `LeadershipInsights` | Alias. |
| `/blog`, `/blog/:slug` | `Blog`, `BlogPost` | Blog index + post. |
| `/faq` | redirects to `/library?tab=questions` | |
| `/contact` | `Contact` | |
| `/privacy`, `/terms` | `Privacy`, `Terms` | |
| `*` | `NotFound` | Catch-all. |

**Client-side redirects (301-equivalent via `<Navigate replace />`):**
- `/tool` → `/signal#decision` (page deleted; decision machine now lives inside the Live Intel dashboard)
- `/builder-economy` → `https://www.thebuildereconomy.com` via `ExternalRedirect` (page deleted; canonical site is the separate domain)
- `/sprints` → `/cohort`
- `/sprint/4-week` → `/cohort?inquiry=1:1`
- `/sprint/90-day` → `/cohort?inquiry=1:1`
- `/builder-sprint` → `/cohort?inquiry=1:1`
- `/war-room` → `/enterprise#revenue-architecture`
- `/strategy-day` → `/enterprise#signal-session`
- `/fractional-caio` → `/enterprise`
- Legacy: `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`.

On `/cohort?inquiry=1:1`: a banner surfaces the 1:1 inquiry-only path for buyers specifically seeking private engagements, without advertising the offer on the main page.

No `/pricing` page. `/teardown` and `/handover` show fixed/banded exact prices in-page; `/cohort` shows a range; the unsold pages show no price at all.

**Sitemap and prerender (`scripts/generate-sitemap.mjs`, `scripts/prerender.mjs`):** 15 static routes as of this pass — `/`, `/start`, `/teardown`, `/handover`, `/cohort`, `/operator`, `/case-studies`, `/signal`, `/new-age-leadership`, `/blog`, `/library`, `/leaders`, `/contact`, `/privacy`, `/terms` — plus one entry per blog slug. `/workshops`, `/enterprise`, `/capital`, `/immersion`, `/alumni` are excluded (the `/alumni` exclusion has an explicit code comment; the other four are excluded the same way but without a comment). `vercel.json` sets `X-Robots-Tag: noindex, nofollow` on `testimonials|intake|workshops|enterprise|capital|immersion|alumni` and `index, follow` on everything else, so `/cohort`, `/teardown`, and `/handover` are indexable.

---

## Navigation structure

File: `src/components/Navigation.tsx`. **Rebuilt August 2026** — the old "Book a call" label, Workshops link, Enterprise dropdown, and Capital link are gone. Primary CTA is now **"Bring me one real decision"** (desktop and mobile), which opens the **Diagnosis Room** in `express` mode via the `openDiagnosisRoom` event. The mobile menu adds a secondary "Or think it through with Mindy first" link that opens the room in `full` mode.

- **Work with me** (dropdown, slot 1): The Teardown → `/teardown`, The Handover → `/handover`.
- **Cohort** (direct link): `/cohort`.
- **Mindmaker LIVE** (link, rendered as an icon+wordmark lockup): `/signal`.
- **Resources** (dropdown): How I operate → `/operator`, Case studies → `/case-studies`, New Age Leadership → `/new-age-leadership`, Library → `/library`, The Builder Economy (Podcast) → external `www.thebuildereconomy.com`, Lightning Lessons (5 external Maven links).
- **About** (dropdown): Contact → `/contact`, Privacy → `/privacy`, Terms → `/terms`.

There is no Enterprise, Capital, or Workshops entry anywhere in `navItems`; those three plus Immersion and Alumni are the unsold pages (see "The Ladder" and "Pages and routing" above). `Footer.tsx` mirrors this: its "Work with me" column is Teardown / Handover / Cohort only, "Resources" is Mindmaker LIVE / Library / How I operate / Case studies / The Builder Economy / New Age Leadership, "Company" is FAQ / Contact / Privacy / Terms. No Enterprise, Capital, Workshops, Immersion, or Alumni link anywhere in the footer.

The Decision Readiness Diagnostic and FAQ pages are no longer linked from nav. Both remain reachable by direct URL.

---

## Pricing (canonical)

**Policy reversed August 2026 for the two active Krish-delivered offers.** From June 2026 to August 2026 the public site showed ranges only, never an exact figure. Commit `7c76f66` (2026-08-06) reversed that for the new offers: The Teardown and The Handover both publish an exact/banded price directly on their pages and in `public/llms.txt`, on Krish's explicit decision ("publish both prices with the Diagnosis Room as the door"). The Cohort still shows a range because Maven, not the site, sets its exact per-seat price.

| Offer | Public price | Source |
|---|---|---|
| The Teardown | **$3,500 fixed** | `src/lib/offers.ts` (`TEARDOWN_PRICE`) |
| The Handover | **$30,000** under 250 people, **$50,000** for 250–5,000 | `src/lib/offers.ts` (`HANDOVER_PRICE_SMALL` / `HANDOVER_PRICE_LARGE`) |
| The AI-Fluent Executive (Cohort) | **$2,000–$3,000 per seat** (range; corrected 2026-08-05 to match Maven) | `Cohort.tsx` (hardcoded, not sourced from `offers.ts` or `stripe-prices.ts`) |
| CTRL | Free, Edge Pro $49/month | per `llms.txt`; see CTRL's own repo for the full SKU list |
| Workshops, Enterprise (Signal Session / Revenue Architecture), Capital, The AI Immersion, The Alumni Pass | **No public price** | Unsold as of 2026-08-05/06; prices were stripped from these pages, not merely ranged. Where a page still renders old copy referencing an exact figure, treat it as stale until re-verified against the live route. |

Both Teardown and Handover carry `PUBLICITY_DISCOUNT` (`src/lib/offers.ts`): 20% off in exchange for permission to write about the engagement, with the client approving how they're portrayed.

Stripe price IDs are stored in `src/lib/stripe-prices.ts` and cover only the Cohort, the five (unsold) Workshops, and the Alumni Pass — **there are no Stripe IDs for the Teardown or the Handover**, which are invoiced manually. The Stripe comment next to the Cohort's `priceFull` still says `$2,500` (the pre-correction figure); Maven, not Stripe, is the live Cohort checkout path, so this stale comment is metadata, not a live discrepancy, but it should be corrected for hygiene.

**Not reconciled to this pricing model:** `project-documentation/mindy/pricing-range-model.md` and `CANON.md` describe the pre-August "ranges only, never an exact figure" policy as universal. It no longer is. See `project-documentation/mindy/CANON.md` §0.

---

## The Nervous Decision Machine

Components: `src/components/nervous-decision/Input.tsx` (compact + full sizes) and `src/components/nervous-decision/Artifact.tsx`. Embedded inside `OperatorsBrief` on the homepage and inside `Brief.tsx` at `/signal`. No standalone page, `/tool` has been deleted.
Edge function: `supabase/functions/nervous-decision-machine/index.ts`.
Model: `claude-haiku-4-5-20251001`, max 1500 tokens, system prompt enforces JSON output schema + Krish's voice. 1-hour per-IP rate limit + global request ceiling as a soft circuit breaker. Requires `ANTHROPIC_API_KEY` on the Supabase project.

---

## The Diagnosis Room (Mindy)

The primary conversion surface (June 2026). A full-screen immersive experience where **Mindy**, the on-site guide reasoning in Krish's voice, diagnoses a visitor's nervous AI decision and forks to three honest exits. It replaces both the `PreCallQualifier` pill and the `YFork` second fork.

**Entry points:** the `openDiagnosisRoom` custom event (`detail: { source_page, seedDecision?, mode? }`), dispatched by the nav "Book a call", the hero CTAs, and `SimpleCTA`; plus the standalone page at `/start`. Lazy-loaded and only mounted when open, so the SSG prerender never instantiates it.

**Two modes** (`SessionMode`): `express` rushes to the booking (nav "Book a call" defaults here); `full` runs the complete diagnosis (the hero's "Work through your decision with Mindy" and the mobile "think it through with Mindy first"). A started express session can switch to full mid-flight.

**Front end**, `src/components/diagnosis/`:
- `DiagnosisRoom.tsx`. the orchestrator/overlay. `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar` are the scenes/controls; `useDiagnosisSession.ts` is the state machine; `types.ts` holds the edge-function contracts.
- Phases (`RoomPhase`): `opener` → `reading` (enrichment in flight) → `reflect` (dossier reveal + Mindy's first reflection) → `chat` → `brief` (the kept one-screen decision brief) → `fork` (the three exits) → `proposal`; `express-book` is the express shortcut straight to Calendly.
- Three honest exits: **keep chatting** (learn), **book a free 15-min call** (`CALENDLY_URL` = `https://calendly.com/krish-raja/15-min-intro`), and **generate/download a co-branded proposal** (PDF).

**Back end**, four edge functions (plus voice):
- `enrich-company`. turns a work email/domain into a company **dossier**. `depth: "identity"` is the fast (~1s) co-brand paint (Brandfetch + Tranco); `depth: "full"` adds PDL + BuiltWith + currency, then a Gemini/Anthropic synthesis in Krish's voice. Free-email domains (gmail, etc.) return `{ skipped: "free-email" }` so the UI degrades gracefully (no co-brand "gasp").
- `mindy-chat`. Mindy's reasoning turn. Composes the Brain Pack + a formatted dossier block, calls Claude, returns a strict-JSON turn (`reply`, `phase`, `quickReplies`, `recommendation`, `decisionBrief`, `readyForProposal`, `readyForCall`) run through a runtime voice gate.
- `generate-proposal`. the on-the-fly co-branded "Mindmaker × [company]" one-pager. Deterministic shell + dossier + selected proof, with reflective prose generated in one Claude call and voice-linted. `format: "pdf"` renders via Browserless; on Browserless failure it returns HTML + `pdfFallback: true` so the client prints to PDF.
- `session-digest`. fires on a meaningful end (`chat` / `book-call` / `proposal`). Emails Krish the FULL session intelligence; if the visitor opted in and a proposal exists, emails them ONLY their proposal (Resend).
- `transcribe`. server-side voice transcription for the mic input (OpenAI Whisper).

**Privacy contract (critical):** the dossier's `scale.*` fields (`employeeCount`, `sizeBand`, `trancoRank`, `icp`, `recommendedMode`) are **internal routing only**. The hook strips them out of everything it hands to a view, Mindy must never recite them, and the visitor proposal/digest copy never contains the routing layer or the raw transcript. Only Krish's internal digest receives the full dossier.

**Knowledge & guardrails:** Mindy's Brain Pack lives in `project-documentation/mindy/`, `mindy-system-prompt.md`, `reasoning-fewshots.md`, `fit-and-walkaway-rubric.md`, `pricing-range-model.md`, `proof-bank.md`, `CANON.md` (de-poison / source of truth), and `voice-lint.md` (post-generation gate). These `.md` files are meant to be mirrored verbatim into the deployed `_shared/mindy/knowledge.ts` (its own header says so). **They are currently out of sync with both the live site and each other:** the Brain Pack still describes ranges-only pricing and the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder; the live site now sells the Teardown ($3,500 fixed) and the Handover ($30k/$50k banded) with exact prices, and has unsold Signal Session/Revenue Architecture/Immersion entirely. Until this is resynced, Mindy will recommend and price offers that are no longer sold and stay silent about the two offers that are.

---

## Live Intel

Renamed from "The Operator's Brief" (previously "Signal Desk") for straightforward nav clarity, this is live model pricing and weekly calls.

- Homepage teaser: `src/components/OperatorsBrief.tsx`. Minimal, continuous marquee `PriceTicker` + rotating interpretation line + compact Nervous Decision input + footer link to the dashboard. No cards, no blog column.
- Full dashboard: `src/pages/Brief.tsx` at `/signal`. Extended ticker, 3-card interpretation grid, the full classified archive with filter pills + search, a blog column, and the full-size Nervous Decision input with example chips.
- Shared: `src/components/PriceTicker.tsx` (CSS-marquee, no native scrollbar, pauses on hover, respects `prefers-reduced-motion`). `src/components/nervous-decision/` has `Input.tsx`, `Artifact.tsx`, `types.ts`.
- Model allowlist lives inside `src/hooks/useModelData.ts` as `ALLOWED_MODEL_IDS`. Current canonical set: Opus 4.7, Sonnet 4.6, Haiku 4.5, Gemini 2.5 Pro, Gemini 2.5 Flash, GPT-5, GPT-5 Mini. Update here when a new frontier model is worth surfacing.
- Archive page: `src/pages/Brief.tsx` at route `/signal` (URL preserved for inbound). Filter pills for WATCH / SKIP / CALL / TAKE plus search.
- Taxonomy: **WATCH** (worth acting on), **SKIP** (hype / ignore), **CALL** (a decision is overdue), **TAKE** (Krish's opinion). Renamed from the previous SIGNAL / NOISE / DECISION / TAKE set.
- **The Cohort Signal** (`src/components/PortfolioPulse.tsx`, on `/signal` between the interpretation grid and the archive): the public face of the cross-product hive mind. Renders the anonymised `portfolio-pulse` aggregate - "what leaders are actually wrestling with", the nine AI-native lanes as share bars, from Make Your Mind Up's q5 ("the decision you keep not making"). No PII reaches the client (counts + shares only, categorised server-side); volume-guarded (self-hides below 12 leaders so a thin room never reads as weakness); prerender-safe (null during SSG). Canonical record: `mm-ctrl/docs/PORTFOLIO-HIVE-MIND.md`.
- Data source: still inlined sample cards for now. `get-ai-news` edge function schema remains in place for eventual dynamic feed.

---

## Homepage Y-fork (RETIRED)

The second homepage fork (`src/components/YFork.tsx`, "Start where your question actually is.") was **removed from the homepage in June 2026** so the funnel collapses into the one Diagnosis Room journey. The file still exists in the tree but is no longer imported in `Index.tsx`. Its three intents (sharpen / resolve / rebuild) are now handled by Mindy's diagnosis and the existing nav (`/workshops`, `/cohort`, `/enterprise`, `/capital`). The CTRL waitlist (`CtrlWaitlistPopover`) and the Sunday brief remain reachable via other surfaces.

`NewHero`'s "See how I work →" link now points to `/operator` (it previously smooth-scrolled to the Y-fork). Hero eyebrow reads "Decision blockers I hear every week".

The next-cohort date is displayed on `/cohort` only. When Supabase `cohort_dates` is wired up, replace the literal in `Cohort.tsx`.

---

## Operator's Edge (v5)

Homepage section: `src/components/OperatorsEdge.tsx`. Dark-bg section between `TrustSection` and `OperatorsBrief` (previously between `FrameworkJourney` and `OperatorsBrief`; `FrameworkJourney` left the homepage in the August 2026 pass, see "Homepage scroll order"). The heading "Beyond *pattern* recognition" is retypeset to match the FrameworkJourney header scale exactly, `text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold`, partial-mint treatment on "pattern" only, no drop-shadow glow. Reads as a clear new section via the `WHO YOU'RE WORKING WITH` eyebrow, hairline top border, and gradient background tonal shift. Lead line is the anti-consultant statement (pulled from a top-of-file constant so Krish can edit in one place). Three glass tiles (Architecture / Optimization / Memory) follow. Primary CTA to `/enterprise#revenue-architecture`, secondary muted link to `/operator`.

Dedicated page: `src/pages/Operator.tsx` at `/operator`. Hero (text + `Krish-Headshot.png`) → thesis (looping `ctrl-demo-video.mp4` left of text, no tool names listed) → 5-cluster static agent diagram (14 named agents) → four extractable lessons → `On stage` strip with three `krish-stage-*` images → commercial crossover. Page ends at the crossover CTA. OG type `article`. Tracked via `plausible('operator_page_cta_clicked')` on the Revenue Architecture CTA.

**Design guardrails:** no scrolling logs, no terminal aesthetics, no ASCII art, no interactive dashboards. Every claim must pass the CMO-15-second test.

---

## Voice & tone

### Use
- Build, systems, working, deploy, literacy, decision, sprint, friction.
- Concrete verbs: ship, decide, make, cut, filter.
- Second person, specific numbers.

### Avoid
- Transformation, synergy, leverage, ecosystem, journey (as a noun), revolutionary, cutting-edge.
- Passive voice, vague benefit words ("optimize", "enhance", "maximize").

### Archetype
Your smartest, most cynical friend who runs AI transformation every day and genuinely loves building things. Confident, not arrogant. Cynical, not negative. Helpful, not pushy.

---

## Development notes

- Package manager / build: `npm` + Vite (`vite.config.ts`).
- Lint: `npm run lint`. Build: `npm run build` (runs Vite → `scripts/generate-sitemap.mjs` → `scripts/prerender.mjs`).
- Routing: React Router v6 (`BrowserRouter` in `App.tsx`).
- State: `@tanstack/react-query` + `SessionDataContext`.
- Styling: Tailwind + shadcn/ui components in `src/components/ui/`.
- Theme: `next-themes` with `attribute="class"` (dark mode class-based).
- The nav's "Bring me one real decision" and other primary CTAs open the **Diagnosis Room** via the `openDiagnosisRoom` event (express mode from the nav, full mode from the hero/mobile secondary and `TwoDoors`). `ScopingModal`/`openScopingModal` is a retained fallback on the unsold offer pages and `Cohort.tsx`; `InitialConsultModal`/`openConsultModal` is used by `/alumni`, `/contact`, and every blog post (not alumni-only).
- LLM discoverability: `public/llms.txt` + allow-list for GPTBot / ClaudeBot / PerplexityBot / Google-Extended in `public/robots.txt`.

---

## Related documentation

- `project-documentation/mindmaker_rebuild_brief_v4.md`. the v4/v5 brief (barbell pivot + Operator's Edge), historical: pre-dates both the v6 ladder restructure and the August 2026 Teardown/Handover overhaul. Strategic-intent archive only.
- `project-documentation/README.md`. index of all project documentation.
- `project-documentation/mindy/`. **Mindy's Brain Pack**, the system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing-range model, proof bank, `CANON.md` (de-poison / source of truth), and voice-lint that govern the Diagnosis Room. **Not yet synced to the August 2026 offer change** — see `CANON.md` §0.
- `project-documentation/COMMERCIAL_REFERENCE.md`. durable commercial reference (the `mindmaker` Claude skill): the full buyer-journey ladder, three ICPs, CTRL product, Substack, Stripe, the sales motion, and the Mindmaker vs Mindmaker OS boundary. Reconciled to the live site on 2026-08-09.
- `project-documentation/PURPOSE.md`, `VALUE_PROP.md`. mission, positioning, differentiators.
- `project-documentation/OFFERS.md`. full offer guide (The Teardown, The Handover, Cohort; unsold offers noted).
- `project-documentation/ICP.md`. the ICPs and anti-ICPs.
- `project-documentation/ICP_ACCOUNTABLE_DELEGATOR.md`. deep archetype of the cohort/leader buyer ("The Accountable Delegator"), the psychographic + skill-gap depth behind ICP 1.
- `project-documentation/OUTCOMES.md`. buyer outcomes by offer.
- `project-documentation/Master_Messaging_and_FAQ.md`. sales pitches and objection handling.
- `project-documentation/BRANDING.md`, `VISUAL_GUIDELINES.md`, `DESIGN_SYSTEM.md`. brand + visual systems.
- `project-documentation/ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`. technical architecture, feature catalogue, and deploy flow.
- `project-documentation/EXECUTIVE_SUMMARY.md`, `LLM_CRITICAL_THINKING_TRAINING.md`. research artefacts (not Mindmaker business content).

---

**End of CLAUDE.md**
