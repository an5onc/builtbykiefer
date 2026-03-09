"use client";

import { motion } from "framer-motion";
import { useState } from "react";

type ProjectType = "kitchen" | "bathroom" | "addition" | "basement" | "whole-home" | "";
type QualityLevel = "standard" | "mid-range" | "high-end" | "";

interface EstimateData {
  projectType: ProjectType;
  squareFootage: string;
  qualityLevel: QualityLevel;
}

const projectTypes = [
  { value: "kitchen", label: "Kitchen Remodel", baseRate: 150 },
  { value: "bathroom", label: "Bathroom Remodel", baseRate: 200 },
  { value: "addition", label: "Room Addition", baseRate: 250 },
  { value: "basement", label: "Basement Finish", baseRate: 100 },
  { value: "whole-home", label: "Whole Home Remodel", baseRate: 180 },
];

const qualityLevels = [
  { value: "standard", label: "Standard", multiplier: 0.85 },
  { value: "mid-range", label: "Mid-Range", multiplier: 1.0 },
  { value: "high-end", label: "High-End", multiplier: 1.35 },
];

export default function CostEstimator() {
  const [formData, setFormData] = useState<EstimateData>({
    projectType: "",
    squareFootage: "",
    qualityLevel: "",
  });
  const [showEstimate, setShowEstimate] = useState(false);

  const calculateEstimate = () => {
    const projectConfig = projectTypes.find(p => p.value === formData.projectType);
    const qualityConfig = qualityLevels.find(q => q.value === formData.qualityLevel);

    if (!projectConfig || !qualityConfig || !formData.squareFootage) {
      return { min: 0, max: 0 };
    }

    const sqft = parseInt(formData.squareFootage);
    const basePrice = projectConfig.baseRate * sqft * qualityConfig.multiplier;

    // Add 15% variance for range
    const min = Math.round(basePrice * 0.85);
    const max = Math.round(basePrice * 1.15);

    return { min, max };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.projectType && formData.squareFootage && formData.qualityLevel) {
      setShowEstimate(true);
    }
  };

  const handleReset = () => {
    setFormData({
      projectType: "",
      squareFootage: "",
      qualityLevel: "",
    });
    setShowEstimate(false);
  };

  const { min, max } = calculateEstimate();
  const isFormValid = formData.projectType && formData.squareFootage && formData.qualityLevel;

  return (
    <section
      id="cost-estimator"
      aria-labelledby="estimator-title"
      className="py-24 px-6 bg-gradient-to-br from-sand-50 to-sand-100"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold text-walnut-500 uppercase tracking-widest mb-3">
            Project Planning
          </p>
          <h2
            id="estimator-title"
            className="text-4xl md:text-5xl font-black text-charcoal-800 mb-4"
          >
            Renovation Cost Estimator
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto leading-relaxed">
            Get a ballpark estimate for your project. Final costs depend on materials,
            site conditions, and design choices. Contact us for a detailed quote.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-sand-200"
        >
          {!showEstimate ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Project Type */}
              <div>
                <label
                  htmlFor="project-type"
                  className="block text-sm font-bold text-charcoal-700 mb-3 uppercase tracking-wider"
                >
                  Project Type
                </label>
                <div className="grid sm:grid-cols-2 gap-3">
                  {projectTypes.map((project) => (
                    <button
                      key={project.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, projectType: project.value as ProjectType })
                      }
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        formData.projectType === project.value
                          ? "border-walnut-500 bg-walnut-50 shadow-md"
                          : "border-sand-200 hover:border-walnut-300 hover:bg-sand-50"
                      }`}
                    >
                      <span className="font-semibold text-charcoal-800 block">
                        {project.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Square Footage */}
              <div>
                <label
                  htmlFor="square-footage"
                  className="block text-sm font-bold text-charcoal-700 mb-3 uppercase tracking-wider"
                >
                  Approximate Square Footage
                </label>
                <input
                  id="square-footage"
                  type="number"
                  min="1"
                  max="10000"
                  value={formData.squareFootage}
                  onChange={(e) =>
                    setFormData({ ...formData, squareFootage: e.target.value })
                  }
                  placeholder="e.g., 250"
                  className="w-full px-5 py-4 border-2 border-sand-200 rounded-lg focus:border-walnut-500 focus:outline-none text-charcoal-800 text-lg transition-colors"
                />
              </div>

              {/* Quality Level */}
              <div>
                <label
                  htmlFor="quality-level"
                  className="block text-sm font-bold text-charcoal-700 mb-3 uppercase tracking-wider"
                >
                  Quality Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {qualityLevels.map((quality) => (
                    <button
                      key={quality.value}
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, qualityLevel: quality.value as QualityLevel })
                      }
                      className={`p-4 rounded-lg border-2 text-center transition-all ${
                        formData.qualityLevel === quality.value
                          ? "border-walnut-500 bg-walnut-50 shadow-md"
                          : "border-sand-200 hover:border-walnut-300 hover:bg-sand-50"
                      }`}
                    >
                      <span className="font-semibold text-charcoal-800 block text-sm md:text-base">
                        {quality.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-5 px-8 rounded-lg font-bold text-lg uppercase tracking-wider transition-all ${
                  isFormValid
                    ? "bg-walnut-500 hover:bg-walnut-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-sand-300 text-sand-500 cursor-not-allowed"
                }`}
              >
                Calculate Estimate
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="mb-8">
                  <div className="inline-block p-4 bg-walnut-100 rounded-full mb-6">
                    <svg
                      className="w-16 h-16 text-walnut-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-charcoal-800 mb-2">
                    Your Estimated Range
                  </h3>
                  <p className="text-charcoal-600 mb-8">
                    Based on {formData.squareFootage} sq ft{" "}
                    {projectTypes.find(p => p.value === formData.projectType)?.label.toLowerCase()}{" "}
                    with {qualityLevels.find(q => q.value === formData.qualityLevel)?.label.toLowerCase()}{" "}
                    finishes
                  </p>
                </div>

                <div className="bg-gradient-to-br from-walnut-500 to-walnut-600 rounded-2xl p-10 mb-8 shadow-xl">
                  <p className="text-walnut-100 text-sm uppercase tracking-widest mb-3">
                    Estimated Investment
                  </p>
                  <p className="text-5xl md:text-6xl font-black text-white mb-2">
                    ${min.toLocaleString()} - ${max.toLocaleString()}
                  </p>
                  <p className="text-walnut-100 text-sm">
                    *Estimate only. Actual costs may vary.
                  </p>
                </div>

                <div className="bg-sand-50 rounded-xl p-6 mb-8 text-left">
                  <p className="text-sm text-charcoal-700 leading-relaxed">
                    <strong className="text-walnut-600">Important:</strong> This is a rough
                    estimate based on typical projects. Your actual cost will depend on specific
                    materials, labor, site conditions, permits, and design complexity. Contact us
                    for a detailed, no-obligation quote.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-4 px-6 border-2 border-walnut-500 text-walnut-600 rounded-lg font-bold uppercase tracking-wider hover:bg-walnut-50 transition-all"
                  >
                    Start Over
                  </button>
                  <a
                    href="#contact"
                    className="flex-1 py-4 px-6 bg-walnut-500 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-walnut-600 transition-all shadow-lg hover:shadow-xl text-center"
                  >
                    Get Detailed Quote
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-sm text-charcoal-500 mt-8"
        >
          Ready to discuss your project?{" "}
          <a
            href="#contact"
            className="text-walnut-500 hover:text-walnut-600 font-semibold underline underline-offset-2"
          >
            Contact us today
          </a>{" "}
          for a personalized consultation.
        </motion.p>
      </div>
    </section>
  );
}
