import { Arrive } from "@/components/mindmake/Arrive";
import { Instrument, type InstrumentKind } from "@/components/mindmake/Instrument";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * Two parts of one process, on one track.
 *
 * They were two cards side by side, which says these are two things you pick
 * between. They are not. The first is finite and the second is open-ended, and
 * the second only exists because the first happened. So there is one line: it
 * starts at a hard cap, runs solid to the handover, then continues dashed and
 * leaves the right-hand edge without ever stopping. The shape of the line is
 * the sentence.
 *
 * The dashes drift rightward on their own, which is the ambient layer and is
 * what an open-ended thing looks like when nobody is watching. A marker travels
 * the whole line with scroll position, so the reader's own progress and the
 * process's are the same movement. The line is complete from first paint and
 * nothing about it fills.
 */

export interface TrackPart {
  instrument: InstrumentKind;
  title: string;
  /** One line under the title. Optional, because where the line would only
      describe the shape of the track, the track already says it. */
  line?: string;
  body: string;
}

interface ProcessTrackProps {
  /** The finite half. Drawn solid, with a cap at its start. */
  first: TrackPart;
  /** The open half. Drawn dashed, and it runs off the edge on purpose. */
  second: TrackPart;
}

export function ProcessTrack({ first, second }: ProcessTrackProps) {
  const ref = useScrollDriver<HTMLDivElement>(undefined, "read");

  return (
    <div className="mm-track" ref={ref}>
      <svg className="mm-track-line" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
        {/* Two paths rather than one dash pattern, because the join is the
            point: solid and capped on the left, dashed and uncapped on the
            right. preserveAspectRatio is off so the line spans any width; only
            horizontal geometry lives in here, so nothing distorts. */}
        <path className="mm-track-solid" d="M2 12 H150" />
        <path className="mm-track-open" d="M150 12 H300" />
        <path className="mm-track-cap" d="M2 4 V20" />
        <path className="mm-track-join" d="M150 5 V19" />
      </svg>

      <div className="mm-track-marker" aria-hidden="true" />

      {/* The finite half, then the open one. The line and its marker are drawn
          from first paint and never wait on this, so the shape of the sentence
          is intact whether or not the two cards ever arrive. */}
      <div className="mm-track-parts">
        <Arrive stagger>
        {[first, second].map((part, index) => (
          <article className={`mm-track-part${index === 0 ? " is-first" : ""}`} key={part.title}>
            <Instrument kind={part.instrument} />
            <h3>{part.title}</h3>
            {part.line && <p className="mm-shape-line">{part.line}</p>}
            <p>{part.body}</p>
          </article>
        ))}
        </Arrive>
      </div>
    </div>
  );
}
