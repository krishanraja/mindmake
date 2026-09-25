import type { CSSProperties } from "react";

/**
 * The rail along a pinned chapter: one segment per step, filling as the page
 * scrolls through it. Each segment is a control that moves the page to its
 * step, so the rail is also how a keyboard or a screen reader reaches the
 * steps the stage is not showing.
 */
export function StepRail({ label, steps, active, onGo, className = "" }: {
  label: string;
  steps: readonly string[];
  active: number;
  onGo: (index: number) => void;
  className?: string;
}) {
  return (
    <nav className={`gtm-rail ${className}`.trim()} aria-label={label} style={{ "--gtm-n": steps.length } as CSSProperties}>
      {steps.map((name, index) => (
        <button
          key={name}
          type="button"
          className="gtm-rail-step"
          data-active={index === active}
          aria-current={index === active ? "step" : undefined}
          aria-label={name}
          onClick={() => onGo(index)}
          style={{ "--gtm-i": index } as CSSProperties}
        >
          <span className="gtm-rail-fill" aria-hidden="true" />
          <span className="gtm-rail-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className="gtm-rail-name">{name}</span>
        </button>
      ))}
    </nav>
  );
}
