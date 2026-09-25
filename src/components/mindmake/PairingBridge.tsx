import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import { START_LABEL } from "@/lib/publicLinks";
import "@/styles/mindmake-pairing.css";

/**
 * How the two offer pages end: each points at the other, and at the brief.
 *
 * Ruling (Krish, 2026-09-25): the AI brain enables an AI GTM, and an AI GTM
 * runs better with an AI brain. Neither page body said so; the only way across
 * was the action bar's door, which stands down whenever a primary action is
 * on screen. So the pair is stated once, at the foot of each page, in words the
 * approved pages already use, beside the brief pre-routed to the page the
 * reader is on.
 *
 * The brief button carries `data-mm-primary`, so the action bar stands down
 * while it is on screen and the page never shows two ways in at once
 * (scripts/qa/one-way-in-check.mjs). The other page is a link: a reader who
 * follows it is browsing, not starting.
 */
const PAIRS = {
  brain: {
    title: "An AI brain gives your GTM something to run on.",
    body: "AI GTM turns an AI market shift into one tested commercial move. It moves faster when the judgement behind it is already written down.",
    to: "/ai-gtm",
    label: "Build your AI GTM",
  },
  gtm: {
    title: "Your GTM runs better on an AI brain.",
    body: "An AI brain gives your standards, context and past decisions a memory you can use, so each pricing, positioning and org call starts from what you already know.",
    to: "/ai-brain",
    label: "Build your AI brain",
  },
} as const;

export function PairingBridge({ route, onStart }: { route: keyof typeof PAIRS; onStart: () => void }) {
  const pair = PAIRS[route];
  return (
    <section className="mm-pairing" aria-labelledby="mm-pairing-title" data-pairing={route}>
      <div className="mm-pairing-inner">
        <div className="mm-pairing-other">
          <h2 id="mm-pairing-title">{pair.title}</h2>
          <p>{pair.body}</p>
          <Link
            className="mm-pairing-link"
            to={pair.to}
            onClick={() => track("door_click", { source: "pairing", to: pair.to })}
          >
            {pair.label} <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mm-pairing-start">
          <button
            className="mm-button"
            type="button"
            data-mm-primary
            onClick={() => {
              track("scoping_request", { source: "pairing", route });
              onStart();
            }}
          >
            {START_LABEL} <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
