// Builds the AI-stack research file for one company from public signals only. Every row it
// writes carries the evidence it saw and where; the brain module re-checks the ratings offline.
// All network access goes through deps.get, so tests replay recorded answers.
import { robotsAllows } from "../parts-research/robots.ts";
import { stripHtml } from "../parts-research/transport.ts";
import {
  AGENT_INSTRUCTIONS, DNS_TOKENS, isAiTech, MAIL_HOSTS, match, matchAll, NAMED_TOOLS, OPTIONAL, SCRIPT_HOSTS,
  SUBDOMAIN_SIGNAL, SUBDOMAIN_VENDORS, type Tool, USES,
} from "./vendors.ts";

export type Got = { status: number; text: string; url: string };
export type Deps = { get: (url: string) => Promise<Got>; now: () => Date; builtwithKey?: string };
type Level = "Confirmed" | "Likely" | "Inferred";
type Method = "dns" | "certificates" | "site" | "jobs" | "people" | "case_studies" | "trust" | "engineering" | "technographic";
export type Row = Tool & { method: Method; confidence: Level; evidence: string; source_url: string; seen_at: string | null };

const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
const PAGES: [string, Method][] = [
  ["/", "site"], ["/careers", "jobs"], ["/jobs", "jobs"], ["/help", "site"], ["/support", "site"],
  ["/trust", "trust"], ["/security", "trust"], ["/subprocessors", "trust"], ["/legal/subprocessors", "trust"], ["/privacy", "trust"],
];
const day = (d: Date) => d.toISOString().slice(0, 10);
const clip = (s: string, n = 280) => (s.length > n ? `${s.slice(0, n - 3)}...` : s);
const sentencesOf = (text: string) => text.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => s.length > 12 && s.length < 600);

async function json(deps: Deps, url: string): Promise<unknown | null> {
  try { const r = await deps.get(url); return r.status === 200 ? JSON.parse(r.text) : null; } catch { return null; }
}
async function dnsRecords(deps: Deps, name: string, type: "TXT" | "MX") {
  const url = `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
  const body = await json(deps, url) as { Answer?: { data?: string }[] } | null;
  return { url, ok: body !== null, data: (body?.Answer ?? []).map((a) => String(a.data ?? "").replace(/"\s*"/g, "").replace(/^"|"$/g, "")) };
}

export async function buildAiStack(input: { company: string; domain: string; related?: string[] }, deps: Deps) {
  const company = String(input.company ?? "").trim();
  const domain = String(input.domain ?? "").trim().toLowerCase().replace(/^www\./, "");
  const related = (input.related ?? []).map((d) => String(d).trim().toLowerCase()).filter((d) => d && d !== domain).slice(0, 2);
  if (!company || company.length > 200) throw new Error("Give the company's name.");
  for (const d of [domain, ...related]) if (!DOMAIN.test(d)) throw new Error(`Not a valid domain: ${d}`);
  // Every request starts at once and is read in a fixed order, so the file is the same
  // however the answers arrive, and the whole build takes about as long as its slowest page.
  const asked = new Map<string, Promise<Got>>();
  const original = deps.get;
  const fetchOnce = (url: string) => {
    if (!asked.has(url)) { const p = Promise.resolve().then(() => original(url)); p.catch(() => {}); asked.set(url, p); }
    return asked.get(url)!;
  };
  deps = { ...deps, get: fetchOnce };
  const dnsUrl = (name: string, type: string) => `https://dns.google/resolve?name=${encodeURIComponent(name)}&type=${type}`;
  for (const d of [domain, ...related]) { fetchOnce(dnsUrl(d, "TXT")); fetchOnce(dnsUrl(d, "MX")); }
  fetchOnce(`https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`);
  const robotsAsked = fetchOnce(`https://${domain}/robots.txt`);
  if (deps.builtwithKey) fetchOnce(`https://api.builtwith.com/v21/api.json?KEY=${encodeURIComponent(deps.builtwithKey)}&LOOKUP=${encodeURIComponent(domain)}`);
  robotsAsked.then((r) => { const text = r.status === 200 ? r.text : ""; for (const [path] of PAGES) if (!text || robotsAllows(text, path)) fetchOnce(`https://${domain}${path}`); }, () => { for (const [path] of PAGES) fetchOnce(`https://${domain}${path}`); });
  const today = day(deps.now());
  const rows: Row[] = [], signals: { text: string; source_url: string }[] = [], injection: string[] = [], blocked: string[] = [];
  const add = (t: Tool, method: Method, confidence: Level, evidence: string, source_url: string, seen_at: string | null = today) =>
    rows.push({ ...t, method, confidence, evidence: clip(evidence), source_url, seen_at });
  const ran: Partial<Record<Method, string>> = {};

  // 1. DNS: verification tokens, mail and sender records, for each domain.
  let dnsAnswered = false;
  for (const d of [domain, ...related]) {
    const txt = await dnsRecords(deps, d, "TXT"), mx = await dnsRecords(deps, d, "MX");
    dnsAnswered ||= txt.ok || mx.ok;
    for (const record of txt.data) {
      const token = match(DNS_TOKENS, record);
      if (token) add(token, "dns", "Confirmed", `TXT record on ${d}: ${record.split("=")[0]}=...`, txt.url);
      if (/^v=spf1/i.test(record)) for (const inc of record.match(/include:(\S+)/gi) ?? []) {
        const sender = match(MAIL_HOSTS, inc.slice(8));
        if (sender) add(sender, "dns", "Confirmed", `SPF record on ${d} includes ${inc.slice(8)}`, txt.url);
      }
    }
    for (const record of mx.data) {
      const host = match(MAIL_HOSTS, record.split(/\s+/).at(-1) ?? "");
      if (host) add(host, "dns", "Confirmed", `MX record on ${d}: ${record}`, mx.url);
    }
  }
  ran.dns = dnsAnswered ? "DNS answered." : "DNS did not answer.";

  // 2. Certificate logs: subdomains named for AI work. Names only; whether each resolves is not checked.
  const ct = await json(deps, `https://crt.sh/?q=%25.${encodeURIComponent(domain)}&output=json`) as { name_value?: string }[] | null;
  if (ct) {
    const names = [...new Set(ct.flatMap((c) => String(c.name_value ?? "").split("\n")).map((n) => n.toLowerCase().replace(/^\*\./, "")).filter((n) => n.endsWith(`.${domain}`)))].sort().slice(0, 3000);
    const source = `https://crt.sh/?q=%25.${domain}`;
    for (const n of names) {
      const sub = n.slice(0, -(domain.length + 1));
      const vendor = match(SUBDOMAIN_VENDORS, sub);
      if (vendor) add(vendor, "certificates", "Inferred", `Certificate logs list ${n}.`, source);
      else if (SUBDOMAIN_SIGNAL.test(sub) && signals.length < 10) signals.push({ text: `Certificate logs list ${n}; the name suggests AI work but names no tool. Not checked whether it is public.`, source_url: source });
    }
    ran.certificates = `${names.length} subdomains read.`;
  } else blocked.push("Certificate logs did not answer.");

  // 3. The company's own pages: script hosts, named tools, and any text addressed to AI agents.
  const robots = await deps.get(`https://${domain}/robots.txt`).catch(() => null);
  const robotsText = robots && robots.status === 200 ? robots.text : "";
  const pagesRead: Partial<Record<Method, number>> = {};
  for (const [path, method] of PAGES) {
    if (robotsText && !robotsAllows(robotsText, path)) { blocked.push(`${domain}${path} is closed to automated reading by the site.`); continue; }
    const url = `https://${domain}${path}`;
    let page: Got | null = null;
    try { page = await deps.get(url); } catch { page = null; }
    if (!page || page.status !== 200 || !page.text) continue;
    pagesRead[method] = (pagesRead[method] ?? 0) + 1;
    for (const src of page.text.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
      let host = "";
      try { host = new URL(src[1], url).hostname; } catch { continue; }
      const tool = match(SCRIPT_HOSTS, host);
      if (tool) add(tool, "site", "Confirmed", `${path} loads a script from ${host}.`, url);
    }
    const text = stripHtml(page.text);
    if (AGENT_INSTRUCTIONS.test(text)) injection.push(`${url} contains text addressed to AI agents. It was noted and not followed.`);
    for (const sentence of sentencesOf(text)) {
      const level: Level = OPTIONAL.test(sentence) ? "Inferred" : USES.test(sentence) || method === "trust" ? "Confirmed" : "Likely";
      for (const tool of matchAll(NAMED_TOOLS, sentence)) add(tool, method, level, `"${clip(sentence, 240)}"`, url);
    }
  }
  if (pagesRead.site) ran.site = `${pagesRead.site} own pages read.`;
  if (pagesRead.jobs) ran.jobs = `${pagesRead.jobs} careers pages on the company's own site read; job boards not searched.`;
  if (pagesRead.trust) ran.trust = `${pagesRead.trust} trust, security or privacy pages read.`;
  if (!dnsAnswered && !pagesRead.site) throw new Error(`Nothing public could be read for ${domain}. Check the domain.`);

  // 4. Technology data: a lead, never proof. Only AI-related technologies are listed.
  if (deps.builtwithKey) {
    const bw = await json(deps, `https://api.builtwith.com/v21/api.json?KEY=${encodeURIComponent(deps.builtwithKey)}&LOOKUP=${encodeURIComponent(domain)}`) as
      { Results?: { Result?: { Paths?: { Technologies?: { Name?: string; Tag?: string; LastDetected?: number }[] }[] } }[]; Errors?: unknown[] } | null;
    const techs = (bw?.Results ?? []).flatMap((r) => r.Result?.Paths ?? []).flatMap((p) => p.Technologies ?? []);
    if (bw && techs.length) {
      const seen = new Set<string>();
      for (const t of techs) {
        const name = String(t.Name ?? "").trim();
        if (!name || seen.has(name.toLowerCase()) || !isAiTech(`${name} ${t.Tag ?? ""}`)) continue;
        seen.add(name.toLowerCase());
        const last = Number.isFinite(t.LastDetected) ? day(new Date(Number(t.LastDetected))) : null;
        add({ tool: name, vendor: name, category: /chat|support|Fin|Ada|Drift|Sierra|Decagon|Forethought|LivePerson|Kore|Yellow/i.test(name) ? "Customer-facing AI" : /personali|recommend/i.test(`${name} ${t.Tag ?? ""}`) ? "Marketing/creative AI" : "LLM/model provider" },
          "technographic", "Inferred", `Technology data lists ${name}${t.Tag ? ` (${t.Tag})` : ""}${last ? `, last seen ${last}` : ""}.`, `https://builtwith.com/${domain}`, last);
      }
      ran.technographic = `${techs.length} technologies in the data, ${seen.size} bearing on AI.`;
    } else blocked.push("Technology data returned nothing for this domain.");
  }

  const notes: Record<Method, string> = {
    dns: "DNS did not answer.", certificates: "Certificate logs did not answer.", site: "No own pages could be read.",
    jobs: "No careers page on the company's own site; job boards are not searched in this build.",
    people: "Not run: public posts by employees are not searched in this build.",
    case_studies: "Not run: vendor case studies are not searched in this build.",
    trust: "No trust, security or subprocessor page found.",
    engineering: "Not run: engineering blogs, code and investor material are not searched in this build.",
    technographic: deps.builtwithKey ? "Technology data returned nothing." : "Not run: no technology data key is set.",
  };
  const methods = (Object.keys(notes) as Method[]).map((id) => {
    const found = rows.filter((r) => r.method === id);
    const ai = found.filter((r) => r.category !== "Supporting stack").length;
    return ran[id] ? { id, ran: true, rating: Math.min(5, Math.max(1, 1 + ai * 2 + (found.length - ai > 0 ? 1 : 0))), note: `${ran[id]} ${found.length} findings, ${ai} about AI.` } : { id, ran: false, rating: null, note: notes[id] };
  });
  return {
    kind: "mindmake-ai-stack", version: 1,
    company: { name: company, domain, related_domains: related },
    built_at: deps.now().toISOString(),
    rows, methods, signals,
    gaps: ["How widely each tool is used inside the company.", "Which model sits behind a product feature.", "Tools used only inside the company, with no public trace."],
    injection_notes: injection, blocked: [...new Set(blocked)].slice(0, 50),
  };
}
