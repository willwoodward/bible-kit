import type { Verse, PassageResponse, PassageElement, SearchResponse } from '../types/bible';

const ESV_API_BASE_URL = 'https://api.esv.org/v3/passage/text/';
const ESV_SEARCH_API_URL = 'https://api.esv.org/v3/passage/search/';
const API_KEY = import.meta.env.VITE_ESV_API_KEY;

export async function searchPassages(
  query: string,
  pageSize: number = 20,
  page: number = 1
): Promise<SearchResponse> {
  if (!query.trim()) {
    return {
      page: 1,
      total_results: 0,
      total_pages: 0,
      results: [],
    };
  }

  const params = new URLSearchParams({
    q: query,
    'page-size': pageSize.toString(),
    'page': page.toString(),
  });

  const response = await fetch(`${ESV_SEARCH_API_URL}?${params}`, {
    headers: {
      'Authorization': `Token ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to search passages: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

export async function fetchPassage(book: string, chapter: number): Promise<PassageResponse> {
  const reference = `${book} ${chapter}`;

  const params = new URLSearchParams({
    q: reference,
    'include-headings': 'true',
    'include-footnotes': 'false',
    'include-verse-numbers': 'true',
    'include-short-copyright': 'false',
    'include-passage-references': 'false',
  });

  const response = await fetch(`${ESV_API_BASE_URL}?${params}`, {
    headers: {
      'Authorization': `Token ${API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch passage: ${response.statusText}`);
  }

  const data = await response.json();

  // Parse the text passage
  const passageText = data.passages[0] || '';
  const { verses, elements } = parseTextPassage(passageText);

  return {
    reference: data.canonical || reference,
    passages: data.passages,
    verses,
    elements,
  };
}

function parseTextPassage(text: string): { verses: Verse[]; elements: PassageElement[] } {
  const verses: Verse[] = [];
  const elements: PassageElement[] = [];

  // Split by lines to detect headings and paragraphs
  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      // Empty line = paragraph break
      if (elements.length > 0 && elements[elements.length - 1].type !== 'paragraph-break') {
        elements.push({ type: 'paragraph-break' });
      }
      continue;
    }

    // Check if this line is a heading (no verse numbers and relatively short)
    const hasVerseNumbers = line.match(/\[\d+\]/);

    // Headings are lines without verse numbers that are short
    // Must start with a capital letter and be the first non-empty line or after empty lines
    // Must not be indented (poetry is usually indented)
    const isLikelyHeading = !hasVerseNumbers &&
                           line.length < 80 &&
                           line.length > 3 &&
                           line[0] === line[0].toUpperCase() &&
                           !lines[i].startsWith(' ') && // Not indented
                           (i === 0 || !lines[i - 1].trim()); // First line or after blank line

    if (isLikelyHeading) {
      elements.push({
        type: 'heading',
        content: line,
      });
      continue;
    }

    // Parse verses from this line
    // ESV text API uses [1], [2], etc. for verse numbers
    const versePattern = /\[(\d+)\]\s*/g;
    const parts = line.split(versePattern);

    // parts[0] is text before first verse (usually empty)
    // parts[1] is first verse number, parts[2] is first verse text
    // parts[3] is second verse number, parts[4] is second verse text, etc.

    for (let j = 1; j < parts.length; j += 2) {
      const verseNum = parseInt(parts[j]);
      const verseText = parts[j + 1]?.trim() || '';

      if (verseText) {
        const verse: Verse = {
          number: verseNum,
          text: verseText,
        };
        verses.push(verse);
        elements.push({
          type: 'verse',
          verse,
        });
      }
    }
  }

  return { verses, elements };
}
