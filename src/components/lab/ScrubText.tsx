import { useState } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

interface ScrubTextProps {
  text: string;
  className?: string;
  /** Words past the read head keep this much presence. */
  dim?: number;
}

/**
 * Text that lights up as you read it.
 *
 * Every word is in the DOM at full size from the start; scroll position only
 * moves a read head along the line, so nothing is hidden from a crawler, a
 * screen reader, or a visitor who lands mid-page. Scrolling back dims the words
 * again, because the position drives the state rather than triggering it.
 *
 * This is the tenex.co effect, and it is the clearest example of the difference
 * between a build and a reveal.
 */
export function ScrubText({ text, className = "", dim = 0.22 }: ScrubTextProps) {
  const [progress, setProgress] = useState(0);
  const ref = useScrollDriver<HTMLParagraphElement>(setProgress, "read");
  const words = text.split(" ");

  return (
    <p ref={ref} className={`mm-scrub ${className}`.trim()}>
      {words.map((word, index) => {
        /* Each word owns a slice of the range, and lights across it rather than
           snapping, so the head reads as a soft edge travelling the sentence. */
        const start = index / words.length;
        const lit = Math.min(1, Math.max(0, (progress - start) * words.length * 1.6));
        return (
          <span key={`${word}-${index}`} style={{ opacity: dim + (1 - dim) * lit }}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </p>
  );
}
