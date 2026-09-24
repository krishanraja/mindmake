#!/usr/bin/env node
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-case-proof-field-s2';
const candidatePath = '/prototypes/website-redesign-recovery/case-study-browsing/index.html';
const reviewPath = '/prototypes/website-redesign-recovery/case-study-browsing/review.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1320,852],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1320,852],[1440,700],[1440,900]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const stories = [
  ['day-one', "A day's work, and a partner signed the month after."],
  ['sellable-expertise', 'Expertise became an offer people could buy.'],
  ['simple-product', 'Two pilots signed during the work.'],
  ['hand-back', "The business was rebuilt and left in the founder's hands."],
  ['own-system', 'Publishing moved from monthly to most days.'],
  ['team-decides', 'Fourteen vendors became three decisions.'],
  ['business-first', 'Eleven tools stopped. One useful system went live.'],
  ['market-moves', 'A new sales path led to a paid publisher test.'],
];

await mkdir(output, { recursive: true });
const server = await createServer({ root, server: { host:'127.0.0.1', port:0, strictPort:false }, logLevel:'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

const visibleGeometry = async (page) => page.evaluate(() => {
  const visible = (element) => {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && rect.width > .5 && rect.height > .5;
  };
  const inside = (inner, outer, tolerance = 1.5) => inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance;
  const textViolations = [];
  for (const boundary of document.querySelectorAll('.region, .expanded, .site-head, .field-intro')) {
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
  const targets = [...document.querySelectorAll('button,a')].filter(visible).map(element => ({ text:(element.textContent || element.getAttribute('aria-label') || '').trim().slice(0,42), rect:element.getBoundingClientRect() })).filter(({rect}) => rect.width < 43.5 || rect.height < 43.5).map(({text,rect}) => ({text,width:rect.width,height:rect.height}));
  const nested = [...document.querySelectorAll('.region,.expanded,.proof-field')].filter(visible).map(element => ({className:element.className,x:element.scrollWidth-element.clientWidth,y:element.scrollHeight-element.clientHeight})).filter(item => item.x > 1 || item.y > 1);
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
  const visibleRegionRects = [...document.querySelectorAll('.region')].filter(visible).map(region => region.getBoundingClientRect());
  const fieldCoverage = listRect && visibleRegionRects.length ? {
    rightGap:listRect.right - Math.max(...visibleRegionRects.map(rect => rect.right)),
    bottomGap:listRect.bottom - Math.max(...visibleRegionRects.map(rect => rect.bottom)),
  } : { rightGap:0, bottomGap:0 };
  return {
    mode:document.querySelector('.proof-shell').dataset.mode,
    width:innerWidth,height:innerHeight,
    documentX:document.documentElement.scrollWidth-document.documentElement.clientWidth,
    documentY:document.documentElement.scrollHeight-document.documentElement.clientHeight,
    textViolations,targets,nested,iconOverlaps,fieldCoverage,
    visibleRegions:[...document.querySelectorAll('.region-hit')].filter(visible).length,
    selected:[...document.querySelectorAll('.region.is-selected')].filter(visible).length,
    activeElement:document.activeElement?.getAttribute('data-open-story') || document.activeElement?.id || document.activeElement?.textContent?.trim().slice(0,40),
  };
});

const assess = (state, label, { fixedHeight = false } = {}) => {
  fail(state.documentX > 1, `${label}: horizontal document overflow ${state.documentX}`);
  if (fixedHeight) fail(state.documentY > 1, `${label}: desktop document overflow ${state.documentY}`);
  fail(state.textViolations.length > 0, `${label}: painted text escapes its surface ${JSON.stringify(state.textViolations.slice(0,3))}`);
  fail(state.targets.length > 0, `${label}: undersized controls ${JSON.stringify(state.targets.slice(0,5))}`);
  fail(state.nested.length > 0, `${label}: clipped or nested overflow ${JSON.stringify(state.nested.slice(0,4))}`);
  fail(state.iconOverlaps.length > 0, `${label}: text overlaps its custom icon ${JSON.stringify(state.iconOverlaps.slice(0,4))}`);
  if (state.mode === 'overview') fail(state.fieldCoverage.rightGap > 2 || state.fieldCoverage.bottomGap > 2, `${label}: proof cells leave an uncovered field edge ${JSON.stringify(state.fieldCoverage)}`);
};

async function load(page, url = candidatePath) {
  await page.goto(origin + url, { waitUntil:'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
}

async function settleLayout(page) {
  await page.waitForTimeout(40);
  await page.evaluate(async () => {
    const finite = document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getTiming?.().duration));
    await Promise.all(finite.map(animation => animation.finished.catch(() => {})));
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
}

async function exercise(page, label, width, height) {
  const compact = width <= 860;
  await load(page);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  fail(await page.locator('.region').count() !== 8, `${label}: does not render eight regions`);
  const filmState = await page.evaluate(async () => {
    await new Promise(resolve => setTimeout(resolve, 220));
    const films = [...document.querySelectorAll('.region-film')];
    return {
      count:films.length,
      sources:[...new Set(films.map(film => film.querySelector('source')?.getAttribute('src')))],
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
  fail(!(await page.locator('.field-legends').innerText()).toLowerCase().includes('never client footage'), `${label}: illustrative-film truth label missing`);
  for (const [, result] of stories) fail(!(await page.locator('body').innerText()).includes(result), `${label}: missing canonical result ${result}`);
  let state = await visibleGeometry(page);
  assess(state, `${label} overview`, { fixedHeight:!compact });
  fail(state.visibleRegions !== 8, `${label}: overview exposes ${state.visibleRegions} direct story controls, expected 8`);
  fail((await page.locator('.archive-link').getAttribute('href')) !== '/case-studies', `${label}: archive route missing`);

  if (!compact) {
    await page.locator('[data-open-story="day-one"]').focus();
    await page.keyboard.press('End');
    fail((await page.evaluate(() => document.activeElement?.getAttribute('data-open-story'))) !== 'market-moves', `${label}: End did not reach story 8`);
    await page.keyboard.press('1');
    fail((await page.evaluate(() => document.activeElement?.getAttribute('data-open-story'))) !== 'day-one', `${label}: numeric shortcut did not reach story 1`);
  }

  await page.locator('[data-open-story="business-first"]').click();
  await settleLayout(page);
  state = await visibleGeometry(page);
  assess(state, `${label} open`, { fixedHeight:!compact });
  fail(state.mode !== 'story' || state.selected !== 1, `${label}: story did not open exactly once`);
  fail(!page.url().includes('story=business-first&phase=result'), `${label}: result state not encoded in URL`);
  fail(await page.locator('[data-story="business-first"] .mechanism .switch').count() !== 14, `${label}: switch proof does not contain 14 tools`);
  fail(await page.locator('[data-story="business-first"] .mechanism .switch:not(.is-off)').count() !== 3, `${label}: switch proof does not keep exactly 3 tools`);
  fail(!(await page.locator('[data-story="business-first"] .truth-line').innerText()).toLowerCase().includes('kind of recorded change, not its size'), `${label}: truth legend missing`);
  fail(!await page.locator(`#title-business-first`).evaluate(element => element === document.activeElement), `${label}: focus did not enter opened story`);
  fail((await page.locator(`#title-business-first`).evaluate(element => getComputedStyle(element).outlineStyle)) !== 'none', `${label}: focused result heading shows a browser-default outline`);

  await page.locator('[data-story="business-first"] [data-toggle-phase]').click();
  fail(!page.url().includes('phase=start'), `${label}: starting phase not encoded in URL`);
  fail((await page.locator('[data-story="business-first"] [data-toggle-phase]').innerText()).toLowerCase() !== 'show recorded result', `${label}: phase control did not expose inverse`);
  await page.reload({ waitUntil:'networkidle' });
  await page.evaluate(() => document.fonts?.ready);
  fail((await page.locator('.proof-shell').getAttribute('data-mode')) !== 'story', `${label}: reload lost selected story`);
  fail(!page.url().includes('story=business-first&phase=start'), `${label}: reload lost stable phase`);
  fail((await page.locator('[data-story="business-first"] [data-toggle-phase]').innerText()).toLowerCase() !== 'show recorded result', `${label}: reload did not restore start phase`);

  if (compact) {
    fail(await page.locator('.mobile-dock').isHidden(), `${label}: compact story dock is hidden`);
    await page.locator('[data-mobile-next]').click();
    await page.waitForTimeout(100);
    fail(!page.url().includes('story=market-moves'), `${label}: mobile Next did not advance`);
    await page.locator('[data-mobile-prev]').click();
    fail(!page.url().includes('story=business-first'), `${label}: mobile Previous did not restore`);
    await page.locator('[data-mobile-back]').click();
  } else {
    await page.keyboard.press('Escape');
  }
  await settleLayout(page);
  state = await visibleGeometry(page);
  assess(state, `${label} returned`, { fixedHeight:!compact });
  fail(state.mode !== 'overview' || state.visibleRegions !== 8, `${label}: return did not restore the full field`);
  fail(state.activeElement !== 'business-first', `${label}: return did not restore originating focus (${state.activeElement})`);

  await page.locator('[data-open-story="team-decides"]').click();
  fail(await page.locator('[data-story="team-decides"] .mechanism circle').count() !== 14, `${label}: decision proof does not show 14 inputs`);
  fail(await page.locator('[data-story="team-decides"] .mechanism .phase-b path').count() !== 3, `${label}: decision proof does not show 3 decision paths`);
  fail(errors.length > 0, `${label}: runtime errors ${errors.join(' | ')}`);
}

async function run(browserType, name, viewports) {
  const browser = await browserType.launch({ headless:true, ...(browserType === chromium ? { channel:'chrome' } : {}) });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport:{width,height}, reducedMotion:'no-preference' });
      const page = await context.newPage();
      const label = `${name} ${width}x${height}`;
      await exercise(page,label,width,height);
      if (name === 'chromium' && [[320,568],[390,844],[844,390],[1440,700]].some(([w,h]) => w===width && h===height)) {
        await load(page);
        await page.screenshot({ path:`${output}/${name}-overview-${width}x${height}.png`, fullPage:true });
        await page.locator('[data-open-story="business-first"]').click();
        await settleLayout(page);
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
    await load(page, `${candidatePath}#story=day-one&phase=result`);
    const state = await page.evaluate(() => {
      const element = document.querySelector('.phase-b');
      const films = [...document.querySelectorAll('.region-film')];
      return { duration:getComputedStyle(element).transitionDuration, before:document.querySelector('.endpoint-labels span:first-child').textContent, after:document.querySelector('.endpoint-labels span:last-child').textContent, filmMode:document.querySelector('.proof-shell').dataset.filmMotion, movingFilms:films.filter(film => !film.paused).length };
    });
    fail(Number.parseFloat(state.duration) > .001, `reduced motion: transition remains ${state.duration}`);
    fail(!state.before.includes('Two quarters') || !state.after.includes('One day'), 'reduced motion: truthful endpoints missing');
    fail(state.filmMode !== 'still' || state.movingFilms !== 0, `reduced motion: films still moving ${JSON.stringify(state)}`);
    await context.close();
  } finally { await browser.close(); }
}

async function reviewCapture() {
  const browser = await chromium.launch({ headless:true, channel:'chrome' });
  try {
    const context = await browser.newContext({ viewport:{width:1600,height:1050} });
    const page = await context.newPage();
    await load(page, reviewPath);
    const frames = page.frames();
    fail(frames.length !== 3, `review: expected two live candidate frames, found ${frames.length - 1}`);
    const geometry = await page.evaluate(() => ({ x:document.documentElement.scrollWidth-document.documentElement.clientWidth, iframes:[...document.querySelectorAll('iframe')].map(frame => frame.getBoundingClientRect().toJSON()) }));
    fail(geometry.x > 1, `review: horizontal overflow ${geometry.x}`);
    await page.screenshot({ path:`${output}/paired-review.png`, fullPage:true });
    await context.close();
  } finally { await browser.close(); }
}

try {
  await run(chromium,'chromium',chromiumViewports);
  await run(webkit,'webkit',representative);
  await run(firefox,'firefox',representative);
  await reducedMotion();
  await reviewCapture();
} finally {
  await server.close();
}

console.log(JSON.stringify({ candidate:'CASE-PROOF-FIELD-S2', origin, chromium:chromiumViewports.length, webkit:representative.length, firefox:representative.length, evidence:output, failures }, null, 2));
if (failures.length) process.exitCode = 1;
