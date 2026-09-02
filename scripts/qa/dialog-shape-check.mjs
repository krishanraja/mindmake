#!/usr/bin/env node
/**
 * The lead dialog has a shape.
 *
 * The strip of 28 August 2026 rewrote mindmake.css and took the dialog's whole
 * structural layer with it: the backdrop, the panel geometry, the step padding,
 * the grids and every phone rule. Nothing objected. The file that stages the
 * dialog's colours was untouched and still correct, so it kept its palette
 * while losing its shape, and it rendered full-bleed and unpadded on the live
 * site for a day on the one surface every lead passes through.
 *
 * No existing gate could have caught it. They all measure a page at rest and
 * the dialog is not on a page at rest, and a component test renders markup
 * without ever asking what a stylesheet did with it. So this opens the real
 * dialog in a real browser and reads its box back.
 *
 * The floors are what the layout means rather than numbers that happened to
 * pass: a modal is narrower than the window it floats on and does not touch its
 * edges, a step has reading padding, and a phone gets the screen instead.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const BASE = flag("base", "http://127.0.0.1:4180");

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];

for (const [width, height] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(`${BASE}/?start=1`, { waitUntil: "networkidle" });
  const panel = page.locator(".mm-brief-panel");
  await panel.waitFor({ state: "visible", timeout: 15_000 });
  await page.waitForTimeout(300);

  const shape = await panel.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const backdrop = getComputedStyle(el.parentElement);
    const step = el.querySelector(".mm-brief-step");
    const top = el.querySelector(".mm-brief-top");
    return {
      x: Math.round(box.x),
      width: Math.round(box.width),
      height: Math.round(box.height),
      overflowY: style.overflowY,
      backdropPosition: backdrop.position,
      backdropZ: backdrop.zIndex,
      stepPadLeft: step ? parseFloat(getComputedStyle(step).paddingLeft) : 0,
      stepPadTop: step ? parseFloat(getComputedStyle(step).paddingTop) : 0,
      topSticky: top ? getComputedStyle(top).position : "none",
      topHeight: top ? Math.round(top.getBoundingClientRect().height) : 0,
      /* The step rail's own type, and whether any label was cut to fit. */
      rail: [...el.querySelectorAll(".mm-brief-path button")].map((tab) => {
        const cs = getComputedStyle(tab);
        return {
          label: tab.textContent.trim(),
          size: parseFloat(cs.fontSize),
          weight: Number(cs.fontWeight),
          cut: tab.scrollWidth > tab.clientWidth + 1,
        };
      }),
    };
  });

  const phone = width <= 560;
  const say = (ok, message) => { if (!ok) problems.push(`${width}px: ${message}`); };

  // A modal floats. On a phone it is the screen, which is a different shape on
  // purpose, so the two are checked against different rules rather than one
  // loose rule that would pass either way.
  if (phone) {
    say(shape.width >= width - 1, `the panel is ${shape.width}px on a ${width}px screen, and should fill it`);
    say(shape.height >= height * 0.9, `the panel is ${shape.height}px tall in a ${height}px screen`);
  } else {
    say(shape.width <= 820, `the panel is ${shape.width}px wide, which is not a dialog`);
    say(shape.x > 0, "the panel touches the left edge of the window");
    say(shape.height <= height, `the panel is ${shape.height}px tall in a ${height}px window`);
  }
  say(shape.overflowY === "auto" || shape.overflowY === "scroll", `the panel does not scroll (${shape.overflowY})`);
  say(shape.backdropPosition === "fixed", `the backdrop is ${shape.backdropPosition}, so the page behind it moves`);
  say(Number(shape.backdropZ) >= 100, `the backdrop sits at z-index ${shape.backdropZ}`);
  say(shape.stepPadLeft >= 18, `a step has ${shape.stepPadLeft}px of side padding`);
  say(shape.stepPadTop >= 18, `a step has ${shape.stepPadTop}px of padding above it`);
  say(shape.topSticky === "sticky", `the header is ${shape.topSticky}, so it scrolls away from the close button`);
  say(shape.topHeight >= 44, `the header is ${shape.topHeight}px, under the tap-target floor`);

  /* The rail, and the cascade underneath it.
   *
   * `mindmake.css` normalises `.mm-site button { font: inherit }` at (0,1,1),
   * the same weight as `.mm-brief-path button`, and loads second. So the rail's
   * declared 12px/750 lost the tie on source order and it rendered at the
   * body's 17px serif 400 from the day it was written until 2 September 2026.
   *
   * The symptom needed six steps to show: with the email hand-off off the local
   * build runs four, and four labels in a 390px rail get 97px each, which fits
   * any of them. Production runs six at 65px each, and "Problem" needs 73, so
   * the first screen of the lead dialog on a phone read "Probl…".
   *
   * Both are checked, because only one of them is visible in the build this
   * gate usually runs against. The size is the defect; the truncation is what
   * it did. */
  for (const tab of shape.rail) {
    say(tab.size <= 13, `the step rail's "${tab.label}" is ${tab.size}px, so its own type rule lost to the button normaliser`);
    say(tab.weight >= 600, `the step rail's "${tab.label}" is weight ${tab.weight}, so its own type rule lost to the button normaliser`);
    say(!tab.cut, `the step rail cut "${tab.label}" to fit its cell`);
  }

  console.log(`  ${width}px  panel ${shape.width}x${shape.height} at x=${shape.x}, step padding ${shape.stepPadLeft}/${shape.stepPadTop}, header ${shape.topHeight}px ${shape.topSticky}, rail ${shape.rail.length} steps at ${shape.rail[0]?.size ?? "?"}px/${shape.rail[0]?.weight ?? "?"}`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s) with the dialog's shape:`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log("\nthe lead dialog has a shape at both widths");
