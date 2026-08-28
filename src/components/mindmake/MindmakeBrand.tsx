import { Link, useLocation } from "react-router-dom";
import wordmark from "@/assets/mindmake-wordmark-ink.png";
import icon from "@/assets/mindmaker-icon.png";

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
      <img className="mm-brand-icon" src={icon} width={520} height={470} alt="" aria-hidden="true" />
      <img className="mm-brand-wordmark" src={wordmark} width={890} height={165} alt="Mindmake" />
    </Link>
  );
}
