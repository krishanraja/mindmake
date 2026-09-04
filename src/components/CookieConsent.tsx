import { useState, useEffect, useLayoutEffect, useRef } from "react";

const CONSENT_KEY = "mindmake_consent";

/* useLayoutEffect on the server does nothing and React says so, once per page,
   which was twenty-one stack traces in a build log where a real warning has to
   be visible. The effect below is client-only in practice: it never runs until
   the notice is visible, and the notice is only ever made visible by an effect.
   Naming that is the whole fix; the browser still gets the layout effect, so
   the reserve is published before paint exactly as it was. */
const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  /**
   * Held back until the visitor leaves the first screen.
   *
   * As a corner card pinned to the bottom right it landed on top of the
   * homepage's two doors, which are the page's only primary action and happen
   * to sit at the foot of the first viewport. Nothing here reserves layout, so
   * the only way it cannot cover something is to appear once the reader has
   * moved past it. Anyone who never scrolls never sees a notice they also never
   * needed, and the moment they do scroll it arrives.
   */
  useEffect(() => {
    let asked = false;
    try {
      asked = localStorage.getItem(CONSENT_KEY) !== null;
    } catch {
      // A blocked storage API should not hide the privacy notice.
    }
    if (asked) return;

    const show = () => {
      if (window.scrollY < window.innerHeight * 0.6) return;
      setVisible(true);
      window.removeEventListener("scroll", show);
    };
    show();
    window.addEventListener("scroll", show, { passive: true });
    return () => window.removeEventListener("scroll", show);
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!visible) return;

    const root = document.documentElement;
    const notice = noticeRef.current;
    if (!notice) return;

    const publishReserve = () => {
      root.style.setProperty("--mm-cookie-reserve", `${notice.getBoundingClientRect().height}px`);
    };

    root.classList.add("mm-cookie-visible");
    publishReserve();

    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(publishReserve);
    observer?.observe(notice);
    window.addEventListener("resize", publishReserve);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", publishReserve);
      root.classList.remove("mm-cookie-visible");
      root.style.removeProperty("--mm-cookie-reserve");
    };
  }, [visible]);

  const accept = () => {
    try {
      localStorage.setItem(CONSENT_KEY, "accepted");
    } catch {
      // Keep the choice for this page view when storage is unavailable.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      ref={noticeRef}
      className="mm-cookie-notice"
      role="region"
      aria-labelledby="privacy-notice-title"
      aria-live="polite"
    >
      <h2 id="privacy-notice-title" className="mm-visually-hidden">Privacy notice</h2>
      {/* One line. It was three on a phone, plus a button, floating over the
          reading on every screen of the visit until dismissed. */}
      <p>
        Private analytics only. <a href="/privacy">Privacy</a>
      </p>
      <button className="mm-button mm-button-small" type="button" onClick={accept}>
        Got it
      </button>
    </div>
  );
};
