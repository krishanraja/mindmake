import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { ScrubText } from "@/components/mindmake/ScrubText";
import { track } from "@/lib/analytics";

import type { BriefRoute } from "@/components/mindmake/leadDelivery";

/**
 * How a page ends.
 *
 * One page, one place to enter details. On a page that already carries the
 * try-it panel, this block does not ask again: it points back to it. That was a
 * real defect rather than a preference. At the foot of /ai-gtm a phone reader
 * met three "Start here" buttons at once, plus an ask bar whose placeholder
 * said "Ask us anything" directly under body copy saying "Give us your company
 * address". The ask bar has moved to the questions, where a lookup belongs.
 *
 * ## The fork, from 1 September 2026
 *
 * On the homepage the one button is now two, and they are the two doors by
 * name. The reason is that the choice was already being made and the visitor
 * was not being asked: `BriefRoute` is `home | brain | gtm`, `LeadBrief` holds
 * a different set of four pressure questions for each, and every `Start here`
 * passed no route at all, so everyone got a generic set belonging to neither
 * door.
 *
 * This is still one way in. The rule it keeps is that the two are adjacent, in
 * one control group, reading as one decision rather than as two competing
 * offers on the same screen. `scripts/qa/one-way-in-check.mjs` holds exactly
 * that shape and fails two primary actions anywhere else on a page.
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
  onStart?: (route?: BriefRoute) => void;
  /**
   * The two doors instead of one button, as one control group.
   *
   * Only the homepage sets this. The door pages already know which door a
   * reader is standing in, so asking again there would be a question with an
   * obvious answer.
   */
  fork?: boolean;
}

/** The two doors, by the names the canon gives them. */
const DOORS: ReadonlyArray<{ route: BriefRoute; label: string }> = [
  { route: "brain", label: "Build your AI brain" },
  { route: "gtm", label: "Build your AI GTM" },
];

export function CloseBlock({ claim, body, onStart, ground, instrument, panelId, fork }: CloseBlockProps) {
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
        ) : fork ? (
          /* One decision, two answers. The group is labelled, so a screen
             reader meets the question before the options rather than two
             unrelated buttons. */
          <div className="mm-fork-go" role="group" aria-label="Pick the door to start with">
            {DOORS.map((door) => (
              <button
                className="mm-button"
                data-mm-primary
                type="button"
                key={door.route}
                onClick={() => {
                  track("scoping_request", { source: "close", door: door.route });
                  onStart?.(door.route);
                }}
              >
                {door.label} <span aria-hidden="true">→</span>
              </button>
            ))}
          </div>
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
