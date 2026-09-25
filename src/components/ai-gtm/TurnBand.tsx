import { Unbroken } from "./Unbroken";

export interface Door<M extends string> {
  mode: M;
  label: string;
  small: string;
}

/**
 * The turn: the offer, as the answer to the four places and the workaround
 * before it, and then the one question the page asks.
 *
 * The two doors sit here, after the service has been explained, and not
 * before it. Choosing one changes the promise above it and the three
 * chapters after it; it never moves the page.
 */
export function TurnBand<M extends string>({ heading, accent, promise, question, doors, mode, onMode }: {
  heading: string;
  accent: string;
  promise: string;
  question: string;
  doors: readonly Door<M>[];
  mode: M;
  onMode: (mode: M) => void;
}) {
  return (
    <section className="gtm-turn mm-on-paper" data-gtm-chapter="turn" aria-labelledby="gtm-turn-title">
      <div className="gtm-turn-body mm-container">
        <div className="gtm-turn-offer">
          <h2 id="gtm-turn-title" className="gtm-turn-title"><Unbroken text={heading} /> <em><Unbroken text={accent} /></em></h2>
          <p className="gtm-turn-promise" aria-live="polite"><Unbroken text={promise} /></p>
        </div>
        <fieldset className="gtm-doors mode-switch">
          <legend className="gtm-doors-question">{question}</legend>
          {doors.map((door) => (
            <label key={door.mode} className="gtm-door" data-active={door.mode === mode}>
              <input type="radio" name="gtm-business" value={door.mode} checked={door.mode === mode} onChange={() => onMode(door.mode)} />
              <span className="gtm-door-mark" aria-hidden="true" />
              <span className="gtm-door-text">
                <b>{door.label}</b>
                <small>{door.small}</small>
              </span>
            </label>
          ))}
        </fieldset>
      </div>
    </section>
  );
}
