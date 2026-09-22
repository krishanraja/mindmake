#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4192/prototypes/ai-gtm-vnext-r5/";
const output = "C:/Users/krish/.scratch/mindmake-ai-gtm-vnext-r5";
const viewports = [
  ["desktop-1440x900",1440,900],["shallow-1440x700",1440,700],["wide-1920x800",1920,800],
  ["tablet-1024x768",1024,768],["mobile-430x932",430,932],["mobile-390x844",390,844],
  ["compact-320x568",320,568],["landscape-844x390",844,390],
];
await fs.mkdir(output,{recursive:true});
const browser = await chromium.launch({channel:"chrome",headless:true});
const failures=[];
const fail=(condition,message)=>{if(condition) failures.push(message)};

for(const [name,width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{if(message.type()==="error") errors.push(message.text())});
  const response=await page.goto(base,{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  const opening=await page.evaluate(()=>{
    const hero=document.querySelector(".hero");
    const primary=document.querySelector(".hero .primary-action");
    const secondary=document.querySelector(".hero .text-link");
    const ticker=document.querySelector(".ticker-window");
    const track=document.querySelector(".wire-signals");
    return {
      status:document.body.innerText.length,
      heroHeight:hero.getBoundingClientRect().height,
      heroOverflow:hero.scrollHeight-hero.clientHeight,
      hOverflow:document.documentElement.scrollWidth-innerWidth,
      header:[...document.querySelectorAll(".brand,.menu-trigger")].map(element=>{const rect=element.getBoundingClientRect();return rect.top+rect.height/2}),
      actionWrap:[primary,secondary].map(element=>({height:element.getBoundingClientRect().height,scrollWidth:element.scrollWidth,clientWidth:element.clientWidth})),
      ticker:{overflow:getComputedStyle(ticker).overflowX,animation:getComputedStyle(track).animationName,clones:track.querySelectorAll("[data-ticker-clone]").length,scrollWidth:ticker.scrollWidth,clientWidth:ticker.clientWidth},
    };
  });
  fail(!response?.ok(),`${name}: response failed`);
  fail(errors.length,`${name}: ${errors.join(" | ")}`);
  fail(opening.status<900,`${name}: missing content`);
  fail(Math.abs(opening.heroHeight-height)>1,`${name}: hero ${opening.heroHeight}px`);
  fail(opening.heroOverflow>1,`${name}: hero clips ${opening.heroOverflow}px`);
  fail(opening.hOverflow>1,`${name}: horizontal overflow ${opening.hOverflow}px`);
  fail(Math.abs(opening.header[0]-opening.header[1])>2,`${name}: header alignment`);
  fail(opening.actionWrap.some(action=>action.height>56||action.scrollWidth>action.clientWidth+1),`${name}: hero action wraps or clips`);
  fail(opening.ticker.overflow!=="hidden",`${name}: ticker exposes ${opening.ticker.overflow} overflow`);
  fail(opening.ticker.animation!=="ticker-loop"||opening.ticker.clones!==5||opening.ticker.scrollWidth<=opening.ticker.clientWidth,`${name}: ticker is not a continuous doubled wire`);
  const tickerTransformBefore=await page.locator(".wire-signals").evaluate(element=>getComputedStyle(element).transform);
  await page.waitForTimeout(260);
  const tickerTransformAfter=await page.locator(".wire-signals").evaluate(element=>getComputedStyle(element).transform);
  fail(tickerTransformBefore===tickerTransformAfter,`${name}: ticker motion is not observable`);
  await page.screenshot({path:`${output}/${name}-hero.png`});

  for(const signal of ["pricing","commerce","product","content","service"]){
    const control=page.locator(`button[data-signal="${signal}"]:not([data-ticker-clone])`);
    await control.dispatchEvent("click");
    fail(await control.getAttribute("aria-checked")!=="true",`${name}: ${signal} does not select`);
  }
  for(const responseIndex of [0,1,2]){
    await page.locator(`[data-response="${responseIndex}"]`).click();
    const state=await page.evaluate(index=>({checked:document.querySelector(`[data-response="${index}"]`).getAttribute("aria-checked"),map:["mapProduct","mapPrice","mapPositioning","mapPeople"].every(id=>document.getElementById(id).textContent.trim().length>12),overflow:document.documentElement.scrollWidth-innerWidth}),responseIndex);
    fail(state.checked!=="true"||!state.map,`${name}: response ${responseIndex} does not update map`);
    fail(state.overflow>1,`${name}: interaction overflow`);
  }

  await page.evaluate(()=>scrollTo(0,document.querySelector("#decisionTable").offsetTop));
  await page.waitForTimeout(120);
  const decisionMobile=await page.evaluate(()=>{
    const section=document.querySelector("#decisionTable");
    const tabs=document.querySelector(".response-tabs").getBoundingClientRect();
    const caveat=document.querySelector(".signal-caveat");
    return {distance:tabs.top+scrollY-section.offsetTop,caveatOpen:caveat.open,overflow:document.documentElement.scrollWidth-innerWidth};
  });
  if(width<=960&&height>width) fail(decisionMobile.distance>height,`${name}: response choices begin ${Math.round(decisionMobile.distance)}px into the signal section`);
  fail(decisionMobile.caveatOpen,`${name}: evidence caveat is not progressively disclosed`);
  fail(decisionMobile.overflow>1,`${name}: decision section overflows`);
  if(width<=430) await page.screenshot({path:`${output}/${name}-decision.png`,fullPage:false});

  await page.locator("[data-open-start]").first().click();
  const drawer=await page.evaluate(()=>{const panel=document.querySelector(".start-drawer");const rect=panel.getBoundingClientRect();return {rect,overflow:panel.scrollHeight-panel.clientHeight,focus:document.activeElement?.id,inert:document.querySelector("main").inert}});
  fail(drawer.rect.bottom>height+1||drawer.rect.left<0||drawer.overflow>1,`${name}: drawer does not fit`);
  fail(drawer.focus!=="workEmail"||!drawer.inert,`${name}: drawer focus or inert state failed`);
  await page.keyboard.press("Escape");
  await page.close();
}

const review=await browser.newPage({viewport:{width:1180,height:760}});
await review.goto(`${base}review.html`,{waitUntil:"networkidle"});
fail(await review.locator("iframe").count()!==2,"paired review missing frames");
await review.screenshot({path:`${output}/paired-review.png`,fullPage:true});
await review.close();
const reducedPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
await reducedPage.goto(base,{waitUntil:"networkidle"});
const reducedState=await reducedPage.evaluate(()=>({animation:getComputedStyle(document.querySelector(".wire-signals")).animationName,overflow:getComputedStyle(document.querySelector(".ticker-window")).overflowX}));
fail(reducedState.animation!=="none"||reducedState.overflow!=="auto","reduced motion ticker fallback failed");
await reducedPage.close();
await browser.close();
console.log(JSON.stringify({artifact:"ai-gtm-vnext-r5",output,failures},null,2));
if(failures.length)process.exitCode=1;
