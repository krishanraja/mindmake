import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { setBottomReserve } from "@/lib/bottomReserve";
import { overlapsContent } from "@/lib/actionBarOverlap";

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
 * never sees two ways in at once. It floats rather than taking a band of the
 * screen, and reserves its measured height only at the foot of the page, so
 * it never covers the last thing somebody is reading.
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
  const [tucked, setTucked] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* A floating button, not a band (owner, 2026-11-10): on a phone it steps
     aside while the reader scrolls down through a section, so it never sits
     on the words they are reading, and comes back as soon as they stop or
     turn back up. A laptop keeps it in the corner, clear of the measure. */
  useEffect(() => {
    const narrow = window.matchMedia?.("(max-width: 767px)");
    if (!narrow) return;
    let lastY = window.scrollY;
    let settle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      lastY = y;
      if (!narrow.matches || barRef.current?.contains(document.activeElement)) { setTucked(false); return; }
      window.clearTimeout(settle);
      if (delta > 3) setTucked(true);
      else if (delta < -3) setTucked(false);
      settle = window.setTimeout(() => setTucked(false), 520);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(settle);
    };
  }, []);

  /* Shown once the page's own first way in has gone above the reader (or,
     where a page has none, after the first screen), and hidden again whenever
     the page's own primary action is on screen. The bar exists so the action is reachable
     while none is in front of the reader; alongside one it is a second way in,
     which is how the foot of /ai-gtm ended up showing three at once and how the
     try-it panel ended up competing with a bar offering something else.
     Anything that is a way in carries data-mm-primary. The bar's own action
     deliberately does not: it would see itself and never appear.

     It also steps aside whenever it would sit on something the reader could
     tap or look at: a link, an arrow, a story card, a picture (audit BAR-02,
     2026-11-10: on /blog and /case-studies it covered links and story
     titles). It comes back once that spot has been clear for a moment, so it
     does not flicker over a list of links. */
  const [blocked, setBlocked] = useState(false);
  useEffect(() => {
    let frame = 0;
    let clearSince = 0;
    let clearTimer = 0;
    const masthead = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mm-header-height")) || 64;
    const decide = () => {
      frame = 0;
      const top = masthead();
      const hero = document.querySelector("[data-mm-hero]");
      const past = hero ? hero.getBoundingClientRect().bottom < top : window.scrollY > window.innerHeight * 0.8;
      /* Any part of it on screen below the masthead, with no grace margin: a
         margin here means a band of scroll where the page's own button is
         visible and the bar is still up, which is the two-ways-in this is
         meant to prevent. */
      const competing = [...document.querySelectorAll("[data-mm-primary]")].some((el) => {
        const box = el.getBoundingClientRect();
        return box.bottom > top && box.top < window.innerHeight && box.width > 0;
      });
      setShown(past && !competing);
      const bar = barRef.current;
      if (!bar || bar.contains(document.activeElement)) { setBlocked(false); return; }
      const over = overlapsContent(bar);
      window.clearTimeout(clearTimer);
      if (over) { clearSince = 0; setBlocked(true); return; }
      if (!clearSince) clearSince = performance.now();
      const wait = 120 - (performance.now() - clearSince);
      if (wait <= 0) setBlocked(false);
      else clearTimer = window.setTimeout(() => { frame = frame || requestAnimationFrame(decide); }, wait);
    };
    const request = () => { if (!frame) frame = requestAnimationFrame(decide); };
    decide();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(clearTimer);
    };
  }, []);

  /* Not focusable, and not announced, while it is off screen or stepped aside. */
  const visible = shown && !blocked && !tucked;
  useEffect(() => {
    const bar = barRef.current;
    if (bar) bar.inert = !visible;
  }, [visible]);

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
    <div ref={barRef} className={`mm-action-bar${shown && !blocked ? " is-shown" : ""}${tucked ? " is-tucked" : ""}`} aria-hidden={!visible}>
      <div className="mm-action-bar-inner">
        <button
          className="mm-button"
          type="button"
          tabIndex={visible ? 0 : -1}
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

