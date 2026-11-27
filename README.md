# Mindmake website

**AI can copy almost anything except your taste.**

Live: [mindmake.co](https://mindmake.co). Mindmake is a small AI and
commercial strategy practice run by Krish Raja. It builds an AI brain for the
people who shape creative work, culture and sport, media first: a working
system that holds their taste, standards, judgement and memory, so the AI they
already use works the way they do. Since the repositioning approved on 25
November 2026 (PRs #337 to #343, live at `19c81d25`), the site speaks to the
people who make the calls first and the people who make the work second.
Music is outside v1.

Two doors. **Build your AI brain** (`/ai-brain`): *Put your taste and
judgement to work on your next call.* **Build your AI business** (`/ai-gtm`):
*Make, share and earn from your work with AI.* The offers are **AI Immersion**
and the **30-day Sprint**; the price is agreed privately and the only public
length is the 30-day shape. CTRL is the toolkit we use with clients inside the
Sprint, with no signup, waitlist or standalone use.

The way in is **Start building your AI brain** (`/?start=1`; **Start building
your AI business** on `/ai-gtm`), a free, private brief. For readers not ready
yet, the publication is **Make Your Mind Up** at
[makeyourmindup.ai](https://makeyourmindup.ai).

## Read first

The whole business in two minutes is "Mindmake in one page" in
[00_NORTH_STAR.md](project-documentation/00_NORTH_STAR.md). Then read
[NOW.md](NOW.md) and the [documentation index](project-documentation/README.md).
[06_CURRENT_STATE.md](project-documentation/06_CURRENT_STATE.md) alone owns live
identities and verification status. Superseded narratives live in the single
[history ledger](project-documentation/history/LOG.md), not current guides.

The owner-approved R3 opening and footer are locked. Since S6 (Krish, 24
October 2026) every page is three sections, the problem, how it works and what
the reader gets, and nothing on the homepage pins. Do not reinterpret general
rules to remove accepted labels, sections or scroll builds. Preserve the
immutable source and use its deterministic production adapter.

## Public routes

| Route | Purpose |
|---|---|
| / | The R3 opening (film, six-line headline, both doors, the way in), then "Every new technology asks us to change how we think." (four eras carousel), "We build yours with you in 30 days." (with "A rule worth keeping" and the six-wish chooser "What would you do more of?") and "What the work made possible." (three results, client voices, the way to explore and start); nothing pins |
| /ai-brain | Build your AI brain: "Teach your AI what experience taught you.", "The questions only you can answer.", the liquid Brain (North Star and five parts) under "Your AI brain knows how you think.", then the 30-day Sprint and the stories by wish |
| /ai-gtm | Build your AI business: "Make it, share it, and get paid for it.", production, distribution and monetisation, then one decision from brief to return in the 30-day Sprint |
| /new-age-leadership | The people and AI companion narrative, with its own pinned history, reach and practice chapters and the stories |
| /case-studies | What you can do with it: the eighteen use cases and twelve labelled illustrative examples, narrowed by wish, industry, role, result or search, then the client quotes |
| /2-minute-ai-upgrade-toolkit | Your 2-minute AI upgrade toolkit: the free judgement check and the brain modules |
| /blog | Ideas you can use: every quick tip and longer read, newest first, filtered by kind and subject; indexed but no longer in the menu |
| /blog/:slug | A longer read |
| /answers/:slug | A quick tip, one page per question; /answers itself redirects to /blog |
| /faq | Questions we get asked |
| /about | About us: who runs the practice and why |
| /contact | General contact |
| /privacy and /terms | Website policies |
| /alumni | Unlisted, noindex surface |
| /feedback/dtd | Unlisted, noindex DoThinkDo staff feedback form; `submit-dtd-feedback` emails each response to the operator |

The menu (`PRIMARY_ROUTES` in src/lib/publicLinks.ts) reads Home, Build your
AI brain, Build your AI business, What you can do, Your 2-minute AI upgrade
toolkit, Questions we get asked, About us and Media.

Retired routes keep the compatibility redirects declared in vercel.json and
src/App.tsx. Do not use redirecting aliases as canonical or sitemap URLs.

## Conversion

Every "Start building your AI brain", "Start building your AI business" and
"Start your brief" control opens the same LeadBrief: company email, person/role,
company read, problem, returned time, brief, explicit keep action and
verification, 8 clicks from the homepage hero to the code (26 October 2026).
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
