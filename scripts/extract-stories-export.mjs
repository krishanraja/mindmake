#!/usr/bin/env node
/**
 * Turns the owner's cleaned use-case and quote file into the parity fixture
 * that src/test/use-case-parity.test.ts checks the site's records against.
 *
 *   node scripts/extract-stories-export.mjs <export.md> [out.json]
 *
 * Only the public sections are read: the use cases (with their results), the
 * featured order and every quote record. Private engagement context is never
 * read or written. The fixture records the source file's SHA-256 so a later
 * reader can tell which version it came from.
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const [source, out = "src/test/fixtures/stories-export-2026-11-11.json"] = process.argv.slice(2);
if (!source) {
  console.error("usage: node scripts/extract-stories-export.mjs <export.md> [out.json]");
  process.exit(2);
}

const text = readFileSync(source, "utf8");
const sha256 = createHash("sha256").update(text).digest("hex");
const stop = text.indexOf("### Private engagement context");
const publicText = stop === -1 ? text : text.slice(0, stop);

const field = (block, name) => {
  const match = block.match(new RegExp(`^\\*\\*${name}:\\*\\* (.+)$`, "m"));
  return match ? match[1].trim() : undefined;
};
const id = (value) => value?.match(/`([^`]+)`/)?.[1];
const unquote = (value) => value?.replace(/^“/, "").replace(/”$/, "");

/* Use cases, in their groups. */
const useCaseStart = publicText.indexOf("## 1. Use cases");
const quoteStart = publicText.indexOf("## 2. Client quotes");
const useCaseText = publicText.slice(useCaseStart, quoteStart);
const groups = [];
const useCases = [];
for (const groupBlock of useCaseText.split(/^### /m).slice(1)) {
  const label = groupBlock.split("\n")[0].trim();
  const type = field(groupBlock, "Type");
  const ids = [];
  for (const entry of groupBlock.split(/^#### /m).slice(1)) {
    const entryId = entry.split("\n")[0].trim();
    ids.push(entryId);
    const resultId = id(field(entry, "Result ID"));
    useCases.push({
      id: entryId,
      heading: field(entry, "Heading"),
      outcome: field(entry, "Outcome"),
      startingPoint: field(entry, "Starting point"),
      whatWeDid: field(entry, "What we did"),
      quoteId: id(field(entry, "Use-case quote ID")) ?? null,
      picture: id(field(entry, "Picture")),
      evidence: field(entry, "Evidence"),
      result: resultId
        ? {
            id: resultId,
            headline: field(entry, "Result headline"),
            detail: field(entry, "Result detail"),
            quoteId: id(field(entry, "Result quote ID")),
          }
        : null,
    });
  }
  groups.push({ label, type, useCases: ids });
}

/* The featured order. */
const featured = [...publicText.matchAll(/^\| (\d) \| `(Q-[^`]+)` \|$/gm)].map((m) => ({ order: Number(m[1]), id: m[2] }));

/* Every quote record, public and supporting. */
const quotes = [];
for (const block of publicText.slice(quoteStart).split(/^#### /m).slice(1)) {
  const quoteId = block.split("\n")[0].trim();
  if (!quoteId.startsWith("Q-")) continue;
  const useCaseExcerpts = {};
  for (const m of block.matchAll(/^\*\*Use-case excerpt for (C-\d\d):\*\* (.+)$/gm)) useCaseExcerpts[m[1]] = unquote(m[2].trim());
  quotes.push({
    id: quoteId,
    relationship: field(block, "Relationship"),
    attribution: field(block, "Attribution"),
    full: unquote(field(block, "Full")),
    excerpt: unquote(field(block, "Excerpt")),
    featuredExcerpt: unquote(field(block, "Featured excerpt")) ?? null,
    useCaseExcerpts,
  });
}

const fixture = { source: "mindmake-stories-export-2026-11-11", sha256, groups, useCases, featured, quotes };
writeFileSync(out, `${JSON.stringify(fixture, null, 2)}\n`);
console.log(`${out}: ${groups.length} groups, ${useCases.length} use cases, ${useCases.filter((u) => u.result).length} results, ${quotes.length} quotes, ${featured.length} featured`);
