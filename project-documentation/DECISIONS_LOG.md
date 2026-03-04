# Decisions Log

**Last Updated:** 2026-03-03

---

## Brand & Product Decisions

### 2026-03-03: Comprehensive Sprint Documentation (SPRINTS.md)

**Decision:** Create a single authoritative document covering both ICPs in full detail alongside complete sprint breakdowns, deliverables, and outcomes.

**Context:**
- ICP profiles existed in ICP.md but lacked sprint-specific detail
- Sprint descriptions existed in FEATURES.md and OUTCOMES.md but were split across files
- Week-by-week and month-by-month breakdowns were only in CLAUDE.md (implementation guide) and sprint page source code
- No single document answered "who are the ICPs, what does each sprint look like for them, and what do they get"

**Rationale:**
- Sales conversations, onboarding, and content creation all need one reference document
- Builders and Orchestrators have different nervous decisions and different sprint experiences — this needed to be explicit
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

### 2026-02-25: Brand Vision 11/10 — Complete Brand Repositioning

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
- Builder Session (1hr) — eliminated
- Leadership Lab (team) — demoted, mentioned only post-engagement
- Portfolio Partner — by referral only, no public page

**Products Added:**
- 4-Week Sprint detail page (`/sprint/4-week`)
- 90-Day Sprint detail page (`/sprint/90-day`)
- Sprints overview page (`/sprints`)

**New Components:**
- `FrameworkJourney.tsx` — Mind Set → Mind Map → Mind Make visual performance
- `MediaEasterEggs/VideoDrawer.tsx` — Slide-out video player
- `MediaEasterEggs/AudioPlayer.tsx` — Expandable audio player
- `MediaEasterEggs/ArtifactPreview.tsx` — Hover-to-reveal artifacts
- `MediaEasterEggs/ExpandableQuote.tsx` — Click-to-expand quotes

**Rationale:**
- Leaders don't need more AI advice. They need to decide.
- "Nervous decisions" is the entry point — anxiety drives action
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
