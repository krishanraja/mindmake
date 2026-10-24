import "@/styles/mindmake-pairing.css";

/**
 * What the reader keeps, as one object rather than loose lines of text.
 *
 * Ruling (Krish, 2026-10-24): the strip of three items "does not look visually
 * stable or professional". It is a receipt now: the title is a header row, not
 * a fourth column; the items sit in equal cells split by hairlines, each with
 * the same check mark; on a phone they stack as line items. The same component
 * ends both offer pages, so the receipt looks the same wherever it appears.
 */
export function Receipt({ title, tag, items }: { title: string; tag: string; items: readonly string[] }) {
  return (
    <div className="mm-receipt">
      <div className="mm-receipt-head">
        <h3 className="mm-receipt-title">{title}</h3>
        <p className="mm-receipt-tag">{tag}</p>
      </div>
      <ul className="mm-receipt-items">
        {items.map((item) => (
          <li key={item}>
            <svg className="mm-receipt-check" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <circle cx="12" cy="12" r="10.5" />
              <polyline points="7.5 12.5 10.5 15.5 16.5 9" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
