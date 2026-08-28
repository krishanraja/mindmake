import { useState, useEffect, useRef, useCallback } from "react";
import { useDragDrum } from "@/hooks/useDragDrum";
import { publishableTestimonials, FAMILY_LABEL, type Testimonial } from "@/data/testimonials";
import { track } from "@/lib/analytics";

/**
 * Everyone who has worked with the founder, on a drum you can spin.
 *
 * Thirty-three quotes of wildly different lengths cannot share a rail, and the
 * fix for that is not a paraphrase. Each card shows a one-line excerpt that is
 * an exact substring of what the person wrote, and opens to the whole quote in
 * place. The physics lives in useDragDrum; this file is the card, the layout
 * and the keyboard.
 *
 * The card in the centre is the one being read, so it holds full contrast while
 * its neighbours recede. That falloff is computed from the drum's own index
 * rather than an observer, so it is correct at any offset, including mid-throw.
 */

const CARD = 296;
const GAP = 14;
const PITCH = CARD + GAP;

function Card({
  voice, dim, active, onOpen,
}: { voice: Testimonial; dim: boolean; active: boolean; onOpen: () => void }) {
  const [open, setOpen] = useState(false);
  const expandable = voice.excerpt !== voice.full;

  return (
    <article className={`mm-voice${open ? " is-open" : ""}${dim ? " is-dim" : ""}${active ? " is-centre" : ""}`}>
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
          onFocus={onOpen}
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

export function ProofDrum({ title = "People who have worked with Krish" }: { title?: string }) {
  const voices = publishableTestimonials;
  const frame = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(1200);

  /* The drum needs to know how wide it is to work out where the last card
     stops. ResizeObserver rather than a resize listener, because the container
     also changes width when a scrollbar appears. */
  useEffect(() => {
    const element = frame.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setViewport(entry.contentRect.width));
    observer.observe(element);
    setViewport(element.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const drum = useDragDrum({ pitch: PITCH, count: voices.length, viewport, drift: 16 });
  const perScreen = Math.max(1, Math.round(viewport / PITCH));

  /* Tabbing into a card that is off to the right should bring it in rather than
     leaving the reader looking at nothing. */
  const reveal = drum.reveal;
  const onCardFocus = useCallback((at: number) => {
    if (at < drum.index || at > drum.index + perScreen - 1) reveal(Math.max(0, at - 1));
  }, [drum.index, perScreen, reveal]);

  return (
    <div className="mm-drum-block">
      <div className="mm-drum-head">
        <h3>{title}</h3>
        <p className="mm-drum-hint">
          <span>{voices.length} of them. Drag it, or use the arrows.</span>
          <span className="mm-drum-arrows">
            <button type="button" aria-label="Previous" onClick={() => drum.step(-1)}>←</button>
            <button type="button" aria-label="Next" onClick={() => drum.step(1)}>→</button>
          </span>
        </p>
      </div>

      {/* The list is in document order and complete, so a reader who never
          touches the drum still meets all thirty-three in the right order. */}
      <div
        className={`mm-drum${drum.held ? " is-held" : ""}`}
        ref={frame}
        role="group"
        aria-label={`${title}: ${voices.length} quotes`}
        tabIndex={0}
        onKeyDown={drum.onKeyDown}
        onPointerDown={drum.onPointerDown}
        onPointerMove={drum.onPointerMove}
        onPointerUp={drum.onPointerUp}
        onPointerCancel={drum.onPointerUp}
      >
        <div className="mm-drum-track" ref={drum.track}>
          {voices.map((voice, at) => (
            <Card
              key={voice.id}
              voice={voice}
              active={at === drum.index}
              dim={at < drum.index || at > drum.index + perScreen - 1}
              onOpen={() => onCardFocus(at)}
            />
          ))}
        </div>
      </div>

      <p className="mm-drum-count">
        Every shortened quote is an exact extract of what the person wrote, and opens to the
        whole thing. Sessions, clients and career references are labelled, and they are not
        the same claim.
      </p>
    </div>
  );
}
