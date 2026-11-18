# Parts research handoff v2 (18 November 2026)

Branch `codex/kits-page` on krishanraja/mindmake (draft PR 306). Written by the
local Claude session that ran the pilot, for the cloud session taking over. No
new work and no live runs were made while writing this. Read together with
[parts-research-next-steps.md](parts-research-next-steps.md),
[parts-research.md](parts-research.md) and
[research-pack-contract.md](research-pack-contract.md).

## 1. "2026-11-18 Parts research plan of attack v1.md"

Not found. I could not include it word for word because I cannot find it. I
searched every branch of krishanraja/mindmake and krishanraja/mindmake-kits,
the local working folders and scratch folders, Google Drive (title search) and
the transcripts of every Claude Code session on this machine, including
archived ones. This session never wrote a file by that name. If it exists, it
was written elsewhere; its author should add it next to this file.

The nearest written plan is [parts-research-next-steps.md](parts-research-next-steps.md)
(committed `f2bcfbed`). Its steps stand as follows.

## 2. Where each step of the written plan stands

| Step (from parts-research-next-steps.md) | State |
|---|---|
| 1. Recorder: save every fetched response and model reply per test company to a local fixture folder | Not started |
| 2. Acceptance checks from the answer keys | Not started. The test drafts, answer keys and evidence are now in the repository (`quality/parts/pilot-tests/`), so the checks can be written from them. |
| 3. Iterate offline until all companies pass, then one live run each | Not started |

## 3. The four known problems

| Problem | State | Commit and proof |
|---|---|---|
| One bad fact sinks the whole pack (`validatePack` throws "figure value must come from quote" and the Auto Trader build fails) | Open | No fix committed. Seen live on 18 November (Auto Trader, three runs and one traced run). No test covers it yet. |
| Duolingo's net income match and the Max withdrawal announcement went backwards | Open | Passed in run r17 (`quality/parts/pilot-tests/packs/duolingo-pack-r17.json`); lost in r22 (`duolingo-pack-r22.json`) after relevance ranking, when the fact cap dropped 24 facts. No fix committed. |
| Monzo keeps only 6 facts | Partly fixed | `127f7605`: scanned Companies House PDFs are detected and the company's own annual report is read instead. Test: "r21 scanned CH PDF is excluded and own annual report recovers primary facts with matching-period filing date". Live r22 still kept only 6 facts and missed the planted deposits error, so the outcome is still open. |
| UK identity is flaky | Fixed, as far as live runs show | `127f7605` (DNS limits, purchase-mode website probe retry, Companies House binding by the number on the company's own site) and `7536bb24` (identity budgets). Tests: "r20 DNS retains independent deadlines, IPv6 grace and per-host cache"; "registry search uses Basic auth and binds a UK company number from the website"; "purchase website retry preserves successful check and logs both probe outcomes"; "r17 identity reads large homepage prefixes and normalises UK company names". Live: Auto Trader and Monzo verified on the first try in every run from r19 to r22, Companies House bound from r20. |

A fifth problem, contract drift (`periodSource`, then `significance`, made the
part reject the whole pack), is fixed on the builder side in `127f7605`. Test:
"r21 contract keys match docs and reject significance, periodSource and
arbitrary extra keys".

## 4. The record-and-replay test bench

It does not exist yet. There is no bench code and there are no recorded runs.
What exists today:

- Offline unit tests with hand-made fixtures:
  `deno run --cached-only --no-remote --node-modules-dir=none --allow-read --allow-write=quality/parts/research-test-output scripts/parts/research-offline-tests.ts`
- The test inputs: `quality/parts/pilot-tests/inputs/` (drafts, answer keys,
  evidence for duolingo, auto-trader, monzo) and earlier live packs in
  `quality/parts/pilot-tests/packs/`.
- A scoring helper that runs the real part on a draft and a pack:
  `node quality/parts/pilot-tests/tools/score.mjs <kits-src path> <draft.md> <evidence dir> <pack.json> <output dir>`
  (the part is in the private repository krishanraja/mindmake-kits,
  `kits/fact-check-board-update/`).

Which companies pass, from the last live run of each (scored by hand against
the answer keys; no automated replay exists):

| Company | Last run | Wrong figure caught | Left-out item flagged | Internal claim left alone | Accurate figures not flagged |
|---|---|---|---|---|---|
| Duolingo | r22 | Yes | No (Max withdrawal missing) | Yes | Yes, but net income no longer matched |
| Duolingo | r17 | Yes | Yes | Yes | Yes (full pass) |
| Auto Trader | r21 | No (forecourts) | Yes ("AI-native platform") | Yes | Yes; group revenue and EPS not matched |
| Auto Trader | r22 | Build failed (problem 1) | | | |
| Monzo | r22 | No (deposits) | No (Spain launch) | Yes | Yes |
| Mindmake | r20 | No draft; correctly reports little is published | | | |

## 5. Every live run since 17 November

All runs were made on 17 and 18 November 2026 from Krish's laptop. Saved runs
(times are when the pack was written, UTC; services from each run's evidence
receipt):

| Time (UTC) | Company | Pack | Paid services called |
|---|---|---|---|
| 17 Nov 19:52 | Duolingo | duolingo-pack, duolingo-pack2 | No receipt recorded (identity only; SEC EDGAR, free) |
| 17 Nov 20:16 | Duolingo | duolingo-pack3 | Exa, Perplexity, NewsAPI |
| 17 Nov 20:30 | Duolingo | duolingo-pack5 | Exa, Perplexity, NewsAPI |
| 17 Nov 20:33 | Duolingo | duolingo-pack6 | Exa, Perplexity, NewsAPI |
| 17 Nov 20:56 | Duolingo | duolingo-pack7 | Exa, Perplexity, NewsAPI, Anthropic x4 (all rejected, old key), Gemini x4 |
| 17 Nov 21:05 | Duolingo | duolingo-pack8 | Exa, Perplexity, NewsAPI, Anthropic x4 (rejected), Gemini x4 |
| 17 Nov 21:19 | Duolingo | duolingo-pack9 | Exa, Perplexity, NewsAPI, Anthropic x4 (rejected), Gemini x4 |
| 17 Nov 21:32 | Duolingo | duolingo-pack10 | Exa, Perplexity, NewsAPI, Anthropic x4 (rejected), Gemini x4 |
| 17 Nov 21:42 | Duolingo | duolingo-pack11 | Exa, Perplexity, NewsAPI, Anthropic x4 (rejected), Gemini x4 |
| 17 Nov 21:44 | Duolingo | duolingo-pack12 | Exa, Perplexity, NewsAPI, Anthropic x4 |
| 17 Nov 21:47 | Duolingo | duolingo-pack13 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x1 |
| 17 Nov 21:56 | Duolingo | duolingo-pack14 | Exa, Perplexity, NewsAPI |
| 17 Nov 21:59 | Duolingo | r15 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x1 |
| 17 Nov 22:02 | Duolingo | r16 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x1 |
| 17 Nov 22:05 | Duolingo | r17 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x2 |
| 17 Nov 22:13 | Monzo | r17 | none (identity failed; Companies House and SEC EDGAR are free) |
| 17 Nov 22:16 | Mindmake | r17 | Exa, Perplexity, NewsAPI, Anthropic x5, Gemini x1 |
| 17 Nov 22:24 | Auto Trader | r18 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x2 |
| 17 Nov 22:30 | Monzo | r18 | none |
| 17 Nov 22:36 | Mindmake | r18 | none |
| 17 Nov 23:17 | Auto Trader | r19 | Exa, Perplexity, NewsAPI, Anthropic x4, Gemini x1 |
| 17 Nov 23:23 | Monzo | r19 | Exa, Perplexity, NewsAPI, Anthropic x2 |
| 17 Nov 23:30 | Mindmake | r19 | Exa, Perplexity, NewsAPI, Anthropic x6, Gemini x1 |
| 17 Nov 23:34 | Auto Trader | r20 | Exa, Perplexity, NewsAPI, Anthropic x6, Gemini x2 |
| 17 Nov 23:38 | Monzo | r20 | Exa, Perplexity, NewsAPI, Anthropic x2 |
| 17 Nov 23:42 | Mindmake | r20 | Exa, Perplexity, NewsAPI, Anthropic x6 |
| 18 Nov 00:00 | Auto Trader | r21 | Exa, Perplexity, NewsAPI, Anthropic x5, Gemini x3 |
| 18 Nov 00:01 | Monzo | r21 | Exa, Perplexity, NewsAPI, Anthropic x2, Gemini x1 |
| 18 Nov 00:22 | Monzo | r22 | Exa, Perplexity, NewsAPI, Anthropic x3 |
| 18 Nov 00:23 | Duolingo | r22 | Exa, Perplexity, NewsAPI, Anthropic x4 |

Not in that table, because each overwrote the same file or saved nothing:

- From r17 on, the scoring script retried up to three times when a run kept no
  facts, so Monzo r18 to r21 and Mindmake r18 to r20 each ran up to three times.
- Auto Trader r22 failed three times, plus one traced run (problem 1).
- About fifteen debugging runs on 17 and 18 November that called pieces of the
  pipeline directly: identity, gather, extraction and question generation for
  Duolingo, and the Companies House search for Monzo. They called Exa,
  Perplexity, NewsAPI, Gemini and Anthropic.

Free services also called: SEC EDGAR, Companies House API and document API,
Investegate, and the companies' own websites.

Cost: not recorded. No run metered tokens or provider charges, and I know none
of the per-call prices. NewsAPI returned 426 (upgrade required) on the
developer plan until it was limited to 29 days. The providers' own dashboards
hold the real figures.

## 6. Prices per call, money limits or call limits from Krish

None given.

## 7. Krish's decision on "plugs into Claude in one click"

Not decided.

For context only: the line "Each part plugs into Claude in one click, runs on
your own files and shows you the result in five minutes." is in the /parts copy
on this branch. It went into the page brief on 17 November with the seven plain
names Krish answered "sure" to, but he made no separate ruling on that phrase.
On 17 November he also asked how a phone buyer pays and receives the part; the
part needs Claude Desktop on a computer, and that is not resolved.

## 8. Tests and build at handoff (18 November 2026, this commit's tree)

| Check | Result |
|---|---|
| Offline research tests (`scripts/parts/research-offline-tests.ts`, command above) | 92 cases, 0 failures |
| `npm run test:parts` | 17 commerce cases, 0 failures; 5 UI cases, 0 failures |
| Site build (`npm run build`) | Passed (exit 0); `public/llms.txt` and `public/sitemap.xml` restored afterwards as the runbook requires |
| Part tests in krishanraja/mindmake-kits (`npm test`) | 146 tests, 146 passed, 0 failed |

No failures to quote.

## 9. Where I stopped, the next step, and what could break

Stopped after live run r22 on 18 November. All work is committed: this branch
for the research engine and page, and main of krishanraja/mindmake-kits for the
part (`b2271e9`; those part commits went to that private repository's main
before the rule against pushing to main was given).

The one next step: build the recorder and replay transport (step 1 above), then
fix problem 1 on it.

What would break if someone picked this up halfway:

- **Deno and node_modules.** Running Deno in this folder with
  `--node-modules-dir=auto` re-links `node_modules` and breaks Vitest (it
  upgrades vitest past the locked 4.1.2). Always use `--node-modules-dir=none`;
  if `node_modules/vitest` is not 4.1.2, run `npm ci`.
- **Two repositories.** The research builder is here; the part that reads the
  pack is in the private repository. A contract change must land in both, and
  both validators must agree, or the part silently falls back to the general
  version.
- **The PDF reader.** `npm:unpdf@0.12.1` must be in Deno's cache
  (`deno cache npm:unpdf@0.12.1`, approved by Krish on 17 November); without
  it, PDF sources are skipped and recorded as unavailable.
- **Keys** are environment variables only: `ANTHROPIC_API_KEY`,
  `GOOGLE_AI_API_KEY`, `PERPLEXITY_API_KEY`, `EXA_API_KEY`, `NEWSAPI_API_KEY`,
  `COMPANIES_HOUSE_API_KEY` (a Live-environment key; a Test key works only on
  the sandbox), and `SEC_CONTACT_EMAIL`. Claude 5 models reject `temperature`.
- **Repeated live runs get throttled.** After dozens of runs, the SEC and
  Duolingo's site timed out. Pause between runs; the bench avoids this.
- **The local Codex threads** used for edits live on Krish's laptop and cannot
  be continued from the cloud.
- **This repository is public.** No keys, personal paths or buyer data in
  commits.
