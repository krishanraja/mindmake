#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { sourceHashBytes } from "../lib/source-hash.mjs";

const root = resolve(import.meta.dirname, "../..");
const manifestPath = process.env.MINDMAKE_ROUTE_LOCK_MANIFEST
  ? resolve(process.env.MINDMAKE_ROUTE_LOCK_MANIFEST)
  : resolve(root, "quality/route-lock/approved-production-r18.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const failures = [];
const sources = new Map();
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

for (const [relativePath, approvedHash] of Object.entries(manifest.files)) {
  const content = await readFile(resolve(root, relativePath));
  // Git checkouts differ in line endings across Windows and Linux. Only a
  // manifest explicitly opting in uses LF-canonical text; binary assets stay
  // byte-exact, and historic manifests retain their original hash semantics.
  const hashContent = sourceHashBytes(relativePath, content, manifest);
  const actualHash = sha256(hashContent);
  sources.set(relativePath, content.toString("utf8"));
  if (actualHash !== approvedHash) failures.push(`${relativePath}: approved ${approvedHash}, found ${actualHash}`);
}

const brain = JSON.parse(sources.get("src/data/vnext/brain-fixture.json"));
const signalFixture = JSON.parse(sources.get("src/data/vnext/gtm-signals.json"));
const signals = Object.values(signalFixture);
const brainContract = manifest.minimumContracts.brain;
const gtmContract = manifest.minimumContracts.gtm;
const exact = (actual, expected, label) => {
  if (actual !== expected) failures.push(`${label}: expected ${expected}, found ${actual}`);
};

exact(brain.items.length, brainContract.meanings, "Brain meanings");
exact(brain.relationships.length, brainContract.relationships, "Brain relationships");
exact(brain.sources.length, brainContract.sources, "Brain sources");
exact(brain.corrections.length, brainContract.corrections, "Brain corrections");
exact(signals.length, gtmContract.signals, "GTM signals");
exact(signals.reduce((total, signal) => total + signal.responses.length, 0), gtmContract.responseChoices, "GTM response choices");

const contractSource = (name, fallback) => {
  const paths = manifest.contractSources?.[name] ?? [fallback];
  const missing = paths.filter((relativePath) => !sources.has(relativePath));
  if (missing.length) failures.push(`${name} contract source is not locked: ${missing.join(", ")}`);
  return paths.map((relativePath) => sources.get(relativePath) ?? "").join("\n");
};
const brainSource = contractSource("brain", "src/pages/AiBrain.tsx");
const gtmSource = contractSource("gtm", "src/pages/AiGtm.tsx");
for (const instrument of brainContract.requiredInstruments) {
  if (!brainSource.includes(instrument)) failures.push(`Brain is missing approved instrument: ${instrument}`);
}
for (const instrument of gtmContract.requiredInstruments) {
  if (!gtmSource.includes(instrument)) failures.push(`GTM is missing approved instrument: ${instrument}`);
}
for (const state of brainContract.states) {
  if (!brainSource.toLowerCase().includes(state.toLowerCase())) failures.push(`Brain is missing approved state: ${state}`);
}
for (const stage of gtmContract.stages) {
  if (!gtmSource.toLowerCase().includes(stage.toLowerCase())) failures.push(`GTM is missing approved stage: ${stage}`);
}

const publicRouteText = `${brainSource}\n${gtmSource}\n${sources.get("src/data/vnext/gtm-signals.json")}`.toLowerCase();
for (const phrase of manifest.forbiddenPhrases) {
  if (publicRouteText.includes(phrase.toLowerCase())) failures.push(`Forbidden phrase returned: ${phrase}`);
}

console.log(JSON.stringify({
  artifact: manifest.artifact,
  lockedFiles: Object.keys(manifest.files).length,
  brain: { meanings: brain.items.length, relationships: brain.relationships.length, sources: brain.sources.length, corrections: brain.corrections.length },
  gtm: { signals: signals.length, responseChoices: signals.reduce((total, signal) => total + signal.responses.length, 0) },
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
