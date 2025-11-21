import { useState, useEffect } from 'react'
import { NavigationBar } from './components/NavigationBar'
import { PassageDisplay } from './components/PassageDisplay'
import { ThemeProvider } from './components/ThemeProvider'
import { fetchPassage } from './services/esvApi'
import type { PassageElement } from './types/bible'

function App() {
  const [book, setBook] = useState('Genesis')
  const [chapter, setChapter] = useState(1)
  const [reference, setReference] = useState('')
  const [elements, setElements] = useState<PassageElement[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPassage = async (bookName: string, chapterNum: number) => {
    setLoading(true)
    setError(null)

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

  return (
    <ThemeProvider defaultTheme="system" storageKey="bible-app-theme">
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
        <NavigationBar
          onNavigate={loadPassage}
          currentBook={book}
          currentChapter={chapter}
        />

        <PassageDisplay
          reference={reference}
          elements={elements}
          loading={loading}
          error={error}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
