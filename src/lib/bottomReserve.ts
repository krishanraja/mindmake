/**
 * Publishes the height a piece of fixed bottom chrome (the cookie notice, the
 * action bar) occupies, which the footer reserves as padding.
 *
 * A reader who is already at the foot of the page when that chrome appears
 * would otherwise have the footer's last line slide under it: the padding
 * grows below the fold and the scroll position stays put. So when the page
 * was scrolled to its end before the change, it is kept at its end after it.
 */
export function setBottomReserve(name: string, value: string | null) {
  const root = document.documentElement;
  const atEnd = window.scrollY > 0 && root.scrollHeight - window.innerHeight - window.scrollY <= 2;
  if (value === null) root.style.removeProperty(name);
  else root.style.setProperty(name, value);
  if (atEnd) window.scrollTo({ top: root.scrollHeight, behavior: "instant" });
}
