import { chromium, firefox, webkit } from "playwright";

const origin = process.env.MINDMAKE_ORIGIN || "http://127.0.0.1:4327";
const path = "/prototypes/website-redesign-recovery/component-selection/homepage-opening-configurator/index.html";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const readFit = (page) => page.locator(".preview-card").evaluateAll((cards) => cards.map((card) => {
  const stage = card.querySelector(".hero-stage").getBoundingClientRect();
  const copy = card.querySelector(".hero-copy");
  const children = [...copy.children].filter((node) => getComputedStyle(node).display !== "none");
  const first = children[0]?.getBoundingClientRect();
  const last = children.at(-1)?.getBoundingClientRect();
  return {
    kind: card.classList.contains("preview-mobile") ? "mobile" : "desktop",
    top: first?.top ?? stage.top,
    bottom: last?.bottom ?? stage.bottom,
    stageTop: stage.top,
    stageBottom: stage.bottom,
    scrollHeight: copy.scrollHeight,
    clientHeight: copy.clientHeight,
  };
}));

for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
  const browser = await engine.launch({ headless: true });
  for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewportSize: viewport });
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin + path, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("mindmake-homepage-opening-combination-v1"));
    await page.reload({ waitUntil: "networkidle" });
    const prefix = `${name} ${viewport.width}x${viewport.height}`;
    fail(errors.length > 0, `${prefix}: console errors ${errors.join(" | ")}`);
    fail(await page.locator("input[type=radio]").count() !== 43, `${prefix}: expected 43 radio controls`);
    const badTargets = await page.locator(".segments span").evaluateAll((nodes) => nodes.filter((node) => node.getBoundingClientRect().height < 44).length);
    fail(badTargets > 0, `${prefix}: ${badTargets} control targets below 44px`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
    fail(overflow, `${prefix}: horizontal overflow`);
    const assets = await page.locator("img").evaluateAll((nodes) => nodes.every((node) => node.complete && node.naturalWidth > 0));
    fail(!assets, `${prefix}: logo asset incomplete`);
    fail(await page.locator(".hero-copy h2").count() !== 2, `${prefix}: paired hero previews missing`);
    for (const fit of await readFit(page)) {
      fail(fit.top < fit.stageTop - 1 || fit.bottom > fit.stageBottom + 1 || fit.scrollHeight > fit.clientHeight + 1, `${prefix}: ${fit.kind} default opening does not fit ${JSON.stringify(fit)}`);
    }
    await page.locator('label:has(input[name="titleDesktop"][value="monumental"])').click();
    await page.locator('label:has(input[name="lede"][value="remove"])').click();
    for (const fit of await readFit(page)) {
      fail(fit.top < fit.stageTop - 1 || fit.bottom > fit.stageBottom + 1 || fit.scrollHeight > fit.clientHeight + 1, `${prefix}: ${fit.kind} changed opening does not fit ${JSON.stringify(fit)}`);
    }
    await page.getByRole("button", { name: "Lock this combination" }).click();
    fail(!(await page.getByRole("button", { name: "Combination locked" }).isVisible()), `${prefix}: lock state missing`);
    fail(!(await page.getByText("Desktop title scale: monumental", { exact: false }).isVisible()), `${prefix}: readback missing changed value`);
    await page.reload({ waitUntil: "networkidle" });
    fail(!(await page.getByRole("button", { name: "Combination locked" }).isVisible()), `${prefix}: lock did not persist`);
    fail(!(await page.getByLabel("Monumental", { exact: true }).nth(0).isChecked()), `${prefix}: selection did not persist`);
  }
  await browser.close();
}

console.log(JSON.stringify({ failures }, null, 2));
if (failures.length) process.exitCode = 1;
