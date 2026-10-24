import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import "@/styles/mindmake-pairing.css";

/**
 * How the two offer pages end: this page's way in, then one quiet line to the
 * other page.
 *
 * Ruling (Krish, 2026-09-25): the AI brain enables an AI revenue engine, and an
 * AI revenue engine runs better with an AI brain, so each page says so once,
 * at its foot.
 *
 * Ruling (Krish, 2026-10-24): "an awesome call to action, but it needs to be
 * condensed, it shouldn't take up this much screen space." The card that held
 * the other service is now one line under this page's button, so the button is
 * the one thing a reader is asked to do and the other page is a link for a
 * reader who is still browsing.
 *
 * The button carries `data-mm-primary`, so the action bar stands down while it
 * is on screen and the page never shows two ways in at once
 * (scripts/qa/one-way-in-check.mjs).
 */
const PAIRS = {
  brain: {
    line: "Running a revenue team? An AI brain gives your revenue engine something to run on.",
    to: "/ai-gtm",
    label: "Build your AI revenue engine",
  },
  gtm: {
    line: "Your revenue engine runs better on an AI brain.",
    to: "/ai-brain",
    label: "Build your AI brain",
  },
} as const;

export function PairingBridge({ route, onStart, startLabel }: { route: keyof typeof PAIRS; onStart: () => void; startLabel: string }) {
  const pair = PAIRS[route];
  return (
    <div className="mm-pairing" data-pairing={route}>
      <button
        className="mm-button"
        type="button"
        data-mm-primary
        onClick={() => {
          track("scoping_request", { source: "pairing", route });
          onStart();
        }}
      >
        {startLabel} <span aria-hidden="true">→</span>
      </button>
      <p className="mm-pairing-line">
        <span>{pair.line}</span>{" "}
        <Link className="mm-pairing-link" to={pair.to} onClick={() => track("door_click", { source: "pairing", to: pair.to })}>
          {pair.label} <span aria-hidden="true">↗</span>
        </Link>
      </p>
    </div>
  );
}
