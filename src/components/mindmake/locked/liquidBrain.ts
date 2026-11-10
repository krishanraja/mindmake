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
  /** Called when the brain moves on to the next idea by itself. */
  onAdvance: (id: string) => void;
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
  const seats = seatIdeas(ideas);
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

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
    for (const canvas of [goo, net]) { canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); }
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
  const TOUCH_MS = 1300;
  let touch: { x: number; y: number; t0: number } | null = null;
  /* A finger cannot hover, and a swipe over the brain must still scroll the
     page, so a touch is a splash: the mass bursts from the finger and closes
     back around it. A tap on an idea is the idea's own button. */
  const down = (event: PointerEvent) => {
    if (event.pointerType === "mouse") return;
    const [x, y] = toBrain(event);
    touch = { x, y, t0: performance.now() };
    for (const p of particles) {
      const dx = p.x - x, dy = p.y - y, d = Math.hypot(dx, dy);
      if (d < 190 && d > 0) { const k = (190 - d) * 0.22; p.vx += dx / d * k; p.vy += dy / d * k; }
    }
  };
  const move = (event: PointerEvent) => { if (event.pointerType === "mouse") mouse = toBrain(event); };
  const leave = (event: PointerEvent) => { if (event.pointerType === "mouse") mouse = null; };
  field.addEventListener("pointerdown", down, { passive: true });
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
    if (!pinned && t - lastSwitch > 3600) {
      lastSwitch = t;
      active = order[(order.indexOf(active) + 1) % order.length];
      options.onAdvance(active);
    }
    if (t - lastSearch > 2600) { lastSearch = t; search(t); }
    const age = touch ? t - touch.t0 : Infinity;
    if (touch && age > TOUCH_MS) touch = null;
    const pull = age < 180 ? 0 : age < TOUCH_MS ? 1 - (age - 180) / (TOUCH_MS - 180) : 0;
    const seat = seats.get(active);
    for (const p of particles) {
      if (p.until && t > p.until) { p.ex = p.ey = 0; p.until = 0; }
      const tx = p.hx + p.ex + Math.sin(t / 900 + p.ph) * 4, ty = p.hy + p.ey + Math.cos(t / 1100 + p.ph) * 4;
      p.vx += (tx - p.x) * 0.012; p.vy += (ty - p.y) * 0.012;
      /* The chosen idea draws the mass a little towards itself, so the
         attention visibly moves with the reading. */
      if (seat) { const dx = seat[0] - p.x, dy = seat[1] - p.y, d = Math.hypot(dx, dy); if (d < 140 && d > 0) { p.vx += dx / d * (140 - d) * 0.0025; p.vy += dy / d * (140 - d) * 0.0025; } }
      if (mouse) { const dx = mouse[0] - p.x, dy = mouse[1] - p.y, d = Math.hypot(dx, dy); if (d < 160 && d > 0) { p.vx += dx / d * (160 - d) * 0.012; p.vy += dy / d * (160 - d) * 0.012; } }
      if (pull > 0 && touch) { const dx = touch.x - p.x, dy = touch.y - p.y, d = Math.hypot(dx, dy); if (d < 200 && d > 0) { p.vx += dx / d * (200 - d) * 0.014 * pull; p.vy += dy / d * (200 - d) * 0.014 * pull; } }
      p.vx *= 0.86; p.vy *= 0.86; p.x += p.vx; p.y += p.vy;
    }
  };

  function draw(t: number) {
    if (!g || !n || !W) return;
    g.setTransform(dpr * s, 0, 0, dpr * s, dpr * ox, dpr * oy);
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
    const splash = touch ? Math.max(0, 1 - (t - touch.t0) / TOUCH_MS) : 0;
    if (splash > 0 && touch) {
      const glow = n.createRadialGradient(touch.x, touch.y, 0, touch.x, touch.y, 150);
      glow.addColorStop(0, `rgba(${MINT}, ${0.35 * splash})`);
      glow.addColorStop(1, `rgba(${MINT}, 0)`);
      n.fillStyle = glow;
      n.beginPath(); n.arc(touch.x, touch.y, 150, 0, 6.283); n.fill();
    }
    /* The mass's own fibres: faint, lighting near the chosen idea. */
    n.lineWidth = 1 / s;
    for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j], dx = a.x - b.x, dy = a.y - b.y;
      if (dx * dx + dy * dy > 2600) continue;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      const hot = seat ? Math.hypot(mx - seat[0], my - seat[1]) < 140 : false;
      n.strokeStyle = hot ? `rgba(${tone}, .5)` : "rgba(239, 230, 211, .07)";
      n.beginPath(); n.moveTo(a.x, a.y); n.lineTo(b.x, b.y); n.stroke();
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
  const loop = (t: number) => { if (!running) return; step(t); draw(t); raf = requestAnimationFrame(loop); };
  const resize = new ResizeObserver(size);
  resize.observe(field);
  if (reduced) particles.forEach((p) => { p.x = p.hx; p.y = p.hy; });
  size();
  const visibility = new IntersectionObserver(([entry]) => {
    const was = running;
    running = entry.isIntersecting && !reduced;
    if (running && !was) raf = requestAnimationFrame(loop);
  });
  visibility.observe(field);

  return {
    /** The reader chose an idea: the brain follows it and stops turning by itself. */
    select(id: string, byReader: boolean) {
      active = id;
      if (byReader) pinned = true;
      if (reduced || !running) draw(performance.now());
    },
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resize.disconnect();
      field.removeEventListener("pointerdown", down);
      field.removeEventListener("pointermove", move);
      field.removeEventListener("pointerleave", leave);
      field.classList.remove("is-liquid");
      defs.remove(); goo.remove(); net.remove();
    },
  };
}
