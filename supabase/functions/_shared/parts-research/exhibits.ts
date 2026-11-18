/** Follow only explicit EX-99.1 links in a registry filing index, within its directory. */
export function exhibitUrls(html: string, index: string): string[] {
  const base = new URL(".", index), result: string[] = [];
  for (const row of html.match(/<tr\b[^>]*>[\s\S]*?<\/tr>/gi) ?? []) {
    if (!/EX-?99\.\d+\b|EX-?991\b/i.test(row)) {
      continue;
    }
    for (const match of row.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
      const url = new URL(match[1], base);
      if (
        url.origin === base.origin && url.pathname.startsWith(base.pathname) &&
        /\.(?:htm|html)$/i.test(url.pathname)
      ) result.push(url.href);
    }
  }
  return [...new Set(result)];
}
