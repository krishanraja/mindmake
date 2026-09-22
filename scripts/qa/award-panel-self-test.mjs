import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import {
  awardBand,
  candidateIdentity,
  hashEvidenceManifest,
  hashRubric,
  loadRubric,
  root,
  scoreSubmission,
  validateRubric,
  validateSubmission,
} from "./award-panel-lib.mjs";

const rubric = await loadRubric();

function submissionFor(judge, score) {
  const juror = rubric.jurors.find((candidate) => candidate.assignments.includes(judge.id));
  return {
    schemaVersion: 2,
    runId: "self-test",
    evidenceManifestSha256: "a".repeat(64),
    candidateSha256: "b".repeat(64),
    rubricSha256: "c".repeat(64),
    contextId: `self-test-context-${juror.id}`,
    jurorId: juror.id,
    judgeId: judge.id,
    surface: judge.surface,
    submittedAt: new Date().toISOString(),
    attestation: {
      sawPriorCritique: false,
      sawOtherVerdicts: false,
      sawIterationHistory: false,
      usedProductionOnly: true,
      usedFrozenEvidence: true,
      independentContext: true
    },
    consumedObservationIds: ["obs-self-test"],
    dimensions: judge.dimensions.map((dimension) => ({
      id: dimension.id,
      score,
      evidence: [{ route: "/", viewport: "test", observation: `A deterministic self-test observation for ${judge.id}.`, observationIds: ["obs-self-test"] }],
      raiseCondition: "A deterministic self-test raise condition."
    })),
    hardGates: rubric.hardGates.map((gate) => ({
      id: gate.id,
      status: "pass",
      evidence: `A deterministic self-test gate observation for ${judge.id}.`,
      observationIds: ["obs-self-test"]
    })),
    summary: `A deterministic self-test submission for ${judge.id}.`,
    confidence: "high"
  };
}

for (const judge of rubric.judges) {
  const submission = submissionFor(judge, 8.6);
  const errors = validateSubmission(submission, rubric);
  if (errors.length) throw new Error(`${judge.id} fixture was rejected: ${errors.join(", ")}`);
  if (scoreSubmission(submission, rubric) !== 8.6) throw new Error(`${judge.id} weighted score changed`);
}

const contaminated = submissionFor(rubric.judges[0], 8.6);
contaminated.attestation.sawPriorCritique = true;
if (!validateSubmission(contaminated, rubric).some((error) => error.includes("prior critique"))) {
  throw new Error("blindness contamination was accepted");
}

const incomplete = submissionFor(rubric.judges[0], 8.6);
incomplete.dimensions.pop();
if (!validateSubmission(incomplete, rubric).some((error) => error.includes("missing dimension"))) {
  throw new Error("an incomplete scorecard was accepted");
}

const extraProperty = submissionFor(rubric.judges[0], 8.6);
extraProperty.unrecognised = true;
if (!validateSubmission(extraProperty, rubric).some((error) => error.includes("additional properties"))) {
  throw new Error("the JSON Schema accepted an additional property");
}

const wrongEvidenceType = submissionFor(rubric.judges[0], 8.6);
wrongEvidenceType.dimensions[0].evidence[0].observation = 42;
if (!validateSubmission(wrongEvidenceType, rubric).some((error) => error.includes("must be string"))) {
  throw new Error("the JSON Schema accepted a numeric observation");
}

const unboundEvidence = submissionFor(rubric.judges[0], 8.6);
unboundEvidence.dimensions[0].evidence[0].observationIds = [];
if (!validateSubmission(unboundEvidence, rubric).some((error) => error.includes("observation"))) {
  throw new Error("evidence without an observation binding was accepted");
}

const sharedContextMissing = submissionFor(rubric.judges[0], 8.6);
sharedContextMissing.contextId = "short";
if (!validateSubmission(sharedContextMissing, rubric).some((error) => error.includes("contextId"))) {
  throw new Error("a missing independent context identity was accepted");
}

const unsafeWeights = structuredClone(rubric);
unsafeWeights.judges[0].dimensions[0].weight = -0.1;
unsafeWeights.judges[0].dimensions[1].weight = 0.6;
if (!validateRubric(unsafeWeights).some((error) => error.includes("weight must be"))) {
  throw new Error("a negative dimension weight was accepted");
}

const duplicateJuror = structuredClone(rubric);
duplicateJuror.jurors[1].id = duplicateJuror.jurors[0].id;
if (!validateRubric(duplicateJuror).some((error) => error.includes("duplicate juror id"))) {
  throw new Error("a duplicate juror id was accepted");
}

const duplicateGate = structuredClone(rubric);
duplicateGate.hardGates[1].id = duplicateGate.hardGates[0].id;
if (!validateRubric(duplicateGate).some((error) => error.includes("duplicate hard gate id"))) {
  throw new Error("a duplicate hard gate id was accepted");
}

const worldClassBand = rubric.awardBands.find((band) => band.id === "world_class_winner");
const worldClassScore = worldClassBand.minimumSurfaceScore;
const worldClassJudgeScore = worldClassBand.minimumJudgeScore;
const worldClass = awardBand(worldClassScore, Array(10).fill(Math.max(worldClassScore, worldClassJudgeScore)), true, rubric);
if (worldClass?.id !== "world_class_winner") throw new Error("world-class threshold did not resolve");
const weakJudge = awardBand(worldClassScore, [worldClassJudgeScore - 0.1, ...Array(9).fill(10)], true, rubric);
if (weakJudge?.id === "world_class_winner") throw new Error("one weak judge did not block a world-class verdict");
const failedGate = awardBand(9.2, Array(10).fill(9.2), false, rubric);
if (failedGate?.id !== "not_ready") throw new Error("a failed hard gate did not block award readiness");

const scratchRoot = "C:/Users/krish/.scratch/mindmake-award-panel-self-test";
await fs.mkdir(scratchRoot, { recursive: true });
const fixtureDir = await fs.mkdtemp(path.join(scratchRoot, "run-"));
const submissionsDir = path.join(fixtureDir, "submissions");
await fs.mkdir(submissionsDir);
const candidate = await candidateIdentity();
const evidenceManifest = {
  schemaVersion: 1,
  candidateSha256: candidate.sha256,
  observations: [{
    id: "obs-self-test",
    kind: "deterministic_automation",
    status: "pass",
    route: "/",
    viewport: "test",
    action: "run the adversarial aggregate fixture",
    expected: "the fixture passes",
    observed: "the fixture passed",
    evidence: [],
  }],
};
const contexts = Object.fromEntries(rubric.jurors.map((juror) => [juror.id, `issued-context-${juror.id}`]));
const run = {
  schemaVersion: 2,
  runId: "aggregate-self-test",
  target: "http://127.0.0.1/self-test",
  capturedAt: new Date(Date.now() - 1000).toISOString(),
  /* candidateIdentity hashes every production-bearing recovery asset. On a
     busy Windows host that can legitimately take longer than one minute per
     adversarial aggregate; the fixture must test expiry, not expire while the
     test itself is still running. */
  expiresAt: new Date(Date.now() + 30 * 60_000).toISOString(),
  rubricVersion: rubric.rubricRevision,
  rubricSha256: hashRubric(rubric),
  candidate,
  evidenceManifest,
  evidenceManifestSha256: hashEvidenceManifest(evidenceManifest),
  requiredObservationIds: ["obs-self-test"],
  judgeContexts: contexts,
};

async function writeFixture(activeRun = run, mutate = (item) => item) {
  await fs.writeFile(path.join(fixtureDir, "run.json"), `${JSON.stringify(activeRun, null, 2)}\n`);
  for (const judge of rubric.judges) {
    const submission = submissionFor(judge, 8.6);
    Object.assign(submission, {
      runId: activeRun.runId,
      evidenceManifestSha256: activeRun.evidenceManifestSha256,
      candidateSha256: activeRun.candidate.sha256,
      rubricSha256: activeRun.rubricSha256,
      contextId: activeRun.judgeContexts[submission.jurorId],
      submittedAt: new Date().toISOString(),
    });
    await fs.writeFile(path.join(submissionsDir, `${judge.id}.json`), `${JSON.stringify(mutate(submission), null, 2)}\n`);
  }
}

function aggregate() {
  return spawnSync(process.execPath, [path.join(root, "scripts/qa/award-panel-aggregate.mjs"), fixtureDir], {
    cwd: root,
    encoding: "utf8",
  });
}

try {
  await writeFixture();
  let aggregateResult = aggregate();
  if (aggregateResult.status !== 0) throw new Error(`valid aggregate fixture failed: ${aggregateResult.stderr}`);

  const staleRun = structuredClone(run);
  staleRun.expiresAt = new Date(Date.now() - 1000).toISOString();
  await writeFixture(staleRun);
  aggregateResult = aggregate();
  if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("expired")) throw new Error("stale panel evidence was accepted");

  await writeFixture();
  await fs.copyFile(path.join(submissionsDir, `${rubric.judges[0].id}.json`), path.join(submissionsDir, "duplicate.json"));
  aggregateResult = aggregate();
  if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("duplicate submission")) throw new Error("a duplicate judge submission was accepted");
  await fs.rm(path.join(submissionsDir, "duplicate.json"));

  const incompleteEvidence = structuredClone(run);
  incompleteEvidence.evidenceManifest.observations[0].status = "inconclusive";
  incompleteEvidence.evidenceManifestSha256 = hashEvidenceManifest(incompleteEvidence.evidenceManifest);
  await writeFixture(incompleteEvidence);
  aggregateResult = aggregate();
  if (aggregateResult.status !== 0) throw new Error(`inconclusive evidence fixture was structurally rejected: ${aggregateResult.stderr}`);
  const incompleteResult = JSON.parse(await fs.readFile(path.join(fixtureDir, "award-panel-result.json"), "utf8"));
  if (incompleteResult.evidenceReady !== false || incompleteResult.awardBand.id !== "not_ready") throw new Error("inconclusive critical evidence did not fail closed");

  await writeFixture(run, (submission) => submission.judgeId === rubric.judges[0].id ? { ...submission, confidence: "low" } : submission);
  aggregateResult = aggregate();
  if (aggregateResult.status !== 0) throw new Error(`low-confidence fixture was structurally rejected: ${aggregateResult.stderr}`);
  const lowConfidenceResult = JSON.parse(await fs.readFile(path.join(fixtureDir, "award-panel-result.json"), "utf8"));
  if (lowConfidenceResult.confidenceReady !== false || lowConfidenceResult.awardBand.id !== "not_ready") throw new Error("low judge confidence did not fail closed");
} finally {
  const resolvedScratch = path.resolve(scratchRoot);
  if (!path.resolve(fixtureDir).startsWith(`${resolvedScratch}${path.sep}`)) throw new Error("refusing to remove an unexpected self-test path");
  await fs.rm(fixtureDir, { recursive: true, force: true });
}

console.log("award panel self-test passed: valid panels score deterministically; contaminated, incomplete, stale, duplicate, unbound, low-confidence and hard-gate failures are rejected");
