import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r3';
const candidatePath = '/prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s4-r3.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1108,574],[1280,800],[1366,640],[1440,700],[1440,900],[1475,730],[1536,768],[1600,768],[1538,636],[1920,1080]];
const secondaryViewports = [[390,844],[844,390],[1108,574],[1366,640],[1475,730],[1538,636],[1440,900]];
const captureSizes = new Set(['1108x574','1475x730','1538x636']);
const failures = [];
const harnessWarnings = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const digest = source => createHash('sha256').update(source).digest('hex');
const normalise = source => source.replace(/\r\n/g, '\n').trimEnd();

await mkdir(output, { recursive: true });

const baselineHtml = await readFile(new URL('./index-readiness-s4.html', import.meta.url), 'utf8');
const baselineCss = await readFile(new URL('./styles-readiness-s4.css', import.meta.url), 'utf8');
const baselineScript = await readFile(new URL('./script-readiness-s4.js', import.meta.url), 'utf8');
const r2Html = await readFile(new URL('./index-readiness-s4-r2.html', import.meta.url), 'utf8');
const r2Css = await readFile(new URL('./styles-readiness-s4-r2.css', import.meta.url), 'utf8');
const r3Html = await readFile(new URL('./index-readiness-s4-r3.html', import.meta.url), 'utf8');
const r3Script = await readFile(new URL('./script-readiness-s4-r3.js', import.meta.url), 'utf8');
const r3Css = await readFile(new URL('./styles-readiness-s4-r3.css', import.meta.url), 'utf8');
const expectedR3Html = r2Html
  .replace('Mindmake · The Decision Balance · fit lock', 'Mindmake · The Decision Balance · state-safe fit lock')
  .replace('    <link rel="stylesheet" href="./styles-readiness-s4-r2.css" />', '    <link rel="stylesheet" href="./styles-readiness-s4-r2.css" />\n    <link rel="stylesheet" href="./styles-readiness-s4-r3.css" />')
  .replace('    <script type="module" src="./script-readiness-s4.js"></script>', '    <script type="module" src="./script-readiness-s4.js"></script>\n    <script type="module" src="./script-readiness-s4-r3.js"></script>');

fail(digest(baselineHtml) !== '74795539d8517f7a9005061a0400bc2b57cc7ced7ecf7047067af9b71cfdbf45', 'lock: S4 baseline HTML changed');
fail(digest(baselineCss) !== '62ea24a3bf36212ee04555b447c27a8557403cab79a32c72ba23af07ba171d4e', 'lock: S4 baseline CSS changed');
fail(digest(baselineScript) !== '451bad24d3126da11add67a3e885f0348d03ace8d7fb3ad39ff3eee0b365ada9', 'lock: S4 baseline JavaScript changed');
fail(digest(r2Css) !== '04fb946dc4376ff8c963b88fe6dfc60cb183f3523cbd345dc9705ab5e28070ed', 'lock: S4 R2 fit CSS changed');
fail(normalise(r3Html) !== normalise(expectedR3Html), 'lock: R3 HTML differs beyond its title and additive state-safety script');
fail(!r3Script.includes("protectedShell?.scrollTop") || !r3Script.includes("attributeFilter: ['open']"), 'source: underlying page and shell scroll positions are not both protected');
fail(!r3Css.includes('(min-height:721px) and (max-height:850px)'), 'source: scaled-Windows desktop height band is not locked');

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

async function load(page) {
  await page.goto(origin + candidatePath, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const geometry = page => page.evaluate(() => {
  const rect = selector => document.querySelector(selector)?.getBoundingClientRect().toJSON();
  const shell = document.querySelector('.balance-shell');
  return {
    width: innerWidth,
    height: innerHeight,
    windowScroll: { x: scrollX, y: scrollY },
    shellScroll: { x: shell?.scrollLeft || 0, y: shell?.scrollTop || 0 },
    topbar: rect('.topbar'),
    brand: rect('.brand'),
    title: rect('.offer-panel h1'),
    offer: rect('.offer-panel'),
    primary: rect('.primary-action'),
    instrument: rect('.balance-instrument'),
    stageJumps: rect('.stage-jumps'),
    documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
});

function assertState(state, label, { desktopFit = false } = {}) {
  fail(state.documentOverflow > 1, `${label}: horizontal overflow ${state.documentOverflow}`);
  fail(!state.topbar || !state.brand || !state.title || !state.offer || !state.primary, `${label}: required geometry missing`);
  if (!state.topbar || !state.brand || !state.title || !state.offer || !state.primary) return;
  const gridDrift = Math.abs(state.brand.left - state.title.left);
  fail(gridDrift > 2, `${label}: logo/content grid drift ${gridDrift}px`);
  if (state.width > 860) {
    fail(state.shellScroll.x > 1 || state.shellScroll.y > 1, `${label}: sticky shell acquired hidden scroll ${JSON.stringify(state.shellScroll)}`);
    fail(state.offer.top < state.topbar.bottom - 1, `${label}: offer entered fixed-nav reserve ${JSON.stringify({ offer: state.offer, topbar: state.topbar })}`);
    fail(state.title.top < state.topbar.bottom - 1, `${label}: headline entered fixed-nav reserve ${JSON.stringify({ title: state.title, topbar: state.topbar })}`);
    if (desktopFit) {
      for (const [name, box] of [['offer',state.offer],['primary',state.primary],['instrument',state.instrument],['stageJumps',state.stageJumps]]) {
        fail(!box || box.top < -1 || box.bottom > state.height + 1 || box.left < -1 || box.right > state.width + 1, `${label}: ${name} escapes viewport ${JSON.stringify(box)}`);
      }
      fail(state.primary.bottom > state.height - 24, `${label}: primary action lacks a 24px usable-screen reserve ${JSON.stringify(state.primary)}`);
    }
  }
}

async function settle(page) {
  await page.waitForTimeout(140);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function exercise(page, label, width, height, capture) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await load(page);
  let state = await geometry(page);
  assertState(state, `${label} cold`, { desktopFit: width > 860 });
  fail((await page.locator('html').getAttribute('data-decision-balance-scroll-lock')) !== 'true', `${label}: state-safety module did not initialise`);

  let openingY = 0;
  if (width > 860) {
    const travel = await page.locator('.balance-stage').evaluate(node => node.offsetHeight - innerHeight);
    openingY = Math.max(0, Math.round(travel * .52));
    await page.evaluate(value => scrollTo(0, value), openingY);
    await settle(page);
    state = await geometry(page);
    assertState(state, `${label} before dialog at scroll ${openingY}`);
  }

  await page.locator('#start-here').click();
  await page.locator('#decision-input').fill('Decide whether we build or partner');
  await page.locator('.frame-action').click();
  await page.keyboard.press('Escape');
  await settle(page);
  state = await geometry(page);
  assertState(state, `${label} after first close`);
  fail(Math.abs(state.windowScroll.y - openingY) > 1, `${label}: first close changed page scroll from ${openingY} to ${state.windowScroll.y}`);

  await page.locator('#start-here').click();
  await settle(page);
  fail(!(await page.locator('.decision-result').isVisible()), `${label}: completed record did not reopen`);
  state = await geometry(page);
  assertState(state, `${label} reopened completed record`);
  fail(Math.abs(state.windowScroll.y - openingY) > 1, `${label}: reopening record changed page scroll from ${openingY} to ${state.windowScroll.y}`);
  await page.locator('.change-decision').click();
  await page.keyboard.press('Escape');
  await settle(page);
  state = await geometry(page);
  assertState(state, `${label} after recovery close`);
  fail(Math.abs(state.windowScroll.y - openingY) > 1, `${label}: recovery close changed page scroll from ${openingY} to ${state.windowScroll.y}`);

  if (width > 860) {
    await page.evaluate(() => scrollTo(0, 0));
    await settle(page);
    state = await geometry(page);
    assertState(state, `${label} returned to top`, { desktopFit: true });
  }
  if (capture) await page.screenshot({ path: `${output}/${label}-after-recovery.png`, fullPage: false });
  fail(errors.length > 0, `${label}: runtime errors ${JSON.stringify(errors)}`);
}

async function run(engine, name, viewports) {
  if (name === 'firefox') {
    for (const [width,height] of viewports) {
      const browser = await engine.launch({ headless: true });
      let context;
      try {
        context = await browser.newContext({ viewport: { width, height } });
        const page = await context.newPage();
        await exercise(page, `${name}-${width}x${height}`, width, height, false);
      } finally {
        try { await context?.close(); } catch (error) { harnessWarnings.push(`${name}-${width}x${height} context cleanup: ${error.message}`); }
        try { await browser.close(); } catch (error) { harnessWarnings.push(`${name}-${width}x${height} browser cleanup: ${error.message}`); }
      }
    }
    return;
  }
  const browser = await engine.launch(name === 'chromium' ? { headless: true, channel: 'chrome' } : { headless: true });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await exercise(page, `${name}-${width}x${height}`, width, height, name === 'chromium' && captureSizes.has(`${width}x${height}`));
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

try {
  await run(chromium, 'chromium', chromiumViewports);
  await run(webkit, 'webkit', secondaryViewports);
  await run(firefox, 'firefox', secondaryViewports);
  console.log(JSON.stringify({
    artifact: 'commercial-readiness-s4-r3-state-safe-fit-lock',
    origin,
    output,
    chromiumViewports: chromiumViewports.length,
    representativePerSecondaryEngine: secondaryViewports.length,
    physicalDevices: { iphoneSafariVoiceOver: 'not run', androidChromeTalkBack: 'not run' },
    harnessWarnings,
    failures,
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
