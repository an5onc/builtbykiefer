"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { businessContact } from "@/lib/public-site/business";
import { serviceAreaCities, serviceAreaCityList } from "@/lib/public-site/service-areas";

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
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <p className="text-xs font-semibold text-walnut-300 uppercase tracking-widest mb-4">
                Service Coverage Area
              </p>
              <h1 className="text-5xl md:text-6xl font-black text-sand-100 mb-6 tracking-tight">
                We Build Across Northern Colorado
              </h1>
              <p className="text-xl text-charcoal-300 max-w-2xl mx-auto leading-relaxed">
                Based in Windsor, we welcome project inquiries from {serviceAreaCities.length} named
                communities across Northern Colorado. Tell us about your location and plans
                so we can confirm whether your project is a fit.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Service Areas Grid */}
        <section className="py-24 px-6 bg-charcoal-900">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {serviceAreaCities.map((city, index) => (
                <motion.div
                  key={city}
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="group h-full"
                >
                  <div className="h-full flex flex-col bg-charcoal-800 border border-charcoal-700 rounded-xl p-8 hover:border-walnut-500/40 hover:bg-charcoal-800/80 transition-all duration-300">
                    {/* Header */}
                    <div className="mb-6 pb-6 border-b border-charcoal-700">
                      <h2 className="text-3xl font-bold text-sand-100 mb-2">
                        {city}
                      </h2>
                      <p className="text-sm text-walnut-300 font-semibold uppercase tracking-wider">
                        Northern Colorado
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-charcoal-200 leading-relaxed mb-6 flex-grow">
                      Planning a custom home, renovation, addition, or commercial project in {city}?
                      Share your project address and scope so we can discuss the next steps.
                    </p>

                    <div className="pt-6 border-t border-charcoal-700">
                      <Link href="/#contact" className="text-sm font-semibold text-walnut-300 hover:text-sand-100">
                        Discuss a {city} project
                      </Link>
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
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-300 uppercase tracking-widest mb-3">
                Service Territory
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Weld & Larimer Counties
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                Our regional focus includes Weld and Larimer Counties in Northern Colorado.
                Contact us about your location and scope to confirm project availability.
              </p>
            </motion.div>

            <motion.div
              initial={false}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.8 }}
              className="relative rounded-lg overflow-hidden border border-charcoal-700 shadow-2xl bg-charcoal-900"
            >
              <div className="relative flex min-h-72 items-center justify-center px-6 py-10 md:min-h-96">
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-charcoal-700 to-charcoal-900" />
                <div className="relative text-center">
                  <p className="text-sand-200 text-lg font-semibold mb-2">
                    Northern Colorado Service Territory
                  </p>
                  <p className="text-charcoal-200 text-sm max-w-lg">
                    We welcome inquiries from {serviceAreaCityList}. Each project&apos;s location
                    and scope are reviewed individually.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    {serviceAreaCities.map((city) => (
                      <span
                        key={city}
                        className="inline-block px-4 py-2 bg-walnut-500/20 border border-walnut-400/40 rounded-full text-walnut-300 text-sm font-medium"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Project location and scope */}
        <section className="py-24 px-6 bg-charcoal-900">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-300 uppercase tracking-widest mb-3">
                Your Project Location
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Let&apos;s Confirm the Right Fit
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                Share the town or project address, the work you have in mind, and your timeline.
                We can discuss location, site access, and scope before agreeing on next steps.
              </p>
            </motion.div>

            <div className="text-center">
              <Link href="/#contact" className="inline-flex rounded-lg bg-walnut-500 px-7 py-3 font-semibold text-charcoal-950 hover:bg-walnut-400">
                Tell Us About Your Project
              </Link>
            </div>
          </div>
        </section>

        {/* Construction Services Overview */}
        <section className="py-24 px-6 bg-charcoal-800">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-xs font-semibold text-walnut-300 uppercase tracking-widest mb-3">
                What We Build
              </p>
              <h2 className="text-4xl md:text-5xl font-black text-sand-100 mb-4">
                Discuss Your Construction Plans
              </h2>
              <p className="text-charcoal-300 max-w-xl mx-auto leading-relaxed">
                Explore our construction services, then contact us to discuss which services
                fit your project and location.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "New Custom Homes",
                  href: "/services/home-building",
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
                  href: "/projects/renovations-additions",
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
                  href: "/projects/renovations-additions",
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
                  href: "/projects/commercial",
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
                  initial={false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px 200px 0px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-charcoal-900 border border-charcoal-700 rounded-xl p-8 hover:border-walnut-500/30 transition-colors"
                >
                  <h3 className="text-2xl font-bold text-sand-100 mb-3">
                    <Link href={service.href} className="underline decoration-walnut-500/50 underline-offset-4 hover:text-walnut-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-walnut-300">
                      {service.title}
                    </Link>
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
              initial={false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px 0px 200px 0px" }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-xs font-semibold text-walnut-300 uppercase tracking-widest mb-4">
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
                  href={businessContact.telHref}
                  className="inline-flex items-center justify-center px-8 py-4 bg-walnut-500 hover:bg-walnut-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-walnut-500/20"
                >
                  Call {businessContact.phone}
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center justify-center px-8 py-4 bg-charcoal-800 border border-walnut-400/30 text-walnut-300 hover:text-walnut-300 font-semibold rounded-lg transition-colors hover:border-walnut-400/60"
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
