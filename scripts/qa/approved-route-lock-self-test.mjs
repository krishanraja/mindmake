#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { sourceHashBytes } from "../lib/source-hash.mjs";

const root = resolve(import.meta.dirname, "../..");
const manifestPath = resolve(root, "quality/route-lock/approved-production-r27.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
for (const extension of ['.svg', '.xml', '.webmanifest']) {
  const lf = Buffer.from('first\nsecond\n');
  const crlf = Buffer.from('first\r\nsecond\r\n');
  if (digest(sourceHashBytes(`asset${extension}`, lf, manifest)) !== digest(sourceHashBytes(`asset${extension}`, crlf, manifest))) throw new Error(`Line ending drift for ${extension}`);
  const historical = { textLineEndings: 'lf' };
  if (digest(sourceHashBytes(`asset${extension}`, lf, historical)) === digest(sourceHashBytes(`asset${extension}`, crlf, historical))) throw new Error(`Historical semantics changed for ${extension}`);
}
const binary = Buffer.from([0, 255, 13, 10, 128]);
if (!sourceHashBytes('image.png', binary, manifest).equals(binary)) throw new Error('Binary bytes were normalized');
const valid = spawnSync(process.execPath, [resolve(root, "scripts/qa/approved-route-lock-check.mjs")], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, MINDMAKE_ROUTE_LOCK_MANIFEST: manifestPath },
});
if (valid.status !== 0) throw new Error('The current unmodified manifest must pass before its negative control is meaningful');
const [firstPath] = Object.keys(manifest.files);
manifest.files[firstPath] = "0".repeat(64);

const output = resolve(tmpdir(), "mindmake-route-lock-self-test");
await mkdir(output, { recursive: true });
const badManifest = resolve(output, "approved-production-r27-bad.json");
await writeFile(badManifest, `${JSON.stringify(manifest, null, 2)}\n`);

const result = spawnSync(process.execPath, [resolve(root, "scripts/qa/approved-route-lock-check.mjs")], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, MINDMAKE_ROUTE_LOCK_MANIFEST: badManifest },
});

if (result.status === 0 || !result.stdout.includes(firstPath)) {
  console.error(JSON.stringify({ artifact: "approved-route-lock-self-test", expectedFailure: firstPath, status: result.status, stdout: result.stdout, stderr: result.stderr }, null, 2));
  process.exit(1);
}

// Second control: a GTM contract that states no evidence contract at all must
// be refused, not silently skipped.
const unanchored = JSON.parse(await readFile(manifestPath, "utf8"));
delete unanchored.minimumContracts.gtm.signals;
delete unanchored.minimumContracts.gtm.responseChoices;
delete unanchored.minimumContracts.gtm.citedSignals;
const unanchoredManifest = resolve(output, "approved-production-r27-unanchored.json");
await writeFile(unanchoredManifest, `${JSON.stringify(unanchored, null, 2)}\n`);
const unanchoredResult = spawnSync(process.execPath, [resolve(root, "scripts/qa/approved-route-lock-check.mjs")], {
  cwd: root,
  encoding: "utf8",
  env: { ...process.env, MINDMAKE_ROUTE_LOCK_MANIFEST: unanchoredManifest },
});
if (unanchoredResult.status === 0 || !unanchoredResult.stdout.includes("neither signal counts nor cited signals")) {
  console.error(JSON.stringify({ artifact: "approved-route-lock-self-test", expectedFailure: "unanchored GTM contract", status: unanchoredResult.status, stdout: unanchoredResult.stdout }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ artifact: "approved-route-lock-self-test", failClosed: true, detectedDrift: firstPath, refusedUnanchoredGtm: true }, null, 2));
