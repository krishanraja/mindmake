import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Check, Download, LoaderCircle, X } from "lucide-react";
import type { CompanyDossier as Dossier } from "@/components/mindmake/companyRead";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
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
import type { Details } from "@/components/mindmake/journeys/DetailsJourney";
import { HumanHandoff } from "@/components/mindmake/HumanHandoff";
import { BrandMarks } from "@/components/mindmake/MindmakeBrand";
import { MindmakeProposal } from "@/components/mindmake/MindmakeProposal";
import { buildPrivateBriefHtml, type PrivateBriefContent } from "@/components/mindmake/privateBriefHtml";
import "@/styles/mindmake-brief.css";
import { CONTACT_EMAIL, SUBSCRIBE_LABEL, SUBSCRIBE_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";
import {
  KEYBOARD_OPEN_THRESHOLD_PX,
  fieldAction,
  fieldGroup,
  isTextEntry,
  revealWithinScroller,
  useKeyboardSafeViewport,
} from "@/hooks/useKeyboardSafeViewport";
import opportunitiesFilm from "@/assets/films/sep2026/opportunities-resolve-loop-r01-20s-720p-web-sealed.mp4";
import opportunitiesPoster from "@/assets/films/sep2026/opportunities-resolve-poster.webp";
import {
  DIVISIONS,
  FREE_EMAIL_PROBLEM,
  domainFromEmail,
  nameFromEmail,
  workEmailProblem,
  type Division,
} from "@/lib/workEmail";

export type { BriefRoute } from "@/components/mindmake/leadDelivery";

interface LeadBriefProps {
  open: boolean;
  onClose: () => void;
  route?: BriefRoute;
  presentation?: "modal" | "drawer";
  /** A domain the page already collected, so the dialog opens on the read. */
  initialDomain?: string;
  /** The work email the page already collected, so nobody types it twice. The
      code still has to be confirmed: this fills the field, it does not skip a
      step. */
  initialEmail?: string;
  /** A plain-language choice already made on the route. It remains visible in
      the brief but is not sent as a new backend field. */
  initialContext?: string;
  /** Fires once, when a verified request has been confirmed. */
  onConfirmed?: () => void;
  /**
   * The four details, when the page collected them before opening this.
   *
   * Only used if something in here fails: it is what lets the offer of a person
   * be one button rather than a fourth form at the worst possible moment. The
   * dialog is opened without it from every "Start here" on the site, and the
   * offer asks for what it needs in that case.
   */
  visitor?: Details;
  /** Browser-history identity for this attempt. It restores an interrupted
      draft on refresh or Forward without carrying it into a fresh CTA. */
  journeyKey?: string | null;
}

/* The approved entry separates the company from the person. A work email starts
   the public read, then name and division are collected while that read runs.
   The same four validated values still exist before the visitor can see the
   company read, and the downstream version 2 request remains unchanged. */
type Step = "door" | "company" | "profile" | "reading" | "pressure" | "capacity" | "preview" | "contact" | "verify" | "success";
type CompanyReadState = "idle" | "reading" | "ready" | "failed";

/**
 * The two doors, and why the dialog sometimes has to ask.
 *
 * Each door carries its own four pressure questions in `PRESSURES` below, and
 * until 1 September 2026 nothing on the homepage passed a route, so every
 * visitor who started there met `PRESSURES.default`, a generic set belonging
 * to neither door. The homepage now forks at the button. Everything else that
 * opens this without a door, the sticky bar, the menu, /case-studies and a
 * shared `?start=1` link, asks here instead, before the four details.
 */
const DOOR_CHOICES: ReadonlyArray<{ route: BriefRoute; label: string; line: string }> = [
  { route: "brain", label: "Build your AI brain", line: "An AI that knows your standards, your context and the decisions you have already made." },
  { route: "gtm", label: "Build your AI GTM", line: "One part of how you sell, rebuilt: what you offer, what you charge, how you stand out, who sells." },
];

/* The dialog's tone arc: the question in the dark, the read on paper, the
   recommendation revealed on forest, the forms back on paper, and the
   proposal handed over on forest. */
const STEP_TONES: Record<Step, "ink" | "forest" | "paper"> = {
  door: "ink",
  company: "paper",
  profile: "paper",
  reading: "ink",
  pressure: "paper",
  capacity: "paper",
  preview: "forest",
  contact: "paper",
  verify: "paper",
  success: "forest",
};

/* The three messages in here that are dead ends rather than corrections.
   Named, because the offer under each one has to be able to tell which message
   is on screen, and a copy of the sentence typed out at the point of use is a
   copy that goes stale the first time the wording is improved. */
export const CODE_NOT_SENT =
  "The code could not be sent. Try again, or download the brief from the previous step.";
export const CODE_NOT_ACCEPTED =
  "That code was not accepted. Check the six digits and try again.";
export const DELIVERY_NOT_CONFIRMED =
  "The code was accepted, but neither hand-off was confirmed. Download your copy and email us directly if you want it seen.";

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

/* Two doors carry their own pressures; the homepage falls back to the generic
   set. Typed as exactly that, so the fallback below is a stated intent rather
   than an accident the compiler could not see. */
const PRESSURES: Partial<Record<BriefRoute, readonly string[]>> & { default: readonly string[] } = {
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

/* Lens label lookup for tailored choices: the server anchors every tailored
   pressure to one generic lens, whose id maps back to a locked label. */
const LENS_LABELS = Object.fromEntries(
  Object.entries(PRESSURE_IDS).map(([label, id]) => [id, label]),
) as Record<string, keyof typeof PRESSURE_IDS>;

interface TailoredPressure {
  id: string;
  label: string;
  lensId: string;
}

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

const capacityShort = (capacity: string) => {
  switch (capacity) {
    case "Grow this business": return "Grow";
    case "Help more companies": return "Help";
    case "Build my AI skill": return "Learn";
    case "Make room for important decisions": return "Decide";
    default: return "Time";
  }
};

const pressureShort = (pressure: string) => {
  const normalised = pressure.toLowerCase();
  if (normalised.includes("message")) return "Message";
  if (normalised.includes("price")) return "Price";
  if (normalised.includes("customer")) return "Customer";
  if (normalised.includes("context") || normalised.includes("search")) return "Context";
  if (normalised.includes("decision") || normalised.includes("choose")) return "Decision";
  if (normalised.includes("build") || normalised.includes("moves")) return "Priorities";
  return "Problem";
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
      proof: "Rebuild one offer and put it in front of real buyers before the work ends.",
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
    proof: "Find the decision underneath the noise and build the first proof around it.",
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

/* The keyboard handling is shared with the site's other text dialogs. */
export { KEYBOARD_OPEN_THRESHOLD_PX };
const BRIEF_CHROME = ".mm-brief-top, .mm-brief-path";

/* The read is a written brief, not a conversation: any sentence that asks the
   visitor something, or invites a correction, is dropped before display. The
   server applies the same rule before the read is stored or emailed. */
const declarativeOnly = (text: string): string => {
  const sentences = text.match(/[^.!?]+[.!?]+["')\]]*\s*|[^.!?]+$/g) ?? [];
  return sentences
    .map((sentence) => sentence.trim())
    .filter((sentence) =>
      sentence.length > 0
      && !sentence.includes("?")
      && !/\b(tell me|let me know|correct me|if I(?:'| a)m (?:wrong|off))\b/i.test(sentence))
    .join(" ")
    .trim();
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
    return declarativeOnly(text
      .replace(/(\d),\s+(?=\d{3}\b)/g, "$1,")
      .replace(/,\s+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim());
  }

  return declarativeOnly(text);
};

export function LeadBrief({ open, onClose, route = "home", presentation = "modal", initialDomain, initialEmail, initialContext, onConfirmed, visitor, journeyKey }: LeadBriefProps) {
  /* Opened without a door, the first thing to settle is which one. Given one,
     that question has an obvious answer and asking it would be furniture. */
  const [step, setStep] = useState<Step>(route === "home" ? "door" : "company");
  const [door, setDoor] = useState<BriefRoute>(route);
  /* What this dialog collected itself. On /ai-gtm the page has already asked,
     and hands them in through `visitor`; opened cold from the homepage or the
     archive there is nobody upstream, so it asks and keeps them here. Either
     way the offer of a person ends up with a name and a division. */
  const [collected, setCollected] = useState<Details | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  /* The names last read from the work email. A field still holding its guess
     was filled by us and may be refilled when the address changes; anything
     else was typed and is left alone. */
  const [autoNames, setAutoNames] = useState({ first: "", last: "" });
  const [division, setDivision] = useState<Division | "">("");
  const [entryError, setEntryError] = useState("");
  const [entryErrorField, setEntryErrorField] = useState<"email" | "name" | "division" | null>(null);
  const [domain, setDomain] = useState("");
  const [companyReadState, setCompanyReadState] = useState<CompanyReadState>("idle");
  const [dossier, setDossier] = useState<Dossier | null>(null);
  const [liveRead, setLiveRead] = useState(false);
  const [pressure, setPressure] = useState("");
  const [tailoredChoice, setTailoredChoice] = useState<TailoredPressure | null>(null);
  const [showGenericChoices, setShowGenericChoices] = useState(false);
  const [capacity, setCapacity] = useState("");
  const [previousCapacity, setPreviousCapacity] = useState<string | null>(null);
  const [previewLeaf, setPreviewLeaf] = useState(0);
  const [previewCompact, setPreviewCompact] = useState(false);
  const [timeEditorOpen, setTimeEditorOpen] = useState(false);
  const [timeDraft, setTimeDraft] = useState("");
  const [keepConfirmOpen, setKeepConfirmOpen] = useState(false);
  const [previewAnnouncement, setPreviewAnnouncement] = useState("");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeResent, setCodeResent] = useState(false);
  const [stepAnnouncement, setStepAnnouncement] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [handoffResult, setHandoffResult] = useState<MindmakeConfirmedResponseV2 | null>(null);
  const [researchIssue, setResearchIssue] = useState("");
  const [error, setError] = useState("");
  const [draftHydratedFor, setDraftHydratedFor] = useState("");
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previewInstrumentRef = useRef<HTMLDivElement>(null);
  const previewTouchXRef = useRef<number | null>(null);
  const previewReturnFocusRef = useRef<HTMLElement | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const choiceActionRef = useRef<HTMLButtonElement>(null);
  const revealChoiceActionRef = useRef(false);
  const lastAutoSubmittedRef = useRef("");
  const firstDivisionRef = useRef<HTMLButtonElement>(null);
  const divisionSelectRef = useRef<HTMLSelectElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const researchAbortRef = useRef<AbortController | null>(null);
  const handoffAbortRef = useRef<AbortController | null>(null);
  const requestIdRef = useRef(createRequestId());
  const journeyVersionRef = useRef(0);
  const profileSubmittedRef = useRef(false);
  const handoffEnabled = import.meta.env.VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED === "true";
  const draftStorageKey = journeyKey ? `mindmake-brief-draft:${journeyKey}` : "";

  const company = dossier?.identity?.name || domain.split(".")[0]?.replace(/[-_]/g, " ") || "Your business";
  const known = readableText(dossier?.synthesis)
    || readableText(dossier?.understanding?.descriptor)
    || readableText(dossier?.understanding?.tagline)
    ||
    `We can use ${domain} as the start, then check the offer, the market and the work that still needs a human call.`;
  const detail = useMemo(
    () => pressureDetail(tailoredChoice ? LENS_LABELS[tailoredChoice.lensId] : pressure),
    [pressure, tailoredChoice],
  );
  const timeValue = useMemo(() => capacityDetail(capacity), [capacity]);
  const evidence = useMemo(() => {
    const products = dossier?.understanding?.products?.filter(Boolean).slice(0, 3) ?? [];
    const signal = dossier?.currency?.find((item) => item.text?.trim())?.text?.trim();
    const items = products.length ? [`What it appears to sell: ${products.join(", ")}.`] : [];
    if (signal) items.push(`A recent signal worth checking: ${signal}`);
    return items;
  }, [dossier]);
  const choices = PRESSURES[door] ?? PRESSURES.default;

  /* Server-signed tailored pressures, kept only when their shape is clean
     and their lens serves this door. */
  const tailoredChoices = useMemo(() => (dossier?.choices ?? [])
    .filter((item): item is TailoredPressure =>
      typeof item?.id === "string" && /^[0-9a-f]{64}$/.test(item.id)
      && typeof item?.label === "string" && item.label.length >= 12 && item.label.length <= 120
      && typeof item?.lensId === "string" && LENS_LABELS[item.lensId] !== undefined
      && (choices as readonly string[]).includes(LENS_LABELS[item.lensId]))
    .slice(0, 3), [choices, dossier]);

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
    setStep(route === "home" ? "door" : "company");
    setDoor(route);
    setCollected(null);
    setFirstName("");
    setLastName("");
    setAutoNames({ first: "", last: "" });
    setDivision("");
    setEntryError("");
    setEntryErrorField(null);
    setDomain("");
    setCompanyReadState("idle");
    setDossier(null);
    setLiveRead(false);
    setPressure("");
    setTailoredChoice(null);
    setShowGenericChoices(false);
    setCapacity("");
    setPreviousCapacity(null);
    setPreviewLeaf(0);
    setTimeEditorOpen(false);
    setTimeDraft("");
    setKeepConfirmOpen(false);
    setPreviewAnnouncement("");
    setEmail("");
    setVerificationCode("");
    setCodeResent(false);
    setStepAnnouncement("");
    lastAutoSubmittedRef.current = "";
    setNewsletter(false);
    setSubmitting(false);
    setHandoffResult(null);
    setResearchIssue("");
    setError("");
    profileSubmittedRef.current = false;
    requestIdRef.current = createRequestId();
    /* `route` is a dependency because a reset returns the dialog to whichever
       step it opens on, and that is the door only when it was opened without
       one. */
  }, [route]);

  useEffect(() => {
    if (!open) {
      setDraftHydratedFor("");
      resetJourney();
      return;
    }
    previousFocus.current = document.activeElement as HTMLElement | null;
    document.body.classList.add("mm-dialog-open");
    /* On a phone the page behind is locked at the root as well, because the
       body alone does not stop it scrolling there. iOS still moves the page to
       reveal a focused field, so the position it opened at is put back on
       close. The class does nothing above phone width (see the stylesheet),
       which keeps the homepage's pinned chapters from being re-measured
       behind the drawer. */
    const openedAtScrollY = window.scrollY;
    document.documentElement.classList.add("mm-dialog-lock");
    const backdrop = backdropRef.current;
    const main = backdrop?.parentElement;
    const site = backdrop?.closest<HTMLElement>(".mm-site");
    const background = site && main
      ? [
        ...Array.from(site.children).filter((element) => element !== main),
        ...Array.from(main.children).filter((element) => element !== backdrop),
      ].filter((element): element is HTMLElement => element instanceof HTMLElement)
      : [];
    const previousBackgroundState = background.map((element) => ({
      element,
      inert: element.inert,
      ariaHidden: element.getAttribute("aria-hidden"),
    }));
    background.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    return () => {
      document.body.classList.remove("mm-dialog-open");
      document.documentElement.classList.remove("mm-dialog-lock");
      previousBackgroundState.forEach(({ element, inert, ariaHidden }) => {
        element.inert = inert;
        if (ariaHidden === null) element.removeAttribute("aria-hidden");
        else element.setAttribute("aria-hidden", ariaHidden);
      });
      previousFocus.current?.focus();
      previousFocus.current = null;
      const phone = typeof window.matchMedia === "function" && window.matchMedia("(max-width: 560px)").matches;
      if (phone && Math.abs(window.scrollY - openedAtScrollY) > 1) window.scrollTo(0, openedAtScrollY);
    };
  }, [open, resetJourney]);

  useEffect(() => {
    if (!open || !draftStorageKey || draftHydratedFor === draftStorageKey) return;
    try {
      const raw = window.sessionStorage.getItem(draftStorageKey);
      if (raw) {
        const draft = JSON.parse(raw) as {
          savedAt?: number; step?: Step; door?: BriefRoute; collected?: Details | null;
          firstName?: string; lastName?: string; autoNames?: { first?: unknown; last?: unknown };
          division?: Division | ""; domain?: string;
          companyReadState?: CompanyReadState; dossier?: Dossier | null; liveRead?: boolean;
          pressure?: string; tailoredChoice?: TailoredPressure | null; showGenericChoices?: boolean;
          capacity?: string; previousCapacity?: string | null; previewLeaf?: number;
          email?: string; researchIssue?: string;
        };
        if (typeof draft.savedAt === "number" && Date.now() - draft.savedAt < 2 * 60 * 60 * 1000) {
          const restoredStep = draft.step === "reading" ? "profile" : draft.step === "verify" ? "contact" : draft.step;
          if (restoredStep && restoredStep !== "success") setStep(restoredStep);
          if (draft.door) setDoor(draft.door);
          setCollected(draft.collected ?? null);
          setFirstName(draft.firstName ?? "");
          setLastName(draft.lastName ?? "");
          /* A draft saved before names were read from the address carries no
             guesses, so its names count as typed and are never overwritten. */
          setAutoNames({
            first: typeof draft.autoNames?.first === "string" ? draft.autoNames.first : "",
            last: typeof draft.autoNames?.last === "string" ? draft.autoNames.last : "",
          });
          setDivision(draft.division ?? "");
          setDomain(draft.domain ?? "");
          setCompanyReadState(draft.companyReadState === "reading" ? "ready" : (draft.companyReadState ?? "idle"));
          setDossier(draft.dossier ?? null);
          setLiveRead(Boolean(draft.liveRead));
          setPressure(draft.pressure ?? "");
          setTailoredChoice(draft.tailoredChoice ?? null);
          setShowGenericChoices(Boolean(draft.showGenericChoices));
          setCapacity(draft.capacity ?? "");
          setPreviousCapacity(draft.previousCapacity ?? null);
          setPreviewLeaf(Number.isInteger(draft.previewLeaf)
            ? Math.max(0, Math.min(3, Number(draft.previewLeaf)))
            : 0);
          setEmail(draft.email ?? "");
          setResearchIssue(draft.researchIssue ?? "");
          profileSubmittedRef.current = Boolean(draft.collected);
        }
      }
    } catch {
      window.sessionStorage.removeItem(draftStorageKey);
    }
    setDraftHydratedFor(draftStorageKey);
  }, [draftHydratedFor, draftStorageKey, open]);

  useEffect(() => {
    if (!open || !draftStorageKey || draftHydratedFor !== draftStorageKey) return;
    if (step === "success") {
      window.sessionStorage.removeItem(draftStorageKey);
      return;
    }
    window.sessionStorage.setItem(draftStorageKey, JSON.stringify({
      savedAt: Date.now(), step, door, collected, firstName, lastName, autoNames, division,
      domain, companyReadState, dossier, liveRead, pressure, tailoredChoice,
      showGenericChoices, capacity, previousCapacity, previewLeaf, email, researchIssue,
    }));
  }, [autoNames, capacity, collected, companyReadState, domain, dossier, division, door, draftHydratedFor, draftStorageKey, email, firstName, lastName, liveRead, open, pressure, previousCapacity, previewLeaf, researchIssue, showGenericChoices, step, tailoredChoice]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (timeEditorOpen) {
          event.preventDefault();
          setTimeEditorOpen(false);
          previewReturnFocusRef.current?.focus({ preventScroll: true });
          return;
        }
        if (keepConfirmOpen) {
          event.preventDefault();
          setKeepConfirmOpen(false);
          previewReturnFocusRef.current?.focus({ preventScroll: true });
          return;
        }
        onClose();
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])"));
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
  }, [keepConfirmOpen, onClose, open, timeEditorOpen]);

  useEffect(() => {
    if (!open || step !== "preview" || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(max-width: 820px), (max-width: 920px) and (orientation: landscape) and (max-height: 500px)");
    const update = () => setPreviewCompact(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, [open, step]);

  useEffect(() => {
    if (!open || step !== "preview") return;
    const instrument = previewInstrumentRef.current;
    if (!instrument) return;
    instrument.inert = timeEditorOpen || keepConfirmOpen;
    if (timeEditorOpen || keepConfirmOpen) instrument.setAttribute("aria-hidden", "true");
    else instrument.removeAttribute("aria-hidden");
    if (!timeEditorOpen && !keepConfirmOpen) return;
    const overlay = panelRef.current?.querySelector<HTMLElement>(timeEditorOpen ? ".mm-folio-time-panel" : ".mm-folio-keep-panel");
    const firstFrame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => overlay?.querySelector<HTMLElement>("input:checked, button")?.focus({ preventScroll: true }));
    });
    return () => {
      window.cancelAnimationFrame(firstFrame);
      instrument.inert = false;
      instrument.removeAttribute("aria-hidden");
    };
  }, [keepConfirmOpen, open, step, timeEditorOpen]);

  useEffect(() => {
    if (!open || step !== "preview") return;
    const panel = panelRef.current;
    const interrupted = Array.from(document.querySelectorAll<HTMLVideoElement>("video"))
      .filter((video) => !panel?.contains(video) && !video.paused);
    interrupted.forEach((video) => video.pause());
    return () => {
      if (document.hidden) return;
      interrupted.filter((video) => video.isConnected).forEach((video) => { void video.play().catch(() => undefined); });
    };
  }, [open, step]);

  useEffect(() => {
    if (!open || !initialDomain) return;
    if (step !== "company" || domain) return;
    const seed = cleanDomain(initialDomain);
    if (!isPublicHostname(seed)) return;
    if (initialEmail) setEmail(initialEmail.trim().toLowerCase());
    if (visitor) {
      setCollected(visitor);
      setFirstName(visitor.firstName);
      setLastName(visitor.lastName);
      setDivision(visitor.division);
      void readCompany(seed, "blocking");
      return;
    }
    void readCompany(seed, "progressive");
  }, [open, initialDomain, initialEmail, step, domain, visitor]);

  useEffect(() => {
    if (!open) return;
    const focusTimer = window.setTimeout(() => {
      const panel = panelRef.current;
      const headingText = stepHeadingRef.current?.textContent?.trim() ?? "";
      /* A field the step change already focused (the name the address could
         not fill, typed straight on from the email) keeps its focus, and with
         it the keyboard. Going back to the top and the heading would drop the
         keyboard or leave the field under it. */
      const active = document.activeElement;
      if (panel && isTextEntry(active) && panel.contains(active)) {
        revealWithinScroller(panel, fieldGroup(active), fieldAction(active), BRIEF_CHROME);
        setStepAnnouncement(headingText);
        return;
      }
      panel?.scrollTo?.({ top: 0 });
      const focusTarget = !usesCoarseInteraction() && (["company", "profile", "contact", "verify"] as Step[]).includes(step)
        ? firstFieldRef.current
        : stepHeadingRef.current;
      focusTarget?.focus({ preventScroll: true });
      /* Focus on a field names the field, not the step, so the step's title
         is said once as well. */
      setStepAnnouncement(focusTarget && focusTarget !== stepHeadingRef.current ? headingText : "");
    }, 30);
    return () => window.clearTimeout(focusTimer);
  }, [open, step]);

  /* The backdrop is sized and placed from the visible viewport, and the
     panel scrolls a focused field above the keyboard. */
  useKeyboardSafeViewport({ open, host: backdropRef, scroller: panelRef, prefix: "--mm-brief", chrome: BRIEF_CHROME });

  /* On a phone the action under a choice often starts below the fold, and a
     tap that seems to do nothing reads as broken. After a choice made by
     touch, the panel moves just far enough to show it. */
  useEffect(() => {
    if (!revealChoiceActionRef.current) return;
    revealChoiceActionRef.current = false;
    const panel = panelRef.current;
    const action = choiceActionRef.current;
    if (!panel || !action) return;
    const frame = window.requestAnimationFrame(() => revealWithinScroller(panel, [action], [], BRIEF_CHROME));
    return () => window.cancelAnimationFrame(frame);
  }, [capacity, pressure]);

  const noteChoiceByTouch = () => {
    if (usesCoarseInteraction()) revealChoiceActionRef.current = true;
  };

  /* What the offer of a person needs, when the page collected it before opening
     this. The address is the one typed in here rather than the one the page
     arrived with, because the contact step is where somebody corrects it. */
  const handoffDetails = useMemo(() => {
    const source = visitor ?? collected;
    return source ? { ...source, email: email.trim().toLowerCase() || source.email } : null;
  }, [visitor, collected, email]);

  const readCompany = async (nextDomain: string, mode: "blocking" | "progressive" = "blocking") => {
    researchAbortRef.current?.abort();
    const controller = new AbortController();
    researchAbortRef.current = controller;
    const journeyVersion = journeyVersionRef.current;
    let timedOut = false;
    let timeoutId = 0;

    setError("");
    setEntryError("");
    setEntryErrorField(null);
    setResearchIssue("");
    setDomain(nextDomain);
    setDossier(null);
    setLiveRead(false);
    setCompanyReadState("reading");
    /* A tailored choice is signed for one domain; a fresh read clears it. */
    setTailoredChoice((previous) => {
      if (previous) setPressure("");
      return null;
    });
    setShowGenericChoices(false);
    setPressure("");
    setCapacity("");
    setStep(mode === "progressive" ? "profile" : "reading");
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
      setCompanyReadState("ready");
      if (mode === "blocking" || profileSubmittedRef.current) setStep("pressure");
    } catch {
      if (controller.signal.aborted && !timedOut) return;
      if (journeyVersion !== journeyVersionRef.current) return;
      setDossier(null);
      setLiveRead(false);
      setCompanyReadState("failed");
      /* Not a dead end, which is why there is no offer of a person here: the
         journey carries on to a real recommendation and a real hand-off, and a
         second door beside a working one would only ask somebody to guess which
         is the real one. What it gains is the honesty about whose fault it is. */
      setResearchIssue(
        timedOut
          ? "Our read of your company is still thinking about it, and we would rather not keep you waiting on it. You can carry on from this starting point, or ask for the live read again."
          : "Our read of your company came back with nothing to say for itself, which is unlike it. You can carry on from this starting point, or ask for the live read again.",
      );
      if (mode === "blocking" || profileSubmittedRef.current) setStep("pressure");
    } finally {
      window.clearTimeout(timeoutId);
      if (researchAbortRef.current === controller) researchAbortRef.current = null;
    }
  };

  const submitCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    /* Only this form starts a read. The personal-address offer, which has a
       form of its own, sits beside it rather than inside it. */
    if (event.target !== event.currentTarget) return;
    const nextEmail = email.trim().toLowerCase();
    const problem = workEmailProblem(nextEmail);
    if (problem) {
      setEntryError(problem);
      setEntryErrorField("email");
      firstFieldRef.current?.focus();
      return;
    }
    const nextDomain = domainFromEmail(nextEmail);
    /* first.last@company.com already says who this is. A name the visitor
       typed is never replaced; one we filled from an earlier address is. */
    const guess = nameFromEmail(nextEmail);
    const nextFirst = !firstName.trim() || firstName === autoNames.first ? guess?.firstName ?? "" : firstName;
    const nextLast = !lastName.trim() || lastName === autoNames.last ? guess?.lastName ?? "" : lastName;
    profileSubmittedRef.current = false;
    /* Rendered now rather than after this handler, so the name the address
       could not fill can take focus while the tap or the keyboard's Go key is
       still the reason for it. A phone then keeps its keyboard up instead of
       dropping it and asking for another tap. With both names filled nothing
       is focused and the keyboard stays down: the rest of the step is one
       selector. */
    flushSync(() => {
      setEmail(nextEmail);
      setFirstName(nextFirst);
      setLastName(nextLast);
      setAutoNames({ first: guess?.firstName ?? "", last: guess?.lastName ?? "" });
      void readCompany(nextDomain, "progressive");
    });
    const unfilled = !nextFirst.trim() ? firstFieldRef.current : !nextLast.trim() ? lastNameRef.current : null;
    unfilled?.focus({ preventScroll: true });
  };

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setEntryError("We need your name to find you. First and last is enough.");
      setEntryErrorField("name");
      firstFieldRef.current?.focus();
      return;
    }
    if (!division) {
      setEntryError("Pick the part of the business you work in.");
      setEntryErrorField("division");
      requestAnimationFrame(() => {
        const select = divisionSelectRef.current;
        if (select && window.getComputedStyle(select).display !== "none") select.focus();
        else firstDivisionRef.current?.focus();
      });
      return;
    }
    setEntryError("");
    setEntryErrorField(null);
    setCollected({
      firstName: firstName.trim().slice(0, 80),
      lastName: lastName.trim().slice(0, 80),
      email,
      division,
      domain,
    });
    profileSubmittedRef.current = true;
    setStep(companyReadState === "reading" ? "reading" : "pressure");
  };

  const changeCompanyEmail = () => {
    researchAbortRef.current?.abort();
    researchAbortRef.current = null;
    profileSubmittedRef.current = false;
    setCompanyReadState("idle");
    setDossier(null);
    setLiveRead(false);
    setResearchIssue("");
    setEntryError("");
    setEntryErrorField(null);
    setStep("company");
  };

  const retryResearch = () => {
    if (domain) void readCompany(domain);
  };

  const requestVerification = async (resend = false) => {
    setError("");
    setCodeResent(false);
    const request = buildMindmakeBriefRequestV2({
      domain,
      capacityChoice: capacity as keyof typeof RETURNED_TIME_IDS,
      email,
      pressure: (tailoredChoice ? LENS_LABELS[tailoredChoice.lensId] : pressure) as keyof typeof PRESSURE_IDS,
      publicationRequested: newsletter,
      requestId: requestIdRef.current,
      route: door,
      tailored: tailoredChoice ? { id: tailoredChoice.id, label: tailoredChoice.label } : undefined,
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
      lastAutoSubmittedRef.current = "";
      setVerificationCode("");
      setCodeResent(resend);
      setStep("verify");
    } catch {
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      setHandoffResult(null);
      setError(CODE_NOT_SENT);
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
      tailored: tailoredChoice ? { id: tailoredChoice.id, label: tailoredChoice.label } : undefined,
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
      onConfirmed?.();
    } catch (caught) {
      if (controller.signal.aborted || journeyVersion !== journeyVersionRef.current) return;
      setHandoffResult(null);
      const mismatch = caught instanceof Error && caught.message === "publication-choice-mismatch";
      const deliveryFailure = caught instanceof Error && caught.message === "delivery-not-confirmed";
      setError(mismatch
        ? "The reply included a publication choice you did not make. Nothing is described as confirmed."
        : deliveryFailure
          ? DELIVERY_NOT_CONFIRMED
          : CODE_NOT_ACCEPTED);
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
    lastAutoSubmittedRef.current = verificationCode;
    void confirmVerification();
  };

  /* Six digits is the whole answer, so the sixth sends it, whether typed,
     pasted or filled in by the phone. Once per code: a code that failed is
     not sent again until it changes, and the button still retries it. This
     is an effect rather than part of the change handler so it sends the code
     as it now is, not as it was when the handler was made. */
  useEffect(() => {
    if (!open || step !== "verify" || submitting) return;
    if (!/^\d{6}$/.test(verificationCode) || lastAutoSubmittedRef.current === verificationCode) return;
    lastAutoSubmittedRef.current = verificationCode;
    void confirmVerification();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- confirmVerification is recreated each render and reads this render's code.
  }, [open, step, submitting, verificationCode]);

  const changeVerificationEmail = () => {
    requestIdRef.current = createRequestId();
    setError("");
    setVerificationCode("");
    setStep("contact");
  };

  const resendVerification = () => {
    requestIdRef.current = createRequestId();
    setVerificationCode("");
    void requestVerification(true);
  };

  const keepBrief = () => {
    setError("");
    setHandoffResult(null);
    setStep(handoffEnabled ? "contact" : "success");
  };

  const previewDoorLabel = door === "brain" ? "AI Brain" : door === "gtm" ? "AI GTM" : "Mindmake";
  const previewDivision = DIVISIONS.find((entry) => entry.id === (collected?.division ?? division))?.label ?? "Leader";
  const previewStartingPoint = `${previewDoorLabel} · ${pressure.replace(/[.]+$/, "")}.`;
  const previewLeaves = [
    { label: "Starting point", content: previewStartingPoint, proof: false },
    { label: "AI can carry", content: detail.carry, proof: false },
    { label: "You keep", content: detail.human, proof: false },
    { label: "First proof", content: detail.proof, proof: true },
  ] as const;

  const movePreviewLeaf = (next: number, focus = false) => {
    const bounded = Math.max(0, Math.min(3, next));
    setPreviewLeaf(bounded);
    setPreviewAnnouncement(`${previewLeaves[bounded].label}, ${bounded + 1} of 4.`);
    if (focus) {
      window.requestAnimationFrame(() => {
        previewInstrumentRef.current
          ?.querySelector<HTMLElement>(`[data-mm-folio-leaf="${bounded}"]`)
          ?.focus({ preventScroll: true });
      });
    }
  };

  const handlePreviewLeafKey = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") movePreviewLeaf(0, true);
    if (event.key === "End") movePreviewLeaf(3, true);
    if (event.key === "ArrowLeft") movePreviewLeaf(index - 1, true);
    if (event.key === "ArrowRight") movePreviewLeaf(index + 1, true);
  };

  const openTimeEditor = (trigger: HTMLElement) => {
    previewReturnFocusRef.current = trigger;
    setTimeDraft(capacity);
    setTimeEditorOpen(true);
  };

  const restorePreviewPanelFocus = () => {
    window.requestAnimationFrame(() => {
      previewReturnFocusRef.current?.focus({ preventScroll: true });
    });
  };

  const closeTimeEditor = () => {
    setTimeEditorOpen(false);
    restorePreviewPanelFocus();
  };

  const commitTime = () => {
    const next = timeDraft || capacity;
    const changed = next !== capacity;
    if (changed) {
      setPreviousCapacity(capacity);
      setCapacity(next);
    }
    setTimeEditorOpen(false);
    setPreviewAnnouncement(changed
      ? `Time changed to ${next}. The four guidance leaves are unchanged.`
      : "Time kept.");
    restorePreviewPanelFocus();
  };

  const restoreCapacity = () => {
    if (!previousCapacity) return;
    const current = capacity;
    setCapacity(previousCapacity);
    setPreviousCapacity(current);
    setPreviewAnnouncement(`Time restored to ${previousCapacity}. The four guidance leaves are unchanged.`);
  };

  const openKeepConfirmation = (trigger: HTMLElement) => {
    previewReturnFocusRef.current = trigger;
    setKeepConfirmOpen(true);
  };

  const closeKeepConfirmation = () => {
    setKeepConfirmOpen(false);
    restorePreviewPanelFocus();
  };

  const continueFromKeepConfirmation = () => {
    setKeepConfirmOpen(false);
    setPreviewAnnouncement("Email verification is next. Nothing has been sent.");
    keepBrief();
  };

  const downloadBrief = () => {
    const downloadContent = {
      ...brief,
      preparedFor: handoffResult?.visitorDelivery === "queued" ? email : undefined,
      nextStep: (handoffResult?.visitorDelivery === "queued" ? "reply" : "keep") as "reply" | "keep",
    };
    const blob = new Blob([buildPrivateBriefHtml(downloadContent)], { type: "text/html;charset=utf-8" });
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

  /* The functional progress path: every rendered segment is a working
     control naming a stage the visitor can return to. */
  const pathStages: Array<{ label: string; target: Step; steps: Step[] }> = [
    ...(route === "home" ? [{ label: "Door", target: "door" as Step, steps: ["door"] as Step[] }] : []),
    { label: "Company", target: "company", steps: ["company"] },
    { label: "You", target: "profile", steps: ["profile", "reading"] },
    { label: "Problem", target: "pressure", steps: ["pressure"] },
    { label: "Time", target: "capacity", steps: ["capacity"] },
    { label: "Brief", target: "preview", steps: ["preview", "contact", "verify", "success"] },
  ];
  const currentStageIndex = step === "success"
    ? pathStages.length
    : pathStages.findIndex((stage) => stage.steps.includes(step));

  const goToStage = (target: Step) => {
    if (submitting) return;
    if (target === "company") {
      changeCompanyEmail();
      return;
    }
    setError("");
    setEntryError("");
    setEntryErrorField(null);
    if (step === "verify") {
      requestIdRef.current = createRequestId();
      setVerificationCode("");
    }
    setStep(target);
  };
  const successTitle = !handoffEnabled
    ? "Keep this. Your brief is ready."
    : visitorEmailQueued && operatorHasContext
      ? "Your brief is on its way. Our copy was queued too."
      : visitorEmailQueued
        ? "Your brief is on its way."
        : operatorHasContext
          ? "Our copy was queued. Keep yours here."
          : "Keep this. Your brief is still ready.";
  const successBody = !handoffEnabled
    ? "Download it now. Nothing has been sent to us, and no email has been sent."
    : visitorEmailQueued && operatorHasContext
      ? "The email was queued. Download a copy now too. We reply if there is a useful fit or thought to add."
      : visitorEmailQueued
        ? `The email was queued. We were not given the context. Email ${CONTACT_EMAIL} if you also want it seen.`
        : operatorHasContext
          ? "Our copy was queued. Your email was not, so download your copy now."
          : "The hand-off was not confirmed. Your download is still ready.";

  if (!open) return null;

  return (
    <div ref={backdropRef} className={`mm-brief-backdrop${presentation === "drawer" ? " is-drawer" : ""}`} role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className={`mm-brief-panel${presentation === "drawer" ? " is-drawer" : ""}`} ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="mm-brief-title" data-tone={STEP_TONES[step]} data-step={step} data-presentation={presentation}>
        <div className="mm-brief-top">
          {/* The real mark and wordmark, as the site header draws them, and
              not a link: a way home in the middle of a form is a way out of
              it. The label beside it is the approved S4 header's. */}
          <span className="mm-brief-brand"><BrandMarks instance="dialog" /></span>
          <span className="mm-brief-context">{step === "preview" ? "Start here / Private brief" : "Start here"}</span>
          <button type="button" aria-label="Close" onClick={onClose}><X aria-hidden="true" /></button>
        </div>
        <p className="mm-visually-hidden" aria-live="polite">{stepAnnouncement}</p>

        <nav className="mm-brief-path" aria-label="Your progress">
          {pathStages.map((stage, index) => (
            <button
              key={stage.label}
              type="button"
              aria-current={index === currentStageIndex ? "step" : undefined}
              data-done={index < currentStageIndex ? "true" : undefined}
              disabled={index >= currentStageIndex || step === "reading" || step === "success" || submitting}
              onClick={() => goToStage(stage.target)}
            >
              {stage.label}
            </button>
          ))}
        </nav>

        {step === "door" && (
          <section className="mm-brief-step is-door">
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Which one are you here for?</h2>
            <p>Both end in the same piece of work, and you can cross to the other later.</p>
            <div className="mm-door-pick" role="group" aria-label="Which one are you here for?">
              {DOOR_CHOICES.map((choice) => (
                <button
                  className="mm-door-choice"
                  type="button"
                  key={choice.route}
                  onClick={() => { setDoor(choice.route); setStep("company"); }}
                >
                  <b>{choice.label}</b>
                  <span>{choice.line}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === "company" && (
          <section className="mm-brief-step mm-brief-start-step is-company">
            {/* The form holds the field alone, and the action names it with
                `form`. The offer of a person below carries a form of its own,
                and inside this one it was a form inside a form: Chromium stops
                a nested form's submit at the outer form, so React never saw
                it, nothing prevented it, and "Have a person pick this up"
                reloaded the page with everything typed lost. */}
            <div className="mm-brief-start-form">
              <div className="mm-brief-start-content">
                {initialContext && <p className="mm-brief-carried-context"><span>Starting point</span>{initialContext}</p>}
                <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Which business should we read?</h2>
                <p className="mm-brief-start-lede">Your work email tells us where to look. We read public company information while you answer the next question.</p>
                <form id="mm-company-form" className="mm-brief-company-form" onSubmit={submitCompany} noValidate>
                  <p className="mm-brief-entry-field">
                    <label htmlFor="mm-company-email">Work email</label>
                    <input
                      ref={firstFieldRef}
                      id="mm-company-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="work email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="go"
                      placeholder="you@company.com"
                      value={email}
                      aria-invalid={entryErrorField === "email" || undefined}
                      aria-describedby={entryErrorField === "email" ? "mm-company-email-error" : "mm-company-email-hint"}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (entryError) { setEntryError(""); setEntryErrorField(null); }
                      }}
                    />
                    <small id="mm-company-email-hint">We use the domain, not your inbox.</small>
                  </p>
                  {entryError && <p id="mm-company-email-error" className="mm-form-error" role="alert">{entryError}</p>}
                </form>
                {entryError === FREE_EMAIL_PROBLEM && (
                  <HumanHandoff
                    reason="personal-email"
                    prefill={{ email, firstName: nameFromEmail(email)?.firstName || undefined, lastName: nameFromEmail(email)?.lastName || undefined }}
                    asTrigger
                  />
                )}
              </div>
              <footer className="mm-brief-action-rail">
                <button className="mm-button" data-mm-primary type="submit" form="mm-company-form">Read the business <span aria-hidden="true">→</span></button>
                <p>No brief reaches our team until you confirm later. <a href="/privacy" target="_blank" rel="noreferrer">How we handle information</a>.</p>
              </footer>
            </div>
          </section>
        )}

        {step === "profile" && (
          <section className="mm-brief-step mm-brief-start-step is-profile">
            <form className="mm-brief-start-form" onSubmit={submitProfile} noValidate>
              <div className="mm-brief-start-content">
                <button className="mm-step-back" type="button" onClick={changeCompanyEmail}>← Change email</button>
                <div className="mm-brief-reading-record" aria-live="polite" data-status={companyReadState}>
                  <span>MM / 01</span>
                  <span><strong>{domain}</strong><small>{companyReadState === "ready" ? "Company read ready" : "Reading public company information"}</small></span>
                  <i aria-hidden="true" />
                </div>
                <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Who is this for?</h2>
                <div className="mm-brief-name-pair">
                  <p className="mm-brief-entry-field">
                    <label htmlFor="mm-first-name">First name</label>
                    <input
                      ref={firstFieldRef}
                      id="mm-first-name"
                      name="given-name"
                      autoComplete="given-name"
                      autoCapitalize="words"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint="next"
                      value={firstName}
                      onKeyDown={(event) => {
                        /* Return in the first name moves on to the last one
                           while it is still empty, instead of submitting a
                           step that can only answer with an error. */
                        if (event.key !== "Enter" || event.nativeEvent.isComposing || lastName.trim()) return;
                        event.preventDefault();
                        lastNameRef.current?.focus();
                      }}
                      aria-invalid={entryErrorField === "name" || undefined}
                      aria-describedby={entryErrorField === "name" ? "mm-profile-error" : undefined}
                      onChange={(event) => { setFirstName(event.target.value); if (entryError) { setEntryError(""); setEntryErrorField(null); } }}
                    />
                  </p>
                  <p className="mm-brief-entry-field">
                    <label htmlFor="mm-last-name">Last name</label>
                    <input
                      ref={lastNameRef}
                      id="mm-last-name"
                      name="family-name"
                      autoComplete="family-name"
                      autoCapitalize="words"
                      autoCorrect="off"
                      spellCheck={false}
                      enterKeyHint={division ? "go" : "next"}
                      value={lastName}
                      aria-invalid={entryErrorField === "name" || undefined}
                      onChange={(event) => { setLastName(event.target.value); if (entryError) { setEntryError(""); setEntryErrorField(null); } }}
                    />
                  </p>
                </div>
                <fieldset className="mm-brief-profile-role" aria-invalid={entryErrorField === "division" || undefined} aria-describedby={entryErrorField === "division" ? "mm-profile-error" : undefined}>
                  <legend>Your part of the business</legend>
                  <div className="mm-brief-role-chips">
                    {DIVISIONS.map((entry, index) => (
                      <button
                        key={entry.id}
                        ref={index === 0 ? firstDivisionRef : undefined}
                        type="button"
                        aria-pressed={division === entry.id}
                        onClick={() => { setDivision(entry.id); if (entryError) { setEntryError(""); setEntryErrorField(null); } }}
                      >
                        {entry.label}
                      </button>
                    ))}
                  </div>
                  <select
                    ref={divisionSelectRef}
                    className="mm-brief-role-select"
                    aria-label="Your part of the business"
                    value={division}
                    onChange={(event) => { setDivision(event.target.value as Division); if (entryError) { setEntryError(""); setEntryErrorField(null); } }}
                  >
                    <option value="">Choose one</option>
                    {DIVISIONS.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}
                  </select>
                </fieldset>
                {entryError && <p id="mm-profile-error" className="mm-form-error" role="alert">{entryError}</p>}
              </div>
              <footer className="mm-brief-action-rail">
                <button className="mm-button" data-mm-primary type="submit">See the company read <span aria-hidden="true">→</span></button>
              </footer>
            </form>
          </section>
        )}

        {step === "reading" && (
          <section className="mm-brief-step mm-reading is-reading" aria-live="polite">
            <LoaderCircle className="mm-spinner" aria-hidden="true" />
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Reading {domain}.</h2>
            <p>Finding what the company does, what it sells and where AI may have changed the choice. This takes up to 10 seconds.</p>
            <div className="mm-reading-rule" aria-hidden="true" />
          </section>
        )}

        {step === "pressure" && (
          <section className="mm-brief-step is-pressure">
            <button className="mm-step-back" type="button" onClick={() => setStep("profile")}>← Change your details</button>
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
                <p className="mm-honesty-note">{researchIssue || "Our live research did not answer, so this is a starting point built from the website alone. It does not pretend to know more than that."}</p>
                <button className="mm-text-button" type="button" onClick={retryResearch}>Try the live read again</button>
              </>
            )}
            <fieldset>
              <legend>Which problem feels closest?</legend>
              {tailoredChoices.length >= 2 && !showGenericChoices ? (
                <>
                  <div className="mm-choice-grid">
                    {tailoredChoices.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        aria-pressed={tailoredChoice?.id === item.id}
                        onClick={() => { noteChoiceByTouch(); setTailoredChoice(item); setPressure(item.label); }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <button className="mm-text-button" type="button" onClick={() => setShowGenericChoices(true)}>Something else</button>
                </>
              ) : (
                <div className="mm-choice-grid">
                  {choices.map((item) => (
                    <button
                      key={item}
                      type="button"
                      aria-pressed={!tailoredChoice && pressure === item}
                      onClick={() => { noteChoiceByTouch(); setPressure(item); setTailoredChoice(null); }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </fieldset>
            <button ref={choiceActionRef} className="mm-button" type="button" disabled={!pressure} onClick={() => setStep("capacity")}>Use this problem <span aria-hidden="true">→</span></button>
          </section>
        )}

        {step === "capacity" && (
          <section className="mm-brief-step is-capacity">
            <button className="mm-step-back" type="button" onClick={() => setStep("pressure")}>← Back to the problem</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">If you got more of your best time back, where would you put it?</h2>
            <div className="mm-choice-grid mm-capacity-grid">
              {CAPACITY_CHOICES.map((item) => (
                <button key={item} type="button" aria-pressed={capacity === item} onClick={() => { noteChoiceByTouch(); setCapacity(item); }}>{item}</button>
              ))}
            </div>
            {capacity && <p className="mm-value-preview" aria-live="polite"><strong>What that time could buy</strong>{timeValue}</p>}
            <button
              ref={choiceActionRef}
              className="mm-button"
              type="button"
              disabled={!capacity}
              onClick={() => {
                setPreviewLeaf(0);
                setPreviousCapacity(null);
                setStep("preview");
              }}
            >
              Show me the recommendation <span aria-hidden="true">→</span>
            </button>
          </section>
        )}

        {step === "preview" && (
          <section className="mm-brief-step mm-preview mm-folio-preview is-preview">
            <FilmPlate
              className="mm-folio-film"
              poster={opportunitiesPoster}
              src={opportunitiesFilm}
              label="Possibilities settling into two qualified opportunities"
              priority
              decorative
            />
            <div className="mm-folio-shade" aria-hidden="true" />

            <div className="mm-folio-instrument" ref={previewInstrumentRef}>
              <aside className="mm-folio-binding" aria-label="What shaped this brief">
                <div className="mm-folio-binding-head">
                  <p>Brief resolved</p>
                  <span>Four choices, one useful start.</span>
                </div>

                <ol className="mm-folio-source-keys">
                  <li><span>01</span><small>Company</small><strong>{company}</strong></li>
                  <li><span>02</span><small>You</small><strong>{previewDivision}</strong></li>
                  <li><span>03</span><small>Problem</small><strong>{pressureShort(pressure)}</strong></li>
                  <li className="mm-folio-time-key">
                    <button type="button" aria-haspopup="dialog" aria-label={`Change Time: ${capacityShort(capacity)}`} onClick={(event) => openTimeEditor(event.currentTarget)}>
                      <span>04</span><small>Time</small><strong>{capacityShort(capacity)}</strong><i aria-hidden="true">↗</i>
                    </button>
                  </li>
                </ol>

                <div className="mm-folio-time-inscription" aria-live="polite">
                  <small>What that time could buy</small>
                  <p>{timeValue}</p>
                  {previousCapacity && <button type="button" onClick={restoreCapacity}>Restore {capacityShort(previousCapacity)}</button>}
                </div>

              </aside>

              <section className="mm-folio" aria-label="Your private starting brief">
                <header className="mm-folio-head">
                  <div>
                    <p>Private starting brief</p>
                    <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Two parts of the work are now clear.</h2>
                  </div>
                  <span className="mm-folio-leaf-count" aria-live="polite"><b>{previewLeaf + 1}</b> of 4</span>
                </header>

                <div
                  className="mm-folio-leaves"
                  onTouchStart={(event) => { previewTouchXRef.current = event.changedTouches[0]?.clientX ?? null; }}
                  onTouchEnd={(event) => {
                    if (previewTouchXRef.current === null) return;
                    const delta = (event.changedTouches[0]?.clientX ?? previewTouchXRef.current) - previewTouchXRef.current;
                    previewTouchXRef.current = null;
                    if (Math.abs(delta) < 48) return;
                    movePreviewLeaf(delta < 0 ? previewLeaf + 1 : previewLeaf - 1);
                  }}
                >
                  {previewLeaves.map((leaf, index) => (
                    <article
                      key={leaf.label}
                      className={`mm-folio-leaf${index === previewLeaf ? " is-active" : ""}${index < previewLeaf ? " is-before" : ""}${leaf.proof ? " is-proof" : ""}`}
                      tabIndex={0}
                      data-mm-folio-leaf={index}
                      aria-current={index === previewLeaf ? "step" : undefined}
                      onClick={() => movePreviewLeaf(index)}
                      onKeyDown={(event) => handlePreviewLeafKey(event, index)}
                    >
                      <div className="mm-folio-leaf-label"><span>{String(index + 1).padStart(2, "0")}</span><small>{leaf.label}</small></div>
                      {leaf.proof ? <strong>{leaf.content}</strong> : <p>{leaf.content}</p>}
                    </article>
                  ))}
                </div>

                <footer className="mm-folio-actions">
                  <button
                    className="mm-folio-back-leaf"
                    type="button"
                    hidden={!previewCompact || previewLeaf === 0}
                    onClick={() => movePreviewLeaf(previewLeaf - 1, true)}
                  >
                    ← Previous
                  </button>
                  <button
                    className="mm-button mm-folio-primary"
                    type="button"
                    onClick={(event) => {
                      if (previewCompact && previewLeaf < 3) movePreviewLeaf(previewLeaf + 1, true);
                      else openKeepConfirmation(event.currentTarget);
                    }}
                  >
                    {previewCompact && previewLeaf < 3 ? "Next leaf" : "Keep the private brief"} <span aria-hidden="true">→</span>
                  </button>
                  <p>This is a useful first view, not a promise or final answer.</p>
                </footer>
              </section>
            </div>

            {timeEditorOpen && (
              <section className="mm-folio-panel mm-folio-time-panel" role="dialog" aria-modal="true" aria-labelledby="mm-folio-time-title">
                <div className="mm-folio-panel-surface">
                  <header>
                    <div><p>Change one choice</p><h2 id="mm-folio-time-title">Where would you put your best time?</h2></div>
                    <button type="button" aria-label="Close time choices" onClick={closeTimeEditor}>×</button>
                  </header>
                  <div className="mm-folio-time-layout">
                    <fieldset>
                      <legend className="mm-visually-hidden">Where would you put your best time?</legend>
                      {CAPACITY_CHOICES.map((item, index) => (
                        <label key={item}>
                          <input aria-label={item} type="radio" name="mm-folio-time" value={item} checked={(timeDraft || capacity) === item} onChange={() => setTimeDraft(item)} />
                          <span><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
                        </label>
                      ))}
                    </fieldset>
                    <div className="mm-folio-time-preview">
                      <p>What that time could buy</p>
                      <strong>{capacityDetail(timeDraft || capacity)}</strong>
                      <small>The guidance stays fixed. The time you protect changes.</small>
                    </div>
                  </div>
                  <footer>
                    <button className="mm-folio-quiet" type="button" onClick={closeTimeEditor}>Keep current time</button>
                    <button className="mm-button" type="button" onClick={commitTime}>Use this time <span aria-hidden="true">→</span></button>
                  </footer>
                </div>
              </section>
            )}

            {keepConfirmOpen && (
              <section className="mm-folio-panel mm-folio-keep-panel" role="dialog" aria-modal="true" aria-labelledby="mm-folio-keep-title">
                <div className="mm-folio-panel-surface mm-folio-keep-surface">
                  <p className="mm-folio-panel-kicker">Keep this brief</p>
                  <h2 id="mm-folio-keep-title">Email verification is next.</h2>
                  <strong>Nothing has been sent.</strong>
                  <p>Your brief stays here until you choose to continue.</p>
                  <footer>
                    <button autoFocus className="mm-folio-quiet" type="button" onClick={closeKeepConfirmation}>Not now</button>
                    <button className="mm-button" type="button" onClick={continueFromKeepConfirmation}>Continue <span aria-hidden="true">→</span></button>
                  </footer>
                </div>
              </section>
            )}

            <p className="mm-visually-hidden" role="status" aria-live="polite">{previewAnnouncement}</p>
          </section>
        )}

        {step === "contact" && (
          <section className="mm-brief-step is-contact">
            <button className="mm-step-back" type="button" onClick={() => setStep("preview")}>← Back to the brief</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Email the private brief.</h2>
            <p>A six-digit code comes first. It keeps the brief private and checks the address is yours.</p>
            <form onSubmit={submitLead} noValidate>
              <label htmlFor="mm-work-email">Work email</label>
              <input
                ref={firstFieldRef}
                id="mm-work-email"
                name="email"
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }}
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="send"
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
            {/* Outside the form, not inside it: the offer carries a form of its
                own where the page has not already collected the details, and a
                form inside a form is not a thing a browser will do. Quiet,
                because a working retry is sitting right above it. */}
            {error === CODE_NOT_SENT && (
              <HumanHandoff reason="code-not-sent" details={handoffDetails} asTrigger />
            )}
            <small>Nothing is sent to us until you confirm the code. The publication box is separate and unticked. It records interest only. It does not subscribe you. <a href="/privacy" target="_blank" rel="noreferrer">How the private brief handles information</a>.</small>
          </section>
        )}

        {step === "verify" && (
          <section className="mm-brief-step is-verify">
            <button className="mm-step-back" type="button" onClick={changeVerificationEmail}>← Change email</button>
            <h2 ref={stepHeadingRef} tabIndex={-1} id="mm-brief-title">Check your email.</h2>
            <p>Sent to {email}. It expires after 10 minutes.</p>
            <form onSubmit={submitVerification} noValidate>
              <label htmlFor="mm-verification-code">Six-digit code</label>
              <input
                ref={firstFieldRef}
                id="mm-verification-code"
                name="one-time-code"
                value={verificationCode}
                onChange={(event) => {
                  setVerificationCode(event.target.value.replace(/\D/g, "").slice(0, 6));
                  if (error) setError("");
                  if (codeResent) setCodeResent(false);
                }}
                onPaste={(event) => {
                  /* A pasted " 123456", "123 456" or a whole sentence from
                     the email still gives the six digits. No length cap on
                     the field, because the browser applies one before the
                     digits have been picked out. */
                  const pasted = event.clipboardData.getData("text");
                  const digits = pasted.replace(/\D/g, "");
                  const code = pasted.match(/\d{6}/)?.[0] ?? (digits.length === 6 ? digits : "");
                  if (!code) return;
                  event.preventDefault();
                  setVerificationCode(code);
                  if (error) setError("");
                  if (codeResent) setCodeResent(false);
                }}
                inputMode="numeric"
                autoComplete="one-time-code"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="done"
                pattern="[0-9]{6}"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "mm-verification-code-error" : undefined}
              />
              {error && <p id="mm-verification-code-error" className="mm-form-error" role="alert">{error}</p>}
              <button className="mm-button" type="submit" disabled={submitting}>{submitting ? "Checking the code..." : "Send my private brief"} <span aria-hidden="true">→</span></button>
            </form>
            <button className="mm-text-button" type="button" disabled={submitting} onClick={resendVerification}>{submitting ? "Sending a new code..." : "Send a new code"}</button>
            {codeResent && <p className="mm-honesty-note" role="status">A new code is on its way.</p>}
            {error === CODE_NOT_ACCEPTED && (
              <HumanHandoff reason="code-not-accepted" details={handoffDetails} asTrigger />
            )}
            <small>The full brief goes to this verified address. We receive the same context only after the code is confirmed.</small>
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
            {/* The brief is finished and the email did not leave. Nothing here
                is retryable by the visitor, so this is the offer in full rather
                than a line asking them to want it. */}
            {error === DELIVERY_NOT_CONFIRMED && (
              <HumanHandoff reason="delivery-failed" details={handoffDetails} />
            )}
            {/* The canon promises this on screen, by email and as an attachment,
                and it belongs on screen: it is what the visitor came for. What
                was wrong was that it arrived as a cream paper document dropped
                into a dark dialog under the success copy, which read as an
                appendix rather than as the point. It is the same content in the
                step's own visual language now. The email and the attachment are
                built separately by privateBriefHtml and stay paper. */}
            <MindmakeProposal
              content={{
                ...brief,
                preparedFor: visitorEmailQueued ? email : undefined,
                nextStep: visitorEmailQueued ? "reply" : "keep",
              }}
            />
            <div className="mm-success-actions">
              <button className="mm-button" type="button" onClick={downloadBrief}><Download aria-hidden="true" /> Download my brief</button>
              {handoffEnabled && !handoffResult && email && (
                <a className="mm-text-button" href={`mailto:${CONTACT_EMAIL}?subject=My%20Mindmake%20brief`}>Email us directly</a>
              )}
              <button className="mm-text-button" type="button" onClick={onClose}>Return to the site</button>
            </div>
            {/* The warmest moment the site has: the reader has just been given
                something useful. The invitation checkbox only records interest,
                so this is where a subscription can actually happen. Below the
                brief's own actions, never above them. */}
            <div className="mm-success-subscribe">
              <p>Between briefs, The Money of AI and Built with AI come free by email.</p>
              <a
                className="mm-subscribe-cta"
                href={SUBSCRIBE_URL}
                target="_blank"
                rel="noreferrer"
                onClick={() => track("substack_click", { source: "brief_success" })}
              >
                {SUBSCRIBE_LABEL} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
