import { useState, useEffect } from "react";
import { CONSENT_KEY, allowAnalytics, briefIsOpen, consentStored, declineAnalytics, onConsentSignal } from "@/lib/consent";

/**
 * Withdrawing is as easy as allowing: forget the answer, remove the Google
 * Analytics and Microsoft Clarity cookies and reload, so the page starts
 * without either tag and the notice asks again.
 */
export function resetAnalyticsChoice() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Nothing stored to forget.
  }
  const host = window.location.hostname.split(".").slice(-2).join(".");
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_") && name !== "_clck" && name !== "_clsk") continue;
    for (const domain of ["", `; domain=.${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  }
  window.location.reload();
}

export const AnalyticsChoiceReset = () => (
  <button className="mm-text-button" type="button" onClick={resetAnalyticsChoice}>
    Change your analytics choice
  </button>
);

export const CookieConsent = () => {
  /* Due once the visitor leaves the first screen; shown only while no brief
     is open, because the brief asks the same question inside itself
     (`src/lib/consent.ts`), and never again once answered in either place. */
  const [due, setDue] = useState(false);
  const [briefOpen, setBriefOpenState] = useState(false);
  const [answered, setAnswered] = useState(false);
  const visible = due && !briefOpen && !answered;

  useEffect(() => {
    setBriefOpenState(briefIsOpen());
    return onConsentSignal((kind) => {
      if (kind === "answered") setAnswered(true);
      else setBriefOpenState(briefIsOpen());
    });
  }, []);

  // Keep the first-screen timing. The choice itself lives after the footer.
  useEffect(() => {
    /* A blocked storage API reads as unanswered and should not hide the
       privacy notice. */
    if (consentStored()) return;

    const show = () => {
      if (window.scrollY < window.innerHeight * 0.6) return;
      setDue(true);
      window.removeEventListener("scroll", show);
    };
    show();
    window.addEventListener("scroll", show, { passive: true });
    return () => window.removeEventListener("scroll", show);
  }, []);

  const allow = () => {
    allowAnalytics();
    setAnswered(true);
  };

  const decline = () => {
    declineAnalytics();
    setAnswered(true);
  };

  if (!visible) return null;

  return (
    <div
      className="mm-cookie-notice"
      role="region"
      aria-labelledby="privacy-notice-title"
      aria-live="polite"
    >
      <h2 id="privacy-notice-title" className="mm-visually-hidden">Privacy notice</h2>
      {/* One line. It was three on a phone, plus a button, floating over the
          reading on every screen of the visit until dismissed. Allow covers
          Google Analytics and Microsoft Clarity, named on /privacy, so the
          question names neither and stays the length that fits at 360px. */}
      <p>
        Analytics cookies? <a href="/privacy">Privacy</a>
      </p>
      {/* One group, so a narrow row moves both answers down together rather
          than leaving Decline alone on a line of its own. */}
      <div className="mm-cookie-actions">
        <button className="mm-button mm-button-small" type="button" onClick={allow}>
          Allow
        </button>
        <button className="mm-button mm-button-small" type="button" onClick={decline}>
          Decline
        </button>
      </div>
    </div>
  );
};
