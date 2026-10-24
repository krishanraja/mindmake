import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';

// The homepage in three sections (Ruling, Krish, 2026-10-24: "drastically
// simplify everything here to be probably three sections"): the R3 opening,
// then the problem, how it works and what the reader gets, then the R3 footer.
// Nothing pins any more, so the scroll-build cases this gate used to replay
// (history, reach, practice) are retired with the chapters; git keeps them.
// What it holds now, on the built page and at every size:
//  - the approved headline, and the opening, three sections and footer in order;
//  - nothing pins: each section moves exactly as far as the page scrolls;
//  - the hero's way in and the closing one open the brief at the AI brain's
//    door, and Escape gives focus back to the button that opened it;
//  - the publication line is in the opening;
//  - each era tile turns in place without changing the size of the four;
//  - films stand still for a reader who asks for reduced motion;
//  - nothing runs off the side of the screen, and the page throws nothing.
//
// Pre-merge (Krish, 2026-09-25): Chromium alone gates a branch. Firefox and
// WebKit run only in the post-merge matrix on main, which omits the flag. A
// narrowed run writes its own folder, so it can never replace the
// three-engine receipts in artifacts/homepage-release/.
const root = path.resolve(import.meta.dirname, '../..');
const preMerge = process.argv.includes('--pre-merge');
const engines = preMerge ? ['chromium'] : ['chromium', 'firefox', 'webkit'];
const evidence = path.join(root, preMerge ? 'artifacts/homepage-release/pre-merge' : 'artifacts/homepage-release');
await mkdir(evidence, { recursive: true });
const external = process.env.MINDMAKE_RELEASE_URL;
const origin = external || 'http://127.0.0.1:4342';
const server = external ? null : spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), ...(process.argv.includes('--built') ? ['preview'] : []), '--host', '127.0.0.1', '--port', '4342', '--strictPort'], { cwd: root, windowsHide: true, stdio: 'pipe' });
const failures = [], cases = [], screenshots = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 390, height: 844 }, { width: 360, height: 780 }];
const launchOptions = name => name === 'chromium' && process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {};

const openAndClose = async (page, label, locator) => {
  await locator.scrollIntoViewIfNeeded();
  await locator.click();
  await page.waitForFunction(() => new URL(location.href).searchParams.get('start') === 'brain', null, { timeout: 10000 }).catch(() => {});
  assert(new URL(page.url()).searchParams.get('start') === 'brain', `${label}: opens the brief at the AI brain's door`);
  /* The brief loads on demand, so it is waited for before it is judged. */
  const dialog = page.locator('[role="dialog"]:visible').first();
  await dialog.waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});
  assert(await dialog.isVisible().catch(() => false), `${label}: the brief is on screen`);
  await settle(page);
  await page.keyboard.press('Escape');
  await page.locator('[role="dialog"]:visible').first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
  await page.waitForFunction(() => !new URL(location.href).searchParams.get('start'), null, { timeout: 10000 }).catch(() => {});
  await settle(page); await settle(page);
  assert(!new URL(page.url()).searchParams.get('start'), `${label}: Escape closes the brief`);
  assert(await locator.evaluate(node => document.activeElement === node), `${label}: focus returns to the button that opened it`);
};

try {
  for (let i = 0; i < 100; i++) { try { if ((await fetch(origin)).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  for (const [engine, launcher] of Object.entries({ chromium, firefox, webkit }).filter(([name]) => engines.includes(name) && (!process.env.QA_ENGINE || process.env.QA_ENGINE === name))) {
    const browser = await launcher.launch(launchOptions(engine));
    try {
      for (const viewport of VIEWPORTS) {
        for (const reducedMotion of ['no-preference', 'reduce']) {
          const context = await browser.newContext({ viewport, reducedMotion });
          const page = await context.newPage();
          page.setDefaultTimeout(15000);
          const label = `${engine}-${viewport.width}x${viewport.height}${reducedMotion === 'reduce' ? '-reduced' : ''}`;
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.addInitScript(() => localStorage.setItem('mindmake_consent', 'accepted'));
          await page.goto(origin, { waitUntil: 'domcontentloaded', timeout: 60000 });
          await page.evaluate(() => document.fonts.ready);
          await page.waitForSelector('.hs-section', { timeout: 60000 });
          await settle(page);
          console.log(`Testing ${label}`);
          const observed = { label, viewport };

          assert(await page.locator('.mm-home-approved h1:visible').textContent() === 'Promote your AI from intern to chief of staff.', `${label}: approved opening`);
          const order = await page.evaluate(() => ['#opening', '#hs-problem-title', '#hs-how-title', '#hs-get-title', '#footer'].map(selector => {
            const node = document.querySelector(selector);
            return node ? node.getBoundingClientRect().top + scrollY : null;
          }));
          observed.order = order;
          assert(order.every((top, i) => top !== null && (i === 0 || top > order[i - 1])), `${label}: opening, three sections and footer in order (${order.join(', ')})`);

          /* Nothing pins: each section moves exactly as far as the page does. */
          const sticky = await page.evaluate(() => [...document.querySelectorAll('.mm-homepage-release main *')].filter(node => getComputedStyle(node).position === 'sticky').map(node => node.className || node.tagName));
          assert(!sticky.length, `${label}: nothing on the page is sticky (${sticky.slice(0, 3).join(', ')})`);
          for (const selector of ['.hs-problem', '.hs-how', '.hs-get']) {
            const section = page.locator(selector);
            await section.scrollIntoViewIfNeeded();
            await page.evaluate(() => scrollBy({ top: -120, behavior: 'instant' }));
            await settle(page);
            const before = await section.evaluate(node => node.getBoundingClientRect().top);
            await page.evaluate(() => scrollBy({ top: 200, behavior: 'instant' }));
            await settle(page);
            const after = await section.evaluate(node => node.getBoundingClientRect().top);
            assert(Math.abs((before - after) - 200) < 3, `${label}: ${selector} moves with the page, never pinned (${Math.round(before)} to ${Math.round(after)})`);
          }

          /* The publication, one line in the opening. */
          const issue = page.locator('.r3-opening .hs-issue:visible');
          assert(await issue.count() === 1, `${label}: the publication line is in the opening`);
          assert(await issue.locator('a[href="https://makeyourmindup.ai"]').count() === 1, `${label}: the publication line subscribes at makeyourmindup.ai`);

          /* The eras turn in place, and the four never change size. */
          const tiles = page.locator('[data-hs-era]');
          assert(await tiles.count() === 4, `${label}: four eras`);
          const eras = page.locator('.hs-eras');
          await eras.scrollIntoViewIfNeeded();
          const height = await eras.evaluate(node => node.getBoundingClientRect().height);
          for (let i = 0; i < 4; i++) {
            await tiles.nth(i).click();
            await settle(page);
            assert(await tiles.nth(i).getAttribute('aria-pressed') === 'true', `${label}: era ${i + 1} turns`);
            const now = await eras.evaluate(node => node.getBoundingClientRect().height);
            assert(Math.abs(now - height) <= 1, `${label}: era ${i + 1} turns without resizing the four (${Math.round(height)} to ${Math.round(now)})`);
            await tiles.nth(i).click();
          }

          /* Films stand still for a reader who asks for reduced motion. */
          if (reducedMotion === 'reduce') {
            const playing = await page.evaluate(() => [...document.querySelectorAll('.mm-homepage-release video')].filter(video => !video.paused).length);
            assert(playing === 0, `${label}: no film plays under reduced motion (${playing} playing)`);
          }

          /* The way in, at the top and at the end. */
          await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
          await openAndClose(page, `${label}/hero`, page.locator('.r3-opening .hs-start-button:visible').first());
          await openAndClose(page, `${label}/close`, page.locator('.hs-get .hs-start-button'));

          assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${label}: horizontal overflow`);
          assert(!errors.length, `${label}: page errors ${errors.join(' | ')}`);
          if (reducedMotion === 'reduce') {
            await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
            const shot = path.join(evidence, `home-${engine}-${viewport.width}x${viewport.height}.png`);
            await page.screenshot({ path: shot, fullPage: true });
            screenshots.push(path.relative(root, shot).split(path.sep).join('/'));
          }
          cases.push(observed);
          await context.close();
        }
      }
    } finally { await browser.close(); }
  }
} catch (error) { failures.push(error.stack); }
finally { server?.kill(); }

const sourceFiles = ['src/pages/Index.tsx', 'src/components/homepage-release/markup.ts', 'src/components/homepage-release/runtime.js', 'src/components/homepage-release/component-styles.css', 'src/components/homepage-release/page.css', 'src/components/homepage-release/integration.css', 'src/components/homepage-release/homepageSections.ts', 'src/components/homepage-release/homepageSections.css', 'src/components/leadership-chapters/leadershipChapters.ts', 'src/styles/new-age-leadership-r5.css'];
const hashes = {};
for (const file of sourceFiles) hashes[file] = createHash('sha256').update(await readFile(path.join(root, file))).digest('hex');
const candidateDigest = createHash('sha256').update(JSON.stringify(hashes)).digest('hex');
const report = { at: new Date().toISOString(), origin, built: process.argv.includes('--built'), engines, candidateDigest, hashes, cases, screenshots, failures };
await writeFile(path.join(evidence, 'browser-report.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ cases: cases.length, screenshots: screenshots.length, failures }, null, 2));
if (!cases.length && !failures.length) failures.push('no cases ran');
if (failures.length) process.exitCode = 1;
