/**
 * @file resend.ts
 * @description First shared Resend sender for the edge functions. Collapses the
 *   inline `fetch("https://api.resend.com/emails")` that was copy-pasted into eight
 *   functions into one place, with:
 *     - the `re_` API-key guard (from send-contact-email),
 *     - 3-attempt exponential backoff (1s, 2s, 4s) on transient failures,
 *     - the stack-safe chunked base64 encoder (from session-digest) for attachments.
 *
 * @secrets RESEND_API_KEY
 */

export interface ResendAttachment {
  filename: string;
  content: string; // base64
}

export interface ResendEmail {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string | string[];
  attachments?: ResendAttachment[];
}

const RESEND_ENDPOINT = "https://api.resend.com/emails";
// Five bounded attempts plus backoff stay safely inside the 120-second
// database delivery lease used by submit-mindmake-brief.
const RESEND_ATTEMPT_TIMEOUT_MS = 12_000;

/** Encode a string as base64 without blowing the call stack on large buffers. */
export const toBase64 = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunk = 0x8000; // 32k chars at a time
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

/** True when RESEND_API_KEY is present and looks like a real key. */
export const hasResendKey = (): boolean => {
  const k = Deno.env.get("RESEND_API_KEY");
  return !!k && k.trim().startsWith("re_");
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const isRetryableStatus = (status: number): boolean =>
  status === 408 || status === 409 || status === 429 || status >= 500;

/**
 * Send one email via Resend with retry. Returns `{ ok }`; never throws.
 * Retries only network failures, 408, 409, 429, and 5xx responses up to
 * `maxRetries` with exponential backoff. Other 4xx responses fail immediately.
 * A missing or invalid key returns `{ ok:false }` fast.
 */
export async function sendResendEmail(
  payload: ResendEmail,
  opts: { maxRetries?: number; label?: string; idempotencyKey?: string } = {},
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = Deno.env.get("RESEND_API_KEY")?.trim();
  const label = opts.label ?? "resend";
  if (!key || !key.startsWith("re_")) {
    console.error(`[${label}] RESEND_API_KEY missing or invalid`);
    return { ok: false, error: "RESEND_API_KEY missing or invalid" };
  }

  const idempotencyKey = opts.idempotencyKey?.trim();
  if (
    idempotencyKey
    && (idempotencyKey.length > 256 || !/^[\x21-\x7e]+$/.test(idempotencyKey))
  ) {
    console.error(`[${label}] Resend idempotency key is not header-safe`);
    return { ok: false, error: "Invalid Resend idempotency key" };
  }

  const maxAttempts = Math.max(1, Math.min(5, Math.trunc(opts.maxRetries ?? 3)));
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let retryable = true;
    try {
      const response = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        signal: AbortSignal.timeout(RESEND_ATTEMPT_TIMEOUT_MS),
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          ...(idempotencyKey ? { "Idempotency-Key": idempotencyKey } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        return {
          ok: true,
          id: typeof data?.id === "string" ? data.id : undefined,
        };
      }

      retryable = isRetryableStatus(response.status);
      const detail = (await response.text().catch(() => "")).slice(0, 500);
      lastError = `${response.status} ${detail}`.trim();
      console.error(
        `[${label}] Resend non-2xx (attempt ${attempt}/${maxAttempts}):`,
        lastError,
      );
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      console.error(
        `[${label}] Resend request failed (attempt ${attempt}/${maxAttempts}):`,
        lastError,
      );
    }

    if (!retryable || attempt >= maxAttempts) break;
    await sleep(2 ** (attempt - 1) * 1000);
  }

  return { ok: false, error: lastError };
}
