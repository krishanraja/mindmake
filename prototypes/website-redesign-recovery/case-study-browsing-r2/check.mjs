#!/usr/bin/env node
/* Proof Field S3 — the prototype's own gate.
 *
 * It exists to answer the questions a screenshot cannot, and the ones this
 * build got wrong at least once on the way here. Four of the assertions below
 * are there because the thing they check was broken and looked fine:
 *
 *   - `railIsAScrollContainer` — the shell's implicit grid column is auto-sized,
 *     so 2820px of records widened the page to 2820px instead of scrolling, and
 *     took the dock off screen. Clipped overflow hid all of it.
 *   - `railHoldsEveryRecord` — the field is six rows and the open-state rail is
 *     seven records, so the eighth fell out of the container entirely.
 *   - `noScriptPanelsAreLegible` — a statically positioned panel carries no
 *     stacking context, so the scrim pseudo-element painted over every word.
 *   - `figureFillsTheCard` — `align-self: center` is a grid instruction; in the
 *     phone's column flex it shrink-wrapped the figure to 220px beside 294px
 *     of copy.
 *
 * Every copy assertion is made against `src/data/rebuildProof.ts` rather than
 * against a string in this file, because the defect that made this redesign
 * necessary was a hand-typed second copy of the records drifting from the
 * records themselves.
 */
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const candidate = '/prototypes/website-redesign-recovery/case-study-browsing-r2/index.html';
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const checked = [];
const note = (message) => checked.push(message);

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;

/* The records, from the one file that owns them. */
const { clientStories } = await server.ssrLoadModule('/src/data/rebuildProof.ts');
fail(clientStories.length !== 8, `expected 8 canonical records, found ${clientStories.length}`);

const browser = await chromium.launch();
const open = async (options = {}) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...options });
  const page = await context.newPage();
  page.on('pageerror', (error) => failures.push(`page error: ${error.message}`));
  await page.goto(`${origin}${candidate}`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  return { context, page };
};

/* ---- 1. every record is whole, and matches the record --------------------- */

{
  const { context, page } = await open();
  for (const story of clientStories) {
    const region = page.locator(`.region[data-story="${story.id}"]`);
    fail(await region.count() !== 1, `${story.id}: no region`);

    const tile = region.locator('.region-hit');
    fail(await tile.getAttribute('href') !== `#record-${story.id}`,
      `${story.id}: the no-JavaScript control must be an anchor to #record-${story.id}`);

    /* The decision that makes this a proof surface rather than eight claims. */
    const cite = (await region.locator('.region-copy cite').textContent() || '').trim();
    fail(cite !== story.attribution,
      `${story.id}: cold tile attribution is "${cite}", record says "${story.attribution}"`);

    const result = (await region.locator('.region-copy strong').textContent() || '').trim();
    fail(result !== story.result, `${story.id}: cold tile result does not match the record`);

    /* The testimony, which lived a page below until now. */
    const quote = await region.evaluate((el) => {
      const p = el.querySelector('blockquote p').cloneNode(true);
      p.querySelectorAll('.q-gap').forEach((g) => g.remove());
      return p.textContent.trim();
    });
    fail(quote !== story.quote,
      `${story.id}: the quotation is not the record's, once the elision mark is removed`);
    const outcome = await region.evaluate((el) => {
      const p = el.querySelector('.expanded-copy > p').cloneNode(true);
      p.querySelectorAll('.q-gap').forEach((g) => g.remove());
      return p.textContent.trim();
    });
    fail(outcome !== story.outcome, `${story.id}: the outcome prose is not the record's`);
    const cut = await region.evaluate((el) => {
      const runs = [...el.querySelectorAll('.q-cut')].map((c) => c.textContent);
      const full = el.querySelector('blockquote p').textContent + el.querySelector('.expanded-copy > p').textContent;
      return runs.every((r) => full.includes(r));
    });
    fail(!cut, `${story.id}: an elided run is not a contiguous part of the record's own text`);
    const panelCite = (await region.locator('.expanded blockquote cite').textContent() || '').trim();
    fail(panelCite !== story.attribution, `${story.id}: panel attribution does not match the record`);

    /* The figure, and that it is bound to the record rather than drawn. */
    const fig = region.locator('.expanded [data-fig]');
    fail(await fig.count() !== 1, `${story.id}: no data-bound figure in the panel`);
    fail(await fig.getAttribute('data-fig') !== story.figure.shape,
      `${story.id}: figure kind does not match story.figure.shape`);

    const anchor = region.locator(`.expanded#record-${story.id}`);
    fail(await anchor.count() !== 1, `${story.id}: #record-${story.id} must resolve to the panel itself`);
  }
  note(`8 records carry their own attribution, testimony and story.figure`);

  const italic = await page.evaluate(() => [...document.querySelectorAll('.expanded blockquote')]
    .filter((b) => getComputedStyle(b).fontStyle !== 'italic').length);
  fail(italic > 0, `${italic} quotations are not set in italic`);

  /* "in week one of eight" was inheriting the two-ended from/to label layout
     and landing hard against one edge. */
  const within = await page.evaluate(() => [...document.querySelectorAll('.mm-fig-count .mm-fig-within')]
    .filter((w) => getComputedStyle(w).textAlign !== 'center').map((w) => w.textContent.trim()));
  for (const w of within) fail(true, `the count figure's qualifier is not centred: "${w}"`);
  note('quotations are italic and the count qualifier is centred');

  /* The glyph is gone, on the evidence of the 24 September bake-off. */
  const html = await page.content();
  fail(/region-glyph|mechanism/.test(html), 'mechanismGlyph markup survives in the composition');
  note('mechanismGlyph is absent');
  await context.close();
}

/* ---- 2. the open record ---------------------------------------------------- */

{
  const { context, page } = await open();
  await page.click('[data-open-story="team-decides"]');
  await page.waitForTimeout(600);

  fail(await page.getAttribute('.proof-shell', 'data-mode') !== 'story', 'opening a record did not enter story mode');

  const focused = await page.evaluate(() => document.activeElement?.id);
  fail(focused !== 'title-team-decides', `focus went to "${focused}", not the record's heading`);

  /* railHoldsEveryRecord */
  const rail = await page.evaluate(() => {
    const field = document.querySelector('.region-list').getBoundingClientRect();
    return [...document.querySelectorAll('.region:not(.is-selected)')].map((region) => {
      const box = region.getBoundingClientRect();
      return { story: region.dataset.story, inside: box.bottom <= field.bottom + 1.5 && box.top >= field.top - 1.5 };
    });
  });
  fail(rail.length !== 7, `expected 7 records in the rail, found ${rail.length}`);
  for (const item of rail) fail(!item.inside, `${item.story}: pushed outside the field by the open record`);
  note('all seven unopened records stay inside the field');

  /* The exit Krish could not find. An icon with a label, and a real target. */
  const close = page.locator('.region.is-selected .expanded-close');
  const box = await close.boundingBox();
  fail(!box || box.width < 44 || box.height < 44, 'the close control is smaller than 44px');
  fail(!(await close.getAttribute('aria-label')), 'the close control has no accessible name');
  fail((await close.innerText()).trim().length > 2, 'the close control narrates itself instead of being one');
  await close.click();
  await page.waitForTimeout(400);
  fail(await page.getAttribute('.proof-shell', 'data-mode') !== 'overview', 'the close control did not close the record');
  const returned = await page.evaluate(() => document.activeElement?.getAttribute('data-open-story'));
  fail(returned !== 'team-decides', 'focus did not return to the tile that opened the record');
  note('the close control closes and returns focus');

  /* Escape stays, because the locked keyboard contract is not being replaced. */
  await page.click('[data-open-story="day-one"]');
  await page.waitForTimeout(400);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);
  fail(await page.getAttribute('.proof-shell', 'data-mode') !== 'overview', 'Escape no longer closes a record');
  note('Escape still closes a record');

  /* The figure moves, and moves between two states read off the record. */
  await page.click('[data-open-story="team-decides"]');
  await page.waitForTimeout(400);
  const readFigure = () => page.evaluate(() => {
    const fig = document.querySelector('.region.is-selected [data-fig]');
    return [...fig.querySelectorAll('.mm-fig-marks i')].map((i) => i.className).join('|');
  });
  const atResult = await readFigure();
  await page.click('.region.is-selected [data-toggle-phase]');
  await page.waitForTimeout(400);
  const atStart = await readFigure();
  fail(atResult === atStart, 'the phase toggle does not move the figure');
  fail(!atResult.includes('is-kept'), 'the result state does not mark the kept decisions');
  fail(atStart.includes('is-kept'), 'the starting state already shows the result');
  note('the phase toggle moves the figure between two states from story.figure');
  await context.close();
}

/* ---- 2b. the panel holds at every desktop size ----------------------------- */

for (const [w, h] of [[1280, 720], [1440, 900], [1600, 900], [1728, 1117], [1800, 1000], [1920, 1080], [2560, 1440]]) {
  const context = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await context.newPage();
  await page.goto(`${origin}${candidate}`, { waitUntil: 'load' });
  await page.waitForTimeout(700);
  await page.click('[data-open-story="hand-back"]');
  await page.waitForTimeout(500);
  const bad = await page.evaluate(() => {
    const q = (s) => document.querySelector(`.region.is-selected ${s}`);
    const box = (e) => e.getBoundingClientRect();
    const pairs = [['head', '.expanded-head'], ['copy', '.expanded-copy'], ['actions', '.expanded-actions'], ['figure', '.expanded-visual']];
    const out = [];
    for (let i = 0; i < pairs.length; i += 1) {
      for (let j = i + 1; j < pairs.length; j += 1) {
        const a = box(q(pairs[i][1])), b = box(q(pairs[j][1]));
        const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
        const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
        if (y > 1 && x > 1) out.push(`${pairs[i][0]}/${pairs[j][0]} overlap ${Math.round(x)}x${Math.round(y)}px`);
      }
    }
    return out;
  });
  for (const b of bad) fail(true, `${w}x${h}: ${b}`);
  /* And the panel has to use the space it has, not one column of it. */
  const spread = await page.evaluate(() => {
    const q = (s) => document.querySelector(`.region.is-selected ${s}`).getBoundingClientRect();
    const panel = q('.expanded'), fig = q('.expanded-visual'), head = q('.expanded-head h2');
    return { panelW: panel.width, figRight: fig.right - panel.left, headW: head.width };
  });
  fail(spread.figRight < spread.panelW * 0.7,
    `${w}x${h}: the figure stops at ${Math.round(spread.figRight)}px of a ${Math.round(spread.panelW)}px panel — the right side is unused`);
  fail(spread.headW < spread.panelW * 0.45,
    `${w}x${h}: the headline is confined to ${Math.round(spread.headW)}px of a ${Math.round(spread.panelW)}px panel`);
  await context.close();
}
note('the open panel holds its layout from 1280x720 to 2560x1440 and uses the panel width');

/* ---- 3. the phone, which is its own composition ---------------------------- */

for (const [width, height] of [[390, 844], [360, 800], [360, 740], [320, 568], [411, 660]]) {
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  await page.goto(`${origin}${candidate}`, { waitUntil: 'load' });
  await page.waitForTimeout(900);
  const label = `${width}×${height}`;

  /* railIsAScrollContainer */
  const rail = await page.evaluate(() => {
    const list = document.querySelector('.region-list');
    return { scroll: list.scrollWidth, client: list.clientWidth, overflow: getComputedStyle(list).overflowX };
  });
  fail(rail.overflow !== 'auto', `${label}: the rail is not horizontally scrollable`);
  fail(rail.scroll <= rail.client + 1, `${label}: the rail does not overflow, so there is nothing to swipe`);
  fail(rail.client > width, `${label}: the rail is wider than the viewport instead of scrolling inside it`);

  /* The next record has to be visible, or a rail is a single card. */
  const peek = await page.evaluate(() => {
    const first = document.querySelector('.region');
    return window.innerWidth - first.getBoundingClientRect().right;
  });
  fail(peek < 24, `${label}: only ${Math.round(peek)}px of the next record shows`);

  /* The controls have to be on screen on the first frame. */
  for (const selector of ['.mobile-dock', '[data-rail-segments]', '[data-mobile-next]']) {
    const onScreen = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const box = el.getBoundingClientRect();
      return box.bottom <= window.innerHeight + 1 && box.right <= window.innerWidth + 1 && box.width > 0 && box.height > 0;
    }, selector);
    fail(!onScreen, `${label}: ${selector} is not on screen`);
  }

  /* No expansion step on a phone: the record is already whole. */
  const whole = await page.evaluate(() => {
    const ex = document.querySelector('.region .expanded');
    return { display: getComputedStyle(ex).display, quote: !!ex.querySelector('blockquote'), fig: !!ex.querySelector('[data-fig]') };
  });
  fail(whole.display === 'none', `${label}: the record is hidden behind an expansion step`);
  fail(!whole.quote || !whole.fig, `${label}: the phone card is missing its testimony or its figure`);

  /* figureFillsTheCard. `.expanded-copy` is display:contents on the phone so
     that the outcome and the testimony can be bands in their own right — it
     has no box of its own, so the comparison is against the band that does. */
  const widths = await page.evaluate(() => {
    const r = document.querySelector('.region[data-story="own-system"]');
    const w = (s) => Math.round(r.querySelector(s).getBoundingClientRect().width);
    return { quote: w('blockquote'), title: w('.expanded-head h2'), fig: w('.expanded-visual') };
  });
  fail(Math.abs(widths.quote - widths.fig) > 2,
    `${label}: the figure is ${widths.fig}px beside ${widths.quote}px of testimony`);
  fail(Math.abs(widths.title - widths.fig) > 2,
    `${label}: the figure is ${widths.fig}px beside a ${widths.title}px headline`);

  /* The title holds one line. */
  const title = await page.evaluate(() => {
    const h1 = document.querySelector('.field-intro h1');
    const line = parseFloat(getComputedStyle(h1).fontSize) * 1.3;
    return { height: h1.getBoundingClientRect().height, line, overflows: h1.scrollWidth > h1.clientWidth + 1 };
  });
  fail(title.height > title.line, `${label}: the page title wraps`);
  fail(title.overflows, `${label}: the page title overflows its box`);

  /* The eyebrow is gone from the phone. */
  const eyebrow = await page.evaluate(() => getComputedStyle(document.querySelector('.expanded-head p')).display);
  fail(eyebrow !== 'none', `${label}: the record eyebrow is still on the phone card`);

  /* The arrows drive the rail to the last record. */
  for (let i = 0; i < 7; i += 1) { await page.click('[data-mobile-next]'); await page.waitForTimeout(320); }
  const end = await page.textContent('[data-mobile-position]');
  fail((end || '').trim() !== '08 / 08', `${label}: the arrows reached "${(end || '').trim()}", not 08 / 08`);
  const lit = await page.evaluate(() => [...document.querySelectorAll('[data-rail-segments] i')].findIndex((i) => i.classList.contains('is-on')));
  fail(lit !== 7, `${label}: the segment rail lit mark ${lit + 1}, not 8`);

  /* Nothing is clipped: at 390 a record fits the card, and below that it
     scrolls inside it, but it is never cut off. */
  const reach = await page.evaluate(() => [...document.querySelectorAll('.region .expanded')].map((ex) => ({
    story: ex.closest('.region').dataset.story,
    over: ex.scrollHeight - ex.clientHeight,
    scrollable: getComputedStyle(ex).overflowY === 'auto',
  })).filter((r) => r.over > 1 && !r.scrollable));
  for (const r of reach) fail(true, `${label}: ${r.story} is clipped by ${r.over}px with no way to reach it`);

  if (width === 390) {
    const overflowing = await page.evaluate(() => [...document.querySelectorAll('.region .expanded')]
      .filter((ex) => ex.scrollHeight - ex.clientHeight > 1).map((ex) => ex.closest('.region').dataset.story));
    fail(overflowing.length > 0, `390: ${overflowing.join(', ')} do not fit one phone screen`);
  }

  /* Titles with titles, quotes with quotes, figures with figures. A rail whose
     furniture moves between cards reads as eight pages, not one deck. */
  const rows = await page.evaluate(() => [...document.querySelectorAll('.region')].map((r) => {
    const top = r.getBoundingClientRect().top;
    const y = (sel) => { const e = r.querySelector(sel); return e ? Math.round(e.getBoundingClientRect().top - top) : null; };
    return { id: r.dataset.story, title: y('.expanded-head h2'), quote: y('blockquote'), fig: y('.expanded-visual') };
  }));
  for (const band of ['title', 'quote', 'fig']) {
    const values = rows.map((r) => r[band]);
    const spread = Math.max(...values) - Math.min(...values);
    fail(spread > 1, `${label}: the ${band} band varies by ${spread}px across the eight cards`);
  }
  note(`${label}: rail scrolls, controls on screen, record whole, bands aligned`);
  await context.close();
}

/* ---- 3b. the swipe, with a thumb ------------------------------------------- */
/* The rail worked and was fiddly, which a click test cannot tell you. Three
   elements between the finger and the rail were scroll containers in their own
   right — including the card, because overflow: hidden is one — so every touch
   started a walk up the scroll chain before the swipe could begin. These are
   dispatched touch gestures, not clicks, and the flick is deliberately lazy. */

for (const [width, height] of [[390, 844], [360, 700], [320, 568]]) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await page.goto(`${origin}${candidate}`, { waitUntil: 'load' });
  await page.waitForTimeout(1000);
  const label = `${width}×${height}`;

  /* The first version of this asserted that nothing between the finger and the
     rail was a scroll container at all. That was too strong, and enlarged text
     proved it: a card whose copy no longer fits has to be able to scroll. What
     actually made the rail fiddly was the browser having to work out where a
     gesture belonged, and `touch-action` settles that outright — an element
     that declares it does not pan vertically cannot take the swipe, whether or
     not it is also a scroller. So the contract is the declaration. */
  const chain = await page.evaluate(() => [...document.querySelectorAll('.region, .region .expanded, .region-hit, .region-list')]
    .map((e) => ({ name: e.className.split(' ')[0], touch: getComputedStyle(e).touchAction }))
    .filter((e) => !/pan-x/.test(e.touch)));
  for (const c of chain) fail(true, `${label}: .${c.name} does not declare horizontal panning (touch-action: ${c.touch}), so it can steal the swipe`);

  const card = await page.evaluate(() => { const r = document.querySelector('.region').getBoundingClientRect(); return { cx: r.left + r.width / 2, cy: r.top + r.height / 2, bottom: r.bottom }; });
  const pt = (x, y) => ({ x: Math.round(x), y: Math.round(y), radiusX: 12, radiusY: 16, force: 1 });
  const swipe = async (from, to, steps) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [pt(from.x, from.y)] });
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [pt(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t)] });
      await page.waitForTimeout(14);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForTimeout(850);
  };
  const at = () => page.evaluate(() => document.querySelector('[data-mobile-position]').textContent.trim());

  const gestures = [
    ['a flat swipe across the copy', { x: card.cx + 110, y: card.cy }, { x: card.cx - 110, y: card.cy }, 12],
    ['the arc a thumb actually makes', { x: card.cx + 110, y: card.cy - 60 }, { x: card.cx - 110, y: card.cy + 50 }, 12],
    ['a swipe starting on the figure', { x: card.cx + 100, y: card.bottom - 70 }, { x: card.cx - 100, y: card.bottom - 40 }, 12],
    ['a lazy short flick', { x: card.cx + 55, y: card.cy }, { x: card.cx - 55, y: card.cy }, 6],
  ];
  for (const [what, from, to, steps] of gestures) {
    const before = await at();
    await swipe(from, to, steps);
    const after = await at();
    fail(before === after, `${label}: ${what} did not move the rail (stuck on ${before})`);
  }
  /* And it must not have followed the card's fallback link while doing it. */
  fail(Boolean(await page.evaluate(() => location.hash)), `${label}: swiping navigated the page`);
  note(`${label}: four thumb gestures each advance the rail, nothing in the way`);
  await context.close();
}

/* ---- 4. no scripting ------------------------------------------------------- */

for (const [width, height] of [[1440, 900], [390, 844]]) {
  const context = await browser.newContext({ viewport: { width, height }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${origin}${candidate}`, { waitUntil: 'load' });
  await page.waitForTimeout(600);
  const label = `no-JS ${width}`;

  const state = await page.evaluate(() => {
    const out = { hidden: [], covered: [], docOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    for (const panel of document.querySelectorAll('.expanded')) {
      const story = panel.closest('.region').dataset.story;
      const style = getComputedStyle(panel);
      const box = panel.getBoundingClientRect();
      if (style.display === 'none' || style.visibility === 'hidden' || box.height < 40) { out.hidden.push(story); continue; }
      /* noScriptPanelsAreLegible: the panel has to be above the scrim. */
      const quote = panel.querySelector('blockquote');
      const q = quote.getBoundingClientRect();
      const top = document.elementFromPoint(q.left + q.width / 2, q.top + q.height / 2);
      if (top && !panel.contains(top)) out.covered.push(`${story} covered by ${top.className || top.tagName}`);
    }
    return out;
  });
  for (const story of state.hidden) fail(true, `${label}: ${story} is unreachable with scripting off`);
  for (const message of state.covered) fail(true, `${label}: ${message}`);
  fail(state.docOverflow > 1, `${label}: the document is ${state.docOverflow}px wider than the viewport`);
  note(`${label}: all eight records reachable and legible`);
  await context.close();
}

await browser.close();
await server.close();

for (const line of checked) console.log(`  ok  ${line}`);
if (failures.length) {
  console.error(`\n${failures.length} failure${failures.length === 1 ? '' : 's'}:`);
  for (const line of failures) console.error(`  ✕  ${line}`);
  process.exit(1);
}
console.log('\nProof Field S3: all checks passed.');
