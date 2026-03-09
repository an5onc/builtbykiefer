"use client";

import { motion } from "framer-motion";

const areas = [
  { city: "Windsor", note: "Home base" },
  { city: "Greeley", note: "Weld County" },
  { city: "Fort Collins", note: "Larimer County" },
  { city: "Loveland", note: "Larimer County" },
  { city: "Timnath", note: "New builds" },
  { city: "Severance", note: "Rural acreage" },
  { city: "Johnstown", note: "Weld County" },
  { city: "Evans", note: "Weld County" },
  { city: "Milliken", note: "Weld County" },
  { city: "Eaton", note: "Weld County" },
  { city: "Wellington", note: "Larimer County" },
  { city: "Berthoud", note: "Larimer County" },
];

export default function ServiceArea() {
  return (
    <section
      id="service-area"
      aria-labelledby="service-area-title"
      className="py-24 px-6 bg-stone-950"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-3">
            Where We Build
          </p>
          <h2
            id="service-area-title"
            className="text-4xl md:text-5xl font-black text-stone-100 mb-4"
          >
            Serving Northern Colorado
          </h2>
          <p className="text-stone-400 max-w-xl mx-auto leading-relaxed">
            Kiefer Built Contracting operates throughout Weld and Larimer
            Counties. Custom homes, additions, and remodels — wherever you
            are in Northern Colorado, we can build it.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {areas.map((area, i) => (
            <motion.div
              key={area.city}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex flex-col items-center justify-center gap-1 py-5 px-4 rounded-xl bg-stone-900/60 border border-stone-800/60 hover:border-walnut-500/40 hover:bg-stone-900 transition-all"
            >
              <span className="text-sm font-bold text-stone-100">{area.city}</span>
              <span className="text-xs text-stone-500">{area.note}</span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center"
        >
          <p className="text-stone-500 text-sm">
            Don&apos;t see your city?{" "}
            <a
              href="#contact"
              className="text-walnut-400 hover:text-walnut-300 underline underline-offset-2 transition-colors"
            >
              Contact us
            </a>{" "}
            — we travel for the right project.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
