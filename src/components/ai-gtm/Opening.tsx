import type { ReactNode } from "react";
import { track } from "@/lib/analytics";

/**
 * The first screen: the proposition, the change behind it, and the one way in.
 *
 * Ruling (owner, 2026-10-24): "Make your pricing, positioning and team
 * AI-native" is the top headline of this page, leading with the urgency the owner
 * liked in the old opening ("I like leading with the urgency") rather than
 * burying the offer under it. The button carries `data-mm-hero`, so the site's
 * action bar waits until it has scrolled away, and `data-mm-primary`, so the
 * bar stands down while it is on screen.
 *
 * The films on this page loop, so the reader can pause them here (WCAG 2.2.2),
 * as they can on /new-age-leadership and /ai-brain.
 */
export function Opening({ heading, accent, lede, startLabel, startNote, onStart, film, paused, onToggleMotion }: {
  heading: string;
  accent: string;
  lede: string;
  startLabel: string;
  startNote: string;
  onStart: () => void;
  film: ReactNode;
  paused: boolean;
  onToggleMotion: () => void;
}) {
  return (
    <section className="gtm-opening" data-gtm-chapter="opening" aria-labelledby="page-title">
      {film}
      <div className="gtm-opening-body mm-container">
        <div className="gtm-opening-copy">
          <h1 id="page-title">{heading} <em>{accent}</em></h1>
          <p className="gtm-opening-deck">{lede}</p>
          <div className="gtm-start">
            <button
              type="button"
              className="mm-button"
              data-mm-primary
              data-mm-hero
              onClick={() => {
                track("scoping_request", { source: "hero", route: "gtm" });
                onStart();
              }}
            >
              {startLabel} <span aria-hidden="true">→</span>
            </button>
            <small className="gtm-start-note">{startNote}</small>
          </div>
        </div>
        <button type="button" className="gtm-motion" aria-pressed={paused} onClick={onToggleMotion}>
          <i aria-hidden="true" />
          <span>{paused ? "Play motion" : "Pause motion"}</span>
        </button>
      </div>
    </section>
  );
}
