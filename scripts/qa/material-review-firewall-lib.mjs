import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { validateExperienceQualityProfile } from "./experience-quality-profile-check.mjs";

export const stableJson = (value) => {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableJson(value[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
};

export const sha256 = (value) => createHash("sha256").update(value).digest("hex");
const posix = (value) => value.replaceAll("\\", "/");

async function readJson(absolutePath) {
  return JSON.parse(await readFile(absolutePath, "utf8"));
}

function inside(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function resolveProjectPath(root, relativePath, label, blockers) {
  if (typeof relativePath !== "string" || !relativePath.trim()) {
    blockers.push({ code: "missing", message: `${label} path is missing` });
    return null;
  }
  if (path.isAbsolute(relativePath)) {
    blockers.push({ code: "invalid_path", message: `${label} must be project-relative` });
    return null;
  }
  const absolute = path.resolve(root, relativePath);
  if (!inside(root, absolute)) {
    blockers.push({ code: "invalid_path", message: `${label} escapes the project root` });
    return null;
  }
  return absolute;
}

export async function computeCandidateIdentity(root, manifest) {
  const files = [];
  for (const relativePath of manifest?.artifact?.files ?? []) {
    const absolute = path.resolve(root, relativePath);
    if (!inside(root, absolute)) throw new Error(`candidate file escapes project root: ${relativePath}`);
    const bytes = await readFile(absolute);
    files.push({ path: posix(relativePath), bytes: bytes.length, sha256: sha256(bytes) });
  }
  files.sort((a, b) => a.path.localeCompare(b.path));
  const semantic = {
    schemaVersion: manifest.schemaVersion,
    candidateId: manifest.candidateId,
    status: manifest.status,
    artifact: {
      kind: manifest.artifact?.kind,
      root: manifest.artifact?.root,
      entry: manifest.artifact?.entry,
      route: manifest.artifact?.route,
      integrationModel: manifest.artifact?.integrationModel,
    },
    requirements: manifest.requirements,
    files,
  };
  return { files, sha256: sha256(stableJson(semantic)) };
}

async function verifyEvidence(root, evidence, owner, blockers) {
  if (!Array.isArray(evidence) || evidence.length === 0) {
    blockers.push({ code: "missing", message: `${owner} has no cited evidence` });
    return;
  }
  for (const [index, item] of evidence.entries()) {
    const absolute = resolveProjectPath(root, item?.path, `${owner} evidence ${index + 1}`, blockers);
    if (!absolute) continue;
    try {
      const bytes = await readFile(absolute);
      if (!/^[a-f0-9]{64}$/.test(item?.sha256 ?? "") || sha256(bytes) !== item.sha256) {
        blockers.push({ code: "mismatch", message: `${owner} evidence hash mismatch: ${item.path}` });
      }
    } catch (error) {
      blockers.push({ code: "missing", message: `${owner} evidence is unavailable: ${item.path} (${error.code ?? error.message})` });
    }
  }
}

async function loadBoundReceipt(root, manifest, identity, key, blockers) {
  const receiptPath = manifest?.evidence?.[key];
  const absolute = resolveProjectPath(root, receiptPath, `${key} receipt`, blockers);
  if (!absolute) return null;
  try {
    const receipt = await readJson(absolute);
    if (receipt.candidateId !== manifest.candidateId) blockers.push({ code: "mismatch", message: `${key} candidate id does not match` });
    if (receipt.candidateSha256 !== identity.sha256) blockers.push({ code: "mismatch", message: `${key} candidate digest does not match current bytes` });
    return receipt;
  } catch (error) {
    blockers.push({ code: "missing", message: `${key} receipt is unavailable or invalid (${error.message})` });
    return null;
  }
}

function validateFreshness(receipt, label, now, blockers) {
  const captured = Date.parse(receipt?.capturedAt);
  const expires = Date.parse(receipt?.expiresAt);
  if (!Number.isFinite(captured) || !Number.isFinite(expires)) {
    blockers.push({ code: "stale", message: `${label} has invalid freshness timestamps` });
    return;
  }
  if (captured > now + 60_000 || expires <= now) blockers.push({ code: "stale", message: `${label} is stale or future-dated` });
}

function duplicateValues(values) {
  return values.filter((value, index) => values.indexOf(value) !== index);
}

export async function validateMaterialReviewCandidate({ root, manifestPath, now = Date.now() }) {
  const blockers = [];
  const absoluteManifest = path.isAbsolute(manifestPath) ? manifestPath : path.resolve(root, manifestPath);
  if (!inside(root, absoluteManifest)) {
    return { ready: false, blockers: [{ code: "invalid_path", message: "candidate manifest must be inside the project root" }] };
  }

  let manifest;
  try {
    manifest = await readJson(absoluteManifest);
  } catch (error) {
    return { ready: false, blockers: [{ code: "missing", message: `candidate manifest is unavailable or invalid (${error.message})` }] };
  }

  const profilePath = resolveProjectPath(root, manifest.profile, "experience profile", blockers);
  let profile = null;
  if (profilePath) {
    try {
      const rubric = await readJson(path.resolve(root, "quality/award-panel/rubric.v3.json"));
      const continuity = await readJson(path.resolve(root, "quality/website-redesign/continuity-contract.v1.json"));
      profile = await readJson(profilePath);
      for (const failure of validateExperienceQualityProfile(profile, rubric, continuity)) {
        blockers.push({ code: "profile_invalid", message: failure });
      }
    } catch (error) {
      blockers.push({ code: "profile_invalid", message: `experience profile could not be validated (${error.message})` });
    }
  }

  if (manifest.schemaVersion !== 1) blockers.push({ code: "manifest_invalid", message: "candidate schemaVersion must equal 1" });
  if (manifest.status !== "candidate") blockers.push({ code: "artifact_class", message: `candidate status is ${manifest.status ?? "missing"}, not candidate` });
  if (manifest.artifact?.kind !== "integrated-production-candidate") blockers.push({ code: "artifact_class", message: `artifact kind is ${manifest.artifact?.kind ?? "missing"}, not integrated-production-candidate` });
  if (manifest.artifact?.integrationModel !== "single-dom-single-scroll-context") blockers.push({ code: "embedded_frame", message: "candidate is not a single-DOM, single-scroll-context integration" });
  if (manifest.requirements?.singleDomScrollContext !== true) blockers.push({ code: "embedded_frame", message: "single DOM and scroll context is not a hard requirement" });
  if (manifest.requirements?.noEmbeddedFrames !== true) blockers.push({ code: "embedded_frame", message: "embedded frames are not prohibited" });
  if (manifest.requirements?.continuousForwardAndReverse !== true) blockers.push({ code: "journey_missing", message: "continuous forward and reverse journey proof is not required" });
  if (!Array.isArray(manifest.requirements?.surfaces) || manifest.requirements.surfaces.length < 2) blockers.push({ code: "journey_missing", message: "candidate must declare desktop and mobile surfaces" });
  if (!Array.isArray(manifest.requirements?.scrollDrivenSections) || manifest.requirements.scrollDrivenSections.length === 0) blockers.push({ code: "journey_missing", message: "candidate has no declared scroll-driven sections" });
  if (!Array.isArray(manifest.artifact?.files) || manifest.artifact.files.length === 0) blockers.push({ code: "manifest_invalid", message: "candidate artifact files are missing" });

  let identity = null;
  try {
    identity = await computeCandidateIdentity(root, manifest);
  } catch (error) {
    blockers.push({ code: "missing", message: `candidate bytes could not be read (${error.message})` });
  }

  for (const file of identity?.files ?? []) {
    if (!/\.(?:html|js|jsx|mjs|ts|tsx)$/i.test(file.path)) continue;
    const source = await readFile(path.resolve(root, file.path), "utf8");
    if (/<iframe\b/i.test(source) || /createElement\s*\(\s*["']iframe["']\s*\)/i.test(source)) {
      blockers.push({ code: "embedded_frame", message: `embedded frame integration found in ${file.path}` });
    }
  }

  if (!identity || !profile) return { ready: false, candidateId: manifest.candidateId ?? null, identity, blockers };

  const readiness = await loadBoundReceipt(root, manifest, identity, "readiness", blockers);
  if (readiness) {
    validateFreshness(readiness, "readiness receipt", now, blockers);
    if (readiness.runtime?.selfOwned !== true) blockers.push({ code: "runtime_unowned", message: "readiness runtime is not self-owned" });
    if (!/^https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(?:\/|$)/.test(readiness.runtime?.origin ?? "")) blockers.push({ code: "runtime_unowned", message: "readiness runtime origin is not a self-owned local origin" });
    const checks = readiness.checks ?? [];
    const checkIds = checks.map((check) => check.id);
    for (const duplicate of duplicateValues(checkIds)) blockers.push({ code: "receipt_invalid", message: `readiness check is duplicated: ${duplicate}` });
    for (const required of profile.reviewReadiness.requiredChecks) {
      const check = checks.find((candidate) => candidate.id === required);
      if (!check) blockers.push({ code: "not_run", message: `readiness check was not run: ${required}` });
      else if (check.status !== "pass") blockers.push({ code: check.status ?? "fail", message: `readiness check did not pass: ${required}` });
      if (check) await verifyEvidence(root, check.evidence, `readiness/${required}`, blockers);
    }
    const journeys = readiness.journeys ?? [];
    for (const surface of manifest.requirements.surfaces ?? []) {
      const journey = journeys.find((candidate) => candidate.surface === surface);
      if (!journey) {
        blockers.push({ code: "not_run", message: `continuous journey was not run for ${surface}` });
        continue;
      }
      if (journey.continuousCapture !== true || journey.forwardScroll !== "pass" || journey.reverseScroll !== "pass") {
        blockers.push({ code: "journey_missing", message: `${surface} lacks passing continuous forward and reverse journey evidence` });
      }
      for (const section of manifest.requirements.scrollDrivenSections ?? []) {
        if (!journey.scrollDrivenSections?.includes(section)) blockers.push({ code: "journey_missing", message: `${surface} journey is missing scroll section ${section}` });
      }
      await verifyEvidence(root, journey.evidence, `journey/${surface}`, blockers);
    }
  }

  const continuityReceipt = await loadBoundReceipt(root, manifest, identity, "continuity", blockers);
  if (continuityReceipt) {
    validateFreshness(continuityReceipt, "continuity receipt", now, blockers);
    const observations = continuityReceipt.observations ?? [];
    for (const field of profile.continuity.requiredFields) {
      if (observations.some((observation) => observation[field] === undefined || observation[field] === null || observation[field] === "")) blockers.push({ code: "continuity_fail", message: `continuity observation is missing ${field}` });
    }
    if (observations.length === 0) blockers.push({ code: "not_run", message: "continuity has no observations" });
    if (observations.some((observation) => observation.status !== "pass")) blockers.push({ code: "continuity_fail", message: "continuity contains a non-passing observation" });
    for (const surface of manifest.requirements.surfaces ?? []) if (!observations.some((observation) => observation.surface === surface)) blockers.push({ code: "not_run", message: `continuity has no ${surface} observation` });
    for (const observation of observations) await verifyEvidence(root, observation.evidence, `continuity/${observation.id ?? "observation"}`, blockers);
  }

  const specialist = await loadBoundReceipt(root, manifest, identity, "specialist", blockers);
  if (specialist) {
    validateFreshness(specialist, "specialist receipt", now, blockers);
    const jurors = specialist.jurors ?? [];
    if (jurors.length < profile.blindPanel.minimumIndependentJurors) blockers.push({ code: "judge_missing", message: `specialist evidence has ${jurors.length} jurors, needs ${profile.blindPanel.minimumIndependentJurors}` });
    for (const field of ["id", "contextId", "executorId"]) {
      const values = jurors.map((juror) => juror[field]);
      if (values.some((value) => typeof value !== "string" || !value.trim()) || new Set(values).size !== values.length) blockers.push({ code: "judge_identity", message: `specialist juror ${field} values are missing or duplicated` });
    }
    const coverage = new Set(jurors.flatMap((juror) => juror.coverage ?? []));
    for (const required of profile.requiredCoverage) if (!coverage.has(required)) blockers.push({ code: "judge_missing", message: `specialist coverage is missing ${required}` });
    if (jurors.some((juror) => juror.status !== "pass")) blockers.push({ code: "judge_fail", message: "one or more specialist jurors did not pass the candidate" });
    for (const juror of jurors) await verifyEvidence(root, juror.evidence, `specialist/${juror.id ?? "juror"}`, blockers);
    if (!Array.isArray(specialist.hardGates) || specialist.hardGates.length === 0) blockers.push({ code: "judge_missing", message: "specialist evidence has no hard gates" });
    else if (specialist.hardGates.some((gate) => gate.status !== "pass")) blockers.push({ code: "judge_fail", message: "one or more specialist hard gates did not pass" });
  }

  const ledgerPath = resolveProjectPath(root, manifest.feedback?.ledger, "feedback ledger", blockers);
  if (ledgerPath) {
    try {
      const ledger = await readJson(ledgerPath);
      const applicable = new Set(manifest.feedback?.applicableIds ?? []);
      for (const id of applicable) if (!ledger.items?.some((item) => item.id === id)) blockers.push({ code: "feedback_missing", message: `feedback item is missing: ${id}` });
      for (const item of ledger.items ?? []) {
        if (applicable.has(item.id) && ledger.rules?.approvalBlockedByStatuses?.includes(item.status)) blockers.push({ code: "feedback_blocking", message: `feedback remains unresolved: ${item.id} (${item.status})` });
      }
    } catch (error) {
      blockers.push({ code: "feedback_missing", message: `feedback ledger is unavailable or invalid (${error.message})` });
    }
  }

  return { ready: blockers.length === 0, candidateId: manifest.candidateId, identity, blockers, manifest };
}
