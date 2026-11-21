import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import { FACTS, STEPS } from "../../src/features/who-decided/audit.ts";

const base = process.argv.find(arg => arg.startsWith("--base="))?.slice(7);
if (!base) throw new Error("Supply --base= for a self-owned built preview");
const output = path.resolve(process.argv.find(arg => arg.startsWith("--output="))?.slice(9) ?? "artifacts/who-decided");
await mkdir(output, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const observations = [];
const choices = [2, 1, 0, 2, 2, 1];
try {
  for (const [width, height] of [[390, 844], [1440, 900], [320, 568]]) {
    const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "reduce" });
    const page = await context.newPage();
    const requests = [], errors = [];
    page.on("request", request => requests.push({ url: request.url(), method: request.method(), type: request.resourceType() }));
    page.on("pageerror", error => errors.push(error.message));
    await context.route("**/*", route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.addInitScript(() => localStorage.setItem("mindmake_consent", "analytics"));
    const storage = () => page.evaluate(() => JSON.stringify([{ ...localStorage }, { ...sessionStorage }]));
    const button = name => page.getByRole("button", { name, exact: true });
    const result = page.locator(".wd-results");
    const capture = async name => {
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name} fits at ${width}`);
      assert.ok(await result.getByRole("heading", { level: 1 }).evaluate(heading => heading === document.activeElement));
      const targets = await result.locator("button, select, summary, .wd-next").evaluateAll(nodes =>
        nodes.filter(node => node.checkVisibility()).map(node => node.getBoundingClientRect().height));
      assert.ok(targets.every(size => size >= 44), `${name} touch targets at ${width}: ${targets.join(",")}`);
      await page.screenshot({ path: path.join(output, `${width}-${name}.png`), fullPage: true });
    };

    await page.goto(`${base}/measure-your-ai-judgement/`);
    await button("Begin").click();
    await page.waitForLoadState("networkidle");
    const initialStorage = await storage();
    const baseline = requests.length;
    assert.equal(await page.getAttribute('meta[name="robots"]', "content"), "noindex, nofollow");
    for (const [index, step] of STEPS.entries()) {
      assert.ok((await page.getByRole("heading", { level: 1 }).innerText()).includes(step.question));
      assert.equal(await page.getByRole("group").getByRole("button").count(), 4);
      await button(step.options[choices[index]].text).press("Enter");
    }
    await result.getByRole("heading", { name: STEPS[2].nextTitle }).waitFor();
    await capture("result");
    await result.getByText("See my six answers", { exact: true }).click();
    assert.equal(await result.getByRole("listitem").count(), 6);
    await result.getByText("See my six answers", { exact: true }).click();
    await button("Turn this into an AI brain rule").click();
    await capture("brain");
    assert.ok(await result.getByText(STEPS[2].rule, { exact: true }).isVisible());
    await button("Copy my rule").click();
    await result.getByRole("status").filter({ hasText: /Copied to your clipboard|Use your device/ }).waitFor({ state: "attached" });
    await button("See how the gains add up").click();
    await capture("compound");
    assert.ok(await result.getByText("147 more", { exact: true }).isVisible());
    assert.ok(await result.getByText("3.45×", { exact: true }).isVisible());
    assert.ok(await result.getByText("Week 13 · 34.5%", { exact: true }).isVisible());
    await page.getByLabel("Time improving the rule").selectOption("52");
    assert.ok(await result.getByText("Week 52 · 100%", { exact: true }).isVisible());
    await page.getByLabel("Assumed weekly gain").selectOption("0");
    assert.ok(await result.getByText("0 more", { exact: true }).isVisible());
    await button("Back to your AI brain").click();
    await button("See how the gains add up").click();
    assert.equal(await page.getByLabel("Assumed weekly gain").inputValue(), "0");
    assert.equal(await page.getByLabel("Time improving the rule").inputValue(), "52");
    await result.getByText("Research behind the audit", { exact: true }).click();
    for (const fact of FACTS) assert.equal(await result.getByRole("link", { name: fact.attribution }).getAttribute("href"), fact.href);
    assert.equal(await result.getByRole("link", { name: "Start your brief" }).getAttribute("href"), "/?start=1");
    await page.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `large text at ${width}`);
    assert.equal(await storage(), initialStorage, "Answers and model controls must not change browser storage");
    assert.equal(new URL(page.url()).search, "");
    assert.deepEqual(requests.slice(baseline).filter(request =>
      new URL(request.url).origin !== new URL(base).origin || request.method !== "GET" ||
      !["font", "image", "stylesheet", "script"].includes(request.type)), [], "Only static assets may load during the audit");
    assert.equal(requests.some(request => /google-analytics|googletagmanager|clarity\.ms|plausible\.io/.test(request.url)), false);
    assert.deepEqual(errors, []);
    await page.reload();
    await button("Begin").click();
    assert.equal(await page.getByRole("group").locator('[aria-pressed="true"]').count(), 0);
    observations.push({ width, height, status: "pass", coverage: "six answers, three results, keyboard, copy feedback, bounded growth, research, brief, focus, targets, privacy, reload, large text" });
    await context.close();
  }
  await writeFile(path.join(output, "browser-report.json"), JSON.stringify({ observations, physicalDevices: "not_run" }, null, 2));
  console.log(JSON.stringify(observations, null, 2));
} finally { await browser.close(); }
