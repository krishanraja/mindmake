import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const north = readFileSync("project-documentation/00_NORTH_STAR.md", "utf8");
const canon = readFileSync("project-documentation/01_CANON.md", "utf8");

// These are the file-format markers consumed by growth-mindmake/src/stages/canon.mjs.
const section = (source: string, heading: string) =>
  source.split(new RegExp('^## ' + heading + '\\s*$', 'm'))[1]?.split(/^##\s/m)[0] ?? "";
const flat = (value: string) => value.replace(/\s+/g, " ").trim();

describe("growth canon contract", () => {
  it("exposes the buyer groups, gate, situations and sectors in their sections", () => {
    const who = section(canon, "Who buys");
    expect(who.match(/\*\*Buyer groups\.\*\*\s+([^\n]+(?:\n(?!\n)[^\n]+)*)/)?.[1]).toContain("Commissioning lead.");
    expect(who).toMatch(/\*\*The gate\.\*\*\s+([\s\S]+?)(?:\n\n|$)/);
    expect(who).toMatch(/\*\*Best-fit moments\.\*\*\s*\n- \S/);
    expect(who).toMatch(/\*\*Poor fit\.\*\*\s+([\s\S]+?)(?:\n\n|$)/);
    const wedge = who.match(/\*\*Sales wedge[^*]*\*\*\s+([\s\S]+?)(?:\n\n|$)/)?.[1] ?? "";
    expect(flat(wedge)).toMatch(/([A-Z][a-z]+(?:,\s*[a-z]+)*(?:\s+and\s+[a-z]+)?)\s+businesses/);
    expect(flat(section(north, "Who this is for"))).toMatch(/^A ([a-z ,]{10,200}?) who can move a decision/);
    expect(north.match(/^## Horizon\s+> ([^\n]{20,400})/m)?.[1]).toMatch(/backed ([a-z]+(?:,\s*[a-z]+)*(?:\s+(?:or|and)\s+[a-z]+)?)\s+leader/i);
  });

  it("keeps the sprint readable and out of the retired offer list", () => {
    expect(north.match(/Both lead to \*\*one ([a-z ]{3,40})\*\*/)?.[1]).toBe("sprint");
    expect(flat(north).match(/public shape is (\d{1,3}) days/)?.[1]).toBe("30");
    expect(flat(north)).toMatch(/\bprice is (?:agreed )?private(?:ly)?\b/);
    const ladder = section(canon, "Do not reintroduce").split("One list, so it does not have to be repeated:")[1];
    expect(ladder?.match(/^- .*offer ladder.*$/im)?.[0]).toMatch(/Teardown.*Handover/);
    expect(ladder?.match(/^- .*offer ladder.*$/im)?.[0]).not.toMatch(/sprint|immersion/i);
    expect(north.match(/^- \*\*Build your AI (?:business|revenue engine)\*\* \(\x60[^\x60]+\x60\): ([\s\S]+?\.)\s*$/m)?.[1]).toBe("Make, share and earn from your work with AI.");
  });

  it("retains the outreach links and copy table cells", () => {
    expect(canon).toMatch(/^1\. \*\*([^*]{3,80})\*\*, at \x60(https:\/\/[^\x60\s]+)\x60\. The main ask/m);
    expect(canon).toMatch(/^2\. \*\*Subscribe to (.+)\*\*, at \x60(https:\/\/[^\x60\s]+)\x60/m);
    expect(canon).toMatch(/Describe\s+it\s+as\s+the\s+site\s+does:\s+([^.]{10,200})\./);
    expect(north).toMatch(/^- \*\*Build your AI brain\.\*\* ([\s\S]{10,200}?\.)\s*$/m);
    for (const label of ["Business door", "Business door explanation", "Homepage section 1 \\(the problem\\)", "Homepage section 2 \\(how it works\\)", "Homepage headline \\(first, and the h1\\)"]) {
      expect(canon).toMatch(new RegExp('^\\| ' + label + ' \\| ([^|\\n]{3,200}) \\|\\s*$', 'm'));
    }
  });
});
