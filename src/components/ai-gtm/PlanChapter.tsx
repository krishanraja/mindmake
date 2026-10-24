import type { CSSProperties, ReactNode } from "react";
import { Receipt } from "@/components/mindmake/Receipt";
import { Unbroken } from "./Unbroken";

export interface PlanStep {
  when: string;
  what: string;
  detail: string;
  /** Which days of the month this stretch covers, first and last. */
  days: readonly [number, number];
}

const DAYS = Array.from({ length: 30 }, (_, index) => index + 1);

/**
 * Section three: what the reader gets, and how they know it works.
 *
 * Ruling (owner, 2026-10-24): "One go-to-market move in 30 days" is "a really
 * good visual, but it needs to be the third section of three as opposed to
 * hidden right down the bottom of a really long experience". It no longer
 * pins: the month is drawn whole, its stretches in their own colours, with the
 * work of each stretch beneath it and the deliverables to choose from. The last
 * stretch, Day 30, is what the reader keeps, so it is drawn as the receipt the
 * other offer page ends with. The proof, the way in and the line to the other
 * page follow as `children`, at the point where the reader has understood the
 * offer and wants to see it work.
 */
export function PlanChapter({ heading, steps, keeps, menu, note, children }: {
  heading: string;
  steps: readonly PlanStep[];
  /** What the reader keeps on the last day, one item a line. */
  keeps: readonly string[];
  menu: readonly string[];
  note: string;
  children?: ReactNode;
}) {
  const work = steps.slice(0, -1);
  const last = steps[steps.length - 1];
  return (
    <section className="gtm-plan" data-gtm-chapter="plan" aria-labelledby="gtm-plan-title">
      <div className="gtm-plan-body mm-container">
        <h2 id="gtm-plan-title" className="gtm-plan-title"><Unbroken text={heading} /></h2>
        <ol className="plan-days" aria-hidden="true">
          {DAYS.map((day) => {
            const stretch = steps.findIndex((item) => day >= item.days[0] && day <= item.days[1]);
            return <li key={day} data-stretch={stretch} style={{ "--gtm-day": day } as CSSProperties} />;
          })}
        </ol>
        <ol className="gtm-plan-steps">
          {work.map((item, index) => (
            <li key={item.when} className="gtm-plan-step" data-stretch={index}>
              <p className="gtm-plan-when">{item.when}</p>
              <h3 className="gtm-plan-what">{item.what}</h3>
              <p className="gtm-plan-detail">{item.detail}</p>
            </li>
          ))}
        </ol>
        <ul className="gtm-plan-menu">
          {menu.map((entry) => <li key={entry}>{entry}</li>)}
        </ul>
        <p className="gtm-plan-note">{note}</p>
        <Receipt title="What stays with you" tag={`Yours to keep · ${last.when}`} items={keeps} />
        {children}
      </div>
    </section>
  );
}
