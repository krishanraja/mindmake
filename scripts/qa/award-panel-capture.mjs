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
const feedbackLedgerPath = path.resolve(flag("feedback-ledger", path.join(root, "project-documentation", "website-redesign", "feedback-ledger.json")));
const cookieJarFlag = flag("cookie-jar", "");
const targetUrl = new URL(url);
const routeGroups = rubric.requiredRouteGroups ?? { complete: [targetUrl.pathname || "/"], core: [targetUrl.pathname || "/"] };
const completeRoutes = routeGroups.complete ?? [targetUrl.pathname || "/"];
const coreRoutes = new Set(routeGroups.core ?? completeRoutes);
if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,99}$/.test(runId)) {
  console.error("run id must be 1 to 100 filename-safe characters using letters, numbers, dots, underscores or hyphens");
  process.exit(1);
}

const feedbackLedger = await readJson(feedbackLedgerPath);
const feedbackBlockingStatuses = new Set(feedbackLedger.rules?.approvalBlockedByStatuses ?? ["open", "implemented-awaiting-review"]);
const blockingFeedback = (feedbackLedger.items ?? []).filter((item) => feedbackBlockingStatuses.has(item.status));
if (blockingFeedback.length) {
  console.error(`award panel capture blocked by unresolved feedback:\n${blockingFeedback.map((item) => `- ${item.id}: ${item.requiredOutcome}`).join("\n")}`);
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

async function readNetscapeCookieJar(file) {
  if (!file) return [];
  const source = await fs.readFile(path.resolve(file), "utf8");
  return source
    .split(/\r?\n/)
    .filter((line) => line && (!line.startsWith("#") || line.startsWith("#HttpOnly_")))
    .map((line) => {
      const [rawDomain, , cookiePath, secure, expires, name, value] = line.replace(/^#HttpOnly_/, "").split("\t");
      if (!rawDomain || !name || value === undefined) return null;
      return {
        name,
        value,
        domain: rawDomain,
        path: cookiePath || "/",
        secure: secure === "TRUE",
        httpOnly: line.startsWith("#HttpOnly_"),
        sameSite: "Lax",
        ...(Number(expires) > 0 ? { expires: Number(expires) } : {}),
      };
    })
    .filter(Boolean);
}

const previewCookies = await readNetscapeCookieJar(cookieJarFlag);

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
    const primaryDesktop = rubric.surfaces.desktop.viewports.find((item) => item.width === 1440 && item.height === 900);
    const primaryMobile = rubric.surfaces.mobile.viewports.find((item) => item.width === 390 && item.height === 844);
    const cases = [];
    for (const route of completeRoutes) {
      for (const viewport of [primaryDesktop, primaryMobile].filter(Boolean)) cases.push({ route, viewport });
    }
    if (plan.id === "chromium") {
      for (const route of coreRoutes) {
        for (const viewport of plan.viewports.filter(Boolean)) {
          if ((viewport.width === primaryDesktop?.width && viewport.height === primaryDesktop?.height)
            || (viewport.width === primaryMobile?.width && viewport.height === primaryMobile?.height)) continue;
          cases.push({ route, viewport });
        }
      }
    }
    for (const { route, viewport } of cases) {
      const surface = viewport.width > viewport.height && viewport.width >= 1024 ? "desktop" : "mobile";
      const context = await browser.newContext({ viewport, reducedMotion: "no-preference", hasTouch: surface === "mobile" });
      if (previewCookies.length) await context.addCookies(previewCookies);
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));
      const routeUrl = new URL(route, targetUrl.origin);
      const expectedPath = routeUrl.pathname || "/";
      const response = await page.goto(routeUrl.href, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.locator("main").waitFor({ state: "attached" });
      await page.evaluate(() => document.fonts?.ready);
      const routeStem = expectedPath === "/" ? "home" : expectedPath.slice(1).replaceAll("/", "-");
      const stem = `${plan.id}-${surface}-${viewport.width}x${viewport.height}-${routeStem}`;
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
        const sectionNodes = [...new Set([...document.querySelectorAll("main section"), ...document.querySelectorAll("main > div")])]
          .filter((section) => {
            const rect = section.getBoundingClientRect();
            const style = getComputedStyle(section);
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
          });
        const sections = sectionNodes.map((section, index) => {
          const rect = section.getBoundingClientRect();
          const sectionText = (section.innerText || "").replace(/\s+/g, " ").trim();
          const heading = section.querySelector("h1,h2,h3")?.textContent?.replace(/\s+/g, " ").trim() || "";
          return {
            index,
            id: section.id || "",
            className: typeof section.className === "string" ? section.className : "",
            heading,
            words: sectionText ? sectionText.split(/\s+/).length : 0,
            heightScreens: Math.round((rect.height / innerHeight) * 100) / 100,
            controls: section.querySelectorAll("a,button,input,select,textarea").length,
            visuals: section.querySelectorAll("img,video,svg,canvas,picture").length,
          };
        });
        return {
          pathname: location.pathname,
          title: document.title,
          words: text ? text.split(/\s+/).length : 0,
          headings,
          hasMain: Boolean(document.querySelector("main")),
          hasVisibleH1: [...document.querySelectorAll("h1")].some((heading) => {
            const rect = heading.getBoundingClientRect();
            const style = getComputedStyle(heading);
            return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
          }),
          firstViewportControls: controls,
          totalScreens: Math.round((document.documentElement.scrollHeight / innerHeight) * 100) / 100,
          horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - innerWidth),
          sections,
        };
      });
      const protectionPage = /log in to vercel/i.test(metrics.title) || metrics.pathname === "/login";
      const status = response?.ok()
        && metrics.pathname === expectedPath
        && metrics.hasMain
        && metrics.hasVisibleH1
        && metrics.words >= 20
        && !protectionPage
        && consoleErrors.length === 0
        && metrics.horizontalOverflow <= 1
        ? "pass"
        : "fail";
      observations.push({
        id: `capture-${stem}`,
        kind: "rendered_browser_capture",
        status,
        engine: plan.id,
        input: surface === "mobile" ? "touch-emulation" : "pointer-keyboard",
        route: expectedPath,
        viewport: `${viewport.width}x${viewport.height}`,
        action: "cold load, inventory every major section, traverse complete scroll, return to opening",
        expected: "complete candidate-bound route with no runtime error or horizontal overflow and a section-level storyboard inventory",
        observed: `${response?.status() ?? "no response"}; resolved ${metrics.pathname}; ${consoleErrors.length} runtime errors; ${metrics.horizontalOverflow}px horizontal overflow; protection page ${protectionPage ? "yes" : "no"}`,
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

const primaryJourneyCaptures = observations.filter((item) => item.kind === "rendered_browser_capture"
  && item.engine === "chromium"
  && ["1440x900", "390x844"].includes(item.viewport));
const headingRoutes = new Map();
for (const observation of primaryJourneyCaptures) {
  for (const section of observation.metrics?.sections ?? []) {
    const heading = section.heading?.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (!heading) continue;
    if (!headingRoutes.has(heading)) headingRoutes.set(heading, new Set());
    headingRoutes.get(heading).add(observation.route);
  }
}
const repeatedHeadings = [...headingRoutes.entries()]
  .filter(([, routes]) => routes.size > 1)
  .map(([heading, routes]) => ({ heading, routes: [...routes].sort() }));
observations.push({
  id: "cross-route-storyboard-inventory",
  kind: "cross_route_storyboard",
  status: primaryJourneyCaptures.length === completeRoutes.length * 2 ? "pass" : "inconclusive",
  engine: "chromium",
  input: "pointer-touch-emulation",
  route: "all required routes",
  viewport: "required matrix",
  action: "compare every primary desktop and mobile route inventory for story progression, section cost and repeated mechanisms",
  expected: "two candidate-bound inventories for every required route and explicit cross-route repetition evidence",
  observed: `${primaryJourneyCaptures.length} primary route inventories for ${completeRoutes.length} routes; ${repeatedHeadings.length} headings repeat across routes`,
  metrics: {
    routes: primaryJourneyCaptures.map((item) => ({ route: item.route, viewport: item.viewport, totalScreens: item.metrics?.totalScreens, sections: item.metrics?.sections ?? [] })),
    repeatedHeadings,
  },
  evidence: primaryJourneyCaptures.flatMap((item) => item.evidence ?? []),
});

try {
  const continuity = await readJson(continuityPath);
  const continuityBytes = await fs.readFile(continuityPath);
  const continuityCandidateSha256 = continuity.identity?.candidate?.sha256;
  const continuityMatchesCandidate = continuityCandidateSha256 === candidate.sha256;
  const continuityEvidenceDir = path.join(output, "evidence");
  const continuityEvidenceFile = path.join(continuityEvidenceDir, "full-route-continuity-report.json");
  await fs.mkdir(continuityEvidenceDir, { recursive: true });
  await fs.writeFile(continuityEvidenceFile, continuityBytes);
  observations.push({
    id: "automation-full-route-continuity",
    kind: "deterministic_automation",
    status: continuity.failures?.length === 0 && continuityMatchesCandidate ? "pass" : "inconclusive",
    engine: "chromium-webkit-firefox",
    input: "pointer-keyboard-touch-emulation-reduced-motion-200-percent-text",
    route: "all required routes",
    viewport: "390x844 and 1440x900",
    action: "load every route, use shared navigation, open archive entries, recover validation and return",
    expected: "zero deterministic failures",
    observed: `${continuity.checks ?? continuity.observations?.length ?? 0} route observations; ${continuity.failures?.length ?? 0} failures; candidate ${continuityMatchesCandidate ? "matches" : `mismatch (${continuityCandidateSha256 ?? "missing"})`}`,
    evidence: [{ path: path.relative(output, continuityEvidenceFile).replaceAll("\\", "/"), sha256: sha256(continuityBytes) }],
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

const feedbackRequirements = {
  ledgerVersion: feedbackLedger.ledgerVersion,
  requirements: (feedbackLedger.items ?? [])
    .filter((item) => ["verified", "accepted"].includes(item.status))
    .map(({ id, surface, section, device, element, classification, requiredOutcome, acceptanceTest, status }) => ({ id, surface, section, device, element, classification, requiredOutcome, acceptanceTest, status })),
};
const feedbackEvidenceDir = path.join(output, "evidence");
const feedbackEvidenceFile = path.join(feedbackEvidenceDir, "feedback-requirements.json");
await fs.mkdir(feedbackEvidenceDir, { recursive: true });
const feedbackEvidenceBytes = Buffer.from(`${JSON.stringify(feedbackRequirements, null, 2)}\n`);
await fs.writeFile(feedbackEvidenceFile, feedbackEvidenceBytes);
observations.push({
  id: "feedback-reconciliation-requirements",
  kind: "governed_requirements",
  status: "pass",
  engine: "project-ledger",
  input: "neutral-resolved-requirements-only",
  route: "all applicable routes",
  viewport: "all applicable viewports",
  action: "check the candidate against every resolved feedback requirement without exposing owner complaint history",
  expected: "no unresolved feedback and complete neutral requirements for applicable judges",
  observed: `${feedbackRequirements.requirements.length} resolved requirements; 0 blocking feedback items`,
  evidence: [{ path: path.relative(output, feedbackEvidenceFile).replaceAll("\\", "/"), sha256: sha256(feedbackEvidenceBytes) }],
});

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
  schemaVersion: rubric.rubricRevision >= 3 ? 3 : 2,
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
  artifact: `mindmake-blind-award-panel-run-v${rubric.rubricRevision}`,
  output,
  runId,
  target: url,
  candidateSha256: candidate.sha256,
  evidenceManifestSha256,
  observations: observations.length,
  pass: observations.filter((item) => item.status === "pass").length,
  unresolved: observations.filter((item) => item.status !== "pass").map((item) => item.id),
}, null, 2));
