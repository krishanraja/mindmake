import { useState, useEffect, useCallback, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight, ChevronLeft, Users, Compass, Zap, Calendar, CheckCircle, CalendarDays } from "lucide-react";
import krishHeadshot from "@/assets/krish-headshot.png";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionData } from "@/contexts/SessionDataContext";
import { openCalendlyPopup } from "@/utils/calendly";
import { checkSupabaseHealth } from '@/utils/supabaseHealthCheck';
import { motion, AnimatePresence } from "framer-motion";

// ---------------------------------------------------------------------------
// Mobile wizard sub-components
// ---------------------------------------------------------------------------

type StepId = "path" | "commitment" | "contact";

const SelectionCard = ({
  selected,
  icon: Icon,
  title,
  subtitle,
  onClick,
}: {
  selected: boolean;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full text-left rounded-xl border-2 p-5 transition-all duration-200 active:scale-[0.98] ${
      selected
        ? "border-mint bg-mint/10"
        : "border-border bg-background hover:border-muted-foreground/40"
    }`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`shrink-0 w-11 h-11 rounded-lg flex items-center justify-center ${
          selected ? "bg-mint/20" : "bg-muted"
        }`}
      >
        <Icon className={`w-5 h-5 ${selected ? "text-mint" : "text-muted-foreground"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="font-semibold text-base block leading-tight">{title}</span>
        <span className="text-sm text-muted-foreground block mt-1 leading-snug">
          {subtitle}
        </span>
      </div>
    </div>
  </button>
);

const MobileStepDots = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => (
  <div className="flex items-center justify-center gap-2 py-2">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={`h-1.5 rounded-full transition-all duration-300 ${
          i === current
            ? "w-7 bg-mint"
            : i < current
            ? "w-2 bg-mint/50"
            : "w-2 bg-muted-foreground/25"
        }`}
      />
    ))}
  </div>
);

const ThankYouScreen = ({
  firstName,
  onBookTime,
}: {
  firstName: string;
  onBookTime: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <CheckCircle className="w-16 h-16 text-mint-dark dark:text-mint mb-6" />
    </motion.div>

    <motion.h2
      className="text-2xl font-bold mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      Thank you, {firstName}!
    </motion.h2>

    <motion.p
      className="text-lg text-muted-foreground mb-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
    >
      I'll be in touch ASAP.
    </motion.p>

    <motion.div
      className="flex flex-col items-center gap-2 mb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <img
        src={krishHeadshot}
        alt="Krish Raja"
        className="w-16 h-16 rounded-full border-2 border-mint/20"
      />
      <span className="text-sm font-medium">Krish Raja</span>
    </motion.div>

    <motion.div
      className="w-full space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.4 }}
    >
      <Button
        className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold text-base py-6"
        onClick={onBookTime}
      >
        <CalendarDays className="mr-2 h-5 w-5" />
        Book a time now
      </Button>
      <p className="text-sm text-muted-foreground">
        Or just sit tight. I'll reach out to you directly.
      </p>
    </motion.div>
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface InitialConsultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedProgram?: string;
  commitmentLevel?: string;
  audienceType?: "individual" | "team";
  pathType?: "build" | "orchestrate";
}

export const InitialConsultModal = ({
  open,
  onOpenChange,
  preselectedProgram,
  commitmentLevel,
  audienceType,
  pathType
}: InitialConsultModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [selectedCommitment, setSelectedCommitment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mobileStep, setMobileStep] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { sessionData } = useSessionData();
  const contactFormRef = useRef<HTMLFormElement>(null);

  const firstName = name.split(" ")[0] || "friend";

  // Get qualification data from context or props (props take precedence)
  const qualificationData = sessionData?.qualificationData;
  const effectivePreselectedProgram = preselectedProgram || qualificationData?.preselectedProgram;
  const effectiveCommitmentLevel = commitmentLevel || qualificationData?.commitmentLevel;
  const effectiveAudienceType = audienceType || qualificationData?.audienceType;
  const effectivePathType = pathType || qualificationData?.pathType;

  // Compute which mobile steps to show (commitment step removed in v5)
  const mobileSteps: StepId[] = [];
  if (!effectivePreselectedProgram) mobileSteps.push("path");
  mobileSteps.push("contact");

  const currentStepId = mobileSteps[mobileStep] as StepId | undefined;

  // Auto-populate from props or context when modal opens
  useEffect(() => {
    if (open) {
      // Set path from props or context
      if (effectivePreselectedProgram && !selectedPath) {
        setSelectedPath(effectivePreselectedProgram);
      }

      // Set commitment from props or context (only if not already set by user)
      if (effectiveCommitmentLevel && !selectedCommitment && !commitmentLevel) {
        setSelectedCommitment(effectiveCommitmentLevel);
      }
    } else {
      // Reset form when modal closes
      setName("");
      setEmail("");
      setJobTitle("");
      setSelectedPath("");
      setSelectedCommitment("");
      setEmailError(null);
      setShowThankYou(false);
      setMobileStep(0);
      setSlideDirection(1);
    }
  }, [open, effectivePreselectedProgram, effectiveCommitmentLevel, selectedPath, selectedCommitment, commitmentLevel]);

  // Run health check on mount (only in dev)
  useEffect(() => {
    if (import.meta.env.DEV) {
      checkSupabaseHealth().then(health => {
        if (!health.isHealthy) {
          console.error('⚠️ Supabase health check failed:', health);
        } else {
          console.log('✅ Supabase health check passed');
        }
      });
    }
  }, []);

  // Mobile keyboard fix: scroll focused input into view
  useEffect(() => {
    if (!isMobile || currentStepId !== "contact") return;

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 350);
      }
    };

    const formEl = contactFormRef.current;
    formEl?.addEventListener("focusin", handleFocusIn);
    return () => formEl?.removeEventListener("focusin", handleFocusIn);
  }, [isMobile, currentStepId]);

  // Mobile keyboard fix: dynamic padding via visualViewport
  useEffect(() => {
    if (!isMobile || currentStepId !== "contact") return;

    const viewport = window.visualViewport;
    if (!viewport) return;

    const handleResize = () => {
      const keyboardHeight = window.innerHeight - viewport.height;
      if (contactFormRef.current) {
        contactFormRef.current.style.paddingBottom =
          keyboardHeight > 100 ? `${keyboardHeight + 20}px` : "";
      }
    };

    viewport.addEventListener("resize", handleResize);
    return () => viewport.removeEventListener("resize", handleResize);
  }, [isMobile, currentStepId]);

  const pathOptions = [
    {
      value: "cohort-enrollment",
      label: "The AI Decision Cohort",
      helper: "$3,500 per seat. Three weeks with 15 other senior leaders, mostly async plus three live sessions. For your nervous AI decision.",
    },
    {
      value: "signal-session",
      label: "The Signal Session",
      helper: "$15,000. One intensive day plus a 48h Commercial Narrative. For teams needing rapid alignment on how to sell an AI capability.",
    },
    {
      value: "revenue-architecture",
      label: "The Revenue Architecture",
      helper: "$60,000 to $100,000, scope-dependent. A 30-day build of pricing, positioning, packaging, and GTM for companies commercializing AI.",
    },
    {
      value: "1-1-inquiry",
      label: "Private 1:1 engagement (by inquiry)",
      helper: "A handful of private engagements each year. Scope and pricing by conversation.",
    },
  ];

  // Mobile navigation helpers
  const goForward = useCallback(() => {
    if (mobileStep < mobileSteps.length - 1) {
      setSlideDirection(1);
      setMobileStep((s) => s + 1);
    }
  }, [mobileStep, mobileSteps.length]);

  const goBack = useCallback(() => {
    if (mobileStep > 0) {
      setSlideDirection(-1);
      setMobileStep((s) => s - 1);
    }
  }, [mobileStep]);

  // Open Calendly from the thank-you screen
  const handleBookTime = useCallback(async () => {
    const programValue = effectivePreselectedProgram || selectedPath || 'not-sure';
    const finalCommitmentLevel = effectiveCommitmentLevel || selectedCommitment;
    try {
      await openCalendlyPopup({
        name,
        email,
        source: 'initial-consult',
        preselectedProgram: programValue,
        commitmentLevel: finalCommitmentLevel,
      });
    } catch (calendlyError) {
      console.error('Calendly error:', calendlyError);
      toast({
        title: "Booking Error",
        description: "Could not open booking page. Please try again or contact support.",
        variant: "destructive",
      });
    }
    onOpenChange(false);
  }, [name, email, effectivePreselectedProgram, selectedPath, effectiveCommitmentLevel, selectedCommitment, onOpenChange, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If preselectedProgram is provided (from props or context), selectedPath is optional
    const pathRequired = !effectivePreselectedProgram;

    if (!name || !email || !jobTitle || (pathRequired && !selectedPath)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      toast({
        title: "Invalid email",
        description: "Please check your email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setEmailError(null);

    try {
      const selectedPathData = pathOptions.find(p => p.value === selectedPath);

      // Determine the program value to send (use effective values or user selection)
      const programValue = effectivePreselectedProgram || selectedPath || 'not-sure';
      const finalCommitmentLevel = effectiveCommitmentLevel || selectedCommitment;
      const finalAudienceType = effectiveAudienceType || (selectedPath === "team" ? "team" : "individual");
      const finalPathType = effectivePathType || (selectedPath === "build" ? "build" : selectedPath === "orchestrate" ? "orchestrate" : undefined);
      const qualifierAnswers = qualificationData?.qualifierAnswers;

      // Log request details for debugging
      console.log('📧 Sending lead email request:', {
        functionName: 'send-lead-email',
        payload: {
          name,
          email,
          jobTitle,
          selectedProgram: programValue,
          commitmentLevel: finalCommitmentLevel,
          audienceType: finalAudienceType,
          pathType: finalPathType,
          hasQualifierAnswers: Boolean(qualifierAnswers),
          sessionDataKeys: Object.keys(sessionData || {})
        },
        supabaseUrl: (supabase as any).supabaseUrl?.substring(0, 30) + '...',
        timestamp: new Date().toISOString()
      });

      // Send enriched lead email with all context
      // Add timeout: 30 seconds
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout - please try again')), 30000);
      });

      const emailPromise = supabase.functions.invoke('send-lead-email', {
        body: {
          name,
          email,
          jobTitle,
          selectedProgram: programValue,
          commitmentLevel: finalCommitmentLevel,
          audienceType: finalAudienceType,
          pathType: finalPathType,
          qualifierAnswers,
          sessionData
        }
      });

      let emailData, emailError;
      try {
        const result = await Promise.race([emailPromise, timeoutPromise]) as any;

        // Validate result structure
        if (result && typeof result === 'object') {
          emailData = result.data;
          emailError = result.error;
        } else {
          // Result might be the direct response
          emailData = result;
          emailError = null;
        }

        // Log result for debugging
        console.log('📧 Email request result:', {
          hasData: !!emailData,
          hasError: !!emailError,
          dataKeys: emailData ? Object.keys(emailData) : [],
          errorMessage: emailError?.message || emailError
        });
      } catch (timeoutError) {
        console.error('📧 Email request timeout or error:', timeoutError);
        emailError = timeoutError instanceof Error ? timeoutError : new Error('Request timeout');
        emailData = null;
      }

      // Check for errors in multiple places
      const emailFailed = emailError || (emailData && emailData.error);

      if (emailFailed) {
        const errorMessage = emailError?.message || emailData?.error || 'Unknown error';
        const errorDetails = {
          errorObject: emailError,
          dataError: emailData?.error,
          fullData: emailData,
          timestamp: new Date().toISOString()
        };

        console.error('📧 Email request failed:', errorMessage, errorDetails);
        setEmailError(errorMessage);

        toast({
          title: "Unable to process your request",
          description: `We couldn't send your booking notification: ${errorMessage}. Please try again or contact us directly at krish@themindmaker.ai`,
          variant: "destructive",
        });

        // BLOCK Calendly - user must retry
        setIsLoading(false);
        return;
      }

      // Email succeeded - show thank-you screen (user can optionally book via Calendly)
      setShowThankYou(true);
      setIsLoading(false);
      return;

    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Booking error",
        description: error instanceof Error ? error.message : "Please try again or contact support",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Desktop form (unchanged)
  // -------------------------------------------------------------------------

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Content area */}
      <div className="flex-1 min-h-0 flex flex-col gap-4 px-1 sm:px-0 pr-1 overflow-y-auto">
        {/* Program Selection (only shown if not pre-selected) */}
        {!effectivePreselectedProgram && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">What brings you in?</Label>
            <RadioGroup value={selectedPath} onValueChange={setSelectedPath}>
              {pathOptions.map((path) => (
                <div key={path.value} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={path.value} id={path.value} className="mt-1" />
                  <Label
                    htmlFor={path.value}
                    className="font-normal cursor-pointer flex-1 leading-tight"
                  >
                    <div>
                      <span className="font-semibold block">{path.label}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Conditional helper text based on selection */}
            {selectedPath && (
              <div className="pl-7 py-1.5 px-3 bg-muted/50 rounded-md border border-border/50">
                <p className="text-sm text-muted-foreground">
                  {pathOptions.find(p => p.value === selectedPath)?.helper}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Name, Job Title & Email */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-[99%]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. CEO, VP of Operations"
              required
              className="w-[99%]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              className="w-[99%]"
            />
          </div>
        </div>

        {/* Value Props */}
        <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
          <div className="flex items-start gap-2 text-sm">
            <span className="text-lg">🎯</span>
            <div>
              <span className="font-semibold">Free consultation</span>
              <span className="text-muted-foreground"> • 45 minutes to map your outcomes • Zero pressure • Real conversation</span>
            </div>
          </div>
        </div>

        {/* Error Message Display */}
        {emailError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <p className="text-sm font-semibold text-destructive">Error: {emailError}</p>
            <p className="text-xs text-muted-foreground">
              Please try again. If the problem persists, contact us at krish@themindmaker.ai
            </p>
          </div>
        )}
      </div>

      {/* Fixed Submit Button - Always visible */}
      <div className="shrink-0 pt-3 mt-3 border-t border-border">
        <Button
          type="submit"
          className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold text-base py-6"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : emailError ? (
            <>
              Try Again
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          ) : (
            <>
              Reserve My Spot
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </form>
  );

  // -------------------------------------------------------------------------
  // Mobile wizard flow
  // -------------------------------------------------------------------------

  const handlePathSelect = (value: string) => {
    setSelectedPath(value);
    // Auto-advance after brief visual feedback
    setTimeout(() => goForward(), 250);
  };


  const mobileWizardContent = (
    <div className="flex flex-col h-full pb-4">
      {/* Step header + back button */}
      <div className="flex items-center gap-2 px-1 pt-1 pb-2">
        {mobileStep > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-1 text-sm text-muted-foreground active:text-foreground py-1 pr-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Progress dots */}
      <MobileStepDots total={mobileSteps.length} current={mobileStep} />

      {/* Animated step content */}
      <div className="flex-1 min-h-0 overflow-y-auto px-1 pt-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentStepId}
            initial={{ x: slideDirection * 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: slideDirection * -60, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex flex-col h-full"
          >
            {/* STEP: Program Selection */}
            {currentStepId === "path" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold mb-1">What brings you in?</h3>
                  <p className="text-sm text-muted-foreground">Pick the one that fits. We'll tailor everything from here.</p>
                </div>

                <div className="space-y-3">
                  <SelectionCard
                    selected={selectedPath === "cohort-enrollment"}
                    icon={Users}
                    title="The AI Decision Cohort"
                    subtitle="$3,500. Three weeks with 15 senior leaders."
                    onClick={() => handlePathSelect("cohort-enrollment")}
                  />
                  <SelectionCard
                    selected={selectedPath === "signal-session"}
                    icon={Zap}
                    title="The Signal Session"
                    subtitle="$15,000. One intensive day. Rapid commercial alignment."
                    onClick={() => handlePathSelect("signal-session")}
                  />
                  <SelectionCard
                    selected={selectedPath === "revenue-architecture"}
                    icon={Compass}
                    title="The Revenue Architecture"
                    subtitle="$60k to $100k. 30-day commercial build."
                    onClick={() => handlePathSelect("revenue-architecture")}
                  />
                  <SelectionCard
                    selected={selectedPath === "1-1-inquiry"}
                    icon={Calendar}
                    title="Private 1:1 engagement"
                    subtitle="By inquiry. Scope and pricing by conversation."
                    onClick={() => handlePathSelect("1-1-inquiry")}
                  />
                </div>
              </div>
            )}

            {/* STEP: Contact Info */}
            {currentStepId === "contact" && (
              <form ref={contactFormRef} onSubmit={handleSubmit} className="flex flex-col h-full">
                <div className="space-y-5 flex-1">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Almost there</h3>
                    <p className="text-sm text-muted-foreground">
                      Free 45-min consultation. No prep needed.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile-name" className="text-sm font-medium">Name</Label>
                      <Input
                        id="mobile-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile-jobTitle" className="text-sm font-medium">Job Title</Label>
                      <Input
                        id="mobile-jobTitle"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="e.g. CEO, VP of Operations"
                        required
                        className="h-12 text-base"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mobile-email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="mobile-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@company.com"
                        required
                        className="h-12 text-base"
                      />
                    </div>
                  </div>

                  {/* Error Message Display */}
                  {emailError && (
                    <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                      <p className="text-sm font-semibold text-destructive">Error: {emailError}</p>
                      <p className="text-xs text-muted-foreground">
                        Please try again or contact krish@themindmaker.ai
                      </p>
                    </div>
                  )}
                </div>

                {/* Submit button pinned at bottom */}
                <div className="shrink-0 pt-4 mt-auto">
                  <Button
                    type="submit"
                    className="w-full bg-mint text-ink hover:bg-mint/90 font-semibold text-base h-14 rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : emailError ? (
                      <>
                        Try Again
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Reserve My Spot
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Zero pressure. Real conversation.
                  </p>
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 flex flex-col max-h-[85dvh]">
          {showThankYou ? (
            <>
              <DrawerHeader className="sr-only">
                <DrawerTitle>Booking Confirmed</DrawerTitle>
                <DrawerDescription>Thank you for booking</DrawerDescription>
              </DrawerHeader>
              <ThankYouScreen firstName={firstName} onBookTime={handleBookTime} />
            </>
          ) : (
            <>
              <DrawerHeader className="text-left pb-1 shrink-0">
                <DrawerTitle className="text-lg font-bold">Book an intro call</DrawerTitle>
                <DrawerDescription className="sr-only">
                  45 minutes, zero pressure
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 min-h-0">
                {mobileWizardContent}
              </div>
            </>
          )}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        {showThankYou ? (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Booking Confirmed</DialogTitle>
              <DialogDescription>Thank you for booking</DialogDescription>
            </DialogHeader>
            <ThankYouScreen firstName={firstName} onBookTime={handleBookTime} />
          </>
        ) : (
          <>
            <DialogHeader className="shrink-0">
              <DialogTitle className="text-2xl font-bold">Book an intro call</DialogTitle>
              <DialogDescription className="text-base">
                45 minutes. Zero pressure. Real conversation.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 min-h-0">
              {formContent}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
