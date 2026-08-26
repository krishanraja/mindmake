#!/usr/bin/env bash
# Approved legacy dead-code batch for the Mindmake launch (HANDOVER/05).
# Every file below was proven unreferenced from the active route graph on
# 26 August 2026 (import search plus knip closure analysis). Run from the
# repository root, review `git status`, then commit as one batch:
#
#   bash scripts/cleanup-legacy.sh
#   npm test -- --run && npx tsc --noEmit && npm run build && npm run lint
#
# Deliberately NOT removed here: src/components/ui (shared kit),
# scripts/qa (working tooling), supabase/functions legacy sources (the
# prior production site still calls them until the domain cutover; remove
# in the post-cutover hygiene batch).
set -euo pipefail

git rm -r -q \
  src/_archive \
  src/components/diagnosis \
  src/components/MediaEasterEggs \
  src/components/Animations \
  src/components/nervous-decision

git rm -q \
  src/pages/Brief.tsx src/pages/Capital.tsx src/pages/Handover.tsx \
  src/pages/Operator.tsx src/pages/Sprint.tsx src/pages/Teardown.tsx \
  src/components/BigProblem.tsx src/components/BookFitCall.tsx \
  src/components/CtrlWaitlistPopover.tsx src/components/CurrencySwitcher.tsx \
  src/components/Footer.tsx src/components/FrameworkJourney.tsx \
  src/components/InitialConsultModal.tsx src/components/JourneyInfoCarousel.tsx \
  src/components/LiveDecisionPreview.tsx src/components/mindmake/ScrollDecision.tsx \
  src/components/MindMakerLiveSection.tsx src/components/MindMakerWordmark.tsx \
  src/components/Navigation.tsx src/components/NewHero.tsx \
  src/components/OperatorsBrief.tsx src/components/OperatorsEdge.tsx \
  src/components/PortfolioPulse.tsx src/components/PriceTicker.tsx \
  src/components/ProductExpandCard.tsx src/components/ProductExpandSection.tsx \
  src/components/ScopingModal.tsx src/components/SimpleCTA.tsx \
  src/components/ui/markdown-response.tsx \
  src/components/SubstackSubscribeForm.tsx src/components/TwoDoors.tsx \
  src/components/WhitepaperPromo.tsx \
  src/contexts/CurrencyContext.tsx src/contexts/SessionDataContext.tsx \
  src/hooks/useFontLoader.ts src/hooks/useKeyboardInset.ts \
  src/hooks/useLeadershipInsights.ts src/hooks/useLiveBrief.ts \
  src/hooks/useModelData.ts src/hooks/useOpenAIContext.ts \
  src/hooks/usePortfolio.ts src/hooks/useRealisticCounters.ts \
  src/hooks/useScrollAnimation.ts src/hooks/useScrollBackToTop.ts \
  src/hooks/useScrollDirection.ts src/hooks/useScrollLock.ts \
  src/hooks/useScrollTrigger.ts src/hooks/useStatsTimer.ts \
  src/hooks/useTestimonials.ts src/hooks/useThrottledProgress.ts \
  src/hooks/useVoiceInput.ts \
  src/lib/haptics.ts src/lib/sound.ts src/lib/stripe-prices.ts \
  src/utils/animationEasing.ts src/utils/calendly.ts \
  src/utils/emailNotification.ts src/utils/pdfGenerator.ts \
  src/utils/supabaseHealthCheck.ts \
  scripts/generate-og-image.cjs scripts/lib/offers-loader.mjs \
  scripts/send-test-emails-node.js scripts/send-test-emails-simple.js \
  scripts/send-test-emails.ts scripts/test-contact-email-working.js \
  scripts/test-email-flows.ts scripts/test-resend-direct.js \
  scripts/test-resend-minimal.js scripts/TEST_EMAIL_FLOWS.md \
  public/test-email-flows.html

git rm -r -q public/intake

echo "Legacy batch staged. Review with: git diff --cached --stat"

# Unused public media (audited 26 August 2026; nothing below is referenced by
# src, scripts, index.html, vercel.json, _redirects or the frozen prototypes).
# Re-run the media audit after the code batch above is removed - more files
# become unused once their only referencing components are gone.
git rm -q \
  "public/mindmaker-background-green.gif" \
  "public/mindmaker-background.gif" \
  "public/solution 1.mp4" "public/solution 2.mp4" "public/solution 3.mp4" \
  "public/problem 1.mp4" "public/problem 2.mp4" "public/problem 3.mp4" \
  "public/orgchart.png" "public/mindmaker-favicon.png"

# Post-cutover follow-ups (do NOT run before the domain cutover):
# - supabase function sources for the retired site (send-contact-email,
#   mindy-chat, notify-*, submit-intake, generate-proposal, ...): the prior
#   production deployment calls them until mindmake.co serves the new site.
# - src/lib/offers.ts and the legacy guard tests that import it
#   (offers-collects-internal.test.tsx, mindy-knowledge.test.ts,
#   price-single-source.test.ts): rework the no-public-price protection
#   without the offers module before removing it.
