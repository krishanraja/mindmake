#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const base=`${process.env.MINDMAKE_QA_ORIGIN ?? "http://127.0.0.1:4192"}/prototypes/ai-brain-vnext-r5/`;
const output="C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r5";
const viewports=[["desktop-1440x900",1440,900],["shallow-1440x700",1440,700],["wide-1920x800",1920,800],["tablet-1024x768",1024,768],["mobile-430x932",430,932],["mobile-390x844",390,844],["compact-320x568",320,568],["landscape-844x390",844,390]];
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:"chrome",headless:true});
const failures=[];
const fail=(condition,message)=>{if(condition)failures.push(message)};

for(const [name,width,height] of viewports){
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  page.on("console",message=>{if(message.type()==="error")errors.push(message.text())});
  const response=await page.goto(base,{waitUntil:"networkidle"});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForFunction(()=>document.querySelector("#livingBrain")?.dataset.status==="ready",null,{timeout:5000});
  const opening=await page.evaluate(()=>{const hero=document.querySelector(".hero");return {text:document.body.innerText.length,hero:hero.getBoundingClientRect().height,hOverflow:document.documentElement.scrollWidth-innerWidth,heroOverflow:hero.scrollHeight-hero.clientHeight,nodes:document.querySelectorAll(".living-node").length,edges:document.querySelectorAll(".living-edge").length,animation:getComputedStyle(document.querySelector(".living-viewport")).animationName,sequenceTitle:document.querySelector("#sequenceTitle").textContent.trim(),oldInstruction:document.body.innerText.includes("Inspect the meaning, not just the answer")}});
  fail(!response?.ok(),`${name}: response failed`);
  fail(errors.length,`${name}: ${errors.join(" | ")}`);
  fail(opening.text<900,`${name}: missing content`);
  fail(Math.abs(opening.hero-height)>1,`${name}: hero ${opening.hero}px`);
  fail(opening.hOverflow>1,`${name}: horizontal overflow ${opening.hOverflow}px`);
  fail(opening.heroOverflow>1,`${name}: hero clips ${opening.heroOverflow}px`);
  fail(opening.nodes!==20||opening.edges!==18,`${name}: Living Brain is ${opening.nodes} nodes and ${opening.edges} relationships`);
  fail(opening.animation!=="living-drift",`${name}: Living Brain is not moving`);
  fail(opening.sequenceTitle!=="Inspect how a decision becomes reusable judgement.",`${name}: sequence instruction is not consolidated`);
  fail(opening.oldInstruction,`${name}: redundant Brain instruction remains visible`);
  await page.screenshot({path:`${output}/${name}-hero.png`});

  for(let stage=0;stage<4;stage++){
    await page.locator(`[data-stage="${stage}"]`).click();
    await page.waitForTimeout(650);
    const state=await page.evaluate(stage=>{const sheet=document.querySelector(".decision-sheet").getBoundingClientRect();const panel=document.querySelector(`[data-panel="${stage}"]`).getBoundingClientRect();return {current:document.querySelector('[data-stage][aria-current="step"]')?.dataset.stage,sheet,panel,overflow:document.documentElement.scrollWidth-innerWidth,buttons:[...document.querySelectorAll(`[data-panel="${stage}"] button`)].map(button=>button.getBoundingClientRect().height)}},stage);
    fail(state.current!==String(stage),`${name}: stage ${stage} inactive`);
    fail(state.overflow>1,`${name}: stage ${stage} overflow`);
    fail(state.panel.right>state.sheet.right+1||state.panel.bottom>state.sheet.bottom+1,`${name}: stage ${stage} leaves sheet`);
    fail(state.buttons.some(buttonHeight=>buttonHeight<44),`${name}: stage ${stage} undersized control`);
    if(["desktop-1440x900","shallow-1440x700","mobile-430x932","mobile-390x844","compact-320x568"].includes(name))await page.screenshot({path:`${output}/${name}-stage-${stage}.png`});
    if(stage===1){
      const brainTransformBefore=await page.locator(".living-viewport").evaluate(element=>getComputedStyle(element).transform);
      await page.waitForTimeout(260);
      const brainTransformAfter=await page.locator(".living-viewport").evaluate(element=>getComputedStyle(element).transform);
      fail(brainTransformBefore===brainTransformAfter,`${name}: Living Brain motion is not observable while the Brain is active`);
      await page.locator('.living-node[data-id="BI-003"]').focus();
      await page.keyboard.press("Enter");
      const graph=await page.evaluate(()=>{const sheet=document.querySelector(".decision-sheet").getBoundingClientRect();const map=document.querySelector(".living-brain").getBoundingClientRect();const chrome=document.querySelector(".sheet-chrome").getBoundingClientRect();const graphBox=document.querySelector(".living-graph").getBoundingClientRect();const nodeTops=[...document.querySelectorAll(".living-node")].map(node=>node.getBoundingClientRect().top).filter(top=>Number.isFinite(top));return {map,sheet,title:document.querySelector("#brainMapTitle").textContent.toLowerCase(),evidence:document.querySelector("#brainMapEvidence").textContent.toLowerCase(),version:document.querySelector("#brainMapVersion").textContent.toLowerCase(),selected:document.querySelectorAll(".living-node.is-active").length,activeEdges:document.querySelectorAll(".living-edge.is-active").length,redundantCopy:document.querySelectorAll('.brain-map-panel>.state-copy').length,panelGap:Math.abs(map.top-chrome.bottom),nodeTopGap:Math.min(...nodeTops)-graphBox.top}});
      fail(!graph.title.includes("human release judgement")||graph.evidence!=="direct"||graph.version!=="v2",`${name}: actual inspector state missing`);
      fail(graph.selected!==1||graph.activeEdges<2,`${name}: graph selection does not propagate`);
      fail(graph.map.right>graph.sheet.right+1||graph.map.bottom>graph.sheet.bottom+1,`${name}: Living Brain leaves its sheet`);
      fail(graph.redundantCopy!==0||graph.panelGap>8,`${name}: the Brain does not begin immediately below its chrome (${Math.round(graph.panelGap)}px)`);
      fail(graph.nodeTopGap>64,`${name}: ${Math.round(graph.nodeTopGap)}px of empty graph remains above the first node`);
      await page.locator("[data-open-evidence]").dispatchEvent("click");
      await page.waitForTimeout(700);
      fail(await page.locator('[data-stage="2"]').getAttribute("aria-current")!=="step",`${name}: evidence link does not advance`);
    }
  }
  await page.locator('[data-stage="3"]').click();
  await page.waitForTimeout(500);
  await page.locator("#applyCorrection").click();
  const repair=await page.evaluate(()=>({applied:document.querySelector("#brainChange").classList.contains("is-applied"),text:document.querySelector("#repairText").textContent,label:document.querySelector("#applyCorrection span").textContent}));
  fail(!repair.applied||!repair.text.includes("Rebuilt")||!repair.label.includes("Undo"),`${name}: correction does not repair Brain`);
  await page.screenshot({path:`${output}/${name}-repair.png`});
  await page.close();
}

const review=await browser.newPage({viewport:{width:1180,height:760}});
await review.goto(`${base}review.html`,{waitUntil:"networkidle"});
fail(await review.locator("iframe").count()!==2,"paired review missing frames");
await review.screenshot({path:`${output}/paired-review.png`,fullPage:true});
await review.close();
const reducedPage=await browser.newPage({viewport:{width:390,height:844},reducedMotion:"reduce"});
await reducedPage.goto(base,{waitUntil:"networkidle"});
await reducedPage.waitForFunction(()=>document.querySelector("#livingBrain")?.dataset.status==="ready");
const reducedAnimation=await reducedPage.locator(".living-viewport").evaluate(element=>getComputedStyle(element).animationName);
fail(reducedAnimation!=="none","Living Brain reduced motion fallback failed");
await reducedPage.close();
await browser.close();
console.log(JSON.stringify({artifact:"ai-brain-vnext-r5",output,failures},null,2));
if(failures.length)process.exitCode=1;
