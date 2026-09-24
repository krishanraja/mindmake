import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";

/**
 * The way in, pinned to the bottom of the screen.
 *
 * Two slots and never three. On the right, the one action, which opens the
 * brief. On the left, at most one door: the offer route the reader is not
 * already on. A reader on /ai-brain is offered /ai-gtm and nothing else; a
 * reader on an editorial page is offered no door at all, because neither one is
 * more relevant than the other and a bar is a place to act rather than a place
 * to navigate.
 *
 * ## Why two
 *
 * `scripts/qa/one-way-in-check.mjs` permits a fork of exactly two in one
 * control group and fails anything else on a page, and
 * `src/components/mindmake/CloseBlock.tsx` records the defect that produced
 * that rule: three "Start here" buttons at once at the foot of /ai-gtm. Three
 * choices at the moment of action is also a worse surface than two. The door is
 * a link and the action is a button, which is what they each really are.
 *
 * ## Non-duplicative
 *
 * It waits until the reader has left the first screen, and it stands down
 * entirely whenever the page's own primary action is on screen, so a reader
 * never sees two ways in at once. It reserves its measured height at the foot
 * of the page, so it never covers the last thing somebody is reading.
 *
 * It used to be phone-only, and its rules used to live in
 * `mindmake-instruments.css`, which only /case-studies imports, so on every
 * other route it rendered as a bare button below the footer. The rules now live
 * in `mindmake.css` beside the `--mm-bar-reserve` token that the footer reads.
 */

export interface ActionBarDoor {
  to: string;
  label: string;
}

interface SiteActionBarProps {
  onStart: () => void;
  /** The offer route the reader is not on. Omitted where neither is the page. */
  door?: ActionBarDoor;
  label: string;
}

export function SiteActionBar({ onStart, door, label }: SiteActionBarProps) {
  const [shown, setShown] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* Shown after the first screen, and hidden again whenever the page's own
     primary action is on screen. The bar exists so the action is reachable
     while none is in front of the reader; alongside one it is a second way in,
     which is how the foot of /ai-gtm ended up showing three at once and how the
     try-it panel ended up competing with a bar offering something else.
     Anything that is a way in carries data-mm-primary. The bar's own action
     deliberately does not: it would see itself and never appear. */
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
      <div className="mm-action-bar-inner">
        {door && (
          <Link
            className="mm-action-bar-door"
            to={door.to}
            tabIndex={shown ? 0 : -1}
            onClick={() => track("door_click", { source: "action_bar", to: door.to })}
          >
            {door.label} <span aria-hidden="true">↗</span>
          </Link>
        )}
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
