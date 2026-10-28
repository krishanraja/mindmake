/**
 * The growth placement a visit arrived from, held in page memory only.
 *
 * growth-mindmake tags the links it places on public pages (show notes, event
 * pages, the one-sheet) with exactly `utm_source=growth-<path>` and
 * `utm_medium=referral`, and nothing else. The head script in `index.html`
 * reads that one shape from the arrival address into `window.mmVisitTag` and
 * queues it for Google Analytics before the tag's config, so the first page
 * view carries it even after the address has moved on. Any other source or
 * medium is not held.
 *
 * It is never written to the device: no cookie, no local or session storage.
 * It reaches Google only if gtag.js loads, which happens only after Allow
 * (`mmLoadGoogleTag`). On Decline it is dropped from page memory and from the
 * queued commands, so nothing of it is left to send.
 *
 * The brief request records the same held tag beside its entry route
 * (`heldPlacement`, sent as `placement` to `submit-mindmake-brief`), and
 * /privacy section 2 says so. It is read from page memory only, never from the
 * address, and only while it still has the engine's shape; the function and
 * the table's CHECK constraints hold the same rule.
 */

/** The engine's shape: `growth-<path>`, lower-case words joined by hyphens,
 *  at most 40 characters, always with the medium `referral`. */
export const GROWTH_SOURCE_PATTERN = /^growth-[a-z]+(?:-[a-z]+)*$/;
export const GROWTH_SOURCE_MAX = 40;
export const GROWTH_MEDIUM = "referral";

export const isGrowthPlacement = (source: unknown, medium: unknown): boolean =>
  typeof source === "string"
  && source.length <= GROWTH_SOURCE_MAX
  && GROWTH_SOURCE_PATTERN.test(source)
  && medium === GROWTH_MEDIUM;

export interface BriefPlacement {
  source: string;
  medium: typeof GROWTH_MEDIUM;
}

export interface VisitTag {
  campaign_source: string;
  campaign_medium: "referral";
}

type QueuedCommand = ArrayLike<unknown>;

declare global {
  interface Window {
    mmVisitTag?: VisitTag | null;
    dataLayer?: QueuedCommand[];
  }
}

/** The held tag as the brief request carries it, or undefined when nothing
 *  is held (no placement, another shape, or dropped on Decline). */
export function heldPlacement(): BriefPlacement | undefined {
  if (typeof window === "undefined") return undefined;
  const tag = window.mmVisitTag;
  if (!tag || !isGrowthPlacement(tag.campaign_source, tag.campaign_medium)) return undefined;
  return { source: tag.campaign_source, medium: GROWTH_MEDIUM };
}

/** Forget the tag: page memory and the queued `set` command alike. */
export function dropVisitTag(): void {
  if (typeof window === "undefined") return;
  const tag = window.mmVisitTag;
  window.mmVisitTag = null;
  if (!tag || !Array.isArray(window.dataLayer)) return;
  const layer = window.dataLayer;
  for (let index = layer.length - 1; index >= 0; index -= 1) {
    const command = layer[index];
    if (command && command[0] === "set" && command[1] === tag) layer.splice(index, 1);
  }
}
