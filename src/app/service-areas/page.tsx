"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const serviceAreas = [
  {
    city: "Windsor",
    county: "Weld County",
    distance: "Home Base",
    description: "Our headquarters and primary service area. We specialize in custom home construction and major renovations throughout Windsor.",
    highlights: ["New custom homes", "Complete renovations", "Commercial projects", "Site preparation"],
    coordinates: "40.4775°N, 104.9014°W",
  },
  {
    city: "Fort Collins",
    county: "Larimer County",
    distance: "20 miles from Windsor",
    description: "A thriving community where we build quality custom homes and handle renovation projects. Fort Collins offers mountain proximity with urban amenities.",
    highlights: ["Mountain view homes", "Historic renovations", "Luxury builds", "Energy-efficient construction"],
    coordinates: "40.5853°N, 105.0844°W",
  },
  {
    city: "Loveland",
    county: "Larimer County",
    distance: "25 miles from Windsor",
    description: "Home to beautiful residential properties and growing development. We've completed numerous custom builds and additions in Loveland's established neighborhoods.",
    highlights: ["Custom home builds", "Kitchen remodels", "Master suite additions", "Outdoor living spaces"],
    coordinates: "40.3964°N, 105.0719°W",
  },
  {
    city: "Greeley",
    county: "Weld County",
    distance: "30 miles from Windsor",
    description: "A vibrant community with strong housing demand. We construct new homes and complete quality renovation projects for Greeley homeowners.",
    highlights: ["Residential construction", "Home additions", "Remodeling projects", "Property improvements"],
    coordinates: "40.4266°N, 104.7023°W",
  },
  {
    city: "Johnstown",
    county: "Weld County",
    distance: "15 miles from Windsor",
    description: "A growing residential area with new development opportunities. Johnstown is ideal for custom home construction and renovation work.",
    highlights: ["New construction", "Subdivision builds", "Complete renovations", "Custom design-builds"],
    coordinates: "40.3639°N, 104.9747°W",
  },
  {
    city: "Wellington",
    county: "Larimer County",
    distance: "22 miles from Windsor",
    description: "A smaller, picturesque community perfect for custom builds. Wellington offers a quieter setting while remaining accessible to regional amenities.",
    highlights: ["Acreage homes", "Custom builds", "Rural construction", "Property development"],
    coordinates: "40.6603°N, 105.3267°W",
  },
];

export default function ServiceAreasPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef} className="bg-charcoal-900 min-h-screen">
      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[3px] bg-walnut-500 z-[100]"
        style={{ width: progressWidth }}
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <Header />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-charcoal-800 to-charcoal-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-4">
                Service Coverage Area
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-sand-100 mb-6 tracking-tight">
                We Build Across Northern Colorado
              </h1>
              <p className="text-xl text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
                From our base in Windsor, we serve six core communities throughout Weld and
                Larimer Counties. Wherever your project is located, we bring the same quality
                craftsmanship and attention to detail.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Areas Grid */}
        <section className="py-24 px-6 bg-charcoal-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={area.city}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group h-full"
                >
                  <div className="h-full flex flex-col bg-charcoal-800 border border-charcoal-700 rounded-xl p-8 hover:border-walnut-500/40 hover:bg-charcoal-800/80 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-6 pb-6 border-b border-charcoal-700">
                      <h2 className="text-3xl font-bold text-sand-100 mb-2">
                        {area.city}
                      </h2>
                      <p className="text-sm text-walnut-400 font-semibold uppercase tracking-wider">
                        {area.county}
                      </p>
                      <p className="text-sm text-charcoal-400 mt-2">{area.distance}</p>
                    </div>

                    {/* Description */}
                    <p className="text-charcoal-200 leading-relaxed mb-6 flex-grow">
                      {area.description}
                    </p>

                    {/* Highlights */}
                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-widest text-walnut-400 font-semibold mb-3">
                        Services & Specialties
                      </p>
                      <ul className="space-y-2">
                        {area.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="text-sm text-charcoal-300 flex items-start gap-2"
                          >
                            <span className="text-walnut-500 font-bold mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Coordinates */}
                    <div className="pt-6 border-t border-charcoal-700">
                      <p className="text-xs text-charcoal-500 font-mono">
                        {area.coordinates}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Coverage Map Section */}
        <section className="py-24 px-6 bg-charcoal-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-3">
                Service Territory
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Weld & Larimer Counties
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                Our primary service area spans Weld and Larimer Counties in Northern Colorado.
                We&apos;re willing to travel for the right project — contact us about your location.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative rounded-lg overflow-hidden border border-charcoal-700 shadow-2xl bg-charcoal-900"
            >
              <div className="relative aspect-[16/9] w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-charcoal-700 to-charcoal-900" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-6">
                    <p className="text-sand-200 text-lg font-semibold mb-2">
                      Northern Colorado Service Territory
                    </p>
                    <p className="text-charcoal-400 text-sm max-w-lg">
                      Kiefer Built Contracting operates throughout Weld and Larimer Counties,
                      with primary coverage in Windsor, Fort Collins, Loveland, Greeley,
                      Johnstown, and Wellington.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                      {serviceAreas.map((area) => (
                        <span
                          key={area.city}
                          className="inline-block px-4 py-2 bg-walnut-500/20 border border-walnut-400/40 rounded-full text-walnut-300 text-sm font-medium"
                        >
                          {area.city}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Distance & Drive Times Information */}
        <section className="py-24 px-6 bg-charcoal-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-3">
                Getting Around
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Distance Guide from Windsor
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                All distances measured from our Windsor headquarters. Short drive times mean
                responsive service and consistent on-site supervision for your project.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {serviceAreas.map((area, index) => (
                <motion.div
                  key={`distance-${area.city}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className="flex items-center gap-4 p-5 rounded-lg bg-charcoal-800 border border-charcoal-700 hover:border-walnut-500/30 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-walnut-500/20 border border-walnut-400/30">
                      <span className="text-walnut-400 font-bold text-lg">📍</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sand-100 font-semibold">{area.city}</p>
                    <p className="text-sm text-charcoal-400">{area.distance}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Construction Services Overview */}
        <section className="py-24 px-6 bg-charcoal-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-3">
                What We Build
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Construction Services Across All Areas
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                Whether you&apos;re in Windsor or Wellington, we provide the same comprehensive
                construction services with the highest quality standards.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "New Custom Homes",
                  description:
                    "Build your dream from the ground up. We handle everything from site selection and foundation work through final walk-through.",
                  items: [
                    "Lot site preparation",
                    "Foundation & excavation",
                    "Structural framing",
                    "Complete finish work",
                  ],
                },
                {
                  title: "Home Additions",
                  description:
                    "Expand your home with seamless new construction. Master suites, kitchens, living spaces — we integrate new work with existing structures.",
                  items: [
                    "Design integration",
                    "Structural engineering",
                    "Interior finishes",
                    "Utility extensions",
                  ],
                },
                {
                  title: "Complete Renovations",
                  description:
                    "Transform your existing home. Full gut renovations, system upgrades, and aesthetic improvements executed with precision.",
                  items: [
                    "Demolition & framing",
                    "System upgrades",
                    "Fixture installation",
                    "Finishing trades",
                  ],
                },
                {
                  title: "Commercial Construction",
                  description:
                    "We extend our expertise to commercial projects. Office buildouts, retail spaces, and specialized commercial work.",
                  items: [
                    "Commercial buildouts",
                    "Tenant improvements",
                    "System installation",
                    "Code compliance",
                  ],
                },
              ].map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-8 hover:border-walnut-500/30 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-sand-100 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-charcoal-300 leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="text-sm text-charcoal-300 flex items-start gap-2"
                      >
                        <span className="text-walnut-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 bg-charcoal-900">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold text-walnut-400 uppercase tracking-widest mb-4">
                Ready to Start Your Project?
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-6">
                Contact Kiefer Built Contracting
              </h2>
              <p className="text-xl text-charcoal-300 mb-8 max-w-2xl mx-auto leading-relaxed">
                Whether you&apos;re in one of our primary service areas or nearby, we&apos;d love to
                discuss your construction project. Call us or fill out our contact form to
                get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:(970)515-5059"
                  className="inline-flex items-center justify-center px-8 py-4 bg-walnut-500 hover:bg-walnut-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-walnut-500/20"
                >
                  Call (970) 515-5059
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-charcoal-800 border border-walnut-400/30 text-walnut-300 hover:text-walnut-400 font-semibold rounded-lg transition-colors hover:border-walnut-400/60"
                >
                  Get a Quote Online
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
