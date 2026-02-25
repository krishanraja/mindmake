# Replication Guide

**Last Updated:** 2026-02-25

---

## Overview

This guide provides step-by-step instructions to replicate the Mindmaker platform from scratch. Follow these steps in order for a complete working build.

**Prerequisites:**
- Node.js 18+ installed
- npm or yarn package manager
- Git installed
- Lovable account (lovable.dev)
- Calendly account (calendly.com)

**Note:** Stripe integration exists but is currently paused. Not required for initial setup.

---

## Phase 1: Environment Setup

### Step 1: Create Lovable Project
```bash
1. Go to lovable.dev
2. Click "New Project"
3. Name: "mindmaker" (or your choice)
4. Click "Create"
```

### Step 2: Enable Lovable Cloud
```bash
1. In Lovable, click "Cloud" tab
2. Click "Enable Cloud"
3. Wait for Supabase project provisioning (2-3 min)
4. Note: project_id in supabase/config.toml
```

### Step 3: Connect GitHub (Optional but Recommended)
```bash
1. Click "GitHub" button in Lovable
2. Authorize Lovable GitHub App
3. Select account/org
4. Click "Create Repository"
5. Repository created with bidirectional sync
```

---

## Phase 2: Base Configuration

### Step 4: Install Dependencies
```bash
# Lovable auto-installs these, but for reference:
npm install react@18.3.1 react-dom@18.3.1
npm install @tanstack/react-query@5.83.0
npm install react-router-dom@6.30.1
npm install @radix-ui/react-dialog @radix-ui/react-label
npm install framer-motion@12.23.24
npm install lucide-react@0.462.0
npm install tailwindcss@3.4.1 tailwindcss-animate@1.0.7
npm install class-variance-authority@0.7.1 clsx@2.1.1 tailwind-merge@2.6.0
npm install @supabase/supabase-js@2.57.4
npm install zod@3.25.76 react-hook-form@7.61.1
npm install sonner@1.7.4
```

### Step 5: Configure Tailwind
**File:** `tailwind.config.ts`
```typescript
// Copy from project-documentation/DESIGN_SYSTEM.md
// Or use existing tailwind.config.ts from repo
```

### Step 6: Set Up Design System
**File:** `src/index.css`
```css
// Copy complete design tokens from repo
// Or follow DESIGN_SYSTEM.md
```

---

## Phase 3: Core Components

### Step 7: Create Shadcn UI Components
```bash
# Lovable has these pre-installed, but for reference:
# Copy all files from src/components/ui/
- button.tsx, dialog.tsx, input.tsx, label.tsx, card.tsx, etc.
```

### Step 8: Create Layout Components
**Files to create:**
```
src/components/Navigation.tsx      # Nav with Sprints/Resources/About dropdowns
src/components/Footer.tsx
src/components/InitialConsultModal.tsx  # Main CTA modal
src/components/ConsultationBooking.tsx
```

### Step 9: Create Page Components
**Files to create:**
```
src/pages/Index.tsx              # Landing page (homepage scroll)
src/pages/Sprint4Week.tsx        # 4-Week Sprint detail
src/pages/Sprint90Day.tsx        # 90-Day Sprint detail
src/pages/Sprints.tsx            # Sprint overview/chooser
src/pages/LeadershipInsights.tsx # Decision Readiness Diagnostic
src/pages/Blog.tsx               # Blog listing
src/pages/BlogPost.tsx           # Individual blog posts
src/pages/BuilderEconomy.tsx     # Thought leadership
src/pages/Privacy.tsx
src/pages/Terms.tsx
src/pages/FAQ.tsx
src/pages/Contact.tsx
src/pages/NotFound.tsx
```

### Step 10: Create Homepage Components
**Files to create:**
```
src/components/NewHero.tsx          # Hero with rotating nervous decisions
src/components/FrameworkJourney.tsx  # Mind Set → Mind Map → Mind Make
src/components/TheProblem.tsx       # Builder/Orchestrator fork
src/components/ProductLadder.tsx    # Sprint chooser (2-card)
src/components/TrustSection.tsx     # Krish bio + testimonials
src/components/AINewsTicker.tsx     # SIGNAL/NOISE/DECISION/TAKE
src/components/SimpleCTA.tsx        # Final CTA
```

### Step 11: Create Media Easter Egg Components
**Files to create:**
```
src/components/MediaEasterEggs/VideoDrawer.tsx      # Slide-out video
src/components/MediaEasterEggs/AudioPlayer.tsx       # Expandable audio
src/components/MediaEasterEggs/ArtifactPreview.tsx   # Hover-to-reveal
src/components/MediaEasterEggs/ExpandableQuote.tsx   # Click-to-expand
```

---

## Phase 4: Edge Functions

### Step 12: Create Chatbot Function ("Ask Mindmaker")
**File:** `supabase/functions/chat-with-krish/index.ts`
- Vertex AI RAG with Gemini 2.5 Flash
- Service account authentication
- Mode detection (Builder Profile, Try It, Chat)
- Anti-fragile error handling

### Step 13: Create News Ticker Function
**File:** `supabase/functions/get-ai-news/index.ts`
- SIGNAL/NOISE/DECISION TRIGGER/KRISH'S TAKE categories
- Lovable AI Gateway

### Step 14: Create Lead Email Function
**File:** `supabase/functions/send-lead-email/index.ts`
- OpenAI-powered company research
- Session data compilation
- Resend email delivery with retry

### Step 15: Create Other Functions
```
supabase/functions/send-contact-email/index.ts
supabase/functions/send-leadership-insights-email/index.ts
supabase/functions/get-market-sentiment/index.ts
supabase/functions/create-consultation-hold/index.ts (paused)
```

### Step 16: Configure Functions
**File:** `supabase/config.toml`
```toml
project_id = "your-project-id"

[functions.chat-with-krish]
verify_jwt = false

[functions.get-ai-news]
verify_jwt = false

[functions.send-lead-email]
verify_jwt = false

[functions.send-contact-email]
verify_jwt = false

[functions.send-leadership-insights-email]
verify_jwt = false

[functions.get-market-sentiment]
verify_jwt = false

[functions.create-consultation-hold]
verify_jwt = false
```

---

## Phase 5: Integrations

### Step 17: Set Up Google Vertex AI
```bash
1. Go to Google Cloud Console
2. Enable Vertex AI API
3. Create service account with Vertex AI permissions
4. Download service account JSON key
5. In Supabase: Settings → Secrets → Add GOOGLE_SERVICE_ACCOUNT_KEY
6. Paste raw JSON (not base64 encoded)
```

### Step 18: Set Up Resend (Email)
```bash
1. Go to resend.com
2. Create API key
3. Verify sending domain
4. In Supabase: Settings → Secrets → Add RESEND_API_KEY
```

### Step 19: Set Up OpenAI
```bash
1. Go to platform.openai.com
2. Create API key
3. In Supabase: Settings → Secrets → Add OPENAI_API_KEY
```

### Step 20: Set Up Calendly
```bash
1. Go to calendly.com
2. Create event type: "Mindmaker Initial Conversation"
3. Duration: 30-45 minutes
4. Get scheduling URL
5. Update Calendly URL in ConsultationBooking component
```

---

## Phase 6: Routing Setup

**File:** `src/App.tsx`

```typescript
// Core routes
<Route path="/" element={<Index />} />
<Route path="/sprints" element={<Sprints />} />
<Route path="/sprint/4-week" element={<Sprint4Week />} />
<Route path="/sprint/90-day" element={<Sprint90Day />} />
<Route path="/leaders" element={<LeadershipInsights />} />
<Route path="/leadership-insights" element={<LeadershipInsights />} />
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/builder-economy" element={<BuilderEconomy />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/contact" element={<Contact />} />

// Redirects for old URLs
<Route path="/builder-session" element={<Navigate to="/" replace />} />
<Route path="/leadership-lab" element={<Navigate to="/" replace />} />
<Route path="/portfolio-program" element={<Navigate to="/" replace />} />
<Route path="/builder-sprint" element={<Navigate to="/sprints" replace />} />
<Route path="/individual" element={<Navigate to="/" replace />} />
<Route path="/team" element={<Navigate to="/" replace />} />
<Route path="*" element={<NotFound />} />
```

---

## Phase 7: Testing

### Step 21: Test Locally
```bash
# Test these flows:
1. Homepage loads with rotating nervous decisions
2. Framework Journey animation works
3. Builder/Orchestrator fork displays
4. Sprint chooser (4-week vs 90-day) works
5. CTA "What's your nervous decision?" opens modal
6. Sprint detail pages load (/sprint/4-week, /sprint/90-day)
7. Decision Readiness Diagnostic completes (/leaders)
8. "Ask Mindmaker" chatbot responds
9. News ticker shows SIGNAL/NOISE/DECISION/TAKE categories
10. All redirects work (old URLs → new)
11. Mobile view works
12. No mint text on light backgrounds
```

---

## Phase 8: Deployment

### Step 22: Deploy Frontend
```bash
1. Click "Publish" in Lovable (or push to GitHub)
2. Wait for CDN propagation
3. Test live URL
```

### Step 23: Final Smoke Tests
```bash
1. Homepage loads with nervous decisions
2. Navigation works (Sprints dropdown, Resources, About)
3. "What's your nervous decision?" opens modal
4. Sprint detail pages load
5. Diagnostic works end-to-end
6. Chatbot responds
7. News ticker displays
8. Mobile view works
9. All redirects work
10. No console errors
```

---

## Post-Launch Checklist

### Required for Production
- [ ] Custom domain connected
- [ ] SSL certificate verified
- [ ] Analytics installed
- [ ] Error tracking (Sentry, LogRocket, etc.)
- [ ] Legal pages reviewed
- [ ] WCAG AA compliance verified

### Recommended
- [ ] Set up monitoring (uptime, performance)
- [ ] Configure email notifications
- [ ] Set up CRM integration
- [ ] Create operations runbook

---

## Support Resources

- **Lovable Docs:** https://docs.lovable.dev
- **Supabase Docs:** https://supabase.com/docs
- **TailwindCSS Docs:** https://tailwindcss.com/docs
- **React Docs:** https://react.dev
- **Brand Guide:** `CLAUDE.md` in repo root

---

**End of REPLICATION_GUIDE**
