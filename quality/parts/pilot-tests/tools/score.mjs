// Runs the real board-update part on a test draft with a research pack and prints the report.
// Usage: node score.mjs <kits-src> <draft.md> <evidence-dir> <pack.json> <out-dir>
import { pathToFileURL } from 'node:url';
const [src, draft, evidence, pack, out] = process.argv.slice(2);
const m = await import(pathToFileURL(`${src}/kits/fact-check-board-update/run.mjs`).href);
const r = await m.run({ path: draft, evidence_folder: evidence }, out, { path: pack });
console.log(JSON.stringify(r).slice(0, 200));
