/**
 * vs-tilt-card (vividsites "Tilt Card", ported for mind/make on 2026-11-28).
 *
 * A collectible card that leans toward the pointer on a critically damped
 * spring, lifts, and throws a travelling glare and a contour foil. Click,
 * Enter or Space turns it over (the Holo Card's flip); arrow keys tilt it while
 * focused; a touch press tilts it toward the finger. Motion is transform and
 * opacity only, and the frame loop stops as soon as every spring settles.
 *
 * With reduced motion there is no tilt and the turn is instant. Without script
 * both faces stay readable (vs-tilt-card.css). The card is always the same
 * size, front or back, so turning it moves nothing around it.
 *
 * Returns a cleanup that removes every listener and cancels the loop.
 */
type Spring = { x: number; v: number; t: number; k: number; c: number };
const spring = (k: number, c: number, x = 0): Spring => ({ x, v: 0, t: x, k, c });

function mountCard(card: HTMLElement, signal: AbortSignal, reduce: MediaQueryList) {
  const q = <T extends Element = HTMLElement>(s: string) => card.querySelector<T>(s);
  const qa = (s: string) => [...card.querySelectorAll<HTMLElement>(s)];
  const body = q(".vs-tilt-card-body");
  const shadow = q(".vs-tilt-card-shadow");
  if (!body || !shadow) return;
  const imgs = qa(".vs-tilt-card-img");
  const contents = qa(".vs-tilt-card-content");
  const glares = qa(".vs-tilt-card-glare");
  const foils = qa(".vs-tilt-card-foil");
  const front = q(".vs-tilt-card-front");
  const back = q(".vs-tilt-card-back");
  /* The card's one control: a real button over the whole card, so both faces
     stay ordinary readable content beside it. */
  const toggle = q<HTMLButtonElement>(".vs-tilt-card-toggle");
  const read = (name: string, fallback: number) => {
    const value = parseFloat(getComputedStyle(card).getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  // Tension and friction: 170/26 is critically damped for the tilt; the turn overshoots a touch.
  const nx = spring(170, 26), ny = spring(170, 26), hov = spring(140, 24), sc = spring(320, 24, 1), fl = spring(95, 14);
  const all = [nx, ny, hov, sc, fl];
  let raf = 0, last = 0, flipped = false;
  let gK = read("--vs-tilt-card-glare", 0), fK = read("--vs-tilt-card-foil", 0), M = read("--vs-tilt-card-max", 11);
  const refresh = () => { gK = read("--vs-tilt-card-glare", 0); fK = read("--vs-tilt-card-foil", 0); M = read("--vs-tilt-card-max", 11); };

  const render = () => {
    const rx = -ny.x * M, ry = nx.x * M;
    body.style.transform = `rotateX(${rx.toFixed(3)}deg) rotateY(${(ry + fl.x * 180).toFixed(3)}deg) scale(${(sc.x * (1 + hov.x * .025)).toFixed(4)})`;
    shadow.style.transform = `translate3d(${(-nx.x * 14).toFixed(2)}px, ${(18 - ny.x * 10 + hov.x * 8).toFixed(2)}px, 0) scale(${(1 - (1 - sc.x) * 2).toFixed(4)})`;
    shadow.style.opacity = (0.7 + hov.x * 0.3).toFixed(3);
    imgs.forEach((el) => { el.style.transform = `translate3d(${(-nx.x * 9).toFixed(2)}px, ${(-ny.x * 9).toFixed(2)}px, 0)`; });
    contents.forEach((el) => { el.style.transform = `translate3d(${(nx.x * 5).toFixed(2)}px, ${(ny.x * 5).toFixed(2)}px, 0)`; });
    const d = Math.min(1, Math.hypot(nx.x, ny.x));
    glares.forEach((el) => {
      el.style.opacity = (hov.x * gK * (0.45 + 0.55 * d)).toFixed(3);
      (el.firstElementChild as HTMLElement | null)?.style.setProperty("transform", `translate3d(${(nx.x * 50).toFixed(2)}%, ${(ny.x * 50).toFixed(2)}%, 0)`);
    });
    foils.forEach((el) => {
      el.style.opacity = (hov.x * fK * (0.35 + 0.65 * d)).toFixed(3);
      (el.firstElementChild as HTMLElement | null)?.style.setProperty("transform", `translate3d(${(nx.x * 18 + ny.x * 8).toFixed(2)}%, 0, 0)`);
    });
  };
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const n = Math.max(1, Math.ceil(dt * 240)), h = dt / n;
    for (let i = 0; i < n; i++) for (const s of all) { s.v += (-s.k * (s.x - s.t) - s.c * s.v) * h; s.x += s.v * h; }
    render();
    if (all.every((s) => Math.abs(s.x - s.t) < 1e-4 && Math.abs(s.v) < 1e-3)) {
      all.forEach((s) => { s.x = s.t; s.v = 0; }); render(); raf = 0;
    } else raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } };
  const aim = (x: number, y: number, h: number) => {
    if (reduce.matches) return;
    nx.t = Math.max(-1, Math.min(1, x)); ny.t = Math.max(-1, Math.min(1, y)); hov.t = h; kick();
  };
  const fromEvent = (e: PointerEvent) => {
    const r = card.getBoundingClientRect();
    aim(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1, 1);
  };
  const rest = () => { nx.t = 0; ny.t = 0; hov.t = 0; sc.t = 1; kick(); };
  const flip = () => {
    flipped = !flipped; fl.t = flipped ? 1 : 0;
    toggle?.setAttribute("aria-pressed", String(flipped));
    card.classList.toggle("is-turned", flipped);
    front?.setAttribute("aria-hidden", String(flipped));
    back?.setAttribute("aria-hidden", String(!flipped));
    if (reduce.matches) { fl.x = fl.t; fl.v = 0; render(); } else kick();
  };

  const on = <K extends keyof HTMLElementEventMap>(type: K, fn: (e: HTMLElementEventMap[K]) => void) => card.addEventListener(type, fn, { signal });
  on("pointerenter", (e) => { refresh(); if (e.pointerType !== "touch") fromEvent(e); });
  on("pointermove", (e) => { if (e.pointerType !== "touch" || e.pressure > 0) fromEvent(e); });
  on("pointerleave", rest);
  on("pointercancel", rest);
  on("pointerdown", (e) => { sc.t = 0.965; if (e.pointerType === "touch") { refresh(); fromEvent(e); } kick(); });
  on("pointerup", (e) => { sc.t = 1; if (e.pointerType === "touch") setTimeout(rest, 260); kick(); });
  on("click", flip);
  /* Enter and Space press the button natively, which is the click above. */
  on("keydown", (e) => {
    const k = ({ ArrowLeft: [-.8, 0], ArrowRight: [.8, 0], ArrowUp: [0, -.8], ArrowDown: [0, .8] } as Record<string, [number, number]>)[e.key];
    if (k) { e.preventDefault(); refresh(); aim(k[0], k[1], 1); }
  });
  on("focusin", () => { if (toggle?.matches(":focus-visible")) { refresh(); aim(-.35, -.45, .8); } });
  on("focusout", rest);
  front?.setAttribute("aria-hidden", "false");
  back?.setAttribute("aria-hidden", "true");
  card.classList.add("is-live");
  render();
  signal.addEventListener("abort", () => {
    cancelAnimationFrame(raf);
    card.classList.remove("is-live");
    front?.removeAttribute("aria-hidden");
    back?.removeAttribute("aria-hidden");
  });
}

export function mountTiltCards(root: ParentNode): () => void {
  const abort = new AbortController();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  root.querySelectorAll<HTMLElement>(".vs-tilt-card").forEach((card) => mountCard(card, abort.signal, reduce));
  return () => abort.abort();
}
