"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import BeforeAfterSlider from "./BeforeAfterSlider";

/**
 * Example component showing how to integrate BeforeAfterSlider into project pages
 *
 * This demonstrates best practices for showcasing construction transformations:
 * - Kitchen remodels
 * - Home renovations
 * - Exterior makeovers
 * - Bathroom upgrades
 *
 * Simply import this component or copy the pattern into your project pages.
 */
export default function BeforeAfterExample() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-28" style={{ background: "var(--color-cream-50)" }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <p
            className="text-sm tracking-[0.3em] uppercase mb-3 font-medium"
            style={{ color: "var(--color-walnut-500)" }}
          >
            Transformation
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--color-charcoal-800)" }}
          >
            See The Difference
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: "var(--color-charcoal-500)" }}
          >
            Every project tells a transformation story. Drag the slider to compare before and after — from outdated to outstanding.
          </p>
        </motion.div>

        {/* Before/After Slider - Kitchen Example */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <BeforeAfterSlider
            beforeImage="/images/project-3/kitchen-overview.jpg"
            afterImage="/images/project-3/kitchen-island-front.jpg"
            beforeAlt="Kitchen before renovation - outdated cabinets and countertops"
            afterAlt="Kitchen after renovation - modern two-tone cabinetry with quartz countertops"
          />

          {/* Caption */}
          <div className="mt-4 text-center">
            <h3
              className="text-lg font-semibold mb-1"
              style={{ color: "var(--color-charcoal-800)" }}
            >
              Kitchen Transformation
            </h3>
            <p
              className="text-sm"
              style={{ color: "var(--color-charcoal-500)" }}
            >
              From dated to designer — complete kitchen remodel with custom cabinetry, quartz surfaces, and modern appliances.
            </p>
          </div>
        </motion.div>

        {/* Second Example - Smaller Grid Layout */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Exterior Example */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <BeforeAfterSlider
              beforeImage="/images/project-3/exterior-front-daytime.jpg"
              afterImage="/images/project-3/exterior-twilight-front.jpg"
              beforeAlt="Exterior before siding and landscaping upgrades"
              afterAlt="Exterior after complete renovation with modern materials"
              className="mb-4"
            />
            <div className="text-center">
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "var(--color-charcoal-800)" }}
              >
                Exterior Facelift
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-charcoal-500)" }}
              >
                New siding, stone accents, and architectural details.
              </p>
            </div>
          </motion.div>

          {/* Bathroom Example */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BeforeAfterSlider
              beforeImage="/images/project-3/interior-primary-bath.jpg"
              afterImage="/images/project-3/interior-primary-bath-vanity.jpg"
              beforeAlt="Primary bathroom before remodel"
              afterAlt="Primary bathroom after luxury renovation"
              className="mb-4"
            />
            <div className="text-center">
              <h3
                className="text-base font-semibold mb-1"
                style={{ color: "var(--color-charcoal-800)" }}
              >
                Bathroom Upgrade
              </h3>
              <p
                className="text-sm"
                style={{ color: "var(--color-charcoal-500)" }}
              >
                Spa-inspired design with premium fixtures and finishes.
              </p>
            </div>
          </motion.div>

        </div>

        {/* Usage Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 p-6 rounded-xl border shadow-sm"
          style={{
            background: "white",
            borderColor: "var(--color-sand-200)"
          }}
        >
          <h3
            className="text-lg font-bold mb-3 text-center"
            style={{ color: "var(--color-charcoal-800)" }}
          >
            How to Use in Your Project Pages
          </h3>
          <div className="space-y-3 max-w-2xl mx-auto text-sm" style={{ color: "var(--color-charcoal-600)" }}>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-walnut-500)" }}>1</span>
              <p>Import the component: <code className="px-2 py-0.5 rounded bg-sand-100 font-mono text-xs">import BeforeAfterSlider from &quot;@/components/BeforeAfterSlider&quot;;</code></p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-walnut-500)" }}>2</span>
              <p>Add your before and after images to the <code className="px-2 py-0.5 rounded bg-sand-100 font-mono text-xs">/public/images/</code> directory.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-walnut-500)" }}>3</span>
              <p>Use the component with proper image paths and descriptive alt text for accessibility.</p>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--color-walnut-500)" }}>4</span>
              <p>The slider automatically handles mouse and touch events for mobile devices.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
