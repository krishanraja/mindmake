#!/usr/bin/env node
import fs from "node:fs/promises";

const TARGETS = [
  "scripts/generate-llms.mjs",
  "public/llms.txt",
  "prototypes/ai-gtm-vnext-r6/index.html",
  "prototypes/ai-gtm-vnext-r6/script.js",
  "prototypes/ai-brain-vnext-r5/index.html",
];

const FORBIDDEN = [
  "Keep the seat",
  "Meter the work",
  "Price the result",
  "Keep website-first",
  "Syndicate the catalogue",
  "Build for agent buying",
  "Keep the spec gate",
  "Prototype before commitment",
  "Prototype against evidence",
  "Protect the page",
  "License the evidence",
  "Build the intelligence product",
  "Lead with features",
  "Name the completed job",
  "Prove the operating model",
  "Start with either",
  "Three things you know at the end",
  "Inspect the meaning, not just the answer",
];

const failures = [];
const files = new Map();

for (const target of TARGETS) {
  const source = await fs.readFile(target, "utf8");
  files.set(target, source);
  for (const phrase of FORBIDDEN) {
    if (source.toLowerCase().includes(phrase.toLowerCase())) {
      failures.push(`${target}: unexplained shorthand remains: ${phrase}`);
    }
  }
  if (source.includes("—")) failures.push(`${target}: em dash remains`);
}

const gtm = files.get("prototypes/ai-gtm-vnext-r6/script.js");
const responseNames = [...gtm.matchAll(/\{\s*name:\s*"([^"]+)"/g)].map((match) => match[1]);

if (responseNames.length !== 15) {
  failures.push(`AI GTM: expected 15 response labels, found ${responseNames.length}`);
}

for (const label of responseNames) {
  const words = label.trim().split(/\s+/);
  if (words.length < 4) failures.push(`AI GTM: response label lacks its object or consequence: ${label}`);
  if (label.length > 48) failures.push(`AI GTM: response label is too long for a control: ${label}`);
}

if (new Set(responseNames.map((label) => label.toLowerCase())).size !== responseNames.length) {
  failures.push("AI GTM: response labels are not unique");
}

const brain = files.get("prototypes/ai-brain-vnext-r5/index.html");
if (!brain.includes("Inspect how a decision becomes reusable judgement.")) {
  failures.push("AI Brain: the consolidated sequence title is missing");
}
if (/brain-map-panel[^>]*>\s*<div class="state-copy">/.test(brain)) {
  failures.push("AI Brain: the graph still carries a second instruction block");
}
if (!brain.includes('preserveAspectRatio="xMidYMid meet"')) {
  failures.push("AI Brain: the graph no longer fits its available panel deliberately");
}

console.log(JSON.stringify({
  artifact: "plain-language-contract",
  targets: TARGETS,
  responseLabels: responseNames.length,
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
