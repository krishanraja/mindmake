import type { CSSProperties, ReactNode } from "react";

/**
 * The first screen: the change the reader already feels, and the playbook it
 * leaves behind. The four rules that playbook was written on sit beside the
 * headline and are struck through one after another as the page opens, in
 * the amber the page uses for what changed. The chapter after this one takes
 * them one at a time.
 *
 * The films on this page loop, so the reader can pause them here (WCAG 2.2.2),
 * as they can on /new-age-leadership and /ai-brain.
 */
export function Opening({ lead, accent, deck, rules, film, paused, onToggleMotion }: {
  lead: string;
  accent: string;
  deck: string;
  rules: readonly { name: string; was: string }[];
  film: ReactNode;
  paused: boolean;
  onToggleMotion: () => void;
}) {
  return (
    <section className="gtm-opening" data-gtm-chapter="opening" aria-labelledby="page-title">
      {film}
      <div className="gtm-opening-body mm-container">
        <div className="gtm-opening-copy">
          <h1 id="page-title">{lead} <em>{accent}</em></h1>
          <p className="gtm-opening-deck">{deck}</p>
        </div>
        <ul className="gtm-playbook" aria-label="The old playbook">
          {rules.map((rule, index) => (
            <li key={rule.name} style={{ "--gtm-i": index } as CSSProperties}>
              <span className="gtm-playbook-name">{rule.name}</span>
              <span className="gtm-was"><s>{rule.was}</s></span>
            </li>
          ))}
        </ul>
        <button type="button" className="gtm-motion" aria-pressed={paused} onClick={onToggleMotion}>
          <i aria-hidden="true" />
          <span>{paused ? "Play motion" : "Pause motion"}</span>
        </button>
      </div>
    </section>
  );
}
