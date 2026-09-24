import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/homepage-authority-configurator/index.html";
const evidence = "C:/Users/krish/.scratch/mindmake-homepage-authority-console";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });

try {
  await fs.mkdir(evidence, { recursive: true });
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite did not expose an ephemeral TCP port");
  const origin = `http://127.0.0.1:${address.port}`;
  const engines = { chromium, firefox, webkit };

  for (const [engineName, engine] of Object.entries(engines)) {
    const browser = await engine.launch({ headless: true });
    const viewports = engineName === "chromium"
      ? [{ name: "desktop-1440", width: 1440, height: 900 }, { name: "desktop-1920", width: 1920, height: 1080 }, { name: "review-729", width: 729, height: 759 }, { name: "mobile-390", width: 390, height: 844 }, { name: "mobile-320", width: 320, height: 568 }]
      : [{ name: "desktop-1440", width: 1440, height: 900 }, { name: "desktop-1920", width: 1920, height: 1080 }];

    for (const viewport of viewports) {
      const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
      const errors = [];
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(origin + route, { waitUntil: "networkidle" });
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const prefix = `${engineName} ${viewport.name}`;

      fail(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${prefix}: horizontal page overflow`);
      fail(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1), `${prefix}: vertical page overflow`);
      fail(!(await page.getByText("01 / 21", { exact: true }).isVisible()), `${prefix}: progress not visible`);
      fail((await page.locator(".decision-card").count()) !== 1, `${prefix}: expected one decision card`);
      fail(await page.locator("button:visible:not(.authority-frame button)").evaluateAll((buttons) => buttons.some((button) => button.getBoundingClientRect().height < 43.5)), `${prefix}: console button under 44px`);
      fail(await page.locator(".decision-option:visible").evaluateAll((options) => options.some((option) => option.getBoundingClientRect().height < 43.5)), `${prefix}: choice under 44px`);
      fail(!(await page.locator("[data-decision-note]:visible").isVisible()), `${prefix}: per-decision note missing`);
      fail(!(await page.locator(".authority-film img:visible").evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))), `${prefix}: film poster failed`);
      fail(!(await page.locator(".authority-frame:visible [data-stage-panel=work]").isVisible()), `${prefix}: Work instrument missing`);
      fail(!(await page.locator(".decision-card").evaluate((card) => card.scrollHeight <= card.clientHeight + 1)), `${prefix}: active decision clips or scrolls`);
      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);

      if (engineName === "chromium" && viewport.name === "review-729") {
        await page.goto(`${origin}${route}?decision=mobileLayout`, { waitUntil: "networkidle" });
        fail((await page.locator("[data-progress-count]").textContent()) !== "02 / 21", "direct authority correction link did not open the mobile-layout decision");
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "mobile", "direct authority correction link did not open the mobile preview");
        fail((await page.locator(".authority-frame:visible").getAttribute("data-phase-view")) !== "organisation", "direct authority correction link did not open the organisation state");
        fail(!(await page.getByRole("button", { name: /Review this correction/ }).isVisible()), "direct authority correction link did not expose the bounded review action");
      }

      if (engineName === "chromium") await page.screenshot({ path: `${evidence}/${viewport.name}-first-decision.png`, fullPage: false });

      if (engineName === "chromium" && viewport.name === "desktop-1440") {
        await page.getByRole("button", { name: /Next decision/ }).click();
        await page.locator('.decision-option:has(input[value="network"])').click();
        const labelTops = await page.locator('.device-mobile .organisation-grid article small').evaluateAll((nodes) => nodes.map((node) => node.getBoundingClientRect().top));
        for (const [rowName, indices] of [["top", [0, 1]], ["middle", [3, 2, 4]], ["bottom", [5, 6, 7]]]) {
          const row = indices.map((itemIndex) => labelTops[itemIndex]);
          fail(Math.max(...row) - Math.min(...row) > 1, `mobile network ${rowName} eyebrow labels are not horizontally aligned`);
        }
        await page.getByRole("button", { name: "Previous", exact: true }).click();
        await page.locator("[data-decision-note]").fill("Keep the mobile instrument below the copy.");
        for (let step = 0; step < 21; step += 1) {
          const progress = await page.locator("[data-progress-count]").textContent();
          fail(progress !== `${String(step + 1).padStart(2, "0")} / 21`, `sequence step ${step + 1}: wrong progress ${progress}`);
          const options = page.locator(".decision-option:visible");
          fail((await options.count()) < 2, `sequence step ${step + 1}: no usable choices`);
          await options.last().click();
          fail(!(await options.last().locator("input").isChecked()), `sequence step ${step + 1}: choice did not select`);
          if (step === 10) fail((await page.locator(".authority-frame:visible").getAttribute("data-phase-view")) !== "work", "Work copy decision did not show Work state");
          if (step === 11) fail((await page.locator(".authority-frame:visible").getAttribute("data-phase-view")) !== "organisation", "Organisation copy decision did not show Organisation state");
          if (step < 20) await page.getByRole("button", { name: /Next decision/ }).click();
        }
        await page.getByRole("button", { name: /Review choices/ }).click();
        fail(!(await page.getByRole("heading", { name: "Everything is together.", exact: true }).isVisible()), "review readback missing");
        fail((await page.locator("[data-review-group]").count()) !== 4, "review must show four compact groups");
        fail(!(await page.getByText("1 decision note preserved", { exact: true }).isVisible()), "decision-note readback missing");
        fail(!(await page.locator(".review-list mark").filter({ hasText: "Keep the mobile instrument below the copy." }).isVisible()), "full decision-note text missing from review");
        await page.locator("#authorityComment").fill("Overall authority note.");
        await page.getByRole("button", { name: /Submit choices and notes/ }).click();
        fail(!(await page.getByRole("heading", { name: "Selections submitted.", exact: true }).isVisible()), "submission readback missing");
        fail((await page.locator("#authorityComment").inputValue()) !== "Overall authority note.", "overall note missing from submitted readback");
        fail(!(await page.getByText("This is not production approval.", { exact: false }).isVisible()), "submission was not distinguished from approval");
        fail(!page.url().includes("feedback="), "decision feedback missing from locked URL");
        fail(!page.url().includes("overallFeedback="), "overall feedback missing from locked URL");
        await page.reload({ waitUntil: "networkidle" });
        fail(!(await page.getByRole("heading", { name: "Selections submitted.", exact: true }).isVisible()), "submission did not persist");
        await page.screenshot({ path: `${evidence}/desktop-1440-locked.png`, fullPage: false });
        await page.getByRole("button", { name: /Boundary:/ }).click();
        fail((await page.locator(".authority-frame:visible").getAttribute("data-phase-view")) !== "work", "Boundary group did not restore Work state");
        await page.getByRole("button", { name: "Mobile", exact: true }).click();
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "mobile", "mobile preview toggle failed");
        await page.getByRole("button", { name: "Organisation", exact: true }).first().click();
        fail((await page.locator(".authority-frame:visible").getAttribute("data-phase-view")) !== "organisation", "Organisation preview toggle failed");
        fail(!(await page.locator(".authority-frame:visible [data-stage-panel=organisation]").isVisible()), "Organisation instrument missing");
        await page.screenshot({ path: `${evidence}/desktop-shell-mobile-organisation.png`, fullPage: false });
        await page.reload({ waitUntil: "networkidle" });
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "mobile", "device state did not persist");
      }
      await page.close();
    }
    await browser.close();
  }

  console.log(JSON.stringify({ origin, evidence, checks: "3 engines, 9 viewport sessions, 21 decisions, autosave, verbatim feedback readback, submission semantics, phase and device switching", failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
