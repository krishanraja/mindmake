// In-process evidence when child-process build tools cannot start. This checks
// the real React page in JSDOM; it does not certify layout or replace Vitest.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import Module, { createRequire } from "node:module";
import ts from "typescript";
import { JSDOM } from "jsdom";
import { STEPS, LEVELS, FACTS, readDecision } from "../../src/features/who-decided/audit.ts";

const root = path.resolve(import.meta.dirname, "../..");
const require = createRequire(import.meta.url);
const dom = new JSDOM("<!doctype html><html><head></head><body></body></html>", { url: "https://mindmake.test/who-decided" });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "MutationObserver", "Event", "navigator"])
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
window.requestAnimationFrame = callback => setTimeout(callback, 0);
window.cancelAnimationFrame = clearTimeout;
Element.prototype.scrollIntoView = () => {};
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

for (const extension of [".ts", ".tsx"]) {
  Module._extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8")
      .replace(/(["'])@\//g, `$1${root.replaceAll("\\", "/")}/src/`)
      .replace(/import (\w+) from ["']([^"']+)\?raw["'];/g, (_, name, file) => `const ${name} = ${JSON.stringify(fs.readFileSync(file, "utf8"))};`);
    module._compile(ts.transpileModule(source, { fileName: filename, compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
  };
}
for (const extension of [".css", ".svg", ".webp", ".png"]) Module._extensions[extension] = (module, filename) => { module.exports = filename; };

let combinations = 0;
for (; combinations < 4096; combinations++) {
  const positions = STEPS.map((_, index) => Math.floor(combinations / 4 ** index) % 4);
  const read = readDecision(positions.map(index => LEVELS[index]));
  assert.equal(read.first.id, STEPS[positions.indexOf(Math.min(...positions))].id);
  assert.deepEqual(read.lines.map(line => line.level), positions.map(index => LEVELS[index]));
  assert.doesNotMatch(JSON.stringify(read), /score|percentage|grade|badge/i);
}
assert.equal(readDecision([null, ...Array(5).fill("Aware")]), null);
assert.equal(readDecision(Array(6).fill("unknown")), null);
assert.equal(readDecision(new Array(6)), null);
for (const file of ["src/features/who-decided/audit.ts", "src/pages/WhoDecided.tsx"]) {
  assert.doesNotMatch(fs.readFileSync(path.join(root, file), "utf8"), /\b(fetch|sendBeacon|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|supabase|track|gtag|plausible)\b|<form\b|document\.cookie/);
}

// Execute the real analytics bootstraps with prior consent. No tag may load
// on either spelling of the audit route, even when its loader is called.
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const bootstraps = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1]).filter(script => /mmPrivateAuditDocument|mmLoadClarity/.test(script));
for (const route of ["/measure-your-ai-judgement", "/measure-your-ai-judgement/"]) {
  const isolated = new JSDOM("<html><head><script></script></head><body></body></html>", { url: `https://mindmake.test${route}`, runScripts: "outside-only" });
  isolated.window.localStorage.setItem("mindmake_consent", "analytics");
  for (const script of bootstraps) isolated.window.eval(script);
  isolated.window.mmLoadGoogleTag();
  isolated.window.mmLoadClarity();
  assert.equal(isolated.window.mmPrivateAuditDocument, true);
  assert.equal(isolated.window.document.querySelectorAll("script[src]").length, 0);
  isolated.window.close();
}

const React = require("react");
const { render, screen, fireEvent, cleanup, within } = require("@testing-library/react");
const { MemoryRouter } = require("react-router-dom");
const WhoDecided = require(path.join(root, "src/pages/WhoDecided.tsx")).default;
render(React.createElement(MemoryRouter, { initialEntries: ["/measure-your-ai-judgement"] }, React.createElement(WhoDecided)));
fireEvent.click(screen.getByRole("button", { name: /Begin the audit/ }));
assert.equal(screen.getByRole("button", { name: /Continue/ }).disabled, true);
const privateNote = "Synthetic private decision for QA";
fireEvent.change(screen.getByLabelText("Your note on the decision"), { target: { value: privateNote } });
for (let index = 0; index < 6; index++) {
  assert.ok(screen.getByText(`Step ${index + 1} of 6`));
  assert.equal(screen.getAllByRole("radio").length, 4);
  fireEvent.click(screen.getByLabelText(STEPS[index].options[index === 3 ? 0 : 2].text));
  fireEvent.click(screen.getByRole("button", { name: index === 5 ? /Read my decision/ : /Continue/ }));
}
assert.equal(document.querySelector(".wd-first").textContent, "The numbers");
for (const fact of FACTS) {
  assert.ok(screen.getByText(fact.text));
  assert.equal(screen.getByRole("link", { name: fact.attribution }).getAttribute("href"), fact.href);
}
assert.equal(within(screen.getByRole("article")).getByRole("link", { name: "Start your brief" }).getAttribute("href"), "/?start=1");
fireEvent.click(screen.getByRole("button", { name: "Revisit my answers" }));
assert.equal(screen.getByLabelText("Your note on the decision").value, privateNote);
assert.equal(screen.getByLabelText(STEPS[0].options[2].text).checked, true);
fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
fireEvent.click(screen.getByRole("button", { name: "Keep working" }));
assert.equal(screen.getByLabelText(STEPS[0].options[2].text).checked, true);
fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
fireEvent.click(screen.getByRole("button", { name: "Yes, clear them" }));
fireEvent.click(screen.getByRole("button", { name: /Begin the audit/ }));
assert.equal(screen.getByLabelText("Your note on the decision").value, "");
assert.equal(screen.getAllByRole("radio").some(input => input.checked), false);
fireEvent(window, new Event("pagehide"));
assert.ok(screen.getByRole("button", { name: /Begin the audit/ }));
cleanup();
dom.window.close();
console.log(JSON.stringify({ status: "pass", combinations, checks: ["lowest level and ties", "no score", "invalid answers", "no transport or persistence in audit sources", "analytics bootstraps with prior consent", "six-step React flow", "verbatim rendered facts", "brief link", "revision preserves notes", "clear confirmation and cancellation", "pagehide clears work"], limits: "JSDOM only. Browser layout, real network and built hydration are not certified." }, null, 2));
