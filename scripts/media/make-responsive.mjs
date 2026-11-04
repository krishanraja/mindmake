#!/usr/bin/env node
/**
 * Right-sized pictures for phones (Krish, 2026-11-04: "Some of the images
 * take up to 10 seconds to load on a user's first visit. That is completely
 * unacceptable.").
 *
 * Writes smaller width variants of the site's card and poster pictures, and a
 * tiny blurred placeholder for each card picture, so a phone downloads a
 * picture the size of its card and never shows an empty box while it loads.
 * Run once after adding or replacing a picture; the outputs are committed
 * like every other asset:
 *
 *   node scripts/media/make-responsive.mjs
 *
 * Variants sit beside their source as `<name>-w<width>.webp`, except where the
 * source lives in a locked prototype folder, when they are written to
 * src/assets/responsive/. Placeholders go to src/data/imagePlaceholders.json,
 * keyed by the source file's name.
 */
import { readdir, writeFile, mkdir } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(import.meta.dirname, "../..");
const out = join(root, "src/assets/responsive");
await mkdir(out, { recursive: true });

const stories = (await readdir(join(root, "src/assets/stories"))).filter((f) => /-r01-800\.webp$/.test(f)).map((f) => join("src/assets/stories", f));
const eras = ["writing", "loom", "calculator", "satnav"].map((n) => `prototypes/website-redesign-recovery/new-age-leadership/media/history-${n}-s2.webp`);
const jobs = [
  ...stories.map((src) => ({ src, widths: [400, 600], placeholder: true, beside: true })),
  ...eras.map((src) => ({ src, widths: [480, 960], placeholder: true, beside: false })),
  { src: "src/assets/films/sep2026/archive-engine-hero-poster-r07.webp", widths: [720, 1280], placeholder: false, beside: true },
  { src: "prototypes/website-redesign-recovery/brain-signature/media/evidence-connects-poster.png", widths: [720, 1280], placeholder: false, beside: false },
];

const placeholders = {};
for (const { src, widths, placeholder, beside } of jobs) {
  const input = join(root, src);
  const name = basename(src, extname(src));
  const dir = beside ? dirname(input) : out;
  for (const width of widths) {
    const file = join(dir, `${name}-w${width}.webp`);
    const info = await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 70, effort: 6 }).toFile(file);
    console.log(`${(info.size / 1024).toFixed(0).padStart(4)} KB  ${file.replace(`${root}/`, "")}`);
  }
  if (placeholder) {
    const tiny = await sharp(input).resize({ width: 20 }).blur(1.2).webp({ quality: 40 }).toBuffer();
    placeholders[basename(src)] = `data:image/webp;base64,${tiny.toString("base64")}`;
  }
}
await writeFile(join(root, "src/data/imagePlaceholders.json"), `${JSON.stringify(placeholders, null, 2)}\n`);
console.log(`placeholders: ${Object.keys(placeholders).length}, largest ${Math.max(...Object.values(placeholders).map((p) => p.length))} characters`);
