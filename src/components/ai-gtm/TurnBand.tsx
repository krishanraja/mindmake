export interface Door<M extends string> {
  mode: M;
  label: string;
  small: string;
}

/**
 * The one question the page asks: where the reader is starting from.
 *
 * It sits directly under the opening (owner ruling, 2026-10-24), so that
 * everything after it already speaks to the reader's own business: the four
 * places the change is felt, the team, and the result. Choosing never moves the
 * page, and every part that changes keeps its size, because each holds both
 * answers in the same place.
 */
export function TurnBand<M extends string>({ question, doors, mode, onMode }: {
  question: string;
  doors: readonly Door<M>[];
  mode: M;
  onMode: (mode: M) => void;
}) {
  return (
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
  );
}
