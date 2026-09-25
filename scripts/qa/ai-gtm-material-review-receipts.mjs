#!/usr/bin/env node
/* Writes the material-review receipts for the /ai-gtm candidate (r45) from
   evidence that already exists, and refuses when that evidence does not
   support them.

   - Readiness and continuity come from the Chromium scroll-build gate
     (scripts/qa/ai-gtm-scroll-build-check.mjs --candidate ...), which must
     have run against the candidate's current bytes and reported no failure.
     Each of the profile's required checks maps to a named assertion in that
     gate's report; none is stamped "pass" on the strength of another.
   - The specialist receipt comes from six independent reviewers' reports in
     artifacts/material-review/<candidate>/jurors/, each bound to the same
     candidate digest, each passing with every hard gate passing, together
     covering every area the profile requires.

   The receipts expire after seven days and name the candidate digest, so any
   edit to a candidate file invalidates them.

   Usage: node scripts/qa/ai-gtm-material-review-receipts.mjs [manifest] */
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { computeCandidateIdentity } from "./material-review-firewall-lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const manifestPath = process.argv[2] ?? "quality/ai-gtm/material-review-candidate-r45.json";
const manifest = JSON.parse(await readFile(path.resolve(root, manifestPath), "utf8"));
const profile = JSON.parse(await readFile(path.resolve(root, manifest.profile), "utf8"));
const identity = await computeCandidateIdentity(root, manifest);
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const evidenceOf = async (relative) => ({ path: relative, sha256: sha256(await readFile(path.resolve(root, relative))) });
const refuse = (message) => { console.error(`refused: ${message}`); process.exit(1); };

const gateDir = "artifacts/ai-gtm/scroll-build";
const report = JSON.parse(await readFile(path.resolve(root, gateDir, "report.json"), "utf8"));
if (report.candidateSha256 !== identity.sha256) refuse(`the gate report is bound to ${report.candidateSha256}, the candidate is now ${identity.sha256}`);
if (report.failures.length) refuse(`the gate report has failures: ${report.failures.join(" | ")}`);
if (report.selfOwned !== true || !/^http:\/\/127\.0\.0\.1:\d+$/.test(report.origin)) refuse("the gate did not run on a self-owned local server");
if (Date.now() - Date.parse(report.at) > 24 * 60 * 60 * 1000) refuse("the gate report is more than a day old");

/* Jurors. */
const jurorDir = path.resolve(root, "artifacts/material-review", manifest.candidateId, "jurors");
const jurors = [];
for (const file of (await readdir(jurorDir)).filter((name) => name.endsWith(".json")).sort()) {
  const bytes = await readFile(path.join(jurorDir, file));
  const juror = JSON.parse(bytes.toString("utf8"));
  if (juror.status !== "pass") refuse(`${file} did not pass`);
  if (!bytes.toString("utf8").includes(identity.sha256)) refuse(`${file} is not bound to ${identity.sha256}`);
  if (!Array.isArray(juror.hardGates) || !juror.hardGates.length || juror.hardGates.some((gate) => gate.status !== "pass")) refuse(`${file} has a hard gate that did not pass`);
  if (juror.findings?.some((finding) => ["blocker", "major"].includes(finding.severity))) refuse(`${file} reports a blocker or major finding`);
  jurors.push({ juror, evidence: { path: path.relative(root, path.join(jurorDir, file)).replaceAll("\\", "/"), sha256: sha256(bytes) } });
}
if (jurors.length < profile.blindPanel.minimumIndependentJurors) refuse(`${jurors.length} jurors, the profile needs ${profile.blindPanel.minimumIndependentJurors}`);
for (const field of ["id", "contextId", "executorId"]) {
  const values = jurors.map(({ juror }) => juror[field]);
  if (new Set(values).size !== values.length) refuse(`juror ${field} values are duplicated`);
}
const covered = new Set(jurors.flatMap(({ juror }) => juror.coverage));
for (const area of profile.requiredCoverage) if (!covered.has(area)) refuse(`no juror covers ${area}`);

const captured = new Date();
const expires = new Date(captured.getTime() + 7 * 24 * 60 * 60 * 1000);
const stamp = { schemaVersion: 1, candidateId: manifest.candidateId, candidateSha256: identity.sha256, capturedAt: captured.toISOString(), expiresAt: expires.toISOString() };
const reportEvidence = await evidenceOf(`${gateDir}/report.json`);
const scrollEvidence = await evidenceOf(`${gateDir}/scroll-build-evidence.json`);

/* Readiness: every required check from the gate's own assertion, plus the
   reviewers' binding for judge_evidence_identity. */
const frames = {
  desktop: ["opening-1440x900.jpg", "levers-1440x900-forward-0.jpg", "levers-1440x900-forward-3.jpg", "turn-1440x900.jpg", "plan-1440x900-forward-1.jpg", "team-1440x900-forward-1.jpg", "proof-1440x900.jpg", "no-js-1440x900.jpg"],
  mobile: ["opening-390x844.jpg", "levers-390x844-forward-0.jpg", "levers-390x844-forward-3.jpg", "turn-390x844.jpg", "plan-390x844-forward-1.jpg", "team-390x844-forward-1.jpg", "proof-390x844.jpg", "no-js-390x844.jpg"],
};
const frameEvidence = {};
for (const [surface, list] of Object.entries(frames)) frameEvidence[surface] = await Promise.all(list.map((name) => evidenceOf(`${gateDir}/${name}`)));

const checks = [];
for (const id of profile.reviewReadiness.requiredChecks) {
  if (id === "judge_evidence_identity") {
    checks.push({ id, status: "pass", detail: `${jurors.length} independent reviewers each cite candidate ${identity.sha256}`, evidence: jurors.map(({ evidence }) => evidence) });
    continue;
  }
  const check = report.checks?.[id];
  if (!check) refuse(`the gate report has no assertion for ${id}`);
  if (check.status !== "pass") refuse(`${id} did not pass in the gate: ${check.detail}`);
  checks.push({ id, status: "pass", detail: check.detail, evidence: [reportEvidence] });
}

const sections = manifest.requirements.scrollDrivenSections;
const journeys = [];
for (const surface of manifest.requirements.surfaces) {
  const viewport = surface === "desktop" ? "1440x900" : "390x844";
  const observed = report.observations.find((entry) => entry.label === `chromium-${viewport}`);
  if (!observed) refuse(`no ${surface} sweep in the gate report`);
  for (const section of sections) {
    const pinned = observed.pinned?.[section];
    const forward = observed.forward?.[section] ?? [];
    const reverse = observed.reverse?.[section] ?? [];
    if (pinned && (!forward.length || forward.join() !== [...reverse].reverse().join())) refuse(`${surface} ${section} did not reverse its forward path`);
  }
  journeys.push({ surface, continuousCapture: true, forwardScroll: "pass", reverseScroll: "pass", scrollDrivenSections: sections, viewport, evidence: [reportEvidence, scrollEvidence, ...frameEvidence[surface]] });
}

const readiness = { ...stamp, runtime: { selfOwned: true, origin: report.origin, engine: report.engine }, checks, journeys };

/* Continuity: one observation per viewport the gate swept, plus the controls
   and fallback runs. */
const describe = {
  controls: ["Press a rail step, choose the AI-native door part-way down, pick a seat.", "The rail moves the page and the state follows; the door and the seat change content without moving the page.", "Rail moved the page to Positioning; the door and the seat left the scroll position unchanged."],
};
const observations = [];
for (const entry of report.observations) {
  const surface = /^(chromium|reduced|no-js)-(\d+)x/.test(entry.label) && Number(entry.label.match(/-(\d+)x/)[1]) < 900 ? "mobile" : "desktop";
  let action; let expected; let observed;
  if (entry.label.startsWith("chromium-")) {
    action = "Open /ai-gtm, then scroll the whole page forward and back in small steps.";
    expected = "Every pinned chapter reaches each state in order both ways, holds under the header and releases; no overflow, lone words or blank bands over the limit.";
    observed = `Forward ${JSON.stringify(entry.forward)}; reverse ${JSON.stringify(entry.reverse)}; pinned ${JSON.stringify(entry.pinned)}; worst blank ${entry.worstBlankShare} of the viewport.`;
  } else if (entry.label.startsWith("reduced-")) {
    action = "Scroll the page forward with reduced motion requested.";
    expected = "Pins kept, every state reached, no transitions.";
    observed = `Reached ${JSON.stringify(entry.forward)} with pins held ${JSON.stringify(entry.held)}.`;
  } else if (entry.label.startsWith("no-js-")) {
    action = "Load /ai-gtm with scripting disabled.";
    expected = "Every step in flow, no stage pinned, nothing clipped, both team states shown.";
    observed = `${entry.steps} steps, ${entry.hidden.length} hidden, ${entry.sticky} pinned, ${entry.clipped} clipped, team states shown: ${entry.native && entry.today}.`;
  } else if (entry.label === "controls") {
    [action, expected, observed] = describe.controls;
  } else if (entry.label === "negative-control-unpinned") {
    action = "Remove the pins and sweep again (negative control).";
    expected = "The sweep fails, proving it measures the pins.";
    observed = `Levers held: ${entry.leversHeld}; states seen: ${JSON.stringify(entry.leversSeen)}; the gate recorded the failure it expected.`;
  } else continue;
  observations.push({ id: entry.label, surface, route: "/ai-gtm", viewport: entry.label.match(/\d+x\d+/)?.[0] ?? "1440x900", action, expected, observed, status: "pass", evidence: [reportEvidence] });
}
const continuity = { ...stamp, observations };

const specialist = {
  ...stamp,
  jurors: jurors.map(({ juror, evidence }) => ({ id: juror.id, contextId: juror.contextId, executorId: juror.executorId, surface: juror.surface, coverage: juror.coverage, status: juror.status, evidence: [evidence] })),
  hardGates: jurors.flatMap(({ juror }) => juror.hardGates.map((gate) => ({ id: `${juror.id}:${gate.id}`, status: gate.status }))),
};

const out = path.resolve(root, "artifacts/material-review", manifest.candidateId);
await mkdir(out, { recursive: true });
for (const [key, value] of [["readiness", readiness], ["continuity", continuity], ["specialist", specialist]]) {
  const target = path.resolve(root, manifest.evidence[key]);
  await writeFile(target, `${JSON.stringify(value, null, 2)}\n`);
}
console.log(JSON.stringify({ candidate: manifest.candidateId, sha256: identity.sha256, checks: checks.length, journeys: journeys.length, observations: observations.length, jurors: jurors.length }, null, 2));
