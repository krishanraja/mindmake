import { orderAnswers, parseAnswerFile, type AnswerPage } from "@/lib/answerFormat";

/**
 * The published answer pages, read straight from the directory.
 *
 * `import.meta.glob` with `eager` resolves at build time, so adding a markdown
 * file to `src/content/answers/` is the whole publishing step: no manifest, no
 * import list, nothing to forget. Vite inlines the sources into the bundle, so
 * this works identically in the browser, in the server render the prerender
 * runs, and in the test suite.
 *
 * The path is written out in full rather than built from a variable, because
 * the glob is analysed statically and a computed pattern matches nothing.
 */
const sources = import.meta.glob("/src/content/answers/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export const answers: AnswerPage[] = orderAnswers(
  Object.entries(sources).map(([file, source]) => parseAnswerFile(source, file)),
);

export const answerBySlug = (slug: string | undefined) =>
  slug ? answers.find((answer) => answer.slug === slug) : undefined;

export type { AnswerPage } from "@/lib/answerFormat";
