import { motion, useReducedMotion } from "framer-motion";

export function SquareGrid() {
  const reduce = useReducedMotion();
  return <span className="parts-square-grid" aria-hidden="true">{[0, 1, 2, 3].map(i =>
    <motion.span key={i} animate={reduce ? { opacity: 1, scale: 1 } : { scale: [1, .5, 1], opacity: [1, .3, 1] }} transition={reduce ? { duration: 0 } : { duration: 1.5, repeat: Infinity, delay: i * .2, ease: "easeInOut" }} />
  )}</span>;
}
