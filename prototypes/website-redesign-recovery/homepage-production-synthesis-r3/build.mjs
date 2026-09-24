import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as parse5 from "parse5";
import postcss from "postcss";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../../..");
const componentRoot = path.resolve(directory, "../component-selection");
const checkOnly = process.argv.includes("--check");

const decisions = JSON.parse(await readFile(path.resolve(root, "quality/website-redesign/homepage-handoff.v1.json"), "utf8")).decisions;

const sources = {
  opening: { directory: "homepage-opening-configurator", html: "index.html", css: ["styles.css"] },
  history: { directory: "homepage-history-configurator", html: "index-r3.html", css: ["styles-r3.css"] },
  authority: { directory: "homepage-authority-configurator", html: "index.html", css: ["../homepage-history-configurator/styles-r3.css", "styles.css"] },
  dividend: { directory: "homepage-leadership-dividend-configurator", html: "index.html", css: ["../homepage-history-configurator/styles-r3.css", "styles.css"] },
  route: { directory: "homepage-route-configurator", html: "index.html", css: ["styles.css"] },
  footer: { directory: "footer-configurator", html: "index.html", css: ["styles.css"] },
  navigation: { directory: "navigation-overlay-configurator", html: "index.html", css: ["styles.css"] },
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const attrs = (node) => Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
const hasClass = (node, className) => (attrs(node).class || "").split(/\s+/).includes(className);
const hasAttr = (node, name, value) => (node.attrs || []).some((item) => item.name === name && (value === undefined || item.value === value));

function descendants(node, predicate, result = []) {
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes || []) descendants(child, predicate, result);
  return result;
}

const first = (node, predicate) => descendants(node, predicate)[0];
const byClass = (node, className) => first(node, (candidate) => hasClass(candidate, className));
const allByClass = (node, className) => descendants(node, (candidate) => hasClass(candidate, className));
const allByAttr = (node, name, value) => descendants(node, (candidate) => hasAttr(candidate, name, value));
const innerByAttr = (node, name, value) => allByAttr(node, name, value).filter((candidate) => candidate !== node);
const byTag = (node, tagName) => first(node, (candidate) => candidate.tagName === tagName);

function setAttr(node, name, value) {
  node.attrs ||= [];
  const existing = node.attrs.find((item) => item.name === name);
  if (existing) existing.value = String(value);
  else node.attrs.push({ name, value: String(value) });
}

function removeAttr(node, name) {
  node.attrs = (node.attrs || []).filter((item) => item.name !== name);
}

function setText(node, value) {
  node.childNodes = [{ nodeName: "#text", value: String(value), parentNode: node }];
}

function setHtml(node, html) {
  const fragment = parse5.parseFragment(node, html);
  node.childNodes = fragment.childNodes;
  for (const child of node.childNodes) child.parentNode = node;
}

function removeNode(node) {
  const parent = node?.parentNode;
  if (!parent) return;
  parent.childNodes = parent.childNodes.filter((child) => child !== node);
}

function changeTag(node, tagName) {
  node.nodeName = tagName;
  node.tagName = tagName;
}

function rewriteAssetPaths(source) {
  return source
    .replaceAll("../../../../src/", "../../../src/")
    .replaceAll("../../../../node_modules/", "../../../node_modules/")
    .replaceAll("../../new-age-leadership/", "../new-age-leadership/")
    .replaceAll("../../case-study-browsing/", "../case-study-browsing/");
}

async function loadDocument(key) {
  const source = sources[key];
  const htmlPath = path.resolve(componentRoot, source.directory, source.html);
  return parse5.parse(rewriteAssetPaths(await readFile(htmlPath, "utf8")));
}

function variant(className, content) {
  return `<div class="r3-variant ${className}">${parse5.serializeOuter(content)}</div>`;
}

function applyData(node, values) {
  for (const [key, value] of Object.entries(values)) setAttr(node, `data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`, value);
}

function makeControl(node, label) {
  changeTag(node, "button");
  setAttr(node, "type", "button");
  setAttr(node, "aria-label", label);
  removeAttr(node, "tabindex");
}

async function buildOpening() {
  const doc = await loadDocument("opening");
  const frames = allByClass(doc, "site-frame");
  frames.forEach((frame, index) => {
    const selection = decisions.opening.selection;
    applyData(frame, index === 0 ? {
      compositionDesktop: selection.compositionDesktop,
      titleDesktop: selection.titleDesktop,
      measureDesktop: selection.measureDesktop,
      positionDesktop: selection.positionDesktop,
      cropDesktop: selection.cropDesktop,
      contrast: selection.contrast,
      lede: selection.lede,
      doors: selection.doors,
      proof: selection.proof,
      reveal: selection.reveal,
    } : {
      compositionMobile: selection.compositionMobile,
      titleMobile: selection.titleMobile,
      measureMobile: selection.measureMobile,
      positionMobile: selection.positionMobile,
      cropMobile: selection.cropMobile,
      contrast: selection.contrast,
      lede: selection.lede,
      doors: selection.doors,
      proof: selection.proof,
      reveal: selection.reveal,
    });
    const heading = byClass(frame, "hero-copy")?.childNodes?.find((node) => node.tagName === "h2");
    changeTag(heading, "h1");
    setText(heading, decisions.message.selection.openingHeadline);
    setText(byClass(frame, "hero-lede"), decisions.message.selection.openingLede);
    setText(byClass(frame, "shared-proof"), decisions.message.selection.openingProof);
    allByClass(frame, "menu-control").forEach((control) => makeControl(control, "Open navigation"));
    const brand = byClass(frame, "brand");
    setAttr(brand, "href", "/");
    removeAttr(brand, "tabindex");
    const doors = descendants(frame, (node) => node.tagName === "button" && node.parentNode && hasClass(node.parentNode, "route-doors"));
    doors.forEach((door, doorIndex) => {
      const route = doorIndex === 0 ? "brain" : "gtm";
      setAttr(door, "data-route-choice", route);
      removeAttr(door, "tabindex");
      setText(byTag(door, "span"), "Build your");
      setText(byTag(door, "strong"), route === "brain" ? "AI brain" : "AI GTM");
      setText(byTag(door, "small"), route === "brain" ? decisions.message.selection.brainDoorDetail : decisions.message.selection.gtmDoorDetail);
    });
    const source = byTag(byTag(frame, "video"), "source");
    setAttr(source, "media", index === 0 ? "(min-width: 701px)" : "(max-width: 700px)");
  });
  return `${variant("preview-desktop", frames[0])}${variant("preview-mobile", frames[1])}`;
}

const historyStories = [
  { era: "370 BC · Writing", image: "../new-age-leadership/media/history-writing-s2.webp", alt: "An illustrative historical writing scene", question: "questionWriting", outcome: "outcomeWriting" },
  { era: "1675 · Engine loom", image: "../new-age-leadership/media/history-loom-s2.webp", alt: "An illustrative mechanised loom scene", question: "questionLoom", outcome: "outcomeLoom" },
  { era: "1970s · Calculator", image: "../new-age-leadership/media/history-calculator-s2.webp", alt: "An illustrative classroom calculator scene", question: "questionCalculator", outcome: "outcomeCalculator" },
  { era: "2000s · Satnav", image: "../new-age-leadership/media/history-satnav-s2.webp", alt: "An illustrative early satellite navigation scene", question: "questionSatnav", outcome: "outcomeSatnav" },
];

function populateHistory(frame, storyIndex = 0) {
  applyData(frame, decisions.history.selection);
  for (const node of allByAttr(frame, "data-copy")) setText(node, decisions.history.copy[attrs(node)["data-copy"]] || "");
  for (const node of allByAttr(frame, "data-optional-copy")) setText(node, decisions.history.copy[attrs(node)["data-optional-copy"]] || "");
  const story = historyStories[storyIndex];
  allByAttr(frame, "data-story-question").forEach((node) => setText(node, decisions.history.copy[story.question]));
  allByAttr(frame, "data-story-outcome").forEach((node) => setText(node, decisions.history.copy[story.outcome]));
  allByAttr(frame, "data-story-question").forEach((node) => setAttr(node, "aria-live", "polite"));
  allByAttr(frame, "data-story-outcome").forEach((node) => setAttr(node, "aria-live", "polite"));
  allByAttr(frame, "data-story-era").forEach((node) => setText(node, story.era));
  allByAttr(frame, "data-story-count").forEach((node) => setText(node, `0${storyIndex + 1}`));
  allByAttr(frame, "data-story-image").forEach((node) => { setAttr(node, "src", story.image); setAttr(node, "alt", story.alt); });
  allByAttr(frame, "data-era").forEach((button) => {
    const active = Number(attrs(button)["data-era"]) === storyIndex;
    if (active) setAttr(button, "aria-current", "true");
    else removeAttr(button, "aria-current");
  });
}

async function buildHistory() {
  const doc = await loadDocument("history");
  const devices = allByClass(doc, "device-frame");
  devices.forEach((device) => populateHistory(byClass(device, "history-frame")));
  return `${variant("device-desktop", devices[0])}${variant("device-mobile", devices[1])}`;
}

const authorityLists = {
  ai: ["Gather", "Connect", "Compare", "Monitor", "Model", "Reconcile", "Prepare", "Retrieve", "Route", "Update"],
  human: ["Intent", "Taste", "Judgement", "Method", "Relationships", "Context", "Accountability", "Exceptions", "Ethics", "Decision"],
};
const authorityDetails = { leader: "Direction · judgement", chief: "Trust · context", brain: "Memory · links", signals: "Watches change", marketing: "Person leads", research: "People listen", sales: "People build trust", brief: "One view" };

function populateAuthority(frame, frameIndex) {
  applyData(frame, decisions.authority.selection);
  setAttr(frame, "data-phase-view", decisions.authority.selection.defaultPhase);
  for (const node of allByAttr(frame, "data-copy")) setText(node, decisions.authority.copy[attrs(node)["data-copy"]] || "");
  for (const node of allByAttr(frame, "data-optional-copy")) setText(node, decisions.authority.copy[attrs(node)["data-optional-copy"]] || "");
  innerByAttr(frame, "data-ai-list").forEach((node) => setHtml(node, authorityLists.ai.map((item) => `<span>${item}</span>`).join("")));
  innerByAttr(frame, "data-human-list").forEach((node) => setHtml(node, authorityLists.human.map((item) => `<span>${item}</span>`).join("")));
  allByAttr(frame, "data-detail").forEach((node) => setText(node, authorityDetails[attrs(node)["data-detail"]]));
  allByAttr(frame, "data-stage-panel").forEach((panel) => {
    const phase = attrs(panel)["data-stage-panel"];
    setAttr(panel, "id", `authority-${frameIndex === 0 ? "desktop" : "mobile"}-${phase}`);
    setAttr(panel, "aria-hidden", String(phase !== decisions.authority.selection.defaultPhase));
  });
  allByAttr(frame, "data-stage").forEach((button) => {
    const phase = attrs(button)["data-stage"];
    setAttr(button, "aria-controls", `authority-${frameIndex === 0 ? "desktop" : "mobile"}-${phase}`);
    setAttr(button, "aria-pressed", String(phase === decisions.authority.selection.defaultPhase));
  });
}

async function buildAuthority() {
  const doc = await loadDocument("authority");
  const devices = allByClass(doc, "device-frame");
  devices.forEach((device, index) => populateAuthority(byClass(device, "authority-frame"), index));
  return `${variant("device-desktop", devices[0])}${variant("device-mobile", devices[1])}`;
}

const practiceScenes = [
  { key: "notice", title: "It notices what changed.", copy: "Signals arrive before someone asks for a report.", image: "../case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp" },
  { key: "connect", title: "It joins the evidence.", copy: "New information meets what the business already knows.", image: "../case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp" },
  { key: "prepare", title: "It prepares the next move.", copy: "Useful work reaches you ready for a decision.", image: "../case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp" },
];
const benefits = [
  ["Leadership updates become consistent, even when the week was not.", "Your decisions, risks and priorities stay connected from one update to the next."],
  ["Work nobody owns becomes visible before it becomes a problem.", "The Brain joins the gaps across reports, meetings and decisions."],
  ["A change in market pricing becomes a decision, not a forgotten observation.", "It connects the signal to what your commercial team already knows."],
  ["A CEO who hates writing can still publish ideas worth following.", "The blank page goes. Their judgement and voice stay."],
  ["A CRO who hates the numbers can become better at using them.", "The Brain prepares what changed, why it matters and where to look next."],
  ["Founder-led content can begin with the work, not another content calendar.", "Useful thinking already inside the business becomes something people can see."],
];
const returnItems = ["Ask the harder question.", "Spend more time with people.", "Make the consequential call earlier."];

function populateDividend(frame) {
  applyData(frame, decisions.leadershipDividend.selection);
  setAttr(frame, "data-mode-view", decisions.leadershipDividend.selection.defaultMode);
  for (const node of allByAttr(frame, "data-copy")) setText(node, decisions.leadershipDividend.copy[attrs(node)["data-copy"]] || "");
  for (const node of allByAttr(frame, "data-optional-copy")) setText(node, decisions.leadershipDividend.copy[attrs(node)["data-optional-copy"]] || "");
  const practice = practiceScenes[0];
  allByAttr(frame, "data-practice-image").forEach((node) => setAttr(node, "src", practice.image));
  allByAttr(frame, "data-practice-count").forEach((node) => setText(node, "01 / 03"));
  allByAttr(frame, "data-practice-title").forEach((node) => setText(node, practice.title));
  allByAttr(frame, "data-practice-copy").forEach((node) => setText(node, practice.copy));
  allByAttr(frame, "data-benefit-title").forEach((node) => setText(node, benefits[0][0]));
  allByAttr(frame, "data-benefit-title").forEach((node) => setAttr(node, "aria-live", "polite"));
  innerByAttr(frame, "data-benefit-copy").forEach((node) => setText(node, benefits[0][1]));
  innerByAttr(frame, "data-benefit-count").forEach((node) => setText(node, "01 / 06"));
  innerByAttr(frame, "data-return-list").forEach((node) => setHtml(node, returnItems.map((item) => `<li>${item}</li>`).join("")));
  allByAttr(frame, "data-practice").forEach((button, index) => {
    setText(button, practiceScenes[index].key[0].toUpperCase() + practiceScenes[index].key.slice(1));
    if (index === 0) setAttr(button, "aria-current", "true");
  });
}

async function buildDividend() {
  const doc = await loadDocument("dividend");
  const devices = allByClass(doc, "device-frame");
  devices.forEach((device) => populateDividend(byClass(device, "dividend-frame")));
  return `${variant("device-desktop", devices[0])}${variant("device-mobile", devices[1])}`;
}

const routeContent = {
  brain: {
    title: decisions.message.selection.brainHeadline,
    lede: decisions.message.selection.brainLede,
    caption: decisions.message.selection.brainCaption,
    source: "Anonymous client outcome · Research and content",
    steps: ["The founder's standards", "A system they own", "Used on real work"],
    result: "Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.",
    film: "../../../src/assets/films/film-02-loop.mp4",
  },
  gtm: {
    title: decisions.message.selection.gtmHeadline,
    lede: decisions.message.selection.gtmLede,
    caption: decisions.message.selection.gtmCaption,
    source: "Anonymous client outcome · Media advisory",
    steps: ["Expertise people value", "A clear offer", "A defined plan launched"],
    result: "A respected advisory firm turned its expertise into a clear offer clients could buy.",
    film: "../../../src/assets/films/film-04-loop.mp4",
  },
};

function populateRoute(frame, mobile) {
  applyData(frame, mobile ? {
    compositionMobile: decisions.routeOutcome.selection.compositionMobile,
    titleMobile: decisions.routeOutcome.selection.titleMobile,
    measureMobile: decisions.routeOutcome.selection.measureMobile,
    action: decisions.routeOutcome.selection.action,
    back: decisions.routeOutcome.selection.back,
    caption: decisions.routeOutcome.selection.caption,
    receipt: decisions.routeOutcome.selection.receipt,
    steps: decisions.routeOutcome.selection.steps,
    reveal: decisions.routeOutcome.selection.reveal,
  } : {
    compositionDesktop: decisions.routeOutcome.selection.compositionDesktop,
    titleDesktop: decisions.routeOutcome.selection.titleDesktop,
    measureDesktop: decisions.routeOutcome.selection.measureDesktop,
    action: decisions.routeOutcome.selection.action,
    back: decisions.routeOutcome.selection.back,
    caption: decisions.routeOutcome.selection.caption,
    receipt: decisions.routeOutcome.selection.receipt,
    steps: decisions.routeOutcome.selection.steps,
    reveal: decisions.routeOutcome.selection.reveal,
  });
  removeNode(byClass(frame, "site-masthead"));
  const copy = routeContent.brain;
  setText(byClass(frame, "route-copy").childNodes.find((node) => node.tagName === "h2"), copy.title);
  setText(byClass(frame, "lede"), copy.lede);
  setText(byTag(byClass(frame, "route-stage"), "figcaption"), copy.caption);
  const back = byClass(frame, "back");
  setText(byTag(back, "span"), decisions.message.selection.backLabel);
  removeAttr(back, "tabindex");
  setAttr(back, "data-route-toggle", "true");
  const primary = byClass(frame, "primary");
  removeAttr(primary, "tabindex");
  setAttr(primary, "data-start-route", "brain");
  const receipt = byClass(frame, "receipt");
  setText(receipt.childNodes.find((node) => node.tagName === "header")?.childNodes.find((node) => node.tagName === "h3"), decisions.message.selection.receiptHeading);
  setText(receipt.childNodes.find((node) => node.tagName === "header")?.childNodes.find((node) => node.tagName === "p"), copy.source);
  allByClass(receipt, "unused");
  descendants(receipt, (node) => node.tagName === "li").forEach((node, index) => setText(node, copy.steps[index]));
  setText(byTag(receipt, "blockquote"), copy.result);
  const source = byTag(byTag(byClass(frame, "route-stage"), "video"), "source");
  const video = byTag(byClass(frame, "route-stage"), "video");
  removeAttr(video, "autoplay");
  setAttr(video, "preload", "none");
  setAttr(video, "poster", "../../../src/assets/films/film-02-poster.webp");
  setAttr(source, "src", copy.film);
  setAttr(source, "media", mobile ? "(max-width: 700px)" : "(min-width: 701px)");
  setAttr(byClass(frame, "route-copy"), "aria-live", "polite");
}

async function buildRoute() {
  const doc = await loadDocument("route");
  const frames = allByClass(doc, "site-frame");
  populateRoute(frames[0], false);
  populateRoute(frames[1], true);
  return `${variant("preview-desktop", frames[0])}${variant("preview-mobile", frames[1])}`;
}

const routes = [
  ["Build your AI brain", "/ai-brain"],
  ["Build your AI GTM", "/ai-gtm"],
  ["Results", "/case-studies"],
  ["Thinking", "/blog"],
  ["Questions leaders ask", "/answers"],
  ["Before you start", "/faq"],
  ["Media", "https://mindmakerlive.substack.com"],
];

function setLinks(nav, linkData) {
  setHtml(nav, linkData.map(([label, href]) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noreferrer"' : ""}>${label}</a>`).join(""));
}

async function buildFooter() {
  const doc = await loadDocument("footer");
  const footers = allByClass(doc, "site-footer");
  footers.forEach((footer, index) => {
    const selection = decisions.footer.selection;
    applyData(footer, index === 0 ? {
      structureDesktop: selection.structureDesktop,
      densityDesktop: selection.densityDesktop,
      brand: selection.brand,
      statement: selection.statement,
      routes: selection.routes,
      legal: selection.legal,
      copyright: selection.copyright,
      ground: selection.ground,
      rule: selection.rule,
      reveal: selection.reveal,
    } : {
      structureMobile: selection.structureMobile,
      densityMobile: selection.densityMobile,
      brand: selection.brand,
      statement: selection.statement,
      routes: selection.routes,
      legal: selection.legal,
      copyright: selection.copyright,
      ground: selection.ground,
      rule: selection.rule,
      reveal: selection.reveal,
    });
    setText(byClass(footer, "footer-statement"), decisions.sharedLanguage.selection.positioning);
    const brand = byClass(footer, "brand");
    setAttr(brand, "href", "/");
    removeAttr(brand, "tabindex");
    setLinks(byClass(footer, "footer-routes"), [...routes, [decisions.sharedLanguage.selection.start, "/start"]]);
    setLinks(byClass(footer, "legal"), [["Privacy", "/privacy"], ["Terms", "/terms"]]);
    setText(byTag(footer, "small"), "© 2026 Mindmake.");
  });
  return `${variant("preview-desktop", footers[0])}${variant("preview-mobile", footers[1])}`;
}

async function buildNavigation() {
  const doc = await loadDocument("navigation");
  const frames = allByClass(doc, "site-frame");
  frames.forEach((frame, index) => {
    const selection = decisions.navigation.selection;
    applyData(frame, index === 0 ? {
      structureDesktop: selection.structureDesktop,
      scaleDesktop: selection.scaleDesktop,
      densityDesktop: selection.densityDesktop,
      order: selection.order,
      secondary: selection.secondary,
      active: selection.active,
      action: selection.action,
      ground: selection.ground,
      entrance: selection.entrance,
    } : {
      structureMobile: selection.structureMobile,
      scaleMobile: selection.scaleMobile,
      densityMobile: selection.densityMobile,
      order: selection.order,
      secondary: selection.secondary,
      active: selection.active,
      action: selection.action,
      ground: selection.ground,
      entrance: selection.entrance,
    });
    const control = byClass(frame, "menu-control");
    makeControl(control, "Close navigation");
    setText(byTag(control, "b"), "Close");
    setLinks(byClass(frame, "primary-routes"), routes);
    const brand = byClass(frame, "brand");
    setAttr(brand, "href", "/");
    setAttr(brand, "tabindex", "-1");
    setLinks(byClass(frame, "secondary-routes"), [["Privacy", "/privacy"], ["Terms", "/terms"]]);
    if (selection.ground === "solid") removeNode(byTag(frame, "video"));
    const start = byClass(frame, "start-action");
    changeTag(start, "a");
    setAttr(start, "href", "/start");
    removeAttr(start, "tabindex");
    setHtml(start, `${decisions.sharedLanguage.selection.start} <span aria-hidden="true">→</span>`);
  });
  return `${variant("preview-desktop", frames[0])}${variant("preview-mobile", frames[1])}`;
}

function scopeCss(source, scope, key) {
  const rootNode = postcss.parse(rewriteAssetPaths(source.replace(/^\s*@import[^\r\n]*[\r\n]?/gm, "")));
  const keyframes = new Map();
  rootNode.walkAtRules((rule) => {
    if (!rule.name.endsWith("keyframes")) return;
    const renamed = `r3-${key}-${rule.params}`;
    keyframes.set(rule.params, renamed);
    rule.params = renamed;
  });
  rootNode.walkDecls((declaration) => {
    if (!/^animation(?:-name)?$/.test(declaration.prop)) return;
    for (const [from, to] of keyframes) declaration.value = declaration.value.replace(new RegExp(`\\b${from}\\b`, "g"), to);
  });
  rootNode.walkRules((rule) => {
    if (rule.parent?.type === "atrule" && rule.parent.name.endsWith("keyframes")) return;
    rule.selectors = rule.selectors.map((selector) => {
      const trimmed = selector.trim();
      if (trimmed === ":root" || trimmed === "html" || trimmed === "body") return scope;
      if (trimmed.startsWith(":root")) return `${scope}${trimmed.slice(5)}`;
      if (trimmed.startsWith("html")) return `${scope}${trimmed.slice(4)}`;
      if (trimmed.startsWith("body")) return `${scope}${trimmed.slice(4)}`;
      return `${scope} ${trimmed}`;
    });
  });
  return rootNode.toString();
}

async function buildComponentCss() {
  const parts = [];
  for (const [key, source] of Object.entries(sources)) {
    const cssParts = [];
    for (const relative of source.css) cssParts.push(await readFile(path.resolve(componentRoot, source.directory, relative), "utf8"));
    parts.push(`/* ${key}: compiled from the accepted source component */\n${scopeCss(cssParts.join("\n"), `.r3-${key}`, key)}`);
  }
  return `${parts.join("\n\n")}\n`;
}

const [opening, history, authority, dividend, route, footer, navigation, componentCss] = await Promise.all([
  buildOpening(), buildHistory(), buildAuthority(), buildDividend(), buildRoute(), buildFooter(), buildNavigation(), buildComponentCss(),
]);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
    <meta name="color-scheme" content="dark" />
    <title>Mindmake / homepage pre-publish R3</title>
    <link rel="stylesheet" href="./component-styles.css" />
    <link rel="stylesheet" href="./page.css" />
  </head>
  <body>
    <a class="skip-link" href="#history">Skip to the story</a>
    <main id="site" data-release="homepage-integrated-candidate-r3" aria-label="Mindmake homepage">
      <section id="opening" class="r3-section r3-opening" data-component="opening">${opening}</section>
      <section id="history" class="r3-section r3-history r3-reveal" data-component="history">${history}</section>
      <section id="authority" class="r3-section r3-authority r3-reveal" data-component="authority">${authority}</section>
      <section id="leadership-dividend" class="r3-section r3-dividend r3-reveal" data-component="leadership-dividend">
        <nav class="r3-mode-switch" aria-label="Leadership dividend chapters">
          <button type="button" data-dividend-mode="practice" aria-pressed="true">In practice</button>
          <button type="button" data-dividend-mode="benefits" aria-pressed="false">What becomes possible</button>
          <button type="button" data-dividend-mode="return" aria-pressed="false">The returned hour</button>
        </nav>${dividend}
      </section>
      <section id="route" class="r3-section r3-route r3-reveal" data-component="route">
        ${route}
      </section>
      <section id="footer" class="r3-footer r3-reveal" data-component="footer">${footer}</section>
    </main>
    <aside class="r3-navigation" aria-hidden="true" aria-label="Site navigation" role="dialog" aria-modal="true" inert>${navigation}</aside>
    <script src="./script.js"></script>
  </body>
</html>
`;

const outputs = [
  [path.resolve(directory, "index.html"), html],
  [path.resolve(directory, "component-styles.css"), componentCss],
];

if (checkOnly) {
  const mismatches = [];
  for (const [target, expected] of outputs) {
    let actual = "";
    try { actual = await readFile(target, "utf8"); } catch { actual = ""; }
    if (actual !== expected) mismatches.push(path.basename(target));
  }
  console.log(JSON.stringify({ artifact: "homepage-r3-deterministic-build-check", mismatches }, null, 2));
  if (mismatches.length) process.exitCode = 1;
} else {
  for (const [target, content] of outputs) await writeFile(target, content, "utf8");
  console.log(JSON.stringify({ artifact: "homepage-r3-build", files: outputs.map(([target, content]) => ({ file: path.basename(target), bytes: Buffer.byteLength(content), sha256: sha256(content) })) }, null, 2));
}
