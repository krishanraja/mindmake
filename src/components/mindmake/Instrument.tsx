import { useId } from "react";

/**
 * The instrument set.
 *
 * Six hand-drawn marks from the world the films live in: a chart-room gauge, a
 * pen recorder, a split-flap, a card drawer, a sheet rail, a level stack. No
 * icon library, and nothing that could have come from one. They are built on
 * the same 48 unit grid at the same stroke weight, with exactly one mint part
 * each, so the six read as one set the first time you see two of them together.
 *
 * Every one of them moves, and the movement obeys the motion law rather than
 * decorating around it. There is no draw-on: a stroke that animates its own
 * dash offset from nothing is entrance choreography, and the state it starts in
 * is absent. Each instrument is instead complete at first paint and then does
 * the slow, meaningless thing the real object would do while nobody is looking
 * at it: a needle drifts, a drum turns, a flap falls, a card rises, sheets
 * travel, a light climbs. That is the ambient layer, and it is what keeps a
 * section of cards from being a still page.
 *
 * Reduced motion stops all six dead. They lose nothing by stopping, because
 * none of them was carrying meaning in the movement.
 */

export type InstrumentKind = "gauge" | "recorder" | "flap" | "drawer" | "rail" | "levels";

interface InstrumentProps {
  kind: InstrumentKind;
  /** Announced only where the instrument is the sole content of its cell. */
  label?: string;
  className?: string;
}

/** A dial and a needle that never quite settles. Price, and what it costs. */
function Gauge() {
  return (
    <>
      <path d="M8 34a16 16 0 0 1 32 0" />
      <path d="M8 34h32" />
      {[0, 1, 2, 3, 4].map((at) => {
        const angle = Math.PI - (at / 4) * Math.PI;
        const x = 24 + Math.cos(angle) * 13;
        const y = 34 - Math.sin(angle) * 13;
        const x2 = 24 + Math.cos(angle) * 10;
        const y2 = 34 - Math.sin(angle) * 10;
        return <path key={at} d={`M${x.toFixed(1)} ${y.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}`} />;
      })}
      <g className="mm-i-needle">
        <path className="mm-i-hot" d="M24 34L24 20" />
      </g>
      <circle cx="24" cy="34" r="2" />
    </>
  );
}

/**
 * A paper drum under a stylus, drawing a trace that never stops. Product.
 *
 * The trace has to be clipped to the drum face, and a CSS clip-path cannot do
 * it: on an SVG child the reference box is that element's own bounding box, so
 * an inset in pixels clipped the whole trace away rather than the drum edges.
 * A real clipPath in user space is the thing that works, and it needs an id
 * that stays unique when two recorders are on one page.
 */
function Recorder({ id }: { id: string }) {
  return (
    <>
      <defs>
        <clipPath id={id} clipPathUnits="userSpaceOnUse">
          <rect x="8" y="19" width="32" height="18" />
        </clipPath>
      </defs>
      <rect x="7" y="18" width="34" height="20" rx="2" />
      <path d="M7 24h34M7 32h34" />
      <g clipPath={`url(#${id})`}>
        <path className="mm-i-hot mm-i-trace" d="M-13 30c4-6 6 4 10-1s6 5 10 0 6-7 10-2 6 4 10-1 6 4 10-1 6 5 10 0 6-7 10-2" />
      </g>
      <path d="M30 18V10h4" />
      <circle cx="35" cy="10" r="1.6" />
    </>
  );
}

/** One leaf of a split-flap, caught falling. Positioning, and how it changes. */
function Flap() {
  return (
    <>
      <rect x="10" y="12" width="28" height="24" rx="2" />
      <path d="M10 24h28" />
      <path d="M14 8v4M34 8v4" />
      <g className="mm-i-leaf">
        <path className="mm-i-hot" d="M10 24h28v9a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" />
      </g>
      <path d="M10 40h28" />
    </>
  );
}

/** A cabinet with one card standing proud of the rest. The brain remembering. */
function Drawer() {
  return (
    <>
      <rect x="8" y="16" width="32" height="24" rx="2" />
      <path d="M8 26h32M8 33h32" />
      <path d="M20 21h8M20 29.5h8M20 36.5h8" />
      <g className="mm-i-card">
        <path className="mm-i-hot" d="M17 16V7h14v9" />
        <path className="mm-i-hot" d="M20 10h8" />
      </g>
    </>
  );
}

/**
 * Sheets travelling a rail to a raised gate. People, and the work handed over.
 *
 * The first version drew them as flat blocks lying on the line and read as
 * nothing at all at forty pixels. Upright sheets and a gate with a lifted bar
 * is the same idea and legible at the size it is actually used.
 */
function Rail() {
  return (
    <>
      <path d="M4 34h40" />
      <path d="M4 38h40" />
      {/* Travelling towards the gate, and drawn so the run never reaches the
          post or the end of the rail. No clip needed, which is the point: an
          SVG clip-path here would resolve against this group's own box. */}
      <g className="mm-i-run">
        <path d="M12 34V21h6v13" />
        <path d="M22 34V21h6v13" />
        <path className="mm-i-hot" d="M32 34V21h6v13" />
      </g>
      <path d="M40 34V15" />
      <path d="M35 15h9" />
    </>
  );
}

/** Three levels with the light climbing. The ladder, and the habit. */
function Levels() {
  return (
    <>
      <path d="M9 40h30" />
      <rect x="10" y="30" width="8" height="10" />
      <rect x="20" y="23" width="8" height="17" />
      <rect x="30" y="14" width="8" height="26" />
      <g className="mm-i-climb">
        <rect className="mm-i-hot mm-i-fill" x="10" y="30" width="8" height="10" />
      </g>
    </>
  );
}

const SHAPES: Record<InstrumentKind, (props: { id: string }) => JSX.Element> = {
  gauge: Gauge,
  recorder: Recorder,
  flap: Flap,
  drawer: Drawer,
  rail: Rail,
  levels: Levels,
};

export function Instrument({ kind, label, className = "" }: InstrumentProps) {
  const Shape = SHAPES[kind];
  const id = useId();
  return (
    <svg
      className={`mm-i mm-i-${kind} ${className}`.trim()}
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <Shape id={`mm-i-${id}`} />
    </svg>
  );
}
