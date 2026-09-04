import { Link, useLocation } from "react-router-dom";
import markSvg from "@/assets/mindmake-mark.svg?raw";
import wordmarkSvg from "@/assets/mindmake-wordmark.svg?raw";

/**
 * The real logo, in the corner, as vectors.
 *
 * Until 4 September 2026 the mark and the wordmark were two PNGs, the
 * wordmark repainted from the paper original so it read on the ink, preloaded
 * and decoded synchronously so they would not paint half-drawn. The designer's
 * September 2026 exports replaced them. The icon came as four shapes under
 * four gradients of 659 stops each; it is the same four shapes under the same
 * four gradients at seven stops. The wordmark came as nine letter outlines
 * used as clip paths over eight copies of one gradient picture, a megabyte of
 * raster inside a vector; it is the nine outlines as paths under one gradient
 * that runs from the text colour to the mint, read from the tokens, so it
 * sits on the ink the way the repaint did and would sit on paper if asked.
 *
 * Both are written into the page rather than fetched, so there is nothing to
 * arrive late and nothing to preload. Each instance on a page gets its own
 * gradient ids: `url(#id)` resolves to the first match in the document, and a
 * gradient's stops read their custom properties where that first one sits, so
 * two instances sharing ids would both wear the header's colours.
 *
 * The wordmark carries the name and the mark is decorative, so a screen reader
 * hears it once rather than twice.
 */
const withOwnIds = (raw: string, instance: string) =>
  raw.replace(/id="mm-/g, `id="mm-${instance}-`).replace(/url\(#mm-/g, `url(#mm-${instance}-`);

export function BrandMarks({ instance }: { instance: string }) {
  return (
    <>
      <span className="mm-brand-icon" aria-hidden="true" dangerouslySetInnerHTML={{ __html: withOwnIds(markSvg, instance) }} />
      <span className="mm-brand-wordmark" dangerouslySetInnerHTML={{ __html: withOwnIds(wordmarkSvg, instance) }} />
    </>
  );
}

export function MindmakeBrand({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  const home = location.pathname === "/" ? "#top" : "/#top";

  return (
    <Link className={`mm-brand${compact ? " is-compact" : ""}`} to={home} aria-label="Mindmake home">
      <BrandMarks instance={compact ? "foot" : "head"} />
    </Link>
  );
}
