import { recoverPurchaseIdentity } from "../../supabase/functions/_shared/parts-research/recovery.ts";
import {
  asCompany,
  buildPack,
  type Chip,
  CHIPS,
  type Dependencies,
  identify,
} from "../../supabase/functions/_shared/parts-research/index.ts";
import { argumentsFor, unusedPath } from "./args.ts";

const dnsCache = new Map<string, Promise<string[]>>();

/** All provider calls, credentials, clock and DNS enter through this boundary. */
export function liveDependencies(): Dependencies {
  return {
    fetch: globalThis.fetch,
    env: (name) => Deno.env.get(name),
    now: () => new Date(),
    // A slow "no IPv6 address" answer took 10 to 15 s for Companies House and
    // monzo.com (verified live, 18 Nov 2026), so every request timed out. Each
    // lookup now has its own limit, and IPv6 only gets a short grace period
    // once IPv4 has answered. Results are cached per host for the run.
    resolveHost: (host) => {
      const hit = dnsCache.get(host);
      if (hit) return hit;
      const lookup = (type: "A" | "AAAA", ms: number) => {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        return Deno.resolveDns(host, type, { signal: controller.signal })
          .catch(() => [] as string[])
          .finally(() => clearTimeout(timer));
      };
      const answer = (async () => {
        const v6 = lookup("AAAA", 3000);
        const v4 = await lookup("A", 3000);
        const grace = new Promise<string[]>((resolve) =>
          setTimeout(() => resolve([]), v4.length ? 250 : 3000)
        );
        return [...v4, ...await Promise.race([v6, grace])];
      })();
      dnsCache.set(host, answer);
      return answer;
    },
  };
}
export async function run(
  args: string[],
  deps = liveDependencies(),
): Promise<number> {
  const values = argumentsFor(args, [
    "company",
    "domain",
    "email",
    "role",
    "chip",
    "out",
  ], ["company", "role", "chip", "out"]);
  if (
    !Object.hasOwn(CHIPS, values.chip) || values.company.length > 200 ||
    values.role.length > 160
  ) throw new Error("Invalid buyer or use case");
  await unusedPath(values.out);
  await unusedPath(`${values.out}.evidence.json`);
  deps = {
    ...deps,
    deadline: performance.now() + 240000,
    fetchOutcomes: [],
    identityProbes: [],
    extractions: [],
  };
  const identity = await identify({
    mode: "purchase",
    company: values.company,
    domain: values.domain,
    workEmail: values.email,
  }, deps);
  if (!identity.verified && values.domain) {
    const candidates = identity.candidates.filter((c) =>
      c.domain === values.domain.replace(/^www\./, "")
    );
    if (
      candidates.length === 1 &&
      await recoverPurchaseIdentity(candidates[0], deps)
    ) identity.verified = candidates[0];
  }
  if (!identity.verified && identity.candidates.length > 1) {
    console.log(
      JSON.stringify({ candidates: identity.candidates, verified: null }),
    );
    return 2;
  }
  const company = identity.verified ? asCompany(identity.verified) : {
    name: identity.candidates[0]?.name ?? values.company,
    domain: identity.candidates[0]?.domain ?? "",
    verified: false,
    verifiedBy: identity.candidates[0]?.checks ?? [],
    registry: identity.candidates[0]?.registry ?? null,
  };
  const result = await buildPack(company, {
    company: values.company,
    role: values.role,
    useCase: values.chip as Chip,
    useCaseLabel: CHIPS[values.chip as Chip],
  }, deps);
  // This local verification receipt is required by the offline bundle validator. It is not bundled.
  await Deno.writeTextFile(
    `${values.out}.evidence.json`,
    JSON.stringify(result.evidence),
    { createNew: true, mode: 0o600 },
  );
  await Deno.writeTextFile(values.out, JSON.stringify(result.pack), {
    createNew: true,
    mode: 0o600,
  });
  console.log(JSON.stringify({ ...result.counts, out: values.out }));
  return 0;
}
if (import.meta.main) {
  try {
    Deno.exitCode = await run(Deno.args);
  } catch {
    console.error(
      "Research run failed. Check the arguments, use case and writable output path. No pack is ready to use.",
    );
    Deno.exitCode = 1;
  }
}
