'use client';

import { useState } from 'react';
/* Simple SVG icon components to avoid lucide-react dependency */
const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
);
const Circle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}><circle cx="12" cy="12" r="10"/></svg>
);
const Clock = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const Home = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
);
const Hammer = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15 12-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"/><path d="M17.64 15 22 10.64"/><path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"/></svg>
);
const Paintbrush = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/></svg>
);
const Sparkles = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);

interface ProjectPhase {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  startDate?: string;
  completedDate?: string;
  icon: React.ElementType;
}

interface Project {
  id: string;
  name: string;
  location: string;
  type: string;
  startDate: string;
  estimatedCompletion: string;
  progress: number;
  phases: ProjectPhase[];
}

const activeProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Farmhouse',
    location: 'Windsor, CO',
    type: 'Custom Home Build',
    startDate: '2024-01-15',
    estimatedCompletion: '2024-06-30',
    progress: 65,
    phases: [
      {
        id: 'foundation',
        title: 'Foundation & Framing',
        description: 'Site prep, foundation pour, and structural framing',
        status: 'completed',
        completedDate: '2024-02-28',
        icon: Home
      },
      {
        id: 'rough',
        title: 'Rough-In Work',
        description: 'Plumbing, electrical, and HVAC installation',
        status: 'completed',
        completedDate: '2024-03-15',
        icon: Hammer
      },
      {
        id: 'interior',
        title: 'Interior Finishes',
        description: 'Drywall, flooring, cabinets, and trim work',
        status: 'in-progress',
        startDate: '2024-03-16',
        icon: Paintbrush
      },
      {
        id: 'final',
        title: 'Final Touches',
        description: 'Landscaping, final inspections, and walkthrough',
        status: 'upcoming',
        icon: Sparkles
      }
    ]
  },
  {
    id: '2',
    name: 'Kitchen Remodel',
    location: 'Fort Collins, CO',
    type: 'Renovation',
    startDate: '2024-02-20',
    estimatedCompletion: '2024-04-15',
    progress: 80,
    phases: [
      {
        id: 'demo',
        title: 'Demolition',
        description: 'Remove old cabinets, appliances, and fixtures',
        status: 'completed',
        completedDate: '2024-02-25',
        icon: Hammer
      },
      {
        id: 'rough',
        title: 'Rough-In Updates',
        description: 'Update plumbing and electrical for new layout',
        status: 'completed',
        completedDate: '2024-03-05',
        icon: Home
      },
      {
        id: 'install',
        title: 'Cabinet & Counter Install',
        description: 'Install custom cabinets and granite countertops',
        status: 'completed',
        completedDate: '2024-03-20',
        icon: Paintbrush
      },
      {
        id: 'finish',
        title: 'Finishing Touches',
        description: 'Backsplash, lighting, and final details',
        status: 'in-progress',
        startDate: '2024-03-21',
        icon: Sparkles
      }
    ]
  }
];

export default function ProjectTimeline() {
  const [selectedProject, setSelectedProject] = useState<Project>(activeProjects[0]);

  const getStatusIcon = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProjectPhase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'in-progress':
        return 'bg-blue-50 border-blue-200 ring-2 ring-blue-400 ring-opacity-50';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Active Projects
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track the progress of our current construction projects. We keep clients informed every step of the way.
          </p>
        </div>

        {/* Project Selector */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {activeProjects.map(project => (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`px-6 py-3 rounded-lg border-2 transition-all ${
                selectedProject.id === project.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">{project.name}</div>
                <div className={`text-sm ${
                  selectedProject.id === project.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {project.location} • {project.type}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Project Details */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedProject.name}
              </h3>
              <p className="text-gray-600 mb-4">{selectedProject.type} in {selectedProject.location}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Start Date:</span>
                  <span className="font-medium">
                    {new Date(selectedProject.startDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Est. Completion:</span>
                  <span className="font-medium">
                    {new Date(selectedProject.estimatedCompletion).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="flex flex-col justify-center">
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-gray-600">Overall Progress</span>
                <span className="font-bold text-blue-600">{selectedProject.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${selectedProject.progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Project Timeline</h4>
            <div className="relative">
              {selectedProject.phases.map((phase, index) => (
                <div key={phase.id} className="flex gap-4 relative">
                  {/* Vertical line */}
                  {index < selectedProject.phases.length - 1 && (
                    <div
                      className={`absolute left-[18px] top-12 w-0.5 h-full ${
                        phase.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
                      }`}
                    />
                  )}

                  {/* Status Icon */}
                  <div className="flex-shrink-0 pt-1">
                    {getStatusIcon(phase.status)}
                  </div>

                  {/* Phase Content */}
                  <div
                    className={`flex-1 mb-6 p-4 rounded-lg border ${getStatusColor(phase.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <phase.icon className="w-5 h-5 text-gray-600" />
                        <h5 className="font-semibold text-gray-900">{phase.title}</h5>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-100 text-green-700' :
                        phase.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {phase.status === 'in-progress' ? 'In Progress' :
                         phase.status === 'completed' ? 'Completed' : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{phase.description}</p>
                    {phase.completedDate && (
                      <p className="text-xs text-gray-500">
                        Completed: {new Date(phase.completedDate).toLocaleDateString()}
                      </p>
                    )}
                    {phase.status === 'in-progress' && phase.startDate && (
                      <p className="text-xs text-blue-600">
                        Started: {new Date(phase.startDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-blue-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Want Updates on Your Project?
          </h3>
          <p className="text-gray-600 mb-6">
            We provide regular progress updates and photos throughout your project.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Your Project
          </a>
        </div>
      </div>
    </section>
  );
}