/**
 * Loads src/lib/offers.ts from plain Node, so build scripts can state real
 * prices without restating a single one of them.
 *
 * Path A. Node >= 22.18 strips types natively and imports the .ts directly.
 * Path B. Older Node transforms it with esbuild (already present as a build
 *         dependency) and imports the result from a data: URL. Nothing is
 *         written to disk either way.
 *
 * Path B exists so a production build is never hostage to whichever Node
 * minor the platform happens to ship this month. If both paths fail the build
 * fails loudly, which is correct: a prerendered page with a missing price is
 * worse than no prerendered page.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const OFFERS_TS = resolve(here, "../../src/lib/offers.ts");

function isTypeStrippingFailure(err) {
  const code = err && err.code;
  const message = String((err && err.message) || "");
  return (
    code === "ERR_UNKNOWN_FILE_EXTENSION" ||
    code === "ERR_UNSUPPORTED_NODE_VERSION" ||
    /unknown file extension|strip-types|type stripping|erasable/i.test(message)
  );
}

export async function loadOffers() {
  try {
    return await import(pathToFileURL(OFFERS_TS).href);
  } catch (err) {
    if (!isTypeStrippingFailure(err)) throw err;
    console.warn(
      `offers-loader: Node ${process.versions.node} cannot strip types natively ` +
        "(needs >= 22.18). Falling back to esbuild.",
    );
    const { transformSync } = await import("esbuild");
    const { code } = transformSync(readFileSync(OFFERS_TS, "utf-8"), {
      loader: "ts",
      format: "esm",
      target: "es2020",
    });
    const encoded = Buffer.from(code, "utf-8").toString("base64");
    return import("data:text/javascript;base64," + encoded);
  }
}
