import { useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Your customer found a new way.",
    body: "Work they used to buy may now start with their own AI.",
  },
  {
    number: "02",
    title: "The old offer starts to break.",
    body: "The product, price and promise can still look right inside the company while feeling weaker outside it.",
  },
  {
    number: "03",
    title: "Now find where value moved.",
    body: "The answer may sit in you, the offer or both. Find it before the team builds around the wrong idea.",
  },
];

export function ScrollDecision() {
  const storyRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(reduceMotion ? 2 : 0);
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start 70%", "end 35%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduceMotion) return;
    const next = value < 0.34 ? 0 : value < 0.68 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section className="mm-section mm-shift" aria-labelledby="shift-title">
      <div className="mm-container">
        <header className="mm-split-heading">
          <div>
            <h2 id="shift-title">Your customer changed. Did your offer?</h2>
          </div>
          <p>AI can change what the customer needs, what they will pay and who should do the work. Moving one part alone can move the problem somewhere else.</p>
        </header>

        <div className="mm-shift-story" ref={storyRef}>
          <div className="mm-shift-steps">
            {steps.map((step, index) => (
              <article className={active === index ? "is-active" : ""} key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="mm-shift-sticky" aria-hidden="true">
            <div className={`mm-shift-stage is-state-${active}`}>
              <div className="mm-stage-meta"><span>Market pressure</span><span>Seen from the work</span></div>
              <motion.article className="mm-old-offer" animate={{ x: active === 0 ? 0 : -24, rotate: active === 0 ? -1 : -4, opacity: active === 2 ? 0.38 : 1 }}>
                <small>The old offer</small>
                <strong>We do the hard part for you.</strong>
                <p>Product, price and promise built around the old way of working.</p>
              </motion.article>
              <motion.article className="mm-customer-now" animate={{ x: active === 0 ? 28 : 0, y: active === 0 ? 22 : 0, opacity: active === 0 ? 0.72 : 1 }}>
                <small>The customer, now</small>
                <strong>I can start this myself.</strong>
              </motion.article>
              <div className="mm-value-orbit">
                {["Product", "Price", "Message", "Team"].map((item) => <span key={item}>{item}</span>)}
              </div>
              <motion.article className="mm-leader-call" animate={{ y: active === 2 ? 0 : 34, opacity: active === 2 ? 1 : 0 }}>
                <small>The decision</small>
                <strong>What are we still the best people to solve?</strong>
                <p>Find where the value moved before rebuilding around it.</p>
              </motion.article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
