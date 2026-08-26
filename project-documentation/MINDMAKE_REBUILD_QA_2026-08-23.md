# Mindmake rebuild QA

Verified: 26 August 2026

## Outcome

The local Mindmake front end is ready for preview review. The homepage, Build Your AI Brain route, Build Your AI GTM route, results archive, article archive, practical answers, worked example, unlisted alumni page, legal pages and personalised starting brief now use one shared design system.

This is not approval to deploy or release. The version-two brief endpoint, visitor email and operator digest now exist in source, but their preview migration, deployment, private-schema checks, real provider acceptance, production configuration, retention decision, legal approval, physical-device checks and preview verification remain open.

## Build under test

- Repository: `C:\Users\krish\dev\mindmaker`
- Branch: `codex/mindmake-homepage-mock`
- Starting revision: `2dfc7121969280c705925f3db2fc4e40a83197de`
- Visual floor: `prototypes/mindmake-judgement-thread-motion-study-v5.html`; frozen gateway: `prototypes/mindmake-brain-gtm-gateway-candidate-7-v2.html`
- Local test address: `http://127.0.0.1:43121`
- Evidence folder: `C:\Users\krish\.scratch\mindmake-qa`
- Network safety: browser tests used local fake environment values and intercepted every company-read and lead hand-off request. No live lead or production data was created.
- V2 boundary: the build and browser evidence in this document predates the source-only V2 private hand-off. It proves the public and download journey, not the preview migration, private schema, verification email or either final inbox delivery.

## Product contract verified

- There is no public diary or Calendly link.
- The main action is `Start here`.
- Build Your AI Brain and Build Your AI GTM are full, shareable routes.
- The visitor sees a company read and useful recommendation before any email request.
- The default local journey asks for no email, sends no visitor identity, stores no lead and gives the visitor a complete download. Its company domain is still sent to `enrich-company` for the promised company read.
- The disabled hand-off adapter can call only the dedicated `submit-mindmake-brief` endpoint. It cannot fall back to the old contact pipeline.
- The version-two browser request contains only the email, company domain and allowlisted choice IDs. Company research, recommendation assembly, verification and both final emails are server-owned.
- The visitor's pressure and intended use of returned time change the preview, downloaded brief and lead digest.
- Newsletter consent is separate, optional and unticked.
- Publication interest records interest only. It does not subscribe or authorise an import.
- The success screen does not claim that Krish received the brief when the hand-off fails.
- No public price, retired offer name, `thesis`, em dash or sensitive money disclosure appears in the active rebuild surfaces.
- Customer outcomes, testimonials and attendee brands are clearly separated.
- Steph is omitted because no consent lookup is available in the local front end.

## User journey

| Entry | Visitor value | Next action |
|---|---|---|
| Homepage | Clear view of the two ways Mindmake helps, real outcomes and CTRL proof | Explore a route or open the starting brief |
| Build Your AI Brain | Four recognisable uses, working CTRL footage and a bounded 30-day proof | Build a route-specific starting point |
| Build Your AI GTM | Established and high-growth situations, joined commercial choices and working CTRL footage | Build a route-specific starting point |
| Results | Eight verified stories with result-led headings | Start from the result worth proving |
| Starting brief | Company evidence, likely pressures, returned-time value and a useful 30-day proof | Download the private brief |
| Contact | A quiet path for messages that are not a business starting point | Open a prefilled email, then choose whether to send it |
| Ideas | Eleven checked field notes that help with a real AI choice | Use the idea or build a company-specific starting point |
| Answers | Plain answers to practical buying and delivery questions | Judge fit without entering a sales flow |
| Worked example | A hands-on view of how people and AI agents can share work | Open a useful question or build a starting point |

## Automated checks

### Build and crawler output

- `npm run build`: passed.
- Vite compiled 2,509 modules.
- Sitemap generated 10 fixed pages and 11 articles.
- `llms.txt` generated.
- All 21 indexed routes received dedicated prerendered HTML.
- Article HTML includes the real article body, title, description, canonical URL, Open Graph data and Article structured data.
- The build fails if sitemap and prerender route sets differ.
- The only remaining build warning is stale Browserslist data.

### Tests

- Full suite: 93 passed, 0 failed across 16 files.
- The mobile rail suite includes the browser-rounding case where the last card stops a fraction short of the mathematical scroll end. Its counter and disabled Next state must still report the last card.
- The test environment now installs a deterministic in-memory Storage implementation before tests. This fixes the Node 25 incomplete `localStorage` object without changing runtime code.
- Expected non-failing output remains: Vite React plugin deprecation notices, stale Browserslist data, jsdom's `scrollTo` notice and the deliberate ErrorBoundary test stack.

### Lint

- Current result: 41 errors and 19 warnings.
- The recorded rebuild baseline was 41 errors and 20 warnings.
- No new lint error or warning was introduced. One baseline warning was removed.
- Targeted lint for the active hardening changes passes.

### Responsive matrix

- 147 combinations checked.
- Widths: 320, 360, 390, 768, 1024, 1440 and 1920 pixels.
- Routes: all 21 indexed pages and articles.
- No horizontal overflow.
- No clipped text in a clipping container.
- No heading exceeded the agreed four-line editorial limit.
- The two-door gateway uses four lines on desktop and three on mobile.

### Full sitemap

- 21 indexed URLs checked at 1440 by 1000 and 390 by 844.
- 42 route and viewport combinations passed.
- No broken image, overflow, empty accessible control, page error, direct booking link, retired offer name or old publication label.
- The audit includes every current article.

### Mobile interaction matrix

- 63 combinations were checked across all 21 indexed routes at 320 by 568, 390 by 844 and 844 by 390.
- After genuine-issue triage, the matrix found no horizontal overflow, broken image or browser error.
- Mobile uses one shared content edge and the visible canvas below the fixed header. It is recomposed for phone and short landscape use rather than scaled down from desktop.
- At 900 pixels wide or below, the measured consent notice becomes top chrome. Its exact rendered height is reserved for the header, open menu, route opening canvas and frozen gateway. Accepting the notice removes that reserve and restores the full canvas.
- Controls remain at least 44 by 44 pixels. The full-viewport menu locks page scroll, closes with Escape and returns focus to the menu control.
- Short landscape uses purposeful two-pane compositions or horizontal snap rails. Rails reveal the next card, support touch swiping, keep controls fixed and report the final card at the physical end.
- Scroll-linked movement reverses when the visitor scrolls back. Reduced-motion mode preserves the same meaning without movement.
- No audited heading or body block truncates, clips or forms an aggressive narrow stack.
- Video remains user-controlled and uses `preload="none"`.
- The starting brief was exercised with `visualViewport`, keyboard and safe-area aware layouts. Back, close, browser history and Escape behave predictably.
- Physical iOS Safari and Android Chrome remain manual release checks.

## Live interaction checks

- Scroll-linked scenes move forward and reverse when the visitor changes scroll direction.
- Reduced-motion mode removes route-card transforms and preserves full static meaning.
- CTRL view switching works.
- CTRL video loads, plays and reports `readyState 4` with no media error.
- Stopping a playing video and navigating causes one expected browser `ERR_ABORTED` request cancellation. It is not a broken asset.
- Customer-outcome arrows remain fixed after cycling all eight stories.
- Quote-deck height remains fixed and no quote truncates.
- Dialog opens with focus on the first field, traps keyboard focus, closes with Escape and returns focus.
- Mobile navigation focuses its first link, closes with Escape and returns focus to the menu button.
- Mobile guided brief remains exactly viewport width at every step.
- The private brief downloads with a company-specific file name.
- The earlier hand-off check used an intercepted V1 request containing browser-made narrative fields. It is retained as historical test evidence and is not a release check for V2.
- V2 requires a server-owned recommendation and a browser request containing only the email, domain and allowlisted choice IDs. Its request, confirmation, retry and delivery behaviour must be proved separately in preview.
- The general contact page opens a prefilled email draft. It says clearly that nothing is sent until the visitor presses Send in their email app.
- The worked org chart uses native buttons. Enter on desktop and Space on mobile open the useful role question and hand that context into the starting brief.
- Featured articles remain visible in ordinary search and filtered results.
- Article sharing falls back from native sharing to clipboard, then to a visible copyable link.
- `/#about` waits for lazy content to mount before scrolling to the right place.
- `/library` resolves to the article archive at `/blog`; practical questions use `/faq`.
- Cookie consent remains usable when browser storage is blocked.
- The unlisted, noindex alumni page uses the shared Mindmake shell and has no overflow or browser error at 1440 and 390 pixels. It is not access-controlled and is not described as private.

## Starting-brief resilience

- Closing the brief clears every private field, choice, result, consent value and error.
- Closing aborts the browser's in-flight company read or hand-off request and ignores any late client result. A server may already have started work, which is why the future endpoint must also be idempotent.
- Reopening cannot receive a late result from an earlier journey.
- Each of the seven steps moves focus to its input or heading and resets panel scroll.
- Company research stops after 10 seconds, explains the limit honestly and offers retry or a manual pressure choice.
- Invalid fields use `aria-invalid` and `aria-describedby`, and focus returns to the field that needs attention.

## Visual evidence

Key screenshots in `C:\Users\krish\.scratch\mindmake-qa`:

- `desktop-home-top.png`
- `desktop-main-event-heading.png`
- `desktop-main-events.png`
- `desktop-ctrl-proof.png`
- `desktop-proof-decks.png`
- `desktop-guided-brief-preview.png`
- `mobile-home-top.png`
- `mobile-guided-brief-preview.png`
- `mobile-mm-route-grid.png`
- `mobile-mm-operating-proof.png`
- `mobile-mm-quote-grid.png`
- `desktop-new-age-value-first.png`
- `mobile-new-age-value-first.png`
- `desktop-new-age-checks.png`
- `mobile-new-age-story.png`
- `desktop-faq-value-first.png`
- `mobile-faq-value-first.png`
- `desktop-article-value-top.png`
- `mobile-article-value-body.png`
- `desktop-alumni-value-first.png`
- `mobile-alumni-value-first.png`

Machine-readable evidence:

- `live-qa-results.json`
- `responsive-matrix.json`
- `sitemap-live-audit.json`

## Accessibility checks

- One H1 per audited route.
- Distinct page titles.
- Skip link.
- Named main and mobile navigation.
- Visible two-tone keyboard focus against light and dark surfaces.
- Named icon-only article share controls.
- Labelled inputs, fieldsets and buttons.
- Dialog semantics, focus trap, Escape close and focus restoration.
- Toggle buttons expose pressed state.
- Org-chart choices are native buttons with keyboard activation.
- Decorative imagery is hidden from screen readers.
- Framer Motion scenes and native transitions preserve meaning when motion is reduced.

A physical screen-reader pass remains useful before production, especially VoiceOver on iOS and TalkBack on Android.

## Privacy and legal boundary

The local privacy notice explains the starting-brief data, public company research, optional newsletter consent, providers, retention, rights and security in plain language. Its information categories were checked against the UK Information Commissioner's Office guidance on the right to be informed: `https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/`.

This is a product and implementation review, not legal advice. Final legal wording, retention periods, international-transfer safeguards and the exact production service-provider list need owner or counsel approval.

The source email test harness is inert, marked noindex and blocked from production routing. Public `/intake` requests now redirect to the current starting-point journey. Public `/testimonials` requests redirect to the current results archive. The old-brand source files remain noindex and recoverable until their approved cleanup.

## Open release gates

1. Apply the private-brief migration to preview; run database lint and security advisers; prove browser roles cannot read the private schema or call its private RPC; and deploy the version-two `submit-mindmake-brief` Edge Function.
2. Verify exact allowed origins, sender, operator email and symbolic secret configuration without recording secret values. Exercise request, resend, changed-email, valid, invalid, expired and locked-code paths plus independent visitor and operator email failures with synthetic inboxes.
3. Agree the retention schedule and implement any deletion process the public wording promises. Confirm privacy, separate publication-interest and terms wording. Keep the hand-off flag off until all three gates pass.
4. Complete physical iOS Safari and Android Chrome checks, including keyboard, download, screen-reader and video behaviour.
5. Confirm the publication move from `mindmakerlive.substack.com` to `content.mindmake.co` before changing the live link.
6. Decide whether to rebrand, archive or delete the retained noindex source for the retired intake and testimonial tools. Their former public routes already redirect to current journeys.
7. Approve the exact legacy code and asset cleanup. About 73 MiB of unused public media still enters the build because Vite copies `public` wholesale.
8. Run a preview deployment. Repeat route, sitemap and lead checks, prove retries cannot create duplicate leads or messages, and prove that an unknown direct URL returns a real HTTP 404 rather than only a client-side not-found page.
9. Treat merge, domain changes and production promotion as separate approvals after preview passes.

## Release boundary

No deployment, merge, Supabase mutation, real lead submission, domain change, file deletion or production promotion was performed during this QA pass.
