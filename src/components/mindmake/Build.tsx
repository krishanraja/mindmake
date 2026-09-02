import { Children, isValidElement, cloneElement, type ReactNode, type ReactElement } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * A group that assembles under the reader as they scroll through it.
 *
 * This is the difference the site has been asked for repeatedly and not given.
 * `Arrive`
 * fires once when an element crosses a threshold and is then finished forever,
 * so a section that has already arrived is a photograph: scroll back up and
 * down and nothing happens, and the aliveness gate's scrubbed pass reports the
 * viewport as having nothing that builds. `Build` is driven by position. The
 * section's progress through a reading pass is written to `--mm-p` by
 * `useScrollDriver`, every child reads it, and the group therefore assembles as
 * you arrive and takes itself apart if you scroll back. That is what the
 * reference site does, and there is no library in it: one custom property and
 * some arithmetic in CSS.
 *
 * ## What it is not allowed to cost
 *
 * Nothing may be gated on it. Every child is in the DOM at full size from the
 * server render, and the CSS falls back to the finished state:
 * `var(--mm-p, 1)`, so with no JavaScript, before hydration, in a crawler and
 * under `prefers-reduced-motion` the whole group is simply present. The driver
 * pins the value to 1 for a reduced-motion visitor rather than leaving it
 * unset, so a preference change mid-session also lands finished.
 *
 * It adds a ref and nothing else to the markup, so the server's tree and the
 * client's are identical and hydration has nothing to disagree about.
 *
 * ## Why the index lives in the style attribute
 *
 * The stagger has to know which child is which, and `:nth-child` in CSS would
 * fix the count at whatever the stylesheet guessed. Each child carries its own
 * `--mm-i` instead, so a group of three and a group of nine stagger by the same
 * rule.
 */

interface BuildProps {
  children: ReactNode;
  className?: string;
  /** The element to render. A list wants its own semantics kept. */
  as?: "div" | "section" | "ul" | "ol" | "dl";
  /** Where in the stagger this group starts, for a section built in parts. */
  from?: number;
  style?: React.CSSProperties;
}

export function Build({ children, className = "", as = "div", from = 0, style }: BuildProps) {
  const ref = useScrollDriver<HTMLDivElement>(undefined, "read");
  const Tag = as as "div";

  return (
    <Tag ref={ref} className={`mm-build${className ? ` ${className}` : ""}`} style={style}>
      {Children.map(children, (child, at) => {
        if (!isValidElement(child)) return child;
        const element = child as ReactElement<{ style?: React.CSSProperties }>;
        return cloneElement(element, {
          style: { ...(element.props.style ?? {}), "--mm-i": from + at } as React.CSSProperties,
        });
      })}
    </Tag>
  );
}
