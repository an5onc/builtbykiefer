'use client';

import { useState, useEffect } from 'react';

interface Update {
  id: string;
  projectName: string;
  phase: string;
  message: string;
  timestamp: string;
  type: 'milestone' | 'progress' | 'photo' | 'weather';
  imageUrl?: string;
}

const recentUpdates: Update[] = [
  {
    id: '1',
    projectName: 'Modern Farmhouse',
    phase: 'Interior Finishes',
    message: 'Custom kitchen cabinets installed! Beautiful white shaker style with soft-close drawers.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    type: 'milestone',
    imageUrl: '/projects/farmhouse-kitchen.jpg'
  },
  {
    id: '2',
    projectName: 'Kitchen Remodel',
    phase: 'Finishing Touches',
    message: 'Subway tile backsplash complete. Final inspection scheduled for tomorrow.',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    type: 'progress'
  },
  {
    id: '3',
    projectName: 'Modern Farmhouse',
    phase: 'Interior Finishes',
    message: 'Hardwood flooring installation in progress. Oak with natural finish throughout main level.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    type: 'photo',
    imageUrl: '/projects/farmhouse-flooring.jpg'
  }
];

const Bell = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
  </svg>
);

const Camera = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
);

const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const Cloud = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
  </svg>
);

export default function ProjectUpdateNotification() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState<Update | null>(null);
  const [hasNewUpdates, setHasNewUpdates] = useState(true);

  useEffect(() => {
    // Simulate checking for new updates every 30 seconds
    const interval = setInterval(() => {
      setHasNewUpdates(true);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getUpdateIcon = (type: Update['type']) => {
    switch (type) {
      case 'milestone':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'photo':
        return <Camera className="w-5 h-5 text-blue-500" />;
      case 'weather':
        return <Cloud className="w-5 h-5 text-gray-500" />;
      default:
        return <Bell className="w-5 h-5 text-orange-500" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <>
      {/* Notification Bell Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setHasNewUpdates(false);
        }}
        className="fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
        aria-label="View project updates"
      >
        <Bell className="w-6 h-6" />
        {hasNewUpdates && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping" />
        )}
      </button>

      {/* Updates Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Project Updates</h2>
                    <p className="text-blue-100 text-sm">Real-time progress on your projects</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Updates List */}
              <div className="flex-1 overflow-y-auto">
                {recentUpdates.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {recentUpdates.map((update) => (
                      <div
                        key={update.id}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedUpdate(update)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getUpdateIcon(update.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {update.projectName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {update.phase}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                {formatTimestamp(update.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {update.message}
                            </p>
                            {update.imageUrl && (
                              <div className="mt-2">
                                <span className="inline-flex items-center text-xs text-blue-600">
                                  <Camera className="w-3 h-3 mr-1" />
                                  Photo available
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                    <Bell className="w-12 h-12 mb-4 text-gray-300" />
                    <p className="text-center">No updates yet</p>
                    <p className="text-sm text-center mt-2">
                      We\'ll notify you when there\'s progress on your projects
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Subscribe to Email Updates
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Detail Modal */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSelectedUpdate(null)}
          />
          <div className="relative bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedUpdate.projectName}
                  </h3>
                  <p className="text-sm text-gray-500">{selectedUpdate.phase}</p>
                </div>
                <button
                  onClick={() => setSelectedUpdate(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {selectedUpdate.imageUrl && (
                <div className="mb-4 bg-gray-100 rounded-lg h-48 flex items-center justify-center text-gray-400">
                  <Camera className="w-12 h-12" />
                  <span className="ml-2">Photo would display here</span>
                </div>
              )}

              <p className="text-gray-700 mb-4">{selectedUpdate.message}</p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{formatTimestamp(selectedUpdate.timestamp)}</span>
                <div className="flex gap-2">
                  {getUpdateIcon(selectedUpdate.type)}
                  <span className="capitalize">{selectedUpdate.type} Update</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}