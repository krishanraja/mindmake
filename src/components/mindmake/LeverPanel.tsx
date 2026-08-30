import { useState } from "react";
import { Arrive } from "@/components/mindmake/Arrive";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * The four GTM levers as one panel, not four cards.
 *
 * The canon names four levers, product, price, positioning and people, and says
 * a client moves one of them. The page named three of them and left product
 * out, which made them look like a list of topics rather than the four things
 * there are. As four separate cards they also read as four separate offers.
 *
 * They are four dials on one instrument, so they are drawn as one: a single
 * frame, one hairline grid, four needles that swing together. The needles are
 * what tells you these are connected, because moving one moves the panel. Each
 * dial keeps its own resting angle so the panel is never symmetrical and never
 * reads as a chart of real numbers, which it is not and must not pretend to be.
 *
 * All four are present, labelled and readable at every scroll position. Only
 * the needle angles and the lit dial change, so a still page loses the sweep
 * and nothing else.
 */

interface Lever {
  name: string;
  title: string;
  body: string;
  /** Where this needle sits at rest, in degrees from straight up. */
  rest: number;
  /** How far it swings across the read. Different per dial, so they are not one object. */
  swing: number;
}

const LEVERS: Lever[] = [
  {
    name: "Product",
    title: "What you sell",
    rest: -46,
    swing: 62,
    body: "The thing itself can change now, not only the way you talk about it. We look at what AI lets your product do that it could not do last year, and what a customer would pay more for.",
  },
  {
    name: "Price",
    title: "What you charge",
    rest: -30,
    swing: 78,
    body: "The cost of doing the work is falling, and customers are starting to notice. We work out what that means for your margin and what your prices should assume next year.",
  },
  {
    name: "Positioning",
    title: "How you stand out",
    rest: -58,
    swing: 54,
    body: "Who else is selling to your customers now, what they are promising, and the clearest way to explain why you are the better choice.",
  },
  {
    name: "People",
    title: "Who does the selling",
    rest: -38,
    swing: 70,
    body: "The roles worth creating now, the people who do well in them, and the parts of selling your team can hand to AI this month.",
  },
];

export function LeverPanel() {
  const [at, setAt] = useState(1);
  const ref = useScrollDriver<HTMLDivElement>(setAt, "read");
  const lit = Math.min(LEVERS.length - 1, Math.floor(at * LEVERS.length));

  return (
    <div className="mm-levers" ref={ref}>
      {/* They arrive left to right as the panel is reached, which is also the
          order the needles are read in. The sweep itself is scroll-driven and
          unaffected: this is one animation on the article, and the needles turn
          from a custom property on a child. */}
      <Arrive stagger>
      {LEVERS.map((lever, index) => (
        <article className={`mm-lever${index === lit ? " is-lit" : ""}`} key={lever.name}>
          <div className="mm-lever-dial">
            <svg viewBox="0 0 64 64" aria-hidden="true">
              <circle className="mm-lever-face" cx="32" cy="32" r="27" />
              {/* Six ticks rather than a scale: enough to read as an
                  instrument, too few to be mistaken for a measurement. */}
              {[-70, -42, -14, 14, 42, 70].map((tick) => (
                <line
                  className="mm-lever-tick"
                  key={tick}
                  x1="32" y1="8" x2="32" y2="13"
                  transform={`rotate(${tick} 32 32)`}
                />
              ))}
              <g
                className="mm-lever-needle"
                style={{ "--rest": `${lever.rest}deg`, "--swing": `${lever.swing}deg` } as React.CSSProperties}
              >
                <line x1="32" y1="32" x2="32" y2="14" />
              </g>
              <circle className="mm-lever-pin" cx="32" cy="32" r="2.6" />
            </svg>
            {/* Beside the dial, not above the heading. It names the dial, which
                is the one thing a small label is still allowed to do. */}
            <span className="mm-lever-name">{lever.name}</span>
          </div>
          <h3>{lever.title}</h3>
          <p>{lever.body}</p>
        </article>
      ))}
      </Arrive>
    </div>
  );
}
