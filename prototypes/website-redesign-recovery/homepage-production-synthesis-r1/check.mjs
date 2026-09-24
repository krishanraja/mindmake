import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../..");
const route = "/prototypes/website-redesign-recovery/homepage-production-synthesis-r1/index.html";
const evidence = "C:/Users/krish/.scratch/mindmake-homepage-production-synthesis-r1";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
try {
  await fs.mkdir(evidence, { recursive: true });
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite did not expose an ephemeral port");
  const origin = `http://127.0.0.1:${address.port}`;
  const engines = { chromium, firefox, webkit };

  for (const [engineName, engine] of Object.entries(engines)) {
    const browser = await engine.launch({ headless: true });
    const viewports = engineName === "chromium"
      ? [{ name: "desktop-1920", width: 1920, height: 1080 }, { name: "desktop-1440", width: 1440, height: 900 }, { name: "desktop-short", width: 1366, height: 768 }, { name: "review-729", width: 729, height: 759 }, { name: "mobile-390", width: 390, height: 844 }, { name: "mobile-320", width: 320, height: 568 }]
      : [{ name: "desktop-1440", width: 1440, height: 900 }, { name: "mobile-390", width: 390, height: 844 }];

    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height }, reducedMotion: "reduce" });
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const prefix = `${engineName} ${viewport.name}`;

      fail(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${prefix}: horizontal page overflow`);
      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);
      fail((await page.locator(".brand svg").count()) < 2, `${prefix}: brand mark missing`);
      fail(await page.locator("img").evaluateAll((images) => images.some((image) => !image.complete || image.naturalWidth < 1)), `${prefix}: image failed to load`);

      const alignment = await page.evaluate(() => {
        const logo = document.querySelector(".masthead .brand")?.getBoundingClientRect();
        const title = document.querySelector("#hero-title")?.getBoundingClientRect();
        const masthead = document.querySelector(".masthead")?.getBoundingClientRect();
        return { delta: logo && title ? Math.abs(logo.left - title.left) : 999, titleTop: title?.top ?? 0, headerBottom: masthead?.bottom ?? 999 };
      });
      fail(alignment.delta > 1.1, `${prefix}: logo and hero left edges differ by ${alignment.delta.toFixed(2)}px`);
      fail(alignment.titleTop < alignment.headerBottom + 8, `${prefix}: hero title hides beneath fixed masthead`);

      const firstFrame = await page.evaluate(() => {
        const selectors = ["#hero-title", ".hero-line", ".hero-doors", ".hero-proof"];
        return selectors.map((selector) => {
          const rect = document.querySelector(selector)?.getBoundingClientRect();
          return { selector, top: rect?.top ?? -1, bottom: rect?.bottom ?? 99999 };
        });
      });
      fail(firstFrame.some(({ top, bottom }) => top < 0 || bottom > viewport.height + 1), `${prefix}: opening content does not fit first frame (${JSON.stringify(firstFrame)})`);
      const openingCollisions = await page.evaluate(() => {
        const pairs = [["#hero-title", ".hero-doors"], [".hero-line", ".hero-doors"], [".hero-proof", ".hero-doors"]];
        const overlap = (a, b) => a.left < b.right - 1 && a.right > b.left + 1 && a.top < b.bottom - 1 && a.bottom > b.top + 1;
        return pairs.filter(([left, right]) => overlap(document.querySelector(left).getBoundingClientRect(), document.querySelector(right).getBoundingClientRect())).map((pair) => pair.join(" / "));
      });
      fail(openingCollisions.length > 0, `${prefix}: opening regions collide (${openingCollisions.join(", ")})`);

      const targetsUnder44 = await page.locator("button:visible, a:visible").evaluateAll((nodes) => nodes.filter((node) => {
        const style = getComputedStyle(node);
        if (style.position === "fixed" && style.visibility === "hidden") return false;
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
      }).map((node) => ({ text: node.textContent?.trim().slice(0, 30), rect: node.getBoundingClientRect().toJSON() })));
      fail(targetsUnder44.some(({ text }) => !["Mindmake", "AI Brain or AI GTM"].includes(text)), `${prefix}: interactive target under 44px ${JSON.stringify(targetsUnder44)}`);

      await page.locator(".menu-control").click();
      fail(!(await page.locator("#site-menu").isVisible()), `${prefix}: menu did not open`);
      fail((await page.locator("#site-menu nav a").count()) !== 5, `${prefix}: menu destinations incomplete`);
      await page.keyboard.press("Escape");
      fail(await page.locator("#site-menu").isVisible(), `${prefix}: menu did not close with Escape`);

      await page.locator("#history").scrollIntoViewIfNeeded();
      await page.locator("[data-history-button='2']").click();
      fail(!(await page.getByRole("heading", { name: /children stop learning to think/i }).isVisible()), `${prefix}: history state did not change`);

      await page.locator("#authority").scrollIntoViewIfNeeded();
      await page.locator("[data-phase='organisation']").click();
      fail(!(await page.getByRole("heading", { name: "The organisation changes shape." }).isVisible()), `${prefix}: organisation phase did not activate`);
      fail(!(await page.locator(".organisation-network").isVisible()), `${prefix}: organisation instrument did not activate`);
      if (engineName === "chromium" && ["desktop-1440", "mobile-390"].includes(viewport.name)) {
        await page.locator("#authority").screenshot({ path: `${evidence}/${viewport.name}-authority-organisation.png` });
      }
      if (viewport.width <= 700) {
        const rowDeltas = await page.locator(".network-grid article").evaluateAll((cards) => {
          const rows = new Map();
          cards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const label = card.querySelector("small")?.getBoundingClientRect();
            const key = Math.round(rect.top);
            if (!rows.has(key)) rows.set(key, []);
            rows.get(key).push(label?.top ?? -999);
          });
          return [...rows.values()].filter((values) => values.length > 1).map((values) => Math.max(...values) - Math.min(...values));
        });
        fail(rowDeltas.some((delta) => delta > 1.1), `${prefix}: organisation labels are not horizontally aligned (${rowDeltas.join(", ")})`);
      }

      await page.locator("#practice").scrollIntoViewIfNeeded();
      await page.locator("[data-practice-tab='2']").click();
      fail(!(await page.getByRole("heading", { name: "Prepare", exact: true }).isVisible()), `${prefix}: practice stage did not change`);

      await page.locator("#benefits").scrollIntoViewIfNeeded();
      const benefitBefore = await page.locator(".benefit.is-active h2").textContent();
      await page.locator("[data-benefit-next]").click();
      const benefitAfter = await page.locator(".benefit.is-active h2").textContent();
      fail(benefitBefore === benefitAfter, `${prefix}: benefit carousel did not move`);

      await page.locator("#entry").scrollIntoViewIfNeeded();
      await page.locator("[data-route='gtm']").click();
      fail(!(await page.getByRole("heading", { name: /one tested commercial move/i }).isVisible()), `${prefix}: GTM route outcome did not activate`);
      fail(!(await page.locator("[data-start]").getAttribute("href"))?.includes("route=gtm"), `${prefix}: primary action did not follow route`);
      await page.locator("[data-start]").scrollIntoViewIfNeeded();
      const actionRect = await page.locator("[data-start]").evaluate((element) => element.getBoundingClientRect().toJSON());
      fail(actionRect.top < 0 || actionRect.bottom > viewport.height - 4, `${prefix}: primary action cannot be fully exposed above the viewport bottom after scroll`);

      if (engineName === "chromium") {
        await page.goto(origin + route, { waitUntil: "networkidle" });
        await page.screenshot({ path: `${evidence}/${viewport.name}-opening.png`, fullPage: false });
        await page.screenshot({ path: `${evidence}/${viewport.name}-full.png`, fullPage: true });
        if (["desktop-1440", "mobile-390"].includes(viewport.name)) {
          for (const selector of ["#history", "#authority", "#practice", "#benefits", "#return", "#entry"]) {
            await page.locator(selector).screenshot({ path: `${evidence}/${viewport.name}-${selector.slice(1)}.png` });
          }
        }
      }
      await page.close();
    }
    await browser.close();
  }

  console.log(JSON.stringify({ origin, evidence, checks: "3 engines, 10 viewport sessions, first-frame fit, fixed-header clearance, logo alignment, navigation, history, authority, mobile label rows, practice, benefits and route outcome", failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
