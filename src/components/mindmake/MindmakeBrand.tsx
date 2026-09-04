import { Link, useLocation } from "react-router-dom";
import wordmark from "@/assets/mindmake-wordmark-ink.png";
import icon from "@/assets/mindmake-mark.png";

/**
 * The real logo, back in the corner.
 *
 * The mark and the wordmark had been sitting unused in the tree while the
 * header drew "MIND/MAKE" as styled type. The supplied wordmark runs near-black
 * to mint across the word, drawn for a paper header, so on ink its first half
 * disappeared. mindmake-wordmark-ink.png is the same letterform and the same
 * gradient direction, repainted from the site's text colour to its mint.
 *
 * The wordmark carries the alt text and the mark is decorative, so a screen
 * reader hears the name once rather than twice.
 */
export function MindmakeBrand({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  const home = location.pathname === "/" ? "#top" : "/#top";

  return (
    <Link className={`mm-brand${compact ? " is-compact" : ""}`} to={home} aria-label="Mindmake home">
      {/* Fetched at head-parse time and decoded before paint.
          Measured cold on a throttled phone, the wordmark painted progressively
          and showed half-drawn glyphs for about 150ms, because an 11KB image
          that starts late at image priority is still arriving when the page
          first paints. `scripts/prerender.mjs` reads both hashed URLs from the
          rendered page and preloads them; these two attributes make sure that
          when the bytes are in, the mark is drawn whole rather than in passes.
          Lowercase, as in FilmPlate: React 18 drops the camelCase prop. */}
      <img className="mm-brand-icon" src={icon} width={128} height={114} alt="" aria-hidden="true" decoding="sync" {...{ fetchpriority: "high" }} />
      <img className="mm-brand-wordmark" src={wordmark} width={890} height={165} alt="Mindmake" decoding="sync" {...{ fetchpriority: "high" }} />
    </Link>
  );
}
