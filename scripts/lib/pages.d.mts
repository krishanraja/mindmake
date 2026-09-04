/** Types for `pages.mjs`, so the test suite can read the same list the build does. */
export interface IndexedPage {
  path: string;
  title: string;
  description: string;
  headline?: string;
  claim?: string;
  still: string;
  ogType?: string;
  keywords?: string;
  jsonLd?: Record<string, unknown>;
}
export const site: string;
export const staticPages: IndexedPage[];
export const stillForCategory: Record<string, string>;
export function plateWords(page: { title: string; headline?: string; claim?: string }): { headline: string; claim: string };
