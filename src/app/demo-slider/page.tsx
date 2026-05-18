"use client";

import Link from "next/link";
import BeforeAfterExample from "@/components/BeforeAfterExample";

/**
 * Demo page for the Before/After Slider component
 *
 * This page showcases the BeforeAfterSlider component in action.
 * View at: http://localhost:3000/demo-slider
 *
 * To integrate into your project pages:
 * 1. Import BeforeAfterSlider from @/components/BeforeAfterSlider
 * 2. Add your before/after images to /public/images/
 * 3. Use the component with proper image paths and alt text
 */
export default function DemoSliderPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--color-cream-50)" }}>

      {/* Header */}
      <header className="border-b" style={{ background: "white", borderColor: "var(--color-sand-200)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-charcoal-800)" }}>
                Before/After Slider Demo
              </h1>
              <p className="text-sm mt-1" style={{ color: "var(--color-charcoal-500)" }}>
                Interactive transformation showcase for construction projects
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
              style={{
                background: "white",
                color: "var(--color-charcoal-700)",
                borderColor: "var(--color-sand-300)"
              }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Demo Content */}
      <BeforeAfterExample />

      {/* Implementation Guide */}
      <section className="py-16" style={{ background: "white" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "var(--color-charcoal-800)" }}>
            Quick Start Guide
          </h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl border" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-sand-200)" }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "var(--color-walnut-500)" }}>
                  1
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-charcoal-800)" }}>
                    Import the Component
                  </h3>
                  <pre className="bg-charcoal-800 text-sand-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import BeforeAfterSlider from "@/components/BeforeAfterSlider";`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl border" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-sand-200)" }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "var(--color-walnut-500)" }}>
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-charcoal-800)" }}>
                    Add Your Images
                  </h3>
                  <p className="mb-3 text-sm" style={{ color: "var(--color-charcoal-600)" }}>
                    Place your before and after images in the public directory:
                  </p>
                  <pre className="bg-charcoal-800 text-sand-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`/public/images/your-project/kitchen-before.jpg
/public/images/your-project/kitchen-after.jpg`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl border" style={{ background: "var(--color-cream-50)", borderColor: "var(--color-sand-200)" }}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "var(--color-walnut-500)" }}>
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: "var(--color-charcoal-800)" }}>
                    Use the Component
                  </h3>
                  <p className="mb-3 text-sm" style={{ color: "var(--color-charcoal-600)" }}>
                    Add the slider to your project page with proper props:
                  </p>
                  <pre className="bg-charcoal-800 text-sand-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`<BeforeAfterSlider
  beforeImage="/images/your-project/kitchen-before.jpg"
  afterImage="/images/your-project/kitchen-after.jpg"
  beforeAlt="Kitchen before renovation with outdated cabinets"
  afterAlt="Kitchen after renovation with modern cabinetry"
/>`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mt-12 grid sm:grid-cols-2 gap-4">
            {[
              { icon: "📱", title: "Mobile Touch Support", desc: "Full touch event handling for mobile devices" },
              { icon: "🎨", title: "Professional Styling", desc: "Construction industry-appropriate design" },
              { icon: "⚡", title: "Performance Optimized", desc: "Next.js Image component with lazy loading" },
              { icon: "♿", title: "Accessible", desc: "Semantic HTML with proper alt text support" },
              { icon: "📐", title: "Responsive", desc: "Works perfectly across all screen sizes" },
              { icon: "✨", title: "Smooth Animations", desc: "Butter-smooth drag interactions" },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border"
                style={{ background: "white", borderColor: "var(--color-sand-200)" }}
              >
                <div className="text-2xl mb-2">{feature.icon}</div>
                <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--color-charcoal-800)" }}>
                  {feature.title}
                </h4>
                <p className="text-xs" style={{ color: "var(--color-charcoal-500)" }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Documentation Link */}
          <div className="mt-12 text-center">
            <p className="text-sm mb-4" style={{ color: "var(--color-charcoal-600)" }}>
              For complete documentation, see:
            </p>
            <code
              className="inline-block px-4 py-2 rounded-lg text-sm font-mono"
              style={{ background: "var(--color-sand-100)", color: "var(--color-charcoal-700)" }}
            >
              /BEFORE_AFTER_SLIDER_GUIDE.md
            </code>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t" style={{ background: "var(--color-cream-100)", borderColor: "var(--color-sand-200)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm" style={{ color: "var(--color-charcoal-500)" }}>
            Built for Kiefer Built Contracting — Northern Colorado Custom Homes
          </p>
          <p className="text-xs mt-2" style={{ color: "var(--color-charcoal-400)" }}>
            Showcasing quality construction transformations with professional interactive tools
          </p>
        </div>
      </footer>

    </div>
  );
}
