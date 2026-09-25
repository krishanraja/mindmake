import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { transform } from "esbuild";

/**
 * The published answer pages, for the build scripts.
 *
 * The site reads the same directory through `import.meta.glob`, which Node
 * cannot run, so this reads it with `node:fs` and parses each file with the
 * site's own parser: `src/lib/answerFormat.ts` has no runtime imports, so
 * compiling its TypeScript syntax to an in-memory ES module is deterministic.
 * That keeps the pages, the sitemap, `llms.txt`, the social plates and the
 * prerendered head on one implementation of the format, in the same shape as
 * `scripts/lib/blog-posts-loader.mjs` does for the blog archive.
 */
export async function loadAnswers(rootDir) {
  const source = await readFile(resolve(rootDir, "src/lib/answerFormat.ts"), "utf8");
  const { code } = await transform(source, {
    loader: "ts",
    format: "esm",
    target: "es2022",
    sourcefile: "src/lib/answerFormat.ts",
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const { parseAnswerFile, orderAnswers, answerPath, answerJsonLd } = await import(moduleUrl);

  const directory = "src/content/answers";
  const files = (await readdir(resolve(rootDir, directory))).filter((file) => file.endsWith(".md"));
  if (!files.length) throw new Error(`${directory} holds no answer pages, so /answers would publish empty`);

  const answers = [];
  for (const file of files) {
    const markdown = await readFile(resolve(rootDir, directory, file), "utf8");
    answers.push(parseAnswerFile(markdown, `${directory}/${file}`));
  }

  return { answers: orderAnswers(answers), answerPath, answerJsonLd };
}
