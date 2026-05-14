import { cn } from "@/lib/utils";

interface MindMakerWordmarkProps {
  size?: "nav" | "section";
  /** "auto" swaps with the theme; "dark"/"light" force a variant for fixed backgrounds. */
  tone?: "auto" | "dark" | "light";
  className?: string;
}

// Renders the canonical Mindmaker Live brand lockup. The light variant carries
// the dark-navy → mint gradient for light backgrounds; the dark variant lifts
// the left side toward white so it stays legible on dark backgrounds.
export const MindMakerWordmark = ({
  size = "nav",
  tone = "auto",
  className,
}: MindMakerWordmarkProps) => {
  const heightClass = size === "nav" ? "h-[18px]" : "h-7 md:h-9";
  const base = cn("w-auto object-contain", heightClass, className);

  if (tone === "dark") {
    return <img src="/mindmaker-live-logo-dark.png" alt="Mindmaker Live" className={base} />;
  }
  if (tone === "light") {
    return <img src="/mindmaker-live-logo.png" alt="Mindmaker Live" className={base} />;
  }

  return (
    <>
      <img
        src="/mindmaker-live-logo.png"
        alt="Mindmaker Live"
        className={cn(base, "dark:hidden")}
      />
      <img
        src="/mindmaker-live-logo-dark.png"
        alt="Mindmaker Live"
        className={cn(base, "hidden dark:block")}
      />
    </>
  );
};
