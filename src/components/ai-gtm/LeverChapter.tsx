import type { CSSProperties, ReactNode } from "react";
import { usePinnedSteps } from "@/hooks/usePinnedSteps";
import { StepRail } from "./StepRail";
import { Unbroken } from "./Unbroken";

export interface LeverStep {
  key: string;
  name: string;
  felt: string;
  was: string;
  now: string;
  source: { name: string; date: string; href: string };
}

/**
 * Chapter one: the four places the reader already feels the change.
 *
 * Each step pairs the moment in the reader's own terms with the lever it
 * belongs to, the old way struck through and the new one beside it, and the
 * dated public source that shows the shift is real. It reads the same for
 * both kinds of business, because the switch that tells them apart comes
 * after it and scrolling back must never change words already read.
 */
export function LeverChapter({ heading, steps, backdrop }: { heading: string; steps: readonly LeverStep[]; backdrop: ReactNode }) {
  const { trackRef, stageRef, step, goTo } = usePinnedSteps<HTMLElement>(steps.length);
  return (
    <section
      ref={trackRef}
      className="gtm-chapter gtm-levers"
      data-gtm-chapter="levers"
      aria-labelledby="gtm-levers-title"
      style={{ "--gtm-steps": steps.length } as CSSProperties}
    >
      <div ref={stageRef} className="gtm-stage">
        {backdrop}
        <div className="gtm-stage-body mm-container">
          <h2 id="gtm-levers-title" className="gtm-levers-title">{heading}</h2>
          <div className="gtm-steps lever-steps">
            {steps.map((item, index) => (
              <article key={item.key} className="gtm-step gtm-lever" data-gtm-step={index} data-active={index === step}>
                <h3 className="gtm-felt"><Unbroken text={item.felt} /></h3>
                <div className="gtm-lever-card">
                  <p className="gtm-lever-name">{item.name}</p>
                  <p className="gtm-lever-was"><s>{item.was}</s></p>
                  <p className="gtm-lever-now"><Unbroken text={item.now} /></p>
                  <a className="gtm-source" href={item.source.href} target="_blank" rel="noreferrer">
                    {item.source.name} · {item.source.date} <span aria-hidden="true">&#8599;</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
        <StepRail label="The four changes" steps={steps.map((item) => item.name)} active={step} onGo={goTo} />
      </div>
    </section>
  );
}
