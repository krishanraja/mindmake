import { useState, useEffect, useRef, useCallback } from "react";
import { useDragDrum } from "@/hooks/useDragDrum";
import { publishableTestimonials, FAMILY_LABEL, type Testimonial, type TestimonialFamily } from "@/data/testimonials";
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
/**
 * How wide a card is, which is not always 296px.
 *
 * A drum is meant to show part of the next card, and on a laptop it does: four
 * cards and a wide slice of a fifth, which reads as a rail that continues.
 * On a phone the frame is 350px, so that slice is 54px, which is a column of
 * half-words rather than a card. Counted across the three main pages at 390px,
 * that one screen held six of the site's eighteen sentences cut mid-word, more
 * than any other screen on the site.
 *
 * So below the width where a neighbour is worth seeing, one card fills the
 * frame. The drag, the throw, the snap and the edge mask are all unchanged.
 */
const PEEK = CARD * 1.4 + GAP;
const cardFor = (viewport: number) => (viewport < PEEK ? Math.max(220, viewport - GAP) : CARD);

/**
 * Who said it, and which of the three families it belongs to.
 *
 * Two rows, stated in the markup rather than left to wrapping. The family used
 * to be a bordered chip that wrapped onto a fourth line, and the attribution
 * row is a fixed 52px with `overflow: hidden`, so on any card where the role
 * ran to two lines the label was simply cut in half: "CAREER REFERENCE" showing
 * as a sliced band of letters on the cards of the people who wrote it.
 *
 * It sits beside the name now, which is one line whatever the role does. The
 * label stays, because the canon is that a session attendee is never read as a
 * client, but it is not a badge: three families of proof have to be told apart,
 * and that does not need a box drawn round it.
 */
function Attribution({ voice }: { voice: Testimonial }) {
  return (
    <p className="mm-voice-by">
      <span className="mm-voice-who">
        {voice.name && <b>{voice.name}</b>}
        <i>{FAMILY_LABEL[voice.family]}</i>
      </span>
      <span className="mm-voice-role">{voice.role}</span>
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

export function ProofDrum({
  title = "People who have worked with Krish",
  headingId,
  families,
}: {
  title?: string;
  headingId?: string;
  /** Which families to show. Every family when absent; the archive shows all 33. */
  families?: readonly TestimonialFamily[];
}) {
  const voices = families ? publishableTestimonials.filter((voice) => families.includes(voice.family)) : publishableTestimonials;
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

  const card = cardFor(viewport);
  const pitch = card + GAP;
  const drum = useDragDrum({ pitch, count: voices.length, viewport, drift: 16 });
  const perScreen = Math.max(1, Math.round(viewport / pitch));

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
        <h3 id={headingId}>{title}</h3>
        {/* The arrows alone. "33 of them." beside the heading was a count with
            no noun, and the drum's own label already carries it. */}
        <p className="mm-drum-hint">
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
          className={`mm-drum${drum.driven ? " is-driven" : ""}${drum.held ? " is-held" : ""}`}
          style={{ "--mm-card": `${card}px` } as React.CSSProperties}
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

      {/* No note under the drum. It said every excerpt opens to the whole
          quote, which the button on every card is, and that sessions, clients
          and references are labelled, which the label on every card is. */}
    </div>
  );
}
