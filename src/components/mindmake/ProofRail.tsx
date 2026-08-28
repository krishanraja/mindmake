import { useState, useRef, useCallback } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { publishableTestimonials, FAMILY_LABEL, type Testimonial } from "@/data/testimonials";
import { track } from "@/lib/analytics";

/**
 * Thirty-three voices on one rail.
 *
 * Every card shows a one-line excerpt, which is an exact substring of what the
 * person wrote, and opens to the full quote on a tap. That is what lets quotes
 * of four words and quotes of four sentences sit on the same rail without any
 * of them being rewritten.
 *
 * Three mechanics, so the choice can be made by looking rather than by
 * description. All three keep the same card, the same data and the same expand.
 *
 * - `columns` scrolls three columns upward at slightly different speeds and
 *   slows to a stop under the pointer.
 * - `ticker` runs three horizontal rows in alternating directions.
 * - `scrub` holds everything still until you scroll, then offsets the columns
 *   by scroll position, so the movement is yours and reverses when you go back.
 */
export type RailMechanic = "columns" | "ticker" | "scrub";

interface ProofRailProps {
  mechanic?: RailMechanic;
  /** Heading for the section. Omitted inside the lab, where each rail is labelled. */
  title?: string;
  lede?: string;
}

const COLUMN_COUNT = 3;

/** Deals the voices round-robin so each column mixes the four families. */
function deal(voices: Testimonial[], columns: number): Testimonial[][] {
  const lanes: Testimonial[][] = Array.from({ length: columns }, () => []);
  voices.forEach((voice, index) => lanes[index % columns].push(voice));
  return lanes;
}

function QuoteCard({ voice }: { voice: Testimonial }) {
  const [open, setOpen] = useState(false);
  /* An excerpt that is already the whole quote has nothing to open. */
  const expandable = voice.excerpt !== voice.full;

  return (
    <article className={`mm-voice${open ? " is-open" : ""}`}>
      <blockquote>{open ? voice.full : voice.excerpt}</blockquote>
      <p className="mm-voice-by">
        {voice.name && <b>{voice.name}</b>}
        <span>{voice.role}</span>
        <i>{FAMILY_LABEL[voice.family]}</i>
      </p>
      {expandable && (
        <button
          type="button"
          className="mm-voice-more"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
            if (!open) track("testimonial_expand", { id: voice.id });
          }}
        >
          {open ? "Show less" : "Read it all"}
        </button>
      )}
    </article>
  );
}

/** One scroll-driven column. Its offset is a fraction of the rail's progress. */
function ScrubColumn({ voices, depth }: { voices: Testimonial[]; depth: number }) {
  const [progress, setProgress] = useState(0.5);
  const ref = useScrollDriver<HTMLDivElement>(setProgress, "read");
  return (
    <div
      className="mm-rail-column"
      ref={ref}
      style={{ transform: `translate3d(0, ${(0.5 - progress) * depth}px, 0)` }}
    >
      {voices.map((voice) => <QuoteCard key={voice.id} voice={voice} />)}
    </div>
  );
}

export function ProofRail({ mechanic = "columns", title, lede }: ProofRailProps) {
  const voices = publishableTestimonials;
  const lanes = deal(voices, COLUMN_COUNT);
  const [held, setHeld] = useState(false);
  const frame = useRef<HTMLDivElement>(null);

  /* A rail that keeps moving while somebody is reading a quote is a rail that
     takes the quote away from them. Pointer and keyboard both hold it. */
  const hold = useCallback(() => setHeld(true), []);
  const release = useCallback(() => setHeld(false), []);

  return (
    <section className="mm-block mm-on-raise" aria-labelledby={title ? "proof-rail-title" : undefined}>
      <div className="mm-container">
        {title && <h2 id="proof-rail-title">{title}</h2>}
        {lede && <p className="mm-lede" style={{ marginTop: 10 }}>{lede}</p>}

        <div
          className={`mm-rail is-${mechanic}${held ? " is-held" : ""}`}
          ref={frame}
          onMouseEnter={hold}
          onMouseLeave={release}
          onFocusCapture={hold}
          onBlurCapture={release}
        >
          {mechanic === "scrub"
            ? lanes.map((lane, index) => (
                <ScrubColumn key={index} voices={lane} depth={index === 1 ? -70 : 70} />
              ))
            : lanes.map((lane, index) => (
                <div className="mm-rail-column" key={index} style={{ "--mm-lane": index } as React.CSSProperties}>
                  {/* Doubled so the loop has somewhere to go. The copy is
                      hidden from assistive technology: one reading is enough. */}
                  <div className="mm-rail-run">
                    {lane.map((voice) => <QuoteCard key={voice.id} voice={voice} />)}
                  </div>
                  <div className="mm-rail-run" aria-hidden="true">
                    {lane.map((voice) => <QuoteCard key={`${voice.id}-loop`} voice={voice} />)}
                  </div>
                </div>
              ))}
        </div>

        <p className="mm-rail-count">
          {voices.length} people, in their own words. Every shortened quote is an exact
          extract of what they wrote.
        </p>
      </div>
    </section>
  );
}
