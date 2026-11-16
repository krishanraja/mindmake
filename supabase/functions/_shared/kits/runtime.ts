import Stripe from "https://esm.sh/stripe@18.5.0?target=denonext";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.84.0";
import { KitError, requireTestKey } from "./core.ts";

export const env = (name: string) => Deno.env.get(name)?.trim() ?? "";
export function stripeClient() {
  const key = env("STRIPE_SECRET_KEY");
  requireTestKey(key);
  return new Stripe(key, { httpClient: Stripe.createFetchHttpClient() });
}
export const database = () => createClient(env("SUPABASE_URL"), env("SUPABASE_SERVICE_ROLE_KEY"), { auth: { persistSession: false, autoRefreshToken: false } });
export function mapping(name: string): Record<string, string> {
  const value = JSON.parse(env(name) || "{}");
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.values(value).some(v => typeof v !== "string")) throw new KitError(503, "Configuration unavailable");
  return value;
}
export function publicOrigin() {
  const url = new URL(env("MINDMAKE_PUBLIC_URL"));
  if (url.protocol !== "https:" && !(url.hostname === "localhost" || url.hostname === "127.0.0.1")) throw new KitError(503, "Configuration unavailable");
  return url.origin;
}
export function json(body: unknown, status = 200, origin?: string) {
  return new Response(JSON.stringify(body), { status, headers: {
    "Content-Type": "application/json", "Cache-Control": "no-store", "Referrer-Policy": "no-referrer",
    ...(origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin", "Access-Control-Allow-Headers": "content-type, authorization", "Access-Control-Allow-Methods": "POST, OPTIONS" } : {}),
  } });
}
export const failure = (error: unknown, origin?: string) => json({ error: error instanceof KitError ? error.message : "Service unavailable" }, error instanceof KitError ? error.status : 503, origin);
export function allowedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || !env("MINDMAKE_ALLOWED_ORIGINS").split(",").map(s => s.trim()).includes(origin)) throw new KitError(403, "Origin not allowed");
  return origin;
}
export async function limitedBody(request: Request, limit = 65536) {
  if (Number(request.headers.get("content-length")) > limit) throw new KitError(413, "Request too large");
  const reader = request.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) { await reader.cancel(); throw new KitError(413, "Request too large"); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  return new TextDecoder().decode(bytes);
}
