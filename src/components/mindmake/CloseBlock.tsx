import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { track } from "@/lib/analytics";

/**
 * How a page ends.
 *
 * One page, one place to enter details. On a page that already carries the
 * try-it panel, this block does not ask again: it points back to it. That was a
 * real defect rather than a preference. At the foot of /ai-gtm a phone reader
 * met three "Start here" buttons at once, plus an ask bar whose placeholder
 * said "Ask us anything" directly under body copy saying "Give us your company
 * address". The ask bar has moved to the questions, where a lookup belongs.
 */
interface CloseBlockProps {
  /** The ground it sits on, so the alternation survives to the foot of a page. */
  ground?: "raise";
  /** The mark above the claim, chosen for what this page's close promises. */
  instrument: InstrumentKind;
  /** The serif payoff. The only claim voice in this block. */
  claim: string;
  body?: string;
  /**
   * Where the page's one form already is. Given this, the block scrolls back to
   * it rather than opening a second way in. Pages with no panel of their own
   * pass `onStart` and get the button.
   */
  panelId?: string;
  onStart?: () => void;
}

export function CloseBlock({ claim, body, onStart, ground, instrument, panelId }: CloseBlockProps) {
  return (
    <section className={`mm-close${ground === "raise" ? " mm-on-raise" : ""}`}>
      <div className="mm-container">
        <Instrument kind={instrument} className="mm-close-mark" />
        <ScrubText className="mm-claim" text={claim} />
        {body && <p>{body}</p>}

        {panelId ? (
          <a
            className="mm-button"
            data-mm-primary
            href={`#${panelId}`}
            onClick={() => track("scoping_request", { source: "close_to_panel" })}
          >
            Take me back up <span aria-hidden="true">↑</span>
          </a>
        ) : (
          <button
            className="mm-button"
            data-mm-primary
            type="button"
            onClick={() => {
              track("scoping_request", { source: "close" });
              onStart?.();
            }}
          >
            Start here <span aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </section>
  );
}
