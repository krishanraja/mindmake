import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A drum you can spin with your thumb.
 *
 * The site's world is instruments and card indexes, so the carousel behaves
 * like a weighted drum rather than a slideshow. Four states, and each one is
 * physical rather than decorative:
 *
 * - **drift.** Left alone it turns slowly at a constant rate, reversing at the
 *   ends. This is the ambient layer: it never stops and it means nothing.
 * - **drag.** A pointer down stops the drum dead and it tracks the hand one to
 *   one. This is the touch layer, and it answers in the same frame.
 * - **throw.** On release the drum keeps the speed you gave it and loses it to
 *   friction. A flick travels further than a nudge, which is the whole point.
 * - **snap.** Below walking pace it springs to the nearest card and settles,
 *   then hands back to drift.
 *
 * Past either end the drum resists instead of stopping, and springs back when
 * released. That resistance is what tells a hand where the end is.
 *
 * Haptics fire once per card crossing the centre, on touch only, and only after
 * this person has actually touched the drum. A device that buzzes at a reader
 * who never touched it is broken.
 *
 * Reduced motion removes the drift, the throw and the spring. Dragging still
 * moves the drum and the arrows still step it, both landing directly on a card,
 * so every card stays reachable and nothing animates on its own.
 *
 * And it reports whether it has actually taken control, because everything
 * above depends on a transform this hook writes. Until it has, the drum has to
 * be an ordinary horizontal scroller: `.mm-drum` was `overflow: hidden` from
 * the start, so with scripting off it showed one card and clipped the rest with
 * no scrollbar and no way to reach them. Measured on the questions drum, that
 * was one card of eight and 2,308px of answers.
 */

type Mode = "drift" | "drag" | "throw" | "snap";

interface DrumOptions {
  /** Card pitch in pixels: card width plus gap. Snap targets are multiples. */
  pitch: number;
  count: number;
  /** Visible width, so the last card stops at the right edge and no further. */
  viewport: number;
  /** Pixels per second the drum turns when nobody is touching it. */
  drift?: number;
  /**
   * How the offset reaches the page. Defaults to translating the track.
   *
   * The rail is one way to show a drum and the deck in `StoryIndex` is another:
   * eight cards in one grid cell, the front one whole and the rest behind it,
   * which is the card index this world already talks about. Both want the same
   * physics, and a second copy of the drift, the throw and the spring would be
   * a second set of constants to drift apart.
   */
  write?: (element: HTMLDivElement, offset: number) => void;
}

/** Frame-rate independent decay: the fraction of velocity surviving `dt`. */
const decay = (perSecond: number, dt: number) => Math.pow(perSecond, dt);

const FRICTION = 0.05;   // of velocity surviving one second of coasting
const SPRING = 150;      // stiffness towards a snap target
const DAMPING = 21;      // just past critical, so it settles without a bounce
const RUBBER = 0.32;     // how much of a pull past the end actually moves it
const SETTLE = 30;       // px/s below which a throw hands over to the spring

export function useDragDrum({ pitch, count, viewport, drift = 16, write }: DrumOptions) {
  const track = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const velocity = useRef(0);
  const mode = useRef<Mode>("drift");
  /** Where the spring is pulling to. Null means "the nearest card". */
  const target = useRef<number | null>(null);
  const heading = useRef(-1);
  const pointer = useRef({ id: -1, x: 0, time: 0 });
  const touched = useRef(false);
  const centred = useRef(0);
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  /* An effect rather than a check for `window`, so the first client render
     matches the server's and hydration has nothing to disagree about. */
  const [driven, setDriven] = useState(false);
  useEffect(() => setDriven(true), []);

  const span = Math.max(0, count * pitch - viewport);
  const reduced = typeof window !== "undefined"
    && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const clamp = useCallback((value: number) => Math.max(-span, Math.min(0, value)), [span]);
  const nearest = useCallback((at: number) => clamp(Math.round(at / pitch) * pitch), [clamp, pitch]);

  const paint = useCallback(() => {
    if (track.current) {
      if (write) write(track.current, offset.current);
      else track.current.style.transform = `translate3d(${offset.current}px, 0, 0)`;
    }
    const at = pitch === 0 ? 0 : Math.round(clamp(offset.current) / -pitch);
    if (at !== centred.current) {
      centred.current = at;
      setIndex(at);
      /* One short tick per card, for a hand that started this, and only while
         that hand's action is still playing out. The drift crosses a card every
         nineteen seconds, and buzzing at somebody who put the phone down twenty
         seconds ago is a device that appears to be broken. */
      if (touched.current && !reduced && mode.current !== "drift") navigator.vibrate?.(7);
    }
  }, [clamp, pitch, reduced, write]);

  /* One loop for every state. An earlier version ran drift, throw and spring as
     separate loops, and handing over between them dropped velocity at each
     boundary, which is precisely where the motion has to stay continuous. */
  useEffect(() => {
    if (reduced || span === 0) { paint(); return; }
    let frame = 0;
    let last = performance.now();

    const run = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      if (mode.current !== "drag") {
        const past = offset.current > 0 ? 0 : offset.current < -span ? -span : null;

        if (past !== null && mode.current !== "snap") {
          /* Let go past an end and the end always wins, whatever the throw. */
          mode.current = "snap";
          target.current = past;
        }

        if (mode.current === "throw") {
          velocity.current *= decay(FRICTION, dt);
          offset.current += velocity.current * dt;
          if (Math.abs(velocity.current) < SETTLE) {
            mode.current = "snap";
            target.current = null;
          }
        } else if (mode.current === "snap") {
          const to = target.current ?? nearest(offset.current);
          const gap = to - offset.current;
          velocity.current += (gap * SPRING - velocity.current * DAMPING) * dt;
          offset.current += velocity.current * dt;
          if (Math.abs(gap) < 0.5 && Math.abs(velocity.current) < 8) {
            offset.current = to;
            velocity.current = 0;
            target.current = null;
            mode.current = "drift";
          }
        } else {
          /* Drift. It reverses at the ends rather than stopping, which on a
             drum this long is a direction change nobody will be here to see. */
          offset.current += heading.current * drift * dt;
          if (offset.current <= -span) { offset.current = -span; heading.current = 1; }
          if (offset.current >= 0) { offset.current = 0; heading.current = -1; }
        }
        paint();
      }
      frame = requestAnimationFrame(run);
    };

    frame = requestAnimationFrame(run);
    return () => cancelAnimationFrame(frame);
  }, [drift, nearest, paint, reduced, span]);

  const onPointerDown = useCallback((event: React.PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    mode.current = "drag";
    velocity.current = 0;
    target.current = null;
    if (event.pointerType === "touch") touched.current = true;
    pointer.current = { id: event.pointerId, x: event.clientX, time: performance.now() };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    setHeld(true);
  }, []);

  const onPointerMove = useCallback((event: React.PointerEvent) => {
    if (mode.current !== "drag" || event.pointerId !== pointer.current.id) return;
    const now = performance.now();
    const dx = event.clientX - pointer.current.x;
    const dt = Math.max(1, now - pointer.current.time) / 1000;
    /* Velocity from the most recent move only. Averaging a longer window let a
       flick that ended in a pause still throw, which is not what the hand did. */
    velocity.current = dx / dt;
    const raw = offset.current + dx;
    offset.current = raw > 0 ? raw * RUBBER
      : raw < -span ? -span + (raw + span) * RUBBER
      : raw;
    pointer.current = { id: event.pointerId, x: event.clientX, time: now };
    paint();
  }, [paint, span]);

  const onPointerUp = useCallback((event: React.PointerEvent) => {
    if (event.pointerId !== pointer.current.id) return;
    setHeld(false);
    if (reduced) {
      mode.current = "drift";
      offset.current = nearest(offset.current);
      paint();
      return;
    }
    /* A slow release settles where it is; a flick coasts first. */
    mode.current = Math.abs(velocity.current) < SETTLE ? "snap" : "throw";
    if (mode.current === "snap") target.current = null;
  }, [nearest, paint, reduced]);

  /** Move exactly one card, from wherever the drum currently is. */
  const step = useCallback((direction: -1 | 1) => {
    const to = clamp((centred.current + direction) * -pitch);
    if (reduced) {
      offset.current = to;
      paint();
      return;
    }
    velocity.current = 0;
    target.current = to;
    mode.current = "snap";
  }, [clamp, paint, pitch, reduced]);

  const onKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") { event.preventDefault(); step(1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); step(-1); }
  }, [step]);

  /** Bring a card to the centre, so tabbing to it does not leave it offscreen. */
  const reveal = useCallback((at: number) => {
    const to = clamp(at * -pitch);
    if (reduced) { offset.current = to; paint(); return; }
    velocity.current = 0;
    target.current = to;
    mode.current = "snap";
  }, [clamp, paint, pitch, reduced]);

  return { track, index, held, reduced, driven, onPointerDown, onPointerMove, onPointerUp, onKeyDown, step, reveal };
}
