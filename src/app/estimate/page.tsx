'use client';

import { useState } from 'react';
import { Calculator, Home, Hammer, PaintBucket, Bath, ChefHat, Building, DollarSign, Phone } from 'lucide-react';
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
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium mb-6">
              <Calculator className="w-4 h-4" />
              <span>Free Estimate Tool</span>
            </div>

            <h1 className="text-5xl font-bold mb-6">Project Cost Estimator</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get an instant estimate for your construction or remodeling project.
              This tool provides a rough cost range to help you plan your budget.
            </p>
          </div>
        </div>
      </section>

      {/* Estimator Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Project Type Selection */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-4 block">
                What type of project are you planning?
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {projectTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProjectType(type.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        projectType === type.id
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className={`w-8 h-8 mx-auto mb-2 ${
                        projectType === type.id ? 'text-amber-600' : 'text-gray-600'
                      }`} />
                      <p className="text-sm font-medium text-gray-900">{type.name}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Square Footage */}
            <div>
              <label htmlFor="sqft" className="text-lg font-semibold text-gray-900 mb-4 block">
                Project size (square feet)
              </label>
              <input
                type="number"
                id="sqft"
                value={squareFootage}
                onChange={(e) => setSquareFootage(e.target.value)}
                placeholder="Enter square footage"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-amber-500"
                required
                min="1"
              />
              <p className="text-sm text-gray-600 mt-2">
                Not sure? A typical kitchen is 150-250 sq ft, bathroom is 40-100 sq ft
              </p>
            </div>

            {/* Quality Level */}
            <div>
              <label className="text-lg font-semibold text-gray-900 mb-4 block">
                Select finish quality
              </label>
              <div className="space-y-3">
                {qualityLevels.map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => setQuality(level.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      quality === level.id
                        ? 'border-amber-500 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">{level.name}</p>
                        <p className="text-sm text-gray-600">{level.description}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {level.multiplier === 1 ? 'Base' : `+${Math.round((level.multiplier - 1) * 100)}%`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
            >
              Calculate Estimate
            </button>
          </form>

          {/* Estimate Display */}
          {showEstimate && estimate.low > 0 && (
            <div className="mt-12 p-8 bg-gray-50 rounded-xl border-2 border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Your Estimated Project Cost
              </h2>

              <div className="bg-white rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center gap-4 text-3xl font-bold">
                  <span className="text-gray-600">${estimate.low.toLocaleString()}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-amber-600">${estimate.high.toLocaleString()}</span>
                </div>
                <p className="text-center text-gray-600 mt-2">
                  Estimated cost range for your project
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <p className="text-sm text-gray-700">
                    This is a rough estimate based on typical project costs in Northern Colorado
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <p className="text-sm text-gray-700">
                    Actual costs may vary based on specific materials, site conditions, and design complexity
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-500 mt-1">✓</span>
                  <p className="text-sm text-gray-700">
                    Contact us for a detailed, personalized quote for your project
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-amber-50 rounded-lg p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Ready to get started?
                </h3>
                <p className="text-gray-600 mb-4">
                  Get a detailed quote and free consultation from our experts
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Request Free Quote
                  </Link>
                  <a
                    href="tel:9705155059"
                    className="px-6 py-3 bg-white border-2 border-amber-500 text-amber-600 font-semibold rounded-lg hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    (970) 515-5059
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="mt-12 p-4 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              * This estimator provides rough cost ranges only. Actual project costs will vary based on materials selected,
              site conditions, permits, and specific project requirements. Contact Kiefer Built Contracting for an accurate quote.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}