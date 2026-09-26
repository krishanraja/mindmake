#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";
import { candidateIdentity } from "./award-panel-lib.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = "C:/Users/krish/.scratch/mindmake-start-here-production-s4";
const failures = [];
const observations = [];
const providerRequests = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const record = (browser, viewport, action, expected, observed, evidence) => {
  observations.push({ browser, viewport, action, expected, observed, evidence });
};

const dossier = {
  identity: { name: "Example Company" },
  understanding: { descriptor: "A useful business.", products: ["A clear offer"] },
  synthesis: "Example Company helps teams do useful work.",
};

const fastBrowser = process.env.START_HERE_QA_FAST;
const fastViewport = (process.env.START_HERE_QA_VIEWPORT || "390x844").split("x").map(Number);
const matrices = fastBrowser ? {
  chromium: fastBrowser === "1" || fastBrowser === "chromium" ? [fastViewport] : [],
  webkit: fastBrowser === "webkit" ? [fastViewport] : [],
  firefox: fastBrowser === "firefox" ? [fastViewport] : [],
} : {
  chromium: [[320, 568], [390, 844], [430, 932], [768, 1024], [844, 390], [1024, 768], [1440, 700], [1440, 900], [1920, 1080]],
  webkit: [[320, 568], [390, 844], [844, 390], [1440, 700], [1440, 900]],
  firefox: [[320, 568], [390, 844], [844, 390], [1440, 700], [1440, 900]],
};

await mkdir(output, { recursive: true });
const server = await createServer({
  root,
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("https://mindmake-qa.invalid"),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify("mindmake-designated-synthetic-key"),
  },
  server: { host: "127.0.0.1", port: 0, strictPort: false },
  logLevel: "error",
});
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  await page.route("**/functions/v1/**", async (route) => {
    if (route.request().url().includes("/enrich-company")) {
      providerRequests.push({ method: route.request().method(), url: route.request().url() });
      const cors = {
        "access-control-allow-origin": "*",
        "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
        "access-control-allow-methods": "POST, OPTIONS",
      };
      if (route.request().method() === "OPTIONS") {
        await route.fulfill({ status: 204, headers: cors, body: "" });
      } else {
        await route.fulfill({ status: 200, contentType: "application/json", headers: cors, body: JSON.stringify(dossier) });
      }
      return;
    }
    await route.abort("blockedbyclient");
  });
}

async function reachPreview(page, browserName, width, height) {
  const label = `${browserName} ${width}x${height}`;
  await page.goto(`${origin}/?start=gtm`, { waitUntil: "domcontentloaded" });
  const dialog = page.locator('.mm-brief-panel[role="dialog"]');
  await dialog.waitFor({ state: "visible" });
  await dialog.locator("#mm-company-email").fill("ada@example.com");
  await dialog.getByRole("button", { name: /read the business/i }).click();
  await dialog.getByRole("heading", { name: "Who is this for?" }).waitFor();
  await dialog.locator("#mm-first-name").fill("Ada");
  await dialog.locator("#mm-last-name").fill("Lovelace");
  const roleSelect = dialog.locator(".mm-brief-role-select");
  await dialog.getByRole("button", { name: /see the company read/i }).click();
  const divisionError = dialog.locator("#mm-profile-error");
  await divisionError.waitFor({ state: "visible" });
  const expectedDivisionTarget = await roleSelect.isVisible() ? roleSelect : dialog.getByRole("button", { name: "Leadership" });
  await page.waitForFunction(() => {
    const select = document.querySelector(".mm-brief-role-select");
    const firstChip = document.querySelector(".mm-brief-role-chips button");
    const target = select && getComputedStyle(select).display !== "none" ? select : firstChip;
    return target === document.activeElement;
  });
  const divisionFocus = await expectedDivisionTarget.evaluate((element) => element === document.activeElement);
  const divisionAssociated = await dialog.locator(".mm-brief-profile-role").getAttribute("aria-describedby") === "mm-profile-error"
    && await dialog.locator(".mm-brief-profile-role").getAttribute("aria-invalid") === "true";
  fail(!divisionFocus, `${label}: missing division did not move focus to the division control`);
  fail(!divisionAssociated, `${label}: missing division error is not associated with the division group`);
  record(browserName, `${width}x${height}`, "submit profile without a division", "announce the error, associate it with the division group and focus the usable division control", divisionFocus && divisionAssociated ? "pass" : "fail", {
    alert: await divisionError.innerText(),
    activeElement: await page.evaluate(() => document.activeElement?.getAttribute("aria-label") || document.activeElement?.textContent?.trim()),
    divisionFocus,
    divisionAssociated,
  });
  if (await roleSelect.isVisible()) await roleSelect.selectOption("leadership");
  else await dialog.getByRole("button", { name: "Leadership" }).click();
  await dialog.getByRole("button", { name: /see the company read/i }).click();
  await dialog.getByRole("heading", { name: "This is what I can see so far." }).waitFor({ timeout: 15000 });
  const resolvedCompany = await dialog.locator(".mm-company-read strong").innerText();
  fail(resolvedCompany !== dossier.identity.name, `${label}: designated synthetic company read did not resolve the expected identity`);
  record(browserName, `${width}x${height}`, "run the designated synthetic company read", "resolve the provider-backed read before any personalised recommendation without sending a lead", resolvedCompany === dossier.identity.name ? "pass" : "fail", {
    request: "ada@example.com",
    interceptedEndpoint: "/functions/v1/enrich-company",
    interceptedRequests: providerRequests.slice(-2),
    resolvedCompany,
    designatedSynthetic: true,
    leadSent: false,
  });
  await dialog.getByRole("button", { name: "Customers can now do more without us" }).click();
  await dialog.getByRole("button", { name: /use this problem/i }).click();
  await dialog.getByRole("button", { name: "Grow this business" }).click();
  await dialog.getByRole("button", { name: /show me the recommendation/i }).click();
  await page.locator('.mm-brief-panel[data-step="preview"] .mm-folio').waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts.ready);
  return dialog;
}

async function geometry(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > .5 && rect.height > .5;
    };
    const inside = (inner, outer, tolerance = 4) => inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance;
    const rangeViolations = [];
    for (const selector of [".mm-folio-binding", ".mm-folio-head", ".mm-folio-leaf", ".mm-folio-actions", ".mm-folio-panel-surface"]) {
      for (const container of document.querySelectorAll(selector)) {
        if (!visible(container)) continue;
        const boundary = container.getBoundingClientRect();
        for (const textElement of container.querySelectorAll("p, strong, small, span, h2, button")) {
          if (!visible(textElement)) continue;
          if (selector === ".mm-folio-binding" && (textElement.closest(".mm-folio-film-truth") || textElement.closest(".mm-folio-time-inscription"))) continue;
          const range = document.createRange();
          range.selectNodeContents(textElement);
          for (const rect of range.getClientRects()) {
            if (rect.width < .5 || rect.height < .5) continue;
            if (!inside(rect, boundary)) rangeViolations.push({ selector, text: textElement.textContent.trim().slice(0, 48), rect: rect.toJSON(), boundary: boundary.toJSON() });
          }
        }
      }
    }
    const targetViolations = [...document.querySelectorAll("button, label")]
      .filter(visible)
      .map((element) => ({ text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0, 48), rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
      .map(({ text, rect }) => ({ text, width: rect.width, height: rect.height }));
    const scrollViolations = [".mm-brief-panel", ".mm-folio-preview", ".mm-folio-instrument", ".mm-folio", ".mm-folio-panel-surface"]
      .flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map((element) => ({ selector, x: element.scrollWidth - element.clientWidth, y: element.scrollHeight - element.clientHeight })))
      .filter(({ x, y }) => x > 1 || y > 1);
    const backdrop = document.querySelector(".mm-brief-backdrop").getBoundingClientRect();
    const panel = document.querySelector(".mm-brief-panel").getBoundingClientRect();
    const preview = document.querySelector(".mm-folio-preview");
    const previewRect = preview.getBoundingClientRect();
    return {
      documentX: document.documentElement.scrollWidth - innerWidth,
      bodyOverflow: getComputedStyle(document.body).overflow,
      backdrop: { width: backdrop.width, height: backdrop.height, top: backdrop.top, left: backdrop.left },
      panel: { width: panel.width, height: panel.height, top: panel.top, left: panel.left },
      preview: {
        clientHeight: preview.clientHeight,
        scrollHeight: preview.scrollHeight,
        rect: previewRect.toJSON(),
        children: [...preview.children].map((child) => ({ className: child.className, position: getComputedStyle(child).position, rect: child.getBoundingClientRect().toJSON() })),
      },
      viewport: { width: innerWidth, height: innerHeight },
      rangeViolations,
      targetViolations,
      scrollViolations,
      activeLeaves: [...document.querySelectorAll(".mm-folio-leaf")].filter(visible).map((leaf) => leaf.getAttribute("data-mm-folio-leaf")),
      filmTruth: document.querySelector(".mm-folio-film-truth")?.textContent?.trim() || "",
    };
  });
}

function assess(state, label, compact) {
  fail(state.documentX > 1, `${label}: horizontal document overflow ${state.documentX}`);
  fail(state.bodyOverflow !== "hidden", `${label}: background is not locked (${state.bodyOverflow})`);
  fail(Math.abs(state.backdrop.width - state.viewport.width) > 1.5 || Math.abs(state.backdrop.height - state.viewport.height) > 1.5, `${label}: backdrop ${state.backdrop.width}x${state.backdrop.height} does not fit ${state.viewport.width}x${state.viewport.height}`);
  fail(Math.abs(state.panel.width - state.viewport.width) > 1.5 || Math.abs(state.panel.height - state.viewport.height) > 1.5, `${label}: folio ${state.panel.width}x${state.panel.height} does not fit ${state.viewport.width}x${state.viewport.height}`);
  fail(state.rangeViolations.length > 0, `${label}: ${state.rangeViolations.length} painted-text containment failures ${JSON.stringify(state.rangeViolations.slice(0, 3))}`);
  fail(state.targetViolations.length > 0, `${label}: undersized controls ${JSON.stringify(state.targetViolations)}`);
  fail(state.scrollViolations.length > 0, `${label}: nested overflow ${JSON.stringify(state.scrollViolations)}`);
  // Ruling (Krish, 2026-09-26): no caveat labels on any page.
  fail(state.filmTruth !== "", `${label}: a caveat label is back on the folio`);
  fail(compact ? state.activeLeaves.length !== 1 : state.activeLeaves.length !== 4, `${label}: expected ${compact ? 1 : 4} visible leaf/leaves, saw ${state.activeLeaves.length}`);
}

async function exercise(page, dialog, browserName, width, height) {
  const viewport = `${width}x${height}`;
  const label = `${browserName} ${viewport}`;
  const compact = await page.evaluate(() => matchMedia("(max-width: 820px), (max-width: 920px) and (orientation: landscape) and (max-height: 500px)").matches);
  const initial = await geometry(page);
  assess(initial, `${label} initial`, compact);
  record(browserName, viewport, "open approved folio", "full viewport; one mobile leaf or four desktop leaves; no clipping", failures.filter((item) => item.startsWith(label)).length ? "fail" : "pass", initial);

  const leafCopyBefore = await dialog.locator(".mm-folio-leaf").allTextContents();
  await dialog.getByRole("button", { name: /change time: grow/i }).click();
  const timePanel = dialog.locator(".mm-folio-time-panel");
  await timePanel.waitFor({ state: "visible" });
  await page.waitForFunction(() => document.querySelector(".mm-folio-time-panel")?.contains(document.activeElement));
  await timePanel.locator("label").filter({ hasText: "Help more companies" }).click();
  fail(!(await timePanel.locator(".mm-folio-time-preview").innerText()).includes("same judgement"), `${label}: Time preview did not explain its consequence`);
  await timePanel.getByRole("button", { name: /use this time/i }).click();
  if (compact) fail(!(await dialog.getByRole("button", { name: /change time: help/i }).isVisible()), `${label}: committed Time is not visible in the compact binding`);
  else fail(!(await dialog.getByText("Use the same judgement across more companies without lowering the quality of the work.").isVisible()), `${label}: committed Time consequence missing`);
  const leafCopyAfter = await dialog.locator(".mm-folio-leaf").allTextContents();
  fail(JSON.stringify(leafCopyBefore) !== JSON.stringify(leafCopyAfter), `${label}: Time fabricated changes to the four guidance leaves`);
  await dialog.getByRole("button", { name: /restore grow/i }).click();
  fail(!(await dialog.getByRole("button", { name: /change time: grow/i }).isVisible()), `${label}: Restore did not recover original Time`);
  record(browserName, viewport, "change and restore Time", "only Time consequence changes; four guidance leaves stay fixed; restore is available", failures.filter((item) => item.startsWith(label)).length ? "fail" : "pass", { leafCopyStable: JSON.stringify(leafCopyBefore) === JSON.stringify(leafCopyAfter) });

  if (compact) {
    for (let index = 0; index < 3; index += 1) await dialog.locator(".mm-folio-primary").click();
    fail((await dialog.locator(".mm-folio-leaf-count").innerText()).replace(/\s+/g, " ").trim().toLowerCase() !== "4 of 4", `${label}: Pocket Folio did not reach leaf 4`);
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator('.mm-brief-panel[data-step="preview"]').waitFor({ state: "visible" });
    fail((await page.locator(".mm-folio-leaf-count").innerText()).replace(/\s+/g, " ").trim().toLowerCase() !== "4 of 4", `${label}: interrupted Pocket Folio did not resume at leaf 4`);
    dialog = page.locator('.mm-brief-panel[role="dialog"]');
  } else {
    await dialog.locator(".mm-folio-leaf").first().focus();
    await page.keyboard.press("ArrowRight");
    fail(await dialog.locator(".mm-folio-leaf").nth(1).getAttribute("aria-current") !== "step", `${label}: keyboard did not move the active desktop leaf`);
  }

  await dialog.locator(".mm-folio-primary").click();
  const keepPanel = dialog.locator(".mm-folio-keep-panel");
  await keepPanel.waitFor({ state: "visible" });
  const keepText = (await keepPanel.innerText()).toLowerCase();
  fail(!keepText.includes("email verification is next.") || !keepText.includes("nothing has been sent."), `${label}: exact Keep consequence missing`);
  const consequenceGeometry = await geometry(page);
  assess(consequenceGeometry, `${label} Keep`, compact);
  record(browserName, viewport, "keep private brief", "state the next step and that nothing has been sent before continuing", failures.filter((item) => item.startsWith(label)).length ? "fail" : "pass", keepText);

  if (browserName === "chromium" && [[320, 568], [390, 844], [844, 390], [1440, 700], [1440, 900]].some(([w, h]) => w === width && h === height)) {
    await keepPanel.getByRole("button", { name: /not now/i }).click();
    await page.locator("video").evaluateAll((videos) => videos.forEach((video) => video.pause()));
    await page.screenshot({ path: `${output}/chromium-${viewport}.png`, fullPage: false });
  }
}

async function runBrowser(browserType, browserName, matrix) {
  const browser = await browserType.launch({ headless: true, ...(browserType === chromium ? { channel: "chrome" } : {}) });
  try {
    for (const [width, height] of matrix) {
      const page = await browser.newPage({ viewport: { width, height } });
      page.setDefaultTimeout(8000);
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await prepare(page);
      try {
        console.log(`Checking ${browserName} ${width}x${height}`);
        const dialog = await reachPreview(page, browserName, width, height);
        await exercise(page, dialog, browserName, width, height);
        fail(errors.length > 0, `${browserName} ${width}x${height}: runtime errors ${JSON.stringify(errors)}`);
        console.log(`Finished ${browserName} ${width}x${height}`);
      } catch (error) {
        const diagnosticText = await page.locator(".mm-brief-panel").innerText().catch(() => "dialog unavailable");
        await page.screenshot({ path: `${output}/failure-${browserName}-${width}x${height}.png`, fullPage: false }).catch(() => {});
        failures.push(`${browserName} ${width}x${height}: ${error.stack || error.message}; dialog=${diagnosticText.replace(/\s+/g, " ").slice(0, 900)}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

async function runReducedMotion() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    page.setDefaultTimeout(8000);
    await prepare(page);
    await reachPreview(page, "chromium", 390, 844);
    const activeAnimations = await page.evaluate(() => [...document.querySelectorAll(".mm-brief-panel *")]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && style.animationName !== "none" && Number.parseFloat(style.animationDuration) > .02;
      })
      .map((element) => ({ tag: element.tagName, className: element.className, animation: getComputedStyle(element).animationName })));
    fail(activeAnimations.length > 0, `reduced motion 390x844: active animations ${JSON.stringify(activeAnimations)}`);
    record("chromium", "390x844 reduced-motion", "open approved folio", "all meaning and control remain without non-essential motion", activeAnimations.length ? "fail" : "pass", activeAnimations);
  } finally {
    await browser.close().catch(() => {});
  }
}

try {
  await runBrowser(chromium, "chromium", matrices.chromium);
  await runBrowser(webkit, "webkit", matrices.webkit);
  await runBrowser(firefox, "firefox", matrices.firefox);
  if (!process.env.START_HERE_QA_FAST) await runReducedMotion();
} finally {
  await server.close();
}

const report = {
  artifact: "START-HERE-INTERACTION-S4 / production LeadBrief",
  generatedAt: new Date().toISOString(),
  origin,
  output,
  candidate: await candidateIdentity(),
  matrices: Object.fromEntries(Object.entries(matrices).map(([name, matrix]) => [name, matrix.map(([width, height]) => `${width}x${height}`)])),
  physicalDevices: "not run",
  observations,
  failures,
};
await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));

if (failures.length) process.exitCode = 1;
