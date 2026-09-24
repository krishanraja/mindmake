# QA scripts

Browser verification against the built output. Not part of the build, never
deployed, and not run by `npm test`.

## Why these exist

`vite preview` applies its SPA fallback first, so it serves `dist/index.html`
for every route and hides the entire point of the prerender step. On Vercel a
request for a prerendered route is answered by the real
`dist/<route>/index.html`, and the rewrite only fires for paths with no
matching file.

`serve-dist.mjs` resolves paths in Vercel's order (exact file, then directory
index, then SPA fallback) so what is tested locally is what production serves.

## Running them

The app's Supabase client throws at import time when its env vars are unset,
which stops React mounting at all. A local build needs placeholders. These are
obviously fake and talk to nothing:

```sh
VITE_SUPABASE_URL="http://127.0.0.1:54321" \
VITE_SUPABASE_PUBLISHABLE_KEY="local-qa-key-not-a-real-credential" \
npm run build

node scripts/qa/redirect-check.mjs
```

It exits non-zero on failure.

## World-class award panel

`quality/award-panel/` contains the versioned blind-judging standard. It keeps
mobile and desktop verdicts separate and requires ten specialist submissions
from five independent jurors before aggregation can issue a final verdict.

```sh
npm run qa:award-panel
npm run qa:award-panel:capture -- --url https://mindmake.co --run-id production-YYYY-MM-DD
npm run qa:award-panel:aggregate -- artifacts/award-panel/production-YYYY-MM-DD
```

Generated screenshots, observations, judge submissions and results remain in
the ignored `artifacts/award-panel/` directory. The capture records the exact
rubric hash so a later rubric edit cannot silently change an earlier verdict.

## Approved homepage fidelity

`quality/homepage/approved-vnext-r2.json` records the approved homepage
direction and its non-regression rules. The production gate exercises the
opening, both routes and the lead drawer at desktop, tablet, phone, short-phone
and landscape sizes. It also checks deliberate line breaks, text zoom, browser
history, focus restoration and the homepage's immediate load.

```sh
npm run qa:homepage-fidelity -- --base http://127.0.0.1:4180
```

## Plain-language controls

`qa:plain-language` protects the current AI Brain and AI GTM prototypes from
reintroducing internal strategy shorthand as customer-facing choices. The
rendered production routes carry the same rule in
`src/test/copy-restraint.test.ts`.

```sh
npm run qa:plain-language
npm run qa:ai-brain-prototype-r5
npm run qa:ai-gtm-prototype-r6
```

## Locked route visibility

`qa:locked-routes` compares every Brain stage and GTM phase on the approved
prototype and production routes. It renders desktop, shallow desktop, phone
and compact phone evidence, rejects ancestor-hidden content, checks heading
contrast, clipping and horizontal overflow, then repeats the critical states
inside the paired production-review frames.

```sh
npm run qa:locked-routes
```

## One left edge per page

`qa:logo-alignment` measures the wordmark in each page's own top bar against
that page's content edges, at five widths, on every indexed route plus one
article and one answer. The site has three edge measures in use — the
container's, the two locked routes' and the R5 surface's — and nothing had ever
compared the chrome's against the body's, so four separate drifts had
accumulated unseen, the largest 260px. `ANCHORS` in the script names the content
edge per surface rather than guessing it, because a deliberately inset block (a
centred closing block, a quote's rule, a hero deck set against its film) is not
a content edge.

```sh
npm run qa:logo-alignment
```

## redirect-check.mjs

Exercises every retired route in a real browser against the built output and
asserts the visitor ends up on the right page. This verifies the client-side
fallback in App.tsx; the HTTP 301 edge rules live in vercel.json and are
checked structurally by `src/test/redirects.test.ts`.
