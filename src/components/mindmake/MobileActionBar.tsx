import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

/**
 * The primary action, always one tap away on a phone.
 *
 * A phone reader meets four to eight screens of page before reaching the close
 * block, and until now the only way to act was to arrive at the bottom. The bar
 * carries the same single action the rest of the site offers, so the answer to
 * "I want to start" is never "keep scrolling".
 *
 * It waits until the reader has left the first screen, for the same reason the
 * privacy notice does: the hero has its own actions and a fixed bar would sit
 * on top of them. It also reserves its own height at the foot of the page, so
 * it never covers the last thing somebody is reading.
 */
export function MobileActionBar({ onStart }: { onStart: () => void }) {
  const [shown, setShown] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* Shown after the first screen, and hidden again whenever the page's own
     primary action is on screen. The bar exists so the action is reachable
     while none is in front of the reader; alongside one it is a second way in,
     which is how the foot of /ai-gtm ended up showing three at once and how the
     try-it panel ended up competing with a bar offering something else.
     Anything that is a way in carries data-mm-primary. */
  useEffect(() => {
    const decide = () => {
      const past = window.scrollY > window.innerHeight * 0.8;
      /* Any part of it on screen, with no grace margin. A margin here means a
         band of scroll positions where the page's own button is visible and the
         bar is still up, which is exactly the two-ways-in this is meant to
         prevent; the bar is fixed to the bottom of the screen, so a close-block
         button entering from below arrives underneath it and standing down at
         that moment is the correct behaviour rather than a flicker. */
      const competing = [...document.querySelectorAll("[data-mm-primary]")].some((el) => {
        const box = el.getBoundingClientRect();
        return box.bottom > 0 && box.top < window.innerHeight;
      });
      setShown(past && !competing);
    };
    decide();
    window.addEventListener("scroll", decide, { passive: true });
    window.addEventListener("resize", decide);
    return () => {
      window.removeEventListener("scroll", decide);
      window.removeEventListener("resize", decide);
    };
  }, []);

  /* Its own height, published for the footer to reserve. Measured rather than
     written down: the number used to live in two stylesheets as `76px`, with a
     comment in each asking the other not to drift. */
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("mm-bar-visible", shown);
    const bar = barRef.current;
    if (!shown || !bar) {
      root.style.removeProperty("--mm-bar-reserve");
      return () => root.classList.remove("mm-bar-visible");
    }

    const publishReserve = () => {
      root.style.setProperty("--mm-bar-reserve", `${bar.getBoundingClientRect().height}px`);
    };
    publishReserve();
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(publishReserve);
    observer?.observe(bar);
    window.addEventListener("resize", publishReserve);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", publishReserve);
      root.classList.remove("mm-bar-visible");
      root.style.removeProperty("--mm-bar-reserve");
    };
  }, [shown]);

  return (
    <div ref={barRef} className={`mm-action-bar${shown ? " is-shown" : ""}`} aria-hidden={!shown}>
      <button
        className="mm-button"
        type="button"
        tabIndex={shown ? 0 : -1}
        onClick={() => {
          track("scoping_request", { source: "mobile_bar" });
          onStart();
        }}
      >
        Start here <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
