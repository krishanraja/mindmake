import assert from "node:assert/strict";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { startServer } from "./serve-dist.mjs";
import { checkPartsInteractions } from "./parts-browser-interactions.mjs";
import { computeCandidateIdentity } from "./material-review-firewall-lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const evidence = path.join(root, "quality/parts");
const manifestPath = path.join(root, "quality/website-redesign/kits-material-review-candidate.json");
await mkdir(evidence, { recursive: true });
// Fail before capture if the integrated preview build has not been produced.
const html = await readFile(path.join(root, "dist/brain-modules/fact-check-board-update/index.html"), "utf8");
assert(html.includes("parts-accordion") && html.includes("parts-price-actions") && html.includes("Fact-check my board update"), "A current build with the actual part route is required");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const walk = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async item => {
  const file = path.join(directory, item.name);
  return item.isDirectory() ? walk(file) : [path.relative(root, file).replaceAll("\\", "/")];
}))).flat();
manifest.artifact.files = (await walk(path.join(root, "dist"))).sort();
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const identity = await computeCandidateIdentity(root, manifest);
const server = await startServer(4396);
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
const observations = [];
try {
  browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const viewport of [{ width: 375, height: 812 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce", isMobile: viewport.width === 375, hasTouch: viewport.width === 375 });
    // A capture must never call a real checkout, email, analytics or data service.
    await context.route("**/*", route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
    for (const [name, route] of [["catalogue", "/brain-modules/"], ["fact-check-board-update", "/brain-modules/fact-check-board-update/"], ["download", "/brain-modules/download/"]]) {
      const page = await context.newPage(); const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, "Horizontal overflow");
      const smallTargets = await page.locator(".kits-main a, .kits-main button, .kits-main summary").evaluateAll(elements => elements.filter(element => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.height > 0 && getComputedStyle(element).visibility !== "hidden" && (box.width < 44 || box.height < 44);
      }).map(element => element.textContent?.trim()));
      assert.deepEqual(smallTargets, [], "A part control is smaller than 44px");
      const screenshots = [];
      const shot = async suffix => {
        const file = `quality/parts/${name}-${viewport.width}x${viewport.height}${suffix}.png`;
        await page.screenshot({ path: path.join(root, file), fullPage: suffix === "-full" }); screenshots.push(file);
      };
      await shot(""); await shot("-full");
      await checkPartsInteractions(page, name, shot);
      if (name === "catalogue") {
        assert.equal(await page.locator(".kit-card").count(), 7);
        await page.locator(".kit-hero .kit-button").click();
        assert(await page.locator("#kit-catalogue").isVisible());
        const kitLink = page.locator(".kit-card-link").first();
        assert.equal(await kitLink.getAttribute("href"), "/brain-modules/fact-check-board-update");
        const heights = [];
        for (let i = 0; i < 5; i++) {
          heights.push((await page.locator(".kit-quote-stack").boundingBox()).height);
          await page.getByRole("button", { name: "Next quote" }).click();
        }
        assert(Math.max(...heights) - Math.min(...heights) <= 1, "Quote height changed");

      } else if (name !== "download") {
        await page.locator(".kit-hero .kit-button").click();
        await page.getByText("Checkout is unavailable. Please try again.").first().waitFor({ state: "visible" });
      }
      const scrolls = await page.evaluate(() => {
        const total = document.documentElement.scrollHeight - innerHeight;
        return Array.from({ length: Math.ceil(total / (innerHeight / 2)) + 1 }, (_, i) => Math.min(total, i * innerHeight / 2));
      });
      for (const y of [...scrolls, ...scrolls.slice().reverse()]) {
        await page.evaluate(y => scrollTo(0, y), y);
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      assert.deepEqual(errors, []);
      observations.push({ route, viewport, screenshots, status: "pass", actions: "catalogue, real sample, part, quote controls, keyboard FAQ and focus return, default accordion, checklist, exact chart, forward and reverse scroll", consoleErrors: errors });
      await page.close();
    }
    await context.close();
  }
  await writeFile(path.join(evidence, "browser-observations.json"), JSON.stringify({ candidateSha256: identity.sha256, capturedAt: new Date().toISOString(), runtime: { selfOwned: true, origin }, observations }, null, 2) + "\n");
  console.log("Captured built parts candidate. Specialist receipts and unmeasured readiness checks remain separate gates.");
} finally { await browser?.close(); await new Promise(resolve => server.close(resolve)); }
