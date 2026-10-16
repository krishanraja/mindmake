import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { validateScrollBuildEvidence } from './scroll-build-evidence.mjs';
import { createHomepageScrollContract, APPROVED_SCROLL_STATES as states, PIN_TOP, HISTORY_PIN_TOP, CHAPTERS_BY_VIEWPORT } from './homepage-scroll-contract.mjs';

const root = path.resolve(import.meta.dirname, '../..');
// Pre-merge (Krish, 2026-09-25): Chromium alone gates a branch. Firefox and
// WebKit run only in the post-merge matrix on main, which omits the flag and
// is held to all three. A narrowed run writes its own folder, so it can never
// replace the three-engine receipts in artifacts/homepage-release/.
const preMerge = process.argv.includes('--pre-merge');
const engines = preMerge ? ['chromium'] : ['chromium', 'firefox', 'webkit'];
const evidence = path.join(root, preMerge ? 'artifacts/homepage-release/pre-merge' : 'artifacts/homepage-release');
await mkdir(evidence, { recursive: true });
const external = process.env.MINDMAKE_RELEASE_URL;
const origin = external || 'http://127.0.0.1:4342';
const server = external ? null : spawn(process.execPath, [path.join(root,'node_modules/vite/bin/vite.js'), ...(process.argv.includes('--built') ? ['preview'] : []), '--host', '127.0.0.1','--port','4342','--strictPort'], {cwd:root,windowsHide:true,stdio:'pipe'});
const failures = [], cases = [], screenshots = [], fallbackTransitions = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };
const settle = page => page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
const geometry = locator => locator.evaluate(node => { const r=node.getBoundingClientRect(); return {top:r.top,height:r.height,bottom:r.bottom}; });
// Each chapter names its scroll track, the frame that pins and the node whose
// visible words are the state. Scroll positions come from live geometry; the
// expected words and pin line come only from the declared contract.
const chapters = {
  // The R3 history chapter (reinstated in r41), pinned by pinnedChapters.ts:
  // each state owns an equal step of the track.
  history: { track: '[data-chapter="history"]', stage: '[data-component="history"]', state: '[data-story-question]:visible',
    at: (i, g) => g.start + i * g.travel / 4 + 10 },
  reach: { track: '.mm-home-leadership .reach-sequence', stage: '.reach-sticky', state: '[data-reach-copy].is-active h2',
    at: (i, g) => g.start + [0.1, 0.75][i] * g.travel },
  practice: { track: '.mm-home-leadership .work-scroll', stage: '.work-sticky', state: '.work-scene.is-active h3',
    at: (i, g) => g.start + [0.02, 0.5, 0.95][i] * (g.height - g.viewportHeight) },
  // On a phone (r46) the introduction scrolls, then the scenes pin beneath it
  // and each state rests where leadershipChapters.ts's rail stops send it.
  practicePhone: { track: '.mm-home-leadership .work-scroll', stage: '.work-scenes', state: '.work-scene.is-active h3',
    at: (i, g) => g.scenesStart - g.pinTop + [0.06, 0.5, 0.94][i] * g.pinTravel },
};
const words = text => text.replace(/\s+/g, ' ').trim();
const specFor = (chapter, width) => chapter === 'practice' && width <= 900 ? chapters.practicePhone : chapters[chapter];
const measure = (page, spec, pinTop) => page.locator(spec.track).evaluate((track, [stageSelector, pinTop]) => {
  const stage = track.querySelector(stageSelector);
  const box = track.getBoundingClientRect();
  // Where a stage that pins below an introduction starts, and how far it travels pinned.
  const intro = track.querySelector('.work-intro');
  const lead = intro ? intro.offsetTop + intro.offsetHeight : 0;
  const frame = stage.parentElement;
  return { start: scrollY + box.top, height: box.height, travel: box.height - stage.getBoundingClientRect().height, viewportHeight: innerHeight, pinTop,
    scenesStart: scrollY + frame.getBoundingClientRect().top + lead, pinTravel: frame.offsetHeight - lead - stage.offsetHeight };
}, [spec.stage, pinTop]);
// The AI Brain stories (16 October 2026, Krish: "Approved, ship it") are a
// chooser, not a pinned sequence: five situations, three stories to each, the
// whole story in a sheet. It must never pin, every situation must show its
// own three stories, and a story must open whole and close again.
const FINDER = '.mm-home-leadership [data-story-finder]';
const finderChecks = async (page, label, { phone = false, headerTop = 0 } = {}) => {
  const finder = page.locator(FINDER);
  await finder.scrollIntoViewIfNeeded();
  await settle(page); await settle(page);
  assert(await finder.evaluate(node => node.classList.contains('is-live')), `${label}/stories: the chooser is live`);
  const tabs = finder.locator('[data-finder-tab]');
  assert(await tabs.count() === 5, `${label}/stories: five situations`);
  assert(await finder.locator('.finder-card').count() === 15, `${label}/stories: fifteen stories`);
  /* It never pins: the section moves with the page. */
  const before = await finder.evaluate(node => node.getBoundingClientRect().top);
  await page.evaluate(() => scrollBy({ top: 200, behavior: 'instant' }));
  await settle(page);
  const after = await finder.evaluate(node => node.getBoundingClientRect().top);
  assert(Math.abs((before - after) - 200) < 3, `${label}/stories: moves with the page, never pinned (${before} to ${after})`);
  await page.evaluate(() => scrollBy({ top: -200, behavior: 'instant' }));
  await settle(page);
  if (phone) {
    const height = await finder.evaluate(node => node.getBoundingClientRect().height);
    const room = await page.evaluate(top => innerHeight - top, headerTop);
    assert(height <= room + 2, `${label}/stories: no taller than the screen under the masthead (${Math.round(height)} of ${Math.round(room)})`);
  }
  for (let i = 0; i < 5; i++) {
    await tabs.nth(i).click();
    await settle(page);
    const shown = await finder.evaluate(node => [...node.querySelectorAll('[data-finder-panel]')].map(panel => !panel.hidden && getComputedStyle(panel).display !== 'none'));
    assert(shown.filter(Boolean).length === 1 && shown[i], `${label}/stories: situation ${i + 1} alone is shown`);
    assert(await tabs.nth(i).getAttribute('aria-selected') === 'true', `${label}/stories: situation ${i + 1} is the selected tab`);
    assert(await finder.locator('[data-finder-panel]:visible .finder-card').count() === 3, `${label}/stories: situation ${i + 1} holds three stories`);
  }
  /* A story opens whole in the sheet and closes again. */
  await tabs.nth(0).click();
  await settle(page);
  const heading = words(await finder.locator('[data-finder-panel]:visible .finder-heading').first().innerText());
  await finder.locator('[data-finder-panel]:visible summary').first().click();
  const sheet = finder.locator('[data-finder-sheet]');
  await page.waitForFunction(selector => document.querySelector(selector)?.open, `${FINDER} [data-finder-sheet]`);
  assert(words(await sheet.locator('h3').innerText()) === heading, `${label}/stories: the sheet opens the story chosen`);
  assert(await sheet.locator('.finder-outcome').count() === 1, `${label}/stories: the sheet carries the outcome`);
  assert(await sheet.locator('[data-finder-start]').count() === 1, `${label}/stories: the sheet ends in the free AI brief`);
  await page.keyboard.press('Escape');
  await settle(page);
  assert(!(await sheet.evaluate(node => node.open)), `${label}/stories: the sheet closes`);
};
const launchOptions = name => name === 'chromium' && process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {};
try {
  for(let i=0;i<100;i++){ try { if((await fetch(origin)).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  for(const [engine, launcher] of Object.entries({chromium,firefox,webkit}).filter(([name])=>engines.includes(name) && (!process.env.QA_ENGINE || process.env.QA_ENGINE===name))) {
    const browser = await launcher.launch(launchOptions(engine));
    try {
      for(const viewport of [{width:1440,height:900},{width:390,height:844}]) {
        const page = await browser.newPage({viewport});
        page.setDefaultTimeout(15000);
        const size = `${viewport.width}x${viewport.height}`;
        const label = `${engine}-${viewport.width}`;
        const errors=[];
        page.on('pageerror', error=>errors.push(error.message));
        await page.addInitScript(()=>localStorage.setItem('mindmake_consent','accepted'));
        await page.goto(origin,{waitUntil:'domcontentloaded',timeout:60000});
        await page.evaluate(()=>document.fonts.ready);
        await page.waitForSelector('.mm-home-leadership .reach-sequence',{timeout:60000});
        console.log(`Testing ${label}`);
        assert(await page.locator('.mm-home-approved h1:visible').textContent() === 'Promote your AI from intern to chief of staff.',`${label}: approved opening`);
        // Negative control: the scrapped R3 chapters must not survive anywhere in the page.
        for (const retired of ['authority', 'leadership-dividend']) assert(await page.locator(`[data-component="${retired}"]`).count()===0,`${label}: retired ${retired} chapter is gone`);
        assert(await page.locator('.mm-home-leadership').evaluate(node=>{ const history=node.previousElementSibling; return history?.matches('[data-chapter="history"]') && !!history.querySelector('[data-component="history"]') && history.previousElementSibling?.id==='opening' && node.nextElementSibling?.id==='route'; }),`${label}: opening, history, the leadership chapters, then the route`);
        for(const chapter of CHAPTERS_BY_VIEWPORT[size]) {
          const pinTop = chapter==='history' ? HISTORY_PIN_TOP : PIN_TOP[size];
          const expected = states[chapter];
          const spec = specFor(chapter, viewport.width);
          const track = page.locator(spec.track);
          const stage = track.locator(spec.stage).first();
          const g = await measure(page, spec, pinTop);
          const samples=[];
          for(const direction of ['forward','reverse']) {
            const indices=direction==='forward'?expected.map((_,i)=>i):expected.map((_,i)=>i).reverse();
            for(const index of indices) {
              await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(spec.at(index,g)));
              await settle(page); await settle(page);
              const rect=await geometry(stage);
              const visibleText=words(await track.locator(spec.state).innerText());
              const matched=visibleText===expected[index];
              samples.push({direction,index,scrollY:await page.evaluate(()=>scrollY),rect,visibleState:visibleText,expected:expected[index],matched});
              assert(matched,`${label}/${chapter}/${direction}/${index}: visible state "${visibleText}"`);
              assert(Math.abs(rect.top-pinTop)<3,`${label}/${chapter}/${direction}/${index}: stays pinned (top ${rect.top})`);
              assert(rect.bottom<=viewport.height+3,`${label}/${chapter}/${index}: fits viewport`);
            }
          }
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(g.start-pinTop+g.travel+120));
          await settle(page);
          const exitAfter={scrollY:await page.evaluate(()=>scrollY),rect:await geometry(stage)};
          assert(exitAfter.rect.top < pinTop-50,`${label}/${chapter}: exit after completion`);
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(g.start-pinTop-120));
          await settle(page);
          const exitBefore={scrollY:await page.evaluate(()=>scrollY),rect:await geometry(stage)};
          assert(exitBefore.rect.top > pinTop+50,`${label}/${chapter}: reverse exit`);
          cases.push({label,chapter,viewport,samples,exitAfter,exitBefore});
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(spec.at(1,g)));
          await settle(page); await settle(page);
          // Let the state's crossfade finish so the evidence shows the words, not the fade.
          await page.waitForTimeout(800);
          const file=`${label}-${chapter}.png`;
          await page.screenshot({path:path.join(evidence,file)});
          screenshots.push(file);
          console.log(`Verified ${label}/${chapter}: forward, reverse, exits and screenshot`);
        }
        if (viewport.width <= 900) {
          // On a phone the practice scenes pin under their introduction (r46),
          // and the rail's stops are direct controls to each scene.
          assert(await page.locator('.mm-home-leadership .work-scenes').evaluate(node=>getComputedStyle(node).position)==='sticky',`${label}: practice scenes pin on a phone`);
          const stops = await page.locator('.mm-home-leadership [data-work-button]').evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().height));
          assert(stops.length===3 && stops.every(height=>height>=43.5),`${label}: the rail's three stops are 44px targets (${stops.join(', ')})`);
          await page.locator('.mm-home-leadership [data-work-button="2"]').click();
          await page.waitForTimeout(1600);
          assert(words(await page.locator('.mm-home-leadership .work-scene.is-active h3').innerText())===states.practice[2],`${label}: the rail's last stop reaches the last scene`);
          assert(await page.locator('.mm-home-leadership .work-scroll').evaluate(node=>parseFloat(getComputedStyle(node).getPropertyValue('--work-fill')))===1,`${label}: the rail is full at the last scene`);
        }
        await finderChecks(page, label, { phone: viewport.width <= 900, headerTop: PIN_TOP[size] });
        await page.locator(FINDER).screenshot({path:path.join(evidence,`${label}-stories.png`)});
        screenshots.push(`${label}-stories.png`);
        console.log(`Verified ${label}/stories: never pinned, five situations, a story opens whole`);
        // The returned hour stays in the page after the stories.
        assert(words(await page.locator('.mm-home-leadership .proof-return h2').innerText())==='What will you do with the hours you save on a task?',`${label}: the returned hour`);
        // Full real homepage CTA to the existing lead journey, not a prototype stub.
        console.log(`Checking ${label}: real lead entry`);
        await page.locator('[data-component="route"] [data-start-route]:visible').click();
        await page.waitForSelector('[role="dialog"]:visible');
        assert((await page.locator('[role="dialog"]:visible').innerText()).includes('Company'),`${label}: Start here opens real journey`);
        await page.keyboard.press('Escape');
        assert(errors.length===0,`${label}: browser exceptions ${errors.join('; ')}`);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${label}: horizontal overflow`);
        await page.close();
        console.log(`Completed ${label}`);
      }
      // A control moves the page; the state follows once the page arrives, so
      // read it after the scroll has come to rest (or 4s, whichever is first).
      const arrive = page => page.evaluate(()=>new Promise(resolve=>{ let last=-1, still=0, frames=0; const tick=()=>{ frames+=1; still = scrollY===last ? still+1 : 0; last=scrollY; if(still>=6||frames>240) resolve(); else requestAnimationFrame(tick); }; requestAnimationFrame(tick); }));
      const control = async (page, selector, chapter, index, fallback) => {
        await page.locator(selector).click();
        await arrive(page); await settle(page); await settle(page);
        const visibleState = words(await page.locator(`${chapters[chapter].track} ${chapters[chapter].state}`).innerText());
        const matched = visibleState===states[chapter][index];
        assert(matched,`${engine}/${fallback}: ${selector} shows ${chapter} ${index} ("${visibleState}")`);
        fallbackTransitions.push({engine,chapter,fallback,control:selector,visibleState,matched});
      };
      // Reduced motion keeps the pins, as it does on /new-age-leadership, and
      // drops every transition and film. The direct controls reach each state.
      const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
      page.setDefaultTimeout(15000);
      console.log(`Checking ${engine}: reduced motion and direct controls`);
      await page.addInitScript(()=>localStorage.setItem('mindmake_consent','accepted'));
      await page.goto(origin,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.mm-home-leadership .reach-sequence');
      // The history chapter falls back to natural flow under reduced motion,
      // and its era buttons reach every story.
      await page.waitForSelector('[data-chapter="history"]');
      assert(await page.locator('[data-chapter="history"]').getAttribute('data-pin-mode')==='natural',`${engine}: reduced-motion history natural flow`);
      for (let index=0; index<states.history.length; index++) {
        await page.locator(`[data-era="${index}"]:visible`).click();
        await settle(page);
        const visibleState=words(await page.locator('[data-story-question]:visible').innerText());
        const matched=visibleState===states.history[index];
        assert(matched,`${engine}: reduced-motion manual history ${index} ("${visibleState}")`);
        assert(await page.locator(`[data-era="${index}"]:visible`).getAttribute('aria-current')==='true',`${engine}: history ${index} semantic current state`);
        fallbackTransitions.push({engine,chapter:'history',fallback:'reduced-motion',control:`[data-era="${index}"]`,visibleState,matched});
      }
      await page.locator('.mm-home-leadership .reach-sequence').scrollIntoViewIfNeeded();
      await control(page, '[data-reach-jump="organisation"]','reach',1,'reduced-motion');
      assert(await page.locator('[data-reach-jump="organisation"]').getAttribute('aria-current')==='step',`${engine}: organisation semantic current state`);
      await control(page, '[data-reach-jump="boundary"]','reach',0,'reduced-motion');
      await page.locator('.mm-home-leadership .work-scroll').scrollIntoViewIfNeeded();
      for (let index=2; index>=0; index--) await control(page, `[data-work-button="${index}"]`,'practice',index,'reduced-motion');
      /* The stories' situations are tabs: the keyboard moves between them. */
      await page.locator(`${FINDER} [data-finder-tab]`).first().focus();
      for (let index=1; index<5; index++) {
        await page.keyboard.press('ArrowRight');
        const selected = await page.locator(`${FINDER} [data-finder-tab][aria-selected="true"]`).evaluate(node=>[...node.parentElement.children].indexOf(node));
        const focused = await page.evaluate(()=>document.activeElement?.getAttribute('aria-selected')==='true');
        assert(selected===index && focused,`${engine}: reduced-motion situation ${index + 1} by keyboard`);
        fallbackTransitions.push({engine,chapter:'stories',fallback:'reduced-motion',control:'ArrowRight',visibleState:`situation ${index + 1}`,matched:selected===index && focused});
      }
      assert(await page.locator('.mm-home-leadership .work-scene').first().evaluate(node=>{ const style=getComputedStyle(node); return style.transitionProperty==='none' || style.transitionDuration.split(',').every(value=>parseFloat(value)<0.001); }),`${engine}: reduced motion drops scene transitions`);
      assert(await page.locator('video').evaluateAll(videos=>videos.every(video=>video.paused)),`${engine}: reduced-motion videos paused`);
      await page.close();
      // Short screens keep every pinned frame inside the viewport and every
      // state reachable from its controls.
      for (const short of [{width:1280,height:600},{width:720,height:450}]) {
        const page=await browser.newPage({viewport:short});
        page.setDefaultTimeout(15000);
        const fallback = `short-${short.width}x${short.height}`;
        console.log(`Checking ${engine}: ${fallback}`);
        await page.addInitScript(()=>localStorage.setItem('mindmake_consent','accepted'));
        await page.goto(origin,{waitUntil:'domcontentloaded'});
        await page.waitForSelector('.mm-home-leadership .reach-sequence');
        const shortTop = await page.evaluate(()=>parseFloat(getComputedStyle(document.querySelector('.mm-home-leadership')).getPropertyValue('--header')));
        // A history frame taller than the screen is not pinned; its era buttons still reach the last story.
        await page.waitForSelector('[data-chapter="history"]');
        assert(await page.locator('[data-chapter="history"]').getAttribute('data-pin-mode')==='natural',`${engine}/${fallback}: history natural flow`);
        await page.locator('[data-era="3"]:visible').click();
        await settle(page);
        assert(words(await page.locator('[data-story-question]:visible').innerText())===states.history[3],`${engine}/${fallback}: history manual choice`);
        for (const chapter of short.width > 900 ? ['reach','practice'] : ['reach']) {
          const spec = specFor(chapter, short.width);
          const g = await measure(page, spec, shortTop);
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),Math.round(spec.at(1,g)));
          await settle(page); await settle(page);
          const rect = await geometry(page.locator(`${spec.track} ${spec.stage}`).first());
          assert(Math.abs(rect.top-shortTop)<3 && rect.bottom<=short.height+3,`${engine}/${fallback}/${chapter}: pinned frame fits (${rect.top}-${rect.bottom})`);
          const heading = await page.locator(`${spec.track} ${spec.state}`).boundingBox();
          assert(heading && heading.y >= 0 && heading.y + heading.height <= short.height + 3,`${engine}/${fallback}/${chapter}: state heading is on screen`);
        }
        // A phone held sideways is too short to pin the practice frame: its scenes stay one after another.
        if (short.width <= 900) assert(await page.locator('.mm-home-leadership .work-scenes').evaluate(node=>getComputedStyle(node).position)!=='sticky',`${engine}/${fallback}: practice scenes flow on a short phone`);
        await finderChecks(page, `${engine}/${fallback}`);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${engine}/${fallback}: horizontal overflow`);
        await page.close();
      }
    } finally { await browser.close(); }
  }
} catch(error){ failures.push(error.stack); }
finally { server?.kill(); }
const sourceFiles=['src/pages/Index.tsx','src/components/homepage-release/markup.ts','src/components/homepage-release/runtime.js','src/components/homepage-release/component-styles.css','src/components/homepage-release/page.css','src/components/homepage-release/integration.css','src/components/leadership-chapters/leadershipChapters.ts','src/components/leadership-chapters/storyFinder.ts','src/styles/new-age-leadership-r5.css','src/components/homepage-release/pinnedChapters.ts','src/components/homepage-release/pinnedChapters.css'];
const hashes={};
for(const file of sourceFiles) hashes[file]=createHash('sha256').update(await readFile(path.join(root,file))).digest('hex');
const report={at:new Date().toISOString(),origin,built:process.argv.includes('--built'),hashes,cases,screenshots,fallbackTransitions,failures};
const traceText=JSON.stringify(report,null,2)+'\n';
await writeFile(path.join(evidence,'scroll-observations.json'),traceText);
const traceEvidence={path:path.relative(root,path.join(evidence,'scroll-observations.json')).split(path.sep).join('/'),sha256:createHash('sha256').update(traceText).digest('hex')};
const candidateDigest=createHash('sha256').update(JSON.stringify(hashes)).digest('hex');
const acceptedDecision='quality/website-redesign/homepage-handoff.v1.json';
const contract=createHomepageScrollContract({engines,candidateDigest,acceptedDecision,acceptedDecisionDigest:createHash('sha256').update(await readFile(path.join(root,acceptedDecision))).digest('hex')});
const motionReport={candidateDigest,cases:cases.map(c=>({
  id:`${c.label.split('-')[0]}-${c.viewport.width}x${c.viewport.height}-${c.chapter}`,route:'/',viewport:`${c.viewport.width}x${c.viewport.height}`,input:'page-scroll',capture:traceEvidence,
  forward:c.samples.filter(s=>s.direction==='forward').map(s=>({visibleText:s.visibleState,scrollY:s.scrollY,stageTop:s.rect.top,evidence:traceEvidence})),
  reverse:c.samples.filter(s=>s.direction==='reverse').map(s=>({visibleText:s.visibleState,scrollY:s.scrollY,stageTop:s.rect.top,evidence:traceEvidence})),
  exitAfter:{scrollY:c.exitAfter.scrollY,stageTop:c.exitAfter.rect.top,evidence:traceEvidence},
  exitBefore:{scrollY:c.exitBefore.scrollY,stageTop:c.exitBefore.rect.top,evidence:traceEvidence},
}))};
failures.push(...validateScrollBuildEvidence(contract,motionReport));
await writeFile(path.join(evidence,'motion-contract.json'),JSON.stringify(contract,null,2)+'\n');
await writeFile(path.join(evidence,'motion-receipt.json'),JSON.stringify(motionReport,null,2)+'\n');
await writeFile(path.join(evidence,'browser-report.json'),JSON.stringify({...report,candidateDigest,failures},null,2)+'\n');
console.log(JSON.stringify({cases:cases.length,screenshots:screenshots.length,failures},null,2));
if(failures.length) process.exitCode=1;
