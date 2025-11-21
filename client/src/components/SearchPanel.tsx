import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

interface SearchPanelProps {
  onClose: () => void;
}

export function SearchPanel({ onClose }: SearchPanelProps) {
  const [query, setQuery] = useState('');

  // Mock search results
  const mockResults = [
    {
      reference: 'John 3:16',
      text: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
    },
    {
      reference: 'Romans 8:28',
      text: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    },
    {
      reference: 'Philippians 4:13',
      text: 'I can do all this through him who gives me strength.',
    },
    {
      reference: 'Psalm 23:1',
      text: 'The Lord is my shepherd, I lack nothing.',
    },
    {
      reference: 'Proverbs 3:5-6',
      text: 'Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.',
    },
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
      <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Search Bible
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded transition-colors"
            aria-label="Close panel"
          >
            <X className="h-5 w-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            type="text"
            placeholder="Search verses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Results */}
      <div className="p-4 space-y-3">
        <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
          {mockResults.length} results found
        </div>

        {mockResults.map((result, idx) => (
          <div
            key={idx}
            className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors cursor-pointer"
          >
            <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-2">
              {result.reference}
            </div>
            <div className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">
              {result.text}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
