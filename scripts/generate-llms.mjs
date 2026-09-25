import { writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadAnswers } from "./lib/answers-loader.mjs";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";
import { site, staticPages } from "./lib/pages.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "..");

/* The answer pages, listed with the question each one answers, because the
   question is what a reader arrives with and the title is only our wording of
   it. Newest first, the order /answers itself uses. */
const { answers, answerPath } = await loadAnswers(rootDir);
const posts = await loadBlogPosts(rootDir);
const home = staticPages.find(page => page.path === "/");
const labels = {};
const answerLines = answers
  .map((answer) => `- [${answer.title}](${site}${answerPath(answer.slug)}): answers "${answer.targetQuery}". ${answer.description}`)
  .join("\n");

const llms = `# Mindmake

> ${home.title}

${home.description}

## Pages

${staticPages.filter(page => page.path !== "/").map(page => `- [${labels[page.path] || page.title}](${site}${page.path}): ${page.description}`).join("\n")}

## Quick AI tips

${answerLines}

## Ideas you can use

${posts.map(post => `- [${post.title}](${site}/blog/${post.slug}): ${post.metaDescription}`).join("\n")}
`;

// Optional directory, not a ranking signal or another commercial claim store.
if (process.argv.includes("--stdout")) process.stdout.write(llms);
else {
  writeFileSync(resolve(rootDir, "public/llms.txt"), llms);
  if (!process.argv.includes("--public-only") && existsSync(resolve(rootDir, "dist"))) writeFileSync(resolve(rootDir, "dist/llms.txt"), llms);
  console.log("Generated llms.txt from indexed pages and their approved metadata.");
}
