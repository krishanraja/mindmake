/**
 * Canonical public-facing facts for the two advisory offers.
 *
 * Ratified 2026-08-05. Prices here are the published ones. Keep this file as
 * the single place they live so a change never has to be chased across pages,
 * prerendered crawler copy, and llms.txt.
 */

/** Rung 1. Fixed price, one decision. */
export const TEARDOWN_PRICE = "$3,500";

/** Rung 2. Banded by headcount. */
export const HANDOVER_PRICE_SMALL = "$30,000";
export const HANDOVER_PRICE_LARGE = "$50,000";

/** Stated publicly on purpose: the cap is part of the offer. */
export const HANDOVER_ANNUAL_CAP = 6;

/**
 * Offered on both rungs. Krish keeps editorial control over how any client is
 * portrayed, which is why the wording is "thoughtfully" rather than a blanket
 * case-study release.
 */
export const PUBLICITY_DISCOUNT =
  "20% off if you let me write about the work, with you approving how you're portrayed.";
