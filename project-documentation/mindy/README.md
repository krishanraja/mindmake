# Mindy Brain Pack

*The knowledge pack that makes Mindy reason like Krish, recommend honestly, price in ranges, and sound like the operator and not the model. Built 2026-06-09 against `MINDY-ONE-JOURNEY-ARCHITECTURE.md` (the Diagnosis Room brief); last reconciled 2026-07-26. This README is the index and the wiring diagram. It also carries the consistency and open-questions list; items resolved are marked with the date/source of resolution.*

---

## What this pack is

Mindy is the on-site guide for the Mindmaker Diagnosis Room: one door, one nervous AI decision, three honest exits (learn by chat, book a free 15-min call, download a co-branded proposal). The architecture brief rated readiness 6/10 and named the two missing assets that gate the headline experience: *real Krish reasoning* and *an honest down-sell rubric*. This pack fills those plus the surrounding guardrails, organised into the three-layer knowledge architecture from brief §6.

---

## The files, and the layer each one serves

| File | Layer | What it is | How Mindy uses it |
|---|---|---|---|
| `mindy-system-prompt.md` | **Layer 1 — system prompt** | The deployable master prompt (~1.5–2k tokens, delimited block). Persona, standing orders, the reflect-then-reason-then-recommend spine, compressed rubric, the gate, two-mode pricing, proof rule, voice, three exits, hard limits. | Loaded verbatim as the system prompt. Hand-curated, never RAG. Points to the other five files rather than inlining them. |
| `reasoning-fewshots.md` | **Layer 2 — retrieval** | Five reasoning exemplars (`[Pattern]` / `[Documented]`) plus the reusable frameworks: five-brick chain, Leverage Audit, redeploy-not-replace, find-the-brick. | Her diagnosis engine. Retrieved to shape *how* she decomposes a decision in scene 4. Patterns, not scripts; never read aloud. |
| `fit-and-walkaway-rubric.md` | **Layer 2 — retrieval / cross-cutting guardrail** | The decision table (signals → mode + rung → range → call vs self-serve), the three walk-away moments, the start-cheap mechanic, the hand-to-Krish triggers, and Krish's real objection lines. | The honest-recommendation gate that fires before any paid suggestion. The file that stops her sounding like a sales bot. |
| `pricing-range-model.md` | **Layer 1 pin + cross-cutting guardrail** | The two-mode router, the bespoke scoping math (hours × rate, ±25%, floors, value cross-check), the public range card, the four hard rules, three worked examples. | Pinned pricing logic. The proposal generator executes the engine; Mindy reads the range card. Numbers come from here, never from retrieval or the model. |
| `proof-bank.md` | **Layer 2 — retrieval (selection only)** | 9 anonymised real engagements (R-01–R-09, verified numbers) + 26 illustrative per-offer entries (B-01–B-26), keyed by `mode` / `icp` / `industry`. | Selected, never generated. The proposal's Proof section pulls three entries keyed to (offer, ICP, nearest industry), Exa-matched. Role-only, numbers OK, never a named client. |
| `CANON.md` | **Cross-cutting guardrail (de-poison)** | Precedence order, canonical current facts, settled corrections, the do-not-index blocklist, and the one live tension (cohort framework name). | The de-poison file. When retrieval disagrees with canon, canon wins within its precedence order. Stops retired facts (old prices, durations, framework names) leaking into client-facing output. |
| `voice-lint.md` | **Cross-cutting guardrail (output gate)** | Machine-readable lint arrays (banned tokens/phrases/patterns, use-vocabulary) plus the craft layer (Krish's tells, before/after rewrites, pre-render checklist). | Runs as a post-generation pass on every Mindy output and every proposal. Hard fail on any banned token, em dash, or buzzword: block and regenerate. As of 2026-07-21, the same gate also runs on a third surface outside the Diagnosis Room: `personalize-intake`'s microcopy for the pre-session intake form. |

---

## How they wire together

**Layer 1 (system prompt)** is the spine. It encodes *when* to reach for each rule and defers the detail to the companion files, so the prompt stays small and the facts stay versioned in one place.

**Layer 2 (retrieval)** is the RAG body: the reasoning exemplars, the fit rubric, the proof bank, and the cleaned grounding KB (`SALES_PLAYBOOK`, `VALUE_PROP`, `OFFERS`, the ICP docs, `OUTCOMES`). Every chunk tagged with offer + ICP + last-updated. The do-not-index blocklist in `CANON.md` §4 keeps the RAG-poison files (`mindmaker_rebuild_brief_v4`, `EXECUTIVE_SUMMARY`, the raw critical-thinking manual, the old deck) out of the store.

**Layer 3 (live enrichment)** is tools, not training: the dossier from brief §3 (Brandfetch for the co-brand gasp, Tranco + PDL for silent routing, Brandfetch context + BuiltWith for understanding, Perplexity / NewsAPI / Exa for currency). Not held in this pack; this pack governs what Mindy is allowed to *say* about what those tools return.

**Cross-cutting guardrails** sit over all three layers and run on every turn:
- `CANON.md` resolves fact conflicts before output (de-poison).
- `pricing-range-model.md` pins every number and enforces ranges-only and the ~$100k ceiling.
- `fit-and-walkaway-rubric.md` is the honest-recommendation gate before any paid suggestion.
- `voice-lint.md` is the blocking lint after generation.

A single turn flows: enrich (L3) → reflect → reason (L2 exemplars) → gate (rubric) → price (range model) → de-poison check (CANON) → draft → lint (voice-lint) → one of three exits.

## How the proposal generator consumes the pack

The generator builds the existing 11-section *Mindmaker x [Client]* one-pager, ~60% deterministic template, ~40% grounded low-temperature prose:

1. **Shell, logo, colours, date** from the Layer 3 dossier (Brandfetch). Deterministic, paints first.
2. **What I heard / The engagement** prose from the decision brief, grounded in the dossier, written in voice.
3. **Proof / same play run elsewhere** — `proof-bank.md`, three entries selected by (`mode`/offer, `icp`, nearest `industry`), Exa-matched. Selection only, no generation, no named client.
4. **The hours and the price** — `pricing-range-model.md`. The engine returns a pilot band, a full band, and a "scoped together" Phase 2. Ranges only; numbers computed in code, never by the model.
5. **The ladder / Phase 2 / next steps** — deterministic templates; ladder-note and headline are the only LLM slots.
6. **Voice lint** runs as the blocking pre-render gate (`voice-lint.md` §4): automated array pass, then craft checklist, then commercial-truth checklist (no exact price, anonymised proof, no FOMO, offer names match canon). Any em dash or banned token blocks the render and retries once.
7. **Render and export.** Deterministic shell first, prose streams in, PDF async on Download.

---

## CONSISTENCY + OPEN QUESTIONS (resolve before go-live)

The six authors flagged the following. Items 1–2 are real internal contradictions in the live surfaces. Items 3–8 are gaps or confirmations Krish owns from the architecture brief §8. None should be silently resolved by Mindy.

### A. The contradiction the authors most want resolved

**1. The cohort framework-name tension — RESOLVED 2026-06-09 (CANON.md §5, DECISIONS_LOG).** Krish confirmed Option A: the two names are layered on purpose and coexist.
- **"Mind Set → Mind Map → Mind Make"** is the canonical cross-offer brand framework (rendered on the homepage by `FrameworkJourney.tsx`). Mindy uses this when describing the overall Mindmaker method.
- **"Diagnose → Decompose → Decide → Deploy"** is the cohort's week-by-week curriculum only. Mindy uses this when describing how the cohort is structured across four weeks.
- Mindy never conflates the two. CANON.md §5 records the resolution.

### B. Pricing and offer reconciliations

**2. Two number reconciliations the docs disagree on (brief §6 gap 4, §8.6).**
   - Workshop→Cohort credit is documented as both **"$500 / code WORKSHOP"** (four canonical docs) and "$499" (grounding brief). The pack uses **$500 / code WORKSHOP**. Confirm canonical.
   - CTRL's **$29 Diagnostic (one-time) / $9-mo Edge Pro (recurring)** is real but absent from `OFFERS.md`. Confirm the labels and ordering are exactly right in Mindy's mouth (do not invert), and approve adding them to `OFFERS.md`.

**3. Exact prices vs ranges — CONFIRMED 2026-06-09 (DECISIONS_LOG).** The range card is the only client-facing pricing. Exact figures ($599, $2,500, $15,000, $60,000–$100,000, $12,000) are retained in docs as internal reasoning aids; Mindy never emits them to a visitor. Revenue Architecture public floor is $50,000 (not $60,000); the $60,000 figure is the internal floor and is never shown publicly.

**4. "Bespoke enablement" is a new ladder entry not in the brief's offer map.** The brief's decision-type→offer table has no bespoke row; bespoke buyers (DoThinkDo / coaching-practice / TMT-advisory class) were folded into the productised rungs. This pack adds **Bespoke enablement ($8,000–$25,000, pilots from $2,000)** as a distinct Mode B with its own scoping engine. Confirm this is the intended model and that it sits on the public range card. Also confirm the non-canonical 8-week / six-stream sprint in the proposal mockup is retired or formally re-priced as bespoke (brief §6 gap 6, §8 — still flagged unresolved).

### C. Proof and anonymisation

**5. How anonymised the proof can be (brief §8.4, gap 5).** This pack ships nine anonymised *real* engagements (R-01–R-09) with verified numbers, reduced to sector + role. That is more than the brief's fallback ("four founder credentials + fictional bank only"). **Confirm Mindy may surface these real-but-anonymised outcomes** (e.g. "$254K POC at a data-infrastructure company"), and confirm the role-only attributions are acceptable. If not, Mindy falls back to the founder credentials plus the illustrative B-bank only.

### D. Mechanism and posture confirmations (brief §8)

**6. Live-call booking mechanism (§8.1) — CONFIRMED.** The single Calendly handoff is `https://calendly.com/krish-raja/15-min-intro` (15-min intro), carrying the diagnosis via `notify-scoping-request`/the unified lead pipeline. This is live in code (`CALENDLY_URL` in the Diagnosis Room) and documented in the repo's root `CLAUDE.md`. Dry-slot fallback behavior is not separately implemented; Calendly's own booking UI handles availability.

**7. Email capture posture (§8.2).** The pack assumes work email stays optional, framed as a gift, with a graceful degraded path (one human question, no co-brand gasp) for personal-Gmail/no-email visitors. Confirm.

**8. CTRL routing and the self-checkout ceiling (§8.5, §8.6) — CONFIRMED.** `_shared/mindy/knowledge.ts` pins both: CTRL-curious users route Free → $29 one-time Diagnostic → $9/mo Edge Pro, self-serve, no call, never inverted; and nothing above ~$12k runs to self-checkout — above that line the path is always the free call. Both are live in the deployed system prompt, not open questions.

**9. EU/consent posture (§8.8) — flagged as a launch blocker.** Person-level enrichment (PDL resolving a role from a work email) on EU visitors needs more than a UX "let me read up" gesture, especially given the prior CTRL cross-tenant PII incident. Decide on a real consent affordance and a no-person-level-storage-beyond-session rule before this touches live traffic. This pack governs Mindy's *words*, not the enrichment plumbing, so this one sits outside the pack and must be resolved separately.

### E. Smaller cross-file notes

- **Filename reference drift.** `reasoning-fewshots.md` points to `case-bank.md` and `walkaway-rubric.md`; the shipped filenames are `proof-bank.md` and `fit-and-walkaway-rubric.md`. Cosmetic, but fix the in-file references so retrieval citations resolve.
- **`reasoning-fewshots.md` is RAG, the system prompt calls it "Layer 2."** Confirmed consistent with the brief; flagged only so no one re-classifies it as a pinned Layer 1 asset and bloats the prompt.
- **Voice-lint vs numeric ranges.** The em-dash/en-dash ban explicitly allows the en dash inside numeric ranges (e.g. $2,000–$3,000). Ensure the linter's `en_dash_as_dash` rule whitelists the range-card strings so the public pricing does not hard-fail its own gate.

---

*Phase 0 of the build (reconcile and de-poison) is what this pack delivers. Items 1, 3, 6, and 8 are now resolved and live in code. Outstanding items: 2 (CTRL pricing label confirmation and OFFERS.md addition), 4 (bespoke enablement lane confirmation), 5 (proof anonymisation approval), 7 (email-capture posture confirmation), 9 (EU consent posture — flagged as a launch blocker).*
