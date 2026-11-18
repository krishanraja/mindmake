import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { FACTS, STEPS } from "../../src/features/who-decided/audit.ts";

// Run against a fresh, self-owned built preview. This is QA, not presentation.
const base = process.argv.find(arg => arg.startsWith("--base="))?.slice(7);
if (!base) throw new Error("Supply --base= for a self-owned built preview");
const output = path.resolve("artifacts/who-decided");
await mkdir(output, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const observations = [];
try {
  for (const [width, height] of [[375, 812], [320, 568], [390, 844], [844, 390], [1440, 900]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on("request", request => requests.push({ url: request.url(), body: request.postData() }));
    page.on("pageerror", error => errors.push(error.message));
    await context.route("**/*", route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.addInitScript(() => localStorage.setItem("mindmake_consent", "analytics"));
    await page.goto(`${base}/who-decided/`);
    await page.getByRole("button", { name: /Begin the audit/ }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.getAttribute('meta[name="robots"]', "content"), "noindex, nofollow");
    await page.getByRole("button", { name: /Begin the audit/ }).click();
    await page.waitForLoadState("networkidle");
    const baseline = requests.length;
    for (let index = 0; index < 6; index++) {
      assert.equal(await page.getByText(`Step ${index + 1} of 6`).count(), 1);
      assert.equal(await page.getByRole("radio").count(), 4);
      await page.getByRole("radio").first().focus();
      await page.keyboard.press("ArrowDown");
      assert.equal(await page.getByRole("radio").nth(1).isChecked(), true);
      await page.getByText("Private note (optional)", { exact: true }).click();
      await page.getByLabel(`Your note on ${STEPS[index].title.toLowerCase()}`).fill(`PRIVATE_QA_${index}_` + "Long private thought. ".repeat(20));
      const geometry = await page.locator(".wd-audit").evaluate(element => {
        const boxes = [...element.querySelectorAll(".wd-option, button, summary")].map(node => node.getBoundingClientRect());
        return { overflow: document.documentElement.scrollWidth > innerWidth, tooSmall: boxes.some(box => box.height < 44 || box.width < 44) };
      });
      assert.deepEqual(geometry, { overflow: false, tooSmall: false });
      if (index === 0) await page.screenshot({ path: path.join(output, `${width}-step.png`), fullPage: true });
      await page.getByRole("button", { name: index === 5 ? /Read my decision/ : /Continue/ }).click();
    }
    for (const fact of FACTS) assert.equal(await page.getByText(fact.text, { exact: true }).count(), 1);
    assert.equal(await page.locator(".wd-first").textContent(), "The decision");
    assert.equal(await page.locator(".wd-practice a.wd-next").getAttribute("href"), "/?start=1");
    assert.equal(await page.evaluate(() => document.scrollingElement.scrollHeight <= innerHeight), true, "The read fits the screen");
    await page.screenshot({ path: path.join(output, `${width}-read.png`), fullPage: true });
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.equal(requests.length, baseline, "Answers and notes must cause no requests");
    assert.equal(requests.some(request => /google-analytics|googletagmanager|clarity\.ms|plausible\.io|PRIVATE_QA/.test(request.url + (request.body ?? ""))), false);
    assert.equal(await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }).includes("PRIVATE_QA")), false);
    assert.deepEqual(errors, []);
    await page.reload();
    assert.equal(await page.getByRole("button", { name: /Begin the audit/ }).count(), 1);
    observations.push({ width, height, status: "pass", coverage: "six steps, keyboard, notes, facts, no requests, reset, targets, overflow, 200% text" });
    await context.close();
  }
  await writeFile(path.join(output, "browser-report.json"), JSON.stringify({ observations, physicalDevices: "not_run" }, null, 2));
  console.log(JSON.stringify(observations, null, 2));
} finally { await browser.close(); }
