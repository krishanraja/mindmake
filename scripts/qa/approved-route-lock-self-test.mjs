#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "../..");
const manifestPath = resolve(root, "quality/route-lock/approved-production-r14.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
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
const badManifest = resolve(output, "approved-production-r14-bad.json");
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

console.log(JSON.stringify({ artifact: "approved-route-lock-self-test", failClosed: true, detectedDrift: firstPath }, null, 2));
