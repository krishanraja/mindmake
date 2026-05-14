type Tone = "dark" | "light";
type Size = "full" | "compact";

interface SubstackSubscribeFormProps {
  tone?: Tone;
  size?: Size;
  /** Kept for call-site compatibility; the Substack embed handles attribution. */
  source?: string;
  showLogo?: boolean;
}

// Substack embed: plain variant for light backgrounds, `light=1` (light text)
// variant for dark backgrounds.
const EMBED_SRC: Record<Tone, string> = {
  light: "https://mindmakerlive.substack.com/embed?transparent=1",
  dark: "https://mindmakerlive.substack.com/embed?transparent=1&light=1",
};

export const SubstackSubscribeForm = ({
  tone = "dark",
  showLogo = true,
}: SubstackSubscribeFormProps) => {
  return (
    <div className="flex flex-col items-start gap-3">
      {showLogo && (
        <img
          src={tone === "dark" ? "/mindmaker-live-logo-dark.png" : "/mindmaker-live-logo.png"}
          alt="Mindmaker Live"
          className="h-7 w-auto"
        />
      )}
      <iframe
        src={EMBED_SRC[tone]}
        title="Subscribe to Mindmaker Live"
        width={480}
        height={320}
        scrolling="no"
        className="w-full max-w-[480px]"
        style={{ border: 0, background: "transparent" }}
      />
    </div>
  );
};

export default SubstackSubscribeForm;
