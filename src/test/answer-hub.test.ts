import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { renderWithMetadata } from "@/entry-server";
import { blogPosts } from "@/data/blogPosts";
import corpus from "@/content/answers.json";
import { answers } from "@/lib/answers";
import { ANSWER_FEED_PATH, answerJsonLd, answerPath } from "@/lib/answerFormat";

const ROOT = resolve(__dirname, "../..");
const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8").replaceAll("\r\n", "\n");
const generate = (script: string, ...args: string[]) =>
  execFileSync(process.execPath, [script, "--stdout", ...args], { cwd: ROOT, encoding: "utf8" }).replaceAll("\r\n", "\n");
const words = (text: string) => text.split(/\s+/).filter(Boolean).length;
const SITE = "https://mindmake.co";

/**
 * The answer hub as a recurring publication.
 *
 * `src/test/discoverability.test.ts` holds what every answer page needs to
 * exist. This file holds what makes the pages a publication an answer engine
 * can follow: a length a retriever can lift, one question per page, a feed, a
 * full-text file, a named welcome for the AI crawlers, structured data that
 * joins each page to the business, and the weekly brief that keeps it going.
 * The same HTML is served to every reader, so nothing here checks for a
 * crawler-only variant: there must not be one.
 */
describe("each answer page, as a page to be quoted", () => {
  it("keeps the direct answer, the body, the questions and the description to a liftable length", () => {
    for (const answer of answers) {
      expect(words(answer.answer), `${answer.slug}: answer words`).toBeGreaterThanOrEqual(40);
      expect(words(answer.answer), `${answer.slug}: answer words`).toBeLessThanOrEqual(120);
      expect(words(answer.body), `${answer.slug}: body words`).toBeGreaterThanOrEqual(300);
      expect(words(answer.body), `${answer.slug}: body words`).toBeLessThanOrEqual(1500);
      expect(answer.faq.length, `${answer.slug}: faq`).toBeGreaterThanOrEqual(2);
      expect(answer.faq.length, `${answer.slug}: faq`).toBeLessThanOrEqual(6);
      expect(answer.description.length, `${answer.slug}: description`).toBeGreaterThanOrEqual(70);
      expect(answer.title.endsWith(" | Mindmake"), answer.slug).toBe(false);
    }
  });

  it("answers one question per page, under one slug, with one title", () => {
    for (const field of ["slug", "targetQuery", "title"] as const) {
      const values = answers.map((answer) => answer[field].toLowerCase());
      expect(new Set(values).size, field).toBe(values.length);
    }
    const blogSlugs = new Set(blogPosts.map((post) => post.slug));
    for (const answer of answers) expect(blogSlugs.has(answer.slug), answer.slug).toBe(false);
  });

  it("joins every page to the business and says where it sits", () => {
    for (const answer of answers) {
      const graph = answerJsonLd(answer)["@graph"] as Array<Record<string, unknown>>;
      const article = graph.find((node) => node["@type"] === "Article")!;
      expect(article.author).toMatchObject({ "@id": `${SITE}/#organization`, name: "Mindmake" });
      expect(article.publisher).toMatchObject({ "@id": `${SITE}/#organization` });
      const crumbs = graph.find((node) => node["@type"] === "BreadcrumbList")!;
      const items = crumbs.itemListElement as Array<{ position: number; item: string; name: string }>;
      expect(items.map((item) => item.item)).toEqual([`${SITE}/`, `${SITE}/blog`, `${SITE}${answerPath(answer.slug)}`]);
      expect(items.map((item) => item.position)).toEqual([1, 2, 3]);
      expect(items[2].name).toBe(answer.title);
    }
    /* The index.html organisation node the @id points at. */
    expect(read("index.html")).toContain('"@id": "https://mindmake.co/#organization"');
  });
});

describe("the answer feed", () => {
  const feed = read(`public${ANSWER_FEED_PATH}`);

  it("is what the generator writes now", () => {
    expect(generate("scripts/generate-answers-feed.mjs")).toBe(feed);
  });

  it("is a well-formed Atom feed with one dated entry per answer, newest first", () => {
    const xml = new DOMParser().parseFromString(feed, "application/xml");
    expect(xml.querySelector("parsererror")).toBeNull();
    expect(xml.documentElement.namespaceURI).toBe("http://www.w3.org/2005/Atom");
    const self = [...xml.documentElement.children].find((node) => node.localName === "link" && node.getAttribute("rel") === "self");
    expect(self?.getAttribute("href")).toBe(`${SITE}${ANSWER_FEED_PATH}`);
    const entries = [...xml.getElementsByTagName("entry")];
    expect(entries).toHaveLength(answers.length);
    const ids = entries.map((entry) => entry.getElementsByTagName("id")[0].textContent);
    expect(new Set(ids).size).toBe(ids.length);
    expect([...ids].sort()).toEqual(answers.map((answer) => `${SITE}${answerPath(answer.slug)}`).sort());
    const published = entries.map((entry) => entry.getElementsByTagName("published")[0].textContent!);
    expect(published).toEqual([...published].sort().reverse());
    for (const answer of answers) {
      const entry = entries.find((node) => node.getElementsByTagName("id")[0].textContent === `${SITE}${answerPath(answer.slug)}`)!;
      expect(entry.getElementsByTagName("published")[0].textContent).toBe(`${answer.publishedAt}T00:00:00Z`);
      expect(entry.getElementsByTagName("summary")[0].textContent).toBe(answer.answer);
      /* The whole page, so a feed reader gets what a visitor gets. */
      const content = entry.getElementsByTagName("content")[0].textContent!;
      for (const entryFaq of answer.faq) expect(content, answer.slug).toContain(entryFaq.q.replaceAll("&", "&amp;").replaceAll('"', "&quot;"));
    }
    const newest = answers.map((answer) => answer.publishedAt).sort().reverse()[0];
    expect(xml.documentElement.getElementsByTagName("updated")[0].textContent).toBe(`${newest}T00:00:00Z`);
  });

  it("is announced in the head of the index and every answer page, and built with the site", () => {
    const prerender = read("scripts/prerender.mjs");
    expect(prerender).toContain('type="application/atom+xml"');
    expect(prerender).toContain('page.path === "/blog" || page.path.startsWith("/answers/")');
    expect(JSON.parse(read("package.json")).scripts.build).toMatch(/generate-llms\.mjs && node scripts\/generate-answers-feed\.mjs && node scripts\/prerender\.mjs/);
  });
});

describe("llms.txt and llms-full.txt", () => {
  const llms = read("public/llms.txt");
  const full = read("public/llms-full.txt");

  it("are what the generator writes now", () => {
    expect(generate("scripts/generate-llms.mjs", "--full")).toBe(full);
    expect(generate("scripts/generate-llms.mjs")).toBe(llms);
  });

  it("point an agent at the full text and the feed", () => {
    expect(llms).toContain(`(${SITE}/llms-full.txt)`);
    expect(llms).toContain(`(${SITE}${ANSWER_FEED_PATH})`);
  });

  it("carry every answer, every read and every /faq question in full", () => {
    for (const answer of answers) {
      expect(full, answer.slug).toContain(`URL: ${SITE}${answerPath(answer.slug)}`);
      expect(full, answer.slug).toContain(answer.answer);
      expect(full, answer.slug).toContain(answer.body.split("\n")[0]);
      for (const entry of answer.faq) expect(full, answer.slug).toContain(`Q: ${entry.q}`);
    }
    for (const post of blogPosts) expect(full, post.slug).toContain(`URL: ${SITE}/blog/${post.slug}`);
    for (const entry of corpus.entries) {
      expect(full, entry.id).toContain(`### ${entry.question}`);
      expect(full, entry.id).toContain(entry.answer);
    }
  });

  it("hold the files that are new public surfaces to the house copy gates", () => {
    /* The same gates src/test/brief2-public-contract.test.ts applies to every
       public surface, applied here to the surfaces this hub added. */
    for (const [file, text] of [
      ["public/llms-full.txt", full],
      [`public${ANSWER_FEED_PATH}`, read(`public${ANSWER_FEED_PATH}`)],
      ["scripts/generate-answers-feed.mjs", read("scripts/generate-answers-feed.mjs")],
    ] as const) {
      expect(`${file}: ${text.includes("—")}`).toBe(`${file}: false`);
      expect(`${file}: ${/\bjudgment\b/.test(text)}`).toBe(`${file}: false`);
      expect(`${file}: ${/mindmaker/i.test(text)}`).toBe(`${file}: false`);
      expect(`${file}: ${/krish/i.test(text)}`).toBe(`${file}: false`);
      expect(`${file}: ${/\bGTM\b/.test(text)}`).toBe(`${file}: false`);
    }
  });
});

describe("what the AI crawlers are told", () => {
  const AI_CRAWLERS = [
    "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot",
    "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot-Extended", "meta-externalagent",
    "Amazonbot", "CCBot", "DuckAssistBot", "MistralAI-User",
  ];

  /** robots.txt as groups: the agents a group names and the rules it carries. */
  const groups = () => {
    const parsed: Array<{ agents: string[]; rules: string[] }> = [];
    let current: { agents: string[]; rules: string[] } | null = null;
    for (const raw of read("public/robots.txt").split("\n")) {
      const line = raw.replace(/#.*$/, "").trim();
      if (!line) continue;
      const [key, ...rest] = line.split(":");
      const value = rest.join(":").trim();
      if (/^user-agent$/i.test(key)) {
        if (!current || current.rules.length) parsed.push(current = { agents: [], rules: [] });
        current.agents.push(value);
      } else if (/^(allow|disallow)$/i.test(key) && current) {
        current.rules.push(`${key.toLowerCase()}: ${value}`);
      }
    }
    return parsed;
  };

  it("names every one of them, with exactly the rules everyone else gets", () => {
    const all = groups();
    const star = all.find((group) => group.agents.includes("*"))!;
    expect(star.rules).toContain("allow: /");
    for (const agent of AI_CRAWLERS) {
      const own = all.filter((group) => group.agents.some((name) => name.toLowerCase() === agent.toLowerCase()));
      expect(own, agent).toHaveLength(1);
      /* A named group replaces *, so it must repeat every * rule or it would
         quietly open the private paths to that crawler. */
      expect(own[0].rules, agent).toEqual(star.rules);
    }
  });

  it("serves one version of every page and sniffs no user agent", () => {
    const vercel = read("vercel.json");
    expect(vercel).not.toMatch(/user-agent/i);
    for (const file of ["scripts/prerender.mjs", "src/components/SEO.tsx", "src/pages/Answer.tsx", "src/App.tsx"]) {
      expect(`${file}: ${/navigator\.userAgent|user-agent/i.test(read(file))}`).toBe(`${file}: false`);
    }
  });
});

describe("the structured data around the hub", () => {
  it("puts the /faq questions on the page into an FAQPage, word for word", () => {
    const jsonLd = renderWithMetadata("/faq").metadata?.jsonLd as { "@type": string; mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }> };
    expect(jsonLd["@type"]).toBe("FAQPage");
    expect(jsonLd.mainEntity.map((entry) => entry.name)).toEqual(corpus.entries.map((entry) => entry.question));
    expect(jsonLd.mainEntity.map((entry) => entry.acceptedAnswer.text)).toEqual(corpus.entries.map((entry) => entry.answer));
  });

  it("names the practice and its founder on /about, from facts the page shows", () => {
    const { body, metadata } = renderWithMetadata("/about");
    const graph = (metadata?.jsonLd as { "@graph": Array<Record<string, unknown>> })["@graph"];
    const practice = graph.find((node) => node["@type"] === "ProfessionalService")!;
    const person = graph.find((node) => node["@type"] === "Person")!;
    expect(practice["@id"]).toBe(`${SITE}/#organization`);
    expect(practice.founder).toEqual({ "@id": person["@id"] });
    expect(person.name).toBe("Krish Raja");
    expect(person.worksFor).toEqual({ "@id": `${SITE}/#organization` });
    /* Every fact in the record is on the rendered page. */
    for (const fact of ["Krish Raja", "Founder, Mindmake", "Microsoft", "Nine", "SingTel", "Captify"]) {
      expect(body, fact).toContain(fact);
    }
    for (const school of person.alumniOf as Array<{ name: string }>) expect(body).toContain(school.name);
  });
});

describe("the weekly brief", () => {
  const workflow = read(".github/workflows/answers-weekly.yml");
  const backlog = JSON.parse(read("project-documentation/answer-backlog.json")) as {
    about: string;
    candidates: Array<{ query: string; audience: string; sector: string; grounding: string[]; status: string; slug?: string; note?: string }>;
  };

  it("runs weekly, opens one issue and spends nothing", () => {
    expect(workflow).toMatch(/schedule:\s*\n\s*- cron: "\d+ \d+ \* \* [0-6]"/);
    expect(workflow).toContain("Answer hub brief: week of ${week}");
    expect(workflow).toContain("project-documentation/answer-backlog.json");
    expect(workflow).toMatch(/permissions:\s*\n\s*contents: read\s*\n\s*issues: write/);
    /* No model, no secret, no install: the brief is a checklist and a list. */
    expect(workflow).not.toMatch(/secrets\.|ANTHROPIC|OPENAI|npm (ci|install)|claude-code-action/i);
  });

  it("offers real questions, each grounded in the canon and tracked to its page", () => {
    const slugs = new Set(answers.map((answer) => answer.slug));
    const queries = backlog.candidates.map((item) => item.query.toLowerCase());
    expect(new Set(queries).size).toBe(queries.length);
    expect(backlog.candidates.filter((item) => item.status === "open").length).toBeGreaterThanOrEqual(3);
    for (const item of backlog.candidates) {
      expect(["open", "published"], item.query).toContain(item.status);
      expect(item.grounding.length, item.query).toBeGreaterThan(0);
      for (const source of item.grounding) expect(source, item.query).toMatch(/^0[0-6]_[A-Z_]+\.md: /);
      if (item.status === "published") {
        expect(slugs.has(item.slug!), item.query).toBe(true);
        expect(answers.find((answer) => answer.slug === item.slug)?.targetQuery, item.query).toBe(item.query);
      }
    }
  });
});
