import { describe, expect, it } from "vitest";
import { LINES } from "@/components/homepage-release/heroRotation";
import { homepageMarkup } from "@/components/homepage-release/markup";

/* The hero headline turns through five lines and rests on the first, which is
   also the h1 the generator writes into the markup. A screen reader, a crawler,
   a page without script and a reader with reduced motion only ever meet that
   one, so the two must never drift apart. */
const rowHtml = (row: string) => `<span class="mm-hero-row">${row.replace(/\*(.+?)\*/g, '<span class="mm-hero-your">$1</span>')}</span>`;

describe("the hero rotation", () => {
  it("leads with the generated h1, row for row, on desktop and phone", () => {
    const h1 = `<h1><span class="mm-hero-line">${LINES[0].map(rowHtml).join(" ")}</span></h1>`;
    expect(homepageMarkup.split(h1)).toHaveLength(3);
    expect(homepageMarkup.match(/<h1>/g)).toHaveLength(2);
  });

  it("turns through five headlines, each in three rows with one underlined you or your", () => {
    expect(LINES).toHaveLength(5);
    for (const line of LINES) {
      expect(line).toHaveLength(3);
      const marks = line.join(" ").match(/\*(.+?)\*/g) ?? [];
      expect(marks, line.join(" ")).toHaveLength(1);
      expect(marks[0]).toMatch(/^\*(you|your|yours)\*$/i);
      for (const row of line) expect(row).not.toMatch(/[—–]/);
    }
    expect(new Set(LINES.map((line) => line.join(" "))).size).toBe(5);
  });
});
