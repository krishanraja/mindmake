import { attendeeBrands } from "@/data/rebuildProof";

/**
 * The attendee brands as a slow carousel under the leader count (Krish,
 * 2026-11-06: "add more logos to the carousel"). All sixteen approved brands
 * drift left in one unbroken loop; the second pass is a visual copy, hidden
 * from assistive technology, so a screen reader hears each name once.
 *
 * It pauses while a pointer rests on it. With reduced motion, without script
 * or for a crawler it is the same sixteen cells, still, and the row can be
 * swiped (mindmake-instruments.css). The marks are never links.
 */
export function LogoRail() {
  const cells = (copy: boolean) =>
    attendeeBrands.map((brand) => (
      /* The cell carries the background; only the image is filtered,
         because a filter applies to an element's own background too. */
      <li className="mm-logo-cell" key={`${copy ? "copy-" : ""}${brand.name}`}>
        <img
          src={brand.logo}
          alt={copy ? "" : brand.name}
          loading="lazy"
          decoding="async"
          style={brand.scale ? { height: `calc(var(--mm-logo-h) * ${brand.scale})` } : undefined}
        />
      </li>
    ));

  return (
    <div className="mm-logo-rail">
      <div className="mm-logo-track">
        <ul aria-label="Businesses our attendees come from">{cells(false)}</ul>
        <ul className="mm-logo-copy" aria-hidden="true">{cells(true)}</ul>
      </div>
    </div>
  );
}
