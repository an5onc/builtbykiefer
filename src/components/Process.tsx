"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Consultation",
    description:
      "We meet in person to discuss your vision, needs, and budget. Every great home starts with a conversation.",
  },
  {
    num: "02",
    title: "Design & Plan",
    description:
      "Our team creates detailed plans and 3D renderings so you can see your dream home before ground is broken.",
  },
  {
    num: "03",
    title: "Build",
    description:
      "Track every detail through our BuilderTrend portal. Full transparency from foundation to finishing touches.",
  },
  {
    num: "04",
    title: "Final Walkthrough",
    description:
      "We walk every inch together before handing you the keys. Your satisfaction is our standard.",
  },
];

export default function Process() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="process" className="py-24 md:py-32 bg-sand-100" ref={ref} aria-labelledby="process-heading">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <p className="text-walnut-500 text-sm tracking-[0.3em] uppercase mb-3">
            How We Work
          </p>
          <h2 id="process-heading" className="text-3xl md:text-4xl font-bold text-charcoal-800">
            Our Process
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <span className="text-6xl font-bold text-walnut-200/50 block mb-2">
                {step.num}
              </span>
              <h3 className="text-xl font-semibold text-charcoal-700 mb-3">
                {step.title}
              </h3>
              <p className="text-charcoal-400 text-sm leading-relaxed">
                {step.description}
              </p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-8 h-px bg-walnut-300" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
