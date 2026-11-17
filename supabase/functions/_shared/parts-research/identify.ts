import { assembleIdentityDepth } from "../enrich/orchestrate.ts";
import { fetchBrandfetch, searchBrands } from "../enrich/brandfetch.ts";
import {
  canonicalResearchDomain,
  companyIdentityCorroborated,
  evidenceHostname,
  sameCompanyName,
} from "../enrich/provenance.ts";
import { FREE_EMAIL_DOMAINS } from "../enrich/types.ts";
import { registryDomain, searchRegistries } from "./registry.ts";
import {
  publicUrl,
  runtime,
  websiteIdentityText,
  within,
} from "./transport.ts";
import type { Candidate, Company, Dependencies } from "./types.ts";

export function independentChecks(
  candidate: Pick<Candidate, "checks">,
): boolean {
  const checks = candidate.checks.filter((c) => {
    try {
      publicUrl(c.url);
      return !!c.detail.trim();
    } catch {
      return false;
    }
  });
  return new Set(checks.map((c) => c.check)).size >= 2;
}
export function asCompany(candidate: Candidate): Company {
  return {
    name: candidate.name,
    domain: candidate.domain,
    verified: independentChecks(candidate),
    verifiedBy: candidate.checks,
    registry: candidate.registry,
  };
}
export async function identify(
  input: {
    company: string;
    domain?: string;
    workEmail?: string;
    mode?: "pre-payment" | "purchase";
  },
  deps: Dependencies,
): Promise<{ candidates: Candidate[]; verified: Candidate | null }> {
  const company = input.company.trim();
  if (company.length < 2 || company.length > 200) {
    return { candidates: [], verified: null };
  }
  const budget = input.mode === "purchase" ? 10000 : 2700;
  const end = performance.now() + budget;
  deps.identityProbes ??= [];
  const controller = new AbortController();
  const rt = runtime(deps, controller.signal);
  const candidates: Candidate[] = [];
  const explicit = input.domain ? evidenceHostname(input.domain) : null;
  const emailDomain =
    input.workEmail && /^[^\s@]+@[^\s@]+$/.test(input.workEmail)
      ? evidenceHostname(input.workEmail.split("@")[1])
      : null;
  const hint = explicit ??
    (emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain) ? emailDomain : null);
  const domain = hint ? canonicalResearchDomain(hint) : null;
  const websites = new Map<Candidate, string>();
  async function probe(candidate: Candidate) {
    try {
      const site = publicUrl(`https://${candidate.domain}/`).href;
      // Buyer-supplied email is independent of website availability, not mailbox ownership.
      if (
        emailDomain && !FREE_EMAIL_DOMAINS.has(emailDomain) &&
        emailDomain === candidate.domain
      ) {
        candidate.checks.push({
          check: "work-email-domain",
          detail:
            "The work email supplied by the buyer has this company domain. Mailbox ownership has not been checked.",
          url: site,
        });
      }
      await Promise.all([
        assembleIdentityDepth(candidate.domain, {
          brand: (d) => fetchBrandfetch(d, rt),
          rank: () => Promise.resolve(null),
          company: () => Promise.resolve(null),
        }).then((identity) => {
          if (controller.signal.aborted) return;
          const brandName = identity.brand?.identity?.name;
          if (brandName && sameCompanyName(candidate.name, brandName)) {
            candidate.name = brandName;
            candidate.logoUrl = identity.dossier.identity.logoUrl ??
              identity.dossier.identity.iconUrl;
            candidate.checks.push({
              check: "brand-registry",
              detail: "Brand record matches this name and exact domain.",
              url: `https://api.brandfetch.io/v2/brands/${candidate.domain}`,
            });
          }
        }).catch(() => {}),
        (async () => {
          for (
            let attempt = 1;
            attempt <= (input.mode === "purchase" ? 2 : 1);
            attempt++
          ) {
            if (controller.signal.aborted || performance.now() >= end) break;
            const started = performance.now();
            let outcome = "failed";
            try {
              const response = await runtime(
                deps,
                controller.signal,
                candidate.domain,
              ).request(
                site,
                {},
                Math.min(
                  input.mode === "purchase" ? 4500 : 1800,
                  end - performance.now(),
                ),
              );
              outcome = `http-${response.status}`;
              if (response.ok) {
                const website = websiteIdentityText(await response.text());
                if (!controller.signal.aborted) {
                  websites.set(candidate, website);
                  outcome = "name-not-found";
                  if (
                    companyIdentityCorroborated(
                      candidate.domain,
                      candidate.name,
                      undefined,
                      [{ text: website, sourceUrl: site }],
                    )
                  ) {
                    candidate.checks.push({
                      check: "website",
                      detail: "The company name appears on its own website.",
                      url: response.url || site,
                    });
                    outcome = "verified";
                  }
                }
              }
            } catch {
              outcome = controller.signal.aborted
                ? "budget-exhausted"
                : "fetch-failed";
            }
            deps.identityProbes!.push({
              url: site,
              attempt,
              ms: Math.round(performance.now() - started),
              outcome,
            });
            if (outcome === "verified") break;
          }
        })(),
      ]);
    } catch { /* Missing evidence never becomes a check. */ }
  }
  const task = (async () => {
    const probes: Promise<void>[] = [];
    if (domain && !FREE_EMAIL_DOMAINS.has(domain)) {
      const candidate: Candidate = {
        name: company,
        domain,
        checks: [],
        registry: null,
      };
      candidates.push(candidate);
      probes.push(probe(candidate));
    }
    const registries = within(searchRegistries(company, rt), budget, []);
    const brands = await within(searchBrands(company, 10, rt), 900, []);
    if (controller.signal.aborted) return;
    for (const brand of brands) {
      const d = canonicalResearchDomain(brand.domain);
      if (!candidates.some((c) => c.domain === d)) {
        const candidate: Candidate = {
          name: brand.name ?? company,
          domain: d,
          logoUrl: brand.iconUrl,
          checks: [],
          registry: null,
        };
        candidates.push(candidate);
        probes.push(probe(candidate));
      }
    }
    const [resolved] = await Promise.all([
      registries.then((hits) =>
        Promise.all(hits.map((hit) => registryDomain(hit, rt)))
      ),
      Promise.all(probes),
    ]);
    if (controller.signal.aborted) return;
    for (const candidate of candidates) {
      if (!candidate.checks.some((c) => c.check === "website")) continue;
      if (
        input.mode === "purchase" &&
        resolved.some((hit) =>
          hit.registry.authority === "Companies House" &&
          sameCompanyName(candidate.name, hit.name)
        )
      ) {
        const urls = ["/legal", "/terms", "/privacy", "/about"].map((path) =>
          `https://${candidate.domain}${path}`
        );
        urls.push(
          `https://plc.${candidate.domain}/`,
          `https://investors.${candidate.domain}/`,
        );
        await Promise.all(urls.map(async (url) => {
          if (controller.signal.aborted || performance.now() >= end) return;
          try {
            const response = await runtime(
              deps,
              controller.signal,
              candidate.domain,
            ).request(url, {}, Math.min(4000, end - performance.now()));
            if (response.ok && !controller.signal.aborted) {
              websites.set(
                candidate,
                (websites.get(candidate) ?? "") + " " +
                  websiteIdentityText(await response.text()),
              );
            }
          } catch {
            /* No registration number is inferred from a failed page. */
          }
        }));
      }
      const matches = resolved.filter((hit) =>
        sameCompanyName(candidate.name, hit.name) &&
        (hit.registry.authority === "SEC"
          ? hit.domain === candidate.domain
          : new RegExp(`\\b${hit.registry.id}\\b`, "i").test(
            websites.get(candidate) ?? "",
          ))
      );
      if (matches.length === 1) {
        const hit = matches[0];
        candidate.registry = hit.registry;
        candidate.checks.push({
          check: hit.registry.authority === "SEC"
            ? "sec-edgar"
            : "companies-house",
          detail:
            "The register identity is tied to this website by its domain or registration number.",
          url: hit.registry.url,
        });
      }
    }
    for (const hit of resolved) {
      if (
        !candidates.some((c) =>
          c.registry?.authority === hit.registry.authority &&
          c.registry.id === hit.registry.id
        )
      ) {
        candidates.push({
          name: hit.name,
          domain: hit.domain,
          registry: hit.registry,
          checks: [{
            check: hit.registry.authority === "SEC"
              ? "sec-edgar"
              : "companies-house",
            detail:
              "A company with this name is listed. Its connection to a website is not yet corroborated.",
            url: hit.registry.url,
          }],
        });
      }
    }
  })();
  await within(
    task,
    Math.min(budget, deps.identifyTimeoutMs ?? budget),
    undefined,
    () => controller.abort(),
  );
  controller.abort();
  const snapshot = structuredClone(candidates);
  // A supplied domain is an explicit disambiguator. A name-only search never picks a winner.
  const choices = domain
    ? snapshot.filter((c) => c.domain === domain)
    : snapshot;
  const chosen = choices.length === 1 && independentChecks(choices[0])
    ? choices[0]
    : null;
  return { candidates: snapshot, verified: chosen };
}
