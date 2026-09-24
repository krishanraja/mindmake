import fs from "node:fs/promises";
import path from "node:path";
import { candidateIdentity, hashEvidenceManifest, hashRubric, loadRubric, sha256 } from "./award-panel-lib.mjs";

const runDirectory = process.argv[2];
if (!runDirectory) {
  console.error("usage: npm run qa:award-panel:status -- <run-directory>");
  process.exit(1);
}

const absolute = path.resolve(runDirectory);
const runPath = path.join(absolute, "run.json");
const resultPath = path.join(absolute, "award-panel-result.json");
let run;
try {
  run = JSON.parse(await fs.readFile(runPath, "utf8"));
} catch (error) {
  console.error(`blind panel not run: ${runPath} is unavailable (${error.message})`);
  process.exit(1);
}

const submissionsPath = path.join(absolute, "submissions");
const submissions = await fs.readdir(submissionsPath).catch(() => []);
const jsonSubmissions = submissions.filter((name) => name.endsWith(".json"));
const rubric = await loadRubric();
const currentCandidate = await candidateIdentity();
const integrityBlockers = [];
if (run.candidate?.sha256 !== currentCandidate.sha256) integrityBlockers.push("candidate changed after capture");
if (run.rubricSha256 !== hashRubric(rubric)) integrityBlockers.push("rubric changed after capture");
if (run.rubricVersion !== rubric.rubricRevision) integrityBlockers.push("rubric revision changed after capture");
if (run.evidenceManifestSha256 !== hashEvidenceManifest(run.evidenceManifest)) integrityBlockers.push("evidence manifest changed after capture");
if (Date.now() > Date.parse(run.expiresAt)) integrityBlockers.push(`evidence expired at ${run.expiresAt}`);
if (jsonSubmissions.length !== rubric.judges.length) integrityBlockers.push(`expected ${rubric.judges.length} submissions, found ${jsonSubmissions.length}`);
for (const observation of run.evidenceManifest?.observations ?? []) {
  for (const evidence of observation.evidence ?? []) {
    if (typeof evidence.path !== "string" || path.isAbsolute(evidence.path)) {
      integrityBlockers.push(`${observation.id}: evidence path is not run-relative`);
      continue;
    }
    const evidencePath = path.resolve(absolute, evidence.path);
    if (!evidencePath.startsWith(`${absolute}${path.sep}`)) {
      integrityBlockers.push(`${observation.id}: evidence path escapes run directory`);
      continue;
    }
    try {
      const bytes = await fs.readFile(evidencePath);
      if (sha256(bytes) !== evidence.sha256) integrityBlockers.push(`${observation.id}: evidence hash mismatch`);
    } catch {
      integrityBlockers.push(`${observation.id}: evidence file missing`);
    }
  }
}
let result;
try {
  result = JSON.parse(await fs.readFile(resultPath, "utf8"));
} catch {
  console.error(`blind panel incomplete: ${jsonSubmissions.length} submissions; no aggregated result for candidate ${run.candidate?.sha256 ?? "unknown"}${integrityBlockers.length ? `; ${integrityBlockers.join("; ")}` : ""}`);
  process.exit(1);
}
if (result.candidateSha256 !== run.candidate?.sha256) integrityBlockers.push("result candidate does not match run");
if (result.rubricSha256 !== run.rubricSha256) integrityBlockers.push("result rubric does not match run");
if (result.evidenceManifestSha256 !== run.evidenceManifestSha256) integrityBlockers.push("result evidence does not match run");

const status = {
  artifact: "mindmake-blind-award-panel-status-v3",
  runId: run.runId,
  candidateSha256: run.candidate?.sha256,
  submissions: jsonSubmissions.length,
  verdict: result.awardBand?.id,
  siteScore: result.siteScore,
  allGatesPass: result.allGatesPass,
  evidenceReady: result.evidenceReady,
  confidenceReady: result.confidenceReady,
  blockers: [...integrityBlockers, ...(result.blockers ?? [])],
};
console.log(JSON.stringify(status, null, 2));
if (status.verdict !== "world_class_winner" || !status.allGatesPass || !status.evidenceReady || !status.confidenceReady || status.blockers.length) process.exitCode = 1;
