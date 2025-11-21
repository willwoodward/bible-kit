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
