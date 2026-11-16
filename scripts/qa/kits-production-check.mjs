import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { kits } from "../../src/content/kits.ts";
const html = await readFile(new URL("../../dist/kits/index.html", import.meta.url), "utf8");
const { render } = await import("../../dist-ssr/entry-server.js");
for (const kit of kits.filter(kit => kit.status === "sample")) {
  assert(!html.includes(kit.name), `Production catalogue leaked ${kit.slug}`);
  assert(render(`/kits/${kit.slug}`).includes("This kit is not available."), `Production detail leaked ${kit.slug}`);
}
if (!kits.some(kit => kit.status === "ready")) assert(html.includes("First kits arrive shortly"));
const result = { status: "pass", samplesExcluded: kits.filter(kit => kit.status === "sample").length, checkedAt: new Date().toISOString(), scope: "production HTML and built SSR sample routes" };
await writeFile(new URL("../../quality/kits/production-rule.json", import.meta.url), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
