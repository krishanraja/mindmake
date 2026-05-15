# Mindmaker Changelog

**Last Updated:** 2026-04-26

> This changelog summarises material releases. For day-by-day commit history see git log. For full chronological history with rationale see [`project-documentation/HISTORY.md`](./project-documentation/HISTORY.md). For architectural and product decisions see [`project-documentation/DECISIONS_LOG.md`](./project-documentation/DECISIONS_LOG.md).

---

## 2026-04-26: Documentation refresh + sales-playbook anchor

- Reconciled all `project-documentation/*` files with the actual codebase as of 2026-04-26
- Added `project-documentation/SALES_PLAYBOOK.md`. single ground-truth doc for AI sales/marketing agents (ICP signals, pain → offer mapping, ROI math, objection bank, channel templates, routing logic)
- Renamed `/signal` nav label across all docs from "The Brief" → **Live Intel**
- Corrected Revenue Architecture duration to **30 days (4–5 calendar weeks)**
- Corrected Signal Session deliverable to **15–20 page Commercial Narrative within 48 hours**
- Documented `/immersion` (The AI Immersion, $12k, inquiry-only) and `/new-age-leadership`
- Documented Maven as canonical Cohort enrolment platform
- Documented chip-based PreCallQualifier (decision → timeline → stakes)
- Rewrote root `README.md` and this `CHANGELOG.md` to reflect current state

## 2026-04: Operator polish wave + new pages

- Added `/immersion` and `/new-age-leadership` routes (lazy-loaded)
- Promoted New Age Leadership into Resources nav, dropped All Enterprise footer link
- Cohort enrolment now flows through Maven (`maven.com/aimindmaker/ai-decision-intensive`)
- "Hosted on Maven" pill + "Reserve my seat on Maven" CTA on `/cohort`
- Lightning Lessons in Resources nav now points at 4 Maven course URLs
- Operator page polish: side-by-side hero, `ctrl-demo-video.mp4` autoplay, USP paragraph, white H1 on dark, mobile spacing tightened
- `PreCallQualifier` rebuilt as chip-based 3-step intake (decision / timeline / stakes); answers feed the consult modal
- `send-lead-email` upgraded to Gemini company research with Google Search grounding (3× retry); qualifier Q&A surfaced first in lead email; commitment-level prominent
- UX audit P0/P1 wave: diagnostic crash, contact storage, console noise, contrast fixes

## 2026-03: v4 barbell + v5 Operator's Edge

- Retired 1:1 sprint products from the public site (4-Week, 90-Day, Builder)
- Introduced The AI Decision Cohort ($3,500/seat, quarterly)
- Introduced enterprise-only pricing: Signal Session $15k, Revenue Architecture $60–100k
- Repositioned homepage Y-fork (AI leaders vs AI products)
- Added `OperatorsEdge` homepage section + `/operator` credential page
- Renamed Signal Desk → Operator's Brief; renamed editorial taxonomy to WATCH / SKIP / CALL / TAKE
- Deleted `/tool` page; Nervous Decision Machine now embedded on homepage + `/signal`
- Retired ChatBot; replaced by `PreCallQualifier`
- Unified primary CTA to "Book a call" everywhere

## 2026-02: Brand vision 11/10

- Brand repositioned: "AI advisory" → "anti-consultancy for nervous decisions"
- Framework established: Mind Set → Mind Map → Mind Make
- Voice: Confident + Cynical + Helpful (Stripe meets Bourdain)
- Two-color system: Ink + Mint
- All project documentation rewritten to match new brand spec

## 2026-01: Foundations and polish

- WCAG AA compliance pass; dark-card text contrast tokens
- Scroll hijack rewrite (continuous monitoring + snap-to-position); permanent hero scrollbar fix
- Comprehensive SEO (sitemap + structured data + prerender)
- Decision Readiness Diagnostic created at `/leaders` (now unlinked from nav)
- Lead enrichment via OpenAI company research
- Stripe $50 hold paused; direct Calendly booking

## 2025-11 / 2025-12: Initial launch

- Lovable project + Supabase Cloud setup
- React + Tailwind + shadcn/ui design system
- Core landing page, hero with particle animation, navigation, footer
- AI news ticker, chat assistant (later retired)
- Calendly + Stripe integration
- Legal pages (privacy, terms)

---

**End of CHANGELOG**
