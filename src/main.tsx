import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

/**
 * Hydrate what the build already rendered, or mount from nothing.
 *
 * `scripts/prerender.mjs` renders every indexed route to HTML at build time, so
 * on those pages the markup is already correct and React only has to attach to
 * it. Everything else, which is the retired routes, the redirects and the dev
 * server, arrives with an empty root and mounts as it always did.
 *
 * The branch is on the DOM rather than on a flag, because that is the condition
 * that actually matters: hydrating an empty root throws, and creating a root
 * over server markup silently discards it, which is the flash this whole change
 * exists to remove.
 */
if (root.firstChild) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
