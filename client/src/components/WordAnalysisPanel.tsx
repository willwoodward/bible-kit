import { motion } from 'framer-motion';
import { X, BarChart3, BookOpen, Hash } from 'lucide-react';
import type { WordAnalysis } from '../types/wordAnalysis';
import { VerseCard } from './VerseCard';

interface WordAnalysisPanelProps {
  analysis: WordAnalysis;
  onClose: () => void;
  onVerseClick?: (reference: string) => void;
}

export function WordAnalysisPanel({ analysis, onClose, onVerseClick }: WordAnalysisPanelProps) {
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
          Word Analysis
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
        {/* Selected Word */}
        <div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            {analysis.word}
          </div>
          {analysis.isStopword && (
            <div className="inline-block px-2 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs rounded">
              Common word
            </div>
          )}
        </div>

        {/* Frequency in Current Passage */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <BarChart3 className="h-4 w-4" />
            Frequency in This Passage
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {analysis.count}
              </span>
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                {analysis.count === 1 ? 'occurrence' : 'occurrences'}
              </span>
            </div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              {analysis.percentageOfPassage.toFixed(1)}% of all words
            </div>
          </div>
        </div>

        {/* Occurrences Across Bible */}
        {!analysis.isStopword && analysis.occurrences.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <BookOpen className="h-4 w-4" />
              Other Occurrences
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysis.occurrences.slice(0, 10).map((occ, idx) => (
                <VerseCard
                  key={idx}
                  reference={occ.reference}
                  content={occ.context}
                  onClick={() => onVerseClick?.(occ.reference)}
                />
              ))}
              {analysis.occurrences.length > 10 && (
                <div className="text-xs text-center text-zinc-500 dark:text-zinc-500 py-2">
                  + {analysis.occurrences.length - 10} more occurrences
                </div>
              )}
            </div>
          </div>
        )}

        {/* Statistical Info */}
        <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <Hash className="h-4 w-4" />
            Statistics
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Word Length</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {analysis.normalizedWord.length} letters
              </div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Type</div>
              <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                {analysis.isStopword ? 'Common' : 'Significant'}
              </div>
            </div>
          </div>
        </div>

        {/* Future: Greek/Hebrew Root */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="text-sm text-zinc-500 dark:text-zinc-500 italic">
            Greek/Hebrew root analysis coming soon...
          </div>
        </div>
      </div>
    </motion.div>
  );
}
