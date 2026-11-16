import type { Kit } from "../../src/content/kits";
export function kitsPreview(env?: { VERCEL_ENV?: string; KITS_PREVIEW_BUILD?: string }, mode?: string): boolean;
export const builtKits: Kit[];
export const readyKitPages: { path: string; title: string; description: string; headline: string; still: string }[];
