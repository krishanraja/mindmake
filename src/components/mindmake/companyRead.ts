/* The client-owned shape of the company read returned by enrich-company.
   Deliberately wider than the server type: the client defends against
   string-or-array synthesis and strips scale before display. */
export interface CompanyDossier {
  identity?: { name?: string; logoUrl?: string };
  understanding?: { descriptor?: string; tagline?: string; products?: string[] };
  currency?: { text?: string }[];
  synthesis?: string | string[];
  scale?: unknown;
}
