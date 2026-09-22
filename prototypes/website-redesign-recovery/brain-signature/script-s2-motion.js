const root = document.documentElement;
const scene = document.querySelector("[data-motion-scene]");
const video = scene?.querySelector("[data-motion-video]");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

let visibleRatio = 0;

function motionAllowed() {
  return !reducedMotion.matches && !connection?.saveData;
}

function pauseFilm(policy = "motion") {
  video?.pause();
  scene?.setAttribute("data-motion-state", "poster");
  root.dataset.motionPolicy = policy;
  delete root.dataset.activeFilm;
}

async function updateFilm() {
  if (!video || !scene) return;
  if (!motionAllowed() || document.hidden) {
    pauseFilm("poster");
    return;
  }

  root.dataset.motionPolicy = "motion";
  if (visibleRatio < 0.28) {
    pauseFilm("motion");
    return;
  }

  if (!video.src && video.dataset.src) {
    video.src = video.dataset.src;
    video.load();
  }

  root.dataset.activeFilm = video.dataset.motionVideo;
  try {
    await video.play();
    scene.dataset.motionState = "playing";
  } catch {
    scene.dataset.motionState = "poster";
  }
}

if (video && scene) {
  video.muted = true;
  video.addEventListener("error", () => {
    scene.dataset.motionState = "unavailable";
    root.dataset.motionPolicy = "unavailable";
    delete root.dataset.activeFilm;
  });

  const observer = new IntersectionObserver(
    ([entry]) => {
      visibleRatio = entry?.intersectionRatio || 0;
      void updateFilm();
    },
    { threshold: [0, 0.28, 0.5, 0.75, 1] }
  );
  observer.observe(scene);
}

reducedMotion.addEventListener?.("change", () => void updateFilm());
connection?.addEventListener?.("change", () => void updateFilm());
document.addEventListener("visibilitychange", () => void updateFilm());
