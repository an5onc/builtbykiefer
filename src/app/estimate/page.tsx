"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Bath,
  Building,
  Calculator,
  Check,
  ChefHat,
  Hammer,
  Home,
  PaintBucket,
  Phone,
  Ruler,
} from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const projectTypes = [
  { id: "kitchen", name: "Kitchen Remodel", icon: ChefHat, baseRate: 250 },
  { id: "bathroom", name: "Bathroom Remodel", icon: Bath, baseRate: 200 },
  { id: "addition", name: "Home Addition", icon: Building, baseRate: 180 },
  { id: "deck", name: "Deck / Patio", icon: Home, baseRate: 120 },
  { id: "basement", name: "Basement Finish", icon: Hammer, baseRate: 150 },
  { id: "exterior", name: "Exterior Work", icon: PaintBucket, baseRate: 100 },
];

const qualityLevels = [
  { id: "standard", name: "Standard", multiplier: 1, description: "Durable materials, clean execution, professional finish." },
  { id: "premium", name: "Premium", multiplier: 1.35, description: "Higher-end selections, custom details, elevated finish package." },
  { id: "luxury", name: "Luxury", multiplier: 1.75, description: "Top-tier materials, designer finishes, and more complex detailing." },
];

const planningNotes = [
  "Use this as a first-pass range, not a final quote.",
  "Scope, selections, site conditions, permit needs, and schedule pressure can move the number.",
  "A Kiefer Built site review turns the planning range into a real proposal.",
];

export default function EstimatePage() {
  const [projectType, setProjectType] = useState("kitchen");
  const [squareFootage, setSquareFootage] = useState("");
  const [quality, setQuality] = useState("standard");
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = () => {
    const project = projectTypes.find((item) => item.id === projectType);
    const qualityLevel = qualityLevels.find((item) => item.id === quality);
    const sqft = Number.parseInt(squareFootage, 10);

    if (!project || !qualityLevel || !Number.isFinite(sqft) || sqft <= 0) {
      return { low: 0, high: 0 };
    }

    const baseEstimate = sqft * project.baseRate * qualityLevel.multiplier;

    return {
      low: Math.round(baseEstimate * 0.85),
      high: Math.round(baseEstimate * 1.15),
    };
  };

  const estimate = calculateEstimate();
  const selectedProject = projectTypes.find((item) => item.id === projectType) ?? projectTypes[0];
  const selectedQuality = qualityLevels.find((item) => item.id === quality) ?? qualityLevels[0];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setShowEstimate(true);
  };

  return (
    <div className="min-h-screen bg-white text-[#171717]">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-[#151515] px-6 pb-16 pt-32 text-white md:pb-20 md:pt-40">
          <Image
            src="/images/project-3/interior-great-room-wide.jpg"
            alt="Open living room and kitchen finished by Kiefer Built Contracting"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/88 via-black/66 to-black/28" />
          <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_0.42fr] lg:items-end">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-bold leading-[0.95] tracking-[-0.01em] md:text-6xl">
                Plan Your Project With A Contractor&apos;s Lens
              </h1>
              <p className="mt-6 text-lg leading-8 text-white/78">
                Use the Kiefer Built Project Cost Planner to get an early range for remodels, additions, exterior work, and finish upgrades before a full site review.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#planner"
                  className="inline-flex items-center gap-2 rounded-md bg-[#c9281c] px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                >
                  Start Planning
                  <ArrowRight className="size-4" />
                </a>
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-white hover:bg-white/10"
                >
                  Request A Quote
                </Link>
              </div>
            </div>

            <div className="rounded-md border border-white/15 bg-black/38 p-5 backdrop-blur">
              <Calculator className="size-7 text-[#ffb4a8]" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-white/50">
                Kiefer Built Planning Tool
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                The calculator packages standard planning math in a Kiefer Built workflow so clients can begin the budget conversation with realistic expectations.
              </p>
            </div>
          </div>
        </section>

        <section id="planner" className="bg-[#f4efe7] px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.42fr]">
            <form onSubmit={handleSubmit} className="space-y-5">
              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                  <Hammer className="size-5 text-[#c9281c]" />
                  <h2 className="text-xl font-bold">What type of project are you planning?</h2>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {projectTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = projectType === type.id;

                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setProjectType(type.id)}
                        className={`rounded-md border p-4 text-left transition ${
                          isSelected
                            ? "border-[#c9281c] bg-[#c9281c]/10 ring-1 ring-[#c9281c]/20"
                            : "border-black/10 bg-[#f9f6f0] hover:border-[#c9281c]/40"
                        }`}
                      >
                        <Icon className={`mb-3 size-7 ${isSelected ? "text-[#c9281c]" : "text-[#655c52]"}`} />
                        <p className="text-sm font-bold text-[#171717]">{type.name}</p>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <Ruler className="size-5 text-[#c9281c]" />
                  <label htmlFor="sqft" className="text-xl font-bold">
                    Approximate project size
                  </label>
                </div>
                <input
                  type="number"
                  id="sqft"
                  value={squareFootage}
                  onChange={(event) => setSquareFootage(event.target.value)}
                  placeholder="Enter square footage"
                  className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 text-base outline-none transition focus:border-[#c9281c]"
                  required
                  min="1"
                />
                <p className="mt-3 text-sm leading-6 text-[#655c52]">
                  If you are unsure, use a rough working number. A typical kitchen may be 150-250 sq ft, while a bathroom may be 40-100 sq ft.
                </p>
              </section>

              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">Select the finish level</h2>
                <div className="space-y-3">
                  {qualityLevels.map((level) => {
                    const isSelected = quality === level.id;

                    return (
                      <button
                        key={level.id}
                        type="button"
                        onClick={() => setQuality(level.id)}
                        className={`w-full rounded-md border p-4 text-left transition ${
                          isSelected
                            ? "border-[#c9281c] bg-[#c9281c]/10 ring-1 ring-[#c9281c]/20"
                            : "border-black/10 bg-[#f9f6f0] hover:border-[#c9281c]/40"
                        }`}
                      >
                        <span className="flex items-start justify-between gap-4">
                          <span>
                            <span className="block font-bold text-[#171717]">{level.name}</span>
                            <span className="mt-1 block text-sm leading-6 text-[#655c52]">{level.description}</span>
                          </span>
                          <span className="whitespace-nowrap text-sm font-bold text-[#c9281c]">
                            {level.multiplier === 1 ? "Base" : `+${Math.round((level.multiplier - 1) * 100)}%`}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>

              <button
                type="submit"
                className="w-full rounded-md bg-[#c9281c] px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#a91f16]"
              >
                Calculate Planning Range
              </button>
            </form>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
              <section className="rounded-md border border-black/10 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c9281c]">
                  Kiefer Built Estimate Check
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {showEstimate && estimate.low > 0 ? "Estimated Planning Range" : "Start With A Realistic Range"}
                </h2>

                {showEstimate && estimate.low > 0 ? (
                  <>
                    <div className="my-6 rounded-md bg-[#151515] p-5 text-white">
                      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/45">
                        {selectedProject.name} | {selectedQuality.name}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-3xl font-bold">
                        <span>${estimate.low.toLocaleString()}</span>
                        <span className="text-white/35">-</span>
                        <span className="text-[#ffb4a8]">${estimate.high.toLocaleString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/65">Early planning range</p>
                    </div>

                    <div className="space-y-3">
                      {planningNotes.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <Check className="mt-1 size-4 shrink-0 text-[#c9281c]" />
                          <p className="text-sm leading-6 text-[#655c52]">{item}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-6 text-[#655c52]">
                    Choose the project type, rough size, and finish level to generate a quick range for the first budget conversation.
                  </p>
                )}
              </section>

              <section className="rounded-md border border-black/10 bg-white p-5 text-center shadow-sm">
                <h3 className="text-lg font-bold text-[#171717]">Ready for a real quote?</h3>
                <p className="mt-2 text-sm leading-6 text-[#655c52]">
                  Bring Kiefer Built into the conversation before selections and assumptions get too far ahead of the budget.
                </p>
                <div className="mt-5 space-y-3">
                  <Link
                    href="/#contact"
                    className="inline-flex w-full items-center justify-center rounded-md bg-[#c9281c] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#a91f16]"
                  >
                    Request Free Quote
                  </Link>
                  <a
                    href="tel:9705155059"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-6 py-3 text-sm font-bold text-[#171717] transition hover:border-[#c9281c]/30 hover:text-[#c9281c]"
                  >
                    <Phone className="size-4" />
                    (970) 515-5059
                  </a>
                </div>
              </section>

              <section className="rounded-md border border-black/10 bg-[#f9f6f0] p-4">
                <p className="text-center text-xs leading-5 text-[#655c52]">
                  This tool provides rough cost ranges only. Actual costs vary by materials, site conditions, permits, labor availability, and specific project requirements.
                </p>
              </section>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
