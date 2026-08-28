import { useEffect, useState } from "react";
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

  useEffect(() => {
    const decide = () => setShown(window.scrollY > window.innerHeight * 0.8);
    decide();
    window.addEventListener("scroll", decide, { passive: true });
    return () => window.removeEventListener("scroll", decide);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("mm-bar-visible", shown);
    return () => root.classList.remove("mm-bar-visible");
  }, [shown]);

  return (
    <div className={`mm-action-bar${shown ? " is-shown" : ""}`} aria-hidden={!shown}>
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
