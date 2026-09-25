import { writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadIdeas } from "./lib/ideas-loader.mjs";
import { site, staticPages } from "./lib/pages.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "..");

/* The ideas, in the one list and the one order /blog shows them: the quick
   tips and the longer reads together, newest first. A tip is listed with the
   question it answers, because the question is what a reader arrives with and
   the title is only our wording of it. */
const { ideas } = await loadIdeas(rootDir);
const home = staticPages.find(page => page.path === "/");
const labels = {};
const ideaLines = ideas
  .map((idea) => idea.kind === "tip"
    ? `- [${idea.title}](${site}${idea.href}): answers "${idea.query}". ${idea.description}`
    : `- [${idea.title}](${site}${idea.href}): ${idea.description}`)
  .join("\n");

const llms = `# Mindmake

> ${home.title}

${home.description}

## Pages

${staticPages.filter(page => page.path !== "/").map(page => `- [${labels[page.path] || page.title}](${site}${page.path}): ${page.description}`).join("\n")}

## Ideas you can use

${ideaLines}
`;

// Optional directory, not a ranking signal or another commercial claim store.
if (process.argv.includes("--stdout")) process.stdout.write(llms);
else {
  writeFileSync(resolve(rootDir, "public/llms.txt"), llms);
  if (!process.argv.includes("--public-only") && existsSync(resolve(rootDir, "dist"))) writeFileSync(resolve(rootDir, "dist/llms.txt"), llms);
  console.log("Generated llms.txt from indexed pages and their approved metadata.");
}
