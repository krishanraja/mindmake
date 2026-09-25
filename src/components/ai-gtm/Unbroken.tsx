/**
 * Keeps hyphenated words whole. "go-to-market" and "AI-native" are this page's
 * vocabulary, and a browser may break a line at any hyphen: the result quote
 * rendered "go-to-" at the end of one line and "market" at the start of the
 * next. The text itself is unchanged, so an exact-quote check still matches.
 */
export function Unbroken({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\S+-\S+)/).map((part, index) => (/\S-\S/.test(part) ? <span key={index} className="gtm-nowrap">{part}</span> : part))}
    </>
  );
}
