import { describe, expect, it } from "vitest";
import { scrubVoice } from "../../supabase/functions/_shared/enrich/llm";
import {
  signTailoredChoice,
  verifyTailoredChoice,
} from "../../supabase/functions/_shared/lead/choiceSignature";
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
} from "../../supabase/functions/submit-mindmake-brief/core";

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

const parsedRequest = (): MindmakeBriefRequestActionV2 => {
  const parsed = parseMindmakeBriefRequest(validRequest());
  if (parsed.action !== "request") throw new Error("Expected request action");
  return parsed;
};

describe("Mindmake brief V2 backend core", () => {
  it("preserves ordinary prose while replacing only dash punctuation", () => {
    expect(scrubVoice("You're the BBC, the world's public service broadcaster.")).toBe(
      "You're the BBC, the world's public service broadcaster.",
    );
    expect(scrubVoice("One choice \u2014 one clear next step.")).toBe(
      "One choice, one clear next step.",
    );
    expect(scrubVoice("Evidence \u2013 then judgement.")).toBe(
      "Evidence, then judgement.",
    );
  });

  it("accepts and normalises only the exact choice request", () => {
    const request = validRequest();
    const parsed = parseMindmakeBriefRequest({
      ...request,
      contact: { email: "  LEADER@EXAMPLE.COM " },
      company: { domain: " EXAMPLE.COM " },
    });

    expect(parsed.action).toBe("request");
    expect(parsed.contact.email).toBe("leader@example.com");
    if (parsed.action !== "request") return;
    expect(parsed.company.domain).toBe("example.com");
    expect(parsed.consent.publicationRequested).toBe(false);
    expect(parsed).not.toHaveProperty("recommendation");
  });

  it("accepts only the exact six-digit confirmation action", () => {
    const parsed = parseMindmakeBriefRequest({
      ...validConfirm(),
      contact: { email: " LEADER@EXAMPLE.COM " },
    });
    expect(parsed).toEqual({
      ...validConfirm(),
      contact: { email: "leader@example.com" },
    });
    expect(() => parseMindmakeBriefRequest({ ...validConfirm(), code: "12345" })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({ ...validConfirm(), code: "123456 " })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({
      ...validConfirm(),
      company: { domain: "example.com" },
    })).toThrow(BriefValidationError);
  });

  it("rejects arbitrary narrative, unknown IDs, route mismatches and honeypot values", () => {
    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      company: { domain: "example.com", name: "Injected company" },
    })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      recommendation: { aiCarries: "Trust the browser" },
    })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      choices: { ...validRequest().choices, pressureId: "anything-i-want" },
    })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      choices: {
        ...validRequest().choices,
        pressureId: "important-context-lives-in-my-head",
        entryRoute: "gtm",
      },
    })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({ ...validRequest(), website: "bot" })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({ ...validRequest(), website: " " })).toThrow(BriefValidationError);
  });

  it("rebuilds visitor-facing recommendations from authoritative IDs", () => {
    const stored = createStoredBrief(parsedRequest(), research());
    expect(stored.choices).toMatchObject({
      pressure: "Our product is moving faster than our message",
      returnedTimeChoice: "Grow this business",
      returnedTimeValue: "Protect that time for product, buyers and the few decisions that can change growth.",
    });
    expect(stored.recommendation).toEqual({
      aiCarries: "Bring product changes, buyer language and live objections into the same view.",
      humanKeeps: "Choose the promise you can stand behind and the proof that earns it.",
      proofForThirtyDays: "Rebuild one offer and put it in front of real buyers inside 30 days.",
    });
  });

  it("renders a fixed verification message with only the server code changing", () => {
    const verification = renderVerificationEmail("123456");
    expect(verification.subject).toBe("Your Mindmake verification code");
    expect(verification.html).toContain("123456");
    expect(verification.text).toContain("123456");
    expect(verification.text).toContain("expires in 10 minutes");
    expect(verification.html).not.toContain("leader@example.com");
    expect(verification.html).not.toContain("example.com");
    expect(() => renderVerificationEmail("12 456")).toThrow(BriefValidationError);
  });

  it("renders escaped stored briefs without external attachment dependencies", () => {
    const stored = createStoredBrief(parsedRequest(), research());
    const visitor = renderVisitorEmail(stored);
    const operator = renderOperatorEmail(stored);

    expect(visitor.html).not.toContain("<useful>");
    expect(visitor.html).toContain("&lt;useful&gt;");
    expect(operator.html).not.toContain("<useful>");
    expect(visitor.html.toLowerCase()).not.toContain("calendly");
    expect(operator.html.toLowerCase()).not.toContain("calendly");
    expect(visitor.attachmentHtml).not.toContain("fonts.googleapis.com");
    expect(visitor.attachmentHtml).not.toContain("@import");
    expect(visitor.text).toContain("No sales emails will follow automatically.");
    expect(visitor.text).not.toContain("Krish has the same brief");
    expect(operator.text).toContain("Never import this address directly.");
  });

  it("keeps a positive publication choice as unverified interest", () => {
    const request = parsedRequest();
    const stored = createStoredBrief({
      ...request,
      consent: { ...request.consent, publicationRequested: true },
    }, research());
    const operator = renderOperatorEmail(stored);
    expect(operator.text).toContain("Unverified interest only.");
    expect(operator.text).toContain("Never import this address directly.");
  });

  it("uses stable, independent and header-safe idempotency keys", async () => {
    const verificationA = await deliveryIdempotencyKey("verification", requestId);
    const verificationB = await deliveryIdempotencyKey("verification", requestId);
    const visitor = await deliveryIdempotencyKey("visitor", requestId);
    const operator = await deliveryIdempotencyKey("operator", requestId);

    expect(verificationA).toBe(verificationB);
    expect(new Set([verificationA, visitor, operator])).toHaveLength(3);
    for (const key of [verificationA, visitor, operator]) {
      expect(key.length).toBeLessThanOrEqual(256);
      expect(key).toMatch(/^[\x21-\x7e]+$/);
    }
  });

  it("returns conservative V2 responses and safe attachment names", () => {
    const pending = verificationRequiredResponse(requestId);
    const confirmed = confirmedBriefResponse({
      id: "lead-id",
      visitor_delivery: "sending",
      operator_delivery: "queued",
      publication_requested: true,
    });

    expect(isMindmakeBriefResponseV2(pending)).toBe(true);
    expect(isMindmakeBriefResponseV2(confirmed)).toBe(true);
    expect(confirmed).toMatchObject({
      visitorDelivery: "failed",
      operatorDelivery: "queued",
      publicationInterestRecorded: true,
    });
    expect(isMindmakeBriefResponseV2({ ...pending, surprise: true })).toBe(false);
    expect(safeAttachmentName("Example.COM")).toBe("mindmake-example.com-private-brief.html");
  });

  it("carries a tailored pressure only with a valid server signature", async () => {
    const secret = "test-secret";
    const label = "AI search may weaken the traffic that feeds our current model";
    const id = await signTailoredChoice(secret, "example.com", "product-moving-faster-than-message", label);

    expect(await verifyTailoredChoice(secret, "example.com", "product-moving-faster-than-message", label, id)).toBe(true);
    expect(await verifyTailoredChoice(secret, "another.com", "product-moving-faster-than-message", label, id)).toBe(false);
    expect(await verifyTailoredChoice(secret, "example.com", "price-still-reflects-old-work", label, id)).toBe(false);
    expect(await verifyTailoredChoice(secret, "example.com", "product-moving-faster-than-message", label + "!", id)).toBe(false);

    const withTailored = {
      ...validRequest(),
      choices: { ...validRequest().choices, tailored: { id, label } },
    };
    const parsed = parseMindmakeBriefRequest(withTailored);
    if (parsed.action !== "request") throw new Error("expected request action");
    expect(parsed.choices.tailored).toEqual({ id, label });

    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      choices: { ...validRequest().choices, tailored: { id: "short", label } },
    })).toThrow(BriefValidationError);
    expect(() => parseMindmakeBriefRequest({
      ...validRequest(),
      choices: { ...validRequest().choices, tailored: { id, label: "too short" } },
    })).toThrow(BriefValidationError);

    const confirmWithTailored = parseMindmakeBriefRequest({
      ...validConfirm(),
      tailored: { id, label },
    });
    if (confirmWithTailored.action !== "confirm") throw new Error("expected confirm action");
    expect(confirmWithTailored.tailored).toEqual({ id, label });

    const brief = createStoredBrief(parsed, {
      name: "Example",
      read: "A short read.",
      evidence: [],
      readSource: "fallback",
    }, label);
    expect(brief.choices.pressure).toBe(label);
    expect(brief.recommendation.aiCarries.length).toBeGreaterThan(0);
    const visitor = renderVisitorEmail(brief);
    expect(visitor.subject).toContain("Example");
    expect(visitor.attachmentHtml).toContain(label);
    expect(visitor.attachmentHtml).toContain("It is not advice.");
  });
});
