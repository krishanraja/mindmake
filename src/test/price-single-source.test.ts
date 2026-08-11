/**
 * Fails if a price string appears anywhere outside src/lib/offers.ts.
 *
 * The old offers.ts carried a comment calling itself the single source of
 * truth. It was not: the same prices were also typed by hand into both offer
 * pages, six places in the prerender script, and llms.txt. A reprice meant
 * chasing nine files, and the crawler copy silently kept the old number.
 *
 * The search terms are DERIVED from offers.ts at runtime rather than written
 * down here, so the test cannot drift from the data. Add a price and it is
 * guarded on the same commit. It also means this file states no price of its
 * own, which is why it can scan itself.
 *
 * SCOPE. src/, public/, scripts/ and index.html: everywhere that can reach
 * offers.ts, directly or through the build.
 *
 * Out of scope, each for a reason:
 *   supabase/       Deno, deployed separately, and Mindy legitimately restates
 *                   prices in prose for the model to read. Gated instead by
 *                   mindy-knowledge.test.ts, which asserts the reverse: every
 *                   price Mindy states must exist in offers.ts.
 *   scripts/qa/     A verification harness that never ships. Its whole job is
 *                   to assert the rendered page shows an exact string, so
 *                   hard-coded expectations are the point. Deriving them from
 *                   offers.ts would make it assert that offers.ts equals
 *                   itself.
 *   public/llms.txt Generated, and correctly full of prices. Checked below by
 *                   a stronger rule than absence: every price in it must be a
 *                   current one.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, extname, relative } from "path";
import {
  CURRENCIES,
  DEFAULT_CURRENCY,
  HANDOVER,
  TEARDOWN,
  allPriceDisplays,
  displayPrice,
} from "@/lib/offers";

const ROOT = resolve(__dirname, "../..");

const SCAN_DIRS = ["src", "public", "scripts"];
const SCAN_FILES = ["index.html"];
const SCAN_EXT = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
  ".html", ".txt", ".json", ".css", ".md",
]);
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", "assets", "qa"]);

const GENERATED_LLMS = "public/llms.txt";

/**
 * Every entry needs a reason, and adding one should feel like a decision.
 *
 * Deliberately NOT here: scripts/prerender.mjs and scripts/generate-llms.mjs,
 * which interpolate from offers.ts. If someone retypes a price in either, this
 * test fails, which is the mechanism working rather than an oversight.
 */
const ALLOWLIST: ReadonlyArray<{ file: string; reason: string }> = [
  { file: "src/lib/offers.ts", reason: "The single source of truth. This is the point." },
  { file: GENERATED_LLMS, reason: "Generated. Checked for staleness instead of absence." },
];

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (SCAN_EXT.has(extname(full))) out.push(full);
  }
  return out;
}

const files = [
  ...SCAN_DIRS.flatMap((d) => walk(resolve(ROOT, d))),
  ...SCAN_FILES.map((f) => resolve(ROOT, f)),
];

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Strips the leading currency symbol, leaving the comma-grouped digits. */
const digitsOf = (display: string) => display.replace(/^\D+/, "");

/**
 * Layer 1: the exact display literal.
 *
 * The currency symbol bounds the left side on its own, so a longer number
 * beginning with the same digits cannot match. The trailing lookahead rejects
 * a thousands group continuing (a millions figure) or a decimal part, while
 * still allowing "at <price>, ten days" where the comma is punctuation
 * followed by a space.
 */
const literalRe = (display: string) => new RegExp(escapeRe(display) + "(?![,.]?\\d)", "g");

/**
 * Layer 2: the bare comma-grouped digits, so a symbol split away from its
 * number, or written as an HTML entity, cannot slip past. The lookbehind
 * stops a longer number ending in the same group from matching.
 *
 * There is deliberately NO layer on bare unformatted integers. Exactly one
 * such number occurs in scope and it is a setTimeout duration, so that layer
 * would buy nothing and cost a permanent allowlist entry on real code.
 */
const groupRe = (digits: string) =>
  new RegExp("(?<![\\d,])" + escapeRe(digits) + "(?![,.]?\\d)", "g");

interface Violation {
  file: string;
  line: number;
  match: string;
}

function scan(relPath: string, source: string): Violation[] {
  if (ALLOWLIST.some((a) => a.file === relPath)) return [];
  const seen = new Set<string>();
  const out: Violation[] = [];
  const lines = source.split("\n");

  for (const display of allPriceDisplays()) {
    // Both layers target the same string, so a plain "$1,234" trips each of
    // them. Dedupe per file, line and price, or every leak is reported twice.
    for (const re of [literalRe(display), groupRe(digitsOf(display))]) {
      lines.forEach((line, i) => {
        re.lastIndex = 0;
        if (!re.test(line)) return;
        const key = `${relPath}:${i + 1}:${display}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push({ file: relPath, line: i + 1, match: display });
      });
    }
  }
  return out;
}

function report(violations: Violation[]): string {
  if (violations.length === 0) return "";
  const rows = violations.map((v) => `  ${v.file}:${v.line}  ${v.match}`).join("\n");
  return (
    `price literal leaked outside src/lib/offers.ts:\n${rows}\n` +
    "Import from @/lib/offers, or ../src/lib/offers.ts in a build script."
  );
}

describe("prices live in exactly one place", () => {
  it("is actually scanning the files that render prices", () => {
    // Guards against the glob silently narrowing, which would make every
    // other assertion in this file pass for the wrong reason.
    expect(allPriceDisplays().length).toBe(12);
    expect(new Set(allPriceDisplays()).size).toBe(12);

    const rel = files.map((f) => relative(ROOT, f));
    for (const must of [
      "src/pages/Teardown.tsx",
      "src/pages/Handover.tsx",
      "scripts/prerender.mjs",
      "scripts/generate-llms.mjs",
      "index.html",
    ]) {
      expect(rel, `${must} must be in scope`).toContain(must);
    }
    expect(files.length).toBeGreaterThan(100);
  });

  it("detects a leak when there is one (positive control)", () => {
    const aud = displayPrice(TEARDOWN, "AUD");
    const usd = displayPrice(HANDOVER, "USD", "250-5000");

    expect(scan("some/file.tsx", `<span>${usd}</span>`)).toHaveLength(1);
    expect(scan("some/file.tsx", `the price is ${aud}, fixed`)).toHaveLength(1);
    // Symbol split away from the digits.
    expect(scan("some/file.tsx", `<span>$</span>${digitsOf(aud)}`)).toHaveLength(1);
    // Every currency is covered, not just the default.
    for (const c of CURRENCIES) {
      expect(scan("some/file.tsx", displayPrice(HANDOVER, c, "under-100"))).toHaveLength(1);
    }
  });

  it("does not fire on headcounts, proof points or timeouts (negative control)", () => {
    const cases = [
      "250 to 5,000 people, sweet spot 100 to 1,000",
      "Companies of 50 to 5,000 people",
      "a $254K POC contracted with a major US publisher",
      "an $80,000 saving and a $250K budget defended",
      "setTimeout(fn, 30000)",
      "grew revenue from $9M to $61M in three years",
      // A price-shaped number that is an order of magnitude larger.
      `a ${displayPrice(TEARDOWN, "AUD")},000 raise`,
    ];
    for (const text of cases) {
      expect(scan("some/file.tsx", text), `should not fire on: ${text}`).toEqual([]);
    }
  });

  it("has not quietly allowlisted the surfaces that render prices", () => {
    expect(ALLOWLIST.map((a) => a.file)).toEqual(["src/lib/offers.ts", GENERATED_LLMS]);
    for (const entry of ALLOWLIST) expect(entry.reason.length).toBeGreaterThan(20);
  });

  it("finds no price string outside src/lib/offers.ts", () => {
    const violations = files.flatMap((file) =>
      scan(relative(ROOT, file), readFileSync(file, "utf-8")),
    );
    expect(violations, report(violations)).toEqual([]);
  });
});

describe("the generated llms.txt is not stale", () => {
  const llms = readFileSync(resolve(ROOT, ROOT, GENERATED_LLMS), "utf-8");

  it("states every current default-currency price", () => {
    const expected = [
      displayPrice(TEARDOWN, DEFAULT_CURRENCY),
      ...HANDOVER.tiers.map((t) => displayPrice(HANDOVER, DEFAULT_CURRENCY, t.id)),
    ];
    for (const price of expected) {
      expect(llms.includes(price), `llms.txt is missing ${price}. Run: node scripts/generate-llms.mjs`).toBe(true);
    }
  });

  it("contains no price that is not a current one", () => {
    // The real risk for a generated-but-committed file is staleness: a price
    // that was current when it was last generated and is not any more.
    const current = new Set<string>(allPriceDisplays());
    const found = llms.match(/[$£][\d,]+(?:\.\d+)?/g) ?? [];
    const stale = [...new Set(found)].filter((f) => !current.has(f));
    expect(stale, "stale price in llms.txt. Run: node scripts/generate-llms.mjs").toEqual([]);
  });

  it("publishes only the default currency", () => {
    // Three ladders would read to a crawler as three different offers.
    expect(llms.includes("£"), "llms.txt must publish the default currency only").toBe(false);
  });
});

describe("no currency conversion logic exists", () => {
  it("finds no FX lookup anywhere, including the edge functions", () => {
    // Prices are set per market. A converter would make a published price a
    // function of the morning's spot rate, and would silently change a number
    // a client is holding a proposal for.
    const FX_BAN =
      /exchangerate|exchange-rate|convertCurrency|currencyRate|ratesApi|openexchangerates|fixer\.io|frankfurter/i;

    const scanned = [...files, ...walk(resolve(ROOT, "supabase/functions"))];
    const offenders = scanned
      .filter((f) => relative(ROOT, f) !== relative(ROOT, __filename))
      .filter((f) => FX_BAN.test(readFileSync(f, "utf-8")))
      .map((f) => relative(ROOT, f));

    expect(offenders, "currency conversion is banned; prices are set per market").toEqual([]);
  });
});
