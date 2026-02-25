# History

**Last Updated:** 2026-02-25

---

## 2026-02-25: Brand Vision 11/10 — Complete Transformation

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
- Leaders don't need more AI advice — they need to make decisions
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
- 2-sprint product model (4-Week, 90-Day)
- "What's your nervous decision?" CTA
- Builder/Orchestrator ICP split
- Media easter egg components
- All documentation rewritten

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
