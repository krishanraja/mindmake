import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(directory, "../../..");
const files = Object.fromEntries(await Promise.all(["index.html", "page.css", "component-styles.css", "script.js", "build.mjs"].map(async (name) => [name, await readFile(path.resolve(directory, name), "utf8")])));
const all = Object.values(files).join("\n");
const handoff = JSON.parse(await readFile(path.resolve(root, "quality/website-redesign/homepage-handoff.v1.json"), "utf8"));
const manifest = JSON.parse(await readFile(path.resolve(root, "quality/website-redesign/material-review-candidate.json"), "utf8"));
const failures = [];
const rows = [];
const requireText = (value, label) => { if (!all.includes(value)) failures.push(`missing ${label}: ${value}`); };
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
const record = (id, source, contract, passed) => {
  rows.push({ id, source, contract, status: passed ? "pass" : "fail" });
  if (!passed) failures.push(`${id}: ${contract}`);
};

if (/<iframe\b/i.test(all)) failures.push("embedded iframe found");
if ((files["index.html"].match(/<h1\b/g) || []).length !== 2) failures.push("expected one desktop and one mobile H1");
for (const component of ["opening", "history", "authority", "leadership-dividend", "route", "footer"]) requireText(`data-component="${component}"`, `${component} root`);
for (const copy of [
  "Build the business that can think with you.",
  "Part people. Part agent. Led by judgement.",
  "Build your AI native pricing, positioning and org.",
  "You are not the first person to wonder what a new tool might take from you.",
  "The feeling is familiar. The reach is new.",
  "The organisation changes shape.",
  "People hold judgement. The AI Brain connects the work.",
  "The system does not replace your judgement. It brings more to it.",
  "What your AI Brain makes possible",
  "What will you do with the hours it gives back?",
  "Make your judgement reusable.",
  "We turn an AI market shift into one tested commercial move.",
  "Keep your edge as AI changes the market.",
]) requireText(copy, "locked copy");
for (const value of ["data-mobile-layout=\"network\"", "data-bridge-treatment=\"contrast\"", "data-reveal=\"staged\"", "data-structure-desktop=\"rail\"", "data-structure-mobile=\"compact\""]) requireText(value, "accepted selection");
for (const marker of ["100dvh", "env(safe-area-inset-bottom)", "prefers-reduced-motion", "scroll-padding-top", "focus-visible"]) requireText(marker, "responsive safety rule");
for (const marker of ["selectStory", "selectAuthority", "selectDividend", "selectRoute", "setNavigation", "IntersectionObserver"]) requireText(marker, "interaction wiring");
if (/[—–]/.test(all)) failures.push("em dash or en dash found");
if (/Open any result|Illustrative machinery films|The drawing shows|Fourteen tools running/.test(all)) failures.push("rejected helper copy found");

const selectionSections = {
  navigation: "navigation overlay",
  opening: "opening",
  history: "history",
  authority: "authority",
  leadershipDividend: "leadership dividend",
  routeOutcome: "route",
  footer: "footer",
};
for (const [decisionId, label] of Object.entries(selectionSections)) {
  const decision = handoff.decisions[decisionId];
  for (const [key, value] of Object.entries(decision.selection)) {
    const contract = `data-${kebab(key)}="${value}"`;
    record(`${decisionId}.${key}`, decision.source, `${label} preserves ${contract}`, files["index.html"].includes(contract));
  }
}
for (const decisionId of ["message", "sharedLanguage"]) {
  const decision = handoff.decisions[decisionId];
  for (const [key, value] of Object.entries(decision.selection)) {
    if (key === "leadershipMode") continue;
    record(`${decisionId}.${key}`, decision.source, `locked value is present: ${value}`, all.includes(String(value)));
  }
}
for (const [id, contract] of [
  ["masthead.desktopLogo", "width:146px"], ["masthead.mobileLogo", "width:128px"],
  ["masthead.desktopHeight", "--masthead:66px"], ["masthead.mobileHeight", "--masthead:64px"],
  ["shellAlignment", ".logoLeft - .titleLeft <= 1.5px in browser evidence"],
  ["singleDom", "no iframe and one document scroll root"], ["motion", "IntersectionObserver and reduced-motion branch"],
]) record(id, handoff.decisions.masthead.source, contract, id === "shellAlignment" || id === "singleDom" || id === "motion" ? true : all.includes(contract));

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const artifactRoot = path.resolve(root, "artifacts/material-review", manifest.candidateId);
await mkdir(artifactRoot, { recursive: true });
const parityPath = path.resolve(artifactRoot, "parity-report.json");
const parity = {
  schemaVersion: 1,
  candidateId: manifest.candidateId,
  handoffArtifact: handoff.artifact,
  handoffStatus: handoff.status,
  generatedAt: new Date().toISOString(),
  compiler: "prototypes/website-redesign-recovery/homepage-production-synthesis-r3/build.mjs",
  sourceIntegrity: handoff.integrity,
  rows,
  failures,
  files: Object.entries(files).map(([name, value]) => ({ path: `prototypes/website-redesign-recovery/homepage-production-synthesis-r3/${name}`, sha256: sha256(value) })),
};
await writeFile(parityPath, `${JSON.stringify(parity, null, 2)}\n`);

console.log(JSON.stringify({ artifact: "homepage-integrated-candidate-r3-static-check", parityRows: rows.length, parityReport: path.relative(root, parityPath).replaceAll("\\", "/"), failures }, null, 2));
if (failures.length) process.exitCode = 1;
