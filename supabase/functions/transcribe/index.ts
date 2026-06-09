/**
 * @file transcribe Edge Function
 * @description Server-side voice transcription for the Diagnosis Room ("Mindy")
 *              mic input. Accepts a base64-encoded audio clip, forwards it to
 *              OpenAI Whisper, and returns the transcribed text.
 *
 * Request:  POST { audioBase64: string, mimeType?: string }
 * Response: { text: string }
 * Error:    { error: string }
 *
 * Model: whisper-1 (stable). gpt-4o-mini-transcribe exists but whisper-1 is the
 *        long-stable default for the /v1/audio/transcriptions endpoint.
 * Endpoint: https://api.openai.com/v1/audio/transcriptions (multipart/form-data)
 * Rate limit: 40 requests / IP / 10 min (in-memory, best-effort)
 * Cost cap: hard circuit breaker via REQUEST_CEILING
 * Env: OPENAI_API_KEY
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";
const WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
const MODEL = "whisper-1";

// Reject anything over ~8MB of decoded audio.
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;
// Base64 inflates by ~4/3, so cap the encoded string a little above the byte cap.
const MAX_BASE64_LENGTH = Math.ceil((MAX_AUDIO_BYTES * 4) / 3) + 1024;

// Simple in-memory abuse controls (per cold start).
const RATE_LIMIT = 40; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

// Global circuit breaker since last cold start.
let totalServed = 0;
const REQUEST_CEILING = 5000;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// Map a few common audio mime types to a sensible filename extension so the
// OpenAI multipart upload is recognised. Whisper sniffs content, but a correct
// filename avoids edge cases.
const extForMime = (mime: string): string => {
  const m = mime.toLowerCase();
  if (m.includes("webm")) return "webm";
  if (m.includes("ogg")) return "ogg";
  if (m.includes("mp4") || m.includes("m4a") || m.includes("aac")) return "m4a";
  if (m.includes("mpeg") || m.includes("mp3")) return "mp3";
  if (m.includes("wav")) return "wav";
  return "webm";
};

const decodeBase64 = (b64: string): Uint8Array<ArrayBuffer> => {
  // Tolerate data URLs ("data:audio/webm;base64,....").
  const comma = b64.indexOf(",");
  const payload = b64.startsWith("data:") && comma !== -1 ? b64.slice(comma + 1) : b64;
  const binary = atob(payload);
  const bytes = new Uint8Array(new ArrayBuffer(binary.length));
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  if (!OPENAI_API_KEY) {
    return json({ error: "Voice is offline right now. Type your answer instead." }, 503);
  }

  if (totalServed >= REQUEST_CEILING) {
    return json({ error: "High demand right now. Type your answer instead." }, 429);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    return json({ error: "Too many recordings in a row. Give it a minute, or type instead." }, 429);
  }

  let audioBase64 = "";
  let mimeType = "audio/webm";
  try {
    const body = await req.json();
    audioBase64 = typeof body?.audioBase64 === "string" ? body.audioBase64 : "";
    if (typeof body?.mimeType === "string" && body.mimeType.trim()) {
      mimeType = body.mimeType.trim();
    }
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  if (!audioBase64) {
    return json({ error: "No audio came through. Try recording again, or type your answer." }, 400);
  }
  if (audioBase64.length > MAX_BASE64_LENGTH) {
    return json({ error: "That recording is too long. Keep it under a minute, or type instead." }, 413);
  }

  let bytes: Uint8Array<ArrayBuffer>;
  try {
    bytes = decodeBase64(audioBase64);
  } catch {
    return json({ error: "That recording could not be read. Try again, or type your answer." }, 400);
  }

  if (bytes.length === 0) {
    return json({ error: "No audio came through. Try recording again, or type your answer." }, 400);
  }
  if (bytes.length > MAX_AUDIO_BYTES) {
    return json({ error: "That recording is too long. Keep it under a minute, or type instead." }, 413);
  }

  try {
    const form = new FormData();
    const ext = extForMime(mimeType);
    const file = new File([bytes], `audio.${ext}`, { type: mimeType });
    form.append("file", file);
    form.append("model", MODEL);
    form.append("response_format", "json");

    const openaiResponse = await fetch(WHISPER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: form,
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text().catch(() => "");
      console.error("OpenAI transcribe error", openaiResponse.status, errText);
      return json({ error: "Could not hear that clearly. Try again, or type your answer." }, 502);
    }

    const data = await openaiResponse.json().catch(() => null);
    const text = typeof data?.text === "string" ? data.text.trim() : "";

    recent.push(now);
    hits.set(ip, recent);
    totalServed += 1;

    return json({ text });
  } catch (e) {
    console.error("transcribe failed", e);
    return json({ error: "Voice hit a snag. Try again, or type your answer." }, 502);
  }
});
