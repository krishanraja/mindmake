import { useEffect, useState } from "react";

export interface KeyboardInset {
  /** Pixels the soft keyboard currently covers at the bottom. 0 when closed. */
  keyboardHeight: number;
  /** visualViewport.height, the usable height under the keyboard. */
  viewportHeight: number;
  /** visualViewport.offsetTop, iOS Safari shifts this while focused. */
  offsetTop: number;
  /** True once the keyboard meaningfully covers the screen (>100px). */
  isOpen: boolean;
}

const EMPTY: KeyboardInset = {
  keyboardHeight: 0,
  viewportHeight: 0,
  offsetTop: 0,
  isOpen: false,
};

/**
 * Track the on-screen keyboard via `window.visualViewport`.
 *
 * The Diagnosis Room is `position: fixed; inset: 0`, which on iOS Safari does
 * NOT shrink when the soft keyboard opens, the layout viewport stays full
 * height while only the *visual* viewport shrinks. `100dvh` tracks this
 * inconsistently, so the reliable signal is `visualViewport`. We return the
 * covered height so the room can pad its content column upward and float the
 * composer / CTA above the keyboard.
 *
 * Pass `enabled = false` (e.g. on desktop) to attach no listeners at all.
 */
export function useKeyboardInset(enabled: boolean = true): KeyboardInset {
  const [inset, setInset] = useState<KeyboardInset>(EMPTY);

  useEffect(() => {
    if (!enabled) {
      setInset(EMPTY);
      return;
    }
    if (typeof window === "undefined" || !window.visualViewport) {
      return;
    }

    const vv = window.visualViewport;
    // The full layout-viewport height, captured before any keyboard opens.
    // `window.innerHeight` here is the un-shrunk reference on iOS.
    const layoutHeight = window.innerHeight;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const keyboardHeight = Math.max(
        0,
        layoutHeight - vv.height - vv.offsetTop,
      );
      setInset({
        keyboardHeight,
        viewportHeight: vv.height,
        offsetTop: vv.offsetTop,
        isOpen: keyboardHeight > 100,
      });
    };

    const onChange = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(measure);
    };

    vv.addEventListener("resize", onChange);
    vv.addEventListener("scroll", onChange);
    measure();

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      vv.removeEventListener("resize", onChange);
      vv.removeEventListener("scroll", onChange);
    };
  }, [enabled]);

  return inset;
}

export default useKeyboardInset;
