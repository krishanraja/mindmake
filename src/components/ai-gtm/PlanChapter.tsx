import type { CSSProperties } from "react";
import { usePinnedSteps } from "@/hooks/usePinnedSteps";
import { StepRail } from "./StepRail";
import { Unbroken } from "./Unbroken";

export interface PlanStep {
  when: string;
  what: string;
  detail: string;
}

/**
 * The 30 days, as one month filling from left to right as the page scrolls.
 *
 * All three stretches of the month stay on screen so the whole shape is never
 * hidden; the one the reader has reached is lit and the ones ahead wait. What
 * each stretch produces is written into it rather than folded into a drawer.
 */
export function PlanChapter({ heading, steps, mapped, menu, note }: {
  heading: string;
  steps: readonly PlanStep[];
  /** What week 1 maps for this business, lever by lever, when there is a list to show. */
  mapped: readonly { name: string; line: string }[] | null;
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
          <div className="plan-rule" aria-hidden="true"><span className="plan-rule-fill" /></div>
          <ol className="gtm-steps gtm-plan-steps">
            {steps.map((item, index) => (
              <li key={item.when} className="gtm-step gtm-plan-step" data-gtm-step={index} data-active={index === step} data-reached={index <= step}>
                <p className="gtm-plan-when">{item.when}</p>
                <h3 className="gtm-plan-what">{item.what}</h3>
                <p className="gtm-plan-detail">{item.detail}</p>
                {index === 0 && mapped ? (
                  <ul className="gtm-plan-list gtm-plan-mapped">
                    {mapped.map((entry) => <li key={entry.name}><span>{entry.name}</span>{entry.line}</li>)}
                  </ul>
                ) : null}
                {index === 1 ? (
                  <ul className="gtm-plan-list gtm-plan-menu">
                    {menu.map((entry) => <li key={entry}>{entry}</li>)}
                  </ul>
                ) : null}
                {index === steps.length - 1 ? <p className="gtm-plan-note">{note}</p> : null}
              </li>
            ))}
          </ol>
        </div>
        <StepRail label="The 30 days" steps={steps.map((item) => item.when)} active={step} onGo={goTo} className="gtm-rail-quiet" />
      </div>
    </section>
  );
}
