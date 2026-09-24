#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';
import { candidateIdentity } from './award-panel-lib.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
// A hardcoded Windows path creates a literal directory named "C:" when this
// runs on Linux or macOS, which then lands in the working tree ready to be
// committed by accident. The author's path stays the default; every other
// platform gets somewhere it can actually write.
const output = process.env.MINDMAKE_QA_OUTPUT
  ? resolve(process.env.MINDMAKE_QA_OUTPUT)
  : process.platform === 'win32'
    ? 'C:/Users/krish/.scratch/mindmake-case-proof-field-production'
    : resolve(tmpdir(), 'mindmake-case-proof-field-production');
const candidatePath = '/case-studies';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1320,852],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1320,852],[1440,700],[1440,900]];
const fastViewportSetting = process.env.CASE_PROOF_QA_VIEWPORT;
const fastViewport = (fastViewportSetting || '390x844').split('x').map(Number);
const fastBrowser = process.env.CASE_PROOF_QA_FAST;
const failures = [];
const executed = { chromium:0, webkit:0, firefox:0 };
const fail = (condition, message) => { if (condition) failures.push(message); };
const baselineHashes = {
  'prototypes/website-redesign-recovery/case-study-browsing/index.html': '6599ee5cb0fde91351a482a3f212c7cd8d3a3379f615d80b187439037b9b3bbe',
  'prototypes/website-redesign-recovery/case-study-browsing/styles.css': 'ef8e3e4a1e5286a814efd374020ef805c529c2dc82d4071409f85032a30e5b60',
  'prototypes/website-redesign-recovery/case-study-browsing/script.js': '8c51caf1b2a2e96f0caaa0cb43fe369c6050f5cd7b7c6cff66790ab006f96316',
  'prototypes/website-redesign-recovery/case-study-browsing/review.html': '9742ded459c3a14efc34866a1793d15042fc2497d3542621b92bac6360c85368',
  'prototypes/website-redesign-recovery/case-study-browsing/check.mjs': '21c80984d7b414835bf31067e1ac326345f41531296cb468104535f5bc5ef053',
  'prototypes/website-redesign-recovery/case-study-browsing-r2/index.html': '046d219a9287d70d1e3ed2b534282ce1298f891f842ca89711251fdb99772029',
  'prototypes/website-redesign-recovery/case-study-browsing-r2/styles.css': '3387164ba701d417233fb7f03f92f96916a5bfb1ca687ee213d05596a0404beb',
  'prototypes/website-redesign-recovery/case-study-browsing-r2/script.js': '6b37f9b58f88cf4fc34ade4cf0421719738675f910e1c54842d4935acd32676e',
  'prototypes/website-redesign-recovery/case-study-browsing-r2/review.html': 'b318df0581aa87f00f61891422d7c607e861de4d70d79b360d790c94191da4eb',
  'prototypes/website-redesign-recovery/case-study-browsing-r2/check.mjs': 'e90d609cc925ff5f8a49ec547c837d675131f023499ad08029c38b1f2bbd4151',
};
const stories = [
  ['day-one', "A day's work, and a partner signed the month after."],
  ['sellable-expertise', 'Expertise became an offer people could buy.'],
  ['simple-product', 'Two pilots signed during the work.'],
  ['hand-back', "The business was rebuilt and left in the founder's hands."],
  ['own-system', 'Publishing moved from monthly to most days.'],
  ['team-decides', 'Fourteen vendors became three decisions.'],
  ['business-first', 'The team cut eleven tools and put one useful system live.'],
  ['market-moves', 'A new sales path led to a paid publisher test.'],
];

await mkdir(output, { recursive: true });
for (const [relativePath, expected] of Object.entries(baselineHashes)) {
  const actual = createHash('sha256').update(await readFile(new URL(`../../${relativePath}`, import.meta.url))).digest('hex');
  fail(actual !== expected, `locked CASE-PROOF-FIELD-S2 baseline changed: ${relativePath} expected ${expected}, got ${actual}`);
}
const server = await createServer({ root, server: { host:'127.0.0.1', port:0, strictPort:false }, logLevel:'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const { render:renderSsr } = await server.ssrLoadModule('/src/entry-server.tsx');
const ssrCaseStudies = renderSsr(candidatePath);

const visibleGeometry = async (page) => page.evaluate(() => {
  const visible = (element) => {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && rect.width > .5 && rect.height > .5;
  };
  const inside = (inner, outer, tolerance = 1.5) => inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance;
  const textViolations = [];
  for (const boundary of document.querySelectorAll('.region, .expanded, .field-intro')) {
    if (!visible(boundary)) continue;
    const box = boundary.getBoundingClientRect();
    for (const text of boundary.querySelectorAll('strong,small,p,h1,h2,b,a,button,span')) {
      if (!visible(text) || text.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of range.getClientRects()) {
        if (rect.width < .5 || rect.height < .5) continue;
        if (!inside(rect, box) && !text.closest('.mobile-dock')) textViolations.push({ text:text.textContent.trim().slice(0,50), rect:{left:rect.left,right:rect.right,top:rect.top,bottom:rect.bottom}, box:{left:box.left,right:box.right,top:box.top,bottom:box.bottom} });
      }
    }
  }
  const targets = [...document.querySelectorAll('.mm-case-proof-s2 button,.mm-case-proof-s2 a')].filter(visible).map(element => ({ text:(element.textContent || element.getAttribute('aria-label') || '').trim().slice(0,42), rect:element.getBoundingClientRect() })).filter(({rect}) => rect.width < 43.5 || rect.height < 43.5).map(({text,rect}) => ({text,width:rect.width,height:rect.height}));
  const nested = [...document.querySelectorAll('.region,.expanded')].filter(visible).map(element => ({className:element.className,x:element.scrollWidth-element.clientWidth,y:element.scrollHeight-element.clientHeight})).filter(item => item.x > 1 || item.y > 1);
  const iconOverlaps = [...document.querySelectorAll('.region-hit')].filter(visible).map(hit => {
    const copy = hit.querySelector('.region-copy');
    const glyph = hit.querySelector('.region-glyph');
    if (!visible(copy) || !visible(glyph)) return null;
    const a = copy.getBoundingClientRect();
    const b = glyph.getBoundingClientRect();
    const x = Math.min(a.right,b.right) - Math.max(a.left,b.left);
    const y = Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top);
    return x > .5 && y > .5 ? { story:hit.getAttribute('data-open-story'), overlapX:x, overlapY:y, copy:{left:a.left,right:a.right,top:a.top,bottom:a.bottom}, glyph:{left:b.left,right:b.right,top:b.top,bottom:b.bottom} } : null;
  }).filter(Boolean);
  const list = document.querySelector('.region-list');
  const listRect = list?.getBoundingClientRect();
  const fieldRect = document.querySelector('.proof-field')?.getBoundingClientRect();
  const visibleRegionRects = [...document.querySelectorAll('.region')].filter(visible).map(region => region.getBoundingClientRect());
  const fieldCoverage = listRect && fieldRect && visibleRegionRects.length ? {
    rightGap:listRect.right - Math.max(...visibleRegionRects.map(rect => rect.right)),
    bottomGap:listRect.bottom - Math.max(...visibleRegionRects.map(rect => rect.bottom)),
    listEscape:{ left:fieldRect.left-listRect.left, top:fieldRect.top-listRect.top, right:listRect.right-fieldRect.right, bottom:listRect.bottom-fieldRect.bottom },
  } : { rightGap:0, bottomGap:0, listEscape:{left:0,top:0,right:0,bottom:0} };
  return {
    mode:document.querySelector('.proof-shell').dataset.mode,
    width:innerWidth,height:innerHeight,
    documentX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    proofShellHeight:document.querySelector('.proof-shell')?.getBoundingClientRect().height || 0,
    textViolations,targets,nested,iconOverlaps,fieldCoverage,
    visibleRegions:[...document.querySelectorAll('.region-hit')].filter(visible).length,
    selected:[...document.querySelectorAll('.region.is-selected')].filter(visible).length,
    activeElement:document.activeElement?.getAttribute('data-open-story') || document.activeElement?.id || document.activeElement?.textContent?.trim().slice(0,40),
  };
});

const assess = (state, label, { fixedHeight = false } = {}) => {
  fail(state.documentX > 1, `${label}: horizontal document overflow ${state.documentX}`);
  if (fixedHeight) fail(Math.abs(state.proofShellHeight - state.height) > 1, `${label}: proof surface height ${state.proofShellHeight} does not fit viewport ${state.height}`);
  fail(state.textViolations.length > 0, `${label}: painted text escapes its surface ${JSON.stringify(state.textViolations.slice(0,3))}`);
  fail(state.targets.length > 0, `${label}: undersized controls ${JSON.stringify(state.targets.slice(0,5))}`);
  fail(state.nested.length > 0, `${label}: clipped or nested overflow ${JSON.stringify(state.nested.slice(0,4))}`);
  fail(state.iconOverlaps.length > 0, `${label}: text overlaps its custom icon ${JSON.stringify(state.iconOverlaps.slice(0,4))}`);
  fail(Object.values(state.fieldCoverage.listEscape).some(value => value > 1.5), `${label}: proof grid escapes its bounded field ${JSON.stringify(state.fieldCoverage.listEscape)}`);
  if (state.mode === 'overview') fail(state.fieldCoverage.rightGap > 2.25 || state.fieldCoverage.bottomGap > 2.25, `${label}: proof cells leave an uncovered field edge ${JSON.stringify(state.fieldCoverage)}`);
};

async function load(page, url = candidatePath) {
  await page.goto(origin + url, { waitUntil:'domcontentloaded' });
  await page.locator('.mm-case-proof-s2').waitFor({ state:'visible' });
  await page.evaluate(() => document.fonts?.ready);
  // aria-expanded is applied only by the hydrated interaction controller.
  // Waiting for it prevents a fast synthetic Enter from following the SSR
  // fallback anchor before the client contract is ready on slower engines.
  await page.locator('[data-open-story="day-one"][aria-expanded]').waitFor({ state:'attached' });
}

async function settleLayout(page) {
  await page.waitForTimeout(40);
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming?.().endTime));
    await Promise.race([
      Promise.all(finite.map(animation => animation.finished.catch(() => {}))),
      new Promise(resolve => setTimeout(resolve, 1200)),
    ]);
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function settleFullPageReveals(page) {
  await page.evaluate(async () => {
    const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    for (let y = 0; y <= maximum; y += Math.max(160, Math.floor(innerHeight * .72))) {
      scrollTo(0, Math.min(y, maximum));
      await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }
    scrollTo(0, maximum);
  });
  await page.waitForTimeout(650);
  await page.evaluate(() => scrollTo(0, 0));
  await settleLayout(page);
}

async function verifyTextScale(page, label) {
  await page.evaluate(() => {
    const selector = '.mm-case-proof-s2 h1,.mm-case-proof-s2 h2,.mm-case-proof-s2 p,.mm-case-proof-s2 small,.mm-case-proof-s2 strong,.mm-case-proof-s2 b,.mm-case-proof-s2 a,.mm-case-proof-s2 button';
    for (const element of document.querySelectorAll(selector)) {
      const size = Number.parseFloat(getComputedStyle(element).fontSize);
      if (Number.isFinite(size)) element.style.fontSize = `${size * 2}px`;
    }
  });
  await settleLayout(page);
  const state = await visibleGeometry(page);
  assess(state, `${label} 200% text`);
}

async function verifyRail(page, label) {
  /* No expansion step on a phone: the record is whole on the card, the rail is
     a real scroll container, and its controls are on screen from the first
     frame rather than appearing once something is open. */
  const rail = await page.evaluate(() => {
    const list = document.querySelector('.region-list');
    const dock = document.querySelector('.mobile-dock');
    const seg = document.querySelector('[data-rail-segments]');
    const onScreen = (el) => { if (!el) return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.bottom <= window.innerHeight + 1 && b.right <= window.innerWidth + 1; };
    return {
      overflowX: getComputedStyle(list).overflowX,
      scrolls: list.scrollWidth > list.clientWidth + 1,
      widerThanViewport: list.clientWidth > window.innerWidth,
      dockOnScreen: onScreen(dock),
      segmentsOnScreen: onScreen(seg),
      openPanels: [...document.querySelectorAll('.expanded')].filter((e) => getComputedStyle(e).display !== 'none').length,
      inTheWay: [...document.querySelectorAll('.region, .region .expanded, .region-hit')]
        .filter((e) => { const c = getComputedStyle(e); return ['auto', 'scroll', 'hidden'].includes(c.overflowY) || ['auto', 'scroll', 'hidden'].includes(c.overflowX); }).length,
    };
  });
  fail(rail.overflowX !== 'auto' || !rail.scrolls, `${label}: the rail is not a horizontal scroll container`);
  fail(rail.widerThanViewport, `${label}: the rail is wider than the viewport instead of scrolling inside it`);
  fail(!rail.dockOnScreen, `${label}: the rail's position and arrows are not on screen`);
  fail(!rail.segmentsOnScreen, `${label}: the segment rail is not on screen`);
  fail(rail.openPanels !== 8, `${label}: ${rail.openPanels} of 8 records are whole on the card`);
  fail(rail.inTheWay !== 0, `${label}: ${rail.inTheWay} scroll containers sit between a thumb and the rail`);
  const before = (await page.locator('[data-mobile-position]').innerText()).trim();
  await page.locator('[data-mobile-next]').click();
  await settleLayout(page);
  const after = (await page.locator('[data-mobile-position]').innerText()).trim();
  fail(before === after, `${label}: the rail control did not advance the rail (held at ${before})`);
}

async function verifyKeyboardAndHistory(page, label) {
  const opener = page.locator('[data-open-story="business-first"]');
  await opener.focus();
  await page.keyboard.press('Enter');
  await page.locator('.proof-shell[data-mode="story"]').waitFor({ state:'visible' });
  await settleLayout(page);
  fail(!await page.locator('#title-business-first').evaluate(element => element === document.activeElement), `${label}: Enter did not move focus into the opened story`);
  await page.keyboard.press('Escape');
  await page.locator('.proof-shell[data-mode="overview"]').waitFor({ state:'visible' });
  await settleLayout(page);
  fail(!await opener.evaluate(element => element === document.activeElement), `${label}: Escape did not restore the story opener`);

  await opener.focus();
  await page.keyboard.press(' ');
  await page.locator('.proof-shell[data-mode="story"]').waitFor({ state:'visible' });
  await settleLayout(page);
  fail(!await page.locator('#title-business-first').evaluate(element => element === document.activeElement), `${label}: Space did not move focus into the opened story`);
  await page.goBack({ waitUntil:'domcontentloaded' });
  await page.locator('.proof-shell[data-mode="overview"]').waitFor({ state:'visible' });
  await settleLayout(page);
  fail(!await opener.evaluate(element => element === document.activeElement), `${label}: browser Back did not restore the story opener`);
}

async function verifyDrum(page, label) {
  await load(page);
  const drum = page.locator('.mm-drum');
  await drum.scrollIntoViewIfNeeded();
  const undersized = await page.locator('.mm-drum-motion,.mm-drum-arrows button,.mm-voice-more').evaluateAll(elements => elements.filter(element => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0 && (rect.width < 43.5 || rect.height < 43.5);
  }).map(element => ({ label:element.getAttribute('aria-label') || element.textContent.trim(), rect:element.getBoundingClientRect().toJSON() })));
  fail(undersized.length > 0, `${label}: testimonial controls are undersized ${JSON.stringify(undersized.slice(0,4))}`);
  const tabStops = await page.locator('.mm-voice-more').evaluateAll(elements => elements.filter(element => element.tabIndex === 0).length);
  fail(tabStops > 1, `${label}: testimonial rail exposes ${tabStops} repetitive quote tab stops`);
  await drum.hover();
  await page.waitForTimeout(100);
  const before = await page.locator('.mm-drum-track').evaluate(element => getComputedStyle(element).transform);
  await page.waitForTimeout(450);
  const after = await page.locator('.mm-drum-track').evaluate(element => getComputedStyle(element).transform);
  fail(before !== after, `${label}: testimonial rail moved while hovered (${before} -> ${after})`);
  await page.locator('.mm-drum-motion').click();
  fail((await page.locator('.mm-drum-motion').getAttribute('aria-pressed')) !== 'true', `${label}: testimonial pause control did not expose paused state`);
  const pausedCards = await drum.evaluate(element => {
    const frame = element.getBoundingClientRect();
    return [...element.querySelectorAll('.mm-voice')].map(card => {
      const rect = card.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        complete: rect.left >= frame.left - 1 && rect.right <= frame.right + 1,
      };
    });
  });
  fail(!pausedCards.some(card => card.complete), `${label}: testimonial pause left every card clipped ${JSON.stringify(pausedCards.slice(0, 3))}`);
  const disclosure = page.locator('.mm-voice-more[aria-expanded]').first();
  await disclosure.click();
  fail((await disclosure.getAttribute('aria-expanded')) !== 'true', `${label}: testimonial disclosure did not expose expanded state`);
  const dialog = page.locator('.mm-voice-panel[role="dialog"]');
  fail(await dialog.count() !== 1 || !await dialog.isVisible(), `${label}: testimonial disclosure did not reveal the full quote`);
  await page.keyboard.press('Escape');
  fail((await disclosure.getAttribute('aria-expanded')) !== 'false', `${label}: testimonial disclosure did not recover collapsed state`);
  await page.waitForFunction(() => document.activeElement?.matches('.mm-voice-more[aria-expanded]')).catch(() => undefined);
  fail(!await disclosure.evaluate(element => element === document.activeElement), `${label}: testimonial disclosure did not restore focus after Escape`);
}

async function exercise(page, label, width, height) {
  const compact = width <= 860;
  await load(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const skipIsFirst = await page.evaluate(() => {
    const selector = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
    return document.querySelector(selector) === document.querySelector('.mm-skip');
  });
  fail(!skipIsFirst, `${label}: Skip to content is not the first sequentially focusable DOM control`);
  // Direct focus avoids Playwright's repeated-context browser-chrome focus
  // state, which can consume the first synthetic Tab outside the document.
  // The DOM-order assertion above protects sequential order; this verifies the
  // link itself moves focus to the main landmark in every engine.
  await page.locator('.mm-skip').focus();
  await page.keyboard.press('Enter');
  fail(!await page.locator('#main').evaluate(element => element === document.activeElement), `${label}: Skip to content did not focus the main landmark`);
  // The skip-link assertion intentionally changes the fragment to #main.
  // Reload the clean candidate state before testing the proof field's own
  // history machine so the two independent contracts cannot contaminate one
  // another in WebKit.
  await load(page);
  const regionCount = await page.locator('.mm-case-proof-s2 .region').count();
  fail(regionCount !== 8, `${label}: renders ${regionCount} proof regions, expected 8`);
  await page.waitForFunction(() => [...document.querySelectorAll('.region-film')].some(film => !film.paused && film.readyState >= 2), null, { timeout:5000 }).catch(() => undefined);
  const filmState = await page.evaluate(async () => {
    await new Promise(resolve => setTimeout(resolve, 80));
    const films = [...document.querySelectorAll('.region-film')];
    return {
      count:films.length,
      sources:[...new Set(films.map(film => film.dataset.filmSrc))],
      posters:films.filter(film => Boolean(film.getAttribute('poster'))).length,
      contract:films.every(film => film.muted && film.loop && film.hasAttribute('playsinline') && film.getAttribute('aria-hidden') === 'true' && film.tabIndex === -1),
      moving:films.filter(film => !film.paused && film.readyState >= 2).length,
      mode:document.querySelector('.proof-shell')?.dataset.filmMotion,
    };
  });
  fail(filmState.count !== 8, `${label}: expected eight film-backed proof regions, found ${filmState.count}`);
  fail(filmState.sources.length !== 6, `${label}: expected six distinct machinery films, found ${filmState.sources.length}`);
  fail(filmState.posters !== 8, `${label}: every film does not have a still fallback`);
  fail(!filmState.contract, `${label}: muted/loop/inline/decorative film contract failed`);
  fail(filmState.mode !== 'moving' || filmState.moving < 1, `${label}: film motion did not start (${JSON.stringify(filmState)})`);
  fail(filmState.moving > (compact ? 2 : 4), `${label}: film decoder budget exceeded (${JSON.stringify(filmState)})`);
  const visibleCopy = (await page.locator('body').innerText()).toLowerCase();
  const prohibitedCopy = [
    'open any result. move its mechanism. return without losing your place.',
    'form shows the kind of change, never its size.',
    'illustrative machinery films · never client footage.',
    'fourteen tools running',
    'three kept, eleven stopped',
    'the drawing shows the kind of recorded change, not its size.',
    'eight pieces of work. eight recorded changes.',
    'recorded change',
  ];
  for (const copy of prohibitedCopy) fail(visibleCopy.includes(copy), `${label}: backup-singer copy remains visible: ${copy}`);
  fail(await page.locator('.field-note,.field-legends').count() !== 0, `${label}: explanatory proof-field scaffolding remains in the production DOM`);
  for (const [, result] of stories) fail(!(await page.locator('body').innerText()).includes(result), `${label}: missing canonical result ${result}`);
  let state = await visibleGeometry(page);
  assess(state, `${label} overview`, { fixedHeight:!compact });
  fail(state.visibleRegions !== 8, `${label}: overview exposes ${state.visibleRegions} direct story controls, expected 8`);
  fail(await page.locator('[data-case-archive]').count() !== 0, `${label}: a route to the removed archive survives`);
  for (const [id] of stories) {
    fail(await page.locator(`.expanded#record-${id}`).count() !== 1, `${label}: #record-${id} does not resolve inside the proof field`);
  }
  fail(await page.locator('.region-copy cite').count() !== 8, `${label}: the cold field does not attribute all eight results`);
  fail(await page.locator('.expanded blockquote').count() !== 8, `${label}: the records do not carry their testimony`);
  fail(await page.locator('.expanded [data-fig]').count() !== 8, `${label}: the records do not carry a figure bound to story.figure`);
  fail(await page.locator('.region-glyph, .mechanism').count() !== 0, `${label}: the retired mechanism glyph survives`);

  if (compact && height >= width) {
    await verifyTextScale(page, label);
    await load(page);
  }

  if (!compact) {
    await page.locator('[data-open-story="day-one"]').focus();
    await page.keyboard.press('End');
    fail((await page.evaluate(() => document.activeElement?.getAttribute('data-open-story'))) !== 'market-moves', `${label}: End did not reach story 8`);
    await page.keyboard.press('1');
    fail((await page.evaluate(() => document.activeElement?.getAttribute('data-open-story'))) !== 'day-one', `${label}: numeric shortcut did not reach story 1`);
  }

  if (!compact) await verifyKeyboardAndHistory(page, label);
  else await verifyRail(page, label);

  /* The open/close cycle, its URL state and its phase toggle are a desktop
     composition. On a phone there is no expansion step at all: every record is
     already whole on its card, so there is nothing to open, nothing to encode
     and nothing to come back from. The rail has its own checks above. */
  if (!compact) {
    await page.locator('[data-open-story="business-first"]').click();
    await settleLayout(page);
    state = await visibleGeometry(page);
    assess(state, `${label} open`, { fixedHeight:true });
    fail(state.mode !== 'story' || state.selected !== 1, `${label}: story did not open exactly once`);
    fail(!page.url().includes('story=business-first&phase=result'), `${label}: result state not encoded in URL`);
    fail(await page.locator('[data-story="business-first"] .mm-fig-marks i').count() !== 14, `${label}: the business-first figure does not show 14 inputs`);
    fail(await page.locator('[data-story="business-first"] .mm-fig-marks i.is-kept').count() !== 3, `${label}: the business-first figure does not keep exactly 3`);
    fail(await page.locator('[data-story="business-first"] .endpoint-labels').count() !== 0, `${label}: business-first repeats the change in backup labels`);
    fail(!await page.locator(`#title-business-first`).evaluate(element => element === document.activeElement), `${label}: focus did not enter opened story`);
    fail((await page.locator(`#title-business-first`).evaluate(element => getComputedStyle(element).outlineStyle)) !== 'none', `${label}: focused result heading shows a browser-default outline`);

    await page.locator('[data-story="business-first"] [data-toggle-phase]').click();
    fail(!page.url().includes('phase=start'), `${label}: starting phase not encoded in URL`);
    fail((await page.locator('[data-story="business-first"] [data-toggle-phase]').innerText()).toLowerCase() !== 'show the result', `${label}: phase control did not expose inverse`);
    await page.reload({ waitUntil:'commit' });
    await page.locator('.proof-shell[data-mode="story"]').waitFor({ state:'visible' });
    await page.evaluate(() => document.fonts?.ready);
    fail((await page.locator('.proof-shell').getAttribute('data-mode')) !== 'story', `${label}: reload lost selected story`);
    fail(!page.url().includes('story=business-first&phase=start'), `${label}: reload lost stable phase`);
    fail((await page.locator('[data-story="business-first"] [data-toggle-phase]').innerText()).toLowerCase() !== 'show the result', `${label}: reload did not restore start phase`);

    /* The exit Krish could not find. It is a control, not a caption. */
    const close = page.locator('.region.is-selected .expanded-close');
    fail(!(await close.getAttribute('aria-label')), `${label}: the close control has no accessible name`);
    const closeBox = await close.boundingBox();
    fail(!closeBox || closeBox.width < 44 || closeBox.height < 44, `${label}: the close control is smaller than 44px`);
    await close.click();
    await settleLayout(page);
    state = await visibleGeometry(page);
    assess(state, `${label} returned`, { fixedHeight:true });
    fail(state.mode !== 'overview' || state.visibleRegions !== 8, `${label}: return did not restore the full field`);
    fail(state.activeElement !== 'business-first', `${label}: the close control did not restore originating focus (${state.activeElement})`);
  } else {
    const overlap = await page.evaluate(() => {
      const notice = document.querySelector('.mm-cookie-notice');
      const dock = document.querySelector('.mobile-dock');
      if (!notice || !dock || dock.hidden) return 0;
      const a = notice.getBoundingClientRect();
      const b = dock.getBoundingClientRect();
      return Math.max(0, Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top)) * Math.max(0, Math.min(a.right,b.right) - Math.max(a.left,b.left));
    });
    fail(overlap > 1, `${label}: privacy notice overlaps the rail dock by ${overlap}px²`);
  }

  if (!compact) await page.locator('[data-open-story="team-decides"]').click();
  await settleLayout(page);
  const marks = page.locator('[data-story="team-decides"] .mm-fig-marks i');
  fail(await marks.count() !== 14, `${label}: the decision figure does not show 14 inputs`);
  fail(await page.locator('[data-story="team-decides"] .mm-fig-marks i.is-kept').count() !== 3, `${label}: the decision figure does not keep 3`);
  fail((await page.locator('[data-story="team-decides"] .mm-fig-pair').innerText()).replace(/\s+/g, '') !== '14→3', `${label}: the decision figure does not state 14 to 3`);
  fail((await page.locator('[data-story="team-decides"] .region-hit').getAttribute('href')) !== '#record-team-decides', `${label}: the tile fallback no longer names its record`);
  fail(errors.length > 0, `${label}: runtime errors ${errors.join(' | ')}`);
}

async function run(browserType, name, viewports) {
  const launchOptions = { headless:true, ...(browserType === chromium ? { channel:'chrome' } : {}) };
  const browser = await browserType.launch(launchOptions);
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'no-preference' });
      const page = await context.newPage();
      page.setDefaultTimeout(45000);
      page.setDefaultNavigationTimeout(45000);
      const label = `${name} ${width}x${height}`;
      console.log(`Checking ${label}`);
      await exercise(page,label,width,height);
      executed[name] += 1;
      if (name === 'chromium' && ((width === 390 && height === 844) || (width === 1440 && height === 700))) await verifyDrum(page, label);
      if (name === 'chromium' && [[320,568],[390,844],[844,390],[1440,700]].some(([w,h]) => w===width && h===height)) {
        await load(page);
        await settleFullPageReveals(page);
        await page.screenshot({ path:`${output}/${name}-overview-${width}x${height}.png`, fullPage:true });
        /* The open frame is a desktop frame. On a phone the cold state is the
           open state, so the second capture is the rail a card along. */
        if (width > 860) {
          await page.locator('[data-open-story="business-first"]').click();
        } else {
          await page.locator('[data-mobile-next]').click();
        }
        await settleLayout(page);
        await settleFullPageReveals(page);
        await page.screenshot({ path:`${output}/${name}-open-${width}x${height}.png`, fullPage:true });
      }
      await context.close();
    }
  } finally { await browser.close(); }
}

async function reducedMotion() {
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  try {
    const context = await browser.newContext({ viewport:{width:390,height:844}, reducedMotion:'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(45000);
    await load(page, `${candidatePath}#story=day-one&phase=result`);
    const state = await page.evaluate(() => {
      // The glyph this used to interrogate is gone. Its two claims transfer to
      // the figure that replaced it: nothing animates under reduced motion, and
      // the endpoints on screen are the record's own words rather than a
      // second copy of them kept beside the drawing.
      const bar = document.querySelector('[data-story="day-one"] .mm-fig-bar');
      const labels = document.querySelectorAll('[data-story="day-one"] .mm-fig > p:last-child span');
      const films = [...document.querySelectorAll('.region-film')];
      return {
        duration: getComputedStyle(bar).transitionDuration,
        before: labels[0]?.textContent ?? '',
        after: labels[1]?.textContent ?? '',
        filmMode: document.querySelector('.proof-shell').dataset.filmMotion,
        movingFilms: films.filter(film => !film.paused).length,
      };
    });
    fail(Number.parseFloat(state.duration) > .001, `reduced motion: transition remains ${state.duration}`);
    fail(!state.before.includes('Two quarters') || !state.after.includes('One day'), 'reduced motion: truthful endpoints missing');
    fail(state.filmMode !== 'still' || state.movingFilms !== 0, `reduced motion: films still moving ${JSON.stringify(state)}`);
    fail(await page.locator('.region-film[src]').count() !== 0, 'reduced motion: playback sources were attached');
    await context.close();
  } finally { await browser.close(); }
}

async function noJavaScript() {
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  try {
    const context = await browser.newContext({ viewport:{width:390,height:844}, javaScriptEnabled:false });
    const page = await context.newPage();
    await page.setContent(`<!doctype html><html><body>${ssrCaseStudies}</body></html>`, { waitUntil:'domcontentloaded' });
    const controls = page.locator('[data-open-story]');
    fail(await controls.count() !== 8, `no JavaScript: expected eight useful story links, found ${await controls.count()}`);
    const invalid = await controls.evaluateAll(elements => elements.filter(element => element.tagName !== 'A' || !element.getAttribute('href')?.startsWith('#record-')).length);
    fail(invalid > 0, `no JavaScript: ${invalid} primary story controls are not source-record links`);
    // This used to click the first link and check the URL. In S2 that was the
    // whole contract: the record lived in a separate archive, so the fallback
    // had to carry you there. S3 renders every record open when scripting is
    // off, which makes the teaser above it redundant and — deliberately —
    // empty, so it is no longer a thing you can click.
    //
    // What a reader without scripting actually needs is stronger than one
    // working link, and it is what gets asserted now: every one of the eight
    // anchors resolves to a record that is really on the page, with real
    // height, carrying its own result, testimony and figure. A link that
    // navigates to a hidden element would have passed the old check.
    const reachable = await page.evaluate(() => {
      const out = [];
      for (const control of document.querySelectorAll('[data-open-story]')) {
        const href = control.getAttribute('href') || '';
        const target = document.getElementById(href.slice(1));
        if (!target) { out.push(`${href}: no such record`); continue; }
        const style = getComputedStyle(target);
        const box = target.getBoundingClientRect();
        if (style.display === 'none' || style.visibility === 'hidden' || box.height < 40) {
          out.push(`${href}: record is not rendered (${style.display}, ${Math.round(box.height)}px)`);
          continue;
        }
        if (!target.querySelector('blockquote')) out.push(`${href}: record carries no testimony`);
        if (!target.querySelector('[data-fig]')) out.push(`${href}: record carries no figure`);
      }
      return out;
    });
    for (const problem of reachable) fail(true, `no JavaScript: ${problem}`);
    await context.close();
  } finally { await browser.close(); }
}

async function verifyBlindPanelTargetCorrections() {
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  try {
    const cases = [
      { route:'/contact', viewport:{ width:390, height:844 }, selector:'.mm-contact-form small a', label:'contact privacy link' },
      { route:'/ai-gtm', viewport:{ width:1440, height:900 }, selector:'.mm-locked-gtm .evidence-body a', label:'GTM evidence source link' },
    ];
    for (const check of cases) {
      const context = await browser.newContext({ viewport:check.viewport });
      const page = await context.newPage();
      await page.goto(origin + check.route, { waitUntil:'domcontentloaded' });
      if (check.route === '/ai-gtm') await page.locator('.evidence-drawer summary').click();
      const control = page.locator(check.selector).first();
      await control.waitFor({ state:'visible' });
      const rect = await control.evaluate(element => element.getBoundingClientRect().toJSON());
      fail(rect.width < 43.5 || rect.height < 43.5, `${check.label}: undersized at ${rect.width}x${rect.height}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

try {
  if (fastBrowser) {
    const browserType = fastBrowser === 'webkit' ? webkit : fastBrowser === 'firefox' ? firefox : chromium;
    const browserName = fastBrowser === '1' ? 'chromium' : fastBrowser;
    const matrix = fastViewportSetting ? [fastViewport] : browserType === chromium ? chromiumViewports : representative;
    await run(browserType, browserName, matrix);
    if (browserType === chromium) {
      await reducedMotion();
      await noJavaScript();
      await verifyBlindPanelTargetCorrections();
    }
  } else {
    await run(chromium,'chromium',chromiumViewports);
    await run(webkit,'webkit',representative);
    await run(firefox,'firefox',representative);
    await reducedMotion();
    await noJavaScript();
    await verifyBlindPanelTargetCorrections();
  }
} finally {
  await server.close();
}

const report = {
  artifact:'CASE-PROOF-FIELD-S2-PRODUCTION',
  generatedAt:new Date().toISOString(),
  origin,
  candidate:await candidateIdentity(),
  ...executed,
  evidence:output,
  physicalDevices:'not run; automation and emulation do not satisfy the physical-device release gate',
  failures,
};
await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
