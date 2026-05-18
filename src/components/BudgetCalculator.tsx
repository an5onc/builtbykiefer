'use client';

import { useState } from 'react';

interface CalculatorResult {
  lowEnd: number;
  midRange: number;
  highEnd: number;
  factors: string[];
}

export default function BudgetCalculator() {
  const [projectType, setProjectType] = useState('custom-home');
  const [squareFeet, setSquareFeet] = useState('');
  const [finishLevel, setFinishLevel] = useState('standard');
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculateBudget = () => {
    const sqft = parseInt(squareFeet);
    if (!sqft || sqft < 100) return;

    // Base cost per square foot (Northern Colorado market rates)
    const baseCosts = {
      'custom-home': { low: 200, mid: 275, high: 400 },
      'addition': { low: 150, mid: 200, high: 300 },
      'kitchen': { low: 125, mid: 175, high: 250 },
      'bathroom': { low: 100, mid: 150, high: 225 },
      'basement': { low: 75, mid: 100, high: 150 },
      'whole-home': { low: 100, mid: 150, high: 200 }
    };

    // Finish level multipliers
    const finishMultipliers = {
      'basic': 0.85,
      'standard': 1.0,
      'premium': 1.25,
      'luxury': 1.5
    };

    const base = baseCosts[projectType as keyof typeof baseCosts];
    const multiplier = finishMultipliers[finishLevel as keyof typeof finishMultipliers];

    const lowEnd = Math.round(sqft * base.low * multiplier);
    const midRange = Math.round(sqft * base.mid * multiplier);
    const highEnd = Math.round(sqft * base.high * multiplier);

    // Factors affecting cost
    const factors: string[] = [];

    if (finishLevel === 'luxury') {
      factors.push('High-end appliances and fixtures');
      factors.push('Premium materials (hardwood, natural stone)');
      factors.push('Custom millwork and cabinetry');
    }

    if (projectType === 'custom-home') {
      factors.push('Site preparation and utilities');
      factors.push('Permits and architectural plans');
      factors.push('Landscaping and exterior finishes');
    }

    if (sqft > 3000) {
      factors.push('Complex HVAC and electrical systems');
    }

    factors.push('Local labor and material costs');
    factors.push('Current market conditions');

    setResult({ lowEnd, midRange, highEnd, factors });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Project Budget Calculator
      </h2>
      <p className="text-gray-600 mb-8">
        Get an estimated budget range for your construction project based on Northern Colorado market rates.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Project Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Type
          </label>
          <select
            value={projectType}
            onChange={(e) => setProjectType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="custom-home">Custom Home</option>
            <option value="addition">Home Addition</option>
            <option value="kitchen">Kitchen Remodel</option>
            <option value="bathroom">Bathroom Remodel</option>
            <option value="basement">Basement Finish</option>
            <option value="whole-home">Whole Home Remodel</option>
          </select>
        </div>

        {/* Square Footage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Square Footage
          </label>
          <input
            type="number"
            value={squareFeet}
            onChange={(e) => setSquareFeet(e.target.value)}
            placeholder="Enter square feet"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Finish Level */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Finish Level
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: 'basic', label: 'Basic', desc: 'Builder grade materials' },
              { value: 'standard', label: 'Standard', desc: 'Quality materials' },
              { value: 'premium', label: 'Premium', desc: 'High-quality finishes' },
              { value: 'luxury', label: 'Luxury', desc: 'Top-tier everything' }
            ].map((level) => (
              <button
                key={level.value}
                onClick={() => setFinishLevel(level.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  finishLevel === level.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold">{level.label}</div>
                <div className="text-xs text-gray-500 mt-1">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculate Button */}
      <button
        onClick={calculateBudget}
        disabled={!squareFeet}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Calculate Budget Range
      </button>

      {/* Results */}
      {result && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Estimated Budget Range
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-500 mb-1">Low End</div>
              <div className="text-2xl font-bold text-gray-900">
                ${result.lowEnd.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-sm text-blue-600 mb-1">Most Likely</div>
              <div className="text-2xl font-bold text-blue-600">
                ${result.midRange.toLocaleString()}
              </div>
            </div>
            <div className="text-center p-4 bg-white rounded-lg">
              <div className="text-sm text-gray-500 mb-1">High End</div>
              <div className="text-2xl font-bold text-gray-900">
                ${result.highEnd.toLocaleString()}
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Factors Affecting Cost:
            </h4>
            <ul className="space-y-1">
              {result.factors.map((factor, i) => (
                <li key={i} className="flex items-start text-sm text-gray-600">
                  <span className="text-blue-500 mr-2">•</span>
                  {factor}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This is an estimate only. Actual costs depend on specific site conditions,
              material selections, and project complexity. Contact us for a detailed quote.
            </p>
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          Ready to get a precise quote for your project?
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Free Quote
          </a>
          <a
            href="tel:9705155059"
            className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Call (970) 515-5059
          </a>
        </div>
      </div>
    </div>
  );
}