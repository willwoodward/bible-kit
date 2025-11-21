import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BiblicalGlobe3D } from './BiblicalGlobe3D';

interface GlobeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobeModal({ isOpen, onClose }: GlobeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50"
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] bg-gradient-to-b from-zinc-900 to-black rounded-xl overflow-hidden shadow-2xl">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 bg-zinc-800/80 hover:bg-zinc-700 rounded-lg transition-colors"
                aria-label="Close 3D view"
              >
                <X className="h-5 w-5 text-zinc-100" />
              </button>

              {/* Title */}
              <div className="absolute top-4 left-4 z-10">
                <h2 className="text-2xl font-bold text-white">
                  Biblical Locations - 3D Globe
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Drag to rotate • Scroll to zoom • Hover over markers for details
                </p>
              </div>

              {/* 3D Globe */}
              <BiblicalGlobe3D />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
