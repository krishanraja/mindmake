import { kits, visibleKits } from "../../src/content/kits.ts";

export function kitsPreview(env = process.env, mode = "production") {
  return env.VERCEL_ENV !== "production" && (env.VERCEL_ENV === "preview" || env.KITS_PREVIEW_BUILD === "1" || mode === "development");
}
export const builtKits = visibleKits(kits, kitsPreview() ? "preview" : "production");
export const readyKitPages = kits.filter(kit => kit.status === "ready").map(kit => ({
  path: `/brain-modules/${kit.slug}`, title: kit.name, description: kit.problem, headline: kit.name, still: "film-02",
}));
