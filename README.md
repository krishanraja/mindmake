# Mindmaker website

Mindmaker is Krish Raja's commercial decision practice. It helps founders and business leaders make hard product, price, sales and company decisions as AI changes their market, then put the decision into action.

The public offer is one focused, 21-day Sprint. CTRL is the private workspace the client keeps. It is evidence and a deliverable, not a second offer.

## Public journey

The buying path is deliberately short:

1. Understand the problem Mindmaker solves.
2. See the one Sprint and the proof behind it.
3. Book a 15-minute fit call.

Every main sales action says `Book a fit call` and uses the URL in `src/lib/publicLinks.ts`. Contact is for general messages. Mindmaker Live always uses `https://live.themindmaker.ai`.

The interactive Diagnosis Room and homepage AI demonstration are paused. Their code may remain for future work, but neither is mounted in the public buying journey.

## Main routes

| Route | Purpose |
|---|---|
| `/` | Clear position, proof, Sprint, CTRL evidence and final action |
| `/sprint` | The single paid engagement |
| `/case-studies` | Eight approved client stories and separate career references |
| `/operator` | How Krish uses AI in real work |
| `/blog`, `/library` | Background reading outside the buying path |
| `/contact` | General messages |

Old offer routes redirect straight to `/sprint`. `/start` and `/decision` redirect to the 15-minute calendar. `/signal` redirects to Mindmaker Live.

## Proof rules

- Attendee brands are never called clients.
- Client results come from `src/data/rebuildProof.ts` and `project-documentation/BRANDS_AND_TESTIMONIALS.md`.
- Career references stay separate from client outcomes.
- Steph's quote renders only when the existing consent record is present. Missing data means no quote.
- Removed private or unsupported figures are blocked by tests.

## Design rules

Keep the Mindmaker identity: ink and mint, the owl, real-world images, dark and light pacing, useful motion and visible CTRL evidence. New work must use the existing tokens and shared components rather than creating a second design system.

Public copy uses British English, short sentences, common words and no em dashes. Approved quotes stay verbatim.

## Development

```bash
npm install
npm run dev
npm test
npm run lint
npm run build
```

Copy `.env.example` to a private local environment file and provide the public Supabase URL and publishable key before running a browser preview. Never commit environment values.

The build also generates the sitemap, crawler text and prerendered public pages.

## Release gate

Work happens on `codex/mindmaker-rebuild`. A matching preview must pass before merge. Production promotion is manual and is not authorised by this rebuild.

Current product and release state: `project-documentation/REBUILD_STATE.md`.
Conversion audit: `project-documentation/CTA_PATH_AUDIT.md`.
