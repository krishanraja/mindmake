# Mindmake cleanup proposal

Last updated: 23 August 2026.

Status: read-only deletion plan. Nothing in this file authorises deletion, moving, archiving or a production change.

## What has already been made safe

- The active social card now uses Mindmake, the current two doors and `mindmake.co`.
- `/test-email-flows.html` is redirected away in Vercel, carries noindex metadata and can no longer auto-send. Its source remains for an approval-gated cleanup.
- Public `/intake` requests redirect to the current starting-point journey. Public `/testimonials` requests redirect to the current results archive. Their retained static source also carries noindex metadata. `/alumni` remains unlisted and noindex.
- Compatibility redirects remain for old public offer URLs.

## Evidence method

The audit traced `src/main.tsx` through an esbuild production metafile, checked `src/App.tsx`, searched direct references and inspected which public files Vite copies into `dist`.

At the audit snapshot, 58 source files were in the production graph. The files below were not reachable from that graph unless noted otherwise.

## Batch 1: retired page implementations

Proposed deletion after final route verification:

- `src/pages/Brief.tsx`
- `src/pages/Capital.tsx`
- `src/pages/Handover.tsx`
- `src/pages/Operator.tsx`
- `src/pages/Sprint.tsx`
- `src/pages/Teardown.tsx`

The redirect rules for their old URLs should stay. Deleting an old page implementation must not break a saved link.

## Batch 2: retired component systems

Proposed deletion after their stale tests are removed or rewritten:

- `src/components/diagnosis/`
- `src/components/nervous-decision/`
- `src/components/MediaEasterEggs/`
- `src/components/Animations/ParticleBackground.tsx`
- `src/components/BigProblem.tsx`
- `src/components/BookFitCall.tsx`
- `src/components/CtrlDemoVideo.tsx`
- `src/components/CtrlWaitlistPopover.tsx`
- `src/components/CurrencySwitcher.tsx`
- `src/components/Footer.tsx`
- `src/components/FrameworkJourney.tsx`
- `src/components/InitialConsultModal.tsx`
- `src/components/JourneyInfoCarousel.tsx`
- `src/components/LiveDecisionPreview.tsx`
- `src/components/MindMakerLiveSection.tsx`
- `src/components/MindMakerWordmark.tsx`
- `src/components/Navigation.tsx`
- `src/components/NewHero.tsx`
- `src/components/OperatorsBrief.tsx`
- `src/components/OperatorsEdge.tsx`
- `src/components/PortfolioPulse.tsx`
- `src/components/PriceTicker.tsx`
- `src/components/ProductExpandCard.tsx`
- `src/components/ProductExpandSection.tsx`
- `src/components/ScopingModal.tsx`
- `src/components/SimpleCTA.tsx`
- `src/components/SubstackSubscribeForm.tsx`
- `src/components/TwoDoors.tsx`
- `src/components/WhitepaperPromo.tsx`

`src/_archive/` is already outside the bundle. Decide whether the repository should keep it as history or move it to venture storage in a separate archive action.

Most `src/components/ui/` files are also outside the production graph. Keep `button.tsx`, `drawer.tsx`, `input.tsx` and `sheet.tsx`. Review the rest as one library-pruning batch rather than deleting them one by one without evidence.

## Batch 3: retired support code

Proposed review and deletion where no remaining test or tool needs it:

- `src/contexts/CurrencyContext.tsx`
- `src/contexts/SessionDataContext.tsx`
- every file in `src/hooks/` except `use-mobile.tsx` and `useBlogPosts.ts`
- `src/lib/haptics.ts`
- `src/lib/offers.ts`
- `src/lib/sound.ts`
- `src/lib/stripe-prices.ts`
- `src/utils/animationEasing.ts`
- `src/utils/calendly.ts`
- `src/utils/emailNotification.ts`
- `src/utils/pdfGenerator.ts`
- `src/utils/supabaseHealthCheck.ts`

Keep `src/integrations/supabase/types.ts` until the database and generated-type workflow have their own review. Runtime reachability alone is not enough reason to delete a generated schema source.

## Batch 4: unused source assets

Proposed deletion after one final import and visual check:

- `src/assets/battle-test-strategy.png`
- `src/assets/CTRL - Demo 2 - Loading.mp4`
- `src/assets/hero-background.jpg`
- `src/assets/krish-headshot.png`
- `src/assets/mindmaker-icon-black.png`
- `src/assets/mindmaker-icon-dark.png`
- `src/assets/mindmaker-icon-light.png`
- `src/assets/mindmaker-live-pill.png`
- `src/assets/Mindmaker-Wordmark-ondark.png`
- `src/assets/Mindmaker-Wordmark-onlight.png`
- `src/assets/peer-comparison-matrix.png`
- `src/assets/whitepaper-cover.png`
- `src/assets/whitepaper-cover-2026.png`

The production Mindmake wordmark should first move from `prototypes/assets/` into the canonical source asset folder. Keep the current owl/icon and favicon set.

## Batch 5: unused public assets

These files were absent from the current rendered journey and together accounted for about 73 MiB at the audit snapshot. Vite currently copies all of them into the production output.

- `public/CTRL-demo-aug-26.mp4`
- `public/MM owl.mp4`
- `public/MM-Home-Page.mp4`
- `public/fonts/Gobold_Bold.otf`
- `public/krish-stage-2.png`
- `public/krish-stage-3.png`
- `public/lesson-agentic-org-chart.png`
- `public/lesson-ai-chief-of-staff.png`
- `public/lesson-autonomous-business.png`
- `public/lesson-permanent-identity.png`
- `public/lesson-vibe-coding-unfair-advantage.png`
- `public/mindmaker-background-green.gif`
- `public/mindmaker-background.gif`
- `public/mindmaker-favicon.png`
- `public/mindmaker-live-logo-dark.png`
- `public/mindmaker-live-logo.png`
- `public/mindy.png`
- `public/orgchart.png`
- `public/placeholder.svg`
- `public/problem 1.mp4`
- `public/problem 2.mp4`
- `public/problem 3.mp4`
- `public/rising-cities.mp4`
- `public/solution 1.mp4`
- `public/solution 2.mp4`
- `public/solution 3.mp4`

Do not delete this batch until the current branch is built, visually checked and compared with the production graph again. Some files are kept alive only by stale tests or retired constants, so those references must be changed in the same approved cleanup.

## Batch 6: stale tests and public-link helpers

Review or replace these with current Mindmake contracts before deleting the code they lock in place:

- `src/test/CtrlDemoVideo.test.tsx`
- `src/test/public-media-and-proof.test.ts`
- retired-component assertions in `src/test/price-single-source.test.ts`
- retired Mindy and offer assertions in `src/test/mindy-knowledge.test.ts`
- retired offer assertions in `src/test/offers-collects-internal.test.tsx`
- unused `CTRL_DEMO_VIDEO_URL` and deprecated public-link names in `src/lib/publicLinks.ts`

Keep the current public-disclosure, redirect and Mindmake product contract tests.

## Retained old tool source has a release action

These are not publicly routed tools now:

- `public/intake/index.html` still submits to the live intake endpoint and uses the old brand.
- `public/testimonials/index.html` still submits to the live testimonial endpoint and uses the old brand.

The current Mindmake brief and results archive replace their public roles. After the release preview proves `/intake`, `/intake/index.html`, `/testimonials` and `/testimonials/index.html` reach the final redirects and no external workflow depends on files inside those folders, delete the retained static source as part of the reviewed cleanup batch. Keep the redirect tests and archive the rationale. If dependency evidence reveals a real external consumer, stop that deletion only, document the consumer and leave the rest of the cleanup moving.

## Prototype provenance

- Keep V8 and the approved mechanism studies until release because they prove the visual floor.
- V1 to V7 and rejected Mindmaker prototypes are negative evidence, not production inputs.
- After release, move historical prototypes to the approved venture archive if Krish wants the repository to contain only the live system.

## Cleanup acceptance checks

An approved cleanup is complete only when:

- the production graph contains only current code and deliberately retained support source;
- `npm run build`, full tests and lint comparison pass;
- all 21 indexed routes and the noindex Alumni route pass desktop and mobile checks;
- saved legacy URLs still redirect correctly;
- no current image, video, favicon, wordmark, legal page or crawler file breaks;
- the output bundle no longer carries the retired public media batch;
- the exact removed paths and recovery point are recorded.
