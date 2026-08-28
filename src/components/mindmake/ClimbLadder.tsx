import { useState } from "react";
import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * Three levels of working with AI, as a climb rather than three cards in a row.
 *
 * They were three equal cards side by side, which reads as three peers you
 * choose between. They are not peers: they are a ladder, and the whole point of
 * the section is that the third one is where the work compounds. So the steps
 * ascend, and a lamp climbs the staircase as you read.
 *
 * The section holds still while the climb happens, so the climb costs one screen
 * rather than three. `pin` gives the lamp exactly the hold as its range.
 *
 * What moves and what does not, because the difference is the whole motion law:
 * the lamp's *position* changes and each step's *accent* warms as it arrives.
 * Nothing fills, nothing is drawn on, nothing is dimmed to the point of being
 * hard to read, and no bar tracks the scrollbar. Every word is at full contrast
 * at every scroll position, so a visitor who never moves, or who asked for
 * reduced motion and gets the finished state, has lost nothing but the climb.
 */

interface Level {
  instrument: InstrumentKind;
  title: string;
  body: string;
}

const LEVELS: Level[] = [
  {
    instrument: "flap",
    title: "You use AI",
    body: "You ask, it answers, and tomorrow it has forgotten. Useful, and it never adds up.",
  },
  {
    instrument: "rail",
    title: "You direct AI",
    body: "You hand work over, check it and ship it. Good work, and every task starts from nothing.",
  },
  {
    instrument: "drawer",
    title: "It builds on itself",
    body: "It remembers, it learns what good looks like to you, and the hours it saves go back into your best work.",
  },
];

export function ClimbLadder({ title }: { title: string }) {
  const [at, setAt] = useState(1);
  const ref = useScrollDriver<HTMLDivElement>(setAt, "pin");
  /* Which step the lamp is standing on. Only ever changes an accent, so a
     wrong-by-one at a boundary costs nothing. */
  const standing = Math.min(LEVELS.length - 1, Math.floor(at * LEVELS.length));

  return (
    <div className="mm-climb" ref={ref}>
      <div className="mm-climb-pin">
        <h2 id="ladder-title">{title}</h2>

        <div className="mm-climb-stage">
          {/* The staircase is the cards. An SVG stair drawn above them could
              not be made to line up: an SVG scales in its own coordinate system
              and the cards are DOM boxes, so the two only agreed at one window
              width and left a dead band between them at every other. The cards
              carry their own tread and riser now, and the lamp climbs the line
              between the first card's top corner and the last one's, which is
              exact at every width because both ends are the same two numbers
              the cards are offset by. */}
          <span className="mm-climb-lamp" aria-hidden="true" />

          <ol className="mm-climb-steps">
            {LEVELS.map((level, index) => (
              <li
                className={`mm-climb-step${index === standing ? " is-lit" : ""}`}
                key={level.title}
                style={{ "--riser": index } as React.CSSProperties}
              >
                <Instrument kind={level.instrument} />
                <h3>{level.title}</h3>
                <p>{level.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
