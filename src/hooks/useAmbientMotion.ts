import { useEffect, useState } from "react";

/**
 * Whether this visitor should be served moving footage.
 *
 * Starts false and only turns true after the browser has confirmed it, which
 * does two jobs at once. Someone who asked for reduced motion never sees a
 * frame of video, because the loop is never mounted rather than mounted and
 * paused. And the prerendered HTML always carries the poster, so the largest
 * element on the page is an image that is already in the markup rather than a
 * video the browser has to go and fetch.
 *
 * A deliberate click to play is a different thing and does not consult this:
 * the visitor asked for that one.
 */
export function useAmbientMotion(): boolean {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      setAllowed(true);
      return;
    }
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAllowed(!query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return allowed;
}
