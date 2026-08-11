# QA scripts

Browser verification against the built output. Not part of the build, never
deployed, and not run by `npm test`.

## Why these exist

`vite preview` applies its SPA fallback first, so it serves `dist/index.html`
for every route and hides the entire point of the prerender step. On Vercel a
request for `/teardown` is answered by the real `dist/teardown/index.html`, and
the rewrite only fires for paths with no matching file.

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

node scripts/qa/currency-check.mjs
node scripts/qa/screenshots.mjs
```

Both exit non-zero on failure.

## currency-check.mjs

Covers what a unit test cannot: that a currency choice survives navigation and
a reload, that `?currency=` beats the cookie and is then promoted into it, that
nothing auto-detects from locale (the browser context is deliberately `en-AU`
in `Australia/Sydney` and must still default to USD), and that AUD, which has
the longest price strings, does not overflow at 390px.

## Note on hard-coded prices

These scripts state expected prices literally, and are excluded from the
price-leak test for that reason. An end-to-end assertion that derived its
expectations from `src/lib/offers.ts` would only prove that file equals
itself. If a price changes, these expectations are meant to fail until a human
updates them.
