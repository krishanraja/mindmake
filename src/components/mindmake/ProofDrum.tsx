import { useState, useEffect, useRef, useCallback } from "react";
import { useDragDrum } from "@/hooks/useDragDrum";
import { CountingValue } from "@/components/mindmake/CountingValue";
import { publishableTestimonials, FAMILY_LABEL, type Testimonial } from "@/data/testimonials";
import { track } from "@/lib/analytics";

/**
 * Everyone who has worked with the founder, on a drum you can spin.
 *
 * Thirty-three quotes of wildly different lengths cannot share a rail, and the
 * fix for that is not a paraphrase. Each card shows a one-line excerpt that is
 * an exact substring of what the person wrote, and the whole quote opens over
 * the rail. The physics lives in useDragDrum; this file is the card, the
 * layout, the keyboard and the panel.
 *
 * Every card is the same height and its three rows line up with its
 * neighbours', because a rail of ragged cards reads as broken. That is enforced
 * by scripts/qa/card-geometry-check.mjs rather than trusted.
 */

const CARD = 296;
const GAP = 14;
const PITCH = CARD + GAP;

function Attribution({ voice }: { voice: Testimonial }) {
  return (
    <p className="mm-voice-by">
      {voice.name && <b>{voice.name}</b>}
      <span>{voice.role}</span>
      <i>{FAMILY_LABEL[voice.family]}</i>
    </p>
  );
}

/**
 * One card, always the same size.
 *
 * Three grid rows and the quote takes the slack, which is what puts the
 * attribution and the button on the same line across every card. A card with
 * nothing to expand keeps an empty footer row rather than standing shorter than
 * the cards beside it.
 */
function Card({
  voice, dim, active, open, onOpen, onFocusCard,
}: {
  voice: Testimonial;
  dim: boolean;
  active: boolean;
  open: boolean;
  onOpen: () => void;
  onFocusCard: () => void;
}) {
  const expandable = voice.excerpt !== voice.full;

  return (
    <article className={`mm-voice${open ? " is-open" : ""}${dim ? " is-dim" : ""}${active ? " is-centre" : ""}`}>
      <blockquote>{voice.excerpt}</blockquote>
      <Attribution voice={voice} />
      <p className="mm-voice-foot">
        {expandable && (
          <button
            type="button"
            className="mm-voice-more"
            aria-expanded={open}
            data-voice={voice.id}
            onFocus={onFocusCard}
            onClick={onOpen}
          >
            Read it all
          </button>
        )}
      </p>
    </article>
  );
}

export function ProofDrum({ title = "People who have worked with Krish" }: { title?: string }) {
  const voices = publishableTestimonials;
  const frame = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(1200);
  const [openId, setOpenId] = useState<string | null>(null);
  const opened = voices.find((voice) => voice.id === openId) ?? null;

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

  const close = useCallback(() => {
    const id = openId;
    setOpenId(null);
    if (id) {
      /* Focus goes back to the button that opened it, not to the top of the
         page, which is where it lands if nobody puts it anywhere. */
      requestAnimationFrame(() => {
        frame.current?.querySelector<HTMLButtonElement>(`[data-voice="${id}"]`)?.focus();
      });
    }
  }, [openId]);

  useEffect(() => {
    if (!opened) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.stopPropagation(); close(); }
    };
    const onDown = (event: PointerEvent) => {
      if (!panel.current?.contains(event.target as Node)) setOpenId(null);
    };
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onDown);
    /* preventScroll, because the panel covers the rail the reader is already
       looking at. Without it the browser scrolls to bring the focused box fully
       into view and the page jumps under them. */
    panel.current?.focus({ preventScroll: true });
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [opened, close]);

  return (
    <div className="mm-drum-block">
      <div className="mm-drum-head">
        <h3>{title}</h3>
        <p className="mm-drum-hint">
          <span><CountingValue value={voices.length} /> of them. Drag it, or use the arrows.</span>
          <span className="mm-drum-arrows">
            <button type="button" aria-label="Previous" onClick={() => drum.step(-1)}>←</button>
            <button type="button" aria-label="Next" onClick={() => drum.step(1)}>→</button>
          </span>
        </p>
      </div>

      {/* The list is in document order and complete, so a reader who never
          touches the drum still meets all thirty-three in the right order. */}
      <div className="mm-drum-stage">
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
                open={voice.id === openId}
                onFocusCard={() => onCardFocus(at)}
                onOpen={() => {
                  setOpenId(voice.id);
                  track("testimonial_expand", { id: voice.id });
                }}
              />
            ))}
          </div>
        </div>

        {/* Outside the drum on purpose. The drum clips horizontally, and a box
            that clips on one axis computes the other to auto, so a panel inside
            it would be trapped and scrollbarred the moment a quote ran long. */}
        {opened && (
          <div
            className="mm-voice-panel"
            ref={panel}
            tabIndex={-1}
            role="dialog"
            aria-label={`The whole quote from ${opened.name ?? opened.role}`}
          >
            <blockquote>{opened.full}</blockquote>
            <Attribution voice={opened} />
            <button type="button" className="mm-voice-more" onClick={close}>Close</button>
          </div>
        )}
      </div>

      <p className="mm-drum-count">
        Every shortened quote is an exact extract of what the person wrote, and opens to the
        whole thing. Sessions, clients and career references are labelled, and they are not
        the same claim.
      </p>
    </div>
  );
}
