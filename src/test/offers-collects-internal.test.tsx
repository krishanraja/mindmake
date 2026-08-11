/**
 * `Offer.collects` is internal. It records what an engagement captures and
 * retains, which is commercially useful and is not a selling point. Telling a
 * buyer "we will systematically record how you priced and packaged" during
 * the pitch is a different conversation from the one the page is having.
 *
 * The rule is easy to state and easy to break by accident, since `collects`
 * sits on the same object every page already reads for prices and labels.
 * These tests make breaking it fail the build.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { resolve, join, extname } from "path";
import { HANDOVER, OFFERS, TEARDOWN } from "@/lib/offers";

const ROOT = resolve(__dirname, "../..");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if ([".ts", ".tsx"].includes(extname(full))) out.push(full);
  }
  return out;
}

describe("Offer.collects stays internal", () => {
  const collectsSentences = OFFERS.flatMap((offer) => Object.values(offer.collects));

  it("has a populated collects block on every offer", () => {
    expect(OFFERS.length).toBe(2);
    for (const offer of OFFERS) {
      const values = Object.values(offer.collects);
      expect(values.length).toBe(5);
      for (const v of values) expect(v.length).toBeGreaterThan(30);
    }
  });

  it("is never referenced by a page or component", () => {
    // A source scan rather than a render assertion, because it catches the
    // case where collects is read into a variable that is only rendered
    // conditionally, which a single render would miss.
    const files = [
      ...walk(resolve(ROOT, "src/pages")),
      ...walk(resolve(ROOT, "src/components")),
    ];

    const offenders = files.filter((file) => {
      const source = readFileSync(file, "utf-8");
      return /\.collects\b/.test(source) || /\bOfferCollects\b/.test(source);
    });

    expect(
      offenders.map((f) => f.replace(ROOT + "/", "")),
      "collects is internal and must not be read by any page or component",
    ).toEqual([]);
  });

  it("does not appear in the prerendered crawler bodies or llms.txt", () => {
    // These are the two surfaces that state the offers to machines. Both are
    // generated, so a stray interpolation would publish the capture policy to
    // every crawler at once.
    const prerender = readFileSync(resolve(ROOT, "scripts/prerender.mjs"), "utf-8");
    const generator = readFileSync(resolve(ROOT, "scripts/generate-llms.mjs"), "utf-8");
    const llms = readFileSync(resolve(ROOT, "public/llms.txt"), "utf-8");

    for (const source of [prerender, generator]) {
      expect(/\.collects\b/.test(source)).toBe(false);
    }
    for (const sentence of collectsSentences) {
      expect(llms.includes(sentence)).toBe(false);
    }
  });

  it("keeps a distinctive phrase from each offer out of the published copy", () => {
    // A cheap canary against someone copying a collects sentence into copy by
    // hand rather than by reference.
    const canaries = [
      TEARDOWN.collects.pricingAndPackaging.slice(0, 40),
      HANDOVER.collects.commercialConstraint.slice(0, 40),
    ];
    const llms = readFileSync(resolve(ROOT, "public/llms.txt"), "utf-8");
    for (const canary of canaries) expect(llms.includes(canary)).toBe(false);
  });
});
