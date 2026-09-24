import { createContext } from "react";

export interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  jsonLd?: object;
  noindex?: boolean;
}

// Build-only collector. The provider emits no markup and is never mounted by
// the browser. Each SSR render owns its callback; no cross-route global state.
export const SEOCollector = createContext<((metadata: SEOProps) => void) | null>(null);
