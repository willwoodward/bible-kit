import { motion } from 'framer-motion';
import { X, BookOpen, Hash, FileText } from 'lucide-react';

interface VerseAnalysisPanelProps {
  type: 'verse' | 'section' | 'chapter';
  identifier: string | number;
  onClose: () => void;
}

export function VerseAnalysisPanel({ type, identifier, onClose }: VerseAnalysisPanelProps) {
  const getTitle = () => {
    if (type === 'verse') return `Verse ${identifier}`;
    if (type === 'section') return identifier as string;
    return 'Chapter Analysis';
  };

  const getIcon = () => {
    if (type === 'verse') return Hash;
    if (type === 'section') return FileText;
    return BookOpen;
  };

  const Icon = getIcon();

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
      className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-zinc-900 shadow-2xl border-l border-zinc-200 dark:border-zinc-800 overflow-y-auto z-40 pt-12"
    >
      <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {type === 'verse' && 'Verse Analysis'}
          {type === 'section' && 'Section Analysis'}
          {type === 'chapter' && 'Chapter Analysis'}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
          aria-label="Close panel"
        >
          <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Selected Item */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {getTitle()}
            </div>
          </div>
        </div>

        {/* Boilerplate Content */}
        <div className="space-y-4">
          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Coming Soon
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {type === 'verse' && 'Detailed verse analysis including cross-references, commentary, and theological insights will be available here.'}
              {type === 'section' && 'Section overview with thematic analysis, key verses, and related passages will be available here.'}
              {type === 'chapter' && 'Comprehensive chapter summary, structure analysis, and main themes will be available here.'}
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Cross References
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 italic">
              Related passages will appear here...
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Commentary
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 italic">
              Commentary and insights will appear here...
            </div>
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
            <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Study Notes
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 italic">
              Study notes and additional resources will appear here...
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
