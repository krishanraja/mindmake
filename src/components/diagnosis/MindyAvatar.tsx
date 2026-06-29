import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type MindyState = "idle" | "thinking";

interface MindyAvatarProps {
  state?: MindyState;
  /** Visual size in px. */
  size?: number;
  className?: string;
  /** Show the name + status line beneath the portrait. */
  withLabel?: boolean;
}

/**
 * Mindy: a warm, executive female AI guide. The image lives at /mindy.png.
 * Presence is conveyed with a slowly-rotating mint gradient ring and a soft
 * breathing halo (idle) that quickens while she is thinking, plus a faint
 * specular highlight so the portrait reads as lit, not flat. Reduced-motion
 * users get a static, equally calm portrait.
 */
export const MindyAvatar = ({
  state = "idle",
  size = 64,
  className,
  withLabel = false,
}: MindyAvatarProps) => {
  const reduce = useReducedMotion();
  const thinking = state === "thinking";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className="relative shrink-0"
        style={{ width: size, height: size }}
        aria-hidden={!withLabel}
      >
        {/* ambient halo */}
        {!reduce && (
          <motion.span
            className="absolute inset-0 rounded-full bg-mint/25 blur-xl"
            animate={
              thinking
                ? { scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }
                : { scale: [1, 1.06, 1], opacity: [0.35, 0.5, 0.35] }
            }
            transition={{
              duration: thinking ? 1.6 : 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}

        {/* slowly-rotating conic gradient ring */}
        {!reduce && (
          <motion.span
            className="absolute -inset-[2px] rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(0,217,182,0.7), transparent 55%, rgba(52,211,153,0.5), transparent)",
              maskImage:
                "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              WebkitMaskImage:
                "radial-gradient(closest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: thinking ? 3 : 9,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        )}

        {/* thin ring */}
        <span
          className={cn(
            "absolute inset-0 rounded-full ring-1",
            thinking ? "ring-mint/60" : "ring-mint/25",
          )}
        />

        <img
          src="/mindy.png"
          alt="Mindy, the Mindmaker guide"
          width={size}
          height={size}
          className="relative h-full w-full rounded-full object-cover"
          draggable={false}
        />

        {/* specular highlight so she reads as lit */}
        <span
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 32% 26%, rgba(255,255,255,0.28), transparent 42%)",
          }}
          aria-hidden
        />

        {/* thinking dots, bottom-right */}
        {thinking && !reduce && (
          <span className="absolute -bottom-0.5 -right-0.5 flex items-center gap-0.5 rounded-full bg-ink-900/90 px-1.5 py-1 ring-1 ring-mint/30">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1 w-1 rounded-full bg-mint"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.18,
                  ease: "easeInOut",
                }}
              />
            ))}
          </span>
        )}
      </div>

      {withLabel && (
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Mindy</p>
          <p className="text-xs text-white/55">
            {thinking ? "Thinking" : "Mindmaker"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MindyAvatar;
