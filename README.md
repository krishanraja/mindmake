# Mindmake website

Mindmake is Krish Raja's principal-led AI and commercial strategy practice. It helps leaders extend their judgement with AI, then use that stronger ability to improve the person, product, price, positioning or people around them.

The site is live at [`mindmake.co`](https://mindmake.co) with two clear doors:

- **Build Your AI Brain**: encode your taste and judgement, amplify your strengths, uncover your blind spots.
- **Build Your AI GTM**: create an AI-native GTM model across product, price, positioning or people.

Either door may lead to the other. Work begins with one privately priced 30-day proof. There is no public diary or public price.

## Start with the current truth

Read these files in order before changing a public offer, route, CTA, proof claim or lead path:

1. [`project-documentation/MINDMAKE_CANON.md`](project-documentation/MINDMAKE_CANON.md)
2. [`project-documentation/CURRENT_STATE.md`](project-documentation/CURRENT_STATE.md)
3. [`project-documentation/DESIGN_CONTRACT.md`](project-documentation/DESIGN_CONTRACT.md)
4. [`project-documentation/BRANDS_AND_TESTIMONIALS.md`](project-documentation/BRANDS_AND_TESTIMONIALS.md)
5. [`project-documentation/DECISIONS_LOG.md`](project-documentation/DECISIONS_LOG.md) (history, not current truth)

## Public journey

The main action is `Start here`. The private email hand-off is live (Gate E closed 27 August 2026).

1. The visitor gives a company website.
2. Mindmake shows a declarative company read and, when the read is strong enough, pressure choices tailored to that company; `Something else` reveals the locked list.
3. They choose where better use of their time would create value.
4. Mindmake shows the recommendation: what AI can carry, what stays with the leader, and one useful 30-day proof.
5. The visitor may keep the brief by verified work email and receives the branded proposal on screen, by email and as a self-contained attached document. Krish receives a private fit digest.
6. The visitor can always download the brief locally, whether or not either email succeeds.

Newsletter permission is separate and unticked. There is no automated nurture series. The full contract is in [`project-documentation/MINDMAKE_LEAD_DELIVERY_SPEC.md`](project-documentation/MINDMAKE_LEAD_DELIVERY_SPEC.md).

## Main routes

| Route | Purpose |
|---|---|
| `/` | Position, mechanisms, two doors, proof, Media and the starting-point path |
| `/ai-brain` | Stepped, numbered AI Brain journey |
| `/ai-gtm` | Stepped, numbered AI GTM journey |
| `/case-studies` | Eight verified customer stories |
| `/blog` | Checked public ideas archive |
| `/blog/:slug` | One static article |
| `/faq` | Practical answers about fit, work and what the client keeps |
| `/new-age-leadership` | Worked people-and-agent org chart example |
| `/contact` | General messages |
| `/privacy`, `/terms` | Current website policies |
| `/alumni` | Unlisted, noindex page for past clients |

Retired offer URLs remain as compatibility redirects. `/library` redirects to `/blog`. `/signal` redirects to the current Media publication.

## Main code surfaces

- `src/App.tsx`: active routes and retired-route fallbacks.
- `src/pages/`: public page compositions.
- `src/components/mindmake/`: the shared shell, journey system, proof, marks, brief and proposal components.
- `src/styles/`: `mindmake.css` (the base public design system), `mindmake-journey.css` (the stepped journeys), `mindmake-brief.css` (the brief dialog and proposal), `mindmake-gateway.css` (frozen).
- `src/data/rebuildProof.ts`: proof data; `src/data/blogPosts.ts`: article source.
- `supabase/functions/`: the two live edge functions, `enrich-company` and `submit-mindmake-brief`, with their shared modules.
- `scripts/generate-sitemap.mjs`, `scripts/generate-llms.mjs`, `scripts/prerender.mjs`: crawler surfaces.

## Proof and language rules

- Attendee brands are never called customers.
- Customer outcomes and career testimonials remain separate.
- Approved quotes stay verbatim.
- Consent-gated proof disappears when consent is missing or unavailable.
- Public copy uses British English, common words and no em dashes.
- Do not publish a public price, public booking link, unsupported result or retired offer.
- Every section must teach, prove or help the visitor choose.

## Development

The repository requires Node 22.18 or later.

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

Copy `.env.example` to a private local environment file when a local browser check needs the public Supabase URL and publishable key. Never commit environment values. Local placeholder values are fine for build-only checks; the QA notes in `scripts/qa/README.md` show the pattern.

`npm run build` creates the production bundle, sitemap, crawler text and dedicated prerendered HTML for every indexed route. The build fails when the sitemap and prerender route sets differ.

## Release boundary

A merge to `main` builds and promotes production on Vercel. Follow the acceptance checklist in `DESIGN_CONTRACT.md` before merging, and `DEPLOYMENT.md` for backend or email changes. Do not change live Supabase, send real email from new code paths, alter domains or delete deployed functions without the matching verification.
