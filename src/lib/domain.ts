/**
 * Domain handling shared by the pages that collect a company address before
 * handing it to the company read. Kept beside the other pure helpers so the
 * components that use it stay components.
 */

/** Reduces what a visitor types to the bare host the read works from. */
export function cleanDomain(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

export function isPublicHostname(hostname: string): boolean {
  if (!hostname || hostname.length > 253 || hostname.startsWith(".") || hostname.endsWith(".")) return false;
  const labels = hostname.split(".");
  if (labels.length < 2) return false;
  const validLabel = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
  if (!labels.every((label) => validLabel.test(label))) return false;
  return /^(?:[a-z]{2,63}|xn--[a-z0-9-]{2,59})$/i.test(labels.at(-1) || "");
}
