import { useEffect, useRef, useState } from "react";
import { Arrive } from "@/components/mindmake/Arrive";
import { Instrument } from "@/components/mindmake/Instrument";
import { AskBar } from "@/components/mindmake/AskBar";
import { useDragDrum } from "@/hooks/useDragDrum";
import { ASK_ENTRIES, type AskEntry } from "@/lib/askCorpus";

/**
 * The questions, on the same drum the testimonials use.
 *
 * They come from `src/content/answers.json` by id, which is the same corpus the
 * ask bar and /faq read. They used to be hand-copied into each page, and the
 * copies had already drifted: four answers said one thing on a page and another
 * in the corpus. There is one source now, so that cannot happen again.
 *
 * The ask bar sits underneath, because this is the section where answering a
 * question belongs. It used to live in the close block, directly under copy
 * asking for a company address, which made a lookup box look like a lead form.
 */

const CARD = 320;
const GAP = 14;
const PITCH = CARD + GAP;

interface QuestionsProps {
  /** Ids from the corpus, in the order this page wants them asked. */
  ask: string[];
  label?: string;
}

/**
 * A question and its answer, both readable without tapping anything.
 *
 * The first version clamped the answer to three lines and expanded on tap,
 * which grew the whole row: every card in the rail got taller while the ones
 * nobody opened kept their truncation and gained dead space underneath. These
 * answers are two to eight lines. Showing them costs a taller card and saves an
 * interaction nobody needed.
 */
function QuestionCard({ entry, dim }: { entry: AskEntry; dim: boolean }) {
  return (
    <article className={`mm-question${dim ? " is-dim" : ""}`}>
      <h3 className="mm-question-q">{entry.question}</h3>
      <p className="mm-question-a">{entry.answer}</p>
    </article>
  );
}

export function ObjectionChips({ ask, label = "Questions people ask us" }: QuestionsProps) {
  const entries = ask
    .map((id) => ASK_ENTRIES.find((entry) => entry.id === id))
    .filter((entry): entry is AskEntry => Boolean(entry));
  const frame = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState(1200);

  useEffect(() => {
    const element = frame.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(([entry]) => setViewport(entry.contentRect.width));
    observer.observe(element);
    setViewport(element.getBoundingClientRect().width);
    return () => observer.disconnect();
  }, []);

  const drum = useDragDrum({ pitch: PITCH, count: entries.length, viewport, drift: 13 });
  const perScreen = Math.max(1, Math.round(viewport / PITCH));

  return (
    <div className="mm-questions">
      {/* The head arrives; the cards do not, and that is deliberate. A reveal
          is triggered by an element's vertical position, and these thirty-odd
          cards all share one: reaching the section would fire every card at
          once, including the twenty off to the right that nobody has scrolled
          to yet. The drum already drifts on its own, so the cards are the part
          of this section that was never still. */}
      <Arrive>
      <div className="mm-drum-head">
        <h2 className="mm-objections-title">
          <Instrument kind="flap" className="mm-head-mark" />{label}
        </h2>
        <p className="mm-drum-hint">
          <span>{entries.length} of them. Drag it, or use the arrows.</span>
          <span className="mm-drum-arrows">
            <button type="button" aria-label="Previous question" onClick={() => drum.step(-1)}>←</button>
            <button type="button" aria-label="Next question" onClick={() => drum.step(1)}>→</button>
          </span>
        </p>
      </div>
      </Arrive>

      <div className="mm-drum-stage">
        <div
          className={`mm-drum is-questions${drum.held ? " is-held" : ""}`}
          ref={frame}
          role="group"
          aria-label={`${label}: ${entries.length} questions`}
          tabIndex={0}
          onKeyDown={drum.onKeyDown}
          onPointerDown={drum.onPointerDown}
          onPointerMove={drum.onPointerMove}
          onPointerUp={drum.onPointerUp}
          onPointerCancel={drum.onPointerUp}
        >
          <div className="mm-drum-track" ref={drum.track}>
            {entries.map((entry, at) => (
              <QuestionCard
                key={entry.id}
                entry={entry}
                dim={at < drum.index || at > drum.index + perScreen - 1}
              />
            ))}
          </div>
        </div>
      </div>

      <AskBar />
    </div>
  );
}
