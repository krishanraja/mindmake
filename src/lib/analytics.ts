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
