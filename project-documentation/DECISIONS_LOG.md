# Decisions Log

**Last Updated:** 2026-08-26

---

## Brand & Product Decisions

### 2026-08-11: Advisory reinstated as the primary cash engine

**Decision:** Advisory is the primary cash engine again, effective immediately.

**Context:** Advisory was retired in July 2026 in anticipation of a full-time role (see the entry below). That role fell through **on an immigration technicality, not on the work or the candidate**. The Teardown and Handover storefront had already shipped in early August regardless, so the storefront was correct and everything behind it was selling a business that had been wound down.

**Rationale:** There is no other engine. The storefront exists, the positioning is good, and the estate needed to agree with the storefront rather than the other way round.

**Review trigger:** A signed offer for a full-time seat.

---

### 2026-07: Advisory retired (SUPERSEDED 2026-08-11)

**Decision:** Wind down the advisory business.

**Rationale:** An expected full-time role. Documentation, the sales agent's knowledge base and a machine-readable product file were all updated to say advisory was dead.

**Status:** **Superseded on 2026-08-11.** Anything asserting that advisory is retired is now false. The one instance that still exists is in `mm-ctrl`'s `public/.well-known/product.json`, which is out of scope for this repo and needs routing to whoever owns it. That file is what answer engines read.

---

### 2026-08-11: Repositioned to two engagements, The Teardown and The Handover

**Decision:** The six-rung ladder is retired in full. Two engagements remain: The Teardown (the entry rung and the gate) and The Handover (the rebuild). Funds are a third *door* into the same two, not a third offer.

**Retired, and not to be quoted anywhere:** Lightning Lessons, the five one-day Workshops, The AI-Fluent Executive (Cohort), The Signal Session, The Revenue Architecture, The AI Immersion, and bespoke enablement.

**This is the one file where those names are written down on purpose.** Every other document describes them without naming them, because most are indexed for Mindy's retrieval and writing a retired offer name into a retrieval source is the most likely way one reaches a client. This file is not indexed.

**The Alumni Pass survives**, unchanged: invitation-only, `noindex`, unlinked from nav and footer. It was never a public rung.

**Where the page components went:** `src/_archive/`, excluded from the build and lint. Every route is a real 301 in `vercel.json`.

---

### 2026-08-11: The Teardown repriced to $9,500; a $950 entry rung rejected

**Decision:** The Teardown goes from $3,500 to $9,500. A proposed third rung at $950 is rejected outright.

**Rationale:**
- At $3,500 the Teardown sat **below the floor of its own category** while taking ten business days to deliver. Observed 2026 assessment pricing is $5,000 to $15,000 for comprehensive work and $15,000 to $50,000+ for strategic.
- The $950 rung fails on arithmetic. Against an income floor above $20,000 a month, it needs 21 sales a month, and the only sales motion that is actually sustained is warm introductions. It would have consumed attention and contributed almost nothing.
- Repricing the Teardown upward also closes the gap to the Handover from 8.6x to under 2x, which removes the need for the credit escalator (see below).

**Review trigger:** Two Teardowns lost on price.

---

### 2026-08-11: Three currencies, as set prices per market

**Decision:** Publish USD, GBP and AUD. Each figure is a deliberate round number **in its own market**, not a conversion.

**Rationale:** The site sells internationally. A converted price is a function of the morning's spot rate, which is not what was sold and would silently change a number a client is already holding a proposal for.

**Enforcement:** No FX logic exists anywhere in the estate and a test fails the build if any appears. `src/lib/offers.ts` is the single source of truth, and a second test fails the build if a price string appears anywhere else in the web surface.

**Launch gate, owner: Krish.** USD is canonical. Treat the published GBP and AUD figures as proposals until Krish explicitly approves all twelve market prices. Do not silently convert them, invent replacement figures or publish a changed price. If approval is absent, stop the price release and report the exact figures awaiting a decision.

---

### 2026-08-11: No published discounts

**Decision:** Remove both published discounts. Krish keeps a discretionary credit as a closing tool for a live call, and it is deliberately absent from the site, the documentation and Mindy's knowledge base.

**What was removed:**
- The **credit escalator** (each rung coming off the price of the next), which was proposed and never shipped. It existed to bridge the 8.6x gap the reprice closed.
- The **20% publicity discount** ("20% off if you let me write about the work"), which *was* live on both rungs. At the new prices that was up to a fifth of a Handover, advertised before any conversation.

**Rationale:** A published discount trains every buyer to wait for it. A card Krish plays is worth more than a discount everyone expects.

**Note on the publicity discount specifically:** it bought case-study rights, which the thin proof bank genuinely needs. That trade is still available; it just happens on a call now rather than on a page.

---

### 2026-08-11: /cohort dies rather than becoming a waitlist

**Decision:** `/cohort` 301s to `/start`. The page is archived.

**Rationale:** It was the only surface on the site saying "sold out", which reads as scarcity to some visitors and as a dead end to others. Sending that traffic into the Diagnosis Room lets Mindy route it honestly instead of the site guessing a rung for it.

---

### 2026-08-11: /capital stays live, repointed at portfolio companies

**Decision:** Contrary to the upgrade brief, which called for 301ing `/capital` to `/handover`, the page stays and is rewritten.

**Rationale (Krish):** One offering, but Capital should be for portfolio companies.

**Shape:** The same two engagements at the same twelve prices, stated as per portfolio company. Fund-level and multi-company terms are set on the call and **not published**, since a published volume discount would reinstate the discount that was just removed everywhere else. It also stops being orphaned: it now sits in the nav, the footer, the sitemap and the prerendered bodies.

---

### 2026-08-11: CTRL removed as a separate purchase on themindmaker.ai

**Decision:** No CTRL price, tier or upgrade path anywhere on this site. CTRL stays as a Teardown deliverable and a product link.

**Rationale:** CTRL is the mechanism, not a P&L line. AI-native SaaS retention by price point, across roughly 200 companies, puts under $50 a month at 23% gross revenue retention, which is the worst band there is.

**Also resolved by deletion:** the site carried three contradictory CTRL prices simultaneously ($49/month in `llms.txt`, a $29 one-time plus $9/month in Mindy's knowledge, "upgrades from $29" in the repo guide). Removing the pricing resolves that rather than picking a winner.

**Note:** this removes a revenue line from this site. CTRL's own site and pricing are untouched and out of scope.

---

### 2026-08-11: Every engagement must collect something structured

**Decision:** Each offer defines, in the offer definition itself, one structured thing the engagement captures and retains: how the client priced and packaged, what converted, what had to change, and the commercial constraint.

**Rationale (from Krish's own portfolio analysis):** *"If you run the diagnostic without systematically capturing the data, you have bought yourself a day rate contracting job."* Advisory that produces only fees scores 3 out of 10 on becoming a saleable asset.

**Why in `src/lib/offers.ts` rather than a process document:** a process document does not get read. Every engagement page, proposal and internal handoff resolves through the offer object, so the requirement travels with the offer.

**Shape:** typed columns in `public.engagement_intelligence`, not a memo per engagement, so it can be queried across clients. Internal only; a test fails the build if any of it reaches the DOM.

**Data-use gate, owner: Krish or counsel.** Before writing a real row, obtain approval for the confidentiality and consent clause covering aggregated, anonymised retention. The schema shipped; the terms change did not. If approval is absent, keep collection disabled and report the missing legal decision rather than assuming consent.

---

### 2026-08-11: Three false claims removed

**Decision:** Remove all three, as separate commits, before any other work.

1. **The fabricated aggregate rating.** `index.html` published Organization schema claiming 4.9 from 50 reviews. There are not 50 reviews anywhere in the estate. Deleted outright, not replaced with a smaller number, because a smaller invented number is no more verifiable.
2. **The fabricated proof bank.** 26 of 35 proof entries were illustrative, and Mindy drew on them to generate co-branded client proposals. A prospect could have received a document citing an engagement that never happened. All 26 deleted; the nine verified entries remain.
3. **Advisory declared dead.** No instance of this exists in this repo, which is worth recording: the false statement lives in `mm-ctrl`'s `product.json`, which is out of scope.

**Also removed, not in the brief but the same category:** fabricated San Francisco geo coordinates in `index.html` (while `llms.txt` claimed Brooklyn), a `FAQPage` and `serviceType` schema selling "AI Training" and "AI Literacy Education" on a business that does not sell training, and a **"Global Offices"** block on `/contact` listing Brooklyn, London and Sydney. A capped one-person practice does not have premises in three cities. It was also a geographic market claim, which the positioning does not make. The three currencies exist because the practice sells internationally, which is a different thing.

---

### 2026-08-11: Mindy answers a price question in the turn it is asked

**Decision:** A direct question about price overrides the reflect-then-reason-then-recommend order and whatever phase the conversation is in. The figure leads the reply, then the reframe, then the next question.

**Context:** Found by putting real questions through the deployed function after the knowledge rewrite, not by the test suite, which was green throughout. Asked "how much does this cost, in pounds," Mindy returned another diagnostic question and no number. Standing order 1 was outranking the pricing card.

**Rationale:** The prices are published. Deferring one to a later turn reads as a sales tactic, which is the thing this practice is against, and the visitor can read the number two clicks away regardless.

**Two defects fell out of the same check.** She then quoted the top Handover band to a 180-person company, because the card lists bands largest first for anchoring and she read row one. Largest-first is now stated as governing the order the two figures are said in, never which band applies. And she had no idea which currency the page was showing, because the Diagnosis Room never sent it: the hook now passes the selected currency and `mindy-chat` falls back to USD exactly as the site does.

**Review trigger:** Any reprice, any new rung, or a fourth currency.

---

### 2026-08-11: A published price is never withheld in a generated proposal

**Decision:** The `book-call` exit no longer suppresses the fee in the co-branded one-pager. Only the genuine absence of a figure, meaning scope outside the two engagements, renders "set on the call".

**Context:** Both `generate-proposal` and the renderer treated a book-call recommendation as a reason to hide the number, which was correct under the old ranges model and survived the reprice. A Handover proposal showed no price at all.

**Rationale:** The call is how the Handover is bought, not a gate on knowing what it costs. A prospect who has just read the band on `/handover` must not open their own proposal and find the fee withheld.

---

### 2026-08-05: "Anti-consultant" stays. Krish is an operator-advisor.

**Decision:** The anti-consultancy positioning is retained. The lead line at `src/components/OperatorsEdge.tsx:14` stays exactly as written: *"I'm the anti-consultant. I don't deliver slides, I deliver systems."* No change to `mindy-system-prompt.md`, `fit-and-walkaway-rubric.md`, `BRANDING.md`, `PURPOSE.md` or `VALUE_PROP.md`.

**Context:**
- The August 2026 site overhaul brief argued this becomes a contradiction once paid advisory is sold again, and proposed replacing it with "the engagement ends and you keep the system."
- Krish resolved it directly: he is an **operator-advisor**, so there is no contradiction to fix. Anti-consultancy was never a claim that he does not advise. It is a claim about what he delivers and how the engagement ends.
- This is already the settled language elsewhere in the canon. `COMMERCIAL_REFERENCE.md:21` positions him as "an operator-advisor who builds commercial engines for businesses using AI, not a consultant who delivers decks." `mindy-system-prompt.md:22` instructs Mindy that she is "an executive-grade operator-advisor, not a chatbot."
- `krish-voice` lists "Anti-consultancy" as the Gear A vibe for Mindmaker. Removing it would have put the site at odds with the voice skill.

**Impact:**
- No code change. The line is a named constant, so this decision costs nothing to hold.
- Any future session working from the overhaul brief should treat the "resolve this tension" instruction as **already resolved, and declined**. Do not strip the anti-consultant framing.

---

### 2026-06-29: Signature accent moves from Mint to portfolio Emerald (brand cohesion)

**Decision:** Change Mindmaker's signature accent from **mint** (`#7ef4c2`, HSL `158 82% 73%`) to **portfolio emerald** (`#00D9B6`, HSL `171 100% 43%`), CTRL's emerald, now the shared signature across the three sibling products: **Mindmaker, CTRL, and Make Your Mind Up**. Ink (`#0e1a2b`), neutrals, and every other colour are unchanged. The migration is **zero-churn**: the legacy `--mint*` CSS tokens and the Tailwind `mint` colour key are retained as **aliases** that now resolve to emerald, so existing `bg-mint` / `text-mint` / `shadow-mint-*` keep working and render emerald. New code should prefer the `emerald*` keys.

**Emerald scale:** `emerald-50` `171 100% 97%`, `emerald-300` `171 90% 80%`, `emerald` `171 100% 43%`, `emerald-deep` `176 90% 24%` (`#06746d`), `emerald-900` `180 85% 16%`.

**Context:**
- The three products were drifting apart visually while sharing one buyer and one underlying MindmakerOS token contract. A single signature accent makes them read as one house.
- CTRL's emerald was the natural anchor: it was already the live signature on the flagship app, so adopting it portfolio-wide cost the least and looked most current.
- Keeping the `mint` tokens as aliases avoided a repo-wide find-and-replace and the regression risk that comes with it; the rename is a docs/new-code convention, not a forced code migration.

**WCAG contract (unchanged in spirit, re-derived for emerald):** bright emerald (`#00D9B6`) must NEVER be text on white/light backgrounds (≈1.7:1, fails), exactly as mint failed (1.9:1) - it is for fills, CTA backgrounds (ink on emerald = AAA), dark-bg accents, shadows, and the focus ring only. For accent text/links on light backgrounds, use **`text-emerald-deep`** (`#06746d`, HSL `176 90% 24%`), which passes full AA at 5.21 (an upgrade over the old under-spec `mint-dark`, which was AA-large only). The full derivation and proof live in `prototypes/brand-emerald-proof.{html,md}`.

**Impact:**
- `src/index.css` + `tailwind.config.ts` carry the emerald tokens; `mint*` retained as aliases (literal `#7ef4c2` kept only as a CSS fallback so motifs render byte-identical where exact literals matter).
- Docs updated: `README.md`, `DESIGN_SYSTEM.md`, `BRANDING.md`, `VISUAL_GUIDELINES.md`, `FEATURES.md`, and this entry. The historical 2025-11-24 "Ink + Mint" decision below is preserved as-is.

---

### 2026-06-28: Company search typeahead added to Diagnosis Room opener

**Decision:** Add a company name typeahead (`CompanyField`) to the Diagnosis Room opener backed by the Brandfetch Search API (`company-search` edge function). The visitor can find their company by name rather than supplying a work email first, removing the cold-start friction for visitors without a work email ready.

**Context:** The enrichment co-brand "gasp" was gated behind a work email. Many visitors arrive without one to hand; the typeahead lets them select their company directly, pre-seeding the dossier domain so `enrich-company` fires on identity depth immediately. Free-email gate still applies to email input; typeahead bypasses it entirely since the domain is known.

**Impact:** New `CompanyField.tsx`, `BrushPainter.tsx`, and `logoLuminance.ts` in `src/components/diagnosis/`. New `company-search` edge function (Brandfetch Search API, 80/IP/5 min rate limit, graceful degrade).

---

### 2026-06-28: Pre-session intake form and testimonial collection added

**Decision:** Introduce two new lightweight public forms: a structured pre-session intake (for confirmed engagements) and a testimonial submission form (post-engagement). Both are static HTML pages in `/public/` posting to new edge functions.

**Context:** Pre-session context was collected ad hoc over email, creating overhead for both Krish and the client. A structured intake form (AI confidence, value frame, aspiration, north star, role-aware handoff) standardizes the brief Krish receives. Testimonial collection had no self-serve path; the new form lets clients submit at any time with a controlled permission model.

**Impact:** New edge functions `submit-intake` and `submit-testimonial`; new static pages `public/intake/index.html` and `public/testimonials/index.html`.

---

### 2026-06-09: The Diagnosis Room (Mindy) becomes the one journey; YFork + PreCallQualifier retired

**Decision:** Collapse the funnel into a single guided, on-site experience, **the Diagnosis Room (Mindy)**, and make it the primary "Book a call" surface. The homepage `YFork` second fork and the `PreCallQualifier` floating pill are retired (files kept but unmounted). The nav "Book a call" (express mode), the hero ("Work through your decision with Mindy", full mode), and `SimpleCTA` open the Diagnosis Room via `openDiagnosisRoom`; the room is also a standalone page at `/start`. `ScopingModal` is demoted to the secondary booking surface, still dispatched by the offer pages (`/cohort`, `/enterprise`, `/capital`, `/immersion`), the `BigProblem` cards, and the new `/case-studies`. `InitialConsultModal` remains alumni-only.

**Context:**
- The static tri-fork plus a passive qualifier pill asked cold visitors to self-classify before they understood the offers, and captured a thin brief. A guided diagnosis reflects the visitor's own business back to them (via live enrichment), reasons through their actual decision in Krish's voice, recommends a rung honestly (including down-selling to a cheaper rung or a free lesson), and only then forks to one of three honest exits.
- Krish's two missing assets named in the architecture brief, real Krish reasoning and an honest down-sell rubric, are filled by Mindy's Brain Pack (`project-documentation/mindy/`).

**Impact:**
- New front end: `src/components/diagnosis/` (`DiagnosisRoom`, `Opener`, `Conversation`, `DossierReveal`, `DecisionBrief`, `Fork`, `ProposalView`, `ExpressBooking`, `MicButton`, `MindyAvatar`, `useDiagnosisSession`, `types`). New routes `/start` and `/case-studies`.
- New edge functions: `mindy-chat`, `enrich-company`, `generate-proposal`, `session-digest`, `transcribe`, plus `import-audience-csv`; shared logic in `_shared/{mindy,enrich,proposal}/`.
- **Privacy guardrail:** the dossier's `scale.*` routing layer (employeeCount, sizeBand, trancoRank, icp, recommendedMode) is internal only, never surfaced to the visitor and never in the visitor proposal/digest copy; only Krish's internal digest receives the full dossier + transcript.
- `CLAUDE.md` and the living `project-documentation/` set reconciled; `COMMERCIAL_REFERENCE.md` added; the `mindy/` Brain Pack indexed. Historical entries preserved as-is.

---

### 2026-06-09: Public pricing is ranges only

**Decision:** The live site and any AI-generated proposal show **ranges only**; the exact number is set by Krish on the call. Public range card: Workshops $500–$1,000; Cohort $2,000–$3,000; Signal Session $10,000–$20,000; Revenue Architecture $50,000–$100,000+; Immersion $10,000–$15,000; Alumni Pass ~$1,500/yr; CTRL free, upgrades from $29; bespoke enablement $8,000–$25,000 (pilots from $2,000). Exact figures remain in the docs as internal reasoning aids and on Maven's own checkout for the Cohort/Workshops.

**Context:** Exact public prices anchored the buyer before the value was framed and invited price-shopping against a number set without context. A range is honest and still qualifies, while keeping the exact figure a conversation Krish owns on the call.

**Impact:** `notify-*` intake and `generate-proposal` output convert to the range card; the proposal generator never emits an exact figure; `CANON.md` §2.4 pins the range card as the only client-facing pricing.

---

### 2026-06-09: Cross-offer framework name resolved (Mind Set/Map/Make kept; the four D's = cohort curriculum)

**Decision:** Keep **"Mind Set → Mind Map → Mind Make"** as the canonical cross-offer brand framework (rendered on the homepage by `FrameworkJourney.tsx`), and treat **"Diagnose → Decompose → Decide → Deploy"** as the cohort's week-by-week curriculum only. The two coexist, each in its own lane. This closes the one blocking content tension flagged in `mindy/CANON.md` §5.

**Context:** Both names appeared across the codebase and docs and were being read as competing replacements. They are layered, not in conflict: one is the brand spine that spans every offer; the other is how the Cohort is delivered across its four weeks.

**Impact:** Mindy names the framework "Mind Set → Mind Map → Mind Make" and uses the four D's only when describing the cohort week by week. `CANON.md` §5 records the resolution.

---

### 2026-06-03: Homepage re-forked by intent; ScopingModal becomes the primary conversion surface

**Decision:** The homepage Y-fork is framed by buyer intent rather than product tier. `YFork.tsx` headline is now "Start where your question actually is." with three intent cards: **Sharpen how I think** → `/cohort`, **Resolve one decision** → `/enterprise#signal-session`, **Rebuild the commercial layer** → `/capital`. Capital returns to the homepage via the "Rebuild" card. CTAs are split into tier-appropriate paths, and a free-entry strip (Diagnostic / CTRL waitlist / Sunday brief) catches visitors not ready to book. The primary "Book a call" conversion surface is now `ScopingModal` (a 6-field scoping intake posting to `notify-scoping-request`); `InitialConsultModal` is retained only for the invitation-only Alumni Pass.

**Context:**
- The tier-named tri-fork (Workshops | Cohort | Enterprise) asked cold visitors to classify themselves by product before they understood the products. Intent framing ("sharpen / resolve / rebuild") matches how buyers actually arrive.
- A structured scoping form (the decision on the table, what success looks like in 30 days) produces a qualified brief routed straight to Krish, which the older path/commitment/contact wizard did not.

**Impact:**
- New: `src/components/ScopingModal.tsx`, `supabase/functions/notify-scoping-request`, `supabase/functions/notify-ctrl-waitlist`, `src/components/CtrlWaitlistPopover.tsx`. `BigProblem` rebuilt as interactive flip cards. New Age Leadership added to the Resources nav dropdown.
- `InitialConsultModal` / `openConsultModal` is now legacy (alumni-only); most surfaces dispatch `openScopingModal`.
- `CLAUDE.md` and the living `project-documentation/` set reconciled to match; historical entries preserved as-is.

---

### 2026-05-15: v6 ladder restructure (Workshops + Alumni Pass added; Cohort renamed and repriced)

**Decision:** Site restructured from a barbell (Cohort + Enterprise) into a four-rung ladder: free Lightning Lessons → paid Workshops at $599 → AI-Fluent Executive Cohort at $2,500 → Enterprise from $15,000, with the Alumni Pass at $1,500/year as continuity. Cohort renamed from "The AI Decision Cohort" to "The AI-Fluent Executive". Curriculum expanded from "Name → Map → Make" (3 weeks) to "Diagnose → Decompose → Decide → Deploy" (4 weeks). Capital remains a third door for funds but is moved off the homepage tri-fork (still reachable from the Enterprise nav dropdown and `/capital`).

**Sub-decisions:**
1. **Cohort rename and reprice ($3,500 → $2,500; "AI Decision Cohort" → "The AI-Fluent Executive").** Maven's price gravity for senior-leader cohorts sits at $2,500 (Rohan/Aman/Satya comp set at $2,500); going above that fights gravity. The new name matches the live Maven page and is more outcome-specific.
2. **Workshops launched at $599.** Maven's average course is ~$500; the operator-led workshop format (Rupa Chaturvedi's $849 comp) sells well to leaders + operators. $599 is the entry price, with room to lift after early traction.
3. **Alumni Pass launched at $1,500/year.** Retention is the moat the site doesn't currently sell. Group-only, quarterly, alumni-gated, frictionless cancel = continuity not capacity.
4. **CTRL surfaced as a Cohort and Workshop benefit.** The live Maven Cohort page already includes CTRL; site documentation lagged.
5. **Duration corrected from 3 weeks to 4 weeks; framework corrected from Name → Map → Make to Diagnose → Decompose → Decide → Deploy.** Matches the live Maven page. Site docs were stale.

**Context:**
- Maven is a sales channel, not the centre of gravity. The site is the brand. The ladder makes it easy for any cold buyer to find the right rung.
- The pre-rename Cohort name ("AI Decision Cohort") was internally focused. "The AI-Fluent Executive" reframes it around the buyer outcome.
- Workshops are deliberately one-day, build-with-me, deployed-on-real-surfaces: the inverse of every "AI for executives" course on the market.

**Impact:**
- New routes: `/workshops`, `/workshops/[slug]` (×5), `/alumni` (`noindex`, unlinked from nav and footer)
- Stripe price IDs added in `src/lib/stripe-prices.ts` for all five workshops, the cohort (full + 2× split), and the Alumni Pass. Workshop and Cohort IDs are referential (Maven collects). The Alumni Pass is the only product the site itself charges via Stripe.
- The dead Maven URL `maven.com/aimindmaker/ai-decision-intensive` has been replaced everywhere with `maven.com/mindmaker/the-ai-fluent-executive`
- All forward-looking documentation in `project-documentation/` updated; historical entries in `HISTORY.md` and earlier `DECISIONS_LOG.md` entries preserved as-is

---

### 2026-04-26: Revenue Architecture compresses to 30 days (was 8–12 weeks)

**Decision:** The Revenue Architecture engagement runs for **30 days (4–5 calendar weeks)**, not 8–12 weeks. Live in `src/pages/Enterprise.tsx` as the canonical duration.

**Context:**
- The 8–12 week framing pre-dated Krish's full agentic OS being in production; it assumed a discovery phase that's no longer needed
- Pattern recognition from the operator side has compressed the engagement; associates aren't part of the model
- 30 days matches the natural calendar quarter cadence of enterprise buyers and removes the risk of the engagement outliving the problem

**Rationale:**
- Speed is a differentiator vs Big 4 (6-month engagements with associates)
- A fixed 30-day clock keeps scope honest and prevents creep
- The 30-day follow-up session included in the price covers the "what changed once it's in market" loop

**Impact:**
- All sales materials, doc copy, outbound templates, and proposal scaffolds must reference 30 days
- Updated in `OFFERS.md`, `VALUE_PROP.md`, `OUTCOMES.md`, `Master_Messaging_and_FAQ.md`, `SALES_PLAYBOOK.md`, `BRANDING.md` (retired-spec list), and `FEATURES.md`

---

### 2026-04-26: Signal Session deliverable is the Commercial Narrative (15–20 pages, 48 hours)

**Decision:** The Signal Session output is the **Commercial Narrative**, a 15–20 page document delivered within 48 hours, plus a 2-page positioning framework, sales narrative + objection guide, pricing sketch, and 30-day commercial roadmap. Replaces the older "5–10 page thesis within 5 business days" framing.

**Rationale:**
- 48-hour delivery is a forcing function for sharpness; 5 business days made the day feel like a workshop
- 15–20 pages is the right depth: it covers positioning, pricing, sales narrative, and 90-day priorities without becoming a McKinsey deck
- "Commercial Narrative" is a stronger, more specific name than "thesis" or "report"

**Impact:**
- Updated in all sales-facing docs (`OFFERS.md`, `VALUE_PROP.md`, `OUTCOMES.md`, `SALES_PLAYBOOK.md`, `Master_Messaging_and_FAQ.md`, `FEATURES.md`)
- Outbound and email templates now reference the 48-hour Commercial Narrative explicitly

---

### 2026-04-26: Cohort enrolment runs on Maven

**Decision:** Cohort enrolment, payment, the cohort Slack, and the alumni network all run on **Maven** at `https://maven.com/mindmaker/the-ai-fluent-executive`. The `/cohort` page surfaces a "Hosted on Maven" pill and a "Reserve my seat on Maven" CTA pointing directly at the Maven URL.

**Context:**
- The cohort's experience-side workflow (community Slack, alumni continuity, payments, repeat enrolment) was being patched together; Maven solves all of these in one place
- Maven also provides discovery distribution that improves cohort fill at marginal cost

**Rationale:**
- One source of truth for the cohort experience reduces ops overhead for a solo operator
- Direct-to-Maven CTA on `/cohort` lets buyers who already know the cohort is the right fit skip the consult call

**Impact:**
- The "Book a call" path remains for buyers who need to qualify; it's no longer the only path on `/cohort`
- All sales scripts, email follow-ups, and outbound messages reference the Maven URL when Cohort is the recommended offer
- Internal: cohort dates and seat counts continue to be managed via the `nextCohort` const in `Cohort.tsx` until a Supabase `cohort_dates` table replaces it

---

### 2026-04-26: The AI Immersion launched as an inquiry-only fourth offer

**Decision:** Launch a fourth offer, **The AI Immersion** ($12,000, 4-hour facilitated session, 2-page summary within 5 business days, up to 8 senior leaders), at `/immersion`, **inquiry-only**. Not promoted on the homepage or in the main nav; surfaced only when the buyer's actual need is team alignment rather than an individual decision or commercial rebuild.

**Rationale:**
- A genuine subset of inbound buyers ask for "a strategy day" or "leadership offsite" where the right shape is a 4-hour facilitated session, not the Cohort and not Enterprise
- Inquiry-only positioning keeps the offer from cannibalizing Cohort or Enterprise; the headline barbell stays clean
- Diagnose → Decompose → Decide → Deploy protocol matches the Cohort framework, so the operator load is low

**Guardrails:**
- Max 8 leaders (format breaks past that)
- No recording (kills candor)
- No multi-session (we don't run multi-session Immersions)
- Substitution disallowed (the format depends on the actual leaders being present)

**Impact:**
- New page at `/immersion`, lazy-loaded in `App.tsx`
- ICP 3 added to `ICP.md` (Executive Teams)
- Sales playbook routes "team alignment" pain → Immersion via inquiry only

---

### 2026-04-26: New Age Leadership promoted from hidden to Resources nav

**Decision:** `/new-age-leadership` (long-form thought leadership on agent-native org charts) moved into the Resources dropdown above "How I operate". Builder Economy podcast retained, "All Enterprise" footer link dropped (commit 226ecf1).

**Rationale:**
- Long-form thought leadership is a top-of-funnel asset for the Cohort; surfacing it via Resources lets curious senior leaders reach it without the homepage having to advertise it
- Article-style content lifts SEO and gives outbound a credible "here's what I think about agent-native orgs" payload

**Impact:**
- `Navigation.tsx` Resources dropdown reorders: New Age Leadership → How I operate → Blog → Builder Economy (external) → Lightning Lessons
- Schema.org `Article` JSON-LD on the page; lazy-loaded `OrgChart` component to keep hero LCP fast

---

### 2026-04-26: PreCallQualifier rebuilt as chip-based 3-step intake

**Decision:** `PreCallQualifier` is now chip-based across all three stages (decision → timeline → stakes), each with 5–6 chip options plus an "other" / textarea fallback on the decision step. Replaces the previous text-entry version.

**Rationale:**
- Free-text intake produced lower completion rates and noisier classification
- Chip selection produces structured, classifiable answers that map cleanly to offer recommendation
- Mobile experience is materially better with chips than with text entry

**Impact:**
- `classify()` function in `PreCallQualifier.tsx` deterministically maps {decision, timeline, stakes} → {Cohort | Signal Session | Revenue Architecture}
- Plausible event `pre_call_qualifier_completed` fires on book-a-call; gives a leading indicator on qualifier-to-meeting conversion
- Storage: `localStorage` under `mindmaker:pre-call-qualifier`, version 2

---

### 2026-04-26: `/signal` nav label is "Live Intel" (was "The Brief")

**Decision:** The second-top-level nav slot is labelled **"Live Intel"**. "The Operator's Brief" is acceptable in editorial body copy on `/signal`, but is no longer the nav label.

**Rationale:**
- "The Brief" tested fine internally but read as opaque to first-time visitors
- "Live Intel" says exactly what the surface is: live model pricing, live signals, live decision tool

**Impact:**
- `Navigation.tsx` line 46
- Updated everywhere in docs; old "The Brief" / "Signal Desk" labels added to retired-terminology lists in `BRANDING.md`, `COMMON_ISSUES.md`, and `SALES_PLAYBOOK.md`

---

### 2026-04-23: Documentation Upgrade: Align all docs with v4/v5 barbell state

**Decision:** Rewrite all business documentation and surgically update technical documentation to match the v4 barbell pivot and v5 Operator's Edge, as captured in `mindmaker_rebuild_brief_v4.md` and `CLAUDE.md`.

**Context:**
- `mindmaker_rebuild_brief_v4.md` and `CLAUDE.md` reflected the barbell (Cohort + Enterprise, no middle) and the Operator's Edge additions
- Downstream documentation (README, PURPOSE, VALUE_PROP, ICP, SPRINTS, OUTCOMES, BRANDING, Master_Messaging, ARCHITECTURE, FEATURES, DEPLOYMENT, COMMON_ISSUES, REPLICATION_GUIDE) still referenced 4-Week and 90-Day sprints, Builder/Orchestrator ICPs, "What's your nervous decision?" as a CTA, "Signal Desk", SIGNAL/NOISE/DECISION/TAKE taxonomy, a standalone `/tool` page, the ChatBot, and CTRL / Builder Economy as Mindmaker products
- Salespeople, content writers, and AI agents consuming the docs were getting stale answers

**Key changes across docs:**
- **Offers:** 4-Week / 90-Day / Extended Sprint → The AI Decision Cohort ($3,500/seat) + The Signal Session ($15k) + The Revenue Architecture ($60–100k). No middle tier. No 1:1 sprints on the public site.
- **ICPs:** Builder / Orchestrator → AI leaders (cohort buyer) / AI products (enterprise buyer)
- **CTA:** "What's your nervous decision?" → "Book a call" (as a button label everywhere; the diagnostic question can still appear in body copy)
- **Editorial surface:** "Signal Desk" → "The Operator's Brief" at `/signal`
- **Taxonomy:** SIGNAL / NOISE / DECISION / TAKE → WATCH / SKIP / CALL / TAKE
- **Nervous Decision Machine:** standalone `/tool` page → embedded on homepage `OperatorsBrief` + `/signal`
- **ChatBot / Ask Mindmaker:** retired → `PreCallQualifier` floating pill
- **Builder Economy:** Mindmaker product → external sister domain (`thebuildereconomy.com`)
- **Credential surfaces added:** `OperatorsEdge` homepage section + `/operator` page (v5)

**Rationale:**
- Documentation that contradicts the codebase produces bad content, bad pitches, and bad PRs
- The v4 barbell is now ~2 months old in the codebase; salespeople reading docs had no authoritative reference
- Consolidating sprint doc into `OFFERS.md` removes the "sprint" framing from contexts that no longer sell sprints

**Files created:** `OFFERS.md`
**Files deleted:** `SPRINTS.md`
**Files rewritten:** `README.md`, `PURPOSE.md`, `VALUE_PROP.md`, `ICP.md`, `OUTCOMES.md`, `BRANDING.md`, `Master_Messaging_and_FAQ.md`, `ARCHITECTURE.md`, `FEATURES.md`, `DEPLOYMENT.md`, `COMMON_ISSUES.md`, `REPLICATION_GUIDE.md`
**Files surgically updated:** `DESIGN_SYSTEM.md`, `VISUAL_GUIDELINES.md`, `HISTORY.md`, `DECISIONS_LOG.md`
**Files left untouched:** `research/LLM_CHAIN_OF_THOUGHT.md`, `research/LLM_CRITICAL_THINKING_TRAINING.md`, `mindmaker_rebuild_brief_v4.md` (flagged as research / authoritative source respectively)

---

### 2026-03-03: Comprehensive Sprint Documentation (SPRINTS.md)

**Decision:** Create a single authoritative document covering both ICPs in full detail alongside complete sprint breakdowns, deliverables, and outcomes.

**Context:**
- ICP profiles existed in ICP.md but lacked sprint-specific detail
- Sprint descriptions existed in FEATURES.md and OUTCOMES.md but were split across files
- Week-by-week and month-by-month breakdowns were only in CLAUDE.md (implementation guide) and sprint page source code
- No single document answered "who are the ICPs, what does each sprint look like for them, and what do they get"

**Rationale:**
- Sales conversations, onboarding, and content creation all need one reference document
- Builders and Orchestrators have different nervous decisions and different sprint experiences, this needed to be explicit
- Week-by-week detail builds confidence for prospects evaluating the sprint

**What SPRINTS.md Covers:**
- Full ICP 1 (Builder) profile: titles, context, nervous decisions, how they talk, sprint fit, transformation
- Full ICP 2 (Orchestrator) profile: same structure
- Common traits and qualification signals
- 4-Week Sprint: four-week arc, deliverables, ICP-specific examples, 30/90-day outcomes
- 90-Day Sprint: three-month arc with week-by-week breakdown, deliverables, ICP-specific examples, 90-day/6-month outcomes
- Extended Sprint and post-sprint extensions
- Sprint comparison table
- Framework mapping to sprints

**Impact:**
- Single source of truth for sprint-related content
- Cross-referenced from ICP.md, FEATURES.md, OUTCOMES.md, and both READMEs

---

### 2026-02-25: Brand Vision 11/10: Complete Brand Repositioning

**Decision:** Reposition Mindmaker from "professional AI advisory site" to "the anti-consultancy for leaders who are done being sold AI and ready to use it."

**Context:**
- Original positioning was corporate, consultancy-like ("AI Literacy & Strategic Advisory")
- Needed to differentiate from AI consultancies, training companies, and tool vendors
- Brand vision doc created as comprehensive transformation guide (CLAUDE.md)

**Key Changes:**
- **Framework:** Established "Mind Set → Mind Map → Mind Make" as core language
- **Products:** Simplified from 6+ offerings to 2 core sprints (4-Week, 90-Day)
- **Voice:** Corporate → Confident + Cynical + Helpful
- **CTA:** "Book a discovery call" → "What's your nervous decision?"
- **ICPs:** Generic senior leaders → Builder / Orchestrator split
- **Diagnostic:** "AI Leadership Benchmark" → "Decision Readiness Diagnostic"
- **Chatbot:** "Chat with Krish" → "Ask Mindmaker"
- **Hero:** Benefits-based headlines → "Nervous decision" anxiety-based headlines
- **News Ticker:** Generic AI news → SIGNAL/NOISE/DECISION/TAKE categories

**Products Removed:**
- Builder Session (1hr), eliminated
- Leadership Lab (team), demoted, mentioned only post-engagement
- Portfolio Partner, by referral only, no public page

**Products Added:**
- 4-Week Sprint detail page (`/sprint/4-week`)
- 90-Day Sprint detail page (`/sprint/90-day`)
- Sprints overview page (`/sprints`)

**New Components:**
- `FrameworkJourney.tsx`. Mind Set → Mind Map → Mind Make visual performance
- `MediaEasterEggs/VideoDrawer.tsx`. Slide-out video player
- `MediaEasterEggs/AudioPlayer.tsx`. Expandable audio player
- `MediaEasterEggs/ArtifactPreview.tsx`. Hover-to-reveal artifacts
- `MediaEasterEggs/ExpandableQuote.tsx`. Click-to-expand quotes

**Rationale:**
- Leaders don't need more AI advice. They need to decide.
- "Nervous decisions" is the entry point, anxiety drives action
- Anti-consultancy positioning differentiates from crowded market
- Simplicity (2 sprints, 1 framework) is premium

**Brand North Star:** If Stripe's design sensibility met Anthony Bourdain's authenticity.

**Impact:**
- Complete homepage scroll redesign (7 blocks)
- New sprint detail pages
- Updated navigation (remove old products, add sprints)
- Redirects for all old product URLs
- Updated all documentation

**Files Affected:** All major components, pages, documentation files

---

### 2026-02-25: Two-Sprint Product Model

**Decision:** Simplify product lineup to two core offerings: 4-Week Sprint and 90-Day Sprint

**Context:**
- Previous model had 6+ products (Session 1hr, Sprint 4wk, Sprint 90d, Lab, Portfolio, Builder Economy)
- Complex state machine in ProductLadder component for path selection
- Users confused by too many options

**Rationale:**
- Two clear options reduces decision fatigue
- 4-Week Sprint = one decision, 90-Day Sprint = full journey
- Extended Sprint (6-month) mentioned as option, not separate product
- Leadership Lab and Portfolio Partner exist but are post-engagement only

**Implementation:**
- Replaced complex ProductLadder state machine with 2-card grid
- Created dedicated pages: Sprint4Week.tsx, Sprint90Day.tsx
- Created overview/chooser: Sprints.tsx
- Old product pages redirect to homepage

**Impact:**
- Clearer user journey
- Simpler codebase
- Better conversion (less choice paralysis)

---

### 2026-02-25: Builder/Orchestrator ICP Split

**Decision:** Split target audience into "Builder" and "Orchestrator" archetypes

**Context:**
- Previous ICPs were generic (CEO, CPO, VP of anything)
- Needed clearer segmentation for sprint recommendations
- Leaders approach AI differently based on leadership style

**Builder:** Wants to build alongside AI. Prototype, ship, create leverage.
**Orchestrator:** Wants to set standards and make clean decisions. Delegates execution, owns outcomes.

**Rationale:**
- Both paths start with Mind Set (clarity)
- Both end with decisions that stick
- But the nervous decisions are different
- Sprint recommendations vary by type

**Impact:**
- Updated TheProblem.tsx with Builder/Orchestrator panels
- Sprints page has path selection (Builder vs Orchestrator)
- Diagnostic recommends type
- Navigation dropdown has Builder/Orchestrator sprint paths

---

## Architecture Decisions

### 2026-01-06: Navbar-Aware Sheet Positioning System

**Decision:** Create CSS variables for navbar height and `.sheet-navbar-aware` class for side drawers

**Context:**
- ActionsHub side drawer content was cut off behind the fixed navbar
- Sheet component used `inset-y-0` from viewport edge (top: 0)
- Navbar is fixed at z-100 covering top 64-80px depending on screen size

**Rationale:**
- CSS-first solution is simpler than JavaScript-based positioning
- CSS variables allow responsive adjustment across breakpoints
- Single class application keeps component code clean

**Implementation:**
```css
--navbar-height: 4rem;      /* 64px - mobile */
--navbar-height-sm: 4.5rem; /* 72px - small screens */
--navbar-height-md: 5rem;   /* 80px - medium+ screens */

.sheet-navbar-aware {
  top: var(--navbar-height) !important;
  height: calc(100dvh - var(--navbar-height)) !important;
}
```

**Files Affected:**
- `src/index.css` (lines 93-96, 647-670)
- `src/components/ActionsHub.tsx`

---

### 2026-01-06: Hero Text Size in CSS Layer

**Decision:** Move hero text sizing from inline styles to CSS `@layer components`

**Context:**
- Horizontal scrollbar briefly flashed during page load
- Global CSS h1 styles (clamp 40-72px) applied before component's inline `<style>` tag

**Rationale:**
- CSS in `@layer components` is parsed earlier than inline `<style>` tags
- Eliminates race condition between global and component styles

**Files Affected:**
- `src/index.css`
- `src/components/NewHero.tsx` (removed inline styles)

---

### 2026-01-05: Dark Card Text Contrast System

**Decision:** Create dedicated design tokens and utilities for text on dark backgrounds

**Context:**
- `text-white/80` on dark ink backgrounds failed WCAG AA contrast requirements
- Contrast ratio was below 4.5:1 required for body text

**Rationale:**
- WCAG AA compliance is a legal and ethical requirement
- Design tokens ensure consistent usage across codebase
- Component class (`.dark-cta-card`) makes correct pattern easy to apply

**Implementation:**
```css
--dark-card-heading: 0 0% 100%;  /* Pure white */
--dark-card-body: 0 0% 93%;      /* Off-white for body */
--dark-card-muted: 0 0% 75%;     /* Softer for metadata */
```

**Files Affected:**
- `src/index.css`, `tailwind.config.ts`
- Multiple page and component files

---

### 2026-01-XX: Builder Profile Mode Detection

**Decision:** Detect Builder Profile mode from message content patterns instead of widgetMode parameter

**Context:**
- Builder Profile was sending `widgetMode: 'tryit'` which triggered wrong system prompt
- Result: Generic outputs instead of CEO-grade profiles

**Rationale:**
- System prompt takes precedence over user message content
- Builder Profile needs minimal system prompt that defers to user instructions

**Files Affected:**
- `src/hooks/useAssessment.ts`
- `supabase/functions/chat-with-krish/index.ts`

---

### 2025-01-25: Switch Chatbot to Vertex AI RAG

**Decision:** Migrate `chat-with-krish` edge function to Vertex AI RAG with Gemini 2.5 Flash

**Context:**
- Original implementation used OpenAI GPT-4o-mini
- Client has custom Vertex AI RAG corpus trained on business materials
- Need business-specific knowledge in chatbot responses

**Rationale:**
- Custom RAG corpus provides business-specific knowledge
- Separation of concerns: chatbot uses custom knowledge, news uses general knowledge
- Anti-fragile design ensures UI never breaks on API failures

**Implementation Details:**
- Service account authentication with RS256 JWT signing
- Token caching (50-minute lifetime)
- RAG corpus ID: `6917529027641081856`
- Project: `gen-lang-client-0174430158`, Region: `us-east1`

---

### 2025-12-14: Self-Serve Diagnostic Lead Gen

**Decision:** Create `/leaders` page with diagnostic for self-serve lead qualification (now "Decision Readiness Diagnostic")

**Rationale:**
- Self-serve lead qualification reduces friction vs booking calls
- Provides immediate value before asking for contact info
- Captures qualified leads through optional unlock form

**UX Decisions:**
- No toasts - all feedback inline
- Progress bars never regress
- Everything fits in viewport on mobile
- Collapsible unlock form

---

### 2025-12-01: Pause Stripe $50 Hold

**Decision:** Remove $50 authorization hold requirement, enable direct Calendly booking

**Rationale:**
- Lower friction in early customer acquisition phase
- Validate demand without payment barrier
- Stripe integration remains live but dormant

---

### 2025-11-25: Single Modal Entry Point

**Decision:** All CTAs route through `InitialConsultModal`

**Rationale:**
- One consistent experience
- Better qualification (sprint selection in modal)
- Unified tracking

---

### 2025-11-24: Ink + Mint Two-Color System

**Decision:** Use only two colors: Ink (#0e1a2b) + Mint (#7ef4c2)

**Rationale:**
- Simplicity = memorability
- Bold, not busy
- Professional without being corporate

---

### 2025-11-23: React Router (Not Next.js)

**Decision:** Use React Router instead of Next.js for SPA

**Rationale:**
- Lovable Cloud optimized for SPA
- No SSR needed (marketing site)
- Simpler deployment

---

### 2025-11-23: Supabase Edge Functions

**Decision:** Use Supabase Edge Functions (Deno) for backend

**Rationale:**
- Serverless, auto-scaling, integrated with Lovable Cloud
- Zero DevOps overhead

---

### 2025-11-23: Calendly Integration

**Decision:** Use Calendly for scheduling, not custom scheduler

**Rationale:**
- Industry standard, handles timezones/conflicts/reminders
- Not core differentiation

---

### 2025-11-23: No User Authentication (Yet)

**Decision:** Defer user authentication implementation

**Rationale:**
- All bookings via Calendly
- No user-generated content yet
- Simpler MVP

**When to Revisit:** When building client portal or community features

---

## Design Decisions

### 2026-01-08: Space Grotesk Variable for Display Typography

**Decision:** Use Space Grotesk Variable for all headings instead of Gobold

**Rationale:**
- Variable fonts = better performance
- Modern, distinctive yet readable
- Pairs well with Inter Variable

---

### 2025-11-24: Animations Sparingly

**Decision:** Use animations for scroll reveals and hover states only

**Where Used:** Scroll reveals, hover states, hero effects
**Where Not Used:** Page transitions, content changes, form interactions

---

## Business Decisions

### 2025-11-23: Founder-Led Sales

**Decision:** Krish personally delivers all sessions initially

**Rationale:**
- Establish quality baseline
- Gather feedback directly
- Refine framework

**When to Scale:** After 50+ successful sessions, when frameworks documented

---

### 2026-08-12: One 21-day Sprint and one fit-call path

**Decision:** Retire The Teardown and The Handover from the public site. Mindmaker now sells one flexible, scoped 21-day Sprint.

**Reason:** The practice is strongest when it helps a leader resolve one important commercial problem as AI changes the market. The old two-offer ladder and several booking flows made the visitor choose a mechanism before they understood the work.

**Public contract:**

- Every main sales action says `Book a fit call`.
- Every main sales action reaches the same verified Calendly page.
- CTRL is the living Sprint deliverable, not a second purchase.
- Prices are not public.
- The Diagnosis Room and homepage AI demonstration are paused.
- Old offer routes redirect straight to `/sprint`.
- Mindmaker Live uses its branded external URL.

**Release boundary:** Do not change Supabase, CTRL, the control centre or production promotion in this pass.

---

### 2026-08-19: Mindmake public brand and simplified offer

**Decision:** Replace the public Mindmaker and Mindmaker Live names with one public brand, `Mindmake`.

**Public identity:**

- `mindmake.co` is the canonical site.
- `content.mindmake.co` is the Mindmake publication, presented as `Useful ideas by email`.
- `ctrl.mindmake.co` is `CTRL, a Mindmake product`.
- `themindmaker.ai` will later redirect path by path to the matching Mindmake URL.
- The supplied Mindmake wordmark is the approved visual source. The owl icon and favicons remain unchanged.

**Public offer:** Show two outcomes only: `Build your AI brain` and `Use AI to improve what you sell`. Do not publish the six-package grid or larger commercial bands.

**Public price:** Show only `Work starts at $1,500. You receive a fixed price before work begins.` The entry price applies only to a tightly capped Brain starting engagement.

**Buying path:** Every primary commercial action says `Book a fit call` and opens the same short qualification state. Ask for company domain, work email and one of three intentions. Do not open Calendly automatically. Krish sends the booking link to good-fit leads.

**Design direction:** Preserve the strongest current imagery, motion, dark-light rhythm and operating-system proof. Remove generic AI-site typography, blank media states, repeated card grids and decorative interaction. The homepage mock may show CTRL as proof, never as a third offer.

**Authority:** Approved for a local homepage mock only. Production implementation, domain changes, deployment, redirects and asset deletion require later approval.

---

### 2026-08-19: Show value before asking for email

**Decision:** Keep the approved Mindmake homepage spine. Put the strongest intelligence moment inside the fit-call drawer after a visitor enters a company website.

**Interaction contract:**

- Ask for the company website first.
- Show a short starting read before asking for email.
- Keep facts, possible decision areas and open questions visibly separate.
- Ask one tap-friendly question to sharpen the read.
- Ask for email only after the visitor has received useful value.
- Keep the prototype honest when live company research is not connected.
- Use CTRL as inspectable proof of inputs, checks and the human decision. Do not turn it into a third offer or a public chatbot.

**Design contract:** Use motion to explain assembly and cause. Do not add 3D spectacle, hidden navigation, gamification, generic AI chat or decorative animation.

**Authority:** Approved for the local interaction mock. Production research, storage, email submission and deployment remain unapproved.

---

### 2026-08-19: Make the two outcome pages specific, human and current

**Decision:** Treat `Build your AI brain` and `Use AI to improve what you sell` as deep outcome territories, not generic pages about helping leaders make decisions.

**AI Brain contract:**

- Show how a leader becomes more capable while staying recognisably themselves.
- Use personified examples: getting better at work they hate and avoid, becoming accountable to work they need to do, encoding their judgment and taste, building a useful AI Chief of Staff, and filling their gaps without giving away the human spark that put them in the seat.
- Position AI as an amplifier of expertise, judgment and taste. Do not make the work look like generic automation consulting or outsourced thinking.

**AI GTM contract:**

- Show the largest current commercial problems created by AI for internet, software and media businesses.
- Use specific, real-world decision scenes across product, pricing, positioning, sales, routes to market and the company structure that supports them.
- Make the time break visible: knowledge that worked a year ago may no longer be enough because AI has changed cost, speed, buyer expectations, product scope and competitive pressure.
- Research and verify the examples at page-build time. Do not publish remembered market claims as current truth.

**Homepage consequence:** The current problem and solution statements are provisional. They are too close to `I help you make a decision on things`. The later homepage pass must carry the human promise of AI Brain and the commercial urgency of AI GTM without making the opening screen dense.

**Design contract:** Use recognisable people, pressures, actions and artifacts. The reader should see themselves in each example and feel what becomes possible. Avoid abstract card grids, generic AI imagery and show-off technology theatre. Build enough recognition and value before presenting one clear contact action.

**Open for the detailed page interrogation:** Whether `AI GTM` is a public name or internal shorthand; which personal gaps are most valuable to dramatise; which current commercial shifts have the strongest evidence; which examples Krish can support with direct experience; and what each page should reveal before asking the visitor to get in touch.

**Authority:** Approved as a deferred positioning and page-design constraint only. It does not authorise new mocks, homepage copy changes, research spend, production implementation or publication.

---

### 2026-08-19: Use current product video without drawn annotations

**Decision:** Use current video selected by Krish to prove the agentic operating system, CTRL brain and decision engine. Do not draw circles, arrows, handwriting or explanatory marks over product screenshots or product video frames.

**Reason:** Product interfaces will change as the core build continues. An annotated frame turns a temporary interface into the visual anchor, dates the site and implies certainty about a product view that has not been selected. The archived Battle Test image had no approved role in this proof treatment.

**Design contract:** Hand-drawn marks may explain abstract client results and decision diagrams. Product footage remains clean and replaceable. Its component must accept new clips, poster frames and crops without forcing a page redesign.

**Voice contract:** Product proof should be calm and factual. Retire `We do not need fake images`, `not a deck, two real buyers` and `more than an AI answer`. The site does not need to belittle decks, other images or AI answers to make the work credible.

**Open:** Krish will later identify the current source clips and approve their order, poster frames and captions.

**Authority:** Approved for the local proof-motion correction and future page-design constraint. It does not authorise selection, editing, upload or publication of product video, homepage implementation or deployment.

---

### 2026-08-19: Build around seven named videos with finished launch fallbacks

**Decision:** Proceed on the assumption that four films and three CTRL clips will be produced. The four films are `Half Past Six`, `Three Times Is A Rule`, `Two Conversations` and `Ask Me Anything I Did`. The three product clips show a decision getting sharper, the brain learning the leader's judgment, and the leader taking their context into another AI tool.

**Reason:** The planned films give the site real-world aspiration while the CTRL clips provide real product proof. Designing the page around empty video boxes would make the launch depend on a separate production schedule and would recreate the blank-state problem already rejected.

**Media contract:** Every video surface has a complete poster or abstract fallback that works without the video. No `coming soon` label, blank frame or broken poster is public. A delivered clip replaces the fallback inside the same component without changing its size, copy, mobile order or controls. Product media stays clean and receives no circles, arrows or handwritten overlays.

**Proof boundary:** Client-result motion shows verified outcomes. CTRL recordings show real product behaviour. Agent and division films explain or dramatise how a system can work and must not be presented as client proof or live operating footage when their figures are illustrative.

**Temporary source:** `CTRL-demo-aug-26.mp4` may support the local mock inside a cropped portrait frame. It is not the final public asset because it contains a landscape black canvas, a Recordify mark and a retired brand reference. Final use requires a clean native portrait capture.

**Local implementation:** The homepage mock removes the archived Battle Test screenshot from the hero, adds finished abstract states for the personal and business routes, and places the current CTRL recording behind an accessible play and pause control with a no-video fallback.

**Authority:** Approved for local mock design and replaceable media scaffolding. It does not authorise final film production, editing, upload, production implementation, publication, merge or deployment.

---

### 2026-08-19: Make the homepage problem section type-led

**Decision:** Approve the type-led problem-section direction for the local mock. Move the two-person stage image into the hero, remove photography and the movement control from the problem section, and let three full-width editorial statements carry the recognition work.

**Copy status:** The current heading, supporting sentence and three statements are provisional. Krish expects to hard-write the final wording after the page is complete. Treat this approval as a hierarchy and layout lock, not a final copy lock.

**Mobile contract:** Recompose the section rather than merely stacking the desktop treatment. The heading, supporting sentence and first numbered symptom must arrive before a fixed-height media block can consume the first mobile viewport.

**Local implementation:** `prototypes/mindmake-homepage-mock-v2.html` preserves V1 and implements the approved direction. The hero uses `krish-stage-2.png` with separate desktop and mobile focal positions. The problem section contains no photograph, media control or decorative motion.

**Authority:** Approved for the local mock only. Production implementation, merge and deployment remain unapproved.

---

### 2026-08-19: Sharpen the problem and treat mobile as its own journey

**Observed failure:** The stage photograph explained that Krish speaks with leaders, but it did not explain the costly business moment in the problem section. The three original lines described broad AI problems that could belong to almost any consultancy. A phone audit also found that responsive stacking alone produced a long page and exposed a heading collision, a transparent-header overlap and undersized footer link targets.

**Local direction:** Keep the two-person stage image in the hero. Make the next section type-led and organise it around three distinct pressures: what customers will pay for has changed; the team can build faster than it can choose; and the leader's best judgment leaves the room with them. Give each pressure one plain explanation so the commercial, team and personal stakes are visible without another image.

**Mobile correction:** Collapse the problem heading to one column below 1050px, change the fixed header after 24px of scroll, and give every visible footer link a 44px minimum touch height. The 390px browser regression now shows no overlap, horizontal overflow, clipped headings, broken images, duplicate IDs or undersized visible controls.

**Open:** The full 390px page remains about 14,340px tall. This is responsive, but it is not yet a world-class on-the-go journey. A separate mobile compression mock, followed by physical iOS Safari and Android Chrome checks, is required before mobile approval. The new problem copy is a sharper working draft, not Krish's final hard-write.

**Authority:** Approved for local V2 mock correction and evidence collection only. It does not authorise production implementation, merge, deployment or publication.

---

### 2026-08-19: Replace decorative offer animation with visible business reasoning

**Observed failure:** The type-led problem section improved the copy but stayed visually static. The AI Brain fallback looked like four boxes producing one worksheet. The AI GTM fallback looked like moving dots and blank paper with no clear commercial meaning. Repeated narrow text measures also caused display headings to break into short fragments.

**Decision:** Reject that visual spine. Show one market change moving through product, price, message and team. Compare what the business believes with what the buyer now sees. Carry the same visible evidence into a durable AI Brain and then into linked AI GTM choices.

**Meaning of the motion:**

- The problem section shows cause and disagreement, not a list entering the page.
- The AI Brain keeps memory, standards, context, judgement, sources and the human call visible. It is not one document and does not promise an automatic answer.
- AI GTM revises linked commercial choices and keeps a plain reason beside each change. The result is ready to test, not presented as certain.
- Light interaction may emphasise the inside or buyer view. The complete story remains available through normal scroll.
- Product footage stays clean. Working marks may appear only on abstract decision material.

**Typography decision:** Display headings are now governed by a rendered line-count contract: two lines at 768 pixels and above, three lines on a phone. Narrow character measures that create stacks of fragments are not allowed.

**Evidence:** Three independent concept specs were generated. Two fresh-context judges independently selected the comparison-led concept and preserved the same minority risk: it must not become invented software, a worksheet or a static consulting table. The selected render passes the wrap, overflow, control-size, asset, console, ordered scroll-state and reduced-motion checks recorded in `REBUILD_STATE.md`.

**Local artifact:** `prototypes/mindmake-mechanism-motion-study-v1.html` at SHA-256 `AA7F6B07002BE1FC486F36E71C3AFBB079D9B43A078CE6B8F28DFCAED444490D`.

**Authority:** Local focused study only. Production implementation, full-homepage integration, merge and deployment remain unapproved.

---

### 2026-08-19: Approve the mechanism and integrate it into homepage V3

**Approval:** Krish approved the focused mechanism study with `I love it`.

**Decision:** Use `Both Sides of the Call` as the homepage's visible reasoning spine. Show one market change separating the business view from the buyer view, then show how Mindmake keeps the leader's judgment alive and links it to product, price, message and team choices.

**Full-page integration:** Preserve V1, V2 and the focused study. Create `prototypes/mindmake-homepage-mock-v3.html` as the new local full-page proposal. Carry only the strongest mechanism beats into it rather than copying the entire focused study.

**Mobile decision:** Do not reproduce the long sticky build on a phone. Open the comparison in its complete state, keep the inside and buyer controls usable, and place three compact explanations directly after it. Finished abstract states remain visible before any future video arrives.

**Typography correction:** Apply the rendered heading contract to every visible display heading on the page. Widen older V2 headline measures, shorten one heading where needed and move tablet layouts to one or two columns before words break into fragments.

**Evidence:** V3 passes rendered checks at 1440, 1280, 1024, 768, 390 and 320 pixels. It has no horizontal overflow, broken image, duplicate ID, heading-line failure, console error or page error. Scroll states advance in order, the view switch works, offer examples expand, the fit panel manages focus and Escape correctly, CTRL video plays, reduced motion reaches the complete state and 390-pixel controls meet the 44-pixel target.

**Artifact:** `prototypes/mindmake-homepage-mock-v3.html` at SHA-256 `BB468B02888278B10F414DC8E90931A26D9202D3426C46E1434F6EEF3A7E5D88`.

**Open:** The page is still a local visual mock. Final copy, seven replacement videos, deletion of any remaining unnecessary homepage material, physical mobile browser checks and the production component map remain separate gates.

**Authority:** Approved local full-homepage mock only. No commit, merge, deployment, publication, production route change, email send, Supabase change or CTRL change is authorised.

---

### 2026-08-20: Lock V8 as the production visual floor and use full outcome routes

**Approval:** Krish confirmed the proposed route architecture with `yep`.

**Visual floor:** `prototypes/mindmake-homepage-mock-v8.html` is the exact production baseline. Its SHA-256 is `CD58CE4B7FDCA9C49003F4AFE30158B7BDA78F16B62D9FADEEA871CAB311CA74`. V8 preserves the approved V7 visual and interaction spine and adds the later navigation, direct booking, proof-layout and testimonial range fixes. Production implementation may improve the system, but it may not fall below V8 in page rhythm, interaction quality, responsive behaviour, content range or visual finish.

**Mechanism reference:** The approved interaction source remains `prototypes/mindmake-mechanism-motion-study-v1.html` at SHA-256 `AA7F6B07002BE1FC486F36E71C3AFBB079D9B43A078CE6B8F28DFCAED444490D`.

**Route decision:** `Build your AI brain` and the commercial AI outcome will each receive a full route inside the shared Mindmake shell. They will not be modal or overlay pages. Entry may use a continuous visual transition, and returning to the homepage should restore the visitor's prior context.

**Reason:** Full routes give each outcome enough room for progressive recognition, real mechanisms, proof, qualification and conversion. They also provide stable mobile behaviour, accessibility, browser history, shareable links and search visibility without making an overlay carry page-level complexity.

**Carry-forward conditions:**

- The homepage keeps concise, high-impact previews of both outcomes.
- Each route must feel like the current site opening out, not like a separate microsite.
- Shared navigation, footer, typography, motion, proof, media and CTA components come from one deduplicated design system.
- Ordinary back navigation restores the homepage position and state where the platform supports it.
- Reduced motion shows complete static meaning without requiring animation.
- This approval does not lock route slugs, final copy, pricing, lead storage, public intelligence scope, publication wiring or production release.

**Authority:** Product architecture and local production planning only. No deployment, public route mutation, external account change or deletion is authorised by this decision.


---

### 2026-08-20: Remove the public price and state the paid 30-day starting point

**Approval:** Krish agreed that the public site should show no monetary price.

**Decision:** Remove the `$1,500` starting-price statement from the production specification and public implementation. State clearly that work begins with a paid 30-day proof. The exact amount is set after scope, client size, strategic value and any approved participation terms are understood.

**Reason:** A low public anchor damages the premium relationship and a single high anchor misstates work that may involve a principal, one company or several businesses. The paid commitment remains visible, while qualification and the fit call establish the correct commercial shape.

**Boundary:** No public price does not mean an unpriced service. Mindmake still needs an internal cash floor, workload envelope and continuation model before lead qualification can be implemented honestly.

**Authority:** Product and public-copy direction only. This decision does not set or change a live price, proposal, checkout, Calendly field or billing configuration.


---

### 2026-08-20: Cap first-month delivery to protect judgment and compounding work

**Approval:** Krish approved the proposed delivery ceiling.

**Decision:** Run no more than two new 30-day proofs at the same time. Each proof may consume no more than 24 to 30 hours of Krish's time. A third paying customer must already be in a lighter continuation phase.

**Reason:** The model must protect Krish's scarce judgment and leave room for content, relationships, shared intelligence and owned assets. Research, capture, synthesis and first drafts should be automated or delegated to the delivery system where quality permits.

**Qualification consequence:** A lead that requires broad unmanaged implementation, daily embedded availability or more than the first-month time envelope is not a standard proof. It needs a higher custom scope, a delivery partner or a polite refusal.

**Authority:** Internal product and capacity planning only. This decision does not create availability, promise a start date or set a live price.

---

### 2026-08-23: Return valuable capacity, then extend what the leader can do

**Decision:** Position premium Mindmake value above task automation and basic time saving. The public and sales model uses three levels: help me do the task, bring me what matters, and extend what I can do. Mindmake is built for the third level.

**Reason:** The better commercial question is not only how many hours AI saves. It is whose scarce time comes back, what they put it into and whether the person gains a capability that keeps compounding. A founder may put the time into the company. A portfolio owner may put it into several companies. A curious principal may use it to build their own AI skill and become less dependent on outside help.

**Public consequence:** Do not shame people as beginners or experts. Show increasing levels of value in plain language. Keep the positive case for healthy and high-growth AI businesses beside the competitive-pressure case.

**Proof consequence:** Krish's personal relationship system is a strong AI Brain artifact. It may show that years of relationships become usable through natural search while Krish keeps the human call. Public media must not expose private contacts, raw records, unverified counts or unapproved vendor names.

**Authority:** Internal positioning, local copy and a privacy-safe film brief only. It does not authorise publication of personal data, vendor claims or operating counts.

---

### 2026-08-23: Replace public booking with an earned private brief

**Decision:** Remove the public diary path from the new Mindmake journey. The main conversion starts with a company website, shows a useful company-specific read, asks one low-cost choice, then asks for email so the visitor can keep the full private brief.

**Lead contract:**

- The visitor sees value before email.
- The strongest second question is `If you got more of your best time back, where would you put it?`
- The result separates what AI can carry, what stays human, where the returned capacity goes and what a 30-day proof could test.
- Krish receives the same answers plus company and fit context.
- Krish chooses whether to reply and may offer a private conversation.
- Newsletter consent is separate, optional and unticked.
- There is no recurring personalised watch or automated nurture sequence in the current build.

**Reason:** Direct diary access makes the work feel less selective and creates a lower-information lead. The private brief earns the email ask, demonstrates Mindmake's intelligence and gives Krish a warmer, richer starting point.

**Technical boundary:** Existing visitor-email functions use retired Mindmaker copy and a proposal/call path. The local front end builds and downloads the brief, but no existing lead endpoint is approved for this journey. The work-email step stays disabled until the dedicated `submit-mindmake-brief` endpoint, current visitor template and operator digest are implemented and verified under separate backend authority.

**Authority:** Local route, component and conversion implementation. No live email, Supabase mutation, account change or deployment.

---

### 2026-08-23: Lock one paid proof with compounding continuation

**Decision:** Public work begins with a paid 30-day proof. The proof uses no more than 24 to 30 hours of Krish's time and no more than two new proofs run at once. There is no public price.

**Continuation:** Strong work may continue for three months or longer. The standalone first month costs more than one third of a three-month relationship. When the client continues, the proof is treated as month one and the longer relationship recognises the lower multi-month unit rate.

**Success signal:** The proof works when the client says it is useful in practice and is willing to stand behind that view. A cleared testimonial or case study is the strongest supporting evidence. A continuation is likely when the work is genuinely useful, not because the client has become dependent.

**Compounding constraint:** Hands-on building should also strengthen reusable methods, anonymised trend data, relationships, content or another Mindmake-owned asset. Commodity agent libraries are not the long-term asset. The preferred data asset tracks benchmarks, trends, shifts and comparisons over time in AI use and monetisation.

**Commercial flexibility:** Terms may flex for a rare opportunity with meaningful equity, network access, content or case-study value. Any trade is explicit and opportunity-specific.

**Open:** The private cash floor, exact multi-month amounts, intellectual-property clauses and anonymised-data consent language remain to be set before sale.

**Authority:** Internal offer and capacity canon. No live price, proposal, availability or billing change.

---

### 2026-08-23: Make value visible before asking for belief or contact

**Decision:** Treat `genuinely value-adding` as an interaction rule across the whole product. Each screen must teach a useful distinction, show credible evidence or help the visitor make a clearer choice. Copy whose only job is to convince does not earn space.

**Conversion consequence:** The personalised starting brief reads the business before asking the visitor to explain it. The company evidence, chosen pressure and intended use of returned time all change the preview, download and Krish's lead digest. Email appears only after the useful preview. Newsletter permission remains separate and unticked.

**Tone consequence:** Experienced visitors are addressed at their level. The site shows the trade-off and evidence, then lets them judge. It does not preach, manufacture urgency, shame a lower level of AI use or claim that technology can make the human call.

**Verification at the time:** The local build passed its production build, 147-case responsive matrix and 42-case full-sitemap browser audit. The 13 Mindmake contract tests passed. The full suite still had four baseline `localStorage` environment failures at this point. Those failures were fixed in the later release-hardening entry below.

**Boundary:** This verifies the local front end. It does not approve live email, Supabase changes, deployment, legal wording, domain changes or production promotion.

---

### 2026-08-23: Complete local release hardening without crossing the release boundary

**Decision:** Treat the local Mindmake front end as complete enough for preview review, while keeping visitor email, production configuration, legal approval, physical devices, preview deployment, cleanup, merge and production promotion as separate gates.

**Reliability:** The test setup now supplies deterministic in-memory browser storage, which repairs the Node 25 test-environment defect without changing runtime behaviour. Company research has a 10-second limit, an honest fallback and retry. Closing the starting brief clears private state and aborts old work so late results cannot enter a later journey.

**Access and route consequence:** The worked org chart uses native buttons with Enter and Space support. Focus remains visible on light and dark surfaces. Reduced-motion visitors retain the full meaning. Featured article search, hash scrolling, sharing fallbacks, blocked storage and unknown-route behaviour now fail safely. `/alumni` is unlisted and noindex, not access-controlled or described as private.

**Crawler consequence:** The sitemap and prerender lists share one source. Ten fixed pages and eleven articles now produce 21 dedicated crawler pages with real article content and metadata. The build fails on route-set drift.

**Lead safety:** The default starting brief is download-only, asks for no email and says that nothing was sent. The optional browser adapter is pinned to `submit-mindmake-brief`, sends a versioned structured request with a stable journey ID and explicit consent record, and makes claims only for independently confirmed delivery states. It never falls back to `send-contact-email`. General contact opens a prefilled email draft and never claims delivery.

**Public-surface safety:** Former `/intake` and `/testimonials` URLs now redirect to current Mindmake journeys while their old source remains recoverable for an approval-gated cleanup. Two article addresses containing an unsupported figure or retired offer name were replaced with plain canonical slugs; old saved links redirect.

**Verification:** `npm test` passes 74 of 74 tests across 13 files. `npm run build` passes with 2,503 modules and 21 prerendered routes. The 147-case responsive matrix and 42-case desktop/mobile sitemap audit both pass completely. Lint remains at 41 errors and 19 warnings against the earlier 41-error, 20-warning baseline; the active hardening changes lint cleanly. Browser hand-off checks used the enabled adapter with intercepted requests and did not create live data.

**Open gates:** A preview must prove real HTTP 404 behaviour and repeat the route and lead checks. The dedicated backend and both emails, legal wording, physical devices, publication move, retained legacy source and exact cleanup batch remain owner decisions. About 73 MiB of unused public media still enters the build until cleanup is approved.

**Boundary:** No deployment, merge, real email, Supabase mutation, domain change, deletion or production promotion was authorised or performed.

---

### 2026-08-24: Make motion carry the argument

**Decision:** Treat movement as part of the explanation, not decoration. The current opening-act candidate uses one persistent judgement thread. AI opens more paths; product, price, message and team separate; evidence joins; Krish's client makes the human call; the line forks to AI Brain and Improve what you sell; the same line becomes the edge and playhead of real CTRL proof.

**Reason:** The rejected hybrid used movement without enough consequence. It felt generic, entered at the wrong moments and weakened the message. A visitor should understand more because an object moved. If the still frames say the same thing before and after, the motion does not earn its place.

**Interaction consequence:** Scroll controls the pace and reverses the sequence. Names do not change while objects move. Mobile keeps the same cause-and-effect story. Reduced motion shows every state in natural order. Invisible choices are removed from the keyboard path.

**Visual consequence:** Keep the V8 identity, stage image, colour system, icon and wordmark. Do not copy Pear, Tenex, Wavespace or a component library's surface style. Use their strongest structural lessons only: causal scenes, a stable claim and dense proof.

**Status:** Candidate direction only. `prototypes/mindmake-judgement-thread-motion-study-v1.html` is verified locally but still requires Krish's visual approval before production use. It does not authorise a full-page rebuild, merge or deployment.

---

### 2026-08-25: Approve judgement-thread V5 and ban eyebrows system-wide

**Approval:** Krish reviewed `prototypes/mindmake-judgement-thread-motion-study-v5.html` and said, `I'm finally happy with this, do not regress from here`. He then clarified that his rejection applies to all eyebrows everywhere, not to a growing list of isolated examples.

**Visual-floor decision:** Use `prototypes/mindmake-judgement-thread-motion-study-v5.html` as the approved visual and interaction floor for the homepage opening, working-understanding act, judgement thread, two-route gateway and first CTRL proof. Its SHA-256 is `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`. V8 remains the breadth reference for full routes, testimonial range and proof not represented in V5. Where the two overlap, V5 is the stronger authority.

**System rule:** Do not use eyebrows anywhere in the public design system. The rule covers kickers, overlines, chapter numbers, decorative counters, status straps, proof badges and small pre-headings above or beside real headings. It applies regardless of class name, text case, component, viewport or motion state. A compact label survives only when it directly names an object, control, value or axis and is required for use or understanding.

**Reason:** Eyebrows create a redundant reading step, weaken the real heading and make the interface feel templated and AI-generated. Fixing instances one by one failed because the same visual function kept returning under different names. The correct unit of correction is the underlying pattern, not the selector or line of copy.

**Broader method learned:** Krish's feedback often names a local symptom before exposing a system rule. Once the same objection appears more than once, the work must search sideways across the entire artifact, identify the shared function and turn the correction into a global regression contract. A technically correct local edit is still a failure if its design logic survives elsewhere.

**Accepted trade-off:** Removing these labels means the hierarchy must carry more meaning through the real heading, layout and motion. Necessary context cannot be hidden in decorative microcopy. This requires harder editing but produces a simpler and more ownable system.

**Verification:** The approved artifact and live DOM returned zero matches for the forbidden pattern family. Hero pause and resume, reversible gateway motion, desktop and mobile overflow and browser console checks passed. The exact verification record is in the 25 August 2026 entry in `REBUILD_STATE.md`.

**Revisit:** None planned. Reopen only if Krish explicitly changes this cross-surface design preference, not because a template or component library includes the pattern.

**Authority:** Local design canon, prototype correction and future implementation guard. No deployment, merge, publication or external mutation is authorised.

---

### 2026-08-25: Integrate the approved floor through contracts, not imitation

**Decision:** Move the approved V5 opening act into the current production shell without redesigning it from memory. Treat its frozen component, exact hash, route names, no-eyebrow rule, plain `Start here` action and causal motion as implementation contracts.

**Reason:** The previous failure came from treating approved work as loose inspiration, then replacing its hierarchy, copy and interaction logic with generic patterns. The safer method is to preserve the approved source, extract its cross-surface rules, guard those rules in tests and change only the surrounding system needed to carry it.

**System consequence:** A repeated owner objection is a design-system signal. Fix the shared component, generator and regression check before fixing examples. This pass applies that rule to eyebrows, aggressive wrapping, visitor-facing jargon, attendee proof, moving testimonial controls, media controls, menu focus and copy generated for crawlers.

**Proof consequence:** The homepage uses BBC, Hearst and Condé Nast as clearly labelled attendance proof. Customer outcomes and testimonials remain separate. No active public source or crawler output contains the retired private money disclosure.

**Verification:** V5 remains byte-stable at SHA-256 `DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81`. The full suite passes 85 of 85 tests across 14 files. TypeScript and changed-surface lint pass. The production build transforms 2,504 modules and creates 21 indexed and prerendered URLs. Browser checks pass at desktop, tablet, mobile and short landscape sizes, including reversible motion, reduced motion, stable quote controls, CTRL playback, media captions, the private brief fallback and mobile-menu focus containment.

**Open gates:** Live company enrichment still needs a preview with production environment variables. The dedicated brief backend and both email paths, legal wording, physical devices, publication move, legacy source cleanup, deferred Supabase disclosure, frozen `ROI` wording, merge and release all remain separately gated.

**Authority:** Local implementation, verification and internal canon only. No deployment, merge, email, Supabase mutation, deletion, domain change or production promotion.

---

### 2026-08-25: Repair the integrated homepage as one measured composition

**Observed failure:** The first integrated pass let local fixes recreate system problems. The wordmark and sections used different left edges, the Brain and GTM gateway gained decorative diagram noise, customer proof was split across overlapping sections, several scenes exceeded the visible canvas and hand-drawn marks floated without a clear target.

**Composition decision:** Use one shared shell width, gutter and fixed-header height for the whole homepage. The wordmark is the alignment reference. Fit-screen scenes are measured against the remaining canvas below the header. A short or narrow screen may change the layout or expose a horizontal snap deck, but it may not hide substantive copy, remove an action or reduce a control below 44 pixels to manufacture a pass.

**Gateway decision:** Keep the exact heading `Ways to get started on your AI journey` and the exact route names `Build Your AI Brain` and `Build Your AI GTM`. Use the real CTRL Brain and Decisions clips as the visual evidence. The two routes meet at the centre and separate with reversible scroll movement. Remove the abstract diagram, grid and unrelated decoration behind the choices.

**Proof decision:** Keep one homepage customer-results section with three previews and one link to all eight stories. Attendance proof lives inside that section and remains clearly labelled. Career testimonials live once in About, where all six remain reachable through controls whose position does not change with quote length. Do not add a second section to restate what the work felt like.

**Annotation decision:** Keep one causal hand-drawn mark around the stable `1 day` result. Its stroke follows scroll in both directions and respects reduced motion. Do not circle temporary product screens or scatter squiggles merely to make the page move.

**Responsive consequence:** Phone Results and Media use horizontal snap decks so the page stays concise without losing content. Short landscape Results places its explanation beside the result deck; About separates portrait, story and testimonial into three readable areas. This is progressive composition, not content deletion.

**Verification:** TypeScript and changed-surface lint pass. The full suite passes 86 of 86 tests across 14 files. The production build transforms 2,505 modules and creates 21 indexed and prerendered URLs. A rendered pass at 1440 by 900, 1280 by 720, 1024 by 768, 844 by 390 and 390 by 844 finds exact shared left edges, no horizontal overflow, no browser errors, no clipped result cards and stable testimonial controls across all six quotes. At 844 by 390, Results, About and Media all fit the 320-pixel canvas below the fixed header while retaining their copy and actions.

**Boundary:** This authorises and records the local repair only. It does not authorise deployment, merge, live email, Supabase mutation, domain change, asset deletion or production promotion.

---

### 2026-08-26: Freeze candidate 7 V2 and keep private-brief V2 fail-closed

**Visual decision:** Treat `prototypes/mindmake-brain-gtm-gateway-candidate-7-v2.html`, `src/components/mindmake/BrainGtmGateway.tsx` and `src/styles/mindmake-gateway.css` as one exact approved gateway contract. Do not recreate it from memory, substitute a newer interpretation or change its copy, composition or door-separation movement while repairing another surface. V5 remains the visual and interaction floor around it.

**System consequence:** Eyebrows remain banned across every public route and viewport, with only the frozen gateway's approved `Pick your starting point` label excepted. The wordmark and sections use one measured content edge. A scene must fit the usable device canvas through purposeful recomposition. Motion must make the message clearer. Customer outcomes, attendance proof and career testimonials keep one distinct home each rather than being restyled into duplicate proof sections.

**Conversion decision:** `Start here` remains the main action and there is no public diary. The visitor gets a useful read before contact is requested. The browser sends only the email, domain and allowlisted choice IDs; server-owned code researches the company, assembles both briefs, verifies the address and attempts visitor and operator delivery independently. Publication interest remains separate and unticked and never becomes an automatic or manual subscription from this flow.

**Current status:** The version-two private migration, Edge Function and two email templates exist in source only. The hand-off flag remains off until the preview migration and database boundary pass, exact origins and symbolic secrets are configured, the full request and code matrix passes, both emails are tested independently with synthetic inboxes, and the retention schedule and any promised cleanup are in place. Provider acceptance is not inbox delivery.

**Reason:** The repeated regressions came from treating approved artifacts as inspiration and from letting local fixes reintroduce rejected system patterns elsewhere. The corrective unit is the frozen contract plus cross-route regression rule. The private hand-off uses the same standard: valuable and inspectable first, then contact, with no success claim stronger than the observed delivery state.

**Authority:** Internal canon, source implementation and preview planning only. No migration, deployment, flag change, email, merge, publication, domain change, deletion or production promotion is authorised.

---

**End of DECISIONS_LOG**
