import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { setBottomReserve } from "@/lib/bottomReserve";

/**
 * The way in, pinned to the bottom of the screen.
 *
 * One button and nothing else (Ruling, Krish, 2026-10-24: "they should just
 * have one call to action"). The bar used to carry a second slot, a door to the
 * other offer route, and with the analytics notice beside it a reader on
 * /ai-brain faced four controls at the bottom of the screen. The other route is
 * one quiet line at the foot of each offer page and in the menu; the bar is a
 * place to act, not a place to navigate.
 *
 * ## Non-duplicative
 *
 * It waits until the page's own first way in (the hero button, marked
 * `data-mm-hero`) has scrolled away above the reader, or, on a page without
 * one, until the reader has left the first screen. It stands down entirely
 * whenever any of the page's own primary actions is on screen, so a reader
 * never sees two ways in at once. It reserves its measured height at the foot
 * of the page, so it never covers the last thing somebody is reading.
 *
 * The rules live in `mindmake.css` beside the `--mm-bar-reserve` token that
 * the footer reads.
 */

interface SiteActionBarProps {
  onStart: () => void;
  label: string;
}

export function SiteActionBar({ onStart, label }: SiteActionBarProps) {
  const [shown, setShown] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* Shown once the page's own first way in has gone above the reader (or,
     where a page has none, after the first screen), and hidden again whenever
     the page's own primary action is on screen. The bar exists so the action is reachable
     while none is in front of the reader; alongside one it is a second way in,
     which is how the foot of /ai-gtm ended up showing three at once and how the
     try-it panel ended up competing with a bar offering something else.
     Anything that is a way in carries data-mm-primary. The bar's own action
     deliberately does not: it would see itself and never appear. */
  useEffect(() => {
    const decide = () => {
      const hero = document.querySelector("[data-mm-hero]");
      const past = hero ? hero.getBoundingClientRect().bottom < 0 : window.scrollY > window.innerHeight * 0.8;
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
      setBottomReserve("--mm-bar-reserve", `${bar.getBoundingClientRect().height}px`);
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
      <div className="mm-action-bar-inner">
        <button
          className="mm-button"
          type="button"
          tabIndex={shown ? 0 : -1}
          onClick={() => {
            track("scoping_request", { source: "action_bar" });
            onStart();
          }}
        >
          {label} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
