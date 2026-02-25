# Features

**Last Updated:** 2026-02-25

---

## Product Offerings

### 1. 4-Week Sprint (Core Product)
**Status:** Live
**Duration:** 4 weeks
**Price:** TBD
**Route:** `/sprint/4-week`

**Tagline:** One decision. Four weeks. Board-ready.

**Description:** You have a nervous decision about AI. We help you make it with confidence. Week 1: clarity. Week 2: options. Week 3: decision. Week 4: board-ready memo.

**The Four-Week Arc:**
- **Week 1: Relief** — Name what you're actually anxious about
- **Week 2: Momentum** — Map all options with trade-off analysis
- **Week 3: Confidence** — Make the call, document why
- **Week 4: Calm** — Board-ready, done

**What You Get:**
- One clear, defensible decision
- Trade-off analysis you can explain
- Board-ready decision memo (1-2 pages)
- ROI framework to measure success
- 4 weekly decision sessions (60 min each)
- Async support between sessions

**Example Nervous Decisions:**
- Which vendors do we commit to?
- What should I build vs buy?
- How do I multiply my strongest edge?
- What's my AI boundary?

**Implementation:** `Sprint4Week.tsx`

---

### 2. 90-Day Sprint (Core Product)
**Status:** Live
**Duration:** 90 days
**Price:** TBD
**Route:** `/sprint/90-day`

**Tagline:** The full journey. Mind Set → Mind Map → Mind Make.

**Description:** Three decisions. Three months. Complete transformation from AI chaos to calm, clear direction. Month 1: Mind Set (clarity). Month 2: Mind Map (systems). Month 3: Mind Make (deployment).

**The Three-Month Arc:**
- **Month 1: Mind Set (Clarity)** — Identify 2-3 decisions that define AI direction
- **Month 2: Mind Map (Leverage)** — Build working systems around actual workflows
- **Month 3: Mind Make (Direction)** — Measure, document, board-ready narrative

**What You Get:**
- 3-5 deployed AI systems (working, measured, documented)
- 2-3 strategic decisions resolved (with trade-off memos)
- 12-month roadmap with clear gates and owners
- Board-level confidence on AI
- Team alignment on AI standards
- Builder Dossier (all decisions, systems, learnings)

**Extension Option:** 6-month Extended Sprint (continuation, discussed if relevant)

**Implementation:** `Sprint90Day.tsx`

---

### 3. Sprints Overview Page
**Status:** Live
**Route:** `/sprints`

**Purpose:** Sprint chooser page with Builder/Orchestrator path selection and side-by-side comparison of 4-Week vs 90-Day sprints.

**Implementation:** `Sprints.tsx`

---

### 4. Decision Readiness Diagnostic (Lead Generation)
**Status:** Live
**Duration:** 10 minutes
**Price:** Free
**Route:** `/leaders`, `/leadership-insights`

**Purpose:** Self-serve diagnostic that identifies nervous decisions, determines Builder/Orchestrator type, and recommends the right sprint.

**User Flow:**
1. Intro screen with value prop
2. 6-question diagnostic (Likert scale 1-5) covering:
   - Leadership Growth (industry understanding, tool usage)
   - Strategic Vision (roadmap clarity, vendor evaluation)
   - Implementation (workflow adoption, readiness)
3. Optional: Quick personalization (5 additional questions)
4. Generating phase with progress animation
5. Results page with:
   - Decision Readiness Score with tier classification
   - Builder or Orchestrator identification
   - Top 3 nervous decisions (curated from answers)
   - Recommended sprint (4-week or 90-day)
   - Strengths and growth areas (free)
   - Collapsible form to unlock full results via email

**Tiers:**
- AI-Leader (80-100)
- AI-Advanced (65-79)
- AI-Proficient (50-64)
- AI-Developing (35-49)
- AI-Emerging (0-34)

**Implementation:** `LeadershipInsights.tsx`, `useLeadershipInsights.ts`, `send-leadership-insights-email` edge function

---

### 5. Initial Conversation (Entry Point)
**Status:** Live
**Duration:** Free conversation
**Price:** Free

**Purpose:** Understand user context, identify nervous decision, recommend appropriate sprint

**Booking Flow:**
1. User clicks CTA ("What's your nervous decision?") → Modal opens
2. Select sprint interest + enter name/email/job title
3. Lead email sent with enriched data (company research, session engagement)
4. Direct Calendly redirect for time booking
5. The first conversation is free. No prep required.

**Implementation:** `InitialConsultModal`, `send-lead-email` edge function

---

### 6. Blog / Content Hub
**Status:** Live
**Routes:** `/blog`, `/blog/:slug`

**Purpose:** Thought leadership content, SEO, and audience engagement

**Features:**
- Blog listing page with featured posts
- Individual blog post pages with rich content
- SEO-optimized with meta tags and structured data
- Dark-themed CTA cards with WCAG-compliant contrast
- Responsive design

**Implementation:** `Blog.tsx`, `BlogPost.tsx`

---

## Removed Products (Redirecting)

| Old Product | Status | Redirect |
|------------|--------|----------|
| Builder Session (1hr) | Removed | `/builder-session` → `/` |
| Leadership Lab (team) | Demoted | `/leadership-lab` → `/` |
| Portfolio Partner | Demoted | `/portfolio-program` → `/` |
| Builder Sprint (old) | Redirected | `/builder-sprint` → `/sprints` |

**Leadership Lab** and **Portfolio Partner** are mentioned as post-sprint options ("What Comes Next") but have no public product pages.

---

## Website Features

### Homepage Scroll Experience (/)

The homepage is a curated scroll experience with these blocks:

1. **Hero** — Rotating "nervous decision" headlines + "What's your nervous decision?" CTA
2. **Framework Journey** — Mind Set → Mind Map → Mind Make visual performance
3. **Who Is This For** — Builder vs Orchestrator fork with video panels
4. **Sprint Chooser** — 4-Week vs 90-Day comparison cards
5. **Trust Anchor** — Krish bio + proof points + testimonials
6. **News Ticker** — AI news with SIGNAL/NOISE/DECISION/TAKE categories
7. **Final CTA** — "You've been pitched enough." + "What's your nervous decision?"

**Key Components:**
- `NewHero.tsx` — Particle animation + rotating nervous decisions
- `FrameworkJourney.tsx` — Mind Set → Mind Map → Mind Make visual journey
- `TheProblem.tsx` — Builder/Orchestrator fork
- `ProductLadder.tsx` — Sprint chooser (2-card layout)
- `TrustSection.tsx` — Krish bio + testimonials
- `AINewsTicker.tsx` — AI news ticker
- `SimpleCTA.tsx` — Final CTA

### Booking System
- `InitialConsultModal` with sprint selection
- Lead capture with session data context
- Company research enrichment (OpenAI)
- Email delivery with retry logic (Resend)
- Calendly integration (pre-filled data)
- Stripe integration (paused)

### AI Chatbot — "Ask Mindmaker"
- Floating button (bottom right)
- Slide-out panel
- AI-powered responses (Vertex AI RAG with Gemini 2.5 Flash)
- Custom RAG corpus (business-specific knowledge)
- Trained on Mind Set → Mind Map → Mind Make framework
- Context-aware with conversation history
- Persistent across navigation
- Voice input support (Web Speech API)

### News Ticker
- AI-generated intelligence briefings
- Categories: SIGNAL, NOISE, DECISION TRIGGER, KRISH'S TAKE
- 10-15 headlines with cynical operator perspective
- Fallback to static headlines on error
- Powered by Lovable AI Gateway (Gemini 2.5 Flash)

### Media Easter Eggs
- `VideoDrawer` — Slide-out video player (for Krish's Cynical AI Take)
- `AudioPlayer` — Expandable audio player (for voice content)
- `ArtifactPreview` — Hover-to-reveal artifact previews (for sprint deliverables)
- `ExpandableQuote` — Click-to-expand testimonial quotes
- **Design Philosophy:** Media is discoverable easter eggs, not main content

### Supporting Pages
- `/sprint/4-week` — 4-Week Sprint detail
- `/sprint/90-day` — 90-Day Sprint detail
- `/sprints` — Sprint overview/chooser
- `/leaders` — Decision Readiness Diagnostic
- `/builder-economy` — Thought leadership
- `/blog`, `/blog/:slug` — Blog
- `/faq`, `/privacy`, `/terms`, `/contact` — Support pages

---

## Technical Features

### Payment Processing
**Status:** Paused (Stripe integration exists but bypassed)
- Authorization holds ($50) — currently disabled
- **Current flow:** Direct Calendly booking without payment hold

### Edge Functions
**Status:** Live (Supabase/Deno)
- `chat-with-krish` — AI chatbot "Ask Mindmaker" (Vertex AI RAG + Gemini 2.5 Flash)
- `get-ai-news` — News ticker (Lovable AI Gateway + Gemini 2.5 Flash)
- `get-market-sentiment` — Market analysis (OpenAI GPT-4o-mini)
- `send-lead-email` — Lead capture + company research (OpenAI + Resend)
- `send-contact-email` — Contact form submissions (Resend)
- `send-leadership-insights-email` — Diagnostic results + lead notification (Resend)
- `create-consultation-hold` — Stripe checkout (paused)

### SEO Implementation
**Status:** Complete (10/10 score)
- Meta tags and Open Graph optimization
- Structured data / Schema.org (JSON-LD)
- robots.txt and sitemap.xml configured
- Canonical URLs on all pages

### Authentication
**Status:** Not implemented
**Reason:** No user accounts needed (all via Calendly)

### Database
**Status:** Minimal (Supabase connected)
**Tables:** `leads`, `company_research_cache`

---

## Design System

### Color Palette
- **Ink** (#0e1a2b): Primary dark, structure, typography
- **Mint** (#7ef4c2): Highlights, accents, CTAs (sparingly)
- Neutrals: Off-white, light grey, mid grey, graphite

### Typography
- **Space Grotesk Variable**: Headings (h1-h6), display text
- **Inter Variable**: Body text, UI elements

### Components
- Glass morphism cards (`.glass-card`)
- Editorial cards (`.editorial-card`)
- Dark CTA cards (`.dark-cta-card`) — WCAG AA compliant
- Shadcn/ui base components
- Framer Motion animations
- Media easter egg components

### Accessibility
- WCAG AA compliant text contrast
- `dark-card-*` utilities for text on dark backgrounds
- Focus visible states
- Reduced motion support

---

## Feature Roadmap

### Q1 2026
- Brand vision 11/10 implementation (in progress)
- Sprint detail pages (4-week + 90-day)
- Framework Journey component
- Media easter egg components
- Decision Readiness Diagnostic rebrand
- Chatbot rebrand to "Ask Mindmaker"
- Navigation simplification

### Q2 2026
- Video/audio content integration (when assets available)
- Artifact previews on sprint pages
- Extended Sprint positioning
- Client portal dashboard

### Q3 2026
- Community features
- Template library
- Advanced analytics

---

**End of FEATURES**
