import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import type { PassageElement } from '../types/bible';
import type { WordAnalysis, WordOccurrence } from '../types/wordAnalysis';
import { normalizeWord, isStopword } from '../types/wordAnalysis';
import { Loader2, AlertCircle } from 'lucide-react';
import { WordAnalysisPanel } from './WordAnalysisPanel';

interface PassageDisplayProps {
  reference: string;
  elements: PassageElement[];
  loading?: boolean;
  error?: string | null;
  selectedWord: string | null;
  onWordSelect: (word: string | null) => void;
  hoveredWordFromAnalysis: string | null;
}

export function PassageDisplay({ reference, elements, loading, error, selectedWord, onWordSelect, hoveredWordFromAnalysis }: PassageDisplayProps) {
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);

  // Calculate word frequencies and build word map
  const wordMap = useMemo(() => {
    const map = new Map<string, { count: number; originalWords: string[]; verses: number[] }>();

    elements.forEach((element) => {
      if (element.type === 'verse' && element.verse) {
        const words = element.verse.text.match(/\b[\w']+\b/g) || [];
        words.forEach((word) => {
          const normalized = normalizeWord(word);
          if (normalized) {
            const existing = map.get(normalized);
            if (existing) {
              existing.count++;
              if (!existing.originalWords.includes(word)) {
                existing.originalWords.push(word);
              }
              if (!existing.verses.includes(element.verse!.number)) {
                existing.verses.push(element.verse!.number);
              }
            } else {
              map.set(normalized, {
                count: 1,
                originalWords: [word],
                verses: [element.verse.number],
              });
            }
          }
        });
      }
    });

    return map;
  }, [elements]);

  // Calculate total word count
  const totalWords = useMemo(() => {
    return Array.from(wordMap.values()).reduce((sum, data) => sum + data.count, 0);
  }, [wordMap]);

  // Analyze a word when clicked
  const analyzeWord = (word: string): WordAnalysis => {
    const normalized = normalizeWord(word);
    const wordData = wordMap.get(normalized);

    if (!wordData) {
      return {
        word,
        normalizedWord: normalized,
        count: 0,
        percentageOfPassage: 0,
        isStopword: isStopword(word),
        occurrences: [],
      };
    }

    // Mock concordance data (will be replaced by Python backend)
    const mockOccurrences: WordOccurrence[] = isStopword(word) ? [] : [
      {
        reference: 'John 1:1',
        verse: 1,
        context: `In the beginning was the Word, and the Word was with God, and the Word was God.`,
      },
      {
        reference: 'Romans 8:28',
        verse: 28,
        context: `And we know that in all things God works for the good of those who love him.`,
      },
      {
        reference: 'Philippians 4:13',
        verse: 13,
        context: `I can do all this through him who gives me strength.`,
      },
    ].filter(occ =>
      occ.context.toLowerCase().includes(normalized)
    );

    return {
      word: wordData.originalWords[0],
      normalizedWord: normalized,
      count: wordData.count,
      percentageOfPassage: (wordData.count / totalWords) * 100,
      isStopword: isStopword(word),
      occurrences: mockOccurrences,
    };
  };

  // Render a word with interactive styling
  const renderWord = (word: string, index: number, verseNum: number) => {
    const normalized = normalizeWord(word);
    const isSelected = selectedWord === normalized;
    const isHovered = hoveredWord === normalized || hoveredWordFromAnalysis === normalized;

    return (
      <span
        key={`${verseNum}-word-${index}`}
        className={`
          cursor-pointer transition-all duration-150 rounded px-0.5
          ${isSelected ? 'bg-yellow-200 dark:bg-yellow-900/40 font-medium' : ''}
          ${isHovered && !isSelected ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}
          hover:bg-yellow-50 dark:hover:bg-yellow-950/20
        `}
        onClick={() => onWordSelect(isSelected ? null : normalized)}
        onMouseEnter={() => setHoveredWord(normalized)}
        onMouseLeave={() => setHoveredWord(null)}
      >
        {word}
      </span>
    );
  };

  // Tokenize verse text into words and punctuation
  const tokenizeVerse = (text: string, verseNum: number) => {
    const tokens: JSX.Element[] = [];
    const regex = /(\b[\w']+\b|[^\w\s']+|\s+)/g;
    let match;
    let index = 0;

    while ((match = regex.exec(text)) !== null) {
      const token = match[0];

      if (/\b[\w']+\b/.test(token)) {
        // It's a word
        tokens.push(renderWord(token, index, verseNum));
      } else {
        // It's punctuation or whitespace
        tokens.push(
          <span key={`${verseNum}-punct-${index}`}>{token}</span>
        );
      }
      index++;
    }

    return tokens;
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading passage...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm">Error: {error}</span>
        </div>
      </div>
    );
  }

  if (elements.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
        <div className="text-zinc-500 text-sm">No verses to display</div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3rem)] overflow-y-auto bg-zinc-50 dark:bg-zinc-900">
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-8 sm:p-12 min-h-[85vh]">
        <h1 className="text-3xl font-semibold mb-8 text-zinc-900">
          {reference}
        </h1>

        <div className="text-zinc-800 leading-relaxed">
          {elements.map((element, index) => {
            if (element.type === 'heading') {
              return (
                <h2
                  key={`heading-${index}`}
                  className="text-xl font-semibold mt-10 mb-5 text-zinc-900 first:mt-0"
                >
                  {element.content}
                </h2>
              );
            }

            if (element.type === 'paragraph-break') {
              return <div key={`break-${index}`} className="h-4" />;
            }

            if (element.type === 'verse' && element.verse) {
              return (
                <span key={`verse-${element.verse.number}`} className="text-[16px] leading-[1.8]">
                  <sup className="text-zinc-400 text-[11px] font-medium mr-1.5">
                    {element.verse.number}
                  </sup>
                  {tokenizeVerse(element.verse.text, element.verse.number)}{' '}
                </span>
              );
            }

            return null;
          })}
        </div>

        <div className="mt-16 pt-8 border-t border-zinc-200">
          <p className="text-xs text-zinc-500">
            Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®).
          </p>
        </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedWord && (
          <WordAnalysisPanel
            key="word-analysis"
            analysis={analyzeWord(selectedWord)}
            onClose={() => onWordSelect(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
