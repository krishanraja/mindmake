import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import postcss from "postcss";

const root = process.cwd();
const prototypeDir = path.join(root, "prototypes", "website-redesign-recovery", "new-age-leadership");
const output = path.join(root, "src", "styles", "new-age-leadership-r5.css");
const files = [
  "styles.css",
  "styles-s2.css",
  "styles-s3.css",
  "styles-s3-r2.css",
  "styles-s3-r3.css",
  "styles-s3-r4.css",
  "styles-s3-r5.css",
];

const locked = {
  "index-s3-r5.html": "cdf7603e278730dfae162e82fc4433e4a7452d0d4b1e268b2580a079445ac7b1",
  "styles-s3-r5.css": "9164326484d62717ba781edbe7d3fc50dfac35f6739b5bb9aadbf833082bbe34",
  "script-s3-r5.js": "68fa0f838808e6a2efb355e1c5aedc3d81ef726e4a59a41b033d91d7ee5e7e6f",
};

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

for (const [file, expected] of Object.entries(locked)) {
  const value = await readFile(path.join(prototypeDir, file));
  const actual = sha256(value);
  if (actual !== expected) throw new Error(`${file} no longer matches the owner-approved R5 baseline: ${actual}`);
}

const source = (await Promise.all(files.map(async (file) => {
  const css = await readFile(path.join(prototypeDir, file), "utf8");
  return `/* ${file} */\n${css.replace(/^@import[^;]+;\s*/u, "")}`;
}))).join("\n\n");

const ast = postcss.parse(source);
ast.walkAtRules("font-face", (rule) => rule.remove());
ast.walkRules((rule) => {
  if (rule.parent?.type === "atrule" && /keyframes$/u.test(rule.parent.name)) return;
  rule.selectors = rule.selectors.map((selector) => {
    const trimmed = selector.trim();
    if (trimmed === ":root" || trimmed === "html" || trimmed === "body") return ".nal-page";
    if (trimmed.startsWith("html ")) return `.nal-page ${trimmed.slice(5)}`;
    if (trimmed.startsWith("body ")) return `.nal-page ${trimmed.slice(5)}`;
    return trimmed.startsWith(".nal-page") ? trimmed : `.nal-page ${trimmed}`;
  });
});

const banner = `/* Generated from the owner-approved NEW-AGE-LEADERSHIP-R5 prototype.\n * Do not hand-edit. Run npm run build:new-age-r5-styles after an authorised baseline change.\n * The .nal-page scope prevents this material surface from leaking into other routes. */\n`;
const integration = `\n/* Production integration corrections. The application already owns the same\n * local font families, and its reset assigns heading colours directly. */\n.nal-page{--serif:"Newsreader Variable",Newsreader,Georgia,serif;--sans:"Archivo Variable",Archivo,Arial,sans-serif;--mono:"IBM Plex Mono",Plex,"Courier New",monospace}\n.nal-page h1,.nal-page h2,.nal-page h3{color:inherit}\n.nal-page button,.nal-page input[type=range],.nal-page a.hero-action,.nal-page .masthead .brand,.nal-page .reach-copy details a{min-height:44px}\n.nal-page .masthead .brand,.nal-page .reach-copy details a{display:inline-flex;align-items:center}\n@media(max-height:650px) and (max-width:900px) and (orientation:landscape){.nal-page .lens-era-nav{grid-template-columns:repeat(4,44px)}.nal-page .lens-era-nav button{width:44px;min-height:44px}}\n`;
await writeFile(output, `${banner}${ast.toString()}${integration}`, "utf8");
console.log(`wrote ${path.relative(root, output)} from ${files.length} locked layers`);
