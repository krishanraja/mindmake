/**
 * One list for `/blog`, "Ideas you can use": the quick tips and the longer
 * reads together, newest first.
 *
 * Owner ruling, 2026-09-25: the answer pages and the editorial archive are
 * one page. A tip keeps its own page under `/answers/:slug` and a read keeps
 * its own under `/blog/:slug`; what they share is the index, its order and
 * its two filters, which is what this module defines.
 *
 * This module has no imports on purpose, for the same reason
 * `src/lib/answerFormat.ts` has none: `src/lib/ideas.ts` builds the list for
 * the site, and `scripts/lib/ideas-loader.mjs` compiles this file with esbuild
 * so `llms.txt` lists the same items in the same order. One merge, one sort,
 * whichever side is asking.
 */

/** What an idea is about. The four subjects the archive already used. */
export type IdeaSubject = "ai-literacy" | "leadership" | "implementation" | "strategy";

export const IDEA_SUBJECTS: ReadonlyArray<IdeaSubject> = ["ai-literacy", "leadership", "implementation", "strategy"];

export const subjectLabels: Record<IdeaSubject, string> = {
  "ai-literacy": "Using AI",
  leadership: "For leaders",
  implementation: "Building",
  strategy: "Business choices",
};

/** A quick tip (one page per question) or a longer read (an article). */
export type IdeaKind = "tip" | "read";

export const kindLabels: Record<IdeaKind, string> = {
  tip: "Quick tip",
  read: "Longer read",
};

export interface Idea {
  kind: IdeaKind;
  slug: string;
  /** Where the idea lives: `/answers/:slug` for a tip, `/blog/:slug` for a read. */
  href: string;
  title: string;
  /** The line under the title: the question a tip answers, or a read's excerpt. */
  line: string;
  /** For a tip, the question in the words a buyer types; a directory quotes it. */
  query?: string;
  subject: IdeaSubject;
  /** ISO date, which is what the list sorts on. */
  publishedAt: string;
  /** Minutes, for a read; a tip is read in one sitting and says nothing. */
  readingTime?: number;
  /** False keeps an idea out of the top of the list however new it is. */
  lead: boolean;
  /** One sentence for a directory such as `llms.txt`. */
  description: string;
}

/** The fields of a blog post the list needs; the archive's own type has more. */
export interface ReadSource {
  slug: string;
  title: string;
  excerpt: string;
  category: IdeaSubject;
  publishedAt: string;
  readingTime: number;
  metaDescription: string;
}

/** The fields of an answer page the list needs; the answer's own type has more. */
export interface TipSource {
  slug: string;
  title: string;
  targetQuery: string;
  category: IdeaSubject;
  publishedAt: string;
  lead: boolean;
  description: string;
}

/**
 * Newest first, and the address settles a tie.
 *
 * Two ideas written on the same day would otherwise sort by whatever order
 * their sources handed them over, which would move the list around between a
 * build machine and a laptop for no reason.
 */
export const byNewestFirst = (a: Idea, b: Idea) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.href.localeCompare(b.href);

/**
 * The list order: newest first, except that an idea marked `lead: false`
 * never opens the list (owner ruling, 2026-09-25: the adtech answer is never the
 * first thing a visitor reads). The newest idea allowed to lead moves to the
 * top and everything else keeps its date order.
 */
export function orderIdeas(ideas: Idea[]) {
  const sorted = [...ideas].sort(byNewestFirst);
  const leader = sorted.findIndex((idea) => idea.lead);
  if (leader > 0) sorted.unshift(...sorted.splice(leader, 1));
  return sorted;
}

export const ideaFromRead = (post: ReadSource): Idea => ({
  kind: "read",
  slug: post.slug,
  href: `/blog/${post.slug}`,
  title: post.title,
  line: post.excerpt,
  subject: post.category,
  publishedAt: post.publishedAt,
  readingTime: post.readingTime,
  lead: true,
  description: post.metaDescription,
});

/** `question` is the tip's target query as a reader sees it (`asQuestion`). */
export const ideaFromTip = (answer: TipSource, question: string): Idea => ({
  kind: "tip",
  slug: answer.slug,
  href: `/answers/${answer.slug}`,
  title: answer.title,
  line: question,
  query: answer.targetQuery,
  subject: answer.category,
  publishedAt: answer.publishedAt,
  lead: answer.lead,
  description: answer.description,
});

/** The one list, in the one order. */
export function mergeIdeas(
  reads: ReadSource[],
  tips: TipSource[],
  toQuestion: (query: string) => string,
): Idea[] {
  return orderIdeas([
    ...reads.map(ideaFromRead),
    ...tips.map((tip) => ideaFromTip(tip, toQuestion(tip.targetQuery))),
  ]);
}
