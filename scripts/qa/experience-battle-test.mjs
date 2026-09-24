#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.env.QA_ORIGIN || "http://127.0.0.1:4192";
const output = process.env.QA_OUTPUT || "C:/Users/krish/.scratch/mindmake-experience-battle-test";
const viewports = [
  ["compact-320x568", 320, 568],
  ["phone-360x800", 360, 800],
  ["phone-390x844", 390, 844],
  ["phone-430x932", 430, 932],
  ["landscape-844x390", 844, 390],
  ["tablet-1024x768", 1024, 768],
  ["shallow-1440x700", 1440, 700],
  ["desktop-1440x900", 1440, 900],
  ["wide-1920x1080", 1920, 1080],
];
const routes = ["/", "/ai-brain", "/ai-gtm"];
const findings = [];
const observations = [];

const addFinding = (severity, code, route, viewport, detail) => {
  findings.push({ severity, code, route, viewport, detail });
};

const record = (route, viewport, check, pass, detail = "") => {
  observations.push({ route, viewport, check, pass, detail });
  if (!pass) addFinding("P2", check, route, viewport, detail);
};

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  await page.route("**/functions/v1/**", async (route) => {
    const url = route.request().url();
    if (url.includes("/enrich-company")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          identity: { name: "Example Company" },
          understanding: { descriptor: "A useful business.", products: ["A clear offer"] },
          synthesis: "Example Company helps teams do useful work.",
        }),
      });
      return;
    }
    await route.abort("blockedbyclient");
  });
}

async function pageDiagnostics(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const assistiveOnly = element.classList.contains("sr-only") || style.clip === "rect(0px, 0px, 0px, 0px)";
      return !assistiveOnly && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 0 && rect.height > 0;
    };
    const selectorFor = (element) => {
      if (element.id) return `#${element.id}`;
      const classes = [...element.classList].slice(0, 3).join(".");
      return `${element.tagName.toLowerCase()}${classes ? `.${classes}` : ""}`;
    };
    const clippedText = [...document.querySelectorAll("body *")]
      .filter((element) => visible(element) && element.children.length === 0 && (element.textContent?.trim().length ?? 0) > 0)
      .filter((element) => {
        const style = getComputedStyle(element);
        const clips = element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1;
        return clips && ["hidden", "clip"].includes(style.overflow) || clips && ["hidden", "clip"].includes(style.overflowX) || clips && ["hidden", "clip"].includes(style.overflowY);
      })
      .map((element) => ({ selector: selectorFor(element), text: element.textContent.trim().slice(0, 120) }));
    const ellipsised = [...document.querySelectorAll("body *")]
      .filter((element) => visible(element) && getComputedStyle(element).textOverflow === "ellipsis")
      .filter((element) => element.scrollWidth > element.clientWidth + 1)
      .map((element) => ({ selector: selectorFor(element), text: element.textContent.trim().slice(0, 120) }));
    const shortControls = [...document.querySelectorAll("button,a[href],input,select,textarea,[role=button],[role=radio]")]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { selector: selectorFor(element), text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 100), width: rect.width, height: rect.height };
      })
      .filter(({ width, height }) => width < 24 || height < 24);
    const unnamedControls = [...document.querySelectorAll("button,a[href],input,select,textarea,[role=button],[role=radio]")]
      .filter(visible)
      .filter((element) => !(element.getAttribute("aria-label") || element.getAttribute("aria-labelledby") || element.textContent?.trim() || element.getAttribute("title") || element.getAttribute("placeholder")))
      .map(selectorFor);
    const primary = [...document.querySelectorAll("[data-mm-primary]")]
      .filter(visible)
      .map((element) => ({ selector: selectorFor(element), text: element.textContent.trim(), rect: element.getBoundingClientRect().toJSON() }));
    return {
      title: document.title,
      bodyTextLength: document.body.innerText.length,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
      clippedText,
      ellipsised,
      shortControls,
      unnamedControls,
      primary,
    };
  });
}

async function lineCount(page, selector) {
  return page.locator(selector).evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const tops = [...range.getClientRects()].map((rect) => Math.round(rect.top));
    return new Set(tops).size;
  });
}

for (const [viewport, width, height] of viewports) {
  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height } });
    await prepare(page);
    const runtimeErrors = [];
    page.on("pageerror", (error) => runtimeErrors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") runtimeErrors.push(message.text()); });
    const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const diagnostics = await pageDiagnostics(page);
    record(route, viewport, "http-and-runtime", Boolean(response?.ok()) && runtimeErrors.length === 0, runtimeErrors.join(" | "));
    record(route, viewport, "complete-content", diagnostics.bodyTextLength >= 300, `${diagnostics.bodyTextLength} visible characters`);
    record(route, viewport, "no-horizontal-overflow", diagnostics.horizontalOverflow <= 1, `${Math.round(diagnostics.horizontalOverflow)}px overflow`);
    record(route, viewport, "no-visible-text-clipping", diagnostics.clippedText.length === 0, JSON.stringify(diagnostics.clippedText.slice(0, 8)));
    record(route, viewport, "no-visible-ellipsis", diagnostics.ellipsised.length === 0, JSON.stringify(diagnostics.ellipsised.slice(0, 8)));
    record(route, viewport, "minimum-control-size", diagnostics.shortControls.length === 0, JSON.stringify(diagnostics.shortControls.slice(0, 8)));
    record(route, viewport, "named-controls", diagnostics.unnamedControls.length === 0, JSON.stringify(diagnostics.unnamedControls.slice(0, 8)));
    record(route, viewport, "primary-action-present", diagnostics.primary.length > 0, "No visible primary action");

    if (route === "/ai-gtm") {
      const stampSegments = await page.locator(".wire-label time span").evaluateAll((elements) => elements.map((element) => ({
        text: element.textContent.trim(),
        lines: new Set(Array.from(element.getClientRects()).map((rect) => Math.round(rect.top))).size,
      })));
      const ticker = await page.locator(".wire-signals [role=radio] span").evaluateAll((elements) => elements.map((element) => ({
        text: element.textContent.trim(),
        clipped: element.scrollWidth > element.clientWidth + 1 || element.scrollHeight > element.clientHeight + 1,
        whiteSpace: getComputedStyle(element).whiteSpace,
      })));
      record(route, viewport, "ticker-stamp-has-no-orphan", stampSegments.length === 2 && stampSegments.every((item) => item.lines === 1), JSON.stringify(stampSegments));
      record(route, viewport, "ticker-labels-complete", ticker.every((item) => !item.clipped), JSON.stringify(ticker.filter((item) => item.clipped)));
    }

    if (route === "/ai-brain") {
      const graphLabels = await page.locator(".living-node").evaluateAll((elements) => elements.map((element) => {
        const accessible = element.getAttribute("aria-label")?.split(": ").slice(1).join(": ") ?? "";
        const visibleLabel = element.querySelector("text")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
        const sameWords = accessible.replace(/\s+/g, "") === visibleLabel.replace(/\s+/g, "");
        return { accessible, visibleLabel, complete: sameWords && !visibleLabel.includes("…") };
      }));
      record(route, viewport, "brain-node-labels-complete", graphLabels.length === 20 && graphLabels.every((item) => item.complete), JSON.stringify(graphLabels.filter((item) => !item.complete)));
    }

    await page.screenshot({ path: `${output}/${route === "/" ? "home" : route.slice(1)}-${viewport}-hero.png` });
    await page.close();
  }
}

async function exerciseMenuAndDrawer(route) {
  const viewport = "phone-390x844";
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  const menuButton = page.locator(".mm-menu-button");
  await menuButton.click();
  await page.waitForTimeout(60);
  const firstMenuLink = page.locator("#mindmake-menu a, #mindmake-menu button").first();
  const firstMenuLinkFocused = await firstMenuLink.evaluate((element) => element === document.activeElement);
  record(route, viewport, "menu-opens-and-focuses", firstMenuLinkFocused, `Focused: ${await page.evaluate(() => document.activeElement?.textContent?.trim())}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(60);
  const menuButtonFocused = await menuButton.evaluate((element) => element === document.activeElement);
  record(route, viewport, "menu-escape-restores-focus", menuButtonFocused && await menuButton.getAttribute("aria-expanded") === "false", "Menu did not close cleanly");

  const primary = page.locator("[data-mm-primary]:visible").first();
  await primary.click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.waitFor({ state: "visible" });
  await dialog.evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => undefined)));
  });
  const drawerState = await dialog.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const visibleViewport = window.visualViewport
      ? { left: window.visualViewport.offsetLeft, top: window.visualViewport.offsetTop, width: window.visualViewport.width, height: window.visualViewport.height }
      : { left: 0, top: 0, width: innerWidth, height: innerHeight };
    return {
      inside: rect.left >= visibleViewport.left - 1 && rect.top >= visibleViewport.top - 1 && rect.right <= visibleViewport.left + visibleViewport.width + 1 && rect.bottom <= visibleViewport.top + visibleViewport.height + 1,
      rect: rect.toJSON(),
      viewport: visibleViewport,
      title: element.querySelector("h2")?.textContent?.trim(),
      overflow: element.scrollWidth - element.clientWidth,
      active: document.activeElement?.id || document.activeElement?.textContent?.trim(),
    };
  });
  record(route, viewport, "cta-opens-intelligent-next-step", drawerState.inside && drawerState.overflow <= 1 && Boolean(drawerState.title), JSON.stringify(drawerState));
  const firstSubmit = dialog.locator('button[type="submit"]').first();
  if (await firstSubmit.count()) {
    await firstSubmit.click();
    const invalid = await dialog.locator('[aria-invalid="true"]').count();
    record(route, viewport, "drawer-empty-validation", invalid > 0, `${invalid} invalid controls`);
  }
  await page.keyboard.press("Escape");
  await page.waitForTimeout(120);
  record(route, viewport, "drawer-escape-closes", await dialog.count() === 0 || await dialog.isHidden(), "Dialog remains visible");
  await page.close();
}

await exerciseMenuAndDrawer("/ai-brain");
await exerciseMenuAndDrawer("/ai-gtm");

async function exerciseHomepage() {
  const route = "/";
  const viewport = "phone-390x844";
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(page);
  await page.goto(origin, { waitUntil: "networkidle" });
  const doors = page.locator(".mm-vnext-route-doors button");
  record(route, viewport, "homepage-two-clear-doors", await doors.count() === 2, `${await doors.count()} doors`);
  await doors.nth(0).click();
  record(route, viewport, "homepage-door-consequence", page.url().endsWith("/#brain") && (await page.locator("#homepage-route-title").innerText()).includes("Your judgement"), page.url());
  await page.keyboard.press("Escape");
  record(route, viewport, "homepage-route-escape", await page.locator(".mm-vnext-route-doors").isVisible(), "Both routes did not return");
  await page.close();
}

await exerciseHomepage();

async function exerciseBrain() {
  const route = "/ai-brain";
  const viewport = "desktop-1440x900";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  const stages = page.locator(".stage-nav button");
  const stageResults = [];
  for (let index = 0; index < 4; index += 1) {
    await stages.nth(index).click();
    await page.waitForTimeout(650);
    stageResults.push(await page.locator(`[data-panel="${index}"]`).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.visibility !== "hidden" && Number(style.opacity) > .95 && rect.width > 0 && rect.height > 0;
    }));
  }
  record(route, viewport, "brain-all-four-states", stageResults.every(Boolean), JSON.stringify(stageResults));
  await stages.nth(1).click();
  await page.waitForTimeout(650);
  await page.locator('.living-node[data-id="BI-003"]').focus();
  await page.keyboard.press("Enter");
  record(route, viewport, "brain-node-inspection", (await page.locator("#brainMapReadout").innerText()).includes("Human release judgement"), "Inspector did not update");
  await stages.nth(3).click();
  await page.waitForTimeout(650);
  await page.locator(".apply-correction").click();
  record(route, viewport, "brain-correction-result", /repair complete/i.test(await page.locator(".brain-change aside").innerText()), "Correction result missing");
  await page.close();
}

await exerciseBrain();

async function exerciseGtm() {
  const route = "/ai-gtm";
  const viewport = "desktop-1440x900";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  const signals = page.locator('.wire-signals [role="radio"]');
  const choices = new Set();
  let allResponsesUpdate = true;
  for (let signalIndex = 0; signalIndex < await signals.count(); signalIndex += 1) {
    await signals.nth(signalIndex).dispatchEvent("click");
    const tabs = page.locator(".response-tabs button");
    for (let responseIndex = 0; responseIndex < await tabs.count(); responseIndex += 1) {
      await tabs.nth(responseIndex).click();
      choices.add((await tabs.nth(responseIndex).innerText()).replace(/^0\d\s*/, "").trim());
      const values = await page.locator(".commercial-map .map-axis strong").allInnerTexts();
      if (values.length !== 4 || values.some((value) => value.trim().length < 8)) allResponsesUpdate = false;
    }
  }
  record(route, viewport, "gtm-all-signals-and-responses", choices.size === 15 && allResponsesUpdate, `${choices.size} choices; updates ${allResponsesUpdate}`);

  await signals.nth(0).focus();
  await page.keyboard.press("ArrowRight");
  const signalKeyboard = await signals.nth(1).evaluate((element) => element === document.activeElement && element.getAttribute("aria-checked") === "true");
  await page.keyboard.press("End");
  const signalEnd = await signals.nth(4).evaluate((element) => element === document.activeElement && element.getAttribute("aria-checked") === "true");
  record(route, viewport, "gtm-signal-keyboard-model", signalKeyboard && signalEnd, "Signal radios did not move selection and focus together");

  const responseTabs = page.locator(".response-tabs button");
  await responseTabs.nth(2).focus();
  await page.keyboard.press("Home");
  const responseHome = await responseTabs.nth(0).evaluate((element) => element === document.activeElement && element.getAttribute("aria-checked") === "true");
  await page.keyboard.press("End");
  const responseEnd = await responseTabs.nth(2).evaluate((element) => element === document.activeElement && element.getAttribute("aria-checked") === "true");
  record(route, viewport, "gtm-response-keyboard-model", responseHome && responseEnd, "Response radios did not support Home and End");
  await page.close();
}

await exerciseGtm();

async function exerciseScrollBuild(route, selector, fractions, expectedStates) {
  const viewport = "desktop-1440x900";
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  const states = [];
  const composed = [];
  for (let index = 0; index < fractions.length; index += 1) {
    await page.evaluate(({ sectionSelector, fraction }) => {
      const section = document.querySelector(sectionSelector);
      if (!(section instanceof HTMLElement)) return;
      const travel = Math.max(1, section.offsetHeight - innerHeight);
      scrollTo({ top: section.offsetTop + travel * fraction, behavior: "auto" });
    }, { sectionSelector: selector, fraction: fractions[index] });
    await page.waitForTimeout(180);
    const state = route === "/ai-brain"
      ? await page.locator(".stage-nav button[aria-current=step]").getAttribute("aria-current").then(async () => page.locator(".stage-nav button[aria-current=step]").innerText())
      : await page.locator(selector).getAttribute("data-phase");
    states.push(route === "/ai-brain" ? state.replace(/^0\d\s*/, "").trim() : state);
    composed.push(await page.locator(`${selector} .decision-sticky`).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top <= 1 && rect.bottom >= innerHeight - 1;
    }));
    await page.screenshot({ path: `${output}/${route.slice(1)}-${viewport}-scroll-${index + 1}.png` });
  }
  record(route, viewport, "scroll-build-reaches-every-state", JSON.stringify(states) === JSON.stringify(expectedStates), JSON.stringify(states));
  record(route, viewport, "scroll-build-stays-composed", composed.every(Boolean), JSON.stringify(composed));
  await page.close();
}

await exerciseScrollBuild("/ai-brain", ".decision-sequence", [.12, .37, .62, .87], ["Decision", "Brain", "Evidence", "Correction"]);
await exerciseScrollBuild("/ai-gtm", ".decision", [.15, .5, .85], ["0", "1", "2"]);

async function exerciseMobileInstruments() {
  const viewport = "phone-390x844";
  const brain = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(brain);
  await brain.goto(`${origin}/ai-brain`, { waitUntil: "networkidle" });
  const brainStages = brain.locator(".stage-nav button");
  const brainStates = [];
  for (let index = 0; index < 4; index += 1) {
    await brainStages.nth(index).click();
    await brain.waitForTimeout(80);
    brainStates.push(await brain.locator(`[data-panel="${index}"]`).evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return getComputedStyle(element).visibility !== "hidden" && Number(getComputedStyle(element).opacity) > .95 && rect.width > 0 && rect.height > 0;
    }));
  }
  record("/ai-brain", viewport, "mobile-brain-all-states", brainStates.every(Boolean), JSON.stringify(brainStates));
  await brainStages.nth(1).click();
  const nodeTargets = await brain.locator(".living-hit").evaluateAll((elements) => elements.map((element) => {
    const rect = element.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
  }));
  record("/ai-brain", viewport, "mobile-brain-node-targets", nodeTargets.length === 20 && nodeTargets.every(({ width, height }) => width >= 44 && height >= 44), JSON.stringify(nodeTargets));
  const overlappingTargets = nodeTargets.flatMap((first, index) => nodeTargets.slice(index + 1).map((second, offset) => ({ first: index, second: index + offset + 1, overlap: first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top }))).filter((pair) => pair.overlap);
  record("/ai-brain", viewport, "mobile-brain-node-targets-do-not-overlap", overlappingTargets.length === 0, JSON.stringify(overlappingTargets));
  await brain.close();

  const gtm = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await prepare(gtm);
  await gtm.goto(`${origin}/ai-gtm`, { waitUntil: "networkidle" });
  const phaseButtons = gtm.locator(".decision-rail button");
  const phases = [];
  for (let index = 0; index < 3; index += 1) {
    await phaseButtons.nth(index).click();
    await gtm.waitForTimeout(550);
    phases.push(await gtm.locator(".decision").getAttribute("data-phase"));
  }
  const mobileValues = await gtm.locator(".mobile-response dd").allInnerTexts();
  record("/ai-gtm", viewport, "mobile-gtm-all-states", JSON.stringify(phases) === JSON.stringify(["0", "1", "2"]), JSON.stringify(phases));
  record("/ai-gtm", viewport, "mobile-gtm-choice-is-complete", mobileValues.length === 4 && mobileValues.every((value) => value.trim().length >= 8), JSON.stringify(mobileValues));
  const ticker = gtm.locator(".wire-signals");
  await ticker.dispatchEvent("pointerdown", { pointerType: "touch", pointerId: 1 });
  await gtm.waitForTimeout(50);
  record("/ai-gtm", viewport, "mobile-ticker-pauses-on-touch", await ticker.evaluate((element) => getComputedStyle(element).animationPlayState === "paused"), await ticker.evaluate((element) => getComputedStyle(element).animationPlayState));
  await ticker.dispatchEvent("pointerup", { pointerType: "touch", pointerId: 1 });
  await ticker.evaluate((element) => { element.style.animation = "none"; element.style.transform = "translateX(-50%)"; });
  await gtm.locator('.wire-signals [data-clone="true"][data-signal="commerce"]').click();
  record("/ai-gtm", viewport, "mobile-ticker-clones-are-actionable", await gtm.locator('.wire-signals [role="radio"][data-signal="commerce"]').getAttribute("aria-checked") === "true", "Visible repeated signal did not select its source");
  await gtm.close();
}

await exerciseMobileInstruments();

async function exerciseLeadBrief(route) {
  const viewport = "phone-390x844";
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const functionCalls = [];
  page.on("request", (request) => {
    if (request.url().includes("/functions/v1/")) functionCalls.push(request.url().split("/functions/v1/")[1]);
  });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.locator("[data-mm-primary]:visible").first().click();
  const dialog = page.locator('[role="dialog"]');
  await dialog.locator("#mm-company-email").fill("founder@example.com");
  await dialog.getByRole("button", { name: /Read the business/i }).click();
  await dialog.getByRole("heading", { name: "Who is this for?" }).waitFor();
  await dialog.locator("#mm-first-name").fill("Alex");
  await dialog.locator("#mm-last-name").fill("Founder");
  await dialog.getByRole("button", { name: /See the company read/i }).click();
  await page.waitForTimeout(40);
  record(route, viewport, "missing-division-focuses-division", await dialog.locator(".mm-brief-role-select").evaluate((element) => element === document.activeElement), await page.evaluate(() => document.activeElement?.className));
  await dialog.locator(".mm-brief-role-select").selectOption({ index: 1 });
  await dialog.getByRole("button", { name: /See the company read/i }).click();
  await dialog.getByRole("heading", { name: "This is what I can see so far." }).waitFor({ timeout: 15000 });
  await dialog.locator(".mm-choice-grid button").first().click();
  await dialog.getByRole("button", { name: /Use this problem/i }).click();
  await dialog.locator(".mm-capacity-grid button").first().click();
  const valuePreview = await dialog.locator(".mm-value-preview").innerText();
  await dialog.getByRole("button", { name: /Show me the recommendation/i }).click();
  const recommendation = await dialog.locator(".mm-brief-result-grid article").allInnerTexts();
  await page.keyboard.press("Escape");
  await page.goForward({ waitUntil: "networkidle" });
  await page.locator('[role="dialog"] .mm-brief-result-grid').waitFor({ timeout: 10000 });
  record(route, viewport, "cta-draft-survives-back-forward", await page.locator('[role="dialog"] .mm-brief-result-grid article').count() === recommendation.length, "Recommendation did not return with browser history");
  const callsBeforeReload = functionCalls.length;
  await page.reload({ waitUntil: "networkidle" });
  await page.locator('[role="dialog"] .mm-brief-result-grid').waitFor({ timeout: 10000 });
  const restoredAfterReload = await page.locator('[role="dialog"] .mm-brief-result-grid article').allInnerTexts();
  record(route, viewport, "cta-draft-survives-reload", JSON.stringify(restoredAfterReload) === JSON.stringify(recommendation) && functionCalls.length === callsBeforeReload, `${restoredAfterReload.length} cards; ${functionCalls.length - callsBeforeReload} repeated reads`);
  const restoredDialog = page.locator('[role="dialog"]');
  const callsBeforeKeep = [...functionCalls];
  await restoredDialog.getByRole("button", { name: /Back to your time/i }).click();
  const retainedChoice = await restoredDialog.locator(".mm-capacity-grid button[aria-pressed=true]").count() === 1;
  await restoredDialog.getByRole("button", { name: /Show me the recommendation/i }).click();
  await restoredDialog.getByRole("button", { name: /Keep the private brief/i }).click();
  const consequence = restoredDialog.locator(".is-contact, .is-success");
  await consequence.waitFor();
  const consequenceText = await consequence.innerText();
  const truthfulConsequence = await restoredDialog.locator(".is-success").count()
    ? /Nothing has been sent to us, and no email has been sent/i.test(consequenceText) && await restoredDialog.getByRole("button", { name: /Download my brief/i }).count() === 1
    : /six-digit code/i.test(consequenceText) && /Nothing is sent to us until you confirm/i.test(consequenceText);
  record(route, viewport, "cta-produces-specific-recommendation", recommendation.length === 5 && recommendation.every((item) => item.trim().length > 12) && valuePreview.length > 20, JSON.stringify(recommendation));
  record(route, viewport, "cta-is-reversible-without-losing-choice", retainedChoice, "Capacity choice was not retained");
  record(route, viewport, "cta-does-not-send-before-explicit-confirmation", callsBeforeKeep.every((call) => call.startsWith("enrich-company")), JSON.stringify(callsBeforeKeep));
  record(route, viewport, "cta-states-its-real-consequence", truthfulConsequence, consequenceText);
  await page.keyboard.press("Escape");
  await page.close();
}

await exerciseLeadBrief("/ai-brain");
await exerciseLeadBrief("/ai-gtm");

for (const route of ["/ai-brain", "/ai-gtm"]) {
  const viewport = "reduced-motion-390x844";
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  const activeAnimations = await page.evaluate(() => [...document.querySelectorAll("body *")]
    .filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && style.animationName !== "none" && Number.parseFloat(style.animationDuration) > .02;
    })
    .map((element) => ({ tag: element.tagName, className: element.className, animation: getComputedStyle(element).animationName })));
  record(route, viewport, "reduced-motion-still", activeAnimations.length === 0, JSON.stringify(activeAnimations.slice(0, 8)));
  if (route === "/ai-brain") {
    const reducedPanels = await page.locator(".state-panel").evaluateAll((elements) => elements.map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .95 && rect.width > 0 && rect.height > 0;
    }));
    record(route, viewport, "reduced-motion-keeps-all-brain-views", reducedPanels.length === 4 && reducedPanels.every(Boolean), JSON.stringify(reducedPanels));
  }
  await page.close();
}

for (const route of routes) {
  const viewport = "text-200-320x568";
  const page = await browser.newPage({ viewport: { width: 320, height: 568 } });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
  await page.waitForTimeout(120);
  const diagnostics = await pageDiagnostics(page);
  record(route, viewport, "text-200-no-horizontal-overflow", diagnostics.horizontalOverflow <= 1, `${Math.round(diagnostics.horizontalOverflow)}px overflow`);
  record(route, viewport, "text-200-no-visible-text-clipping", diagnostics.clippedText.length === 0, JSON.stringify(diagnostics.clippedText.slice(0, 8)));
  await page.screenshot({ path: `${output}/${route === "/" ? "home" : route.slice(1)}-${viewport}.png`, fullPage: true });
  await page.close();
}

await browser.close();

const severityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
findings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity] || a.route.localeCompare(b.route));
const result = {
  artifact: "mindmake-experience-battle-test-r1",
  origin,
  output,
  viewports: viewports.map(([name]) => name),
  routes,
  observations: observations.length,
  passed: observations.filter((item) => item.pass).length,
  failed: observations.filter((item) => !item.pass).length,
  findings,
};
await fs.writeFile(`${output}/report.json`, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (findings.length) process.exitCode = 1;
