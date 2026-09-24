#!/usr/bin/env node
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, relative } from 'node:path';

const root = resolve(import.meta.dirname, '../..');
const read = (path) => readFileSync(resolve(root, path), 'utf8').replace(/\r\n/g, '\n');
const core = ['NOW.md', 'README.md', 'CLAUDE.md', 'AGENTS.md', ...readdirSync(resolve(root, 'project-documentation'))
  .filter((name) => name.endsWith('.md')).map((name) => `project-documentation/${name}`)];
const docs = new Map(core.map((path) => [path, read(path)]));
const failures = [];

export function validateCurrentDocument(path, text) {
  const issues = [];
  const obsolete = [
    /^#{1,4}\s+Historical (?:frontend|visitor|verification|baseline|open-item|background)/mi,
    /^#{1,4}\s+(?:Launch, as it happened|Release, (?:\d+ )?(?:August|September) 2026|Sharpened, 5 September 2026)/mi,
    /latest promotion is the edge rewrite of 5 September/i,
    /single current state route for the unreleased multi-surface redesign/i,
    /never more than a day behind the tree/i,
  ];
  for (const pattern of obsolete) if (pattern.test(text)) issues.push(`superseded current guidance: ${pattern}`);
  if (path.endsWith('06_CURRENT_STATE.md')) {
    for (const requirement of ['## Live release', '## Visitor journey', '## Backend', '## Open work and evidence limits', 'history/LOG.md']) {
      if (!text.includes(requirement)) issues.push(`missing current-state owner: ${requirement}`);
    }
    if (/450 (?:tests|across)|21 indexed routes/.test(text)) issues.push('obsolete release baseline returned');
  }
  return issues;
}

for (const [path, text] of docs) {
  failures.push(...validateCurrentDocument(path, text).map((issue) => `${path}: ${issue}`));
  for (const match of text.matchAll(/\[[^\]\n]+\]\(([^)\n]+)\)/g)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || /^(?:https?:|mailto:|#)/.test(target) || /\s+"/.test(target)) continue;
    const full = resolve(root, dirname(path), decodeURIComponent(target));
    if (!existsSync(full)) failures.push(`${path}: broken local link ${target}`);
  }
}

const history = read('project-documentation/history/LOG.md');
if (!history.includes('2026-09-24')) failures.push('missing consolidation provenance');
const legacy = readdirSync(resolve(root, 'project-documentation/homepage-redesign')).filter((name) => name.endsWith('.md'));
for (const name of legacy) {
  // This is a byte-bound QA artifact, not an active instruction file. Previous
  // immutable manifests require its exact path and bytes; never rewrite it.
  if (name === 'ROUTE-CONTINUITY-R3.md') continue;
  const text = read(`project-documentation/homepage-redesign/${name}`);
  if (text.length > 2200 || !text.includes('history/LOG.md')) failures.push(`${name}: obsolete prose must remain only in the history ledger`);
}
for (const path of ['NOW.md', 'README.md', 'CLAUDE.md', 'project-documentation/README.md']) {
  if (!docs.get(path).includes('06_CURRENT_STATE.md')) failures.push(`${path}: missing current-state owner pointer`);
}

// Negative controls exercise the same validator. A passing report cannot be
// obtained by forgetting to execute these checks or by accepting old baselines.
const currentPath = 'project-documentation/06_CURRENT_STATE.md';
const current = docs.get(currentPath);
const bad = [
  `${current}\n## Historical frontend baseline\nOld release.`,
  `${current}\nThe latest promotion is the edge rewrite of 5 September.`,
  `${current}\n450 tests`,
  current.replace('## Backend', '## Removed backend owner'),
  current.replaceAll('history/LOG.md', 'somewhere-else.md'),
];
let rejected = 0;
for (const candidate of bad) {
  if (validateCurrentDocument(currentPath, candidate).length) rejected += 1;
  else failures.push('documentation negative control was accepted');
}

console.log(JSON.stringify({
  contract: 'current-guidance-single-history', currentDocuments: docs.size,
  historicalLocators: legacy.length - 1, negativeControlsRejected: rejected,
  scope: relative(root, resolve(root, 'project-documentation')),
  limits: 'Checks known regressions, owners and links; does not prove every business fact without source review.',
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
