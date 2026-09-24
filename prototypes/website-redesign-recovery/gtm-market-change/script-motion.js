const root = document.documentElement;
const scenes = [...document.querySelectorAll("[data-motion-scene]")];
const videos = scenes.map((scene) => scene.querySelector("[data-motion-video]")).filter(Boolean);
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const visibility = new Map(scenes.map((scene) => [scene, 0]));

let observer;
let activeVideo = null;

function motionAllowed() {
  return !reducedMotion.matches && !connection?.saveData;
}

function pauseAll() {
  for (const video of videos) {
    video.pause();
    video.closest("[data-motion-scene]")?.setAttribute("data-motion-state", "poster");
  }
  activeVideo = null;
  delete root.dataset.activeFilm;
}

function loadVideo(video) {
  if (video.src || !video.dataset.src) return;
  video.src = video.dataset.src;
  video.load();
}

async function playBestVisible() {
  if (!motionAllowed() || document.hidden) {
    pauseAll();
    root.dataset.motionPolicy = "poster";
    return;
  }

  root.dataset.motionPolicy = "motion";
  const ranked = [...scenes]
    .map((scene) => ({ scene, ratio: visibility.get(scene) || 0 }))
    .filter(({ ratio }) => ratio >= 0.28)
    .sort((a, b) => b.ratio - a.ratio);
  const nextScene = ranked[0]?.scene;
  const nextVideo = nextScene?.querySelector("[data-motion-video]") || null;

  for (const video of videos) {
    if (video !== nextVideo) {
      video.pause();
      video.closest("[data-motion-scene]")?.setAttribute("data-motion-state", "poster");
    }
  }

  if (!nextVideo) {
    activeVideo = null;
    delete root.dataset.activeFilm;
    return;
  }

  loadVideo(nextVideo);
  activeVideo = nextVideo;
  root.dataset.activeFilm = nextVideo.dataset.motionVideo;

  try {
    await nextVideo.play();
    if (activeVideo === nextVideo) nextScene.setAttribute("data-motion-state", "playing");
  } catch {
    nextScene.setAttribute("data-motion-state", "poster");
  }
}

function observeScenes() {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) visibility.set(entry.target, entry.intersectionRatio);
      void playBestVisible();
    },
    { threshold: [0, 0.28, 0.5, 0.75, 1] }
  );
  for (const scene of scenes) observer.observe(scene);
}

for (const video of videos) {
  video.muted = true;
  video.addEventListener("error", () => {
    video.closest("[data-motion-scene]")?.setAttribute("data-motion-state", "unavailable");
    if (videos.every((item) => item.error)) root.dataset.motionPolicy = "unavailable";
  });
}

reducedMotion.addEventListener?.("change", () => void playBestVisible());
connection?.addEventListener?.("change", () => void playBestVisible());
document.addEventListener("visibilitychange", () => void playBestVisible());

observeScenes();
