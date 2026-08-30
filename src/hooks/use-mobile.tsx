import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Whether this is a narrow screen, answered the same way on both sides.
 *
 * It starts false and corrects on mount, and the false is not a guess about the
 * device: it is the answer the server gave. The pages are rendered to HTML at
 * build time, where there is no viewport at all, so a hook that read
 * `window.innerWidth` in its initialiser disagreed with the server on the very
 * first client render. What that looks like is not a warning in a console, it
 * is a flash: `MobileChapter` renders every item on the server and three on a
 * phone, so the page arrives whole and then visibly shortens.
 *
 * The cost is one frame of the wide answer on a narrow screen. The alternative
 * costs a hydration mismatch on every page that asks, which is the defect the
 * whole entrance rebuild exists to remove.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    // Sync immediately on mount, which is where the real answer comes from.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
