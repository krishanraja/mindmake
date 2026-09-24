#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256, stableJson, validateMaterialReviewCandidate } from "./material-review-firewall-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const args = process.argv.slice(2);
const manifestPath = args.find((value) => !value.startsWith("--"));
const issueIndex = args.indexOf("--issue");
const issuePath = issueIndex >= 0 ? args[issueIndex + 1] : null;

if (!manifestPath) {
  console.error("usage: node scripts/qa/material-review-firewall.mjs <candidate-manifest.json> [--issue <receipt.json>]");
  process.exit(1);
}

const result = await validateMaterialReviewCandidate({ root, manifestPath });
const report = {
  artifact: "mindmake-material-review-firewall-v1",
  candidateId: result.candidateId ?? null,
  candidateSha256: result.identity?.sha256 ?? null,
  ready: result.ready,
  blockers: result.blockers,
};

if (result.ready && issuePath) {
  const absolute = path.resolve(root, issuePath);
  const relative = path.relative(root, absolute);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("presentation receipt must remain inside the project root");
  const receipt = {
    schemaVersion: 1,
    kind: "material-review-presentation-receipt",
    candidateId: result.candidateId,
    candidateSha256: result.identity.sha256,
    issuedAt: new Date().toISOString(),
    firewallReportSha256: sha256(stableJson(report)),
    status: "material-review-ready",
  };
  await writeFile(absolute, `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  report.presentationReceipt = path.relative(root, absolute).replaceAll("\\", "/");
}

console.log(JSON.stringify(report, null, 2));
if (!result.ready) process.exitCode = 1;
