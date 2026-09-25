#!/usr/bin/env node
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";

const root = resolve(import.meta.dirname, "../..");
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

const surfaces = [
  /* The GTM surface was retired in r47: /ai-gtm is written by hand on the
     house tokens in src/styles/mindmake-ai-gtm.css, and nothing may generate
     the old sheet back. */
  {
    name: "brain",
    rootClass: "mm-locked-brain",
    output: "src/styles/mindmake-locked-brain.css",
    postlude: `
/* Production-shell wrap guard. The shared fixed shell removes the prototype's
   in-flow header and narrows WebKit and Chromium's tablet text measure enough
   to orphan the final word. The accepted words and composition stay intact. */
.mm-locked-brain { --header-h: 0px; }
@media (min-width: 761px) and (max-width: 900px) and (orientation: portrait) {
  .mm-locked-brain .memory .chapter-copy > h2 { font-size: 2.75rem; }
}
@media (max-width: 760px) and (max-height: 700px) {
  .mm-locked-brain .opening { padding-top: calc(var(--mm-header-height) + 0.5rem); }
}
@media (min-width: 761px) and (max-width: 900px) and (orientation: landscape) {
  .mm-locked-brain .opening { padding-top: var(--mm-header-height); }
}
`,
    replacements: [],
    sources: [
      ["prototypes/website-redesign-recovery/brain-signature/styles-s2.css", "73be37eb68c46dd04e97be877aad5f8a560e870417c25811518699eeae1f5a49"],
      ["prototypes/website-redesign-recovery/brain-signature/styles-s2-lock.css", "4dc5945f4bcd362f6588942566fd072a5489c12028abfdb3af3e7150a50fb490"],
      ["prototypes/website-redesign-recovery/brain-signature/styles-s2-motion.css", "6438fd26ed7feaecf8d52f6db90683f0c310c26b805194741cf4de5129bec282"],
      ["prototypes/website-redesign-recovery/brain-signature/styles-s2-motion-s2.css", "220565263ac081741b0b828f3838aefa3189805530d2f1ccb6df849a310bbe80"],
      ["prototypes/website-redesign-recovery/brain-signature/styles-s2-motion-s3.css", "5e52041a0535f1035f668126a44ff63ce05aa64ccffcc26ef6648793e14d40ac"],
    ],
  },
];

const stateClasses = new Set(["no-js", "is-changing"]);

function scopeSelector(selector, rootClass) {
  return selectorParser((selectors) => {
    selectors.each((candidate) => {
      const first = candidate.at(0);
      const rootNode = () => selectorParser.className({ value: rootClass });

      if (first?.type === "tag" && (first.value === "html" || first.value === "body")) {
        first.replaceWith(rootNode());
        return;
      }
      if (first?.type === "pseudo" && first.value === ":root") {
        first.replaceWith(rootNode());
        return;
      }
      if (first?.type === "class" && stateClasses.has(first.value)) {
        candidate.prepend(rootNode());
        return;
      }
      candidate.prepend(selectorParser.combinator({ value: " " }));
      candidate.prepend(rootNode());
    });
  }).processSync(selector);
}

for (const surface of surfaces) {
  const chunks = [];
  for (const [relativePath, expectedHash] of surface.sources) {
    const content = await readFile(resolve(root, relativePath), "utf8");
    assert.equal(sha256(content), expectedHash, `${surface.name} locked style changed: ${relativePath}`);
    const adapted = surface.replacements.reduce((value, [before, after]) => value.replaceAll(before, after), content);
    chunks.push(`/* source: ${relativePath} sha256=${expectedHash} */\n${adapted}`);
  }

  const stylesheet = postcss.parse(chunks.join("\n"));
  stylesheet.walkAtRules("font-face", (rule) => rule.remove());
  stylesheet.walkRules((rule) => {
    const parentName = rule.parent?.type === "atrule" ? rule.parent.name.toLowerCase() : "";
    if (parentName.endsWith("keyframes")) return;
    rule.selector = scopeSelector(rule.selector, surface.rootClass);
  });

  const banner = `/* Generated from owner-approved locked prototype sources. Run npm run build:locked-surface-styles. */\n`;
  await writeFile(resolve(root, surface.output), `${banner}${stylesheet.toString()}\n${surface.postlude}`, "utf8");
  const output = await readFile(resolve(root, surface.output));
  console.log(`${surface.name}: ${surface.output} sha256=${sha256(output)}`);
}
