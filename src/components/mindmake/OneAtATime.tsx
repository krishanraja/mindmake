import { useEffect, useState, type ReactNode } from "react";

/**
 * A stack of rows where one is open.
 *
 * Built after measuring the reference the operator asked for, streamwave.ai.
 * Its accordion is worth taking and its animation is not: traced frame by
 * frame, the swap is 220ms with both panels moving together and no fade at all,
 * on a plain `<details>`. What makes it work is the dose. Every title stays on
 * screen so the reader keeps the whole map, one body is open, and the frame
 * does not resize under the hand.
 *
 * Two things this is not. It is not the retired numbered step rail: nothing here
 * is driven by scroll, nothing is gated behind reaching it, and the numbers are
 * inside the control rather than above a heading, which is the one place the
 * eyebrow ban leaves open. And the left line does not fill for the reader; it
 * marks which question is open, which is an object on the page.
 *
 * ## No JavaScript
 *
 * The element is a real `<details>` with a shared `name`, so the browser runs
 * the whole accordion with nothing loaded: the first row is open, the rest open
 * on a tap, and every answer is in the markup for a crawler either way. That is
 * the point of the change as much as the dose is. The drum this replaced was
 * `overflow: hidden` with a JavaScript transform, and with scripting off it
 * showed one card of eight and clipped 2,308px of answers with no scrollbar.
 *
 * ## Once JavaScript is running
 *
 * The rows are all set `open` and the `name` comes off, because the swap has to
 * be animated and a closed `<details>` does not render its body, so there is
 * nothing to transition. From then on the open row is React state, the summary
 * click is intercepted, and the body travels on a grid row from 0fr to 1fr.
 * `aria-expanded` is written explicitly, because every row is natively open by
 * then and the implicit value would say so.
 *
 * ## Why the frame is not held to a fixed height
 *
 * It was, for an afternoon: the tallest body measured once and reserved as a
 * `min-height`, so that opening a long answer after a short one moved nothing
 * below it. It shipped a worse defect than it fixed. The reservation can only
 * be applied after the first paint, a `ResizeObserver` re-measures it when the
 * fonts land, and `qa:entrance` caught the result on `/ai-brain` at 1440: the
 * page replaced itself three times between 1,872ms and 1,920ms, having been
 * clean before. A stack that resizes when a reader taps it is ordinary and
 * expected. A page that rearranges itself two seconds after it paints is the
 * glitch this project spent a week removing.
 *
 * The reference resizes too, by 18px. Nothing here needs to be steadier.
 */

export interface StackRow {
  id: string;
  title: string;
  body: ReactNode;
  /** Sits above the title inside the row, for a mark that belongs to the step. */
  lead?: ReactNode;
}

interface OneAtATimeProps {
  rows: StackRow[];
  /** Groups the rows so the browser keeps one open when nothing is loaded. */
  name: string;
  /** The row label. Defaults to the position, which is what the reference uses. */
  label?: (index: number, total: number) => string;
  className?: string;
}

const twoDigits = (index: number) => String(index + 1).padStart(2, "0");

export function OneAtATime({ rows, name, label = twoDigits, className }: OneAtATimeProps) {
  const [open, setOpen] = useState(0);
  const [driven, setDriven] = useState(false);

  /* The server renders the plain accordion and the first client render has to
     match it exactly, so taking control is an effect rather than a guess about
     whether this is a browser. */
  useEffect(() => setDriven(true), []);

  return (
    <div className={`mm-stack${driven ? " is-driven" : ""}${className ? ` ${className}` : ""}`}>
      {rows.map((row, at) => {
        const active = driven ? open : 0;
        const isOpen = at === active;
        /* Above the open row the line is solid, below it the line is dashed and
           drifting. It says which questions are still unopened, which is the
           track's idiom turned on its side, and it is the section's ambient
           motion now that the drum's drift has gone. */
        return (
          <details
            className={`mm-stack-row${isOpen ? " is-open" : ""}${at > active ? " is-ahead" : ""}`}
            key={row.id}
            /* Both attributes are the no-JavaScript accordion and both have to
               go once the animation owns the state: a shared name would close
               the rows this component keeps open to transition them. */
            name={driven ? undefined : name}
            open={driven ? true : at === 0}
          >
            <summary
              className="mm-stack-head"
              aria-expanded={driven ? isOpen : undefined}
              onClick={(event) => {
                if (!driven) return;
                event.preventDefault();
                setOpen(at);
              }}
            >
              <span className="mm-stack-n">{label(at, rows.length)}</span>
              {/* A heading inside the summary, which is the one way to give ten
                  of these headings to navigate by and still have the control be
                  a real disclosure widget. */}
              <h3 className="mm-stack-title">{row.title}</h3>
              <span className="mm-stack-dot" aria-hidden="true" />
            </summary>

            <div className="mm-stack-fold">
              <div className="mm-stack-body">
                {row.lead}
                {row.body}
              </div>
            </div>
          </details>
        );
      })}
    </div>
  );
}
