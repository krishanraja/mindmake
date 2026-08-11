import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
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
