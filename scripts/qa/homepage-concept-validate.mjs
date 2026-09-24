import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const project = path.join(root, "project-documentation", "homepage-redesign");

async function readJson(file) {
  return JSON.parse(await fs.readFile(file, "utf8"));
}

function validateFile(validate, value, label) {
  if (!validate(value)) {
    const errors = validate.errors?.map((error) => `${error.instancePath || "/"} ${error.message}`).join("; ");
    throw new Error(`${label} failed schema validation: ${errors}`);
  }
}

const ajv = new Ajv2020({ allErrors: true, strict: true, multipleOfPrecision: 2 });
const candidateSchema = await readJson(path.join(project, "concept.schema.json"));
const judgeSchema = await readJson(path.join(project, "concept-judge.schema.json"));
const validateCandidate = ajv.compile(candidateSchema);
const validateJudge = ajv.compile(judgeSchema);

async function validateRound(candidateNames, candidatesDirectory, verdictsDirectory, required) {
  try {
    await fs.access(candidatesDirectory);
  } catch (error) {
    if (!required && error.code === "ENOENT") return { candidates: 0, verdicts: 0 };
    throw error;
  }

  for (const candidateName of candidateNames) {
    const candidate = await readJson(path.join(candidatesDirectory, `${candidateName}.json`));
    validateFile(validateCandidate, candidate, candidateName);
    if (candidate.candidateId !== candidateName) throw new Error(`${candidateName} reports candidateId ${candidate.candidateId}`);
  }

  let verdictCount = 0;
  try {
    const verdictNames = (await fs.readdir(verdictsDirectory)).filter((name) => name.endsWith(".json")).sort();
    for (const verdictName of verdictNames) {
      const verdict = await readJson(path.join(verdictsDirectory, verdictName));
      validateFile(validateJudge, verdict, verdictName);
      if (verdict.winner === verdict.runnerUp) throw new Error(`${verdictName} has the same winner and runner-up`);
      const ids = verdict.candidateVerdicts.map((item) => item.candidateId).sort();
      if (JSON.stringify(ids) !== JSON.stringify(candidateNames)) throw new Error(`${verdictName} must judge every candidate exactly once`);
      const order = [...verdict.candidateOrder].sort();
      if (JSON.stringify(order) !== JSON.stringify(candidateNames)) throw new Error(`${verdictName} has a candidate order from another round`);
      const pairs = verdict.diversity.pairs.map((item) => item.pair).sort();
      const expectedPairs = [
        `${candidateNames[0]}:${candidateNames[1]}`,
        `${candidateNames[0]}:${candidateNames[2]}`,
        `${candidateNames[1]}:${candidateNames[2]}`
      ];
      if (JSON.stringify(pairs) !== JSON.stringify(expectedPairs)) throw new Error(`${verdictName} must contain all three pairwise comparisons`);
      verdictCount += 1;
    }
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  return { candidates: candidateNames.length, verdicts: verdictCount };
}

const roundOne = await validateRound(
  ["candidate_a", "candidate_b", "candidate_c"],
  path.join(project, "candidates"),
  path.join(project, "verdicts"),
  true
);
const roundTwo = await validateRound(
  ["candidate_d", "candidate_e", "candidate_f"],
  path.join(project, "candidates-round2"),
  path.join(project, "verdicts-round2"),
  false
);

console.log(`homepage concepts valid: ${roundOne.candidates + roundTwo.candidates} candidates, ${roundOne.verdicts + roundTwo.verdicts} verdicts`);
