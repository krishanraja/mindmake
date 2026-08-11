---
name: mindmaker
description: Canonical reference for Mindmaker, Krish Raja's AI advisory practice. Use whenever work touches Mindmaker offers, pricing, ICP, sales, the website (themindmaker.ai), the Substack, or the CTRL product. NOT Mindmaker OS, which is the autonomous operating system that runs Mindmaker internally. Mindmaker is sold; Mindmaker OS is run. Trigger on any of: "Mindmaker", "CTRL", "mm-ctrl", "ctrl.themindmaker.ai", "/teardown", "/handover", "/capital", "/start", "/alumni", "The Teardown", "The Handover", "themindmaker.ai", "Mindmaker LIVE", "ICP", "offer ladder", or any reference to the two-engagement architecture, the single ICP, the CTRL product, or the commercial surface. Last reviewed 2026-08-11. Rule: this document captures what is durable. Anything in flux is flagged so the agent does not treat motion as truth. Never answer a current price from this file alone; `src/lib/offers.ts` is canonical.
---

# Mindmaker: Commercial Reference

> **Provenance and reconciliation.** This file is the durable commercial reference originally authored as the `mindmaker` Claude skill and stored here on 2026-06-09. It was **substantially rewritten on 2026-08-11** after the reprice. The skill's own rule holds: it captures what is durable, and anything in flux is flagged.
>
> What changed on 2026-08-11, and why nothing written before that date can be trusted on offers or pricing:
> - **Advisory was retired in July 2026** in anticipation of a full-time role, and **reinstated on 11 August 2026** when the role fell through on an immigration technicality rather than on the work. Advisory is the primary cash engine.
> - **The six-rung ladder is gone.** Two engagements: The Handover and The Teardown.
> - **Prices are published, not ranges,** in USD, GBP and AUD, as set prices per market rather than conversions. Canonical source: `src/lib/offers.ts`. Never quote a price from this document.
> - **No discounts are published.** Both the credit escalator and the 20% publicity discount were removed.
> - **CTRL is no longer sold here.** It is a separate product on its own site.
> - **Maven is gone** as a payment rail, along with the offers that transacted there.

This is the durable reference for Mindmaker the business: its service offers, its product (CTRL), its ICPs, its website, its distribution. For the autonomous operating system that runs the company internally (n8n fleet, Supabase, 13 agents, the dogfood layer), use the `mindmaker-os` skill instead. The two are related but distinct: Mindmaker is sold. Mindmaker OS is run.

---

## 1. What Mindmaker is

Mindmaker is an AI advisory practice operating as Mindmaker LLC. It positions Krish as an operator-advisor who rebuilds how a business decides and sells with AI, not a consultant who delivers decks.

**Mindmaker is a capped advisory practice. A small number of engagements a year.** That is the shape, and it is stated publicly.

The thesis in one line: **AI literacy precedes AI strategy.** Most AI initiatives stall because leaders cannot make confident AI decisions, not because the technology is missing.

The enemy statement, which is the sharpest line on the site: *Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it.*

The spine sentence, which must not be contradicted anywhere: **Sixteen years commercialising content, media and IP businesses. Now I build the AI systems that run them.** The cluster `content, media and IP businesses` appears word for word.

The proof: Krish runs a 14-agent AI operating system with 45 workflows in production, licensed to three businesses, and uses the same playbook he sells.

**No geographic market is stated anywhere.** The practice sells internationally, which is why the site carries three currencies. Krish's market belongs on his LinkedIn profile and nowhere else.

Public surface:
- Website: themindmaker.ai
- CTRL (a separate product): ctrl.themindmaker.ai
- Mindmaker LIVE: live.themindmaker.ai
- Founder site: krishraja.com

---

## 2. The commercial architecture

Two paid engagements. Nothing else is for sale.

### 2.1 The two engagements

| Engagement | Buyer | Format | Price (USD) | Notes |
|---|---|---|---|---|
| **The Handover** | CEO, CRO or VP Product at a company of 50 to 5,000 people | Six weeks, plus a Day 90 recheck | $18,000 under 100 people, $30,000 for 100 to 250, $50,000 for 250 to 5,000 | Capped at six a year. Always via the call. Gated on a completed Teardown. Week five Krish does not attend. |
| **The Teardown** | Anyone with one nameable, unresolved decision | Ten business days, under two hours of client time | $9,500 | The entry rung and the gate. Self-serve; the price is published. |

Also published in GBP and AUD. **Never quote a price from this document.** `src/lib/offers.ts` is canonical, and a test fails the build if a price string appears anywhere else in the web surface.

**Set prices per market, not conversions.** No FX logic exists in the estate and none may be added.

**No discounts.** Krish keeps a discretionary credit as a closing tool for a live call. It is deliberately absent from the site, the documentation and Mindy's knowledge base.

### 2.2 The third door: funds and portfolio companies

The same two engagements, priced per portfolio company, at `/capital`. Fund-level and multi-company terms are set on the call, never published. This is a door, not a separate offer or a separate ICP.

### 2.3 CTRL

A separate product with its own site and its own pricing. **It is not sold on themindmaker.ai.** It appears in exactly two ways: as a Teardown deliverable ("a CTRL workspace with your decision map in it") and as a product link.

Removed as a purchasable line in August 2026 on the portfolio analysis: CTRL is the mechanism rather than a P&L line, and AI-native SaaS retention under $50 a month runs around 23% gross revenue retention. Before the removal the site carried three contradictory CTRL prices simultaneously.

### 2.4 The Alumni Pass

Invitation-only, `noindex`, unlinked from nav and footer, reachable by direct URL. Retention infrastructure, not an acquisition path, and not part of the public ladder. It survives the reprice because it was never a public offer.

### 2.5 Mindmaker LIVE

The publication, at `live.themindmaker.ai`. Two formats: **Built**, on why someone built the thing they built, and **Paid**, on who is actually getting paid in a shift and by what mechanism. **It has paid tiers, so never describe it as free.** Always link the branded domain, never the underlying Substack URL, so the redirect can be repointed later.

### 2.6 What each engagement collects

Every engagement defines, in the offer definition itself, one structured thing it captures and retains: how the client priced and packaged, what converted, what had to change, and what commercial constraint the answer had to live inside. Internal only, never a selling point. See `OFFERS.md` and `src/lib/offers.ts`.

The reasoning: advisory that produces only fees is a day rate with extra steps. The barrier to collecting something nobody else can assemble is what decides whether the practice is worth anything later.

---

## 3. The ICP

**One ICP.** Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells. Never the CTO, because this is commercial work.

Funds, family offices and operating partners are a **door**, not a second ICP. They buy the same engagements for a portfolio company that fits the profile above.

The deep archetype is `ICP_ACCOUNTABLE_DELEGATOR.md`, and the finding that matters most is that the fraud feeling is rational rather than neurotic.

---

## 4. The website (themindmaker.ai)

The website is the **whole commercial surface**. Nothing transacts through a third party any more.

```
/                      Homepage. Hero, BigProblem, TwoDoors, TrustSection,
                       OperatorsEdge, OperatorsBrief, SimpleCTA.
/start                 The Diagnosis Room (Mindy) as a standalone page.
/teardown              The Teardown. One price, currency switcher, the method.
/handover              The Handover. Three bands, the six weeks, the $254K POC.
/capital               The same two, per portfolio company. Fund terms on the call.
/operator              How Krish operates. The 14-agent OS credential page.
/case-studies          Anonymised proof, filterable by Teardown / Handover.
/signal                Mindmaker LIVE. Live model prices, WATCH/SKIP/CALL/TAKE.
/library               Resources and FAQ.
/new-age-leadership    Long-form on agent-native org design.
/blog, /blog/:slug     Blog.
/contact /privacy /terms
/alumni                Invitation-only, noindex, unlinked.
```

Ten routes from the retired ladder are **real 301s in `vercel.json`**, with a client-side fallback in `App.tsx`. Their page components are in `src/_archive/`.

**Primary CTA everywhere: "Bring me one real decision"**, which opens the Diagnosis Room. The `ScopingModal` is the secondary booking surface; `InitialConsultModal` is legacy and used only by `/alumni`.

**Currency:** a three-way switcher (USD default) on every page that shows a price. The choice persists across navigation and reloads via a cookie, and `?currency=` overrides it. Nothing auto-detects from locale or IP, deliberately.

**Crawler surface:** `scripts/prerender.mjs` writes a real body per route with real USD prices interpolated from `offers.ts`, guarded by assertions that the prices landed and that no non-default currency leaked into a static file. `public/llms.txt` is generated from the same source.

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

> Mindmaker is a capped advisory practice: The Teardown takes one decision apart in ten business days, The Handover spends six weeks rebuilding how a business decides and sells. See the work at themindmaker.ai.

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
| Edge Pro | $9/month | Unlimited Edge artifacts + 7 briefing types + Agent Skill Builder + email delivery |

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
3. **Product-led acquisition wedge.** A CTRL user is a Mindmaker lead. The habit it creates demonstrates the methodology, which pre-sells the advisory. CTRL's own pricing lives on its own site and is never quoted here.

CTRL is the only piece of the Mindmaker commercial spine that is technically Mindmaker-built software (not a service or an editorial product). It is the closest thing Mindmaker has to a SaaS revenue line.

---

## 8. The Sales Motion

Mindmaker's sales motion has three plays:

### 8.1 Inbound (editorial feeds the site, the site feeds the Diagnosis Room)

Mindmaker LIVE or the podcast, then a site visit, then the Diagnosis Room. The sequence is designed to pre-sell, so by the time someone opens the room they should already know roughly what they want.

### 8.2 Warm introductions

The motion Krish actually sustains, and the reason a low-priced entry rung was rejected during the August 2026 reprice: at a low price point, the arithmetic requires a volume of sales that warm introductions cannot produce.

### 8.3 Speaking and relationships

Signal & Noise events, The Builder Economy podcast, and conference presence. These produce relationships that convert directly to engagements.

### 8.4 Routing

| What they say | Rung |
|---|---|
| "I have an AI decision and need a structured way through it." | The Teardown |
| "We shipped it and we cannot sell it." | The Handover |
| "One of our portfolio companies is stuck." | The same two, per portfolio company |
| "We just want training." | Nothing. Mindmaker does not sell training |
| "We want someone in the business a few days a month." | Nothing. No fractional roles |
| "We should do some AI stuff." | Nothing yet. Free on-ramp, come back with a decision |

The default is the Teardown. Routing straight to six weeks because the company is large is the most common way to get this wrong.


## 9. Stripe (commercial infrastructure)

Stripe products that should exist on the Mindmaker account:

| Engagement | Price (USD) | Status |
|---|---|---|
| The Handover | $18,000 / $30,000 / $50,000 by headcount | Active. Direct invoicing, 50/50 at kickoff and delivery. |
| The Teardown | $9,500 | Active. Direct invoicing on kickoff. |
| The Alumni Pass | Invitation-only | Active. The only product the site itself charges, via a direct Stripe link. |

Prices are canonical in `src/lib/offers.ts`, not in Stripe and not in this table.


CTRL's Stripe integration is hardened (April 2026 audit cycle): signature-verified webhooks, idempotency table, rate limits. When changes are made to CTRL pricing, the webhook handler in `supabase/functions/stripe-webhook/` must be updated in lockstep.

When auditing Stripe, archive products outside this canonical list. The dashboard accumulates retired products from earlier iterations of the business, and after the August 2026 reprice that is most of it. These are noise, and none of them should be reachable from a checkout.

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

Practical rule: if the work touches **offers, pricing, ICP, website copy, sales sequences, Mindmaker LIVE, CTRL positioning, or anything customer-facing**, use this skill. If the work touches **agents, workflows, Supabase tables that hold agent state, n8n, Telegram routing, agent operations, internal infrastructure**, use the `mindmaker-os` skill.

---

## 11. Naming Standards (Branding Compliance)

Canonical names (use these exactly, never paraphrase in customer-facing material):

- **Mindmaker** (the business; never "MindMaker" or "Mind Maker")
- **The Handover** (capital H, definite article)
- **The Teardown** (capital T, definite article)
- **CTRL** (all caps, a separate product, never a Mindmaker tier)
- **Mindmaker LIVE** (the publication, with **Built** and **Paid** as its two formats)

Retired names (do not use):
- Every offer name from the retired six-rung ladder. `DECISIONS_LOG.md` holds the record; naming them here would put them in a retrieval source
- "Mindmaker Sprints" (retired; replaced by ICP-routed offers)
- "Mindmaker for Leaders" (retired CTRL working name; the canonical name is CTRL)
- "The Signal Desk" / "The Operator's Brief" (retired as the `/signal` surface/nav name; now Mindmaker LIVE / Live Intel)
- The homepage "Y-fork" (retired June 2026; the homepage now funnels into the Diagnosis Room)

---

## 12. Open Loops (as of last review)

These are live operational items, not durable architecture. Listed so the agent does not treat in-progress work as settled.

- Outbound sequences in Instantly being rebuilt across three ICPs (Leaders, Capital, Businesses)
- GitHub repo and Stripe products being aligned to the current four-offer architecture
- The Diagnosis Room (Mindy) shipped June 2026 as the primary conversion surface; the `mindy/` Brain Pack still carries a short go-live confirmation list (proof anonymisation, EU consent posture) for Krish to clear, see `project-documentation/mindy/README.md`
- Case study carousel for AI accelerator partnership pitch (ten-card, Reposition/Rebuild/Dogfood); the on-site filterable version is live at `/case-studies`
- Substack tier migration (legacy $80/year to current $120/year) to be confirmed against live state

Any work touching these areas should check the live state before committing, not assume the skill is current.

---

## 13. How to Use This Skill

When working on Mindmaker:

1. **Always confirm Maven and the website are the system of record** for cohort and workshop pricing, names, and framework. For CTRL, the `mm-ctrl` repo's `project-documentation/` folder is the source of truth. User memory and older documentation may lag.
2. **Default to one ICP and two engagements.** Do not invent product categories. CTRL is a separate product on its own site, not a rung, and is never quoted with a price here. If an engagement is not The Teardown or The Handover, it does not exist.
3. **Substack feeds the website, never competes with it.** Apply this filter to all editorial decisions.
4. **No em dashes, no buzzwords, operator voice.** Voice rules are non-negotiable. Cross-check the `krish-voice` skill before publishing.
5. **Do not confuse Mindmaker with Mindmaker OS.** Use the boundary in §10 to route the work. CTRL is inside Mindmaker, not a sibling venture of the OS.
6. **When in doubt about live state**, check the Maven page, the live website, the Substack, the `ctrl.themindmaker.ai` product, and the relevant repo's `project-documentation/` folder in that order.
