import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { StoryFigureView } from "@/components/mindmake/StoryFigure";
import { useDragDrum } from "@/hooks/useDragDrum";
import { clientStories, FIGURE_INSTRUMENT } from "@/data/rebuildProof";

/**
 * The proof, as a card index you flick.
 *
 * It was eight stories in a vertical stack, and on a 360px phone that section
 * ran 2.61 screens: the tallest thing on the site, and a reader scrolling past
 * five cards they were not reading to reach the end of one section. Nothing
 * else on the three main pages came close.
 *
 * A deck instead. One story fills the screen, the next two show behind it, and
 * the drum's own physics moves between them: the hand one to one on a drag, a
 * flick that travels further than a nudge, a spring onto the nearest card, and
 * resistance past either end. That is `useDragDrum`, unchanged. What is new is
 * that the offset lands on a custom property rather than a transform, so CSS
 * can put eight cards in one grid cell and place each by its distance from the
 * front. See the `write` option there.
 *
 * It does not drift. Every other drum on this site turns slowly when left
 * alone, and that is right for thirty-three quotes nobody is reading closely;
 * here it would change the sentence under a reader's eyes. The section still
 * has motion of its own, because a `StoryFigureView` is scrubbed rather than
 * revealed: it draws as you arrive at it and redraws on every card change.
 *
 * ## With nothing running
 *
 * A deck is eight cards in one grid cell, which with no JavaScript is eight
 * stories printed on top of each other. So the deck is what the drum switches
 * to once it has taken control, exactly as `.mm-drum` is a plain scroller until
 * then, and the default is the vertical stack this replaced. A crawler and a
 * reader with scripting off get all eight, in order, whole.
 */

/**
 * The pitch, in pixels of drag per card.
 *
 * A rail's pitch is a card width, because that is how far a card travels. A
 * deck has nowhere to travel, so this is the one number here chosen rather than
 * measured: how far a thumb moves to turn one card. 150px is about a
 * comfortable flick on a phone and two thirds of one on a laptop trackpad.
 */
const PITCH = 150;

export function StoryIndex() {
  const stories = clientStories;
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

  /* The offset, as a distance in cards from the front of the deck. Every card
     knows its own position and subtracts this, which is the whole layout. */
  const write = useCallback((element: HTMLDivElement, offset: number) => {
    element.style.setProperty("--mm-deck-at", String(-offset / PITCH));
  }, []);

  /* Every card but the first, because a deck has nowhere to travel and its
     frame's width is not a bound on anything. Without this it borrows a rail's
     `count * pitch - viewport`, which on a laptop is negative and clamps the
     whole deck to a standstill. */
  const drum = useDragDrum({
    pitch: PITCH,
    count: stories.length,
    viewport,
    drift: 0,
    write,
    span: (stories.length - 1) * PITCH,
  });
  const at = drum.index;

  return (
    <div className="mm-index" ref={frame}>
      <div className="mm-index-head">
        <p className="mm-index-count">
          <b>{String(at + 1).padStart(2, "0")}</b>
          <span>of {String(stories.length).padStart(2, "0")}</span>
        </p>
        <p className="mm-index-hint">
          <span className="mm-drum-arrows">
            <button type="button" aria-label="Previous story" onClick={() => drum.step(-1)}>←</button>
            <button type="button" aria-label="Next story" onClick={() => drum.step(1)}>→</button>
          </span>
        </p>
      </div>

      <div
        className={`mm-deck${drum.driven ? " is-driven" : ""}${drum.held ? " is-held" : ""}`}
        ref={drum.track}
        role="group"
        aria-label={`Client stories: ${stories.length} of them`}
        tabIndex={0}
        onKeyDown={drum.onKeyDown}
        onPointerDown={drum.onPointerDown}
        onPointerMove={drum.onPointerMove}
        onPointerUp={drum.onPointerUp}
        onPointerCancel={drum.onPointerUp}
      >
        {stories.map((story, index) => {
          const behind = drum.driven && index !== at;
          return (
            <article
              className="mm-deck-card"
              key={story.id}
              style={{ "--i": index, zIndex: stories.length - Math.abs(index - at) } as CSSProperties}
              /* A card behind the front one is still in the markup and still
                 read in order by anything that does not paint. What it is not
                 is a tab stop, or a second story announced over the one being
                 read. `inert` is a real attribute React 18 passes through as a
                 string; React 19 types it as a boolean. */
              aria-hidden={behind || undefined}
              {...(behind ? ({ inert: "" } as { inert: string }) : {})}
            >
              <h3>
                <Instrument kind={FIGURE_INSTRUMENT[story.figure.shape]} className="mm-head-mark" />
                <span>{story.title}</span>
              </h3>
              <StoryFigureView figure={story.figure} />
              <blockquote>{story.quote}</blockquote>
              <cite>{story.attribution}</cite>
            </article>
          );
        })}
      </div>
    </div>
  );
}
