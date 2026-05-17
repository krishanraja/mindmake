# Decisions Log

**Last Updated:** 2026-05-17

---

## Brand & Product Decisions

### 2026-05-17: `/signal` nav label updated from "Live Intel" to "Mindmaker LIVE" (wordmark)

**Decision:** The nav slot for `/signal` is now labelled **"Mindmaker LIVE"** and rendered as a branded wordmark via the `MindMakerWordmark` component. "Live Intel" and "The Operator's Brief" remain acceptable in body copy on `/signal`, but the nav label is exclusively "Mindmaker LIVE".

**Context:** "Live Intel" was accurate but read generically. "Mindmaker LIVE" ties the editorial surface to the Mindmaker brand wordmark, reinforcing the newsletter / Substack identity and the `MindMakerLiveSection` added to the homepage.

**Impact:**
- `Navigation.tsx`: `label: "Mindmaker LIVE"` with `wordmark: true`
- All documentation updated. "Live Intel" added to retired-nav-label list in `BRANDING.md` and `COMMON_ISSUES.md`.

---

### 2026-05-17: `MindMakerLiveSection` added to homepage (section 9)

**Decision:** A Substack newsletter subscribe surface (`MindMakerLiveSection.tsx`) is inserted between `OperatorsBrief` and `SimpleCTA` on the homepage. Three-pillar layout (Headlines / Resources / Perspectives) on a dark (`bg-ink`) background with a `SubstackSubscribeForm`.

**Context:** The Mindmaker Live newsletter is a separate top-of-funnel asset from the Live Intel dashboard at `/signal`. The section gives the newsletter its own homepage surface without cannibalising the existing Live Intel teaser (`OperatorsBrief`).

**Impact:** Homepage scroll goes from 10 to 11 sections. `Index.tsx` updated. No route change.

---

### 2026-05-15: v6 ladder restructure (Workshops + Alumni Pass added; Cohort renamed and repriced)

**Decision:** Site restructured from a barbell (Cohort + Enterprise) into a four-rung ladder: free Lightning Lessons → paid Workshops at $599 → AI-Fluent Executive Cohort at $2,500 → Enterprise from $15,000, with the Alumni Pass at $1,500/year as continuity. Cohort renamed from "The AI Decision Cohort" to "The AI-Fluent Executive". Curriculum expanded from "Name → Map → Make" (3 weeks) to "Diagnose → Decompose → Decide → Deploy" (4 weeks). Capital remains a third door for funds but is moved off the homepage tri-fork (still reachable from the Enterprise nav dropdown and `/capital`).

**Sub-decisions:**
1. **Cohort rename and reprice ($3,500 → $2,500; "AI Decision Cohort" → "The AI-Fluent Executive").** Maven's price gravity for senior-leader cohorts sits at $2,500 (Rohan/Aman/Satya comp set at $2,500); going above that fights gravity. The new name matches the live Maven page and is more outcome-specific.
2. **Workshops launched at $599.** Maven's average course is ~$500; the operator-led workshop format (Rupa Chaturvedi's $849 comp) sells well to leaders + operators. $599 is the entry price, with room to lift after early traction.
3. **Alumni Pass launched at $1,500/year.** Retention is the moat the site doesn't currently sell. Group-only, quarterly, alumni-gated, frictionless cancel = continuity not capacity.
4. **CTRL surfaced as a Cohort and Workshop benefit.** The live Maven Cohort page already includes CTRL; site documentation lagged.
5. **Duration corrected from 3 weeks to 4 weeks; framework corrected from Name → Map → Make to Diagnose → Decompose → Decide → Deploy.** Matches the live Maven page. Site docs were stale.

**Context:**
- Maven is a sales channel, not the centre of gravity. The site is the brand. The ladder makes it easy for any cold buyer to find the right rung.
- The pre-rename Cohort name ("AI Decision Cohort") was internally focused. "The AI-Fluent Executive" reframes it around the buyer outcome.
- Workshops are deliberately one-day, build-with-me, deployed-on-real-surfaces: the inverse of every "AI for executives" course on the market.

**Impact:**
- New routes: `/workshops`, `/workshops/[slug]` (×5), `/alumni` (`noindex`, unlinked from nav and footer)
- Stripe price IDs added in `src/lib/stripe-prices.ts` for all five workshops, the cohort (full + 2× split), and the Alumni Pass. Workshop and Cohort IDs are referential (Maven collects). The Alumni Pass is the only product the site itself charges via Stripe.
- The dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` has been replaced everywhere with `maven.com/mindmaker/the-ai-fluent-executive`
- All forward-looking documentation in `project-documentation/` updated; historical entries in `HISTORY.md` and earlier `DECISIONS_LOG.md` entries preserved as-is

---

### 2026-04-26: Revenue Architecture compresses to 30 days (was 8–12 weeks)

**Decision:** The Revenue Architecture engagement runs for **30 days (4–5 calendar weeks)**, not 8–12 weeks. Live in `src/pages/Enterprise.tsx` as the canonical duration.

**Context:**
- The 8–12 week framing pre-dated Krish's full agentic OS being in production; it assumed a discovery phase that's no longer needed
- Pattern recognition from the operator side has compressed the engagement; associates aren't part of the model
- 30 days matches the natural calendar quarter cadence of enterprise buyers and removes the risk of the engagement outliving the problem

**Rationale:**
- Speed is a differentiator vs Big 4 (6-month engagements with associates)
- A fixed 30-day clock keeps scope honest and prevents creep
- The 30-day follow-up session included in the price covers the "what changed once it's in market" loop

**Impact:**
- All sales materials, doc copy, outbound templates, and proposal scaffolds must reference 30 days
- Updated in `OFFERS.md`, `VALUE_PROP.md`, `OUTCOMES.md`, `Master_Messaging_and_FAQ.md`, `SALES_PLAYBOOK.md`, `BRANDING.md` (retired-spec list), and `FEATURES.md`

---

### 2026-04-26: Signal Session deliverable is the Commercial Narrative (15–20 pages, 48 hours)

**Decision:** The Signal Session output is the **Commercial Narrative**, a 15–20 page document delivered within 48 hours, plus a 2-page positioning framework, sales narrative + objection guide, pricing sketch, and 30-day commercial roadmap. Replaces the older "5–10 page thesis within 5 business days" framing.

**Rationale:**
- 48-hour delivery is a forcing function for sharpness; 5 business days made the day feel like a workshop
- 15–20 pages is the right depth: it covers positioning, pricing, sales narrative, and 90-day priorities without becoming a McKinsey deck
- "Commercial Narrative" is a stronger, more specific name than "thesis" or "report"

**Impact:**
- Updated in all sales-facing docs (`OFFERS.md`, `VALUE_PROP.md`, `OUTCOMES.md`, `SALES_PLAYBOOK.md`, `Master_Messaging_and_FAQ.md`, `FEATURES.md`)
- Outbound and email templates now reference the 48-hour Commercial Narrative explicitly

---

### 2026-04-26: Cohort enrolment runs on Maven

**Decision:** Cohort enrolment, payment, the cohort Slack, and the alumni network all run on **Maven** at `https://maven.com/mindmaker/the-ai-fluent-executive`. The `/cohort` page surfaces a "Hosted on Maven" pill and a "Reserve my seat on Maven" CTA pointing directly at the Maven URL.

**Context:**
- The cohort's experience-side workflow (community Slack, alumni continuity, payments, repeat enrolment) was being patched together; Maven solves all of these in one place
- Maven also provides discovery distribution that improves cohort fill at marginal cost

**Rationale:**
- One source of truth for the cohort experience reduces ops overhead for a solo operator
- Direct-to-Maven CTA on `/cohort` lets buyers who already know the cohort is the right fit skip the consult call

**Impact:**
- The "Book a call" path remains for buyers who need to qualify; it's no longer the only path on `/cohort`
- All sales scripts, email follow-ups, and outbound messages reference the Maven URL when Cohort is the recommended offer
- Internal: cohort dates and seat counts continue to be managed via the `nextCohort` const in `Cohort.tsx` until a Supabase `cohort_dates` table replaces it

---

### 2026-04-26: The AI Immersion launched as an inquiry-only fourth offer

**Decision:** Launch a fourth offer, **The AI Immersion** ($12,000, 4-hour facilitated session, 2-page summary within 5 business days, up to 8 senior leaders), at `/immersion`, **inquiry-only**. Not promoted on the homepage or in the main nav; surfaced only when the buyer's actual need is team alignment rather than an individual decision or commercial rebuild.

**Rationale:**
- A genuine subset of inbound buyers ask for "a strategy day" or "leadership offsite" where the right shape is a 4-hour facilitated session, not the Cohort and not Enterprise
- Inquiry-only positioning keeps the offer from cannibalizing Cohort or Enterprise; the headline barbell stays clean
- Diagnose → Decompose → Decide → Deploy protocol matches the Cohort framework, so the operator load is low

**Guardrails:**
- Max 8 leaders (format breaks past that)
- No recording (kills candor)
- No multi-session (we don't run multi-session Immersions)
- Substitution disallowed (the format depends on the actual leaders being present)

**Impact:**
- New page at `/immersion`, lazy-loaded in `App.tsx`
- ICP 3 added to `ICP.md` (Executive Teams)
- Sales playbook routes "team alignment" pain → Immersion via inquiry only

---

### 2026-04-26: New Age Leadership promoted from hidden to Resources nav

**Decision:** `/new-age-leadership` (long-form thought leadership on agent-native org charts) moved into the Resources dropdown above "How I operate". Builder Economy podcast retained, "All Enterprise" footer link dropped (commit 226ecf1).

**Rationale:**
- Long-form thought leadership is a top-of-funnel asset for the Cohort; surfacing it via Resources lets curious senior leaders reach it without the homepage having to advertise it
- Article-style content lifts SEO and gives outbound a credible "here's what I think about agent-native orgs" payload

**Impact:**
- `Navigation.tsx` Resources dropdown reorders: New Age Leadership → How I operate → Blog → Builder Economy (external) → Lightning Lessons
- Schema.org `Article` JSON-LD on the page; lazy-loaded `OrgChart` component to keep hero LCP fast

---

### 2026-04-26: PreCallQualifier rebuilt as chip-based 3-step intake

**Decision:** `PreCallQualifier` is now chip-based across all three stages (decision → timeline → stakes), each with 5–6 chip options plus an "other" / textarea fallback on the decision step. Replaces the previous text-entry version.

**Rationale:**
- Free-text intake produced lower completion rates and noisier classification
- Chip selection produces structured, classifiable answers that map cleanly to offer recommendation
- Mobile experience is materially better with chips than with text entry

**Impact:**
- `classify()` function in `PreCallQualifier.tsx` deterministically maps {decision, timeline, stakes} → {Cohort | Signal Session | Revenue Architecture}
- Plausible event `pre_call_qualifier_completed` fires on book-a-call; gives a leading indicator on qualifier-to-meeting conversion
- Storage: `localStorage` under `mindmaker:pre-call-qualifier`, version 2

---

### 2026-04-26: `/signal` nav label is "Live Intel" (was "The Brief")

**Decision:** The second-top-level nav slot is labelled **"Live Intel"**. "The Operator's Brief" is acceptable in editorial body copy on `/signal`, but is no longer the nav label.

**Rationale:**
- "The Brief" tested fine internally but read as opaque to first-time visitors
- "Live Intel" says exactly what the surface is: live model pricing, live signals, live decision tool

**Impact:**
- `Navigation.tsx` line 46
- Updated everywhere in docs; old "The Brief" / "Signal Desk" labels added to retired-terminology lists in `BRANDING.md`, `COMMON_ISSUES.md`, and `SALES_PLAYBOOK.md`

---

### 2026-04-23: Documentation Upgrade: Align all docs with v4/v5 barbell state

**Decision:** Rewrite all business documentation and surgically update technical documentation to match the v4 barbell pivot and v5 Operator's Edge, as captured in `mindmaker_rebuild_brief_v4.md` and `CLAUDE.md`.

**Context:**
- `mindmaker_rebuild_brief_v4.md` and `CLAUDE.md` reflected the barbell (Cohort + Enterprise, no middle) and the Operator's Edge additions
- Downstream documentation (README, PURPOSE, VALUE_PROP, ICP, SPRINTS, OUTCOMES, BRANDING, Master_Messaging, ARCHITECTURE, FEATURES, DEPLOYMENT, COMMON_ISSUES, REPLICATION_GUIDE) still referenced 4-Week and 90-Day sprints, Builder/Orchestrator ICPs, "What's your nervous decision?" as a CTA, "Signal Desk", SIGNAL/NOISE/DECISION/TAKE taxonomy, a standalone `/tool` page, the ChatBot, and CTRL / Builder Economy as Mindmaker products
- Salespeople, content writers, and AI agents consuming the docs were getting stale answers

**Key changes across docs:**
- **Offers:** 4-Week / 90-Day / Extended Sprint → The AI Decision Cohort ($3,500/seat) + The Signal Session ($15k) + The Revenue Architecture ($60–100k). No middle tier. No 1:1 sprints on the public site.
- **ICPs:** Builder / Orchestrator → AI leaders (cohort buyer) / AI products (enterprise buyer)
- **CTA:** "What's your nervous decision?" → "Book a call" (as a button label everywhere; the diagnostic question can still appear in body copy)
- **Editorial surface:** "Signal Desk" → "The Operator's Brief" at `/signal`
- **Taxonomy:** SIGNAL / NOISE / DECISION / TAKE → WATCH / SKIP / CALL / TAKE
- **Nervous Decision Machine:** standalone `/tool` page → embedded on homepage `OperatorsBrief` + `/signal`
- **ChatBot / Ask Mindmaker:** retired → `PreCallQualifier` floating pill
- **Builder Economy:** Mindmaker product → external sister domain (`thebuildereconomy.com`)
- **Credential surfaces added:** `OperatorsEdge` homepage section + `/operator` page (v5)

**Rationale:**
- Documentation that contradicts the codebase produces bad content, bad pitches, and bad PRs
- The v4 barbell is now ~2 months old in the codebase; salespeople reading docs had no authoritative reference
- Consolidating sprint doc into `OFFERS.md` removes the "sprint" framing from contexts that no longer sell sprints

**Files created:** `OFFERS.md`
**Files deleted:** `SPRINTS.md`
**Files rewritten:** `README.md`, `PURPOSE.md`, `VALUE_PROP.md`, `ICP.md`, `OUTCOMES.md`, `BRANDING.md`, `Master_Messaging_and_FAQ.md`, `ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`, `COMMON_ISSUES.md`, `REPLICATION_GUIDE.md`
**Files surgically updated:** `DESIGN_SYSTEM.md`, `VISUAL_GUIDELINES.md`, `HISTORY.md`, `DECISIONS_LOG.md`
**Files left untouched:** `EXECUTIVE_SUMMARY.md`, `LLM_CRITICAL_THINKING_TRAINING.md`, `mindmaker_rebuild_brief_v4.md` (flagged as research / authoritative source respectively)

---

### 2026-03-03: Comprehensive Sprint Documentation (SPRINTS.md)

**Decision:** Create a single authoritative document covering both ICPs in full detail alongside complete sprint breakdowns, deliverables, and outcomes.

**Context:**
- ICP profiles existed in ICP.md but lacked sprint-specific detail
- Sprint descriptions existed in FEATURES.md and OUTCOMES.md but were split across files
- Week-by-week and month-by-month breakdowns were only in CLAUDE.md (implementation guide) and sprint page source code
- No single document answered "who are the ICPs, what does each sprint look like for them, and what do they get"

**Rationale:**
- Sales conversations, onboarding, and content creation all need one reference document
- Builders and Orchestrators have different nervous decisions and different sprint experiences, this needed to be explicit
- Week-by-week detail builds confidence for prospects evaluating the sprint

**What SPRINTS.md Covers:**
- Full ICP 1 (Builder) profile: titles, context, nervous decisions, how they talk, sprint fit, transformation
- Full ICP 2 (Orchestrator) profile: same structure
- Common traits and qualification signals
- 4-Week Sprint: four-week arc, deliverables, ICP-specific examples, 30/90-day outcomes
- 90-Day Sprint: three-month arc with week-by-week breakdown, deliverables, ICP-specific examples, 90-day/6-month outcomes
- Extended Sprint and post-sprint extensions
- Sprint comparison table
- Framework mapping to sprints

**Impact:**
- Single source of truth for sprint-related content
- Cross-referenced from ICP.md, FEATURES.md, OUTCOMES.md, and both READMEs

---

### 2026-02-25: Brand Vision 11/10: Complete Brand Repositioning

**Decision:** Reposition Mindmaker from "professional AI advisory site" to "the anti-consultancy for leaders who are done being sold AI and ready to use it."

**Context:**
- Original positioning was corporate, consultancy-like ("AI Literacy & Strategic Advisory")
- Needed to differentiate from AI consultancies, training companies, and tool vendors
- Brand vision doc created as comprehensive transformation guide (CLAUDE.md)

**Key Changes:**
- **Framework:** Established "Mind Set → Mind Map → Mind Make" as core language
- **Products:** Simplified from 6+ offerings to 2 core sprints (4-Week, 90-Day)
- **Voice:** Corporate → Confident + Cynical + Helpful
- **CTA:** "Book a discovery call" → "What's your nervous decision?"
- **ICPs:** Generic senior leaders → Builder / Orchestrator split
- **Diagnostic:** "AI Leadership Benchmark" → "Decision Readiness Diagnostic"
- **Chatbot:** "Chat with Krish" → "Ask Mindmaker"
- **Hero:** Benefits-based headlines → "Nervous decision" anxiety-based headlines
- **News Ticker:** Generic AI news → SIGNAL/NOISE/DECISION/TAKE categories

**Products Removed:**
- Builder Session (1hr), eliminated
- Leadership Lab (team), demoted, mentioned only post-engagement
- Portfolio Partner, by referral only, no public page

**Products Added:**
- 4-Week Sprint detail page (`/sprint/4-week`)
- 90-Day Sprint detail page (`/sprint/90-day`)
- Sprints overview page (`/sprints`)

**New Components:**
- `FrameworkJourney.tsx`. Mind Set → Mind Map → Mind Make visual performance
- `MediaEasterEggs/VideoDrawer.tsx`. Slide-out video player
- `MediaEasterEggs/AudioPlayer.tsx`. Expandable audio player
- `MediaEasterEggs/ArtifactPreview.tsx`. Hover-to-reveal artifacts
- `MediaEasterEggs/ExpandableQuote.tsx`. Click-to-expand quotes

**Rationale:**
- Leaders don't need more AI advice. They need to decide.
- "Nervous decisions" is the entry point, anxiety drives action
- Anti-consultancy positioning differentiates from crowded market
- Simplicity (2 sprints, 1 framework) is premium

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Impact:**
- Complete homepage scroll redesign (7 blocks)
- New sprint detail pages
- Updated navigation (remove old products, add sprints)
- Redirects for all old product URLs
- Updated all documentation

**Files Affected:** All major components, pages, documentation files

---

### 2026-02-25: Two-Sprint Product Model

**Decision:** Simplify product lineup to two core offerings: 4-Week Sprint and 90-Day Sprint

**Context:**
- Previous model had 6+ products (Session 1hr, Sprint 4wk, Sprint 90d, Lab, Portfolio, Builder Economy)
- Complex state machine in ProductLadder component for path selection
- Users confused by too many options

**Rationale:**
- Two clear options reduces decision fatigue
- 4-Week Sprint = one decision, 90-Day Sprint = full journey
- Extended Sprint (6-month) mentioned as option, not separate product
- Leadership Lab and Portfolio Partner exist but are post-engagement only

**Implementation:**
- Replaced complex ProductLadder state machine with 2-card grid
- Created dedicated pages: Sprint4Week.tsx, Sprint90Day.tsx
- Created overview/chooser: Sprints.tsx
- Old product pages redirect to homepage

**Impact:**
- Clearer user journey
- Simpler codebase
- Better conversion (less choice paralysis)

---

### 2026-02-25: Builder/Orchestrator ICP Split

**Decision:** Split target audience into "Builder" and "Orchestrator" archetypes

**Context:**
- Previous ICPs were generic (CEO, CPO, VP of anything)
- Needed clearer segmentation for sprint recommendations
- Leaders approach AI differently based on leadership style

**Builder:** Wants to build alongside AI. Prototype, ship, create leverage.
**Orchestrator:** Wants to set standards and make clean decisions. Delegates execution, owns outcomes.

**Rationale:**
- Both paths start with Mind Set (clarity)
- Both end with decisions that stick
- But the nervous decisions are different
- Sprint recommendations vary by type

**Impact:**
- Updated TheProblem.tsx with Builder/Orchestrator panels
- Sprints page has path selection (Builder vs Orchestrator)
- Diagnostic recommends type
- Navigation dropdown has Builder/Orchestrator sprint paths

---

## Architecture Decisions

### 2026-01-06: Navbar-Aware Sheet Positioning System

**Decision:** Create CSS variables for navbar height and `.sheet-navbar-aware` class for side drawers

**Context:**
- ActionsHub side drawer content was cut off behind the fixed navbar
- Sheet component used `inset-y-0` from viewport edge (top: 0)
- Navbar is fixed at z-100 covering top 64-80px depending on screen size

**Rationale:**
- CSS-first solution is simpler than JavaScript-based positioning
- CSS variables allow responsive adjustment across breakpoints
- Single class application keeps component code clean

**Implementation:**
```css
--navbar-height: 4rem;      /* 64px - mobile */
--navbar-height-sm: 4.5rem; /* 72px - small screens */
--navbar-height-md: 5rem;   /* 80px - medium+ screens */

.sheet-navbar-aware {
  top: var(--navbar-height) !important;
  height: calc(100dvh - var(--navbar-height)) !important;
}
```

**Files Affected:**
- `src/index.css` (lines 93-96, 647-670)
- `src/components/ActionsHub.tsx`

---

### 2026-01-06: Hero Text Size in CSS Layer

**Decision:** Move hero text sizing from inline styles to CSS `@layer components`

**Context:**
- Horizontal scrollbar briefly flashed during page load
- Global CSS h1 styles (clamp 40-72px) applied before component's inline `<style>` tag

**Rationale:**
- CSS in `@layer components` is parsed earlier than inline `<style>` tags
- Eliminates race condition between global and component styles

**Files Affected:**
- `src/index.css`
- `src/components/NewHero.tsx` (removed inline styles)

---

### 2026-01-05: Dark Card Text Contrast System

**Decision:** Create dedicated design tokens and utilities for text on dark backgrounds

**Context:**
- `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements
- Contrast ratio was below 4.5:1 required for body text

**Rationale:**
- WCAG AA compliance is a legal and ethical requirement
- Design tokens ensure consistent usage across codebase
- Component class (`.dark-cta-card`) makes correct pattern easy to apply

**Implementation:**
```css
--dark-card-heading: 0 0% 100%;  /* Pure white */
--dark-card-body: 0 0% 93%;      /* Off-white for body */
--dark-card-muted: 0 0% 75%;     /* Softer for metadata */
```

**Files Affected:**
- `src/index.css`, `tailwind.config.ts`
- Multiple page and component files

---

### 2026-01-XX: Builder Profile Mode Detection

**Decision:** Detect Builder Profile mode from message content patterns instead of widgetMode parameter

**Context:**
- Builder Profile was sending `widgetMode: 'tryit'` which triggered wrong system prompt
- Result: Generic outputs instead of CEO-grade profiles

**Rationale:**
- System prompt takes precedence over user message content
- Builder Profile needs minimal system prompt that defers to user instructions

**Files Affected:**
- `src/hooks/useAssessment.ts`
- `supabase/functions/chat-with-krish/index.ts`

---

### 2025-01-25: Switch Chatbot to Vertex AI RAG

**Decision:** Migrate `chat-with-krish` edge function to Vertex AI RAG with Gemini 2.5 Flash

**Context:**
- Original implementation used OpenAI GPT-4o-mini
- Client has custom Vertex AI RAG corpus trained on business materials
- Need business-specific knowledge in chatbot responses

**Rationale:**
- Custom RAG corpus provides business-specific knowledge
- Separation of concerns: chatbot uses custom knowledge, news uses general knowledge
- Anti-fragile design ensures UI never breaks on API failures

**Implementation Details:**
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime)
- RAG corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`

---

### 2025-12-14: Self-Serve Diagnostic Lead Gen

**Decision:** Create `/leaders` page with diagnostic for self-serve lead qualification (now "Decision Readiness Diagnostic")

**Rationale:**
- Self-serve lead qualification reduces friction vs booking calls
- Provides immediate value before asking for contact info
- Captures qualified leads through optional unlock form

**UX Decisions:**
- No toasts - all feedback inline
- Progress bars never regress
- Everything fits in viewport on mobile
- Collapsible unlock form

---

### 2025-12-01: Pause Stripe $50 Hold

**Decision:** Remove $50 authorization hold requirement, enable direct Calendly booking

**Rationale:**
- Lower friction in early customer acquisition phase
- Validate demand without payment barrier
- Stripe integration remains live but dormant

---

### 2025-11-25: Single Modal Entry Point

**Decision:** All CTAs route through `InitialConsultModal`

**Rationale:**
- One consistent experience
- Better qualification (sprint selection in modal)
- Unified tracking

---

### 2025-11-24: Ink + Mint Two-Color System

**Decision:** Use only two colors: Ink (#0e1a2b) + Mint (#7ef4c2)

**Rationale:**
- Simplicity = memorability
- Bold, not busy
- Professional without being corporate

---

### 2025-11-23: React Router (Not Next.js)

**Decision:** Use React Router instead of Next.js for SPA

**Rationale:**
- Lovable Cloud optimized for SPA
- No SSR needed (marketing site)
- Simpler deployment

---

### 2025-11-23: Supabase Edge Functions

**Decision:** Use Supabase Edge Functions (Deno) for backend

**Rationale:**
- Serverless, auto-scaling, integrated with Lovable Cloud
- Zero DevOps overhead

---

### 2025-11-23: Calendly Integration

**Decision:** Use Calendly for scheduling, not custom scheduler

**Rationale:**
- Industry standard, handles timezones/conflicts/reminders
- Not core differentiation

---

### 2025-11-23: No User Authentication (Yet)

**Decision:** Defer user authentication implementation

**Rationale:**
- All bookings via Calendly
- No user-generated content yet
- Simpler MVP

**When to Revisit:** When building client portal or community features

---

## Design Decisions

### 2026-01-08: Space Grotesk Variable for Display Typography

**Decision:** Use Space Grotesk Variable for all headings instead of Gobold

**Rationale:**
- Variable fonts = better performance
- Modern, distinctive yet readable
- Pairs well with Inter Variable

---

### 2025-11-24: Animations Sparingly

**Decision:** Use animations for scroll reveals and hover states only

**Where Used:** Scroll reveals, hover states, hero effects
**Where Not Used:** Page transitions, content changes, form interactions

---

## Business Decisions

### 2025-11-23: Founder-Led Sales

**Decision:** Krish personally delivers all sessions initially

**Rationale:**
- Establish quality baseline
- Gather feedback directly
- Refine framework

**When to Scale:** After 50+ successful sessions, when frameworks documented

---

**End of DECISIONS_LOG**
