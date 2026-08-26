import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const ACTIVE_BUYING_SURFACES = [
  "src/pages/Index.tsx",
  "src/pages/AiBrain.tsx",
  "src/pages/AiGtm.tsx",
  "src/pages/CaseStudies.tsx",
  "src/pages/Contact.tsx",
  "src/components/mindmake/LeadBrief.tsx",
  "src/components/mindmake/MindmakeShell.tsx",
  "src/components/Navigation.tsx",
  "src/components/Footer.tsx",
  "scripts/generate-llms.mjs",
  "scripts/prerender.mjs",
  "index.html",
];

const read = (file: string) => readFileSync(resolve(ROOT, file), "utf8");

describe("the public offer stays simple", () => {
  it("publishes no old offer or price on a buying surface", () => {
    const blocked = [
      /The Teardown/i,
      /The Handover/i,
      /4-Week Decision Sprint/i,
      /90-Day Concierge Sprint/i,
      /\$\s*9,500/i,
      /\$\s*18,000/i,
      /\$\s*30,000/i,
      /\$\s*50,000/i,
    ];

    const leaks = ACTIVE_BUYING_SURFACES.flatMap((file) =>
      blocked.some((pattern) => pattern.test(read(file))) ? [file] : [],
    );

    expect(leaks).toEqual([]);
  });

  it("uses the private starting point instead of a public diary", () => {
    const button = read("src/components/BookFitCall.tsx");
    const links = read("src/lib/publicLinks.ts");
    const nav = read("src/components/Navigation.tsx");

    expect(button).toContain("Start here");
    expect(links).toContain('SPRINT_PATH = "/?start=1"');
    expect(links).not.toContain("calendly.com");
    expect(nav).toContain("<BookFitCall");
  });
});
