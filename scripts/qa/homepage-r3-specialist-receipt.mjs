import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { computeCandidateIdentity } from "./material-review-firewall-lib.mjs";

const root = path.resolve(import.meta.dirname, "../..");
const manifestPath = path.resolve(root, "quality/website-redesign/material-review-candidate.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const profile = JSON.parse(await readFile(path.resolve(root, manifest.profile), "utf8"));
const identity = await computeCandidateIdentity(root, manifest);
const evidenceRoot = path.resolve(root, "artifacts/material-review", manifest.candidateId);
const jurorRoot = path.resolve(evidenceRoot, "jurors");
const reportFiles = ["art-system.json", "narrative.json", "interaction.json", "commercial.json", "ux-technical.json", "originality.json"];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const rel = (absolute) => path.relative(root, absolute).replaceAll("\\", "/");

const reports = [];
for (const file of reportFiles) {
  const absolute = path.resolve(jurorRoot, file);
  const bytes = await readFile(absolute);
  const report = JSON.parse(bytes.toString("utf8"));
  if (report.status !== "pass") throw new Error(`${file} did not pass`);
  if (!bytes.toString("utf8").includes(identity.sha256)) throw new Error(`${file} is not bound to ${identity.sha256}`);
  if (!Array.isArray(report.coverage) || report.coverage.length === 0) throw new Error(`${file} has no coverage`);
  if (!Array.isArray(report.hardGates) || report.hardGates.length === 0 || report.hardGates.some((gate) => gate.status !== "pass")) throw new Error(`${file} has an unresolved hard gate`);
  reports.push({ report, absolute, sha256: sha256(bytes) });
}

for (const field of ["id", "contextId", "executorId"]) {
  const values = reports.map(({ report }) => report[field]);
  if (values.some((value) => typeof value !== "string" || !value.trim()) || new Set(values).size !== values.length) throw new Error(`juror ${field} values are missing or duplicated`);
}

const coverage = new Set(reports.flatMap(({ report }) => report.coverage));
for (const required of profile.requiredCoverage) if (!coverage.has(required)) throw new Error(`specialist coverage missing ${required}`);

const captured = new Date();
const receipt = {
  schemaVersion: 1,
  candidateId: manifest.candidateId,
  candidateSha256: identity.sha256,
  capturedAt: captured.toISOString(),
  expiresAt: new Date(captured.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  jurors: reports.map(({ report, absolute, sha256: evidenceSha256 }) => ({
    id: report.id,
    contextId: report.contextId,
    executorId: report.executorId,
    surface: report.surface,
    coverage: report.coverage,
    status: report.status,
    evidence: [{ path: rel(absolute), sha256: evidenceSha256 }],
  })),
  hardGates: reports.flatMap(({ report }) => report.hardGates.map((gate) => ({
    id: `${report.id}:${gate.id}`,
    status: gate.status,
  }))),
};

await mkdir(evidenceRoot, { recursive: true });
const target = path.resolve(evidenceRoot, "specialist-receipt.json");
await writeFile(target, `${JSON.stringify(receipt, null, 2)}\n`);
console.log(JSON.stringify({ artifact: "homepage-r3-specialist-receipt", candidateSha256: identity.sha256, jurors: receipt.jurors.length, coverage: [...coverage], target: rel(target) }, null, 2));
