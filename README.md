# Mindmaker: The Anti-Consultancy for Leaders Done Being Sold AI

**Last Updated:** 2026-04-26

---

## Overview

Mindmaker is a barbell business with two primary public offers and one inquiry-only relief valve. No middle tier. No retainers. No fractional roles. Every offer has a fixed scope, a fixed outcome, and a finish line.

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Live site:** [themindmaker.ai](https://themindmaker.ai)
**Cohort enrolment:** [maven.com/aimindmaker/ai-decision-intensive](https://maven.com/aimindmaker/ai-decision-intensive)

---

## Offers

| Offer | Price | Duration | Audience |
|---|---|---|---|
| **The AI Decision Cohort** | $3,500 / seat | 3 weeks (mostly async) + 3 × 90-min live sessions | Senior leader with a nervous AI decision |
| **The Signal Session** | $15,000 | 1 day intensive + 48-hour Commercial Narrative (15–20 pages) | Company commercializing an AI product |
| **The Revenue Architecture** | $60,000–$100,000 | 30 days (4–5 calendar weeks) | Same, ready for a full commercial rebuild |
| **The AI Immersion** (inquiry-only) | $12,000 | 4-hour facilitated session + 2-page summary in 5 business days | CEO-sponsored exec team needing fast alignment |

Cohort enrolment runs on **Maven** (Slack, payment, alumni community). Enterprise and Immersion are invoiced direct.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, TypeScript (strict), Vite 5.x |
| Styling | TailwindCSS 3.x, shadcn/ui (Radix), Framer Motion |
| Backend | Supabase Edge Functions (Deno) |
| AI | Anthropic Claude Haiku 4.5 (Nervous Decision Machine), Google Gemini (lead enrichment with Search grounding), Lovable AI Gateway (Live Intel content), OpenAI (market sentiment + fallback) |
| Email | Resend (3× retry with exponential backoff) |
| Cohort enrolment | Maven |
| Scheduling | Calendly |
| Hosting | Lovable Cloud / Vercel |

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### Development
```bash
git clone <git-url>
cd mindmaker
npm install
npm run dev
```

### Build
```bash
npm run build      # Vite → generate-sitemap.mjs → prerender.mjs → dist/
npm run preview    # preview the build locally
npm run lint       # ESLint (strict)
```

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui base components
│   │   ├── nervous-decision/         # Nervous Decision Machine (compact + full)
│   │   ├── new-age/                  # /new-age-leadership components
│   │   ├── Animations/
│   │   ├── NewHero.tsx               # rotating headlines
│   │   ├── YFork.tsx                 # Cohort vs Enterprise
│   │   ├── BigProblem.tsx
│   │   ├── TrustSection.tsx
│   │   ├── FrameworkJourney.tsx      # Mind Set → Mind Map → Mind Make
│   │   ├── OperatorsEdge.tsx         # v5 credential
│   │   ├── OperatorsBrief.tsx        # Live Intel homepage teaser
│   │   ├── PriceTicker.tsx
│   │   ├── LightningLessons.tsx      # 4 Maven Lightning Lesson links
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── InitialConsultModal.tsx   # global conversion surface
│   │   ├── PreCallQualifier.tsx      # floating pill, 3-step chip intake
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SEO.tsx
│   ├── pages/
│   │   ├── Index.tsx                 # homepage (eager-loaded)
│   │   ├── Cohort.tsx                # /cohort (Maven enrolment)
│   │   ├── Enterprise.tsx            # /enterprise. Signal Session + Revenue Architecture
│   │   ├── Operator.tsx              # /operator, 14-agent OS credential page
│   │   ├── Brief.tsx                 # /signal. Live Intel
│   │   ├── Immersion.tsx             # /immersion. AI Immersion (inquiry-only)
│   │   ├── NewAgeLeadership.tsx      # /new-age-leadership, long-form thought leadership
│   │   ├── LeadershipInsights.tsx    # /leaders. Decision Readiness Diagnostic
│   │   ├── Blog.tsx, BlogPost.tsx
│   │   ├── FAQ.tsx, Contact.tsx, Privacy.tsx, Terms.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                        # useModelData (ALLOWED_MODEL_IDS), useScrollDirection, etc.
│   ├── contexts/SessionDataContext.tsx
│   ├── integrations/supabase/
│   ├── lib/, utils/, data/
│   └── index.css                     # design tokens
├── supabase/
│   └── functions/
│       ├── nervous-decision-machine/  # Claude Haiku 4.5
│       ├── get-ai-news/               # Live Intel content
│       ├── get-market-sentiment/      # OpenAI
│       ├── get-model-data/            # frontier-model price feed
│       ├── send-lead-email/           # Gemini company research + Resend
│       ├── send-contact-email/
│       ├── send-leadership-insights-email/
│       └── create-consultation-hold/  # Stripe (bypassed)
├── public/                            # llms.txt, robots.txt, sitemap.xml, rising-cities.mp4, ctrl-demo-video.mp4, Krish-Headshot.png
├── scripts/                           # generate-sitemap.mjs, prerender.mjs
├── project-documentation/             # full documentation (start here)
├── CLAUDE.md                          # authoritative codebase reference
└── package.json
```

---

## Framework

**Mind Set → Mind Map → Mind Make**

| Phase | Focus | Outcome |
|---|---|---|
| Mind Set | Clarity | Cut noise, name the real decision |
| Mind Map | Leverage | Map options, trade-off analysis |
| Mind Make | Direction | Decide, document, ship |

---

## Routes

| Route | Description |
|---|---|
| `/` | Homepage (eager-loaded) |
| `/cohort` | The AI Decision Cohort. Maven enrolment |
| `/enterprise` | Signal Session ($15k) + Revenue Architecture ($60–100k, 30 days) |
| `/operator` | How I operate, 14-agent OS credential page |
| `/signal` | **Live Intel**, model price ticker, classified archive (WATCH/SKIP/CALL/TAKE), Nervous Decision Machine |
| `/immersion` | AI Immersion ($12k, inquiry-only) |
| `/new-age-leadership` | Long-form thought leadership, agent-native org chart |
| `/leaders`, `/leadership-insights` | Decision Readiness Diagnostic (unlinked from nav) |
| `/blog`, `/blog/:slug` | Blog |
| `/faq`, `/contact`, `/privacy`, `/terms` | Support pages |

### Redirects
- `/tool` → `/signal#decision`
- `/builder-economy` → external `https://www.thebuildereconomy.com`
- `/sprints` → `/cohort`
- `/sprint/4-week`, `/sprint/90-day`, `/builder-sprint` → `/cohort?inquiry=1:1`
- `/war-room` → `/enterprise#revenue-architecture`
- `/strategy-day` → `/enterprise#signal-session`
- `/fractional-caio` → `/enterprise`
- `/individual`, `/team`, `/builder`, `/builder-session`, `/leadership-lab`, `/portfolio-program` → `/`

---

## Edge Functions

| Function | Purpose |
|---|---|
| `nervous-decision-machine` | Anthropic Claude Haiku 4.5. JSON artefact for the Nervous Decision Machine |
| `get-ai-news` | Live Intel content (taxonomy: WATCH / SKIP / CALL / TAKE) |
| `get-market-sentiment` | OpenAI, market sentiment |
| `get-model-data` | Frontier-model price + spec feed for the PriceTicker |
| `send-lead-email` | Gemini company research with Google Search grounding + Resend (3× retry) |
| `send-contact-email` | Contact form |
| `send-leadership-insights-email` | Diagnostic results dual-email |
| `create-consultation-hold` | Stripe (currently bypassed; Cohort payment via Maven) |

---

## Environment Variables

Required secrets in Supabase:
```
ANTHROPIC_API_KEY    Nervous Decision Machine
GEMINI_API_KEY       Lead enrichment (Search-grounded; preferred)
OPENAI_API_KEY       Market sentiment + lead enrichment fallback
RESEND_API_KEY       Email delivery
LOVABLE_API_KEY      AI Gateway (auto-provisioned)
STRIPE_SECRET_KEY    Payments (paused)
```

---

## Documentation

Full documentation in [`project-documentation/`](./project-documentation/):

- **[SALES_PLAYBOOK.md](./project-documentation/SALES_PLAYBOOK.md)**. single ground-truth doc for AI sales/marketing agents
- **[ARCHITECTURE.md](./project-documentation/ARCHITECTURE.md)**. tech stack, routes, edge functions, data flows
- **[FEATURES.md](./project-documentation/FEATURES.md)**. feature catalogue
- **[OFFERS.md](./project-documentation/OFFERS.md)**. full offer guide
- **[ICP.md](./project-documentation/ICP.md)**. ICPs and disqualifiers
- **[VALUE_PROP.md](./project-documentation/VALUE_PROP.md)**. positioning and competitive framing
- **[OUTCOMES.md](./project-documentation/OUTCOMES.md)**. buyer outcomes by offer
- **[BRANDING.md](./project-documentation/BRANDING.md)**. voice, tone, terminology
- **[PURPOSE.md](./project-documentation/PURPOSE.md)**. mission, vision, anti-goals
- **[Master_Messaging_and_FAQ.md](./project-documentation/Master_Messaging_and_FAQ.md)**. canonical pitches and FAQ
- **[DESIGN_SYSTEM.md](./project-documentation/DESIGN_SYSTEM.md)**. tokens, components, contrast rules
- **[VISUAL_GUIDELINES.md](./project-documentation/VISUAL_GUIDELINES.md)**. layout, cards, animation
- **[DEPLOYMENT.md](./project-documentation/DEPLOYMENT.md)**. pre/post-deploy checklists
- **[COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md)**. known issues and solutions
- **[REPLICATION_GUIDE.md](./project-documentation/REPLICATION_GUIDE.md)**. step-by-step replication
- **[HISTORY.md](./project-documentation/HISTORY.md)**. change history
- **[DECISIONS_LOG.md](./project-documentation/DECISIONS_LOG.md)**. architectural and product decisions
- **[mindmaker_rebuild_brief_v4.md](./project-documentation/mindmaker_rebuild_brief_v4.md)**. strategic intent (v4 barbell + v5 Operator's Edge)

For agents working on the codebase, start with **[CLAUDE.md](./CLAUDE.md)** in the repo root.

---

## Design System

| Element | Value |
|---|---|
| Primary Dark (Ink) | `#0e1a2b` |
| Primary Accent (Mint) | `#7ef4c2` |
| Display Font | Space Grotesk Variable |
| Body Font | Inter Variable |

### Critical Rules
- **Never** use `text-mint` on white/light backgrounds (fails WCAG)
- Use `.dark-cta-card` class or `text-dark-card-*` utilities on dark backgrounds
- Mint is for highlights and CTAs only

---

## Deployment

### Via Lovable
1. Open the Lovable project
2. Click Share → Publish

### Via GitHub
1. Push to main
2. Auto-deploy to Lovable Cloud / Vercel
3. Edge functions auto-deploy to Supabase (30–60s propagation)

---

## Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for the codebase reference
2. Read [BRANDING.md](./project-documentation/BRANDING.md) for voice/tone before writing copy
3. Check [COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md) before debugging
4. Update documentation alongside code changes, `HISTORY.md` and `DECISIONS_LOG.md` for substantive changes

---

## Support

- **Email:** krish@themindmaker.ai
- **Calendly:** Book directly via site CTAs
- **Cohort enrolment:** [maven.com/aimindmaker/ai-decision-intensive](https://maven.com/aimindmaker/ai-decision-intensive)

---

## License

Private repository. All rights reserved.
