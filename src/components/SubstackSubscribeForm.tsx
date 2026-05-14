type Tone = "dark" | "light";
type Size = "full" | "compact";

interface SubstackSubscribeFormProps {
  tone?: Tone;
  size?: Size;
  /** Kept for call-site compatibility; the Substack embed handles attribution. */
  source?: string;
}

// Substack embed: plain variant for light backgrounds, `light=1` (light text)
// variant for dark backgrounds. The embed carries its own Mindmaker Live
// branding, so callers should label the surrounding section themselves rather
// than stacking another logo on top of the iframe.
const EMBED_SRC: Record<Tone, string> = {
  light: "https://mindmakerlive.substack.com/embed?transparent=1",
  dark: "https://mindmakerlive.substack.com/embed?transparent=1&light=1",
};

export const SubstackSubscribeForm = ({ tone = "dark" }: SubstackSubscribeFormProps) => {
  return (
    <iframe
      src={EMBED_SRC[tone]}
      title="Subscribe to Mindmaker Live"
      width={480}
      height={320}
      scrolling="no"
      className="w-full max-w-[480px]"
      style={{ border: 0, background: "transparent" }}
    />
  );
};

export default SubstackSubscribeForm;
