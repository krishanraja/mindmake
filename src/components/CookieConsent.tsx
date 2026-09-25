import { useState, useEffect, useLayoutEffect, useRef } from "react";

const CONSENT_KEY = "mindmake_consent";
/* "analytics" allows Google Analytics and "essential" declines it. Any stored
   value means the visitor has answered, including the older "accepted", which
   was given to a Plausible-only notice and is never read as a yes to Google. */
const ALLOW = "analytics";
const DECLINE = "essential";

declare global {
  interface Window {
    mmLoadGoogleTag?: () => void;
  }
}

function remember(choice: string) {
  try {
    localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Keep the choice for this page view when storage is unavailable.
  }
}

/**
 * Withdrawing is as easy as allowing: forget the answer, remove the Google
 * Analytics cookies and reload, so the page starts without the tag and the
 * notice asks again.
 */
export function resetAnalyticsChoice() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Nothing stored to forget.
  }
  const host = window.location.hostname.split(".").slice(-2).join(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    for (const domain of ["", `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
  window.location.reload();
}

export const AnalyticsChoiceReset = () => (
  <button className="mm-text-button" type="button" onClick={resetAnalyticsChoice}>
    Change your analytics choice
  </button>
);

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

    /* The space the notice occupies at the bottom of the screen, which is its
       height plus whatever gap it leaves under itself. On a phone it is a strip
       flush to the bottom edge, so the gap is zero and this is exactly the
       height it always published. On a desktop it is a corner card inset from
       the bottom, and publishing the height alone put the action bar 14px into
       it: the bar cleared 40px of card while the card's own top edge was 54px
       up. Measured from the viewport rather than added as a constant, so a
       change to the card's inset cannot leave a copy of it here to drift. */
    const publishReserve = () => {
      const box = notice.getBoundingClientRect();
      const occupied = Math.max(0, window.innerHeight - box.top);
      root.style.setProperty("--mm-cookie-reserve", `${occupied}px`);
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

  const allow = () => {
    remember(ALLOW);
    window.mmLoadGoogleTag?.();
    setVisible(false);
  };

  const decline = () => {
    remember(DECLINE);
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
        Allow Google Analytics? <a href="/privacy">Privacy</a>
      </p>
      {/* One group, so a narrow row moves both answers down together rather
          than leaving Decline alone on a line of its own. */}
      <div className="mm-cookie-actions">
        <button className="mm-button mm-button-small" type="button" onClick={allow}>
          Allow
        </button>
        <button className="mm-button mm-button-small" type="button" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  );
};
