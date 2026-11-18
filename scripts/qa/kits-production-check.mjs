import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { kits } from "../../src/content/kits.ts";
const root = new URL("../../", import.meta.url);
const read = file => readFile(new URL(file, root), "utf8");
const html = await read("dist/parts/index.html");
assert(html.includes("parts-sample") && html.includes("kit-versus"), "Build the current parts interaction revision before production QA; existing dist is stale");
const { renderWithMetadata } = await import("../../dist-ssr/entry-server.js");
assert.equal(kits.length, 7);
assert.equal((html.match(/class="kit-card"/g) ?? []).length, 7);
assert(!html.includes('class="kit-group"'));
assert(html.includes("Pick the job you want done before your next decision."));
for (const route of ["/parts", "/parts/download", ...kits.map(part => `/parts/${part.slug}`)]) {
  const page = await read(`dist${route}/index.html`);
  const { body, metadata } = renderWithMetadata(route);
  assert(metadata.noindex, `${route} must be unlisted`);
  assert.equal(metadata.canonical, route);
  assert.match(page, /name="robots" content="noindex, nofollow"/);
  assert(!/Invented|Sample output|Mindmake kits|Get it,/.test(body));
  if (route !== "/parts/download" && route !== "/parts") {
    const part = kits.find(part => route.endsWith(`/${part.slug}`));
    assert(body.includes(part.name)); assert(body.includes(part.problem));
    assert(body.includes(part.checks)); assert(body.includes(part.whoDecided));
    for (const heading of ["What it strengthens", "What you get", "Your first five minutes", "What it checks", "What only you can judge", "What you need"]) assert(body.includes(heading));
    assert(body.includes("Add this brain module, $59"));
    if (part.slug === "audit-a-decision") {
      assert(body.includes("Try it free first:")); assert(body.includes('href="/who-decided"'));
      assert(body.includes("is the same six questions for one decision."));
    }
  }
}
assert(renderWithMetadata("/kits/download").body.includes("Download your brain module"));
for (const slug of ["evidence", "claims", "the-room", "price-floor", "your-word", "the-discount", "spend", "commitments", "the-numbers", "the-source", "who-next", "quiet-deals"]) assert(renderWithMetadata(`/parts/${slug}`).body.includes("This brain module is not available."));
assert(renderWithMetadata("/parts/not-a-part").body.includes("This brain module is not available."));
for (const file of ["dist/sitemap.xml", "dist/llms.txt"]) assert(!/\/(parts|kits)(?:[\/<\s]|$)/.test(await read(file)), `${file} exposes unapproved parts`);
await mkdir(new URL("quality/parts/", root), { recursive: true });
const result = { status: "pass", parts: 7, unlistedRoutes: 9, legacyDownload: true, checkedAt: new Date().toISOString(), scope: "built HTML and SSR, not live commerce" };
await writeFile(new URL("quality/parts/production-rule.json", root), JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result));
