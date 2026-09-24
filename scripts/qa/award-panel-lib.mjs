import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const here = path.dirname(fileURLToPath(import.meta.url));
export const root = path.resolve(here, "../..");
const configuredRubric = process.env.MINDMAKE_AWARD_RUBRIC ?? "quality/award-panel/rubric.v3.json";
export const rubricPath = path.isAbsolute(configuredRubric)
  ? configuredRubric
  : path.resolve(root, configuredRubric);
const configuredRubricSource = JSON.parse(fsSync.readFileSync(rubricPath, "utf8"));
export const submissionSchemaPath = path.join(
  root,
  "quality",
  "award-panel",
  configuredRubricSource.rubricRevision >= 3 ? "submission.schema.v3.json" : "submission.schema.json",
);
const submissionSchema = JSON.parse(fsSync.readFileSync(submissionSchemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true, multipleOfPrecision: 2 });
const validateSubmissionSchema = ajv.compile(submissionSchema);

export async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

export async function loadRubric() {
  return readJson(rubricPath);
}

export function stableJson(value) {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

export function hashRubric(rubric) {
  return crypto.createHash("sha256").update(stableJson(rubric)).digest("hex");
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function hashEvidenceManifest(manifest) {
  return sha256(stableJson(manifest));
}

/**
 * Bind a panel run to every production-bearing file, including untracked
 * recovery assets. Quality scripts and panel scorecards are deliberately not
 * part of this digest: improving the verifier must not silently create a new
 * website candidate.
 */
export async function candidateIdentity() {
  const args = [
    "ls-files", "--cached", "--others", "--exclude-standard", "--",
    "src", "public", "index.html", "package.json", "package-lock.json",
    "vite.config.ts", "tsconfig.app.json",
    // These recovery assets are imported by production source. Keeping them
    // outside the digest would let the rendered candidate change without its
    // provenance identity changing.
    "prototypes/website-redesign-recovery/brain-signature/index-s2-motion-s3.html",
    "prototypes/website-redesign-recovery/brain-signature/media/evidence-connects-poster.png",
    "prototypes/website-redesign-recovery/gtm-market-change/index-motion.html",
    "prototypes/website-redesign-recovery/gtm-market-change/growth-machinery-reference.png",
    "prototypes/website-redesign-recovery/gtm-market-change/media/quiet-workshop-growth-poster.png",
    "prototypes/website-redesign-recovery/gtm-market-change/media/signals-arrive-poster.png",
    "prototypes/website-redesign-recovery/case-study-browsing/styles.css",
    "prototypes/website-redesign-recovery/case-study-browsing/media",
  ];
  const listed = execFileSync("git", args, { cwd: root, encoding: "utf8" })
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean)
    .sort();
  const files = [];
  for (const relativePath of listed) {
    const absolutePath = path.resolve(root, relativePath);
    const bytes = await fs.readFile(absolutePath);
    files.push({ path: relativePath.replaceAll("\\", "/"), bytes: bytes.length, sha256: sha256(bytes) });
  }
  const head = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  return { head, files, sha256: sha256(stableJson({ head, files })) };
}

export function validateRubric(rubric) {
  const errors = [];
  if (rubric.schemaVersion !== 1) errors.push("rubric schemaVersion must be 1");
  if (!Array.isArray(rubric.sources) || rubric.sources.length < 4) errors.push("rubric needs at least four named sources");
  if (!Array.isArray(rubric.hardGates) || rubric.hardGates.length < 5) errors.push("rubric needs at least five hard gates");
  const v3 = rubric.rubricRevision >= 3;
  const expectedJudgeCount = v3 ? 12 : 10;
  const expectedJurorCount = v3 ? 6 : 5;
  if (!Array.isArray(rubric.judges) || rubric.judges.length !== expectedJudgeCount) errors.push(`rubric must define exactly ${expectedJudgeCount} judges`);
  if (!Array.isArray(rubric.jurors) || rubric.jurors.length !== expectedJurorCount) errors.push(`rubric must define exactly ${expectedJurorCount} jurors`);
  if (v3) {
    for (const group of ["core", "utility", "complete"]) {
      const routes = rubric.requiredRouteGroups?.[group];
      if (!Array.isArray(routes) || routes.length === 0) {
        errors.push(`requiredRouteGroups.${group} must contain routes`);
        continue;
      }
      if (new Set(routes).size !== routes.length) errors.push(`requiredRouteGroups.${group} contains duplicate routes`);
      for (const route of routes) {
        if (typeof route !== "string" || !route.startsWith("/") || route.includes(":")) {
          errors.push(`requiredRouteGroups.${group} contains a non-capturable route: ${route}`);
        }
      }
    }
    const completeRoutes = new Set(rubric.requiredRouteGroups?.complete ?? []);
    for (const route of [...(rubric.requiredRouteGroups?.core ?? []), ...(rubric.requiredRouteGroups?.utility ?? [])]) {
      if (!completeRoutes.has(route)) errors.push(`requiredRouteGroups.complete is missing ${route}`);
    }
  }

  const ids = new Set();
  const gateIds = new Set();
  const jurorIds = new Set();
  const requiredLens = v3
    ? ["art_system", "narrative_journey", "immersion_interaction", "conversion_trust", "ux_accessibility_technical", "inspiration_originality"]
    : ["art_direction", "inspiration_originality", "immersion", "buyability_trust", "ux_content_technical"];
  for (const surface of ["desktop", "mobile"]) {
    const judges = rubric.judges?.filter((judge) => judge.surface === surface) ?? [];
    const expectedSurfaceJudges = v3 ? 6 : 5;
    if (judges.length !== expectedSurfaceJudges) errors.push(`${surface} must have exactly ${expectedSurfaceJudges} judges`);
    for (const lens of requiredLens) {
      if (!judges.some((judge) => judge.id.includes(lens))) errors.push(`${surface} is missing the ${lens} lens`);
    }
  }

  for (const judge of rubric.judges ?? []) {
    if (ids.has(judge.id)) errors.push(`duplicate judge id: ${judge.id}`);
    ids.add(judge.id);
    if (!["desktop", "mobile"].includes(judge.surface)) errors.push(`${judge.id} has an invalid surface`);
    if (!judge.mandate || judge.mandate.length < 30) errors.push(`${judge.id} needs a specific mandate`);
    if (v3 && !Object.hasOwn(rubric.requiredRouteGroups ?? {}, judge.routeCoverage)) errors.push(`${judge.id} has an unknown routeCoverage group`);
    const dimensions = judge.dimensions ?? [];
    if (dimensions.length < 4) errors.push(`${judge.id} needs at least four dimensions`);
    const dimensionIds = new Set(dimensions.map((dimension) => dimension.id));
    if (dimensionIds.size !== dimensions.length) errors.push(`${judge.id} has duplicate dimensions`);
    for (const dimension of dimensions) {
      if (!Number.isFinite(dimension.weight) || dimension.weight <= 0 || dimension.weight > 1) {
        errors.push(`${judge.id}/${dimension.id} weight must be a finite number above 0 and at most 1`);
      }
    }
    const total = dimensions.reduce((sum, dimension) => sum + dimension.weight, 0);
    if (Math.abs(total - 1) > 0.000001) errors.push(`${judge.id} dimension weights total ${total}, not 1`);
  }

  for (const gate of rubric.hardGates ?? []) {
    if (gateIds.has(gate.id)) errors.push(`duplicate hard gate id: ${gate.id}`);
    gateIds.add(gate.id);
    if (!Array.isArray(gate.owners) || gate.owners.length < 2) errors.push(`${gate.id} needs at least two accountable owners`);
    for (const owner of gate.owners ?? []) {
      if (!rubric.judges?.some((judge) => judge.id === owner)) errors.push(`${gate.id} has unknown owner ${owner}`);
    }
    for (const surface of ["desktop", "mobile"]) {
      if (!(gate.owners ?? []).some((owner) => rubric.judges?.find((judge) => judge.id === owner)?.surface === surface)) {
        errors.push(`${gate.id} needs an owner for ${surface}`);
      }
    }
  }

  const assigned = new Set();
  for (const juror of rubric.jurors ?? []) {
    if (jurorIds.has(juror.id)) errors.push(`duplicate juror id: ${juror.id}`);
    jurorIds.add(juror.id);
    if (!Array.isArray(juror.assignments) || juror.assignments.length !== 2) errors.push(`${juror.id} must have two assignments`);
    const surfaces = new Set();
    for (const assignment of juror.assignments ?? []) {
      const judge = rubric.judges?.find((candidate) => candidate.id === assignment);
      if (!judge) errors.push(`${juror.id} has unknown assignment ${assignment}`);
      else surfaces.add(judge.surface);
      if (assigned.has(assignment)) errors.push(`${assignment} is assigned to more than one juror`);
      assigned.add(assignment);
    }
    if (surfaces.size !== 2) errors.push(`${juror.id} must have one desktop and one mobile assignment`);
  }
  for (const judge of rubric.judges ?? []) {
    if (!assigned.has(judge.id)) errors.push(`${judge.id} is not assigned to a juror`);
  }

  const orderedBands = rubric.awardBands ?? [];
  if (orderedBands.length < 4) errors.push("rubric needs four award bands");
  for (let index = 1; index < orderedBands.length; index += 1) {
    if (orderedBands[index].minimumSurfaceScore > orderedBands[index - 1].minimumSurfaceScore) {
      errors.push("award bands must run from highest to lowest threshold");
    }
  }
  return errors;
}

export function validateSubmission(submission, rubric) {
  const errors = [];
  if (!validateSubmissionSchema(submission)) {
    errors.push(...(validateSubmissionSchema.errors ?? []).map((error) => `schema ${error.instancePath || "/"} ${error.message}`));
  }
  const judge = rubric.judges.find((candidate) => candidate.id === submission.judgeId);
  const v3 = rubric.rubricRevision >= 3;
  const expectedSchemaVersion = v3 ? 3 : 2;
  if (submission.schemaVersion !== expectedSchemaVersion) errors.push(`schemaVersion must be ${expectedSchemaVersion}`);
  if (!submission.runId) errors.push("runId is required");
  for (const field of ["candidateSha256", "rubricSha256", "evidenceManifestSha256"]) {
    if (!/^[a-f0-9]{64}$/.test(submission[field] ?? "")) errors.push(`${field} must be a SHA-256 digest`);
  }
  if (!submission.contextId || submission.contextId.length < 16) errors.push("contextId is required");
  if (v3) {
    if (!submission.contextProof?.executorId || submission.contextProof.executorId.length < 8) errors.push("contextProof.executorId is required");
    if (!Number.isFinite(Date.parse(submission.contextProof?.startedAt))) errors.push("contextProof.startedAt must be an ISO date-time");
    if (!Array.isArray(submission.journeyTrace) || submission.journeyTrace.length < 3) errors.push(`${submission.judgeId} needs at least three journey trace observations`);
    if (!Array.isArray(submission.scrutiny) || submission.scrutiny.length < 3) errors.push(`${submission.judgeId} needs at least three scrutiny findings`);
  }
  if (!Number.isFinite(Date.parse(submission.submittedAt))) errors.push("submittedAt must be an ISO date-time");
  if (!judge) return [...errors, `unknown judge: ${submission.judgeId}`];
  const juror = rubric.jurors.find((candidate) => candidate.id === submission.jurorId);
  if (!juror) errors.push(`unknown juror: ${submission.jurorId}`);
  else if (!juror.assignments.includes(submission.judgeId)) errors.push(`${submission.jurorId} is not assigned to ${submission.judgeId}`);
  if (submission.surface !== judge.surface) errors.push(`${judge.id} must judge ${judge.surface}`);

  const attestation = submission.attestation ?? {};
  if (attestation.sawPriorCritique !== false) errors.push(`${judge.id} saw prior critique or did not attest false`);
  if (attestation.sawOtherVerdicts !== false) errors.push(`${judge.id} saw other verdicts or did not attest false`);
  if (attestation.sawIterationHistory !== false) errors.push(`${judge.id} saw iteration history or did not attest false`);
  if (v3) {
    if (attestation.usedMatchingCandidate !== true) errors.push(`${judge.id} did not attest to judging the matching candidate`);
  } else if (attestation.usedProductionOnly !== true) errors.push(`${judge.id} did not attest to production-only judging`);
  if (attestation.usedFrozenEvidence !== true) errors.push(`${judge.id} did not attest to frozen evidence`);
  if (attestation.independentContext !== true) errors.push(`${judge.id} did not attest to an independent context`);
  if (!Array.isArray(submission.consumedObservationIds) || submission.consumedObservationIds.length === 0) {
    errors.push(`${judge.id} did not consume any frozen observations`);
  }

  const actualDimensions = new Map((submission.dimensions ?? []).map((dimension) => [dimension.id, dimension]));
  if (actualDimensions.size !== (submission.dimensions ?? []).length) errors.push(`${judge.id} has duplicate dimension submissions`);
  for (const expected of judge.dimensions) {
    const actual = actualDimensions.get(expected.id);
    if (!actual) {
      errors.push(`${judge.id} is missing dimension ${expected.id}`);
      continue;
    }
    if (typeof actual.score !== "number" || actual.score < 0 || actual.score > 10 || Math.abs(Math.round(actual.score * 10) - actual.score * 10) > 0.000001) {
      errors.push(`${judge.id}/${expected.id} score must be 0 to 10 with one decimal place`);
    }
    if (!Array.isArray(actual.evidence) || actual.evidence.length === 0) errors.push(`${judge.id}/${expected.id} needs evidence`);
    for (const item of actual.evidence ?? []) {
      if (!item.route || !item.viewport || !item.observation || item.observation.length < 12) {
        errors.push(`${judge.id}/${expected.id} has incomplete evidence`);
      }
      if (!Array.isArray(item.observationIds) || item.observationIds.length === 0) {
        errors.push(`${judge.id}/${expected.id} has no bound observation ids`);
      }
    }
    if (!actual.raiseCondition || actual.raiseCondition.length < 12) errors.push(`${judge.id}/${expected.id} needs a raise condition`);
  }
  for (const actual of actualDimensions.keys()) {
    if (!judge.dimensions.some((expected) => expected.id === actual)) errors.push(`${judge.id} submitted unknown dimension ${actual}`);
  }

  const gateMap = new Map((submission.hardGates ?? []).map((gate) => [gate.id, gate]));
  if (gateMap.size !== (submission.hardGates ?? []).length) errors.push(`${judge.id} has duplicate hard gates`);
  const ownedGates = rubric.hardGates.filter((gate) => gate.owners.includes(judge.id));
  for (const gate of ownedGates) {
    const actual = gateMap.get(gate.id);
    if (!actual) {
      errors.push(`${judge.id} is missing hard gate ${gate.id}`);
      continue;
    }
    if (!["pass", "fail", "inconclusive"].includes(actual.status)) errors.push(`${judge.id}/${gate.id} has an invalid status`);
    if (!actual.evidence || actual.evidence.length < 12) errors.push(`${judge.id}/${gate.id} needs evidence`);
    if (!Array.isArray(actual.observationIds) || actual.observationIds.length === 0) errors.push(`${judge.id}/${gate.id} has no bound observation ids`);
  }
  for (const actual of gateMap.keys()) {
    if (!rubric.hardGates.some((gate) => gate.id === actual)) errors.push(`${judge.id} submitted unknown hard gate ${actual}`);
  }
  if (!submission.summary || submission.summary.length < 20) errors.push(`${judge.id} needs a summary`);
  if (!["high", "medium", "low"].includes(submission.confidence)) errors.push(`${judge.id} has invalid confidence`);
  return errors;
}

export function scoreSubmission(submission, rubric) {
  const judge = rubric.judges.find((candidate) => candidate.id === submission.judgeId);
  const values = new Map(submission.dimensions.map((dimension) => [dimension.id, dimension.score]));
  const raw = judge.dimensions.reduce((sum, dimension) => sum + values.get(dimension.id) * dimension.weight, 0);
  return Math.round(raw * 10) / 10;
}

export function awardBand(surfaceScore, judgeScores, allGatesPass, rubric) {
  return rubric.awardBands.find((band) => {
    if (surfaceScore < band.minimumSurfaceScore) return false;
    if (Math.min(...judgeScores) < band.minimumJudgeScore) return false;
    if (band.requiresAllHardGates && !allGatesPass) return false;
    return true;
  });
}
