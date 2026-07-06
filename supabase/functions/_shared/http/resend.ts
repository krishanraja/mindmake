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

/**
 * Send one email via Resend with retry. Returns `{ ok }`; never throws.
 * Retries transient failures (network error or non-2xx) up to `maxRetries`
 * with exponential backoff. A missing/invalid key returns `{ ok:false }` fast.
 */
export async function sendResendEmail(
  payload: ResendEmail,
  opts: { maxRetries?: number; label?: string } = {},
): Promise<{ ok: boolean; id?: string; error?: string }> {
  const key = Deno.env.get("RESEND_API_KEY")?.trim();
  const label = opts.label ?? "resend";
  if (!key || !key.startsWith("re_")) {
    console.error(`[${label}] RESEND_API_KEY missing or invalid`);
    return { ok: false, error: "RESEND_API_KEY missing or invalid" };
  }

  const maxRetries = opts.maxRetries ?? 3;
  let lastError = "";

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(RESEND_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        return { ok: true, id: data?.id };
      }

      lastError = `${res.status} ${await res.text().catch(() => "")}`;
      console.error(`[${label}] Resend non-2xx (attempt ${attempt}/${maxRetries}):`, lastError);
    } catch (e) {
      lastError = e instanceof Error ? e.message : String(e);
      console.error(`[${label}] Resend request failed (attempt ${attempt}/${maxRetries}):`, lastError);
    }

    if (attempt < maxRetries) await sleep(Math.pow(2, attempt - 1) * 1000);
  }

  return { ok: false, error: lastError };
}
