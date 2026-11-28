import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mountLiquidBrain } from "./journeyConstellation.mjs";

/** The six parts, shared with the 3D brain (BrainStage.tsx) and named by the homepage's ways cards. */
export const BRAIN_PARTS = [
  ["North Star", "What are you trying to make possible?", "The ambition you use to judge the next decision.", 50, 46],
  ["Vision", "What do you want to exist that does not exist yet?", "The change you want your work to bring about.", 43, 8],
  ["Judgement", "When two good things conflict, how do you choose?", "The trade you would make and the reason behind it.", 80, 32],
  ["Taste", "Which detail makes this feel right or wrong to you?", "The cut, word or silence you would keep.", 18, 29],
  ["Standards", "What must a piece of work earn before you release it?", "The test you put a finished piece through.", 39, 76],
  ["Preferences", "How do you usually like to work?", "The habits that make a good working day yours.", 82, 79],
] as const;
const parts = BRAIN_PARTS;

export function LiquidBrain() {
  const field = useRef<HTMLDivElement>(null);
  const renderer = useRef<ReturnType<typeof mountLiquidBrain>>();
  const [selected, setSelected] = useState<string>("North Star");
  const [confirmed, setConfirmed] = useState(false);
  const agreed = useRef(false);
  const selection = useRef(selected);
  useEffect(() => {
    const host = field.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    // The painted field needs canvas 2D and Path2D; where a browser (or a test
    // environment) has neither, the six parts stay as plain, working buttons.
    const canPaint = typeof Path2D !== "undefined" && Boolean(document.createElement("canvas").getContext?.("2d"));
    const mount = () => {
      renderer.current?.destroy();
      if (!canPaint) return;
      renderer.current = mountLiquidBrain(host, {
        ideas: parts.map(([id, , , x, y]) => ({ id, x, y, settled: id !== "Preferences" || agreed.current })),
        nodes: new Map(Array.from(host.querySelectorAll("button"), node => [node.textContent!, node])),
        initial: selection.current, reduced: motion.matches,
        onAdvance: setSelected,
      });
      // Keep the reader's question in view while the liquid field moves.
      renderer.current?.select(selection.current, true);
    };
    mount();
    motion.addEventListener("change", mount);
    return () => { renderer.current?.destroy(); motion.removeEventListener("change", mount); };
  }, []);
  return <div className="product-map">
    <div className="brain-field" ref={field} role="group" aria-label="Parts of your AI brain">
      {parts.map(([name, , , x, y]) => <button key={name} aria-pressed={selected === name}
        data-guess={name === "Preferences" ? (confirmed ? "confirmed" : "pending") : undefined}
        aria-description={name === "Preferences" ? (confirmed ? "Confirmed preference" : "Suggested preference") : undefined}
        aria-controls="brain-answer" style={{ "--x": x + "%", "--y": y + "%" } as CSSProperties}
        onClick={() => { selection.current = name; setSelected(name); renderer.current?.select(name, true); }}>{name}</button>)}
    </div>
    <div className="brain-answer" id="brain-answer" aria-live="polite">{parts.map(([name, question, answer]) =>
      <div key={name} aria-hidden={selected !== name}><h3>{question}</h3><p>{answer}</p>
        {name === "Preferences" && <button className="brain-confirm" type="button" disabled={confirmed}
          onClick={() => { agreed.current = true; setConfirmed(true); renderer.current?.confirm(name); }}>
          {confirmed ? "Confirmed" : "Confirm this preference"}
        </button>}
      </div>
    )}</div>
    <noscript><dl>{parts.slice(1).map(([name, question, answer]) => <div key={name}><dt>{name}</dt><dd>{question} {answer}</dd></div>)}</dl></noscript>
  </div>;
}
