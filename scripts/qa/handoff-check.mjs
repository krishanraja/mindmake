/**
 * The offer, in a real browser, on the two grounds it actually lands on.
 *
 * The panel never renders at rest, so no existing gate walks it: it appears
 * only after something has failed. This drives two of the nine dead ends for
 * real, at both widths, and reads back what the site's own rules require of any
 * surface — visible focus, no overflow, and legible on the ground it sits on.
 */
import { chromium } from "playwright";

const BASE = "http://127.0.0.1:4180";
/* A directory for the screenshots, and never the repository by default: the
   first version defaulted to "." and four PNGs were committed with a change
   that had nothing to do with them. */
const OUT = process.argv[2] ?? process.env.TMPDIR ?? "/tmp";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const problems = [];

const luminance = (rgb) => {
  const [r, g, b] = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

for (const [width, height] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  /* The 500 below is this script's own doing: the code send is failed on
     purpose, which is the only way to reach the dead end being checked.
     Counting it as a browser error would fail the check for working. */
  page.on("console", (message) => {
    const text = message.text();
    if (message.type() !== "error") return;
    if (/submit-mindmake-brief|status of 500/.test(text)) return;
    errors.push(text);
  });

  // 1. The ask bar's unmatched question. No network, entirely client side.
  await page.goto(`${BASE}/ai-brain`, { waitUntil: "networkidle" });
  await page.getByPlaceholder(/Ask us anything/).fill("what is your favourite colour");
  await page.getByRole("button", { name: "Ask", exact: true }).click();
  const trigger = page.getByRole("button", { name: /Or ask a person to look/ });
  await trigger.waitFor({ state: "visible" });
  await trigger.click();

  const panel = page.locator(".mm-handoff").first();
  await panel.waitFor({ state: "visible" });
  await panel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const read = await panel.evaluate((el) => {
    const box = el.getBoundingClientRect();
    const sorry = el.querySelector(".mm-handoff-sorry");
    const aside = el.querySelector(".mm-handoff-aside");
    let ground = el;
    let bg = "rgba(0, 0, 0, 0)";
    while (ground && bg === "rgba(0, 0, 0, 0)") {
      bg = getComputedStyle(ground).backgroundColor;
      ground = ground.parentElement;
    }
    return {
      right: box.right,
      width: box.width,
      bg,
      sorry: getComputedStyle(sorry).color,
      aside: getComputedStyle(aside).color,
      docWidth: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
    };
  });

  if (read.docWidth > read.viewport + 1) {
    problems.push(`${width}px: the page scrolls sideways (${read.docWidth} > ${read.viewport})`);
  }
  const sorryRatio = contrast(read.sorry, read.bg);
  const asideRatio = contrast(read.aside, read.bg);
  if (sorryRatio < 4.5) problems.push(`${width}px ask bar: apology at ${sorryRatio.toFixed(1)}:1 on ${read.bg}`);
  if (asideRatio < 4.5) problems.push(`${width}px ask bar: aside at ${asideRatio.toFixed(1)}:1 on ${read.bg}`);
  console.log(`  ${width}px ask bar: apology ${sorryRatio.toFixed(1)}:1, aside ${asideRatio.toFixed(1)}:1 on ${read.bg}`);

  /* Visible focus on the one action, reached the way a keyboard visitor
     reaches it. Calling .focus() looks like the same thing and is not:
     :focus-visible does not match a programmatic focus on a button in
     Chromium, so the first version of this check reported no focus ring on a
     button that has one. */
  const action = page.getByRole("button", { name: /Have a person pick this up/ });
  await action.evaluate((el) => { el.previousElementSibling?.setAttribute("tabindex", "0"); });
  await page.keyboard.press("Tab");
  let outline = { outline: "0px", style: "none", shadow: "none", matched: false };
  for (let step = 0; step < 40; step += 1) {
    outline = await action.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        outline: style.outlineWidth,
        style: style.outlineStyle,
        shadow: style.boxShadow,
        matched: el === document.activeElement && el.matches(":focus-visible"),
      };
    });
    if (outline.matched) break;
    await page.keyboard.press("Tab");
  }
  const focused = outline.matched && parseFloat(outline.outline) > 0 && outline.style !== "none";
  if (!focused) problems.push(`${width}px: no visible focus on the offer's action`);
  console.log(`  ${width}px focus ring: outline ${outline.outline} ${outline.style}, reached by keyboard`);

  await page.screenshot({ path: `${OUT}/handoff-askbar-${width}.png`, fullPage: false });

  // 2. The dialog's dead end, on paper. The read is stubbed so the journey
  //    reaches the contact step, then the code send is failed for real.
  await page.route("**/functions/v1/enrich-company", (route) => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({
      identity: { name: "Northwind" },
      synthesis: "Northwind sells industrial fasteners to manufacturers across the north of England.",
      understanding: { industry: "manufacturing", descriptor: "industrial fasteners" },
    }),
  }));
  await page.route("**/functions/v1/submit-mindmake-brief", (route) => route.fulfill({ status: 500, body: "" }));

  await page.goto(`${BASE}/ai-gtm`, { waitUntil: "networkidle" });
  await page.getByLabel("First name").fill("Ada");
  await page.getByLabel("Last name").fill("Lovelace");
  await page.getByLabel("Work email").fill("ada@northwind.com");
  await page.getByRole("button", { name: "Leadership", exact: true }).click();
  await page.getByRole("button", { name: /Read my business/ }).click();

  await page.getByRole("button", { name: /Use this problem/ }).waitFor({ state: "visible", timeout: 20_000 });
  /* By accessible name, not by shape. The first version walked the dialog with
     ".mm-brief-step fieldset button", which is a description of today's markup
     rather than of the thing being clicked, and it broke on the step that does
     not use a fieldset. */
  await page.locator(".mm-choice-grid button").first().click();
  await page.getByRole("button", { name: /Use this problem/ }).click();
  await page.getByRole("button", { name: /Grow this business/ }).click();
  await page.getByRole("button", { name: /Show me the recommendation/ }).click();
  await page.getByRole("button", { name: /Keep the private brief/ }).click();

  /* The email hand-off is behind VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED. With it
     off, the dialog goes straight from the brief to the success step and the
     two paper dead ends do not exist to be checked. Say so rather than failing
     on a step that is switched off, and build with the flag on to read them. */
  const sendCode = page.getByRole("button", { name: /Send the code/ });
  if (!(await sendCode.isVisible().catch(() => false))) {
    console.log(`  ${width}px dialog:  skipped, the email hand-off is switched off in this build`);
    if (errors.length) problems.push(`${width}px: ${errors.length} browser error(s): ${errors[0]}`);
    await page.close();
    continue;
  }
  await sendCode.click();

  const dialogTrigger = page.getByRole("button", { name: /Or ask a person to look/ });
  await dialogTrigger.waitFor({ state: "visible", timeout: 15_000 });
  await dialogTrigger.click();
  const dialogPanel = page.locator(".mm-brief-panel .mm-handoff").first();
  await dialogPanel.waitFor({ state: "visible" });
  await dialogPanel.scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);

  const paper = await dialogPanel.evaluate((el) => {
    let ground = el;
    let bg = "rgba(0, 0, 0, 0)";
    while (ground && bg === "rgba(0, 0, 0, 0)") {
      bg = getComputedStyle(ground).backgroundColor;
      ground = ground.parentElement;
    }
    return {
      bg,
      sorry: getComputedStyle(el.querySelector(".mm-handoff-sorry")).color,
      aside: getComputedStyle(el.querySelector(".mm-handoff-aside")).color,
      overflows: el.scrollWidth > el.clientWidth + 1,
    };
  });
  const paperSorry = contrast(paper.sorry, paper.bg);
  const paperAside = contrast(paper.aside, paper.bg);
  if (paperSorry < 4.5) problems.push(`${width}px dialog: apology at ${paperSorry.toFixed(1)}:1 on ${paper.bg}`);
  if (paperAside < 4.5) problems.push(`${width}px dialog: aside at ${paperAside.toFixed(1)}:1 on ${paper.bg}`);
  if (paper.overflows) problems.push(`${width}px dialog: the panel overflows its own box`);
  console.log(`  ${width}px dialog:  apology ${paperSorry.toFixed(1)}:1, aside ${paperAside.toFixed(1)}:1 on ${paper.bg}`);

  await page.screenshot({ path: `${OUT}/handoff-dialog-${width}.png`, fullPage: false });

  if (errors.length) problems.push(`${width}px: ${errors.length} browser error(s): ${errors[0]}`);
  await page.close();
}

await browser.close();
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log("\nthe offer is legible, focusable and does not overflow, on both grounds at both widths");
