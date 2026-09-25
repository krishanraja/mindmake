import { Unbroken } from "./Unbroken";

/**
 * The workaround and what it costs, on a screen of its own between the four
 * places and the offer, so the reader meets the easy answer and its price
 * before they meet ours.
 */
export function Workaround({ easy, cost }: { easy: string; cost: string }) {
  return (
    <section className="gtm-workaround" data-gtm-chapter="workaround" aria-labelledby="gtm-workaround-title">
      <div className="gtm-workaround-body mm-container">
        <h2 id="gtm-workaround-title"><Unbroken text={easy} /></h2>
        <p><Unbroken text={cost} /></p>
      </div>
    </section>
  );
}
