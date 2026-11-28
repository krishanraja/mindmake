/**
 * The AI brain on /ai-brain, drawn in three.js (Krish, 2026-11-28: "the brain
 * should be a lot better looking ... light up in different places as
 * different parts of the page come in to scroll").
 *
 * After the Engram species (one faceted subject, a two-temperature light that
 * makes it read off near-black, render on demand), reskinned to mind/make: a
 * faceted brain in deep green glass-like facets, lit cool mint from one side
 * and warm amber from the face, on the page's own ink. The model is a Meshy
 * image-to-3D mesh of a still made for it (src/assets/brain/brain.glb, Draco),
 * decoded by the Draco decoder served from /draco/ (never a third-party CDN).
 *
 * Six parts sit on its surface. The active part glows: a mint bloom painted
 * into the facets around it, a bright point, and the brain turns a little to
 * face it. The labels are the page's own buttons; this module only tells the
 * page where each part is on screen, so the words stay in the HTML.
 *
 * It renders only while something moves, stops off screen and in a hidden
 * tab, caps the pixel ratio at 2, and with reduced motion holds still with no
 * lean or idle turn. Every resource is released on destroy.
 */
import {
  ACESFilmicToneMapping, AdditiveBlending, BufferGeometry, CanvasTexture, Color, DirectionalLight, Group, HemisphereLight,
  Mesh, MeshPhysicalMaterial, PerspectiveCamera, PointLight, Raycaster, Scene, Sprite, SpriteMaterial, SRGBColorSpace,
  Vector3, WebGLRenderer, type Material,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import brainUrl from "@/assets/brain/brain.glb?url";

export interface BrainSceneOptions {
  parts: readonly string[];
  reduced: boolean;
  /** Called after each frame with each part's place on the canvas, 0..1, and whether it faces the camera. */
  onLayout: (layout: Record<string, { x: number; y: number; front: boolean }>) => void;
  onReady?: () => void;
}

export interface BrainScene {
  select(part: string | null): void;
  destroy(): void;
}

/* Directions from the brain's centre, in its own space, toward each part.
   They are cast onto the surface once the model loads. */
const DIRECTIONS: Record<string, [number, number, number]> = {
  "North Star": [0, 1, 0.12],
  Vision: [0.15, 0.55, 1],
  Judgement: [-0.85, 0.35, 0.55],
  Taste: [0.95, 0.25, 0.2],
  Standards: [-0.1, 0.45, -1],
  Preferences: [-0.8, -0.35, -0.45],
};

const MINT = new Color("#9ff1c9");
const DEEP = new Color("#123a2b");

/** A soft round glow for each part's point. */
function glowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const g = canvas.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(.25, "rgba(200,255,228,.75)");
  grad.addColorStop(1, "rgba(159,241,201,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch { return false; }
}

export function mountBrainScene(host: HTMLElement, options: BrainSceneOptions): BrainScene {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.className = "brain-gl";
  canvas.setAttribute("aria-hidden", "true");
  host.prepend(canvas);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0.15, 6.2);

  /* Two temperatures: cool mint from the side and above, warm amber on the face. */
  scene.add(new HemisphereLight(0xcff7e6, 0x08140f, 0.7));
  const key = new DirectionalLight(0xdffbee, 2.2); key.position.set(-3, 4, 3); scene.add(key);
  const warm = new DirectionalLight(0xffc27a, 1.5); warm.position.set(3.5, -0.5, 4); scene.add(warm);
  const rim = new DirectionalLight(0x6fe0b0, 1.6); rim.position.set(0, 2, -5); scene.add(rim);
  const spot = new PointLight(0x9ff1c9, 0, 2.6, 1.6); scene.add(spot);

  const pivot = new Group();
  scene.add(pivot);

  /* The active part's place, painted into the facets: a mint bloom that fades
     with distance from it (uActive), scaled by the part's glow (uGlow). */
  const uniforms = { uActive: { value: new Vector3(0, 10, 0) }, uGlow: { value: 0 } };
  const material = new MeshPhysicalMaterial({
    color: DEEP, metalness: 0.15, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.12,
    iridescence: 0.55, iridescenceIOR: 1.35, iridescenceThicknessRange: [120, 480],
    sheen: 0.6, sheenColor: new Color("#7fe3b4"), sheenRoughness: 0.4, flatShading: true,
  });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uActive = uniforms.uActive;
    shader.uniforms.uGlow = uniforms.uGlow;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBrainPos;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvBrainPos = position;");
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vBrainPos;\nuniform vec3 uActive;\nuniform float uGlow;")
      .replace("#include <emissivemap_fragment>", `#include <emissivemap_fragment>
        float brainD = distance(vBrainPos, uActive);
        totalEmissiveRadiance += vec3(0.62, 0.95, 0.79) * uGlow * (smoothstep(0.8, 0.0, brainD) * 0.85 + smoothstep(0.26, 0.0, brainD) * 1.1);`);
  };

  const glowMap = glowTexture();
  const points = new Map<string, { local: Vector3; sprite: Sprite; glow: number }>();
  let mesh: Mesh<BufferGeometry, Material> | null = null;
  let ready = false;
  let destroyed = false;

  /* Springs: yaw and pitch toward the reader's pointer and the active part,
     each part's glow toward on or off. Critically damped, like the cards. */
  const target = { yaw: 0.35, pitch: 0.06 }, state = { yaw: 0.35, pitch: 0.06, vy: 0, vp: 0 };
  const lean = { x: 0, y: 0, ex: 0, ey: 0 };
  let active: string | null = null;
  let raf = 0, last = 0, visible = true;
  const width = () => host.clientWidth || 1, height = () => host.clientHeight || 1;

  const resize = () => {
    renderer.setSize(width(), height(), false);
    camera.aspect = width() / height();
    camera.updateProjectionMatrix();
    kick();
  };

  const layout = () => {
    const out: Record<string, { x: number; y: number; front: boolean }> = {};
    const camDir = new Vector3();
    for (const [name, point] of points) {
      const world = point.local.clone();
      pivot.localToWorld(world);
      const normal = world.clone().normalize();
      camDir.copy(camera.position).sub(world).normalize();
      const projected = world.clone().project(camera);
      out[name] = { x: (projected.x + 1) / 2, y: (1 - projected.y) / 2, front: normal.dot(camDir) > -0.15 };
    }
    options.onLayout(out);
  };

  const render = () => {
    pivot.rotation.set(state.pitch + lean.ey * 0.18, state.yaw + lean.ex * 0.32, -0.04);
    renderer.render(scene, camera);
    if (ready) layout();
  };

  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    let moving = false;
    if (!options.reduced) {
      /* Critically damped (c = 2·√k): it turns to its target and settles,
         and the loop stops, so a still brain costs nothing. */
      const k = 26, c = 10.2;
      state.vy += (-k * (state.yaw - target.yaw) - c * state.vy) * dt; state.yaw += state.vy * dt;
      state.vp += (-k * (state.pitch - target.pitch) - c * state.vp) * dt; state.pitch += state.vp * dt;
      lean.ex += (lean.x - lean.ex) * Math.min(1, dt * 4); lean.ey += (lean.y - lean.ey) * Math.min(1, dt * 4);
      moving = Math.abs(state.vy) > 1e-3 || Math.abs(state.yaw - target.yaw) > 1e-3 || Math.abs(state.vp) > 1e-3
        || Math.abs(lean.x - lean.ex) > 1e-3 || Math.abs(lean.y - lean.ey) > 1e-3;
    } else { state.yaw = target.yaw; state.pitch = target.pitch; }
    let glowing = false;
    for (const [name, point] of points) {
      const want = name === active ? 1 : 0;
      point.glow += (want - point.glow) * (options.reduced ? 1 : Math.min(1, dt * 6));
      if (Math.abs(want - point.glow) > 1e-3) glowing = true;
      const scale = 0.14 + point.glow * 0.5;
      point.sprite.scale.set(scale, scale, 1);
      (point.sprite.material as SpriteMaterial).opacity = 0.35 + point.glow * 0.65;
    }
    const lit = active ? points.get(active) : undefined;
    uniforms.uGlow.value = lit ? lit.glow : Math.max(0, uniforms.uGlow.value - dt * 3);
    spot.intensity = (lit?.glow ?? 0) * 3.2;
    render();
    if (visible && (moving || glowing) && !destroyed) raf = requestAnimationFrame(tick);
    else raf = 0;
  };
  function kick() {
    if (!raf && visible && !destroyed) { last = performance.now(); raf = requestAnimationFrame(tick); }
  }

  /* Face the active part: turn so its direction points at the camera. */
  const face = (name: string | null) => {
    const point = name ? points.get(name) : undefined;
    if (!point) { target.yaw = 0.35; target.pitch = 0.06; return; }
    const d = point.local.clone().normalize();
    target.yaw = Math.max(-1.1, Math.min(1.1, -Math.atan2(d.x, d.z) * 0.85));
    target.pitch = Math.max(-0.35, Math.min(0.5, Math.asin(Math.max(-1, Math.min(1, d.y))) * 0.35));
  };

  const draco = new DRACOLoader().setDecoderPath("/draco/");
  draco.setDecoderConfig({ type: "wasm" });
  const loader = new GLTFLoader().setDRACOLoader(draco);
  loader.load(brainUrl, (gltf) => {
    if (destroyed) return;
    let found: Mesh | null = null;
    gltf.scene.traverse((node) => { if (!found && (node as Mesh).isMesh) found = node as Mesh; });
    if (!found) return;
    const source = found as Mesh;
    const geometry = (source.geometry as BufferGeometry).clone();
    geometry.computeBoundingBox();
    const box = geometry.boundingBox!;
    const centre = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    /* Scale, then centre (the Engram warning: centring before scaling sends a
       scaled model off its pivot). */
    const k = 2.9 / Math.max(size.x, size.y, size.z);
    geometry.translate(-centre.x, -centre.y, -centre.z);
    geometry.scale(k, k, k);
    geometry.deleteAttribute("normal");
    const flat = geometry.index ? geometry.toNonIndexed() : geometry;
    flat.computeVertexNormals();
    mesh = new Mesh(flat, material);
    pivot.add(mesh);
    /* Cast each part's direction onto the surface. */
    const ray = new Raycaster();
    for (const name of options.parts) {
      const dir = new Vector3(...(DIRECTIONS[name] ?? [0, 1, 0])).normalize();
      ray.set(dir.clone().multiplyScalar(4), dir.clone().negate());
      const hit = ray.intersectObject(mesh, false)[0];
      const local = hit ? hit.point.clone().add(dir.clone().multiplyScalar(0.02)) : dir.clone().multiplyScalar(1.2);
      const sprite = new Sprite(new SpriteMaterial({ map: glowMap, color: MINT, blending: AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
      sprite.position.copy(local);
      pivot.add(sprite);
      points.set(name, { local, sprite, glow: 0 });
    }
    ready = true;
    face(active);
    if (active) { uniforms.uActive.value.copy(points.get(active)!.local); spot.position.copy(points.get(active)!.local).multiplyScalar(1.4); }
    options.onReady?.();
    kick();
  }, undefined, () => { /* A failed load leaves the page's own labels in place. */ });

  const ro = new ResizeObserver(resize);
  ro.observe(host);
  resize();

  const onPointer = (event: PointerEvent) => {
    if (options.reduced || event.pointerType === "touch") return;
    const box = host.getBoundingClientRect();
    lean.x = Math.max(-1, Math.min(1, ((event.clientX - box.left) / box.width) * 2 - 1));
    lean.y = Math.max(-1, Math.min(1, ((event.clientY - box.top) / box.height) * 2 - 1));
    kick();
  };
  const onLeave = () => { lean.x = 0; lean.y = 0; kick(); };
  host.addEventListener("pointermove", onPointer);
  host.addEventListener("pointerleave", onLeave);
  const onVisibility = () => { visible = !document.hidden && onScreen; if (visible) kick(); };
  let onScreen = true;
  const watch = () => {
    const box = host.getBoundingClientRect();
    const now = box.bottom > 0 && box.top < innerHeight;
    if (now !== onScreen) { onScreen = now; onVisibility(); }
  };
  addEventListener("scroll", watch, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  return {
    select(name) {
      if (name === active) return;
      active = name;
      const point = name ? points.get(name) : undefined;
      if (point) {
        uniforms.uActive.value.copy(point.local);
        spot.position.copy(point.local).multiplyScalar(1.4);
      }
      face(name);
      kick();
    },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      host.removeEventListener("pointermove", onPointer);
      host.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", watch);
      document.removeEventListener("visibilitychange", onVisibility);
      for (const point of points.values()) (point.sprite.material as SpriteMaterial).dispose();
      glowMap.dispose();
      mesh?.geometry.dispose();
      material.dispose();
      draco.dispose();
      renderer.dispose();
      canvas.remove();
    },
  };
}
