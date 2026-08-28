interface MarqueeProps {
  /** The refrain, alternated as the band runs. One marquee per page, at most. */
  lines: string[];
}

/**
 * A tilted mint band running a refrain. Ambient: it never stops, and nothing on
 * the page depends on reading it, so it is hidden from assistive technology and
 * stilled under reduced motion.
 */
export function Marquee({ lines }: MarqueeProps) {
  // The track is duplicated so the -50% translation loops seamlessly.
  const run = [...lines, ...lines, ...lines, ...lines];

  return (
    <div className="mm-marquee" aria-hidden="true">
      <div className="mm-marquee-track">
        {run.map((line, index) => (
          <span key={`${line}-${index}`}>
            {line}
            <span aria-hidden="true"> · </span>
          </span>
        ))}
      </div>
    </div>
  );
}
