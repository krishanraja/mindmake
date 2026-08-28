import { useState } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { CountingValue } from "@/components/mindmake/CountingValue";
import type { StoryFigure as Figure } from "@/data/rebuildProof";

/**
 * The diagram beside a story.
 *
 * Five shapes, drawn in the same language as the instrument set and carrying
 * only figures the story's own record holds. Nothing is rounded up or inferred:
 * a chart with an invented number in it is a lie with a chart around it.
 *
 * All five are scrubbed. Every part is in the DOM at full size from the first
 * paint, and scroll position moves how much of the comparison has resolved, so
 * the diagram assembles as you read down it and unwinds if you read back up.
 * That is a build, not an entrance: nothing starts absent and nothing waits for
 * an observer to fire. Reduced motion holds every one of them fully resolved.
 */

/** Two spans, long against short. A year on the wrong path, or one day. */
function Span({ figure, at }: { figure: Extract<Figure, { shape: "span" }>; at: number }) {
  /* The short span is drawn against the long one on a square-root scale. On a
     linear scale one day against a year is a hairline nobody can see, and the
     point of the picture is that the difference is enormous, not that it is
     invisible. No numerals: the record says "about a year" and "one day", and
     printing 365 would be precise where the record is not. The labels
     underneath say exactly what was recorded. */
  const share = Math.sqrt(figure.to / figure.from);
  return (
    <div className="mm-fig mm-fig-span">
      <span className="mm-fig-bar is-was" style={{ width: "100%" }} />
      <span
        className="mm-fig-bar is-now"
        style={{ width: `${Math.max(3, share * 100 * Math.min(1, at * 1.4))}%` }}
      />
      <p><span>{figure.fromLabel}</span><span>{figure.toLabel}</span></p>
    </div>
  );
}

/** A set narrowing, or widening. Fourteen vendors, three decisions. */
function Focus({ figure, at }: { figure: Extract<Figure, { shape: "focus" }>; at: number }) {
  const total = Math.max(figure.from, figure.to);
  const lit = figure.to;
  const resolved = Math.min(1, at * 1.5);
  return (
    <div className="mm-fig mm-fig-focus">
      <div className="mm-fig-marks" aria-hidden="true">
        {Array.from({ length: total }, (_, index) => {
          /* Marks resolve left to right as the reader arrives, and the ones
             that are not kept fade rather than vanish: eleven tools stopped is
             a fact about eleven things that existed, not about nothing. */
          const reached = index / total <= resolved;
          const kept = index < lit;
          return <i key={index} className={reached ? (kept ? "is-kept" : "is-dim") : ""} />;
        })}
      </div>
      <p className="mm-fig-pair">
        <b>{figure.from}</b>
        <span aria-hidden="true">→</span>
        <b><CountingValue value={figure.to} /></b>
      </p>
      <p><span>{figure.fromLabel}</span><span>{figure.toLabel}</span></p>
    </div>
  );
}

/** One figure standing on its own. Two pilots signed during the work. */
function Count({ figure }: { figure: Extract<Figure, { shape: "count" }> }) {
  return (
    <div className="mm-fig mm-fig-count">
      <p className="mm-fig-value"><CountingValue value={figure.value} /></p>
      <p className="mm-fig-label">{figure.label}</p>
      <p className="mm-fig-within">{figure.within}</p>
    </div>
  );
}

/**
 * A month of days, a few marked or most of them.
 *
 * No numeral anywhere in it. The record says "about once a month" and "most
 * days"; there is no figure in either, and inventing one to fill a chart is
 * the exact thing a proof page cannot do.
 */
function Cadence({ figure, at }: { figure: Extract<Figure, { shape: "cadence" }>; at: number }) {
  const resolved = Math.min(1, Math.max(0, (at - 0.1) * 1.7));
  const filled = Math.round(figure.from + (figure.to - figure.from) * resolved);
  return (
    <div className="mm-fig mm-fig-cadence">
      <div className="mm-fig-month" aria-hidden="true">
        {Array.from({ length: 28 }, (_, index) => (
          <i key={index} className={index % 28 < filled ? "is-on" : ""} />
        ))}
      </div>
      <p><span>{figure.fromLabel}</span><span>{figure.toLabel}</span></p>
    </div>
  );
}

/** No number in the record, so no number here. Loose marks becoming one shape. */
function Offer({ figure, at }: { figure: Extract<Figure, { shape: "offer" }>; at: number }) {
  const resolved = Math.min(1, Math.max(0, (at - 0.15) * 1.8));
  const scatter = [
    { x: 8, y: 30 }, { x: 26, y: 12 }, { x: 44, y: 38 },
    { x: 62, y: 18 }, { x: 80, y: 34 }, { x: 98, y: 22 },
  ];
  return (
    <div className="mm-fig mm-fig-offer">
      <svg viewBox="0 0 120 56" aria-hidden="true" preserveAspectRatio="none">
        <rect className="mm-fig-frame" x="4" y="8" width="112" height="40" rx="2" />
        {scatter.map((mark, index) => {
          /* Every mark travels from where it was towards one line. The frame is
             always drawn, so the picture is complete before it resolves. */
          const targetX = 14 + index * 18.6;
          const targetY = 28;
          return (
            <rect
              key={index}
              className={`mm-fig-mark${resolved > 0.85 ? " is-set" : ""}`}
              x={mark.x + (targetX - mark.x) * resolved}
              y={mark.y + (targetY - mark.y) * resolved}
              width={4 + 8 * resolved}
              height="4"
              rx="1"
            />
          );
        })}
      </svg>
      <p><span>{figure.before}</span><span>{figure.after}</span></p>
    </div>
  );
}

export function StoryFigureView({ figure }: { figure: Figure }) {
  const [at, setAt] = useState(1);
  const ref = useScrollDriver<HTMLDivElement>(setAt, "read");

  return (
    <div className="mm-fig-holder" ref={ref}>
      {figure.shape === "span" && <Span figure={figure} at={at} />}
      {figure.shape === "focus" && <Focus figure={figure} at={at} />}
      {figure.shape === "count" && <Count figure={figure} />}
      {figure.shape === "cadence" && <Cadence figure={figure} at={at} />}
      {figure.shape === "offer" && <Offer figure={figure} at={at} />}
    </div>
  );
}
