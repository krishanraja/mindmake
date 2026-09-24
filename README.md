# Mindmake website

**Every AI you buy knows the market. Yours should also know you.**

Mindmake is a principal-led AI and commercial strategy practice. It helps a
leader use AI to extend their judgement, taste and expertise, then turn that
stronger capability into a better business result.

The site runs at [`mindmake.co`](https://mindmake.co) with two doors. What is
deployed there right now is recorded in
[`project-documentation/06_CURRENT_STATE.md`](project-documentation/06_CURRENT_STATE.md),
which is the only place that answers it.

- **Build your AI brain**: encode your taste and judgement, amplify your
  strengths, uncover your blind spots.
- **Build your AI GTM**: create an AI-native GTM model across product, price,
  positioning or people.

Either door can lead to the other. Work begins with one paid proof: the price
is private, the length is agreed with it, and neither appears on the site. There
is no public diary.

## Start here

If you are a person or a model picking this up cold, read
[`project-documentation/00_NORTH_STAR.md`](project-documentation/00_NORTH_STAR.md)
first. It is written to leave you able to make a decision on the business's
behalf. Then follow the reading order in
[`project-documentation/README.md`](project-documentation/README.md).

Where anything in this repository disagrees with the north star or the canon,
those two are right.

## One name

The business is **Mindmake**. The product is **CTRL**. The publication runs
exactly two channels, **The Money of AI** and **Built with AI**. Nothing else is
a name. The full rule is the naming law in the north star.

## Public journey

The only primary action is `Start here`.

1. The visitor starts with their work email, then gives their first name, last
   name and part of the business. The company is read from the email domain.
   The approved Company, You, Problem, Time and Brief stages use the same
   `LeadBrief` component from either door.
2. Mindmake shows a declarative company read and, when the read is strong enough,
   pressure choices tailored to that company. "Something else" reveals the locked
   list.
3. They choose where better use of their time would create value.
4. Mindmake shows the recommendation: what AI can carry, what stays with the
   leader, and what a first proof could test.
5. The visitor can keep the brief by verified work email, and receives the
   branded proposal on screen, by email and as a self-contained attachment. A
   private fit digest reaches the operator.
6. The visitor can always download the brief locally, whether or not either email
   succeeds.

A converting visitor receives exactly two emails after confirming: their results,
and one follow-up fourteen days later. Asking for the brief sends one six-digit
code before that, which the privacy page names. Publication interest is separate
and unticked. The
full contract is in
[`project-documentation/05_LEAD_DELIVERY_SPEC.md`](project-documentation/05_LEAD_DELIVERY_SPEC.md).

## Routes

| Route | Purpose |
|---|---|
| `/` | Approved R3 opening, historical stories, work and organisation, leadership dividend, AI Brain/AI GTM routes, and footer |
| `/ai-brain` | Locked judgement-and-memory instrument and the shared Start here journey |
| `/ai-gtm` | Locked market-change instrument across product, price, positioning and people, with the shared Start here journey |
| `/case-studies` | Eight verified customer stories |
| `/blog`, `/blog/:slug` | Checked public ideas archive |
| `/answers`, `/answers/:slug` | One page per buyer question, written to be quoted: the liftable answer first, then the argument |
| `/faq` | Practical answers about fit, work and what the client keeps |
| `/new-age-leadership` | Worked people-and-agent org chart example |
| `/contact` | General messages |
| `/privacy`, `/terms` | Current website policies |
| `/alumni` | Unlisted, noindex page for past clients |

Retired offer URLs remain as one-hop compatibility redirects. `/library`
redirects to `/blog`. `/signal` and `/builder-economy` redirect to the
publication.

## Code surfaces

- `src/App.tsx`: active routes and retired-route fallbacks.
- `src/pages/`: public page compositions.
- `src/components/homepage-release/`: deterministic delivery adapter for the
  immutable approved R3. `scripts/qa/build-homepage-release.mjs` owns its generated
  files; `pinnedChapters.ts` owns native reversible scroll progression. Do not
  replace this surface with a reconstruction from older components.
- `src/components/mindmake/`: the shell, the film plate, the marquee, the live
  board, the two journeys, the fork, the ask bar, the brief and the proposal.
- `src/hooks/useScrollDriver.ts` and `src/hooks/useReveal.ts`: retained primitives
  for their existing surfaces. The explicitly approved R3 adapter has its own
  isolated lifecycle and native pin controller, verified by rendered-state tests.
- `src/hooks/useAmbientMotion.ts`: decides whether a visitor is served moving
  footage at all.
- `src/styles/`: `mindmake.css` (tokens, base, chrome), `mindmake-instruments.css`
  (every rebuilt component), `mindmake-brief.css` (the brief dialog and proposal).
- `src/assets/films/aug2026/`: the six live films, each with both formats and a
  poster taken from its own first frame. Later review libraries live in sibling
  month folders and are not live until a page imports them.
- `src/data/rebuildProof.ts`: proof data. `src/content/answers.json`: the live
  public answers.
- `src/content/answers/*.md`: the `/answers` surface, one markdown file per
  question, read by `src/lib/answers.ts` for the site and by
  `scripts/lib/answers-loader.mjs` for the crawler surfaces. Separate from the
  blog archive in `src/data/blogPosts.ts` on purpose, and neither reads the
  other.
- `supabase/functions/`: the six functions the site owns.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`,
  `scripts/prerender.mjs`: crawler surfaces.

## Baseline rules and approved release precedence

These general rules predate the accepted R3 composition. Its exact labels,
typography and choreography are protected by the release source manifest and
must not be removed by interpreting a historical blanket rule as a redesign
instruction. See `AGENTS.md` and the current release record before changing it.

- No first person, no biography, no portrait. The founder is named once.
- No eyebrow text above any heading, anywhere.
- No em dashes. British English. No "judgment".
- No banned vocabulary, and no "not X, but Y" antithesis.
- Entrance choreography only through `src/hooks/useReveal.ts` (the ban was lifted
  on 29 August 2026), and the page is whole if the reveal never fires.
- Every viewport-height of every page holds at least one moving element, unless
  the visitor asked for reduced motion, in which case the whole ambient layer
  stops and the stills stand in.
- Attendee brands are never called customers, and proof families never mix.
- The contact address is declared once, in `src/lib/publicLinks.ts`, and it is the
  one that actually receives mail.
- Exactly two emails can ever be sent to one address after it is confirmed, plus
  the one verification code that confirms it.

## Development

Node 22.18 or later.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

Copy `.env.example` to a private local environment file when a browser check
needs the public Supabase URL and publishable key. Never commit environment
values. `scripts/qa/README.md` has the pattern.

`npm run build` creates the production bundle, sitemap, crawler text and
prerendered HTML for every indexed route. It fails when the sitemap and prerender
route sets differ.

## Release boundary

A merge to `main` builds and promotes production on Vercel. Follow the acceptance
checklist in
[`project-documentation/03_DESIGN_CONTRACT.md`](project-documentation/03_DESIGN_CONTRACT.md)
before merging, and
[`project-documentation/07_DEPLOY_RUNBOOK.md`](project-documentation/07_DEPLOY_RUNBOOK.md)
for the ordered launch steps. Do not change live Supabase, send real email from
new code paths, alter domains or delete deployed functions without the matching
verification.

The 24 September release additionally requires the immutable source lock,
deterministic adapter check, full unit suite, lint, the twelve actual scroll
cases, the complete built-route browser matrix and live lead-delivery evidence.
See `project-documentation/website-redesign/RELEASE-2026-09-24.md` for exact
receipts, rollback identity and the owner's release-only physical VoiceOver /
TalkBack exception. A screenshot or successful build alone does not pass release.
