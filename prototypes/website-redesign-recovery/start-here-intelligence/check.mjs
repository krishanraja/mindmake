#!/usr/bin/env node
import { createServer } from 'vite';
import { chromium, firefox, webkit } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-start-here-intelligence';
const path = '/prototypes/website-redesign-recovery/start-here-intelligence/index.html';
const viewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

await mkdir(output, { recursive: true });
const server = await createServer({ root, server:{ host:'127.0.0.1',port:0,strictPort:false }, logLevel:'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

async function inspect(browserType,name,matrix,capture=false){
  const browser = await browserType.launch({headless:true,...(browserType===chromium?{channel:'chrome'}:{})});
  try{
    for(const [width,height] of matrix){
      const page = await browser.newPage({viewport:{width,height}});
      await page.goto(origin+path,{waitUntil:'networkidle'});
      await page.evaluate(()=>document.fonts.ready);
      const state = await page.evaluate(()=>{
        const drawer=document.querySelector('.drawer').getBoundingClientRect();
        const screen=document.querySelector('.screen.active');
        const action=screen.querySelector('.primary').getBoundingClientRect();
        const headline=document.querySelector('.film-copy h1').getBoundingClientRect();
        const controls=[...document.querySelectorAll('button:not(:disabled)')].map(node=>node.getBoundingClientRect()).filter(rect=>rect.width&&rect.height);
        return{pageOverflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,drawerOverflow:document.querySelector('.drawer').scrollHeight-document.querySelector('.drawer').clientHeight,screenOverflow:screen.scrollHeight-screen.clientHeight,drawer:{top:drawer.top,right:drawer.right,bottom:drawer.bottom},action:{top:action.top,bottom:action.bottom},headline:{width:headline.width,height:headline.height},shortControl:controls.some(rect=>rect.height<44),videos:document.querySelectorAll('video').length};
      });
      fail(state.pageOverflow>1,`${name} ${width}x${height}: horizontal overflow ${state.pageOverflow}`);
      fail(state.drawerOverflow>1,`${name} ${width}x${height}: drawer overflow ${state.drawerOverflow}`);
      fail(state.screenOverflow>1,`${name} ${width}x${height}: result screen overflow ${state.screenOverflow}`);
      fail(Math.abs(state.drawer.top)>1||Math.abs(state.drawer.right-width)>1||Math.abs(state.drawer.bottom-height)>1,`${name} ${width}x${height}: drawer leaves viewport`);
      fail(state.action.top<0||state.action.bottom>height+1,`${name} ${width}x${height}: action leaves viewport`);
      fail(state.headline.width<100||state.headline.height<40,`${name} ${width}x${height}: headline collapsed`);
      fail(state.shortControl,`${name} ${width}x${height}: interactive control below 44px target floor`);
      fail(state.videos!==1,`${name} ${width}x${height}: expected one film, saw ${state.videos}`);

      await page.locator('[data-back]').click();
      fail(!(await page.locator('[data-screen="capacity"]').evaluate(node=>node.classList.contains('active'))),`${name} ${width}x${height}: back did not restore Time`);
      const capacityOverflow=await page.locator('[data-screen="capacity"]').evaluate(node=>node.scrollHeight-node.clientHeight);
      fail(capacityOverflow>1,`${name} ${width}x${height}: Time screen overflow ${capacityOverflow}`);
      await page.locator('.choice-list button').nth(2).click();
      fail((await page.locator('.choice-list button').nth(2).getAttribute('aria-pressed'))!=='true',`${name} ${width}x${height}: time choice did not update`);
      await page.locator('[data-show-result]').click();
      fail(!(await page.locator('[data-screen="result"]').evaluate(node=>node.classList.contains('active'))),`${name} ${width}x${height}: recommendation did not restore`);

      if(capture&&((width===1440&&height===900)||(width===390&&height===844))){
        await page.evaluate(()=>{const video=document.querySelector('video');video?.pause();document.querySelector('.resolution-film').dataset.filmState='poster';});
        await page.screenshot({path:`${output}/${name}-${width}x${height}.png`,fullPage:false});
      }
      if(name==='chromium'&&width===390&&height===844){
        await page.locator('[data-keep]').click();
        fail(!((await page.locator('.action-status').textContent())||'').includes('Nothing has been sent'),`${name} ${width}x${height}: Keep did not expose its consequence`);
        const keptOverflow=await page.locator('[data-screen="result"]').evaluate(node=>node.scrollHeight-node.clientHeight);
        fail(keptOverflow>1,`${name} ${width}x${height}: Keep consequence overflows by ${keptOverflow}`);
        await page.locator('.close').click();
        fail(!(await page.locator('.stage').evaluate(node=>node.classList.contains('is-closed'))),`${name} ${width}x${height}: Close did not dismiss the drawer`);
        await page.locator('.page-start').click();
        fail(await page.locator('.stage').evaluate(node=>node.classList.contains('is-closed')),`${name} ${width}x${height}: Start here did not restore the drawer`);
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
  await review.goto(origin+'/prototypes/website-redesign-recovery/start-here-intelligence/review.html',{waitUntil:'networkidle'});
  for(const frame of review.frames().slice(1))await frame.evaluate(()=>{const video=document.querySelector('video');video?.pause();document.querySelector('.resolution-film').dataset.filmState='poster';});
  await review.screenshot({path:`${output}/paired-review.png`,fullPage:true});
  await review.close();await reviewBrowser.close();
  const browser=await chromium.launch({headless:true,channel:'chrome'});
  const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
  await reduced.goto(origin+path,{waitUntil:'networkidle'});
  fail(Boolean(await reduced.locator('video').getAttribute('src')),'reduced motion: playback source was attached');
  fail((await reduced.locator('.resolution-film').getAttribute('data-film-state'))!=='poster','reduced motion: poster state not retained');
  await reduced.close();await browser.close();
}finally{await server.close()}

console.log(JSON.stringify({artifact:'START-HERE-INTELLIGENCE-S1',origin,chromiumViewports:viewports.map(([w,h])=>`${w}x${h}`),webkitViewports:['390x844','768x1024','1440x900'],firefoxViewports:['390x844','1440x900'],output,physicalDevices:'not run',failures},null,2));
if(failures.length)process.exitCode=1;
