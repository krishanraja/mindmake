import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/homepage-message-configurator/index.html";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });

const contained = async (page, selector) => page.locator(selector).evaluateAll((nodes) => nodes.every((node) => {
  const parent = node.closest(".site-frame");
  if (!parent) return false;
  const box = node.getBoundingClientRect();
  const frame = parent.getBoundingClientRect();
  return box.left >= frame.left - 1 && box.right <= frame.right + 1 && box.top >= frame.top - 1 && box.bottom <= frame.bottom + 1;
}));

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
      await page.evaluate(() => localStorage.removeItem("mindmake-homepage-message-combination-v1"));
      await page.reload({ waitUntil: "networkidle" });
      const prefix = `${name} ${viewport.width}x${viewport.height}`;

      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);
      fail(await page.locator('input[type="radio"]').count() !== 46, `${prefix}: wrong control count`);
      fail(await page.locator(".segments span").evaluateAll((nodes) => nodes.some((node) => node.getBoundingClientRect().height < 44)), `${prefix}: short target`);
      fail(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), `${prefix}: horizontal overflow`);
      fail(!(await page.locator("img").evaluateAll((nodes) => nodes.every((node) => node.complete && node.naturalWidth > 0))), `${prefix}: brand asset missing`);

      await page.locator('label:has(input[name="openingHeadline"][value="Build a business that gets smarter without becoming less human."])').click();
      await page.locator('label:has(input[name="openingLede"][value="AI can carry work that used to look like thinking. You keep the judgement."])').click();
      await page.locator('label:has(input[name="gtmDoorDetail"][value="Build your AI native pricing, positioning and org."])').click();
      fail(!(await contained(page, '.opening-stage:visible .opening-copy')), `${prefix}: opening copy escaped its frame`);
      fail(await page.locator('[data-copy="openingHeadline"]:visible').first().textContent() !== "Build a business that gets smarter without becoming less human.", `${prefix}: opening headline did not update`);

      await page.getByRole("button", { name: "AI Brain", exact: true }).click();
      await page.locator('label:has(input[name="brainHeadline"][value="Your AI brain begins with a real decision."])').click();
      fail(!(await contained(page, '.route-stage:visible .route-copy')), `${prefix}: Brain copy escaped its frame`);
      fail(await page.locator('[data-route-copy="headline"]:visible').first().textContent() !== "Your AI brain begins with a real decision.", `${prefix}: Brain headline did not update`);

      await page.getByRole("button", { name: "AI GTM", exact: true }).click();
      await page.locator('label:has(input[name="gtmHeadline"][value="We turn an AI market shift into one tested commercial move."])').click();
      fail(!(await contained(page, '.route-stage:visible .route-copy')), `${prefix}: GTM copy escaped its frame`);
      fail(await page.locator('[data-route-copy="headline"]:visible').first().textContent() !== "We turn an AI market shift into one tested commercial move.", `${prefix}: GTM headline did not update`);

      await page.getByRole("button", { name: "Lock the homepage message" }).click();
      fail(!(await page.getByRole("button", { name: "Homepage message locked" }).isVisible()), `${prefix}: lock readback missing`);
      await page.reload({ waitUntil: "networkidle" });
      fail(!(await page.getByRole("button", { name: "Homepage message locked" }).isVisible()), `${prefix}: persistence failed`);
      fail(!(await page.getByLabel("Build a business that gets smarter without becoming less human.", { exact: true }).isChecked()), `${prefix}: headline selection was not restored`);
    }
    await browser.close();
  }

  console.log(JSON.stringify({ origin, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
