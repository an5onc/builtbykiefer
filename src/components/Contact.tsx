"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export default function Contact() {
  const ref = useRef(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [showThankYou, setShowThankYou] = useState(false);
  const [loadCount, setLoadCount] = useState(0);

  useEffect(() => {
    // Load Buildertrend script
    const script = document.createElement('script');
    script.src = 'https://buildertrend.net/leads/contactforms/js/btClientContactForm.js';
    script.type = 'text/javascript';
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handleIframeLoad = () => {
    // The iframe loads twice: once initially, once after submission
    // Show thank you after the second load (submission)
    setLoadCount(prev => {
      const newCount = prev + 1;
      if (newCount > 1) {
        setShowThankYou(true);
      }
      return newCount;
    });
  };

  const resetForm = () => {
    setShowThankYou(false);
    setLoadCount(0);
    // Reload the iframe to show fresh form
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

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
            className="relative"
          >
            {/* Buildertrend Contact Form */}
            <div className="bg-white p-6 rounded-lg shadow-xl relative">
              {!showThankYou ? (
                <iframe
                  ref={iframeRef}
                  src="https://buildertrend.net/leads/contactforms/ContactFormFrame.aspx?builderID=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJidWlsZGVySWQiOjczMDYwfQ.kg1wLW3_McP07nQZcG8Rft8Z2CMWbaNbyNRgAd8a5FY"
                  scrolling="no"
                  id="btIframe"
                  onLoad={handleIframeLoad}
                  style={{
                    background: 'white',
                    border: '0px',
                    margin: '0 auto',
                    width: '100%',
                    minHeight: '600px'
                  }}
                  title="Contact Form"
                />
              ) : (
                <div className="flex items-center justify-center min-h-[600px]">
                  <div className="text-center p-8">
                    <div className="mb-6">
                      <svg
                        className="mx-auto h-16 w-16 text-walnut-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-3xl font-bold text-walnut-500 mb-4">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md">
                      We&apos;ve received your message and will get back to you within 24 hours.
                    </p>
                    <button
                      onClick={resetForm}
                      className="px-6 py-3 bg-walnut-500 text-white rounded-lg hover:bg-walnut-600 transition-colors text-sm tracking-wider uppercase"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
