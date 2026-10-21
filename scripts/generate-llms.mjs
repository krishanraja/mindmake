import { writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import { loadIdeas } from "./lib/ideas-loader.mjs";
import { loadAnswers } from "./lib/answers-loader.mjs";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";
import { site, staticPages } from "./lib/pages.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "..");

/* The ideas, in the one list and the one order /blog shows them: the quick
   tips and the longer reads together, newest first. A tip is listed with the
   question it answers, because the question is what a reader arrives with and
   the title is only our wording of it. */
const { ideas } = await loadIdeas(rootDir);
const { answers, asQuestion, feedPath } = await loadAnswers(rootDir);
const posts = await loadBlogPosts(rootDir);
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

## Optional

- [Full text](${site}/llms-full.txt): every idea, answer and question above in full, in one file.
- [Answers feed](${site}${feedPath}): the answer pages as an Atom feed, newest first.
`;

/* llms-full.txt: the same directory with every page's words in it, for an
   agent that would rather read one file than fetch thirty. Built only from
   what the site already publishes: the questions on /faq, the answer pages
   and the longer reads, in the order /blog shows them. No new claims, and no
   words that are not on a public page. */
const faqCorpus = JSON.parse(readFileSync(resolve(rootDir, "src/content/answers.json"), "utf8")).entries;
const answerBySlug = new Map(answers.map((answer) => [answer.slug, answer]));
const postBySlug = new Map(posts.map((post) => [post.slug, post]));
const fullIdea = (idea) => {
  if (idea.kind === "tip") {
    const answer = answerBySlug.get(idea.slug);
    return [
      `### ${answer.title}`,
      "",
      `URL: ${site}${idea.href}`,
      `Answers: ${asQuestion(answer.targetQuery)}`,
      `Published: ${answer.publishedAt}`,
      "",
      answer.answer,
      "",
      answer.body,
      "",
      "Where we stand on this:",
      ...answer.firstParty.map((line) => `- ${line}`),
      "",
      "The questions that follow:",
      ...answer.faq.flatMap((entry) => ["", `Q: ${entry.q}`, `A: ${entry.a}`]),
    ].join("\n");
  }
  const post = postBySlug.get(idea.slug);
  return [
    `### ${post.title}`,
    "",
    `URL: ${site}${idea.href}`,
    `Published: ${post.publishedAt}`,
    "",
    post.content.trim(),
  ].join("\n");
};
const llmsFull = `# Mindmake: full text

> ${home.title}

${home.description}

This is the long form of ${site}/llms.txt: the same pages, with their words.

## What Mindmake is

${about}

## Ways in

${waysIn}

## Questions we get asked

Source: ${site}/faq

${faqCorpus.map((entry) => `### ${entry.question}\n\n${entry.answer}`).join("\n\n")}

## Ideas you can use

Source: ${site}/blog

${ideas.map(fullIdea).join("\n\n")}
`;

// Optional directory, not a ranking signal or another commercial claim store.
if (process.argv.includes("--stdout")) process.stdout.write(process.argv.includes("--full") ? llmsFull : llms);
else {
  for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", llmsFull]]) {
    writeFileSync(resolve(rootDir, "public", name), text);
    if (!process.argv.includes("--public-only") && existsSync(resolve(rootDir, "dist"))) writeFileSync(resolve(rootDir, "dist", name), text);
  }
  console.log("Generated llms.txt and llms-full.txt from indexed pages and their approved metadata.");
}
