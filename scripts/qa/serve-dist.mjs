/**
 * A static server for dist/ that resolves paths the way Vercel does, so local
 * verification tests what production actually serves.
 *
 * This exists because `vite preview` applies its SPA fallback first and hands
 * back dist/index.html for every route. That hides the entire point of the
 * prerender step: on Vercel, a request for /teardown is answered by the real
 * dist/teardown/index.html, and the rewrite to /index.html only fires for
 * paths with no matching file.
 *
 * Resolution order, matching vercel.json:
 *   1. the exact file            /assets/x.js  -> dist/assets/x.js
 *   2. the directory index       /teardown     -> dist/teardown/index.html
 *   3. the SPA fallback          /anything     -> dist/index.html
 *
 * Verification only. Not part of the build and never deployed.
 */

import { createServer } from "http";
import { readFileSync, existsSync, statSync } from "fs";
import { resolve, extname, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../../dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
};

const isFile = (p) => existsSync(p) && statSync(p).isFile();

export function startServer(port = 4180) {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);

    // Refuse to climb out of dist/.
    const candidate = resolve(DIST, "." + urlPath);
    if (!candidate.startsWith(DIST)) {
      res.writeHead(403).end("Forbidden");
      return;
    }

    let file = null;
    if (isFile(candidate)) file = candidate;
    else if (isFile(join(candidate, "index.html"))) file = join(candidate, "index.html");
    else file = join(DIST, "index.html");

    if (!isFile(file)) {
      res.writeHead(404).end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(readFileSync(file));
  });

  // Walk up to the next port if one is taken. A previous run that was killed
  // mid-flight can leave its listener behind, and a QA script failing with
  // EADDRINUSE looks exactly like the thing under test failing.
  return new Promise((done, fail) => {
    let attempt = 0;
    const tryListen = (p) => {
      server.removeAllListeners("error");
      server.once("error", (err) => {
        if (err.code === "EADDRINUSE" && attempt < 20) {
          attempt++;
          tryListen(p + 1);
        } else {
          fail(err);
        }
      });
      // 127.0.0.1 explicitly: this container has no IPv6, and binding :: fails.
      server.listen(p, "127.0.0.1", () => {
        server.removeAllListeners("error");
        if (p !== port) console.log(`(port ${port} was busy, using ${p})`);
        done(server);
      });
    };
    tryListen(port);
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = Number(process.argv[2] ?? 4180);
  await startServer(port);
  console.log(`Serving dist/ on http://127.0.0.1:${port} with Vercel-style resolution`);
}
