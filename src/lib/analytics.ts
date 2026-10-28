/**
 * Site analytics.
 *
 * Plausible is already loaded site-wide (see index.html) and skips localhost,
 * so this is a thin, fail-quiet wrapper over its custom-event API. Every call
 * is best effort: analytics must never block or break an interaction.
 *
 * The event list is the one the rebuild brief specifies. scoping_request is the
 * north star; everything else is diagnostic.
 */

export type MindmakeEvent =
  | "door_click"
  | "fork_pick"
  | "objection_open"
  | "ask_submit"
  | "journey_gtm_start"
  | "journey_gtm_complete"
  | "journey_brain_read"
  | "journey_brain_email"
  | "board_item_click"
  | "scoping_request"
  | "testimonial_expand"
  | "substack_click"
  /* A dead end that offered a person, and one that a person was asked for. */
  | "handoff_offer"
  | "handoff_request";

type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export function track(event: MindmakeEvent, props?: EventProps): void {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // Analytics is never allowed to surface an error to a visitor.
  }
}

/**
 * The brief's steps, for Google Analytics.
 *
 * Sent only once the visitor has allowed Google Analytics on this page:
 * `mmGoogleTagLoaded` is set by `mmLoadGoogleTag` in `index.html`, which runs
 * for a stored "analytics" choice or from the notice's Allow, and never
 * otherwise. Nothing is queued before that, so a step taken before Allow is
 * never sent later. Every value comes from the fixed lists below: never a
 * name, an address, a company or anything typed. Which of these count as key
 * events is set in the Analytics property, not here.
 */
export type BriefEvent = "brief_open" | "brief_step" | "brief_submit";
export const BRIEF_ROUTES = ["home", "brain", "gtm"] as const;
export const BRIEF_STEPS = ["company", "profile", "reading", "pressure", "capacity", "preview", "contact", "verify", "success"] as const;
export type BriefStepId = (typeof BRIEF_STEPS)[number];

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    mmGoogleTagLoaded?: boolean;
  }
}

export function trackBrief(event: BriefEvent, route: string, step?: string): void {
  if (typeof window === "undefined" || window.mmGoogleTagLoaded !== true || typeof window.gtag !== "function") return;
  if (!(BRIEF_ROUTES as readonly string[]).includes(route)) return;
  if (event === "brief_step" && !(BRIEF_STEPS as readonly string[]).includes(step ?? "")) return;
  try {
    window.gtag("event", event, event === "brief_step" ? { brief_route: route, brief_step: step } : { brief_route: route });
  } catch {
    // Analytics is never allowed to surface an error to a visitor.
  }
}
