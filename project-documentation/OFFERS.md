# Offers: The Full Guide

**Last Updated:** 2026-08-09

> Replaces the previous `SPRINTS.md`. The v6 ladder restructure (May 2026) added paid Workshops as the entry product and the Alumni Pass as a continuity layer; see `mindmaker_rebuild_brief_v4.md` and `DECISIONS_LOG.md` for that era. **The August 2026 overhaul (commits `c85d984` through `b44e18e`, 2026-08-05/06) superseded most of this document.** Krish's decisions, recorded in `DECISIONS_LOG.md`: unsell Workshops/Enterprise/Capital/Immersion/Alumni rather than delete them (route files stay in the repo, reachable by direct link, but stop selling, stop being discoverable, and stop publishing a price); launch two new Krish-delivered offers, The Teardown and The Handover, with the Diagnosis Room as the door and exact/banded prices published on-site; correct the Cohort's price to match the live Maven page. Sections 1–2 below are the two new offers. Sections 3–6 (Cohort onward) are retained for detail but reordered/flagged per their current sale status.

---

## The Ladder (current, August 2026)

One method, sold two ways: **The Teardown** then **The Handover** are the Krish-delivered path; **CTRL** is the self-serve path; **the Cohort** is the peer-decision-room option. Free Lightning Lessons remain the top-of-funnel wedge.

| Offer | Price | Duration | Audience | Route |
|---|---|---|---|---|
| **The Teardown** | $3,500 fixed | 10 business days | One real decision, taken apart properly | `/teardown` |
| **The Handover** (gated on a completed Teardown) | $30,000 under 250 people / $50,000 for 250–5,000 | 6 weeks; capped 6/year | CEO, CRO, or VP Product ready to rebuild how the business runs on the decision | `/handover` |
| **The AI-Fluent Executive (Cohort)** | $2,000–$3,000 / seat (range) | 4 weeks (mostly async) + 4 × 90-min live sessions | AI leaders making a nervous decision | `/cohort` (enrolment on Maven; currently sold out) |
| **CTRL** | Free; Edge Pro $49/month | Ongoing | Self-serve path, do-it-yourself | `ctrl.themindmaker.ai` |

Both Teardown and Handover carry a 20% discount for permission to write about the work, with the client approving how they're portrayed (`PUBLICITY_DISCOUNT` in `src/lib/offers.ts`). Every live offer has a fixed scope, a fixed outcome, and a finish line.

**UNSOLD as of 2026-08-05/06 (routes still exist, no longer priced, discoverable, or linked from nav/footer):** Workshops (×5), The Signal Session, The Revenue Architecture, The AI Immersion, The Alumni Pass. Sections 4–6 below describe them as they were designed; treat every price in those sections as historical, not current. If any of these is reactivated, this is a one-commit revert per the original unselling decision.

**Internal floor / ceiling (not public):** Cohort minimum viable enrollment = 8 seats, cap = 15; next cohort (Nov 19–Dec 13, 2026) is sold out. Handover capped at 6 engagements/year, stated publicly on the page. Historical, unsold-offer floors/ceilings (Revenue Architecture $60k anchor / $125k extended, Workshop 30-seat max) are preserved in their sections below for reference.

**Payment terms (shown as small muted text on site):**
- The Teardown / The Handover, invoiced directly (no Stripe checkout wired for either; see `src/lib/stripe-prices.ts`, which only covers Cohort/Workshops/Alumni).
- Cohort, "Full payment or 2× $1,250 split" (collected by Maven).
- Unsold offers (Workshops, Signal Session, Revenue Architecture, Immersion, Alumni Pass): payment terms below are historical.

---

## 1. The Teardown

**Status: live, launched 2026-08-06.**

### Position
The entry rung and the gate for The Handover. Ten business days on one real decision, taken apart properly, for under two hours of the client's time.

### Price
$3,500 fixed (`TEARDOWN_PRICE`, `src/lib/offers.ts`). 20% off with publicity permission.

### Method
The decision is decomposed into the load-bearing claims it rests on. Each claim is checked against live evidence and assigned a reliability tier. Each consideration is classed **External**, **Only you**, or **Nobody yet**. Four models cross-examine the decision, and disagreements between them are preserved rather than averaged away.

### What you walk out with
- A one-page memo
- A decision-to-claims map
- The classed considerations (External / Only you / Nobody yet)
- The four-model cross-examination output
- Three claims placed under a 90-day watch
- A CTRL workspace + 30 days of Edge Pro

### CTA
Single button, "Bring me one real decision," opens the Diagnosis Room in `full` mode. No separate booking or contact form on the page.

### What it is not
- Not a fit for someone who has already decided, or hasn't yet named a decision (both discouraged in the page's "when not to buy" section)

---

## 2. The Handover

**Status: live, launched 2026-08-06. Gated: every Handover starts with a completed Teardown.**

### Position
Six weeks to rebuild how the business runs on the decision the Teardown surfaced. Capped at six a year, stated publicly on purpose, the cap is part of the offer.

### Price
$30,000 for companies under 250 people; $50,000 for 250–5,000 people (`HANDOVER_PRICE_SMALL` / `HANDOVER_PRICE_LARGE`, `src/lib/offers.ts`). 20% off with publicity permission.

### For
CEO, CRO, or VP Product. Never the CTO. Company size 50–5,000, sweet spot 100–1,000.

### Format, week by week
| Week | Focus |
|---|---|
| 1 | Load and correct context |
| 2 | Adversarial pre-mortem |
| 3 | The fork: rebuild GTM/pricing/positioning if not yet AI-native, or set the build order if already AI-native |
| 4 | The client drives |
| 5 | Krish does not attend, because a system that only runs when he's in the room isn't a system |
| 6 | Exit |

Day-90 recheck included.

### CTA
Same single "Bring me one real decision" button, opens the Diagnosis Room, `source_page: "/handover"`.

---

## 3. The AI-Fluent Executive (Cohort)

**Status: live. Price corrected 2026-08-05 from a flat $2,500 to a $2,000–$3,000 range to match the live Maven page. Next cohort (Nov 19–Dec 13, 2026) is hardcoded sold out in `Cohort.tsx`; CTAs route to Maven's waitlist.**

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

## 4. The Signal Session (UNSOLD, 2026-08-05)

**Status: route file still exists at `/enterprise#signal-session`, still works if visited directly. No longer priced, no longer in nav/footer, `noindex`'d, dropped from the sitemap. `OperatorsEdge`'s homepage CTA still points here, unrepointed as of this pass. Everything below is retained detail, not a current offer.**

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

## 5. The Revenue Architecture (UNSOLD, 2026-08-05)

**Status: route file still exists at `/enterprise#revenue-architecture`, no longer priced, no longer in nav/footer, `noindex`'d, dropped from the sitemap. Everything below is retained detail, not a current offer.**

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

## 6. The AI Immersion (UNSOLD, 2026-08-05)

**Status: route file still exists at `/immersion`, no longer priced, no longer in footer (App.tsx's code comment still claims it's footer-linked; that comment is stale), `noindex`'d, dropped from the sitemap. Everything below is retained detail, not a current offer.**

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

**Every live offer starts with the Diagnosis Room.** The nav's primary CTA ("Bring me one real decision," changed from "Book a call" in the August 2026 nav rebuild) opens the **Diagnosis Room (Mindy)** (`src/components/diagnosis/`, opened via the `openDiagnosisRoom` event, modes `"express"` and `"full"`, also at `/start`). Mindy diagnoses the visitor's one nervous AI decision in conversation and forks to keep chatting, book a free 15-min Calendly call, or generate a co-branded proposal — confirmed still a real 3-way fork in `Fork.tsx`. **Gap:** Mindy's own reasoning/pricing knowledge has not been updated for the Teardown or the Handover and still recommends the retired Cohort/Signal Session/Revenue Architecture/Immersion ladder; see `mindy/CANON.md` §0. The `ScopingModal` (`src/components/ScopingModal.tsx`, opened via `openScopingModal`) is the secondary booking surface still used on the unsold offer pages and directly by `Cohort.tsx`. `InitialConsultModal` / `openConsultModal` is used by `/alumni`, `/contact`, and every blog post, not alumni-only. The old `PreCallQualifier` floating pill is retired; its self-classification job now happens inside the Mindy conversation.

Cohort enrollment can also flow directly through Maven, bypassing the consult call when the buyer already knows it's the right fit. The Cohort page surfaces a "Reserve my seat on Maven" CTA (currently pointing to Maven's waitlist, cohort sold out).

First conversation is free. If you're not a fit, we say so.

---

## Workshops (UNSOLD, 2026-08-05, historical detail below)

**Status: five route files still exist under `/workshops`, still work if visited directly. No longer priced anywhere the site itself surfaces, out of nav/footer, `noindex`'d, dropped from the sitemap.**

Five one-day workshops, each $599 historically, hosted on Maven. The format is build-with-me, not watch-me-build: the leader walks out with a real artefact deployed on their real surface.

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

## The Alumni Pass (UNSOLD, 2026-08-05, historical detail below)

**Status: route still exists at `/alumni`, still worked pre-August (already `noindex`, unlinked from nav/footer); as of August 2026 it's additionally dropped from the sitemap. Historical detail below.**

$1,500/year recurring, historically. Annual continuity programme for Mindmaker alumni. Not in nav, not in footer; reachable by direct URL only at `/alumni`. Page is `noindex` so it doesn't show up in search.

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
