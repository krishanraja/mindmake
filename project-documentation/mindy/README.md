# SUPERSEDED for public work.

Mindy, its knowledge files and the Diagnosis Room are not part of the current public product. Do not use anything here as public copy, pricing, route or product truth. Current truth lives in `project-documentation/MINDMAKE_CANON.md`. The retired private money disclosure in the deferred knowledge files must not reach any public answer.

---

# Mindy Brain Pack

*The knowledge pack that makes Mindy reason like Krish, recommend honestly, price in ranges, and sound like the operator and not the model. Built 2026-06-09 against `MINDY-ONE-JOURNEY-ARCHITECTURE.md` (the Diagnosis Room brief); last reconciled 2026-06-28. This README is the index and the wiring diagram. It also carries the consistency and open-questions list; items resolved as of 2026-06-09 are marked.*

---

## What this pack is

Mindy is the on-site guide for the Mindmaker Diagnosis Room: one door, one nervous AI decision, three honest exits (learn by chat, book a fit call, download a co-branded proposal). The architecture brief rated readiness 6/10 and named the two missing assets that gate the headline experience: *real Krish reasoning* and *an honest down-sell rubric*. This pack fills those plus the surrounding guardrails, organised into the three-layer knowledge architecture from brief §6.

---

## The files, and the layer each one serves

| File | Layer | What it is | How Mindy uses it |
|---|---|---|---|
| `mindy-system-prompt.md` | **Layer 1, system prompt** | The deployable master prompt (~1.5–2k tokens, delimited block). Persona, standing orders, the reflect-then-reason-then-recommend spine, compressed rubric, the gate, two-mode pricing, proof rule, voice, three exits, hard limits. | Loaded verbatim as the system prompt. Hand-curated, never RAG. Points to the other five files rather than inlining them. |
| `reasoning-fewshots.md` | **Layer 2, retrieval** | Five reasoning exemplars (`[Pattern]` / `[Documented]`) plus the reusable frameworks: five-brick chain, Leverage Audit, redeploy-not-replace, find-the-brick. | Her diagnosis engine. Retrieved to shape *how* she decomposes a decision in scene 4. Patterns, not scripts; never read aloud. |
| `fit-and-walkaway-rubric.md` | **Layer 2, retrieval / cross-cutting guardrail** | The decision table (signals → mode + rung → range → call vs self-serve), the three walk-away moments, the start-cheap mechanic, the hand-to-Krish triggers, and Krish's real objection lines. | The honest-recommendation gate that fires before any paid suggestion. The file that stops her sounding like a sales bot. |
| `pricing-range-model.md` | **Layer 1 pin + cross-cutting guardrail** | The two rungs in all three currencies, the router, and the no-invent / no-convert / no-discount rules. | Pinned pricing logic. Canonical figures live in `src/lib/offers.ts`; a test fails the build if Mindy states one that is not there. |
| `proof-bank.md` | **Layer 2, retrieval (selection only)** | 9 anonymised real engagements (R-01–R-09, verified numbers) + 26 illustrative per-offer entries (B-01–B-26), keyed by `mode` / `icp` / `industry`. | Selected, never generated. The proposal's Proof section pulls three entries keyed to (offer, ICP, nearest industry), Exa-matched. Role-only, numbers OK, never a named client. |
| `CANON.md` | **Cross-cutting guardrail (de-poison)** | Precedence order, canonical current facts, settled corrections, the do-not-index blocklist, and the one live tension (cohort framework name). | The de-poison file. When retrieval disagrees with canon, canon wins within its precedence order. Stops retired facts (old prices, durations, framework names) leaking into client-facing output. |
| `voice-lint.md` | **Cross-cutting guardrail (output gate)** | Machine-readable lint arrays (banned tokens/phrases/patterns, use-vocabulary) plus the craft layer (Krish's tells, before/after rewrites, pre-render checklist). | Runs as a post-generation pass on every Mindy output and every proposal. Hard fail on any banned token, em dash, or buzzword: block and regenerate. |

---

## How they wire together

**Layer 1 (system prompt)** is the spine. It encodes *when* to reach for each rule and defers the detail to the companion files, so the prompt stays small and the facts stay versioned in one place.

**Layer 2 (retrieval)** is the RAG body: the reasoning exemplars, the fit rubric, the proof bank, and the cleaned grounding KB (`SALES_PLAYBOOK`, `VALUE_PROP`, `OFFERS`, the ICP docs, `OUTCOMES`). Every chunk tagged with offer + ICP + last-updated. The do-not-index blocklist in `CANON.md` §4 keeps the RAG-poison files (`mindmaker_rebuild_brief_v4`, everything under `research/`, `PRICE_TRUTH_AUDIT`, the old deck) out of the store.

**Layer 3 (live enrichment)** is tools, not training: the dossier from brief §3 (Brandfetch for the co-brand gasp, Tranco + PDL for silent routing, Brandfetch context + BuiltWith for understanding, Perplexity / NewsAPI / Exa for currency). Not held in this pack; this pack governs what Mindy is allowed to *say* about what those tools return.

**Cross-cutting guardrails** sit over all three layers and run on every turn:
- `CANON.md` resolves fact conflicts before output (de-poison).
- `pricing-range-model.md` pins every number, and enforces that a price question is answered in the turn it is asked, in the currency on screen, with no conversion and no discount.
- `fit-and-walkaway-rubric.md` is the honest-recommendation gate before any paid suggestion.
- `voice-lint.md` is the blocking lint after generation.

A single turn flows: enrich (L3) → reflect → reason (L2 exemplars) → gate (rubric) → price (pricing model) → de-poison check (CANON) → draft → lint (voice-lint) → one of three exits.

## How the proposal generator consumes the pack

The generator builds the existing 11-section *Mindmaker x [Client]* one-pager, ~60% deterministic template, ~40% grounded low-temperature prose:

1. **Shell, logo, colours, date** from the Layer 3 dossier (Brandfetch). Deterministic, paints first.
2. **What I heard / The engagement** prose from the decision brief, grounded in the dossier, written in voice.
3. **Proof / same play run elsewhere**, `proof-bank.md`, three entries selected by (`mode`/offer, `icp`, nearest `industry`), Exa-matched. Selection only, no generation, no named client.
4. **The hours and the price**, from `pricing-range-model.md`. The published figure for the recommended rung, in the currency the visitor asked in. Never invented, never converted, never discounted.
5. **The ladder / Phase 2 / next steps**, deterministic templates; ladder-note and headline are the only LLM slots.
6. **Voice lint** runs as the blocking pre-render gate (`voice-lint.md` §4): automated array pass, then craft checklist, then commercial-truth checklist (no exact price, anonymised proof, no FOMO, offer names match canon). Any em dash or banned token blocks the render and retries once.
7. **Render and export.** Deterministic shell first, prose streams in, PDF async on Download.

---

## CONSISTENCY + OPEN QUESTIONS (resolve before go-live)

The six authors flagged the following. Items 1–2 are real internal contradictions in the live surfaces. Items 3–8 are gaps or confirmations Krish owns from the architecture brief §8. None should be silently resolved by Mindy.

### A. The contradiction the authors most want resolved

**1. The framework-name tension, RESOLVED 2026-06-09, then MOOTED 2026-08-11.** The tension was between a cross-offer brand framework and a curriculum framework belonging to an offer that no longer exists.
- **"Mind Set → Mind Map → Mind Make"** remains the cross-offer brand framework. `FrameworkJourney.tsx` now renders on `/new-age-leadership` rather than the homepage.
- **"Diagnose → Decompose → Decide → Deploy"** belonged to the retired cohort curriculum. There is nothing left for it to describe, so Mindy does not use it.
- The named frameworks she does reach for are the five-brick chain, the Leverage Audit, redeploy-not-replace and find-the-brick.

### B. Pricing and offer reconciliations

**2. Number reconciliations. RESOLVED 2026-08-11.**
   - The cross-offer credit went with the ladder that needed it. There is no published discount, credit or urgency offer of any kind, and Mindy does not have one to give.
   - CTRL pricing is no longer quoted anywhere on this site. It is a separate product on its own site.

**3. Prices are published, not ranges. RESOLVED 2026-08-11 (DECISIONS_LOG).** The ranges-only policy is retired along with the ladder that needed it. Both figures are on the website in three currencies and Mindy quotes them exactly. Canonical source: `src/lib/offers.ts`.

**4. Bespoke enablement is retired.** It was a Mode B with its own scoping engine. There is no bespoke rung, no scoping math, and no third mode. Two engagements, both fixed-scope, both published.


### C. Proof and anonymisation

**5. Historical proof question, superseded.** The retired private money disclosure has been removed and may not be surfaced. This Mindy pack belongs to a retired public flow and does not override the current Mindmake proof source or consent rules.

### D. Mechanism and posture confirmations (brief §8)

**6. Live-call booking mechanism (§8.1).** Which single Calendly event and duration replaces the dual-intake mess, and the behaviour when slots run dry. The pack assumes one Calendly handoff carrying the diagnosis via `notify-scoping-request`; confirm the event and the dry-slot fallback.

**7. Email capture posture (§8.2).** The pack assumes work email stays optional, framed as a gift, with a graceful degraded path (one human question, no co-brand gasp) for personal-Gmail/no-email visitors. Confirm.

**8. CTRL routing and the self-serve line. RESOLVED 2026-08-11.** CTRL-curious visitors route straight to the live product and Mindy quotes no CTRL price. The self-serve line is now the rung itself rather than a figure: the Teardown can be bought without a call, the Handover never can.

**9. EU/consent posture (§8.8), flagged as a launch blocker.** Person-level enrichment (PDL resolving a role from a work email) on EU visitors needs more than a UX "let me read up" gesture, especially given the prior CTRL cross-tenant PII incident. Decide on a real consent affordance and a no-person-level-storage-beyond-session rule before this touches live traffic. This pack governs Mindy's *words*, not the enrichment plumbing, so this one sits outside the pack and must be resolved separately.

### E. Smaller cross-file notes

- **Filename reference drift.** `reasoning-fewshots.md` points to `case-bank.md` and `walkaway-rubric.md`; the shipped filenames are `proof-bank.md` and `fit-and-walkaway-rubric.md`. Cosmetic, but fix the in-file references so retrieval citations resolve.
- **`reasoning-fewshots.md` is RAG, the system prompt calls it "Layer 2."** Confirmed consistent with the brief; flagged only so no one re-classifies it as a pinned Layer 1 asset and bloats the prompt.
- **Voice-lint vs numeric ranges.** The em-dash/en-dash ban allows the en dash inside a genuine numeric range. The published fees are single figures rather than ranges, so the pricing card no longer needs the exemption, but proof entries still carry client-side ranges and do.

---

*Phase 0 of the build (reconcile and de-poison) is what this pack delivers. Items 1, 3 and 6 are now resolved. The confirmed booking event is `calendly.com/krish-raja/mindmaker-meeting`. Outstanding items: 2 (CTRL pricing label confirmation and OFFERS.md addition), 4 (bespoke enablement lane confirmation), 5 (proof anonymisation approval), 7 (email-capture posture confirmation), 8 (CTRL routing and self-serve ceiling confirmation), 9 (EU consent posture, flagged as a launch blocker).*
