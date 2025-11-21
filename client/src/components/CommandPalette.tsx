import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Command } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onCommand: (command: string) => void;
  currentBook: string;
  currentChapter: number;
}

export function CommandPalette({ isOpen, onClose, onCommand, currentBook, currentChapter }: CommandPaletteProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim());
      setInput('');
      onClose();
    }
  };

  const getHint = () => {
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return 'Try: v30 (go to verse), ch2 (go to chapter)';
    if (trimmed.match(/^v\d*$/)) return 'Press Enter to go to verse';
    if (trimmed.match(/^ch\d*$/)) return 'Press Enter to go to chapter';
    return 'Unknown command';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-32"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: -20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: -20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-xl mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-2xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
              <Command className="h-5 w-5 text-zinc-400" />
              <form onSubmit={handleSubmit} className="flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter command..."
                  className="w-full bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                />
              </form>
            </div>

            {/* Current context */}
            <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
              <div className="text-xs text-zinc-600 dark:text-zinc-400">
                Current: {currentBook} {currentChapter}
              </div>
            </div>

            {/* Hint */}
            <div className="px-4 py-3">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {getHint()}
              </div>
            </div>

            {/* Examples */}
            <div className="px-4 py-3 border-t border-zinc-200 dark:border-zinc-700 space-y-2">
              <div className="text-xs font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-wide">
                Examples
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <code className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    v30
                  </code>
                  <span className="text-zinc-600 dark:text-zinc-400">Go to verse 30</span>
                </div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-700 rounded text-zinc-700 dark:text-zinc-300 font-mono text-xs">
                    ch2
                  </code>
                  <span className="text-zinc-600 dark:text-zinc-400">Go to chapter 2</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
