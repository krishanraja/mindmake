import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { useDragDrum } from "@/hooks/useDragDrum";
import { REFLEX } from "@/content/reflex";

/**
 * Four objections, six centuries apart, as a deck you flick.
 *
 * The same shape as the client story index, and for the same reason: a deck is
 * one card at a time with the rest showing at its edge, which is how a reader
 * on a phone wants to meet four things in sequence. Each card is a date set
 * large, the thing that was resisted, and one line. The line is the whole
 * argument of the card, so there is nothing under it.
 *
 * The deck is only a deck once `useDragDrum` is driving it. With scripting off
 * it is four cards in a column, every one readable, in order.
 */

const PITCH = 150;

export function ReflexDeck() {
  const frame = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(PITCH);

  useEffect(() => {
    const element = frame.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setViewport(entry.contentRect.width));
    observer.observe(element);
    setViewport(element.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const write = useCallback((element: HTMLDivElement, offset: number) => {
    element.style.setProperty("--mm-deck-at", String(-offset / PITCH));
  }, []);

  const drum = useDragDrum({
    pitch: PITCH,
    count: REFLEX.length,
    viewport,
    drift: 0,
    write,
    /* A deck's travel is every card but the first, not a rail's
       `count * pitch - viewport`, which goes negative on a laptop and clamps
       the whole thing to a standstill. */
    span: (REFLEX.length - 1) * PITCH,
  });
  const at = drum.index;

  return (
    <div className="mm-index mm-reflex" ref={frame}>
      <div className="mm-index-head">
        <p className="mm-index-count">
          <b>{String(at + 1).padStart(2, "0")}</b>
          <span>of {String(REFLEX.length).padStart(2, "0")}</span>
        </p>
        <p className="mm-index-hint">
          <span className="mm-drum-arrows">
            <button type="button" aria-label="Previous" onClick={() => drum.step(-1)}>←</button>
            <button type="button" aria-label="Next" onClick={() => drum.step(1)}>→</button>
          </span>
        </p>
      </div>

      <div
        className={`mm-deck${drum.driven ? " is-driven" : ""}${drum.held ? " is-held" : ""}`}
        ref={drum.track}
        role="group"
        aria-label={`Four objections to new tools, ${REFLEX.length} of them`}
        tabIndex={0}
        onKeyDown={drum.onKeyDown}
        onPointerDown={drum.onPointerDown}
        onPointerMove={drum.onPointerMove}
        onPointerUp={drum.onPointerUp}
        onPointerCancel={drum.onPointerUp}
      >
        {REFLEX.map((beat, index) => {
          const behind = drum.driven && index !== at;
          return (
            <article
              className="mm-deck-card mm-reflex-card"
              key={beat.when}
              style={{ "--i": index, zIndex: REFLEX.length - Math.abs(index - at) } as CSSProperties}
              aria-hidden={behind || undefined}
              {...(behind ? ({ inert: "" } as { inert: string }) : {})}
            >
              <Instrument kind={beat.instrument} className="mm-reflex-mark" />
              {/* The date is the card's largest element and it is not a label:
                  it is the value on the axis this deck runs along. */}
              <p className="mm-reflex-when">{beat.when}</p>
              <h3>{beat.what}</h3>
              <p className="mm-reflex-line">{beat.line}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
