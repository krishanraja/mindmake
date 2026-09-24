#!/usr/bin/env node
import assert from "node:assert/strict";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { computeCandidateIdentity, sha256, validateMaterialReviewCandidate } from "./material-review-firewall-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fixtureRelative = "artifacts/material-review-firewall-self-test";
const fixture = path.resolve(root, fixtureRelative);
if (!fixture.startsWith(path.resolve(root, "artifacts") + path.sep)) throw new Error("self-test fixture escaped artifacts directory");

const rel = (name) => `${fixtureRelative}/${name}`;
const writeJson = (name, value) => writeFile(path.resolve(fixture, name), `${JSON.stringify(value, null, 2)}\n`, "utf8");
const evidence = [{ path: rel("evidence.txt"), sha256: null }];
const now = Date.now();
const capturedAt = new Date(now - 60_000).toISOString();
const expiresAt = new Date(now + 3_600_000).toISOString();

await rm(fixture, { recursive: true, force: true });
await mkdir(fixture, { recursive: true });

try {
  await writeFile(path.resolve(fixture, "index.html"), "<!doctype html><main><section id=history></section><section id=authority></section></main>\n", "utf8");
  await writeFile(path.resolve(fixture, "styles.css"), "main{display:block}section{min-height:100vh}\n", "utf8");
  await writeFile(path.resolve(fixture, "script.js"), "addEventListener('scroll',()=>{});\n", "utf8");
  await writeFile(path.resolve(fixture, "evidence.txt"), "candidate-bound evidence\n", "utf8");
  evidence[0].sha256 = sha256(await readFile(path.resolve(fixture, "evidence.txt")));

  const profile = JSON.parse(await readFile(path.resolve(root, "quality/website-redesign/experience-quality.profile.json"), "utf8"));
  const manifest = {
    schemaVersion: 1,
    candidateId: "firewall-valid-control",
    status: "candidate",
    profile: "quality/website-redesign/experience-quality.profile.json",
    artifact: {
      kind: "integrated-production-candidate",
      root: fixtureRelative,
      entry: rel("index.html"),
      route: "/artifacts/material-review-firewall-self-test/index.html",
      integrationModel: "single-dom-single-scroll-context",
      files: [rel("index.html"), rel("styles.css"), rel("script.js")],
    },
    requirements: {
      surfaces: ["desktop", "mobile"],
      singleDomScrollContext: true,
      noEmbeddedFrames: true,
      continuousForwardAndReverse: true,
      scrollDrivenSections: ["history", "authority"],
    },
    evidence: {
      readiness: rel("readiness.json"),
      continuity: rel("continuity.json"),
      specialist: rel("specialist.json"),
    },
    feedback: {
      ledger: rel("feedback.json"),
      applicableIds: ["SELF-TEST-001"],
    },
  };
  await writeJson("manifest.json", manifest);
  const identity = await computeCandidateIdentity(root, manifest);

  const readiness = {
    schemaVersion: 1,
    candidateId: manifest.candidateId,
    candidateSha256: identity.sha256,
    capturedAt,
    expiresAt,
    runtime: { selfOwned: true, origin: "http://127.0.0.1:4999" },
    checks: profile.reviewReadiness.requiredChecks.map((id) => ({ id, status: "pass", evidence })),
    journeys: manifest.requirements.surfaces.map((surface) => ({
      surface,
      continuousCapture: true,
      forwardScroll: "pass",
      reverseScroll: "pass",
      scrollDrivenSections: manifest.requirements.scrollDrivenSections,
      evidence,
    })),
  };
  const continuity = {
    schemaVersion: 1,
    candidateId: manifest.candidateId,
    candidateSha256: identity.sha256,
    capturedAt,
    expiresAt,
    observations: manifest.requirements.surfaces.map((surface, index) => ({
      id: `continuity-${index + 1}`,
      surface,
      route: manifest.artifact.route,
      viewport: surface === "desktop" ? "1440x900" : "390x844",
      action: "scroll from opening to footer and back",
      expected: "one continuous composed journey with no collisions",
      observed: "all declared sections entered and exited in both directions",
      status: "pass",
      evidence,
    })),
  };
  const coverage = profile.requiredCoverage;
  const specialist = {
    schemaVersion: 1,
    candidateId: manifest.candidateId,
    candidateSha256: identity.sha256,
    capturedAt,
    expiresAt,
    jurors: Array.from({ length: profile.blindPanel.minimumIndependentJurors }, (_, index) => ({
      id: `juror-${index + 1}`,
      contextId: `context-${index + 1}-independent`,
      executorId: `executor-${index + 1}-independent`,
      coverage: coverage.filter((_, coverageIndex) => coverageIndex % profile.blindPanel.minimumIndependentJurors === index),
      status: "pass",
      evidence,
    })),
    hardGates: [{ id: "all-material-review-hard-gates", status: "pass" }],
  };
  const ledger = {
    ledgerVersion: 1,
    rules: { approvalBlockedByStatuses: ["open", "implemented-awaiting-review"] },
    items: [{ id: "SELF-TEST-001", status: "accepted" }],
  };

  const reset = async () => {
    await writeFile(path.resolve(fixture, "index.html"), "<!doctype html><main><section id=history></section><section id=authority></section></main>\n", "utf8");
    await writeJson("manifest.json", manifest);
    await writeJson("readiness.json", readiness);
    await writeJson("continuity.json", continuity);
    await writeJson("specialist.json", specialist);
    await writeJson("feedback.json", ledger);
  };
  const validate = () => validateMaterialReviewCandidate({ root, manifestPath: rel("manifest.json"), now });
  const expectBlocked = async (label, mutate, expectedCode) => {
    await reset();
    await mutate();
    const result = await validate();
    assert.equal(result.ready, false, `${label} must fail closed`);
    assert(result.blockers.some((blocker) => blocker.code === expectedCode), `${label} expected ${expectedCode}; got ${result.blockers.map((blocker) => blocker.code).join(", ")}`);
  };

  await reset();
  const valid = await validate();
  assert.equal(valid.ready, true, `valid control must pass: ${valid.blockers.map((blocker) => blocker.message).join(" | ")}`);

  await expectBlocked("iframe assembly", async () => {
    await writeFile(path.resolve(fixture, "index.html"), "<!doctype html><iframe src=component.html></iframe>\n", "utf8");
  }, "embedded_frame");
  await expectBlocked("missing reverse scroll", async () => {
    const value = structuredClone(readiness);
    value.journeys[0].reverseScroll = "not_run";
    await writeJson("readiness.json", value);
  }, "journey_missing");
  await expectBlocked("stale evidence", async () => {
    const value = structuredClone(readiness);
    value.expiresAt = new Date(now - 1_000).toISOString();
    await writeJson("readiness.json", value);
  }, "stale");
  await expectBlocked("judge candidate mismatch", async () => {
    const value = structuredClone(specialist);
    value.candidateSha256 = "0".repeat(64);
    await writeJson("specialist.json", value);
  }, "mismatch");
  await expectBlocked("unresolved feedback", async () => {
    const value = structuredClone(ledger);
    value.items[0].status = "open";
    await writeJson("feedback.json", value);
  }, "feedback_blocking");
  await expectBlocked("forged evidence hash", async () => {
    const value = structuredClone(readiness);
    value.checks[0].evidence[0].sha256 = "f".repeat(64);
    await writeJson("readiness.json", value);
  }, "mismatch");
  await expectBlocked("missing receipt", async () => {
    const value = structuredClone(manifest);
    value.evidence.readiness = null;
    await writeJson("manifest.json", value);
  }, "missing");
  await expectBlocked("component harness", async () => {
    const value = structuredClone(manifest);
    value.artifact.kind = "fidelity-harness";
    await writeJson("manifest.json", value);
  }, "artifact_class");

  console.log("MATERIAL REVIEW FIREWALL SELF-TEST PASSED: 1 valid control, 8 blocked bypasses");
} finally {
  await rm(fixture, { recursive: true, force: true });
}
