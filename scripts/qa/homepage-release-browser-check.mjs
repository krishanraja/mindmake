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
  benefits: { track: '.mm-home-leadership [data-benefit-track]', stage: '[data-benefits]', state: '.brain-benefit.is-active h2',
    at: (i, g) => g.start + Math.max(10, Math.min(i * g.travel / 5, g.travel - g.pinTop - 20)) },
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
        assert(await page.locator('.mm-home-approved h1:visible').textContent() === 'Build the human + AI business that augments your vision.',`${label}: approved opening`);
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
        // The returned hour stays in the page after the benefits.
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
      const control = async (page, selector, chapter, index, fallback) => {
        await page.locator(selector).click();
        await settle(page); await settle(page);
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
      await page.locator('.mm-home-leadership [data-benefit-track]').scrollIntoViewIfNeeded();
      await page.evaluate(()=>scrollTo({top:scrollY+document.querySelector('.mm-home-leadership [data-benefit-track]').getBoundingClientRect().top+10,behavior:'instant'}));
      await settle(page);
      for (let index=1; index<states.benefits.length; index++) await control(page, '[data-benefit-next]','benefits',index,'reduced-motion');
      for (let index=states.benefits.length-2; index>=0; index--) await control(page, '[data-benefit-prev]','benefits',index,'reduced-motion');
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
        for (const chapter of short.width > 900 ? ['reach','practice','benefits'] : ['reach','benefits']) {
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
        await page.evaluate(()=>scrollTo({top:scrollY+document.querySelector('.mm-home-leadership [data-benefit-track]').getBoundingClientRect().top+10,behavior:'instant'}));
        await settle(page);
        await control(page, '[data-benefit-next]', 'benefits', 1, fallback);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${engine}/${fallback}: horizontal overflow`);
        await page.close();
      }
    } finally { await browser.close(); }
  }
} catch(error){ failures.push(error.stack); }
finally { server?.kill(); }
const sourceFiles=['src/pages/Index.tsx','src/components/homepage-release/markup.ts','src/components/homepage-release/runtime.js','src/components/homepage-release/component-styles.css','src/components/homepage-release/page.css','src/components/homepage-release/integration.css','src/components/leadership-chapters/leadershipChapters.ts','src/styles/new-age-leadership-r5.css','src/components/homepage-release/pinnedChapters.ts','src/components/homepage-release/pinnedChapters.css'];
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
