export function extractLockedMain(documentSource: string) {
  const match = documentSource.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  if (!match) throw new Error("The locked surface has no main element.");
  return match[1];
}

export function extractLockedBlock(documentSource: string, className: string) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = documentSource.match(new RegExp(`<([a-z]+)\\b[^>]*class=["'][^"']*\\b${escaped}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/\\1>`, "i"));
  if (!match) throw new Error(`The locked surface has no ${className} block.`);
  return match[0];
}

export function removeLockedBlock(markup: string, className: string) {
  const escaped = className.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return markup.replace(new RegExp(`<([a-z]+)\\b[^>]*class=["'][^"']*\\b${escaped}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/\\1>`, "i"), "");
}

export function replaceLockedAsset(markup: string, sourcePath: string, builtUrl: string) {
  const occurrences = markup.split(sourcePath).length - 1;
  if (occurrences !== 1) throw new Error(`Locked asset path must occur once: ${sourcePath}`);
  return markup.replace(sourcePath, builtUrl);
}
