"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function Partnership() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-charcoal-900 to-charcoal-800 overflow-hidden">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] bg-repeat" />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Divider line */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-walnut-500/50" />
            <span className="text-walnut-400 text-xs tracking-[0.3em] uppercase">
              Built in Partnership
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-walnut-500/50" />
          </div>

          {/* Partnership logos */}
          <div className="flex items-center justify-center gap-8 md:gap-12">
            {/* Kiefer K logo */}
            <a
              href="https://kbuiltco.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 relative transition-transform group-hover:scale-105">
                <Image
                  src="/images/kiefer-k-logo.png"
                  alt="Kiefer Built Contracting"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="mt-2 text-sand-300/70 text-xs tracking-wider group-hover:text-walnut-400 transition-colors">
                KIEFER BUILT
              </span>
            </a>

            {/* Plus sign */}
            <div className="text-walnut-500/60 text-2xl font-light">+</div>

            {/* EPS Buildings logo */}
            <a
              href="https://epsbuildings.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center group"
            >
              <div className="w-24 h-16 md:w-32 md:h-20 relative transition-transform group-hover:scale-105">
                <Image
                  src="/images/eps-buildings-logo.webp"
                  alt="EPS Buildings"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="mt-2 text-sand-300/70 text-xs tracking-wider group-hover:text-walnut-400 transition-colors">
                EPS BUILDINGS
              </span>
            </a>
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 text-charcoal-300 text-sm max-w-lg mx-auto leading-relaxed"
          >
            Two industry leaders combining expertise to deliver exceptional custom homes 
            with innovative building solutions.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
