import { describe, expect, it } from "vitest";
import { underlinePath } from "@/lib/scribble";
import { markKind } from "@/lib/scrollBuild";

describe("hand-drawn marks", () => {
  it("draws a double underline as two separate left-to-right strokes", () => {
    const strokes = underlinePath({ x: 10, y: 10, w: 300, h: 40 }, "how we think-0");
    expect(strokes).toHaveLength(2);
    for (const d of strokes) {
      expect(d.match(/M/g)).toHaveLength(1);
      const xs = [...d.matchAll(/(-?\d+\.\d) (-?\d+\.\d)/g)].map((m) => Number(m[1]));
      expect(xs[xs.length - 1]).toBeGreaterThan(xs[0] + 250);
    }
  });

  it("circles a phrase instead of underlining it when more of the heading sits below", () => {
    expect(markKind("underline", { bottom: 100 }, { bottom: 160 }, 48)).toBe("loop");
    expect(markKind("underline", { bottom: 158 }, { bottom: 160 }, 48)).toBe("underline");
    expect(markKind("loop", { bottom: 158 }, { bottom: 160 }, 48)).toBe("loop");
  });
});
