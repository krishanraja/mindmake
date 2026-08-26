import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "mindmaker_consent";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const noticeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // A blocked storage API should not hide the privacy notice.
      setVisible(true);
    }
  }, []);

  useLayoutEffect(() => {
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
      className="mm-cookie-notice fixed bottom-0 left-0 right-0 z-[150] border-t border-white/10 bg-ink/95 backdrop-blur-md"
      style={{
        paddingTop: "4px",
        paddingRight: "max(8px, env(safe-area-inset-right))",
        paddingBottom: "max(4px, env(safe-area-inset-bottom))",
        paddingLeft: "max(8px, env(safe-area-inset-left))",
      }}
      role="region"
      aria-labelledby="privacy-notice-title"
      aria-live="polite"
    >
      <h2 id="privacy-notice-title" className="sr-only">Privacy notice</h2>
      <div className="container-width flex items-center justify-between gap-3 md:gap-5">
        <p className="max-w-3xl text-[12px] leading-4 text-white/80 sm:text-sm sm:leading-5">
          Private analytics help us improve this site.{" "}
          <a href="/privacy" className="inline-flex min-h-11 min-w-11 items-center justify-center px-1 align-middle text-mint underline underline-offset-2">
            Privacy
          </a>.
        </p>
        <Button
          size="sm"
          className="h-11 shrink-0 bg-mint px-4 font-semibold text-ink hover:bg-mint/90"
          onClick={accept}
        >
          Got it
        </Button>
      </div>
    </div>
  );
};
