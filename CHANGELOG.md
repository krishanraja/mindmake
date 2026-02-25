# AI MINDMAKER CHANGELOG

**Last Updated:** 2026-02-25

---

## Brand Vision 11/10 — Complete Brand Repositioning (2026-02-25)

### Brand Transformation
- **Positioning:** "AI advisory" → "Anti-consultancy for leaders done being sold AI"
- **Framework:** Established Mind Set → Mind Map → Mind Make as core language
- **Voice:** Corporate → Confident + Cynical + Helpful
- **CTA:** "Book a discovery call" → "What's your nervous decision?"
- **Brand North Star:** Stripe's design sensibility meets Anthony Bourdain's authenticity

### Product Simplification
- **Removed:** Builder Session (1hr), Leadership Lab (team), Portfolio Partner (referral only)
- **Core Products:** 4-Week Sprint + 90-Day Sprint (only two public offerings)
- **Extended Sprint:** 6-month continuation (mentioned, not public)
- **Chatbot:** "Chat with Krish" → "Ask Mindmaker"
- **Diagnostic:** "AI Leadership Benchmark" → "Decision Readiness Diagnostic"

### Homepage Scroll Redesign (7 Blocks)
1. **Hero:** Rotating "nervous decisions" + "What's your nervous decision?" CTA
2. **Framework Journey:** Mind Set → Mind Map → Mind Make visual performance
3. **Who Is This For:** Builder vs Orchestrator fork
4. **Sprint Chooser:** 4-Week vs 90-Day comparison cards
5. **Trust Anchor:** Krish bio + proof points + testimonials
6. **News Ticker:** SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE categories
7. **Final CTA:** "You've been pitched enough."

### New Pages & Routes
- `/sprint/4-week` — 4-Week Sprint detail page
- `/sprint/90-day` — 90-Day Sprint detail page
- `/sprints` — Sprint overview/chooser with Builder/Orchestrator paths

### Redirects
- `/builder-session` → `/`
- `/leadership-lab` → `/`
- `/portfolio-program` → `/`
- `/builder-sprint` → `/sprints`
- `/individual`, `/team`, `/builder` → `/`

### New Components
- `FrameworkJourney.tsx` — Mind Set → Mind Map → Mind Make visual performance
- `Sprint4Week.tsx`, `Sprint90Day.tsx`, `Sprints.tsx` — Sprint pages
- `MediaEasterEggs/VideoDrawer.tsx` — Slide-out video player
- `MediaEasterEggs/AudioPlayer.tsx` — Expandable audio player
- `MediaEasterEggs/ArtifactPreview.tsx` — Hover-to-reveal artifact previews
- `MediaEasterEggs/ExpandableQuote.tsx` — Click-to-expand quotes

### Updated Components
- `NewHero.tsx` — Nervous decision rotating headlines
- `TheProblem.tsx` — Builder/Orchestrator fork
- `ProductLadder.tsx` — 2-card sprint chooser
- `SimpleCTA.tsx` — "You've been pitched enough."
- `TrustSection.tsx` — Krish bio + real testimonials
- `Navigation.tsx` — Updated nav (Sprints dropdown, removed old products)
- `App.tsx` — New routes + redirects

### Documentation
- All project-documentation files rewritten to match brand vision 11/10
- CLAUDE.md created as comprehensive implementation guide

---

## Scroll Hijack v2 - Bulletproof Continuous Monitoring (2026-01-08)

### Problem
The v1 defense-in-depth fix (8 layers) still failed to lock reliably. Root cause: IntersectionObserver is asynchronous and can miss fast scrolling. Lock was triggering at wrong positions.

### Root Causes Identified (v2)
1. **IntersectionObserver is async** - Can miss fast scroll events entirely
2. **No continuous scroll monitoring** - Only relied on event-based detection
3. **No snap-to-position** - Lock captured whatever position existed at trigger moment
4. **Wrong trigger zone math** - 50px gap between trigger and lock condition
5. **Navbar flicker** - useScrollDirection checked wrong CSS class

### Architectural Solution: Continuous Monitoring + Snap

**Key Change: Replace IntersectionObserver with continuous scroll listener**
- Scroll event runs on EVERY scroll (passive listener)
- Checks section position continuously using getBoundingClientRect()
- Snaps to exact target position before locking

**New Parameters:**
- `targetOffset`: Exact distance from viewport top when locked (default: 0)
- `triggerBuffer`: How close to target before lock engages (default: 80px)

**Snap-to-Position Logic:**
1. Detect when section enters trigger zone
2. Calculate ideal scroll position (section.top = targetOffset)
3. Instant scroll to ideal position
4. Lock body AFTER snap completes

### Files Modified
- `src/hooks/useScrollHijack.ts`: Complete rewrite with continuous monitoring
- `src/hooks/useScrollDirection.ts`: Fixed to check both CSS classes
- `src/components/ShowDontTell/ChaosToClarity.tsx`: Removed sentinel, added targetOffset
- `src/components/ShowDontTell/BeforeAfterSplit.tsx`: Removed sentinel, added targetOffset

### Verification
- Continuous scroll monitoring prevents missed triggers
- Snap-to-position ensures exact lock position
- Navbar stays hidden during entire scroll hijack experience
- Both sections lock at correct positions matching screenshots

---

## PERMANENT Scroll Hijack Fix - Defense-in-Depth Architecture (2026-01-08)

### Problem
The ChaosToClarity and BeforeAfterSplit scroll hijack animations were unreliable. Users could escape the scroll lock by scrolling fast enough. 31 root causes identified across 10 categories.

### 31 Root Causes Identified (Categories)
- **A: Scroll Detection Race Conditions (3)** - 16ms throttling, single-point trigger, no anticipation
- **B: Browser Momentum/Inertia (3)** - iOS Safari momentum, missing touch-action, scroll-behavior conflict
- **C: Event Handling Gaps (3)** - Keyboard not blocked, programmatic scroll, history navigation
- **D: Position Maintenance (3)** - RAF too late, lenient threshold, scrollTo delays
- **E: State Management (3)** - Stale state, cooldown vulnerability, completion timing
- **F: Component Conflicts (3)** - Two scroll hijacks, nav direction, no mutual exclusion
- **G: CSS/Layout (3)** - Label overflow, wrong container, max-width edge cases
- **H: Alternative Inputs (3)** - Pointer lock, trackpad gestures, touch inertia
- **I: Missing Patterns (4)** - No sentinel, no IntersectionObserver, no capping, no escape velocity
- **J: Edge Cases (3)** - Mobile keyboard, DevTools, pinch-to-zoom

### Architectural Solution: 8 Defense Layers

**Layer 1: HTML-Level CSS** (`index.html`)
- Critical inline scroll containment before React loads
- `scroll-hijack-locked` class forces `overflow: hidden`, `touch-action: none`, `position: fixed`

**Layer 2: CSS Layer Priority** (`index.css`)
- New `@layer scroll-hijack` loads BEFORE all other layers
- Comprehensive containment rules: `touch-action: none`, `overscroll-behavior: none`
- Kills `scroll-behavior: smooth` during lock

**Layer 3: IntersectionObserver Detection** (`useScrollHijack.ts`)
- Replaces unreliable scroll event detection
- Uses `rootMargin` for anticipatory triggering

**Layer 4: Sentinel Element** (Components)
- Invisible element 100px above section
- Triggers lock preparation before section reaches viewport

**Layer 5: Multi-Event Blocking** (`useScrollHijack.ts`)
- Wheel: `preventDefault`, `stopPropagation` with capture
- Touch: `preventDefault` with capture
- Keyboard: Blocks Arrow, Page, Space, Home, End
- History: Handles `popstate` events

**Layer 6: Instant Position Lock** (`useScrollHijack.ts`)
- `body { position: fixed }` during lock
- Saves/restores scroll position
- Zero drift possible

**Layer 7: Animation Progress Smoothing** (`useScrollHijack.ts`)
- `maxDeltaPerFrame: 0.08` (8% max progress per frame)
- Prevents animation skipping

**Layer 8: Graceful Fast-Forward** (`useScrollHijack.ts`)
- Escape velocity detection (>12 pixels/ms)
- Smoothly completes animation on very fast scroll
- Respects user intent to skip

### Files Created
- `src/hooks/useScrollHijack.ts`: New defense-in-depth scroll hijack hook

### Files Modified
- `index.html`: Added scroll hijack inline CSS
- `src/index.css`: Added `@layer scroll-hijack` with containment rules
- `src/components/ShowDontTell/ChaosToClarity.tsx`: 
  - Uses new `useScrollHijack` hook
  - Added sentinel element
  - Fixed concept label overflow (xRange 90→75)
- `src/components/ShowDontTell/BeforeAfterSplit.tsx`:
  - Uses new `useScrollHijack` hook
  - Added sentinel element
  - Added scroll-hijack-section class

### Verification
- Fast scroll cannot escape lock
- Keyboard navigation blocked during lock
- iOS Safari momentum handled
- Escape velocity triggers graceful completion
- Skip button works at any progress
- No concept labels overflow viewport

### Documentation
- `SCROLL_HIJACK_DIAGNOSIS.md`: Complete diagnosis with test matrix

---

## PERMANENT Hero Scrollbar Fix - Defense-in-Depth Architecture (2026-01-08)

### Problem
The 2026-01-06 scrollbar fix was **incomplete**. The scrollbar still appeared for ~2 seconds because only ONE of 17 contributing factors was addressed.

### 17 Root Causes Identified
1. Font loading flash (async fonts with different metrics)
2. Global h1 override racing with hero-specific styles
3. Inline `<style>` tag applied after React hydration
4. Overflow containers on wrong elements (not decorative elements)
5. Large orbs (384px) with blur-3xl extending beyond viewport
6. Measurement element with `whiteSpace: nowrap` and no width constraint
7. Framer Motion `y: 10` transforms causing vertical overflow
8. useEffect headline validation triggering reflow after first paint
9. GIF background not preloaded
10. `min-h-screen` (100vh) exceeds viewport on iOS Safari
11. Safe area inset delay
12. blur-3xl GPU layer initialization
13. ParticleBackground canvas sizing
14. Navigation fixed positioning
15. CSS variables initialization delay
16. React hydration timing
17. Tailwind JIT compilation race

### Architectural Solution: 7 Defense Layers

**Layer 1: HTML-Level Prevention** (`index.html`)
- Critical inline CSS before any stylesheets: `html, body { overflow-x: hidden !important }`

**Layer 2: CSS Layer Priority** (`index.css`)
- New `@layer hero` loads BEFORE base layer
- Hero containment rules apply from first paint

**Layer 3: No Inline Styles** (`NewHero.tsx`)
- Removed all inline `<style>` tags
- Responsive padding moved to CSS file

**Layer 4: Decorative Containment** (`NewHero.tsx`)
- All background elements use `hero-decoration` class
- CSS forces `overflow: hidden; max-width: 100%` on decorations

**Layer 5: Animation Fix** (`NewHero.tsx`)
- Removed `y` transforms from Framer Motion (opacity-only now)

**Layer 6: Viewport Unit Fix** (`NewHero.tsx`)
- Replaced `min-h-screen` with `min-h-[100dvh]`
- Dynamic viewport height accounts for mobile toolbars

**Layer 7: Fallback Support** (`index.css`)
- `@supports not (100dvh)` fallback for older browsers

### Files Modified
- `index.html`: Added critical inline overflow prevention
- `src/index.css`: Added `@layer hero` with containment rules, removed duplicate styles from components layer
- `src/components/NewHero.tsx`: Removed inline styles, added hero-decoration classes, fixed animations, fixed viewport units

### Verification
- Build passes: `npm run build` ✅
- No linter errors ✅
- Defense-in-depth ensures ANY single layer failure won't cause scrollbar

---

## Hero Scrollbar Flash & Drawer Positioning Fix (2026-01-06)

### Critical UX Fixes

#### Issue 1: Hero Text Scrollbar Flash on Page Load
- **Root Cause**: Global CSS h1 styles (clamp 40-72px) applied before component's inline `<style>` tag (24-36px) was parsed, causing temporary oversized text that triggered horizontal scrollbar
- **Impact**: Horizontal scrollbar briefly flashed during first ~1 second of page load

#### Issue 2: Side Drawer Content Cut Off at Top
- **Root Cause**: Sheet component used `inset-y-0` positioning from viewport edge (top: 0), while navbar is fixed at z-100 covering top 64-80px
- **Impact**: "Actions" header and top content hidden behind navbar on desktop

### Architectural Solutions

#### Hero Scrollbar Fix
- **src/index.css**: Moved `.hero-text-size` class from component inline styles to CSS `@layer components` for early parsing
- **src/index.css**: Added `#hero h1 { font-size: inherit; }` to prevent global h1 override
- **src/index.css**: Added `#hero .hero-content-wrapper { contain: layout style; }` for layout containment
- **src/components/NewHero.tsx**: Removed inline `<style>` tag for hero-text-size (now in index.css)

#### Drawer Positioning Fix
- **src/index.css**: Added CSS variables for navbar height: `--navbar-height`, `--navbar-height-sm`, `--navbar-height-md`
- **src/index.css**: Created `.sheet-navbar-aware` class with responsive top offset and height calculation
- **src/components/ActionsHub.tsx**: Applied `sheet-navbar-aware` class to desktop SheetContent

### Files Modified
- `src/index.css` (lines 93-96, 351-371, 647-670)
- `src/components/NewHero.tsx` (removed inline styles)
- `src/components/ActionsHub.tsx` (added sheet-navbar-aware class)

### Verification
- Hard refresh: No scrollbar flash during page load
- Drawer opens with "Actions" header fully visible below navbar
- All drawer content accessible without blank space issues

---

## Text Contrast System Fix (2026-01-05)

### Critical Accessibility Fix
- **Root Cause**: `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements (4.5:1 for body text)
- **Impact**: Text was unreadable on mobile devices across FAQ, Blog, BlogPost, Contact, and SimpleCTA pages

### Architectural Solution
- **src/index.css**: Added WCAG-compliant design tokens for dark card text colors
  - `--dark-card-heading: 0 0% 100%` (pure white for headings)
  - `--dark-card-body: 0 0% 93%` (off-white for body text)
  - `--dark-card-muted: 0 0% 75%` (softer white for metadata)
- **src/index.css**: Created `.dark-cta-card` component class with enforced high-contrast text
- **tailwind.config.ts**: Added `dark-card` color utilities (heading, body, muted)

### Files Updated
- `src/pages/FAQ.tsx`: "Still Have Questions?" card now uses `.dark-cta-card`
- `src/pages/BlogPost.tsx`: CTA section now uses `.dark-cta-card`
- `src/pages/Contact.tsx`: Mission Statement card now uses `.dark-cta-card`
- `src/pages/Blog.tsx`: Featured post card uses `text-dark-card-*` utilities
- `src/components/SimpleCTA.tsx`: Main CTA uses `text-dark-card-*` utilities

### Prevention System
- Updated `MINDMAKER_DESIGN_SYSTEM_GUIDE.md` with dark card pattern documentation
- Added "NEVER DO THIS" warning for `text-white/80` on dark backgrounds
- Documented the correct pattern for future development

---

## Builder Profile Pipeline Fixes (2026-01-XX)

### Critical Bug Fixes
- **src/hooks/useAssessment.ts**: Removed `widgetMode: 'tryit'` from Builder Profile API call - was causing wrong system prompt selection
- **supabase/functions/chat-with-krish/index.ts**: Added Builder Profile mode detection from message content or explicit mode parameter
- **supabase/functions/chat-with-krish/index.ts**: Added minimal system prompt for Builder Profile that defers to user's detailed instructions
- **supabase/functions/chat-with-krish/index.ts**: Increased `maxOutputTokens` to 4096 for Builder Profile (was 2048)

### Fallback Quality Improvements
- **src/hooks/useAssessment.ts**: Replaced hardcoded generic templates with LLM-generated fallback
- **src/hooks/useAssessment.ts**: Improved score-based fallback to reference user's actual answers
- All fallbacks now include timelines and reference specific answer choices

### Technical Details
- Added `mode` parameter to request schema: `'builder-profile' | 'tryit' | 'chat'`
- Builder Profile detection via message content patterns (AI readiness assessment, Builder Profile, CEO/COO/CPO)
- System prompt selection: Builder Profile → minimal prompt; Try It Widget → TRYIT_SYSTEM_PROMPT; Chat → CHAT_SYSTEM_PROMPT

---

## Mobile Hero & ICP Cards Diagnosis (2026-01-XX)

### Issues Identified
- **Mobile Hero Text**: Horizontal overflow causing text truncation
- **Mobile Hero Text**: Vertical clipping during rotation animations
- **ICP Cards**: Missing "Who does Mindmaker help?" heading
- **ICP Cards**: Aggressive shimmer with 3 overlapping animations
- **ICP Cards**: Unequal card heights due to variable content

### Root Causes Documented
- Absolute positioning breaking container width constraints
- `clamp()` + fixed height + `nowrap` conflict
- `overflow-hidden` clipping animation movement
- Missing contextual heading above ICPSlider component
- No height constraints on card containers

### Files Affected
- `src/components/NewHero.tsx` (lines 74-140)
- `src/components/TheProblem.tsx` (lines 172-400)

---

## SEO Implementation Complete (2026-01-26)

### Meta Tags & HTML Head (10/10)
- Optimized page titles (< 60 characters, keyword-rich)
- Meta descriptions (< 160 characters, compelling CTAs)
- Canonical URLs to prevent duplicate content
- Robots meta tags with detailed crawling instructions

### Structured Data / Schema.org (10/10)
- Organization, WebSite, WebPage schemas
- Service schemas for all offerings
- Person schema for founder (Krish Raja)
- FAQ schema, BreadcrumbList, Course schema
- AggregateRating (4.9/5 with 50 reviews)

### Technical SEO (10/10)
- robots.txt configured with crawl delays
- sitemap.xml with all major pages
- Proper URL structure and priorities

---

## Vertex AI RAG Migration (2025-01-25)

### AI Backend Changes
- **chat-with-krish**: Migrated from OpenAI to Vertex AI RAG with Gemini 2.5 Flash
- **get-ai-news**: Kept on Lovable AI Gateway (Gemini 2.5 Flash)
- **get-market-sentiment**: Kept on OpenAI GPT-4o-mini

### Implementation Details
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime) to reduce auth overhead
- RAG Corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`
- Anti-fragile error handling with graceful fallbacks

### Secrets Required
- `GOOGLE_SERVICE_ACCOUNT_KEY` (Google service account JSON)
- `OPENAI_API_KEY` (for market sentiment, company research)
- `LOVABLE_API_KEY` (auto-provisioned for news ticker)
- `RESEND_API_KEY` (email delivery)

---

## AI Leadership Benchmark Diagnostic (2025-12-14)

### New Features
- Created `/leaders` and `/leadership-insights` routes
- Built comprehensive AI Leadership Benchmark diagnostic flow
- 6 Likert-scale questions covering Leadership Growth, Strategic Vision, Implementation
- Optional personalization with 5 additional questions
- Smooth generating animation with progress that never regresses
- Results page with free value (score, tier, strengths, insights) before unlock
- Collapsible unlock form with Resend email integration

### UX Improvements
- No toasts - all feedback is inline for cleaner mobile experience
- Progress bars use easing and never move backward
- Everything fits in mobile viewport using `100dvh`
- Collapsible unlock form reduces friction and perceived commitment

### Technical Details
- `useLeadershipInsights.ts` hook manages all diagnostic state and logic
- `LeadershipInsights.tsx` page with AnimatePresence for smooth phase transitions
- `send-leadership-insights-email` edge function sends dual emails
- Client-side score calculation (no AI API latency)
- Tier classification: AI-Emerging, AI-Developing, AI-Proficient, AI-Advanced, AI-Leader

### Files Created
- `src/pages/LeadershipInsights.tsx`
- `src/hooks/useLeadershipInsights.ts`
- `supabase/functions/send-leadership-insights-email/index.ts`

---

## Production Readiness Audit (2025-12-13)

### Critical Bug Fixes
- **src/pages/Index.tsx**: Removed duplicate ChatBot component (already in App.tsx)
- **src/main.tsx**: Added React StrictMode for enhanced development checks
- **src/pages/FAQ.tsx**: Fixed faqItems hoisting bug - moved constant outside component
- **src/pages/BuilderSession.tsx**: Updated SEO schema `priceValidUntil` from past date to 2026-12-31

### Code Quality Improvements
- **src/components/ConsultationBooking.tsx**: Removed unused imports (Lock, supabase)
- **src/pages/BuilderEconomy.tsx**: Fixed SPA navigation pattern (onClick → asChild anchor)
- **src/pages/FAQ.tsx**: Changed email button from onClick to proper anchor tag

### Accessibility Improvements
- **src/components/WhitepaperPopup.tsx**: Added missing DialogDescription for screen readers

### SEO Enhancements
Added SEO component with proper meta tags to:
- `src/pages/Privacy.tsx`
- `src/pages/Terms.tsx`
- `src/pages/FAQ.tsx`
- `src/pages/Contact.tsx`
- `src/pages/BuilderEconomy.tsx`

### Security Audit - All Passed ✅
- Edge functions: Zod validation, HTML escaping, proper CORS
- Data flow: Client-side session data only, no PII persistence
- Form handling: Type-safe validation with Zod schemas

---

## Navigation UX Enhancements (2025-12-02)

### Changes
- **src/components/ProductLadder.tsx**:
  - Added scroll-to-top behavior for "Learn More" buttons
  - Implemented smooth scroll transitions (`behavior: 'smooth'`)
  - Applied to JourneySlider, mobile offerings, desktop offerings
  - Preserved modal behavior for "Book Session" buttons

**Impact:** Users navigating to program pages via "Learn More" now smoothly land at the top of the destination page.

---

## Remove $50 Hold & Lead Intelligence System (2025-12-01)

### Changes
- Paused Stripe $50 authorization hold requirement
- Implemented direct Calendly booking without payment
- Created `send-lead-email` edge function with:
  - OpenAI-powered company research (domain → company info + news)
  - Session data compilation (friction map, portfolio, assessment)
  - Retry logic with exponential backoff (3 attempts)
- Updated `InitialConsultModal` with conditional pricing text

### Lead Intelligence Features
- Email domain → Company name, industry, size, latest news
- Session engagement: friction map usage, portfolio builder, assessment
- Try-It widget interactions
- Pages visited, time on site, scroll depth
- Suggested scope of work based on context

### Files Modified
- `src/components/InitialConsultModal.tsx`
- `src/components/ConsultationBooking.tsx`
- `supabase/functions/send-lead-email/index.ts` (new)
- `supabase/functions/chat-with-krish/index.ts` (added logging)
- `supabase/functions/get-market-sentiment/index.ts` (added logging)
- `supabase/functions/get-ai-news/index.ts` (improved error messages)

---

## CTA Flow Redesign (2025-11-25)

### Changes
- Created `InitialConsultModal` component
- All CTAs now route through single modal
- Added program selection to booking flow
- Updated edge function to pass program to Calendly
- Added holiday urgency messaging (35% off through Dec)

### Files Modified
- `src/components/InitialConsultModal.tsx` (new)
- `src/components/NewHero.tsx`
- `src/components/ProductLadder.tsx`
- `src/components/SimpleCTA.tsx`
- `supabase/functions/create-consultation-hold/index.ts`
- `src/pages/BuilderSession.tsx`
- `src/components/ConsultationBooking.tsx`

---

## Stripe Integration (2025-11-24)

### Changes
- Implemented Stripe Checkout for $50 authorization holds
- Created `create-consultation-hold` edge function
- Integrated with Calendly for post-payment redirect
- Added `ConsultationBooking` component

### Implementation Details
- Authorization hold (not immediate charge)
- Manual capture when user proceeds with program
- Fully refundable if user not satisfied
- **Status: Currently paused** - direct Calendly booking without payment

---

## Design System Implementation (2025-11-24)

### Changes
- Established Ink + Mint two-color palette
- Created comprehensive design tokens in index.css
- Updated tailwind.config.ts with semantic mappings
- Refactored all components to use tokens

### Color System
- **Ink** (#0e1a2b): Primary dark, structure, typography
- **Mint** (#7ef4c2): Highlights, accents, CTAs (sparingly)
- Neutrals: Off-white, light grey, mid grey, graphite

### Glass Morphism
- `.glass-card`: translucent cards with backdrop-blur for light backgrounds
- `.glass-card-dark`: translucent cards optimized for dark backgrounds

---

## Brand Transformation (2025-11-24)

### Brand Identity Transformation
- **FROM**: Generic "Strategic AI Implementation"
- **TO**: Authentic "AI Literacy & Strategic Advisory"
- **Methodology**: LEARN → DECIDE → ALIGN → SELL (literacy-first approach)
- **Positioning**: Product strategist, commercial revenue leader, educator

### Components Rebranded
- `Hero.tsx`: AI Literacy & Strategic Advisory focus
- `MethodologySection.tsx`: LEARN → DECIDE → ALIGN → SELL
- `StatsSection.tsx`: Authentic statistics (90+ strategies, 50+ seminars, 16 years)
- `PathwaysSection.tsx`: AI Literacy Pathway offerings
- `CTASection.tsx`: The AI Literacy Gap focus

---

## Initial Platform Launch (2025-11-23)

### Features Launched
- Hero with particle animation
- Product offerings (Session, Sprint, Lab, Partner)
- AI news ticker
- Chat assistant
- Navigation + Footer
- Legal pages (Privacy, Terms, FAQ)

### Initial Stack
- React 18 + TypeScript
- Vite build tool
- TailwindCSS + Shadcn UI
- Supabase backend
- Lovable Cloud hosting

---

## Project Initialization (2025-11-22)

### Initial Setup
- Lovable project created
- Repository initialized
- Supabase Cloud enabled
- GitHub integration connected
- Base dependencies installed

---

**End of CHANGELOG**
