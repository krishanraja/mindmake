/**
 * aa-price-snapshot
 *
 * Records what published models cost and how they score, once a day.
 *
 * This renders nothing on the site today. It exists because the price history a
 * future cost curve needs cannot be back-filled: every day this does not run is
 * a gap in the record. The mapping is the same one get-ai-news already uses for
 * its market pulse, so the two agree about what a field means.
 *
 * Deploy with verify_jwt false and guard on the cron header, as the project's
 * other scheduled functions do.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const AA_ENDPOINT = "https://artificialanalysis.ai/api/v2/data/llms/models";
const FETCH_TIMEOUT_MS = 15_000;

interface RawModel {
  id?: string;
  slug?: string;
  name?: string;
  model_creator?: { name?: string };
  evaluations?: { quality_index?: number; arena_elo?: number };
  pricing?: {
    input_per_million_tokens?: number;
    input?: number;
    output_per_million_tokens?: number;
    output?: number;
  };
  median_output_tokens_per_second?: number;
  median_time_to_first_token_seconds?: number;
}

const numberOrNull = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

Deno.serve(async (request) => {
  const expected = Deno.env.get("MINDMAKE_CRON_SECRET")?.trim();
  const presented = request.headers.get("x-mindmake-cron-secret")?.trim();
  if (!expected || presented !== expected) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = Deno.env.get("ARTIFICIALANALYSIS_API_KEY");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!apiKey || !supabaseUrl || !serviceRoleKey) {
    return new Response(JSON.stringify({ error: "service_unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let rawModels: RawModel[] = [];
  try {
    const response = await fetch(AA_ENDPOINT, {
      headers: { "x-api-key": apiKey },
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`upstream ${response.status}`);
    const body = await response.json();
    rawModels = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
  } catch (error) {
    console.error("[aa-price-snapshot] fetch", (error as Error).message);
    return new Response(JSON.stringify({ error: "upstream_unavailable" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    clearTimeout(timer);
  }

  const snapshotDate = new Date().toISOString().slice(0, 10);
  const rows = rawModels
    .map((model) => {
      const modelId = model.id ?? model.slug ?? model.name;
      if (!modelId) return null;
      return {
        snapshot_date: snapshotDate,
        model_id: String(modelId),
        name: model.name ?? null,
        creator: model.model_creator?.name ?? null,
        input_price_per_m: numberOrNull(model.pricing?.input_per_million_tokens ?? model.pricing?.input),
        output_price_per_m: numberOrNull(model.pricing?.output_per_million_tokens ?? model.pricing?.output),
        intelligence: numberOrNull(model.evaluations?.quality_index ?? model.evaluations?.arena_elo),
        tokens_per_sec: numberOrNull(model.median_output_tokens_per_second),
        ttft_s: numberOrNull(model.median_time_to_first_token_seconds),
        raw: model,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length === 0) {
    return new Response(JSON.stringify({ error: "no_models" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  // Upsert on the day, so a second run repairs the day rather than duplicating.
  const { error } = await supabase
    .from("aa_model_snapshots")
    .upsert(rows, { onConflict: "snapshot_date,model_id" });

  if (error) {
    console.error("[aa-price-snapshot] upsert", error.message);
    return new Response(JSON.stringify({ error: "write_failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ snapshot_date: snapshotDate, models: rows.length }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
