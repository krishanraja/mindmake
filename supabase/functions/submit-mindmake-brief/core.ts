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
    proofForThirtyDays: "Use 30 days to find the decision underneath the noise and build the first proof.",
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
    proofForThirtyDays: "Use 30 days to find the decision underneath the noise and build the first proof.",
  },
  "product-moving-faster-than-message": {
    label: "Our product is moving faster than our message",
    routes: ["gtm"],
    aiCarries: "Bring product changes, buyer language and live objections into the same view.",
    humanKeeps: "Choose the promise you can stand behind and the proof that earns it.",
    proofForThirtyDays: "Rebuild one offer and put it in front of real buyers inside 30 days.",
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
  };
  consent: {
    publicationRequested: boolean;
    wordingVersion: typeof CONSENT_WORDING_VERSION;
  };
  website: "";
}

export interface MindmakeBriefConfirmActionV2 {
  version: 2;
  action: "confirm";
  requestId: string;
  contact: {
    email: string;
  };
  code: string;
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
): value is Record<string, unknown> => {
  if (!isRecord(value)) {
    issues.push(`${path} must be an object`);
    return false;
  }
  const keys = Object.keys(value);
  const allowedSet = new Set(allowed);
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
    choices: { pressureId, returnedTimeId, entryRoute },
    consent: {
      publicationRequested: consent.publicationRequested as boolean,
      wordingVersion: CONSENT_WORDING_VERSION,
    },
    website: "",
  };
};

const parseConfirmAction = (input: unknown): MindmakeBriefConfirmActionV2 => {
  const issues: string[] = [];
  const rootOk = exactKeys(
    input,
    ["version", "action", "requestId", "contact", "code"],
    "request",
    issues,
  );
  const root = rootOk ? input : {};

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
  };
};

/** Parse either exact V2 action and reject unknown or narrative fields. */
export function parseMindmakeBriefRequest(input: unknown): MindmakeBriefRequestV2 {
  if (!isRecord(input)) throw new BriefValidationError(["request must be an object"]);
  if (input.action === "request") return parseRequestAction(input);
  if (input.action === "confirm") return parseConfirmAction(input);
  throw new BriefValidationError(["action is not supported"]);
}

/** Build a renderer-safe brief from a parsed choice request and server research. */
export function createStoredBrief(
  request: MindmakeBriefRequestActionV2,
  researchInput: StoredCompanyResearch,
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
      pressure: pressure.label,
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
  ? `<ul style="margin:8px 0 0;padding-left:20px;">${items.map((item) => `<li style="margin:4px 0;">${esc(item)}</li>`).join("")}</ul>`
  : '<p style="margin:8px 0 0;color:#626964;">No extra company evidence was available.</p>';

const evidenceText = (items: string[]): string => items.length
  ? items.map((item) => `- ${item}`).join("\n")
  : "- No extra company evidence was available.";

const htmlDocument = (title: string, body: string): string => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title></head>
<body style="margin:0;background:#f4f0e8;color:#0d1929;font-family:Arial,'Segoe UI',sans-serif;line-height:1.55;">
<main style="max-width:720px;margin:0 auto;padding:32px 18px 56px;">
  <div style="border-top:8px solid #6ee1c0;padding-top:20px;font-weight:800;letter-spacing:.12em;">MINDMAKE</div>
  ${body}
  <p style="margin:48px 0 0;padding-top:16px;border-top:1px solid #c9c5bc;color:#626964;font-size:12px;">mindmake.co</p>
</main></body></html>`;

const block = (heading: string, content: string, strong = false): string =>
  `<section style="margin-top:18px;border:1px solid #c9c5bc;background:#fffdf8;padding:20px;">
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;">${esc(heading)}</h2>
    <${strong ? "strong" : "p"} style="display:block;margin:0;font-size:${strong ? "18px" : "15px"};">${esc(content)}</${strong ? "strong" : "p"}>
  </section>`;

/** Render the fixed verification message. Only the server-created code changes. */
export function renderVerificationEmail(code: string): ServerEmail {
  if (!verificationCodePattern.test(code)) {
    throw new BriefValidationError(["code must be six digits"]);
  }
  const subject = "Your Mindmake verification code";
  const body = `
  <h1 style="margin:44px 0 16px;font-family:Georgia,serif;font-size:38px;line-height:1.08;">Confirm your email</h1>
  <p>Use this code to finish your private brief:</p>
  <p style="margin:24px 0;padding:18px;border:1px solid #c9c5bc;background:#fffdf8;font-size:34px;font-weight:800;letter-spacing:.18em;text-align:center;">${code}</p>
  <p>The code expires in 10 minutes. If you did not ask for it, ignore this email.</p>`;
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

/** The visitor receives the server-owned brief they confirmed. */
export function renderVisitorEmail(brief: StoredBrief): ServerEmail & { attachmentHtml: string } {
  const subject = `Your Mindmake brief for ${singleLine(brief.company.name)}`;
  const source = brief.company.readSource === "live"
    ? "This came from the live company read."
    : "This is the safe read based on the website.";
  const opening = "You chose one business pressure and where better use of your time could matter most. Treat this as something to test against the real business, not a finished answer.";

  const body = `
  <h1 style="max-width:16ch;margin:44px 0 16px;font-family:Georgia,serif;font-size:40px;line-height:1.05;">${esc(brief.choices.pressure)}</h1>
  <p style="font-size:17px;">${esc(opening)}</p>
  <section style="margin-top:22px;border:1px solid #c9c5bc;background:#fffdf8;padding:20px;">
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;">What Mindmake found</h2>
    <p style="margin:0;">${esc(brief.company.read)}</p>
    <p style="margin:8px 0 0;color:#626964;font-size:13px;">${esc(source)}</p>
    ${evidenceHtml(brief.company.evidence)}
  </section>
  ${block("What AI can carry", brief.recommendation.aiCarries)}
  ${block("What stays with you", brief.recommendation.humanKeeps)}
  ${block("What to test in 30 days", brief.recommendation.proofForThirtyDays, true)}
  ${block("Where your time could go", brief.choices.returnedTimeValue)}
  <p style="margin:28px 0 0;">No sales emails will follow automatically. If you hear from Krish, it will be because he has a useful next move, a strong fit or something worth questioning.</p>`;

  const text = [
    "MINDMAKE",
    "",
    brief.choices.pressure,
    "",
    opening,
    "",
    "WHAT MINDMAKE FOUND",
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
    "WHAT TO TEST IN 30 DAYS",
    brief.recommendation.proofForThirtyDays,
    "",
    "WHERE YOUR TIME COULD GO",
    brief.choices.returnedTimeValue,
    "",
    "No sales emails will follow automatically. If you hear from Krish, it will be because he has a useful next move, a strong fit or something worth questioning.",
    "",
    "mindmake.co",
  ].join("\n");

  const html = htmlDocument(subject, body);
  return { subject, html, text, attachmentHtml: html };
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
  const subject = `Mindmake brief: ${singleLine(brief.company.name)} | ${singleLine(brief.choices.pressure)}`;
  const publicationChoice = publicationRead(brief.consent.publicationRequested);
  const replyHref = esc(`mailto:${brief.contact.email}`);

  const body = `
  <h1 style="margin:42px 0 8px;font-family:Georgia,serif;font-size:34px;">${esc(brief.company.name)}</h1>
  <p style="margin:0;"><a href="${replyHref}" style="color:#0b756c;">${esc(brief.contact.email)}</a> | ${esc(brief.company.domain)}</p>
  ${block("Why this may matter now", brief.choices.pressure, true)}
  <section style="margin-top:18px;border:1px solid #c9c5bc;background:#fffdf8;padding:20px;">
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;">Company read</h2>
    <p style="margin:0;">${esc(brief.company.read)}</p>
    <p style="margin:8px 0 0;color:#626964;font-size:13px;">Read source: ${esc(brief.company.readSource)}</p>
    ${evidenceHtml(brief.company.evidence)}
  </section>
  ${block("What AI can carry", brief.recommendation.aiCarries)}
  ${block("What the leader keeps", brief.recommendation.humanKeeps)}
  ${block("First proof to test", brief.recommendation.proofForThirtyDays, true)}
  ${block("Where they would use the time", `${brief.choices.returnedTimeChoice}. ${brief.choices.returnedTimeValue}`)}
  ${block("Route read", routeRead(brief.choices.entryRoute))}
  <section style="margin-top:18px;border:1px solid #c9c5bc;background:#fffdf8;padding:20px;">
    <h2 style="margin:0 0 8px;font-family:Georgia,serif;font-size:22px;">Publication interest</h2>
    <p style="margin:0;">${esc(publicationChoice)}</p>
    <p style="margin:8px 0 0;color:#626964;font-size:13px;">Wording: ${esc(brief.consent.wordingVersion)}</p>
  </section>
  <p style="margin:28px 0 0;"><strong>Reply only when useful:</strong> share a useful thought, a strong fit or a clear question worth testing. Do not chase the visitor.</p>`;

  const text = [
    "MINDMAKE PRIVATE BRIEF",
    "",
    `Contact: ${brief.contact.email}`,
    `Company: ${brief.company.name} (${brief.company.domain})`,
    `Entry route: ${brief.choices.entryRoute}`,
    "",
    "WHY THIS MAY MATTER NOW",
    brief.choices.pressure,
    "",
    "COMPANY READ",
    brief.company.read,
    `Read source: ${brief.company.readSource}`,
    evidenceText(brief.company.evidence),
    "",
    "WHAT AI CAN CARRY",
    brief.recommendation.aiCarries,
    "",
    "WHAT THE LEADER KEEPS",
    brief.recommendation.humanKeeps,
    "",
    "FIRST PROOF TO TEST",
    brief.recommendation.proofForThirtyDays,
    "",
    "WHERE THEY WOULD USE THE TIME",
    `${brief.choices.returnedTimeChoice}. ${brief.choices.returnedTimeValue}`,
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

  return { subject, html: htmlDocument(subject, body), text };
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
