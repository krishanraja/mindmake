/**
 * The trailing slash, which is the difference between a gate and a rumour.
 *
 * `vite preview` serves `/ai-brain/` from the prerendered file and `/ai-brain`
 * from the SPA fallback, which is the homepage's markup. Every gate here asked
 * for the second. With JavaScript running the router then renders the right
 * page over the top, so most of these gates measured the right thing by luck,
 * one render late.
 *
 * Two did not. The entrance gate handed React the homepage's HTML and the
 * router's own page, told it to reconcile them, and reported the mismatch as a
 * defect in the site: 16 hydration failures on `/ai-brain`, 13 on `/ai-gtm`, 24
 * on `/faq`, 3 on `/privacy`, and none at all on `/`, which is the one route
 * where the fallback happens to be the right file. It looked exactly like the
 * two real hydration failures that gate was built to catch, and it was stable
 * enough across runs to look real. And the no-JavaScript gate, which has no
 * router to paper over it, checked every page against the homepage's markup.
 *
 * Vercel resolves the directory index either way, so this is local only. Adding
 * the slash, the same build reports a clean hydration on every route at both
 * widths.
 */
export const asked = (path) => {
  const [route, query] = path.split("?");
  if (route === "/" || route.endsWith("/")) return path;
  return `${route}/${query ? `?${query}` : ""}`;
};
