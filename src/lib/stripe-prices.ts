/**
 * Canonical Stripe product and price IDs.
 *
 * Only one product remains here. The Alumni Pass is the only thing the site
 * itself charges via Stripe, and even that is invitation-gated: Krish confirms
 * eligibility after an engagement and sends a direct payment link, so there is
 * no live checkout on the page.
 *
 * Everything else was removed in August 2026 with the six-rung ladder. The IDs
 * that used to sit here were referential anyway, because a third party
 * collected payment for those offers, and that third party is no longer part
 * of the business. Leaving them would have meant a file of live-looking
 * checkout identifiers for products nobody can buy.
 *
 * The remaining Stripe products in the dashboard should be archived. See
 * COMMERCIAL_REFERENCE.md.
 *
 * NOTE: this file holds identifiers, not prices. Prices live in
 * `src/lib/offers.ts` and nowhere else, and a test enforces that.
 */

export const STRIPE_PRODUCTS = {
  alumniPass: {
    productId: "prod_UWRtT59kvz7mk6",
    priceId: "price_1TXOzcHGqJqsGEJLjN7P4ddi",
  },
} as const;
