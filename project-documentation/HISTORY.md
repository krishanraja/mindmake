# History

**Last Updated:** 2026-06-28

---

## 2026-06-28: Diagnosis Room redesigned as 2027 mobile-first experience; intake, company search, and testimonial collection added

**What Changed (in the codebase, reconciled into docs):**
- **Diagnosis Room redesigned** ("2027 mobile-first immersive experience"). Full visual and UX overhaul of `src/components/diagnosis/`. New components added: `CompanyField.tsx` (company search typeahead in the opener using the Brandfetch Search API), `BrushPainter.tsx` (opener aurora visual layer), `logoLuminance.ts` (logo contrast helper for adaptive dark/light logo selection against the room's dark background). Barrel `index.ts` added. The room enriches from a chat-named company in addition to email, surfaces dossier intelligence more prominently, and fixes the co-branded proposal header.
- **Company search typeahead in the opener** (`company-search` edge function). Visitors can type a company name directly in the opener; `CompanyField` queries `company-search` (Brandfetch Search API, rate-limited 80/IP/5 min) and returns ranked matches with name, domain, and icon. The selected company pre-fills enrichment so the co-brand paint fires without requiring a work email. Degrades gracefully to empty results on failure.
- **Pre-session intake form** (`submit-intake` edge function + `public/intake/index.html`). A structured static HTML form collects pre-session context (AI confidence, value frame, aspiration, business context, north star, role-aware handoff) before a confirmed engagement. Posts to `submit-intake`, which inserts a row and emails Krish a formatted SNAPSHOT brief.
- **Testimonial collection** (`submit-testimonial` edge function + `public/testimonials/index.html`). A public static form for testimonial submissions. Posts to `submit-testimonial`, which inserts into `public.testimonials`, emails Krish a notification, and validates permission level (free / edits / private). Honeypot field prevents bot submissions.
- **Autofill intake** from already-collected session data (contact step auto-populated where possible). Intake questions are role-aware (Q4 adapts based on earlier answers).
- **Docs reconciled this pass**: ARCHITECTURE.md, FEATURES.md, REPLICATION_GUIDE.md updated to reflect the three new edge functions (`company-search`, `submit-intake`, `submit-testimonial`), new diagnosis components, and new static pages. All "Last Updated" dates bumped to 2026-06-28 across the living documentation set. Historical entries preserved as-is.

**Why:**
- The redesigned Diagnosis Room opener was the primary friction point; company-name typeahead eliminates the cold-start gap for visitors without a work email ready, and reduces the enrichment latency by pre-seeding the dossier from a named company.
- The intake form gives Krish structured pre-session context for confirmed engagements, replacing unstructured email back-and-forth.
- The testimonial form closes the feedback loop from clients post-engagement without manual Krish intervention.

---

## 2026-06-09: The Diagnosis Room (Mindy) ships; funnel consolidated into one journey

**What Changed (in the codebase, reconciled into docs):**
- **The Diagnosis Room (Mindy) is now the primary conversion surface.** A full-screen immersive experience (`src/components/diagnosis/`) where Mindy diagnoses the visitor's nervous AI decision and forks to three honest exits: keep chatting, book a free 15-min call (Calendly), or generate/download a co-branded "Mindmaker × [company]" proposal. Opened via the new `openDiagnosisRoom` event (modes `express` | `full`) and as a standalone page at `/start`. Lazy + only mounted when open so the SSG prerender never instantiates it.
- **Four new edge functions back the room** (`mindy-chat`, Claude reasoning turn; `enrich-company`, company dossier orchestrator over Brandfetch/PDL/Tranco/BuiltWith/Perplexity/Exa/NewsAPI/Gemini; `generate-proposal`, co-branded one-pager + Browserless PDF; `session-digest`, Resend intelligence email to Krish + opt-in visitor copy) plus `transcribe` (OpenAI Whisper voice input). Shared logic lives in `supabase/functions/_shared/{mindy,enrich,proposal}/`. The dossier's `scale.*` layer is internal routing only and never surfaced to the visitor.
- **Funnel consolidation (`chore(funnel): retire redundant surfaces`).** Removed the homepage `YFork` second fork and the `PreCallQualifier` floating pill so the homepage funnels into the one Mindy journey (both files remain in the tree but are unmounted). Repointed `SimpleCTA` and the nav/hero "Book a call" to the Diagnosis Room; `NewHero`'s "See how I work" now links to `/operator`. `ScopingModal` remains the booking surface on the offer pages, the `BigProblem` cards, and `/case-studies`.
- **Pricing stripped to ranges.** The public site and any generated proposal show ranges only; the exact number is set by Krish on the call. Exact figures are retained in docs as internal reasoning aids.
- **New `/case-studies` page** (filterable, anonymised COHORT-STYLE / ENTERPRISE proof; `src/pages/CaseStudies.tsx` + `data/caseStudies.ts` + `components/proof/CaseStudyCard.tsx`), linked from the Resources nav dropdown and the footer.
- **Framework tension resolved** (`CANON.md` §5): "Mind Set → Mind Map → Mind Make" is the canonical cross-offer brand framework; "Diagnose → Decompose → Decide → Deploy" is the cohort's week-by-week curriculum. Both coexist.
- **Added Mindy's Brain Pack** (`project-documentation/mindy/`: system prompt, reasoning few-shots, fit-and-walkaway rubric, pricing-range model, proof bank, `CANON.md`, voice-lint) and stored the durable commercial reference as `project-documentation/COMMERCIAL_REFERENCE.md` (the `mindmaker` Claude skill, reconciled to the live site).
- Added the `import-audience-csv` edge function (Substack subscriber CSV → shared `audience_contacts` table).

**Why:**
- A single, guided, on-site diagnosis converts better than a static fork plus a passive pill: it reflects the visitor's business back to them (via enrichment), reasons through their actual decision in Krish's voice, and only then recommends a rung, honestly down-selling to a cheaper rung or a free lesson when that's the right call, and booking the call for anything above the self-serve ceiling.
- Ranges-only pricing keeps the exact number a conversation Krish owns on the call, while still giving buyers an honest band.

**Files Updated (docs reconciled this pass):**
- `CLAUDE.md` and the living `project-documentation/` set (README, ARCHITECTURE, FEATURES, plus BRANDING, ICP, OFFERS, DESIGN_SYSTEM, VISUAL_GUIDELINES, REPLICATION_GUIDE, COMMON_ISSUES, DEPLOYMENT, SALES_PLAYBOOK, Master_Messaging_and_FAQ, PURPOSE) updated to reflect the Diagnosis Room, the retired `YFork`/`PreCallQualifier`, the new edge functions, and ranges-only pricing. The repo-root `README.md` was refreshed. New: `COMMERCIAL_REFERENCE.md`; the `mindy/` Brain Pack added to the index. Historical entries preserved as-is.

---

## 2026-06-03: Documentation refresh: homepage re-fork by intent + scoping modal

**What Changed (in the codebase, reconciled into docs):**
- **Homepage Y-fork rebuilt around buyer intent** (commit "Re-fork homepage by intent, split CTAs into tier-appropriate paths", 2026-05-27). `YFork.tsx` headline changed from "Three doors. Pick yours." to **"Start where your question actually is."** The three tier-named cards (Workshops | Cohort | Enterprise) became three intent cards: **Sharpen how I think** (CTA "See programmes" → `/cohort`), **Resolve one decision** (CTA "Book a Signal Session" → `/enterprise#signal-session`), and **Rebuild the commercial layer** (CTA "Scope an engagement" → `/capital`). A free-entry strip was added underneath (Decision Readiness Diagnostic, CTRL waitlist, Sunday brief). Capital is surfaced on the homepage again via the "Rebuild" card.
- **`ScopingModal` is now the primary "Book a call" conversion surface.** New `src/components/ScopingModal.tsx`: a 6-field "Scope it with me" intake (name, work email, company & role, the AI decision/problem, success in 30 days, optional notes) that posts to a new `notify-scoping-request` edge function. Opened via the `openScopingModal` event from the nav, hero, `PreCallQualifier`, and the Cohort/Enterprise/Capital/Immersion/New-Age pages. `InitialConsultModal` (and `openConsultModal`) is now legacy, kept mounted but dispatched only from `/alumni`.
- **`BigProblem` rebuilt as three large interactive flip cards** (a fate on the front, the Mindmaker response on the back).
- **New Age Leadership added to the Resources nav dropdown** (previously footer-only).
- Added the `notify-ctrl-waitlist` edge function + `CtrlWaitlistPopover` for the CTRL launch waitlist.

**Why:**
- The tier-named tri-fork asked cold visitors to self-classify by product before they understood the products. Framing the fork by what the visitor wants ("sharpen / resolve / rebuild") routes them by intent and readiness, and splits the CTAs into tier-appropriate paths.
- A short, structured scoping intake ("the decision", "success in 30 days") captures a qualified brief routed straight to Krish, replacing the older multi-step consult wizard everywhere except the invitation-only Alumni Pass.

**Files Updated (docs reconciled this pass):**
- `CLAUDE.md` and the living `project-documentation/` set (ARCHITECTURE, FEATURES, DESIGN_SYSTEM, VISUAL_GUIDELINES, REPLICATION_GUIDE, README, COMMON_ISSUES, DEPLOYMENT, BRANDING, OFFERS, Master_Messaging_and_FAQ, ICP) updated to reflect the scoping modal and the intent-framed homepage. Historical entries preserved as-is.

---

## 2026-05-15: v6 ladder restructure (Workshops + Alumni Pass added)

**What Changed:**
- Restructured the offer architecture from a barbell (Cohort + Enterprise) to a four-rung ladder: free Lightning Lessons → paid Workshops at $599 → AI-Fluent Executive Cohort at $2,500 → Enterprise from $15,000, with the Alumni Pass at $1,500/year as continuity.
- Renamed the Cohort: "The AI Decision Cohort" → **"The AI-Fluent Executive"**. Repriced from $3,500 to $2,500. Duration corrected from 3 weeks to 4 weeks. Curriculum framework corrected from "Name → Map → Make" to **"Diagnose → Decompose → Decide → Deploy"**. CTRL added to "What's included".
- Added a new top-level offering: **Workshops**. Five one-day, $599 workshops hosted on Maven. New `/workshops` index page plus five sub-pages (`/workshops/build-your-ai-chief-of-staff`, `/workshops/map-your-agentic-org-chart`, `/workshops/vibe-coding-for-leaders`, `/workshops/build-an-autonomous-business-function`, `/workshops/give-your-ai-memory`).
- Added a new alumni page at `/alumni`. Hidden from nav and footer (reachable by direct URL only). `noindex`. Sells the Alumni Pass at $1,500/year.
- Replaced the dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` with the live `maven.com/mindmaker/the-ai-fluent-executive` everywhere in the codebase and documentation.
- Updated the homepage tri-fork from "Cohort | Enterprise | Capital" to **"Workshops | Cohort | Enterprise"** (Capital remains a third door under the Enterprise nav dropdown and at `/capital`).
- Reorganised Navigation: Workshops added as slot 1; Operator dropdown renamed to "Resources" and now includes How I Operate, Library, The Builder Economy, and Lightning Lessons; the standalone Library nav item retired in favour of the Resources dropdown.
- NewHero: added "Or start with a free lesson →" tertiary link below the primary CTAs (linking to `https://maven.com/mindmaker`); subheadline updated to "Workshops, cohorts, and enterprise sprints that turn AI chaos into direction."
- Added `src/lib/stripe-prices.ts` with all canonical Stripe product and price IDs (workshops + cohort + alumni). Workshop and Cohort IDs are referential (Maven collects). The Alumni Pass is the only product the site charges via Stripe; the live checkout flow is invitation-gated and not shipped in this pass.
- Extended `PreCallQualifier` with new routing rules: "technical-build + this-quarter" → Workshop, "personal-clarity + exploring" → Free Lightning Lesson.
- Extended `send-lead-email` `programLabels` map to include workshop/alumni/free-lesson values.
- Updated `LightningLessons` to confirm five lessons with the canonical free-lesson URLs.

**Why:**
- Maven price gravity for senior-leader cohorts sits at $2,500. The previous $3,500 price was fighting the market.
- A single $3,500 price point left no entry rung for buyers who weren't yet ready for the cohort. Workshops at $599 give them a real, paid, build-with-me first step.
- Retention had no product. The Alumni Pass formalises continuity for buyers post any engagement, with a frictionless price.
- The site needed to make a cold buyer think "Mindmaker is the operator-led AI advisory I want to work with" *first*, with Maven as the enrolment mechanic. The ladder restructure reinforces that direction.

**Files Created:**
- `src/lib/stripe-prices.ts`
- `src/pages/Workshops.tsx`
- `src/pages/workshops/WorkshopPage.tsx`
- `src/pages/workshops/BuildYourAIChiefOfStaff.tsx`
- `src/pages/workshops/MapYourAgenticOrgChart.tsx`
- `src/pages/workshops/VibeCodingForLeaders.tsx`
- `src/pages/workshops/BuildAnAutonomousBusinessFunction.tsx`
- `src/pages/workshops/GiveYourAIMemory.tsx`
- `src/pages/Alumni.tsx`

**Files Updated:**
- `src/App.tsx` (new routes), `src/components/Navigation.tsx`, `src/components/NewHero.tsx`, `src/components/YFork.tsx`, `src/components/Footer.tsx`, `src/components/InitialConsultModal.tsx`, `src/components/PreCallQualifier.tsx`, `src/components/SEO.tsx` (added `noindex` prop), `src/pages/Cohort.tsx` (rename, reprice, 4 weeks, new framework, CTRL, $500 workshop-credit callout), `supabase/functions/send-lead-email/index.ts`, `scripts/generate-sitemap.mjs`, `scripts/prerender.mjs`, `public/llms.txt`
- All forward-looking docs in `project-documentation/` (OFFERS, ICP, VALUE_PROP, Master_Messaging_and_FAQ, SALES_PLAYBOOK, BRANDING, ARCHITECTURE, FEATURES, COMMON_ISSUES, DEPLOYMENT, REPLICATION_GUIDE)

---

## 2026-04-26: Documentation Refresh: current-state of repo + sales/marketing anchors

**What Changed:**
- Reconciled all `project-documentation/*` files with the actual codebase as of 2026-04-26 (commits since 2026-04-23 added Immersion, New Age Leadership, Maven Cohort integration, PreCallQualifier chip rebuild, and several copy/UX fixes)
- Renamed the `/signal` nav label across all docs from "The Brief" → **Live Intel** (matches `Navigation.tsx` line 46)
- Corrected Revenue Architecture duration: **30 days (4–5 calendar weeks)**. was incorrectly documented as 8–12 weeks
- Corrected Signal Session deliverable: **15–20 page Commercial Narrative within 48 hours**. was incorrectly documented as 5–10 page thesis within 5 business days
- Documented `/immersion` (The AI Immersion, $12,000, inquiry-only) and `/new-age-leadership` (long-form thought leadership)
- Documented Maven as the canonical Cohort enrolment platform (`https://maven.com/mindmaker/the-ai-fluent-executive`), the "Hosted on Maven" pill, and the "Reserve my seat on Maven" CTA
- Documented the rebuilt `PreCallQualifier` (now chip-based with 3 stages: decision → timeline → stakes)
- Documented Lightning Lessons (4 external Maven course links surfaced in the Resources nav)
- Added two new docs:
  - `SALES_PLAYBOOK.md`. single ground-truth doc for AI sales/marketing agents (ICP firmographic + psychographic signals, pain → offer mapping, value driver matrix, ROI math, discovery question bank, objection bank, channel-specific message templates, competitive grid, disqualifiers, routing logic, lead-email anatomy, sales hygiene rules, quick reference card)
  - References integrated across `README.md`, `OFFERS.md`, `OUTCOMES.md`, `Master_Messaging_and_FAQ.md`
- Documented `send-lead-email` upgrade to Gemini company research with Google Search grounding (3× retry with exponential backoff)
- Documented the Immersion-specific 3-phase format (alignment / 4-hr session / 2-page summary in 5 business days, Diagnose → Decompose → Decide → Deploy)
- Documented Cohort curriculum (Week 1 Name the decision / Week 2 Map the paths / Week 3 Make the call), walk-out artefacts (1-page memo, trade-off doc, 90-day Slack, lifetime curriculum, alumni network), and refund policy
- Cleaned up stale technical references: dropped "All Enterprise" footer link from nav docs; dropped 8–12 week and 5–10 page legacy specs; updated edge-function docs to reflect Gemini-first lead enrichment
- Added explicit benefits, ICP signals, outcomes, and sales/marketing anchors throughout so AI agents can ground confidently

**Why:**
- Documentation lagged ~3 days behind the most recent codebase work (Immersion + NewAgeLeadership ship + UX audit + Maven integration polish), and was carrying multiple legacy specs that contradicted the live site (RA duration, Signal Session deliverable, nav label)
- AI sales and marketing agents need a single, structured, retrieval-friendly document to ground on, `SALES_PLAYBOOK.md` is now that document
- The user explicitly requested: "fully up to date with the current state of the repo… benefits, ICP, outcomes and sales/marketing anchors so that my sales and marketing AI agents can sell this at scale… ensure nothing old remains"

**Files Created:**
- `project-documentation/SALES_PLAYBOOK.md`

**Files Rewritten:**
- `README.md`, `PURPOSE.md`, `VALUE_PROP.md`, `ICP.md`, `OFFERS.md`, `OUTCOMES.md`, `BRANDING.md`, `Master_Messaging_and_FAQ.md`, `ARCHITECTURE.md`, `FEATURES.md`

**Files Surgically Updated:**
- `DESIGN_SYSTEM.md`, `VISUAL_GUIDELINES.md`, `DEPLOYMENT.md`, `COMMON_ISSUES.md`, `REPLICATION_GUIDE.md`, `HISTORY.md`, `DECISIONS_LOG.md`

**Files Untouched (research artefacts, intentionally preserved):**
- `EXECUTIVE_SUMMARY.md`, `LLM_CRITICAL_THINKING_TRAINING.md`, `mindmaker_rebuild_brief_v4.md`

---

## 2026-04-23: Documentation Upgrade: Barbell + Operator's Edge Alignment

**What Changed:**
- Rewrote business documentation to reflect the v4 barbell pivot and v5 Operator's Edge addition (both captured in `mindmaker_rebuild_brief_v4.md`)
- Replaced `SPRINTS.md` with `OFFERS.md` covering The AI Decision Cohort ($3,500/seat), The Signal Session ($15,000), and The Revenue Architecture ($60,000–$100,000). Retired 1:1 sprint framing from public documentation
- Retired the Builder / Orchestrator ICP split in favour of AI leaders (Cohort) vs AI products (Enterprise)
- Removed the "What's your nervous decision?" CTA from documentation; primary CTA is now "Book a call" everywhere
- Renamed the `/signal` surface from "Signal Desk" to "The Operator's Brief" (to avoid overlap with Krish's separate business, Signal & Noise)
- Renamed editorial taxonomy from SIGNAL / NOISE / DECISION / TAKE to WATCH / SKIP / CALL / TAKE
- Documented the v5 `OperatorsEdge` section and `/operator` page as credential surfaces
- Documented `/tool` deletion (Nervous Decision Machine now embedded on homepage + `/signal`)
- Documented Builder Economy as an external sister domain (`thebuildereconomy.com`), no longer a Mindmaker product
- Updated `PreCallQualifier` as the replacement for the retired ChatBot / "Ask Mindmaker"
- Updated architecture to reflect Anthropic Haiku 4.5 for `nervous-decision-machine`, `get-model-data` for PriceTicker, and the `ALLOWED_MODEL_IDS` allowlist

**Why:**
- Documentation lagged ~2 months behind the barbell pivot in the codebase and the CLAUDE.md reference
- Salespeople, content writers, and AI agents reading the docs were receiving stale product names, stale CTA copy, and stale ICP framing
- `mindmaker_rebuild_brief_v4.md` was updated; downstream docs weren't

**Files Created:**
- `project-documentation/OFFERS.md`

**Files Deleted:**
- `project-documentation/SPRINTS.md` (superseded by OFFERS.md)

**Files Rewritten:**
- `README.md`, `PURPOSE.md`, `VALUE_PROP.md`, `ICP.md`, `OUTCOMES.md`, `BRANDING.md`, `Master_Messaging_and_FAQ.md`, `ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`, `COMMON_ISSUES.md`, `REPLICATION_GUIDE.md`

**Files Surgically Updated:**
- `DESIGN_SYSTEM.md` (CTA + card + retired patterns), `VISUAL_GUIDELINES.md` (homepage scroll + retired patterns), `HISTORY.md`, `DECISIONS_LOG.md`

**Files Unchanged (research, not business content):**
- `EXECUTIVE_SUMMARY.md`, `LLM_CRITICAL_THINKING_TRAINING.md`. noted in `README.md` as research artefacts

---

## 2026-03-03: Documentation Refresh & SPRINTS.md

**What Changed:**
- Created SPRINTS.md, comprehensive sprint guide with full ICP profiles, week-by-week breakdowns, deliverables, and outcomes for both 4-Week and 90-Day sprints
- Updated all project documentation dates to 2026-03-03
- Added SPRINTS.md references to README, ICP, FEATURES, OUTCOMES, and documentation index
- Updated DESIGN_SYSTEM.md with brand-specific component patterns (CTA buttons, sprint cards, media easter eggs)
- Updated VISUAL_GUIDELINES.md with homepage scroll experience visual spec and media easter egg visual philosophy
- Marked Q1 2026 roadmap items as completed in FEATURES.md

**Why:**
- Sprint documentation needed a single, authoritative source with full detail for both ICPs
- Week-by-week breakdowns were described in CLAUDE.md implementation guide but not in standalone documentation
- Design system and visual guidelines were behind on brand vision 11/10 patterns

**Files Created:**
- `project-documentation/SPRINTS.md`

**Files Updated:**
- All 15 project-documentation files (dates and cross-references)
- Root `README.md`
- `CHANGELOG.md`

---

## 2026-02-25: Brand Vision 11/10: Complete Transformation

**What Changed:**
- Complete brand repositioning: "AI advisory" → "anti-consultancy for nervous decisions"
- Framework language established: Mind Set → Mind Map → Mind Make
- Products simplified: 6+ offerings → 2 core sprints (4-Week, 90-Day)
- Hero rewritten with rotating "nervous decisions" instead of benefits
- Created FrameworkJourney component (visual Mind Set → Mind Map → Mind Make)
- Builder/Orchestrator ICP split in TheProblem section
- ProductLadder simplified to 2-card sprint chooser
- SimpleCTA rewritten ("You've been pitched enough.")
- CTA language updated everywhere to "What's your nervous decision?"
- Created Sprint4Week.tsx and Sprint90Day.tsx detail pages
- Created Sprints.tsx overview/chooser page
- Navigation updated (removed old products, added sprint links)
- Redirects added for old product URLs
- Media easter egg components created (VideoDrawer, AudioPlayer, ArtifactPreview, ExpandableQuote)
- All project documentation rewritten to match new brand spec
- Chatbot rebranded: "Chat with Krish" → "Ask Mindmaker"
- Diagnostic rebranded: "AI Leadership Benchmark" → "Decision Readiness Diagnostic"
- News ticker prompt updated with SIGNAL/NOISE/DECISION/TAKE categories

**Why:**
- Previous positioning was corporate and undifferentiated
- Leaders don't need more AI advice, they need to make decisions
- "Nervous decisions" as entry point resonates more than feature lists
- Two-sprint model reduces choice paralysis
- Anti-consultancy positioning creates clear market differentiation

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Files Created:**
- `src/pages/Sprint4Week.tsx`
- `src/pages/Sprint90Day.tsx`
- `src/pages/Sprints.tsx`
- `src/components/FrameworkJourney.tsx`
- `src/components/MediaEasterEggs/VideoDrawer.tsx`
- `src/components/MediaEasterEggs/AudioPlayer.tsx`
- `src/components/MediaEasterEggs/ArtifactPreview.tsx`
- `src/components/MediaEasterEggs/ExpandableQuote.tsx`
- `CLAUDE.md` (brand vision implementation guide)

**Files Modified:**
- `src/components/NewHero.tsx` (nervous decisions headlines)
- `src/components/TheProblem.tsx` (Builder/Orchestrator fork)
- `src/components/ProductLadder.tsx` (2-card sprint chooser)
- `src/components/SimpleCTA.tsx` (new copy)
- `src/components/TrustSection.tsx` (Krish bio + testimonials)
- `src/components/Navigation.tsx` (updated nav structure)
- `src/App.tsx` (new routes + redirects)
- All project-documentation files

---

## 2026-01-08: Scroll Hijack v2 + Hero Scrollbar PERMANENT Fix

**What Changed:**
- Scroll hijack rewritten with continuous monitoring + snap-to-position
- Hero scrollbar fix made permanent with 7 defense layers
- Replaced IntersectionObserver with continuous scroll listener for scroll hijack

**Why:**
- IntersectionObserver is async and missed fast scrolling
- Previous hero fix only addressed 1 of 17 contributing factors

**Files Modified:**
- `src/hooks/useScrollHijack.ts`, `src/hooks/useScrollDirection.ts`
- `src/components/ShowDontTell/ChaosToClarity.tsx`, `BeforeAfterSplit.tsx`
- `index.html`, `src/index.css`, `src/components/NewHero.tsx`

---

## 2026-01-06: Hero Scrollbar Flash & Drawer Positioning Fix

**What Changed:**
- Fixed horizontal scrollbar flash on page load
- Fixed side drawer content cut off behind navbar
- Added navbar-aware sheet positioning system

**Files Modified:**
- `src/index.css`, `src/components/NewHero.tsx`, `src/components/ActionsHub.tsx`

---

## 2026-01-05: Text Contrast System Fix

**What Changed:**
- Fixed WCAG AA contrast failures on dark backgrounds
- Added `dark-cta-card` component class and `dark-card-*` utilities

**Files Modified:**
- `src/index.css`, `tailwind.config.ts`, multiple page/component files

---

## 2026-01-XX: Builder Profile Pipeline Fixes

**What Changed:**
- Fixed Builder Profile to use correct system prompt
- Added mode detection in chat-with-krish edge function
- Improved fallback quality with LLM-generated responses

---

## 2026-01-26: SEO Implementation Complete

**What Changed:**
- Comprehensive SEO (10/10 score)
- Structured data / Schema.org markup
- robots.txt and sitemap.xml

---

## 2025-01-25: Vertex AI RAG Migration

**What Changed:**
- Chatbot migrated from OpenAI to Vertex AI RAG with Gemini 2.5 Flash
- Custom business knowledge corpus integrated
- Anti-fragile error handling

---

## 2025-12-14: AI Leadership Benchmark Diagnostic (now Decision Readiness Diagnostic)

**What Changed:**
- Created `/leaders` diagnostic page
- 6-question diagnostic with score/tier classification
- Optional personalization + email unlock
- Self-serve lead qualification

---

## 2025-12-13: Production Readiness Audit

**What Changed:**
- Removed duplicate ChatBot component
- Fixed faqItems hoisting bug
- Updated SEO schema dates
- Added accessibility improvements

---

## 2025-12-02: Navigation UX Improvements

**What Changed:**
- Scroll-to-top behavior for navigation buttons
- Smooth scrolling for page transitions

---

## 2025-12-01: Remove $50 Hold & Lead Intelligence

**What Changed:**
- Paused Stripe $50 hold
- Direct Calendly booking
- Lead enrichment via OpenAI company research
- Send-lead-email edge function

---

## 2025-11-25: CTA Flow Redesign

**What Changed:**
- InitialConsultModal created
- All CTAs route through single modal
- Sprint/program selection in booking flow

---

## 2025-11-24: Design System & Stripe

**What Changed:**
- Ink + Mint two-color system
- Comprehensive design tokens
- Stripe authorization holds ($50, now paused)

---

## 2025-11-23: Initial Platform Launch

**Features Launched:**
- Hero with particle animation
- Product offerings
- AI news ticker
- Chat assistant
- Navigation + Footer
- Legal pages

---

## 2025-11-22: Project Initialization

**What Changed:**
- Lovable project created
- Repository initialized
- Supabase Cloud enabled
- Base dependencies installed

---

## Evolution Timeline

### Phase 1: Foundation (Nov 2025)
- Project setup, design system, core landing page

### Phase 2: Content (Nov-Dec 2025)
- Program pages, trust elements, legal pages

### Phase 3: Interactions (Dec 2025)
- AI chatbot, interactive demos, animations

### Phase 4: Conversion (Dec 2025)
- Stripe integration, booking flow, Calendly

### Phase 5: Lead Gen (Dec 2025-Jan 2026)
- AI Leadership Benchmark diagnostic, lead intelligence, Stripe paused

### Phase 6: AI Backend (Jan 2026)
- Vertex AI RAG migration, Builder Profile fixes

### Phase 7: Polish (Jan 2026)
- WCAG compliance, scroll hijack, hero fixes

### Phase 8: Brand Vision 11/10 (Feb 2026)
- Complete brand repositioning
- Mind Set → Mind Map → Mind Make framework
- 2-sprint product model (4-Week, 90-Day), superseded by the v4 barbell
- "What's your nervous decision?" CTA, superseded by "Book a call" in v4
- Builder/Orchestrator ICP split, superseded by AI leaders / AI products in v4
- Media easter egg components
- All documentation rewritten

### Phase 9: Barbell Pivot (v4, early 2026)
- Retired 1:1 sprint products from the public site
- Introduced The AI Decision Cohort ($3,500/seat, quarterly)
- Introduced enterprise-only pricing: Signal Session $15k, Revenue Architecture $60–100k
- Repositioned the homepage Y-fork (AI leaders vs AI products)
- New `/cohort` and `/enterprise` pages
- Redirects for `/sprints`, `/sprint/4-week`, `/sprint/90-day`, `/war-room`, `/strategy-day`, `/fractional-caio`

### Phase 10: Operator's Edge (v5, 2026)
- Added `OperatorsEdge` homepage section (typography-only credential frame)
- Added `/operator` credential page with 14-agent static diagram
- Renamed Signal Desk → The Operator's Brief
- Renamed editorial taxonomy → WATCH / SKIP / CALL / TAKE
- Deleted `/tool` page (Nervous Decision Machine now embedded)
- ChatBot retired; replaced by `PreCallQualifier` floating pill
- CTA copy unified to "Book a call" everywhere

### Phase 11: Documentation Upgrade (Apr 2026)
- Rewrote all business documentation to match the v4/v5 state
- Replaced `SPRINTS.md` with `OFFERS.md`
- Updated architecture, features, deployment, common issues, and replication docs

---

## Lessons Learned

### What Worked
- Starting with clear design system
- Component-first development
- Deferring auth until needed
- Vertex AI RAG for business-specific knowledge
- Anti-fragile error handling
- CSS-first solutions
- Design tokens for contrast compliance
- Two-sprint simplification (less choice = more conversion)
- "Nervous decisions" as entry point

### What Changed
- Multi-CTA → Single modal entry
- Stripe-first → Stripe paused → Direct Calendly
- Complex color system → Two-color simplicity
- 6+ products → 2 sprints
- Corporate voice → Anti-consultancy voice
- "Book a call" → "What's your nervous decision?"
- "AI Leadership Benchmark" → "Decision Readiness Diagnostic"
- "Chat with Krish" → "Ask Mindmaker"

### What to Avoid
- Hardcoding colors (use tokens)
- Over-engineering product selection
- Multiple entry points (confusing)
- Corporate language ("transformation", "leverage", "synergy")
- Using mint text on light backgrounds
- Low-contrast text on dark backgrounds
- Generic fallback templates
- Inline styles for critical CSS

---

**End of HISTORY**
