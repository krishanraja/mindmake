import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
const expectedLockedHashes = {
  "index.html": "8fd9b051275bcba3f80676e298f8d60e351bcb0bde82725ff1b82de7e6742e65",
  "styles.css": "6b97b5310fbde129fc2b8f0157f428e15faaa450a4fb8330a52cb5fb10c263b1",
  "script.js": "dafd80d54f24b7f4154a7326522d03d92edca9e999e7e1a09fb4f31856fe9dce",
  "index-fit.html": "5627da62409a76cc58de393457f9ce96fc40c2a08558c6d3cfc9feb8694b36b8",
  "styles-fit.css": "22f57b32606dc93d529a42a7ed9ca5055d53851029c81f7554ea6c8716cb6c36"
};
const expectedFilmHashes = {
  "quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4": "c7ea1d7bbad9208674f7d8953d53ab86e2678fdd852fc3ad8b0f5c14737040b7",
  "signals-arrive-loop-r01-20s-720p-web-sealed.mp4": "c57f9b0ed3a9c2f6af92bfb057ad51b6d570389b53de6fad5e251ceea5c41f39"
};
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

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

for (const [name, expected] of Object.entries(expectedLockedHashes)) {
  const bytes = await readFile(new URL(name, import.meta.url));
  assert.equal(sha256(bytes), expected, `Locked baseline changed: ${name}`);
}

for (const [name, expected] of Object.entries(expectedFilmHashes)) {
  const bytes = await readFile(new URL(`../../../src/assets/films/sep2026/${name}`, import.meta.url));
  assert.equal(sha256(bytes), expected, `Approved film source changed: ${name}`);
}

const baselineMarkup = await readFile(new URL("index-fit.html", import.meta.url), "utf8");
const candidateMarkup = await readFile(new URL("index-motion.html", import.meta.url), "utf8");
const motionScript = await readFile(new URL("script-motion.js", import.meta.url), "utf8");
const additiveBlocks = [
  '    <link rel="stylesheet" href="./styles-motion.css" />\n',
  `        <figure class="motion-scene motion-scene--threshold" aria-hidden="true" data-motion-scene="threshold">
          <video
            class="motion-film"
            data-motion-video="threshold"
            data-src="../../../src/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4"
            poster="./media/quiet-workshop-growth-poster.png"
            preload="none"
            muted
            loop
            playsinline
          ></video>
          <span class="motion-scrim"></span>
          <span class="motion-readout"><i></i> Workshop active</span>
        </figure>
`,
  `        <figure class="motion-scene motion-scene--signals" aria-hidden="true" data-motion-scene="signals">
          <video
            class="motion-film"
            data-motion-video="signals"
            data-src="../../../src/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4"
            poster="./media/signals-arrive-poster.png"
            preload="none"
            muted
            loop
            playsinline
          ></video>
          <span class="motion-scrim"></span>
          <span class="motion-readout"><i></i> Signal feed</span>
        </figure>
`,
  '    <script type="module" src="./script-motion.js"></script>\n'
];
let recoveredBaseline = candidateMarkup;
for (const block of additiveBlocks) {
  assert.equal(recoveredBaseline.split(block).length - 1, 1, "Each declared motion delta must occur exactly once.");
  recoveredBaseline = recoveredBaseline.replace(block, "");
}
assert.equal(recoveredBaseline, baselineMarkup, "Candidate contains a change outside the declared additive motion delta.");
assert.equal(/currentTime|requestAnimationFrame\([^)]*scroll/i.test(motionScript), false, "Film playback must not be scroll-scrubbed.");
observations.push("Locked S3-FIT files and both approved film sources match their recorded hashes.");
observations.push("The candidate is exactly the locked markup plus two film scenes and the additive style and controller references.");

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
  await page.goto(`${conceptUrl}index-motion.html${query}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await geometry(page, label);
  return page;
}

async function firstScreenMetrics(page) {
  return page.evaluate(() => {
    const deck = document.querySelector(".signal-deck").getBoundingClientRect();
    const selector = document.querySelector(".signal-selector").getBoundingClientRect();
    const nextSection = document.querySelector(".question-block").getBoundingClientRect();
    return {
      deckTop: deck.top,
      deckBottom: deck.bottom,
      selectorBottom: selector.bottom,
      nextSectionTop: nextSection.top,
      viewportHeight: window.innerHeight
    };
  });
}

const desktop = await openPage("desktop 1440x900", { width: 1440, height: 900 });
const desktopFit = await firstScreenMetrics(desktop);
assert.ok(
  desktopFit.deckBottom <= desktopFit.viewportHeight,
  `Desktop first signal should complete inside the viewport: ${desktopFit.deckBottom} > ${desktopFit.viewportHeight}`
);
assert.ok(desktopFit.nextSectionTop >= desktopFit.viewportHeight, "Desktop must not clip the next section into the first screen.");
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
await desktop.waitForFunction(() => document.documentElement.dataset.activeFilm);
let motionState = await desktop.evaluate(() => ({
  active: document.documentElement.dataset.activeFilm,
  playing: [...document.querySelectorAll("video")].filter((video) => !video.paused).length
}));
assert.equal(motionState.active, "threshold", "The opening workshop should own the first motion moment.");
assert.equal(motionState.playing, 1, "Exactly one film may play on the first screen.");
await desktop.evaluate(() => document.querySelector(".signal-deck").scrollIntoView({ block: "center" }));
await desktop.waitForFunction(() => document.documentElement.dataset.activeFilm === "signals");
motionState = await desktop.evaluate(() => ({
  active: document.documentElement.dataset.activeFilm,
  playing: [...document.querySelectorAll("video")].filter((video) => !video.paused).length
}));
assert.equal(motionState.playing, 1, "The signal film must replace, not join, the opening loop.");
observations.push("The workshop film hands motion to the signal film as the visitor scrolls, with exactly one active loop.");
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
await desktop.waitForFunction(() => [...document.querySelectorAll("video")].every((video) => video.paused));
assert.equal(await desktop.locator("html").getAttribute("data-active-film"), null);
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

for (const [label, viewport] of [
  ["supplied desktop shape 1880x953", { width: 1880, height: 953 }],
  ["short desktop 1440x700", { width: 1440, height: 700 }]
]) {
  const page = await openPage(label, viewport);
  const fit = await firstScreenMetrics(page);
  assert.ok(
    fit.deckBottom <= fit.viewportHeight,
    `${label}: complete signal deck should fit, got ${fit.deckBottom} > ${fit.viewportHeight}`
  );
  assert.ok(fit.nextSectionTop >= fit.viewportHeight, `${label}: next section should begin below the fold.`);
  await page.close();
}
observations.push("The complete first market-signal deck fits at 1880x953, 1440x900 and 1440x700.");

const mobile = await openPage("mobile 390x844", { width: 390, height: 844 });
const mobileFit = await firstScreenMetrics(mobile);
assert.ok(
  mobileFit.deckBottom <= mobileFit.viewportHeight,
  `390x844: complete signal deck should fit, got ${mobileFit.deckBottom} > ${mobileFit.viewportHeight}`
);
assert.ok(mobileFit.nextSectionTop >= mobileFit.viewportHeight, "390x844: next section should begin below the fold.");
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
observations.push("At 390x844 the complete market-signal deck fits before the next section begins.");
await mobile.close();

for (const item of [
  ["small mobile 320x568", { width: 320, height: 568 }],
  ["mobile 360x800", { width: 360, height: 800 }],
  ["large mobile 430x932", { width: 430, height: 932 }],
  ["tablet portrait 768x1024", { width: 768, height: 1024 }],
  ["mobile landscape 844x390", { width: 844, height: 390 }],
  ["tablet landscape 1024x768", { width: 1024, height: 768 }],
  ["desktop 1280x800", { width: 1280, height: 800 }],
  ["desktop 1920x1080", { width: 1920, height: 1080 }]
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
await reducedPage.goto(`${conceptUrl}index-motion.html`, { waitUntil: "networkidle" });
await reducedPage.waitForFunction(() => document.documentElement.dataset.motionPolicy === "poster");
assert.equal(
  await reducedPage.locator("video").evaluateAll((items) => items.every((video) => !video.getAttribute("src") && video.paused)),
  true,
  "Reduced motion must keep both films on their poster frames without loading playback sources."
);
await reducedPage.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
assert.equal(await reducedPage.locator("#mobile-copy").isVisible(), true);
await reducedPage.locator("#stage-next").click();
assert.equal(await reducedPage.locator("#stage-count").textContent(), "2 of 5");
await geometry(reducedPage, "mobile reduced motion");
await reducedContext.close();
observations.push("Reduced motion keeps the complete experience and both visual grounds while loading no film playback source.");

const saveDataContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await saveDataContext.addInitScript(() => {
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: { saveData: true, addEventListener() {} }
  });
});
const saveDataPage = await saveDataContext.newPage();
monitor(saveDataPage, "mobile save-data");
await saveDataPage.goto(`${conceptUrl}index-motion.html`, { waitUntil: "networkidle" });
await saveDataPage.waitForFunction(() => document.documentElement.dataset.motionPolicy === "poster");
assert.equal(
  await saveDataPage.locator("video").evaluateAll((items) => items.every((video) => !video.getAttribute("src") && video.paused)),
  true,
  "Save-data must keep both films on posters without loading playback sources."
);
assert.equal(await saveDataPage.locator("#page-title").isVisible(), true);
assert.equal(await saveDataPage.locator("#signal-observation").isVisible(), true);
await geometry(saveDataPage, "mobile save-data");
await saveDataContext.close();
observations.push("Save-data mode loads no film source while retaining the opening promise and market evidence.");

const unavailableContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const unavailablePage = await unavailableContext.newPage();
unavailablePage.on("pageerror", (error) => issues.push(`mobile unavailable media: page error: ${error.message}`));
let blockedMediaRequests = 0;
await unavailablePage.route(/\.mp4$/, (route) => {
  blockedMediaRequests += 1;
  return route.abort("failed");
});
await unavailablePage.goto(`${conceptUrl}index-motion.html`, { waitUntil: "networkidle" });
await unavailablePage.waitForTimeout(500);
assert.ok(blockedMediaRequests >= 1, "The missing-media scenario must block an attempted film request.");
assert.equal(await unavailablePage.locator("#page-title").isVisible(), true);
assert.equal(await unavailablePage.locator("#signal-observation").isVisible(), true);
assert.equal(
  await unavailablePage.locator("video").evaluateAll((items) => items.every((video) => Boolean(video.poster))),
  true,
  "Every film scene must retain a poster fallback."
);
await geometry(unavailablePage, "mobile unavailable media");
await unavailableContext.close();
observations.push("If motion media fails, poster-backed visuals and the full decision experience remain available.");

const noJsContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  javaScriptEnabled: false
});
const noJsPage = await noJsContext.newPage();
await noJsPage.goto(`${conceptUrl}index-motion.html`, { waitUntil: "networkidle" });
assert.equal(await noJsPage.locator(".outcome-grid").isVisible(), true);
assert.equal(await noJsPage.locator(".outcome-grid .paper-leaf").count(), 4);
assert.equal(await noJsPage.locator("#test-slip").isVisible(), true);
assert.equal(
  await noJsPage.locator("video").evaluateAll((items) => items.every((video) => !video.getAttribute("src") && Boolean(video.poster))),
  true,
  "No-JavaScript mode must use poster-backed decorative films without playback sources."
);
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

const review = await browser.newPage({ viewport: { width: 1500, height: 720 } });
monitor(review, "paired review");
await review.goto(`${conceptUrl}review-motion.html`, { waitUntil: "networkidle" });
await review.evaluate(() => document.fonts.ready);
await review.screenshot({ path: `${conceptDir}paired-motion.png` });
await review.close();

const desktopShot = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
monitor(desktopShot, "desktop screenshot");
await desktopShot.goto(`${conceptUrl}index-motion.html?render=final`, { waitUntil: "networkidle" });
await desktopShot.evaluate(() => document.fonts.ready);
await desktopShot.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
await desktopShot.screenshot({ path: `${conceptDir}desktop-motion-1440.png`, fullPage: true });
await desktopShot.close();

const mobileShot = await browser.newPage({ viewport: { width: 390, height: 844 } });
monitor(mobileShot, "mobile screenshot");
await mobileShot.goto(`${conceptUrl}index-motion.html?render=final`, { waitUntil: "networkidle" });
await mobileShot.evaluate(() => document.fonts.ready);
await mobileShot.waitForFunction(() => document.querySelector(".instrument")?.dataset.build === "built");
await mobileShot.screenshot({ path: `${conceptDir}mobile-motion-390.png`, fullPage: true });
await mobileShot.close();

await browser.close();
await server.close();

assert.deepEqual(issues, [], issues.join("\n"));
console.log(JSON.stringify({
  result: "pass",
  origin,
  viewports: ["320x568", "360x800", "390x844", "430x932", "768x1024", "844x390", "1024x768", "1280x800", "1440x700", "1440x900", "1880x953", "1920x1080"],
  evidenceStates: Object.keys(evidenceStatesForReport()),
  observations
}, null, 2));

function evidenceStatesForReport() {
  return { ready: 1, stale: 1, quiet: 1, error: 1, conflicted: 1 };
}
