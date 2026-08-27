import {
  BriefValidationError,
  CONSENT_WORDING_VERSION,
  confirmedBriefResponse,
  createStoredBrief,
  deliveryIdempotencyKey,
  isMindmakeBriefResponseV2,
  parseMindmakeBriefRequest,
  renderOperatorEmail,
  renderVerificationEmail,
  renderVisitorEmail,
  safeAttachmentName,
  verificationRequiredResponse,
  type MindmakeBriefRequestActionV2,
} from "./core.ts";

const requestId = "f7f8ce98-76a3-49a4-bf73-f96735d60589";

const validRequest = () => ({
  version: 2,
  action: "request",
  requestId,
  contact: { email: "leader@example.com" },
  company: { domain: "example.com" },
  choices: {
    pressureId: "product-moving-faster-than-message",
    returnedTimeId: "grow-this-business",
    entryRoute: "gtm",
  },
  consent: {
    publicationRequested: false,
    wordingVersion: CONSENT_WORDING_VERSION,
  },
  website: "",
});

const validConfirm = () => ({
  version: 2,
  action: "confirm",
  requestId,
  contact: { email: "leader@example.com" },
  code: "123456",
});

const research = () => ({
  name: "Example & Co",
  read: "A company that makes <useful> products.",
  evidence: ["A visible product", "A recent signal"],
  readSource: "live" as const,
});

const assert = (condition: unknown, message: string) => {
  if (!condition) throw new Error(message);
};

const assertThrowsValidation = (fn: () => unknown) => {
  let caught: unknown;
  try {
    fn();
  } catch (error) {
    caught = error;
  }
  assert(caught instanceof BriefValidationError, "Expected BriefValidationError");
};

const parsedRequest = (): MindmakeBriefRequestActionV2 => {
  const parsed = parseMindmakeBriefRequest(validRequest());
  assert(parsed.action === "request", "Expected request action");
  return parsed as MindmakeBriefRequestActionV2;
};

Deno.test("accepts and normalises the exact V2 choice request", () => {
  const parsed = parseMindmakeBriefRequest({
    ...validRequest(),
    contact: { email: "  LEADER@EXAMPLE.COM " },
    company: { domain: " EXAMPLE.COM " },
  });
  assert(parsed.action === "request", "Expected request action");
  if (parsed.action !== "request") return;
  assert(parsed.contact.email === "leader@example.com", "Email should be normalised");
  assert(parsed.company.domain === "example.com", "Domain should be normalised");
  assert(parsed.consent.publicationRequested === false, "False interest must stay false");
});

Deno.test("accepts only the exact six-digit confirmation action", () => {
  const parsed = parseMindmakeBriefRequest({
    ...validConfirm(),
    contact: { email: " LEADER@EXAMPLE.COM " },
  });
  assert(parsed.action === "confirm", "Expected confirm action");
  if (parsed.action !== "confirm") return;
  assert(parsed.contact.email === "leader@example.com", "Email should be normalised");
  assert(parsed.code === "123456", "Code should be retained");

  assertThrowsValidation(() => parseMindmakeBriefRequest({ ...validConfirm(), code: "12345" }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({ ...validConfirm(), code: "123456 " }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({
    ...validConfirm(),
    company: { domain: "example.com" },
  }));
});

Deno.test("rejects browser narrative, unknown IDs, route mismatches and honeypot values", () => {
  assertThrowsValidation(() => parseMindmakeBriefRequest({
    ...validRequest(),
    company: { domain: "example.com", name: "Injected company" },
  }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({
    ...validRequest(),
    recommendation: { aiCarries: "Trust the browser" },
  }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({
    ...validRequest(),
    choices: { ...validRequest().choices, pressureId: "anything-i-want" },
  }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({
    ...validRequest(),
    choices: {
      ...validRequest().choices,
      pressureId: "important-context-lives-in-my-head",
      entryRoute: "gtm",
    },
  }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({ ...validRequest(), website: "bot" }));
  assertThrowsValidation(() => parseMindmakeBriefRequest({ ...validRequest(), website: " " }));
});

Deno.test("reconstructs all recommendation text from the allowlisted IDs", () => {
  const stored = createStoredBrief(parsedRequest(), research());
  assert(stored.choices.pressure === "Our product is moving faster than our message", "Pressure should be server-owned");
  assert(stored.choices.returnedTimeChoice === "Grow this business", "Returned-time label should be server-owned");
  assert(
    stored.choices.returnedTimeValue === "Protect that time for product, buyers and the few decisions that can change growth.",
    "Returned-time value should be server-owned",
  );
  assert(
    stored.recommendation.aiCarries === "Bring product changes, buyer language and live objections into the same view.",
    "AI work should be server-owned",
  );
  assert(
    stored.recommendation.humanKeeps === "Choose the promise you can stand behind and the proof that earns it.",
    "Human judgement should be server-owned",
  );
  assert(
    stored.recommendation.proofForThirtyDays === "Rebuild one offer and put it in front of real buyers inside 30 days.",
    "Proof should be server-owned",
  );
});

Deno.test("verification email has fixed copy and no user-controlled company or email content", () => {
  const email = renderVerificationEmail("123456");
  assert(email.subject === "Your Mindmake verification code", "Subject must be fixed");
  assert(email.html.includes("123456"), "HTML should include the server-created code");
  assert(email.text.includes("123456"), "Text should include the server-created code");
  assert(email.text.includes("expires in 10 minutes"), "Expiry copy must match storage");
  assert(!email.html.includes("leader@example.com"), "Verification HTML must not include the email address");
  assert(!email.html.includes("example.com"), "Verification HTML must not include the company domain");
  assertThrowsValidation(() => renderVerificationEmail("12 456"));
});

Deno.test("stored-brief templates escape research and set the publication boundary", () => {
  const stored = createStoredBrief(parsedRequest(), research());
  const visitor = renderVisitorEmail(stored);
  const operator = renderOperatorEmail(stored);

  assert(!visitor.html.includes("<useful>"), "Visitor HTML must escape research");
  assert(visitor.html.includes("&lt;useful&gt;"), "Escaped research should remain readable");
  assert(!operator.html.includes("<useful>"), "Operator HTML must escape research");
  assert(!visitor.html.toLowerCase().includes("calendly"), "Visitor email must not contain Calendly");
  assert(!operator.html.toLowerCase().includes("calendly"), "Operator email must not contain Calendly");
  assert(!visitor.attachmentHtml.includes("fonts.googleapis.com"), "Attachment must not load external fonts");
  assert(!visitor.attachmentHtml.includes("@import"), "Attachment must not import styles");
  assert(visitor.text.includes("No sales emails will follow automatically."), "Visitor boundary must be clear");
  assert(!visitor.text.includes("Krish has the same brief"), "Visitor email must not claim operator delivery");
  assert(visitor.text.includes("It is not advice."), "Visitor email must carry the illustrative honesty line");
  assert(operator.text.includes("Never import this address directly."), "Operator import boundary must be clear");
});

Deno.test("positive publication choice remains unverified interest", () => {
  const request = parsedRequest();
  const stored = createStoredBrief({
    ...request,
    consent: { ...request.consent, publicationRequested: true },
  }, research());
  const operator = renderOperatorEmail(stored);
  assert(operator.text.includes("Unverified interest only."), "Interest must be labelled unverified");
  assert(operator.text.includes("Never import this address directly."), "Direct import must be forbidden");
});

Deno.test("delivery idempotency keys are stable and independent for all messages", async () => {
  const verificationA = await deliveryIdempotencyKey("verification", requestId);
  const verificationB = await deliveryIdempotencyKey("verification", requestId);
  const visitor = await deliveryIdempotencyKey("visitor", requestId);
  const operator = await deliveryIdempotencyKey("operator", requestId);

  assert(verificationA === verificationB, "Verification key must be stable");
  assert(new Set([verificationA, visitor, operator]).size === 3, "Each message needs an independent key");
  assert([verificationA, visitor, operator].every((key) => key.length <= 256), "Keys must fit Resend's limit");
  assert([verificationA, visitor, operator].every((key) => /^[\x21-\x7e]+$/.test(key)), "Keys must be header-safe");
});

Deno.test("V2 response builders make only conservative claims", () => {
  const pending = verificationRequiredResponse(requestId);
  const confirmed = confirmedBriefResponse({
    id: "lead-id",
    visitor_delivery: "sending",
    operator_delivery: "queued",
    publication_requested: true,
  });

  assert(isMindmakeBriefResponseV2(pending), "Verification response should pass the guard");
  assert(isMindmakeBriefResponseV2(confirmed), "Confirmed response should pass the guard");
  assert(confirmed.visitorDelivery === "failed", "Sending is not a queued delivery claim");
  assert(confirmed.operatorDelivery === "queued", "Queued delivery may be claimed");
  assert(confirmed.publicationInterestRecorded, "Only publication interest is recorded");
  assert(!isMindmakeBriefResponseV2({ ...pending, surprise: true }), "Unknown response fields must fail");
  assert(safeAttachmentName("Example.COM") === "mindmake-example.com-private-brief.html", "Attachment name should be safe");
});
