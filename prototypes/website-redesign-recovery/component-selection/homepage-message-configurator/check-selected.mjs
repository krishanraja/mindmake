import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/homepage-message-configurator/index.html";
const evidence = "C:/Users/krish/.scratch/mindmake-homepage-message-selected";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const selected = {
  openingHeadline: "Build the business that can think with you.",
  openingLede: "Part people. Part agent. Led by judgement.",
  brainDoor: "Build your AI brain",
  brainDoorDetail: "Your judgement, running.",
  gtmDoor: "Build your AI GTM",
  gtmDoorDetail: "Build your AI native pricing, positioning and org.",
  openingProof: "Build the first working version on real work. Keep the system.",
  brainHeadline: "Make your judgement reusable.",
  brainLede: "Give your standards, context and past decisions a memory you can use.",
  brainCaption: "The next decision begins with what the last one taught you.",
  gtmHeadline: "We turn an AI market shift into one tested commercial move.",
  gtmLede: "See how one market change alters product, price, positioning and people before you commit.",
  gtmCaption: "Start with the commercial decision that is holding the rest of the system back.",
  backLabel: "AI Brain or AI GTM",
  receiptHeading: "What stays with you"
};

const contained = async (page, selector) => page.locator(selector).evaluateAll((nodes) => nodes.every((node) => {
  const frame = node.closest(".site-frame");
  if (!frame) return false;
  const box = node.getBoundingClientRect();
  const bounds = frame.getBoundingClientRect();
  return box.left >= bounds.left - 1 && box.right <= bounds.right + 1 && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1;
}));

const noCriticalOverlap = async (page, selector) => page.locator(selector).evaluateAll((nodes) => {
  const visible = nodes.filter((node) => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  });
  for (let index = 0; index < visible.length; index += 1) {
    for (let next = index + 1; next < visible.length; next += 1) {
      if (visible[index].closest(".site-frame") !== visible[next].closest(".site-frame")) continue;
      const a = visible[index].getBoundingClientRect();
      const b = visible[next].getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) return false;
    }
  }
  return true;
});

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
try {
  await fs.mkdir(evidence, { recursive: true });
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite did not expose an ephemeral TCP port");
  const origin = `http://127.0.0.1:${address.port}`;

  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewportSize: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin + route, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("mindmake-homepage-message-combination-v1"));
    await page.reload({ waitUntil: "networkidle" });

    for (const [field, value] of Object.entries(selected)) {
      await page.locator(`label:has(input[name=${JSON.stringify(field)}][value=${JSON.stringify(value)}])`).click();
    }

    for (const view of ["opening", "brain", "gtm"]) {
      const label = view === "opening" ? "Opening" : view === "brain" ? "AI Brain" : "AI GTM";
      await page.getByRole("button", { name: label, exact: true }).click();
      const prefix = `${name} ${view}`;
      fail(errors.length > 0, `${prefix}: ${errors.join(" | ")}`);
      fail(!(await contained(page, view === "opening" ? ".opening-stage:visible .opening-copy" : ".route-stage:visible .route-copy, .route-stage:visible figure, .route-stage:visible .receipt")), `${prefix}: selected content escaped its frame`);
      fail(!(await noCriticalOverlap(page, view === "opening" ? ".opening-stage:visible .opening-copy > *" : ".route-stage:visible .back, .route-stage:visible .route-copy > *, .route-stage:visible figure, .route-stage:visible .receipt")), `${prefix}: selected content overlaps`);
      fail(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), `${prefix}: page overflow`);
      if (name === "chromium") {
        await page.locator(`.preview-desktop`).screenshot({ path: `${evidence}/${view}-desktop.png` });
        await page.locator(`.preview-mobile`).screenshot({ path: `${evidence}/${view}-mobile.png` });
      }
    }

    await page.getByRole("button", { name: "Lock the homepage message" }).click();
    fail(!(await page.getByRole("button", { name: "Homepage message locked" }).isVisible()), `${name}: lock readback missing`);
    await page.reload({ waitUntil: "networkidle" });
    fail(!(await page.getByLabel(selected.gtmDoorDetail, { exact: true }).isChecked()), `${name}: custom GTM subheading did not persist`);
    await browser.close();
  }

  console.log(JSON.stringify({ origin, selected, evidence, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
