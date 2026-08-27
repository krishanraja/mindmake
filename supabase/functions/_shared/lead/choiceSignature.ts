/**
 * @file choiceSignature.ts
 * @description Signing for tailored pressure choices. enrich-company signs each
 *   generated choice with a server-side HMAC; submit-mindmake-brief verifies
 *   the signature before any tailored label is trusted. The browser can carry
 *   the pair but can never author one, so the wire stays identifiers-plus-
 *   server-authored-text only.
 */

export const TAILORED_LABEL_MIN = 12;
export const TAILORED_LABEL_MAX = 120;

/** Lenses a tailored choice may anchor to, and the doors each serves. */
export const TAILORED_LENSES = {
  "customers-can-do-more-without-us": ["home", "gtm"],
  "product-moving-faster-than-message": ["gtm"],
  "price-still-reflects-old-work": ["gtm"],
  "team-has-too-many-possible-moves": ["gtm"],
  "important-context-lives-in-my-head": ["brain"],
  "avoid-work-that-needs-my-judgement": ["brain"],
  "searching-for-things-i-should-know": ["brain"],
  "need-room-for-important-decisions": ["brain"],
} as const;

export type TailoredLensId = keyof typeof TAILORED_LENSES;

const encoder = new TextEncoder();

async function hmacHex(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const isCleanTailoredLabel = (label: string): boolean =>
  typeof label === "string"
  && label.length >= TAILORED_LABEL_MIN
  && label.length <= TAILORED_LABEL_MAX
  && !/[\r\n\t–—<>]/.test(label)
  && label.trim() === label;

/** Sign one tailored choice. The id binds the label to its domain and lens. */
export const signTailoredChoice = (
  secret: string,
  domain: string,
  lensId: string,
  label: string,
): Promise<string> => hmacHex(secret, `mindmake-choice:${domain}:${lensId}:${label}`);

/** Verify a carried tailored choice against its claimed domain and lens. */
export async function verifyTailoredChoice(
  secret: string,
  domain: string,
  lensId: string,
  label: string,
  id: string,
): Promise<boolean> {
  if (!isCleanTailoredLabel(label)) return false;
  if (!/^[0-9a-f]{64}$/.test(id)) return false;
  const expected = await signTailoredChoice(secret, domain, lensId, label);
  return expected === id;
}
