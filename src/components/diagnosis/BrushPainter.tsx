import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * BrushPainter — the Diagnosis Room's proposal loading state.
 *
 * Instead of a spinner, an artist's paintbrush sweeps in vertical strokes (down,
 * up, down, up) marching left → right, progressively washing the card in mint
 * paint until it is "full". The fill is a single boustrophedon SVG path drawn via
 * an animated stroke-dashoffset; a stylised brush rides the wet leading edge using
 * SMIL animateMotion along the same path, so the bristles always sit exactly where
 * the paint is landing. A turbulence displacement filter roughs the edges so the
 * stroke reads as bristled paint, not a clean line.
 *
 * Honours prefers-reduced-motion: renders a calm, ~45%-painted still with the
 * brush parked, no motion.
 */
export const BrushPainter = ({
  className,
  reduce = false,
}: {
  className?: string;
  /** When true, render a static painted still with no motion. */
  reduce?: boolean;
}) => {
  const uid = useId().replace(/:/g, "");
  const pid = `bp-path-${uid}`;
  const gid = `bp-grad-${uid}`;
  const fid = `bp-rough-${uid}`;

  // ── build the serpentine (boustrophedon) brush path ───────────────────────
  // Vertical sweeps that alternate down / up, stepping left → right, with rounded
  // U-turns at the top and bottom edges. Drawn in a 320 × 400 canvas, extended a
  // little past every edge so a "slice" fit still covers the whole card.
  const W = 320;
  const H = 400;
  const yTop = -16;
  const yBot = H + 16;
  const x0 = 18;
  const step = 30; // column spacing; < strokeWidth so columns overlap into a wash
  const cols = Math.ceil((W - x0 + 14) / step);

  let d = `M ${x0} ${yTop}`;
  let x = x0;
  let down = true;
  for (let i = 0; i <= cols; i++) {
    const target = down ? yBot : yTop;
    d += ` L ${x} ${target}`; // the vertical brush stroke
    if (i < cols) {
      const nx = x + step;
      d += ` L ${nx} ${target}`; // short edge turn (rounds off via linejoin)
      x = nx;
    }
    down = !down;
  }

  // Fill window: paint visibly lands across most of the loop, then the whole
  // group fades at the seam so the dash reset is never seen as a snap.
  const DUR = "3.4s";

  return (
    <div className={cn("pointer-events-none select-none", className)} aria-hidden>
      <svg
        className="h-full w-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#7ef4c2" />
            <stop offset="0.55" stopColor="#46e0b0" />
            <stop offset="1" stopColor="#23a886" />
          </linearGradient>

          {/* Roughen the stroke edges into bristled paint. */}
          <filter id={fid} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.013 0.045"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="15"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>

        <g opacity={reduce ? 0.9 : 0}>
          {!reduce && (
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              keyTimes="0;0.1;0.84;1"
              dur={DUR}
              repeatCount="indefinite"
            />
          )}

          {/* Soft under-wash: wider, blurred, lower opacity. */}
          <path
            d={d}
            pathLength={1}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={52}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={reduce ? 0.55 : 1}
            opacity={0.28}
            style={{ filter: "blur(6px)" }}
          >
            {!reduce && (
              <animate
                attributeName="stroke-dashoffset"
                values="1;0;0"
                keyTimes="0;0.84;1"
                dur={DUR}
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* The crisp bristled stroke on top. */}
          <path
            id={pid}
            d={d}
            pathLength={1}
            fill="none"
            stroke={`url(#${gid})`}
            strokeWidth={40}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={1}
            strokeDashoffset={reduce ? 0.55 : 1}
            opacity={0.92}
            filter={`url(#${fid})`}
          >
            {!reduce && (
              <animate
                attributeName="stroke-dashoffset"
                values="1;0;0"
                keyTimes="0;0.84;1"
                dur={DUR}
                repeatCount="indefinite"
              />
            )}
          </path>

          {/* The brush, riding the wet leading edge of the paint. Tip sits at the
              group's (0,0); bristles, ferrule and handle rise above it. */}
          <g>
            {!reduce && (
              <animateMotion
                dur={DUR}
                repeatCount="indefinite"
                rotate="0"
                calcMode="linear"
                keyPoints="0;1;1"
                keyTimes="0;0.84;1"
              >
                <mpath href={`#${pid}`} />
              </animateMotion>
            )}
            <g
              transform={
                reduce
                  ? `translate(${x0 + step * Math.round(0.55 * cols)} ${yBot}) rotate(-13)`
                  : "rotate(-13)"
              }
            >
              {/* wet glow under the tip */}
              <circle cx="0" cy="0" r="13" fill="#7ef4c2" opacity="0.35">
                {!reduce && (
                  <animate
                    attributeName="r"
                    values="11;15;11"
                    dur="0.9s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              {/* bristles (teardrop) */}
              <path
                d="M0 4 C -9 -8 -8 -20 0 -24 C 8 -20 9 -8 0 4 Z"
                fill="#1f7a60"
              />
              <path
                d="M0 2 C -5 -7 -5 -17 0 -22 C 5 -17 5 -7 0 2 Z"
                fill="#34c79e"
              />
              {/* ferrule */}
              <rect x="-7" y="-34" width="14" height="12" rx="2" fill="#c9d4d0" />
              <rect x="-7" y="-30" width="14" height="3" fill="#9aa8a3" />
              {/* handle */}
              <rect x="-4" y="-74" width="8" height="42" rx="4" fill="#3b2c20" />
              <rect x="-1.6" y="-72" width="2.4" height="38" rx="1.2" fill="#5a4634" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default BrushPainter;
