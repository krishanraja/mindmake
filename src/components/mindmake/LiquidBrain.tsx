import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mountLiquidBrain } from "./journeyConstellation.mjs";

const parts = [
  ["North Star", "What are you trying to make possible?", "The ambition you use to judge the next decision.", 50, 46],
  ["Vision", "What do you want to exist that does not exist yet?", "The change you want your work to bring about.", 43, 8],
  ["Judgement", "When two good things conflict, how do you choose?", "The trade you would make and the reason behind it.", 80, 32],
  ["Taste", "Which detail makes this feel right or wrong to you?", "The cut, word or silence you would keep.", 18, 29],
  ["Standards", "What must a piece of work earn before you release it?", "The test you put a finished piece through.", 39, 76],
  ["Preferences", "How do you usually like to work?", "The habits that make a good working day yours.", 82, 79],
] as const;

export function LiquidBrain() {
  const field = useRef<HTMLDivElement>(null);
  const renderer = useRef<ReturnType<typeof mountLiquidBrain>>();
  const [selected, setSelected] = useState<string>("North Star");
  const selection = useRef(selected);
  useEffect(() => {
    const host = field.current!;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const mount = () => {
      renderer.current?.destroy();
      renderer.current = mountLiquidBrain(host, {
        ideas: parts.map(([id, , , x, y]) => ({ id, x, y, settled: id !== "Preferences" })),
        nodes: new Map(Array.from(host.querySelectorAll("button"), node => [node.textContent!, node])),
        initial: selection.current, reduced: motion.matches,
        onAdvance: setSelected,
      });
      // Keep the reader's question in view while the liquid field moves.
      renderer.current.select(selection.current, true);
    };
    mount();
    motion.addEventListener("change", mount);
    return () => { renderer.current?.destroy(); motion.removeEventListener("change", mount); };
  }, []);
  return <div className="product-map">
    <div className="brain-field" ref={field} role="group" aria-label="Parts of your AI brain">
      {parts.map(([name, , , x, y]) => <button key={name} aria-pressed={selected === name}
        aria-controls="brain-answer" style={{ "--x": x + "%", "--y": y + "%" } as CSSProperties}
        onClick={() => { selection.current = name; setSelected(name); renderer.current?.select(name, true); }}>{name}</button>)}
    </div>
    <div className="brain-answer" id="brain-answer" aria-live="polite">{parts.map(([name, question, answer]) =>
      <div key={name} aria-hidden={selected !== name}><h3>{question}</h3><p>{answer}</p></div>
    )}</div>
    <noscript><dl>{parts.slice(1).map(([name, question, answer]) => <div key={name}><dt>{name}</dt><dd>{question} {answer}</dd></div>)}</dl></noscript>
  </div>;
}
