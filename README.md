# Mindmake website

Mindmake is Krish Raja's principal-led AI and commercial strategy practice. It helps leaders extend their judgment with AI, then use that stronger ability to improve the person, product, price, message or company around them.

The public site has two clear doors:

- **Build Your AI Brain**: turn useful judgment, memory, standards and trusted context into a working system.
- **Build Your AI GTM**: make better product, price, message and team choices as AI changes the market.

Either door may lead to the other. Work begins with one privately priced 30-day proof. There is no public diary or public price.

## Start with the current truth

Read these files in order before changing a public offer, route, CTA, proof claim or lead path:

1. [`project-documentation/MINDMAKE_CANON.md`](project-documentation/MINDMAKE_CANON.md)
2. [`project-documentation/REBUILD_STATE.md`](project-documentation/REBUILD_STATE.md)
3. [`project-documentation/BRANDS_AND_TESTIMONIALS.md`](project-documentation/BRANDS_AND_TESTIMONIALS.md)
4. [`project-documentation/MINDMAKE_REBUILD_QA_2026-08-23.md`](project-documentation/MINDMAKE_REBUILD_QA_2026-08-23.md)
5. [`project-documentation/DECISIONS_LOG.md`](project-documentation/DECISIONS_LOG.md)

Other project documents may describe retired Mindmaker offers and are historical unless the current canon confirms them.

## Public journey

The main action is `Start here`.

1. The visitor gives a company website.
2. Mindmake shows an honest company read.
3. The visitor chooses the pressure that feels closest.
4. They choose where better use of their time or judgment would create value.
5. Mindmake shows a useful starting brief.
6. The current local build lets the visitor download it without giving an email.

The intended live hand-off then asks for a work email, verifies the address, delivers the brief and queues a separate fit summary for Krish. The version-two endpoint and email templates exist in source, but this step remains disabled until the preview database, Edge Function, retention process and both email paths are deployed and verified. It never reuses the old contact-form pipeline.

Newsletter permission is separate and unticked. There is no automated nurture series. The current visitor email boundary is documented in [`project-documentation/MINDMAKE_LEAD_DELIVERY_SPEC.md`](project-documentation/MINDMAKE_LEAD_DELIVERY_SPEC.md).

## Main routes

| Route | Purpose |
|---|---|
| `/` | Position, mechanisms, two doors, proof, Media and the starting-point path |
| `/ai-brain` | Full AI Brain outcome route |
| `/ai-gtm` | Full commercial outcome route |
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

- `src/App.tsx`: active routes and client-side redirects.
- `src/pages/`: public page compositions.
- `src/components/mindmake/`: shared shell, proof, motion and lead components.
- `src/styles/mindmake.css`: the canonical public design system.
- `src/data/blogPosts.ts`: public article source.
- `scripts/generate-sitemap.mjs`: indexed route list.
- `scripts/prerender.mjs`: crawler HTML and sitemap parity gate.
- `scripts/generate-llms.mjs`: crawler text.

## Proof and language rules

- Attendee brands are never called customers.
- Customer outcomes and testimonials remain separate.
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

Copy `.env.example` to a private local environment file when a local browser check needs the public Supabase URL and publishable key. Never commit environment values. Keep `VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED=false` unless the dedicated versioned endpoint is available in a safe test environment.

`npm run build` creates the production bundle, sitemap, crawler text and dedicated prerendered HTML for every indexed route. The build fails when the sitemap and prerender route sets differ.

## Release boundary

Local implementation is complete on `codex/mindmake-homepage-mock`. The private-brief migration and endpoint exist in source only. Preview deployment, private-schema checks, real visitor and operator email tests, retention approval, legal approval, physical iOS and Android checks, publication migration, merge, domain changes and production promotion remain separate gates.

Do not deploy, merge, change live Supabase, send real email, delete legacy assets or promote production without the matching approval.
