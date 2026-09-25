/**
 * The answer file format, and everything derived from one.
 *
 * `/answers` is the machine-first surface: one page per question a buyer asks,
 * written to be fetched, read and quoted by an assistant as much as by a
 * person. A page is a markdown file in `src/content/answers/`, and dropping a
 * file in that directory is the whole publishing step. There is no manifest to
 * keep in step, because a manifest is a second list and a second list drifts.
 *
 * This module has no imports on purpose. `src/lib/answers.ts` reads the files
 * through `import.meta.glob` for the site, and `scripts/lib/answers-loader.mjs`
 * compiles this same file with esbuild and reads them with `node:fs` for the
 * sitemap, `llms.txt`, the social plates and the prerender, exactly as
 * `scripts/lib/blog-posts-loader.mjs` does for the blog archive. One parser,
 * one sort order, one piece of structured data, whichever side is asking.
 *
 * The front matter is a deliberately small subset of YAML rather than a
 * dependency: single-line scalars, a list of scalars, and a list of q/a pairs.
 * Anything else throws, naming the file and the line, because a page that
 * publishes with a silently missing answer is worse than a build that stops.
 *
 *   ---
 *   title: ...
 *   slug: ...
 *   description: ...
 *   answer: ...
 *   claim: ...
 *   target_query: ...
 *   published_at: 2026-09-05
 *   first_party:
 *     - ...
 *   faq:
 *     - q: ...
 *       a: ...
 *   ---
 *
 * `answer` is the liftable two or three sentence reply, and it renders before
 * any preamble on the page for the same reason it is a field rather than the
 * first paragraph of the body: a retriever reads the first chunk and stops.
 * `claim` is the one thing this page says that the pages already answering the
 * question do not.
 */

export interface AnswerFaqEntry {
  q: string;
  a: string;
}

export interface AnswerPage {
  title: string;
  slug: string;
  description: string;
  /** The direct answer, liftable on its own, rendered first on the page. */
  answer: string;
  /** What this page says that the pages already ranking for the query do not. */
  claim: string;
  /** The question this page exists to answer, in the words a buyer uses. */
  targetQuery: string;
  /** ISO date the page was written, which is what the index sorts on. */
  publishedAt: string;
  /** Statements this practice stands behind, quotable on their own. */
  firstParty: string[];
  faq: AnswerFaqEntry[];
  /** The argument, as markdown. */
  body: string;
  /**
   * False keeps a page out of the top of the index however new it is
   * (`lead: false` in the front matter). Krish, 2026-09-25: the adtech
   * answer is never the first thing a visitor reads.
   */
  lead: boolean;
}

const SITE = "https://mindmake.co";

/**
 * The target query as a reader sees it: a sentence-case question. The stored
 * query keeps the lower-case words a buyer types into a search box.
 */
export const asQuestion = (query: string) => {
  const trimmed = query.trim().replace(/[?.!]+$/, "");
  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}?`;
};

/** The path an answer is published at, in one place so nothing guesses it. */
export const answerPath = (slug: string) => `/answers/${slug}`;

/** The file name without its directory or extension, for the slug check. */
const baseName = (file: string) => (file.split("/").pop() ?? file).replace(/\.md$/, "");

const unquote = (raw: string) => {
  const value = raw.trim();
  const quoted = (value.startsWith('"') && value.endsWith('"'))
    || (value.startsWith("'") && value.endsWith("'"));
  return quoted && value.length > 1 ? value.slice(1, -1) : value;
};

type FrontMatterValue = string | string[] | AnswerFaqEntry[];

function parseFrontMatter(front: string, file: string): Record<string, FrontMatterValue> {
  const lines = front.split("\n");
  const fields: Record<string, FrontMatterValue> = {};
  let at = 0;

  const fail = (line: number, why: string): never => {
    throw new Error(`${file}: line ${line + 1} of the front matter ${why}`);
  };

  while (at < lines.length) {
    const line = lines[at];
    if (!line.trim()) { at += 1; continue; }

    const key = /^([a-z_][a-z0-9_]*):(.*)$/.exec(line);
    if (!key) fail(at, `is neither blank nor a "key: value" pair: ${JSON.stringify(line)}`);

    const [, name, rest] = key!;
    at += 1;

    if (rest.trim()) {
      fields[name] = unquote(rest);
      continue;
    }

    /* A block: either "  - scalar" items or "  - q: ..." mappings whose
       remaining keys are indented one level further. */
    const scalars: string[] = [];
    const entries: AnswerFaqEntry[] = [];
    while (at < lines.length && (!lines[at].trim() || lines[at].startsWith("  "))) {
      const item = lines[at];
      if (!item.trim()) { at += 1; continue; }

      const bullet = /^ {2}- (.*)$/.exec(item);
      if (!bullet) fail(at, `is indented under "${name}" without starting an item: ${JSON.stringify(item)}`);
      at += 1;

      const pair = /^([a-z_][a-z0-9_]*):\s*(.*)$/.exec(bullet![1]);
      if (!pair || !pair[2].trim()) {
        scalars.push(unquote(bullet![1]));
        continue;
      }

      const entry: Record<string, string> = { [pair[1]]: unquote(pair[2]) };
      while (at < lines.length && /^ {4}\S/.test(lines[at])) {
        const nested = /^ {4}([a-z_][a-z0-9_]*):\s*(.*)$/.exec(lines[at]);
        if (!nested) fail(at, `is indented under an item without being a "key: value" pair: ${JSON.stringify(lines[at])}`);
        entry[nested![1]] = unquote(nested![2]);
        at += 1;
      }
      if (typeof entry.q !== "string" || typeof entry.a !== "string") {
        fail(at - 1, `holds an item under "${name}" without both a q and an a`);
      }
      entries.push({ q: entry.q, a: entry.a });
    }

    if (entries.length && scalars.length) fail(at - 1, `mixes plain items and q/a items under "${name}"`);
    fields[name] = entries.length ? entries : scalars;
  }

  return fields;
}

const leadFlag = (value: FrontMatterValue, file: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`${file}: lead is ${JSON.stringify(value)} rather than true or false`);
};

/**
 * One answer page from one file's source.
 *
 * `file` is the path it came from, which is both what an error names and how
 * the slug is checked: a slug that disagrees with its file name publishes at a
 * URL nobody can find the source of again.
 */
export function parseAnswerFile(source: string, file: string): AnswerPage {
  const normalised = source.replace(/\r\n/g, "\n");
  const split = /^---\n([\s\S]*?)\n---[ \t]*(?:\n|$)/.exec(normalised);
  if (!split) throw new Error(`${file}: has no front matter block fenced by --- lines`);

  const fields = parseFrontMatter(split[1], file);
  const body = normalised.slice(split[0].length).trim();
  if (!body) throw new Error(`${file}: has front matter and no body`);

  const text = (name: string) => {
    const value = fields[name];
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${file}: has no ${name}, and every answer page needs one`);
    }
    return value.trim();
  };

  const list = (name: string) => {
    const value = fields[name];
    if (!Array.isArray(value) || !value.length || value.some((item) => typeof item !== "string")) {
      throw new Error(`${file}: has no ${name} list, and every answer page needs one`);
    }
    return value as string[];
  };

  const faq = fields.faq;
  if (!Array.isArray(faq) || !faq.length || faq.some((item) => typeof item === "string" || !item.q.trim() || !item.a.trim())) {
    throw new Error(`${file}: has no faq of q and a pairs, and every answer page needs one`);
  }

  const slug = text("slug");
  if (slug !== baseName(file)) {
    throw new Error(`${file}: publishes as "${slug}", so the file and the URL disagree`);
  }

  const publishedAt = text("published_at");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(publishedAt)) {
    throw new Error(`${file}: published_at is "${publishedAt}" rather than a YYYY-MM-DD date`);
  }

  return {
    title: text("title"),
    slug,
    description: text("description"),
    answer: text("answer"),
    claim: text("claim"),
    targetQuery: text("target_query"),
    publishedAt,
    firstParty: list("first_party"),
    faq: faq as AnswerFaqEntry[],
    body,
    lead: fields.lead === undefined ? true : leadFlag(fields.lead, file),
  };
}

/**
 * Newest first, and the slug settles a tie.
 *
 * Two pages written on the same day would otherwise sort by whatever order the
 * file system handed them over, which differs between a build machine and a
 * laptop and would move the index around for no reason.
 */
export const byNewestFirst = (a: AnswerPage, b: AnswerPage) =>
  b.publishedAt.localeCompare(a.publishedAt) || a.slug.localeCompare(b.slug);

/**
 * The index order: newest first, except that a page marked `lead: false`
 * never opens the list. The newest page allowed to lead moves to the top and
 * everything else keeps its date order.
 */
export function orderAnswers(pages: AnswerPage[]) {
  const sorted = [...pages].sort(byNewestFirst);
  const leader = sorted.findIndex((page) => page.lead);
  if (leader > 0) sorted.unshift(...sorted.splice(leader, 1));
  return sorted;
}

/**
 * The structured data for one answer page: the article, and the FAQ as its own
 * entity in the same graph.
 *
 * Built here rather than in the page component because two writers put it on
 * the page. `src/components/SEO.tsx` writes it in an effect for a client-side
 * navigation and `scripts/prerender.mjs` writes it into the served head at
 * build time, and a crawler comparing the two must not find two different
 * records of the same page.
 */
export const answerJsonLd = (answer: AnswerPage) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline: answer.title,
      description: answer.description,
      abstract: answer.answer,
      about: { "@type": "Thing", name: answer.targetQuery },
      author: { "@type": "Organization", name: "Mindmake", url: SITE },
      publisher: { "@type": "Organization", name: "Mindmake", url: SITE },
      datePublished: answer.publishedAt,
      inLanguage: "en-GB",
      isAccessibleForFree: true,
      mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE}${answerPath(answer.slug)}` },
    },
    {
      "@type": "FAQPage",
      mainEntity: answer.faq.map((entry) => ({
        "@type": "Question",
        name: entry.q,
        acceptedAnswer: { "@type": "Answer", text: entry.a },
      })),
    },
  ],
});
