import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";

/**
 * The two doors. One method, sold two ways.
 *
 * The CTRL link carries UTM tags so the self-serve handoff is measurable on
 * CTRL's side, which already has attribution wired up. Keep the tags intact.
 */
const CTRL_URL =
  "https://ctrl.themindmaker.ai/?utm_source=mindmaker&utm_medium=two_doors&utm_campaign=self_serve";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openDiagnosisRoom = () => {
  window.dispatchEvent(
    new CustomEvent("openDiagnosisRoom", {
      detail: { source_page: "/", mode: "full" },
    }),
  );
};

const TwoDoors = () => {
  return (
    <section className="section-padding border-t border-border/40">
      <div className="container-width max-w-5xl">
        <motion.div
          className="mb-10"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
        >
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
            Two ways in
          </div>
          <h2 className="text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Build the brain that holds your business.
          </h2>
          <p className="text-muted-foreground max-w-2xl leading-relaxed">
            One method: your context, held properly, and anchored to the decisions you are
            actually making this week. You can run it yourself, or we run it together.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Door 1: do it yourself */}
          <motion.div
            className="glass-card editorial-card p-7 md:p-8 border border-border/50 flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={0}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Do it yourself
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">CTRL</h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 flex-grow">
              An AI-native chief of staff for the calls only you can make. It holds your
              live context, tests decisions against real evidence, and gives your own AI
              agents the version of you that is current.
            </p>
            <a
              href={CTRL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-deep dark:text-mint hover:opacity-80 transition-opacity"
            >
              Open CTRL
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Door 2: do it with me */}
          <motion.div
            className="glass-card editorial-card p-7 md:p-8 border border-mint/30 flex flex-col"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
            custom={1}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground mb-3">
              Do it with me
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-3">
              The Teardown, then The Handover
            </h3>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 flex-grow">
              Ten days on one real decision, taken apart properly. If it goes well, six
              weeks rebuilding how the business decides and sells, ending on a date you
              know at the start.
            </p>
            <Button
              onClick={openDiagnosisRoom}
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold self-start"
            >
              Bring me one real decision
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TwoDoors;
