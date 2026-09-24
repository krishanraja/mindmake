#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sha256, stableJson, validateMaterialReviewCandidate } from "./material-review-firewall-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error("usage: npm run review:material -- <candidate-manifest.json>");
  process.exit(1);
}

const result = await validateMaterialReviewCandidate({ root, manifestPath });
if (!result.ready) {
  console.error(JSON.stringify({
    artifact: "mindmake-material-review-presentation-blocked-v1",
    candidateId: result.candidateId ?? null,
    ready: false,
    blockers: result.blockers,
  }, null, 2));
  process.exit(1);
}

const receiptDirectory = path.resolve(root, "artifacts/material-review", result.candidateId);
await mkdir(receiptDirectory, { recursive: true });
const report = {
  candidateId: result.candidateId,
  candidateSha256: result.identity.sha256,
  blockers: [],
  ready: true,
};
const receipt = {
  schemaVersion: 1,
  kind: "material-review-presentation-receipt",
  status: "material-review-ready",
  candidateId: result.candidateId,
  candidateSha256: result.identity.sha256,
  issuedAt: new Date().toISOString(),
  firewallReportSha256: sha256(stableJson(report)),
};
await writeFile(path.resolve(receiptDirectory, "presentation-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");

const port = await new Promise((resolvePort, reject) => {
  const probe = createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    probe.close(() => resolvePort(address.port));
  });
});

const route = result.manifest.artifact.route.startsWith("/") ? result.manifest.artifact.route : `/${result.manifest.artifact.route}`;
const url = `http://127.0.0.1:${port}${route}`;
console.log(JSON.stringify({
  artifact: "mindmake-material-review-presentation-v1",
  candidateId: result.candidateId,
  candidateSha256: result.identity.sha256,
  receipt: path.relative(root, path.resolve(receiptDirectory, "presentation-receipt.json")).replaceAll("\\", "/"),
  url,
}, null, 2));

const vite = path.resolve(root, "node_modules/vite/bin/vite.js");
const child = spawn(process.execPath, [vite, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code) => { process.exitCode = code ?? 0; });
