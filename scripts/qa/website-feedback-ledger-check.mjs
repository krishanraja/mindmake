import fs from "node:fs/promises";

const ledgerPath = new URL("../../project-documentation/website-redesign/feedback-ledger.json", import.meta.url);
const ledger = JSON.parse(await fs.readFile(ledgerPath, "utf8"));
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const required = ["id", "exactFeedback", "source", "surface", "section", "device", "element", "classification", "requiredOutcome", "acceptanceTest", "status", "resolution", "evidence"];
const statuses = new Set(["open", "implemented-awaiting-review", "verified", "accepted", "superseded"]);
const classifications = new Set(["correction", "constraint", "preference"]);
const ids = new Set();

fail(ledger.ledgerVersion !== 1, "ledgerVersion must be 1");
fail(ledger.rules?.submissionIsApproval !== false, "submission must not equal approval");
fail(ledger.rules?.verbatimFeedbackRequired !== true, "verbatim feedback must be required");
fail(ledger.rules?.acceptanceEvidenceRequired !== true, "acceptance evidence must be required");
fail(!Array.isArray(ledger.items) || ledger.items.length === 0, "ledger must contain feedback items");

for (const [index, item] of (ledger.items || []).entries()) {
  for (const field of required) fail(!(field in item), `item ${index + 1} is missing ${field}`);
  fail(ids.has(item.id), `duplicate id ${item.id}`);
  ids.add(item.id);
  fail(typeof item.exactFeedback !== "string" || !item.exactFeedback.trim(), `${item.id}: exactFeedback is empty`);
  fail(!statuses.has(item.status), `${item.id}: invalid status ${item.status}`);
  fail(!classifications.has(item.classification), `${item.id}: invalid classification ${item.classification}`);
  fail(typeof item.requiredOutcome !== "string" || !item.requiredOutcome.trim(), `${item.id}: requiredOutcome is empty`);
  fail(typeof item.acceptanceTest !== "string" || !item.acceptanceTest.trim(), `${item.id}: acceptanceTest is empty`);
  fail(typeof item.resolution !== "string" || !item.resolution.trim(), `${item.id}: resolution is empty`);
  fail(!Array.isArray(item.evidence), `${item.id}: evidence must be an array`);
  if (["implemented-awaiting-review", "verified", "accepted"].includes(item.status)) {
    fail(item.evidence.length === 0 || item.evidence.some((entry) => typeof entry !== "string" || !entry.trim()), `${item.id}: implemented or resolved item lacks evidence`);
  }
}

const blocking = ledger.items.filter((item) => ledger.rules.approvalBlockedByStatuses.includes(item.status)).map((item) => item.id);
console.log(JSON.stringify({
  ledger: "project-documentation/website-redesign/feedback-ledger.json",
  items: ledger.items.length,
  blocking,
  failures
}, null, 2));
if (failures.length) process.exitCode = 1;
