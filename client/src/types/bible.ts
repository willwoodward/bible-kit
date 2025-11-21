export interface Verse {
  number: number;
  text: string;
}

export interface PassageElement {
  type: 'heading' | 'verse' | 'paragraph-break';
  content?: string;
  verse?: Verse;
}

export interface PassageResponse {
  reference: string;
  passages: string[];
  verses: Verse[];
  elements: PassageElement[];
}

export interface SearchResult {
  reference: string;
  content: string;
}

export interface SearchResponse {
  page: number;
  total_results: number;
  total_pages: number;
  results: SearchResult[];
}
