#!/usr/bin/env node
import { createHash } from "node:crypto";
import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { validateRubric } from "./award-panel-lib.mjs";

const root = resolve(import.meta.dirname, "../..");
const contractPath = resolve(root, "quality/website-redesign/continuity-contract.v1.json");
const statePath = resolve(root, "project-documentation/website-redesign/STATE.md");
const failures = [];
const observations = [];
const sha256 = (content) => createHash("sha256").update(content).digest("hex");
const readJson = async (relativePath) => JSON.parse(await readFile(resolve(root, relativePath), "utf8"));
const exists = async (relativePath) => access(resolve(root, relativePath)).then(() => true).catch(() => false);
const requireCondition = (condition, message) => {
  if (!condition) failures.push(message);
};

const contract = JSON.parse(await readFile(contractPath, "utf8"));
const state = await readFile(statePath, "utf8");
const agents = await readFile(resolve(root, "AGENTS.md"), "utf8");
const claude = await readFile(resolve(root, "CLAUDE.md"), "utf8");
const visualBaselineRunner = await readFile(resolve(root, "scripts/qa/approved-visual-baseline-check.mjs"), "utf8");
const judgingProtocol = await readFile(resolve(root, "quality/award-panel/JUDGING_PROTOCOL.md"), "utf8");
const awardCapture = await readFile(resolve(root, "scripts/qa/award-panel-capture.mjs"), "utf8");
const awardAggregate = await readFile(resolve(root, "scripts/qa/award-panel-aggregate.mjs"), "utf8");
const packageJson = await readJson("package.json");
const materialReviewManifest = await readJson("quality/website-redesign/material-review-candidate.json");
const materialReviewReferenceR2 = await readJson("quality/website-redesign/material-review-reference-r2.json");
const materialReviewFirewall = await readFile(resolve(root, "scripts/qa/material-review-firewall-lib.mjs"), "utf8");
const materialReviewPresenter = await readFile(resolve(root, "scripts/qa/present-material-candidate.mjs"), "utf8");
const materialReviewSelfTest = await readFile(resolve(root, "scripts/qa/material-review-firewall-self-test.mjs"), "utf8");
const approved = await readJson("quality/route-lock/approved-production-r1.json");
const brain = await readJson("quality/ai-brain/approved-vnext-r5.json");
const gtm = await readJson("quality/ai-gtm/approved-vnext-r6.json");
const rubric = await readJson("quality/award-panel/rubric.v3.json");

requireCondition(contract.artifact === "mindmake-website-redesign-continuity-contract-v1", "unexpected continuity artifact id");
requireCondition(contract.status === "active", "continuity contract is not active");
requireCondition(contract.canonicalState === "project-documentation/website-redesign/STATE.md", "continuity contract points to the wrong state file");
requireCondition(contract.approvedBaseline.productionLock === "quality/route-lock/approved-production-r1.json", "continuity contract points to the wrong approved production lock");
requireCondition(approved.artifact === "mindmake-approved-production-routes-r1", "approved production artifact changed");
requireCondition(brain.artifact === "ai-brain-vnext-r5", "approved Brain artifact changed");
requireCondition(gtm.artifact === "ai-gtm-vnext-r6", "approved GTM artifact changed");

const expectedFeedbackIds = Array.from({ length: 51 }, (_, index) => `MMR-${String(index + 1).padStart(3, "0")}`);
const actualFeedbackIds = contract.feedbackRulings.map((ruling) => ruling.id);
requireCondition(new Set(actualFeedbackIds).size === actualFeedbackIds.length, "feedback rulings contain duplicate ids");
requireCondition(JSON.stringify(actualFeedbackIds) === JSON.stringify(expectedFeedbackIds), "feedback rulings must contain the complete ordered MMR-001 through MMR-051 set");
for (const ruling of contract.feedbackRulings) {
  requireCondition(typeof ruling.ruling === "string" && ruling.ruling.length >= 30, `${ruling.id} needs a specific ruling`);
  requireCondition(Array.isArray(ruling.scope) && ruling.scope.length > 0, `${ruling.id} needs a scope`);
  requireCondition(typeof ruling.acceptance === "string" && ruling.acceptance.length >= 30, `${ruling.id} needs observable acceptance criteria`);
}

const expectedFindingIds = Array.from({ length: 27 }, (_, index) => `MMF-${String(index + 1).padStart(3, "0")}`);
const actualFindingIds = contract.verifiedOpenFindings.map((finding) => finding.id);
requireCondition(JSON.stringify(actualFindingIds) === JSON.stringify(expectedFindingIds), "verified findings must contain the complete ordered MMF-001 through MMF-027 set");
for (const finding of contract.verifiedOpenFindings) {
  requireCondition(["P0", "P1", "P2", "P3"].includes(finding.severity), `${finding.id} has an invalid severity`);
  requireCondition(finding.finding.length >= 30 && finding.acceptance.length >= 30, `${finding.id} needs a finding and acceptance criterion`);
}

// /answers itself redirects to /blog since 2026-09-25 (Krish); the answer pages stay.
const requiredRoutes = ["/", "/ai-brain", "/ai-gtm", "/case-studies", "/new-age-leadership", "/blog", "/blog/:slug", "/answers/:slug", "/faq", "/contact", "/privacy", "/terms"];
for (const route of requiredRoutes) requireCondition(contract.routeContinuity.mustPreserve.includes(route), `route continuity is missing ${route}`);
requireCondition(contract.routeContinuity.publicationUrl === "https://mindmakerlive.substack.com", "publication URL changed");
requireCondition(contract.requiredViewports.length === 14, "the required viewport matrix must contain fourteen named sizes");
requireCondition(contract.requiredViewports.includes("1538x636"), "the required viewport matrix must retain the observed short-desktop 1538x636 size");
requireCondition(contract.requiredViewports.includes("1108x574"), "the required viewport matrix must retain the observed compact-desktop 1108x574 size");
requireCondition(contract.requiredViewports.includes("1475x730"), "the required viewport matrix must retain the observed scaled-Windows 1475x730 size");
requireCondition(contract.judgeSystem.continuityPanel.guardians.length === 6, "continuity panel must contain six independent guardians");
requireCondition(contract.judgeSystem.blindPanel.rubric === "quality/award-panel/rubric.v3.json", "blind panel must use rubric v3");
requireCondition(judgingProtocol.includes("six independent jurors"), "judging protocol must name six independent jurors");
requireCondition(judgingProtocol.includes("All twelve valid scorecards"), "judging protocol must require all twelve scorecards");
requireCondition(judgingProtocol.includes("verifies every cited evidence file"), "judging protocol must require hash-verified run-local evidence");
requireCondition(awardCapture.includes("continuityMatchesCandidate"), "award capture must reject a continuity report from another candidate");
requireCondition(awardAggregate.includes("frozen evidence hash mismatch"), "award aggregation must verify frozen evidence hashes");
requireCondition(contract.judgeSystem.blindPanel.minimumSurfaceScore === 9.2, "blind panel surface threshold must remain 9.2");
requireCondition(contract.judgeSystem.blindPanel.minimumJudgeScore === 8.8, "blind panel judge threshold must remain 8.8");
requireCondition(contract.operatingModel.exceptionAuthority.startsWith("Only Krish"), "exception and material approval authority must remain Krish");
requireCondition(contract.operatingModel.isolatedPrototypePath === "prototypes/website-redesign-recovery/gtm-market-change/", "isolated GTM prototype path changed");
requireCondition(contract.operatingModel.publicEditRule.includes("Public route files"), "public source freeze is not explicit");
requireCondition(contract.operatingModel.sourceParityRule.includes("does not block fresh concept work"), "r1 parity is still a circular concept blocker");
requireCondition(contract.operatingModel.dirtyTreeRule.includes("Do not create a clean worktree"), "dirty-tree recovery boundary is missing");
requireCondition(contract.materialSurfaces.requiresRenderedApproval.length === 7, "material surface classification must contain seven named families");
requireCondition(contract.materialSurfaces.classificationRule.includes("what a visitor notices first"), "material surface classification rule is incomplete");
requireCondition(contract.releaseBrowserDeviceMatrix.automated.some((entry) => entry.includes("WebKit")), "release matrix is missing WebKit automation");
requireCondition(contract.releaseBrowserDeviceMatrix.automated.some((entry) => entry.includes("Firefox")), "release matrix is missing Firefox automation");
requireCondition(contract.releaseBrowserDeviceMatrix.physical.some((entry) => entry.includes("iPhone Safari") && entry.includes("VoiceOver")), "release matrix is missing physical iPhone Safari and VoiceOver");
requireCondition(contract.releaseBrowserDeviceMatrix.physical.some((entry) => entry.includes("Android Chrome") && entry.includes("TalkBack")), "release matrix is missing physical Android Chrome and TalkBack");
requireCondition(visualBaselineRunner.includes("findEphemeralPort"), "approved visual runner must allocate its own ephemeral port");
requireCondition(visualBaselineRunner.includes("MINDMAKE_QA_ORIGIN"), "approved visual runner must bind child suites to its own origin");
requireCondition(!visualBaselineRunner.includes("Using verified existing Mindmake server"), "approved visual runner must not trust an ambient server");
requireCondition(packageJson.scripts?.["review:material"] === "node scripts/qa/present-material-candidate.mjs", "material review must use the fail-closed presenter");
requireCondition(packageJson.scripts?.["qa:homepage-handoff"] === "node scripts/qa/homepage-handoff-check.mjs", "homepage handoff must have a deterministic verifier");
requireCondition(packageJson.scripts?.["qa:website-restart"]?.includes("qa:homepage-handoff"), "website restart must verify the homepage handoff");
requireCondition(packageJson.scripts?.build?.includes("qa:homepage-handoff"), "the normal build must verify the homepage handoff");
requireCondition(agents.includes("quality/website-redesign/homepage-handoff.v1.json"), "AGENTS.md does not route homepage recovery through the frozen handoff manifest");
requireCondition(claude.includes("quality/website-redesign/homepage-handoff.v1.json"), "CLAUDE.md does not route homepage recovery through the frozen handoff manifest");
requireCondition(packageJson.scripts?.["qa:website-restart"]?.includes("qa:material-review:self-test"), "website restart must run the material-review firewall self-test");
requireCondition(packageJson.scripts?.build?.includes("qa:material-review:self-test"), "the normal build must run the material-review firewall self-test");
requireCondition(agents.includes("npm run review:material -- quality/website-redesign/material-review-candidate.json"), "AGENTS.md does not route material review through the firewall");
requireCondition(materialReviewReferenceR2.status === "blocked-reference", "R2 must remain classified as a blocked reference");
requireCondition(materialReviewReferenceR2.artifact.kind === "fidelity-harness", "R2 must remain classified as a fidelity harness");
requireCondition(materialReviewReferenceR2.artifact.integrationModel === "embedded-iframes", "R2 integration model is no longer declared honestly");
requireCondition(materialReviewManifest.artifact.integrationModel === "single-dom-single-scroll-context", "the active material candidate must use one DOM and one scroll context");
for (const requiredCode of ["embedded_frame", "journey_missing", "feedback_blocking", "judge_identity", "mismatch", "stale", "not_run"]) {
  requireCondition(materialReviewFirewall.includes(requiredCode), `material-review firewall is missing ${requiredCode}`);
}
requireCondition(materialReviewPresenter.includes("validateMaterialReviewCandidate"), "material presenter can bypass the firewall");
for (const requiredFixture of ["iframe assembly", "missing reverse scroll", "stale evidence", "judge candidate mismatch", "unresolved feedback", "forged evidence hash", "missing receipt", "component harness"]) {
  requireCondition(materialReviewSelfTest.includes(requiredFixture), `material-review self-test is missing ${requiredFixture}`);
}

const rubricFailures = validateRubric(rubric);
failures.push(...rubricFailures.map((failure) => `rubric v3: ${failure}`));
const representativeAwardRoutes = [
  "/", "/ai-brain", "/ai-gtm", "/case-studies", "/new-age-leadership", "/blog",
  "/blog/the-execution-gap-why-ai-literate-leaders-ship-while-others-plan",
  "/answers/adtech-compete-ai-targeting-models-defensibility-audit", "/faq", "/contact", "/privacy", "/terms",
];
requireCondition(
  JSON.stringify(rubric.requiredRouteGroups.complete) === JSON.stringify(representativeAwardRoutes),
  "rubric v3 complete coverage must include every canonical route plus representative blog and Answers detail routes",
);
const worldClass = rubric.awardBands.find((band) => band.id === "world_class_winner");
requireCondition(worldClass?.minimumSurfaceScore === 9.2 && worldClass?.minimumJudgeScore === 8.8, "rubric v3 world-class thresholds do not match the continuity contract");
for (const gate of ["real_estate_intent", "cognitive_pacing", "micro_layout_integrity", "action_consequence", "narrative_progression", "experiential_redundancy", "contextual_journey", "design_system_coherence"]) {
  requireCondition(rubric.hardGates.some((candidate) => candidate.id === gate), `rubric v3 is missing ${gate}`);
}

for (const candidate of contract.candidateStatus) {
  requireCondition(await exists(candidate.manifest), `missing candidate manifest ${candidate.manifest}`);
  const manifest = await readJson(candidate.manifest);
  requireCondition(manifest.status === "candidate", `${candidate.manifest} no longer identifies itself as a candidate`);
  requireCondition(manifest.authority.includes("does not replace approved-production-r1.json"), `${candidate.manifest} no longer preserves the approved r1 authority boundary`);
}

const approvedPrototypeFiles = [
  ["prototypes/ai-brain-vnext-r5/index.html", brain.prototypeHashes.html],
  ["prototypes/ai-brain-vnext-r5/styles.css", brain.prototypeHashes.css],
  ["prototypes/ai-brain-vnext-r5/script.js", brain.prototypeHashes.javascript],
  ["prototypes/ai-gtm-vnext-r6/index.html", gtm.prototypeHashes.html],
  ["prototypes/ai-gtm-vnext-r6/styles.css", gtm.prototypeHashes.css],
  ["prototypes/ai-gtm-vnext-r6/script.js", gtm.prototypeHashes.javascript],
  ["prototypes/ai-brain-vnext-r5/production-review.html", approved.files["prototypes/ai-brain-vnext-r5/production-review.html"]],
  ["prototypes/ai-gtm-vnext-r6/production-review.html", approved.files["prototypes/ai-gtm-vnext-r6/production-review.html"]]
];
for (const [relativePath, expectedHash] of approvedPrototypeFiles) {
  const bytes = await readFile(resolve(root, relativePath));
  requireCondition(sha256(bytes) === expectedHash, `${relativePath} no longer matches its approved hash`);
}

const brainMaterialLockFiles = [
  ["prototypes/website-redesign-recovery/brain-signature/index-s2.html", "fe797bc208887c63a65e12bea98c543a088cbb14f566a69275f9a408ebba0123"],
  ["prototypes/website-redesign-recovery/brain-signature/styles-s2.css", "73be37eb68c46dd04e97be877aad5f8a560e870417c25811518699eeae1f5a49"],
  ["prototypes/website-redesign-recovery/brain-signature/script-s2.js", "0a399a7510cd0e3f83cc7bb2e92d63c25b34ee36cb2478630edba6490572118f"],
  ["prototypes/website-redesign-recovery/brain-signature/check-s2.mjs", "07fc63e45aa80ce158cdfe70f6c859f294eb3627cb1e6264b12485a601d883f3"],
  ["prototypes/website-redesign-recovery/brain-signature/review-s2.html", "aac231d7bd267e71cdcb47b5e6c9630944dd7045764c0424e585c135ed1ddfd9"],
  ["prototypes/website-redesign-recovery/brain-signature/paired-s2.png", "5bf0fed49f34842870661d358cc1525397663da6cc9674a7c9d87a778976f93d"],
  ["prototypes/website-redesign-recovery/brain-signature/index-s2-lock.html", "32fe36fb55c66010dfdd2d2593b191012b37aff7165c3904eb18accb1bae8192"],
  ["prototypes/website-redesign-recovery/brain-signature/styles-s2-lock.css", "4dc5945f4bcd362f6588942566fd072a5489c12028abfdb3af3e7150a50fb490"],
  ["prototypes/website-redesign-recovery/brain-signature/check-s2-lock.mjs", "7b041ba56cc5c4c31a2ef1e0b8b5af4ebb6d1d95f3c55dfa8721e7bd9bb08417"],
  ["prototypes/website-redesign-recovery/brain-signature/review-s2-lock.html", "5cd6d6a01d85baffd01ae08123e941d7a3576197f47e95cc322f46cf1f7ef5b1"],
  ["prototypes/website-redesign-recovery/brain-signature/paired-s2-lock.png", "9126ba8d4684f89d552f3a79279e14e8469e73955b6c2d3e434a2e544443766e"]
];
for (const [relativePath, expectedHash] of brainMaterialLockFiles) {
  const bytes = await readFile(resolve(root, relativePath));
  requireCondition(sha256(bytes) === expectedHash, `${relativePath} no longer matches the owner-approved Brain S2 material lock`);
}
observations.push(`${brainMaterialLockFiles.length} Brain S2 baseline and lock files match the owner-approved hashes`);

let matchingApprovedSourceFiles = 0;
for (const [relativePath, expectedHash] of Object.entries(approved.files)) {
  try {
    const bytes = await readFile(resolve(root, relativePath));
    if (sha256(bytes) === expectedHash) matchingApprovedSourceFiles += 1;
  } catch {
    observations.push(`${relativePath} is unavailable in the current worktree`);
  }
}
observations.push(`${matchingApprovedSourceFiles} of ${Object.keys(approved.files).length} r1 locked files currently match; this is an observation, not a start-gate pass`);

// Current documentation must describe the accepted release, not repeat an obsolete
// recovery prompt. The complete earlier text is independently hash-checked below.
const release = await readFile(resolve(root, "project-documentation/website-redesign/RELEASE-2026-09-24.md"), "utf8");
const history = await readFile(resolve(root, "project-documentation/history/LOG.md"), "utf8");
// The verbatim originals moved to their own file on 26 September 2026 so LOG.md
// can stay a dated log (the docs steward's rule); LOG.md keeps a pointer at every anchor.
const archive = await readFile(resolve(root, "project-documentation/history/ARCHIVE.md"), "utf8");
const currentDocumentationRequirements = [
  ["state", "Status: approved-r3-live"],
  ["state", "06_CURRENT_STATE.md"],
  ["state", "quality/route-lock/approved-production-r14.json"],
  ["state", "prototypes/website-redesign-recovery/homepage-production-synthesis-r3/"],
  ["state", "scripts/qa/build-homepage-release.mjs"],
  // r41 (Ruling, Krish, 2026-09-25): the homepage carries the R3 history
  // chapter and then the three new-age leadership chapters, reach in both states.
  ["state", "the homepage carries the R3 history chapter and then the three new-age leadership chapters (r41)"],
  ["state", "History retains four reversible states"],
  ["state", "The reach chapter retains both states"],
  ["state", "The AI Brain benefits retain all six beside The returned hour"],
  ["state", "No wheel/touch cancellation"],
  ["state", "Every state stays reachable from its direct controls on reduced-motion and short screens"],
  ["state", "Only Krish may approve a material surface or accept an MMF exception"],
  ["state", "Submission is not approval"],
  ["state", "npm run qa:website-restart"],
  ["state", "npm run qa:website-approved-visuals"],
  ["state", "npm run qa:homepage-release"],
  ["state", "npm run qa:release-routes"],
  ["state", "Browser emulation is not a physical-device pass"],
  ["state", "../history/ARCHIVE.md#archive-2026-09-24-website-redesign-state-md"],
  ["release", "Publish after all other checks pass; record this exception"],
  ["release", "Neither check has been performed"],
  ["release", "not a permanent waiver for future work"],
  ["release", "../history/ARCHIVE.md#archive-2026-09-24-website-redesign-release-2026-09-24-md"],
];
const obsoleteCurrentClaims = [
  "This is the single current state route for the unreleased multi-surface redesign.",
  "Exact next-session prompt",
  "Exact r1 source parity is not currently recovered",
  "RELEASE BLOCKED",
  "Leadership dividend retains five stages",
  "opens on \"The organisation changes shape.\" alone",
];
function validateCurrentDocumentation(documents) {
  const issues = [];
  for (const [document, requiredText] of currentDocumentationRequirements) {
    if (!documents[document]?.includes(requiredText)) issues.push(`${document}: missing ${requiredText}`);
  }
  for (const [document, text] of Object.entries(documents)) {
    for (const obsolete of obsoleteCurrentClaims) {
      if (text.includes(obsolete)) issues.push(`${document}: obsolete current claim ${obsolete}`);
    }
  }
  return issues;
}
const currentDocuments = { state, release };
failures.push(...validateCurrentDocumentation(currentDocuments));
let documentationNegativeControls = 0;
for (const [document, requiredText] of currentDocumentationRequirements) {
  const mutated = { ...currentDocuments, [document]: currentDocuments[document].replaceAll(requiredText, "[removed for negative control]") };
  requireCondition(validateCurrentDocumentation(mutated).includes(`${document}: missing ${requiredText}`),
    `documentation negative control did not reject missing ${requiredText}`);
  documentationNegativeControls += 1;
}
for (const obsolete of obsoleteCurrentClaims) {
  for (const document of ["state", "release"]) {
    const mutated = { ...currentDocuments, [document]: currentDocuments[document] + "\n" + obsolete };
    requireCondition(validateCurrentDocumentation(mutated).includes(`${document}: obsolete current claim ${obsolete}`),
      `documentation negative control accepted obsolete ${document} text`);
    documentationNegativeControls += 1;
  }
}

// Immutable transfer receipts bind the full pre-consolidation documents, including
// failed findings and superseded owner instructions. These are not release passes.
const archivedDocuments = [
  {
    "path": "project-documentation/homepage-redesign/BRAIN_AWARD_PANEL_R1.md",
    "rawOriginal": {
      "sha256": "bac240bd2afee5583f49a497b8cdd4ac4ddb1ad328f6343af44ba8c5cc2c1322",
      "bytes": 4440
    },
    "storedLf": {
      "sha256": "bac240bd2afee5583f49a497b8cdd4ac4ddb1ad328f6343af44ba8c5cc2c1322",
      "bytes": 4440
    }
  },
  {
    "path": "project-documentation/homepage-redesign/BRAIN_CONCEPT_TRACE.md",
    "rawOriginal": {
      "sha256": "6859445e88a479651e736ccaafbe7528209b39428056d37f9c45e870ecd3ee05",
      "bytes": 9631
    },
    "storedLf": {
      "sha256": "6859445e88a479651e736ccaafbe7528209b39428056d37f9c45e870ecd3ee05",
      "bytes": 9631
    }
  },
  {
    "path": "project-documentation/homepage-redesign/CONCEPT_TRACE.md",
    "rawOriginal": {
      "sha256": "87b73e2cb4e2653cf226f905780a95dcb73a8134f67e441d6648ed53394f7d29",
      "bytes": 7590
    },
    "storedLf": {
      "sha256": "87b73e2cb4e2653cf226f905780a95dcb73a8134f67e441d6648ed53394f7d29",
      "bytes": 7590
    }
  },
  {
    "path": "project-documentation/homepage-redesign/DECISIONS.md",
    "rawOriginal": {
      "sha256": "68c2a2531c663ecec6e9d06afb4071a8c578ff5440127cbb36d06838a3bf03ca",
      "bytes": 28910
    },
    "storedLf": {
      "sha256": "68c2a2531c663ecec6e9d06afb4071a8c578ff5440127cbb36d06838a3bf03ca",
      "bytes": 28910
    }
  },
  {
    "path": "project-documentation/homepage-redesign/GTM_CONCEPT_TRACE.md",
    "rawOriginal": {
      "sha256": "5953ff3b6ca3379cf859acf15da0b7c2716da0bf7a2551a689145f6c39a48c58",
      "bytes": 12676
    },
    "storedLf": {
      "sha256": "5953ff3b6ca3379cf859acf15da0b7c2716da0bf7a2551a689145f6c39a48c58",
      "bytes": 12676
    }
  },
  {
    "path": "project-documentation/homepage-redesign/JUDGE_BRIEF.md",
    "rawOriginal": {
      "sha256": "a91690c7f79214ab60d0b872d4dce173621979166052dff4584abdb2e15f3bd6",
      "bytes": 3441
    },
    "storedLf": {
      "sha256": "a91690c7f79214ab60d0b872d4dce173621979166052dff4584abdb2e15f3bd6",
      "bytes": 3441
    }
  },
  {
    "path": "project-documentation/homepage-redesign/ROUND2_JUDGE_BRIEF.md",
    "rawOriginal": {
      "sha256": "9a92a49117ac81fde264c9e50fe26180ebc789a733ed16b36a76a9cff351b95c",
      "bytes": 3175
    },
    "storedLf": {
      "sha256": "9a92a49117ac81fde264c9e50fe26180ebc789a733ed16b36a76a9cff351b95c",
      "bytes": 3175
    }
  },
  {
    "path": "project-documentation/homepage-redesign/ROUND2_MISSING_TERRITORY.md",
    "rawOriginal": {
      "sha256": "5f643a2967d595ae966981e54004086d4f75f067cc2c544e310de0319e75ecac",
      "bytes": 1556
    },
    "storedLf": {
      "sha256": "5f643a2967d595ae966981e54004086d4f75f067cc2c544e310de0319e75ecac",
      "bytes": 1556
    }
  },
  {
    "path": "project-documentation/homepage-redesign/SANITIZED_BRIEF.md",
    "rawOriginal": {
      "sha256": "ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc",
      "bytes": 4598
    },
    "storedLf": {
      "sha256": "ba36e37a12bbad4edbb8edc61db42a969f3b0bad9e93af92a3202828b753a8dc",
      "bytes": 4598
    }
  },
  {
    "path": "project-documentation/homepage-redesign/STATE.md",
    "rawOriginal": {
      "sha256": "8af0041152c56910277c62e4e2643ccf2823cb71ba61849c9151db20587a34b8",
      "bytes": 29279
    },
    "storedLf": {
      "sha256": "8af0041152c56910277c62e4e2643ccf2823cb71ba61849c9151db20587a34b8",
      "bytes": 29279
    }
  },
  {
    "path": "project-documentation/website-redesign/STATE.md",
    "rawOriginal": {
      "sha256": "b38aaffb13d1b3eb8bfbb60f27d3731cef1dca96bd9869dd88d0599306f8affe",
      "bytes": 325904
    },
    "storedLf": {
      "sha256": "b38aaffb13d1b3eb8bfbb60f27d3731cef1dca96bd9869dd88d0599306f8affe",
      "bytes": 325904
    }
  },
  {
    "path": "project-documentation/website-redesign/RELEASE-2026-09-24.md",
    "rawOriginal": {
      "sha256": "699383ffdf3974aa3f36f19ba0c7738df0fe68f6be7fbd86c84a83116f6c88ca",
      "bytes": 16742
    },
    "storedLf": {
      "sha256": "699383ffdf3974aa3f36f19ba0c7738df0fe68f6be7fbd86c84a83116f6c88ca",
      "bytes": 16742
    }
  }
];
function validateArchivedDocument(log, entry) {
  // Preserve raw-source provenance separately; normalize checkout transport only.
  // Every archived original in this transfer used LF.
  log = log.replace(/\r\n/g, "\n");
  const begin = "<!-- BEGIN VERBATIM " + entry.path + " -->\n" + "``````markdown\n";
  const end = "``````\n<!-- END VERBATIM " + entry.path + " -->";
  const start = log.indexOf(begin);
  if (start < 0 || log.indexOf(begin, start + begin.length) >= 0) return "missing or duplicate archive";
  const contentStart = start + begin.length;
  const finish = log.indexOf(end, contentStart);
  if (finish < 0) return "missing archive end";
  const body = log.slice(contentStart, finish);
  if (Buffer.byteLength(body, "utf8") !== entry.storedLf.bytes || sha256(body) !== entry.storedLf.sha256) return "archive byte/hash mismatch";
  return null;
}
for (const entry of archivedDocuments) {
  const issue = validateArchivedDocument(archive, entry);
  requireCondition(!issue, `${entry.path}: ${issue}`);
  const marker = "<!-- BEGIN VERBATIM " + entry.path + " -->\n" + "``````markdown\n";
  const corrupt = archive.replace(/\r\n/g, "\n").replace(marker, marker + "[deliberate negative-control corruption]");
  requireCondition(validateArchivedDocument(corrupt, entry) === "archive byte/hash mismatch",
    `${entry.path}: archive corruption negative control did not fail closed`);
}
let archiveTransportControls = 0;
const historyLf = archive.replace(/\r\n/g, "\n");
for (const transported of [historyLf, historyLf.replace(/\n/g, "\r\n")]) {
  for (const entry of archivedDocuments) {
    requireCondition(!validateArchivedDocument(transported, entry), `${entry.path}: line-ending transport changed archived meaning`);
    archiveTransportControls += 1;
  }
}
observations.push(`${archivedDocuments.length} complete historical documents retain raw-source provenance and match separate stored-LF byte counts and SHA-256 values`);
observations.push(`${archiveTransportControls} LF/CRLF transport controls preserve all archived bodies`);
observations.push(`${documentationNegativeControls} current-state negative controls and ${archivedDocuments.length} archive-corruption controls reject invalid documentation`);
requireCondition(agents.includes("project-documentation/website-redesign/STATE.md"), "AGENTS.md does not route new agents to the recovery state");
requireCondition(agents.includes("quality/website-redesign/continuity-contract.v1.json"), "AGENTS.md does not route new agents to the continuity contract");

console.log(JSON.stringify({
  artifact: contract.artifact,
  feedbackRulings: contract.feedbackRulings.length,
  verifiedOpenFindings: contract.verifiedOpenFindings.length,
  requiredRoutes: contract.routeContinuity.mustPreserve.length,
  requiredViewports: contract.requiredViewports.length,
  continuityGuardianDefinitions: contract.judgeSystem.continuityPanel.guardians.length,
  blindJudgeDefinitions: rubric.judges.length,
  judgingStatus: "definitions_validated_only_no_judges_executed",
  approvedPrototypeFiles: approvedPrototypeFiles.length,
  brainMaterialLockFiles: brainMaterialLockFiles.length,
  matchingApprovedSourceFiles,
  approvedLockedFiles: Object.keys(approved.files).length,
  currentDocumentationRequirements: currentDocumentationRequirements.length,
  documentationNegativeControls,
  archivedDocuments: archivedDocuments.length,
  archiveCorruptionNegativeControls: archivedDocuments.length,
  archiveTransportControls,
  observations,
  failures
}, null, 2));

if (failures.length) process.exitCode = 1;
