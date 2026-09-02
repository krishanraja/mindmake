import { useState } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * Fifteen strips becoming one.
 *
 * The Agatha story in a picture: fifteen reports arriving as fifteen files,
 * nobody joining them up, then one view. Fifteen thin paper strips on the left
 * bend into a single bar on the right, and a mint mark sits at the point where
 * the agent noticed the gap. Scroll position moves how far they have converged,
 * so the figure assembles as the reader passes it and unwinds if they go back.
 *
 * Every element is in the SVG at full size from the first paint and the
 * geometry is the same with scripting off; only `--mm-p` moves. The numbers are
 * the story's own: fifteen in, one out.
 */

const STRIPS = 15;
const W = 320;
const H = 150;

export function ConvergeFigure() {
  const [at, setAt] = useState(1);
  const ref = useScrollDriver<HTMLDivElement>(setAt, "read");
  const resolved = Math.min(1, at * 1.3);

  return (
    <div className="mm-converge" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        {Array.from({ length: STRIPS }, (_, index) => {
          const y0 = 10 + (index * (H - 20)) / (STRIPS - 1);
          const y1 = H / 2 + (y0 - H / 2) * (1 - resolved);
          /* Each strip leaves its own row and lands on the centre line; the
             later strips wait a little longer, so the fold reads as a motion
             rather than a snap. */
          const bend = 110 + (index % 3) * 16;
          return (
            <path
              key={index}
              className="mm-converge-strip"
              d={`M0 ${y0} H${bend} C${bend + 40} ${y0} ${bend + 50} ${y1} ${bend + 90} ${y1} H${W}`}
            />
          );
        })}
        <path className="mm-converge-one" d={`M${W - 88} ${H / 2} H${W}`} style={{ opacity: resolved }} />
        <circle className="mm-converge-mark" cx={W - 92} cy={H / 2} r={4.5} style={{ opacity: resolved }} />
      </svg>
      <p className="mm-converge-key" aria-hidden="true">
        <span>15 reports</span>
        <span>1 view</span>
      </p>
    </div>
  );
}
