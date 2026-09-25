import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { chromium, firefox, webkit } from 'playwright';
import { validateScrollBuildEvidence } from './scroll-build-evidence.mjs';
import { createHomepageScrollContract } from './homepage-scroll-contract.mjs';

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
const states = {
  history: ['If knowledge lives outside us, will memory grow weaker?', 'If the machine can do the work, what happens to the worker?', 'If the device does the arithmetic, will children stop learning to think?', 'If the device knows the route, will we lose our sense of direction?'],
  'leadership-dividend': ['It notices what changed.', 'It joins the evidence.', 'It prepares the next move.', 'Leadership updates become consistent, even when the week was not.', 'What will you do with the hours it gives back?'],
};
try {
  for(let i=0;i<100;i++){ try { if((await fetch(origin)).ok) break; } catch {} await new Promise(r=>setTimeout(r,100)); }
  for(const [engine, launcher] of Object.entries({chromium,firefox,webkit}).filter(([name])=>engines.includes(name) && (!process.env.QA_ENGINE || process.env.QA_ENGINE===name))) {
    const browser = await launcher.launch();
    try {
      for(const viewport of [{width:1440,height:900},{width:390,height:844}]) {
        const page = await browser.newPage({viewport});
        page.setDefaultTimeout(15000);
        const label = `${engine}-${viewport.width}`;
        const errors=[];
        page.on('pageerror', error=>errors.push(error.message));
        await page.addInitScript(()=>localStorage.setItem('mindmake_consent','accepted'));
        await page.goto(origin,{waitUntil:'domcontentloaded',timeout:60000});
        await page.evaluate(()=>document.fonts.ready);
        await page.waitForSelector('.homepage-pin-track',{timeout:60000});
        console.log(`Testing ${label}`);
        assert(await page.locator('.mm-home-approved h1:visible').textContent() === 'Build the business that can think with you.',`${label}: approved opening`);
        for(const [chapter, expected] of Object.entries(states)) {
          const track = page.locator(`[data-chapter="${chapter}"]`);
          const section = page.locator(`[data-component="${chapter}"]`);
          const box=await track.boundingBox();
          const start=box.y + await page.evaluate(()=>scrollY);
          const step=Math.max(220,Math.round(viewport.height*.6));
          assert(await track.getAttribute('data-pin-mode')==='scroll',`${label}/${chapter}: pin enabled`);
          const samples=[];
          for(const direction of ['forward','reverse']) {
            const indices=direction==='forward'?expected.map((_,i)=>i):expected.map((_,i)=>i).reverse();
            for(const index of indices) {
              await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+index*step+10);
              await settle(page);
              const rect=await geometry(section);
              const stateSelector=chapter==='history'?'[data-story-question]:visible':index<3?'[data-practice-title]:visible':index===3?'[data-benefit-title]:visible':'.return-copy h2:visible';
              const visibleText=await section.locator(stateSelector).innerText();
              const matched=visibleText.includes(expected[index]);
              samples.push({direction,index,scrollY:await page.evaluate(()=>scrollY),rect,visibleState:visibleText.trim(),expected:expected[index],matched});
              assert(matched,`${label}/${chapter}/${direction}/${index}: visible state`);
              assert(Math.abs(rect.top)<3,`${label}/${chapter}/${direction}/${index}: stays pinned (top ${rect.top})`);
              assert(rect.bottom<=viewport.height+3,`${label}/${chapter}/${index}: fits viewport`);
            }
          }
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+expected.length*step+100);
          await settle(page);
          const exitAfter={scrollY:await page.evaluate(()=>scrollY),rect:await geometry(section)};
          assert(exitAfter.rect.top < -50,`${label}/${chapter}: exit after completion`);
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start-100);
          await settle(page);
          const exitBefore={scrollY:await page.evaluate(()=>scrollY),rect:await geometry(section)};
          assert(exitBefore.rect.top > 50,`${label}/${chapter}: reverse exit`);
          cases.push({label,chapter,viewport,samples,exitAfter,exitBefore});
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+step+10);
          await settle(page);
          const file=`${label}-${chapter}.png`;
          await page.screenshot({path:path.join(evidence,file)});
          screenshots.push(file);
          console.log(`Verified ${label}/${chapter}: forward, reverse, exits and screenshot`);
        }
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
      // Accessibility/short-height fallbacks retain every manual scene.
      const page=await browser.newPage({viewport:{width:720,height:450},reducedMotion:'reduce'});
      page.setDefaultTimeout(15000);
      console.log(`Checking ${engine}: manual accessibility fallbacks`);
      await page.addInitScript(()=>localStorage.setItem('mindmake_consent','accepted'));
      await page.goto(origin,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.homepage-pin-track');
      assert(await page.locator('.homepage-pin-track.is-pinned').count()===0,`${engine}: reduced-motion natural flow`);
      for (let index=0; index<states.history.length; index++) {
        await page.locator(`[data-era="${index}"]:visible`).click();
        assert((await page.locator('[data-story-question]:visible').innerText()).includes(states.history[index]),`${engine}: reduced-motion manual history ${index}`);
        assert(await page.locator(`[data-era="${index}"]:visible`).getAttribute('aria-current')==='true',`${engine}: history ${index} semantic current state`);
      }
      for (let index=0; index<3; index++) {
        await page.locator('[data-practice]:visible').nth(index).click();
        assert((await page.locator('[data-practice-title]:visible').innerText()).includes(states['leadership-dividend'][index]),`${engine}: reduced-motion manual practice ${index}`);
      }
      for (const [mode,index] of [['benefits',3],['return',4]]) {
        await page.locator(`[data-dividend-mode="${mode}"]:visible`).click();
        const text=await page.locator(mode==='benefits'?'[data-benefit-title]:visible':'.return-copy h2:visible').innerText();
        assert(text.includes(states['leadership-dividend'][index]),`${engine}: reduced-motion manual ${mode}`);
      }
      assert(await page.locator('video').evaluateAll(videos=>videos.every(video=>video.paused)),`${engine}: reduced-motion videos paused`);
      await page.emulateMedia({reducedMotion:'no-preference'});
      await settle(page);
      assert(await page.locator('.homepage-pin-track.is-pinned').count()===0,`${engine}: short viewport natural flow`);
      // A natural-flow manual selection must not leave the pin controller's
      // cached stage stale when the user restores motion or viewport height.
      for (const fallback of ['reduced-motion', 'short-height']) {
        for (const chapter of ['history', 'leadership-dividend']) {
          await page.setViewportSize({width:720,height:900});
          await page.emulateMedia({reducedMotion:'no-preference'});
          await settle(page);
          const track=page.locator(`[data-chapter="${chapter}"]`);
          const section=page.locator(`[data-component="${chapter}"]`);
          const start=await track.evaluate(node=>scrollY+node.getBoundingClientRect().top);
          const cachedIndex=1;
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+540*cachedIndex+10);
          await settle(page);
          assert(await section.getAttribute('data-scroll-stage')==='1',`${engine}/${chapter}/${fallback}: cached pinned stage`);
          if(fallback==='reduced-motion') await page.emulateMedia({reducedMotion:'reduce'});
          else await page.setViewportSize({width:720,height:450});
          await settle(page);
          assert(await track.getAttribute('data-pin-mode')==='natural',`${engine}/${chapter}/${fallback}: natural mode`);
          assert(await section.getAttribute('data-scroll-stage')===null,`${engine}/${chapter}/${fallback}: stale stage cleared`);
          if(chapter==='history') {
            await section.locator('[data-era="3"]:visible').click();
            assert((await section.locator('[data-story-question]:visible').innerText()).includes(states.history[3]),`${engine}/${chapter}/${fallback}: natural manual choice`);
          } else {
            await section.locator('[data-dividend-mode="return"]:visible').click();
            assert((await section.locator('.return-copy h2:visible').innerText()).includes(states[chapter][4]),`${engine}/${chapter}/${fallback}: natural manual choice`);
          }
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+540*cachedIndex+10);
          if(fallback==='reduced-motion') await page.emulateMedia({reducedMotion:'no-preference'});
          else await page.setViewportSize({width:720,height:900});
          await settle(page);
          const restoredStart=await track.evaluate(node=>scrollY+node.getBoundingClientRect().top);
          await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),restoredStart+540*cachedIndex+10);
          await settle(page);
          const selector=chapter==='history'?'[data-story-question]:visible':'[data-practice-title]:visible';
          const visibleState=(await section.locator(selector).innerText()).trim();
          const restoredStage=await section.getAttribute('data-scroll-stage');
          const matched=visibleState.includes(states[chapter][cachedIndex]);
          assert(await track.getAttribute('data-pin-mode')==='scroll',`${engine}/${chapter}/${fallback}: pin restored`);
          assert(restoredStage==='1' && matched,`${engine}/${chapter}/${fallback}: restored visible state agrees with scroll`);
          fallbackTransitions.push({engine,chapter,fallback,restoredStage,visibleState,matched});
        }
      }
      await page.close();
    } finally { await browser.close(); }
  }
} catch(error){ failures.push(error.stack); }
finally { server?.kill(); }
const sourceFiles=['src/pages/Index.tsx','src/components/homepage-release/markup.ts','src/components/homepage-release/runtime.js','src/components/homepage-release/component-styles.css','src/components/homepage-release/page.css','src/components/homepage-release/integration.css','src/components/homepage-release/pinnedChapters.ts','src/components/homepage-release/pinnedChapters.css'];
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
