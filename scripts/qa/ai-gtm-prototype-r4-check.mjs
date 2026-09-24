#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4192/prototypes/ai-gtm-vnext-r4/";
const output = "C:/Users/krish/.scratch/mindmake-ai-gtm-vnext-r4";
const viewports = [
  ["desktop-1440x900",1440,900],["shallow-1440x700",1440,700],["wide-1920x800",1920,800],
  ["tablet-1024x768",1024,768],["boundary-1281x700",1281,700],["boundary-1280x700",1280,700],["boundary-1120x700",1120,700],
  ["mobile-390x844",390,844],["compact-320x568",320,568],["landscape-844x390",844,390],
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
    const rect=hero.getBoundingClientRect();
    return {status:document.body.innerText.length,heroHeight:rect.height,heroOverflow:hero.scrollHeight-hero.clientHeight,hOverflow:document.documentElement.scrollWidth-innerWidth,header:[...document.querySelectorAll(".brand,.menu-trigger")].map(el=>{const r=el.getBoundingClientRect();return r.top+r.height/2})};
  });
  fail(!response?.ok(),`${name}: response failed`);fail(errors.length,`${name}: ${errors.join(" | ")}`);fail(opening.status<900,`${name}: missing content`);fail(Math.abs(opening.heroHeight-height)>1,`${name}: hero ${opening.heroHeight}px`);fail(opening.heroOverflow>1,`${name}: hero clips ${opening.heroOverflow}px`);fail(opening.hOverflow>1,`${name}: horizontal overflow ${opening.hOverflow}px`);fail(Math.abs(opening.header[0]-opening.header[1])>2,`${name}: header alignment`);
  await page.screenshot({path:`${output}/${name}-hero.png`});
  for(const signal of ["pricing","commerce","product","content","service"]){await page.locator(`[data-signal="${signal}"]`).click();fail(await page.locator(`[data-signal="${signal}"]`).getAttribute("aria-checked")!=="true",`${name}: ${signal} does not select`)}
  for(const responseIndex of [0,1,2]){await page.locator(`[data-response="${responseIndex}"]`).click();const state=await page.evaluate(index=>({checked:document.querySelector(`[data-response="${index}"]`).getAttribute("aria-checked"),map:["mapProduct","mapPrice","mapPositioning","mapPeople"].every(id=>document.getElementById(id).textContent.trim().length>12),overflow:document.documentElement.scrollWidth-innerWidth}),responseIndex);fail(state.checked!=="true"||!state.map,`${name}: response ${responseIndex} does not update map`);fail(state.overflow>1,`${name}: interaction overflow`) }
  const decisionTop=await page.locator("#decisionTable").evaluate(el=>el.offsetTop);
  const travel=await page.locator("#decisionTable").evaluate(el=>Math.max(1,el.offsetHeight-innerHeight));
  for(const phase of [0,1,2]){await page.evaluate(({top,travel,phase})=>scrollTo(0,top+travel*(phase/2)),{top:decisionTop,travel,phase});await page.waitForTimeout(160);const state=await page.evaluate(phase=>({phase:document.querySelector("#decisionTable").dataset.phase,current:document.querySelector("[data-decision-jump].is-active")?.dataset.decisionJump,sticky:document.querySelector(".decision-sticky").getBoundingClientRect(),visible:phase===0?document.querySelector(".decision-intro").getBoundingClientRect():phase===1?document.querySelector(".commercial-map").getBoundingClientRect():document.querySelector(".test-ticket").getBoundingClientRect()}),phase);if(width>1280){fail(state.phase!==String(phase)||state.current!==String(phase),`${name}: phase ${phase} not active`);fail(state.visible.top<75||state.visible.bottom>height+1,`${name}: phase ${phase} leaves viewport`)}if(["desktop-1440x900","shallow-1440x700","mobile-390x844"].includes(name))await page.screenshot({path:`${output}/${name}-phase-${phase}.png`})}
  await page.locator("[data-open-start]").first().click();const drawer=await page.evaluate(()=>{const p=document.querySelector(".start-drawer");const r=p.getBoundingClientRect();return {r,overflow:p.scrollHeight-p.clientHeight,focus:document.activeElement?.id,inert:document.querySelector("main").inert}});fail(drawer.r.bottom>height+1||drawer.r.left<0||drawer.overflow>1,`${name}: drawer does not fit`);fail(drawer.focus!=="workEmail"||!drawer.inert,`${name}: drawer focus/inert`);await page.keyboard.press("Escape");
  await page.close();
}
const review=await browser.newPage({viewport:{width:1180,height:760}});await review.goto(`${base}review.html`,{waitUntil:"networkidle"});fail(await review.locator("iframe").count()!==2,"paired review missing frames");await review.screenshot({path:`${output}/paired-review.png`,fullPage:true});await review.close();
await browser.close();console.log(JSON.stringify({artifact:"ai-gtm-vnext-r4",output,failures},null,2));if(failures.length)process.exitCode=1;
