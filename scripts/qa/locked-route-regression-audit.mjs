#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const origin = process.env.MINDMAKE_ORIGIN || "http://127.0.0.1:4192";
const output = "C:/Users/krish/.scratch/mindmake-locked-route-regression";
const targets = [
  ["brain", "/prototypes/ai-brain-vnext-r5/index.html", "/ai-brain"],
  ["gtm", "/prototypes/ai-gtm-vnext-r6/index.html", "/ai-gtm"],
];
const activeTargets = process.env.QA_TARGET
  ? targets.filter(([name]) => name === process.env.QA_TARGET)
  : targets;
const surfaces = process.env.QA_SURFACE === "production"
  ? [["production", null]]
  : process.env.QA_SURFACE === "prototype"
    ? [["prototype", null]]
    : [["prototype", null], ["production", null]];
const viewports = [
  ["desktop", 1440, 900],
  ["shallow", 1440, 700],
  ["mobile", 390, 844],
  ["compact", 320, 568],
];
const activeViewports = process.env.QA_VIEWPORT
  ? viewports.filter(([name]) => name === process.env.QA_VIEWPORT)
  : viewports;

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const report = [];
const failures = [];

async function openPage(route, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  return page;
}

async function snapshot(page, path, label, selector) {
  const metrics = await page.evaluate(({ label, selector }) => {
    const effectiveOpacity = (element) => {
      let opacity = 1;
      for (let current = element; current; current = current.parentElement) opacity *= Number(getComputedStyle(current).opacity || 1);
      return opacity;
    };
    const parseColour = (value) => {
      const parts = value.match(/[\d.]+/g)?.map(Number) ?? [];
      return parts.length >= 3 ? { r: parts[0], g: parts[1], b: parts[2], a: parts[3] ?? 1 } : null;
    };
    const luminance = ({ r, g, b }) => {
      const channel = (value) => {
        const scaled = value / 255;
        return scaled <= .04045 ? scaled / 12.92 : ((scaled + .055) / 1.055) ** 2.4;
      };
      return .2126 * channel(r) + .7152 * channel(g) + .0722 * channel(b);
    };
    const contrast = (foreground, background) => {
      const lighter = Math.max(luminance(foreground), luminance(background));
      const darker = Math.min(luminance(foreground), luminance(background));
      return (lighter + .05) / (darker + .05);
    };
    const backgroundFor = (element) => {
      for (let current = element; current; current = current.parentElement) {
        const colour = parseColour(getComputedStyle(current).backgroundColor);
        if (colour && colour.a > .95) return colour;
      }
      return { r: 255, g: 255, b: 255, a: 1 };
    };
    const root = document.querySelector(selector);
    const viewport = { width: innerWidth, height: innerHeight };
    if (!root) return { label, selector, missing: true, viewport };
    const rect = root.getBoundingClientRect();
    const style = getComputedStyle(root);
    const visibleText = [...root.querySelectorAll("h1,h2,h3,p,strong,dd,blockquote")].filter((element) => {
      const box = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      return box.width > 0 && box.height > 0 && computed.display !== "none" && computed.visibility !== "hidden" && effectiveOpacity(element) > .5;
    }).map((element) => {
      const box = element.getBoundingClientRect();
      const computed = getComputedStyle(element);
      const foreground = parseColour(computed.color);
      return {
        tag: element.tagName,
        text: element.textContent.trim().replace(/\s+/g, " ").slice(0, 120),
        top: Math.round(box.top),
        bottom: Math.round(box.bottom),
        color: computed.color,
        opacity: effectiveOpacity(element),
        contrast: foreground ? contrast(foreground, backgroundFor(element)) : 0,
      };
    });
    const groups = [root.querySelector(":scope > .state-copy"), root.querySelector(":scope > .brain-change")]
      .filter(Boolean)
      .map((element) => {
        const box = element.getBoundingClientRect();
        return { top: Math.round(box.top), bottom: Math.round(box.bottom), height: Math.round(box.height) };
      });
    const largestVerticalGap = (container) => {
      if (!container) return null;
      const cage = container.getBoundingClientRect();
      const boxes = [...container.children]
        .filter((element) => {
          const computed = getComputedStyle(element);
          const box = element.getBoundingClientRect();
          return computed.position !== "absolute" && computed.display !== "none" && computed.visibility !== "hidden"
            && effectiveOpacity(element) > .5 && box.width > 0 && box.height > 0;
        })
        .map((element) => element.getBoundingClientRect())
        .sort((a, b) => a.top - b.top);
      let gap = 0;
      for (let index = 1; index < boxes.length; index += 1) gap = Math.max(gap, boxes[index].top - boxes[index - 1].bottom);
      if (boxes.length) {
        gap = Math.max(gap, boxes[0].top - cage.top, cage.bottom - boxes.at(-1).bottom);
      }
      return Math.round(gap);
    };
    const componentGaps = {
      portraitSignals: [...root.querySelectorAll(".portrait-signals > span")].map(largestVerticalGap),
      evidenceRows: [...root.querySelectorAll(".brain-evidence > div, .brain-evidence > aside")].map(largestVerticalGap),
      correctionCards: [...root.querySelectorAll(".brain-change > div")].map(largestVerticalGap),
    };
    const brand = document.querySelector(".mm-brand")?.getBoundingClientRect();
    const sectionHeading = document.querySelector(".sequence-heading")?.getBoundingClientRect();
    const heroCopy = document.querySelector(".hero-copy h1")?.getBoundingClientRect();
    return {
      label,
      selector,
      viewport,
      scrollY: Math.round(scrollY),
      rect: { top: Math.round(rect.top), bottom: Math.round(rect.bottom), width: Math.round(rect.width), height: Math.round(rect.height) },
      style: { display: style.display, visibility: style.visibility, opacity: style.opacity, effectiveOpacity: effectiveOpacity(root), position: style.position },
      visibleText,
      groups,
      componentGaps,
      sectionGridDelta: brand && sectionHeading ? Math.abs(brand.left - sectionHeading.left) : null,
      heroGridDelta: brand && heroCopy ? Math.abs(brand.left - heroCopy.left) : null,
      pageHeight: document.documentElement.scrollHeight,
      contentOverflow: root.scrollHeight - root.clientHeight,
      horizontalOverflow: document.documentElement.scrollWidth - innerWidth,
    };
  }, { label, selector });
  await page.screenshot({ path, fullPage: false });
  report.push(metrics);
  if (!label.includes("production")) return;
  if (metrics.missing) {
    failures.push(`${label}: target ${selector} is missing`);
    return;
  }
  if (metrics.style.effectiveOpacity < .95) failures.push(`${label}: target effective opacity is ${metrics.style.effectiveOpacity.toFixed(2)}`);
  if (!metrics.visibleText.length) failures.push(`${label}: no effective visible text`);
  if (metrics.horizontalOverflow > 1) failures.push(`${label}: horizontal overflow is ${metrics.horizontalOverflow}px`);
  if (metrics.contentOverflow > 2) failures.push(`${label}: content clips by ${metrics.contentOverflow}px`);
  const weakHeading = metrics.visibleText.find((item) => /^H[1-3]$/.test(item.tag) && item.contrast < 3);
  if (weakHeading) failures.push(`${label}: heading contrast is ${weakHeading.contrast.toFixed(2)} for “${weakHeading.text}”`);
  if (label.includes("brain-production") && label.endsWith("stage-3") && metrics.groups.length === 2) {
    const [copy, change] = metrics.groups;
    const separated = change.top - copy.bottom;
    const centreDelta = Math.abs((copy.top + copy.bottom) / 2 - (change.top + change.bottom) / 2);
    if (separated > 48 && centreDelta > 120) failures.push(`${label}: correction comparison is detached by ${separated}px`);
  }
  if (label.includes("brain-production")) {
    const componentGapLimit = /-(mobile|compact)-/.test(label) ? 76 : 110;
    for (const [component, gaps] of Object.entries(metrics.componentGaps)) {
      const largest = Math.max(0, ...gaps.filter((gap) => gap !== null));
      if (largest > componentGapLimit) failures.push(`${label}: ${component} contains a ${largest}px inert vertical gap`);
    }
  }
  if (label.includes("brain-production") && metrics.sectionGridDelta !== null && metrics.sectionGridDelta > 12) {
    failures.push(`${label}: logo and visible section heading differ by ${metrics.sectionGridDelta.toFixed(0)}px`);
  }
  if (label.includes("brain-production") && metrics.heroGridDelta !== null && metrics.heroGridDelta > 12) {
    failures.push(`${label}: logo and visible hero copy differ by ${metrics.heroGridDelta.toFixed(0)}px`);
  }
}

for (const [name, prototypeRoute, productionRoute] of activeTargets) {
  for (const [viewportName, width, height] of activeViewports) {
    for (const [surface] of surfaces) {
      const route = surface === "prototype" ? prototypeRoute : productionRoute;
      const page = await openPage(route, width, height);
      if (name === "brain") {
        for (let stage = 0; stage < 4; stage += 1) {
          const button = page.locator(".stage-nav button").nth(stage);
          await button.click();
          await page.waitForTimeout(650);
          await snapshot(page, `${output}/${name}-${surface}-${viewportName}-stage-${stage}.png`, `${name}-${surface}-${viewportName}-stage-${stage}`, `[data-panel="${stage}"]`);
        }
        await page.locator(".proof").scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        await snapshot(page, `${output}/${name}-${surface}-${viewportName}-proof.png`, `${name}-${surface}-${viewportName}-proof`, ".proof");
      } else {
        for (let phase = 0; phase < 3; phase += 1) {
          await page.locator(".decision-rail button").nth(phase).click();
          await page.waitForTimeout(750);
          const selector = phase === 0 ? ".decision-intro" : phase === 1 ? ".comparison-shell" : ".test-ticket";
          await snapshot(page, `${output}/${name}-${surface}-${viewportName}-phase-${phase}.png`, `${name}-${surface}-${viewportName}-phase-${phase}`, selector);
        }
        await page.locator(".proof").scrollIntoViewIfNeeded();
        await page.waitForTimeout(350);
        await snapshot(page, `${output}/${name}-${surface}-${viewportName}-proof.png`, `${name}-${surface}-${viewportName}-proof`, ".proof");
      }
      await page.close();
    }
  }
}

for (const [name, reviewRoute] of [
  ["brain", "/prototypes/ai-brain-vnext-r5/production-review.html"],
  ["gtm", "/prototypes/ai-gtm-vnext-r6/production-review.html"],
].filter(([name]) => activeTargets.some(([target]) => target === name))) {
  const page = await openPage(reviewRoute, 1180, 760);
  const frames = page.frames().filter((frame) => frame !== page.mainFrame());
  if (frames.length !== 2) failures.push(`${name}-review: expected two route frames, found ${frames.length}`);
  for (const [index, frame] of frames.entries()) {
    if (name === "brain") {
      await frame.locator(".stage-nav button").nth(3).click();
      await frame.waitForTimeout(1200);
      const state = await frame.evaluate(() => {
        const panel = document.querySelector('.state-panel[data-panel="3"]');
        const heading = document.querySelector(".sequence-heading h2");
        return {
          text: panel?.innerText.trim() ?? "",
          opacity: panel ? Number(getComputedStyle(panel).opacity) : 0,
          headingColour: heading ? getComputedStyle(heading).color : "missing",
          overflow: panel ? panel.scrollHeight - panel.clientHeight : 999,
        };
      });
      const headingChannels = state.headingColour.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
      if (state.text.length < 120 || state.opacity < .95 || state.overflow > 2 || Math.max(...headingChannels.slice(0, 3)) > 80) {
        failures.push(`brain-review-frame-${index}: correction state is not fully visible (${JSON.stringify(state)})`);
      }
    } else {
      await frame.locator(".decision-intro").scrollIntoViewIfNeeded();
      await frame.waitForTimeout(250);
      const state = await frame.evaluate(() => {
        const opacityThroughTree = (element) => {
          let opacity = 1;
          for (let current = element; current; current = current.parentElement) opacity *= Number(getComputedStyle(current).opacity || 1);
          return opacity;
        };
        const intro = document.querySelector(".decision-intro");
        const heading = document.querySelector(".decision h2");
        return {
          text: intro?.innerText.trim() ?? "",
          opacity: intro ? opacityThroughTree(intro) : 0,
          headingColour: heading ? getComputedStyle(heading).color : "missing",
        };
      });
      const headingChannels = state.headingColour.match(/\d+/g)?.map(Number) ?? [255, 255, 255];
      if (state.text.length < 120 || state.opacity < .95 || Math.max(...headingChannels.slice(0, 3)) > 80) {
        failures.push(`gtm-review-frame-${index}: signal state is not fully visible (${JSON.stringify(state)})`);
      }
    }
  }
  await page.screenshot({ path: `${output}/${name}-production-review-frames.png`, fullPage: true });
  if (name === "gtm") {
    for (const frame of frames) {
      await frame.locator(".proof").scrollIntoViewIfNeeded();
      await frame.waitForTimeout(250);
      const proofOpacity = await frame.locator(".proof-copy").evaluate((element) => Number(getComputedStyle(element).opacity));
      if (proofOpacity < .95) failures.push(`gtm-review: proof copy remains faded at opacity ${proofOpacity}`);
    }
    await page.screenshot({ path: `${output}/gtm-production-review-proof.png`, fullPage: true });
  }
  await page.close();
}

await browser.close();
await fs.writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ output, observations: report.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
