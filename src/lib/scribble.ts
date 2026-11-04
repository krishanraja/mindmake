/**
 * Hand-drawn marks: a quick double underline beneath a phrase.
 *
 * Ported from the content engine's scribble device
 * (krishanraja/content-engine, apps/renderer/src/engine/kit/scribblePath.ts,
 * "Approved H/build.py geometry"), so the site's marks are drawn by the same
 * hand as the videos': the same seeded wobble, the same Catmull-Rom smoothing,
 * the same second pass on an underline. Only the underline comes across;
 * the engine's loop, arrow, bracket, tick and cross stay there. Pixels here
 * are the mark's own box, not a 1080-wide canvas, so the wobble scales with
 * the type (`scale`).
 */
type Point = readonly [number, number];

/** FNV-1a string hash feeding mulberry32. No global random state, so a mark draws the same every time. */
function random(seed: string) {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i++) value = Math.imul(value ^ seed.charCodeAt(i), 16777619);
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let t = Math.imul(value ^ (value >>> 15), value | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const point = (p: Point) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

/** Catmull-Rom to cubic Bezier. */
function smooth(pts: Point[]): string {
  if (pts.length < 3) return `M${point(pts[0])} L${point(pts[pts.length - 1])}`;
  let d = `M${point(pts[0])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1: Point = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Point = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${point(c1)} ${point(c2)} ${point(p2)}`;
  }
  return d;
}

export type Box = { x: number; y: number; w: number; h: number };

/**
 * A double underline beneath a box, as a pen draws one (Krish, 2026-11-04:
 * "like someone is literally drawing two lines one after the other with a
 * pen"): two separate strokes, both left to right, the second a little lower
 * and set slightly off the first. Each wavers gently and drifts a touch, as a
 * hand does; nothing joins them, so the pen lifts between the two.
 */
export function underlinePath(target: Box, seed: string, scale = 1): [string, string] {
  const rng = random(seed);
  const x0 = target.x, length = target.w, y = target.y + target.h + 6 * scale;
  const amp = 1.6 * scale, ph = rng() * 6.28;
  const stroke = (off: number, a0: number, start: number, end: number, drift: number) => {
    const pts: Point[] = [], n = Math.max(10, Math.floor(length / 26));
    for (let i = 0; i <= n; i++) {
      const t = i / n, s = start + t * (length + end - start);
      const wob = amp * Math.sin(t * 1.6 * 2 * Math.PI + ph + a0) * (0.6 + 0.4 * Math.sin(t * 2.7 + a0));
      pts.push([x0 + s, y + off + wob - drift * t]);
    }
    return smooth(pts);
  };
  return [
    stroke(0, 0.3, -5 * scale, 4 * scale, 2.4 * scale),
    stroke(amp * 3.4, 1.9, 4 * scale, -2 * scale, 1.2 * scale),
  ];
}
