// The builder's network: public HTTPS only, every redirect re-checked, 6 seconds and 1 MB a request.
import { publicUrl, readCapped } from "../parts-research/transport.ts";
import type { Got } from "./build.ts";

const AGENT = "MindmakeResearch/1.0 (+https://mindmake.co)";
export async function get(value: string): Promise<Got> {
  let url = publicUrl(value);
  for (let hop = 0; hop < 4; hop++) {
    const response = await fetch(url, { redirect: "manual", headers: { "User-Agent": AGENT, Accept: "text/html,application/json;q=0.9,*/*;q=0.5" }, signal: AbortSignal.timeout(6000) });
    if (response.status >= 300 && response.status < 400 && response.headers.get("location")) {
      await response.body?.cancel();
      url = publicUrl(new URL(response.headers.get("location")!, url).href);
      continue;
    }
    const text = response.status === 200 ? await readCapped(response, 1024 * 1024).catch(() => "") : (await response.body?.cancel(), "");
    return { status: response.status, text, url: url.href };
  }
  return { status: 310, text: "", url: url.href };
}
