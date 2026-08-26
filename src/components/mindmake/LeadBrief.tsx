import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Download, LoaderCircle, X } from "lucide-react";
import type { Dossier } from "@/components/diagnosis/types";
import {
  buildMindmakeBriefConfirmV2,
  buildMindmakeBriefRequestV2,
  isMindmakeBriefResponseV2,
  NEWSLETTER_CONSENT_WORDING,
  PRESSURE_IDS,
  RETURNED_TIME_IDS,
  type MindmakeConfirmedResponseV2,
  type BriefRoute,
} from "@/components/mindmake/leadDelivery";
import { buildPrivateBriefHtml, type PrivateBriefContent } from "@/components/mindmake/privateBriefHtml";

export type { BriefRoute } from "@/components/mindmake/leadDelivery";

interface LeadBriefProps {
  open: boolean;
  onClose: () => void;
  route?: BriefRoute;
}

type Step = "domain" | "reading" | "pressure" | "capacity" | "preview" | "contact" | "verify" | "success";

export const COMPANY_READ_TIMEOUT_MS = 10_000;
export const BRIEF_BLOB_REVOKE_DELAY_MS = 1_000;

const createRequestId = () => {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === "function") return cryptoApi.randomUUID();

  const randomParts = new Uint32Array(4);
  if (typeof cryptoApi?.getRandomValues === "function") {
    cryptoApi.getRandomValues(randomParts);
  } else {
    randomParts.forEach((_, index) => {
      randomParts[index] = Math.floor(Math.random() * 0xffffffff);
    });
  }
  return `mindmake-${Date.now().toString(36)}-${Array.from(randomParts, (part) => part.toString(36)).join("")}`;
};

const PRESSURES = {
  default: [
    "Customers can now do more without us",
    "Our price no longer matches the value",
    "The team is building faster than it can choose",
    "The real problem is still unclear",
  ],
  brain: [
    "Too much important context lives in my head",
    "I avoid work that still needs my judgement",
    "I keep searching for things I should already know",
    "I need more room for important decisions",
  ],
  gtm: [
    "Customers can now do more without us",
    "Our product is moving faster than our message",
    "Our price still reflects the old work",
    "The team has too many possible moves",
  ],
} as const;

const CAPACITY_CHOICES = [
  "Grow this business",
  "Help more companies",
  "Build my AI skill",
  "Make room for important decisions",
] as const;

const capacityDetail = (capacity: string) => {
  switch (capacity) {
    case "Grow this business":
      return "Protect that time for product, buyers and the few decisions that can change growth.";
    case "Help more companies":
      return "Use the same judgement across more companies without lowering the quality of the work.";
    case "Build my AI skill":
      return "Test better ways of working until you can improve the system yourself.";
    case "Make room for important decisions":
      return "Move preparation and routine checks out of the day, then protect time for decisions only you can make.";
    default:
      return "Choose where the returned time would create more value before deciding what to automate.";
  }
};

const pressureDetail = (pressure: string) => {
  const normalised = pressure.toLowerCase();
  if (normalised.includes("customers can now")) {
    return {
      carry: "Compare what customers can now do alone with the work they still struggle to finish or trust.",
      human: "Choose the result your business should still own and the buyer it is best placed to help.",
      proof: "Put one revised offer in front of real buyers and learn which part still earns a clear yes.",
    };
  }
  if (normalised.includes("context") || normalised.includes("searching")) {
    return {
      carry: "Hold the facts, examples, past choices and useful relationships in one place.",
      human: "Decide what matters, when a rule should bend and who deserves your trust.",
      proof: "Build one useful memory around a live decision, then use it twice on real work.",
    };
  }
  if (normalised.includes("price")) {
    return {
      carry: "Compare what changed in the work, the buyer and the cost to deliver it.",
      human: "Choose what you want to be paid for and which customer the offer is really for.",
      proof: "Test one new package and price with real buyers before a wider change.",
    };
  }
  if (normalised.includes("message")) {
    return {
      carry: "Bring product changes, buyer language and live objections into the same view.",
      human: "Choose the promise you can stand behind and the proof that earns it.",
      proof: "Rebuild one offer and put it in front of real buyers inside 30 days.",
    };
  }
  if (normalised.includes("building") || normalised.includes("moves") || normalised.includes("choose")) {
    return {
      carry: "Keep the options, evidence and reasons visible so the team can compare them.",
      human: "Make the hard choice and decide what the team will stop doing.",
      proof: "Choose one costly decision, make the call and start the first useful build.",
    };
  }
  if (normalised.includes("avoid")) {
    return {
      carry: "Prepare the first version, keep the routine moving and bring exceptions to you.",
      human: "Set the standard and make the calls that need your taste or trust.",
      proof: "Take one job you avoid and build a working system that still keeps you in charge.",
    };
  }
  return {
    carry: "Research the company, hold the competing facts and show where the question may sit.",
    human: "Name the real problem and choose which result matters enough to test.",
    proof: "Use 30 days to find the decision underneath the noise and build the first proof.",
  };
};

const cleanDomain = (value: string) => {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
};

const isPublicHostname = (hostname: string) => {
  if (!hostname || hostname.length > 253 || hostname.startsWith(".") || hostname.endsWith(".")) return false;
  const labels = hostname.split(".");
  if (labels.length < 2) return false;
  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  if (!labels.every((label) => validLabel.test(label))) return false;
  return /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(labels.at(-1) || "");
};

const usesCoarseInteraction = () => {
  const coarsePointer = typeof window.matchMedia === "function"
    && window.matchMedia("(pointer: coarse)").matches;
  return coarsePointer || navigator.maxTouchPoints > 0;
};

const readableText = (value: unknown): string => {
  const text = typeof value === "string"
    ? value.trim()
    : Array.isArray(value)
      ? value
        .filter((part): part is string => typeof part === "string")
        .map((part) => part.trim())
        .filter(Boolean)
        .join(" ")
      : "";

  const words = text.split(/\s+/).filter(Boolean);
  const commaEndedWords = words.filter((word) => word.endsWith(",")).length;
  if (words.length >= 12 && commaEndedWords / words.length >= 0.5) {
    return text
      .replace(/(\d),\s+(?=\d{3}\b)/g, "$1,")
      .replace(/,\s+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return text;
};

export function LeadBrief({ open, onClose, route = "home" }: LeadBriefProps) {
  const [step, setStep] = useState<Step>("domain");
  const [domainInput, setDomainInput] = useState("");
  const [domain, setDomain] = useState("");
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [liveRead, setLiveRead] = useState(false);
  const [pressure, setPressure] = useState("");
  const [capacity, setCapacity] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [handoffResult, setHandoffResult] = useState<MindmakeConfirmedResponseV2 | null>(null);
  const [researchIssue, setResearchIssue] = useState("");
  const [error, setError] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const researchAbortRef = useRef<AbortController | null>(null);
  const handoffAbortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(createRequestId());
  const journeyVersionRef = useRef(0);
  const handoffEnabled = import.meta.env.VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED === "true";

  const company = dossier?.identity?.name || domain.split(".")[0]?.replace(/[-_]/g, " ") || "Your business";
  const known = readableText(dossier?.synthesis)
    || readableText(dossier?.understanding?.descriptor)
    || readableText(dossier?.understanding?.tagline)
    ||
    `We can use ${domain} as the start, then check the offer, the market and the work that still needs a human call.`;
  const detail = useMemo(() => pressureDetail(pressure), [pressure]);
  const timeValue = useMemo(() => capacityDetail(capacity), [capacity]);
  const evidence = useMemo(() => {
    const products = dossier?.understanding?.products?.filter(Boolean).slice(0, 3) ?? [];
    const signal = dossier?.currency?.find((item) => item.text?.trim())?.text?.trim();
    const items = products.length ? [`What it appears to sell: ${products.join(", ")}.`] : [];
    if (signal) items.push(`A recent signal worth checking: ${signal}`);
    return items;
  }, [dossier]);
  const choices = PRESSURES[route] ?? PRESSURES.default;

  const brief = useMemo<PrivateBriefContent>(() => ({
    company,
    domain,
    pressure: pressure || "The real problem still needs a name",
    capacityValue: timeValue,
    known,
    evidence,
    ...detail,
  }), [company, detail, domain, evidence, known, pressure, timeValue]);

  const resetJourney = useCallback(() => {
    journeyVersionRef.current += 1;
    researchAbortRef.current?.abort();
    researchAbortRef.current = null;
    handoffAbortRef.current?.abort();
    handoffAbortRef.current = null;
    setStep("domain");
    setDomainInput("");
    setDomain("");
    setDossier(null);
    setLiveRead(false);
    setPressure("");
    setCapacity("");
    setEmail("");
    setVerificationCode("");
    setNewsletter(false);
    setSubmitting(false);
    setHandoffResult(null);
    setResearchIssue("");
    setError("");
    requestIdRef.current = createRequestId();
  }, []);

  useEffect(() => {
    if (!open) {
      resetJourney();
      return;
    }
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("mm-dialog-open");
    return () => {
      document.body.classList.remove("mm-dialog-open");
      previousFocus.current?.focus();
      previousFocus.current = null;
    };
  }, [open, resetJourney]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled])"));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      panelRef.current?.scrollTo?.({ top: 0 });
      const focusTarget = !usesCoarseInteraction() && (step === "domain" || step === "contact" || step === "verify")
        ? firstFieldRef.current
        : stepHeadingRef.current;
      focusTarget?.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(focusTimer);
  }, [open, step]);

  useEffect(() => {
    if (!open || !backdropRef.current) return;

    const backdrop = backdropRef.current;
    const visualViewport = window.visualViewport;
    let animationFrame = 0;
    let layoutHeight = Math.max(
      window.innerHeight,
      visualViewport ? visualViewport.height + visualViewport.offsetTop : 0,
    );

    const centreActiveField = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const activeElement = document.activeElement;
        const isField = activeElement instanceof HTMLInputElement
          || activeElement instanceof HTMLTextAreaElement
          || activeElement instanceof HTMLSelectElement;
        if (isField && panelRef.current?.contains(activeElement)) {
          activeElement.scrollIntoView?.({ block: "center", inline: "nearest" });
        }
      });
    };

    const syncViewport = (centreField: boolean) => {
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const width = viewport?.width ?? window.innerWidth;
      const offsetTop = viewport?.offsetTop ?? 0;
      const offsetLeft = viewport?.offsetLeft ?? 0;
      const visibleBottom = height + offsetTop;
      layoutHeight = Math.max(layoutHeight, window.innerHeight, visibleBottom);
      const keyboardInset = Math.max(0, layoutHeight - visibleBottom);

      backdrop.style.setProperty("--mm-brief-viewport-height", `${Math.round(height)}px`);
      backdrop.style.setProperty("--mm-brief-viewport-width", `${Math.round(width)}px`);
      backdrop.style.setProperty("--mm-brief-viewport-top", `${Math.round(offsetTop)}px`);
      backdrop.style.setProperty("--mm-brief-viewport-left", `${Math.round(offsetLeft)}px`);
      backdrop.style.setProperty("--mm-brief-keyboard-inset", `${Math.round(keyboardInset)}px`);

      if (centreField) centreActiveField();
    };

    const onVisualViewportResize = () => syncViewport(true);
    const onVisualViewportScroll = () => syncViewport(false);
    const onWindowResize = () => syncViewport(true);
    const onOrientationChange = () => {
      const viewport = window.visualViewport;
      layoutHeight = Math.max(
        window.innerHeight,
        viewport ? viewport.height + viewport.offsetTop : 0,
      );
      syncViewport(true);
    };

    syncViewport(false);
    visualViewport?.addEventListener("resize", onVisualViewportResize);
    visualViewport?.addEventListener("scroll", onVisualViewportScroll);
    window.addEventListener("resize", onWindowResize);
    window.addEventListener("orientationchange", onOrientationChange);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      visualViewport?.removeEventListener("resize", onVisualViewportResize);
      visualViewport?.removeEventListener("scroll", onVisualViewportScroll);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("orientationchange", onOrientationChange);
    };
  }, [open]);

  const readCompany = async (nextDomain: string) => {
    researchAbortRef.current?.abort();
    const controller = new AbortController();
    researchAbortRef.current = controller;
    const journeyVersion = journeyVersionRef.current;
    let timedOut = false;
    let timeoutId = 0;

    setError("");
    setResearchIssue("");
    setDomain(nextDomain);
    setDossier(null);
    setLiveRead(false);
    setStep("reading");
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const companyRead = supabase.functions.invoke<Dossier>("enrich-company", {
        body: { domain: nextDomain, depth: "full" },
        signal: controller.signal,
        timeout: COMPANY_READ_TIMEOUT_MS,
      });
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => {
          timedOut = true;
          controller.abort();
          reject(new Error("company-read-timeout"));
        }, COMPANY_READ_TIMEOUT_MS);
      });
      const { data, error: invokeError } = await Promise.race([companyRead, timeout]);
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      if (invokeError || !data) throw invokeError || new Error("No company read returned");
      const safeDossier = { ...data };
      delete safeDossier.scale;
      setDossier(safeDossier);
      setLiveRead(true);
      setStep("pressure");
    } catch {
      if (controller.signal.aborted && !timedOut) return;
      if (journeyVersion !== journeyVersionRef.current) return;
      setDossier(null);
      setLiveRead(false);
      setResearchIssue(
        timedOut
          ? "The live read took too long. You can keep going with this starting point, or try once more."
          : "The live read did not answer. You can keep going with this starting point, or try once more.",
      );
      setStep("pressure");
    } finally {
      window.clearTimeout(timeoutId);
      if (researchAbortRef.current === controller) researchAbortRef.current = null;
    }
  };

  const researchCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextDomain = cleanDomain(domainInput);
    if (!isPublicHostname(nextDomain)) {
      setError("Add a company website, such as company.com.");
      firstFieldRef.current?.focus();
      return;
    }
    void readCompany(nextDomain);
  };

  const retryResearch = () => {
    if (domain) void readCompany(domain);
  };

  const requestVerification = async () => {
    setError("");
    const request = buildMindmakeBriefRequestV2({
      domain,
      capacityChoice: capacity as keyof typeof RETURNED_TIME_IDS,
      email,
      pressure: pressure as keyof typeof PRESSURE_IDS,
      publicationRequested: newsletter,
      requestId: requestIdRef.current,
      route,
    });
    handoffAbortRef.current?.abort();
    const controller = new AbortController();
    handoffAbortRef.current = controller;
    const journeyVersion = journeyVersionRef.current;
    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error: invokeError } = await supabase.functions.invoke("submit-mindmake-brief", {
        body: request,
        signal: controller.signal,
      });
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      if (invokeError || !isMindmakeBriefResponseV2(data) || data.status !== "verification_required") {
        throw invokeError || new Error("verification-not-sent");
      }

      requestIdRef.current = data.requestId;
      setVerificationCode("");
      setStep("verify");
    } catch {
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      setHandoffResult(null);
      setError("The code could not be sent. Try again, or download the brief from the previous step.");
    } finally {
      if (journeyVersion === journeyVersionRef.current) setSubmitting(false);
      if (handoffAbortRef.current === controller) handoffAbortRef.current = null;
    }
  };

  const confirmVerification = async () => {
    setError("");
    const request = buildMindmakeBriefConfirmV2({
      code: verificationCode,
      email,
      requestId: requestIdRef.current,
    });
    handoffAbortRef.current?.abort();
    const controller = new AbortController();
    handoffAbortRef.current = controller;
    const journeyVersion = journeyVersionRef.current;
    setSubmitting(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error: invokeError } = await supabase.functions.invoke("submit-mindmake-brief", {
        body: request,
        signal: controller.signal,
      });
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      if (invokeError || !isMindmakeBriefResponseV2(data) || data.status !== "confirmed") {
        throw invokeError || new Error("confirmation-not-complete");
      }
      if (!newsletter && data.publicationInterestRecorded) {
        throw new Error("publication-choice-mismatch");
      }
      if (data.visitorDelivery !== "queued" && data.operatorDelivery !== "queued") {
        throw new Error("delivery-not-confirmed");
      }

      setHandoffResult(data);
      if (newsletter && !data.publicationInterestRecorded) {
        setError("Your publication interest was not recorded. You have not been added to any list.");
      }
      setStep("success");
    } catch (caught) {
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      setHandoffResult(null);
      const mismatch = caught instanceof Error && caught.message === "publication-choice-mismatch";
      const deliveryFailure = caught instanceof Error && caught.message === "delivery-not-confirmed";
      setError(mismatch
        ? "The reply included a publication choice you did not make. Nothing is described as confirmed."
        : deliveryFailure
          ? "The code was accepted, but neither hand-off was confirmed. Download your copy and email Krish directly if you want him to see it."
          : "That code was not accepted. Check the six digits and try again.");
      if (deliveryFailure || mismatch) setStep("success");
    } finally {
      if (journeyVersion === journeyVersionRef.current) setSubmitting(false);
      if (handoffAbortRef.current === controller) handoffAbortRef.current = null;
    }
  };

  const submitLead = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Add a valid work email.");
      firstFieldRef.current?.focus();
      return;
    }
    void requestVerification();
  };

  const submitVerification = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\d{6}$/.test(verificationCode)) {
      setError("Enter the six-digit code from the email.");
      firstFieldRef.current?.focus();
      return;
    }
    void confirmVerification();
  };

  const changeVerificationEmail = () => {
    requestIdRef.current = createRequestId();
    setError("");
    setVerificationCode("");
    setStep("contact");
  };

  const resendVerification = () => {
    requestIdRef.current = createRequestId();
    setVerificationCode("");
    void requestVerification();
  };

  const keepBrief = () => {
    setError("");
    setHandoffResult(null);
    setStep(handoffEnabled ? "contact" : "success");
  };

  const downloadBrief = () => {
    const blob = new Blob([buildPrivateBriefHtml(brief)], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mindmake-${domain.replace(/[^a-z0-9]+/gi, "-")}-private-brief.html`;
    link.hidden = true;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), BRIEF_BLOB_REVOKE_DELAY_MS);
  };

  const operatorHasContext = handoffResult?.operatorDelivery === "queued";
  const visitorEmailQueued = handoffResult?.visitorDelivery === "queued";
  const successTitle = !handoffEnabled
    ? "Keep this. Your brief is ready."
    : visitorEmailQueued && operatorHasContext
      ? "Your brief is on its way. Krish's copy was queued too."
      : visitorEmailQueued
        ? "Your brief is on its way."
        : operatorHasContext
          ? "Krish's copy was queued. Keep yours here."
          : "Keep this. Your brief is still ready.";
  const successBody = !handoffEnabled
    ? "Download it now. Nothing has been sent to Krish, and no email has been sent."
    : visitorEmailQueued && operatorHasContext
      ? "The email was queued. Download a copy now too. Krish can reply if there is a useful fit or thought to add."
      : visitorEmailQueued
        ? "The email was queued. Krish was not given the context. Email krish@themindmaker.ai if you also want him to see it."
        : operatorHasContext
          ? "Krish's copy was queued. Your email was not, so download your copy now."
          : "The hand-off was not confirmed. Your download is still ready.";

  if (!open) return null;

  return (
    <div ref={backdropRef} className="mm-brief-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="mm-brief-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mm-brief-title">
        <div className="mm-brief-top">
          <span>Mindmake</span>
          <button type="button" aria-label="Close" onClick={onClose}><X aria-hidden="true" /></button>
        </div>

        {step === "domain" && (
          <section className="mm-brief-step is-domain">
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Show me the business.</h2>
            <p>Start with the company website. Mindmake will do the reading before it asks you to explain the problem.</p>
            <form onSubmit={researchCompany}>
              <label htmlFor="mm-company-domain">Company website</label>
              <input
                ref={firstFieldRef}
                id="mm-company-domain"
                value={domainInput}
                onChange={(event) => { setDomainInput(event.target.value); if (error) setError(""); }}
                inputMode="url"
                autoComplete="url"
                placeholder="company.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "mm-company-domain-error" : undefined}
              />
              {error && <p id="mm-company-domain-error" className="mm-form-error" role="alert">{error}</p>}
              <button className="mm-button" type="submit">Read the business <span aria-hidden="true">→</span></button>
            </form>
            <small>No email or brief is sent from this step. Mindmake may use public company information to make the read. <a href="/privacy" target="_blank" rel="noreferrer">How the starting read handles information</a>.</small>
          </section>
        )}

        {step === "reading" && (
          <section className="mm-brief-step mm-reading is-reading" aria-live="polite">
            <LoaderCircle className="mm-spinner" aria-hidden="true" />
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Reading {domain}.</h2>
            <p>Finding what the company does, what it sells and where AI may have changed the choice. This takes up to 10 seconds.</p>
          </section>
        )}

        {step === "pressure" && (
          <section className="mm-brief-step is-pressure">
            <button className="mm-step-back" type="button" onClick={() => setStep("domain")}>← Change website</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">This is what I can see so far.</h2>
            <div className="mm-company-read">
              {dossier?.identity?.logoUrl && <img src={dossier.identity.logoUrl} alt={`${company} logo`} onError={(event) => { event.currentTarget.hidden = true; }} />}
              <div>
                <strong>{company}</strong><p>{known}</p>
                {evidence.length > 0 && <ul>{evidence.map((item) => <li key={item}>{item}</li>)}</ul>}
              </div>
            </div>
            {!liveRead && (
              <>
                <p className="mm-honesty-note">{researchIssue || "Live research did not answer, so this is a starting point based on the website. It does not pretend to know more."}</p>
                <button className="mm-text-button" type="button" onClick={retryResearch}>Try the live read again</button>
              </>
            )}
            <fieldset>
              <legend>Which problem feels closest?</legend>
              <div className="mm-choice-grid">
                {choices.map((item) => (
                  <button key={item} type="button" aria-pressed={pressure === item} onClick={() => setPressure(item)}>{item}</button>
                ))}
              </div>
            </fieldset>
            <button className="mm-button" type="button" disabled={!pressure} onClick={() => setStep("capacity")}>Use this problem <span aria-hidden="true">→</span></button>
          </section>
        )}

        {step === "capacity" && (
          <section className="mm-brief-step is-capacity">
            <button className="mm-step-back" type="button" onClick={() => setStep("pressure")}>← Back to the problem</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">If you got more of your best time back, where would you put it?</h2>
            <div className="mm-choice-grid mm-capacity-grid">
              {CAPACITY_CHOICES.map((item) => (
                <button key={item} type="button" aria-pressed={capacity === item} onClick={() => setCapacity(item)}>{item}</button>
              ))}
            </div>
            {capacity && <p className="mm-value-preview" aria-live="polite"><strong>What that time could buy</strong>{timeValue}</p>}
            <button className="mm-button" type="button" disabled={!capacity} onClick={() => setStep("preview")}>Show me the recommendation <span aria-hidden="true">→</span></button>
          </section>
        )}

        {step === "preview" && (
          <section className="mm-brief-step mm-preview is-preview">
            <button className="mm-step-back" type="button" onClick={() => setStep("capacity")}>← Back to your time</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">{pressure}.</h2>
            <div className="mm-brief-result-grid">
              <article className="is-wide is-read"><small>What we saw at {company}</small><p>{known}</p></article>
              <article><small>AI can carry</small><p>{detail.carry}</p></article>
              <article><small>You keep</small><p>{detail.human}</p></article>
              <article className="is-wide"><small>A useful 30-day proof</small><strong>{detail.proof}</strong></article>
              <article className="is-wide is-time"><small>What the returned time could buy</small><p>{timeValue}</p></article>
            </div>
            <button className="mm-button" type="button" onClick={keepBrief}>Keep the private brief <span aria-hidden="true">→</span></button>
          </section>
        )}

        {step === "contact" && (
          <section className="mm-brief-step is-contact">
            <button className="mm-step-back" type="button" onClick={() => setStep("preview")}>← Back to the brief</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Email the private brief.</h2>
            <p>Enter your work email. Mindmake will send a six-digit code first. This keeps the brief private and checks that the address is yours.</p>
            <form onSubmit={submitLead}>
              <label htmlFor="mm-work-email">Work email</label>
              <input
                ref={firstFieldRef}
                id="mm-work-email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }}
                inputMode="email"
                autoComplete="email"
                placeholder="you@company.com"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "mm-work-email-error" : undefined}
              />
              <label className="mm-consent">
                <input type="checkbox" checked={newsletter} onChange={(event) => setNewsletter(event.target.checked)} />
                <span>{NEWSLETTER_CONSENT_WORDING}</span>
              </label>
              {error && <p id="mm-work-email-error" className="mm-form-error" role="alert">{error}</p>}
              <button className="mm-button" type="submit" disabled={submitting}>{submitting ? "Sending the code..." : "Send the code"} <span aria-hidden="true">→</span></button>
            </form>
            <small>Nothing is sent to Krish until you confirm the code. The publication box is separate and unticked. It records interest only. It does not subscribe you. <a href="/privacy" target="_blank" rel="noreferrer">How the private brief handles information</a>.</small>
          </section>
        )}

        {step === "verify" && (
          <section className="mm-brief-step is-verify">
            <button className="mm-step-back" type="button" onClick={changeVerificationEmail}>← Change email</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Check your email.</h2>
            <p>Enter the six-digit code sent to {email}. It expires after 10 minutes.</p>
            <form onSubmit={submitVerification}>
              <label htmlFor="mm-verification-code">Six-digit code</label>
              <input
                ref={firstFieldRef}
                id="mm-verification-code"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "mm-verification-code-error" : undefined}
              />
              {error && <p id="mm-verification-code-error" className="mm-form-error" role="alert">{error}</p>}
              <button className="mm-button" type="submit" disabled={submitting}>{submitting ? "Checking the code..." : "Send my private brief"} <span aria-hidden="true">→</span></button>
            </form>
            <button className="mm-text-button" type="button" disabled={submitting} onClick={resendVerification}>{submitting ? "Sending a new code..." : "Send a new code"}</button>
            <small>The full brief goes to this verified address. Krish receives the same context only after the code is confirmed.</small>
          </section>
        )}

        {step === "success" && (
          <section className="mm-brief-step mm-success is-success" aria-live="polite">
            <span className="mm-success-mark"><Check aria-hidden="true" /></span>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">{successTitle}</h2>
            <p>{successBody}</p>
            {handoffResult?.publicationInterestRecorded && (
              <p>Your request for an invitation to the publication was recorded. You have not been subscribed.</p>
            )}
            {error && <p className="mm-form-error" role="alert">{error}</p>}
            <div className="mm-success-actions">
              <button className="mm-button" type="button" onClick={downloadBrief}><Download aria-hidden="true" /> Download my brief</button>
              {handoffEnabled && !handoffResult && email && (
                <a className="mm-text-button" href="mailto:krish@themindmaker.ai?subject=My%20Mindmake%20brief">Email Krish directly</a>
              )}
              <button className="mm-text-button" type="button" onClick={onClose}>Return to the site</button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
