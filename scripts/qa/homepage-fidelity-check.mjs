#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4173");
const output = flag("output", "C:/Users/krish/.scratch/mindmake-homepage-production");
const contract = JSON.parse(await fs.readFile(new URL("../../quality/homepage/approved-vnext-r2.json", import.meta.url), "utf8"));
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "mobile-320x568", width: 320, height: 568 },
  { name: "landscape-844x390", width: 844, height: 390 },
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const observations = [];

function fail(condition, message) {
  if (condition) failures.push(message);
}

async function visualLines(locator) {
  return locator.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const words = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      for (const match of node.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        if (rect.width && rect.height) words.push({ word: match[0], top: rect.top, left: rect.left, right: rect.right });
      }
    }
    return words.reduce((lines, word) => {
      const line = lines.find((candidate) => Math.abs(candidate.top - word.top) < 2);
      if (line) line.words.push(word);
      else lines.push({ top: word.top, words: [word] });
      return lines;
    }, []).map((line) => ({
      text: line.words.map((word) => word.word).join(" "),
      words: line.words.length,
      width: Math.max(...line.words.map((word) => word.right)) - Math.min(...line.words.map((word) => word.left)),
    }));
  });
}

function checkFlow(name, label, lines, maximumLines) {
  fail(lines.length > maximumLines, `${name}: ${label} uses ${lines.length} lines, above ${maximumLines}`);
  let singleRun = 0;
  let longestSingleRun = 0;
  for (const line of lines) {
    singleRun = line.words === 1 ? singleRun + 1 : 0;
    longestSingleRun = Math.max(longestSingleRun, singleRun);
  }
  fail(longestSingleRun >= 3, `${name}: ${label} spiders through ${longestSingleRun} consecutive one-word lines`);
  if (lines.length > 1) {
    const widest = Math.max(...lines.map((line) => line.width));
    const narrowest = Math.min(...lines.map((line) => line.width));
    fail(narrowest / widest < .35, `${name}: ${label} line balance falls to ${Math.round((narrowest / widest) * 100)} percent`);
  }
}

function rgba(value) {
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return [channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0, channels[3] ?? 1];
}

function composite([red, green, blue, alpha], background) {
  return [red, green, blue].map((channel, index) => channel * alpha + background[index] * (1 - alpha));
}

function relativeLuminance([red, green, blue]) {
  const linear = [red, green, blue].map((channel) => {
    const value = channel / 255;
    return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4;
  });
  return .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
}

function contrastRatio(first, second) {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second));
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second));
  return (lighter + .05) / (darker + .05);
}

async function startStepMetrics(page) {
  return page.locator('.mm-brief-panel[data-presentation="drawer"]').evaluate((panel) => {
    const rect = (element) => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, top: bounds.top, right: bounds.right, bottom: bounds.bottom, width: bounds.width, height: bounds.height };
    };
    const visible = (element) => {
      const style = getComputedStyle(element);
      const bounds = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && bounds.width > 0 && bounds.height > 0;
    };
    const step = panel.querySelector(".mm-brief-start-step");
    const path = panel.querySelector(".mm-brief-path");
    const action = panel.querySelector(".mm-brief-action-rail .mm-button");
    const controls = [...panel.querySelectorAll("button, input, select")].filter(visible);
    return {
      panel: rect(panel),
      step: rect(step),
      action: rect(action),
      panelOverflowX: panel.scrollWidth - panel.clientWidth,
      panelOverflowY: panel.scrollHeight - panel.clientHeight,
      stepOverflowY: step.scrollHeight - step.clientHeight,
      pathOverflowX: path.scrollWidth - path.clientWidth,
      smallestControlHeight: Math.min(...controls.map((control) => rect(control).height)),
      controlsInsideViewport: controls.every((control) => {
        const bounds = rect(control);
        return bounds.left >= -1 && bounds.right <= window.innerWidth + 1
          && bounds.top >= -1 && bounds.bottom <= window.innerHeight + 1;
      }),
      header: panel.querySelector(".mm-brief-top span")?.textContent?.trim(),
      progress: [...path.querySelectorAll("button")].map((button) => button.textContent.trim()),
      backgroundInert: (() => {
        const backdrop = panel.parentElement;
        const main = backdrop?.parentElement;
        const site = backdrop?.closest(".mm-site");
        if (!main || !site) return false;
        const outsideMain = [...site.children].filter((element) => element !== main);
        const outsideDialog = [...main.children].filter((element) => element !== backdrop);
        return [...outsideMain, ...outsideDialog].every((element) => element.inert && element.getAttribute("aria-hidden") === "true");
      })(),
    };
  });
}

function checkStartStep(viewport, label, metrics) {
  const compact = viewport.width <= 340 || viewport.height <= 620;
  const reserve = viewport.width <= 560 ? (compact ? 14 : 28) : (viewport.height <= 620 ? 24 : 48);
  fail(Math.abs(metrics.panel.right - viewport.width) > 2, `${viewport.name}: ${label} drawer is not attached to the right edge`);
  if (viewport.width <= 560) fail(metrics.panel.width < viewport.width - 2, `${viewport.name}: ${label} sheet does not fill the phone`);
  else fail(metrics.panel.left <= 0 || metrics.panel.width > 702, `${viewport.name}: ${label} is not a bounded right drawer`);
  fail(metrics.panelOverflowX > 1, `${viewport.name}: ${label} drawer has horizontal overflow`);
  fail(metrics.panelOverflowY > 1, `${viewport.name}: ${label} drawer has an internal scrollbar`);
  fail(metrics.stepOverflowY > 1, `${viewport.name}: ${label} step content is clipped`);
  fail(metrics.pathOverflowX > 1, `${viewport.name}: ${label} progress row overflows`);
  fail(metrics.smallestControlHeight < 43.5, `${viewport.name}: ${label} has a control below 44px`);
  fail(!metrics.controlsInsideViewport, `${viewport.name}: ${label} has a control outside the viewport`);
  fail(viewport.height - metrics.action.bottom < reserve - 2, `${viewport.name}: ${label} action leaves less than ${reserve}px bottom clearance`);
  fail(metrics.header !== "Start here", `${viewport.name}: ${label} drawer header drifted`);
  fail(metrics.progress.join("|") !== "Company|You|Problem|Time|Brief", `${viewport.name}: ${label} progress architecture drifted`);
  fail(!metrics.backgroundInert, `${viewport.name}: background remains interactive behind ${label}`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  let companyReadRequests = 0;
  await page.route("**/functions/v1/enrich-company", async (route) => {
    const headers = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
    };
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers });
      return;
    }
    companyReadRequests += 1;
    await new Promise((resolve) => setTimeout(resolve, 650));
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      headers,
      body: JSON.stringify({
        identity: { name: "Example Company" },
        known: ["Public information found"],
        synthesis: "Example Company helps teams do useful work.",
      }),
    });
  });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);

  const metrics = await page.evaluate(() => {
    const threshold = document.querySelector(".mm-vnext-threshold").getBoundingClientRect();
    const copy = document.querySelector(".mm-vnext-threshold-copy").getBoundingClientRect();
    const title = document.querySelector("#homepage-title").getBoundingClientRect();
    const header = document.querySelector(".mm-header");
    const headerContainer = header.querySelector(".mm-container").getBoundingClientRect();
    const brand = header.querySelector(".mm-brand").getBoundingClientRect();
    const menu = header.querySelector(".mm-menu-button").getBoundingClientRect();
    const headerBackground = getComputedStyle(header).backgroundColor;
    const heroBody = document.querySelector(".mm-vnext-threshold-copy p");
    const heroFilm = document.querySelector(".mm-vnext-threshold-film");
    const heroFilmRect = heroFilm.getBoundingClientRect();
    const heroScrim = heroFilm.querySelector(".mm-plate-scrim");
    const heroScrimRect = heroScrim.getBoundingClientRect();
    const heroScrimStyle = getComputedStyle(heroScrim);
    const footer = document.querySelector(".mm-footer");
    const footerContainer = footer.querySelector(".mm-container").getBoundingClientRect();
    const footerBrand = footer.querySelector(".mm-brand").getBoundingClientRect();
    const footerNav = footer.querySelector("nav").getBoundingClientRect();
    const footerLinks = [...footer.querySelectorAll("nav a")].map((link) => {
      const rect = link.getBoundingClientRect();
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
    const doors = [...document.querySelectorAll(".mm-vnext-route-doors button")].map((button) => {
      const rect = button.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        clipped: button.scrollHeight > button.clientHeight + 1,
      };
    });
    return {
      entranceMarks: performance.getEntriesByName("mm-pending").length
        + performance.getEntriesByName("mm-arrived").length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageScreens: document.documentElement.scrollHeight / window.innerHeight,
      thresholdHeight: threshold.height,
      thresholdLeft: threshold.left,
      thresholdRight: threshold.right,
      copyBottom: copy.bottom,
      header: {
        containerLeft: headerContainer.left,
        containerRight: headerContainer.right,
        brandLeft: brand.left,
        brandWidth: brand.width,
        brandHeight: brand.height,
        menuRight: menu.right,
        menuWidth: menu.width,
        menuHeight: menu.height,
        titleLeft: title.left,
        background: headerBackground,
      },
      mobileCopy: {
        bodyColor: getComputedStyle(heroBody).color,
        scrimAlpha: Number(getComputedStyle(document.querySelector(".mm-site-home-vnext")).getPropertyValue("--mm-vnext-mobile-copy-scrim-alpha")) || 0,
        revealAlpha: Number(getComputedStyle(document.querySelector(".mm-site-home-vnext")).getPropertyValue("--mm-vnext-mobile-image-reveal-alpha")) || 0,
        scrimBackground: heroScrimStyle.backgroundImage,
        scrimWidthRatio: heroScrimRect.width / heroFilmRect.width,
        scrimHeightRatio: heroScrimRect.height / heroFilmRect.height,
        bottomRatio: copy.bottom / window.innerHeight,
      },
      footer: {
        containerLeft: footerContainer.left,
        containerRight: footerContainer.right,
        brandLeft: footerBrand.left,
        navLeft: footerNav.left,
        navRight: footerNav.right,
        links: footerLinks,
      },
      doors,
      text: document.querySelector("main").textContent.replace(/\s+/g, " ").trim(),
    };
  });

  fail(metrics.horizontalOverflow > 1, `${viewport.name}: opening has ${metrics.horizontalOverflow}px horizontal overflow`);
  fail(metrics.entranceMarks > 0, `${viewport.name}: opening was delayed behind the long-form route entrance`);
  fail(Math.abs(metrics.thresholdHeight - viewport.height) > 3, `${viewport.name}: opening is ${Math.round(metrics.thresholdHeight)}px in a ${viewport.height}px viewport`);
  fail(metrics.pageScreens > contract.opening.maximumPageScreens, `${viewport.name}: homepage is ${metrics.pageScreens.toFixed(2)} screens before a route is chosen`);
  fail(metrics.doors.some((door) => door.width < 44 || door.height < 44), `${viewport.name}: a route control is below 44px`);
  fail(metrics.doors.some((door) => door.bottom > viewport.height + 2), `${viewport.name}: a route control falls below the first viewport`);
  fail(metrics.doors.some((door) => door.clipped), `${viewport.name}: route-control copy is clipped`);
  fail(metrics.header.brandWidth < 44 || metrics.header.brandHeight < 44, `${viewport.name}: brand home target is below 44px`);
  fail(metrics.header.menuWidth < 44 || metrics.header.menuHeight < 44, `${viewport.name}: menu target is below 44px`);
  for (const prohibited of contract.prohibitedRegressions.slice(0, 2)) {
    fail(metrics.text.includes(prohibited), `${viewport.name}: prohibited copy returned: ${prohibited}`);
  }
  if (viewport.width <= 560) {
    const mobileHeaderAlpha = Number(metrics.header.background.match(/[\d.]+(?=\))/)?.[0] ?? 0);
    const worstImage = [255, 255, 255];
    const worstScrimmedBackground = composite([5, 16, 13, metrics.mobileCopy.scrimAlpha], worstImage);
    const bodyColor = rgba(metrics.mobileCopy.bodyColor);
    const renderedBodyColor = composite(bodyColor, worstScrimmedBackground);
    const bodyContrast = contrastRatio(renderedBodyColor, worstScrimmedBackground);
    fail(Math.abs(metrics.header.brandLeft - metrics.header.titleLeft) > 1, `${viewport.name}: brand does not align with the hero copy`);
    fail(mobileHeaderAlpha < .85, `${viewport.name}: opening header underlay is too transparent for reliable logo contrast`);
    fail(metrics.mobileCopy.scrimAlpha < .88, `${viewport.name}: mobile copy scrim has no contrast-safe opacity floor`);
    fail(metrics.mobileCopy.scrimBackground === "none", `${viewport.name}: the real mobile film scrim has no rendered gradient`);
    fail(!metrics.mobileCopy.scrimBackground.includes(`${metrics.mobileCopy.scrimAlpha})`), `${viewport.name}: the rendered mobile scrim does not use the declared opacity floor`);
    fail(metrics.mobileCopy.revealAlpha > .2, `${viewport.name}: the mobile scrim does not open far enough to reveal the film`);
    fail(!metrics.mobileCopy.scrimBackground.includes(`${metrics.mobileCopy.revealAlpha})`), `${viewport.name}: the rendered mobile scrim does not use the declared image reveal`);
    fail(metrics.mobileCopy.scrimWidthRatio < .99 || metrics.mobileCopy.scrimHeightRatio < .99, `${viewport.name}: the real mobile film scrim does not cover the full moving image`);
    fail(metrics.mobileCopy.bottomRatio > .58, `${viewport.name}: hero copy leaves the contrast-safe scrim zone`);
    fail(bodyContrast < 4.5, `${viewport.name}: hero body worst-case contrast is ${bodyContrast.toFixed(2)}:1`);
    fail(Math.abs(metrics.footer.containerLeft - metrics.header.titleLeft) > 1, `${viewport.name}: footer does not share the mobile content edge`);
    fail(Math.abs(metrics.footer.containerRight - metrics.header.menuRight) > 1, `${viewport.name}: footer does not share the mobile content edge`);
    fail(Math.abs(metrics.footer.navLeft - metrics.footer.containerLeft) > 1 || Math.abs(metrics.footer.navRight - metrics.footer.containerRight) > 1, `${viewport.name}: footer navigation does not occupy the content shell`);
    fail(metrics.footer.links.some((link, index, links) => index > 0 && link.top !== links[0].top), `${viewport.name}: footer links do not share one aligned row`);
    fail(metrics.copyBottom > metrics.doors[0].top - 8, `${viewport.name}: hero copy overlaps the route controls`);
    fail(metrics.doors[1].top <= metrics.doors[0].bottom, `${viewport.name}: mobile route controls are not stacked`);
  } else {
    fail(Math.abs(metrics.header.brandLeft - metrics.thresholdLeft) > 1, `${viewport.name}: brand does not align with the homepage grid`);
    fail(Math.abs(metrics.header.menuRight - metrics.thresholdRight) > 1, `${viewport.name}: menu does not align with the homepage grid`);
    fail(Math.abs(metrics.footer.containerLeft - metrics.thresholdLeft) > 1, `${viewport.name}: footer does not align with the homepage grid`);
    fail(Math.abs(metrics.footer.containerRight - metrics.thresholdRight) > 1, `${viewport.name}: footer does not align with the homepage grid`);
    fail(Math.abs(metrics.footer.brandLeft - metrics.footer.containerLeft) > 1, `${viewport.name}: footer brand does not occupy the shell start`);
    fail(Math.abs(metrics.footer.navRight - metrics.footer.containerRight) > 1, `${viewport.name}: footer navigation does not occupy the shell end`);
    if (viewport.height > 520) {
      fail(Math.abs(metrics.doors[0].top - metrics.doors[1].top) > 2, `${viewport.name}: desktop route controls are not paired`);
    }
  }

  const openingLines = await visualLines(page.locator("#homepage-title"));
  checkFlow(viewport.name, "opening title", openingLines, contract.opening.maximumTitleLines);
  observations.push({ viewport: viewport.name, opening: metrics, openingLines });
  await page.screenshot({ path: `${output}/${viewport.name}-opening.png`, fullPage: true });

  const menuButton = page.locator(".mm-menu-button");
  await menuButton.click();
  const menuPanel = page.locator("#mindmake-menu.is-open");
  await menuPanel.waitFor();
  await page.waitForFunction(() => {
    const panel = document.querySelector("#mindmake-menu");
    return panel?.contains(document.activeElement);
  });
  await page.waitForTimeout(180);
  const menuState = await page.evaluate(() => {
    const panel = document.querySelector("#mindmake-menu");
    const panelRect = panel.getBoundingClientRect();
    const controls = [...panel.querySelectorAll("a[href], button:not([disabled])")];
    const focused = document.activeElement;
    return {
      bounds: {
        left: panelRect.left,
        top: panelRect.top,
        right: panelRect.right,
        bottom: panelRect.bottom,
      },
      horizontalOverflow: panel.scrollWidth - panel.clientWidth,
      allControlsVisible: controls.every((control) => {
        const rect = control.getBoundingClientRect();
        return rect.left >= -1 && rect.right <= window.innerWidth + 1
          && rect.top >= -1 && rect.bottom <= window.innerHeight + 1;
      }),
      focusEnteredMenu: controls.includes(focused),
      mainInert: document.querySelector("main").inert,
      footerInert: document.querySelector(".mm-footer").inert,
    };
  });
  fail(Math.abs(menuState.bounds.left) > 1 || Math.abs(menuState.bounds.top) > 1
    || Math.abs(menuState.bounds.right - viewport.width) > 1
    || Math.abs(menuState.bounds.bottom - viewport.height) > 1,
  `${viewport.name}: open navigation does not fill the viewport`);
  fail(menuState.horizontalOverflow > 1, `${viewport.name}: open navigation has horizontal overflow`);
  fail(!menuState.allControlsVisible, `${viewport.name}: a navigation control is outside the viewport`);
  fail(!menuState.focusEnteredMenu, `${viewport.name}: focus did not enter the open navigation`);
  fail(!menuState.mainInert || !menuState.footerInert, `${viewport.name}: background content remains interactive behind navigation`);
  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-menu.png`, fullPage: false });
  }
  await page.keyboard.press("Escape");
  await menuPanel.waitFor({ state: "hidden" });
  await page.waitForTimeout(30);
  fail(!(await menuButton.evaluate((element) => element === document.activeElement)), `${viewport.name}: closing navigation did not restore focus`);

  await page.locator(".mm-vnext-route-doors button").first().click();
  await page.locator('[data-homepage-view="brain"]').waitFor();
  await page.waitForTimeout(100);
  const routeShell = await page.evaluate(() => {
    const rect = (selector) => {
      const bounds = document.querySelector(selector).getBoundingClientRect();
      return { left: bounds.left, right: bounds.right };
    };
    return {
      header: rect(".mm-header .mm-container"),
      topline: rect(".mm-vnext-route-topline"),
      chamber: rect(".mm-vnext-route-chamber"),
      footer: rect(".mm-footer .mm-container"),
    };
  });
  for (const [surface, bounds] of Object.entries(routeShell)) {
    fail(Math.abs(bounds.left - routeShell.header.left) > 1 || Math.abs(bounds.right - routeShell.header.right) > 1, `${viewport.name}: ${surface} leaves the shared homepage shell on the Brain route`);
  }
  fail(!page.url().endsWith("#brain"), `${viewport.name}: Brain route is not in browser history`);
  fail(await page.locator('[data-homepage-view="threshold"]').count() !== 0, `${viewport.name}: route did not replace the opening`);
  if (viewport.width <= 560) {
    const routeHeaderBackground = await page.locator(".mm-header").evaluate((element) => getComputedStyle(element).backgroundColor);
    fail(routeHeaderBackground === "rgba(0, 0, 0, 0)", `${viewport.name}: route header loses contrast on the paper state`);
  }
  const brainLines = await visualLines(page.locator("#homepage-route-title"));
  checkFlow(viewport.name, "Brain title", brainLines, contract.routes.brain.maximumTitleLines);
  fail((await page.locator("#homepage-route-title").innerText()).replace(/\s+/g, " ") !== contract.routes.brain.title, `${viewport.name}: Brain title drifted`);
  const startBox = await page.locator(".mm-vnext-primary").boundingBox();
  fail(!startBox || startBox.y + startBox.height > viewport.height + 3, `${viewport.name}: Start here is below the first route viewport`);
  await page.screenshot({ path: `${output}/${viewport.name}-brain.png`, fullPage: true });

  await page.locator(".mm-vnext-primary").click();
  const panel = page.locator('.mm-brief-panel[data-presentation="drawer"]');
  await panel.waitFor();
  await page.waitForTimeout(300);
  const companyMetrics = await startStepMetrics(page);
  checkStartStep(viewport, "company step", companyMetrics);
  const companyLines = await visualLines(page.locator("#mm-brief-title"));
  checkFlow(viewport.name, "company question", companyLines, 4);
  await page.screenshot({ path: `${output}/${viewport.name}-drawer-company.png`, fullPage: false });
  await page.locator('button:has-text("Read the business")').click();
  fail(!(await page.locator("#mm-company-email-error").isVisible()), `${viewport.name}: empty work email has no visible validation`);
  await page.locator("#mm-company-email").fill("founder@example.com");
  await page.locator('button:has-text("Read the business")').click();
  await page.getByRole("heading", { name: "Who is this for?" }).waitFor();
  await page.waitForTimeout(500);
  fail(companyReadRequests !== 1, `${viewport.name}: company read did not start before personal details`);
  const profileMetrics = await startStepMetrics(page);
  checkStartStep(viewport, "profile step", profileMetrics);
  const profileLines = await visualLines(page.locator("#mm-brief-title"));
  checkFlow(viewport.name, "profile question", profileLines, 3);
  observations.at(-1).startFlow = { company: companyMetrics, companyLines, profile: profileMetrics, profileLines, companyReadRequests };
  await page.screenshot({ path: `${output}/${viewport.name}-drawer-profile.png`, fullPage: false });
  await page.keyboard.press("Escape");
  await panel.waitFor({ state: "detached" });
  fail(!(await page.locator(".mm-vnext-primary").evaluate((element) => element === document.activeElement)), `${viewport.name}: closing the drawer did not restore focus`);

  await page.locator(".mm-vnext-route-topline button").click();
  await page.locator('[data-homepage-view="threshold"]').waitFor();
  await page.locator(".mm-vnext-route-doors button").nth(1).click();
  await page.locator('[data-homepage-view="gtm"]').waitFor();
  const gtmLines = await visualLines(page.locator("#homepage-route-title"));
  checkFlow(viewport.name, "GTM title", gtmLines, contract.routes.gtm.maximumTitleLines);
  fail((await page.locator("#homepage-route-title").innerText()).replace(/\s+/g, " ") !== contract.routes.gtm.title, `${viewport.name}: GTM title drifted`);
  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-gtm.png`, fullPage: true });
  }
  await page.goBack();
  await page.locator('[data-homepage-view="threshold"]').waitFor();
  await page.close();
}

const enlarged = await browser.newPage({ viewport: { width: 320, height: 568 } });
await enlarged.goto(base, { waitUntil: "networkidle" });
await enlarged.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
await enlarged.waitForTimeout(100);
const enlargedState = await enlarged.evaluate(() => {
  const copy = document.querySelector(".mm-vnext-threshold-copy").getBoundingClientRect();
  const proof = document.querySelector(".mm-vnext-shared-proof").getBoundingClientRect();
  const doors = [...document.querySelectorAll(".mm-vnext-route-doors button")].map((button) => {
    const rect = button.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, clipped: button.scrollHeight > button.clientHeight + 1 };
  });
  return {
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    copyDoorGap: doors[0].top - copy.bottom,
    doorsMeetProof: doors.some((door) => door.bottom > proof.top),
    clipped: doors.some((door) => door.clipped),
  };
});
fail(enlargedState.overflow > 1, "200 percent text: opening has horizontal overflow");
fail(enlargedState.copyDoorGap < 8, "200 percent text: hero copy overlaps the route controls");
fail(enlargedState.doorsMeetProof, "200 percent text: route controls overlap the proof line");
fail(enlargedState.clipped, "200 percent text: route-control copy is clipped");
await enlarged.screenshot({ path: `${output}/mobile-320x568-text-200.png`, fullPage: true });
await enlarged.close();

await browser.close();
console.log(JSON.stringify({ artifact: contract.artifact, failures, observations, screenshotDirectory: output }, null, 2));
if (failures.length) process.exitCode = 1;
