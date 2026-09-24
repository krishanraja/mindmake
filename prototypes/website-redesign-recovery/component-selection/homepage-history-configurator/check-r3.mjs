import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/homepage-history-configurator/index-r3.html";
const evidence = "C:/Users/krish/.scratch/mindmake-homepage-history-console-r3";
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
      fail((await page.locator(".decision-card").count()) !== 1, `${prefix}: expected one decision card`);
      fail(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), `${prefix}: horizontal page overflow`);
      fail(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 1), `${prefix}: vertical page overflow`);
      fail(!(await page.getByText("01 / 20", { exact: true }).isVisible()), `${prefix}: progress not visible`);
      fail((await page.locator(".decision-option:visible").count()) < 2, `${prefix}: choices are not visible`);
      fail(!(await page.locator("[data-decision-note]:visible").isVisible()), `${prefix}: per-decision note is not visible`);
      fail(await page.locator("button:visible:not(.history-frame button)").evaluateAll((buttons) => buttons.some((button) => button.getBoundingClientRect().height < 43.5)), `${prefix}: console button under 44px`);
      fail(await page.locator(".decision-option:visible").evaluateAll((options) => options.some((option) => option.getBoundingClientRect().height < 43.5)), `${prefix}: visible choice under 44px`);
      fail(await page.locator("img[data-story-image]:visible").evaluateAll((images) => images.some((image) => !image.complete || image.naturalWidth < 1)), `${prefix}: story image failed`);
      fail(!(await page.locator(".history-frame:visible .is-focused").count()), `${prefix}: affected preview region is not highlighted`);
      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);

      if (engineName === "chromium" && viewport.name === "review-729") {
        await page.goto(`${origin}${route}?decision=bridgeTreatment`, { waitUntil: "networkidle" });
        fail((await page.locator("[data-progress-count]").textContent()) !== "10 / 20", "direct history correction link did not open the bridge hierarchy decision");
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "desktop", "direct history correction link did not open the desktop preview");
        fail(!(await page.getByRole("button", { name: /Review this correction/ }).isVisible()), "direct history correction link did not expose the bounded review action");
      }

      const cardContained = await page.locator(".decision-card").evaluate((card) => card.scrollHeight <= card.clientHeight + 1);
      fail(!cardContained, `${prefix}: the active decision requires internal scrolling or clips`);

      if (engineName === "chromium") {
        await page.screenshot({ path: `${evidence}/${viewport.name}-first-decision.png`, fullPage: false });
      }

      if (engineName === "chromium" && viewport.name === "desktop-1440") {
        await page.locator("[data-decision-note]").fill("Mobile composition needs revision.");
        for (let step = 0; step < 20; step += 1) {
          const progress = await page.locator("[data-progress-count]").textContent();
          fail(progress !== `${String(step + 1).padStart(2, "0")} / 20`, `sequence step ${step + 1}: wrong progress ${progress}`);
          const visibleOptions = page.locator(".decision-option:visible");
          fail((await visibleOptions.count()) < 2, `sequence step ${step + 1}: no usable options`);
          await visibleOptions.last().click();
          const selected = await visibleOptions.last().locator("input").isChecked();
          fail(!selected, `sequence step ${step + 1}: choice did not select`);
          if (step < 19) await page.getByRole("button", { name: /Next decision/ }).click();
        }
        await page.getByRole("button", { name: /Review choices/ }).click();
        fail(!(await page.getByRole("heading", { name: "Everything is together.", exact: true }).isVisible()), "review readback missing");
        fail((await page.locator("[data-review-group]").count()) !== 4, "review must show four compact groups");
        fail(!(await page.getByText("1 decision note preserved", { exact: true }).isVisible()), "decision-note readback missing");
        fail(!(await page.locator(".review-list mark").filter({ hasText: "Mobile composition needs revision." }).isVisible()), "full decision-note text missing from review");
        await page.locator("#historyComment").fill("Overall chapter note.");
        await page.getByRole("button", { name: /Submit choices and notes/ }).click();
        fail(!(await page.getByRole("heading", { name: "Selections submitted.", exact: true }).isVisible()), "submission readback missing");
        fail((await page.locator("#historyComment").inputValue()) !== "Overall chapter note.", "overall note missing from submitted readback");
        fail(!(await page.getByText("This is not production approval.", { exact: false }).isVisible()), "submission was not distinguished from approval");
        fail(!page.url().includes("feedback="), "decision feedback missing from locked URL");
        fail(!page.url().includes("overallFeedback="), "overall feedback missing from locked URL");
        await page.reload({ waitUntil: "networkidle" });
        fail(!(await page.getByRole("heading", { name: "Selections submitted.", exact: true }).isVisible()), "submission state did not persist on reload");
        await page.screenshot({ path: `${evidence}/desktop-1440-locked.png`, fullPage: false });

        await page.getByRole("button", { name: /Questions:/ }).click();
        await page.getByRole("button", { name: /Next decision/ }).click();
        await page.getByRole("button", { name: /Next decision/ }).click();
        fail(!(await page.locator('.story-switch [data-story="2"]').getAttribute("class"))?.includes("is-active"), "calculator question did not auto-select calculator story");
        await page.getByRole("button", { name: "Mobile", exact: true }).click();
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "mobile", "mobile toggle failed");
        await page.screenshot({ path: `${evidence}/desktop-shell-mobile-preview-calculator.png`, fullPage: false });

        await page.reload({ waitUntil: "networkidle" });
        fail((await page.locator(".preview-stage").getAttribute("data-device-view")) !== "mobile", "device preference did not persist");
        fail(!(await page.locator('.story-switch [data-story="2"]').getAttribute("class"))?.includes("is-active"), "story preference did not persist");
      }
      await page.close();
    }
    await browser.close();
  }

  console.log(JSON.stringify({ origin, evidence, checks: "3 engines, 9 viewport sessions, 20-decision interaction, verbatim feedback readback, autosave, submission semantics, device and story switching", failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
