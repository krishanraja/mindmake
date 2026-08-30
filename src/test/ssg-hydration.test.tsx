import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import App from "@/App";
import { render as serverRender } from "@/entry-server";

/**
 * The two trees, held to each other.
 *
 * `scripts/prerender.mjs` renders every indexed page with `src/entry-server.tsx`
 * and the browser hydrates that markup with `src/App.tsx`. They are two files
 * describing one tree, and React compares them node by node: anything present
 * in one and not the other is not a cosmetic difference, it is a hydration
 * failure, and a hydration failure throws the entire server render away and
 * rebuilds the page from nothing on the client.
 *
 * Two of those shipped in one afternoon, and neither was visible in a console.
 * React's production build reports them as `Minified React error #418`, and the
 * page still ends up correct, so the only symptom is the site arriving and then
 * being replaced a second later — the exact defect the prerender exists to fix.
 *
 *  - `next-themes` inlined a `<script>` through `dangerouslySetInnerHTML`. The
 *    client bundle and the SSR bundle minified that script's source
 *    differently, so the text never matched. Nothing read the theme, so the
 *    provider is gone; `src/App.tsx` carries the reasoning.
 *  - `App` wrapped its routes in `<Suspense>` and the server entry did not.
 *    React writes a pair of comment nodes around a Suspense boundary and looks
 *    for them again at hydration, so the client's tree opened with a marker the
 *    server had never written.
 *
 * Comparing the rendered strings is the only check that catches both, because
 * neither is visible in the markup a person would think to look at.
 */

/* Whitespace is not normalised and neither is escaping. React compares the DOM
   it builds against the DOM the parser built, and the string is the closest
   honest proxy for that: a difference here is a difference there. */
const chunks = (html: string) => html.split(/(?=<)/);

function firstDifference(server: string, client: string) {
  const a = chunks(server), b = chunks(client);
  for (let i = 0; i < Math.max(a.length, b.length); i += 1) {
    if (a[i] !== b[i]) {
      return `#${i}\n  server: ${JSON.stringify((a[i] ?? "<end>").slice(0, 240))}\n  client: ${JSON.stringify((b[i] ?? "<end>").slice(0, 240))}`;
    }
  }
  return null;
}

describe("the prerendered markup and the app that hydrates it", () => {
  it("render the same homepage, byte for byte", () => {
    /* The homepage, because `Index` is the one page `App` loads eagerly. Every
       other route is `React.lazy`, and `renderToString` cannot wait for a lazy
       boundary: it renders the fallback. So this is the one route where both
       sides can be compared in full, and it covers every wrapper, which is
       where both real failures were. */
    window.history.pushState({}, "", "/");
    expect(firstDifference(serverRender("/"), renderToString(<App />))).toBeNull();
  });

  it("writes a finished Suspense boundary on a lazily loaded route", () => {
    /* The marker itself, on the routes where it matters most. React writes
       `<!--$-->` for a boundary whose content is complete and `<!--$!-->` for
       one that fell back, and hydration behaves completely differently on the
       two: the first is content to attach to, the second is a boundary to
       rebuild. The server has to write the first, which is only true because
       this entry imports its pages eagerly.

       The client cannot be compared here. `App` loads every route but the
       homepage through `React.lazy`, so rendering it to a string renders the
       fallback and its `<!--$!-->`. In a browser that same tree hydrates
       against real markup and waits for the chunk instead, which is behaviour
       no string comparison can see and `scripts/qa/first-second-check.mjs`
       measures directly. */
    for (const path of ["/privacy", "/ai-brain", "/blog"]) {
      const server = chunks(serverRender(path));
      expect(server[0], path).toBe("<!--$-->");
      expect(serverRender(path), path).toContain('class="mm-site"');
      expect(serverRender(path), path).not.toContain("Loading the page.");
    }
  });

  it("keeps the wrappers named in one place, so a third cannot drift", () => {
    /* Both entries are small enough to read, and this is the list they have to
       agree on. A wrapper added to App alone is the failure mode; a wrapper
       that renders nothing at all still writes nothing, which is why the check
       is on the source rather than only on the output. */
    const entry = serverRender("/");
    expect(entry.startsWith("<!--$-->")).toBe(true);
    expect(entry).toContain('class="mm-site"');
  });
});
