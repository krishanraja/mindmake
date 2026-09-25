#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { hashLockedFile, lockPath } from "../lib/route-lock.mjs";

// The generated lock by default; a frozen numbered manifest only when named.
const manifestPath = process.env.MINDMAKE_ROUTE_LOCK_MANIFEST
  ? resolve(process.env.MINDMAKE_ROUTE_LOCK_MANIFEST)
  : lockPath;
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const failures = [];
const sources = new Map();

for (const [relativePath, approvedHash] of Object.entries(manifest.files)) {
  const { content, hash: actualHash } = await hashLockedFile(relativePath, manifest);
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
// The signal fixture stays locked as the GTM evidence source. From r25 the
// page no longer asks the reader to pick among its responses, so a manifest
// states either the picker counts (r17 and earlier) or the cited signals (r25
// onwards). A contract stating neither is refused rather than passed.
if (gtmContract.signals === undefined && gtmContract.citedSignals === undefined) failures.push("GTM contract states neither signal counts nor cited signals");
if (gtmContract.signals !== undefined) exact(signals.length, gtmContract.signals, "GTM signals");
if (gtmContract.responseChoices !== undefined) exact(signals.reduce((total, signal) => total + signal.responses.length, 0), gtmContract.responseChoices, "GTM response choices");
for (const key of gtmContract.citedSignals ?? []) {
  if (!signalFixture[key]?.source) failures.push(`GTM cites a signal with no source: ${key}`);
}

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

if (failures.length && manifestPath === lockPath) {
  failures.push("If these edits were intended, run npm run qa:approved-routes:update and commit the lock with them.");
}

console.log(JSON.stringify({
  lock: manifestPath === lockPath ? "quality/route-lock/approved-production.lock.json" : manifest.artifact,
  lockedFiles: Object.keys(manifest.files).length,
  brain: { meanings: brain.items.length, relationships: brain.relationships.length, sources: brain.sources.length, corrections: brain.corrections.length },
  gtm: { signals: signals.length, responseChoices: signals.reduce((total, signal) => total + signal.responses.length, 0) },
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
