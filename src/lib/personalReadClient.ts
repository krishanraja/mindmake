/**
 * The one way the browser talks to `mindmake-personal-read`.
 *
 * Two components post to this function now, the read journey and the handoff
 * offer, and each had its own copy of the URL, the two headers and the shape of
 * the call. Resolved once here, the way `useBoardData` does it: reading the env
 * inline leaves the header object typed `string | undefined`, which is also the
 * honest shape of the bug, because with the variable missing the request would
 * have gone out carrying the word "undefined" as its key.
 */
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/mindmake-personal-read`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

export const postPersonalRead = (body: unknown): Promise<Response> => fetch(FUNCTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  },
  body: JSON.stringify(body),
});
