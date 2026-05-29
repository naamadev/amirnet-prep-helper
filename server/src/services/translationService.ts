import axios from 'axios';
import { logger } from '../utils/logger';
import { detectPartOfSpeech } from './pdfService';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const CONCURRENT = 40;
const EMAIL = 'naamae2003@gmail.com';

export interface TranslatedWord {
  englishWord: string;
  hebrewTranslation: string;
  partOfSpeech: string;
}

async function translateOne(word: string): Promise<string> {
  try {
    const { data } = await axios.get(MYMEMORY_URL, {
      params: { q: word, langpair: 'en|he', de: EMAIL },
      timeout: 6000,
    });
    const translated: string = data?.responseData?.translatedText ?? '';
    return translated && translated !== word ? translated : `[${word}]`;
  } catch {
    return `[${word}]`;
  }
}

export async function translateWords(
  words: string[],
  onProgress: (progress: number) => void,
  existingTranslations?: Map<string, { hebrewTranslation: string; partOfSpeech: string | null }>
): Promise<TranslatedWord[]> {
  const toTranslate = existingTranslations
    ? words.filter((w) => !existingTranslations.has(w))
    : words;

  const total = words.length;
  logger.info('Starting translation via MyMemory', { total, toTranslate: toTranslate.length, cached: total - toTranslate.length });

  const translated = new Map<string, string>();

  for (let i = 0; i < toTranslate.length; i += CONCURRENT) {
    const batch = toTranslate.slice(i, i + CONCURRENT);
    const results = await Promise.all(batch.map(translateOne));
    batch.forEach((word, idx) => translated.set(word, results[idx]));

    const progress = Math.round(((i + batch.length) / Math.max(toTranslate.length, 1)) * 80) + 10;
    onProgress(Math.min(progress, 89));
    logger.info(`Translated ${Math.min(i + CONCURRENT, toTranslate.length)}/${toTranslate.length} words`);
  }

  return words.map((word) => {
    if (existingTranslations?.has(word)) {
      const cached = existingTranslations.get(word)!;
      return {
        englishWord: word,
        hebrewTranslation: cached.hebrewTranslation,
        partOfSpeech: cached.partOfSpeech ?? detectPartOfSpeech(word),
      };
    }
    return {
      englishWord: word,
      hebrewTranslation: translated.get(word) ?? `[${word}]`,
      partOfSpeech: detectPartOfSpeech(word),
    };
  });
}
