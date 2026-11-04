import type { ReactNode } from "react";

export type MarkSpec = { phrase: string; kind: "underline" | "loop" };

/**
 * A heading's text with one phrase set for a hand-drawn mark (Krish,
 * 2026-11-04; drawn by src/lib/scrollBuild.ts when the heading arrives). The
 * words are unchanged; the phrase only gains a span the mark is drawn around.
 * Use on headings that never change their words while shown.
 */
export function Marked({ text, mark, render = (part) => part }: { text: string; mark?: MarkSpec; render?: (part: string) => ReactNode }) {
  const at = mark ? text.indexOf(mark.phrase) : -1;
  if (!mark || at < 0) return <>{render(text)}</>;
  return (
    <>
      {render(text.slice(0, at))}
      <span data-hs-mark={mark.kind}>{mark.phrase}</span>
      {render(text.slice(at + mark.phrase.length))}
    </>
  );
}
