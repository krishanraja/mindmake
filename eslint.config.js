import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    /* The build-time render entry. react-refresh is a dev-server concern and
       this module never reaches the browser bundle at all: `npm run build:ssr`
       compiles it on its own, `scripts/prerender.mjs` imports it in Node, and
       nothing in src/ imports it. The rule is right about the shape and wrong
       about the file. */
    files: ["src/entry-server.tsx"],
    rules: { "react-refresh/only-export-components": "off" },
  },
);
