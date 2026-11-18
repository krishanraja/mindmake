# Parts research: next steps (pick up in a new session)

Written 18 November 2026, after the r22 live runs. Start here. The engine and
its contract are described in [parts-research.md](parts-research.md) and
[research-pack-contract.md](research-pack-contract.md).

## Why this exists

Ruling (Krish, 17 November 2026): each $59 part of a leader's AI brain is built
for the buyer, from their verified company, their role and a chosen use case,
and filled once at purchase with fresh, evidence-backed research. After
purchase the part runs on the buyer's computer and never calls Mindmake. The
pilot is one part, "Fact-check my board update".

The research must fail closed. Every fact is quoted word for word from text the
build fetched itself, with its source and date. If the company cannot be
verified, the buyer gets the general version. Nothing here is published, merged
to the site's main branch or connected to checkout.

## Where things stand

| Area | State |
|---|---|
| US listed (Duolingo) | Verified by website, work email and SEC filing. Run r17 passed every planted test. Run r22 regressed: the net income match and the Max withdrawal announcement were lost after relevance ranking. |
| UK listed (Auto Trader) | Bound to Companies House by the number on its own investor site. London Stock Exchange announcements read via Investegate. The r22 build crashes: one fact fails `validatePack` ("figure value must come from quote") and the whole pack is rejected. |
| UK private (Monzo) | Bound to Companies House. Its filed accounts PDF is a scanned image with no text, so the build reads Monzo's own annual report instead. Only 6 facts kept; the planted deposits error is missed. |
| Small private (Mindmake) | Correctly reports that little has been published. No padding from marketing copy. |

The part that reads the research lives in the private parts repository
(`kits/fact-check-board-update/`: `research.mjs`, `measures.mjs`, `run.mjs`).

## The next piece of work: a replayable test bench

Live runs vary from run to run (search results, model wording, timeouts), so
fixes have kept breaking other cases and regressions were caught by hand. Build
the bench before any more engine fixes.

1. **Recorder.** Run the live build once per test company and save every
   fetched response (URL, status, relevant headers, body) and every model
   reply to a local fixture folder outside git, because it holds third-party
   text. A replay transport serves those bytes so the whole build runs offline
   and gives the same result every time.
2. **Acceptance checks from the answer keys.** For each company with a test
   draft:
   - the planted wrong figure appears as a public-record conflict, ranked first;
   - the left-out announcement appears under "In the public record, not in
     your update";
   - the unsourced internal claim shows "Not in the public record";
   - no accurate figure in the draft is flagged as a conflict.
3. **Iterate offline** on the engine and the part until all companies pass,
   then confirm with one fresh live run per company.

The test drafts, answer keys and evidence folders are kept outside the
repository in the operator's scratch folder `growth-2026-11-16/pack-tests`
(`<slug>-draft.md`, `<slug>-answer-key.md`, `<slug>-evidence/` for duolingo,
auto-trader and monzo; mindmake has no draft).

## Known open issues to fix on the bench

1. `validatePack` must drop a single bad fact with a recorded reason, never
   reject the whole pack.
2. Restore the Duolingo r17 results after relevance ranking (fact-cap dropped
   24 facts, including net income and the Max announcement).
3. Monzo: extract more from its own annual report so "Deposits increased by
   55% to £25.7bn" becomes a fact.
4. Contract drift has broken the part twice (`periodSource`, then
   `significance`). The builder must reject any key outside the contract, and
   both repositories should test against one shared list of allowed keys.

## Rules learned the hard way

- Run Deno with `--node-modules-dir=none` (tests also `--cached-only`). The
  `auto` mode re-linked `node_modules` and broke Vitest; if Vitest is not the
  locked 4.1.2, run `npm ci`.
- Provider keys are read at runtime from the operator's local secrets file and
  never printed or committed. The SEC User-Agent contact comes from
  `SEC_CONTACT_EMAIL`.
- Claude 5 models reject `temperature`; `enrich/llm.ts` already omits it for
  them.
- DNS: a slow "no IPv6 address" answer once timed out every Companies House
  request; `liveDependencies` in `scripts/parts/research-run.ts` now limits
  each lookup. Keep that.
- No new npm packages without Krish's yes. Nothing published or merged to the
  site's main branch, and nothing wired into checkout, without Krish's yes on
  the rendered result.

## Done looks like

All test companies pass the replay acceptance checks, one live run per company
confirms it, both repositories are committed and pushed, and Krish gets a short
scorecard with the reports attached.
