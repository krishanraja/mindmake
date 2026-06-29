# Mindmaker: The Anti-Consultancy for Leaders Done Being Sold AI

**Last Updated:** 2026-06-29

---

## Overview

Mindmaker is a ladder, not a single product. Free Lightning Lessons at the top of the funnel. Five one-day Workshops at $599 as the paid entry. The AI-Fluent Executive Cohort at $2,500 as the qualifying step. Enterprise sprints from $15,000 to $100,000 as the margin engine. The Alumni Pass at $1,500/year as continuity. No retainers. No fractional roles. Every offer has a fixed scope, a fixed outcome, and a finish line.

The primary on-site conversion surface is **the Diagnosis Room (Mindy)**, a full-screen experience where every "Book a call" CTA lands. Mindy diagnoses the visitor's nervous AI decision and forks to three honest exits (keep chatting, book a free 15-min call, or download a co-branded proposal). Public pricing is **ranges only**; exact figures are set by Krish on the call. See [CLAUDE.md](./CLAUDE.md) for the full codebase reference.

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Live site:** [themindmaker.ai](https://themindmaker.ai)
**Cohort enrolment:** [maven.com/mindmaker/the-ai-fluent-executive](https://maven.com/mindmaker/the-ai-fluent-executive)
**Workshops + free lessons:** [maven.com/mindmaker](https://maven.com/mindmaker)

---

## Offers

| Offer | Price | Duration | Audience |
|---|---|---|---|
| **Mindmaker Workshops** (×5) | $599 / workshop | 1 day each on Maven | Senior leader ready to build a real artefact alongside Krish |
| **The AI-Fluent Executive (Cohort)** | $2,500 / seat | 4 weeks (mostly async) + 4 × 90-min live sessions | Senior leader with a nervous AI decision |
| **The Signal Session** | $15,000 | 1 day intensive + 48-hour Commercial Narrative (15–20 pages) | Company commercializing an AI product |
| **The Revenue Architecture** | $60,000–$100,000 | 30 days (4–5 calendar weeks) | Same, ready for a full commercial rebuild |
| **The AI Immersion** (inquiry-only) | $12,000 | 4-hour facilitated session + 2-page summary in 5 business days | CEO-sponsored exec team needing fast alignment |
| **The Alumni Pass** (invitation-only) | $1,500 / year | Annual | Anyone who has completed any of the above |

Workshops and Cohort are hosted and paid through **Maven** (Slack, payment, alumni community). Enterprise and Immersion are invoiced direct. The Alumni Pass is Stripe-billed via a direct payment link issued post-engagement.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18.3, TypeScript (strict), Vite 5.x |
| Styling | TailwindCSS 3.x, shadcn/ui (Radix), Framer Motion |
| Backend | Supabase Edge Functions (Deno) |
| AI | Anthropic Claude (Mindy reasoning, proposal prose, Nervous Decision Machine, Haiku 4.5), Google Gemini (company synthesis + lead enrichment with Search grounding), OpenAI Whisper (Diagnosis Room voice input) + OpenAI (market sentiment + fallback), Lovable AI Gateway (Live Intel content) |
| Enrichment | Brandfetch, People Data Labs, Tranco, BuiltWith, Perplexity, Exa, NewsAPI (the `enrich-company` dossier orchestrator) |
| Documents | Browserless (proposal HTML → PDF) |
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
│   │   ├── diagnosis/                # The Diagnosis Room (Mindy): DiagnosisRoom, Opener,
│   │   │                             #   Conversation, DossierReveal, DecisionBrief, Fork,
│   │   │                             #   ProposalView, ExpressBooking, MicButton, MindyAvatar,
│   │   │                             #   useDiagnosisSession, types
│   │   ├── nervous-decision/         # Nervous Decision Machine (compact + full)
│   │   ├── new-age/                  # /new-age-leadership components
│   │   ├── proof/                    # CaseStudyCard (for /case-studies)
│   │   ├── Animations/
│   │   ├── NewHero.tsx               # rotating headlines; CTAs open the Diagnosis Room
│   │   ├── BigProblem.tsx            # three interactive flip cards
│   │   ├── TrustSection.tsx
│   │   ├── FrameworkJourney.tsx      # Mind Set → Mind Map → Mind Make
│   │   ├── OperatorsEdge.tsx         # v5 credential
│   │   ├── OperatorsBrief.tsx        # Live Intel homepage teaser
│   │   ├── PriceTicker.tsx
│   │   ├── LightningLessons.tsx      # 5 Maven Lightning Lesson links
│   │   ├── Navigation.tsx
│   │   ├── Footer.tsx
│   │   ├── ScopingModal.tsx          # retained fallback booking path
│   │   ├── InitialConsultModal.tsx   # legacy conversion surface (alumni-only)
│   │   ├── CookieConsent.tsx
│   │   ├── ErrorBoundary.tsx
│   │   └── SEO.tsx
│   │   # NOTE: YFork.tsx and PreCallQualifier.tsx still exist but are no longer mounted.
│   ├── pages/
│   │   ├── Index.tsx                 # homepage (eager-loaded)
│   │   ├── Workshops.tsx + workshops/ # /workshops index + 5 sub-pages
│   │   ├── Cohort.tsx                # /cohort (Maven enrolment)
│   │   ├── Enterprise.tsx            # /enterprise. Signal Session + Revenue Architecture + Immersion
│   │   ├── Capital.tsx               # /capital (third door for funds)
│   │   ├── Operator.tsx              # /operator, 14-agent OS credential page
│   │   ├── CaseStudies.tsx           # /case-studies, filterable anonymised proof
│   │   ├── Brief.tsx                 # /signal. Live Intel
│   │   ├── Immersion.tsx             # /immersion. AI Immersion (inquiry-only)
│   │   ├── Alumni.tsx                # /alumni. Alumni Pass (invitation-only, noindex)
│   │   ├── NewAgeLeadership.tsx      # /new-age-leadership, long-form thought leadership
│   │   ├── LeadershipInsights.tsx    # /leaders. Decision Readiness Diagnostic
│   │   ├── Library.tsx               # /library (includes FAQ tab)
│   │   ├── Blog.tsx, BlogPost.tsx
│   │   ├── Contact.tsx, Privacy.tsx, Terms.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                        # useModelData (ALLOWED_MODEL_IDS), useScrollDirection, etc.
│   ├── contexts/SessionDataContext.tsx
│   ├── integrations/supabase/
│   ├── lib/, utils/, data/           # data/caseStudies.ts, lib/stripe-prices.ts
│   └── index.css                     # design tokens
├── supabase/
│   └── functions/
│       ├── _shared/{mindy,enrich,proposal}/  # shared Diagnosis Room logic
│       ├── mindy-chat/                # Claude, Mindy's reasoning turn
│       ├── enrich-company/            # company dossier orchestrator (Brandfetch/PDL/Tranco/…)
│       ├── generate-proposal/         # co-branded one-pager + Browserless PDF
│       ├── session-digest/            # Resend, intelligence email to Krish + opt-in visitor copy
│       ├── transcribe/                # OpenAI Whisper (voice input)
│       ├── nervous-decision-machine/  # Claude Haiku 4.5
│       ├── get-ai-news/               # Live Intel content
│       ├── get-market-sentiment/      # OpenAI
│       ├── get-model-data/            # frontier-model price feed
│       ├── send-lead-email/           # Gemini company research + Resend
│       ├── send-contact-email/
│       ├── send-leadership-insights-email/
│       ├── notify-scoping-request/    # ScopingModal intake → Krish
│       ├── notify-ctrl-waitlist/      # CTRL waitlist → Krish
│       ├── import-audience-csv/       # Substack subscriber CSV → audience_contacts
│       └── create-consultation-hold/  # Stripe (bypassed)
├── public/                            # llms.txt, robots.txt, sitemap.xml, rising-cities.mp4, ctrl-demo-video.mp4, mindy.png, Krish-Headshot.png
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
| `/` | Homepage (eager-loaded). CTAs open the Diagnosis Room |
| `/start` | The Diagnosis Room (Mindy) as a standalone page |
| `/workshops`, `/workshops/:slug` | Five $599 one-day Workshops (Maven) |
| `/cohort` | The AI-Fluent Executive (Cohort). Maven enrolment |
| `/enterprise` | Signal Session ($15k) + Revenue Architecture ($60–100k, 30 days) + AI Immersion |
| `/capital` | Third door: Signal Session + Revenue Architecture repositioned for funds |
| `/operator` | How I operate, 14-agent OS credential page |
| `/case-studies` | Filterable anonymised client case studies |
| `/signal` | **Live Intel**, model price ticker, classified archive (WATCH/SKIP/CALL/TAKE), Nervous Decision Machine |
| `/immersion` | AI Immersion ($12k, inquiry-only). Footer-linked, not nav |
| `/alumni` | Alumni Pass ($1,500/yr, invitation-only, noindex). Not linked |
| `/library` | Library of resources (includes FAQ tab) |
| `/new-age-leadership` | Long-form thought leadership, agent-native org chart |
| `/leaders`, `/leadership-insights` | Decision Readiness Diagnostic (unlinked from nav) |
| `/blog`, `/blog/:slug` | Blog |
| `/contact`, `/privacy`, `/terms` | Support pages (`/faq` → `/library?tab=questions`) |

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
| `mindy-chat` | Anthropic Claude. Mindy's reasoning turn for the Diagnosis Room (strict-JSON, voice-gated) |
| `enrich-company` | Company dossier orchestrator (Brandfetch + PDL + Tranco + BuiltWith + Perplexity/Exa/NewsAPI + Gemini/Anthropic synthesis). `scale.*` is internal routing only |
| `generate-proposal` | On-the-fly co-branded "Mindmaker × [company]" one-pager; HTML + Browserless PDF |
| `session-digest` | Resend. Full session intelligence to Krish + opt-in proposal copy to the visitor |
| `transcribe` | OpenAI Whisper. Voice input for the Diagnosis Room mic |
| `nervous-decision-machine` | Anthropic Claude Haiku 4.5. JSON artefact for the Nervous Decision Machine |
| `get-ai-news` | Live Intel content (taxonomy: WATCH / SKIP / CALL / TAKE) |
| `get-market-sentiment` | OpenAI, market sentiment |
| `get-model-data` | Frontier-model price + spec feed for the PriceTicker |
| `send-lead-email` | Gemini company research with Google Search grounding + Resend (3× retry) |
| `send-contact-email` | Contact form |
| `send-leadership-insights-email` | Diagnostic results dual-email |
| `notify-scoping-request` | ScopingModal intake → email Krish |
| `notify-ctrl-waitlist` | CTRL waitlist → email Krish |
| `import-audience-csv` | Substack subscriber CSV → shared `audience_contacts` table (secret-gated) |
| `create-consultation-hold` | Stripe (currently bypassed; Cohort payment via Maven) |

---

## Environment Variables

Required / optional secrets in Supabase (a missing enrichment key just disables that tool, the dossier degrades, it does not fail):
```
ANTHROPIC_API_KEY        Mindy reasoning, proposal prose, Nervous Decision Machine
GOOGLE_AI_API_KEY        Gemini company synthesis (enrich-company)
GEMINI_API_KEY           Lead enrichment (Search-grounded; preferred)
OPENAI_API_KEY           Whisper transcription, market sentiment, enrichment fallback
RESEND_API_KEY           Email delivery (session-digest + the send-* functions)
BROWSERLESS_API_KEY      Proposal HTML → PDF (generate-proposal)
BRANDFETCH_API_KEY       Company identity / logo / colours (co-brand)
PEOPLEDATALABS_API_KEY   Company size / routing signal
BUILTWITH_API_KEY        Tech-stack signal
EXA_API_KEY              Proof matching + currency
PERPLEXITY_API_KEY       Company currency / recent signals
NEWSAPI_API_KEY          Recent news for the dossier
AUDIENCE_IMPORT_SECRET   Gate for import-audience-csv
LOVABLE_API_KEY          AI Gateway (auto-provisioned)
STRIPE_SECRET_KEY        Payments (paused)
```

---

## Documentation

Full documentation in [`project-documentation/`](./project-documentation/):

- **[SALES_PLAYBOOK.md](./project-documentation/SALES_PLAYBOOK.md)**. single ground-truth doc for AI sales/marketing agents
- **[COMMERCIAL_REFERENCE.md](./project-documentation/COMMERCIAL_REFERENCE.md)**. durable commercial reference (the `mindmaker` Claude skill): buyer-journey ladder, three ICPs, CTRL, Substack, Stripe, sales motion, Mindmaker vs Mindmaker OS
- **[mindy/](./project-documentation/mindy/)**. Mindy's Brain Pack, system prompt, reasoning, fit rubric, pricing-range model, proof bank, CANON, voice-lint for the Diagnosis Room
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
| Primary Accent (Emerald) | `#00D9B6` (HSL `171 100% 43%`) |
| Display Font | Space Grotesk Variable |
| Body Font | Inter Variable |

The signature accent is **portfolio emerald** as of 2026-06-29. Mindmaker adopted CTRL's emerald in a brand-cohesion pass so the three sibling products (Mindmaker, CTRL, Make Your Mind Up) read as one house over one shared MindmakerOS token contract. The legacy `--mint*` CSS tokens and the Tailwind `mint` key are kept as **aliases** to emerald (zero-churn migration), so `bg-mint` / `shadow-mint-*` / `text-mint` still work and now render emerald; prefer the new `emerald*` keys in new code. WHY + the full WCAG derivation: `prototypes/brand-emerald-proof.{html,md}`.

### Critical Rules
- **Never** use bright emerald (`text-mint` / `text-emerald`) on white/light backgrounds (fails WCAG, exactly like mint did). For text/links on light backgrounds use **`text-emerald-deep`** (`#06746d`, full AA 5.21), or `text-foreground` / `text-ink`.
- Use `.dark-cta-card` class or `text-dark-card-*` utilities on dark backgrounds
- Bright emerald is for fills, CTA backgrounds, dark-bg accents, shadows, and the focus ring only

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
- **Cohort enrolment:** [maven.com/mindmaker/the-ai-fluent-executive](https://maven.com/mindmaker/the-ai-fluent-executive)

---

## License

Private repository. All rights reserved.
