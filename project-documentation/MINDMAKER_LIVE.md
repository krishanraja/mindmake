# Mindmaker Live

Last updated: 2026-08-23.

Mindmaker Live is Mindmaker's publication and distribution arm. It is not a service offer or a second buying path on themindmaker.ai.

- **Paid** is the weekly main format. It follows where money is moving as internet business models change.
- **Built** is the fortnightly format. It shows how operators are responding and what they have learned from real work.

Paid and Built are article formats. They are not service plans or a free and paid product ladder.

Every public link uses `https://live.themindmaker.ai`. The raw Substack URL is not used as the brand destination.

Note: src/components/SubstackSubscribeForm.tsx embeds the raw mindmakerlive.substack.com URL directly. It is currently unreachable on the live site (only imported by the unrouted src/pages/Brief.tsx and the unused src/components/MindMakerLiveSection.tsx), but any surface that re-adds it must not resurrect a second public destination — route through MINDMAKER_LIVE_URL / live copy instead.
