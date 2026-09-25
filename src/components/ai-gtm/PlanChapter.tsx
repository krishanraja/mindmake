import type { CSSProperties } from "react";
import { usePinnedSteps } from "@/hooks/usePinnedSteps";
import { StepRail } from "./StepRail";
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
 * The 30 days as the month itself: thirty days that light one by one as the
 * page scrolls, grouped into the three stretches of the work, whose names are
 * the controls that take the reader to each. All three stretches stay on
 * screen so the whole shape is never hidden; the one reached is lit and the
 * ones ahead wait. What each stretch produces is written into it rather than
 * folded into a drawer.
 */
export function PlanChapter({ heading, steps, mapped, menu, note }: {
  heading: string;
  steps: readonly PlanStep[];
  /** What week 1 maps for this business, lever by lever, old way and new. */
  mapped: readonly { name: string; was: string; now: string }[] | null;
  menu: readonly string[];
  note: string;
}) {
  const { trackRef, stageRef, step, goTo } = usePinnedSteps<HTMLElement>(steps.length);
  return (
    <section
      ref={trackRef}
      className="gtm-chapter gtm-plan"
      data-gtm-chapter="plan"
      aria-labelledby="gtm-plan-title"
      style={{ "--gtm-steps": steps.length } as CSSProperties}
    >
      <div ref={stageRef} className="gtm-stage">
        <div className="gtm-stage-body mm-container">
          <h2 id="gtm-plan-title" className="gtm-plan-title"><Unbroken text={heading} /></h2>
          <div className="plan-month">
            <ol className="plan-days" aria-hidden="true">
              {DAYS.map((day) => {
                const stretch = steps.findIndex((item) => day >= item.days[0] && day <= item.days[1]);
                return <li key={day} data-stretch={stretch} style={{ "--gtm-day": day } as CSSProperties} />;
              })}
            </ol>
            <StepRail label="The 30 days" steps={steps.map((item) => item.when)} active={step} onGo={goTo} className="gtm-rail-days" />
          </div>
          <ol className="gtm-steps gtm-plan-steps">
            {steps.map((item, index) => (
              <li key={item.when} className="gtm-step gtm-plan-step" data-gtm-step={index} data-active={index === step} data-reached={index <= step}>
                <p className="gtm-plan-when">{item.when}</p>
                <h3 className="gtm-plan-what">{item.what}</h3>
                <p className="gtm-plan-detail">{item.detail}</p>
                {index === 0 && mapped ? (
                  <ul className="gtm-plan-list gtm-plan-mapped">
                    {mapped.map((entry) => (
                      <li key={entry.name}>
                        <span>{entry.name}</span>
                        <span className="gtm-was"><s>{entry.was}</s></span>
                        <b>{entry.now}</b>
                      </li>
                    ))}
                  </ul>
                ) : null}
                {index === 1 ? (
                  <>
                    <ul className="gtm-plan-list gtm-plan-menu">
                      {menu.map((entry) => <li key={entry}>{entry}</li>)}
                    </ul>
                    <p className="gtm-plan-note">{note}</p>
                  </>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
