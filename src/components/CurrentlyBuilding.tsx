"use client";

import { motion } from "framer-motion";

export default function CurrentlyBuilding() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative overflow-hidden"
    >
      {/* Terminal-style container */}
      <div className="bg-charcoal-900 border border-charcoal-700 rounded-lg p-4 shadow-2xl">
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 mb-3 pb-3 border-b border-charcoal-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-charcoal-400 text-xs font-mono ml-2">currently_building.sh</span>
        </div>

        {/* Terminal content */}
        <div className="font-mono text-sm">
          <div className="text-charcoal-400 mb-2">
            <span className="text-green-400">$</span> ./status --current-project
          </div>

          <div className="pl-2 space-y-2">
            {/* Project name */}
            <div className="flex items-start gap-2">
              <span className="text-charcoal-500">&gt;</span>
              <div>
                <span className="text-charcoal-400">PROJECT:</span>
                <span className="text-sand-100 ml-2 font-semibold">CryptoOracle</span>
              </div>
            </div>

            {/* Tech stack */}
            <div className="flex items-start gap-2">
              <span className="text-charcoal-500">&gt;</span>
              <div>
                <span className="text-charcoal-400">STACK:</span>
                <span className="text-sand-200 ml-2">Python · Solana · Jupiter DEX · AsyncIO</span>
              </div>
            </div>

            {/* Status with pulsing indicator */}
            <div className="flex items-start gap-2">
              <span className="text-charcoal-500">&gt;</span>
              <div className="flex items-center">
                <span className="text-charcoal-400">STATUS:</span>
                <span className="text-sand-200 ml-2">Live — 24/7 autonomous</span>

                {/* Pulsing green dot */}
                <div className="relative ml-2">
                  <div className="absolute inset-0">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                  </div>
                  <div className="relative w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Blinking cursor */}
          <div className="mt-3 text-charcoal-400">
            <span className="text-green-400">$</span>
            <span className="ml-1 inline-block w-2 h-4 bg-sand-100 animate-pulse"></span>
          </div>
        </div>
      </div>

      {/* Subtle gradient glow effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent pointer-events-none rounded-lg"></div>
    </motion.div>
  );
}