import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { X, BarChart3, TrendingUp } from 'lucide-react';
import type { PassageElement } from '../types/bible';
import { normalizeWord, isStopword } from '../types/wordAnalysis';

interface AnalysisPanelProps {
  onClose: () => void;
  elements: PassageElement[];
  reference: string;
  onWordHover: (word: string | null) => void;
  onWordClick: (word: string) => void;
}

export function AnalysisPanel({ onClose, elements, reference, onWordHover, onWordClick }: AnalysisPanelProps) {
  // Calculate real word frequency from passage
  const { wordFrequency, totalWords, uniqueWords, verseCount } = useMemo(() => {
    const wordMap = new Map<string, number>();
    let total = 0;
    let verses = 0;

    elements.forEach((element) => {
      if (element.type === 'verse' && element.verse) {
        verses++;
        const words = element.verse.text.match(/\b[\w']+\b/g) || [];
        words.forEach((word) => {
          const normalized = normalizeWord(word);
          if (normalized && !isStopword(word)) {
            total++;
            wordMap.set(normalized, (wordMap.get(normalized) || 0) + 1);
          }
        });
      }
    });

    // Convert to array and sort by count
    const sortedWords = Array.from(wordMap.entries())
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate percentages
    const maxCount = sortedWords[0]?.count || 1;
    const withPercentages = sortedWords.map((item) => ({
      ...item,
      percentage: (item.count / maxCount) * 100,
    }));

    return {
      wordFrequency: withPercentages,
      totalWords: total,
      uniqueWords: wordMap.size,
      verseCount: verses,
    };
  }, [elements]);

  // Mock thematic analysis (can be enhanced later)
  const themes = [
    { theme: 'Faith & Belief', strength: 75 },
    { theme: 'Divine Action', strength: 65 },
    { theme: 'Human Nature', strength: 55 },
    { theme: 'Covenant', strength: 45 },
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
          Analysis
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
        {/* Word Frequency */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Most Frequent Words
            </h3>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            Top 10 significant words in current passage
          </div>

          <div className="space-y-2">
            {wordFrequency.map((item, idx) => (
              <div
                key={idx}
                className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 p-2 -mx-2 rounded transition-colors"
                onMouseEnter={() => onWordHover(normalizeWord(item.word))}
                onMouseLeave={() => onWordHover(null)}
                onClick={() => onWordClick(normalizeWord(item.word))}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {item.word}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {item.count}
                  </span>
                </div>
                <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Thematic Analysis */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Key Themes
            </h3>
          </div>

          <div className="space-y-3">
            {themes.map((theme, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {theme.theme}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    {theme.strength}%
                  </span>
                </div>
                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${theme.strength}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Passage Statistics
          </h3>
          <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
            {reference}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Total Words</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {totalWords}
              </div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Unique Words</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {uniqueWords}
              </div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Verses</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {verseCount}
              </div>
            </div>
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">Avg Word/Verse</div>
              <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {verseCount > 0 ? (totalWords / verseCount).toFixed(1) : '0'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
