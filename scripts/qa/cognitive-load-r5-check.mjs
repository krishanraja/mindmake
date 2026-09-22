import { chromium } from "playwright";

const baseUrl = process.env.MINDMAKE_BASE_URL ?? "http://127.0.0.1:4192";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

const failures = [];
const checks = [];
const assert = (condition, message) => {
  checks.push(message);
  if (!condition) failures.push(message);
};

const viewports = [
  { name: "small phone", width: 320, height: 568 },
  { name: "phone", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const wordsIn = async (locator) => locator.evaluate((element) => {
  const text = element.innerText.trim();
  return text ? text.split(/\s+/).length : 0;
});

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    reducedMotion: "no-preference",
  });

  for (const route of ["ai-brain", "ai-gtm"]) {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/${route}`, { waitUntil: "networkidle" });

    const geometry = await page.evaluate(() => ({
      bodyWidth: document.body.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    assert(geometry.bodyWidth <= geometry.viewportWidth + 1, `${route} has no page-level horizontal overflow at ${viewport.name}`);

    if (viewport.width <= 768 && route === "ai-brain") {
      const tabs = page.locator(".stage-nav button");
      const limits = [70, 55, 40, 50];
      for (let index = 0; index < 4; index += 1) {
        await tabs.nth(index).click();
        const active = page.locator(".state-panel.is-active");
        const [count, box, visiblePanels] = await Promise.all([
          wordsIn(active),
          active.boundingBox(),
          page.locator(".state-panel:visible").count(),
        ]);
        assert(count <= limits[index], `Brain stage ${index + 1} stays within ${limits[index]} visible words at ${viewport.name}`);
        assert(Boolean(box && box.height <= viewport.height * 1.05), `Brain stage ${index + 1} fits an intentional mobile reading frame at ${viewport.name}`);
        assert(visiblePanels === 1, `Brain shows one stage at a time at ${viewport.name}`);
      }
      assert(await page.locator(".living-graph").evaluate((element) => element.scrollWidth <= element.clientWidth + 1), `Brain map is contained without a hidden pan canvas at ${viewport.name}`);
      assert(await page.locator(".evidence-records").evaluate((element) => !element.hasAttribute("open")), `Brain source records use progressive disclosure at ${viewport.name}`);
      await page.locator(".stage-nav button").nth(3).click();
      await page.getByRole("button", { name: "Apply correction" }).click();
      assert((await page.locator(".brain-change aside b").innerText()).toLowerCase() === "updated", `Brain correction gives a clear result at ${viewport.name}`);
    }

    if (viewport.width <= 768 && route === "ai-gtm") {
      const tabs = page.locator(".decision-rail button");
      const limits = [50, 50, 35];
      for (let index = 0; index < 3; index += 1) {
        await tabs.nth(index).click();
        const active = page.locator(".decision-chapter:visible");
        const [count, box, visibleChapters] = await Promise.all([
          wordsIn(active),
          active.boundingBox(),
          page.locator(".decision-chapter:visible").count(),
        ]);
        assert(count <= limits[index], `GTM chapter ${index + 1} stays within ${limits[index]} visible words at ${viewport.name}`);
        assert(Boolean(box && box.height <= viewport.height * 1.05), `GTM chapter ${index + 1} fits an intentional mobile reading frame at ${viewport.name}`);
        assert(visibleChapters === 1, `GTM shows one chapter at a time at ${viewport.name}`);
      }
      await tabs.nth(1).click();
      const axisTabs = page.locator(".mobile-axis-tabs button");
      const before = await page.locator(".mobile-axis-card p").innerText();
      await axisTabs.nth(1).click();
      const after = await page.locator(".mobile-axis-card p").innerText();
      assert(before !== after, `GTM business effects reveal one useful change at a time at ${viewport.name}`);
      await tabs.nth(2).click();
      assert(await page.locator(".test-detail").evaluate((element) => !element.hasAttribute("open")), `GTM test explanation is optional by default at ${viewport.name}`);
    }

    const primary = page.locator("[data-mm-primary]").first();
    await primary.click();
    let dialogVisible = false;
    try {
      await page.locator('[role="dialog"]').waitFor({ state: "visible", timeout: 2000 });
      dialogVisible = true;
    } catch {
      dialogVisible = false;
    }
    assert(dialogVisible, `${route} primary action opens the next step at ${viewport.name}`);
    await page.close();
  }

  await context.close();
}

await browser.close();

console.log(`Cognitive-load contract: ${checks.length - failures.length}/${checks.length} checks passed.`);
if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
}
