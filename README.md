# Mindmaker — The Anti-Consultancy for AI Decisions

**Last Updated:** 2026-02-25

---

## Overview

Mindmaker is a 1:1 sprint that turns AI chaos into calm, clear, executable direction. No training. No decks. No demos. Just decisions. We help leaders make the nervous decisions they've been avoiding about AI — and feel good about them.

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Live Site:** [themindmaker.ai](https://themindmaker.ai)
**Lovable Project:** [lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf](https://lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.3, TypeScript, Vite 5.x |
| Styling | TailwindCSS 3.x, Shadcn/ui, Framer Motion |
| Backend | Supabase Edge Functions (Deno) |
| AI | Vertex AI RAG (Gemini 2.5 Flash), Lovable AI Gateway, OpenAI |
| Email | Resend |
| Payments | Stripe (paused) |
| Scheduling | Calendly |
| Hosting | Lovable Cloud / Vercel |

---

## Quick Start

### Prerequisites
- Node.js 18+ (recommend using nvm)
- npm or pnpm

### Development
```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd mindmaker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build
```bash
npm run build
npm run preview
```

---

## Project Structure

```
mindmaker/
├── src/
│   ├── components/     # React components
│   │   ├── ui/         # Shadcn base components
│   │   ├── ChatBot/    # AI chatbot ("Ask Mindmaker")
│   │   ├── Animations/ # Visual effects
│   │   ├── Interactive/# Interactive demos
│   │   ├── MediaEasterEggs/ # Video, audio, artifact components
│   │   └── ShowDontTell/    # Content sections
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom hooks
│   ├── contexts/       # React contexts
│   ├── lib/            # Utilities
│   ├── data/           # Static data
│   └── index.css       # Design tokens
├── supabase/
│   └── functions/      # Edge functions
├── public/             # Static assets
├── project-documentation/  # Full documentation
└── package.json
```

---

## Framework

**Mind Set → Mind Map → Mind Make**

| Phase | Focus | Outcome |
|-------|-------|---------|
| Mind Set | Clarity | Cut noise, know what matters |
| Mind Map | Leverage | Build your edge, multiply strengths |
| Mind Make | Direction | Decide, ship, measure |

---

## Products

| Product | Duration | Description |
|---------|----------|-------------|
| **4-Week Sprint** | 4 weeks | One decision. Four weeks. Board-ready. |
| **90-Day Sprint** | 90 days | Full journey: Mind Set → Mind Map → Mind Make |
| **Extended Sprint** | 6 months | Continuation of 90-day (by discussion) |

---

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page (homepage scroll experience) |
| `/sprints` | Sprint overview / chooser |
| `/sprint/4-week` | 4-Week Sprint detail page |
| `/sprint/90-day` | 90-Day Sprint detail page |
| `/leaders` | Decision Readiness Diagnostic |
| `/blog` | Blog listing page |
| `/blog/:slug` | Individual blog posts |
| `/builder-economy` | Thought leadership page |
| `/faq`, `/privacy`, `/terms`, `/contact` | Support pages |

### Redirects (Old URLs)
| Old Route | Redirects To |
|-----------|-------------|
| `/builder-session` | `/` |
| `/leadership-lab` | `/` |
| `/portfolio-program` | `/` |
| `/builder-sprint` | `/sprints` |
| `/individual` | `/` |
| `/team` | `/` |

---

## Edge Functions

| Function | Purpose |
|----------|---------|
| `chat-with-krish` | AI chatbot — "Ask Mindmaker" (Vertex AI RAG + Gemini 2.5 Flash) |
| `get-ai-news` | News ticker with SIGNAL/NOISE/DECISION/TAKE categories |
| `get-market-sentiment` | Market analysis (OpenAI) |
| `send-lead-email` | Lead capture + enrichment |
| `send-contact-email` | Contact form |
| `send-leadership-insights-email` | Decision Readiness Diagnostic results |
| `create-consultation-hold` | Stripe checkout (paused) |

---

## Environment Variables

Required secrets in Supabase:
```
GOOGLE_SERVICE_ACCOUNT_KEY  - Vertex AI RAG
OPENAI_API_KEY              - Market sentiment, company research
RESEND_API_KEY              - Email delivery
LOVABLE_API_KEY             - News ticker (auto-provisioned)
STRIPE_SECRET_KEY           - Payments (paused)
```

---

## Documentation

Full documentation available in `/project-documentation/`:

- **[ARCHITECTURE.md](./project-documentation/ARCHITECTURE.md)** - System architecture
- **[FEATURES.md](./project-documentation/FEATURES.md)** - Feature catalogue
- **[DESIGN_SYSTEM.md](./project-documentation/DESIGN_SYSTEM.md)** - Design system guide
- **[BRANDING.md](./project-documentation/BRANDING.md)** - Brand voice and tone
- **[VALUE_PROP.md](./project-documentation/VALUE_PROP.md)** - Value propositions
- **[ICP.md](./project-documentation/ICP.md)** - Ideal Customer Profiles
- **[COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md)** - Known issues & solutions
- **[HISTORY.md](./project-documentation/HISTORY.md)** - Change history
- **[DECISIONS_LOG.md](./project-documentation/DECISIONS_LOG.md)** - Design decisions
- **[DEPLOYMENT.md](./project-documentation/DEPLOYMENT.md)** - Deployment checklist

---

## Brand Implementation Guide

See **[CLAUDE.md](./CLAUDE.md)** for the complete brand vision 11/10 implementation guide, including:
- Section-by-section transformation instructions
- Copy guidelines and voice/tone rules
- Phase-by-phase implementation checklist
- Media easter egg specifications

---

## Design System

| Element | Value |
|---------|-------|
| Primary Dark (Ink) | `#0e1a2b` |
| Primary Accent (Mint) | `#7ef4c2` |
| Display Font | Space Grotesk Variable |
| Body Font | Inter Variable |

### Critical Rules
- **NEVER** use `text-mint` on white/light backgrounds (fails WCAG)
- Use `.dark-cta-card` class or `text-dark-card-*` utilities on dark backgrounds
- Mint (#7ef4c2) for highlights/CTAs ONLY

---

## Deployment

### Via Lovable
1. Open [Lovable Project](https://lovable.dev/projects/ce33b9ef-a970-44f3-91e3-5c37cfff48cf)
2. Click Share → Publish

### Via GitHub
1. Push to main branch
2. Auto-deploy to Lovable Cloud / Vercel
3. Edge functions auto-deploy to Supabase

---

## Contributing

1. Read [CLAUDE.md](./CLAUDE.md) for brand vision and implementation rules
2. Check [COMMON_ISSUES.md](./project-documentation/COMMON_ISSUES.md) for known problems
3. Follow design system in [DESIGN_SYSTEM.md](./project-documentation/DESIGN_SYSTEM.md)
4. Follow voice/tone in [BRANDING.md](./project-documentation/BRANDING.md)
5. Update documentation with your changes

---

## Support

- **Email:** krish@themindmaker.ai
- **Calendly:** Book directly via site CTAs

---

## License

Private repository. All rights reserved.
