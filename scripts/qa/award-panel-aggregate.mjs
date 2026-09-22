import fs from "node:fs/promises";
import path from "node:path";
import {
  awardBand,
  candidateIdentity,
  hashEvidenceManifest,
  hashRubric,
  loadRubric,
  readJson,
  scoreSubmission,
  stableJson,
  validateRubric,
  validateSubmission,
} from "./award-panel-lib.mjs";

const runDirectory = process.argv[2];
if (!runDirectory) {
  console.error("usage: node scripts/qa/award-panel-aggregate.mjs <run-directory>");
  process.exit(1);
}

const absoluteRunDirectory = path.resolve(runDirectory);
const rubric = await loadRubric();
const rubricErrors = validateRubric(rubric);
if (rubricErrors.length) {
  console.error(rubricErrors.join("\n"));
  process.exit(1);
}

const run = await readJson(path.join(absoluteRunDirectory, "run.json"));
if (run.schemaVersion !== 2) {
  console.error("run schemaVersion must be 2; legacy panel runs cannot certify this candidate");
  process.exit(1);
}
if (run.rubricSha256 !== hashRubric(rubric)) {
  console.error("run rubric hash does not match the current rubric");
  process.exit(1);
}
if (run.rubricVersion !== rubric.rubricRevision) {
  console.error("run rubric revision does not match the current rubric revision");
  process.exit(1);
}
if (Date.now() > Date.parse(run.expiresAt)) {
  console.error(`award panel evidence expired at ${run.expiresAt}`);
  process.exit(1);
}
const currentCandidate = await candidateIdentity();
if (run.candidate?.sha256 !== currentCandidate.sha256) {
  console.error(`candidate changed after evidence capture (${run.candidate?.sha256 ?? "missing"} != ${currentCandidate.sha256})`);
  process.exit(1);
}
if (run.evidenceManifestSha256 !== hashEvidenceManifest(run.evidenceManifest)) {
  console.error("evidence manifest hash does not match its contents");
  process.exit(1);
}
const observationIds = new Set();
for (const observation of run.evidenceManifest?.observations ?? []) {
  if (observationIds.has(observation.id)) {
    console.error(`duplicate observation id: ${observation.id}`);
    process.exit(1);
  }
  observationIds.add(observation.id);
}
for (const id of run.requiredObservationIds ?? []) {
  if (!observationIds.has(id)) {
    console.error(`required observation is missing: ${id}`);
    process.exit(1);
  }
}

const submissionDirectory = path.join(absoluteRunDirectory, "submissions");
const names = (await fs.readdir(submissionDirectory)).filter((name) => name.endsWith(".json")).sort();
const submissions = await Promise.all(names.map((name) => readJson(path.join(submissionDirectory, name))));
const errors = [];
const seen = new Set();
const semanticCards = new Set();
const jurorCounts = new Map();
const jurorContexts = new Map();
for (const submission of submissions) {
  if (submission.runId !== run.runId) errors.push(`${submission.judgeId} belongs to run ${submission.runId}, not ${run.runId}`);
  if (seen.has(submission.judgeId)) errors.push(`duplicate submission for ${submission.judgeId}`);
  seen.add(submission.judgeId);
  jurorCounts.set(submission.jurorId, (jurorCounts.get(submission.jurorId) ?? 0) + 1);
  const expectedContext = run.judgeContexts?.[submission.jurorId];
  if (!expectedContext || submission.contextId !== expectedContext) errors.push(`${submission.judgeId} did not use the issued independent context`);
  const priorContext = jurorContexts.get(submission.jurorId);
  if (priorContext && priorContext !== submission.contextId) errors.push(`${submission.jurorId} changed context between its paired scorecards`);
  jurorContexts.set(submission.jurorId, submission.contextId);
  if (submission.candidateSha256 !== run.candidate.sha256) errors.push(`${submission.judgeId} judged a different candidate`);
  if (submission.rubricSha256 !== run.rubricSha256) errors.push(`${submission.judgeId} used a different rubric`);
  if (submission.evidenceManifestSha256 !== run.evidenceManifestSha256) errors.push(`${submission.judgeId} used a different evidence manifest`);
  const submittedAt = Date.parse(submission.submittedAt);
  if (submittedAt < Date.parse(run.capturedAt) || submittedAt > Date.parse(run.expiresAt)) errors.push(`${submission.judgeId} was submitted outside the frozen evidence window`);
  for (const id of submission.consumedObservationIds ?? []) {
    if (!observationIds.has(id)) errors.push(`${submission.judgeId} consumed unknown observation ${id}`);
  }
  const boundIds = [
    ...(submission.dimensions ?? []).flatMap((dimension) => (dimension.evidence ?? []).flatMap((item) => item.observationIds ?? [])),
    ...(submission.hardGates ?? []).flatMap((gate) => gate.observationIds ?? []),
  ];
  for (const id of boundIds) {
    if (!observationIds.has(id)) errors.push(`${submission.judgeId} cites unknown observation ${id}`);
    if (!(submission.consumedObservationIds ?? []).includes(id)) errors.push(`${submission.judgeId} cites unconsumed observation ${id}`);
  }
  const semanticCard = stableJson({
    dimensions: submission.dimensions,
    hardGates: submission.hardGates,
    summary: submission.summary,
    confidence: submission.confidence,
  });
  if (semanticCards.has(semanticCard)) errors.push(`${submission.judgeId} duplicates another scorecard verbatim`);
  semanticCards.add(semanticCard);
  errors.push(...validateSubmission(submission, rubric));
}
for (const juror of rubric.jurors) {
  if (jurorCounts.get(juror.id) !== 2) errors.push(`${juror.id} must submit exactly two assigned scorecards`);
}
for (const judge of rubric.judges) {
  if (!seen.has(judge.id)) errors.push(`missing submission for ${judge.id}`);
}
const distinctContexts = new Set(jurorContexts.values());
if (distinctContexts.size !== rubric.jurors.length) errors.push(`expected ${rubric.jurors.length} independent juror contexts, found ${distinctContexts.size}`);
const consumedAcrossPanel = new Set(submissions.flatMap((submission) => submission.consumedObservationIds ?? []));
for (const id of run.requiredObservationIds ?? []) {
  if (!consumedAcrossPanel.has(id)) errors.push(`required observation was never consumed: ${id}`);
}
if (errors.length) {
  console.error(`award panel run invalid:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

const surfaces = {};
const requiredEvidence = (run.requiredObservationIds ?? []).map((id) => run.evidenceManifest.observations.find((item) => item.id === id));
const evidenceReady = requiredEvidence.length > 0 && requiredEvidence.every((item) => item?.status === "pass");
const confidenceReady = submissions.every((submission) => submission.confidence !== "low");
for (const surface of ["desktop", "mobile"]) {
  const judged = submissions
    .filter((submission) => submission.surface === surface)
    .map((submission) => ({
      judgeId: submission.judgeId,
      score: scoreSubmission(submission, rubric),
      confidence: submission.confidence,
      summary: submission.summary
    }));
  const score = Math.round((judged.reduce((sum, item) => sum + item.score, 0) / judged.length) * 10) / 10;
  const surfaceSubmissions = submissions.filter((submission) => submission.surface === surface);
  const gates = rubric.hardGates.map((gate) => {
    const ownerIds = gate.owners.filter((owner) => rubric.judges.find((judge) => judge.id === owner)?.surface === surface);
    const ownerStatuses = ownerIds.map((owner) => {
      const submission = surfaceSubmissions.find((candidate) => candidate.judgeId === owner);
      const reported = submission.hardGates.find((candidate) => candidate.id === gate.id);
      return { judgeId: owner, status: reported.status, evidence: reported.evidence };
    });
    return {
      id: gate.id,
      status: ownerStatuses.every((item) => item.status === "pass") ? "pass" : ownerStatuses.some((item) => item.status === "fail") ? "fail" : "inconclusive",
      owners: ownerStatuses
    };
  });
  const allGatesPass = gates.every((gate) => gate.status === "pass") && evidenceReady && confidenceReady;
  surfaces[surface] = {
    score,
    awardBand: awardBand(score, judged.map((item) => item.score), allGatesPass, rubric),
    allGatesPass,
    gates,
    judges: judged
  };
}

const siteScore = Math.min(surfaces.desktop.score, surfaces.mobile.score);
const allJudges = [...surfaces.desktop.judges, ...surfaces.mobile.judges];
const allGatesPass = surfaces.desktop.allGatesPass && surfaces.mobile.allGatesPass;
const result = {
  schemaVersion: 2,
  runId: run.runId,
  target: run.target,
  rubricSha256: run.rubricSha256,
  candidateSha256: run.candidate.sha256,
  evidenceManifestSha256: run.evidenceManifestSha256,
  evidenceReady,
  confidenceReady,
  blockers: [
    ...requiredEvidence.filter((item) => item?.status !== "pass").map((item) => `${item.id}: ${item?.status ?? "missing"}`),
    ...submissions.filter((submission) => submission.confidence === "low").map((submission) => `${submission.judgeId}: low confidence`),
  ],
  siteScore,
  awardBand: awardBand(siteScore, allJudges.map((item) => item.score), allGatesPass, rubric),
  allGatesPass,
  surfaces
};

await fs.writeFile(path.join(absoluteRunDirectory, "award-panel-result.json"), `${JSON.stringify(result, null, 2)}\n`);
const report = [
  `# Blind award-panel result`,
  ``,
  `**Run:** ${result.runId}  `,
  `**Target:** ${result.target}  `,
  `**Rubric SHA-256:** \`${result.rubricSha256}\`  `,
  `**Candidate SHA-256:** \`${result.candidateSha256}\`  `,
  `**Evidence manifest SHA-256:** \`${result.evidenceManifestSha256}\`  `,
  `**Verdict:** ${result.awardBand.label}  `,
  `**Site score:** ${result.siteScore.toFixed(1)} / 10`,
  `**Frozen evidence complete:** ${result.evidenceReady ? "yes" : "no"}  `,
  `**Judge confidence sufficient:** ${result.confidenceReady ? "yes" : "no"}`,
  ...(result.blockers.length ? [``, `**Blocking evidence:** ${result.blockers.join("; ")}`] : []),
  ``,
  `The site score is the lower of the independently aggregated desktop and mobile scores.`,
  ``,
  `| Surface | Score | Band | All hard gates passed |`,
  `|---|---:|---|---|`,
  ...Object.entries(result.surfaces).map(([surface, value]) => `| ${surface} | ${value.score.toFixed(1)} | ${value.awardBand.label} | ${value.allGatesPass ? "yes" : "no"} |`),
  ``,
  `## Hard gates`,
  ``,
  `| Gate | Desktop | Mobile |`,
  `|---|---|---|`,
  ...rubric.hardGates.map((gate) => {
    const desktop = result.surfaces.desktop.gates.find((candidate) => candidate.id === gate.id).status;
    const mobile = result.surfaces.mobile.gates.find((candidate) => candidate.id === gate.id).status;
    return `| ${gate.id} | ${desktop} | ${mobile} |`;
  }),
  ``,
  `## Judges`,
  ``,
  `| Judge | Surface | Score | Confidence |`,
  `|---|---|---:|---|`,
  ...allJudges.map((judge) => {
    const surface = rubric.judges.find((candidate) => candidate.id === judge.judgeId).surface;
    return `| ${judge.judgeId} | ${surface} | ${judge.score.toFixed(1)} | ${judge.confidence} |`;
  }),
  ``,
  `## Independent summaries`,
  ``,
  ...allJudges.flatMap((judge) => [`### ${judge.judgeId}`, ``, judge.summary, ``])
].join("\n");
await fs.writeFile(path.join(absoluteRunDirectory, "award-panel-result.md"), `${report}\n`);
console.log(`award panel result: ${result.awardBand.label}, site ${siteScore}, desktop ${surfaces.desktop.score}, mobile ${surfaces.mobile.score}`);
