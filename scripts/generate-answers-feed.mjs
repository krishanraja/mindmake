/**
 * The answer pages as an Atom feed, at /answers/feed.xml.
 *
 * A reader, an aggregator or an assistant that follows the site can subscribe
 * here and see a new answer the day its file lands. It is written from the one
 * loader every other crawler surface uses (`scripts/lib/answers-loader.mjs`),
 * so the feed cannot list a page the sitemap, llms.txt or the prerender do not.
 *
 * Deterministic on purpose: no build timestamp. The feed's `updated` is the
 * newest page's own date, so the committed public/answers/feed.xml stays
 * byte-identical to a fresh run until an answer is added or changed, and
 * `src/test/discoverability.test.ts` compares the two.
 *
 * The same HTML for every reader: each entry carries the page's full text,
 * rendered from its markdown by the same renderer the page uses.
 *
 * Run: node scripts/generate-answers-feed.mjs [--stdout | --public-only]
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import { loadAnswers } from "./lib/answers-loader.mjs";
import { site } from "./lib/pages.mjs";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { answers, answerPath, asQuestion, feedPath } = await loadAnswers(rootDir);

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");
const escapeHtml = escapeXml;
const stamp = (date) => `${date}T00:00:00Z`;

/* Newest first by the date each page was written. The `lead: false` rule
   governs the top of the /blog list a visitor sees; a feed is a dated log. */
const dated = [...answers].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug));

const entryHtml = (answer) => [
  `<p><strong>Answers:</strong> ${escapeHtml(asQuestion(answer.targetQuery))}</p>`,
  `<p>${escapeHtml(answer.answer)}</p>`,
  renderToStaticMarkup(createElement(Markdown, null, answer.body)),
  "<h2>Where we stand on this</h2>",
  `<ul>${answer.firstParty.map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>`,
  "<h2>The questions that follow</h2>",
  ...answer.faq.map((entry) => `<h3>${escapeHtml(entry.q)}</h3><p>${escapeHtml(entry.a)}</p>`),
].join("\n");

const entries = dated.map((answer) => {
  const url = `${site}${answerPath(answer.slug)}`;
  return `  <entry>
    <id>${escapeXml(url)}</id>
    <title>${escapeXml(answer.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(url)}"/>
    <published>${stamp(answer.publishedAt)}</published>
    <updated>${stamp(answer.publishedAt)}</updated>
    <category term="${escapeXml(answer.category)}"/>
    <summary type="text">${escapeXml(answer.answer)}</summary>
    <content type="html">${escapeXml(entryHtml(answer))}</content>
  </entry>`;
});

const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-GB">
  <id>${site}${feedPath}</id>
  <title>Mindmake answers</title>
  <subtitle>One page per question leaders ask about AI and their business, newest first.</subtitle>
  <link rel="self" type="application/atom+xml" href="${site}${feedPath}"/>
  <link rel="alternate" type="text/html" href="${site}/blog"/>
  <updated>${stamp(dated[0].publishedAt)}</updated>
  <author><name>Mindmake</name><uri>${site}/</uri></author>
  <icon>${site}/favicon-192x192.png</icon>
  <logo>${site}/mindmake-logo-512.png</logo>
${entries.join("\n")}
</feed>
`;

if (process.argv.includes("--stdout")) {
  process.stdout.write(feed);
} else {
  const write = (base) => {
    const file = resolve(base, feedPath.slice(1));
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, feed);
  };
  write(resolve(rootDir, "public"));
  if (!process.argv.includes("--public-only") && existsSync(resolve(rootDir, "dist"))) write(resolve(rootDir, "dist"));
  console.log(`Answer feed generated: ${dated.length} entries at ${feedPath}`);
}
