import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { transform } from "esbuild";

/**
 * Loads the static article data without maintaining a second copy for build
 * scripts. The file has no runtime imports, so compiling its TypeScript syntax
 * to an in-memory ES module is deterministic and keeps the website, sitemap and
 * prerendered crawler pages on the same source.
 */
export async function loadBlogPosts(rootDir) {
  const source = await readFile(resolve(rootDir, "src/data/blogPosts.ts"), "utf8");
  const { code } = await transform(source, {
    loader: "ts",
    format: "esm",
    target: "es2022",
    sourcefile: "src/data/blogPosts.ts",
  });
  const moduleUrl = `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
  const module = await import(moduleUrl);

  if (!Array.isArray(module.blogPosts)) {
    throw new Error("src/data/blogPosts.ts did not export a blogPosts array");
  }

  for (const [index, post] of module.blogPosts.entries()) {
    for (const field of ["slug", "title", "excerpt", "content", "metaDescription"]) {
      if (typeof post[field] !== "string" || !post[field].trim()) {
        throw new Error(`Blog post ${index + 1} has no valid ${field}`);
      }
    }
  }

  return module.blogPosts;
}
