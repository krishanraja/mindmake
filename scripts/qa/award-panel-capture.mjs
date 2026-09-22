import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, firefox, webkit } from "playwright";
import {
  candidateIdentity,
  hashEvidenceManifest,
  hashRubric,
  loadRubric,
  readJson,
  root,
  sha256,
} from "./award-panel-lib.mjs";

function flag(name, fallback) {
  const index = process.argv.indexOf(`--${name}`);
  return index === -1 ? fallback : process.argv[index + 1];
}

const rubric = await loadRubric();
const url = flag("url", rubric.target);
const runId = flag("run-id", new Date().toISOString().replace(/[:.]/g, "-").replace(/Z$/, "Z"));
const continuityPath = path.resolve(flag("continuity-report", "C:/Users/krish/.scratch/mindmake-full-route-continuity/report.json"));
if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(runId)) {
  console.error("run id must be 1 to 100 filename-safe characters using letters, numbers, dots, underscores or hyphens");
  process.exit(1);
}

const artifactRoot = path.resolve(root, "artifacts", "award-panel");
const output = path.resolve(artifactRoot, runId);
if (!output.startsWith(`${artifactRoot}${path.sep}`)) {
  console.error("run id resolved outside the award-panel artifact directory");
  process.exit(1);
}
const screenshots = path.join(output, "screenshots");
try {
  await fs.access(path.join(output, "run.json"));
  console.error(`award panel run already exists: ${output}. Choose a new run id so old submissions can never be reused against new evidence.`);
  process.exit(1);
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
await fs.mkdir(screenshots, { recursive: true });
await fs.mkdir(path.join(output, "submissions"), { recursive: true });

const capturedAt = new Date();
const expiresAt = new Date(capturedAt.getTime() + 24 * 60 * 60 * 1000);
const candidate = await candidateIdentity();
const rubricSha256 = hashRubric(rubric);
const observations = [];

const enginePlans = [
  { id: "chromium", type: chromium, options: process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : { channel: "chrome" }, viewports: [...rubric.surfaces.desktop.viewports, ...rubric.surfaces.mobile.viewports] },
  { id: "webkit", type: webkit, options: {}, viewports: [rubric.surfaces.desktop.viewports.find((item) => item.width === 1440 && item.height === 900), rubric.surfaces.mobile.viewports.find((item) => item.width === 390 && item.height === 844)] },
  { id: "firefox", type: firefox, options: {}, viewports: [rubric.surfaces.desktop.viewports.find((item) => item.width === 1440 && item.height === 900), rubric.surfaces.mobile.viewports.find((item) => item.width === 390 && item.height === 844)] },
];

for (const plan of enginePlans) {
  const browser = await plan.type.launch({ headless: true, ...plan.options });
  try {
    for (const viewport of plan.viewports.filter(Boolean)) {
      const surface = viewport.width > viewport.height && viewport.width >= 1024 ? "desktop" : "mobile";
      const context = await browser.newContext({ viewport, reducedMotion: "no-preference", hasTouch: surface === "mobile" });
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));
      const response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.locator("main").waitFor({ state: "attached" });
      await page.evaluate(() => document.fonts?.ready);
      const stem = `${plan.id}-${surface}-${viewport.width}x${viewport.height}`;
      const foldPath = path.join(screenshots, `${stem}-fold.png`);
      const fullPath = path.join(screenshots, `${stem}-full.png`);
      await page.screenshot({ path: foldPath });
      const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < pageHeight; y += Math.max(1, Math.floor(viewport.height * 0.8))) {
        await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
        await page.waitForTimeout(60);
      }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.waitForTimeout(100);
      await page.screenshot({ path: fullPath, fullPage: true });
      const metrics = await page.evaluate(() => {
        const text = document.body.innerText.replace(/\s+/g, " ").trim();
        const headings = [...document.querySelectorAll("h1,h2,h3")].map((heading) => heading.textContent?.trim()).filter(Boolean);
        const controls = [...document.querySelectorAll("a,button,input,select,textarea")]
          .filter((element) => {
            const box = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            return box.width > 0 && box.height > 0 && box.top < innerHeight && box.bottom > 0 && style.visibility !== "hidden" && style.display !== "none";
          })
          .map((element) => (element.getAttribute("aria-label") || element.textContent || "").trim())
          .filter(Boolean);
        return {
          title: document.title,
          words: text ? text.split(/\s+/).length : 0,
          headings,
          firstViewportControls: controls,
          totalScreens: Math.round((document.documentElement.scrollHeight / innerHeight) * 100) / 100,
          horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
        };
      });
      const status = response?.ok() && consoleErrors.length === 0 && metrics.horizontalOverflow <= 1 ? "pass" : "fail";
      observations.push({
        id: `capture-${stem}`,
        kind: "rendered_browser_capture",
        status,
        engine: plan.id,
        input: surface === "mobile" ? "touch-emulation" : "pointer-keyboard",
        route: new URL(url).pathname || "/",
        viewport: `${viewport.width}x${viewport.height}`,
        action: "cold load, traverse complete scroll, return to opening",
        expected: "complete route with no runtime error or horizontal overflow",
        observed: `${response?.status() ?? "no response"}; ${consoleErrors.length} runtime errors; ${metrics.horizontalOverflow}px horizontal overflow`,
        metrics,
        consoleErrors,
        evidence: [
          { path: path.relative(output, foldPath).replaceAll("\\", "/"), sha256: sha256(await fs.readFile(foldPath)) },
          { path: path.relative(output, fullPath).replaceAll("\\", "/"), sha256: sha256(await fs.readFile(fullPath)) },
        ],
      });
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

try {
  const continuity = await readJson(continuityPath);
  const continuityBytes = await fs.readFile(continuityPath);
  observations.push({
    id: "automation-full-route-continuity",
    kind: "deterministic_automation",
    status: continuity.failures?.length === 0 ? "pass" : "fail",
    engine: "chromium-webkit-firefox",
    input: "pointer-keyboard-touch-emulation-reduced-motion-200-percent-text",
    route: "all required routes",
    viewport: "390x844 and 1440x900",
    action: "load every route, use shared navigation, open archive entries, recover validation and return",
    expected: "zero deterministic failures",
    observed: `${continuity.checks ?? continuity.observations?.length ?? 0} route observations; ${continuity.failures?.length ?? 0} failures`,
    evidence: [{ path: continuityPath.replaceAll("\\", "/"), sha256: sha256(continuityBytes) }],
  });
} catch (error) {
  observations.push({
    id: "automation-full-route-continuity",
    kind: "deterministic_automation",
    status: "inconclusive",
    engine: "unknown",
    input: "unknown",
    route: "all required routes",
    viewport: "required matrix",
    action: "load and exercise the full site",
    expected: "a current zero-failure report",
    observed: `report unavailable: ${error.message}`,
    evidence: [],
  });
}

observations.push(
  {
    id: "physical-ios-safari-voiceover",
    kind: "physical_device",
    status: "not_run",
    engine: "Safari",
    input: "touch-voiceover",
    route: "all primary tasks",
    viewport: "current physical iPhone",
    action: "complete primary tasks with VoiceOver",
    expected: "current physical-device pass",
    observed: "No current physical-device evidence has been supplied.",
    evidence: [],
  },
  {
    id: "physical-android-chrome-talkback",
    kind: "physical_device",
    status: "not_run",
    engine: "Chrome",
    input: "touch-talkback",
    route: "all primary tasks",
    viewport: "current physical Android phone",
    action: "complete primary tasks with TalkBack",
    expected: "current physical-device pass",
    observed: "No current physical-device evidence has been supplied.",
    evidence: [],
  },
);

const evidenceManifest = {
  schemaVersion: 1,
  candidateSha256: candidate.sha256,
  observations,
};
const evidenceManifestSha256 = hashEvidenceManifest(evidenceManifest);
const judgeContexts = Object.fromEntries(rubric.jurors.map((juror) => [juror.id, crypto.randomBytes(18).toString("hex")]));
const run = {
  schemaVersion: 2,
  runId,
  target: url,
  capturedAt: capturedAt.toISOString(),
  expiresAt: expiresAt.toISOString(),
  rubricVersion: rubric.rubricRevision,
  rubricSha256,
  candidate,
  evidenceManifest,
  evidenceManifestSha256,
  requiredObservationIds: observations.map((observation) => observation.id),
  judgeContexts,
};
await fs.writeFile(path.join(output, "run.json"), `${JSON.stringify(run, null, 2)}\n`);
console.log(JSON.stringify({
  artifact: "mindmake-blind-award-panel-run-v2",
  output,
  runId,
  target: url,
  candidateSha256: candidate.sha256,
  evidenceManifestSha256,
  observations: observations.length,
  pass: observations.filter((item) => item.status === "pass").length,
  unresolved: observations.filter((item) => item.status !== "pass").map((item) => item.id),
}, null, 2));
