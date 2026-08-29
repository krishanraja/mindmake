import { Children, isValidElement, cloneElement, type ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";

/**
 * Content that arrives as you reach it.
 *
 * Wrapping a group rather than each item, because the thing worth staggering is
 * a row of cards or a list of figures and writing the hook out six times is six
 * chances to forget one.
 *
 * What this is not: a way to make a still viewport pass the aliveness gate. That
 * gate measures a page at rest and an arrival has, by then, arrived. The reason
 * these exist is the other half of the complaint that started this work, which
 * was about scrolling rather than standing still: sections that were finished
 * before they were looked at and did nothing as you read them.
 *
 * The guarantees live in `useReveal`. The short version is that every word here
 * is readable if the reveal never happens, so this can be used freely on copy.
 */

interface ArriveProps {
  children: ReactNode;
  /** Where in the stagger this group starts. Later groups on a page carry more. */
  from?: number;
  /** Wraps each child separately, so a row arrives item by item. */
  stagger?: boolean;
  className?: string;
  /** The element to render. A list of cards wants its own semantics kept. */
  as?: "div" | "li" | "article" | "section";
}

function One({ index, className, as = "div", children }: { index: number; className?: string; as?: ArriveProps["as"]; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>(index);
  const Tag = as as "div";
  return <Tag ref={ref} className={className}>{children}</Tag>;
}

export function Arrive({ children, from = 0, stagger = false, className, as = "div" }: ArriveProps) {
  if (!stagger) {
    return <One index={from} className={className} as={as}>{children}</One>;
  }

  /* Staggered: each child keeps its own element and gains only the attribute,
     so a grid stays a grid. Anything that is not an element, a bare string in a
     fragment, is passed through untouched rather than wrapped in a div that
     would land in the middle of a layout. */
  return (
    <>
      {Children.map(children, (child, at) => {
        if (!isValidElement(child)) return child;
        return <ArriveChild index={from + at} key={child.key ?? at}>{child}</ArriveChild>;
      })}
    </>
  );
}

function ArriveChild({ index, children }: { index: number; children: ReactNode }) {
  const ref = useReveal<HTMLElement>(index);
  const child = Children.only(children);
  if (!isValidElement(child)) return <>{child}</>;
  return cloneElement(child as React.ReactElement<{ ref?: unknown }>, { ref });
}
