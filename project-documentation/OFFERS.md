# Offers: The Full Guide

**Last Updated:** 2026-07-12 (verified against `src/App.tsx`, `src/lib/stripe-prices.ts`, and CLAUDE.md; no drift found. Capital (`/capital`) intentionally not listed as a separate rung here, it reuses the Signal Session / Revenue Architecture formats above for fund-level buyers rather than adding a new offer; see `ICP.md` ICP 2b and `COMMERCIAL_REFERENCE.md` §3.3 for the buyer-side framing.)

> Replaces the previous `SPRINTS.md`. The 1:1 sprint products (4-Week and 90-Day Builder / Orchestrator sprints) were retired from the public site in the v4 barbell pivot. The v6 ladder restructure (May 2026) added paid Workshops as the entry product and the Alumni Pass as a continuity layer. See `mindmaker_rebuild_brief_v4.md` for the v4 rationale and `DECISIONS_LOG.md` for the commercial reasoning behind v6.

---

## The Ladder

Mindmaker is a ladder, not a single product. Free Lightning Lessons sit at the top of the funnel. Workshops are the paid entry. The Cohort is the qualifying step. Enterprise is the margin engine. The Alumni Pass is continuity.

| Offer | Price | Duration | Audience | Route |
|---|---|---|---|---|
| **Workshops** (×5) | $599 / workshop | 1 day each | Leaders ready to build a real artefact alongside Krish | `/workshops` (enrolment on Maven) |
| **The AI-Fluent Executive (Cohort)** | $2,500 / seat | 4 weeks (mostly async) + 4 × 90-min live sessions | AI leaders making a nervous decision | `/cohort` (enrolment on Maven) |
| **The Signal Session** | $15,000 | 1 day intensive + 48-hour Commercial Narrative delivery (15–20 pages) | AI products buyer seeking commercial diagnosis | `/enterprise#signal-session` |
| **The Revenue Architecture** | $60,000–$100,000 | 30 days (4–5 calendar weeks), multi-session | AI products buyer ready for commercial rebuild | `/enterprise#revenue-architecture` |
| **The AI Immersion** (inquiry-only) | $12,000 (flat) | 4-hour facilitated session + 2-page summary within 5 business days | Executive team needing fast alignment on shared AI tensions | `/immersion` |
| **The Alumni Pass** (invitation-only) | $1,500 / year | Annual | Mindmaker alumni post any engagement | `/alumni` (unlinked from nav and footer) |

Every offer has a fixed scope, a fixed outcome, and a finish line.

**Internal floor / ceiling (not public):** Cohort minimum viable enrollment = 8 seats, cap = 15. Revenue Architecture anchor $60k, extended-scope ceiling $125k. Immersion travel charged additional for on-site. Workshop max = 30 seats per session, run as small-group cohort even at scale.

**Payment terms (shown as small muted text on site):**
- Workshops, paid in full at Maven checkout. Maven Guarantee (14-day refund) applies.
- Cohort, "Full payment or 2× $1,250 split" (collected by Maven)
- Signal Session, "Payment on kickoff"
- Revenue Architecture, "50/50 at kickoff and delivery"
- Immersion, "Full at booking or 50/50 at booking + delivery"
- Alumni Pass, $1,500 / year recurring via Stripe, cancel anytime

---

## 1. The AI-Fluent Executive (Cohort)

### Position

The quarterly decision room for senior leaders wrestling with AI decisions. Not a course. Not 1:1 advisory. A peer cohort with real structure, a real finish line, and a board-ready output. Hosted on Maven for enrollment, payment, and alumni community continuity.

### Tagline
**Make your nervous AI decision with 15 other senior leaders.**

### For

Senior operators (CEO, COO, CFO, CPO, CCO, CMO, GM, VP-level, founder-operator) with one nervous AI decision they've been avoiding and the budget authority to act once resolved. Comfortable with "good enough" thinking; tired of over-researching.

### Format

- 10–15 seats per cohort, quarterly cadence
- 4 weeks elapsed, mostly async, structured async work plus weekly live 90-minute sessions
- Live sessions are intimate, Chatham House rules, peer-guided with Krish facilitating
- Each member picks one nervous decision at the start and must produce a board-ready position memo by the end
- **Enrolment, payment, and cohort Slack run on Maven** at `maven.com/mindmaker/the-ai-fluent-executive`. The `/cohort` page on themindmaker.ai surfaces a "Hosted on Maven" pill and a "Reserve my seat on Maven" CTA pointing directly to the Maven URL.

### Curriculum: Diagnose → Decompose → Decide → Deploy

| Week | Theme | Async work | Live session |
|---|---|---|---|
| **Week 1. Diagnose** | Name the real decision underneath the surface decision | 3 videos · 2 frameworks · 1 worksheet | 90-min peer-guided diagnosis session |
| **Week 2. Decompose** | Surface the real trade-offs (build vs buy, now vs wait, this vendor vs that, what stays human vs what gets agentic) | 2 videos · 1 framework · 1 scorecard | 90-min peer pressure-test of the options |
| **Week 3. Decide** | Commit out loud. Leave with a one-page board-ready memo | 1 video · decision memo template | 90-min memo peer review and commitment |
| **Week 4. Deploy** | Ship the first concrete step (a briefed vendor, a signed scope, an internal launch note, a kicked-off pilot) | 1 video · deployment checklist | 90-min show-and-tell, accountability, alumni onboarding |

### What you walk out with

- Board-ready decision memo (1 page)
- Trade-off analysis document
- Lifetime access to CTRL, Mindmaker's flagship memory-web app
- 90 days of cohort Slack access post-cohort
- Lifetime access to curriculum materials
- Invitation to the cohort alumni network
- A peer network of 10 to 15 senior operators
- Working fluency with Diagnose → Decompose → Decide → Deploy

### Example nervous decisions

- "Do we build or buy our AI stack for [specific workflow]?"
- "Which AI vendor do we commit to by end of Q and what's the exit plan?"
- "What AI governance framework do we ship next quarter without slowing the team?"
- "How do I articulate our AI strategy to the board in plain language?"
- "What do we replace vs what do we empower in our org design?"

### What it is not

- Not a course. No certification. No lecture videos.
- Not 1:1 advisory. Krish is in the room but the cohort is the product.
- Not a vendor showcase. Zero vendor pitch.
- Not for substitution: the same 10–15 leaders attend each session for peer continuity.

### Refund policy

Full refund up to 7 days before the cohort starts. 50% refund up to day one. No refund after day one.

---

## 2. The Signal Session

### Position

The enterprise entry point. One day, one room, one commercial thesis for a company that has built AI capability and can't translate it into revenue predictably.

### Tagline
**One day. One room. One commercial thesis.**

### For

Founders, CEOs, CCOs, CROs, CPOs at companies that have shipped AI product or AI-enabled capability in the last 12 months and are seeing erratic pricing, deal sizes, or GTM traction. Typically books within 2–3 weeks.

### Format

- One intensive day (approximately 6 hours in-session), on-site or fully remote
- 2 weeks pre-work: questionnaire, document review, commercial data request
- **Commercial Narrative document delivered within 48 hours**. 15–20 pages
- Krish delivers personally, no associates

### What the day covers

1. **Commercial diagnosis.** Pricing, positioning, packaging, ICP, sales motion, where is the friction?
2. **AI-specific commercial translation.** What does the AI capability enable that the existing GTM isn't built for?
3. **Prioritisation.** Of everything broken, what matters in the next 90 days?
4. **Decision gate.** Does the Revenue Architecture engagement make sense? If not, we say so and you leave with the Commercial Narrative.

### What you walk out with

- **The Commercial Narrative**. 15–20 page document delivered within 48 hours
- Commercial positioning framework, 2 pages, ready for your team
- Sales narrative and objection handling guide
- Pricing model sketch with 2–3 packaging options
- 30-day commercial roadmap with owners and milestones
- A clear read on whether the Revenue Architecture is warranted, with scope estimate if yes
- The Commercial Narrative is yours to keep whether or not you proceed

### What it is not

- Not a sales pitch for the Revenue Architecture. If the answer is "you don't need it," that's the answer.
- Not implementation or deployment. No production IT.
- Not a multi-session engagement. One day, one Commercial Narrative, done.

---

## 3. The Revenue Architecture

### Position

The flagship. A commercial rebuild for a company whose AI capability deserves better positioning, pricing, packaging, and GTM than it currently has. Informed by an operator running a real agentic organisation, not a theorist.

### Tagline
**Your AI capabilities, translated into revenue.**

### For

Enterprise buyers (typically $10M–$1B+ revenue) who have:
- Real AI capability in market or launching imminently
- Budget authority for $60–100k (50/50 payment)
- Leadership willing to act on the output in the following 90 days
- A 30-day window for the engagement (multi-session, structured)

### Format

- **30 days (4–5 calendar weeks)** elapsed
- Structured multi-session engagement; kickoff workshop on-site or remote, then weekly working sessions plus async deliverables
- Krish-led; no associate model
- Fixed scope defined at kickoff (or at Signal Session if Signal preceded), no scope creep
- Cadence: starts at the next monthly cohort opening, book a call to check current availability

### What gets built

| Area | Deliverable |
|---|---|
| **Commercial strategy** | 30–40 page client-branded commercial strategy document |
| **Product marketing** | Positioning, messaging, competitive differentiation framework |
| **Revenue model** | Pricing model with multiple scenarios, tested against business reality |
| **Packaging** | 2–3 packaging and tiering options, ready to ship |
| **GTM playbook** | 90-day GTM playbook: channels, sales process, enablement materials |
| **Product roadmap** | Roadmap aligned to commercial milestones, not just technical milestones |
| **Board narrative** | Board-ready presentation deck (Krish presents if requested) |
| **Follow-up** | 30-day follow-up strategy session included |

### What it is not

- Not implementation. No building products. No running campaigns.
- Not ongoing. Finish line is hard. Post-engagement support only via separate inquiry.
- Not a fractional CAIO / CRO arrangement. Operator guidance during the engagement only.
- Not production IT. Explicitly out of scope.

---

## 4. The AI Immersion (inquiry-only)

### Position

A half-day session for executive teams who need to get aligned on AI fast. Inquiry-only, not featured in main navigation. Serves buyers whose need is a team conversation, not an individual decision or a commercial rebuild.

### Tagline
**Three decisions. One afternoon. Real alignment.**

### For

CEO-level sponsors with up to 8 senior leaders who need to resolve specific shared tensions about AI, vendor commitments, build-vs-buy, board narrative, replace-vs-empower calls, in one focused session.

### Format

- 4-hour facilitated working session (on-site or remote)
- 45-minute pre-alignment call with the sponsoring executive
- Shared document of the three decisions or tensions to resolve
- Pre-session brief circulated to attendees 48 hours before
- 2-page written summary within 5 business days
- Uses the same Diagnose → Decompose → Decide → Deploy protocol as the Cohort
- Private, no recording, Chatham House rules

### What you walk out with

- Three named decisions with named owners and named deadlines
- 2-page written summary, board-ready, delivered within 5 business days
- A team genuinely aligned (not performatively aligned) on the three issues addressed

### Payment

$12,000 flat. Travel additional for on-site. Full payment at booking or 50/50 at booking and delivery.

### What it is not

- Not multi-session. The format breaks past 4 hours and 8 people.
- Not virtual presentations. The room dynamic is the product.
- Not a public offer. Surface only when team alignment is genuinely the right shape.
- Not recordable. The format depends on candor; recording kills candor.

---

## Inquiry-only: 1:1 engagements

Occasionally a senior leader arrives looking specifically for private 1:1 work rather than the cohort. This is handled via inquiry, not sold on the public site.

- Trigger: `/cohort?inquiry=1:1` URL surfaces a muted banner linking to Contact
- Scope and price are set per engagement
- No public pricing, no public page
- Never promoted in nav, footer, or content

Prior 1:1 products (4-Week Sprint, 90-Day Sprint, Builder Sprint, Builder Session) are retired. Their URLs redirect to `/cohort?inquiry=1:1` or `/cohort` per `src/App.tsx`.

---

## Framework (all offers)

**Mind Set → Mind Map → Mind Make**

| Phase | Meaning | In the cohort | In the Signal Session | In the Revenue Architecture | In the Immersion |
|---|---|---|---|---|---|
| **Mind Set** | Clarity: cut noise, name the decision | Week 1 (Name the decision) | Morning of the day | First week | Phase 1 alignment + opening hour |
| **Mind Map** | Leverage: map options, trade-off analysis | Week 2 (Map the paths) | Afternoon of the day | Weeks 2–3 | Middle 2 hours |
| **Mind Make** | Direction: decide, document, ship | Week 3 (Make the call) | 48-hour Commercial Narrative | Weeks 3–4 + 30-day follow-up | Final hour + 5-day summary |

---

## What Mindmaker will not sell

- No 1:1 sprint product on the public site (inquiry-only)
- No fractional executive roles (fractional CAIO, CTO, CMO, CRO)
- No ongoing retainers or month-to-month work
- No production IT, deployment, integration, or managed services
- No hourly billing
- No tool recommendations without trade-off analysis
- No ghostwritten board decks
- No vendor referral fees

---

## Entry Point

**Every offer starts with "Book a call."** The primary "Book a call" opens the **Diagnosis Room (Mindy)** (`src/components/diagnosis/`, opened via the `openDiagnosisRoom` event, modes `"express"` and `"full"`, also at `/start`). Mindy diagnoses the visitor's one nervous AI decision in conversation, recommends the right rung (and can honestly down-sell to a cheaper rung or a free lesson), and forks to keep chatting, book a free 15-min Calendly call, or generate a co-branded proposal. The `ScopingModal` (`src/components/ScopingModal.tsx`, opened via `openScopingModal`) is the secondary booking surface still used on the offer pages. `InitialConsultModal` / `openConsultModal` is legacy, retained only for `/alumni`. The old `PreCallQualifier` floating pill is retired; its self-classification job now happens inside the Mindy conversation.

Cohort enrollment and Workshop enrolment can also flow directly through Maven, bypassing the consult call when the buyer already knows the offer is the right fit. The Cohort page surfaces a "Reserve my seat on Maven" CTA; each Workshop sub-page surfaces "Enrol on Maven" (or "Get notified" when not yet published).

First conversation is free. If you're not a fit, we say so.

---

## Workshops (entry-paid, hosted on Maven)

Five one-day workshops, each $599, hosted on Maven. The format is build-with-me, not watch-me-build: the leader walks out with a real artefact deployed on their real surface.

| Workshop | Slug | What you build |
|---|---|---|
| Build Your AI Chief of Staff | `/workshops/build-your-ai-chief-of-staff` | An AI assistant connected to your real inbox, calendar, and chat channels |
| Map Your Agentic Org Chart | `/workshops/map-your-agentic-org-chart` | A complete agent-native org chart with named roles and a 90-day build sequence |
| Vibe Coding for Leaders | `/workshops/vibe-coding-for-leaders` | A working internal tool with a live URL, deployed by end of day |
| Build an Autonomous Business Function | `/workshops/build-an-autonomous-business-function` | A real n8n or Make workflow running on your real business |
| Give Your AI Memory | `/workshops/give-your-ai-memory` | A private, portable memory web your AI can read from |

**Format:** ~5 hours live. Frame (30 min) → drive (90 min, Krish builds) → break → build (parallel, Krish in the room) → show-and-tell.

**What's included with every workshop:**
- Lifetime access to CTRL, Mindmaker's flagship memory-web app
- Session recording
- Mindmaker alumni channel access
- Templates, prompts, and worksheets used in the workshop
- Certificate of completion
- Maven Guarantee: full refund within 14 days, no questions asked

**Workshop alumni discount:** Workshop attendees get $500 off the AI-Fluent Executive Cohort using code `WORKSHOP` at Maven checkout, valid 90 days post-workshop.

---

## The Alumni Pass (invitation-only)

$1,500/year recurring. Annual continuity programme for Mindmaker alumni. Not in nav, not in footer; reachable by direct URL only at `/alumni`. Page is `noindex` so it doesn't show up in search.

**Eligibility:** Anyone who has completed a Workshop, the AI-Fluent Executive Cohort, a Signal Session, the Revenue Architecture, or the AI Immersion. Krish issues invitations directly post-engagement.

**What's included:**
- Annual access to all five Mindmaker Workshops (re-attend any one, any time)
- Quarterly written state-of-the-market memo
- Alumni Slack channel
- First-refusal seats on the next AI-Fluent Executive cohort
- Lifetime access to CTRL

**Billing:** Stripe-billed, cancel anytime. The site does not run a live checkout; Krish sends a direct Stripe Payment Link or Checkout URL once eligibility is confirmed. The Stripe price ID is wired in `src/lib/stripe-prices.ts` for future automation.

---

**End of OFFERS**
