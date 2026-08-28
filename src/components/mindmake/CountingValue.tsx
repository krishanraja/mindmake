import { useState } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

interface CountingValueProps {
  value: number;
  /**
   * Where the count starts, as a fraction of the true value. It defaults to
   * settling rather than counting from nothing, because these are real figures
   * and a number that reads 0 when it is 149 is briefly a lie.
   */
  from?: number;
}

/**
 * A live value that settles into place as you arrive at it.
 *
 * Scroll position drives the number rather than triggering it, so scrolling
 * back up unsettles it again. The value is never gated: at rest, under reduced
 * motion, and in jsdom the driver reports a completed pass and the true figure
 * is what renders.
 */
export function CountingValue({ value, from = 0.72 }: CountingValueProps) {
  const [progress, setProgress] = useState(1);
  const ref = useScrollDriver<HTMLSpanElement>(setProgress, "read");

  const floor = Math.round(value * from);
  const eased = 1 - Math.pow(1 - progress, 3);
  const shown = Math.round(floor + (value - floor) * eased);

  return <span ref={ref}>{shown.toLocaleString("en-GB")}</span>;
}
