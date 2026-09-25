import { createElement, useState, type ComponentType } from "react";
import { lazyRoute } from "@/lib/lazyRoute";

type PageModule = { default: ComponentType<object> };

/**
 * `lazyRoute` (React.lazy that survives a dropped chunk), with a way to fetch
 * the page before it is asked for.
 *
 * A route change used to be the moment the page's code was requested, so a
 * reader clicking to a page they had not visited met the Suspense fallback for
 * as long as the chunk took. The route transition now fetches the chunk first
 * and only then swaps the page, so the swap is never a loading screen.
 *
 * `React.lazy` suspends once on its first render even when the module has
 * already arrived, because it only learns that through a promise. So a page
 * whose module is loaded renders the component directly. The choice is made
 * once per mount: switching element type on a later render would remount the
 * whole page under the reader.
 *
 * Hydration is unchanged. On a cold load the module has not arrived, the lazy
 * path is taken, and React waits for the chunk against the prerendered markup
 * exactly as it did before.
 */
export function preloadable(load: () => Promise<PageModule>) {
  let loaded: ComponentType<object> | undefined;
  let pending: Promise<PageModule> | undefined;
  const preload = () => {
    pending ??= load().then(
      (module) => {
        loaded = module.default;
        return module;
      },
      (error) => {
        pending = undefined;
        throw error;
      },
    );
    return pending;
  };
  /* lazyRoute keeps its one retry and one reload for a dropped chunk; the
     cached promise is cleared on failure, so its retry fetches again. */
  const Lazy = lazyRoute(preload);
  function Page(props: object) {
    const [Component] = useState<ComponentType<object>>(() => loaded ?? Lazy);
    return createElement(Component, props);
  }
  return Object.assign(Page, { preload });
}
