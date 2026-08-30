import { Arrive } from "@/components/mindmake/Arrive";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { Instrument } from "@/components/mindmake/Instrument";
import { PUBLICATION_URL } from "@/lib/publicLinks";
import { track } from "@/lib/analytics";
import filmSixPoster from "@/assets/films/film-06-poster.jpg";
import filmSixPosterWebp from "@/assets/films/film-06-poster.webp";
import filmSixLoop from "@/assets/films/film-06-loop.mp4";
import filmSixLoopWebm from "@/assets/films/film-06-loop.webm";

/**
 * The publication, as its own offer.
 *
 * It used to be eleven pixels of muted mono at the foot of the close block,
 * reading "Not ready? Take the weekly read instead", a consolation prize for
 * people who did not take the real one. It is not a consolation prize. It is a
 * separate thing a visitor might want on its own terms, so it says what the two
 * channels are and gives them one obvious way in.
 *
 * There is no email field here on purpose. The publication lives on Substack,
 * and a field on this page could only hand the address to Substack's own form
 * afterwards, which means either typing it twice or a promise this site cannot
 * keep. One button that goes to the place that actually takes the subscription
 * is the honest version.
 */
const GROUND = { raise: " mm-on-raise", paper: " mm-on-paper", ink: "" } as const;

export function SubscribeBand({ ground = "raise" }: { ground?: keyof typeof GROUND } = {}) {
  return (
    <section className={`mm-block mm-subscribe${GROUND[ground]}`} aria-labelledby="subscribe-title">
      <div className="mm-container">
        {/* The offer arrives, then the two channels arrive after it. This
            band is two paragraphs and a button beside a list, so it was one of
            the viewports the sweep read as finished before it was looked at. */}
        <div className="mm-subscribe-grid">
          <Arrive>
            <h2 id="subscribe-title">
              {/* A departures board: what is new, and when. */}
              <Instrument kind="flap" className="mm-head-mark" />
              The reading, if you want it separately.
            </h2>
            <p className="mm-lede">
              We publish two things, and nothing else. No drip, and nothing from this page unless
              you ask for it here.
            </p>
            {/* The split-flap, which is what a publication is: what is new, and
                when. The heading already carries the flap mark for exactly that
                reason, and this is the same object at a size a person can watch.
                It is also the only thing in this band that moves — measured on a
                phone it read a whole-screen change of 0.018 against a floor of
                0.15, which is a still photograph of a website. */}
            <FilmPlate
              className="mm-subscribe-film"
              poster={filmSixPoster}
              posterWebp={filmSixPosterWebp}
              src={filmSixLoop}
              srcWebm={filmSixLoopWebm}
              label="Extreme macro on a split-flap display in a brass frame, mid-cascade, settling lower on its column."
            />
            <a
              className="mm-button mm-button-lg"
              href={PUBLICATION_URL}
              target="_blank"
              rel="noreferrer"
              onClick={() => track("substack_click", { source: "subscribe_band" })}
            >
              Read it free <span aria-hidden="true">→</span>
            </a>
          </Arrive>

          <ul className="mm-channels">
            <Arrive stagger from={1}>
            <li>
              {/* It traces where the money goes, so it gets the pen recorder. */}
              <Instrument kind="recorder" />
              <h3>The Money of AI</h3>
              <p>
                How the digital world gets paid for, as attention, content and access change.
                Who pays, where the value moves, and what breaks when the shift lands.
              </p>
            </li>
            <li>
              {/* It is an index of people building, so it gets the card drawer. */}
              <Instrument kind="drawer" />
              <h3>Built with AI</h3>
              <p>
                The people using AI to go from running something to building something, and the
                real reason underneath the reason they give you.
              </p>
            </li>
            </Arrive>
          </ul>
        </div>
      </div>
    </section>
  );
}
