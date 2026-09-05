/**
 * Pure validation, hashing, and server-owned email rendering for the Mindmake
 * private brief. This module has no Deno or database dependency.
 */

export const BODY_LIMIT_BYTES = 12 * 1024;
export const CONSENT_WORDING_VERSION = "mindmake-publication-consent-v1";

export type BriefEntryRoute = "home" | "brain" | "gtm";
export type BriefReadSource = "live" | "fallback";
export type DeliveryState = "pending" | "sending" | "queued" | "failed";
export type DeliveryKind = "verification" | "visitor" | "operator";

interface PressureDefinition {
  label: string;
  routes: readonly BriefEntryRoute[];
  aiCarries: string;
  humanKeeps: string;
  proofForThirtyDays: string;
}

/**
 * These are the only pressure choices the public journey may submit. The text
 * matches the current LeadBrief journey, but it is owned by the server.
 */
export const PRESSURE_DEFINITIONS = {
  "customers-can-do-more-without-us": {
    label: "Customers can now do more without us",
    routes: ["home", "gtm"],
    aiCarries: "Compare what customers can now do alone with the work they still struggle to finish or trust.",
    humanKeeps: "Choose the result your business should still own and the buyer it is best placed to help.",
    proofForThirtyDays: "Put one revised offer in front of real buyers and learn which part still earns a clear yes.",
  },
  "price-no-longer-matches-value": {
    label: "Our price no longer matches the value",
    routes: ["home"],
    aiCarries: "Compare what changed in the work, the buyer and the cost to deliver it.",
    humanKeeps: "Choose what you want to be paid for and which customer the offer is really for.",
    proofForThirtyDays: "Test one new package and price with real buyers before a wider change.",
  },
  "team-building-faster-than-it-can-choose": {
    label: "The team is building faster than it can choose",
    routes: ["home"],
    aiCarries: "Keep the options, evidence and reasons visible so the team can compare them.",
    humanKeeps: "Make the hard choice and decide what the team will stop doing.",
    proofForThirtyDays: "Choose one costly decision, make the call and start the first useful build.",
  },
  "real-problem-still-unclear": {
    label: "The real problem is still unclear",
    routes: ["home"],
    aiCarries: "Research the company, hold the competing facts and show where the question may sit.",
    humanKeeps: "Name the real problem and choose which result matters enough to test.",
    proofForThirtyDays: "Find the decision underneath the noise and build the first proof around it.",
  },
  "important-context-lives-in-my-head": {
    label: "Too much important context lives in my head",
    routes: ["brain"],
    aiCarries: "Hold the facts, examples, past choices and useful relationships in one place.",
    humanKeeps: "Decide what matters, when a rule should bend and who deserves your trust.",
    proofForThirtyDays: "Build one useful memory around a live decision, then use it twice on real work.",
  },
  "avoid-work-that-needs-my-judgement": {
    label: "I avoid work that still needs my judgement",
    routes: ["brain"],
    aiCarries: "Prepare the first version, keep the routine moving and bring exceptions to you.",
    humanKeeps: "Set the standard and make the calls that need your taste or trust.",
    proofForThirtyDays: "Take one job you avoid and build a working system that still keeps you in charge.",
  },
  "searching-for-things-i-should-know": {
    label: "I keep searching for things I should already know",
    routes: ["brain"],
    aiCarries: "Hold the facts, examples, past choices and useful relationships in one place.",
    humanKeeps: "Decide what matters, when a rule should bend and who deserves your trust.",
    proofForThirtyDays: "Build one useful memory around a live decision, then use it twice on real work.",
  },
  "need-room-for-important-decisions": {
    label: "I need more room for important decisions",
    routes: ["brain"],
    aiCarries: "Research the company, hold the competing facts and show where the question may sit.",
    humanKeeps: "Name the real problem and choose which result matters enough to test.",
    proofForThirtyDays: "Find the decision underneath the noise and build the first proof around it.",
  },
  "product-moving-faster-than-message": {
    label: "Our product is moving faster than our message",
    routes: ["gtm"],
    aiCarries: "Bring product changes, buyer language and live objections into the same view.",
    humanKeeps: "Choose the promise you can stand behind and the proof that earns it.",
    proofForThirtyDays: "Rebuild one offer and put it in front of real buyers before the work ends.",
  },
  "price-still-reflects-old-work": {
    label: "Our price still reflects the old work",
    routes: ["gtm"],
    aiCarries: "Compare what changed in the work, the buyer and the cost to deliver it.",
    humanKeeps: "Choose what you want to be paid for and which customer the offer is really for.",
    proofForThirtyDays: "Test one new package and price with real buyers before a wider change.",
  },
  "team-has-too-many-possible-moves": {
    label: "The team has too many possible moves",
    routes: ["gtm"],
    aiCarries: "Keep the options, evidence and reasons visible so the team can compare them.",
    humanKeeps: "Make the hard choice and decide what the team will stop doing.",
    proofForThirtyDays: "Choose one costly decision, make the call and start the first useful build.",
  },
} as const satisfies Record<string, PressureDefinition>;

interface ReturnedTimeDefinition {
  label: string;
  value: string;
}

/** The only returned-time choices accepted from the public journey. */
export const RETURNED_TIME_DEFINITIONS = {
  "grow-this-business": {
    label: "Grow this business",
    value: "Protect that time for product, buyers and the few decisions that can change growth.",
  },
  "help-more-companies": {
    label: "Help more companies",
    value: "Use the same judgement across more companies without lowering the quality of the work.",
  },
  "build-my-ai-skill": {
    label: "Build my AI skill",
    value: "Test better ways of working until you can improve the system yourself.",
  },
  "make-room-for-important-decisions": {
    label: "Make room for important decisions",
    value: "Move preparation and routine checks out of the day, then protect time for decisions only you can make.",
  },
} as const satisfies Record<string, ReturnedTimeDefinition>;

export type PressureId = keyof typeof PRESSURE_DEFINITIONS;
export type ReturnedTimeId = keyof typeof RETURNED_TIME_DEFINITIONS;

export interface MindmakeBriefRequestActionV2 {
  version: 2;
  action: "request";
  requestId: string;
  contact: {
    email: string;
  };
  company: {
    domain: string;
  };
  choices: {
    pressureId: PressureId;
    returnedTimeId: ReturnedTimeId;
    entryRoute: BriefEntryRoute;
    tailored?: TailoredChoiceRef;
  };
  consent: {
    publicationRequested: boolean;
    wordingVersion: typeof CONSENT_WORDING_VERSION;
  };
  website: "";
}

/** A server-authored tailored pressure, carried by the browser and proven
 *  by its HMAC id before any label is trusted. */
export interface TailoredChoiceRef {
  id: string;
  label: string;
}

export interface MindmakeBriefConfirmActionV2 {
  version: 2;
  action: "confirm";
  requestId: string;
  contact: {
    email: string;
  };
  code: string;
  tailored?: TailoredChoiceRef;
}

export type MindmakeBriefRequestV2 = MindmakeBriefRequestActionV2 | MindmakeBriefConfirmActionV2;

/**
 * Company research is created by trusted server code after the public request
 * has been parsed. It never comes from the browser contract.
 */
export interface StoredCompanyResearch {
  name: string;
  read: string;
  evidence: string[];
  readSource: BriefReadSource;
}

/** The server-owned brief used by the visitor and operator renderers. */
export interface StoredBrief {
  version: 2;
  requestId: string;
  contact: {
    email: string;
  };
  company: StoredCompanyResearch & {
    domain: string;
  };
  choices: {
    pressureId: PressureId;
    pressure: string;
    returnedTimeId: ReturnedTimeId;
    returnedTimeChoice: string;
    returnedTimeValue: string;
    entryRoute: BriefEntryRoute;
  };
  recommendation: {
    aiCarries: string;
    humanKeeps: string;
    proofForThirtyDays: string;
  };
  consent: {
    publicationRequested: boolean;
    wordingVersion: typeof CONSENT_WORDING_VERSION;
  };
}

export interface VerificationRequiredResponseV2 {
  version: 2;
  success: true;
  status: "verification_required";
  requestId: string;
}

export interface ConfirmedBriefResponseV2 {
  version: 2;
  success: true;
  status: "confirmed";
  leadId: string;
  visitorDelivery: "queued" | "failed";
  operatorDelivery: "queued" | "failed";
  publicationInterestRecorded: boolean;
}

export type MindmakeBriefResponseV2 = VerificationRequiredResponseV2 | ConfirmedBriefResponseV2;

export interface ServerEmail {
  subject: string;
  html: string;
  text: string;
}

export class BriefValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super("Invalid Mindmake brief request");
    this.name = "BriefValidationError";
    this.issues = issues;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const exactKeys = (
  value: unknown,
  allowed: readonly string[],
  path: string,
  issues: string[],
  optional: readonly string[] = [],
): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object`);
    return false;
  }
  const keys = Object.keys(value);
  const allowedSet = new Set([...allowed, ...optional]);
  if (keys.some((key) => !allowedSet.has(key))) issues.push(`${path} has unexpected fields`);
  if (allowed.some((key) => !Object.prototype.hasOwnProperty.call(value, key))) {
    issues.push(`${path} is missing fields`);
  }
  return true;
};

interface TextOptions {
  min: number;
  max: number;
  pattern?: RegExp;
  lower?: boolean;
}

const textField = (
  value: unknown,
  path: string,
  options: TextOptions,
  issues: string[],
): string => {
  if (typeof value !== "string") {
    issues.push(`${path} must be text`);
    return "";
  }
  const trimmed = value.trim();
  if (trimmed.length < options.min || trimmed.length > options.max) {
    issues.push(`${path} has an invalid length`);
  }
  if (options.pattern && !options.pattern.test(trimmed)) {
    issues.push(`${path} has an invalid format`);
  }
  return options.lower ? trimmed.toLowerCase() : trimmed;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const requestIdPattern = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|mindmake-[a-z0-9](?:[a-z0-9-]{5,118}[a-z0-9])?)$/i;
const domainLabelPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
const verificationCodePattern = /^\d{6}$/;

const validDomain = (value: string): boolean => {
  if (value.length > 253 || value.startsWith(".") || value.endsWith(".")) return false;
  const labels = value.split(".");
  if (labels.length < 2 || !labels.every((label) => domainLabelPattern.test(label))) return false;
  return /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(labels.at(-1) ?? "");
};

const enumField = <T extends string>(
  value: unknown,
  allowed: readonly T[],
  path: string,
  issues: string[],
): T => {
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    issues.push(`${path} is not supported`);
    return allowed[0];
  }
  return value as T;
};

const parseContact = (value: unknown, issues: string[]): { email: string } => {
  const contactOk = exactKeys(value, ["email"], "contact", issues);
  const contact = contactOk ? value : {};
  const email = textField(contact.email, "contact.email", {
    min: 3,
    max: 254,
    pattern: emailPattern,
    lower: true,
  }, issues);
  return { email };
};

const parseRequestAction = (input: unknown): MindmakeBriefRequestActionV2 => {
  const issues: string[] = [];
  const rootOk = exactKeys(
    input,
    ["version", "action", "requestId", "contact", "company", "choices", "consent", "website"],
    "request",
    issues,
  );
  const root = rootOk ? input : {};

  if (root.version !== 2) issues.push("version must be 2");
  if (root.action !== "request") issues.push("action must be request");
  const requestId = textField(root.requestId, "requestId", {
    min: 8,
    max: 128,
    pattern: requestIdPattern,
  }, issues);
  const contact = parseContact(root.contact, issues);

  const companyOk = exactKeys(root.company, ["domain"], "company", issues);
  const company: Record<string, unknown> = companyOk && isRecord(root.company) ? root.company : {};
  const domain = textField(company.domain, "company.domain", {
    min: 3,
    max: 253,
    lower: true,
  }, issues);
  if (domain && !validDomain(domain)) issues.push("company.domain is not a public hostname");

  const choicesOk = exactKeys(
    root.choices,
    ["pressureId", "returnedTimeId", "entryRoute"],
    "choices",
    issues,
    ["tailored"],
  );
  const choices: Record<string, unknown> = choicesOk && isRecord(root.choices) ? root.choices : {};
  const pressureId = enumField(
    choices.pressureId,
    Object.keys(PRESSURE_DEFINITIONS) as PressureId[],
    "choices.pressureId",
    issues,
  );
  const returnedTimeId = enumField(
    choices.returnedTimeId,
    Object.keys(RETURNED_TIME_DEFINITIONS) as ReturnedTimeId[],
    "choices.returnedTimeId",
    issues,
  );
  const entryRoute = enumField(
    choices.entryRoute,
    ["home", "brain", "gtm"] as const,
    "choices.entryRoute",
    issues,
  );
  if (!(PRESSURE_DEFINITIONS[pressureId].routes as readonly BriefEntryRoute[]).includes(entryRoute)) {
    issues.push("choices.pressureId is not available for this entry route");
  }
  const tailored = parseTailoredRef(choices.tailored, "choices.tailored", issues);

  const consentOk = exactKeys(
    root.consent,
    ["publicationRequested", "wordingVersion"],
    "consent",
    issues,
  );
  const consent: Record<string, unknown> = consentOk && isRecord(root.consent) ? root.consent : {};
  if (typeof consent.publicationRequested !== "boolean") {
    issues.push("consent.publicationRequested must be true or false");
  }
  if (consent.wordingVersion !== CONSENT_WORDING_VERSION) {
    issues.push("consent.wordingVersion is not supported");
  }
  if (root.website !== "") issues.push("website must be empty");

  if (issues.length) throw new BriefValidationError([...new Set(issues)]);

  return {
    version: 2,
    action: "request",
    requestId,
    contact,
    company: { domain },
    choices: tailored
      ? { pressureId, returnedTimeId, entryRoute, tailored }
      : { pressureId, returnedTimeId, entryRoute },
    consent: {
      publicationRequested: consent.publicationRequested as boolean,
      wordingVersion: CONSENT_WORDING_VERSION,
    },
    website: "",
  };
};

/** Validate an optional tailored-choice reference; the HMAC itself is
 *  verified by the caller, which holds the secret. */
const parseTailoredRef = (
  value: unknown,
  path: string,
  issues: string[],
): TailoredChoiceRef | undefined => {
  if (value === undefined) return undefined;
  const ok = exactKeys(value, ["id", "label"], path, issues);
  if (!ok) return undefined;
  const record = value as Record<string, unknown>;
  const id = typeof record.id === "string" && /^[0-9a-f]{64}$/.test(record.id) ? record.id : "";
  const label = typeof record.label === "string" ? record.label : "";
  if (!id) issues.push(`${path}.id is not valid`);
  if (label.length < 12 || label.length > 120 || /[\r\n\t<>]/.test(label) || label.trim() !== label) {
    issues.push(`${path}.label is not valid`);
  }
  if (!id || !label) return undefined;
  return { id, label };
};

const parseConfirmAction = (input: unknown): MindmakeBriefConfirmActionV2 => {
  const issues: string[] = [];
  const rootOk = exactKeys(
    input,
    ["version", "action", "requestId", "contact", "code"],
    "request",
    issues,
    ["tailored"],
  );
  const root = rootOk ? input : {};
  const tailored = parseTailoredRef(root.tailored, "tailored", issues);

  if (root.version !== 2) issues.push("version must be 2");
  if (root.action !== "confirm") issues.push("action must be confirm");
  const requestId = textField(root.requestId, "requestId", {
    min: 8,
    max: 128,
    pattern: requestIdPattern,
  }, issues);
  const contact = parseContact(root.contact, issues);
  if (typeof root.code !== "string" || !verificationCodePattern.test(root.code)) {
    issues.push("code must be six digits");
  }

  if (issues.length) throw new BriefValidationError([...new Set(issues)]);

  return {
    version: 2,
    action: "confirm",
    requestId,
    contact,
    code: root.code as string,
    ...(tailored ? { tailored } : {}),
  };
};

/** Parse either exact V2 action and reject unknown or narrative fields. */
export function parseMindmakeBriefRequest(input: unknown): MindmakeBriefRequestV2 {
  if (!isRecord(input)) throw new BriefValidationError(["request must be an object"]);
  if (input.action === "request") return parseRequestAction(input);
  if (input.action === "confirm") return parseConfirmAction(input);
  throw new BriefValidationError(["action is not supported"]);
}

/** Build a renderer-safe brief from a parsed choice request and server research.
 *  A verified tailored label replaces the lens label in everything the
 *  visitor and operator read; the lens still owns the recommendation. */
export function createStoredBrief(
  request: MindmakeBriefRequestActionV2,
  researchInput: StoredCompanyResearch,
  tailoredLabel?: string,
): StoredBrief {
  const issues: string[] = [];
  const researchOk = exactKeys(
    researchInput,
    ["name", "read", "evidence", "readSource"],
    "research",
    issues,
  );
  const research: Record<string, unknown> = researchOk ? researchInput : {};
  const name = textField(research.name, "research.name", { min: 1, max: 160 }, issues);
  const read = textField(research.read, "research.read", { min: 1, max: 3000 }, issues);
  const readSource = enumField(
    research.readSource,
    ["live", "fallback"] as const,
    "research.readSource",
    issues,
  );
  const evidence: string[] = [];
  if (!Array.isArray(research.evidence)) {
    issues.push("research.evidence must be a list");
  } else if (research.evidence.length > 8) {
    issues.push("research.evidence has too many items");
  } else {
    research.evidence.forEach((item, index) => {
      const value = textField(item, `research.evidence[${index}]`, { min: 1, max: 500 }, issues);
      if (value) evidence.push(value);
    });
  }

  if (issues.length) throw new BriefValidationError([...new Set(issues)]);

  const pressure = PRESSURE_DEFINITIONS[request.choices.pressureId];
  const returnedTime = RETURNED_TIME_DEFINITIONS[request.choices.returnedTimeId];
  return {
    version: 2,
    requestId: request.requestId,
    contact: { email: request.contact.email },
    company: {
      domain: request.company.domain,
      name,
      read,
      evidence: [...new Set(evidence)],
      readSource,
    },
    choices: {
      pressureId: request.choices.pressureId,
      pressure: tailoredLabel ?? pressure.label,
      returnedTimeId: request.choices.returnedTimeId,
      returnedTimeChoice: returnedTime.label,
      returnedTimeValue: returnedTime.value,
      entryRoute: request.choices.entryRoute,
    },
    recommendation: {
      aiCarries: pressure.aiCarries,
      humanKeeps: pressure.humanKeeps,
      proofForThirtyDays: pressure.proofForThirtyDays,
    },
    consent: {
      publicationRequested: request.consent.publicationRequested,
      wordingVersion: CONSENT_WORDING_VERSION,
    },
  };
}

export const esc = (value: unknown): string => String(value ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#039;");

const singleLine = (value: string): string =>
  value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();

const evidenceHtml = (items: string[]): string => items.length
  ? `<ul style="margin:10px 0 0;padding-left:20px;color:#5d6562;font-size:13.5px;">${items.map((item) => `<li style="margin:4px 0;">${esc(item)}</li>`).join("")}</ul>`
  : '<p style="margin:10px 0 0;color:#5d6562;font-size:13.5px;">No extra company evidence was available.</p>';

const evidenceText = (items: string[]): string => items.length
  ? items.map((item) => `- ${item}`).join("\n")
  : "- No extra company evidence was available.";

/* Email bodies share the proposal document's design language: paper ground,
   emerald cover rule, serif statements, labelled cards, rust for the time
   sections. Everything stays single-column and inline-styled with no flex,
   images or external requests, because email clients honour little else. */

const emailLabel = (text: string, colour = "#0b756c"): string =>
  `<p style="margin:0 0 8px;color:${colour};font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;">${esc(text)}</p>`;

const emailCard = (inner: string): string =>
  `<div style="margin-top:18px;border:1px solid rgba(13,25,41,.24);background:#fffdf8;padding:22px;box-shadow:6px 6px 0 rgba(13,25,41,.1);">${inner}</div>`;

const emailBlock = (label: string, innerHtml: string): string =>
  emailCard(`${emailLabel(label)}${innerHtml}`);

const emailAside = (label: string, innerHtml: string, colour = "#b96743"): string =>
  `<div style="margin-top:24px;border-left:4px solid ${colour};padding-left:16px;">${emailLabel(label, colour)}${innerHtml}</div>`;

const wordmarkCover =
  '<p style="margin:0;font-size:14px;font-weight:800;letter-spacing:.16em;text-transform:uppercase;">Mindmake</p>';

const companyCover = (company: string, metaLine: string): string =>
  `<p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:-.02em;"><b style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;">Mindmake</b> &#215; ${esc(company)}</p>
  <p style="margin:6px 0 0;color:#5d6562;font-size:13px;">${esc(metaLine)}</p>`;

const htmlDocument = (title: string, body: string, cover: string = wordmarkCover): string => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title></head>
<body style="margin:0;padding:0;background:#f4f0e8;">
<div style="max-width:680px;margin:0 auto;padding:36px 20px 56px;color:#0d1929;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;line-height:1.55;">
<div style="border-top:10px solid #6ee1c0;padding-top:22px;">${cover}</div>
${body}
<p style="margin:52px 0 0;padding-top:16px;border-top:1px solid rgba(13,25,41,.22);color:#5d6562;font-size:12.5px;">mindmake.co</p>
</div></body></html>`;

/** Render the fixed verification message. Only the server-created code changes. */
export function renderVerificationEmail(code: string): ServerEmail {
  if (!verificationCodePattern.test(code)) {
    throw new BriefValidationError(["code must be six digits"]);
  }
  const subject = "Your Mindmake verification code";
  const body = `
  <h1 style="margin:40px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:36px;line-height:1.06;letter-spacing:-.03em;">Confirm your email.</h1>
  <p style="margin:16px 0 0;">Use this code to finish your private brief:</p>
  <div style="margin:24px 0 0;border:1px solid rgba(13,25,41,.24);background:#fffdf8;padding:22px;box-shadow:6px 6px 0 rgba(13,25,41,.1);font-family:Georgia,'Times New Roman',serif;font-size:34px;font-weight:700;letter-spacing:.18em;text-align:center;">${code}</div>
  <p style="margin:24px 0 0;color:#5d6562;font-size:14px;">The code expires in 10 minutes. If you did not ask for it, ignore this email.</p>`;
  const text = [
    "MINDMAKE",
    "",
    "Confirm your email",
    "",
    "Use this code to finish your private brief:",
    code,
    "",
    "The code expires in 10 minutes. If you did not ask for it, ignore this email.",
    "",
    "mindmake.co",
  ].join("\n");
  return { subject, html: htmlDocument(subject, body), text };
}

/* The one private fact that would most change each read, named per pressure
   so the proposal shows where the outside read ends. */
const CANNOT_KNOW_BY_PRESSURE: Partial<Record<PressureId, string>> = {
  "important-context-lives-in-my-head": "how much of what lives in your head your team can already reach without you",
  "searching-for-things-i-should-know": "how much of what lives in your head your team can already reach without you",
  "avoid-work-that-needs-my-judgement": "which piece of avoided work is really about taste and which is about time",
  "need-room-for-important-decisions": "which decision is waiting on you right now, and what it costs each week it waits",
  "customers-can-do-more-without-us": "what your best customers still ask you for that they could not get elsewhere",
  "price-no-longer-matches-value": "what your last three renewals actually argued about",
  "price-still-reflects-old-work": "what your last three renewals actually argued about",
  "product-moving-faster-than-message": "which promise your sales conversations already make that the website does not",
  "team-building-faster-than-it-can-choose": "which option your team privately believes in and has not said out loud",
  "team-has-too-many-possible-moves": "which option your team privately believes in and has not said out loud",
};

const cannotKnowLine = (pressureId: PressureId): string =>
  `What I cannot know from the outside: ${CANNOT_KNOW_BY_PRESSURE[pressureId]
    ?? "the one private constraint that would most change this read"}.`;

/** The honesty line every read carries, on screen, in the emails and in the document. */
export const ILLUSTRATIVE_LINE =
  "This read is an illustrative example of how the Mindmake brain reads a business from the outside. It is not advice.";

/** The branded proposal document attached to the visitor email. It mirrors
 *  the on-screen proposal: self-contained, system fonts, no scripts, no
 *  external requests, printable to a clean A4, no prices, no diary links. */
export function renderProposalDocument(brief: StoredBrief): string {
  const source = brief.company.readSource === "live"
    ? "This came from the live company read."
    : "This is the safe read based on the website.";
  const evidence = brief.company.evidence.length
    ? `<ul style="margin:8px 0 0;padding-left:20px;color:#5d6562;font-size:13px;">${brief.company.evidence.map((item) => `<li style="margin:4px 0;">${esc(item)}</li>`).join("")}</ul>`
    : "";
  const label = (text: string, colour = "#0b756c") =>
    `<p style="margin:0 0 8px;color:${colour};font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;">${esc(text)}</p>`;
  const card = (inner: string) =>
    `<div style="margin-top:20px;border:1px solid rgba(13,25,41,.24);background:#fffdf8;padding:24px;box-shadow:10px 10px 0 rgba(13,25,41,.12);">${inner}</div>`;

  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(singleLine(brief.company.name))} | Mindmake private brief</title></head>
<body style="margin:0;background:#f4f0e8;color:#0d1929;font:16px/1.55 'Segoe UI',Arial,sans-serif;">
<main style="max-width:760px;margin:auto;padding:44px 24px 64px;">
<div style="border-top:10px solid #6ee1c0;padding-top:26px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;align-items:baseline;">
  <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:21px;letter-spacing:-.02em;"><b style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:800;letter-spacing:.14em;text-transform:uppercase;">Mindmake</b> &#215; ${esc(singleLine(brief.company.name))}</p>
  <p style="margin:0;color:#5d6562;font-size:13px;">${esc(brief.company.domain)} &#183; prepared for ${esc(brief.contact.email)} &#183; Private brief</p>
</div>
<h1 style="max-width:14ch;margin:56px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:52px;line-height:.96;letter-spacing:-.04em;">${esc(brief.choices.pressure)}.</h1>
${card(`${label(`What Mindmake saw at ${singleLine(brief.company.name)}`)}<p style="margin:0;">${esc(brief.company.read)}</p><p style="margin:8px 0 0;color:#5d6562;font-size:13px;">${esc(source)}</p>${evidence}`)}
<div style="margin-top:4px;">
${card(`${label("What AI can carry")}<p style="margin:0;">${esc(brief.recommendation.aiCarries)}</p>`)}
${card(`${label("What stays yours")}<p style="margin:0;">${esc(brief.recommendation.humanKeeps)}</p>`)}
</div>
${card(`${label("A useful first proof")}<strong style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.15;letter-spacing:-.02em;">${esc(brief.recommendation.proofForThirtyDays)}</strong>`)}
<div style="margin-top:34px;border-left:4px solid #b96743;padding-left:18px;">${label("Where the returned time goes", "#b96743")}<p style="margin:0;">${esc(brief.choices.returnedTimeValue)}</p></div>
<p style="margin:30px 0 0;font-style:italic;color:#3d4a47;">${esc(cannotKnowLine(brief.choices.pressureId))}</p>
<div style="margin-top:26px;border:1px solid #0b756c;background:#fffdf8;padding:18px 20px;">${label("The next step")}<p style="margin:0;">If this reads worth a conversation, reply to the email this brief came with. Krish reads every reply.</p></div>
<div style="margin-top:56px;padding-top:16px;border-top:1px solid rgba(13,25,41,.22);color:#5d6562;font-size:13px;">
  <p style="margin:0 0 6px;">This is a useful first view, not a promise or final answer. Mindmake uses the real business, the leader's judgement and real work to test what holds up.</p>
  <p style="margin:0;">${esc(ILLUSTRATIVE_LINE)}</p>
</div>
</main></body></html>`;
}

/** The visitor receives the server-owned brief they confirmed. */
export function renderVisitorEmail(brief: StoredBrief): ServerEmail & { attachmentHtml: string } {
  const companyName = singleLine(brief.company.name);
  const subject = `Your Mindmake brief for ${companyName}`;
  const source = brief.company.readSource === "live"
    ? "This came from the live company read."
    : "This is the safe read based on the website.";
  const opening = "You chose one business pressure and where better use of your time could matter most. Treat this as something to test against the real business, not a finished answer.";
  const attachmentLine = "Your full brief is attached as a document you can keep or print.";
  const boundary = "No sales emails will follow automatically. If you hear from Krish, it will be because he has a useful next move, a strong fit or something worth questioning.";

  const body = `
  <h1 style="max-width:16ch;margin:40px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:38px;line-height:1.04;letter-spacing:-.03em;">${esc(brief.choices.pressure)}.</h1>
  <p style="margin:18px 0 0;font-size:17px;">${esc(opening)}</p>
  ${emailBlock(`What Mindmake saw at ${companyName}`, `<p style="margin:0;">${esc(brief.company.read)}</p><p style="margin:10px 0 0;color:#5d6562;font-size:13.5px;">${esc(source)}</p>${evidenceHtml(brief.company.evidence)}`)}
  ${emailBlock("What AI can carry", `<p style="margin:0;">${esc(brief.recommendation.aiCarries)}</p>`)}
  ${emailBlock("What stays with you", `<p style="margin:0;">${esc(brief.recommendation.humanKeeps)}</p>`)}
  ${emailBlock("A useful first proof", `<strong style="display:block;font-family:Georgia,'Times New Roman',serif;font-size:24px;line-height:1.18;letter-spacing:-.02em;">${esc(brief.recommendation.proofForThirtyDays)}</strong>`)}
  ${emailAside("Where the returned time goes", `<p style="margin:0;">${esc(brief.choices.returnedTimeValue)}</p>`)}
  <p style="margin:26px 0 0;">${esc(attachmentLine)}</p>
  <p style="margin:14px 0 0;">${esc(boundary)}</p>
  <p style="margin:26px 0 0;color:#5d6562;font-size:13px;">${esc(ILLUSTRATIVE_LINE)}</p>`;

  const text = [
    `MINDMAKE × ${companyName}`,
    `Private brief · ${brief.company.domain}`,
    "",
    `${brief.choices.pressure}.`,
    "",
    opening,
    "",
    `WHAT MINDMAKE SAW AT ${companyName.toUpperCase()}`,
    brief.company.read,
    source,
    evidenceText(brief.company.evidence),
    "",
    "WHAT AI CAN CARRY",
    brief.recommendation.aiCarries,
    "",
    "WHAT STAYS WITH YOU",
    brief.recommendation.humanKeeps,
    "",
    "A USEFUL FIRST PROOF",
    brief.recommendation.proofForThirtyDays,
    "",
    "WHERE THE RETURNED TIME GOES",
    brief.choices.returnedTimeValue,
    "",
    attachmentLine,
    "",
    boundary,
    "",
    ILLUSTRATIVE_LINE,
    "",
    "mindmake.co",
  ].join("\n");

  const cover = companyCover(companyName, `${brief.company.domain} · Private brief`);
  const html = htmlDocument(subject, body, cover);
  return { subject, html, text, attachmentHtml: renderProposalDocument(brief) };
}

const routeRead = (route: BriefEntryRoute): string => {
  if (route === "brain") {
    return "They came through Build Your AI Brain. Check whether the first proof should improve their judgement, memory or use of time.";
  }
  if (route === "gtm") {
    return "They came through Build Your AI GTM. Check whether one product, price, message or team decision is ready for a real market test.";
  }
  return "They came from the homepage. Use their chosen pressure to decide where the work should begin.";
};

const publicationRead = (requested: boolean): string => requested
  ? "Unverified interest only. The visitor ticked the publication box. Never import this address directly. Use a separate verified publication sign-up."
  : "No publication interest was requested. Never import this address directly.";

/** Krish receives the private fit digest, built only from the stored brief. */
export function renderOperatorEmail(brief: StoredBrief): ServerEmail {
  const companyName = singleLine(brief.company.name);
  const subject = `Mindmake brief: ${companyName} | ${singleLine(brief.choices.pressure)}`;
  const publicationChoice = publicationRead(brief.consent.publicationRequested);
  const replyHref = esc(`mailto:${brief.contact.email}`);

  /* When the pressure was tailored to the company, the stored label differs
     from the locked lens it routes through; the digest names both. */
  const lensLabel = PRESSURE_DEFINITIONS[brief.choices.pressureId]?.label;
  const tailoredLens = lensLabel && lensLabel !== brief.choices.pressure ? lensLabel : null;
  const pressureLine = tailoredLens
    ? `${brief.choices.pressure}. A tailored choice, read through the lens: ${tailoredLens}.`
    : `${brief.choices.pressure}.`;

  const body = `
  <h1 style="max-width:18ch;margin:40px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.08;letter-spacing:-.03em;">${esc(brief.choices.pressure)}.</h1>
  ${emailBlock("The leader", `
    <p style="margin:0;font-size:17px;"><a href="${replyHref}" style="color:#0b756c;font-weight:600;">${esc(brief.contact.email)}</a></p>
    <p style="margin:6px 0 0;color:#5d6562;font-size:14px;">${esc(companyName)} &#183; ${esc(brief.company.domain)}</p>
    <p style="margin:6px 0 0;color:#5d6562;font-size:14px;">Replying to this email goes straight to them.</p>`)}
  ${emailBlock("Company read", `<p style="margin:0;">${esc(brief.company.read)}</p><p style="margin:10px 0 0;color:#5d6562;font-size:13.5px;">Read source: ${esc(brief.company.readSource)}</p>${evidenceHtml(brief.company.evidence)}`)}
  ${emailBlock("What they chose", `
    <p style="margin:0;"><b>The pressure.</b> ${esc(brief.choices.pressure)}.${tailoredLens ? ` <span style="color:#5d6562;">A tailored choice, read through the lens: ${esc(tailoredLens)}.</span>` : ""}</p>
    <p style="margin:12px 0 0;"><b>The returned time.</b> ${esc(brief.choices.returnedTimeChoice)}. ${esc(brief.choices.returnedTimeValue)}</p>`)}
  ${emailBlock("The brief they received", `
    <p style="margin:0;"><b>AI carries.</b> ${esc(brief.recommendation.aiCarries)}</p>
    <p style="margin:12px 0 0;"><b>The leader keeps.</b> ${esc(brief.recommendation.humanKeeps)}</p>
    <p style="margin:12px 0 0;"><b>First proof.</b> ${esc(brief.recommendation.proofForThirtyDays)}</p>`)}
  ${emailAside("Route read", `<p style="margin:0;">${esc(routeRead(brief.choices.entryRoute))}</p>`)}
  ${emailAside("Publication interest", `<p style="margin:0;">${esc(publicationChoice)}</p><p style="margin:6px 0 0;color:#5d6562;font-size:13px;">Wording: ${esc(brief.consent.wordingVersion)}</p>`, "#5d6562")}
  <div style="margin-top:26px;border:1px solid #0b756c;background:#fffdf8;padding:18px 20px;">${emailLabel("Reply only when useful")}<p style="margin:0;">Share a useful thought, a strong fit or a clear question worth testing. Do not chase the visitor.</p></div>`;

  const text = [
    `MINDMAKE × ${companyName}`,
    `Private fit digest · ${brief.company.domain}`,
    "",
    `${brief.choices.pressure}.`,
    "",
    "THE LEADER",
    brief.contact.email,
    `${brief.company.name} (${brief.company.domain})`,
    "Replying to this email goes straight to them.",
    "",
    "COMPANY READ",
    brief.company.read,
    `Read source: ${brief.company.readSource}`,
    evidenceText(brief.company.evidence),
    "",
    "WHAT THEY CHOSE",
    `The pressure: ${pressureLine}`,
    `The returned time: ${brief.choices.returnedTimeChoice}. ${brief.choices.returnedTimeValue}`,
    "",
    "THE BRIEF THEY RECEIVED",
    `AI carries: ${brief.recommendation.aiCarries}`,
    `The leader keeps: ${brief.recommendation.humanKeeps}`,
    `First proof: ${brief.recommendation.proofForThirtyDays}`,
    "",
    "ROUTE READ",
    routeRead(brief.choices.entryRoute),
    "",
    "PUBLICATION INTEREST",
    publicationChoice,
    `Wording: ${brief.consent.wordingVersion}`,
    "",
    "REPLY ONLY WHEN USEFUL",
    "Share a useful thought, a strong fit or a clear question worth testing. Do not chase the visitor.",
  ].join("\n");

  const cover = companyCover(companyName, `${brief.company.domain} · Private fit digest`);
  return { subject, html: htmlDocument(subject, body, cover), text };
}

const bytesToHex = (bytes: ArrayBuffer): string =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(digest);
}

/** Hash a rate-limit identifier with a server-only HMAC key. */
export async function hmacIdentifier(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(signature);
}

export async function payloadHash(request: MindmakeBriefRequestV2): Promise<string> {
  return sha256Hex(JSON.stringify(request));
}

/** Create independent, deterministic Resend keys for all three messages. */
export async function deliveryIdempotencyKey(
  delivery: DeliveryKind,
  requestId: string,
): Promise<string> {
  const digest = await sha256Hex(requestId);
  return `mindmake-brief-v2/${delivery}/${digest}`;
}

export const safeAttachmentName = (domain: string): string => {
  const base = domain.toLowerCase().replace(/[^a-z0-9.-]+/g, "-").replace(/^-+|-+$/g, "");
  return `mindmake-${base || "company"}-private-brief.html`;
};

export const verificationRequiredResponse = (requestId: string): VerificationRequiredResponseV2 => ({
  version: 2,
  success: true,
  status: "verification_required",
  requestId,
});

export function confirmedBriefResponse(row: {
  id: string;
  visitor_delivery: DeliveryState;
  operator_delivery: DeliveryState;
  publication_requested: boolean;
}): ConfirmedBriefResponseV2 {
  return {
    version: 2,
    success: true,
    status: "confirmed",
    leadId: row.id,
    visitorDelivery: row.visitor_delivery === "queued" ? "queued" : "failed",
    operatorDelivery: row.operator_delivery === "queued" ? "queued" : "failed",
    publicationInterestRecorded: row.publication_requested,
  };
}

/** Strict response guard for the frontend V2 handoff. */
export function isMindmakeBriefResponseV2(value: unknown): value is MindmakeBriefResponseV2 {
  if (!isRecord(value) || value.version !== 2 || value.success !== true) return false;
  if (value.status === "verification_required") {
    return Object.keys(value).length === 4
      && typeof value.requestId === "string"
      && requestIdPattern.test(value.requestId);
  }
  if (value.status !== "confirmed") return false;
  const keys = [
    "version",
    "success",
    "status",
    "leadId",
    "visitorDelivery",
    "operatorDelivery",
    "publicationInterestRecorded",
  ];
  return Object.keys(value).length === keys.length
    && keys.every((key) => Object.prototype.hasOwnProperty.call(value, key))
    && typeof value.leadId === "string"
    && value.leadId.length > 0
    && (value.visitorDelivery === "queued" || value.visitorDelivery === "failed")
    && (value.operatorDelivery === "queued" || value.operatorDelivery === "failed")
    && typeof value.publicationInterestRecorded === "boolean";
}
