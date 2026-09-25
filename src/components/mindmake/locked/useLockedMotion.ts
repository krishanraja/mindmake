import { useEffect } from "react";
import type { RefObject } from "react";

type ConnectionWithSaveData = EventTarget & { saveData?: boolean };

export function useLockedMotion(rootRef: RefObject<HTMLElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const scenes = [...root.querySelectorAll<HTMLElement>("[data-motion-scene]")];
    const videos = scenes
      .map((scene) => scene.querySelector<HTMLVideoElement>("[data-motion-video]"))
      .filter((video): video is HTMLVideoElement => Boolean(video));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & {
      connection?: ConnectionWithSaveData;
      mozConnection?: ConnectionWithSaveData;
      webkitConnection?: ConnectionWithSaveData;
    }).connection
      ?? (navigator as Navigator & { mozConnection?: ConnectionWithSaveData }).mozConnection
      ?? (navigator as Navigator & { webkitConnection?: ConnectionWithSaveData }).webkitConnection;
    const visibility = new Map(scenes.map((scene) => [scene, 0]));
    let activeVideo: HTMLVideoElement | null = null;

    /* A page may offer the reader a pause (WCAG 2.2.2). It sets
       data-motion-paused on the root and dispatches mm:motion on it; the
       films then hold on their posters until the reader plays them again. */
    const motionAllowed = () => !reducedMotion.matches && !connection?.saveData && root.dataset.motionPaused !== "true";
    const pauseAll = (policy = "motion") => {
      for (const video of videos) {
        video.pause();
        video.closest<HTMLElement>("[data-motion-scene]")?.setAttribute("data-motion-state", "poster");
      }
      activeVideo = null;
      root.dataset.motionPolicy = policy;
      delete root.dataset.activeFilm;
    };

    const playBestVisible = async () => {
      if (!motionAllowed() || document.hidden) {
        pauseAll("poster");
        return;
      }

      root.dataset.motionPolicy = "motion";
      const nextScene = scenes
        .map((scene) => ({ scene, ratio: visibility.get(scene) ?? 0 }))
        .filter(({ ratio }) => ratio >= 0.28)
        .sort((left, right) => right.ratio - left.ratio)[0]?.scene;
      const nextVideo = nextScene?.querySelector<HTMLVideoElement>("[data-motion-video]") ?? null;

      for (const video of videos) {
        if (video !== nextVideo) {
          video.pause();
          video.closest<HTMLElement>("[data-motion-scene]")?.setAttribute("data-motion-state", "poster");
        }
      }

      if (!nextVideo) {
        activeVideo = null;
        delete root.dataset.activeFilm;
        return;
      }

      if (!nextVideo.src && nextVideo.dataset.src) {
        nextVideo.src = nextVideo.dataset.src;
        nextVideo.load();
      }
      activeVideo = nextVideo;
      root.dataset.activeFilm = nextVideo.dataset.motionVideo ?? "active";
      try {
        await nextVideo.play();
        if (activeVideo === nextVideo) nextScene.dataset.motionState = "playing";
      } catch {
        nextScene.dataset.motionState = "poster";
      }
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) visibility.set(entry.target as HTMLElement, entry.intersectionRatio);
      void playBestVisible();
    }, { threshold: [0, 0.28, 0.5, 0.75, 1] });

    const onError = (event: Event) => {
      const video = event.currentTarget as HTMLVideoElement;
      video.closest<HTMLElement>("[data-motion-scene]")?.setAttribute("data-motion-state", "unavailable");
      if (videos.every((item) => item.error)) root.dataset.motionPolicy = "unavailable";
    };
    const onPolicyChange = () => void playBestVisible();

    for (const scene of scenes) observer.observe(scene);
    for (const video of videos) {
      video.muted = true;
      video.addEventListener("error", onError);
    }
    reducedMotion.addEventListener?.("change", onPolicyChange);
    connection?.addEventListener?.("change", onPolicyChange);
    document.addEventListener("visibilitychange", onPolicyChange);
    root.addEventListener("mm:motion", onPolicyChange);

    return () => {
      observer.disconnect();
      for (const video of videos) video.removeEventListener("error", onError);
      reducedMotion.removeEventListener?.("change", onPolicyChange);
      connection?.removeEventListener?.("change", onPolicyChange);
      document.removeEventListener("visibilitychange", onPolicyChange);
      root.removeEventListener("mm:motion", onPolicyChange);
      pauseAll("poster");
    };
  }, [rootRef]);
}
