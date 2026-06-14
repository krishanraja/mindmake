/**
 * Detect whether a logo's artwork is light or dark by sampling its pixels.
 *
 * Loads the image cross-origin, draws it to a small canvas, and averages the
 * luminance of the opaque pixels (transparent padding is ignored). Brandfetch's
 * CDN serves `access-control-allow-origin: *`, so an anonymous-CORS image does
 * not taint the canvas and the pixels are readable.
 *
 * Returns:
 *   'dark'  -> dark / coloured mark  (render on a light plate)
 *   'light' -> light / white mark    (render directly on a dark surface)
 *   null    -> undecidable (load error, tainted canvas, no opaque pixels, timeout)
 *
 * Best-effort and side-effect free; never throws.
 */
export async function detectLogoBg(
  url: string,
  timeoutMs = 2500,
): Promise<"light" | "dark" | null> {
  if (typeof document === "undefined" || !url) return null;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (v: "light" | "dark" | null) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve(v);
    };
    const timer = window.setTimeout(() => finish(null), timeoutMs);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";

    img.onload = () => {
      try {
        const w = 48;
        const h = 48;
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return finish(null);
        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        let lumSum = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] < 24) continue; // skip transparent padding
          const l =
            (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) /
            255;
          lumSum += l;
          count += 1;
        }
        if (count === 0) return finish(null);

        // Light artwork (white/pale marks) average high; dark/coloured marks low.
        finish(lumSum / count >= 0.6 ? "light" : "dark");
      } catch {
        finish(null); // tainted canvas or any read failure
      }
    };
    img.onerror = () => finish(null);
    img.src = url;
  });
}
