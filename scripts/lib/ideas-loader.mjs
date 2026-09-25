import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { transform } from "esbuild";
import { loadAnswers } from "./answers-loader.mjs";
import { loadBlogPosts } from "./blog-posts-loader.mjs";

/**
 * The one list `/blog` shows, for the build scripts.
 *
 * The site builds it in `src/lib/ideas.ts` from the archive and the answer
 * pages through `src/lib/ideaFormat.ts`. That module has no runtime imports,
 * so compiling its TypeScript syntax to an in-memory ES module is
 * deterministic, and `llms.txt` lists the same items in the same order the
 * page shows them, from the same two sources.
 */
export async function loadIdeas(rootDir) {
  const source = await readFile(resolve(rootDir, "src/lib/ideaFormat.ts"), "utf8");
  const { code } = await transform(source, {
    loader: "ts",
    format: "esm",
    target: "es2022",
    sourcefile: "src/lib/ideaFormat.ts",
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const { mergeIdeas, subjectLabels, kindLabels } = await import(moduleUrl);

  const [posts, { answers, asQuestion }] = await Promise.all([loadBlogPosts(rootDir), loadAnswers(rootDir)]);
  return { ideas: mergeIdeas(posts, answers, asQuestion), subjectLabels, kindLabels };
}
