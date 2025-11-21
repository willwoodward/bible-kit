import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { ThemeToggle } from './ThemeToggle';
import { FullscreenToggle } from './FullscreenToggle';

interface NavigationBarProps {
  onNavigate: (book: string, chapter: number) => void;
  currentBook: string;
  currentChapter: number;
}

export function NavigationBar({ onNavigate, currentBook, currentChapter }: NavigationBarProps) {
  const [book, setBook] = useState(currentBook);
  const [chapter, setChapter] = useState(currentChapter.toString());
  const bookInputRef = useRef<HTMLInputElement>(null);
  const chapterInputRef = useRef<HTMLInputElement>(null);

  // Update inputs when props change (e.g., from keyboard navigation)
  useEffect(() => {
    setBook(currentBook);
    setChapter(currentChapter.toString());
  }, [currentBook, currentChapter]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      const isTyping = (e.target as HTMLElement)?.tagName === 'INPUT';

      // Ctrl+Shift+K or Cmd+Shift+K to focus book input
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        bookInputRef.current?.focus();
        bookInputRef.current?.select();
        return;
      }

      // Escape to blur inputs
      if (e.key === 'Escape') {
        bookInputRef.current?.blur();
        chapterInputRef.current?.blur();
        return;
      }

      // Don't navigate if typing
      if (isTyping) return;

      // Arrow keys or n/p for next/previous chapter
      if (e.key === 'ArrowRight' || e.key === 'n') {
        e.preventDefault();
        const nextChapter = currentChapter + 1;
        onNavigate(currentBook, nextChapter);
      }

      if (e.key === 'ArrowLeft' || e.key === 'p') {
        e.preventDefault();
        if (currentChapter > 1) {
          const prevChapter = currentChapter - 1;
          onNavigate(currentBook, prevChapter);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentBook, currentChapter, onNavigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const chapterNum = parseInt(chapter);
    if (book && !isNaN(chapterNum) && chapterNum > 0) {
      onNavigate(book, chapterNum);
      // Blur inputs after navigation
      bookInputRef.current?.blur();
      chapterInputRef.current?.blur();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: 'book' | 'chapter') => {
    if (e.key === 'Enter') {
      const chapterNum = parseInt(chapter);
      if (book && !isNaN(chapterNum) && chapterNum > 0) {
        onNavigate(book, chapterNum);
        // Blur inputs after navigation
        bookInputRef.current?.blur();
        chapterInputRef.current?.blur();
      }
    }

    // Tab from book to chapter
    if (e.key === 'Tab' && field === 'book') {
      e.preventDefault();
      chapterInputRef.current?.focus();
      chapterInputRef.current?.select();
    }
  };

  return (
    <nav className="bg-black text-white sticky top-0 z-50 shadow-sm">
      <div className="px-6 py-2 flex items-center justify-between">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <Input
            ref={bookInputRef}
            type="text"
            value={book}
            onChange={(e) => setBook(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'book')}
            placeholder="Book"
            className="h-8 w-32 bg-zinc-900 border-zinc-800 text-white text-sm placeholder:text-zinc-500"
          />
          <Input
            ref={chapterInputRef}
            type="number"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            onKeyDown={(e) => handleKeyPress(e, 'chapter')}
            placeholder="Ch"
            min="1"
            className="h-8 w-16 bg-zinc-900 border-zinc-800 text-white text-sm placeholder:text-zinc-500"
          />
        </form>

        <div className="flex items-center gap-2">
          <FullscreenToggle />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
