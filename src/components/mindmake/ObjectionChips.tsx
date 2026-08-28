import { useState } from "react";
import { track } from "@/lib/analytics";

export interface Objection {
  id: string;
  question: string;
  answer: string;
}

interface ObjectionChipsProps {
  /** Placed at the scroll moment the doubt occurs, not gathered into an FAQ. */
  objections: Objection[];
  label?: string;
}

export function ObjectionChips({ objections, label = "Questions people ask us" }: ObjectionChipsProps) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <h2 className="mm-objections-title">{label}</h2>
      <div className="mm-objections">
        {objections.map((objection) => {
          const isOpen = open === objection.id;
          return (
            <button
              key={objection.id}
              className="mm-objection"
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                setOpen(isOpen ? null : objection.id);
                if (!isOpen) track("objection_open", { objection: objection.id });
              }}
            >
              <span className="mm-objection-q">{objection.question}</span>
              {isOpen && <span className="mm-objection-a">{objection.answer}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
