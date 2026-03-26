"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Header from "@/components/Header";
import ScrollFrameHero from "@/components/ScrollFrameHero";
import Partnership from "@/components/Partnership";
import About from "@/components/About";
import ProjectGallery from "@/components/ProjectGallery";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";

import Process from "@/components/Process";
import CostEstimator from "@/components/CostEstimator";
import Testimonials from "@/components/Testimonials";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import ServiceArea from "@/components/ServiceArea";
import ProjectTimeline from "@/components/ProjectTimeline";
import WeatherImpactTracker from "@/components/WeatherImpactTracker";
import MaterialsShowcase from "@/components/MaterialsShowcase";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";


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
        <ScrollFrameHero />

        <Partnership />
        <About />
        <ProjectGallery />
        <BeforeAfterShowcase />
        <ProjectTimeline />
        <WeatherImpactTracker
          projectName="Windsor Custom Home"
          month="March"
          year={2026}
          weatherData={[
            { date: '2026-03-01', condition: 'clear', workable: true },
            { date: '2026-03-02', condition: 'clear', workable: true },
            { date: '2026-03-03', condition: 'rain', workable: false, impact: 'Heavy rain delayed foundation work' },
            { date: '2026-03-04', condition: 'clear', workable: true },
            { date: '2026-03-05', condition: 'clear', workable: true },
            { date: '2026-03-06', condition: 'wind', workable: true, impact: 'Light wind, work continued with caution' },
            { date: '2026-03-07', condition: 'clear', workable: true },
            { date: '2026-03-08', condition: 'clear', workable: true },
            { date: '2026-03-09', condition: 'clear', workable: true },
            { date: '2026-03-10', condition: 'rain', workable: false, impact: 'Morning showers, afternoon work only' },
            { date: '2026-03-11', condition: 'clear', workable: true },
            { date: '2026-03-12', condition: 'clear', workable: true },
            { date: '2026-03-13', condition: 'clear', workable: true },
            { date: '2026-03-14', condition: 'snow', workable: false, impact: 'Unexpected spring snow, site closed' },
            { date: '2026-03-15', condition: 'clear', workable: true },
            { date: '2026-03-16', condition: 'clear', workable: true },
            { date: '2026-03-17', condition: 'clear', workable: true },
            { date: '2026-03-18', condition: 'wind', workable: true },
            { date: '2026-03-19', condition: 'clear', workable: true },
            { date: '2026-03-20', condition: 'clear', workable: true },
            { date: '2026-03-21', condition: 'rain', workable: false, impact: 'All-day rain, interior work only' },
            { date: '2026-03-22', condition: 'clear', workable: true },
            { date: '2026-03-23', condition: 'clear', workable: true },
            { date: '2026-03-24', condition: 'clear', workable: true },
            { date: '2026-03-25', condition: 'clear', workable: true },
          ]}
        />

        <Process />
        <MaterialsShowcase />
        <CostEstimator />
        <TestimonialsCarousel />
        <Testimonials />
        <ServiceArea />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
