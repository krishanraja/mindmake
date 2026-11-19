// Builds one company's research file and keeps it in the private kits bucket.
// Shared by the purchase delivery and the operator's own builds.
import { buildAiStack } from "./build.ts";
import { get } from "./http.ts";

type Bucket = { storage: { from: (bucket: string) => { upload: (path: string, body: Blob, options: { upsert: boolean; contentType: string }) => Promise<{ error: unknown }> } } };

export async function buildAndStore(db: Bucket, input: { company: string; domain: string; related?: string[] }, path: string, builtwithKey?: string) {
  const pack = await buildAiStack(input, { get, now: () => new Date(), builtwithKey });
  const { error } = await db.storage.from("kits").upload(path, new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" }), { upsert: true, contentType: "application/json" });
  if (error) throw new Error("Could not store the research");
  const ai = pack.rows.filter((r) => r.category !== "Supporting stack");
  return { path, rows: pack.rows.length, ai_rows: ai.length, methods_run: pack.methods.filter((m) => m.ran).length, technology_data: pack.methods.find((m) => m.id === "technographic")?.ran ?? false };
}
