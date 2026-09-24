import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/shared-language-configurator/index.html";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });

try {
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite did not expose an ephemeral TCP port");
  const origin = `http://127.0.0.1:${address.port}`;

  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewportSize: viewport });
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.evaluate(() => localStorage.removeItem("mindmake-shared-language-combination-v1"));
      await page.reload({ waitUntil: "networkidle" });
      const prefix = `${name} ${viewport.width}x${viewport.height}`;

      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);
      fail(await page.locator('input[type="radio"]').count() !== 25, `${prefix}: wrong control count`);
      fail(await page.locator(".segments span").evaluateAll((nodes) => nodes.some((node) => node.getBoundingClientRect().height < 44)), `${prefix}: short target`);
      fail(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), `${prefix}: horizontal overflow`);
      fail(!(await page.locator("img").evaluateAll((nodes) => nodes.every((node) => node.complete && node.naturalWidth > 0))), `${prefix}: logo asset missing`);
      fail(await page.locator('[data-route="leadership"]:visible').count() !== 0, `${prefix}: duplicate leadership route visible in homepage-only state`);

      await page.locator('label:has(input[name="blog"][value="Journal"])').click();
      await page.locator('label:has(input[name="answers"][value="Questions leaders ask"])').click();
      await page.locator('label:has(input[name="leadershipMode"][value="companion"])').click();
      fail(await page.locator('[data-copy="blog"]:visible').first().textContent() !== "Journal", `${prefix}: editorial label did not update`);
      fail(await page.locator('[data-copy="answers"]:visible').first().textContent() !== "Questions leaders ask", `${prefix}: answer label did not update`);
      fail(await page.locator('[data-route="leadership"]:visible').first().textContent() !== "The human choice", `${prefix}: route treatment did not update`);

      await page.getByRole("button", { name: "Lock these language decisions" }).click();
      fail(!(await page.getByRole("button", { name: "Language decisions locked" }).isVisible()), `${prefix}: lock readback missing`);
      await page.reload({ waitUntil: "networkidle" });
      fail(!(await page.getByRole("button", { name: "Language decisions locked" }).isVisible()), `${prefix}: selection persistence failed`);
      fail(!(await page.getByLabel("Journal", { exact: true }).isChecked()), `${prefix}: editorial selection was not restored`);
      fail(!(await page.getByLabel("Keep a deeper story", { exact: false }).isChecked()), `${prefix}: route selection was not restored`);
    }
    await browser.close();
  }

  console.log(JSON.stringify({ origin, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
