/**
 * The one analytics choice, asked in two places.
 *
 * The page notice (`CookieConsent`) asks once the visitor leaves the first
 * screen. The brief asks on its own first screen (Ruling, Krish, 2026-10-28:
 * "Ask inside the brief"), because a brief opened straight away covers the
 * page and its notice. Both answer through the functions below, into the one
 * stored key, so there is one record of the choice and one way Google's tag
 * is loaded. While a brief is open the page notice stays away, so a visitor is
 * never asked twice at once.
 */
import { dropVisitTag } from "@/lib/visitTag";

export const CONSENT_KEY = "mindmake_consent";
/* "analytics" allows Google Analytics and "essential" declines it. Any stored
   value means the visitor has answered, including the older "accepted", which
   was given to a Plausible-only notice and is never read as a yes to Google. */
export const ALLOW = "analytics";
export const DECLINE = "essential";

declare global {
  interface Window {
    mmLoadGoogleTag?: () => void;
  }
}

export type ConsentSignal = "answered" | "brief";
type Listener = (signal: ConsentSignal) => void;

const listeners = new Set<Listener>();
let openBriefs = 0;

const signal = (kind: ConsentSignal) => {
  for (const listener of Array.from(listeners)) listener(kind);
};

export function onConsentSignal(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** True when an answer is stored. A blocked storage API reads as unanswered,
 *  so the question is still asked. */
export function consentStored(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) !== null;
  } catch {
    return false;
  }
}

function remember(choice: string) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Keep the choice for this page view when storage is unavailable.
  }
}

export function allowAnalytics() {
  remember(ALLOW);
  window.mmLoadGoogleTag?.();
  signal("answered");
}

export function declineAnalytics() {
  remember(DECLINE);
  /* A growth placement's tag is dropped with Google: neither Analytics nor
     a brief request started after this will carry it. */
  dropVisitTag();
  signal("answered");
}

/** The brief says when it opens and closes; the page notice waits meanwhile. */
export function setBriefOpen(open: boolean) {
  openBriefs = Math.max(0, openBriefs + (open ? 1 : -1));
  signal("brief");
}

export function briefIsOpen(): boolean {
  return openBriefs > 0;
}
