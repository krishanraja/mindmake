import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const read = (file: string) => readFileSync(resolve(ROOT, file), "utf8");

describe("public media and proof contracts", () => {
  it("keeps retired CTRL video paths off the homepage", () => {
    expect(read("src/pages/Index.tsx")).not.toContain("ctrl-demo-video.mp4");
    expect(read("src/pages/Index.tsx")).not.toContain("CTRL-demo-aug-26.mp4");
  });

  it("uses the approved public attributions", () => {
    const proof = read("src/data/rebuildProof.ts");
    const home = read("src/pages/Index.tsx");
    const results = read("src/pages/CaseStudies.tsx");

    expect(proof).toContain('attribution: "Partner, Venture Capital Firm"');
    expect(proof).not.toContain("Managing Partner, TMT advisory");
    expect(home).not.toContain("Performance Coach, Legacy Ascend");
    expect(results).not.toContain("Performance Coach, Legacy Ascend");
  });
});
