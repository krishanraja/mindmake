# Route continuity for the AI Brain / AI GTM redesign

Status: candidate r3, 17 September 2026.

The route redesign is a focused replacement of the AI Brain and AI GTM experiences. It is not a site reduction.

## Kept in the application and final information architecture

- `/` — the two-door Mindmake threshold.
- `/ai-brain` — the live AI Brain route.
- `/ai-gtm` — the live AI GTM route.
- `/case-studies` — results and proof.
- `/blog` and every `/blog/:slug` article — the editorial archive, labelled **Ideas** in navigation.
- `/new-age-leadership` — the durable leadership argument; this is the current manifesto-like long-form surface.
- `/answers` and every `/answers/:slug` page — direct buyer questions.
- `/faq` — the curated straight-answers corpus.
- `/contact`, `/privacy`, `/terms` and `/alumni`.
- Existing historical redirects and start-flow aliases.

## Publication / Media

The external publication at `https://mindmakerlive.substack.com` is labelled **Media** in the main menu and footer. The navigation label is not a new publication brand; it is the route name for the media library hosted on Substack, which runs two channels, **The Money of AI** and **Built with AI**.

Subscribing is the site's low-commitment way to stay close, and it never competes with **Get your free AI brief**. Every subscribe action says **Subscribe for free** and opens the publication's subscribe form (`SUBSCRIBE_URL` in `src/lib/publicLinks.ts`). It appears in three places: a hairline badge beside Media in both menus, one button in every footer, and one line with a button in the brief's success step. There is no publication band, pop-up or modal.

## Navigation layers

The overlay menu carries the two paid doors, Results, Ideas, New-age leadership, Media and Start here. Legal and contact routes stay in the footer. This keeps the first decision short without hiding the durable editorial and leadership surfaces.

## About and manifesto truth

There is no standalone `/about` or `/manifesto` route in the current codebase. They have not been deleted by this redesign. `New-age leadership` is the current manifesto-like surface; founder and operating-context material currently lives across the homepage and existing editorial pages. A standalone About or Manifesto page should only be added with accepted content and a defined job in the final information architecture, not as an empty route or a misleading alias.
