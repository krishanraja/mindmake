// In-process DOM checks: no Vite worker, build process or new dependency required.
import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";
import { JSDOM } from "jsdom";

registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.includes("/src/") && specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) specifier += ".ts";
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.endsWith(".tsx")) return { format: "module", shortCircuit: true, source: ts.transpileModule(readFileSync(new URL(url), "utf8"), { compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText };
    return next(url, context);
  },
});
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://parts.test", pretendToBeVisual: true });
for (const key of ["window", "document", "navigator", "HTMLElement", "HTMLInputElement", "Node", "NodeFilter", "CustomEvent", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "getComputedStyle"]) Object.defineProperty(globalThis, key, { value: dom.window[key], configurable: true });
window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const React = await import("react");
const { render, screen, fireEvent, cleanup, waitFor } = await import("@testing-library/react");
const { PartsFaqDrawer } = await import("../../src/components/ui/parts-faq-drawer.tsx");
const { BouncyAccordion } = await import("../../src/components/ui/bouncy-accordion.tsx");
const { OnboardingChecklist } = await import("../../src/components/ui/onboarding-checklist.tsx");
const { PartsEvidenceChart } = await import("../../src/components/ui/parts-evidence-chart.tsx");
const element = React.createElement;
const cases = [
  ["Real report excerpt matches its recorded source and precedes catalogue prices", () => {
    const read = file => readFileSync(new URL(`../../${file}`, import.meta.url), "utf8");
    const excerpt = read("src/content/parts-sample.json");
    const provenance = JSON.parse(read("quality/parts/sample/provenance.json"));
    assert.equal(createHash("sha256").update(excerpt).digest("hex"), provenance.excerptSha256);
    assert(!excerpt.includes("C:"));
    const sample = JSON.parse(excerpt);
    // The report renderer escapes Markdown punctuation and prints source basenames.
    const report = read("quality/parts/sample/fact-check-board-update-eee5ba1a9143.md").replaceAll("\\.", ".").replaceAll("\\[", "[").replaceAll("\\]", "]");
    assert(report.includes(sample.headline)); assert(report.includes(sample.summary));
    for (const row of sample.rows) {
      assert(report.includes(row.claim.replaceAll("evidence/", "")));
      assert(report.includes(row.evidence.replaceAll("evidence/", "")));
    }
    const page = read("src/pages/Kits.tsx");
    assert(page.indexOf("<PartsSampleOutput />") < page.indexOf('className="kit-card-link"'));
  }],
  ["FAQ native trigger, focus containment, Escape and return focus", async () => {
    render(element(PartsFaqDrawer, { heading: true }));
    const trigger = screen.getByRole("button", { name: "Questions before you start" });
    assert.equal(trigger.tagName, "BUTTON"); // Native Enter/Space activation is covered in browser capture.
    trigger.focus(); fireEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Questions before you start" });
    assert(dialog.contains(document.activeElement));
    assert.equal(dialog.querySelectorAll("summary").length, 7);
    fireEvent.keyDown(document.activeElement, { key: "Escape" });
    await waitFor(() => assert.equal(screen.queryByRole("dialog"), null));
    await waitFor(() => assert.equal(document.activeElement, trigger));
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole("button", { name: "Close questions" }));
    await waitFor(() => assert.equal(screen.queryByRole("dialog"), null));
  }],
  ["Accordion defaults to human judgement and keeps collapsed content inaccessible", () => {
    render(element(BouncyAccordion, { defaultValue: "judgement", items: [
      { id: "checks", title: "What it checks", content: element("a", { href: "/checks" }, "Check detail") },
      { id: "judgement", title: "What only you can judge", content: "Human judgement" },
    ] }));
    const human = screen.getByRole("button", { name: "What only you can judge" });
    assert.equal(human.getAttribute("aria-expanded"), "true");
    assert.equal(screen.queryByRole("link", { name: "Check detail" }), null);
    fireEvent.click(screen.getByRole("button", { name: "What it checks" }));
    assert.equal(human.getAttribute("aria-expanded"), "false");
    assert(screen.getByRole("link", { name: "Check detail" }));
  }],
  ["Checklist ticks independently, can be undone and reset after unmount", () => {
    const view = render(element(OnboardingChecklist));
    const boxes = screen.getAllByRole("checkbox"); assert.equal(boxes.length, 4);
    for (const box of boxes) fireEvent.click(box);
    assert(boxes.every(box => box.checked)); assert.equal(screen.getByRole("status").textContent, "4 of 4 complete");
    fireEvent.click(boxes[1]); assert.equal(boxes[1].checked, false);
    assert.equal(screen.getByRole("status").textContent, "3 of 4 complete");
    view.unmount(); render(element(OnboardingChecklist));
    assert(screen.getAllByRole("checkbox").every(box => !box.checked));
  }],
  ["Chart contains exactly the two signed research values on the same scale", () => {
    const { container } = render(element(PartsEvidenceChart));
    const bars = [...container.querySelectorAll("[data-value]")];
    assert.deepEqual(bars.map(bar => Number(bar.dataset.value)), [.46, -.54]);
    assert(Math.abs(parseFloat(bars[0].style.width) / parseFloat(bars[1].style.width) - .46 / .54) < .000001);
    assert.equal(bars[0].style.left, "50%"); assert.equal(bars[1].style.left, "0px");
    const labels = [...container.querySelectorAll(".parts-evidence-row p")].map(p => p.textContent);
    assert.deepEqual(labels, ["When people were better than the AI at the task: gains (effect size +0.46)", "When the AI was better than the people: losses (effect size -0.54)"]);
    assert.equal(container.querySelectorAll("figure").length, 1);
  }],
];
let failed = 0;
for (const [name, run] of cases) {
  try { await run(); console.log(`PASS ${name}`); }
  catch (error) { failed++; console.error(`FAIL ${name}`, error); }
  finally { cleanup(); }
}
dom.window.close();
console.log(JSON.stringify({ uiCases: cases.length, failed, environment: "jsdom; browser keyboard activation is a separate capture gate" }));
process.exitCode = failed ? 1 : 0;
// npm run test:parts -- --browser also runs real Enter/Space/Tab/Escape checks
// on the matching built pages and captures both required viewports.
if (!failed && process.argv.includes("--browser")) await import("./kits-capture.mjs");
