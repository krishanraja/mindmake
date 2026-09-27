import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Films and images arrive by fading up rather than cutting in (Krish,
 * 2026-09-27: the loading is "so blunt, needs to be much smoother").
 *
 * On /ai-brain the page's words painted first and its film's poster cut in
 * over the dark ground a moment later. Any film or image on the page that has
 * not yet painted when the page mounts now starts transparent and fades up
 * once it has something to show. Media that is already there (cached, or
 * painted by the server render) is left alone, so nothing that is visible is
 * ever hidden. A slow file is never held back for long: after two and a half
 * seconds it shows as it is. The homepage's opening keeps its own settle.
 *
 * It renders nothing, so the prerendered and hydrated trees are unchanged.
 */
const READY_LIMIT = 2500;

const posterReady = (video: HTMLVideoElement) => {
  if (!video.poster) return Promise.resolve();
  const probe = new Image();
  probe.src = video.poster;
  if (probe.complete) return null;
  return new Promise<void>((resolve) => { probe.onload = probe.onerror = () => resolve(); });
};

export function MediaArrival() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    const reveal = (node: HTMLElement) => {
      if (node.dataset.mmMedia !== "pending") return;
      node.dataset.mmMedia = "ready";
      timers.push(window.setTimeout(() => { delete node.dataset.mmMedia; }, 900));
    };
    const media = [...document.querySelectorAll<HTMLElement>("main video, main img")]
      .filter((node) => !node.closest(".mm-homepage-release, [data-mm-media-still]"));
    for (const node of media) {
      let ready: Promise<unknown> | null = null;
      if (node instanceof HTMLImageElement) {
        if (node.complete) continue;
        ready = new Promise((resolve) => { node.addEventListener("load", resolve, { once: true }); node.addEventListener("error", resolve, { once: true }); });
      } else if (node instanceof HTMLVideoElement) {
        if (node.readyState >= 2) continue;
        const poster = posterReady(node);
        if (poster === null) continue;
        ready = Promise.race([poster.then(() => node.poster ? undefined : new Promise((resolve) => node.addEventListener("loadeddata", resolve, { once: true }))), new Promise((resolve) => node.addEventListener("loadeddata", resolve, { once: true }))]);
      }
      if (!ready) continue;
      node.dataset.mmMedia = "pending";
      void ready.then(() => requestAnimationFrame(() => reveal(node)));
      timers.push(window.setTimeout(() => reveal(node), READY_LIMIT));
    }
    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      for (const node of media) delete node.dataset.mmMedia;
    };
  }, [pathname]);
  return null;
}
