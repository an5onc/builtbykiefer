'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah & Mike Peterson',
    location: 'Windsor, CO',
    project: 'Custom Home Build',
    rating: 5,
    text: 'Kiefer Built exceeded every expectation we had. From the initial design phase to the final walkthrough, their attention to detail and commitment to quality was evident. Our dream home is now a reality.',
    image: '/testimonials/peterson.jpg'
  },
  {
    id: 2,
    name: 'David Chen',
    location: 'Fort Collins, CO',
    project: 'Kitchen & Master Suite Remodel',
    rating: 5,
    text: 'The transformation of our kitchen and master bedroom was incredible. Kiefer\'s team stayed on schedule, on budget, and the craftsmanship is outstanding. Highly recommend!',
    image: '/testimonials/chen.jpg'
  },
  {
    id: 3,
    name: 'The Johnson Family',
    location: 'Loveland, CO',
    project: 'Whole House Renovation',
    rating: 5,
    text: 'We bought a fixer-upper and Kiefer Built turned it into our forever home. Their team was professional, communicative, and the quality of work is exceptional. Worth every penny.',
    image: '/testimonials/johnson.jpg'
  },
  {
    id: 4,
    name: 'Amanda Torres',
    location: 'Greeley, CO',
    project: '2-Story Addition',
    rating: 5,
    text: 'Adding a second story to our ranch home seemed daunting, but Kiefer Built made the process smooth and stress-free. The new space is beautiful and perfectly integrated with our existing home.',
    image: '/testimonials/torres.jpg'
  },
  {
    id: 5,
    name: 'Robert & Lisa Mitchell',
    location: 'Windsor, CO',
    project: 'Luxury Custom Home',
    rating: 5,
    text: 'Kiefer Built brought our vision to life with incredible precision. The custom millwork, vaulted ceilings, and attention to every detail shows true craftsmanship. We couldn\'t be happier.',
    image: '/testimonials/mitchell.jpg'
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-amber-50/30">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Building lasting relationships through exceptional craftsmanship and service
          </p>
        </motion.div>

        <div className="relative">
          {/* Main Carousel Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="grid md:grid-cols-2 gap-8 p-8 md:p-12"
              >
                {/* Testimonial Content */}
                <div className="flex flex-col justify-center">
                  <Quote className="w-12 h-12 text-amber-500 mb-6" />

                  {/* Rating Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  <p className="text-lg text-slate-700 leading-relaxed mb-6 italic">
                    &ldquo;{testimonials[currentIndex].text}&rdquo;
                  </p>

                  <div className="border-t pt-6">
                    <div className="font-semibold text-slate-900 text-lg">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-slate-600">
                      {testimonials[currentIndex].location}
                    </div>
                    <div className="text-amber-600 font-medium mt-1">
                      {testimonials[currentIndex].project}
                    </div>
                  </div>
                </div>

                {/* Project Image */}
                <div className="relative h-64 md:h-auto rounded-xl overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <p className="text-slate-600 font-medium">{testimonials[currentIndex].project}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-amber-500"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-slate-700" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 focus:outline-none ${
                index === currentIndex
                  ? 'w-12 h-3 bg-amber-500 rounded-full'
                  : 'w-3 h-3 bg-slate-300 rounded-full hover:bg-slate-400'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-amber-600">150+</div>
            <div className="text-slate-600 mt-1">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">20+</div>
            <div className="text-slate-600 mt-1">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">100%</div>
            <div className="text-slate-600 mt-1">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-amber-600">5.0</div>
            <div className="text-slate-600 mt-1">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}