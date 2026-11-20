// Loads the makeyourmindup member list (from Substack's export) and releases the free claims that were waiting for it.
// Service role only: never called from a browser.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { KitError, webhook, type KitEvent } from "../_shared/kits/core.ts";
import { kitsDeps } from "../_shared/kits/handler.ts";
import { database, env, json, limitedBody, stripeClient } from "../_shared/kits/runtime.ts";

serve(async request => {
  try {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const service = env("SUPABASE_SERVICE_ROLE_KEY");
    if (!service || request.headers.get("authorization") !== `Bearer ${service}`) return json({ error: "Not allowed" }, 403);
    let input: { rows?: { email?: string; tier?: string }[] };
    try { input = JSON.parse(await limitedBody(request, 2 * 1024 * 1024)); } catch { return json({ error: "Invalid request" }, 400); }
    const rows = (input.rows ?? []).filter(row => typeof row.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email) && ["paid", "founding"].includes(String(row.tier)));
    if (!rows.length) return json({ error: "No usable rows" }, 400);
    const db = database();
    // The same address twice keeps its highest tier.
    const best = new Map<string, string>();
    for (const row of rows) {
      const { data, error } = await db.rpc("kits_email_key", { p_email: row.email });
      if (error || typeof data !== "string") throw new KitError(503, "Could not read an address");
      if (best.get(data) !== "founding") best.set(data, row.tier!);
    }
    const list = [...best].map(([email_key, tier]) => ({ email_key, tier }));
    for (let i = 0; i < list.length; i += 500) {
      const { error } = await db.from("kit_members").upsert(list.slice(i, i + 500), { onConflict: "email_key" });
      if (error) throw new KitError(503, "Could not save the list");
    }
    // Release every waiting claim whose address is now a member of the right tier.
    const stripe = stripeClient();
    const base = kitsDeps(stripe, db);
    const { data: waiting, error: waitError } = await db.from("kit_member_requests").select("*").is("released_at", null);
    if (waitError) throw new KitError(503, "Could not read waiting claims");
    const released: string[] = [], still: string[] = [];
    const tiers = new Map(list.map(member => [member.email_key, member.tier]));
    for (const claim of waiting ?? []) {
      // Only a claim whose address is now a member of the right tier is run again; the rest keep waiting, untouched.
      const tier = tiers.get(claim.email_key);
      if (!(tier === "founding" || (tier === "paid" && claim.coupon !== "mymu-founding-member"))) { still.push(claim.session_id); continue; }
      try {
        const session = await stripe.checkout.sessions.retrieve(claim.session_id);
        const event = { id: `release_${claim.session_id}`, type: "checkout.session.completed", livemode: session.livemode, created: Math.floor(Date.now() / 1000), data: { object: session } } as unknown as KitEvent;
        await webhook("released", "released", { ...base, verify: async () => event });
        await db.from("kit_member_requests").update({ released_at: new Date().toISOString() }).eq("session_id", claim.session_id);
        released.push(claim.session_id);
      } catch { still.push(claim.session_id); }
    }
    return json({ loaded: list.length, founding: list.filter(m => m.tier === "founding").length, paid: list.filter(m => m.tier === "paid").length, released: released.length, still_waiting: still.length });
  } catch (error) {
    return json({ error: error instanceof KitError ? error.message : "Unavailable" }, error instanceof KitError ? error.status : 503);
  }
});
