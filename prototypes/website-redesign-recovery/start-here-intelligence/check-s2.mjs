#!/usr/bin/env node
import { createServer } from 'vite';
import { chromium, firefox, webkit } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-start-here-intelligence-s2';
const path = '/prototypes/website-redesign-recovery/start-here-intelligence/index-s2.html';
const reviewPath = '/prototypes/website-redesign-recovery/start-here-intelligence/review-s2.html';
const viewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const baseline = {
  'index.html':'94ce786293ac63708cf2baebb70fa994a19434b897060d9325b5552652325e32',
  'styles.css':'14b705bc98041c96a945454add6aa832abb6710b8724f4f04b9893a9d28b63bc',
  'script.js':'4abbc510a11bf0976f71734b61eae6d835b19d99bc730a2c8d47856e7cb85410',
  'review.html':'edb16ceae8c0bc627e85efc92c97a1633888192a30ede7e61628949a9b73c3e6',
  'check.mjs':'ad3c7c02864f7ef4ef456529d0571ed1a20b66718cc02f5a3eb697095a0f0e6c',
  'opportunities-resolve-poster.webp':'116705a4945cf88ba46246a0e7f85986439afc93220cb60725f09352eaec38a1',
};

for(const [file,expected] of Object.entries(baseline)){
  const bytes=await readFile(new URL(file,import.meta.url));
  fail(sha256(bytes)!==expected,`S1 baseline changed: ${file}`);
}
const [s1,s2]=await Promise.all([readFile(new URL('index.html',import.meta.url),'utf8'),readFile(new URL('index-s2.html',import.meta.url),'utf8')]);
const body=(html)=>html.match(/<body>[\s\S]*<\/body>/)?.[0]||'';
fail(body(s1)!==body(s2),'S2 changed the S1 body, content or interaction DOM');

await mkdir(output,{recursive:true});
const server=await createServer({root,server:{host:'127.0.0.1',port:0,strictPort:false},logLevel:'error'});
await server.listen();
const address=server.httpServer.address();
const origin=`http://127.0.0.1:${address.port}`;

async function inspect(browserType,name,matrix,capture=false){
  const browser=await browserType.launch({headless:true,...(browserType===chromium?{channel:'chrome'}:{})});
  try{
    for(const [width,height] of matrix){
      const page=await browser.newPage({viewport:{width,height}});
      await page.goto(origin+path,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const state=await page.evaluate(()=>{
        const rect=(selector)=>{const r=document.querySelector(selector).getBoundingClientRect();return{left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}};
        const screen=document.querySelector('.screen.active');
        const body=document.querySelector('.resolution-body');
        const actionRail=document.querySelector('.resolution-body>.action-rail');
        const valueStart=(()=>{const p=document.querySelector('.starting-point');const node=[...p.childNodes].find(item=>item.nodeType===Node.TEXT_NODE&&item.textContent.trim());const range=document.createRange();range.selectNodeContents(node);return range.getBoundingClientRect().left})();
        const labelLefts=[rect('.starting-point span').left,...[...document.querySelectorAll('.division small')].map(node=>node.getBoundingClientRect().left),rect('.first-proof small').left];
        const valueLefts=[valueStart,...[...document.querySelectorAll('.division p')].map(node=>node.getBoundingClientRect().left),rect('.first-proof strong').left];
        const controls=[...document.querySelectorAll('button:not(:disabled)')].map(node=>node.getBoundingClientRect()).filter(r=>r.width&&r.height);
        const proof=rect('.first-proof');
        const action=rect('.resolution-body .primary');
        const film=rect('.resolution-film');
        const recommendation=rect('.resolution-body');
        const rows=[...document.querySelectorAll('.division article')].map(node=>node.getBoundingClientRect().height);
        return{
          pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
          drawerOverflow:document.querySelector('.drawer').scrollHeight-document.querySelector('.drawer').clientHeight,
          screenOverflow:screen.scrollHeight-screen.clientHeight,
          shortControl:controls.some(r=>r.height<44),
          labelSpread:Math.max(...labelLefts)-Math.min(...labelLefts),
          valueSpread:Math.max(...valueLefts)-Math.min(...valueLefts),
          rowSpread:Math.max(...rows)-Math.min(...rows),
          proofActionGap:action.top-proof.bottom,
          actionBottomGap:body.getBoundingClientRect().bottom-actionRail.getBoundingClientRect().bottom,
          film,recommendation,action,
          videos:document.querySelectorAll('video').length,
        };
      });
      fail(state.pageOverflow>1,`${name} ${width}x${height}: horizontal overflow ${state.pageOverflow}`);
      fail(state.drawerOverflow>1,`${name} ${width}x${height}: drawer overflow ${state.drawerOverflow}`);
      fail(state.screenOverflow>1,`${name} ${width}x${height}: result overflow ${state.screenOverflow}`);
      fail(state.shortControl,`${name} ${width}x${height}: enabled control below 44px`);
      fail(state.labelSpread>1.5,`${name} ${width}x${height}: label anchors drift ${state.labelSpread.toFixed(2)}px`);
      fail(state.valueSpread>1.5,`${name} ${width}x${height}: value anchors drift ${state.valueSpread.toFixed(2)}px`);
      fail(state.rowSpread>1.5,`${name} ${width}x${height}: AI/human row heights drift ${state.rowSpread.toFixed(2)}px`);
      fail(state.proofActionGap<0||state.proofActionGap>28,`${name} ${width}x${height}: proof-to-action gap ${state.proofActionGap.toFixed(2)}px`);
      fail(state.actionBottomGap<0||state.actionBottomGap>32,`${name} ${width}x${height}: action rail bottom gap ${state.actionBottomGap.toFixed(2)}px`);
      fail(state.action.top<0||state.action.bottom>height+1,`${name} ${width}x${height}: action leaves viewport`);
      fail(state.videos!==1,`${name} ${width}x${height}: expected one film, saw ${state.videos}`);
      const split=(width>=900&&height>=651)||(width>=701&&height<=500);
      if(split){
        fail(Math.abs(state.film.right-state.recommendation.left)>1,`${name} ${width}x${height}: desktop split seam drifts`);
        fail(Math.abs(state.film.top-state.recommendation.top)>1||Math.abs(state.film.bottom-state.recommendation.bottom)>1,`${name} ${width}x${height}: split panels do not share height`);
      }else{
        fail(Math.abs(state.film.bottom-state.recommendation.top)>1,`${name} ${width}x${height}: stacked seam drifts`);
      }

      await page.locator('[data-back]').click();
      fail(!(await page.locator('[data-screen="capacity"]').evaluate(node=>node.classList.contains('active'))),`${name} ${width}x${height}: back did not restore Time`);
      const capacityOverflow=await page.locator('[data-screen="capacity"]').evaluate(node=>node.scrollHeight-node.clientHeight);
      fail(capacityOverflow>1,`${name} ${width}x${height}: Time screen overflow ${capacityOverflow}`);
      await page.locator('.choice-list button').nth(2).click();
      fail((await page.locator('.choice-list button').nth(2).getAttribute('aria-pressed'))!=='true',`${name} ${width}x${height}: Time choice did not update`);
      await page.locator('[data-show-result]').click();

      if(capture&&((width===1440&&height===900)||(width===390&&height===844))){
        await page.evaluate(()=>{document.querySelector('video')?.pause();document.querySelector('.resolution-film').dataset.filmState='poster'});
        await page.screenshot({path:`${output}/${name}-${width}x${height}.png`,fullPage:false});
      }
      if(name==='chromium'&&width===390&&height===844){
        await page.locator('[data-keep]').click();
        fail(!((await page.locator('.action-status').textContent())||'').includes('Nothing has been sent'),`${name} ${width}x${height}: Keep consequence missing`);
        const keptOverflow=await page.locator('[data-screen="result"]').evaluate(node=>node.scrollHeight-node.clientHeight);
        fail(keptOverflow>1,`${name} ${width}x${height}: Keep consequence overflows by ${keptOverflow}`);
        await page.locator('.close').click();
        fail(!(await page.locator('.stage').evaluate(node=>node.classList.contains('is-closed'))),`${name} ${width}x${height}: Close failed`);
        await page.locator('.page-start').click();
        fail(await page.locator('.stage').evaluate(node=>node.classList.contains('is-closed')),`${name} ${width}x${height}: reopen failed`);
      }
      await page.close();
    }
  }finally{await browser.close()}
}

try{
  await inspect(chromium,'chromium',viewports,true);
  await inspect(webkit,'webkit',[[390,844],[768,1024],[1440,900]]);
  await inspect(firefox,'firefox',[[390,844],[1440,900]]);
  const reviewBrowser=await chromium.launch({headless:true,channel:'chrome'});
  const review=await reviewBrowser.newPage({viewport:{width:1600,height:1040}});
  await review.goto(origin+reviewPath,{waitUntil:'networkidle'});
  for(const frame of review.frames().slice(1))await frame.evaluate(()=>{document.querySelector('video')?.pause();document.querySelector('.resolution-film').dataset.filmState='poster'});
  await review.screenshot({path:`${output}/paired-review-s2.png`,fullPage:true});
  await review.close();await reviewBrowser.close();
  const reducedBrowser=await chromium.launch({headless:true,channel:'chrome'});
  const reduced=await reducedBrowser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(origin+path,{waitUntil:'networkidle'});
  fail(Boolean(await reduced.locator('video').getAttribute('src')),'reduced motion: playback source attached');
  fail((await reduced.locator('.resolution-film').getAttribute('data-film-state'))!=='poster','reduced motion: poster state missing');
  await reduced.close();await reducedBrowser.close();
}finally{await server.close()}

console.log(JSON.stringify({artifact:'START-HERE-INTELLIGENCE-S2',origin,baselinePreserved:Object.keys(baseline),chromiumViewports:viewports.map(([w,h])=>`${w}x${h}`),webkitViewports:['390x844','768x1024','1440x900'],firefoxViewports:['390x844','1440x900'],output,physicalDevices:'not run',failures},null,2));
if(failures.length)process.exitCode=1;
