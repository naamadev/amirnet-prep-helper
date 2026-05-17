export interface User {
  id: number;
  email: string;
  name: string;
  googleId: string;
}

export interface WordItem {
  wordId: number;
  englishWord: string;
  hebrewTranslation: string;
  originalHebrewTranslation: string;
  partOfSpeech: string | null;
  isLearned: boolean;
  hasCustomTranslation: boolean;
}

export interface WordsResponse {
  words: WordItem[];
  total: number;
}

export interface JobStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  wordCount?: number;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export type PartOfSpeechType = 'Noun' | 'Verb' | 'Adjective' | 'Adverb' | 'Other';
