import { PointerEvent as ReactPointerEvent, ReactNode, useEffect, useRef, useState } from "react";
import { clamp, ease, pinProgress } from "@/components/mindmake/journeyMath";

export interface TimelineState {
  day: 30 | 60 | 90;
  standing: string;
  body: string;
}

interface CompoundingTimelineProps {
  title: string;
  intro: string;
  ariaLabel: string;
  states: [TimelineState, TimelineState, TimelineState];
  visual: ReactNode;
  tone?: "ink" | "forest" | "paper";
}

const DAYS = [30, 60, 90] as const;

/* The sixth beat: one system growing past day thirty. Scroll carries the
   timeline forward and back until the visitor touches it; from the first
   tap or drag the timeline is theirs and scroll leaves it alone. Day 30 is
   the only state anyone can start. */
export function CompoundingTimeline({ title, intro, ariaLabel, states, visual, tone = "ink" }: CompoundingTimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(0);
  const settledRef = useRef(false);
  const tweenRef = useRef(0);
  const dragRef = useRef<{ pointerId: number; startX: number; startValue: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const applyValue = (value: number) => {
    const section = sectionRef.current;
    if (!section) return;
    const next = clamp(value, 0, 2);
    valueRef.current = next;
    section.style.setProperty("--mm-timeline-blend", next.toFixed(4));
    section.style.setProperty("--mm-timeline-b1", clamp(next).toFixed(4));
    section.style.setProperty("--mm-timeline-b2", clamp(next - 1).toFixed(4));
    const index = Math.round(next);
    section.dataset.timelineDay = String(DAYS[index]);
    if (activeIndexRef.current !== index) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const settle = () => {
    settledRef.current = true;
    sectionRef.current?.classList.add("is-owned");
  };

  const tweenTo = (target: number) => {
    window.cancelAnimationFrame(tweenRef.current);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      applyValue(target);
      return;
    }
    const from = valueRef.current;
    const start = performance.now();
    const duration = 340;
    const play = (now: number) => {
      const amount = clamp((now - start) / duration);
      applyValue(from + (target - from) * ease(amount));
      if (amount < 1) tweenRef.current = window.requestAnimationFrame(play);
    };
    tweenRef.current = window.requestAnimationFrame(play);
  };

  const chooseDay = (index: number) => {
    settle();
    tweenTo(index);
  };

  const onDayKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let target: number | null = null;
    if (event.key in moves) target = clamp(activeIndexRef.current + moves[event.key], 0, 2);
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = 2;
    if (target === null) return;
    event.preventDefault();
    chooseDay(target);
    const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button");
    buttons?.[target]?.focus();
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const panel = panelRef.current;
    if (!panel || (event.pointerType === "mouse" && event.button !== 0)) return;
    settle();
    window.cancelAnimationFrame(tweenRef.current);
    dragRef.current = { pointerId: event.pointerId, startX: event.clientX, startValue: valueRef.current };
    panel.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const panel = panelRef.current;
    if (!drag || !panel || drag.pointerId !== event.pointerId) return;
    const width = Math.max(120, panel.clientWidth - 48);
    applyValue(drag.startValue + ((event.clientX - drag.startX) / width) * 2);
  };

  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    panelRef.current?.releasePointerCapture(event.pointerId);
    tweenTo(Math.round(valueRef.current));
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (settledRef.current || dragRef.current) return;
      if (reduceMotion.matches) {
        applyValue(Math.round(valueRef.current));
        return;
      }
      /* On layouts where the stage stands in flow instead of pinning, the
         buttons and the drag own the timeline and scroll leaves it alone. */
      const stage = section.firstElementChild as HTMLElement | null;
      if (!stage || getComputedStyle(stage).position !== "sticky") return;
      const progress = pinProgress(section);
      applyValue(clamp((progress - .18) / .72) * 2);
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    applyValue(0);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduceMotion.addEventListener?.("change", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(tweenRef.current);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener?.("change", schedule);
    };
  }, []);

  return (
    <section className="mm-timeline" data-tone={tone} data-timeline-day="30" aria-label={ariaLabel} ref={sectionRef}>
      <div className="mm-timeline-stage">
        <div className="mm-timeline-copy">
          <h2>{title}</h2>
          <p className="mm-timeline-intro">{intro}</p>

          <div className="mm-timeline-days" role="radiogroup" aria-label="Move through the first three months">
            {states.map((state, index) => (
              <button
                key={state.day}
                type="button"
                role="radio"
                aria-checked={index === activeIndex}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => chooseDay(index)}
                onKeyDown={onDayKeyDown}
              >
                Day {state.day}
              </button>
            ))}
          </div>

          <div className="mm-timeline-statebook">
            {states.map((state, index) => (
              <div key={state.day} className="mm-timeline-state" aria-hidden={index === activeIndex ? undefined : true} data-state-active={index === activeIndex ? "true" : undefined}>
                <h3>Day {state.day}. {state.standing}</h3>
                <p>{state.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mm-timeline-panel"
          ref={panelRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerEnd}
          onPointerCancel={onPointerEnd}
        >
          {visual}
          <div className="mm-timeline-rail" aria-hidden="true">
            <i className="mm-timeline-rail-fill" />
            <b data-tick="30">30</b>
            <b data-tick="60">60</b>
            <b data-tick="90">90</b>
          </div>
        </div>
      </div>
    </section>
  );
}
