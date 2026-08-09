---
name: mindmaker
description: Canonical reference for Mindmaker, Krish Raja's AI advisory and product business. Use whenever work touches Mindmaker offers, pricing, ICPs, sales, the website (themindmaker.ai), Maven, the Substack, or the CTRL product. NOT Mindmaker OS, which is the autonomous operating system that runs Mindmaker internally. Mindmaker is sold; Mindmaker OS is run. Trigger on any of: "Mindmaker", "CTRL", "mm-ctrl", "ctrl.themindmaker.ai", "Memory Web", "Edge", "Daily Briefing", "Edge Pro", "/teardown", "/handover", "/cohort", "/enterprise", "/capital", "/immersion", "/workshops", "/alumni", "The Teardown", "The Handover", "AI-Fluent Executive", "Signal Session", "Revenue Architecture", "themindmaker.ai", "Maven cohort", "Mindmaker Substack", "ICP", "offer ladder", or any reference to the current offer architecture, ICP framing, CTRL product, or commercial surface. Last reviewed 2026-08-09. Rule: this document captures what is durable. Anything in flux is flagged so the agent does not treat motion as truth.
---

# Mindmaker: Commercial Reference

> **Provenance & reconciliation.** This file is the durable commercial reference originally authored as the `mindmaker` Claude skill (last reviewed 2026-05-19), reconciled 2026-06-09, and reconciled again 2026-08-09 to the live `krishanraja/mindmaker` site after the August 2026 commercial overhaul. The skill's own rule holds: it captures what is durable, and anything in flux is flagged. Key changes since the 2026-06-09 pass, now reflected below:
> - **The commercial architecture changed on 2026-08-05/06.** Krish unsold Workshops, Enterprise (Signal Session/Revenue Architecture), Capital, the AI Immersion, and the Alumni Pass — route files stay in the repo and stay reachable by direct URL, but stop selling, stop being discoverable (out of nav/footer/sitemap, `noindex`'d), and stop publishing a price. In their place: **The Teardown** ($3,500 fixed, `/teardown`) and **The Handover** ($30k under 250 people / $50k for 250–5,000, `/handover`, gated on a completed Teardown), both Krish-delivered, both invoiced directly (no Stripe checkout). The Cohort remains live, corrected to a $2,000–$3,000/seat range (was a flat $2,500) to match Maven, and is currently sold out.
> - **"Public pricing is ranges only" no longer holds universally.** It's retired for the Teardown and the Handover, which publish exact/banded prices on-site by design (Krish's decision: "publish both prices with the Diagnosis Room as the door"). It's still true for the Cohort, whose exact per-seat price Maven sets.
> - **Known gap, not yet closed:** Mindy's deployed reasoning (`supabase/functions/_shared/mindy/knowledge.ts`) has not been synced to this change. Mindy still recommends and prices the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder and has no knowledge of the Teardown or the Handover. This is a functional risk on the site's primary conversion surface, not just a stale doc — flag it to Krish before treating Mindy's live output as representative of current offers.
> - **The homepage Y-fork remains retired**, and stays distinct from `TwoDoors.tsx`, a different, currently-live homepage component (added August 2026: "do it yourself with CTRL" vs. "do it with me" via Teardown/Handover). Every primary CTA opens **the Diagnosis Room (Mindy)**, which still forks to three honest exits (keep chatting / book a free 15-min call / download a co-branded proposal), confirmed live in `Fork.tsx`. See `CLAUDE.md` → "The Diagnosis Room (Mindy)".
> - **The cohort framework tension remains resolved** (§2.6): *Mind Set → Mind Map → Mind Make* is the canonical cross-offer brand framework; *Diagnose → Decompose → Decide → Deploy* is the cohort's week-by-week curriculum. Both coexist.
> - **`/signal` is "Mindmaker LIVE" / Live Intel**, not "The Signal Desk" (retired name). `/tool` and `/builder-economy` now redirect.
> - **Workshop→Cohort credit is $500 with code `WORKSHOP`** (90-day validity) — historical, since Workshops are currently unsold.

This is the durable reference for Mindmaker the business: its service offers, its product (CTRL), its ICPs, its website, its distribution. For the autonomous operating system that runs the company internally (n8n fleet, Supabase, 13 agents, the dogfood layer), use the `mindmaker-os` skill instead. The two are related but distinct: Mindmaker is sold. Mindmaker OS is run.

---

## 1. What Mindmaker Is

Mindmaker is an AI advisory and product business operating as Mindmaker LLC (and trading as Mindmaker AI). It positions Krish as an operator-advisor who builds commercial engines for businesses using AI, not a consultant who delivers decks.

The thesis in one line: **AI literacy precedes AI strategy.** Most AI initiatives stall because leaders cannot make confident AI decisions, not because the technology is missing. Mindmaker exists to fix that by working with the human, not the tool stack.

The positioning in one sentence: **Most consultants help your business. Mindmaker helps you operate your business with AI.**

The proof: Krish runs an autonomous 14-agent OS (Mindmaker OS) and uses the same playbook he sells. Uptime of the OS is the product demo.

Public surface:
- Website: themindmaker.ai
- CTRL (product): ctrl.themindmaker.ai
- Maven storefront: maven.com/mindmaker (cohort, workshops, free Lightning Lessons)
- Substack: content.themindmaker.ai (editorial feeder)
- Founder site: krishraja.com (positioning, full operator credentials)

---

## 2. The Commercial Architecture

Mindmaker has two distinct commercial surfaces: **services** (as of August 2026, two Krish-delivered offers plus the Cohort, plus several unsold-but-present offers), and **product** (CTRL, a standalone SaaS-style offering). Together they form the full commercial spine.

### 2.1 The live paid offers (current, August 2026)

| Offer | Buyer | Format | Price | Notes |
|---|---|---|---|---|
| **The Teardown** | A leader with one real decision | 10 business days, one decision, <2h client time | $3,500 fixed | Entry rung and gate for The Handover. Claims-based method (evidence-checked claims, four-model cross-examination). Includes a CTRL workspace + 30 days of Edge Pro. Invoiced directly, no Stripe checkout. |
| **The Handover** | CEO, CRO, or VP Product (never CTO), 50–5,000 people | 6 weeks, gated on a completed Teardown | $30,000 under 250 people / $50,000 for 250–5,000 | Capped at 6/year, stated publicly. Krish absent in week 5 by design. Includes a Day-90 recheck. Invoiced directly. |
| **The AI-Fluent Executive** (Cohort) | Individual senior leader | 4-week live cohort, Maven-hosted, ~15 seats | $2,000–$3,000 (range; Maven sets the exact figure) | Corrected 2026-08-05 from a flat $2,500. Currently **sold out** (next cohort Nov 19–Dec 13, 2026); CTAs route to Maven's waitlist. Includes CTRL access. |

Both Teardown and Handover carry a 20% publicity discount (client approves how the work is portrayed), and neither has a Stripe product — see `src/lib/offers.ts` for pricing constants and §9 for what Stripe actually carries.

### 2.1a Unsold offers (routes present, not for sale)

As of 2026-08-05/06, Krish unsold rather than deleted these — the pages still work by direct URL, but are out of nav/footer/sitemap, `noindex`'d, and (where they carried one) stripped of their price:

| Offer | Was | Route |
|---|---|---|
| The Signal Session | 1-day operator-led enterprise intensive, was $15,000 | `/enterprise#signal-session` |
| The Revenue Architecture | 30-day commercial rebuild, was $60,000–$100,000 | `/enterprise#revenue-architecture` |
| The AI Immersion | Half-day team session, inquiry-only, was $12,000 | `/immersion` |
| Mindmaker Workshops (×5) | One-day operator-led workshops, was $599 each | `/workshops` |
| The Alumni Pass | Annual continuity, was $1,500/year | `/alumni` |

`OperatorsEdge`'s homepage CTA still points to `/enterprise#revenue-architecture`, one of these unsold pages — not yet repointed to a live offer as of this pass.

### 2.2 The product line: CTRL

CTRL is Mindmaker's standalone product. Self-serve, SaaS-priced, runs independent of any service engagement. It also functions as a bundled benefit inside the Cohort and Workshops, but its primary commercial role is as a separate revenue line, not a perk. See §10 for the full breakdown.

**The Substack** (free, $120/year paid, $300/year Founding)
Editorial feeder. Not a content blog. Top of the Mindmaker funnel. Reader who pays $120/year should be 70% pre-sold on the Cohort and 30% pre-sold on the Signal Session before they ever hit themindmaker.ai. **The Substack feeds the website, never competes with it.**

### 2.3 The Substack as editorial feeder

(See §6 for the full Substack reference.) The free Sunday post and paid Wednesday brief sit alongside the ladder and feed it. The Substack is the editorial surface. It is not a paid offer in its own right inside the commercial spine; its commercial role is funnel pre-sell.

### 2.4 The ladder (cold buyer to enterprise, current August 2026)

```
Free Lightning Lesson (Maven)
  ↓
Substack free tier
  ↓
CTRL Free                          ← product-led wedge, do-it-yourself door (parallel path)
  ↓
Substack paid $120/year
  ↓
The Teardown $3,500 (fixed)        ← entry rung, do-it-with-Krish door, gate for The Handover
  ↓
The Handover $30-50K (banded)      ← margin engine, gated on a completed Teardown, capped 6/year
```

The AI-Fluent Executive Cohort ($2,000–$3,000/seat range, currently sold out) runs as a parallel peer-cohort option, not a rung in the Teardown→Handover sequence. CTRL Edge Pro (`public/llms.txt` says $49/month; §7.2 and §11 below, sourced from the `mm-ctrl` repo as of their last review, say $9/month — **unreconciled, verify against the live CTRL product before quoting either**) is the retention layer post-CTRL-free. **Unsold as of 2026-08-05/06, no longer part of the live ladder:** Workshops, Signal Session, Revenue Architecture, the Immersion, the Alumni Pass (see §2.1a). Historical ladder diagrams elsewhere in this repo that route through those offers are stale.

### 2.5 Pricing and framework

**Cohort pricing and duration.** Current, Maven-aligned: Cohort = **$2,000–$3,000/seat / 4 weeks** (mostly async + 4 × 90-min live), corrected 2026-08-05 from a flat $2,500. **The Maven page is the canonical source of truth** for cohort price, duration, and curriculum; if asked to write or update any cohort-facing material, confirm the Maven page first, then sync the site. The cohort is currently sold out (next cohort Nov 19–Dec 13, 2026); CTAs route to Maven's waitlist.

**Framework (the former tension, now settled).** The two framework names coexist, each in its own lane (confirmed in `project-documentation/mindy/CANON.md` §5):
- **Mind Set → Mind Map → Mind Make**, the canonical **cross-offer brand framework**, the spine that spans every offer. Previously rendered on the homepage by `FrameworkJourney.tsx`; that component moved off the homepage in August 2026 (replaced there by `TwoDoors.tsx`) and now renders only on `/new-age-leadership`. This is still the name to use when naming "the Mindmaker framework".
- **Diagnose → Decompose → Decide → Deploy**, the **cohort's week-by-week curriculum** only (Weeks 1–4 on the Maven page). Use it only when describing how the cohort is delivered week by week.

**Pricing policy is mixed, not "ranges only."** From June to August 2026 the live site and any AI-generated proposal showed ranges, never exact figures. That changed 2026-08-05/06 for the Teardown ($3,500 fixed) and the Handover ($30k/$50k banded by headcount), both published as exact/banded numbers on-site by Krish's explicit decision. The Cohort still shows a range ($2,000–$3,000) because Maven, not the site, sets its exact price. The unsold offers (Workshops, Signal Session, Revenue Architecture, Immersion, Alumni Pass) show no price at all. **Not yet reconciled to this:** `mindy/pricing-range-model.md` and `mindy/CANON.md` §2.4 still describe ranges-only as a universal rule and the Diagnosis Room's deployed reasoning has not been updated — see the provenance note at the top of this file and `mindy/CANON.md` §0.

---

## 3. The ICPs

Mindmaker organized the commercial surface by ICP, not by product, through mid-2026. As of the August 2026 overhaul, the enterprise- and capital-facing offers that anchored ICPs 2 and 3 are unsold, so this section is split into what's still live and what's a known gap.

### 3.1 Individual leaders → `/teardown`, `/handover`, `/cohort` (live)
Senior leaders with a nervous AI decision to make. Title patterns: VP, SVP, Director, Head of, Chief, and now also CEO/CRO/VP Product for The Handover specifically. Budget authority: personal, sub-departmental, or (for the Handover) departmental. Pain: "I've tried the tools, watched the tutorials, but I am not faster or sharper," or "I have one decision I need taken apart properly." Primary offers: The Teardown ($3,500) → The Handover ($30-50K, gated). Secondary: AI-Fluent Executive Cohort ($2,000–$3,000/seat, currently sold out).

### 3.2 Enterprise buyers → `/enterprise` (UNSOLD, gap)
Companies commercializing AI products or trying to align an exec team on AI. Title patterns: C-suite, EVP, founder. Pain: misalignment, side projects, vendor noise, no production wins. **This ICP's dedicated offers (Signal Session, Revenue Architecture, Immersion) were unsold 2026-08-05.** Krish has not stated where this buyer is currently routed — plausibly toward The Handover if the company is under 5,000 people, or toward the Diagnosis Room to be assessed case by case, but this is unverified. Flag to Krish before asserting a routing here.

### 3.3 Capital allocators → `/capital` (UNSOLD, gap)
Operating Partners, Managing/General Partners, Principals at PE/VC, family offices, wealth allocators. Pain: the fund is not AI-native; portfolio companies are exposed. **This ICP's dedicated offers were unsold 2026-08-05** alongside Enterprise's. Same gap as §3.2: no confirmed current routing for this buyer. Flag to Krish.

**Historical note (pre-August 2026):** Signal Session and Revenue Architecture used to appear on both `/enterprise` and `/capital`, same products with different framing per landing page. Both pages, and that framing, are currently unsold but not deleted.

---

## 4. The Website (themindmaker.ai)

The website is the **centre of gravity** of the commercial surface. Maven is the marketplace. Substack is the editorial feeder. The website is where decisions are made.

### 4.1 Routing (live, August 2026)
```
/                      Homepage. NO Y-fork; TwoDoors + hero + CTAs open the Diagnosis Room (Mindy).
/start                 The Diagnosis Room (Mindy) as a standalone page.
/teardown              The Teardown. $3,500 fixed. In nav ("Work with me") and footer.
/handover              The Handover. $30K/$50K banded, gated on Teardown. In nav and footer.
/cohort                AI-Fluent Executive. $2,000-$3,000/seat range. Sold out. In nav and footer.
/operator              How Mindmaker operates. Mindmaker OS credential page.
/case-studies          Filterable anonymised client case studies (COHORT-STYLE / ENTERPRISE,
                       not yet updated for Teardown/Handover).
/signal                Mindmaker LIVE / Live Intel: model price ticker, classified archive
                       (WATCH/SKIP/CALL/TAKE), the full Nervous Decision Machine.
/library               Library of resources (includes the FAQ tab).
/new-age-leadership    "New Age Leadership" essay (agentic org design).
/leaders, /leadership-insights   Decision Readiness Diagnostic (unlinked from nav).
/blog, /blog/:slug     Blog.
/faq, /privacy, /terms Support (/faq redirects to /library?tab=questions).
/contact               Contact.

UNSOLD (routes exist, reachable by direct URL, out of nav/footer/sitemap, noindex, no price):
/enterprise, /capital, /immersion, /workshops (+5 sub-pages), /alumni.

Redirects: /tool → /signal#decision · /builder-economy → thebuildereconomy.com (external) ·
/sprints → /cohort · /war-room → /enterprise#revenue-architecture (unsold target) ·
/strategy-day → /enterprise#signal-session (unsold target).
```

**Sibling subdomain:** `ctrl.themindmaker.ai` hosts CTRL, the Mindmaker product. Different repo (`mm-ctrl`), different stack details, different design language (light mode, warm off-white, executive-grade). It shares the Mindmaker brand but has its own visual system. See §7.

### 4.2 Design language
- Mint accent colour
- Glass cards (`editorial-card` class)
- `fadeUp` animation primitive
- Dark-bg hero (`bg-ink`) on offer pages
- Same SEO component, Navigation, Footer across pages
- Event-driven CTAs (not Stripe direct for the Teardown/Handover, which have no Stripe product; historically true of the Alumni Pass too): the nav's primary CTA, "Bring me one real decision" (changed from "Book a call" in the August 2026 nav rebuild), dispatches `openDiagnosisRoom` (the Diagnosis Room); `openScopingModal` is a retained fallback on the unsold offer pages and `Cohort.tsx`; `openConsultModal` opens from `/alumni`, `/contact`, and every blog post, not alumni-only
- WCAG: no `text-mint` on light backgrounds

### 4.3 Voice and copy rules (non-negotiable)
- No em dashes anywhere, including code comments
- No buzzwords: "transformation", "synergy", "leverage" as a verb, "game-changer", "unlock your potential"
- No artificial scarcity
- No fear-mongering about job loss
- Active voice, sentence case, direct prose
- British-Australian voice register
- Operator-led tone: confidence earned through having shipped, not asserted

CTA labels permitted: "Bring me one real decision" (primary nav CTA as of August 2026), "Enrol on Maven", "Start with a free lesson", "Request an invitation". "Book a call" is retired as the primary nav label but still appears in body copy and on unsold-offer surfaces.

### 4.4 Repo
- GitHub: `krishanraja/mindmaker`
- Stack: React/Vite/Tailwind, Supabase backend, Vercel hosting
- Stripe price IDs centralised in `src/lib/stripe-prices.ts`
- Documentation lives in `project-documentation/`: `OFFERS.md`, `ICP.md`, `VALUE_PROP.md`, `Master_Messaging_and_FAQ.md`, `SALES_PLAYBOOK.md`, `BRANDING.md`, `DECISIONS_LOG.md`, `ARCHITECTURE.md`, `HISTORY.md`, `FEATURES.md`

---

## 5. Maven (the distribution layer)

Maven is where Mindmaker sells cohorts and workshops. The Mindmaker storefront lives at `maven.com/mindmaker`.

Products on Maven:
- **The AI-Fluent Executive** ($2,500, 4-week cohort). The headline product.
- **Five Workshops** ($599 each, single-topic, operator-led)
- **Free Lightning Lessons**. Used as top-of-funnel wedges; rotate periodically.

Maven collects payment for Cohort and Workshops directly. Stripe products for these exist on the Mindmaker Stripe account but are **referential only** (for tax reporting, accounting parity, and future flexibility). Do not route paid Cohort or Workshop traffic through Stripe.

Pricing gravity on Maven: senior-leader cohorts cluster at $2,500. Going above fights gravity. The price was deliberately set at this point.

---

## 6. The Substack

Three tiers:

| Tier | Price | What you get |
|---|---|---|
| Free | $0 | One public post per week. Archive older than 90 days. Comment access on free posts. |
| Paid | $8/month or $80/year (legacy) or $120/year (current) | Wednesday deep-dive, monthly video explainer, monthly AMA, quarterly state-of-market memo, Operator Slack. |
| Founding | $250-300/year | All of paid plus deeper ecosystem access. |

**Note:** Substack pricing has two recorded states ($80/year vs $120/year). The current target is $120/year paid, $300/year Founding. Confirm against the live Substack before committing copy.

Cadence:
- **Sunday public post** (free). Operator commentary on AI commercial developments. Non-negotiable. This is the funnel.
- **Wednesday paid brief** (paid only). 1,500+ words. Depth is what was paid for.

Every free post ends with a non-negotiable 3-line footer:

> Mindmaker runs the AI-Fluent Executive cohort, five one-day workshops, and enterprise commercial sprints. See the work at themindmaker.ai. Paid subscribers get the weekly operator brief, monthly video explainers, and the Operator Slack.

**Forbidden patterns on Substack:**
- Moving the public Sunday post to paid (kills the funnel)
- Paywalling replies, threads, or comments
- Sponsorships before 5,000+ free subs and 6 months of locked cadence
- Writing about Mindmaker offers directly in posts (the footer does that work)
- Shortening Wednesday below 1,500 words
- Skipping a week (breaks renewal at month 12)

---

## 7. CTRL (the product)

CTRL is Mindmaker's product line. Code-named `mm-ctrl` in the repo. Lives at `ctrl.themindmaker.ai`. It is a working software product that runs independently of Mindmaker's service offers, with its own free tier, paid SKUs, and recurring subscription.

**Positioning:** "Think out loud. See what emerges." Build a portable AI double in 2 minutes. Hear 3 minutes of audio every morning that's actually about your world. Every AI tool you use already knows your context, goals, and thinking style.

**Tagline:** Clarity for Leaders.

### 7.1 What CTRL does

Four core capabilities, all built on a single voice-first capture loop:

1. **Memory Web.** Voice a thought (2 minutes, no typing). Facts are extracted, categorized, verified by the user, and encrypted at rest (AES-256-GCM). The Memory Web is the user's portable AI context.
2. **Edge (Leadership Amplifier).** Synthesizes the Memory Web and assessment data into a leadership profile. Sharpens strengths (Systemize, Teach, Lean Into). Covers weaknesses (Board Memos, Strategy Docs, Emails, Meeting Agendas, Templates, Frameworks). Includes interactive strength/weakness pills with feedback loops, intelligence gap detection, and guided resolution.
3. **Daily Briefing v2.** Three minutes of audio every morning, anchored to the user's actual priorities. Every segment proves its relevance with a specific profile fact. Bookmark to make an anchor persistent; Ban to kill a topic semantically (embeddings-based). Seven briefing types: Daily Brief, Macro Trends, Vendor Landscape, Competitive Intel, Boardroom Prep, AI Model Landscape, Custom Voice. Cold start solved via 11 pre-seeded industry starter beats.
4. **Context Export.** One-click export to any AI tool: ChatGPT (custom instructions), Claude (conversation context), Gemini (formatted context), Cursor (`.cursorrules`), Claude Code (`CLAUDE.md`), or raw markdown. Optimized for General Advisor, Meeting Prep, Decision Support, Code Review, Email Drafting, Strategic Planning.

Plus supporting capabilities:

- **Thinking Tools:** Decision Advisor, Meeting Prep, Team Brief, Stream of Consciousness
- **AI Literacy Diagnostic:** 10-minute assessment across six dimensions (Strategic Vision, Experimentation Culture, Delegation & Automation, Data & Decision Quality, Team Capability, Governance). Surfaces tensions, risk signals, organizational scenarios.
- **Missions & Progress:** Commit to action items from the diagnostic. Adaptive prompts based on momentum.
- **Agent Skill Builder (Phase 8, Edge Pro):** Voice-to-Claude-Skill pipeline. Triage gate → LLM → quality gate → ZIP.

### 7.2 Pricing

| SKU | Price | What you get |
|---|---|---|
| Free / Core | $0 | Memory Web, Context Export, basic Briefing, AI tools |
| Full Diagnostic | $49 one-time | Tensions, risks, scenarios, full thinking tools |
| Deep Context Upgrade | $29 one-time | Enhanced company-context enrichment |
| Diagnostic + Deep Context Bundle | $69 one-time | Both above (saves $10) |
| Edge Pro | $9/month per this section's last review; `public/llms.txt` (2026-08-05) says $49/month | Unlimited Edge artifacts + 7 briefing types + Agent Skill Builder + email delivery |

**Flag:** the $9/month figure above and the $49/month figure the Mindmaker site now publishes disagree. This file defers to the `mm-ctrl` repo's own documentation as the source of truth for CTRL pricing (§13), which this pass did not have access to verify. Confirm the live price on `ctrl.themindmaker.ai` or in `mm-ctrl/project-documentation/` before quoting either number.

CTRL is the only Mindmaker offering with a true freemium tier. It is the product-led acquisition wedge.

### 7.3 Tech stack (high-level)

| Layer | Technology |
|---|---|
| Frontend | React 18.3.1, TypeScript 5.5, Vite 5.4, Framer Motion 12 |
| Routing | React Router v6 (lazy-loaded routes) |
| Styling | Tailwind CSS, shadcn/ui (Radix UI) |
| State | React Context, TanStack Query 5.56 |
| Backend | Supabase (PostgreSQL + 74 Edge Functions, Deno runtime) |
| AI Primary | Vertex AI (Gemini 2.0 Flash) |
| AI Fallback | OpenAI GPT-4o |
| Voice | OpenAI Whisper |
| Embeddings | OpenAI `text-embedding-3-small` (1536-dim, pgvector) |
| Audio | ElevenLabs |
| Auth | Supabase Auth (Email + Google OAuth) |
| Payments | Stripe (signature-verified, idempotent) |
| Email | Resend |
| Hosting | Vercel (frontend), Supabase Cloud (backend) |
| Node | `>=22 <24` |

Verified counts as of 2026-05-13: 74 Supabase edge functions, 51 React custom hooks, 98 PostgreSQL migrations, 25 top-level pages, 11 active routes (+ 5 legacy redirects to `/dashboard`).

CTRL went through a six-week production-hardening audit in April 2026 covering revenue path (Stripe webhook signature verification + idempotency, rate limits), data path (storage bucket, end-to-end account deletion), UX, reliability (`with-timeout` utility on all external calls), observability (structured edge-function JSON logger), and cleanup (6 e2e Playwright specs on the highest-risk paths).

### 7.4 Repo and infrastructure

- **GitHub:** `krishanraja/mm-ctrl`
- **Production URL:** ctrl.themindmaker.ai
- **Staging/preview:** mindmaker-for-leaders.vercel.app
- **Documentation:** `project-documentation/` is the canonical source of truth inside the repo. Key files: `SALES_BRIEF.md`, `ICP.md`, `VALUE_PROP.md`, `OUTCOMES.md`, `Master_Messaging_and_FAQ.md`, `ARCHITECTURE.md`, `FEATURES.md`, `HISTORY.md`, `DECISIONS_LOG.md`, `COMMON_ISSUES.md`. Workflow conventions for Claude Code live in `CLAUDE.md`.
- **Deployment:** Frontend auto-deploys to Vercel on push to main. Edge functions via Supabase CLI. Migrations via the Supabase Management API.

### 7.5 CTRL's role in the commercial architecture

CTRL plays three commercial roles inside Mindmaker:

1. **Standalone product line.** Self-serve, freemium-to-paid, no service engagement required. This is its primary commercial identity.
2. **Bundled benefit in service offers.** Included with the Cohort and the Workshops. Surfaces the product to leaders going through the cohort experience, creates downstream Edge Pro conversions.
3. **Product-led acquisition wedge.** A free CTRL user is a Mindmaker lead. The Daily Briefing, Memory Web, and Context Export create durable habit and demonstrate the methodology, which pre-sells the Cohort and Signal Session.

CTRL is the only piece of the Mindmaker commercial spine that is technically Mindmaker-built software (not a service or an editorial product). It is the closest thing Mindmaker has to a SaaS revenue line.

---

## 8. The Sales Motion

Mindmaker's sales motion has three plays:

### 8.1 Inbound (Maven and Substack feed → website → call)
Maven Lightning Lesson → Substack subscription → site visit → consult modal. The whole sequence is designed to pre-sell. By the time someone fills the modal, they should be 70%+ ready to book the Cohort or Signal Session.

### 8.2 Outbound (Instantly-driven, three ICP sequences)
Three campaigns in Instantly, one per ICP: Leaders, Capital, Businesses. Targets are sourced via Apollo, filtered to title + budget signals + AI-readiness markers. Outbound sequences are operator-voice (no AI-default copy), conditional-free CTAs, no embedded calendar links.

### 8.3 Network (warm intros via Signal & Noise, podcasts, events)
Signal & Noise events, The Builder Economy podcast, RampUp / Signal Shift / POSSIBLE / Cannes presence. These produce relationships that convert directly to Signal Session and Revenue Architecture engagements.

### 8.4 Pain → offer routing

| Buyer pain | Right offer (current, August 2026) |
|---|---|
| "I have one real decision and want it taken apart properly." | The Teardown ($3,500) |
| "The Teardown went well; I want the business rebuilt around it." | The Handover ($30-50K, gated on a completed Teardown) |
| "I have an AI decision and want a structured peer cohort, not 1:1 work." | The AI-Fluent Executive Cohort ($2,000-$3,000/seat) — currently sold out, Maven waitlist |
| "I want to try this myself before paying anyone." | CTRL, free to start |

**Unsold, no longer routable to a live page (flag to Krish if this pain surfaces):** "I want to get sharper on AI but cannot justify a big spend solo" (was Workshop → Cohort); "my team is misaligned on AI and I want a half-day to fix it" (was Immersion); "I have one specific AI commercial question, resolved fast" (was Signal Session); "I need to commercialize an AI product or rebuild our GTM" (was Revenue Architecture); "I am a fund and want my portfolio AI-ready" (was Capital); "I went through the Cohort and want to stay in the loop" (was Alumni Pass).

---

## 9. Stripe (commercial infrastructure)

`src/lib/stripe-prices.ts` (checked this pass) carries only three products — Cohort, the five Workshops, and the Alumni Pass. **The Teardown and The Handover have no Stripe product**; both are invoiced directly per their page copy. The Cohort's `priceFull` code comment still says `$2,500` (pre-correction figure); Maven, not Stripe, is the live Cohort checkout, so this is stale metadata rather than a live discrepancy, but worth fixing for hygiene.

| Product | Price | Purpose |
|---|---|---|
| The AI-Fluent Executive | $2,000-$3,000/seat (site), referential Stripe figure may still read $2,500 | Referential only. Maven collects payment. Sold out. |
| Mindmaker Workshops (×5) | $599 each | Referential only. Unsold as of 2026-08-05 (see §2.1a); Maven collected payment when live. |
| The Alumni Pass | $1,500/year recurring | Was Active, Stripe Checkout on `/alumni`. Unsold as of 2026-08-05. |
| The Teardown | $3,500 fixed | **No Stripe product.** Invoiced directly. |
| The Handover | $30,000 / $50,000 | **No Stripe product.** Invoiced directly. |
| CTRL: Full Diagnostic | $49 one-time | Active. Stripe Checkout on `ctrl.themindmaker.ai`. |
| CTRL: Deep Context Upgrade | $29 one-time | Active. Stripe Checkout on `ctrl.themindmaker.ai`. |
| CTRL: Diagnostic + Deep Context Bundle | $69 one-time | Active. Stripe Checkout on `ctrl.themindmaker.ai`. |
| CTRL: Edge Pro | $9/month recurring (site copy elsewhere says $49/month — unreconciled, verify against the live CTRL product before quoting either) | Active. Stripe subscription, signature-verified webhook, idempotent. |

CTRL's Stripe integration is hardened (April 2026 audit cycle): signature-verified webhooks, idempotency table, rate limits. When changes are made to CTRL pricing, the webhook handler in `supabase/functions/stripe-webhook/` must be updated in lockstep.

The Signal Session, Revenue Architecture, and AI Immersion Stripe entries from the pre-August architecture (was: $15,000 / $60,000-$100,000 / $12,000, direct invoicing) should be treated as retired alongside the pages they supported, not as live products, until Krish reactivates them. When auditing Stripe, archive products outside this table. The dashboard tends to accumulate retired products from earlier iterations of the business. These are noise.

---

## 10. The Boundary with Mindmaker OS

This is the most-often-confused distinction. Stating it explicitly:

| Mindmaker | Mindmaker OS |
|---|---|
| Commercial venture, sold to clients | Autonomous operating system, runs internally |
| One of 13 ventures in the OS portfolio | The OS that runs all 13 ventures |
| Has offers, pricing, ICPs, a website | Has agents, workflows, a Supabase database, n8n fleet |
| Lives at themindmaker.ai | Lives at krishraja10101.app.n8n.cloud + Supabase + VPS |
| Customer-facing | Operator-facing |
| Sells AI literacy and commercial sprints | Executes outbound, research, content, audit, deal flow |

**The OS includes Mindmaker as one of the ventures it manages.** Other ventures the OS manages: AdFixus, Meliora, Fractionl, Signal & Noise, CIRCLE, PULSE, and others. Mindmaker is the largest commercial surface inside the portfolio.

**Where does CTRL sit?** CTRL is *inside* Mindmaker (it is the Mindmaker product line), not a separate venture. The OS runs and operates CTRL the same way it runs the rest of Mindmaker: outbound, content, audit, deal flow. CTRL is customer-facing software; the OS is internal infrastructure. They are not the same thing and should not be conflated.

**The OS is the dogfood layer for Mindmaker.** The fact that Krish runs an autonomous 14-agent system is the proof point that he can advise others on building AI-native businesses. The `/operator` page on themindmaker.ai surfaces this dogfood explicitly.

Practical rule: if the work touches **offers, pricing, ICP, website copy, sales sequences, Maven, Substack, CTRL features or roadmap, or anything customer-facing**, use this skill. If the work touches **agents, workflows, Supabase tables that hold agent state, n8n, Telegram routing, agent operations, internal infrastructure**, use the `mindmaker-os` skill.

---

## 11. Naming Standards (Branding Compliance)

Canonical names (use these exactly, never paraphrase in customer-facing material):

- **Mindmaker** (the business; never "MindMaker" or "Mind Maker")
- **The Teardown** (new, August 2026; $3,500 fixed, `/teardown`)
- **The Handover** (new, August 2026; $30K/$50K banded, `/handover`, gated on The Teardown)
- **The AI-Fluent Executive** (the cohort; this is the current canonical name)
- **Mindmaker LIVE** / **Live Intel** (the on-site live-model-pricing + editorial surface at `/signal`; the nav label is "Mindmaker LIVE"). The earlier names "The Signal Desk" and "The Operator's Brief" are retired as the surface/nav label.
- **The Diagnosis Room** (the on-site Mindy experience; the guide is **Mindy**)
- **CTRL** (the product; always all-caps; tagline "Clarity for Leaders". Repo `mm-ctrl`, domain `ctrl.themindmaker.ai`)
- **Memory Web** (CTRL feature; always capitalised; never "memory web" lowercase)
- **Edge** (CTRL feature; full name "Edge: Leadership Amplifier" when introducing)
- **Daily Briefing** (CTRL feature; current version is v2)
- **Edge Pro** (the CTRL subscription; price unreconciled between sources, see §7.2)

**Unsold as of 2026-08-05/06** (routes exist, no longer sold or discoverable, names still correct if referencing the historical offer): The Signal Session, The Revenue Architecture, The AI Immersion, The Mindmaker Workshops, The Alumni Pass.

Retired names (do not use):
- "The AI Decision Cohort" (retired; replaced by AI-Fluent Executive)
- "Mindmaker Sprints" (retired; replaced by ICP-routed offers)
- "Mindmaker Bootcamp" (retired; replaced by Cohort + Workshops)
- "Mindmaker for Leaders" (retired CTRL working name; the canonical name is CTRL)
- "The Signal Desk" / "The Operator's Brief" (retired as the `/signal` surface/nav name; now Mindmaker LIVE / Live Intel)
- The homepage "Y-fork" (retired June 2026; not to be confused with `TwoDoors.tsx`, a different, currently-live homepage component added August 2026)
- "Book a call" as the primary nav CTA label (retired August 2026; now "Bring me one real decision"; "Book a call" still appears in body copy elsewhere)
- "The four-offer architecture" / "three-ICP framing" (retired August 2026 as a description of the live offer set; see §2 and §3 for current state)

---

## 12. Open Loops (as of last review)

These are live operational items, not durable architecture. Listed so the agent does not treat in-progress work as settled.

- **Highest priority: Mindy's deployed reasoning (`supabase/functions/_shared/mindy/knowledge.ts`) is not synced to the August 2026 offer change.** It still recommends and prices the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder and has no knowledge of the Teardown or the Handover, the offers the rest of the site now sells. The primary conversion surface doesn't know the current product. See `mindy/CANON.md` §0.
- Case-study data (`src/data/caseStudies.ts`) has no entries tagged to the Teardown or the Handover; all proof still routes to the unsold Signal Session / Revenue Architecture framing.
- `OperatorsEdge`'s homepage CTA still points to `/enterprise#revenue-architecture`, one of the unsold pages, not yet repointed.
- CTRL Edge Pro price is unreconciled between `public/llms.txt` ($49/month) and this file's §7.2/§11 ($9/month, sourced from `mm-ctrl` at last review) — confirm against the live product.
- Outbound sequences in Instantly were being rebuilt across three ICPs (Leaders, Capital, Businesses) as of the last review; two of those three ICPs' dedicated offers are now unsold (§3.2, §3.3) — confirm whether outbound targeting has been updated to match.
- The Diagnosis Room (Mindy) shipped June 2026 as the primary conversion surface; the `mindy/` Brain Pack still carries a short go-live confirmation list (proof anonymisation, EU consent posture) for Krish to clear, see `project-documentation/mindy/README.md`
- Case study carousel for AI accelerator partnership pitch (ten-card, Reposition/Rebuild/Dogfood); the on-site filterable version is live at `/case-studies`
- Substack tier migration (legacy $80/year to current $120/year) to be confirmed against live state

Any work touching these areas should check the live state before committing, not assume the skill is current.

---

## 13. How to Use This Skill

When working on Mindmaker:

1. **Always confirm Maven and the website are the system of record** for cohort pricing, names, and framework. For CTRL, the `mm-ctrl` repo's `project-documentation/` folder is the source of truth. User memory and older documentation may lag, and this file itself lagged a real commercial architecture change for over a month (August 2026 overhaul not reconciled here until 2026-08-09) — check the live site before asserting current offers with confidence.
2. **Default to the current live offer set: The Teardown, The Handover, and the Cohort, plus CTRL as a separate product line.** Workshops, Signal Session, Revenue Architecture, Immersion, and the Alumni Pass are unsold, not deleted — don't present them as currently for sale, and don't assume they're gone forever either. Do not invent new product categories without explicit instruction. CTRL is a product, not a service offer.
3. **Substack feeds the website, never competes with it.** Apply this filter to all editorial decisions.
4. **No em dashes, no buzzwords, operator voice.** Voice rules are non-negotiable. Cross-check the `krish-voice` skill before publishing.
5. **Do not confuse Mindmaker with Mindmaker OS.** Use the boundary in §10 to route the work. CTRL is inside Mindmaker, not a sibling venture of the OS.
6. **When in doubt about live state**, check the Maven page, the live website, the Substack, the `ctrl.themindmaker.ai` product, and the relevant repo's `project-documentation/` folder in that order.
