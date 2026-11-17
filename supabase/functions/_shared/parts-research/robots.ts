import { fetchResource } from "./fetch.ts";
import type { Dependencies } from "./types.ts";

/** RFC-style longest matching allow/disallow rule, scoped to our agent or wildcard. */
export function robotsAllows(text: string, path: string): boolean {
  const groups: {
    agents: string[];
    rules: { allow: boolean; path: string }[];
  }[] = [];
  let group = {
    agents: [] as string[],
    rules: [] as { allow: boolean; path: string }[],
  };
  for (const line of text.split(/\r?\n/)) {
    const match = line.replace(/#.*$/, "").match(
      /^\s*([\w-]+)\s*:\s*(.*?)\s*$/,
    );
    if (!match) continue;
    const [, field, value] = match;
    if (field.toLowerCase() === "user-agent") {
      if (group.rules.length) {
        groups.push(group);
        group = { agents: [], rules: [] };
      }
      group.agents.push(value.toLowerCase());
    } else if (
      /^(?:allow|disallow)$/i.test(field) && group.agents.length && value
    ) {
      group.rules.push({ allow: field.toLowerCase() === "allow", path: value });
    }
  }
  groups.push(group);
  const specific = groups.filter((g) =>
    g.agents.some((a) => a !== "*" && "mindmakeresearch".includes(a))
  );
  const rules =
    (specific.length ? specific : groups.filter((g) => g.agents.includes("*")))
      .flatMap((g) => g.rules);
  const matches = rules.filter((r) => {
    const pattern = r.path.replace(/[.+?^{}()|[\]\\]/g, "\\$&").replaceAll(
      "*",
      ".*",
    );
    return new RegExp(`^${pattern}`).test(path);
  }).sort((a, b) =>
    b.path.replace(/[*$]/g, "").length - a.path.replace(/[*$]/g, "").length ||
    Number(b.allow) - Number(a.allow)
  );
  return matches[0]?.allow ?? true;
}
export function robotsGuard(deps: Dependencies) {
  const cache = new Map<string, Promise<string | null>>();
  return async (value: string): Promise<boolean> => {
    const url = new URL(value);
    if (!cache.has(url.origin)) {
      cache.set(
        url.origin,
        (async () => {
          for (let attempt = 0; attempt < 2; attempt++) {
            try {
              const result = await fetchResource(
                deps,
                `${url.origin}/robots.txt`,
                { cap: 100_000, coverageRedirects: true, timeoutMs: 4000 },
              );
              const absent = result.status >= 400 && result.status < 500;
              result.outcome.reason = absent
                ? "robots-not-published"
                : result.status >= 500
                ? "robots-unavailable"
                : "robots-policy";
              return result.status >= 500
                ? null
                : absent
                ? ""
                : new TextDecoder().decode(result.bytes);
            } catch {
              const outcome = deps.fetchOutcomes?.at(-1);
              if (outcome?.reason === "timeout" && attempt === 0) continue;
              return "";
            }
          }
          return "";
        })(),
      );
    }
    const text = await cache.get(url.origin)!;
    return text !== null && robotsAllows(text, url.pathname + url.search);
  };
}
