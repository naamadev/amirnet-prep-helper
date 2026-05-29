import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface DictionaryDefinition {
  definition: string;
  example?: string;
}

interface DictionaryMeaning {
  partOfSpeech: string;
  definitions: DictionaryDefinition[];
}

interface DictionaryEntry {
  word: string;
  meanings: DictionaryMeaning[];
}

export interface WordExample {
  partOfSpeech: string;
  example: string;
}

async function fetchExamples(word: string): Promise<WordExample[]> {
  const { data } = await axios.get<DictionaryEntry[]>(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
  );

  const examples: WordExample[] = [];
  for (const entry of data) {
    for (const meaning of entry.meanings) {
      for (const def of meaning.definitions) {
        if (def.example) {
          examples.push({ partOfSpeech: meaning.partOfSpeech, example: def.example });
          if (examples.length >= 4) return examples;
        }
      }
    }
  }
  return examples;
}

export function useWordExamples(word: string, enabled: boolean) {
  return useQuery<WordExample[]>({
    queryKey: ['word-examples', word],
    queryFn: () => fetchExamples(word),
    enabled,
    staleTime: Infinity,
    retry: false,
  });
}
