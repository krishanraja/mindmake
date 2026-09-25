#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readdir, readFile, stat } from "node:fs/promises";
import { relative, resolve, sep } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const handoffPath = resolve(root, "quality/website-redesign/homepage-handoff.v1.json");
const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const failures = [];

async function filesBelow(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const target = resolve(directory, entry.name);
    if (entry.isDirectory()) result.push(...await filesBelow(target));
    else if (entry.isFile()) result.push(target);
  }
  return result;
}

async function treeHash(directory) {
  const files = await filesBelow(directory);
  const records = [];
  for (const file of files) {
    const path = relative(directory, file).split(sep).join("/");
    records.push(`${path}\0${sha256(await readFile(file))}`);
  }
  records.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
  return sha256(Buffer.from(records.join("\n"), "utf8"));
}

const handoff = JSON.parse(await readFile(handoffPath, "utf8"));
const material = JSON.parse(await readFile(resolve(root, handoff.sourceOfTruth.materialReviewManifest), "utf8"));
const integratedCandidateExists = material.candidateId === handoff.assemblyState?.nextCandidate?.id
  && material.status === "candidate"
  && material.artifact?.kind === "integrated-production-candidate"
  && material.artifact?.integrationModel === "single-dom-single-scroll-context";
if (handoff.schemaVersion !== 1) failures.push("schemaVersion must equal 1");
if (handoff.status !== "handoff-baseline-not-production-candidate") failures.push("handoff status must remain non-production");

for (const tree of handoff.integrity?.trees ?? []) {
  const target = resolve(root, tree.path);
  try {
    if (!(await stat(target)).isDirectory()) throw new Error("not a directory");
    const actual = await treeHash(target);
    if (actual !== tree.sha256) failures.push(`${tree.path}: expected ${tree.sha256}, found ${actual}`);
  } catch (error) {
    failures.push(`${tree.path}: ${error.message}`);
  }
}

for (const file of handoff.integrity?.files ?? []) {
  try {
    const actual = sha256(await readFile(resolve(root, file.path)));
    if (actual !== file.sha256) failures.push(`${file.path}: expected ${file.sha256}, found ${actual}`);
  } catch (error) {
    failures.push(`${file.path}: ${error.message}`);
  }
}

const requiredDecisionIds = [
  "shellAlignment", "masthead", "navigation", "opening", "history", "authority",
  "leadershipDividend", "routeOutcome", "footer", "sharedLanguage", "message"
];
for (const id of requiredDecisionIds) if (!handoff.decisions?.[id]) failures.push(`decision missing: ${id}`);

const exactLocks = [
  [handoff.globalLocks?.integration, "The next material candidate is one DOM and one scroll context. Iframes are prohibited in the final integration.", "integration lock"],
  [handoff.decisions?.shellAlignment?.selection, "logo-left-equals-hero-left", "logo alignment"],
  [handoff.decisions?.authority?.selection?.mobileLayout, "network", "authority mobile composition"],
  [handoff.decisions?.message?.selection?.openingHeadline, "Build the business that can think with you.", "opening headline"],
  [handoff.decisions?.message?.selection?.gtmDoorDetail, "Build your AI native pricing, positioning and org.", "AI GTM subheading"],
  [handoff.decisions?.sharedLanguage?.selection?.blog, "Ideas you can use", "editorial route label"],
  [handoff.decisions?.sharedLanguage?.selection?.answers, "Quick AI tips", "answer route label"],
  [handoff.decisions?.sharedLanguage?.selection?.faq, "Questions we get asked", "buying questions label"]
];
for (const [actual, expected, label] of exactLocks) if (actual !== expected) failures.push(`${label}: expected ${expected}, found ${actual}`);

if (handoff.assemblyState?.rejected?.id !== "homepage-production-synthesis-r1") failures.push("R1 must remain rejected");
if (handoff.assemblyState?.referenceOnly?.id !== "homepage-production-synthesis-r2") failures.push("R2 must remain reference-only");
if (handoff.assemblyState?.nextCandidate?.status !== "not-built") failures.push("the next integrated candidate must remain not-built until it exists");

const ledger = JSON.parse(await readFile(resolve(root, handoff.sourceOfTruth.feedbackLedger), "utf8"));
for (const id of handoff.blockingFeedback ?? []) {
  const item = ledger.items?.find((candidate) => candidate.id === id);
  if (!item) failures.push(`blocking feedback missing from ledger: ${id}`);
  else if (integratedCandidateExists && item.status !== "verified") failures.push(`integrated candidate feedback is not verified: ${id} (${item.status})`);
  else if (!integratedCandidateExists && !ledger.rules?.approvalBlockedByStatuses?.includes(item.status)) failures.push(`blocking feedback no longer blocks approval before R3 exists: ${id} (${item.status})`);
}

const r2Reference = JSON.parse(await readFile(resolve(root, "quality/website-redesign/material-review-reference-r2.json"), "utf8"));
if (r2Reference.status !== "blocked-reference" || r2Reference.artifact?.kind !== "fidelity-harness") failures.push("R2 must remain separately recorded as a blocked fidelity reference");
if (!integratedCandidateExists) failures.push("the active material manifest does not identify the built single-DOM R3 candidate");
if (handoff.commands?.presentCandidate !== "npm run review:material -- quality/website-redesign/material-review-candidate.json") failures.push("presentation command changed");

console.log(JSON.stringify({
  artifact: handoff.artifact,
  status: handoff.status,
  protectedTrees: handoff.integrity?.trees?.length ?? 0,
  protectedFiles: handoff.integrity?.files?.length ?? 0,
  decisions: requiredDecisionIds.length,
  blockingFeedback: handoff.blockingFeedback,
  nextCandidate: handoff.assemblyState?.nextCandidate,
  failures
}, null, 2));

if (failures.length) process.exitCode = 1;
