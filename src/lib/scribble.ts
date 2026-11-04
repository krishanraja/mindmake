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

/** An underline beneath a box: one wavering stroke out, a flick, and a second pass back. */
export function underlinePath(target: Box, seed: string, scale = 1): string {
  const rng = random(seed);
  const x0 = target.x, x1 = target.x + target.w, y = target.y + target.h + 6 * scale;
  const length = x1 - x0;
  const amp = 3.2 * scale, ph = rng() * 6.28;
  const stroke = (off: number, a0: number, over: number) => {
    const pts: Point[] = [], n = Math.max(12, Math.floor(length / 22));
    for (let i = 0; i <= n; i++) {
      const t = i / n, s = -over + t * (length + 2 * over);
      const wob = amp * Math.sin(t * 2.5 * 2 * Math.PI + ph + a0) * (0.55 + 0.45 * Math.sin(t * 3.1 + a0));
      pts.push([x0 + s, y + wob + off]);
    }
    return pts;
  };
  const first = stroke(0, 0.3, 6 * scale);
  const end = first[first.length - 1];
  return smooth([...first, [end[0] + 8 * scale, end[1] + amp * 1.2], ...stroke(amp * 2.3, 1.9, 2 * scale).reverse()]);
}
