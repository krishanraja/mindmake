#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";
import { candidateIdentity } from "./award-panel-lib.mjs";

const root = process.cwd();
const evidenceDir = "C:/Users/krish/.scratch/mindmake-full-route-continuity";
const requiredRoutes = [
  "/",
  "/ai-brain",
  "/ai-gtm",
  "/case-studies",
  "/new-age-leadership",
  "/blog",
  "/answers",
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
];
const chromiumViewports = [
  { name: "mobile-320x568", width: 320, height: 568 },
  { name: "mobile-360x800", width: 360, height: 800 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-430x932", width: 430, height: 932 },
  { name: "tablet-768x1024", width: 768, height: 1024 },
  { name: "landscape-844x390", width: 844, height: 390 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "desktop-1108x574", width: 1108, height: 574 },
  { name: "desktop-1280x800", width: 1280, height: 800 },
  { name: "desktop-1440x700", width: 1440, height: 700 },
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "desktop-1475x730", width: 1475, height: 730 },
  { name: "desktop-1538x636", width: 1538, height: 636 },
  { name: "desktop-1920x1080", width: 1920, height: 1080 },
];
const webkitViewports = chromiumViewports.filter((viewport) => ["mobile-390x844", "tablet-768x1024", "desktop-1108x574", "desktop-1440x900"].includes(viewport.name));
const firefoxViewports = chromiumViewports.filter((viewport) => ["mobile-390x844", "desktop-1108x574", "desktop-1440x900"].includes(viewport.name));
const engines = [
  { name: "chromium", browserType: chromium, options: { channel: "chrome" }, viewports: chromiumViewports },
  { name: "webkit", browserType: webkit, options: {}, viewports: webkitViewports },
  { name: "firefox", browserType: firefox, options: {}, viewports: firefoxViewports },
];
const failures = [];
const observations = [];
const discovered = { blog: null, answer: null };

const fail = (condition, detail) => {
  if (condition) failures.push(detail);
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

async function sourceFingerprint() {
  const paths = [
    "package.json",
    "package-lock.json",
    "quality/website-redesign/continuity-contract.v1.json",
    "src/App.tsx",
    "src/styles/mindmake.css",
    "src/styles/mindmake-instruments.css",
    "src/components/mindmake/MindmakeShell.tsx",
  ];
  const records = [];
  for (const path of paths) {
    const bytes = await readFile(resolve(root, path));
    records.push({ path, sha256: sha256(bytes) });
  }
  return { files: records, sha256: sha256(JSON.stringify(records)) };
}

function monitor(page, label) {
  const runtimeErrors = [];
  page.on("pageerror", (error) => runtimeErrors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") runtimeErrors.push(`console: ${message.text()}`);
  });
  page.on("requestfailed", (request) => {
    const mediaRequest = /\.(mp4|webm)(?:$|\?)/u.test(request.url());
    // Browser media pipelines may cancel speculative ranges during route changes
    // or report decoded cached ranges as failed requests. The rendered-media
    // check below remains authoritative for actual playback failures.
    if (request.url().startsWith(origin) && !mediaRequest) runtimeErrors.push(`request: ${request.method()} ${request.url()} ${request.failure()?.errorText ?? "failed"}`);
  });
  return () => fail(runtimeErrors.length > 0, `${label}: ${runtimeErrors.join(" | ")}`);
}

async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  await page.route("**/functions/v1/**", (route) => route.abort("blockedbyclient"));
}

async function geometry(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0;
    };
    const controls = [...document.querySelectorAll("button,a[href],input,textarea,select,[role='button'],[role='link']")]
      .filter(visible)
      .map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        const label = element.id ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)?.textContent : "";
        const inlineLink = element.tagName === "A" && style.display === "inline" && Boolean(element.closest("p,small,li"));
        return {
          tag: element.tagName,
          text: (element.getAttribute("aria-label") || element.textContent || label || element.getAttribute("placeholder") || "").trim().replace(/\s+/g, " ").slice(0, 100),
          width: rect.width,
          height: rect.height,
          inlineLink,
        };
      });
    const images = [...document.images].filter((image) => {
      if (!visible(image)) return false;
      const rect = image.getBoundingClientRect();
      return rect.bottom >= 0 && rect.top <= innerHeight;
    }).map((image) => ({
      alt: image.alt,
      currentSrc: image.currentSrc,
      complete: image.complete,
      naturalWidth: image.naturalWidth,
    }));
    const media = [...document.querySelectorAll("video")].filter(visible).map((video) => ({
      poster: video.poster,
      readyState: video.readyState,
      error: video.error?.message ?? null,
    }));
    const main = document.querySelector("main");
    const h1 = [...document.querySelectorAll("h1")].filter(visible);
    /* Every route wears the shared header now, /new-age-leadership included,
       so there is no second shape to fall back to. */
    const header = document.querySelector(".mm-header")?.getBoundingClientRect();
    const headerContainer = document.querySelector(".mm-header .mm-container")?.getBoundingClientRect();
    const brand = document.querySelector(".mm-header .mm-brand")?.getBoundingClientRect();
    const primaryHeading = h1[0]?.getBoundingClientRect();
    const mainContainers = [...document.querySelectorAll("main > .mm-container, main > section > .mm-container, main > article > .mm-container")]
      .filter(visible)
      .map((element) => ({
        className: element.className,
        rect: element.getBoundingClientRect().toJSON(),
      }));
    return {
      pathname: location.pathname,
      title: document.title,
      bodyText: document.body.innerText.trim().length,
      main: Boolean(main),
      h1: h1.map((heading) => heading.textContent.trim().replace(/\s+/g, " ")),
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      unnamedControls: controls.filter((control) => !control.text),
      shortStandaloneControls: controls.filter((control) => !control.inlineLink && (control.width < 43.5 || control.height < 43.5)),
      failedImages: images.filter((image) => !image.complete || image.naturalWidth === 0),
      failedMedia: media.filter((item) => item.error),
      mediaCount: media.length,
      alignment: {
        viewport: { width: innerWidth, height: innerHeight },
        header: header?.toJSON(),
        headerContainer: headerContainer?.toJSON(),
        brand: brand?.toJSON(),
        primaryHeading: primaryHeading?.toJSON(),
        mainContainers,
      },
    };
  });
}

async function loadAndCheck(page, route, label) {
  const finishMonitoring = monitor(page, label);
  const response = await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
  await page.locator("main").waitFor({ state: "attached" });
  await page.locator("h1").first().waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(80);
  const state = await geometry(page);
  fail(!response?.ok(), `${label}: route response failed (${response?.status() ?? "no response"})`);
  fail(state.pathname !== route, `${label}: resolved to ${state.pathname}`);
  fail(!state.main, `${label}: main landmark is missing`);
  fail(state.h1.length !== 1, `${label}: expected one visible h1, found ${state.h1.length} (${state.h1.join(" | ")})`);
  fail(state.title.length < 4, `${label}: document title is missing`);
  fail(state.bodyText < 120, `${label}: visible route content is incomplete (${state.bodyText} characters)`);
  fail(state.documentOverflow > 1, `${label}: horizontal document overflow is ${Math.round(state.documentOverflow)}px`);
  fail(state.unnamedControls.length > 0, `${label}: unnamed controls ${JSON.stringify(state.unnamedControls)}`);
  fail(state.shortStandaloneControls.length > 0, `${label}: standalone controls below 44px ${JSON.stringify(state.shortStandaloneControls.slice(0, 8))}`);
  fail(state.failedImages.length > 0, `${label}: failed images ${JSON.stringify(state.failedImages)}`);
  fail(state.failedMedia.length > 0, `${label}: failed visible media ${JSON.stringify(state.failedMedia)}`);
  const { alignment } = state;
  fail(!alignment.header || !alignment.headerContainer || !alignment.brand || !alignment.primaryHeading, `${label}: missing shell or heading alignment anchors ${JSON.stringify(alignment)}`);
  if (alignment.header && alignment.headerContainer && alignment.brand && alignment.primaryHeading) {
    const edgeTolerance = 1.5;
    fail(Math.abs(alignment.brand.left - alignment.headerContainer.left) > edgeTolerance, `${label}: logo drifts ${Math.abs(alignment.brand.left - alignment.headerContainer.left).toFixed(2)}px from the shared content edge (${JSON.stringify(alignment)})`);
    fail(alignment.brand.left < -edgeTolerance || alignment.brand.right > alignment.viewport.width + edgeTolerance, `${label}: logo escapes the viewport (${JSON.stringify(alignment)})`);
    fail(alignment.brand.top < -edgeTolerance || alignment.brand.bottom > alignment.header.bottom + edgeTolerance, `${label}: logo escapes the fixed header (${JSON.stringify(alignment)})`);
    fail(alignment.primaryHeading.left < -edgeTolerance || alignment.primaryHeading.right > alignment.viewport.width + edgeTolerance, `${label}: primary heading escapes the viewport (${JSON.stringify(alignment)})`);
    fail(alignment.primaryHeading.top < alignment.header.bottom - edgeTolerance, `${label}: primary heading begins behind the fixed header (${JSON.stringify(alignment)})`);
    for (const container of alignment.mainContainers) {
      fail(container.rect.left < -edgeTolerance || container.rect.right > alignment.viewport.width + edgeTolerance, `${label}: section container escapes the viewport (${JSON.stringify(container)})`);
      const headerCenter = alignment.headerContainer.left + (alignment.headerContainer.width / 2);
      const containerCenter = container.rect.left + (container.rect.width / 2);
      const sharesEdges = Math.abs(container.rect.left - alignment.headerContainer.left) <= edgeTolerance
        && Math.abs(container.rect.right - alignment.headerContainer.right) <= edgeTolerance;
      const sharesAxis = Math.abs(containerCenter - headerCenter) <= edgeTolerance;
      fail(!sharesEdges && !sharesAxis, `${label}: section container drifts from the shared content axis (${JSON.stringify({ header: alignment.headerContainer, container })})`);
    }
  }
  finishMonitoring();
  observations.push({ label, route, ...state });
  return state;
}

async function verifyShell(page, label) {
  // The preceding navigation deliberately waits only for DOMContentLoaded.
  // Wait for the hydrated route to finish its first focus pass before testing
  // an interactive control; otherwise the test can click inert SSR markup and
  // race React's event attachment on WebKit/Firefox.
  await page.locator("h1").first().waitFor({ state: "visible" });
  await page.waitForTimeout(100);
  const menu = page.getByRole("button", { name: "Open navigation" });
  await menu.click();
  const navigation = page.locator("#mindmake-menu nav");
  await navigation.waitFor({ state: "visible" });
  try {
    await page.waitForFunction(() => document.activeElement?.closest("#mindmake-menu") !== null, null, { timeout: 1_000 });
  } catch {
    fail(true, `${label}: open menu did not move focus into the navigation`);
  }
  const shell = await page.evaluate(() => {
    const activeRect = document.activeElement?.getBoundingClientRect();
    const headerRect = document.querySelector(".mm-header")?.getBoundingClientRect();
    return {
      mainInert: document.querySelector("main")?.inert ?? false,
      footerInert: document.querySelector("footer")?.inert ?? false,
      active: document.activeElement?.textContent?.trim().replace(/\s+/g, " ") ?? "",
      activeRect: activeRect?.toJSON(),
      headerBottom: headerRect?.bottom ?? 0,
      viewportHeight: innerHeight,
      internal: [...document.querySelectorAll("#mindmake-menu a[href]")]
        .map((link) => link.getAttribute("href"))
        .filter((href) => href?.startsWith("/")),
      media: [...document.querySelectorAll("#mindmake-menu a[href]")]
        .find((link) => link.textContent.trim() === "Media")?.getAttribute("href"),
    };
  });
  for (const href of ["/ai-brain", "/ai-gtm", "/case-studies", "/blog", "/new-age-leadership"]) {
    fail(!shell.internal.includes(href), `${label}: menu is missing ${href}`);
  }
  fail(shell.media !== "https://mindmakerlive.substack.com", `${label}: Media points to ${shell.media}`);
  fail(!shell.mainInert || !shell.footerInert, `${label}: open menu does not make the background inert`);
  fail(!shell.active, `${label}: open menu did not receive focus`);
  fail(!shell.activeRect || shell.activeRect.top < shell.headerBottom - 1 || shell.activeRect.bottom > shell.viewportHeight + 1, `${label}: focused menu route is outside the usable viewport (${JSON.stringify(shell)})`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(30);
  fail(!(await menu.isVisible()), `${label}: menu control disappeared after Escape`);
  fail((await menu.getAttribute("aria-expanded")) !== "false", `${label}: Escape did not close navigation`);
  fail(!(await menu.evaluate((element) => element === document.activeElement)), `${label}: Escape did not restore menu focus`);
}

async function verifyCaseRecordAnchor(page, label) {
  await page.goto(`${origin}/case-studies#record-day-one`, { waitUntil: "domcontentloaded" });
  await page.locator("#record-day-one").waitFor({ state: "visible" });
  await page.evaluate(() => document.fonts?.ready);
  try {
    await page.waitForFunction(() => {
      const header = document.querySelector(".mm-header")?.getBoundingClientRect();
      const title = document.querySelector("#archive-title")?.getBoundingClientRect();
      const record = document.querySelector("#record-day-one")?.getBoundingClientRect();
      return Boolean(
        header && title && record
        && title.top >= header.bottom - 1
        && title.bottom <= innerHeight + 1
        && record.top >= header.bottom - 1,
      );
    }, null, { timeout: 2_000 });
  } catch {
    // The exact geometry below records a useful failure rather than hiding it
    // behind a generic wait timeout.
  }
  const placement = await page.evaluate(() => {
    const header = document.querySelector(".mm-header")?.getBoundingClientRect();
    const title = document.querySelector("#archive-title")?.getBoundingClientRect();
    const record = document.querySelector("#record-day-one")?.getBoundingClientRect();
    return {
      headerBottom: header?.bottom ?? -1,
      title: title?.toJSON(),
      record: record?.toJSON(),
      viewportHeight: innerHeight,
    };
  });
  fail(!placement.title || placement.title.top < placement.headerBottom - 1 || placement.title.bottom > placement.viewportHeight + 1, `${label}: proof-record hash hides the archive heading (${JSON.stringify(placement)})`);
  fail(!placement.record || placement.record.top < placement.headerBottom - 1, `${label}: proof-record hash places the record behind the fixed header (${JSON.stringify(placement)})`);
}

async function verifyBrainNodeTargets(page, label) {
  await page.goto(`${origin}/ai-brain#memory`, { waitUntil: "domcontentloaded" });
  const field = page.locator("#meaningFieldS2");
  await field.waitFor({ state: "visible" });
  await field.scrollIntoViewIfNeeded();
  await page.waitForTimeout(80);
  const nodes = page.locator(".meaning-node-s2");
  const count = await nodes.count();
  fail(count !== 20, `${label}: expected 20 selectable ideas, found ${count}`);

  for (let index = 0; index < count; index += 1) {
    const node = nodes.nth(index);
    const id = await node.getAttribute("data-id");
    const box = await node.boundingBox();
    if (!box) {
      fail(true, `${label}: ${id ?? index} has no pointer target`);
      continue;
    }
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    const selected = await node.getAttribute("aria-pressed");
    fail(selected !== "true", `${label}: tapping the visible centre of ${id ?? index} selected a different idea`);
  }
}

async function verifyShortLandscapeStart(page, label) {
  await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#mindmake-menu nav").waitFor({ state: "visible" });
  await page.getByRole("button", { name: "Start here" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor({ state: "visible" });
  const fit = await dialog.evaluate((element) => {
    const choices = [...element.querySelectorAll(".mm-door-choice")].map((choice) => choice.getBoundingClientRect().toJSON());
    return { choices, viewportHeight: innerHeight, panel: element.getBoundingClientRect().toJSON() };
  });
  fail(fit.choices.length !== 2, `${label}: Start here does not expose both route choices (${JSON.stringify(fit)})`);
  for (const [index, choice] of fit.choices.entries()) {
    fail(choice.top < 0 || choice.bottom > fit.viewportHeight + 1, `${label}: Start here choice ${index + 1} is outside the initial viewport (${JSON.stringify(fit)})`);
  }
  await page.keyboard.press("Escape");
}

async function verifyFooter(page, label) {
  const footer = await page.locator(".mm-footer").evaluate((element) => [...element.querySelectorAll("a[href]")].map((link) => ({
    text: link.textContent.trim().replace(/\s+/g, " "),
    href: link.getAttribute("href"),
  })));
  for (const href of ["/contact", "/privacy", "/terms"]) fail(!footer.some((item) => item.href === href), `${label}: footer is missing ${href}`);
  fail(!footer.some((item) => item.text === "Media" && item.href === "https://mindmakerlive.substack.com"), `${label}: footer Media link is missing or incorrect`);
}

async function verifyRouteActions(page, engine, viewport) {
  const suffix = `${engine} ${viewport.name}`;
  await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  const blogHref = await page.locator("a[href^='/blog/']").first().getAttribute("href");
  fail(!blogHref, `${suffix}: blog exposes no article route`);
  if (blogHref) {
    discovered.blog = blogHref;
    await loadAndCheck(page, blogHref, `${suffix} ${blogHref}`);
    const back = page.getByRole("link", { name: /All ideas/i });
    fail(!(await back.count()), `${suffix} ${blogHref}: no route back to the archive`);
    if (await back.count()) {
      await back.click();
      await page.waitForURL(`${origin}/blog`);
    }
  }
  // Start the archive-state assertion from a settled route load. WebKit can
  // retain the article transition's outgoing tree briefly after the client
  // URL has changed, which makes a later search assertion observe stale UI.
  await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  const search = page.getByRole("searchbox");
  await search.waitFor({ state: "visible", timeout: 45000 });
  await search.fill("no-result-sentinel-9f2f");
  await page.locator(".mm-blog-empty").waitFor({ state: "visible", timeout: 45000 });
  await page.getByRole("button", { name: "Show all ideas" }).click();
  fail((await page.getByRole("searchbox").inputValue()) !== "", `${suffix}: clearing blog search did not recover the archive`);

  await page.goto(`${origin}/answers`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  const answerHref = await page.locator("a[href^='/answers/']").first().getAttribute("href");
  fail(!answerHref, `${suffix}: answers exposes no answer route`);
  if (answerHref) {
    discovered.answer = answerHref;
    await loadAndCheck(page, answerHref, `${suffix} ${answerHref}`);
    const back = page.getByRole("link", { name: /All answers/i });
    fail(!(await back.count()), `${suffix} ${answerHref}: no route back to the answer index`);
    if (await back.count()) {
      await back.click();
      await page.waitForURL(`${origin}/answers`);
    }
  }

  await page.goto(`${origin}/contact`, { waitUntil: "domcontentloaded" });
  await page.getByRole("button", { name: /Open in email/i }).click();
  await page.waitForTimeout(30);
  fail(!(await page.locator("#contact-name").evaluate((element) => element === document.activeElement)), `${suffix}: invalid contact submission did not focus Name`);
  fail((await page.locator(".mm-form-error").count()) !== 3, `${suffix}: invalid contact submission did not expose three recoverable errors`);
  fail(page.url() !== `${origin}/contact`, `${suffix}: invalid contact submission attempted a handoff`);
}

async function verifyTextScale(browser) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await prepare(page);
  for (const route of ["/new-age-leadership", "/blog", "/answers", "/faq", "/contact", "/privacy", "/terms"]) {
    const label = `chromium 390x844 ${route} 200% text`;
    await page.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible" });
    await page.evaluate(() => {
      for (const element of document.querySelectorAll("h1,h2,h3,p,li,label,small,a,button,input,textarea")) {
        const size = Number.parseFloat(getComputedStyle(element).fontSize);
        if (Number.isFinite(size)) element.style.fontSize = `${size * 2}px`;
      }
    });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const state = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      clipped: [...document.querySelectorAll("h1,h2,h3,p,li,label,small,button")]
        .filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          if (element.classList.contains("mm-visually-hidden") || style.display === "none" || style.visibility === "hidden" || rect.width === 0 || rect.height === 0) return false;
          if (["visible", "clip"].includes(style.overflow) && ["visible", "clip"].includes(style.overflowX) && ["visible", "clip"].includes(style.overflowY)) return false;
          return element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2;
        })
        .map((element) => ({ tag: element.tagName, text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 100) })),
    }));
    fail(state.overflow > 1, `${label}: horizontal overflow is ${Math.round(state.overflow)}px`);
    fail(state.clipped.length > 0, `${label}: clipped text ${JSON.stringify(state.clipped.slice(0, 8))}`);
  }
  await context.close();
}

async function verifyDesktopTextReflow(browser) {
  const cases = [
    {
      route: "/",
      targets: [".mm-vnext-threshold", ".mm-vnext-instrument", ".mm-vnext-route-doors button"],
    },
    {
      route: "/ai-brain",
      targets: [
        ".mm-locked-brain .opening-copy > h1",
        ".mm-locked-brain .brain-object",
        ".mm-locked-brain .pulse-core",
        ".mm-locked-brain .pulse-core strong",
        ".mm-locked-brain .opening-copy > p",
        ".mm-locked-brain .primary-link",
        ".mm-locked-brain .opening-note",
      ],
    },
  ];

  for (const testCase of cases) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    const page = await context.newPage();
    await prepare(page);
    const label = `chromium desktop-1440x900 ${testCase.route} root text 200%`;
    const finishMonitoring = monitor(page, label);
    await page.goto(`${origin}${testCase.route}`, { waitUntil: "domcontentloaded" });
    await page.locator("h1").first().waitFor({ state: "visible" });
    await page.evaluate(() => document.fonts?.ready);
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const state = await page.evaluate((selectors) => {
      const targets = selectors.flatMap((selector) => [...document.querySelectorAll(selector)].map((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          selector,
          text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100),
          rect: rect.toJSON(),
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          scrollHeight: element.scrollHeight,
          clientHeight: element.clientHeight,
        };
      }));
      const plaqueRoles = [
        document.querySelector(".mm-locked-brain .pulse-core > span"),
        document.querySelector(".mm-locked-brain .pulse-core > strong"),
        document.querySelector(".mm-locked-brain .pulse-core > small"),
      ].filter(Boolean).map((element) => element.getBoundingClientRect().toJSON());
      return {
        viewport: { width: innerWidth, height: innerHeight },
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        targets,
        plaqueRoles,
      };
    }, testCase.targets);
    fail(state.documentOverflow > 1, `${label}: horizontal document overflow is ${Math.round(state.documentOverflow)}px`);
    for (const target of state.targets) {
      fail(target.rect.left < -1 || target.rect.right > state.viewport.width + 1, `${label}: ${target.selector} escapes the viewport (${JSON.stringify(target)})`);
      const clipsWidth = !["visible", "clip"].includes(target.overflowX) && target.scrollWidth > target.clientWidth + 4;
      const clipsHeight = !["visible", "clip"].includes(target.overflowY) && target.scrollHeight > target.clientHeight + 4;
      fail(clipsWidth || clipsHeight, `${label}: ${target.selector} clips enlarged content (${JSON.stringify(target)})`);
    }
    for (let index = 1; index < state.plaqueRoles.length; index += 1) {
      fail(state.plaqueRoles[index - 1].bottom > state.plaqueRoles[index].top + 1, `${label}: Brain plaque text roles overlap (${JSON.stringify(state.plaqueRoles)})`);
    }
    finishMonitoring();
    await context.close();
  }
}

async function verifyDesktopReflow(browser) {
  const context = await browser.newContext({
    viewport: { width: 512, height: 384 },
    hasTouch: false,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await prepare(page);
  const label = "chromium desktop fine-pointer 512x384 /blog reflow";
  await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.evaluate(() => scrollTo(0, Math.max(innerHeight, document.body.scrollHeight * 0.45)));
  await page.waitForTimeout(80);
  const actionBar = await page.locator(".mm-action-bar").evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      display: style.display,
      visible: style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0,
    };
  });
  fail(actionBar.visible || actionBar.display !== "none", `${label}: phone-only action bar obstructs desktop reflow (${JSON.stringify(actionBar)})`);

  // The Decision Balance now exists on /new-age-leadership alone, so the
  // reflow measurement of the commercial surface follows it there. The action
  // bar reading above stays on /blog, which is the route that renders one.
  const commercialLabel = "chromium desktop fine-pointer 512x384 /new-age-leadership reflow";
  await page.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
  const contract = page.locator(".mm-decision-balance");
  await contract.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const commercial = await contract.evaluate((element) => {
    const paragraph = element.querySelector(".mm-decision-balance-contract");
    const sheet = element.querySelector(".mm-decision-balance-instrument");
    const rect = element.getBoundingClientRect();
    const sheetRect = sheet?.getBoundingClientRect();
    const paragraphRect = paragraph?.getBoundingClientRect();
    return {
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      contract: rect.toJSON(),
      sheet: sheetRect?.toJSON(),
      paragraph: paragraphRect?.toJSON(),
      paragraphClientWidth: paragraph?.clientWidth ?? -1,
      paragraphScrollWidth: paragraph?.scrollWidth ?? -1,
    };
  });
  fail(commercial.documentOverflow > 1, `${commercialLabel}: commercial surface creates ${Math.round(commercial.documentOverflow)}px horizontal overflow`);
  fail(!commercial.paragraph || commercial.paragraph.width < 180, `${commercialLabel}: Decision Balance promise collapsed (${JSON.stringify(commercial)})`);
  fail(commercial.paragraphClientWidth < 0 || commercial.paragraphScrollWidth > commercial.paragraphClientWidth + 2, `${commercialLabel}: commercial proof paragraph clips (${JSON.stringify(commercial)})`);
  fail(commercial.contract.left < -1 || commercial.contract.right > 513, `${commercialLabel}: commercial contract escapes the reflow viewport (${JSON.stringify(commercial)})`);
  fail(!commercial.sheet || commercial.sheet.left < -1 || commercial.sheet.right > 513, `${commercialLabel}: Decision Balance instrument escapes the reflow viewport (${JSON.stringify(commercial)})`);
  await context.close();
}

async function verifyLockedSurfaceReflow(browser) {
  const cases = [
    {
      route: "/ai-brain",
      viewport: { width: 512, height: 384 },
      container: ".memory",
      targets: ["#memory-title"],
      avoid: ".memory .instrument",
    },
    {
      route: "/ai-brain",
      viewport: { width: 720, height: 450 },
      container: ".memory",
      targets: ["#memory-title"],
      avoid: ".memory .instrument",
    },
    {
      route: "/ai-brain",
      viewport: { width: 512, height: 384 },
      container: ".correction",
      targets: ["#correction-title"],
      avoid: ".correction .instrument",
    },
    {
      route: "/ai-brain",
      viewport: { width: 720, height: 450 },
      container: ".correction",
      targets: ["#correction-title"],
      avoid: ".correction .instrument",
    },
    {
      route: "/ai-brain",
      viewport: { width: 512, height: 384 },
      container: ".correction-machine",
      targets: [".memory-sheet-after p", ".machine-status"],
    },
    {
      route: "/ai-gtm",
      viewport: { width: 720, height: 450 },
      container: ".test-slip",
      targets: [".test-slip > p:not(.test-label)"],
    },
  ];

  for (const testCase of cases) {
    const context = await browser.newContext({ viewport: testCase.viewport, hasTouch: false, reducedMotion: "reduce" });
    const page = await context.newPage();
    await prepare(page);
    const label = `chromium desktop fine-pointer ${testCase.viewport.width}x${testCase.viewport.height} ${testCase.route} 200% reflow`;
    await page.goto(`${origin}${testCase.route}`, { waitUntil: "domcontentloaded" });
    await page.getByRole("heading", { level: 1 }).waitFor();
    const container = page.locator(testCase.container);
    await container.scrollIntoViewIfNeeded();
    const state = await page.evaluate(({ targets, avoid }) => {
      const avoidRect = avoid ? document.querySelector(avoid)?.getBoundingClientRect() : null;
      return {
        clientWidth: document.documentElement.clientWidth,
        documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        avoid,
        avoidRect: avoidRect?.toJSON(),
        targets: targets.map((selector) => {
          const element = document.querySelector(selector);
          const rect = element?.getBoundingClientRect();
          return {
            selector,
            exists: Boolean(element),
            left: rect?.left ?? -1,
            right: rect?.right ?? -1,
            top: rect?.top ?? -1,
            bottom: rect?.bottom ?? -1,
            scrollWidth: element?.scrollWidth ?? -1,
            clientWidth: element?.clientWidth ?? -1,
            text: element?.textContent?.trim().replace(/\s+/g, " ").slice(0, 120) ?? "",
          };
        }),
      };
    }, { targets: testCase.targets, avoid: testCase.avoid });
    fail(state.documentOverflow > 1, `${label}: horizontal document overflow is ${Math.round(state.documentOverflow)}px`);
    for (const target of state.targets) {
      fail(!target.exists, `${label}: missing ${target.selector}`);
      fail(target.left < -1 || target.right > state.clientWidth + 1, `${label}: ${target.selector} escapes the reflow viewport (${JSON.stringify(target)})`);
      fail(target.scrollWidth > target.clientWidth + 2, `${label}: ${target.selector} clips its text (${JSON.stringify(target)})`);
      if (state.avoidRect) {
        const intersects = target.left < state.avoidRect.right && target.right > state.avoidRect.left
          && target.top < state.avoidRect.bottom && target.bottom > state.avoidRect.top;
        fail(intersects, `${label}: ${target.selector} collides with ${state.avoid} (${JSON.stringify({ target, avoid: state.avoidRect })})`);
      }
    }
    await context.close();
  }
}

async function verifyMobileAction(browser) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await prepare(page);
  const label = "chromium mobile coarse-pointer 390x844 /blog";
  await page.goto(`${origin}/blog`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  await page.evaluate(() => scrollTo(0, innerHeight * 1.5));
  await page.waitForTimeout(80);
  const actionBar = await page.locator(".mm-action-bar").evaluate((element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      shown: element.classList.contains("is-shown"),
      display: style.display,
      visible: style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0 && rect.width > 0 && rect.height > 0,
    };
  });
  fail(!actionBar.shown || !actionBar.visible, `${label}: device-specific primary action is unavailable after the first screen (${JSON.stringify(actionBar)})`);
  await context.close();
}

async function verifyLeadershipInteraction(browser) {
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await prepare(page);
  const label = "chromium 1024x768 /new-age-leadership normal motion";
  await page.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { level: 1 }).waitFor();
  const entrance = await page.evaluate(() => {
    const hero = document.querySelector(".nal-page .hero")?.getBoundingClientRect();
    const header = document.querySelector(".mm-header")?.getBoundingClientRect();
    const brand = document.querySelector(".mm-header .mm-brand")?.getBoundingClientRect();
    const content = document.querySelector(".nal-page .hero-content")?.getBoundingClientRect();
    const title = document.querySelector("#hero-title");
    return { hero, header, brand, content, titleColour: title ? getComputedStyle(title).color : "missing", overflow: document.documentElement.scrollWidth - innerWidth };
  });
  fail(!entrance.hero || Math.abs(entrance.hero.top) > 1 || Math.abs(entrance.hero.height - 768) > 2, `${label}: hero does not own the first viewport (${JSON.stringify(entrance)})`);
  fail(!entrance.brand || !entrance.content || Math.abs(entrance.brand.left - entrance.content.left) > 2, `${label}: logo and story grid are misaligned (${JSON.stringify(entrance)})`);
  fail(entrance.titleColour !== "rgb(234, 223, 200)" || entrance.overflow > 1, `${label}: opening contrast or overflow regressed (${JSON.stringify(entrance)})`);

  await page.locator("[data-lens-next]").click();
  await page.waitForTimeout(800);
  fail(await page.locator('[data-lens-copy="0"]').getAttribute("aria-hidden") !== "true", `${label}: history does not advance`);
  await page.locator('[data-reach-jump="organisation"]').click();
  await page.waitForTimeout(250);
  fail(await page.locator('[data-reach-panel="organisation"]').getAttribute("aria-hidden") !== "false", `${label}: organisation state does not open`);
  await page.locator('[data-reach-jump="boundary"]').click();
  await page.waitForTimeout(250);
  fail(await page.locator('[data-reach-panel="boundary"]').getAttribute("aria-hidden") !== "false", `${label}: work state does not restore`);
  await page.locator("[data-benefit-next]").click();
  fail(await page.locator('[data-benefit="1"]').getAttribute("aria-hidden") !== "false", `${label}: AI Brain benefits do not advance`);
  const motion = page.locator(".motion-toggle");
  await motion.click();
  fail(await motion.getAttribute("aria-pressed") !== "true", `${label}: motion cannot be paused`);
  await motion.click();
  fail(await motion.getAttribute("aria-pressed") !== "false", `${label}: motion cannot be resumed`);
  await context.close();
}

await mkdir(evidenceDir, { recursive: true });
const vite = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
await vite.listen();
const address = vite.httpServer.address();
if (!address || typeof address === "string") throw new Error("Vite did not provide a local port");
const origin = `http://127.0.0.1:${address.port}`;

try {
  for (const { name: engine, browserType, options, viewports } of engines) {
    const browser = await browserType.launch({ headless: true, ...options });
    try {
      for (const viewport of viewports) {
        const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
        const page = await context.newPage();
        await prepare(page);
        for (const route of requiredRoutes) {
          const label = `${engine} ${viewport.name} ${route}`;
          await loadAndCheck(page, route, label);
          await verifyFooter(page, label);
        }
        await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
        await verifyShell(page, `${engine} ${viewport.name} shared shell`);
        if (["landscape-844x390", "desktop-1440x900", "mobile-390x844"].includes(viewport.name)) {
          await verifyCaseRecordAnchor(page, `${engine} ${viewport.name} case record anchor`);
        }
        if (["mobile-320x568", "mobile-390x844"].includes(viewport.name)) {
          await verifyBrainNodeTargets(page, `${engine} ${viewport.name} Brain idea targets`);
        }
        if (viewport.name === "landscape-844x390") {
          await verifyShortLandscapeStart(page, `${engine} ${viewport.name} Start here`);
        }
        if (["mobile-390x844", "desktop-1440x900"].includes(viewport.name)) {
          await verifyRouteActions(page, engine, viewport);
        }
        await page.screenshot({ path: `${evidenceDir}/${engine}-${viewport.name}-final.png`, fullPage: false });
        await context.close();
        console.log(`${engine} ${viewport.name}: pass`);
      }
      if (engine === "chromium") {
        await verifyTextScale(browser);
        await verifyDesktopTextReflow(browser);
        await verifyDesktopReflow(browser);
        await verifyLockedSurfaceReflow(browser);
        await verifyMobileAction(browser);
        await verifyLeadershipInteraction(browser);
      }
    } finally {
      await browser.close();
    }
  }
} finally {
  await vite.close();
}

const identity = {
  head: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
  statusSha256: sha256(execFileSync("git", ["status", "--short", "--untracked-files=all"], { cwd: root, encoding: "utf8" })),
  source: await sourceFingerprint(),
  candidate: await candidateIdentity(),
};
const report = {
  artifact: "mindmake-full-route-continuity-v1",
  generatedAt: new Date().toISOString(),
  origin,
  identity,
  routePatterns: [...requiredRoutes, "/blog/:slug", "/answers/:slug"],
  discovered,
  engines: engines.map(({ name }) => name),
  viewports: Object.fromEntries(engines.map(({ name, viewports }) => [name, viewports])),
  observations,
  physicalDevices: "not run; automation and emulation do not satisfy the physical-device release gate",
  failures,
};
await writeFile(`${evidenceDir}/report.json`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  artifact: report.artifact,
  evidence: `${evidenceDir}/report.json`,
  identity,
  routePatterns: report.routePatterns.length,
  checks: observations.length,
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
