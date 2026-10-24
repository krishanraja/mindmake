import { Link } from "react-router-dom";
import { Unbroken } from "./Unbroken";

/**
 * One result, said once: the client's words in quotation marks, what moved,
 * and who said it, smaller, underneath (owner ruling, r43). It follows the
 * business the reader chose.
 *
 * Ruling (owner, 2026-10-24): "we don't need a separate section for this
 * testimonial down the bottom... it needs a link to the success stories" in
 * the place a reader thinks "okay, I get what it is, now show me the proof".
 * It is no longer a section of its own; it sits in the last section, after
 * the 30 days and what the reader keeps, right before the way in.
 */
export function ProofBand({ quote, result, who, story }: { quote: string; result: string; who: string; story: string }) {
  return (
    <figure className="gtm-proof-figure">
      <blockquote className="gtm-quote">&ldquo;<Unbroken text={quote} />&rdquo;</blockquote>
      <p className="gtm-proof-result">{result}</p>
      <figcaption className="gtm-proof-who">
        <cite><Unbroken text={who} /></cite>
        <Link className="mm-text-link" to={`/case-studies#story=${story}`}>Read the story <span aria-hidden="true">&rarr;</span></Link>
      </figcaption>
    </figure>
  );
}
