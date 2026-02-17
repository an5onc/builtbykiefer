"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const testimonials = [
  {
    name: "The Andersons",
    project: "Custom Home Build",
    location: "Greeley, CO",
    text: "Kiefer turned our vision into something beyond what we imagined. The attention to detail in every corner of our home — from the walnut cabinetry to the stone exterior — shows the level of craftsmanship they bring to every project.",
    rating: 5,
  },
  {
    name: "Mark & Sarah T.",
    project: "Kitchen Renovation",
    location: "Windsor, CO",
    text: "Our kitchen renovation was handled with incredible precision. The team was communicative, on schedule, and the final result exceeded our expectations. The slatted ceiling detail was the perfect finishing touch.",
    rating: 5,
  },
  {
    name: "The Herrera Family",
    project: "Full Home Remodel",
    location: "Loveland, CO",
    text: "From the initial design consultation through the final walkthrough, the process was seamless. They treated our home like it was their own. We couldn't be happier with the quality of work.",
    rating: 5,
  },
  {
    name: "David R.",
    project: "Bathroom Suite",
    location: "Fort Collins, CO",
    text: "The primary bathroom they designed and built is like a spa retreat. The floating vanity, freestanding tub, and walk-in shower with dual heads — it's the room we dreamed of. Flawless execution.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-walnut-400" : "text-sand-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState(0);

  // Auto-rotate every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="testimonials"
      className="py-24 md:py-32 bg-stone-900"
      ref={ref}
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <p className="text-walnut-400 font-medium tracking-widest uppercase text-sm mb-3">
            Testimonials
          </p>
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-light text-white tracking-tight"
          >
            What Our Clients Say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Quote mark */}
          <div className="absolute -top-6 left-8 text-walnut-500/20 text-[120px] font-serif leading-none select-none pointer-events-none">
            &ldquo;
          </div>

          <div className="relative bg-stone-800/60 backdrop-blur-sm border border-stone-700/50 rounded-sm p-10 md:p-14 min-h-[280px] flex flex-col justify-between">
            {/* Testimonial Text */}
            <div className="relative z-10">
              <motion.p
                key={active}
                className="text-lg md:text-xl text-sand-200 leading-relaxed font-light italic"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                &ldquo;{testimonials[active].text}&rdquo;
              </motion.p>
            </div>

            {/* Attribution */}
            <motion.div
              key={`attr-${active}`}
              className="mt-8 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div>
                <p className="text-white font-medium">{testimonials[active].name}</p>
                <p className="text-sand-500 text-sm">
                  {testimonials[active].project} · {testimonials[active].location}
                </p>
              </div>
              <Stars count={testimonials[active].rating} />
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === active
                    ? "bg-walnut-400 scale-125"
                    : "bg-stone-600 hover:bg-stone-500"
                }`}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* JSON-LD Schema for Reviews */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: "Built by Kiefer",
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "5",
                reviewCount: testimonials.length.toString(),
                bestRating: "5",
              },
              review: testimonials.map((t) => ({
                "@type": "Review",
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: t.rating.toString(),
                  bestRating: "5",
                },
                author: {
                  "@type": "Person",
                  name: t.name,
                },
                reviewBody: t.text,
              })),
            }),
          }}
        />
      </div>
    </section>
  );
}
