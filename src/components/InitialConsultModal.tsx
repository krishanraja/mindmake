import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionData } from "@/contexts/SessionDataContext";
import { openCalendlyPopup } from "@/utils/calendly";
import { checkSupabaseHealth } from '@/utils/supabaseHealthCheck';

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
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { sessionData } = useSessionData();

  // Get qualification data from context or props (props take precedence)
  const qualificationData = sessionData?.qualificationData;
  const effectivePreselectedProgram = preselectedProgram || qualificationData?.preselectedProgram;
  const effectiveCommitmentLevel = commitmentLevel || qualificationData?.commitmentLevel;
  const effectiveAudienceType = audienceType || qualificationData?.audienceType;
  const effectivePathType = pathType || qualificationData?.pathType;

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

  const pathOptions = [
    { 
      value: "build", 
      label: "I want to build with AI myself",
      helper: "Hands-on systems, vibe coding, personal AI leverage."
    },
    { 
      value: "orchestrate", 
      label: "I want to set direction and make clean decisions",
      helper: "Governance, vendor decisions, board-ready strategy."
    },
  ];

  const commitmentOptions = [
    { value: "4wk", label: "4-Week Decision Sprint", description: "One nervous decision, resolved and board-ready" },
    { value: "90d", label: "90-Day Concierge Sprint", description: "Full Mind Set \u2192 Mind Map \u2192 Mind Make journey" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If preselectedProgram is provided (from props or context), selectedPath is optional
    const pathRequired = !effectivePreselectedProgram;
    // Commitment is required if we're showing the commitment question (no effective commitment from props/context)
    const commitmentRequired = !effectiveCommitmentLevel;
    
    if (!name || !email || !jobTitle || (pathRequired && !selectedPath) || (commitmentRequired && !selectedCommitment)) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
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
      
      // Email succeeded - proceed to Calendly
      try {
        await openCalendlyPopup({
          name,
          email,
          source: 'initial-consult',
          preselectedProgram: programValue,
          commitmentLevel: finalCommitmentLevel,
        });
        
        onOpenChange(false);
        toast({
          title: "Opening Calendly",
          description: "Booking your consultation...",
        });
      } catch (calendlyError) {
        console.error('Calendly error:', calendlyError);
        toast({
          title: "Booking Error",
          description: "Could not open booking page. Please try again or contact support.",
          variant: "destructive",
        });
      }
      
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

  const formContent = (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      {/* Content area */}
      <div className="flex-1 min-h-0 flex flex-col gap-4 px-1 sm:px-0 pr-1 overflow-y-auto">
        {/* Path Selection - Required First Question (only show if not pre-selected) */}
        {!effectivePreselectedProgram && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">How do you want to work with AI?</Label>
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
        
        {/* Time Commitment Question - Show if not provided via props or context */}
        {!effectiveCommitmentLevel && (
          <div className="space-y-3">
            <Label className="text-sm font-semibold">What time commitment are you looking for?</Label>
            <RadioGroup value={selectedCommitment} onValueChange={setSelectedCommitment}>
              {commitmentOptions.map((commitment) => (
                <div key={commitment.value} className="flex items-start space-x-3 space-y-0">
                  <RadioGroupItem value={commitment.value} id={commitment.value} className="mt-1" />
                  <Label 
                    htmlFor={commitment.value} 
                    className="font-normal cursor-pointer flex-1 leading-tight"
                  >
                    <div>
                      <span className="font-semibold block">{commitment.label}</span>
                      <span className="text-xs text-muted-foreground block mt-0.5">{commitment.description}</span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}
        
        {/* Show commitment level if provided (read-only display) */}
        {effectiveCommitmentLevel && (
          <div className="bg-mint/10 border border-mint/30 rounded-lg p-3">
            <p className="text-sm font-semibold text-foreground mb-0.5">Selected Commitment:</p>
            <p className="text-sm text-muted-foreground">
              {effectiveCommitmentLevel === "1hr" ? "1 Hour Session" :
               effectiveCommitmentLevel === "3hr" ? "3 Hour Session" :
               effectiveCommitmentLevel === "4wk" ? "4 Week Program" :
               effectiveCommitmentLevel === "90d" ? "90 Day Program" :
               effectiveCommitmentLevel}
            </p>
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

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 flex flex-col">
          <DrawerHeader className="text-left pb-3 shrink-0">
            <DrawerTitle className="text-xl font-bold">Book Your Initial Consult</DrawerTitle>
            <DrawerDescription className="text-sm">
              45 minutes to map your outcomes • Zero pressure • Real conversation
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 min-h-0">
            {formContent}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-2xl font-bold">Book Your Initial Consult</DialogTitle>
          <DialogDescription className="text-base">
            45 minutes to map your outcomes • Zero pressure • Real conversation
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0">
          {formContent}
        </div>
      </DialogContent>
    </Dialog>
  );
};
