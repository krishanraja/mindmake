/**
 * One-way identifiers for abuse limits.
 *
 * The same construction submit-mindmake-brief uses, duplicated rather than
 * imported because that function's core.ts is a frozen delivery surface: a
 * change there means redeploying the lead pipeline and re-proving it end to
 * end. Two identical copies of eight lines is the cheaper honesty.
 *
 * A raw address or IP never reaches the database. The salt lives only in the
 * function's environment, so the stored hashes are useless without it.
 */

const bytesToHex = (bytes: ArrayBuffer): string =>
  Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");

export async function sha256Hex(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(digest);
}

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

/** The client identifier, from the headers the platform sets. */
export function clientIdentifier(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (forwarded
    || request.headers.get("cf-connecting-ip")
    || request.headers.get("x-real-ip")
    || "unavailable").slice(0, 64);
}
