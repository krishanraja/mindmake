# Architecture

**Last Updated:** 2026-03-03

---

## Tech Stack

**Frontend:**
- React 18.3.1
- TypeScript (strict mode)
- Vite 5.x (build tool)
- TailwindCSS 3.x + tailwindcss-animate
- Radix UI (headless components)
- Framer Motion (animations)
- React Router DOM 6.x
- TanStack Query (data fetching)
- React Helmet (SEO)
- Zod (validation)

**Backend:**
- Supabase Edge Functions (Deno runtime)
- Deno std@0.190.0

**Third-Party Services:**
- Stripe (payments) — **Paused: $50 hold bypassed, direct Calendly booking**
- Calendly (scheduling)
- Vertex AI RAG (chatbot with custom business knowledge)
- Lovable AI Gateway (news ticker via Gemini 2.5 Flash)
- OpenAI API (market sentiment, company research in lead emails)
- Resend (email delivery)

**Hosting & Deployment:**
- Lovable Cloud (auto-deploy) / Vercel (frontend)
- Supabase Cloud (edge functions)
- GitHub integration (bidirectional sync)

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn base components
│   │   ├── ChatBot/         # AI chatbot ("Ask Mindmaker")
│   │   ├── Animations/      # Visual effects (ParticleBackground, etc.)
│   │   ├── Interactive/     # Interactive demos (FrictionMap, etc.)
│   │   ├── MediaEasterEggs/ # Video, audio, artifact components
│   │   │   ├── VideoDrawer.tsx
│   │   │   ├── AudioPlayer.tsx
│   │   │   ├── ArtifactPreview.tsx
│   │   │   └── ExpandableQuote.tsx
│   │   ├── ShowDontTell/    # Content sections
│   │   ├── ActionsHub.tsx   # Side drawer with actions
│   │   ├── AINewsTicker.tsx # News ticker (SIGNAL/NOISE/DECISION/TAKE)
│   │   ├── FrameworkJourney.tsx  # Mind Set → Mind Map → Mind Make
│   │   ├── InitialConsultModal.tsx
│   │   ├── ConsultationBooking.tsx
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── NewHero.tsx      # Hero with rotating nervous decisions
│   │   ├── TheProblem.tsx   # Builder/Orchestrator fork
│   │   ├── ProductLadder.tsx # Sprint chooser (4-week vs 90-day)
│   │   ├── SimpleCTA.tsx    # Final CTA ("You've been pitched enough")
│   │   ├── TrustSection.tsx # Krish bio + testimonials
│   │   ├── SEO.tsx
│   │   └── ...
│   ├── pages/               # Route pages
│   │   ├── Index.tsx        # Landing page (homepage scroll)
│   │   ├── Sprint4Week.tsx  # 4-Week Sprint detail
│   │   ├── Sprint90Day.tsx  # 90-Day Sprint detail
│   │   ├── Sprints.tsx      # Sprint overview/chooser
│   │   ├── LeadershipInsights.tsx  # Decision Readiness Diagnostic
│   │   ├── Blog.tsx         # Blog listing
│   │   ├── BlogPost.tsx     # Individual blog posts
│   │   ├── BuilderEconomy.tsx # Thought leadership
│   │   ├── FAQ.tsx
│   │   ├── Privacy.tsx
│   │   ├── Terms.tsx
│   │   ├── Contact.tsx
│   │   └── NotFound.tsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useAssessment.ts      # Builder Profile logic
│   │   ├── useLeadershipInsights.ts  # Diagnostic logic
│   │   ├── useAINewsTicker.ts    # News ticker hook
│   │   ├── useFrictionMap.ts     # Friction map logic
│   │   ├── useVoiceInput.ts      # Voice input for chat
│   │   ├── useScrollHijack.ts    # Scroll hijack for animations
│   │   ├── useScrollDirection.ts # Navbar hide/show
│   │   ├── useScrollLock.ts      # Animation scroll locking
│   │   ├── useRealisticCounters.ts # Counter animations
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── SessionDataContext.tsx
│   ├── data/                # Static data files
│   ├── lib/                 # Utilities
│   ├── integrations/supabase/ # Supabase client
│   ├── index.css            # Design system tokens
│   ├── App.tsx              # Root component + routing
│   └── main.tsx             # Entry point
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── _shared/         # Shared utilities
│   │   │   └── vertex-client.ts  # Vertex AI RAG client
│   │   ├── chat-with-krish/     # "Ask Mindmaker" chatbot
│   │   ├── get-ai-news/         # News ticker
│   │   ├── get-market-sentiment/
│   │   ├── send-lead-email/
│   │   ├── send-contact-email/
│   │   ├── send-leadership-insights-email/
│   │   └── create-consultation-hold/ (paused)
│   ├── migrations/          # SQL migrations
│   └── config.toml          # Supabase config
├── public/                  # Static assets
│   ├── robots.txt
│   ├── sitemap.xml
│   └── ...
├── project-documentation/   # This documentation
├── CLAUDE.md                # Brand vision 11/10 implementation guide
├── tailwind.config.ts       # Tailwind config
├── vite.config.ts           # Vite config
└── package.json             # Dependencies
```

---

## Application Routes

```typescript
// src/App.tsx
<Route path="/" element={<Index />} />
<Route path="/sprints" element={<Sprints />} />
<Route path="/sprint/4-week" element={<Sprint4Week />} />
<Route path="/sprint/90-day" element={<Sprint90Day />} />
<Route path="/builder-economy" element={<BuilderEconomy />} />
<Route path="/privacy" element={<Privacy />} />
<Route path="/terms" element={<Terms />} />
<Route path="/faq" element={<FAQ />} />
<Route path="/contact" element={<Contact />} />
<Route path="/blog" element={<Blog />} />
<Route path="/blog/:slug" element={<BlogPost />} />
<Route path="/leaders" element={<LeadershipInsights />} />
<Route path="/leadership-insights" element={<LeadershipInsights />} />

// Redirects for old URLs
<Route path="/builder-session" element={<Navigate to="/" replace />} />
<Route path="/leadership-lab" element={<Navigate to="/" replace />} />
<Route path="/portfolio-program" element={<Navigate to="/" replace />} />
<Route path="/builder-sprint" element={<Navigate to="/sprints" replace />} />
<Route path="/individual" element={<Navigate to="/" replace />} />
<Route path="/team" element={<Navigate to="/" replace />} />
<Route path="/builder" element={<Navigate to="/" replace />} />
<Route path="*" element={<NotFound />} />
```

---

## Data Flow

### Booking Flow (Current)
**Status:** Stripe hold paused — Direct Calendly booking

```
1. User clicks "What's your nervous decision?" CTA
   └─> InitialConsultModal opens (React state)

2. User fills form + selects sprint interest
   └─> Form submission (React event)
   └─> Session data captured via SessionDataContext

3. Frontend calls edge function
   └─> supabase.functions.invoke('send-lead-email', {
         body: { name, email, jobTitle, selectedProgram, sessionData }
       })

4. Edge function enriches lead data
   └─> OpenAI research: domain → company info + latest news
   └─> Compiles engagement data (friction map, assessment, etc.)

5. Edge function sends email (with retry)
   └─> Resend API with exponential backoff (3 attempts)
   └─> Email to krish@themindmaker.ai with full lead intelligence

6. User redirected to Calendly
   └─> URL pre-filled with: name, email, sprint type
   └─> Direct booking, no payment hold
```

### Decision Readiness Diagnostic Flow
```
1. User navigates to /leaders
   └─> LeadershipInsights page renders

2. Intro → Start Diagnostic
   └─> 6 Likert-scale questions (auto-advance)

3. Optional personalization (5 more questions) or skip

4. Generation phase
   └─> Progress animation (easing, never regresses)
   └─> Results calculated client-side

5. Results displayed
   └─> Decision Readiness Score + tier
   └─> Builder or Orchestrator identification
   └─> Top 3 nervous decisions
   └─> Sprint recommendation (4-week or 90-day)
   └─> Collapsible form to unlock full results

6. User submits unlock form
   └─> send-leadership-insights-email edge function
   └─> User receives full results + Krish receives lead notification
```

### Chatbot Flow ("Ask Mindmaker")
```
1. User clicks "Ask Mindmaker" button
   └─> ChatPanel opens (slide-in animation)

2. User types message
   └─> Message added to conversation state

3. Frontend calls edge function
   └─> supabase.functions.invoke('chat-with-krish', {
         body: { messages: conversationHistory }
       })

4. Edge function authenticates with Google
   └─> JWT signed with service account → Access token

5. Edge function calls Vertex AI RAG
   └─> Gemini 2.5 Flash + custom RAG corpus
   └─> Trained on Mind Set → Mind Map → Mind Make framework

6. Response returned to frontend
   └─> Displayed in ChatPanel

7. Conversation persists in session
   └─> localStorage (client-side only)
```

---

## Edge Functions

### Location
`supabase/functions/[function-name]/index.ts`

### Configuration
`supabase/config.toml`:
```toml
project_id = "smvwbbilnsprexeuplex"

[functions.create-consultation-hold]
verify_jwt = false

[functions.chat-with-krish]
verify_jwt = false

[functions.get-ai-news]
verify_jwt = false

[functions.get-market-sentiment]
verify_jwt = false

[functions.send-lead-email]
verify_jwt = false

[functions.send-contact-email]
verify_jwt = false

[functions.send-leadership-insights-email]
verify_jwt = false
```

### Current Functions

#### `chat-with-krish` — "Ask Mindmaker"
**Purpose:** AI chatbot powered by Google Vertex AI RAG with Gemini 2.5 Flash

**Brand Voice:** Confident, slightly cynical, deeply helpful. Trained on Mind Set → Mind Map → Mind Make framework.

**Secrets Required:** `GOOGLE_SERVICE_ACCOUNT_KEY`

**Architecture:**
- Service account authentication (RS256 JWT signing)
- Token caching (50-minute lifetime)
- RAG corpus integration for business-specific knowledge
- Mode detection: Builder Profile, Try It Widget, Chat
- Anti-fragile design: always returns usable content

**Token Allocation:**
- Builder Profile: 4096 tokens
- Try It Widget: 1024 tokens
- Chat: 2048 tokens

**Vertex AI Configuration:**
- Project: `gen-lang-client-0174430158`
- Region: `us-east1`
- Model: `gemini-2.5-flash`
- RAG Corpus: `6917529027641081856`

#### `get-ai-news`
**Purpose:** Fetches AI news for ticker with SIGNAL/NOISE/DECISION/TAKE categories

**Secrets Required:** `LOVABLE_API_KEY` (auto-provisioned)

**Categories:**
- SIGNAL — Actually matters for business leaders
- NOISE — Hype, funding, vendor marketing (ignore)
- DECISION TRIGGER — Act on this, something changed
- KRISH'S TAKE — Opinion/analysis from Mindmaker

#### `get-market-sentiment`
**Purpose:** Analyzes market sentiment using OpenAI

**Secrets Required:** `OPENAI_API_KEY`

#### `send-lead-email`
**Purpose:** Captures lead data, enriches with company research, sends detailed email

**Secrets Required:** `RESEND_API_KEY`, `OPENAI_API_KEY`

**Features:**
- OpenAI-powered company research
- Session engagement compilation
- Retry logic with exponential backoff (3 attempts)
- Lead intelligence email to krish@themindmaker.ai

#### `send-contact-email`
**Purpose:** Sends contact form submissions

**Secrets Required:** `RESEND_API_KEY`

#### `send-leadership-insights-email`
**Purpose:** Sends Decision Readiness Diagnostic results + lead notification

**Secrets Required:** `RESEND_API_KEY`

**Features:**
- Dual email delivery (user results + Krish notification)
- Sprint recommendation based on diagnostic results

#### `create-consultation-hold` (PAUSED)
**Purpose:** Creates Stripe authorization hold

**Status:** Currently bypassed — direct Calendly booking

---

## Authentication & Authorization

**Current:** None (public site, no user accounts)
**Future:** When implemented — Supabase Auth, JWT tokens, RLS policies

---

## Database

**Status:** Supabase connected, minimal usage
**Current Tables:** `leads`, `company_research_cache`

---

## State Management

**Global State:** None (using React Router + TanStack Query)
**Local State:** React hooks (useState, useReducer)
**URL State:** React Router (route params, search params)
**Form State:** React Hook Form (validation, submission)
**Server State:** TanStack Query (caching, refetching)
**Context State:** `SessionDataContext` (session engagement tracking), `ThemeProvider` (light/dark)

---

## Performance Considerations

### Code Splitting
- Route-based code splitting (React Router lazy)
- Component lazy loading for heavy components
- Vite automatic chunking

### Asset Optimization
- Images: WebP format preferred
- Fonts: Variable fonts (Inter Variable, Space Grotesk Variable), preloaded
- Icons: SVG via Lucide React (tree-shakeable)

### Caching Strategy
- Static assets: Vite build hash (cache forever)
- API responses: TanStack Query (5min stale time)
- Edge function responses: No caching (always fresh)

### CSS Performance
- Layout containment for animation sections
- `will-change` hints for scroll-triggered animations
- Disabled heavy hover transforms on mobile/touch devices

---

## Security

### Environment Variables
**Secrets stored in Supabase/Lovable Cloud:**
- `GOOGLE_SERVICE_ACCOUNT_KEY` (Vertex AI RAG)
- `OPENAI_API_KEY` (market sentiment, company research)
- `LOVABLE_API_KEY` (AI Gateway — auto-provisioned)
- `RESEND_API_KEY` (email delivery)
- `STRIPE_SECRET_KEY` (payments — paused)

### CORS Policy
- Edge functions: Allow all origins (`*`)
- Production: Will restrict to domain

### Input Validation
- Frontend: React Hook Form + Zod schemas
- Backend: Zod validation in edge functions
- HTML Escaping: XSS prevention in email templates

---

## Deployment Pipeline

### Development
```bash
npm run dev          # Start Vite dev server
```

### Build
```bash
npm run build        # Vite build → dist/
npm run lint         # ESLint check
```

### Deploy
```
1. Push to GitHub
   └─> Auto-sync to Lovable/Vercel

2. Frontend builds
   └─> Deploys to CDN

3. Edge functions auto-deploy
   └─> 30-60 second deployment time
```

---

**End of ARCHITECTURE**
