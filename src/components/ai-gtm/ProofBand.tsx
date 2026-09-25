import { Link } from "react-router-dom";
import { Unbroken } from "./Unbroken";

/**
 * One result, said once: the client's words in quotation marks, what moved,
 * and who said it, smaller, underneath (owner ruling, r43). It follows the
 * business the reader chose.
 */
export function ProofBand({ quote, result, who, heading, story }: { quote: string; result: string; who: string; heading: string; story: string }) {
  return (
    <section className="gtm-proof mm-on-paper" data-gtm-chapter="proof" aria-labelledby="gtm-proof-title">
      <div className="gtm-proof-body mm-container">
        <h2 id="gtm-proof-title" className="mm-visually-hidden">{heading}</h2>
        <figure className="gtm-proof-figure">
          <blockquote className="gtm-quote">&ldquo;<Unbroken text={quote} />&rdquo;</blockquote>
          <p className="gtm-proof-result">{result}</p>
          <figcaption className="gtm-proof-who">
            <cite><Unbroken text={who} /></cite>
            <Link className="mm-text-link" to={`/case-studies#story=${story}`}>Read the story <span aria-hidden="true">&rarr;</span></Link>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
