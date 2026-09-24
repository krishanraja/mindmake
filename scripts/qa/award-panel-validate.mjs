import { hashRubric, loadRubric, validateRubric } from "./award-panel-lib.mjs";

const rubric = await loadRubric();
const errors = validateRubric(rubric);
if (errors.length) {
  console.error(`award panel invalid:\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`award panel valid: ${rubric.judges.length} judges, ${rubric.hardGates.length} hard gates, rubric sha256 ${hashRubric(rubric)}`);
