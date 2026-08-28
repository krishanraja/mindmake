/**
 * The Deno surface the edge functions actually use, declared for the app's
 * TypeScript check.
 *
 * These functions run on Deno, but their pure logic is unit-tested from the
 * app's Vitest suite, which means `tsc -p tsconfig.app.json` follows the
 * imports and reaches files written against globals it has never heard of.
 * Rather than exclude them from the check, which would leave the backend
 * untyped, this declares the four things they use and nothing else.
 *
 * It is a type declaration, not a polyfill. Nothing here exists at runtime in
 * the browser, and no browser code may reference `Deno`.
 */

declare namespace Deno {
  const env: {
    get(key: string): string | undefined;
    set(key: string, value: string): void;
    toObject(): Record<string, string>;
  };

  function serve(handler: (request: Request) => Response | Promise<Response>): void;

  function test(name: string, fn: () => void | Promise<void>): void;
  function test(definition: { name: string; fn: () => void | Promise<void> }): void;
}
