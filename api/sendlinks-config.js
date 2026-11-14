// The SendLinks recipient page (public/l/index.html) loads /l/config.js, rewritten here. The
// address of the SendLinks open function lives in the SENDLINKS_OPEN_BASE environment variable
// so it is never committed to this public repository.
export default function handler(req, res) {
  const base = process.env.SENDLINKS_OPEN_BASE || "";
  res.setHeader("Content-Type", "application/javascript; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=300");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  res.end(`window.SENDLINKS_OPEN_BASE = ${JSON.stringify(base)};\n`);
}
