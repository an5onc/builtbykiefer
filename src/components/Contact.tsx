"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, FormEvent } from "react";
import { sendContactEmail } from "@/app/actions";

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const result = await sendContactEmail(data);

      if (result.success) {
        setSubmitted(true);
        form.reset();
      } else {
        setError(result.error || "Failed to send message. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <section
      id="contact"
      className="py-24 md:py-32 bg-charcoal-800 relative overflow-hidden"
      ref={ref}
    >
      {/* Background accent image */}
      <div
        className="absolute inset-0 opacity-5 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/project-1/exterior-2.jpg)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="text-walnut-400 text-sm tracking-[0.3em] uppercase mb-3">
              Get in Touch
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-sand-100 mb-6">
              Ready to Build
              <br />
              Your Dream Home?
            </h2>
            <p className="text-charcoal-200 leading-relaxed mb-8">
              Tell us about your project. Whether it&apos;s a custom new build,
              renovation, or commercial space, we&apos;d love to hear your
              vision.
            </p>

            <div className="space-y-4 text-charcoal-200">
              <div>
                <p className="text-xs tracking-wider uppercase text-walnut-400 mb-1">
                  Phone
                </p>
                <a
                  href="tel:9705155059"
                  className="hover:text-walnut-300 transition-colors"
                >
                  (970) 515-5059
                </a>
              </div>
              <div>
                <p className="text-xs tracking-wider uppercase text-walnut-400 mb-1">
                  Email
                </p>
                <a
                  href="mailto:info@kbuiltco.com"
                  className="hover:text-walnut-300 transition-colors"
                >
                  info@kbuiltco.com
                </a>
              </div>
              <div>
                <p className="text-xs tracking-wider uppercase text-walnut-400 mb-1">
                  Location
                </p>
                <p>Windsor, Colorado</p>
              </div>
            </div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl text-walnut-400 mb-4">Thank you</p>
                  <p className="text-charcoal-200">
                    We&apos;ll be in touch within 24 hours.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-red-900/20 border border-red-600 text-red-400 px-4 py-3 rounded text-sm">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                    Project Type
                  </label>
                  <select
                    name="projectType"
                    className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors"
                  >
                    <option>Custom New Build</option>
                    <option>Renovation / Remodel</option>
                    <option>Addition</option>
                    <option>Commercial</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-wider uppercase text-charcoal-200 mb-2">
                    Tell Us About Your Project
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-charcoal-700 border border-charcoal-600 text-sand-100 px-4 py-3 rounded text-sm focus:outline-none focus:border-walnut-500 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 bg-walnut-500 text-white tracking-wider uppercase text-sm rounded hover:bg-walnut-600 transition-colors disabled:opacity-50"
                >
                  {sending ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
