import { describe, expect, it } from "vitest";
import { underlinePath } from "@/lib/scribble";
import { onLastLine } from "@/lib/scrollBuild";

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

  it("marks a phrase only when nothing of the heading sits below it", () => {
    expect(onLastLine({ bottom: 100 }, { bottom: 160 }, 48)).toBe(false);
    expect(onLastLine({ bottom: 158 }, { bottom: 160 }, 48)).toBe(true);
  });
});
