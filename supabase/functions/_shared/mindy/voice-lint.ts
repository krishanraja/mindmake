/**
 * Mindy runtime voice gate.
 *
 * A dependency-free, fast post-generation lint pass that guarantees every Mindy
 * output (and every generated proposal section) clears Krish's hard voice rules
 * before it reaches a visitor. Mirrors the machine-readable arrays in
 * project-documentation/mindy/voice-lint.md. The doc is the source of truth; if
 * the two drift, update the doc first, then sync these arrays.
 *
 * Hard fails (lintVoice -> ok=false): em dash (U+2014), spaced double-hyphen used
 * as an em dash, an en dash (U+2013) standing in for a dash BETWEEN LETTERS,
 * any banned token, any banned phrase, more than one exclamation mark.
 *
 * Soft signal (softLintScore): presence of on-brand USE-list vocabulary. Never
 * blocks; it is a 0..1 hint that the copy reads like the operator, not the model.
 */

/**
 * NEVER list, banned tokens (hard fail). Matched case-insensitively on word
 * boundaries. Lifted verbatim from voice-lint.md section 1a.
 *
 * Note on `leverage`: it is banned only as a verb, so it is NOT in this flat
 * list. lintVoice() handles it separately with a verb-only heuristic.
 */
export const BANNED_TOKENS: string[] = [
  'transformation',
  'transformational',
  'synergy',
  'synergies',
  'ecosystem',
  'journey',
  'unlock',
  'unlocks',
  'unlocking',
  'seamless',
  'seamlessly',
  'empower',
  'empowers',
  'empowering',
  'empowerment',
  'game-changer',
  'game changer',
  'game-changing',
  'cutting-edge',
  'cutting edge',
  'revolutionary',
  'revolutionize',
  'innovative',
  'next-generation',
  'next generation',
  'paradigm',
  'holistic',
  'optimize',
  'optimise',
  'optimization',
  'optimisation',
  'enhance',
  'enhances',
  'enhancing',
  'enhancement',
  'maximize',
  'maximise',
  'maximizing',
  'fractional',
  'digital transformation',
  'thought leadership',
  'best-in-class',
  'world-class',
  'state-of-the-art',
  'supercharge',
  'turbocharge',
  'elevate',
  'elevates',
  'delve',
  'tapestry',
  'robust',
  'bespoke solutions',
  'end-to-end solution',
];

/**
 * NEVER list, banned phrases (hard fail). Matched case-insensitively as a
 * substring. Lifted verbatim from voice-lint.md section 1b.
 */
export const BANNED_PHRASES: string[] = [
  "I'm so excited",
  'I am so excited',
  "we're so excited",
  'we are so excited',
  'thrilled to',
  'happy to hop on a quick call',
  'hop on a quick call',
  'let me know what you think',
  'let me know your thoughts',
  'looking forward to hearing from you',
  'it depends on the context',
  'at the end of the day',
  "in today's fast-paced world",
  'in conclusion',
  'in summary',
  'to sum up',
  'we help you',
  'we help businesses',
  'in this day and age',
  'needle in a haystack',
  'low-hanging fruit',
  'circle back',
  'touch base',
  'move the needle',
  'boil the ocean',
  'limited spots',
  'limited seats',
  'act now',
  "don't miss out",
  'last chance',
  'guaranteed results',
  'guaranteed ROI',
  'proven ROI',
];

/**
 * USE list, on-brand vocabulary (soft signal). A passing output naturally hits
 * several of these. From voice-lint.md section 1d. Lower-cased here for fast,
 * allocation-light matching in softLintScore().
 */
export const USE_VOCABULARY: string[] = [
  'decision',
  'decide',
  'ship',
  'build',
  'built',
  'run',
  'ran',
  'govern',
  'operator',
  'the field',
  'from the field',
  'in production',
  'on my own p&l',
  'trade-off',
  'the real question underneath',
  'the honest framing',
  'redeploy',
  'find the brick',
  'foundations',
  'single source of truth',
  'context layer',
  'the moat',
  'compounds',
  'compounding',
  'audit layer',
  'board-ready',
  'the call',
  'the fork',
  'the nervous decision',
  'scar tissue',
  'the scar',
  'the management layer',
  'the management apparatus',
  'fleet',
  'the brick',
  'leverage audit',
  'next 14 days',
  'monday',
  // The judgment-economy register: execution is free, judgment is the moat.
  // Additive soft signal only - rewards on-direction copy, never blocks.
  'judgment',
  'taste',
  'the say-do gap',
  'non-linear',
  'coordination',
  'verification',
  'credibility',
  'monetize your judgment',
  'the easy button',
  'owns the context',
  'good enough',
  'expertise',
];

const EM_DASH = '—';
const EN_DASH = '–';

/**
 * Spaced double-hyphen used as an em dash, e.g. "the model -- the cheap part".
 */
const SPACED_DOUBLE_HYPHEN = /\s--\s/;

/**
 * En dash standing in for a dash BETWEEN LETTERS, e.g. "operator–model".
 * Numeric ranges are explicitly whitelisted: 60–100, $2,000–$3,000,
 * $50,000–$100,000 all PASS because at least one side is a digit, so this
 * only fires when a letter sits on BOTH sides of the en dash.
 */
const EN_DASH_BETWEEN_LETTERS = new RegExp(`[A-Za-z]${EN_DASH}[A-Za-z]`);

/**
 * Escapes a literal string for safe interpolation into a RegExp.
 */
function escapeRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Builds a case-insensitive, word-boundary matcher for a banned token. Because
 * many tokens contain hyphens or spaces (e.g. "game-changer", "cutting edge"),
 * a plain \b on both ends is too strict, so we anchor on a non-word boundary or
 * string edge instead. This keeps "innovate"-style internal substrings from
 * over-matching while still catching multi-word tokens.
 */
function bannedTokenMatcher(token: string): RegExp {
  const escaped = escapeRegExp(token);
  return new RegExp(`(?<![A-Za-z0-9])${escaped}(?![A-Za-z0-9])`, 'i');
}

// Precompile once at module load so per-call linting stays fast.
const BANNED_TOKEN_MATCHERS: Array<{ token: string; re: RegExp }> = BANNED_TOKENS.map(
  (token) => ({ token, re: bannedTokenMatcher(token) }),
);

/**
 * Detects `leverage` used as a verb (banned), while letting the noun pass.
 * Heuristic from voice-lint.md: flag when preceded by "to" ("to leverage AI"),
 * or when the verb form is immediately followed by an object noun phrase
 * ("leverage AI to..."). The noun reading is signalled by a following copula or
 * auxiliary ("the leverage IS in...", "the leverage WAS real"), which the
 * negative lookahead below excludes so the noun passes. Conservative otherwise:
 * when ambiguous it flags, deferring to human review rather than auto-passing.
 */
const LEVERAGE_AS_VERB = new RegExp(
  // "to leverage ..." is always the verb.
  '\\bto\\s+leverage\\b' +
    '|' +
    // "leverage <object>" where the next word is not a copula/auxiliary
    // (is/are/was/were/will/would/can/could/should/has/have/had/...), which
    // would mark `leverage` as the subject noun instead.
    '\\bleverag(?:e|es|ing)\\s+' +
    '(?!(?:is|are|was|were|be|been|being|will|would|can|could|should|shall|may|might|must|has|have|had|does|do|did)\\b)' +
    '(?:the\\s+|your\\s+|our\\s+|their\\s+|its\\s+|a\\s+|an\\s+)?[A-Za-z]',
  'i',
);

/**
 * Runtime voice gate. Returns ok=false with the specific violations found.
 *
 * @param text - the candidate output (a Mindy reply or a proposal section).
 * @returns { ok, violations } where each violation is a short label, e.g.
 *          "em dash", "banned token: unlock", "banned phrase: act now",
 *          "leverage used as a verb", "more than one exclamation mark".
 */
export function lintVoice(text: string): { ok: boolean; violations: string[] } {
  const violations: string[] = [];

  if (typeof text !== 'string' || text.length === 0) {
    return { ok: true, violations };
  }

  // 1. Em dash, the single most important catch.
  if (text.includes(EM_DASH)) {
    violations.push('em dash');
  }

  // 2. Spaced double-hyphen used as an em dash.
  if (SPACED_DOUBLE_HYPHEN.test(text)) {
    violations.push("spaced double-hyphen ( -- )");
  }

  // 3. En dash between letters only. Numeric ranges pass.
  if (EN_DASH_BETWEEN_LETTERS.test(text)) {
    violations.push('en dash between letters');
  }

  // 4. Banned tokens, case-insensitive, word boundary.
  for (const { token, re } of BANNED_TOKEN_MATCHERS) {
    if (re.test(text)) {
      violations.push(`banned token: ${token}`);
    }
  }

  // 4b. `leverage` as a verb (the noun is on-brand and allowed).
  if (LEVERAGE_AS_VERB.test(text)) {
    violations.push('leverage used as a verb');
  }

  // 5. Banned phrases, case-insensitive substring.
  const lower = text.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase.toLowerCase())) {
      violations.push(`banned phrase: ${phrase}`);
    }
  }

  // 6. More than one exclamation mark.
  const exclamations = (text.match(/!/g) ?? []).length;
  if (exclamations > 1) {
    violations.push('more than one exclamation mark');
  }

  return { ok: violations.length === 0, violations };
}

/**
 * Optional 0..1 signal of how on-voice the copy reads, based on how much of the
 * USE-list vocabulary it touches. Non-blocking. A short factual answer can score
 * low and still be fine; this is only a redraft hint for longer outputs.
 *
 * Scoring is saturating: it rewards hitting several distinct on-brand markers
 * and caps out so a single stuffed word cannot game it. Roughly, hitting 6+
 * distinct USE-list entries returns ~1.0.
 *
 * @param text - the candidate output.
 * @returns a number in [0, 1].
 */
export function softLintScore(text: string): number {
  if (typeof text !== 'string' || text.trim().length === 0) {
    return 0;
  }

  const lower = text.toLowerCase();
  let hits = 0;
  for (const term of USE_VOCABULARY) {
    if (lower.includes(term)) {
      hits += 1;
    }
  }

  // Saturate at 6 distinct hits -> 1.0. Keeps the signal honest and bounded.
  const SATURATION = 6;
  const score = Math.min(hits, SATURATION) / SATURATION;
  // Round to 3 dp for stable, readable values.
  return Math.round(score * 1000) / 1000;
}
