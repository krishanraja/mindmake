import { ScrollMark } from "@/components/mindmake/ScrollMark";

export interface CompareColumn {
  title: string;
  explain?: string;
  cells: [string, string, string, string];
  emphasis?: boolean;
}

interface WorkingUnderstandingCompareProps {
  tone: "ink" | "forest" | "paper";
  intro: string;
  rows: [string, string, string, string];
  columns: [CompareColumn, CompareColumn, CompareColumn, CompareColumn];
  ariaLabel: string;
}

/* The working-understanding comparison: four kinds of help answering the
   same four questions, so the visitor can judge where the understanding
   lives when the work ends. It teaches; it does not bash. */
export function WorkingUnderstandingCompare({ tone, intro, rows, columns, ariaLabel }: WorkingUnderstandingCompareProps) {
  return (
    <section className="mm-compare" data-tone={tone} aria-label={ariaLabel}>
      <h2>You can hand over the work.</h2>
      <p className="mm-compare-intro">{intro}</p>
      <div className="mm-compare-grid">
        {columns.map((column) => (
          <article key={column.title} className={`mm-compare-col${column.emphasis ? " is-mindmake" : ""}`}>
            <h3>{column.title}</h3>
            {column.explain && <p className="mm-compare-explain">{column.explain}</p>}
            <dl>
              {rows.map((question, index) => (
                <div key={question}>
                  <dt>{question}</dt>
                  <dd>{column.cells[index]}</dd>
                </div>
              ))}
            </dl>
          </article>
        ))}
      </div>
      <p className="mm-compare-hinge">
        <ScrollMark shape="underline" driver="scroll">Not the understanding.</ScrollMark>
      </p>
    </section>
  );
}
