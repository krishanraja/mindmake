import { ReactNode } from "react";

interface StepSceneProps {
  index: number;
  name: string;
  title: string;
  body: string;
  note?: string;
  tone: "ink" | "forest" | "paper";
  visual: ReactNode;
  id?: string;
}

/* One numbered section of a journey. The step mark is the full-bleed
   background numeral and nothing else: it is composed behind the content at
   every width and may never reappear as a small label. The copy block and
   the visual share the stage above it. */
export function StepScene({ index, name, title, body, note, tone, visual, id }: StepSceneProps) {
  return (
    <section className="mm-step" data-mm-step data-tone={tone} aria-label={`Step ${index}. ${name}`} id={id}>
      <div className="mm-step-stage">
        <div className="mm-step-numeral" aria-hidden="true">
          <span data-glyph={index}>{index}</span>
        </div>
        <div className="mm-step-copy">
          <h2>{title}</h2>
          <p>{body}</p>
          {note ? <strong className="mm-step-note">{note}</strong> : null}
        </div>
        <div className="mm-step-visual">{visual}</div>
      </div>
    </section>
  );
}
