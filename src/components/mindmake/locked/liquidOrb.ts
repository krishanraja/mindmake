/**
 * A small piece of the living Brain, floating above the page (owner,
 * 2026-11-11: the "Prefer to …?" nudge should "borrow from the brain
 * animation, but just a small part of it, and look like it was floating above
 * the page").
 *
 * The physics and look are the Brain's own (`liquidBrain.ts`): a viscous
 * particle mass in the raised ink green, merged by the same SVG goo filter (a
 * blur and the `20 -8` alpha threshold), cream specks over it, and mint ideas
 * joined by a line. Here the mass is round and small, holds three ideas and a
 * question mark, reaches a tendril towards its caption every few seconds, pulls
 * towards the pointer, and gives a small pulse when the caption turns.
 *
 * It only paints. It stops when off screen or paused, stops reaching once
 * calmed, and draws one still frame under reduced motion.
 */

const INK = "#245a42";
const MINT = "145, 232, 188";
const CREAM = "239, 230, 211";

interface Particle { x: number; y: number; vx: number; vy: number; hx: number; hy: number; ex: number; ey: number; r: number; ph: number; until: number }

export interface LiquidOrb {
  /** A small outward pulse, when the caption turns. */
  pulse(): void;
  /** The pointer in the orb host's own pixels, or null when it leaves. */
  setHover(point: [number, number] | null): void;
  /** Stop reaching out; the visitor has answered it. */
  calm(): void;
  /** Stop or restart painting (the overlay is open). */
  setPaused(paused: boolean): void;
  destroy(): void;
}

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

export function mountLiquidOrb(host: HTMLElement, { reduced, size }: { reduced: boolean; size: () => number }): LiquidOrb {
  const svgNs = "http://www.w3.org/2000/svg";
  const filterId = `mm-orb-goo-${Math.random().toString(36).slice(2, 8)}`;
  const defs = document.createElementNS(svgNs, "svg");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.setAttribute("aria-hidden", "true");
  defs.setAttribute("class", "mm-orb-defs");
  const blur = document.createElementNS(svgNs, "feGaussianBlur");
  const goo = document.createElement("canvas");
  const net = document.createElement("canvas");
  goo.className = "mm-orb-goo";
  net.className = "mm-orb-net";
  goo.style.filter = `url(#${filterId})`;
  const filter = document.createElementNS(svgNs, "filter");
  filter.setAttribute("id", filterId);
  blur.setAttribute("in", "SourceGraphic");
  blur.setAttribute("result", "b");
  const matrix = document.createElementNS(svgNs, "feColorMatrix");
  matrix.setAttribute("in", "b");
  matrix.setAttribute("mode", "matrix");
  matrix.setAttribute("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8");
  filter.append(blur, matrix);
  defs.append(filter);
  const gooWrap = document.createElement("span");
  gooWrap.className = "mm-orb-mass";
  gooWrap.append(goo);
  host.append(defs, gooWrap, net);
  const g = goo.getContext("2d");
  const n = net.getContext("2d");

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const random = seeded(20261111);
  let S = 0, C = 0, pad = 0, W = 0;
  let particles: Particle[] = [];
  let ideas: Array<[number, number]> = [];
  let hover: [number, number] | null = null;
  let calm = false;
  let paused = false;
  let visible = false;
  let lastReach = 0;

  const layout = () => {
    S = size();
    pad = Math.round(S * 0.42);
    W = S + pad * 2;
    C = W / 2;
    for (const canvas of [goo, net]) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(W * dpr);
      canvas.style.width = canvas.style.height = `${W}px`;
      canvas.style.left = canvas.style.top = `${-pad}px`;
    }
    blur.setAttribute("stdDeviation", String(Math.max(2.5, S * 0.06)));
    const R = S * 0.25;
    const rand = seeded(20261111);
    particles = Array.from({ length: 18 }, (_, k) => {
      const a = (k / 18) * 6.283 + rand() * 0.4, d = k === 0 ? 0 : R * (0.35 + rand() * 0.65);
      const hx = C + Math.cos(a) * d, hy = C + Math.sin(a) * d;
      return { x: hx, y: hy, vx: 0, vy: 0, hx, hy, ex: 0, ey: 0, r: S * (0.12 + rand() * 0.06), ph: rand() * 6.28, until: 0 };
    });
    ideas = [[C - S * 0.2, C - S * 0.12], [C + S * 0.17, C - S * 0.17], [C + S * 0.06, C + S * 0.2]];
  };

  /* Reaching towards the caption, on the right: the Brain's tendril, small. */
  const reach = (t: number) => {
    const angle = (random() - 0.5) * 1.1;
    const k = 4 + Math.floor(random() * 3), far = S * (0.32 + random() * 0.2);
    particles
      .map((p) => ({ p, d: Math.cos(Math.atan2(p.hy - C, p.hx - C) - angle) * Math.hypot(p.hx - C, p.hy - C) }))
      .sort((a, b) => b.d - a.d).slice(0, k)
      .forEach(({ p }, j) => { p.ex = Math.cos(angle) * far * (1 - j / k * 0.55); p.ey = Math.sin(angle) * far * (1 - j / k * 0.55); p.until = t + 1300 + random() * 700; });
  };

  const step = (t: number) => {
    if (!calm && t - lastReach > 3200) { lastReach = t; reach(t); }
    const swell = hover ? 1.08 : 1;
    for (const p of particles) {
      if (p.until && t > p.until) { p.ex = p.ey = 0; p.until = 0; }
      const tx = C + (p.hx - C) * swell + p.ex + Math.sin(t / 900 + p.ph) * S * 0.025;
      const ty = C + (p.hy - C) * swell + p.ey + Math.cos(t / 1100 + p.ph) * S * 0.025;
      p.vx += (tx - p.x) * 0.02; p.vy += (ty - p.y) * 0.02;
      if (hover) {
        const dx = hover[0] - p.x, dy = hover[1] - p.y, d = Math.hypot(dx, dy), range = S * 0.9;
        if (d < range && d > 0) { p.vx += dx / d * (range - d) * 0.006; p.vy += dy / d * (range - d) * 0.006; }
      }
      p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
    }
  };

  const draw = (t: number) => {
    if (!g || !n || !W) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, W, W);
    g.fillStyle = INK;
    for (const p of particles) { g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); }

    n.setTransform(dpr, 0, 0, dpr, 0, 0);
    n.clearRect(0, 0, W, W);
    const glow = n.createRadialGradient(C, C, 0, C, C, S * 0.5);
    const lit = (hover ? 0.5 : 0.32) + Math.sin(t / 700) * 0.06;
    glow.addColorStop(0, `rgba(${MINT}, ${lit})`);
    glow.addColorStop(1, `rgba(${MINT}, 0)`);
    n.fillStyle = glow;
    n.beginPath(); n.arc(C, C, S * 0.5, 0, 6.283); n.fill();
    const wob = (k: number): [number, number] => [ideas[k][0] + Math.sin(t / 800 + k * 2) * S * 0.015, ideas[k][1] + Math.cos(t / 950 + k) * S * 0.015];
    const [a, b, c] = [wob(0), wob(1), wob(2)];
    n.strokeStyle = `rgba(${MINT}, ${hover ? 0.85 : 0.55})`;
    n.lineWidth = Math.max(1, S * 0.018);
    n.beginPath(); n.moveTo(a[0], a[1]); n.lineTo(b[0], b[1]); n.lineTo(c[0], c[1]); n.stroke();
    n.fillStyle = `rgba(${MINT}, ${hover ? 1 : 0.9})`;
    for (const [x, y] of [a, b, c]) { n.beginPath(); n.arc(x, y, Math.max(1.6, S * 0.035), 0, 6.283); n.fill(); }
    n.fillStyle = `rgba(${CREAM}, .2)`;
    for (const p of particles) { n.beginPath(); n.arc(p.x, p.y, Math.max(0.8, S * 0.012), 0, 6.283); n.fill(); }
    n.shadowColor = "rgba(4, 12, 9, .85)";
    n.shadowBlur = S * 0.08;
    n.fillStyle = `rgb(${CREAM})`;
    n.font = `700 ${Math.round(S * 0.5)}px Newsreader, Georgia, serif`;
    n.textAlign = "center";
    n.textBaseline = "middle";
    n.fillText("?", C, C + S * 0.03);
    n.shadowBlur = 0;
  };

  let raf = 0, last = 0, acc = 0, clock = 0;
  const loop = (now: number) => {
    if (!last) last = now;
    acc = Math.min(acc + now - last, 250);
    last = now;
    while (acc >= 1000 / 60) { clock += 1000 / 60; step(clock); acc -= 1000 / 60; }
    draw(clock);
    raf = requestAnimationFrame(loop);
  };
  const sync = () => {
    const run = !reduced && visible && !paused && document.visibilityState === "visible";
    if (run && !raf) { last = 0; raf = requestAnimationFrame(loop); }
    if (!run && raf) { cancelAnimationFrame(raf); raf = 0; }
  };

  layout();
  draw(0);
  const io = typeof IntersectionObserver === "function" ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }) : null;
  io?.observe(host);
  const onVisibility = () => sync();
  document.addEventListener("visibilitychange", onVisibility);
  const ro = typeof ResizeObserver === "function" ? new ResizeObserver(() => { if (Math.abs(size() - S) > 0.5) { layout(); draw(clock); } }) : null;
  ro?.observe(host);

  return {
    pulse() {
      if (reduced) return;
      for (const p of particles) { const dx = p.x - C, dy = p.y - C, d = Math.hypot(dx, dy) || 1; p.vx += dx / d * S * 0.05; p.vy += dy / d * S * 0.05; }
    },
    setHover(point) { hover = point ? [point[0] + pad, point[1] + pad] : null; if (reduced) draw(clock); },
    calm() { calm = true; },
    setPaused(next) { paused = next; sync(); },
    destroy() {
      cancelAnimationFrame(raf);
      raf = 0;
      io?.disconnect();
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      defs.remove(); gooWrap.remove(); net.remove();
    },
  };
}
