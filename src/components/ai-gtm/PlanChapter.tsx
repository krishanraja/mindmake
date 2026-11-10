import { Icon } from "@/components/mindmake/Icon";
import { Marked, type MarkSpec } from "@/components/mindmake/Marked";
import { Plate } from "@/components/mindmake/Plate";
import type { IconName } from "@/lib/icons";
import type { CSSProperties, ReactNode } from "react";
import { Unbroken } from "./Unbroken";

export interface PlanStep {
  when: string;
  what: string;
  detail: string;
  /** Which days of the month this stretch covers, first and last. */
  days: readonly [number, number];
}

const DAYS = Array.from({ length: 30 }, (_, index) => index + 1);
const STEP_ICON: readonly IconName[] = ["positioning", "built", "target"];
const KEEP_ICON: readonly IconName[] = ["model", "evidence", "built"];

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
/* Ruling (owner, 2026-11-04, mock approved): the section opens on its
   picture; the month is the one big thing; each stretch has an icon and its
   name, with the longer how behind a tap; the builds are icon tiles and what
   stays with you is three marks in a row, not a receipt box. The stories
   that follow have their own section on the page. */
export function PlanChapter({ heading, mark, steps, keeps, menu, menuIcons, keepsTitle, plate, note, children }: {
  heading: string;
  /** A phrase in the heading a hand marks as it arrives. */
  mark?: MarkSpec;
  steps: readonly PlanStep[];
  /** What the reader keeps on the last day, one item a line. */
  keeps: readonly string[];
  menu: readonly string[];
  /** One icon for each entry in `menu`. */
  menuIcons: readonly IconName[];
  /** The heading over what the reader keeps. */
  keepsTitle: string;
  plate: ReactNode;
  note?: string;
  children?: ReactNode;
}) {
  const work = steps.slice(0, -1);
  const last = steps[steps.length - 1];
  return (
    <section className="gtm-plan gtm-s8" data-gtm-chapter="plan" aria-labelledby="gtm-plan-title">
      <Plate media={plate}>
        <h2 id="gtm-plan-title" className="gtm-plan-title"><Marked text={heading} mark={mark} render={(part) => <Unbroken text={part} />} /></h2>
      </Plate>
      <div className="gtm-plan-body s8-body s8-paper mm-on-paper">
        <div className="mm-container">
          <ol className="plan-days" aria-hidden="true">
            {DAYS.map((day) => {
              const stretch = steps.findIndex((item) => day >= item.days[0] && day <= item.days[1]);
              return <li key={day} data-stretch={stretch} style={{ "--gtm-day": day } as CSSProperties} />;
            })}
          </ol>
          <ol className="gtm-plan-steps">
            {work.map((item, index) => (
              <li key={item.when} className="gtm-plan-step" data-stretch={index}>
                <p className="gtm-plan-when"><Icon name={STEP_ICON[index] ?? "built"} />{item.when}</p>
                <h3 className="gtm-plan-what">{item.what}</h3>
                {item.detail.split(" ").length > 16 ? (
                  <details className="s8-more">
                    <summary><Icon name="plus" />How we test</summary>
                    <p className="gtm-plan-detail">{item.detail}</p>
                  </details>
                ) : <p className="gtm-plan-detail">{item.detail}</p>}
              </li>
            ))}
            <li className="gtm-plan-step gtm-plan-last" data-stretch={work.length}>
              <p className="gtm-plan-when"><Icon name={STEP_ICON[2]} />{last.when}</p>
            </li>
          </ol>
          <ul className="gtm-plan-menu s8-tiles">
            {menu.map((entry, index) => <li key={entry}><Icon name={menuIcons[index] ?? "built"} className="mm-icon mm-icon-big" /><span>{entry}</span></li>)}
          </ul>
          {note ? <p className="gtm-plan-note">{note}</p> : null}
          <div className="s8-keeps-block">
            <h3 className="s8-label s8-label-run"><span>{keepsTitle}</span><span className="s8-label-sep" aria-hidden="true"> · </span><span>Yours to keep</span><span className="s8-label-sep" aria-hidden="true"> · </span><span>{last.when}</span></h3>
            <ul className="s8-keeps">
              {keeps.map((entry, index) => <li key={entry}><Icon name={KEEP_ICON[index] ?? "built"} className="mm-icon mm-icon-big" />{entry}</li>)}
            </ul>
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
