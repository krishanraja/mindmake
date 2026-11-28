# Codex cards for mindmake

Claude art-directs and checks; Codex builds (Ruling, Krish, 2026-11-01). A card
is `codex/queue/<id>.md` on `main` or a `claude/` branch; the lane on Krish's
home computer (content-engine `scripts/velib/codex_lane.py`) builds it in a
worktree and pushes `codex/<id>` with `codex/results/<id>.json`.

**State on 2026-11-28:** mindmake is not yet listed in content-engine's
`config/codex-lanes.json`, so the lane does not pick these cards up. Until it
is, the Claude session that queues a card builds it itself and records that
on the card. Adding mindmake to that file (repo `krishanraja/mindmake`) is a
one-line change in content-engine.

Each card names its inputs, the words, the tokens, the gates it must pass
(CLAUDE.md, "Verification") and the screenshots that prove it.
