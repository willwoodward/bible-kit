import { motion } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { searchPassages } from '../services/esvApi';
import type { SearchResult } from '../types/bible';
import { VerseCard } from './VerseCard';

interface SearchPanelProps {
  onClose: () => void;
  onVerseClick?: (reference: string) => void;
}

const PAGE_SIZE = 10;

export function SearchPanel({ onClose, onVerseClick }: SearchPanelProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Debounced search effect (initial search)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setTotalResults(0);
      setError(null);
      setCurrentPage(1);
      setHasMore(false);
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentPage(1);

    const timer = setTimeout(async () => {
      try {
        const data = await searchPassages(query, PAGE_SIZE, 1);
        setResults(data.results);
        setTotalResults(data.total_results);
        setHasMore(data.total_pages > 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search passages');
        setResults([]);
        setTotalResults(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Load more results
  const loadMore = useCallback(async () => {
    if (!query.trim() || loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const data = await searchPassages(query, PAGE_SIZE, nextPage);
      setResults(prev => [...prev, ...data.results]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more results');
    } finally {
      setLoadingMore(false);
    }
  }, [query, currentPage, hasMore, loadingMore]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loadingMore, loadMore]);

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
            id="bible-search-input"
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
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-zinc-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-sm text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 text-center py-8">
            No results found for "{query}"
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <>
            <div className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Showing {results.length} of {totalResults} result{totalResults !== 1 ? 's' : ''}
            </div>

            {results.map((result, idx) => (
              <VerseCard
                key={idx}
                reference={result.reference}
                content={result.content}
                onClick={() => onVerseClick?.(result.reference)}
              />
            ))}

            {/* Infinite scroll trigger */}
            {hasMore && (
              <div ref={observerTarget} className="py-4 flex justify-center">
                {loadingMore && (
                  <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                )}
              </div>
            )}
          </>
        )}

        {!loading && !error && !query && (
          <div className="text-sm text-zinc-600 dark:text-zinc-400 text-center py-8">
            Enter a search query to find verses
          </div>
        )}

        {/* ESV Attribution */}
        <div className="mt-8 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
            Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®),
            © 2001 by Crossway, a publishing ministry of Good News Publishers. Used by permission.
            All rights reserved.{' '}
            <a
              href="https://www.esv.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-zinc-700 dark:hover:text-zinc-400"
            >
              ESV.org
            </a>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
