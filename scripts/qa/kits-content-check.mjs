import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { testimonials } from "../../src/data/testimonials.ts";
const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Supply the authorised stories export path");
const exported = await readFile(sourcePath, "utf8");
const section = exported.split(/^## 5.*$/m)[1]?.split(/^## 6.*$/m)[0];
assert(section, "Section 5 missing");
const page = await readFile(new URL("../../src/pages/Kits.tsx", import.meta.url), "utf8");
const ids = JSON.parse(page.match(/const quoteIds = (\[[^;]+\]);/)[1]);
const verified = [];
for (const id of ids) {
  const block = section.split(new RegExp(`^### Q-${id} · `, "m"))[1]?.split(/^### /m)[0];
  assert(block, `Missing ${id}`);
  const heading = block.split("\n")[0].trim();
  assert(heading.endsWith("· shown on the site"), `${id} not public`);
  const full = block.match(/\*\*Full:\*\* “([\s\S]*?)”/)[1];
  const quote = testimonials.find(quote => quote.id === id);
  assert.equal(quote.full, full, `${id} quotation drift`);
  const attribution = quote.name ? `${quote.name}, ${quote.role}` : quote.role;
  assert(heading.includes(`· ${attribution} ·`), `${id} attribution drift`);
  assert(!full.includes("\u2014"), `${id} contains an em dash`);
  verified.push({ id, attribution, full });
}
assert.equal(verified.length, 5);
const result = { status: "pass", source: "stories-export.md, section 5, supplied 16 November 2026", sourceSha256: createHash("sha256").update(exported).digest("hex"), sourceScope: "Each selected quote is marked shown on the site; these are Mindmake work quotes, never kit reviews", quotes: verified };
await writeFile(new URL("../../quality/kits/quote-provenance.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log("PASS five verbatim public quotes and exact attribution");
