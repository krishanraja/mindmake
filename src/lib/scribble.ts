/**
 * Hand-drawn marks: a loop around a word or a quick underline beneath it.
 *
 * Ported from the content engine's scribble device
 * (krishanraja/content-engine, apps/renderer/src/engine/kit/scribblePath.ts,
 * "Approved H/build.py geometry"), so the site's marks are drawn by the same
 * hand as the videos': the same seeded wobble, the same Catmull-Rom smoothing,
 * the same overshooting second pass on an underline. Only the loop and the
 * underline come across; the engine's arrow, bracket, tick and cross stay
 * there. Pixels here are the mark's own box, not a 1080-wide canvas, so the
 * wobble scales with the type (`scale`).
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

/** A loop around a box: a slightly squared ellipse that overruns its start, as a pen does. */
export function loopPath(target: Box, seed: string, turns = 1.16): string {
  const rng = random(seed);
  const cx = target.x + target.w / 2, cy = target.y + target.h / 2;
  const u: Point = [target.w * 0.53, 0], v: Point = [0, target.h * 0.74];
  const ph = [rng() * 6.28, rng() * 6.28, rng() * 6.28];
  const pts: Point[] = [], steps = 44, sq = 2;
  for (let i = 0; i <= Math.floor(steps * turns); i++) {
    const t = i / steps, a = -2.3 + 2 * Math.PI * t;
    const w = 1 + 0.05 * Math.sin(2 * a + ph[0]) + 0.035 * Math.sin(3 * a + ph[1]) + 0.02 * Math.sin(5 * a + ph[2]);
    const g = 1 + 0.13 * t, c = Math.cos(a), s = Math.sin(a);
    const x = w * g * Math.sign(c) * Math.abs(c) ** (2 / sq), y = w * g * Math.sign(s) * Math.abs(s) ** (2 / sq);
    pts.push([cx + x * u[0] + y * v[0], cy + x * u[1] + y * v[1]]);
  }
  return smooth(pts);
}

/**
 * A loop that keeps inside the room it is given (Krish, 2026-11-04: marks
 * never cross other words): a squarer pen loop with semi-axes `a` and `b`
 * about a centre, overrunning its start a little, as a pen does, but never
 * stepping outside its box. `fits` says whether such a loop still rings a
 * phrase of half-width `hw` and half-height `hh`.
 */
const LOOP_POWER = 3;
export const loopFits = (a: number, b: number, hw: number, hh: number) =>
  a > hw && b > hh && (hw / a) ** LOOP_POWER + (hh / b) ** LOOP_POWER <= 0.97;
export function fittedLoopPath(cx: number, cy: number, a: number, b: number, seed: string): string {
  const rng = random(seed);
  const ph = [rng() * 6.28, rng() * 6.28];
  const pts: Point[] = [], steps = 56, turns = 1.1;
  for (let i = 0; i <= Math.floor(steps * turns); i++) {
    const t = i / steps, ang = -2.3 + 2 * Math.PI * t;
    const r = 0.955 + 0.03 * t + 0.012 * Math.sin(2 * ang + ph[0]) + 0.008 * Math.sin(3 * ang + ph[1]);
    const c = Math.cos(ang), s = Math.sin(ang);
    pts.push([cx + r * a * Math.sign(c) * Math.abs(c) ** (2 / LOOP_POWER), cy + r * b * Math.sign(s) * Math.abs(s) ** (2 / LOOP_POWER)]);
  }
  return smooth(pts);
}

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
