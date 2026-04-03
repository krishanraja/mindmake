import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "mindmaker_consent";

export const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-ink/95 backdrop-blur-md border-t border-white/10 p-4 md:p-6">
      <div className="container-width flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-white/80 max-w-2xl">
          We use privacy-friendly analytics (no cookies) and store session data locally to improve your experience.
          See our{" "}
          <a href="/privacy" className="text-mint underline underline-offset-2">
            privacy policy
          </a>.
        </p>
        <Button
          size="sm"
          className="bg-mint text-ink hover:bg-mint/90 font-semibold shrink-0"
          onClick={accept}
        >
          Got it
        </Button>
      </div>
    </div>
  );
};
