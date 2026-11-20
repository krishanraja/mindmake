import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { JSDOM } from "jsdom";
import { kits } from "../../src/content/kits.ts";
const root = new URL("../../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const html = await read("dist/brain-modules/index.html");
const document = new JSDOM(html).window.document;
const library = document.querySelector("#kit-catalogue");
assert(library && document.querySelector(".mc-example .parts-sample") && document.querySelector(".kit-versus"), "Build the current module catalogue before production QA");
const { renderWithMetadata } = await import("../../dist-ssr/entry-server.js");
assert.equal(kits.length, 8);
const rows = [...library.querySelectorAll("details.mc-module")];
assert.deepEqual(rows.map(row => row.querySelector("summary").textContent.trim()), kits.map(kit => kit.name));
assert.deepEqual(rows.map(row => row.querySelector("a").getAttribute("href")), kits.map(kit => "/brain-modules/" + kit.slug));
assert(rows.every(row => !row.open), "All eight jobs start compact and open without JavaScript");
assert(document.querySelector(".mc-buy")?.getAttribute("href") === "/brain-modules/fact-check-board-update");
assert(library.textContent.includes("full refund within 14 days"));
for (const route of ["/brain-modules", "/brain-modules/download", ...kits.map(part => `/brain-modules/${part.slug}`)]) {
  const page = await read(`dist${route}/index.html`);
  const { body, metadata } = renderWithMetadata(route);
  assert(metadata.noindex, `${route} must be unlisted`);
  assert.equal(metadata.canonical, route);
  assert.match(page, /name="robots" content="noindex, nofollow"/);
  assert(!/Invented|Sample output|Mindmake kits|Get it,/.test(body));
  if (route !== "/brain-modules/download" && route !== "/brain-modules") {
    const part = kits.find(part => route.endsWith(`/${part.slug}`));
    const shown = text => body.includes(text.replace(/&/g, "&amp;").replace(/'/g, "&#x27;"));
    assert(shown(part.name)); assert(shown(part.problem));
    assert(shown(part.checks)); assert(shown(part.whoDecided));
    for (const heading of ["What it strengthens", "What you get", "Your first five minutes", "What it checks", "What only you can judge", "What you need"]) assert(body.includes(heading));
    assert(body.includes("Add this brain module, $59"));
    if (part.slug === "audit-a-decision") {
      assert(body.includes("Try it free first:")); assert(body.includes('href="/measure-your-ai-judgement"'));
      assert(body.includes("is the same six questions for one decision."));
    }
  }
}
assert(renderWithMetadata("/kits/download").body.includes("Preparing your download"));
for (const slug of ["evidence", "claims", "the-room", "price-floor", "your-word", "the-discount", "spend", "commitments", "the-numbers", "the-source", "who-next", "quiet-deals"]) assert(renderWithMetadata(`/brain-modules/${slug}`).body.includes("This brain module is not available."));
assert(renderWithMetadata("/brain-modules/not-a-part").body.includes("This brain module is not available."));
for (const file of ["dist/sitemap.xml", "dist/llms.txt"]) assert(!/\/(brain-modules|parts|kits)(?:[\/<\s]|$)/.test(await read(file)), `${file} exposes unlisted modules`);
await mkdir(new URL("quality/parts/", root), { recursive: true });
const result = { status: "pass", parts: kits.length, unlistedRoutes: kits.length + 2, legacyDownload: true, checkedAt: new Date().toISOString(), scope: "built HTML and SSR, not live commerce" };
await writeFile(new URL("quality/parts/production-rule.json", root), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
