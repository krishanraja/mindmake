import { useEffect, useState } from "react";

/**
 * Whether the screen is too short to spend on a long list.
 *
 * Every browser gate on this site measures at 1440x900 and 390x844, and
 * `qa:screens` at eight sizes of which the shortest phone is 360x800. Real
 * phones are shorter than that: a 360x640 Android and a 320x568 iPhone SE are
 * both common, and a phone held sideways is 390px tall. Measured with the board
 * at four rows, 360x800 reads 1.26 screens and 360x640 reads 1.51 for the same
 * markup, because the budget is a ratio and only the denominator moved.
 *
 * So the height decides how much a section puts on the screen, not the width.
 * Pinned to false where there is no window, which is the server render and the
 * tests, and the value a page renders with before it knows better.
 */
const SHORT_HEIGHT = 700;

export function useShortScreen(): boolean {
  const [short, setShort] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(`(max-height: ${SHORT_HEIGHT - 1}px)`);
    const read = () => setShort(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);

  return short;
}
