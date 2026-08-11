# \_archive

Page components for offers that no longer exist. Kept out of the build, not
deleted, so the copy and the layout decisions in them are recoverable without
git archaeology.

**Nothing here is reachable.** Every route that used to render these is now a
301 in `vercel.json`, with a client-side fallback in `src/App.tsx`. Excluded
from `tsconfig.app.json` and from eslint, so the compiler and the linter both
ignore them.

## What is here, and where its traffic went

| Archived | Was | Now 301s to |
|---|---|---|
| `Workshops.tsx` plus 6 in `workshops/` | The five $599 one-day workshops | `/teardown` |
| `Enterprise.tsx` | The Signal Session and the Revenue Architecture | `/handover` |
| `Immersion.tsx` | The AI Immersion, inquiry-only | `/handover` |
| `Cohort.tsx` | The AI-Fluent Executive, $2,000 to $3,000 | `/start` |
| `LeadershipInsights.tsx` | The Decision Readiness Diagnostic at `/leaders` | `/start` |

`Capital.tsx` was on this list and is not archived. It stays live, rewritten to
sell the current two engagements to funds buying for a portfolio company.

## Rules

**Do not import from here.** These files reference retired prices, retired
offer names and, in the workshop pages, a Maven checkout that no longer exists.
Importing one would put a dead SKU back on the site.

**Do not treat this as a rollback point.** The offers are retired commercially,
not just removed from the navigation. Bringing a page back means bringing back
the offer, which is a decision for Krish and belongs in `DECISIONS_LOG.md`
before it belongs in a diff.

The repo-wide checks for retired offer names deliberately exclude this
directory, which is the only reason these strings are allowed to survive here.

Archived 2026-08-11.
