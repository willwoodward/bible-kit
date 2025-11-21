export interface WordOccurrence {
  reference: string;
  verse: number;
  context: string;
}

export interface WordAnalysis {
  word: string;
  normalizedWord: string;
  count: number;
  percentageOfPassage: number;
  isStopword: boolean;
  occurrences: WordOccurrence[];
}

export const STOPWORDS = new Set([
  'the', 'and', 'of', 'to', 'a', 'in', 'that', 'is', 'was', 'he', 'for', 'it',
  'with', 'as', 'his', 'on', 'be', 'at', 'by', 'i', 'this', 'had', 'not',
  'are', 'but', 'from', 'or', 'have', 'an', 'they', 'which', 'one', 'you',
  'were', 'her', 'all', 'she', 'there', 'would', 'their', 'we', 'him', 'been',
  'has', 'when', 'who', 'will', 'more', 'if', 'no', 'out', 'so', 'said',
  'what', 'up', 'its', 'about', 'into', 'than', 'them', 'can', 'only', 'other',
  'new', 'some', 'could', 'time', 'these', 'two', 'may', 'then', 'do', 'first',
  'any', 'my', 'now', 'such', 'like', 'our', 'over', 'man', 'me', 'even',
  'most', 'made', 'after', 'also', 'did', 'many', 'before', 'must', 'through',
  'back', 'years', 'where', 'much', 'your', 'way', 'well', 'down', 'should',
  'because', 'each', 'just', 'those', 'people', 'mr', 'how', 'too', 'little',
  'state', 'good', 'very', 'make', 'world', 'still', 'own', 'see', 'men',
  'work', 'long', 'get', 'here', 'between', 'both', 'life', 'being', 'under',
  'never', 'day', 'same', 'another', 'know', 'while', 'last', 'might', 'us',
  'great', 'old', 'year', 'off', 'come', 'since', 'against', 'go', 'came',
  'right', 'used', 'take', 'three',
]);

export function normalizeWord(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, '');
}

export function isStopword(word: string): boolean {
  return STOPWORDS.has(normalizeWord(word));
}
