import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ArrowRight, CheckCircle } from "lucide-react";

type ScopingModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourcePage: string;
};

const trackEvent = (name: string, props?: Record<string, unknown>) => {
  try {
    (window as unknown as { plausible?: (e: string, o?: { props?: object }) => void })
      .plausible?.(name, props ? { props } : undefined);
  } catch {
    /* analytics optional */
  }
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const ScopingModal = ({ open, onOpenChange, sourcePage }: ScopingModalProps) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyRole, setCompanyRole] = useState("");
  const [decision, setDecision] = useState("");
  const [success30, setSuccess30] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      trackEvent("scoping_modal_open", { page: sourcePage });
    } else {
      const t = setTimeout(() => {
        setName("");
        setEmail("");
        setCompanyRole("");
        setDecision("");
        setSuccess30("");
        setNotes("");
        setSubmitted(false);
        setSubmitting(false);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open, sourcePage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyRole || !decision || !success30) {
      toast({
        title: "A few fields are still empty",
        description: "Fill in everything except notes, then try again.",
        variant: "destructive",
      });
      return;
    }
    if (!EMAIL_RE.test(email)) {
      toast({
        title: "That email doesn't look right",
        description: "Use the one you'd actually want me to reply to.",
        variant: "destructive",
      });
      return;
    }
    if (decision.length > 500 || success30.length > 500) {
      toast({
        title: "Keep it tight",
        description: "Each field has a 500-character limit. Trim and try again.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const utmCampaign = params.get("utm_campaign") || undefined;

      const { error } = await supabase.functions.invoke("notify-scoping-request", {
        body: {
          name,
          email,
          company_role: companyRole,
          decision_or_problem: decision,
          success_in_30_days: success30,
          notes: notes || null,
          source_page: sourcePage,
          source_campaign: utmCampaign || null,
          user_agent: navigator.userAgent,
        },
      });

      if (error) {
        throw new Error(error.message || "Submission failed");
      }

      trackEvent("scoping_modal_submit", { page: sourcePage });
      setSubmitted(true);
    } catch (err) {
      console.error("Scoping submit error:", err);
      toast({
        title: "Something broke on my end",
        description:
          "Your request didn't go through. Try again, or email krish@themindmaker.ai directly.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const successScreen = (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <CheckCircle className="w-14 h-14 text-mint-dark dark:text-mint mb-5" />
      <h3 className="text-xl font-bold mb-3">Got it.</h3>
      <p className="text-muted-foreground leading-relaxed max-w-md">
        I read every one of these personally. You'll hear back inside 48 hours
        with either a calendar link or a short note explaining why this isn't a
        fit yet.
      </p>
      <Button
        className="mt-7 bg-ink dark:bg-mint text-white dark:text-ink font-semibold"
        onClick={() => onOpenChange(false)}
      >
        Close
      </Button>
    </div>
  );

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto px-1 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="scoping-name">Name</Label>
          <Input
            id="scoping-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scoping-email">Work email</Label>
          <Input
            id="scoping-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scoping-company">Company &amp; role</Label>
          <Input
            id="scoping-company"
            value={companyRole}
            onChange={(e) => setCompanyRole(e.target.value)}
            placeholder="e.g. Acme Capital, Operating Partner"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="scoping-decision">
            What's the AI decision or problem you want to resolve?
          </Label>
          <Textarea
            id="scoping-decision"
            value={decision}
            onChange={(e) => setDecision(e.target.value.slice(0, 500))}
            placeholder="The thing you've been turning over."
            maxLength={500}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {decision.length}/500
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scoping-success">
            What does success look like in 30 days?
          </Label>
          <Textarea
            id="scoping-success"
            value={success30}
            onChange={(e) => setSuccess30(e.target.value.slice(0, 500))}
            placeholder="The outcome you can defend in front of the board."
            maxLength={500}
            rows={4}
            required
          />
          <p className="text-xs text-muted-foreground text-right">
            {success30.length}/500
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scoping-notes" className="text-muted-foreground">
            Notes (optional)
          </Label>
          <Textarea
            id="scoping-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything else worth knowing."
            rows={3}
          />
        </div>
      </div>

      <div className="shrink-0 pt-4 mt-3 border-t border-border">
        <Button
          type="submit"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold text-base py-6"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Send to Krish
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Goes straight to my inbox. I reply inside 48 hours.
        </p>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 flex flex-col max-h-[88dvh]">
          {submitted ? (
            <>
              <DrawerHeader className="sr-only">
                <DrawerTitle>Scoping request sent</DrawerTitle>
                <DrawerDescription>Confirmation</DrawerDescription>
              </DrawerHeader>
              {successScreen}
            </>
          ) : (
            <>
              <DrawerHeader className="text-left pb-1 shrink-0">
                <DrawerTitle className="text-lg font-bold">Scope it with me</DrawerTitle>
                <DrawerDescription className="text-sm">
                  Six fields. Reply inside 48 hours.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 min-h-0 py-3">{formContent}</div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col">
        {submitted ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Scoping request sent</DialogTitle>
              <DialogDescription>Confirmation</DialogDescription>
            </DialogHeader>
            {successScreen}
          </>
        ) : (
          <>
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-2xl font-bold">Scope it with me</DialogTitle>
              <DialogDescription className="text-base">
                Six fields. I read every one personally and reply inside 48 hours.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0 py-2">{formContent}</div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ScopingModal;
