import { exhibitUrls } from "./exhibits.ts";
import { asCompany, independentChecks } from "./identify.ts";
import { filingNamesDomain, secFilingCandidate } from "./registry.ts";
import { fetchResource } from "./fetch.ts";
import { robotsGuard } from "./robots.ts";
import { runtime } from "./transport.ts";
import {
  type Candidate,
  type Dependencies,
  MAX_FILING_BYTES,
} from "./types.ts";

/** Purchase-only recovery. A supplied domain and independent work email are required. */
export async function recoverPurchaseIdentity(
  candidate: Candidate,
  deps: Dependencies,
): Promise<boolean> {
  if (
    !candidate.domain ||
    !candidate.checks.some((c) => c.check === "work-email-domain")
  ) return false;
  try {
    const company = asCompany(candidate);
    const binding = await secFilingCandidate(company, runtime(deps), true);
    if (!binding) return false;
    let scan = await fetchResource(deps, binding.url, {
      cap: MAX_FILING_BYTES,
      scan: (text) => filingNamesDomain(text, candidate.domain),
      mayFetch: robotsGuard(deps),
    });
    if (!scan.matched && binding.releaseIndex) {
      const index = await fetchResource(deps, binding.releaseIndex, {
        mayFetch: robotsGuard(deps),
      });
      for (
        const url of exhibitUrls(
          new TextDecoder().decode(index.bytes),
          binding.releaseIndex,
        )
      ) {
        scan = await fetchResource(deps, url, {
          cap: MAX_FILING_BYTES,
          scan: (text) => filingNamesDomain(text, candidate.domain),
          mayFetch: robotsGuard(deps),
        });
        if (scan.matched) break;
      }
    }
    if (!scan.matched) return false;
    candidate.registry = binding.hit.registry;
    candidate.checks.push({
      check: "sec-edgar",
      url: scan.url,
      detail:
        "The uniquely matching issuer's latest annual or quarterly filing names this company domain.",
    });
    return independentChecks(candidate);
  } catch {
    return false;
  }
}
