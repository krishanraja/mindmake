/**
 * Guards the Diagnosis Room's knowledge layer.
 *
 * Mindy sits behind the primary call to action on every page. In August 2026
 * her knowledge base was still quoting a ladder that had been retired in July:
 * a visitor could read a page selling a Teardown, click the main CTA, and be
 * quoted a Workshop that no longer existed. Nothing failed, nothing alerted,
 * and the only symptom was lost deals.
 *
 * This is the gate that makes that a build failure instead.
 *
 * Two directions:
 *   1. No retired offer name appears anywhere under _shared/mindy/.
 *   2. Every price Mindy states exists in src/lib/offers.ts.
 *
 * Direction 2 is why supabase/ is excluded from price-single-source.test.ts.
 * Mindy legitimately restates prices, in prose, for a model to read. She cannot
 * import offers.ts, because the edge functions are Deno and deploy separately.
 * So rather than banning prices there, this asserts they are the real ones.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, relative } from "path";
import { allPriceDisplays, CURRENCIES, HANDOVER, TEARDOWN, displayPrice } from "@/lib/offers";

const ROOT = resolve(__dirname, "../..");
const MINDY_DIR = resolve(ROOT, "supabase/functions/_shared/mindy");
const PROPOSAL_DIR = resolve(ROOT, "supabase/functions/_shared/proposal");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (full.endsWith(".ts")) out.push(full);
  }
  return out;
}

const mindyFiles = walk(MINDY_DIR);
const read = (f: string) => readFileSync(f, "utf-8");

/**
 * Retired offer names, as a customer would see them written.
 *
 * Case-sensitive and multi-word on purpose. "workshop" in lower case is a real
 * English word that appears in a client's own outcome ("a corporate workshop
 * offer live and priced"), and "bespoke solutions" is an entry in the banned
 * buzzword list that voice-lint exists to catch. Matching those would train
 * everyone to ignore this test.
 */
const RETIRED_NAMES = [
  "Signal Session",
  "Revenue Architecture",
  "AI Immersion",
  "Alumni Pass",
  "AI-Fluent Executive",
  "Lightning Lesson",
  "Bespoke enablement",
  "Mindmaker Workshop",
  "Edge Pro",
];

describe("Mindy's knowledge layer matches the live ladder", () => {
  it("scans the files it thinks it is scanning", () => {
    const names = mindyFiles.map((f) => relative(MINDY_DIR, f)).sort();
    expect(names).toContain("knowledge.ts");
    expect(names).toContain("proof-index.ts");
    expect(mindyFiles.length).toBeGreaterThanOrEqual(3);
  });

  it("names no retired offer", () => {
    const offenders: string[] = [];
    for (const file of mindyFiles) {
      const source = read(file);
      for (const name of RETIRED_NAMES) {
        if (source.includes(name)) offenders.push(`${relative(ROOT, file)}: "${name}"`);
      }
    }
    expect(offenders, "Mindy would quote an offer that no longer exists").toEqual([]);
  });

  it("names no retired offer in the proposal scaffolds either", () => {
    // The proposal is a document a prospect downloads and can forward, so a
    // retired offer name here leaves the building in writing.
    const offenders: string[] = [];
    for (const file of walk(PROPOSAL_DIR)) {
      const source = read(file);
      for (const name of RETIRED_NAMES) {
        if (source.includes(name)) offenders.push(`${relative(ROOT, file)}: "${name}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("states no price that is not in offers.ts", () => {
    const current = new Set<string>(allPriceDisplays());
    const offenders: string[] = [];

    for (const file of mindyFiles) {
      // Match money-shaped strings: a symbol, then comma-grouped thousands.
      // Bare figures like "$254K" or "40%" are proof points, not prices, and
      // are matched by neither this nor the set.
      const found = read(file).match(/[$£][\d]{1,3}(?:,\d{3})+/g) ?? [];
      for (const price of new Set(found)) {
        if (!current.has(price)) offenders.push(`${relative(ROOT, file)}: ${price}`);
      }
    }

    expect(
      offenders,
      "Mindy states a price that does not exist in src/lib/offers.ts. Update the PRICING_CARD.",
    ).toEqual([]);
  });

  it("states every current price, in all three currencies", () => {
    // The reverse of the rule above. Missing GBP would mean Mindy silently
    // answers "how much in pounds" with a dollar figure, which is the exact
    // failure this pass exists to fix.
    const knowledge = read(resolve(MINDY_DIR, "knowledge.ts"));
    const missing: string[] = [];

    for (const currency of CURRENCIES) {
      for (const offer of [HANDOVER, TEARDOWN]) {
        for (const tier of offer.tiers) {
          const price = displayPrice(offer, currency, tier.id);
          if (!knowledge.includes(price)) missing.push(`${offer.name} ${tier.id} ${currency}: ${price}`);
        }
      }
    }

    expect(missing, "Mindy cannot quote a price she does not have").toEqual([]);
  });

  it("still forbids inventing a price, converting one, or discounting", () => {
    const knowledge = read(resolve(MINDY_DIR, "knowledge.ts")).toLowerCase();
    expect(knowledge).toContain("never invent a price");
    expect(knowledge).toContain("never convert");
    expect(knowledge).toContain("never offer a discount");
  });

  it("routes on the two live rungs", () => {
    const knowledge = read(resolve(MINDY_DIR, "knowledge.ts"));
    expect(knowledge).toContain("The Teardown");
    expect(knowledge).toContain("The Handover");
  });

  it("carries no em dashes", () => {
    // The character as an escape, not a literal, so this file does not fail its
    // own rule and the repo-wide check needs no exception for it.
    const EM_DASH = "\u2014";
    const offenders = mindyFiles
      .filter((f) => read(f).includes(EM_DASH))
      .map((f) => relative(ROOT, f));
    expect(offenders).toEqual([]);
  });
});
