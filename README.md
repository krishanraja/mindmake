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

Either door can lead to the other. Work begins with one privately priced
thirty-day proof. There is no public diary and no public price.

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

1. The visitor gives a company website.
2. Mindmake shows a declarative company read and, when the read is strong enough,
   pressure choices tailored to that company. "Something else" reveals the locked
   list.
3. They choose where better use of their time would create value.
4. Mindmake shows the recommendation: what AI can carry, what stays with the
   leader, and one useful thirty-day proof.
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
| `/` | The threshold, the two doors, the enemy pair, live proof, the close |
| `/ai-brain` | Amplify and absorb, CTRL as proof, the personal read, the fork, the ladder |
| `/ai-gtm` | The three places money moves, the live board, the company read, engagement shapes |
| `/case-studies` | Eight verified customer stories |
| `/blog`, `/blog/:slug` | Checked public ideas archive |
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
- `src/components/mindmake/`: the shell, the film plate, the marquee, the live
  board, the two journeys, the fork, the ask bar, the brief and the proposal.
- `src/hooks/useScrollDriver.ts`: the one scroll primitive. Nothing else reads
  scroll position, and `IntersectionObserver` appears nowhere.
- `src/hooks/useAmbientMotion.ts`: decides whether a visitor is served moving
  footage at all.
- `src/styles/`: `mindmake.css` (tokens, base, chrome), `mindmake-instruments.css`
  (every rebuilt component), `mindmake-brief.css` (the brief dialog and proposal).
- `src/assets/films/`: six films, each with both formats and a poster taken from
  its own first frame.
- `src/data/rebuildProof.ts`: proof data. `src/content/answers.json`: the live
  public answers.
- `supabase/functions/`: the six functions the site owns.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`,
  `scripts/prerender.mjs`: crawler surfaces.

## Rules that are enforced by test

- No first person, no biography, no portrait. The founder is named once.
- No eyebrow text above any heading, anywhere.
- No em dashes. British English. No "judgment".
- No banned vocabulary, and no "not X, but Y" antithesis.
- No entrance choreography, and no `IntersectionObserver` in a rebuilt surface.
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
