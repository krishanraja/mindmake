import { useEffect, useRef, useState, type CSSProperties } from "react";
import { LiquidBrain, BRAIN_PARTS } from "@/components/mindmake/LiquidBrain";
import type { BrainScene } from "@/lib/brainScene";

/**
 * The AI brain in 3D (Krish, 2026-11-28), with the six parts as the page's
 * own buttons laid over it: brain-field holds them, brain-answer says what the
 * chosen part means. The page chooses the part as the reader scrolls
 * (`active`); a tap chooses one too. The three.js scene loads only here, in
 * its own chunk, and only where WebGL runs; everywhere else the liquid Brain
 * (LiquidBrain.tsx) stands in, with the same buttons and answers.
 */
export function BrainStage({ active, onSelect }: { active: string; onSelect: (part: string) => void }) {
  const field = useRef<HTMLDivElement>(null);
  const scene = useRef<BrainScene>();
  const [mode, setMode] = useState<"pending" | "3d" | "flat">("pending");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const host = field.current;
    if (!host) return;
    void import("@/lib/brainScene").then(({ mountBrainScene, webglAvailable }) => {
      if (cancelled) return;
      if (!webglAvailable()) { setMode("flat"); return; }
      setMode("3d");
      const buttons = new Map(Array.from(host.querySelectorAll<HTMLButtonElement>("button[data-part]"), (node) => [node.dataset.part!, node]));
      scene.current = mountBrainScene(host, {
        parts: BRAIN_PARTS.map(([name]) => name),
        reduced: matchMedia("(prefers-reduced-motion: reduce)").matches,
        onLayout: (layout) => {
          for (const [name, place] of Object.entries(layout)) {
            const button = buttons.get(name);
            if (!button) continue;
            button.style.setProperty("--x", `${(place.x * 100).toFixed(2)}%`);
            button.style.setProperty("--y", `${(place.y * 100).toFixed(2)}%`);
            button.dataset.side = place.front ? "front" : "back";
          }
        },
        onReady: () => { if (!cancelled) setReady(true); },
      });
      scene.current.select(active);
    }).catch(() => { if (!cancelled) setMode("flat"); });
    return () => { cancelled = true; scene.current?.destroy(); scene.current = undefined; };
    // The scene mounts once; the active part follows in the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { scene.current?.select(active); }, [active]);

  if (mode === "flat") return <LiquidBrain />;

  return <div className="product-map brain-stage" data-ready={ready ? "" : undefined}>
    <div className="brain-field brain-field-3d" ref={field} role="group" aria-label="Parts of your AI brain">
      {BRAIN_PARTS.map(([name, , , x, y]) => <button key={name} data-part={name} aria-pressed={active === name}
        aria-controls="brain-answer" style={{ "--x": x + "%", "--y": y + "%" } as CSSProperties}
        onClick={() => onSelect(name)}>{name}</button>)}
    </div>
    <div className="brain-answer" id="brain-answer" aria-live="polite">{BRAIN_PARTS.map(([name, question, answer]) =>
      <div key={name} aria-hidden={active !== name}><h3>{question}</h3><p>{answer}</p></div>
    )}</div>
    <noscript><dl>{BRAIN_PARTS.slice(1).map(([name, question, answer]) => <div key={name}><dt>{name}</dt><dd>{question} {answer}</dd></div>)}</dl></noscript>
  </div>;
}
