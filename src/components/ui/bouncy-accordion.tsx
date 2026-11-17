import { useId, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

// Adapted from be-ui-bouncy-accordion: a restrained spring separates the open row.
export function BouncyAccordion({ items, defaultValue }: {
  items: { id: string; title: string; content: ReactNode }[];
  defaultValue: string;
}) {
  const [active, setActive] = useState<string | null>(defaultValue);
  const base = useId();
  const reduce = useReducedMotion();
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 360, damping: 32 };
  return <div className="parts-accordion">{items.map(item => {
    const open = item.id === active;
    const id = `${base}-${item.id}`;
    return <motion.section key={item.id} initial={false} animate={{ marginBlock: open ? 12 : 0, borderRadius: open ? 8 : 0 }} transition={transition} data-open={open}>
      <h2><button id={`${id}-trigger`} type="button" aria-expanded={open} aria-controls={id} onClick={() => setActive(open ? null : item.id)}>
        {item.title}<motion.span aria-hidden="true" animate={{ rotate: open ? 180 : 0 }} transition={transition}><ChevronDown size={20} /></motion.span>
      </button></h2>
      <div id={id} role="region" aria-labelledby={`${id}-trigger`} hidden={!open} className="parts-accordion-content">{item.content}</div>
    </motion.section>;
  })}</div>;
}
