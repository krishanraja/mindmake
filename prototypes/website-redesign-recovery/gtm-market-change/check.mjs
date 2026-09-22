import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const conceptDir = fileURLToPath(new URL("./", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const fixture = JSON.parse(
  await readFile(new URL("../../../src/data/vnext/gtm-signals.json", import.meta.url), "utf8")
);
const browserPath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const issues = [];
const observations = [];
const roleModels = [
  {
    product: ["Human sets the roadmap", "AI assists"],
    price: ["Human sets the bundle", "AI stays inside it"],
    positioning: ["Human leads the promise", "AI supports"],
    people: ["Human keeps control", "AI prepares"]
  },
  {
    product: ["Human defines the task", "Agent completes it"],
    price: ["Human sets the limits", "System meters use"],
    positioning: ["Human owns the promise", "Agent shows proof"],
    people: ["Human handles exceptions", "Agent runs the routine"]
  },
  {
    product: ["Human sets the standard", "Agent acts"],
    price: ["Human sets the value", "System verifies"],
    positioning: ["Human owns trust", "Agent proves the result"],
    people: ["Human judges appeals", "Agent improves"]
  }
];

const server = await createServer({
  root: repoRoot,
  logLevel: "error",
  server: { host: "127.0.0.1", port: 0 }
});

await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const conceptUrl = `${origin}/prototypes/website-redesign-recovery/gtm-market-change/`;
const browser = await chromium.launch({ headless: true, executablePath: browserPath });

function monitor(page, label) {
  page.on("pageerror", (error) => issues.push(`${label}: page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") issues.push(`${label}: console error: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) {
      issues.push(`${label}: HTTP ${response.status()} ${response.url()}`);
    }
  });
}

async function geometry(page, label) {
  const result = await page.evaluate(() => {
    const documentElement = document.documentElement;
    const controls = [
      ...document.querySelectorAll(
        "button:not([hidden]), summary, .wordmark, .signal-tab, .response-paddle"
      )
    ]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: element.textContent.trim().replace(/\s+/g, " ").slice(0, 60),
          width: rect.width,
          height: rect.height
        };
      });

    return {
      clientWidth: documentElement.clientWidth,
      scrollWidth: documentElement.scrollWidth,
      controls
    };
  });

  assert.ok(
    result.scrollWidth <= result.clientWidth + 1,
    `${label}: horizontal overflow ${result.scrollWidth} > ${result.clientWidth}`
  );

  for (const control of result.controls) {
    assert.ok(
      control.width >= 44 && control.height >= 44,
      `${label}: undersized control "${control.label}" at ${control.width}x${control.height}`
    );
  }
}

async function openPage(label, viewport, query = "") {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  monitor(page, label);
  await page.goto(`${conceptUrl}index.html${query}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await geometry(page, label);
  return page;
}

const desktop = await openPage("desktop 1440x900", { width: 1440, height: 900 });
const skipBeforeFocus = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipBeforeFocus.y + skipBeforeFocus.height <= 0, "Skip link should stay fully off-screen until focused.");
await desktop.locator(".skip-link").focus();
await desktop.waitForTimeout(220);
const skipAfterFocus = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipAfterFocus.y >= 0, "Skip link should become visible on keyboard focus.");
assert.equal(
  (await desktop.locator(".decision-instruction").textContent()).trim(),
  "Pick the move you would back. The machine shows what it changes."
);
assert.equal(
  (await desktop.locator(".consequence-intro > p").textContent()).trim(),
  "See the human-and-agent business this choice creates."
);
const signalLayout = await desktop.locator(".signal-selector").evaluate((selector) => {
  const tabs = [...selector.querySelectorAll(".signal-tab")].map((tab) => {
    const rect = tab.getBoundingClientRect();
    return { top: rect.top, width: rect.width, height: rect.height };
  });
  const rect = selector.getBoundingClientRect();
  return { width: rect.width, tabs };
});
assert.ok(signalLayout.width >= 1000, `Signal selector should use the available desktop width, got ${signalLayout.width}`);
assert.ok(signalLayout.tabs.every((tab) => tab.width >= 180), "Signal choices should have enough width for aligned labels.");
assert.ok(signalLayout.tabs.every((tab) => tab.height <= 112), "Signal choices should not become tall empty boxes.");
assert.ok(
  Math.max(...signalLayout.tabs.map((tab) => tab.top)) - Math.min(...signalLayout.tabs.map((tab) => tab.top)) <= 1,
  "Signal choices should share one aligned baseline."
);
assert.equal(await desktop.locator(".instrument").getAttribute("data-build"), "idle");
await desktop.evaluate(() => {
  const target = document.querySelector(".instrument");
  window.scrollTo(0, target.offsetTop - (window.innerHeight * 0.6));
});
await desktop.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "building");
await desktop.evaluate(() => {
  const target = document.querySelector(".instrument");
  window.scrollTo(0, target.offsetTop - (window.innerHeight * 0.12));
});
await desktop.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
assert.equal(await desktop.locator(".instrument").evaluate((element) =>
  getComputedStyle(element).getPropertyValue("--build-offset").trim()
), "0px");
observations.push("Scroll moves the machinery, traces and consequence leaves from idle through building to built.");

for (const [signalKey, signal] of Object.entries(fixture)) {
  await desktop.locator(`.signal-tab:has(input[value="${signalKey}"])`).click();
  assert.equal(await desktop.locator("#signal-observation").textContent(), signal.observation);
  assert.equal(await desktop.locator("#decision-question").textContent(), signal.question);

  for (let index = 0; index < signal.responses.length; index += 1) {
    const response = signal.responses[index];
    await desktop.locator(`.response-paddle:has(input[value="${index}"])`).click();
    assert.equal(await desktop.locator("#outcome-product").textContent(), response.product);
    assert.equal(await desktop.locator("#outcome-price").textContent(), response.price);
    assert.equal(await desktop.locator("#outcome-positioning").textContent(), response.positioning);
    assert.equal(await desktop.locator("#outcome-people").textContent(), response.people);
    for (const key of ["product", "price", "positioning", "people"]) {
      assert.equal(await desktop.locator(`#role-${key}-human`).textContent(), roleModels[index][key][0]);
      assert.equal(await desktop.locator(`#role-${key}-agent`).textContent(), roleModels[index][key][1]);
    }
    assert.equal(await desktop.locator("#test-title").textContent(), response.testTitle);
    assert.equal(await desktop.locator("#test-body").textContent(), response.testBody);
  }
}

await desktop.locator('.signal-tab:has(input[value="pricing"])').click();
await desktop.locator('.response-paddle:has(input[value="0"])').click();
await desktop.locator('.response-paddle:has(input[value="2"])').click();
assert.equal(await desktop.locator("#undo").isVisible(), true);
await desktop.locator("#undo").click();
assert.equal(await desktop.locator('input[name="response"]:checked').getAttribute("value"), "0");
assert.equal(await desktop.locator("#undo").isHidden(), true);

await desktop.locator('input[name="response"][value="0"]').focus();
await desktop.keyboard.press("ArrowRight");
assert.equal(await desktop.locator('input[name="response"]:checked').getAttribute("value"), "1");

await desktop.locator(".evidence-drawer summary").click();
assert.equal(await desktop.locator("#signal-source").isVisible(), true);
assert.equal(
  await desktop.locator("#signal-source").getAttribute("href"),
  fixture.pricing.source
);
await geometry(desktop, "desktop after interactions");
observations.push("All 5 signals x 3 responses update four consequences and the test.");
observations.push("Step 01 uses one compact aligned signal rail, and Step 02 states the visitor's decision job before the consequences appear.");
observations.push("Every consequence shows the human and agent responsibility split for the selected move.");
observations.push("One-level undo restores the prior response and then clears.");
observations.push("Radio keyboard movement changes the selected response.");
await desktop.close();

const mobile = await openPage("mobile 390x844", { width: 390, height: 844 });
assert.equal(await mobile.locator("#decision-question").textContent(), fixture.pricing.mobileQuestion);
assert.equal(await mobile.locator("#mobile-role-human").textContent(), roleModels[1].product[0]);
assert.equal(await mobile.locator("#mobile-role-agent").textContent(), roleModels[1].product[1]);
const mobileSignalLayout = await mobile.locator(".signal-selector").evaluate((selector) => ({
  clientWidth: selector.clientWidth,
  scrollWidth: selector.scrollWidth
}));
assert.ok(
  mobileSignalLayout.scrollWidth <= mobileSignalLayout.clientWidth + 1,
  "Mobile signal choices should reflow without a nested horizontal scroller."
);
for (let index = 1; index <= 4; index += 1) {
  await mobile.locator("#stage-next").click();
  assert.equal(await mobile.locator("#stage-count").textContent(), `${index + 1} of 5`);
  if (index < 4) {
    const key = ["product", "price", "positioning", "people"][index];
    assert.equal(await mobile.locator("#mobile-role-human").textContent(), roleModels[1][key][0]);
    assert.equal(await mobile.locator("#mobile-role-agent").textContent(), roleModels[1][key][1]);
  }
}
assert.equal(await mobile.locator("#test-slip").isVisible(), true);
await mobile.locator("#stage-next").click();
assert.equal(await mobile.locator("#stage-count").textContent(), "1 of 5");
assert.equal(await mobile.locator("#test-slip").isHidden(), true);
await mobile.locator("#stage-next").click();
await mobile.locator("#stage-back").click();
assert.equal(await mobile.locator("#stage-count").textContent(), "1 of 5");
await geometry(mobile, "mobile after full sequence");
observations.push("Mobile advances Product, Price, Positioning, People and Customer test, then reverses.");
await mobile.close();

for (const item of [
  ["small mobile 320x568", { width: 320, height: 568 }],
  ["large mobile 430x932", { width: 430, height: 932 }],
  ["mobile landscape 844x390", { width: 844, height: 390 }]
]) {
  const page = await openPage(item[0], item[1]);
  await page.close();
}

const zoomed = await openPage("mobile 200 percent base text", { width: 390, height: 844 });
await zoomed.addStyleTag({ content: "html { font-size: 200% !important; }" });
await geometry(zoomed, "mobile 200 percent base text");
await zoomed.close();

const reducedContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce"
});
const reducedPage = await reducedContext.newPage();
monitor(reducedPage, "mobile reduced motion");
await reducedPage.goto(`${conceptUrl}index.html`, { waitUntil: "networkidle" });
await reducedPage.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
assert.equal(await reducedPage.locator("#mobile-copy").isVisible(), true);
await reducedPage.locator("#stage-next").click();
assert.equal(await reducedPage.locator("#stage-count").textContent(), "2 of 5");
await geometry(reducedPage, "mobile reduced motion");
await reducedContext.close();

const noJsContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  javaScriptEnabled: false
});
const noJsPage = await noJsContext.newPage();
await noJsPage.goto(`${conceptUrl}index.html`, { waitUntil: "networkidle" });
assert.equal(await noJsPage.locator(".outcome-grid").isVisible(), true);
assert.equal(await noJsPage.locator(".outcome-grid .paper-leaf").count(), 4);
assert.equal(await noJsPage.locator("#test-slip").isVisible(), true);
await geometry(noJsPage, "mobile no JavaScript");
await noJsContext.close();
observations.push("The no-JavaScript mobile fallback keeps all four consequences and the test readable.");

for (const state of ["ready", "stale", "quiet", "error", "conflicted"]) {
  const page = await openPage(
    `evidence state ${state}`,
    { width: 390, height: 844 },
    `?state=${state}`
  );
  assert.equal(await page.locator("html").getAttribute("data-evidence-state"), state);
  assert.match(await page.locator("#evidence-state").textContent(), new RegExp(`^${state}`, "i"));
  await page.close();
}
observations.push("Ready, stale, quiet, error and conflicted evidence labels are explicit.");

const review = await browser.newPage({ viewport: { width: 1500, height: 1600 } });
monitor(review, "paired review");
await review.goto(`${conceptUrl}review.html`, { waitUntil: "networkidle" });
await review.evaluate(() => document.fonts.ready);
await review.screenshot({ path: `${conceptDir}paired-review.png` });
await review.close();

const desktopShot = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
monitor(desktopShot, "desktop screenshot");
await desktopShot.goto(`${conceptUrl}index.html?render=final`, { waitUntil: "networkidle" });
await desktopShot.evaluate(() => document.fonts.ready);
await desktopShot.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
await desktopShot.screenshot({ path: `${conceptDir}desktop-1440.png`, fullPage: true });
await desktopShot.close();

const mobileShot = await browser.newPage({ viewport: { width: 390, height: 844 } });
monitor(mobileShot, "mobile screenshot");
await mobileShot.goto(`${conceptUrl}index.html?render=final`, { waitUntil: "networkidle" });
await mobileShot.evaluate(() => document.fonts.ready);
await mobileShot.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
await mobileShot.screenshot({ path: `${conceptDir}mobile-390.png`, fullPage: true });
await mobileShot.close();

await browser.close();
await server.close();

assert.deepEqual(issues, [], issues.join("\n"));
console.log(JSON.stringify({
  result: "pass",
  origin,
  viewports: ["1440x900", "390x844", "320x568", "430x932", "844x390"],
  evidenceStates: Object.keys(evidenceStatesForReport()),
  observations
}, null, 2));

function evidenceStatesForReport() {
  return { ready: 1, stale: 1, quiet: 1, error: 1, conflicted: 1 };
}
