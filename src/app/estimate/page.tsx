'use client';

import { useState } from 'react';
import { Calculator, Home, Hammer, PaintBucket, Bath, ChefHat, Building, Phone } from 'lucide-react';
import Link from 'next/link';

const projectTypes = [
  { id: 'kitchen', name: 'Kitchen Remodel', icon: ChefHat, baseRate: 250 },
  { id: 'bathroom', name: 'Bathroom Remodel', icon: Bath, baseRate: 200 },
  { id: 'addition', name: 'Home Addition', icon: Building, baseRate: 180 },
  { id: 'deck', name: 'Deck/Patio', icon: Home, baseRate: 120 },
  { id: 'basement', name: 'Basement Finish', icon: Hammer, baseRate: 150 },
  { id: 'exterior', name: 'Exterior Work', icon: PaintBucket, baseRate: 100 },
];

const qualityLevels = [
  { id: 'standard', name: 'Standard', multiplier: 1.0, description: 'Quality materials, professional finish' },
  { id: 'premium', name: 'Premium', multiplier: 1.35, description: 'High-end materials, custom features' },
  { id: 'luxury', name: 'Luxury', multiplier: 1.75, description: 'Top-tier materials, designer finishes' },
];

export default function EstimatePage() {
  const [projectType, setProjectType] = useState('kitchen');
  const [squareFootage, setSquareFootage] = useState('');
  const [quality, setQuality] = useState('standard');
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = () => {
    const project = projectTypes.find(p => p.id === projectType);
    const qualityLevel = qualityLevels.find(q => q.id === quality);

    if (!project || !qualityLevel || !squareFootage) return { low: 0, high: 0 };

    const sqft = parseInt(squareFootage);
    const baseEstimate = sqft * project.baseRate * qualityLevel.multiplier;

    return {
      low: Math.round(baseEstimate * 0.85),
      high: Math.round(baseEstimate * 1.15),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowEstimate(true);
  };

  const estimate = calculateEstimate();

  return (
    <main className="min-h-screen bg-[#f4efe7] text-[#171717]">
      <section className="border-b border-black/10 bg-[#151515] px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold uppercase tracking-[0.16em] text-[#ffb4a8]">
              <Calculator className="size-4" />
              <span>Kiefer Built Planning Tool</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Kiefer Built Project Cost Planner</h1>
            <p className="mt-5 text-lg leading-8 text-white/70">
              A Kiefer Built estimate check for early construction planning. Use it to understand a rough project range before a detailed site review.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.42fr]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <label className="mb-4 block text-lg font-bold text-[#171717]">
                What type of project are you planning?
              </label>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`rounded-md border p-4 text-left transition ${
                        projectType === type.id
                          ? 'border-[#b92516] bg-[#b92516]/10 ring-1 ring-[#b92516]/20'
                          : 'border-black/10 bg-[#f9f6f0] hover:border-[#b92516]/40'
                      }`}
                    >
                      <Icon className={`mb-3 size-7 ${
                        projectType === type.id ? 'text-[#b92516]' : 'text-[#655c52]'
                      }`} />
                      <p className="text-sm font-semibold text-[#171717]">{type.name}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <label htmlFor="sqft" className="mb-4 block text-lg font-bold text-[#171717]">
                Project size (square feet)
              </label>
              <input
                type="number"
                id="sqft"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                placeholder="Enter square footage"
                className="w-full rounded-md border border-black/10 bg-[#f9f6f0] px-4 py-3 outline-none transition focus:border-[#b92516]"
                required
                min="1"
              />
              <p className="mt-2 text-sm text-[#655c52]">
                Not sure? A typical kitchen is 150-250 sq ft, bathroom is 40-100 sq ft
              </p>
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <label className="mb-4 block text-lg font-bold text-[#171717]">
                Select finish quality
              </label>
              <div className="space-y-3">
                {qualityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setQuality(level.id)}
                    className={`w-full rounded-md border p-4 text-left transition ${
                      quality === level.id
                        ? 'border-[#b92516] bg-[#b92516]/10 ring-1 ring-[#b92516]/20'
                        : 'border-black/10 bg-[#f9f6f0] hover:border-[#b92516]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-[#171717]">{level.name}</p>
                        <p className="text-sm text-[#655c52]">{level.description}</p>
                      </div>
                      <div className="whitespace-nowrap text-sm font-semibold text-[#655c52]">
                        {level.multiplier === 1 ? 'Base' : `+${Math.round((level.multiplier - 1) * 100)}%`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <button
              type="submit"
              className="w-full rounded-md bg-[#b92516] px-4 py-4 text-sm font-bold uppercase tracking-[0.16em] text-white transition hover:bg-[#951e13]"
            >
              Calculate Estimate
            </button>
          </form>

          <aside className="space-y-5">
            <section className="rounded-lg border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b92516]">
                Kiefer Built Estimate Check
              </p>
              <h2 className="mt-2 text-2xl font-bold">
                {showEstimate && estimate.low > 0 ? 'Estimated Project Range' : 'Plan With A Contractor Lens'}
              </h2>

              {showEstimate && estimate.low > 0 ? (
                <>
                  <div className="my-6 rounded-md bg-[#151515] p-5 text-white">
                    <div className="flex flex-wrap items-center gap-3 text-3xl font-bold">
                      <span>${estimate.low.toLocaleString()}</span>
                      <span className="text-white/40">-</span>
                      <span className="text-[#ffb4a8]">${estimate.high.toLocaleString()}</span>
                    </div>
                    <p className="mt-2 text-sm text-white/65">Early planning range</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      'Based on typical Northern Colorado project ranges.',
                      'Actual cost depends on scope, selections, site conditions, and permitting.',
                      'A Kiefer Built site review turns this range into a detailed quote.',
                    ].map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <span className="mt-1 text-[#b92516]">✓</span>
                        <p className="text-sm leading-6 text-[#655c52]">{item}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-6 text-[#655c52]">
                  Select a project type, approximate size, and finish level to get a quick Kiefer Built planning range.
                </p>
              )}
            </section>

            <section className="rounded-lg border border-black/10 bg-white p-5 text-center shadow-sm">
              <h3 className="text-lg font-bold text-[#171717]">Ready for a real quote?</h3>
              <p className="mt-2 text-sm leading-6 text-[#655c52]">
                Get a detailed consultation from Kiefer Built Contracting.
              </p>
              <div className="mt-5 space-y-3">
                <Link
                  href="/#contact"
                  className="inline-flex w-full items-center justify-center rounded-md bg-[#b92516] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[#951e13]"
                >
                  Request Free Quote
                </Link>
                <a
                  href="tel:9705155059"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-6 py-3 text-sm font-bold text-[#171717] transition hover:border-[#b92516]/30 hover:text-[#b92516]"
                >
                  <Phone className="size-4" />
                  (970) 515-5059
                </a>
              </div>
            </section>

            <section className="rounded-lg border border-black/10 bg-[#f9f6f0] p-4">
              <p className="text-center text-xs leading-5 text-[#655c52]">
                * This estimator provides rough cost ranges only. Actual project costs will vary based on materials selected,
                site conditions, permits, and specific project requirements. Contact Kiefer Built Contracting for an accurate quote.
              </p>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}
