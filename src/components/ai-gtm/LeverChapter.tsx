import { Icon } from "@/components/mindmake/Icon";
import { Marked, type MarkSpec } from "@/components/mindmake/Marked";
import { Plate } from "@/components/mindmake/Plate";
import type { IconName } from "@/lib/icons";
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

const LEVER_ICON: Record<string, IconName> = { product: "product", price: "price", positioning: "positioning", people: "people" };

/**
 * Section one: the four places the reader already feels the change.
 *
 * Ruling (owner, 2026-10-24): four still cards a reader takes in at a glance.
 * Ruling (owner, 2026-11-04, mock approved): the section opens on its picture
 * with the heading on it, and each place is one swap: its icon and name, the
 * old way struck through and the new one beneath. What the reader feels and
 * the dated public source sit one tap away under "Why now", so the four swaps
 * are what the eye meets first. Both starting points' wording sits in the
 * same place in every card, so changing the answer never changes a card's
 * size; the one not chosen is hidden from sight and from assistive
 * technology. On a phone the four swaps are a row the reader swipes.
 */
export function LeverChapter({ heading, mark, steps, mode, backdrop, children }: {
  heading: string;
  /** A phrase in the heading a hand marks as it arrives. */
  mark?: MarkSpec;
  steps: readonly LeverStep[];
  mode: string;
  backdrop: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="gtm-levers gtm-s8" data-gtm-chapter="levers" aria-labelledby="gtm-levers-title">
      <Plate media={backdrop}>
        <h2 id="gtm-levers-title" className="gtm-levers-title"><Marked text={heading} mark={mark} /></h2>
      </Plate>
      <div className="gtm-levers-body s8-body s8-paper mm-on-paper">
        <div className="mm-container">
          {children}
          <div className="lever-steps s8-swipe">
            {steps.map((item) => (
              <article key={item.key} className="gtm-lever" aria-label={item.name}>
                <span className="gtm-lever-name" aria-hidden="true"><Icon name={LEVER_ICON[item.key] ?? "product"} className="mm-icon mm-icon-big" />{item.name}</span>
                <span className="gtm-lever-ways">
                  {item.ways.map((way) => (
                    <span key={way.mode} className="gtm-lever-way" data-active={way.mode === mode} aria-hidden={way.mode === mode ? undefined : "true"}>
                      <span className="gtm-lever-was"><s>{way.was}</s></span>
                      <span className="gtm-lever-now"><Unbroken text={way.now} /></span>
                    </span>
                  ))}
                </span>
                <details className="s8-more">
                  <summary><Icon name="plus" />Why now</summary>
                  <p className="gtm-felt">
                    {item.felt}{" "}
                    <a className="gtm-source" href={item.source.href} target="_blank" rel="noreferrer">
                      {item.source.name} · {item.source.date} <span aria-hidden="true">&#8599;</span>
                    </a>
                  </p>
                </details>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
