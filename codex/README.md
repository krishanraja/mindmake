# Codex cards for mindmake

Claude art-directs and checks; Codex builds (Ruling, Krish, 2026-11-01). A card
is `codex/queue/<id>.md` on `main` or a `claude/` branch; the lane on Krish's
home computer (content-engine `scripts/velib/codex_lane.py`) builds it in a
worktree and pushes `codex/<id>` with `codex/results/<id>.json`.

**Since 2026-11-28** mindmake is a lane venture in content-engine's
`config/codex-lanes.json` (engine growth-mindmake), so a card queued here on
`main` or a `claude/` branch is built by the home-computer pass. The two cards
written before the lane existed were built by the Claude session that wrote
them and sit in `codex/built/`, outside the queue, so the lane never builds
them again.

Each card names its inputs, the words, the tokens, the gates it must pass
(CLAUDE.md, "Verification") and the screenshots that prove it.
