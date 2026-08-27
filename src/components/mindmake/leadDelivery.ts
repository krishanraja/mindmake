export type BriefRoute = "home" | "brain" | "gtm";

export const NEWSLETTER_CONSENT_WORDING_VERSION = "mindmake-publication-consent-v1";

export const NEWSLETTER_CONSENT_WORDING =
  "I would also like an invitation to Mindmake's useful ideas by email.";

export const PRESSURE_IDS = {
  "Customers can now do more without us": "customers-can-do-more-without-us",
  "Our price no longer matches the value": "price-no-longer-matches-value",
  "The team is building faster than it can choose": "team-building-faster-than-it-can-choose",
  "The real problem is still unclear": "real-problem-still-unclear",
  "Too much important context lives in my head": "important-context-lives-in-my-head",
  "I avoid work that still needs my judgement": "avoid-work-that-needs-my-judgement",
  "I keep searching for things I should already know": "searching-for-things-i-should-know",
  "I need more room for important decisions": "need-room-for-important-decisions",
  "Our product is moving faster than our message": "product-moving-faster-than-message",
  "Our price still reflects the old work": "price-still-reflects-old-work",
  "The team has too many possible moves": "team-has-too-many-possible-moves",
} as const;

export const RETURNED_TIME_IDS = {
  "Grow this business": "grow-this-business",
  "Help more companies": "help-more-companies",
  "Build my AI skill": "build-my-ai-skill",
  "Make room for important decisions": "make-room-for-important-decisions",
} as const;

export interface MindmakeBriefRequestV2 {
  version: 2;
  action: "request";
  requestId: string;
  contact: { email: string };
  company: { domain: string };
  choices: {
    pressureId: (typeof PRESSURE_IDS)[keyof typeof PRESSURE_IDS];
    returnedTimeId: (typeof RETURNED_TIME_IDS)[keyof typeof RETURNED_TIME_IDS];
    entryRoute: BriefRoute;
    tailored?: TailoredChoiceRef;
  };
  consent: {
    publicationRequested: boolean;
    wordingVersion: typeof NEWSLETTER_CONSENT_WORDING_VERSION;
  };
  website: "";
}

/* A server-authored tailored pressure the browser carries back unchanged;
   the server verifies its signature before trusting the label. */
export interface TailoredChoiceRef {
  id: string;
  label: string;
}

export interface MindmakeBriefConfirmV2 {
  version: 2;
  action: "confirm";
  requestId: string;
  contact: { email: string };
  code: string;
  tailored?: TailoredChoiceRef;
}

export interface MindmakeVerificationResponseV2 {
  version: 2;
  success: true;
  status: "verification_required";
  requestId: string;
}

export interface MindmakeConfirmedResponseV2 {
  version: 2;
  success: true;
  status: "confirmed";
  leadId: string;
  visitorDelivery: "queued" | "failed";
  operatorDelivery: "queued" | "failed";
  publicationInterestRecorded: boolean;
}

export type MindmakeBriefResponseV2 = MindmakeVerificationResponseV2 | MindmakeConfirmedResponseV2;

interface MindmakeBriefRequestInputV2 {
  domain: string;
  email: string;
  pressure: keyof typeof PRESSURE_IDS;
  capacityChoice: keyof typeof RETURNED_TIME_IDS;
  publicationRequested: boolean;
  requestId: string;
  route: BriefRoute;
  tailored?: TailoredChoiceRef;
}

interface MindmakeBriefConfirmInputV2 {
  code: string;
  email: string;
  requestId: string;
  tailored?: TailoredChoiceRef;
}

export const buildMindmakeBriefRequestV2 = ({
  domain,
  capacityChoice,
  email,
  pressure,
  publicationRequested,
  requestId,
  route,
  tailored,
}: MindmakeBriefRequestInputV2): MindmakeBriefRequestV2 => ({
  version: 2,
  action: "request",
  requestId,
  contact: { email },
  company: { domain },
  choices: {
    pressureId: PRESSURE_IDS[pressure],
    returnedTimeId: RETURNED_TIME_IDS[capacityChoice],
    entryRoute: route,
    ...(tailored ? { tailored } : {}),
  },
  consent: {
    publicationRequested,
    wordingVersion: NEWSLETTER_CONSENT_WORDING_VERSION,
  },
  website: "",
});

export const buildMindmakeBriefConfirmV2 = ({
  code,
  email,
  requestId,
  tailored,
}: MindmakeBriefConfirmInputV2): MindmakeBriefConfirmV2 => ({
  version: 2,
  action: "confirm",
  requestId,
  contact: { email },
  code: code.trim(),
  ...(tailored ? { tailored } : {}),
});

export const isMindmakeBriefResponseV2 = (value: unknown): value is MindmakeBriefResponseV2 => {
  if (!value || typeof value !== "object") return false;
  const response = value as Record<string, unknown>;
  if (response.version !== 2 || response.success !== true) return false;
  if (response.status === "verification_required") return typeof response.requestId === "string";
  if (response.status !== "confirmed") return false;
  const validDelivery = (delivery: unknown) => delivery === "queued" || delivery === "failed";
  return typeof response.leadId === "string" && response.leadId.length > 0
    && validDelivery(response.visitorDelivery)
    && validDelivery(response.operatorDelivery)
    && typeof response.publicationInterestRecorded === "boolean";
};
