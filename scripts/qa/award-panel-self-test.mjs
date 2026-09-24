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
  sha256,
  validateRubric,
  validateSubmission,
} from "./award-panel-lib.mjs";

const rubric = await loadRubric();
const v3 = rubric.rubricRevision >= 3;
const completeRoutes = rubric.requiredRouteGroups?.complete ?? ["/"];
const observationIdFor = (route) => `obs-self-test-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}`;

function submissionFor(judge, score) {
  const juror = rubric.jurors.find((candidate) => candidate.assignments.includes(judge.id));
  return {
    schemaVersion: v3 ? 3 : 2,
    runId: "self-test",
    evidenceManifestSha256: "a".repeat(64),
    candidateSha256: "b".repeat(64),
    rubricSha256: "c".repeat(64),
    contextId: `self-test-context-${juror.id}`,
    ...(v3 ? { contextProof: { executorId: `executor-${juror.id}`, startedAt: new Date().toISOString() } } : {}),
    jurorId: juror.id,
    judgeId: judge.id,
    surface: judge.surface,
    submittedAt: new Date().toISOString(),
    attestation: {
      sawPriorCritique: false,
      sawOtherVerdicts: false,
      sawIterationHistory: false,
      ...(v3 ? { usedMatchingCandidate: true } : { usedProductionOnly: true }),
      usedFrozenEvidence: true,
      independentContext: true
    },
    consumedObservationIds: completeRoutes.map(observationIdFor),
    ...(v3 ? {
      journeyTrace: (rubric.requiredRouteGroups[judge.routeCoverage] ?? []).map((route) => ({
        route,
        viewport: "test",
        action: "Traverse the complete route and inspect its narrative handoff.",
        expected: "Every section advances one distinct visitor job.",
        observed: "The deterministic fixture exposes the complete route inventory.",
        observationIds: [observationIdFor(route)],
      })),
      scrutiny: ["story", "journey", "design_system"].map((category) => ({
        category,
        status: "pass",
        route: "/",
        viewport: "test",
        finding: `The deterministic ${category} scrutiny fixture passed.`,
        observationIds: [observationIdFor("/")],
      })),
    } : {}),
    dimensions: judge.dimensions.map((dimension) => ({
      id: dimension.id,
      score,
      evidence: [{ route: "/", viewport: "test", ...(v3 ? { action: "Inspect the assigned dimension across the route.", expected: "The assigned quality condition is visibly satisfied." } : {}), observation: `A deterministic self-test observation for ${judge.id}.`, observationIds: [observationIdFor("/")] }],
      raiseCondition: "A deterministic self-test raise condition."
    })),
    hardGates: rubric.hardGates.map((gate) => ({
      id: gate.id,
      status: "pass",
      ...(v3 ? { route: "/", viewport: "test", action: "Exercise the owned hard gate on the route.", expected: "The owned hard gate passes with observable evidence." } : {}),
      evidence: `A deterministic self-test gate observation for ${judge.id}.`,
      observationIds: [observationIdFor("/")]
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

if (v3) {
  const incompleteRouteCoverage = structuredClone(rubric);
  incompleteRouteCoverage.requiredRouteGroups.complete = incompleteRouteCoverage.requiredRouteGroups.complete
    .filter((route) => route !== incompleteRouteCoverage.requiredRouteGroups.utility[0]);
  if (!validateRubric(incompleteRouteCoverage).some((error) => error.includes("requiredRouteGroups.complete is missing"))) {
    throw new Error("an incomplete complete-route group was accepted");
  }
}

const worldClassBand = rubric.awardBands.find((band) => band.id === "world_class_winner");
const worldClassScore = worldClassBand.minimumSurfaceScore;
const worldClassJudgeScore = worldClassBand.minimumJudgeScore;
const worldClass = awardBand(worldClassScore, Array(rubric.judges.length).fill(Math.max(worldClassScore, worldClassJudgeScore)), true, rubric);
if (worldClass?.id !== "world_class_winner") throw new Error("world-class threshold did not resolve");
const weakJudge = awardBand(worldClassScore, [worldClassJudgeScore - 0.1, ...Array(rubric.judges.length - 1).fill(10)], true, rubric);
if (weakJudge?.id === "world_class_winner") throw new Error("one weak judge did not block a world-class verdict");
const failedGate = awardBand(9.2, Array(rubric.judges.length).fill(9.2), false, rubric);
if (failedGate?.id !== "not_ready") throw new Error("a failed hard gate did not block award readiness");

const scratchRoot = "C:/Users/krish/.scratch/mindmake-award-panel-self-test";
await fs.mkdir(scratchRoot, { recursive: true });
const fixtureDir = await fs.mkdtemp(path.join(scratchRoot, "run-"));
const submissionsDir = path.join(fixtureDir, "submissions");
const evidenceDir = path.join(fixtureDir, "evidence");
await fs.mkdir(submissionsDir);
await fs.mkdir(evidenceDir);
const candidate = await candidateIdentity();
const evidenceFixtureFor = (route) => {
  const id = observationIdFor(route);
  const content = `Frozen aggregate evidence for ${route}.\n`;
  return { id, content, path: `evidence/${id}.txt`, sha256: sha256(Buffer.from(content)) };
};
const evidenceFixtures = completeRoutes.map(evidenceFixtureFor);
const writeEvidenceFixtures = async () => {
  await Promise.all(evidenceFixtures.map((fixture) => fs.writeFile(path.join(fixtureDir, fixture.path), fixture.content)));
};
await writeEvidenceFixtures();
const evidenceManifest = {
  schemaVersion: 1,
  candidateSha256: candidate.sha256,
  observations: completeRoutes.map((route) => ({
    id: observationIdFor(route),
    kind: "deterministic_automation",
    status: "pass",
    route,
    viewport: "test",
    action: "run the adversarial aggregate fixture",
    expected: "the fixture passes",
    observed: "the fixture passed",
    evidence: [{
      path: evidenceFixtureFor(route).path,
      sha256: evidenceFixtureFor(route).sha256,
    }],
  })),
};
const contexts = Object.fromEntries(rubric.jurors.map((juror) => [juror.id, `issued-context-${juror.id}`]));
const run = {
  schemaVersion: v3 ? 3 : 2,
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
  requiredObservationIds: completeRoutes.map(observationIdFor),
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

  await fs.writeFile(path.join(fixtureDir, evidenceFixtures[0].path), "tampered evidence\n");
  aggregateResult = aggregate();
  if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("frozen evidence hash mismatch")) throw new Error("tampered evidence file was accepted");
  await writeEvidenceFixtures();

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
  if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("passed using") || !aggregateResult.stderr.includes("inconclusive")) {
    throw new Error("a hard-gate pass backed by inconclusive evidence was accepted");
  }

  if (v3) {
    const firstExecutor = `executor-${rubric.jurors[0].id}`;
    await writeFixture(run, (submission) => submission.jurorId === rubric.jurors[1].id
      ? { ...submission, contextProof: { ...submission.contextProof, executorId: firstExecutor } }
      : submission);
    aggregateResult = aggregate();
    if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("independent executor identities")) throw new Error("duplicate executor provenance was accepted");

    await writeFixture(run, (submission) => submission.judgeId === rubric.judges[0].id
      ? { ...submission, contextProof: { ...submission.contextProof, startedAt: new Date(Date.parse(run.capturedAt) - 60_000).toISOString() } }
      : submission);
    aggregateResult = aggregate();
    if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("started outside the frozen evidence window")) throw new Error("stale executor context was accepted");

    await writeFixture(run, (submission) => submission.judgeId === rubric.judges[0].id
      ? { ...submission, journeyTrace: submission.journeyTrace.map((item, index) => index === 0 ? { ...item, route: "/ai-brain" } : item) }
      : submission);
    aggregateResult = aggregate();
    if (aggregateResult.status === 0 || !aggregateResult.stderr.includes("but that observation covers")) throw new Error("route-mismatched evidence was accepted");

    await writeFixture(run, (submission) => submission.judgeId === rubric.judges[0].id
      ? { ...submission, scrutiny: submission.scrutiny.map((item, index) => index === 0 ? { ...item, status: "fail" } : item) }
      : submission);
    aggregateResult = aggregate();
    if (aggregateResult.status !== 0) throw new Error(`unresolved scrutiny fixture was structurally rejected: ${aggregateResult.stderr}`);
    const scrutinyResult = JSON.parse(await fs.readFile(path.join(fixtureDir, "award-panel-result.json"), "utf8"));
    if (scrutinyResult.confidenceReady !== false || scrutinyResult.awardBand.id !== "not_ready") throw new Error("unresolved scrutiny did not fail closed");

    await writeFixture(run, (submission) => submission.judgeId === rubric.judges[0].id
      ? { ...submission, dimensions: submission.dimensions.map((item, index) => index === 0 ? { ...item, score: 0 } : item) }
      : submission);
    aggregateResult = aggregate();
    if (aggregateResult.status !== 0) throw new Error(`zero-dimension fixture was structurally rejected: ${aggregateResult.stderr}`);
    const zeroResult = JSON.parse(await fs.readFile(path.join(fixtureDir, "award-panel-result.json"), "utf8"));
    if (zeroResult.confidenceReady !== false || zeroResult.awardBand.id !== "not_ready") throw new Error("zero critical dimension did not fail closed");
  }

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

console.log("award panel self-test passed: valid panels score deterministically; contaminated, incomplete, stale, duplicate, unbound, tampered, low-confidence and hard-gate failures are rejected");
