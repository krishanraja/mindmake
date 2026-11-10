/**
 * The Brain as a living mass (owner, 2026-11-10: "change the AI brain visual
 * to match the liquid animation on the Krish Raja site, but specific to
 * Mindmake").
 *
 * The same physics as krishraja.com's BrainBloom (a viscous particle mass held
 * in the shape of a brain, an SVG goo filter, tendrils that reach out and
 * close back), drawn in Mindmake's own semantics: the mass is the ink green
 * ground raised a step, the twenty ideas are the leader's own and sit where
 * the fixture puts them, the eighteen connections between them are the real
 * ones, and an idea lights mint when the leader has agreed it and amber while
 * it is still the Brain's reading (03_DESIGN_CONTRACT: mint is the answer,
 * amber is what moved).
 *
 * It only paints. The ideas stay buttons the page already owns, positioned
 * here over the mass, so the keyboard path, the inspector and the readings
 * are unchanged. Canvas and one SVG filter, no libraries; it stops when off
 * screen and draws one still frame under reduced motion.
 */

export interface LiquidIdea {
  id: string;
  /** Where the fixture puts it, as a percentage of the old field. */
  x: number;
  y: number;
  settled: boolean;
}

export interface LiquidRelationship {
  from: string;
  to: string;
}

export interface LiquidBrainOptions {
  ideas: readonly LiquidIdea[];
  relationships: readonly LiquidRelationship[];
  /** The idea buttons, by id, which the brain positions over the mass. */
  nodes: Map<string, HTMLElement>;
  initial: string;
  /**
   * Turn to the next idea by itself. Off by default (owner, 2026-11-10: the
   * reading was replaced every few seconds before anyone could read it).
   */
  tour?: boolean;
  /** Called when the brain moves on to the next idea by itself. */
  onAdvance?: (id: string) => void;
  /** How long the tour stays on each idea. */
  tourMs?: number;
  /** Where each idea (and any label) sits, in the brain's 1000 x 820 space, instead of the fixture layout. */
  seats?: Map<string, [number, number]>;
  reduced: boolean;
}

// A lateral view in a 1000 x 820 box: frontal, parietal, occipital, temporal, cerebellum, and the stem.
const LOBES: Array<[number, number, number]> = [[330, 380, 205], [535, 285, 195], [715, 375, 150], [485, 525, 150], [700, 585, 95]];
const STEM = [585, 668, 34, 88] as const;
const FOLDS = [
  [250, 500, 380, 470, 520, 470, 660, 420], [560, 120, 520, 220, 540, 300, 470, 410],
  [200, 330, 260, 270, 330, 300, 380, 250], [210, 420, 280, 380, 320, 430, 400, 380],
  [640, 210, 700, 260, 660, 320, 740, 330], [800, 330, 780, 400, 840, 430, 820, 480],
  [420, 580, 470, 560, 520, 600, 580, 570], [640, 560, 690, 545, 730, 560, 770, 545],
];
const MINT = "145, 232, 188";
const AMBER = "224, 189, 120";

export const inBrain = (x: number, y: number) =>
  LOBES.some(([cx, cy, r]) => (x - cx) ** 2 + (y - cy) ** 2 < r * r)
  || ((x - STEM[0]) / STEM[2]) ** 2 + ((y - STEM[1]) / STEM[3]) ** 2 < 1;

/**
 * Seats each idea on the brain. The fixture's layout is kept (what sat top
 * left still sits top left), scaled into the brain's box and drawn inward
 * until it lies well inside the mass, then pushed apart so no two ideas share
 * a tap target. Deterministic, so the same idea is always in the same place.
 */
export function seatIdeas(ideas: readonly LiquidIdea[]): Map<string, [number, number]> {
  const inset = (x: number, y: number) => inBrain(x, y) && inBrain(x + 34, y) && inBrain(x - 34, y) && inBrain(x, y + 34) && inBrain(x, y - 34);
  const seats = ideas.map((idea) => {
    let x = 190 + (idea.x / 100) * 640;
    let y = 150 + (idea.y / 100) * 520;
    for (let i = 0; i < 60 && !inset(x, y); i++) { x += (500 - x) * 0.06; y += (420 - y) * 0.06; }
    return [x, y] as [number, number];
  });
  for (let pass = 0; pass < 40; pass++) {
    for (let i = 0; i < seats.length; i++) for (let j = i + 1; j < seats.length; j++) {
      const dx = seats[j][0] - seats[i][0], dy = seats[j][1] - seats[i][1], d = Math.hypot(dx, dy) || 1;
      if (d >= 92) continue;
      const push = (92 - d) / 2, ux = dx / d, uy = dy / d;
      const a: [number, number] = [seats[i][0] - ux * push, seats[i][1] - uy * push];
      const b: [number, number] = [seats[j][0] + ux * push, seats[j][1] + uy * push];
      if (inset(...a)) seats[i] = a;
      if (inset(...b)) seats[j] = b;
    }
  }
  return new Map(ideas.map((idea, i) => [idea.id, seats[i]]));
}

interface Particle { x: number; y: number; vx: number; vy: number; hx: number; hy: number; ex: number; ey: number; r: number; ph: number; until: number }

/** A small seeded generator, so the mass is the same shape on every visit. */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

export function mountLiquidBrain(field: HTMLElement, options: LiquidBrainOptions) {
  const { ideas, relationships, nodes, reduced } = options;
  const seats = options.seats ?? seatIdeas(ideas);
  let touring = Boolean(options.tour);
  const tourMs = options.tourMs ?? 3600;
  const settledById = new Map(ideas.map((idea) => [idea.id, idea.settled]));
  const order = ideas.map((idea) => idea.id);
  let active = options.initial;
  let pinned = false;

  const filterId = `mm-goo-${Math.random().toString(36).slice(2, 8)}`;
  const svgNs = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(svgNs, "svg");
  defs.setAttribute("width", "0");
  defs.setAttribute("height", "0");
  defs.setAttribute("aria-hidden", "true");
  defs.setAttribute("class", "liquid-defs");
  defs.innerHTML = `<filter id="${filterId}"><feGaussianBlur in="SourceGraphic" stdDeviation="7" result="b"/><feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -8"/></filter>`;
  const goo = document.createElement("canvas");
  goo.className = "liquid-goo";
  goo.setAttribute("aria-hidden", "true");
  goo.style.filter = `url(#${filterId})`;
  const net = document.createElement("canvas");
  net.className = "liquid-net";
  net.setAttribute("aria-hidden", "true");
  field.prepend(defs, goo, net);
  field.classList.add("is-liquid");
  const g = goo.getContext("2d");
  const n = net.getContext("2d");

  /* The goo is blurred anyway, so it is drawn at one pixel per CSS pixel; the
     lines and dots on top keep the screen's sharpness (audit PERF-02). */
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const gooDpr = 1;
  let W = 0, H = 0, s = 1, ox = 0, oy = 0;
  const random = seeded(20261110);
  const N = 230;
  const particles: Particle[] = [];
  const homes: Array<[number, number]> = [];
  for (let tries = 0; homes.length < N && tries < 80000; tries++) {
    const x = 120 + random() * 780, y = 90 + random() * 680;
    if (!inBrain(x, y)) continue;
    const gap = tries < 40000 ? 600 : 0;
    if (homes.every(([hx, hy]) => (hx - x) ** 2 + (hy - y) ** 2 > gap)) homes.push([x, y]);
  }
  homes.forEach(([x, y]) => particles.push({ x: x + (random() - 0.5) * 500, y: y + (random() - 0.5) * 500, vx: 0, vy: 0, hx: x, hy: y, ex: 0, ey: 0, r: 21 + random() * 12, ph: random() * 6.28, until: 0 }));

  const place = () => {
    nodes.forEach((node, id) => {
      const seat = seats.get(id);
      if (!seat || !W || !H) return;
      node.style.setProperty("--x", `${((ox + seat[0] * s) / W * 100).toFixed(2)}%`);
      node.style.setProperty("--y", `${((oy + seat[1] * s) / H * 100).toFixed(2)}%`);
    });
  };
  const size = () => {
    W = field.clientWidth; H = field.clientHeight;
    if (!W || !H) return;
    goo.width = Math.round(W * gooDpr); goo.height = Math.round(H * gooDpr);
    net.width = Math.round(W * dpr); net.height = Math.round(H * dpr);
    s = Math.min(W / 1000, H / 800) * 0.96;
    ox = (W - 1000 * s) / 2; oy = (H - 800 * s) / 2 - 40 * s;
    place();
    if (reduced || !running) draw(performance.now());
  };

  const toBrain = (event: PointerEvent): [number, number] => {
    const rect = field.getBoundingClientRect();
    return [((event.clientX - rect.left) * (W / rect.width) - ox) / s, ((event.clientY - rect.top) * (H / rect.height) - oy) / s];
  };
  let mouse: [number, number] | null = null;
  /* A touch does nothing to the mass: a tap on an idea is the idea's own
     button, and a swipe over the Brain scrolls the page (audit BRAIN-12: the
     splash replaced information with an effect). */
  const move = (event: PointerEvent) => { if (event.pointerType === "mouse") mouse = toBrain(event); };
  const leave = (event: PointerEvent) => { if (event.pointerType === "mouse") mouse = null; };
  field.addEventListener("pointermove", move, { passive: true });
  field.addEventListener("pointerleave", leave, { passive: true });

  let lastSwitch = 0, lastSearch = 0;
  /* The Brain reaching: a handful of particles on one side stretch out into
     a tendril, hold, and close back into the mass. */
  const search = (t: number) => {
    const angle = random() * 6.28, k = 6 + Math.floor(random() * 10), reach = 70 + random() * 120;
    particles
      .map((p) => ({ p, d: Math.cos(Math.atan2(p.hy - 430, p.hx - 500) - angle) * Math.hypot(p.hx - 500, p.hy - 430) }))
      .sort((a, b) => b.d - a.d).slice(0, k)
      .forEach(({ p }, j) => { p.ex = Math.cos(angle) * reach * (1 - j / k * 0.5); p.ey = Math.sin(angle) * reach * (1 - j / k * 0.5); p.until = t + 1800 + random() * 900; });
  };
  const step = (t: number) => {
    if (touring && !pinned && t - lastSwitch > tourMs) {
      lastSwitch = t;
      active = order[(order.indexOf(active) + 1) % order.length];
      options.onAdvance?.(active);
    }
    if (t - lastSearch > 2600) { lastSearch = t; search(t); }
    const seat = seats.get(active);
    for (const p of particles) {
      if (p.until && t > p.until) { p.ex = p.ey = 0; p.until = 0; }
      const tx = p.hx + p.ex + Math.sin(t / 900 + p.ph) * 4, ty = p.hy + p.ey + Math.cos(t / 1100 + p.ph) * 4;
      p.vx += (tx - p.x) * 0.012; p.vy += (ty - p.y) * 0.012;
      /* The chosen idea draws the mass a little towards itself, so the
         attention visibly moves with the reading. */
      if (seat) { const dx = seat[0] - p.x, dy = seat[1] - p.y, d = Math.hypot(dx, dy); if (d < 140 && d > 0) { p.vx += dx / d * (140 - d) * 0.0025; p.vy += dy / d * (140 - d) * 0.0025; } }
      if (mouse) { const dx = mouse[0] - p.x, dy = mouse[1] - p.y, d = Math.hypot(dx, dy); if (d < 160 && d > 0) { p.vx += dx / d * (160 - d) * 0.012; p.vy += dy / d * (160 - d) * 0.012; } }
      p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
    }
  };

  function draw(t: number) {
    if (!g || !n || !W) return;
    g.setTransform(gooDpr * s, 0, 0, gooDpr * s, gooDpr * ox, gooDpr * oy);
    g.clearRect(-ox / s, -oy / s, W / s, H / s);
    g.fillStyle = "#245a42";
    for (const p of particles) { g.beginPath(); g.arc(p.x, p.y, p.r, 0, 6.283); g.fill(); }

    n.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
    n.clearRect(-ox / s, -oy / s, W / s, H / s);
    const seat = seats.get(active);
    const tone = settledById.get(active) ? MINT : AMBER;
    const pulse = 0.55 + Math.sin(t / 420) * 0.2;
    if (seat) {
      const glow = n.createRadialGradient(seat[0], seat[1], 0, seat[0], seat[1], 170);
      glow.addColorStop(0, `rgba(${tone}, ${0.42 * pulse})`);
      glow.addColorStop(1, `rgba(${tone}, 0)`);
      n.fillStyle = glow;
      n.beginPath(); n.arc(seat[0], seat[1], 170, 0, 6.283); n.fill();
    }
    n.strokeStyle = "rgba(8, 20, 15, .7)"; n.lineWidth = 3.4; n.lineCap = "round";
    for (const f of FOLDS) { n.beginPath(); n.moveTo(f[0], f[1]); n.bezierCurveTo(f[2], f[3], f[4], f[5], f[6], f[7]); n.stroke(); }
    /* The eighteen real connections, the chosen idea's own drawn bright. */
    relationships.forEach((relationship) => {
      const a = seats.get(relationship.from), b = seats.get(relationship.to);
      if (!a || !b) return;
      const mine = relationship.from === active || relationship.to === active;
      n.strokeStyle = mine ? `rgba(${tone}, .9)` : "rgba(239, 230, 211, .16)";
      n.lineWidth = mine ? 2.2 : 1.2;
      n.setLineDash(mine ? [] : [5, 7]);
      n.beginPath(); n.moveTo(a[0], a[1]); n.lineTo(b[0], b[1]); n.stroke();
    });
    n.setLineDash([]);
    n.fillStyle = "rgba(239, 230, 211, .18)";
    for (const p of particles) { n.beginPath(); n.arc(p.x, p.y, 1.6, 0, 6.283); n.fill(); }
  }

  let raf = 0;
  let running = false;
  /* The physics steps at a fixed 60 a second whatever the screen's refresh
     rate, so a 120 Hz phone does not run it at double speed (audit
     PERF-03); after a pause (a hidden tab, a section off screen) it resumes
     where it was instead of catching up. */
  const STEP_MS = 1000 / 60;
  let clock = 0, lastFrame = 0, carry = 0;
  const loop = (now: number) => {
    if (!running) return;
    const elapsed = lastFrame ? Math.min(now - lastFrame, STEP_MS * 3) : STEP_MS;
    lastFrame = now;
    carry += elapsed;
    while (carry >= STEP_MS) { clock += STEP_MS; step(clock); carry -= STEP_MS; }
    draw(clock);
    raf = requestAnimationFrame(loop);
  };
  let onScreen = false;
  const decideRunning = () => {
    const was = running;
    running = onScreen && !reduced && !document.hidden;
    if (running && !was) { lastFrame = 0; raf = requestAnimationFrame(loop); }
    if (!running && was) cancelAnimationFrame(raf);
  };
  document.addEventListener("visibilitychange", decideRunning);
  const resize = new ResizeObserver(size);
  resize.observe(field);
  if (reduced) particles.forEach((p) => { p.x = p.hx; p.y = p.hy; });
  size();
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    decideRunning();
  });
  visibility.observe(field);

  return {
    /** Start or stop the tour; the reader's own pick still ends it for good. */
    setTour(on: boolean) { touring = on; lastSwitch = clock; },
    /** The reader chose an idea: the brain follows it and stops turning by itself. */
    select(id: string, byReader: boolean) {
      active = id;
      if (byReader) pinned = true;
      if (reduced || !running) draw(clock);
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", decideRunning);
      visibility.disconnect();
      resize.disconnect();
      field.removeEventListener("pointermove", move);
      field.removeEventListener("pointerleave", leave);
      field.classList.remove("is-liquid");
      defs.remove(); goo.remove(); net.remove();
    },
  };
}
