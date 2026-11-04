/**
 * Right-sized pictures (Krish, 2026-11-04: images took up to ten seconds on a
 * phone's first visit). scripts/media/make-responsive.mjs writes width
 * variants of each card picture as `<name>-w<width>.webp` and a tiny blurred
 * placeholder for it; these helpers find them by the picture's own name, so a
 * card asks for the size it shows and never stands empty while it loads.
 */
import placeholders from "@/data/imagePlaceholders.json";

const variantUrls = import.meta.glob("/src/assets/**/*-w*.webp", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

/** name of the source picture, without its extension, mapped to its variants by width. */
const variants = new Map<string, { width: number; url: string }[]>();
for (const [path, url] of Object.entries(variantUrls)) {
  const match = /\/([^/]+)-w(\d+)\.webp$/.exec(path);
  if (!match) continue;
  const [, stem, width] = match;
  const list = variants.get(stem) ?? [];
  list.push({ width: Number(width), url });
  variants.set(stem, list.sort((a, b) => a.width - b.width));
}
const stems = [...variants.keys()].sort((a, b) => b.length - a.length);
const placeholderByStem = new Map(Object.entries(placeholders as Record<string, string>).map(([file, data]) => [file.replace(/\.[a-z]+$/, ""), data]));

/* A built URL carries a content hash after the name (`name-AbC123xy.webp`),
   a dev URL does not (`name.webp`); either way the name is followed by "-" or ".". */
const stemOf = (url: string) => stems.find((stem) => url.includes(`/${stem}-`) || url.includes(`/${stem}.`));

/**
 * The srcset for a picture: its smaller variants and the original at its own
 * width. Undefined when the picture has no variants.
 */
export function srcsetFor(url: string, originalWidth: number): string | undefined {
  const stem = stemOf(url);
  const list = stem ? variants.get(stem) : undefined;
  if (!list?.length) return undefined;
  return [...list.filter((v) => v.width < originalWidth).map((v) => `${v.url} ${v.width}w`), `${url} ${originalWidth}w`].join(", ");
}

/** A blurred twenty-pixel version of the picture, as a data URL, to show while it loads. */
export function placeholderFor(url: string): string | undefined {
  const stem = stemOf(url);
  return stem ? placeholderByStem.get(stem) : undefined;
}
