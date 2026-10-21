# Mindmake website

**Promote your AI from intern to chief of staff.**

Live: [mindmake.co](https://mindmake.co). Mindmake is a small AI and
commercial strategy practice run by Krish Raja. It builds a leader their own AI
brain: a working system that holds their taste, standards, judgement and
memory. Build your AI brain: **Unlock and create the idea you've been sitting
on.** Build your AI revenue engine: **The pricing, positioning and org
structure you'll need.** Both lead to one paid proof, privately scoped and
priced; the only public length is the 30-day shape on the two door pages.

The way in is **Get your free AI brief** (`/?start=1`). For readers not ready
yet, the publication is **Make Your Mind Up** at
[makeyourmindup.ai](https://makeyourmindup.ai). CTRL, the product the work runs
on, is a separate project in a private pilot with leaders.

## Read first

The whole business in two minutes is "Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md). Then read
[NOW.md](NOW.md) and the [documentation index](project-documentation/README.md).
[06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md) alone owns live
identities and verification status. Superseded narratives live in the single
[history ledger](project-documentation/history/LOG.md), not current guides.

The owner-approved R3 design/copy is locked. Do not reinterpret general rules to
remove accepted labels, chapters or scroll builds. Preserve the immutable source
and use its deterministic production adapter.

## Public routes

| Route | Purpose |
|---|---|
| / | Approved R3 opening, four history eras, the reach and practice chapters, the AI Brain stories (fifteen, chosen by situation), the returned hour and two doors |
| /ai-brain | Approved judgement-and-memory instrument |
| /ai-gtm | Approved market-change instrument |
| /new-age-leadership | Approved people/AI companion narrative |
| /case-studies | Success stories: eight verified client stories |
| /blog | Ideas you can use: every quick tip and longer read, newest first, filtered by kind and subject |
| /blog/:slug | A longer read |
| /answers/:slug | A quick tip, one page per question; /answers itself redirects to /blog |
| /faq | Questions we get asked |
| /about | About us: who runs the practice and why |
| /contact | General contact |
| /privacy and /terms | Website policies |
| /alumni | Unlisted, noindex surface |

Retired routes keep the compatibility redirects declared in vercel.json and
src/App.tsx. Do not use redirecting aliases as canonical or sitemap URLs.

## Conversion

Homepage and both doors open the same LeadBrief: company email, person/role,
company read, problem, returned time, brief, explicit keep action and verification.
Results remain visible and downloadable; the operator receives a private digest.
Publication interest is separate and unticked. Payload, delivery, privacy and
failure guarantees belong to [05_LEAD_DELIVERY_SPEC.md](project-documentation/05_LEAD_DELIVERY_SPEC.md).

## Source owners

- src/App.tsx: routes. src/pages/: routed pages, including locked adapters.
- src/components/homepage-release/: generated R3 adapter and native pin controller;
  scripts/qa/build-homepage-release.mjs owns generated output.
- src/components/mindmake/: shared conversion, instruments and retained primitives.
- src/styles/: production styles. Do not modify global rules to fix one component.
- src/assets/films/: approved assets; page imports determine what is live.
- src/data/testimonials.ts and rebuildProof.ts: consented quotation/proof sources.
- src/content/answers/: the quick tips, one markdown file per page.
  src/lib/ideaFormat.ts merges them with src/data/blogPosts.ts into the one
  list /blog shows and llms.txt repeats. scripts/generate-answers-feed.mjs
  writes /answers/feed.xml and scripts/generate-llms.mjs writes llms-full.txt
  beside llms.txt. The weekly brief (.github/workflows/answers-weekly.yml)
  reads project-documentation/answer-backlog.json; cadence and quality bar are
  in 01_CANON.md, "The answer pages".
- scripts/lib/pages.mjs: indexed-page metadata; prerender/sitemap/llms/social
  generators and discoverability tests keep crawler surfaces consistent.
- supabase/functions/: site backend; do not alter unrelated CTRL functions.

## Development and verification

Node 22.x, at least 22.18. Use npm ci, not a lockfile-changing install.

~~~sh
npm ci
npm run dev
npm test
npm run lint
npm run build
~~~

Build includes source/adapter gates, application typecheck, static render,
sitemap and crawler text. Keep private environment values out of git.
Use the exact built candidate for browser checks; a dev page is not release proof.
[CLAUDE.md](CLAUDE.md) lists execution guards and the
[release runbook](project-documentation/07_DEPLOY_RUNBOOK.md) owns release order.
A merge to main auto-publishes. Require exact-head tests and authority first.
