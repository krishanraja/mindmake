import corpus from "@/content/answers.json";

export interface AskEntry {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
}

export const ASK_ENTRIES = corpus.entries as AskEntry[];
export const ASK_UNMATCHED = corpus.unmatched;

/**
 * Scores a question against the curated corpus: one point per keyword present,
 * best match wins, threshold one. No model, no network, no waiting. The ask bar
 * is the site's claim operating, so it answers instantly or says so honestly.
 */
export function findAnswer(question: string): AskEntry | null {
  const asked = question.toLowerCase();
  let best: AskEntry | null = null;
  let bestScore = 0;

  for (const entry of ASK_ENTRIES) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (asked.includes(keyword)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore > 0 ? best : null;
}
