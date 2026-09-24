import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const manifestPath = resolve(root, "quality/website-redesign/homepage-selection.manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const failures = [];

for (const component of manifest.components) {
  for (const [pathKey, hashKey] of [["source", "sourceSha256"], ["style", "styleSha256"]]) {
    const bytes = await readFile(resolve(root, component[pathKey]));
    const actual = createHash("sha256").update(bytes).digest("hex");
    if (actual !== component[hashKey]) failures.push(`${component.id}: ${pathKey} changed (${actual})`);
  }
}

const html = await readFile(resolve(root, manifest.assembly, "index.html"), "utf8");
const script = await readFile(resolve(root, manifest.assembly, "script.js"), "utf8");
for (const component of manifest.components) {
  if (!html.includes(`data-component="${component.id}"`)) failures.push(`${component.id}: integrated root missing`);
  for (const [key, value] of Object.entries(component.selection)) {
    if (!script.includes(`${key}: "${value}"`) && !script.includes(`${key}:"${value}"`)) failures.push(`${component.id}: selection ${key}=${value} missing from assembler`);
  }
}

const copyLocks = [
  "Build the business that can think with you.",
  "Part people. Part agent. Led by judgement.",
  "Build your AI native pricing, positioning and org.",
  "You are not the first person to wonder what a new tool might take from you.",
  "The feeling is familiar. The reach is new.",
  "The organisation changes shape.",
  "The system does not replace your judgement. It brings more to it.",
  "Make your judgement reusable.",
  "We turn an AI market shift into one tested commercial move.",
  "Keep your edge as AI changes the market."
];
for (const text of copyLocks) if (!script.includes(text)) failures.push(`copy lock missing: ${text}`);

if (failures.length) {
  console.error(`Homepage synthesis parity failed (${failures.length})\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
  process.exit(1);
}
console.log(`Homepage synthesis parity passed: ${manifest.components.length} source components, ${copyLocks.length} copy locks.`);
