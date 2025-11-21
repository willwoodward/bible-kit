import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { NavigationBar } from './components/NavigationBar'
import { PassageDisplay } from './components/PassageDisplay'
import { ThemeProvider } from './components/ThemeProvider'
import { Sidebar } from './components/Sidebar'
import { SearchPanel } from './components/SearchPanel'
import { ContextPanel } from './components/ContextPanel'
import { AnalysisPanel } from './components/AnalysisPanel'
import { CommandPalette } from './components/CommandPalette'
import { fetchPassage } from './services/esvApi'
import type { PassageElement } from './types/bible'

function App() {
  const [book, setBook] = useState('Genesis')
  const [chapter, setChapter] = useState(1)
  const [reference, setReference] = useState('')
  const [elements, setElements] = useState<PassageElement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'search' | 'context' | 'analysis' | null>(null)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [hoveredWordFromAnalysis, setHoveredWordFromAnalysis] = useState<string | null>(null)
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null)
  const [selectedSection, setSelectedSection] = useState<string | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<boolean>(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)

  // Wrapper functions to ensure only one type of selection is active at a time
  const handleWordSelect = (word: string | null) => {
    setSelectedWord(word)
    if (word) {
      setSelectedVerse(null)
      setSelectedSection(null)
      setSelectedChapter(false)
    }
  }

  const handleVerseSelect = (verse: number | null) => {
    setSelectedVerse(verse)
    if (verse) {
      setSelectedWord(null)
      setSelectedSection(null)
      setSelectedChapter(false)
    }
  }

  const handleSectionSelect = (section: string | null) => {
    setSelectedSection(section)
    if (section) {
      setSelectedWord(null)
      setSelectedVerse(null)
      setSelectedChapter(false)
    }
  }

  const handleChapterSelect = (selected: boolean) => {
    setSelectedChapter(selected)
    if (selected) {
      setSelectedWord(null)
      setSelectedVerse(null)
      setSelectedSection(null)
    }
  }

  // Handle command palette commands
  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim()

    // Verse navigation: v30
    const verseMatch = cmd.match(/^v(\d+)$/)
    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1])
      handleVerseSelect(verseNum)
      setTimeout(() => {
        const verseElement = document.querySelector(`[data-verse="${verseNum}"]`)
        if (verseElement) {
          verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
      return
    }

    // Chapter navigation: ch2
    const chapterMatch = cmd.match(/^ch(\d+)$/)
    if (chapterMatch) {
      const chapterNum = parseInt(chapterMatch[1])
      loadPassage(book, chapterNum)
      return
    }
  }

  // Navigate to a specific verse reference (e.g., "John 3:16")
  const navigateToVerse = async (reference: string) => {
    // Parse reference like "John 3:16" or "1 John 2:15" or "Psalm 23:1"
    const match = reference.match(/^((?:\d\s)?[A-Za-z]+)\s+(\d+):(\d+)/)
    if (!match) return

    const bookName = match[1].trim()
    const chapterNum = parseInt(match[2])
    const verseNum = parseInt(match[3])

    // Load the passage
    await loadPassage(bookName, chapterNum)

    // Select and highlight the verse
    handleVerseSelect(verseNum)

    // Scroll to verse
    setTimeout(() => {
      const verseElement = document.querySelector(`[data-verse="${verseNum}"]`)
      if (verseElement) {
        verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 300)
  }

  const loadPassage = async (bookName: string, chapterNum: number) => {
    setLoading(true)
    setError(null)

    // Clear verse selection when changing chapters
    setSelectedVerse(null)
    setSelectedWord(null)
    setSelectedSection(null)
    setSelectedChapter(false)

    try {
      const data = await fetchPassage(bookName, chapterNum)

      // Parse the canonical reference to get actual book and chapter
      // Format is like "Genesis 1" or "Psalm 119"
      const canonicalParts = data.reference.match(/^(.*?)\s+(\d+)/)
      if (canonicalParts) {
        const actualBook = canonicalParts[1]
        const actualChapter = parseInt(canonicalParts[2])
        setBook(actualBook)
        setChapter(actualChapter)
      } else {
        setBook(bookName)
        setChapter(chapterNum)
      }

      setReference(data.reference)
      setElements(data.elements)

      // Scroll to top when changing chapters
      setTimeout(() => {
        const scrollContainer = document.querySelector('.h-\\[calc\\(100vh-3rem\\)\\]')
        if (scrollContainer) {
          scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
        }
      }, 100)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load passage')
      setElements([])
    } finally {
      setLoading(false)
    }
  }

  // Load Genesis 1 on initial render
  useEffect(() => {
    loadPassage('Genesis', 1)
  }, [])

  // Close all panels with CTRL+C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'c') {
        e.preventDefault()
        setActivePanel(null)
        setSelectedWord(null)
        setSelectedVerse(null)
        setSelectedSection(null)
        setSelectedChapter(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Panel shortcuts: S for search, I for context/info, A for analysis, / for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === '/') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault()
        setActivePanel('search')
        // Focus search input after panel opens
        setTimeout(() => {
          const searchInput = document.getElementById('bible-search-input') as HTMLInputElement
          if (searchInput) {
            searchInput.focus()
          }
        }, 100)
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault()
        setActivePanel('context')
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault()
        setActivePanel('analysis')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ThemeProvider defaultTheme="system" storageKey="bible-app-theme">
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <NavigationBar
          onNavigate={loadPassage}
          currentBook={book}
          currentChapter={chapter}
        />

        <Sidebar
          activePanel={activePanel}
          onPanelChange={setActivePanel}
        />

        <AnimatePresence>
          {activePanel === 'search' && (
            <SearchPanel
              key="search"
              onClose={() => setActivePanel(null)}
              onVerseClick={navigateToVerse}
            />
          )}
          {activePanel === 'context' && (
            <ContextPanel key="context" onClose={() => setActivePanel(null)} />
          )}
          {activePanel === 'analysis' && (
            <AnalysisPanel
              key="analysis"
              onClose={() => setActivePanel(null)}
              elements={elements}
              reference={reference}
              onWordHover={setHoveredWordFromAnalysis}
              onWordClick={setSelectedWord}
            />
          )}
        </AnimatePresence>

        <div className="ml-16">
          <PassageDisplay
            reference={reference}
            elements={elements}
            loading={loading}
            error={error}
            selectedWord={selectedWord}
            onWordSelect={handleWordSelect}
            hoveredWordFromAnalysis={hoveredWordFromAnalysis}
            selectedVerse={selectedVerse}
            onVerseSelect={handleVerseSelect}
            selectedSection={selectedSection}
            onSectionSelect={handleSectionSelect}
            selectedChapter={selectedChapter}
            onChapterSelect={handleChapterSelect}
            onVerseClick={navigateToVerse}
          />
        </div>

        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onCommand={handleCommand}
          currentBook={book}
          currentChapter={chapter}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
