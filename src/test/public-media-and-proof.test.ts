import { describe, expect, it } from "vitest";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const read = (file: string) => readFileSync(resolve(ROOT, file), "utf8");

describe("public media and proof contracts", () => {
  it("ships a real MP4 at the one approved CTRL demo path", () => {
    const videoPath = resolve(ROOT, "public/CTRL-demo-aug-26.mp4");
    const header = readFileSync(videoPath).subarray(4, 8).toString("ascii");

    expect(statSync(videoPath).size).toBeGreaterThan(1_000_000);
    expect(header).toBe("ftyp");
    expect(read("src/lib/publicLinks.ts")).toContain('CTRL_DEMO_VIDEO_URL = "/CTRL-demo-aug-26.mp4"');
  });

  it("keeps retired CTRL video paths out of active and prototype surfaces", () => {
    const surfaces = [
      "src/pages/Index.tsx",
      "prototypes/archive/mindmaker-homepage-component-led-v2.html",
      "prototypes/archive/mindmaker-homepage-v3.html",
      "prototypes/archive/mindmaker-typography-test-v1.html",
    ];

    expect(surfaces.filter((file) => read(file).includes("ctrl-demo-video.mp4"))).toEqual([]);
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
