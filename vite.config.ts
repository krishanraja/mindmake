import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    allowedHosts: [".vercel.run"],
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  /* The build manifest, so the prerenderer can put each route's own stylesheet
     in that route's head.

     Every route but `/` is a lazy import and each of those pages imports its
     own large sheet, so per-chunk CSS leaves the brain, GTM, instrument and
     new-age styles in files the browser only learns about after the JS bundle
     has booted and asked for the route chunk. The prerenderer writes complete
     markup into `dist/<route>/index.html` and linked only the entry sheet, so
     those four routes were served as fully formed documents with none of their
     own styling: measured against production on 24 September,
     `/assets/index-*.css` carried no `.mm-stories-archive`, `.mm-locked-brain`
     or locked-GTM rule at all. That is the unstyled first paint.

     Collapsing the split would fix it in one line and put ~42KB gzipped of
     brain, GTM, instrument and new-age CSS that the homepage never uses on the
     homepage's render-blocking path, which is the path this repository spends
     its font preloads, inline ground colour and entrance budget defending. So
     the split stays and scripts/prerender.mjs reads this manifest instead,
     writing each route's own sheet into its own head. That script fails the
     build when a prerendered route has no entry here. */
  build: { manifest: true },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    // Vitest's default glob swept up the Deno tests that live beside the edge
    // functions. Those import from https: URLs, which the Node ESM loader
    // cannot resolve, so the whole suite reported a failure that had nothing
    // to do with the code under test. Deno tests are run by `deno test`.
    exclude: ["**/node_modules/**", "**/dist/**", "supabase/functions/**"],
    // The Supabase client throws at import time when these are unset, which
    // took down any test that rendered the app. These are obviously-fake
    // placeholders that only satisfy that constructor: no test talks to a real
    // project, and nothing here is a credential.
    env: {
      VITE_SUPABASE_URL: "http://localhost:54321",
      VITE_SUPABASE_PUBLISHABLE_KEY: "test-anon-key-not-a-real-credential",
    },
  },
}));
