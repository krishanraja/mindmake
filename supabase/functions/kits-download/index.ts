import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { KitError, renewDownload } from "../_shared/kits/core.ts";
import { allowedOrigin, database, env, failure, json } from "../_shared/kits/runtime.ts";

serve(async request => {
  let origin: string | undefined;
  try {
    origin = allowedOrigin(request);
    if (request.method === "OPTIONS") return json(null, 200, origin);
    if (request.method !== "POST") throw new KitError(405, "Method not allowed");
    const token = request.headers.get("authorization")?.replace(/^Bearer /, "") ?? "";
    const db = database();
    return json(await renewDownload(token, {
      key: env("KITS_STRIPE_SECRET_KEY"), secret: env("KITS_DOWNLOAD_SECRET"),
      find: async id => {
        const { data, error } = await db.from("kit_purchases").select("status,file_path").eq("id", id).single();
        if (error) throw new KitError(503, "Download unavailable");
        return data;
      },
      sign: async (file, seconds) => {
        const { data, error } = await db.storage.from("kits").createSignedUrl(file, seconds, { download: true });
        if (error || !data?.signedUrl) throw new KitError(503, "Download unavailable");
        return data.signedUrl;
      },
    }), 200, origin);
  } catch (error) { return failure(error, origin); }
});
