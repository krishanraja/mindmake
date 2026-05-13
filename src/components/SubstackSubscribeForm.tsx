import { useState, type FormEvent } from "react";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SUBSTACK_BASE = "https://mindmakerlive.substack.com";
const SUBSTACK_SUBSCRIBE_ENDPOINT = `${SUBSTACK_BASE}/api/v1/free`;

type Tone = "dark" | "light";
type Size = "full" | "compact";

interface SubstackSubscribeFormProps {
  tone?: Tone;
  size?: Size;
  source?: string;
}

export const SubstackSubscribeForm = ({
  tone = "dark",
  size = "full",
  source = "mindmaker-website",
}: SubstackSubscribeFormProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");

    const body = new FormData();
    body.append("email", email);
    body.append("source", source);
    body.append("first_url", typeof window !== "undefined" ? window.location.href : "");
    body.append("first_referrer", typeof document !== "undefined" ? document.referrer : "");

    try {
      // Substack accepts cross-origin no-cors POSTs from the embed flow.
      // Response is opaque, so we treat absence of network error as success.
      await fetch(SUBSTACK_SUBSCRIBE_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body,
      });
    } catch {
      // Network failure: fall back to hosted page with email prefilled.
      window.location.href = `${SUBSTACK_BASE}/subscribe?email=${encodeURIComponent(email)}`;
      return;
    }

    setStatus("success");
  };

  const isDark = tone === "dark";
  const isCompact = size === "compact";

  if (status === "success") {
    return (
      <div
        className={`flex items-center gap-3 rounded-lg px-4 py-3 ${
          isDark
            ? "bg-mint/10 border border-mint/30 text-white"
            : "bg-mint/10 border border-mint/40 text-foreground"
        }`}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-mint text-ink">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        <div className="flex-1 text-sm">
          <span className="font-semibold">Check your inbox.</span>{" "}
          <span className={isDark ? "text-white/70" : "text-muted-foreground"}>
            Confirm the email and you're in.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={handleSubmit}
        className={`flex flex-col gap-2 ${isCompact ? "" : "sm:flex-row sm:items-stretch"}`}
      >
        <label htmlFor={`substack-email-${size}-${tone}`} className="sr-only">
          Email address
        </label>
        <Input
          id={`substack-email-${size}-${tone}`}
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`flex-1 ${
            isDark
              ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-mint focus-visible:border-mint/60"
              : "bg-background border-border text-foreground"
          } ${isCompact ? "h-10" : "h-12 text-base"}`}
        />
        <Button
          type="submit"
          disabled={status === "submitting"}
          className={`group bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold shadow-md shadow-mint/20 transition-all duration-300 ${
            isCompact ? "h-10 px-4 text-sm" : "h-12 px-6 text-base"
          }`}
        >
          {status === "submitting" ? "Subscribing…" : "Subscribe"}
          <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </Button>
      </form>
      {!isCompact && (
        <p className={`text-[11px] ${isDark ? "text-white/40" : "text-muted-foreground"}`}>
          Or{" "}
          <a
            href={SUBSTACK_BASE}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-0.5 underline underline-offset-2 hover:no-underline ${
              isDark ? "text-white/60 hover:text-white" : "text-foreground hover:text-mint-dark"
            }`}
          >
            read past issues on Substack <ExternalLink className="h-2.5 w-2.5" />
          </a>
          . No spam. Unsubscribe anytime.
        </p>
      )}
    </div>
  );
};

export default SubstackSubscribeForm;
