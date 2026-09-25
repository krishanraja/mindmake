import { useEffect } from "react";
import { keepLastWords } from "@/lib/keepLastWords";

/** Keeps a lone last word off its own line on every page; see src/lib/keepLastWords.ts. Renders nothing. */
export function LineBreaks() {
  useEffect(() => keepLastWords(), []);
  return null;
}
