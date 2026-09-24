import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { canonicalResearchDomain, companyIdentityCorroborated, hasExactDomainEvidence, isFirstPartyEvidence, literalCompanyRead } from '../../supabase/functions/_shared/enrich/provenance';
import { fetchBrandfetch } from '../../supabase/functions/_shared/enrich/brandfetch';
import { fetchPDL } from '../../supabase/functions/_shared/enrich/pdl';

afterEach(() => vi.unstubAllGlobals());
function provider(body: object) {
  vi.stubGlobal('Deno', { env: { get: () => 'synthetic-test-only' } });
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(body), { status: 200 })));
}
describe('company provenance is an acceptance condition, not a provider status', () => {
  it('canonicalizes only the documented owned business alias, never lookalikes', () => {
    expect(canonicalResearchDomain('themindmaker.ai')).toBe('mindmake.co');
    expect(canonicalResearchDomain('www.themindmaker.ai')).toBe('mindmake.co');
    expect(canonicalResearchDomain('mindmake.co')).toBe('mindmake.co');
    expect(canonicalResearchDomain('other.example')).toBe('other.example');
    expect(canonicalResearchDomain('themindmaker.ai.other.example')).toBe('themindmaker.ai.other.example');
    expect(canonicalResearchDomain('ctrl.themindmaker.ai')).toBe('ctrl.themindmaker.ai');
  });
  it('quotes company descriptions literally without inventing a capability', () => {
    const tagline = 'Mindmake helps leaders turn their judgement into useful AI systems.';
    expect(literalCompanyRead(undefined, tagline)).toBe(tagline);
    expect(literalCompanyRead('A literal verified description.', tagline)).toBe('A literal verified description.');
    expect(literalCompanyRead(undefined, '')).toBeNull();
  });
  it('does not route the factual read through generative synthesis', () => {
    const source = readFileSync(resolve(process.cwd(), 'supabase/functions/_shared/enrich/orchestrate.ts'), 'utf8');
    expect(source).not.toContain('synthesizeDescriptor');
    expect(source).toContain('literalCompanyRead(dossier.understanding.descriptor, dossier.understanding.tagline)');
  });
  it('never treats generated search summaries as company evidence', () => {
    const source = readFileSync(resolve(process.cwd(), 'supabase/functions/_shared/enrich/currency.ts'), 'utf8');
    const assembly = source.slice(source.indexOf('export async function fetchCurrency'));
    expect(assembly).not.toContain('fetchPerplexity(');
    expect(assembly).toContain('isFirstPartyEvidence(domain, item.sourceUrl)');
  });
  it('refuses a same-domain stale identity that conflicts with independent company data', () => {
    expect(companyIdentityCorroborated('example.com', 'Other Founder', 'Example Ltd', [])).toBe(false);
  });
  it('accepts an independently matched company without requiring a news story', () => {
    expect(companyIdentityCorroborated('example.com', 'Example', 'Example Ltd', [])).toBe(true);
  });
  it('lets a small company corroborate itself without PDL', () => {
    expect(companyIdentityCorroborated('example.com', 'Example', undefined,
      [{ text: 'Example announces a new product', sourceUrl: 'https://example.com/news' }])).toBe(true);
  });
  it('refuses a name absent from first-party evidence rather than inventing certainty', () => {
    expect(companyIdentityCorroborated('example.com', 'Other Founder', undefined,
      [{ text: 'Example announces a new product', sourceUrl: 'https://example.com/news' }])).toBe(false);
  });
  it('accepts the same website with normal URL and www forms', () => {
    expect(hasExactDomainEvidence('example.com', 'https://www.example.com/about')).toBe(true);
    expect(hasExactDomainEvidence('EXAMPLE.COM', 'example.com')).toBe(true);
  });
  it.each([undefined, '', 'other.example', 'example.com.other.example', 'https://example.com@other.example', 'https://example.com:8443'])('rejects absent or different website %s', value => {
    expect(hasExactDomainEvidence('example.com', value)).toBe(false);
  });
  it('does not make similarly named third-party stories company evidence', () => {
    expect(isFirstPartyEvidence('example.com', 'https://news.example/another-founder')).toBe(false);
    expect(isFirstPartyEvidence('example.com', 'https://example.com/news')).toBe(true);
  });
  it('discards a successful brand response for a different company domain', async () => {
    provider({ name: 'Wrong Company', domain: 'other.example', description: 'Unrelated product' });
    expect(await fetchBrandfetch('example.com')).toBeNull();
  });
  it('keeps a matching brand response', async () => {
    provider({ name: 'Example', domain: 'example.com', description: 'Known work' });
    expect((await fetchBrandfetch('example.com'))?.identity?.name).toBe('Example');
  });
  it('discards PDL successful-but-wrong company records', async () => {
    provider({ status: 200, website: 'other.example', summary: 'Unrelated product' });
    expect(await fetchPDL('example.com')).toBeNull();
  });
  it('keeps a matching PDL response', async () => {
    provider({ status: 200, website: 'www.example.com', summary: 'Known work' });
    expect((await fetchPDL('example.com'))?.understanding?.descriptor).toBe('Known work');
  });
  it('does not place internal scale in the visitor synthesis prompt', () => {
    const source = readFileSync(resolve(process.cwd(), 'supabase/functions/_shared/enrich/synthesize.ts'), 'utf8');
    expect(source).not.toContain('lines.push(`Rough size:');
    expect(source).not.toContain('a named tool, the scale');
  });
});
