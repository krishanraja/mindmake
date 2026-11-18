import { personaliseBundle } from "../../supabase/functions/_shared/parts-research/bundle.ts";
import {
  type Evidence,
  MAX_BYTES,
} from "../../supabase/functions/_shared/parts-research/types.ts";
import { argumentsFor, unusedPath } from "./args.ts";

async function boundedFile(path: string, limit: number): Promise<Uint8Array> {
  if ((await Deno.stat(path)).size > limit) throw new Error("Input too large");
  const bytes = await Deno.readFile(path);
  if (bytes.length > limit) throw new Error("Input too large");
  return bytes;
}
export async function run(args: string[]) {
  const values = argumentsFor(args, ["base", "pack", "out"], [
    "base",
    "pack",
    "out",
  ]);
  await unusedPath(values.out);
  const base = await boundedFile(values.base, 64_000_000);
  const pack = await boundedFile(values.pack, MAX_BYTES);
  const evidence = JSON.parse(
    new TextDecoder("utf-8", { fatal: true }).decode(
      await boundedFile(`${values.pack}.evidence.json`, 32_000_000),
    ),
  ) as Evidence;
  const result = await personaliseBundle(base, pack, evidence);
  await Deno.writeFile(values.out, result, { createNew: true, mode: 0o600 });
  console.log(JSON.stringify({ entriesAdded: 1, out: values.out }));
}
if (import.meta.main) {
  try {
    await run(Deno.args);
  } catch {
    console.error(
      "Bundle preparation failed. Check the base part, pack, companion verification receipt and output path.",
    );
    Deno.exitCode = 1;
  }
}
