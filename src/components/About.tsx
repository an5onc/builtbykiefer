"use client";

import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const stats = [
  { value: "25+", label: "Years Experience" },
  { value: "200+", label: "Homes Built" },
  { value: "100%", label: "Client Focused" },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 md:py-32 bg-sand-50" ref={ref} aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="relative overflow-hidden rounded-sm aspect-[3/4] md:aspect-auto md:h-[500px]">
              <Image
                src="/images/project-1/exterior-3.jpg"
                alt="Custom walnut front entry door with stone pillar columns — built by Kiefer Built Contracting in Windsor, Colorado"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </div>
            {/* Accent element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-walnut-400 rounded-sm -z-10" aria-hidden="true" />
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <p className="text-walnut-500 text-sm tracking-[0.3em] uppercase mb-3">
              About Us
            </p>
            <h2 id="about-heading" className="text-3xl md:text-4xl font-bold text-charcoal-800 mb-6 leading-tight">
              Building Dreams,
              <br />
              Shaping Futures
            </h2>
            <p className="text-charcoal-400 leading-relaxed mb-4">
              For over 25 years, Kiefer Built Contracting has been designing and
              building exceptional custom homes in Northern Colorado. Based in Windsor,
              we create sanctuaries — spaces that reflect who you are and how you live.
            </p>
            <p className="text-charcoal-400 leading-relaxed mb-8">
              Every home we build is a testament to quality craftsmanship and
              personalized design. From custom new builds to renovations and
              commercial projects across Fort Collins, Loveland, Greeley, and Timnath,
              we bring your vision to life with precision and care.
            </p>

            {/* Stats */}
            <div className="flex gap-10" role="list" aria-label="Company statistics">
              {stats.map((stat) => (
                <div key={stat.label} role="listitem">
                  <p className="text-3xl font-bold text-walnut-600">
                    {stat.value}
                  </p>
                  <p className="text-xs tracking-wider uppercase text-charcoal-300 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
