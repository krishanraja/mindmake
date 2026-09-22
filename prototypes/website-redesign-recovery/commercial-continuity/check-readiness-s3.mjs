#!/usr/bin/env node
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-commercial-readiness-s3';
const candidatePath = '/prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s3.html';
const reviewPath = '/prototypes/website-redesign-recovery/commercial-continuity/review-readiness-s3.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1440,700],[1440,900]];
const captureSizes = new Set(['320x568','390x844','844x390','1440x900']);
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

await mkdir(output, { recursive: true });
const scriptSource = await readFile(new URL('./script-readiness-s3.js', import.meta.url), 'utf8');
const htmlSource = await readFile(new URL('./index-readiness-s3.html', import.meta.url), 'utf8');
fail(scriptSource.includes('currentTime'), 'source: film motion writes video.currentTime');
fail((htmlSource.match(/class="primary-action"/g) || []).length !== 1, 'source: expected exactly one filled primary action');
fail((htmlSource.match(/<article class="record/g) || []).length !== 4, 'source: expected four client records');
fail((htmlSource.match(/role="slider"/g) || []).length !== 4, 'source: every record needs one operable Proofglass');
fail((htmlSource.match(/data-stage="/g) || []).length !== 20, 'source: every record needs the five-stage reasoning grammar');
fail((htmlSource.match(/<video/g) || []).length !== 1, 'source: expected one illustrative film');
fail(/[—]/.test(htmlSource), 'source: em dash entered the public surface');
for (const retired of ['40%', '75%', '22%']) fail(htmlSource.includes(retired), `source: retired claim present ${retired}`);

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

async function load(page, path = candidatePath) {
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const measure = page => page.evaluate(() => {
  const visible = node => {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && box.width > .5 && box.height > .5 && box.right > 0 && box.bottom > 0 && box.left < innerWidth && box.top < innerHeight;
  };
  const escapes = [];
  const boundaries = document.querySelectorAll('.arrival-copy,.record-heading,.record.is-active .record-trigger,.record.is-active .record-body,.sheet-foot,.preflight section');
  for (const boundary of boundaries) {
    if (!visible(boundary)) continue;
    const outer = boundary.getBoundingClientRect();
    for (const node of boundary.querySelectorAll('h1,h2,p,a,button,strong,small,span,dt,dd,blockquote,cite')) {
      if (!visible(node) || node.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const line of range.getClientRects()) {
        if (line.width < .5 || line.height < .5) continue;
        if (line.left < outer.left - 7 || line.right > outer.right + 7 || line.top < outer.top - 7 || line.bottom > outer.bottom + 7) {
          escapes.push({ text: node.textContent.trim().slice(0,52), line: line.toJSON(), outer: outer.toJSON() });
        }
      }
    }
  }
  const smallTargets = [...document.querySelectorAll('a,button')].filter(visible).map(node => ({
    name: (node.textContent || node.getAttribute('aria-label') || '').trim().replace(/\s+/g,' ').slice(0,44),
    box: node.getBoundingClientRect().toJSON(),
  })).filter(({ box }) => box.width < 43.5 || box.height < 43.5);
  const rect = selector => document.querySelector(selector)?.getBoundingClientRect().toJSON();
  const video = document.querySelector('video');
  return {
    width: innerWidth, height: innerHeight,
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    escapes, smallTargets,
    primary: rect('.primary-action'), sheet: rect('.record-sheet'), active: rect('.record.is-active'),
    proofglass: rect('.record.is-active .proofglass'), selectedStage: rect('.record.is-active [role="tab"][aria-selected="true"]'),
    allText: (document.body.innerText || '').replace(/\s+/g,' ').trim(),
    videoCount: document.querySelectorAll('video').length,
    videoSrc: video?.getAttribute('src') || '', poster: video?.getAttribute('poster') || '', videoPlaying: Boolean(video && !video.paused),
  };
});

function assess(state, label, { targetGate = true } = {}) {
  fail(state.x > 1, `${label}: horizontal document overflow ${state.x}`);
  fail(state.escapes.length > 0, `${label}: painted text escapes boundary ${JSON.stringify(state.escapes.slice(0,3))}`);
  if (targetGate) fail(state.smallTargets.length > 0, `${label}: controls below 44px ${JSON.stringify(state.smallTargets.slice(0,5))}`);
  fail(state.videoCount !== 1, `${label}: expected one video, saw ${state.videoCount}`);
  fail(!state.poster, `${label}: poster fallback missing`);
  if (state.proofglass && state.selectedStage) {
    const centre = state.proofglass.left + state.proofglass.width / 2;
    fail(centre < state.selectedStage.left - 7 || centre > state.selectedStage.right + 7, `${label}: Proofglass is not aligned to its selected stage`);
  }
}

const required = [
  'For founders, principals, portfolio owners and senior commercial leaders',
  'Leader-owned AI, built on real work.',
  'Build an AI brain or AI-native go-to-market system',
  'Build your AI brain', 'Build your AI go-to-market', 'Start here', 'Frame one real decision',
  'Days → under an hour', 'Roughly monthly → most days', '14 vendors → 3 decisions',
  'Own team · no new hires', 'Two quarters → one day', '11 of 14 stopped', 'First system live · inside 90 days',
  'Starting point', 'The call', 'The system carried', 'The leader kept', 'Recorded change',
  'Generated film · illustrative, never evidence', 'Client wording approved · organisations withheld by agreement'
];
const forbidden = [
  'Open any result', 'The drawing shows', 'Fourteen tools running', 'Three kept, eleven stopped',
  'illustrative machinery films', 'Book a call', 'Schedule a call', 'per month', 'Eleven tools stopped. One useful system went live.'
];

async function scrollProof(page, label, capture) {
  const before = await page.locator('.record-sheet').boundingBox();
  const beforeTransform = await page.locator('.record-sheet').evaluate(node => getComputedStyle(node).transform);
  const videoBefore = await page.locator('video').evaluate(node => node.currentTime);
  const travel = await page.locator('.handoff').evaluate(node => node.offsetHeight - innerHeight);
  for (const ratio of [.2,.4,.6,.8,1]) {
    await page.evaluate(([distance,step]) => scrollTo(0, distance * step), [travel, ratio]);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(300);
  const after = await page.locator('.record-sheet').boundingBox();
  const videoAfter = await page.locator('video').evaluate(node => node.currentTime);
  fail(!before || !after || after.y >= before.y - 20, `${label}: client record did not rise with scroll`);
  fail(videoAfter < videoBefore, `${label}: film moved backwards during scroll`);
  fail((await page.locator('.record.is-active .proofglass').getAttribute('aria-valuenow')) !== '5', `${label}: scroll did not build through Recorded change`);
  if (capture) await page.screenshot({ path: `${output}/${label}-proof-viewport.png`, fullPage: false });
  for (const ratio of [.8,.6,.4,.2,0]) {
    await page.evaluate(([distance,step]) => scrollTo(0, distance * step), [travel, ratio]);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(300);
  const recovered = await page.locator('.record-sheet').boundingBox();
  const recoveredTransform = await page.locator('.record-sheet').evaluate(node => getComputedStyle(node).transform);
  fail(!after || !recovered || recovered.y < after.y + 20 || recoveredTransform !== beforeTransform, `${label}: reverse scroll did not restore the material state`);
  fail((await page.locator('.record.is-active .proofglass').getAttribute('aria-valuenow')) !== '1', `${label}: reverse scroll did not restore Starting point`);
  for (const ratio of [.2,.4,.6,.8,1]) {
    await page.evaluate(([distance,step]) => scrollTo(0, distance * step), [travel, ratio]);
    await page.waitForTimeout(80);
  }
  await page.waitForTimeout(300);
}

async function exercise(page, label, width, height, capture = false) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await load(page);
  let state = await measure(page);
  assess(state, `${label} cold`);
  if (capture) await page.screenshot({ path: `${output}/${label}-cold-viewport.png`, fullPage: false });
  const mobileHiddenOutcomes = ['14 vendors → 3 decisions','Own team · no new hires','Two quarters → one day','11 of 14 stopped','First system live · inside 90 days'];
  const mobileSequentialStages = ['The call','The system carried','The leader kept','Recorded change'];
  for (const phrase of required) {
    if (width <= 860 && mobileHiddenOutcomes.includes(phrase)) continue;
    if (width <= 860 && mobileSequentialStages.includes(phrase)) continue;
    fail(!state.allText.toLowerCase().includes(phrase.toLowerCase()), `${label}: missing meaning "${phrase}"`);
  }
  for (const phrase of forbidden) fail(state.allText.toLowerCase().includes(phrase.toLowerCase()), `${label}: forbidden copy "${phrase}"`);
  fail((await page.locator('a[href="/ai-brain"]').count()) !== 1, `${label}: Brain route missing or duplicated`);
  fail((await page.locator('a[href="/ai-gtm"]').count()) !== 1, `${label}: GTM route missing or duplicated`);
  fail((await page.locator('a[href="/case-studies"]').count()) !== 1, `${label}: case-study route missing or duplicated`);
  fail(!state.primary || state.primary.top < -1 || state.primary.bottom > height + 1, `${label}: Start here is not cold-visible ${JSON.stringify(state.primary)}`);
  if (width <= 860) {
    fail((await page.locator('[data-record-jump="0"]').getAttribute('role')) !== 'tab', `${label}: exclusive record chooser lacks tab semantics`);
    fail((await page.locator('[data-record-jump="0"]').getAttribute('aria-selected')) !== 'true', `${label}: active mobile record is not exposed as selected`);
    const exposedStages = await page.locator('.record.is-active .stage-grid [role="tab"]').evaluateAll(nodes => nodes.map(node => ({ label: node.getAttribute('aria-label') || '', meaning: node.querySelector('span')?.textContent?.trim() || '' })));
    const stageNames = ['Starting point','The call','The system carried','The leader kept','Recorded change'];
    fail(exposedStages.some((stage, index) => !stage.label.startsWith(`${stageNames[index]}. `) || !stage.meaning || !stage.label.includes(stage.meaning)), `${label}: full sequential stage meaning is not exposed accessibly ${JSON.stringify(exposedStages)}`);
  }

  if (width > 860) await scrollProof(page, label, capture);
  else {
    await page.locator('.record-sheet').scrollIntoViewIfNeeded();
    await page.waitForTimeout(60);
    if (capture) await page.screenshot({ path: `${output}/${label}-proof-viewport.png`, fullPage: false });
  }

  const jump = width <= 860 ? page.locator('[data-record-jump="3"]') : page.locator('.record-trigger').nth(3);
  await jump.click();
  fail((await page.locator('.record-trigger').nth(3).getAttribute('aria-expanded')) !== 'true', `${label}: fourth record did not activate`);
  fail(!(await page.locator('#record-body-4').isVisible()), `${label}: fourth record body is not visible`);
  fail(await page.locator('#record-body-1').isVisible(), `${label}: first record body did not retire`);
  const keyboardTrigger = width <= 860 ? page.locator('[data-record-jump="3"]') : page.locator('.record-trigger').nth(3);
  await keyboardTrigger.press(width <= 860 ? 'ArrowLeft' : 'ArrowUp');
  fail((await page.locator('.record-trigger').nth(2).getAttribute('aria-expanded')) !== 'true', `${label}: keyboard record movement failed`);
  await page.waitForTimeout(450);

  const activeRail = page.locator('.record.is-active .reasoning-rail');
  const glass = activeRail.locator('.proofglass');
  await glass.focus();
  await glass.press('End');
  fail((await glass.getAttribute('aria-valuenow')) !== '5', `${label}: Proofglass End did not select Recorded change`);
  fail((await activeRail.locator('[role="tab"]').nth(4).getAttribute('aria-selected')) !== 'true', `${label}: stage selection and Proofglass diverged`);
  await glass.press('Home');
  fail((await glass.getAttribute('aria-valuenow')) !== '1', `${label}: Proofglass Home did not return to Starting point`);
  await page.waitForTimeout(500);
  const grid = activeRail.locator('.stage-grid');
  if (width > 860) {
    const glassBox = await glass.boundingBox();
    const gridBox = await grid.boundingBox();
    if (glassBox && gridBox) {
      await page.mouse.move(glassBox.x + glassBox.width / 2, glassBox.y + glassBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(gridBox.x + gridBox.width * .84, glassBox.y + glassBox.height / 2, { steps: 7 });
      await page.mouse.up();
      fail((await glass.getAttribute('aria-valuenow')) !== '5', `${label}: dragging Proofglass did not reach Recorded change`);
    } else fail(true, `${label}: Proofglass drag geometry unavailable`);
  } else {
    await activeRail.locator('[role="tab"]').nth(4).click();
    fail((await glass.getAttribute('aria-valuenow')) !== '5', `${label}: tap did not move Proofglass to Recorded change`);
  }
  await page.waitForTimeout(400);
  state = await measure(page);
  assess(state, `${label} inspected`);

  await page.locator('#start-here').click();
  await page.waitForTimeout(120);
  fail(!(await page.locator('#preflight').evaluate(node => node.open)), `${label}: Start here did not open the first-action instrument`);
  fail(!(await page.locator('#decision').evaluate(node => node === document.activeElement)), `${label}: entry focus did not land on the decision field`);
  await page.keyboard.press('Tab');
  fail(!(await page.locator('.frame-action').evaluate(node => node === document.activeElement)), `${label}: entry focus order skipped the frame action`);
  await page.keyboard.press('Tab');
  fail(!(await page.locator('.close-preflight').evaluate(node => node === document.activeElement)), `${label}: modal focus cycle contains a hidden stop after the frame action`);
  await page.keyboard.press('Shift+Tab');
  fail(!(await page.locator('.frame-action').evaluate(node => node === document.activeElement)), `${label}: reverse modal focus cycle contains a hidden stop`);
  await page.locator('#decision').focus();
  await page.locator('.frame-action').click();
  fail(!(await page.locator('#decision-error').isVisible()), `${label}: empty first action has no clear recovery`);
  const value = 'Turn our expertise into a repeatable publishing system';
  await page.locator('#decision').fill(value);
  await page.locator('.frame-action').click();
  fail(!(await page.locator('.preflight-result').isVisible()), `${label}: useful frame did not appear`);
  const resultText = await page.locator('.preflight-result').innerText();
  for (const phrase of [value, 'Gather the source material', 'Choose the claim', 'Run the last finished piece']) {
    fail(!resultText.includes(phrase), `${label}: first action is missing "${phrase}"`);
  }
  fail((await page.locator('input[type="email"]').count()) !== 0, `${label}: email appears before delivered value`);
  fail((await page.locator('.continue-link').getAttribute('href')) !== '/?start=1', `${label}: private continuation target is wrong`);
  if (capture) await page.screenshot({ path: `${output}/${label}-result-viewport.png`, fullPage: false });
  await page.locator('.copy-frame').click();
  await page.waitForFunction(() => document.querySelector('.copy-frame')?.textContent !== 'Copy this record');
  fail((await page.locator('.copy-frame').innerText()) === 'Copy this record', `${label}: copy action produced no consequence`);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(120);
  fail(await page.locator('#preflight').evaluate(node => node.open), `${label}: Escape did not close the instrument`);
  fail(!(await page.locator('#start-here').evaluate(node => node === document.activeElement)), `${label}: closing did not restore focus`);
  await page.locator('#start-here').click();
  fail(!(await page.locator('.preflight-result').isVisible()), `${label}: completed result was not restored after interruption`);
  fail((await page.locator('#decision').inputValue()) !== value, `${label}: unfinished decision was not preserved`);
  await page.locator('.change-decision').click();
  fail(!(await page.locator('.preflight-input').isVisible()), `${label}: restored result has no recovery path to change the decision`);
  await page.locator('#decision').fill('Decide whether to build our sales analytics system or buy one');
  await page.locator('.frame-action').click();
  fail(!(await page.locator('.preflight-result').innerText()).includes('Weight those trade-offs'), `${label}: build-or-buy frame mapped incorrectly`);
  fail((await page.locator('.preflight-result').innerText()).includes('Test one offer with real buyers'), `${label}: mixed build-or-buy decision was misrouted as an offer test`);
  const mixedCarry = await page.locator('#result-carry').innerText();
  const mixedProof = await page.locator('#result-proof').innerText();
  fail(!mixedCarry.includes('build, buy and hybrid paths') || !mixedCarry.includes('sales analytics system'), `${label}: mixed build-or-buy frame does not preserve the actual branches and subject`);
  fail(!mixedProof.includes('one credible build route') || !mixedProof.includes('one live buy route') || !mixedProof.includes('one thin hybrid pilot'), `${label}: mixed build-or-buy frame lacks a route-specific first proof`);
  await page.locator('.change-decision').click();
  const hireDecision = 'Hire an analyst or automate with an AI agent';
  await page.locator('#decision').fill(hireDecision);
  await page.locator('.frame-action').click();
  const hireCarry = await page.locator('#result-carry').innerText();
  const hireProof = await page.locator('#result-proof').innerText();
  fail(hireCarry.includes(hireDecision) || !hireCarry.includes('hiring an analyst') || !hireCarry.includes('hybrid path'), `${label}: hire-or-automate frame repeats the input or loses its branches`);
  fail(!hireProof.includes('human-only, system-only and hybrid boundaries'), `${label}: hire-or-automate frame lacks a boundary-specific first proof`);
  await page.locator('.change-decision').click();
  await page.locator('#decision').fill('Hire a revenue operations analyst, automate the work, or use a hybrid path');
  await page.locator('.frame-action').click();
  const commaHireCarry = await page.locator('#result-carry').innerText();
  fail(commaHireCarry.includes(',,') || commaHireCarry.includes('automate the work, automating') || !commaHireCarry.includes('Compare hiring a revenue operations analyst, automating the repeated work and a hybrid path'), `${label}: comma-separated hire branch produced malformed or duplicated copy`);
  await page.keyboard.press('Escape');

  state = await measure(page);
  fail(errors.length > 0, `${label}: runtime errors ${JSON.stringify(errors)}`);
  if (capture) await page.screenshot({ path: `${output}/${label}-full.png`, fullPage: true });
}

async function run(engine, name, viewports) {
  const browser = await engine.launch(name === 'chromium' ? { headless: true, channel: 'chrome' } : { headless: true });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      const capture = name === 'chromium' && captureSizes.has(`${width}x${height}`);
      await exercise(page, `${name}-${width}x${height}`, width, height, capture);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function constrainedModes() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const mode of ['reduced-motion','save-data']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced-motion' ? 'reduce' : 'no-preference' });
      if (mode === 'save-data') await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }));
      const page = await context.newPage();
      await load(page);
      const state = await measure(page);
      assess(state, mode);
      fail(Boolean(state.videoSrc), `${mode}: moving source attached`);
      await page.locator('[data-record-jump="1"]').click();
      fail(!(await page.locator('#record-body-2').isVisible()), `${mode}: record inspection failed`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function noJavaScript() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(origin + candidatePath, { waitUntil: 'load' });
    const state = await measure(page);
    fail(state.x > 1, `no-js: horizontal overflow ${state.x}`);
    fail(Boolean(state.videoSrc), 'no-js: moving source attached');
    fail((await page.locator('#start-here').getAttribute('href')) !== '/?start=1', 'no-js: Start here fallback is not real');
    for (const phrase of required) fail(!state.allText.toLowerCase().includes(phrase.toLowerCase()), `no-js: meaning disappeared "${phrase}"`);
    await context.close();
  } finally { await browser.close(); }
}

async function textScale200() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [width,height] of [[225,568],[320,568],[390,844],[844,390],[1440,900]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await load(page);
      await page.evaluate(() => { document.documentElement.dataset.textScale = '200'; document.documentElement.style.fontSize = '200%'; dispatchEvent(new Event('resize')); });
      await page.waitForTimeout(100);
      const state = await measure(page);
      fail(state.x > 1, `200% ${width}x${height}: horizontal overflow ${state.x}`);
      fail(!state.allText.includes('11 of 14 stopped'), `200% ${width}x${height}: fourth outcome disappeared`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function unavailableMediaAndTouch() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.route('**/*.mp4', route => route.abort('failed'));
    await load(page);
    await page.waitForTimeout(150);
    const state = await measure(page);
    fail(!await page.locator('#film-toggle').isHidden(), 'unavailable-media: false playback control remains');
    fail(!state.poster, 'unavailable-media: poster missing');
    await context.close();

    const touchContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const touchPage = await touchContext.newPage();
    await load(touchPage);
    await touchPage.locator('[data-record-jump="2"]').tap();
    fail(!(await touchPage.locator('#record-body-3').isVisible()), 'touch: third record did not activate');
    await touchPage.locator('#start-here').tap();
    fail(!(await touchPage.locator('#preflight').evaluate(node => node.open)), 'touch: first-action instrument did not open');
    await touchContext.close();
  } finally { await browser.close(); }
}

async function reviewCapture() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1100 } });
    const page = await context.newPage();
    await load(page, reviewPath);
    const geometry = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      frames: [...document.querySelectorAll('iframe')].map(node => ({ frame: node.getBoundingClientRect().toJSON(), window: node.closest('.window').getBoundingClientRect().toJSON() })),
    }));
    fail(geometry.x > 1, `review: horizontal overflow ${geometry.x}`);
    fail(geometry.frames.length !== 3, `review: expected three device surfaces, saw ${geometry.frames.length}`);
    for (const [index,item] of geometry.frames.entries()) fail(item.frame.left < item.window.left - 1 || item.frame.top < item.window.top - 1, `review: frame ${index + 1} is offset outside canvas`);
    for (const frame of page.frames().slice(1)) await frame.evaluate(() => document.querySelector('video')?.pause());
    await page.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
    await context.close();
  } finally { await browser.close(); }
}

try {
  await run(chromium, 'chromium', chromiumViewports);
  await run(webkit, 'webkit', representative);
  await run(firefox, 'firefox', representative);
  await constrainedModes();
  await noJavaScript();
  await textScale200();
  await unavailableMediaAndTouch();
  await reviewCapture();
} finally {
  await server.close();
}

console.log(JSON.stringify({
  artifact: 'COMMERCIAL-READINESS-S3-PROOFGLASS', origin,
  chromium: chromiumViewports.map(([w,h]) => `${w}x${h}`),
  webkit: representative.map(([w,h]) => `${w}x${h}`),
  firefox: representative.map(([w,h]) => `${w}x${h}`),
  evidence: output, physicalDevices: 'not run', failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
