/**
 * import-audience-csv (Mindmaker AI project bkyuxvschuwngtcdhsyg).
 *
 * Ingests a Substack subscriber CSV export into the shared audience_contacts
 * table tagged source='mindmaker_live'. Paid subscribers are flagged
 * (metadata.paid=true) so the OS bridge routes them to Subscriptions, not Leads;
 * free subscribers become low-tier leads. Upserts on (email, source) and resets
 * synced_to_os_at so re-imports (e.g. a free->paid upgrade) reprocess.
 *
 * Gated by AUDIENCE_IMPORT_SECRET (x-import-secret header). Called by the Control
 * Center Substack import dropzone via its /api/audience/import-substack proxy.
 *
 *   POST { csv: "<raw csv text>", source?: "mindmaker_live" }
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const IMPORT_SECRET = Deno.env.get("AUDIENCE_IMPORT_SECRET") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-import-secret",
};

// Minimal RFC-4180-ish CSV parser (handles quoted fields, commas, CRLF).
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    }
    if (c === '"') { inQuotes = true; i++; continue; }
    if (c === ",") { row.push(field); field = ""; i++; continue; }
    if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    if (c === "\r") { i++; continue; }
    field += c; i++;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

const truthy = (v: string | undefined) =>
  ["true", "t", "1", "yes", "y", "active", "paid", "comp", "founding"].includes((v ?? "").trim().toLowerCase());

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (IMPORT_SECRET && req.headers.get("x-import-secret") !== IMPORT_SECRET) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  let body: { csv?: string; source?: string };
  try { body = await req.json(); } catch { body = {}; }
  const csv = body.csv ?? "";
  const source = body.source ?? "mindmaker_live";
  if (!csv.trim()) {
    return new Response(JSON.stringify({ error: "no csv" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const rows = parseCsv(csv);
  if (rows.length < 2) {
    return new Response(JSON.stringify({ error: "empty or header-only csv" }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const emailIdx = header.findIndex((h) => h === "email" || h === "email address" || h.includes("email"));
  if (emailIdx < 0) {
    return new Response(JSON.stringify({ error: "no email column found", header }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
  // Columns that signal a paid subscription.
  const paidCols = header
    .map((h, idx) => ({ h, idx }))
    .filter(({ h }) => /active_subscription|paid|membership|plan|tier|type|subscription/.test(h))
    .map(({ idx }) => idx);

  const seen = new Set<string>();
  const records: Array<Record<string, unknown>> = [];
  let paid = 0, free = 0, skipped = 0;

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    const email = (cols[emailIdx] ?? "").trim().toLowerCase();
    if (!email || !email.includes("@") || seen.has(email)) { skipped++; continue; }
    seen.add(email);

    const isPaid = paidCols.some((idx) => truthy(cols[idx]));
    const tierVals = paidCols.map((idx) => (cols[idx] ?? "").trim()).filter(Boolean);
    if (isPaid) paid++; else free++;

    const meta: Record<string, unknown> = {
      capture: "substack_csv",
      paid: isPaid,
      substack_tier: isPaid ? (tierVals[0] || "paid") : "free",
    };
    // Preserve any obviously-useful columns (created/expiry) in metadata.
    header.forEach((h, idx) => {
      if (/created|expiry|since|date/.test(h) && cols[idx]) meta[h] = cols[idx].trim();
    });

    records.push({ email, source, status: isPaid ? "subscribed" : "subscribed", metadata: meta, synced_to_os_at: null });
  }

  if (records.length === 0) {
    return new Response(JSON.stringify({ ok: true, inserted: 0, paid: 0, free: 0, skipped }), { headers: { ...cors, "Content-Type": "application/json" } });
  }

  // Upsert on (email, source); reset synced_to_os_at so the bridge reprocesses.
  const resp = await fetch(`${SUPABASE_URL}/rest/v1/audience_contacts?on_conflict=email,source`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify(records),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    return new Response(JSON.stringify({ error: "upsert failed", status: resp.status, detail: errText.slice(0, 500) }), {
      status: 502, headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true, processed: records.length, paid, free, skipped }), {
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
