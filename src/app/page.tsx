"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Partnership from "@/components/Partnership";
import About from "@/components/About";
import ProjectGallery from "@/components/ProjectGallery";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import CurrentlyBuilding from "@/components/CurrentlyBuilding";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={containerRef}>
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
        <Hero />

        {/* Currently Building Section */}
        <section className="relative bg-sand-50 py-16 px-4 border-y border-sand-200">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 mb-3">
                Currently Building
              </h2>
              <p className="text-charcoal-600 text-lg">
                Active development project in progress
              </p>
            </div>
            <CurrentlyBuilding />
          </div>
        </section>

        <Partnership />
        <About />
        <ProjectGallery />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
