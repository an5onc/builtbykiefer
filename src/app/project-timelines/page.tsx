'use client';

import { useState } from 'react';
import Link from 'next/link';

interface TimelinePhase {
  name: string;
  description: string;
  color: string;
  duration?: string;
}

interface ProjectType {
  id: string;
  name: string;
  totalDuration: string;
  durationMonths: number;
  description: string;
  phases: TimelinePhase[];
  icon: string;
  color: string;
  details: string[];
}

const projectTypes: ProjectType[] = [
  {
    id: 'custom-home',
    name: 'Custom Home',
    totalDuration: '6-9 months',
    durationMonths: 8,
    description: 'Complete custom home construction from ground up',
    icon: '🏠',
    color: 'from-[#b92516] to-[#151515]',
    details: [
      'Full architectural design and planning',
      'Foundation through final inspection',
      'Typical size: 2,000-5,000 sq ft',
      'Includes all permits and inspections'
    ],
    phases: [
      {
        name: 'Planning & Permits',
        description: 'Design, permits, site prep',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '4-6 weeks'
      },
      {
        name: 'Foundation/Demo',
        description: 'Foundation pour and structural work',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '3-4 weeks'
      },
      {
        name: 'Framing',
        description: 'Structural framing and roof',
        color: 'bg-[#151515]/5 border-black/10',
        duration: '4-6 weeks'
      },
      {
        name: 'Electrical/Plumbing',
        description: 'Rough-in utilities and HVAC',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '3-4 weeks'
      },
      {
        name: 'Insulation/Drywall',
        description: 'Insulation, drywall, and taping',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '3-4 weeks'
      },
      {
        name: 'Flooring/Finishes',
        description: 'Flooring, paint, trim, cabinets',
        color: 'bg-white border-black/10',
        duration: '4-6 weeks'
      },
      {
        name: 'Final Inspection',
        description: 'Final walkthrough and handover',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1 week'
      }
    ]
  },
  {
    id: 'kitchen-remodel',
    name: 'Kitchen Remodel',
    totalDuration: '4-6 weeks',
    durationMonths: 1.5,
    description: 'Complete kitchen renovation with new cabinets and finishes',
    icon: '🍳',
    color: 'from-[#b92516] to-[#151515]',
    details: [
      'Cabinet and appliance replacement',
      'Countertop and backsplash installation',
      'New plumbing and electrical fixtures',
      'Average cost range: $25,000 - $75,000'
    ],
    phases: [
      {
        name: 'Planning & Permits',
        description: 'Design, permits, material selection',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1-2 weeks'
      },
      {
        name: 'Foundation/Demo',
        description: 'Remove old cabinets and appliances',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 days'
      },
      {
        name: 'Electrical/Plumbing',
        description: 'Update outlets, plumbing, HVAC',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1-2 weeks'
      },
      {
        name: 'Flooring/Finishes',
        description: 'Cabinets, counters, backsplash, paint',
        color: 'bg-white border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Final Inspection',
        description: 'Appliance install, final details',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '2-3 days'
      }
    ]
  },
  {
    id: 'bathroom-remodel',
    name: 'Bathroom Remodel',
    totalDuration: '2-3 weeks',
    durationMonths: 0.6,
    description: 'Comprehensive bathroom renovation',
    icon: '🚿',
    color: 'from-[#151515] to-[#b92516]',
    details: [
      'Fixtures and tile replacement',
      'Plumbing and electrical updates',
      'Vanity and flooring installation',
      'Average cost range: $8,000 - $25,000'
    ],
    phases: [
      {
        name: 'Planning & Permits',
        description: 'Design and material selection',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '3-5 days'
      },
      {
        name: 'Foundation/Demo',
        description: 'Demolition of existing fixtures',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 days'
      },
      {
        name: 'Electrical/Plumbing',
        description: 'New plumbing and electrical',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '3-5 days'
      },
      {
        name: 'Flooring/Finishes',
        description: 'Tile, vanity, fixtures, paint',
        color: 'bg-white border-black/10',
        duration: '5-7 days'
      },
      {
        name: 'Final Inspection',
        description: 'Final touches and cleanup',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1-2 days'
      }
    ]
  },
  {
    id: 'addition',
    name: 'Home Addition',
    totalDuration: '3-4 months',
    durationMonths: 3.5,
    description: 'Room addition, deck, or garage construction',
    icon: '🏗️',
    color: 'from-[#151515] to-[#b92516]',
    details: [
      'New room construction (bedroom, bathroom, family room)',
      'Integration with existing home',
      'Permits for structural changes',
      'Typical size: 400-1,000 sq ft'
    ],
    phases: [
      {
        name: 'Planning & Permits',
        description: 'Design, permits, structural planning',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '2-4 weeks'
      },
      {
        name: 'Foundation/Demo',
        description: 'Foundation and structural prep',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Framing',
        description: 'Framing and roof installation',
        color: 'bg-[#151515]/5 border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Electrical/Plumbing',
        description: 'Rough-in utilities and HVAC',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1-2 weeks'
      },
      {
        name: 'Insulation/Drywall',
        description: 'Insulation and drywall',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Flooring/Finishes',
        description: 'Finishing, paint, trim work',
        color: 'bg-white border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Final Inspection',
        description: 'Integration and final inspection',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '3-5 days'
      }
    ]
  },
  {
    id: 'basement-finish',
    name: 'Basement Finishing',
    totalDuration: '2-3 months',
    durationMonths: 2.5,
    description: 'Complete basement conversion to livable space',
    icon: '⬇️',
    color: 'from-[#151515] to-[#b92516]',
    details: [
      'Egress window installation',
      'Waterproofing and moisture control',
      'Framing walls and ceiling',
      'Typical size: 800-1,500 sq ft'
    ],
    phases: [
      {
        name: 'Planning & Permits',
        description: 'Design, egress planning, permits',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '1-2 weeks'
      },
      {
        name: 'Foundation/Demo',
        description: 'Waterproofing, egress installation',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Framing',
        description: 'Wall framing and ceiling',
        color: 'bg-[#151515]/5 border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Electrical/Plumbing',
        description: 'Electrical, plumbing, HVAC',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '2-3 weeks'
      },
      {
        name: 'Insulation/Drywall',
        description: 'Insulation, drywall, taping',
        color: 'bg-[#f9f6f0] border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Flooring/Finishes',
        description: 'Flooring, paint, trim, doors',
        color: 'bg-white border-black/10',
        duration: '2-3 weeks'
      },
      {
        name: 'Final Inspection',
        description: 'Final inspection and handover',
        color: 'bg-[#b92516]/10 border-[#b92516]/25',
        duration: '3-5 days'
      }
    ]
  }
];

export default function ProjectTimelinesPage() {
  const [selectedProject, setSelectedProject] = useState<ProjectType>(projectTypes[0]);

  const getTimelineWidth = (duration: number) => {
    const maxDuration = 9;
    return (duration / maxDuration) * 100;
  };

  return (
    <div className="min-h-screen bg-[#f4efe7]">
      {/* Hero Section */}
      <section className="relative bg-[#151515] text-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Project Timelines</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Understand the timeline and phases for your construction project. Every project is unique, but these are typical durations for common project types.
          </p>
        </div>
      </section>

      {/* Timeline Selector */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {projectTypes.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`relative p-6 rounded-xl border-2 transition-all ${
                  selectedProject.id === project.id
                    ? 'border-[#b92516] bg-[#b92516]/10 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-[#b92516]/40'
                }`}
              >
                <div className="text-4xl mb-2">{project.icon}</div>
                <h3 className="font-bold text-gray-900 mb-1">{project.name}</h3>
                <p className="text-sm font-semibold text-[#b92516]">{project.totalDuration}</p>
              </button>
            ))}
          </div>

          {/* Selected Project Details */}
          <div className="max-w-4xl mx-auto bg-[#f9f6f0] rounded-2xl p-8 mb-8 border border-black/10">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <div className="text-5xl mb-4">{selectedProject.icon}</div>
                <h2 className="text-3xl font-bold text-[#171717] mb-2">
                  {selectedProject.name}
                </h2>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-[#b92516]">
                    {selectedProject.totalDuration}
                  </span>
                  <span className="text-gray-600">typical duration</span>
                </div>
                <p className="text-gray-700 mb-6">{selectedProject.description}</p>

                {/* Details List */}
                <ul className="space-y-2">
                  {selectedProject.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#b92516] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Duration Bar */}
              <div className="flex flex-col justify-center">
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600">Timeline Comparison</span>
                    <span className="text-xs text-gray-500">9 months max</span>
                  </div>
                  <div className="relative h-12 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full bg-gradient-to-r ${selectedProject.color} rounded-full transition-all duration-300 flex items-center justify-end pr-4`}
                      style={{ width: `${getTimelineWidth(selectedProject.durationMonths)}%` }}
                    >
                      <span className="text-white font-bold text-sm">
                        {selectedProject.durationMonths.toFixed(1)}mo
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Total Duration</p>
                    <p className="text-lg font-bold text-[#171717]">{selectedProject.totalDuration}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Phases</p>
                    <p className="text-lg font-bold text-[#171717]">{selectedProject.phases.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phases Timeline */}
            <div className="mt-12 pt-8 border-t border-gray-300">
              <h3 className="text-2xl font-bold text-[#171717] mb-8">Project Phases</h3>

              <div className="space-y-4">
                {selectedProject.phases.map((phase, index) => (
                  <div key={index} className="relative">
                    {/* Connecting line */}
                    {index < selectedProject.phases.length - 1 && (
                      <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-gray-100" />
                    )}

                    {/* Phase Card */}
                    <div className={`${phase.color} border-2 rounded-lg p-5 pl-20`}>
                      <div className="absolute left-4 top-5 w-5 h-5 bg-white border-2 border-gray-400 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </div>

                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-[#171717]">{phase.name}</h4>
                        {phase.duration && (
                          <span className="text-xs font-semibold text-gray-600 bg-white px-3 py-1 rounded-full">
                            {phase.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{phase.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Type Comparison */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-[#171717] mb-6 text-center">Quick Comparison</h3>
            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#f9f6f0]">
                    <th className="text-left px-6 py-4 font-bold text-[#171717]">Project Type</th>
                    <th className="text-left px-6 py-4 font-bold text-[#171717]">Duration</th>
                    <th className="text-left px-6 py-4 font-bold text-[#171717]">Phases</th>
                  </tr>
                </thead>
                <tbody>
                  {projectTypes.map((project, idx) => (
                    <tr
                      key={project.id}
                      className={`border-b border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-[#f9f6f0]'}`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">{project.icon}</span>
                        {project.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">{project.totalDuration}</td>
                      <td className="px-6 py-4 text-gray-700">{project.phases.length} phases</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Important Notes Section */}
      <section className="py-16 bg-[#f9f6f0] border-t border-black/10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl font-bold text-[#171717] mb-6">Important Timeline Notes</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6 border border-black/10">
                <h4 className="font-bold text-[#171717] mb-3 flex items-center gap-2">
                  <span className="text-lg">⏱️</span> Timeline Variables
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Project complexity and scope</li>
                  <li>• Permit approval times</li>
                  <li>• Material availability</li>
                  <li>• Weather conditions</li>
                  <li>• Local inspection schedules</li>
                  <li>• Change orders or modifications</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 border border-black/10">
                <h4 className="font-bold text-[#171717] mb-3 flex items-center gap-2">
                  <span className="text-lg">✓</span> Our Guarantee
                </h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Detailed project schedule provided upfront</li>
                  <li>• Weekly progress updates</li>
                  <li>• Clear communication of any delays</li>
                  <li>• Contingency planning built-in</li>
                  <li>• On-time completion commitment</li>
                  <li>• Realistic estimates based on experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto bg-[#151515] text-white rounded-2xl p-12 text-center">
            <h3 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
              Every project is unique. Let&apos;s discuss your specific needs and create a detailed timeline for your construction project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block px-8 py-3 bg-[#b92516] text-white font-bold rounded-lg hover:bg-[#951e13] transition-colors"
              >
                Get Free Consultation
              </Link>
              <a
                href="tel:9705155059"
                className="inline-block px-8 py-3 bg-white text-[#151515] font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Call (970) 515-5059
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
