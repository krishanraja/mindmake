import type { ReactNode } from "react";
import { Unbroken } from "./Unbroken";

export interface LeverWay {
  /** Which starting point this old and new way belongs to. */
  mode: string;
  was: string;
  now: string;
}

export interface LeverStep {
  key: string;
  name: string;
  felt: string;
  ways: readonly LeverWay[];
  source: { name: string; date: string; href: string };
}

/**
 * Section one: where the reader is starting from, then the four places they
 * already feel the change, all four on screen at once.
 *
 * Ruling (owner, 2026-10-24): the pinned sequence felt "glitchy" and kept the
 * reader scrolling through copy. The four places are now four still cards a
 * reader takes in at a glance. Each card names its lever, strikes the old way
 * through and gives the new one for the reader's own starting point, then
 * says what the reader feels and the dated public source that shows it is
 * real, once. Both starting points' wording sits in the same place in every
 * card, so changing the answer above never changes a card's size; the one not
 * chosen is hidden from sight and from assistive technology.
 */
export function LeverChapter({ heading, steps, mode, backdrop, children }: {
  heading: string;
  steps: readonly LeverStep[];
  mode: string;
  backdrop: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="gtm-levers" data-gtm-chapter="levers" aria-labelledby="gtm-levers-title">
      {backdrop}
      <div className="gtm-levers-body mm-container">
        {children}
        <h2 id="gtm-levers-title" className="gtm-levers-title">{heading}</h2>
        <div className="lever-steps">
          {steps.map((item) => (
            <article key={item.key} className="gtm-lever" aria-label={item.name}>
              <span className="gtm-lever-name" aria-hidden="true">{item.name}</span>
              <span className="gtm-lever-ways">
                {item.ways.map((way) => (
                  <span key={way.mode} className="gtm-lever-way" data-active={way.mode === mode} aria-hidden={way.mode === mode ? undefined : "true"}>
                    <span className="gtm-lever-was"><s>{way.was}</s></span>
                    <span className="gtm-lever-now"><Unbroken text={way.now} /></span>
                  </span>
                ))}
              </span>
              <p className="gtm-felt">
                {item.felt}{" "}
                <a className="gtm-source" href={item.source.href} target="_blank" rel="noreferrer">
                  {item.source.name} · {item.source.date} <span aria-hidden="true">&#8599;</span>
                </a>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
