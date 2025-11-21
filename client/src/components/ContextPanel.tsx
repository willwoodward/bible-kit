import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Clock } from 'lucide-react';
import { BiblicalMap2D } from './BiblicalMap2D';
import { GlobeModal } from './GlobeModal';

interface ContextPanelProps {
  onClose: () => void;
}

export function ContextPanel({ onClose }: ContextPanelProps) {
  const [isGlobeOpen, setIsGlobeOpen] = useState(false);
  // Mock location data
  const locations = [
    { name: 'Garden of Eden', coords: 'Ancient Near East', era: 'Creation' },
    { name: 'Mount Sinai', coords: 'Sinai Peninsula', era: 'Exodus Era' },
    { name: 'Jerusalem', coords: '31.7683°N, 35.2137°E', era: 'Kingdom Era' },
  ];

  // Mock timeline data
  const timelineEvents = [
    { event: 'Creation', year: '~4000 BC', book: 'Genesis 1-2' },
    { event: 'The Flood', year: '~2500 BC', book: 'Genesis 6-9' },
    { event: 'Abraham Called', year: '~2000 BC', book: 'Genesis 12' },
    { event: 'Exodus from Egypt', year: '~1446 BC', book: 'Exodus 12' },
    { event: 'David Anointed King', year: '~1010 BC', book: '2 Samuel 2' },
    { event: 'Birth of Jesus', year: '~4 BC', book: 'Matthew 1-2' },
  ];

  return (
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      exit={{ x: '-100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-16 top-12 h-[calc(100vh-3rem)] w-96 bg-white dark:bg-zinc-900 shadow-2xl border-r border-zinc-200 dark:border-zinc-800 overflow-y-auto z-30"
    >
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Context
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
          aria-label="Close panel"
        >
          <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Location Context */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Key Locations
            </h3>
          </div>

          {/* Interactive 2D Map */}
          <div className="mb-3">
            <BiblicalMap2D onExpand={() => setIsGlobeOpen(true)} />
          </div>

          <div className="space-y-2">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <div className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                  {loc.name}
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                  {loc.coords}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                  {loc.era}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Context */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Timeline
            </h3>
          </div>

          <div>
            {timelineEvents.map((event, idx) => (
              <div key={idx} className="flex gap-3">
                {/* Timeline line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-zinc-900 shrink-0" />
                  {idx < timelineEvents.length - 1 && (
                    <div className="w-0.5 h-full bg-zinc-300 dark:bg-zinc-700 mt-1 mb-1" />
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-6">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {event.event}
                  </div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    {event.year}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    {event.book}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3D Globe Modal */}
      <GlobeModal isOpen={isGlobeOpen} onClose={() => setIsGlobeOpen(false)} />
    </motion.div>
  );
}
