import fs from "node:fs/promises";
import path from "node:path";
import {
  candidateIdentity,
  hashEvidenceManifest,
  hashRubric,
  loadRubric,
  readJson,
  sha256,
  validateRubric,
} from "./award-panel-lib.mjs";

const runDirectory = process.argv[2];
if (!runDirectory) {
  console.error("usage: npm run qa:award-panel:capture:validate -- <run-directory>");
  process.exit(1);
}

const absolute = path.resolve(runDirectory);
const failures = [];
const fail = (condition, message) => {
  if (condition) failures.push(message);
};
const rubric = await loadRubric();
const run = await readJson(path.join(absolute, "run.json"));
const currentCandidate = await candidateIdentity();
const observations = run.evidenceManifest?.observations ?? [];
const byId = new Map();

fail(validateRubric(rubric).length > 0, `active rubric is invalid: ${validateRubric(rubric).join("; ")}`);
fail(run.schemaVersion !== 3, "run schemaVersion must be 3");
fail(run.rubricVersion !== rubric.rubricRevision, "run rubric revision does not match active rubric");
fail(run.rubricSha256 !== hashRubric(rubric), "run rubric hash does not match active rubric");
fail(run.candidate?.sha256 !== currentCandidate.sha256, "run candidate does not match current candidate");
fail(run.evidenceManifestSha256 !== hashEvidenceManifest(run.evidenceManifest), "evidence manifest hash is invalid");
fail(Date.now() > Date.parse(run.expiresAt), `evidence expired at ${run.expiresAt}`);

for (const observation of observations) {
  fail(byId.has(observation.id), `duplicate observation id: ${observation.id}`);
  byId.set(observation.id, observation);
  const evidenceItems = observation.evidence ?? [];
  fail(observation.status === "pass" && evidenceItems.length === 0, `${observation.id}: passing observation has no evidence`);
  for (const evidence of evidenceItems) {
    if (typeof evidence.path !== "string" || path.isAbsolute(evidence.path)) {
      failures.push(`${observation.id}: evidence path must be run-relative`);
      continue;
    }
    const evidencePath = path.resolve(absolute, evidence.path);
    if (!evidencePath.startsWith(`${absolute}${path.sep}`)) {
      failures.push(`${observation.id}: evidence path escapes the run directory`);
      continue;
    }
    try {
      const bytes = await fs.readFile(evidencePath);
      fail(sha256(bytes) !== evidence.sha256, `${observation.id}: evidence hash mismatch for ${evidence.path}`);
    } catch {
      failures.push(`${observation.id}: evidence file missing at ${evidence.path}`);
    }
  }
}

for (const id of run.requiredObservationIds ?? []) fail(!byId.has(id), `required observation missing: ${id}`);
fail(new Set(run.requiredObservationIds ?? []).size !== (run.requiredObservationIds ?? []).length, "required observation ids contain duplicates");
fail((run.requiredObservationIds ?? []).length !== observations.length, "every observation must be required");

const captures = observations.filter((observation) => observation.kind === "rendered_browser_capture");
const captureKeys = new Set(captures.map((observation) => `${observation.engine}|${observation.viewport}|${observation.route}`));
for (const route of rubric.requiredRouteGroups.complete) {
  for (const engine of ["chromium", "webkit", "firefox"]) {
    for (const viewport of ["1440x900", "390x844"]) {
      fail(!captureKeys.has(`${engine}|${viewport}|${route}`), `missing ${engine} ${viewport} capture for ${route}`);
    }
  }
}
for (const route of rubric.requiredRouteGroups.core) {
  for (const viewport of [...rubric.surfaces.desktop.viewports, ...rubric.surfaces.mobile.viewports]) {
    const size = `${viewport.width}x${viewport.height}`;
    fail(!captureKeys.has(`chromium|${size}|${route}`), `missing Chromium ${size} signature-route capture for ${route}`);
  }
}

fail(byId.get("cross-route-storyboard-inventory")?.status !== "pass", "cross-route storyboard inventory did not pass");
fail(byId.get("automation-full-route-continuity")?.status !== "pass", "matching-candidate full-route continuity did not pass");
fail(byId.get("feedback-reconciliation-requirements")?.status !== "pass", "feedback reconciliation requirements did not pass");
const expectedPhysical = new Set(["physical-ios-safari-voiceover", "physical-android-chrome-talkback"]);
for (const observation of observations.filter((item) => item.status !== "pass")) {
  fail(!expectedPhysical.has(observation.id) || observation.status !== "not_run", `${observation.id}: unexpected unresolved status ${observation.status}`);
}
for (const id of expectedPhysical) fail(byId.get(id)?.status !== "not_run", `${id}: expected an explicit not_run release blocker`);

console.log(JSON.stringify({
  artifact: "mindmake-award-panel-capture-validation-v3",
  runId: run.runId,
  candidateSha256: run.candidate?.sha256,
  rubricSha256: run.rubricSha256,
  routes: rubric.requiredRouteGroups.complete.length,
  observations: observations.length,
  automatedPasses: observations.filter((item) => item.status === "pass").length,
  expectedPhysicalBlockers: [...expectedPhysical],
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
