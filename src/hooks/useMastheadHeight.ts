import { useEffect, type RefObject } from "react";

/** Both homepage variants are mounted. Only the visible masthead has a height. */
export function useMastheadHeight(root: RefObject<HTMLElement>, selector: string) {
  useEffect(() => {
    const host = root.current;
    if (!host) return;
    const headers = Array.from(host.querySelectorAll<HTMLElement>(selector));
    const measure = () => {
      const height = Math.max(0, ...headers.map(header => header.getBoundingClientRect().height));
      if (height > 0) host.style.setProperty("--mm-measured-nav-height", height + "px");
    };
    measure();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    headers.forEach(header => observer?.observe(header));
    return () => {
      observer?.disconnect();
      host.style.removeProperty("--mm-measured-nav-height");
    };
  }, [root, selector]);
}
