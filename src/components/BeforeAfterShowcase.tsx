'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface BeforeAfterProject {
  id: string;
  title: string;
  location: string;
  completionTime: string;
  beforeImage: string;
  afterImage: string;
  description: string;
}

const projects: BeforeAfterProject[] = [
  {
    id: 'kitchen-remodel-windsor',
    title: 'Complete Kitchen Remodel',
    location: 'Windsor, CO',
    completionTime: '6 weeks',
    beforeImage: '/images/projects/kitchen-before-1.jpg',
    afterImage: '/images/projects/kitchen-after-1.jpg',
    description: 'Full kitchen renovation including custom cabinetry, granite countertops, and modern appliances'
  },
  {
    id: 'bathroom-renovation',
    title: 'Master Bath Transformation',
    location: 'Fort Collins, CO',
    completionTime: '3 weeks',
    beforeImage: '/images/projects/bath-before-1.jpg',
    afterImage: '/images/projects/bath-after-1.jpg',
    description: 'Luxury bathroom upgrade with walk-in shower, dual vanity, and heated floors'
  },
  {
    id: 'basement-finish',
    title: 'Basement Finishing',
    location: 'Loveland, CO',
    completionTime: '8 weeks',
    beforeImage: '/images/projects/basement-before-1.jpg',
    afterImage: '/images/projects/basement-after-1.jpg',
    description: 'Complete basement transformation into entertainment space with wet bar and home theater'
  },
  {
    id: 'exterior-renovation',
    title: 'Exterior Home Renovation',
    location: 'Greeley, CO',
    completionTime: '4 weeks',
    beforeImage: '/images/projects/exterior-before-1.jpg',
    afterImage: '/images/projects/exterior-after-1.jpg',
    description: 'Complete exterior update including siding, windows, and landscaping'
  }
];

export default function BeforeAfterShowcase() {
  const [currentProject, setCurrentProject] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const project = projects[currentProject];

  const handleNext = () => {
    setCurrentProject((prev) => (prev + 1) % projects.length);
    setSliderPosition(50);
  };

  const handlePrevious = () => {
    setCurrentProject((prev) => (prev - 1 + projects.length) % projects.length);
    setSliderPosition(50);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.min(Math.max(percentage, 0), 100));
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Before & After Transformations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the dramatic transformations we&apos;ve achieved for homeowners across Northern Colorado
          </p>
        </div>

        {/* Project Info */}
        <div className="mb-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
          <div className="flex items-center justify-center gap-6 text-gray-600">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {project.completionTime}
            </span>
          </div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{project.description}</p>
        </div>

        {/* Before/After Slider */}
        <div className="relative max-w-5xl mx-auto">
          <div
            className="relative overflow-hidden rounded-lg shadow-2xl cursor-ew-resize select-none"
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onTouchMove={handleTouchMove}
            style={{ aspectRatio: '16/9' }}
          >
            {/* After Image (Bottom Layer) */}
            <div className="absolute inset-0 bg-gray-200">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-blue-500/20" />
                <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-green-500 text-white font-bold rounded-full text-sm">
                  AFTER
                </span>
              </div>
            </div>

            {/* Before Image (Top Layer with Clip) */}
            <div
              className="absolute inset-0 bg-gray-200"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20" />
                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-red-500 text-white font-bold rounded-full text-sm">
                  BEFORE
                </span>
              </div>
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            aria-label="Previous project"
          >
            <ChevronLeft className="w-6 h-6 text-gray-800" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
            aria-label="Next project"
          >
            <ChevronRight className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Project Thumbnails */}
        <div className="mt-8 flex justify-center gap-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentProject(index);
                setSliderPosition(50);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentProject
                  ? 'w-8 bg-blue-600'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-600 mb-6">
            Ready to transform your home? Let&apos;s discuss your project.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/estimate"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Free Estimate
            </a>
            <a
              href="/projects"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              View All Projects
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
