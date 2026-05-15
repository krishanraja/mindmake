# Mindmaker Changelog

**Last Updated:** 2026-05-15

> This changelog summarises material releases. For day-by-day commit history see git log. For full chronological history with rationale see [`project-documentation/HISTORY.md`](./project-documentation/HISTORY.md). For architectural and product decisions see [`project-documentation/DECISIONS_LOG.md`](./project-documentation/DECISIONS_LOG.md).

---

## 2026-05-15: v6 ladder restructure (Workshops + Alumni Pass)

- Restructured the offer architecture from a barbell into a four-rung ladder: free Lightning Lessons → paid Workshops at $599 → AI-Fluent Executive Cohort at $2,500 → Enterprise from $15,000, with the Alumni Pass at $1,500/year as continuity
- **Cohort renamed** from "The AI Decision Cohort" to **"The AI-Fluent Executive"** everywhere
- **Cohort repriced** $3,500 → **$2,500** (split now $1,250 × 2)
- **Cohort duration** 3 weeks → **4 weeks**
- **Cohort framework** "Name → Map → Make" → **"Diagnose → Decompose → Decide → Deploy"**
- Added 5 one-day **Workshops** at $599 each, hosted on Maven: `/workshops` index plus 5 sub-pages (Build Your AI Chief of Staff, Map Your Agentic Org Chart, Vibe Coding for Leaders, Build an Autonomous Business Function, Give Your AI Memory)
- Added the **Alumni Pass** at `/alumni` ($1,500/year, invitation-only, `noindex`, unlinked from nav and footer)
- Replaced dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` with `maven.com/mindmaker/the-ai-fluent-executive` everywhere
- Homepage tri-fork updated to "Workshops | Cohort | Enterprise" (Capital remains in the Enterprise nav dropdown)
- Navigation: Workshops added as slot 1; Operator dropdown renamed to "Resources" with How I operate, Library, The Builder Economy, Lightning Lessons
- NewHero: added "Or start with a free lesson →" tertiary link to the Maven instructor page; subheadline updated to "Workshops, cohorts, and enterprise sprints that turn AI chaos into direction."
- LightningLessons updated to render the 5 canonical Maven URLs (was 4)
- Cohort page: CTRL added to "What you keep"; $500 workshop-credit callout (`code WORKSHOP`) added near the price card
- Added `src/lib/stripe-prices.ts` with all canonical Stripe product and price IDs
- Extended `PreCallQualifier` routing rules: technical-build + this-quarter → Workshop; personal-clarity + exploring → Free Lightning Lesson
- Extended `send-lead-email` `programLabels` map to include workshop / alumni / free-lesson values
- SEO: added `noindex` prop to `SEO.tsx`; sitemap excludes `/alumni`; sitemap and prerender include all 6 new pages
- Docs updated across the board (OFFERS, ICP, VALUE_PROP, BRANDING, HISTORY, DECISIONS_LOG, ARCHITECTURE, FEATURES, COMMON_ISSUES, DEPLOYMENT, REPLICATION_GUIDE, SALES_PLAYBOOK, Master_Messaging_and_FAQ)

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
- Cohort enrolment now flows through Maven (`maven.com/mindmaker/the-ai-fluent-executive`)
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
