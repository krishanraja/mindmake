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

/* The plain account and the two ways in, for an agent reading this file
   cold. Every line is already public on the site; the source of truth is
   "Mindmake in one page" in project-documentation/00_NORTH_STAR.md, and the
   two links are START_PATH and PUBLICATION_URL in src/lib/publicLinks.ts. */
const about = `Mindmake is a small AI and commercial strategy practice. It builds a leader their own AI brain: a working system that holds their taste, standards, judgement and memory, so the AI they already use works the way they do. It is for a founder, principal, investor or senior commercial leader who can make the decision. Work starts with one paid proof, scoped and priced privately; the site publishes no price.`;
const waysIn = [
  `- [Get your free AI brief](${site}/?start=1): Answer a few questions, keep the brief, then a free consultation.`,
  `- [Make Your Mind Up](https://makeyourmindup.ai): Mindmake's free publication by email. What's coming in AI, before it's obvious.`,
].join("\n");

const llms = `# Mindmake

> ${home.title}

${home.description}

## What Mindmake is

${about}

## Ways in

${waysIn}

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
