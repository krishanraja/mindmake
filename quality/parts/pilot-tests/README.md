# Parts research pilot: test inputs

These are TEST fixtures for "Fact-check my board update". Each draft in
`inputs/` was written by Mindmake from public sources, not by the company, and
contains three deliberate problems: one wrong figure, one left-out
announcement and one internal claim with no public source. The answer keys
say which. The evidence notes are fictional. Do not read any figure here as a
statement about the company.

- `inputs/<slug>-draft.md`, `<slug>-answer-key.md`, `<slug>-evidence/` for
  duolingo, auto-trader and monzo.
- `packs/`: research packs from live runs, kept for comparison.
  `duolingo-pack-r17.json` is the run that passed every planted test.
  `auto-trader-pack-r21.json` has the off-contract `significance` field
  removed so the part can read it.
- `tools/score.mjs`: runs the real part on a draft with a pack:
  `node quality/parts/pilot-tests/tools/score.mjs <kits-src path> <draft.md> <evidence dir> <pack.json> <output dir>`.

The full evidence receipts (`.evidence.json`) are not here: they hold the full
text of fetched third-party pages.
