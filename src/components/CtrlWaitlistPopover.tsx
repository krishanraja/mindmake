import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle } from "lucide-react";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const trackEvent = (name: string, props?: Record<string, unknown>) => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.(name, props ? { props } : undefined);
  } catch {
    /* analytics optional */
  }
};

type CtrlWaitlistPopoverProps = {
  children: React.ReactNode;
  sourcePage?: string;
};

export const CtrlWaitlistPopover = ({
  children,
  sourcePage = "/",
}: CtrlWaitlistPopoverProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      toast({
        title: "That email doesn't look right",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("notify-ctrl-waitlist", {
        body: {
          email,
          name: name || null,
          source_page: sourcePage,
        },
      });
      if (error) throw new Error(error.message || "Submission failed");
      trackEvent("ctrl_waitlist_submit", { source_page: sourcePage });
      setSubmitted(true);
    } catch (err) {
      console.error("CTRL waitlist error:", err);
      toast({
        title: "Couldn't add you just now",
        description: "Try again in a moment, or email krish@themindmaker.ai.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setTimeout(() => {
            setSubmitted(false);
            setEmail("");
            setName("");
          }, 250);
        }
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-5"
        align="start"
        sideOffset={8}
      >
        {submitted ? (
          <div className="text-center py-2">
            <CheckCircle className="w-9 h-9 text-mint-dark dark:text-mint mx-auto mb-3" />
            <p className="font-semibold mb-1">You're on the list.</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              I'll email you the moment CTRL opens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <p className="font-semibold text-sm mb-1">CTRL is on the way.</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Mindmaker's memory-web app. Drop your email and I'll let you in
                the moment it opens.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ctrl-email" className="text-xs">
                Email
              </Label>
              <Input
                id="ctrl-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ctrl-name" className="text-xs text-muted-foreground">
                Name (optional)
              </Label>
              <Input
                id="ctrl-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-9"
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="w-full bg-ink dark:bg-mint text-white dark:text-ink font-semibold"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding
                </>
              ) : (
                "Notify me when it opens"
              )}
            </Button>
          </form>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CtrlWaitlistPopover;
