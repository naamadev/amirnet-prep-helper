import axios from 'axios';
import { logger } from '../utils/logger';
import { detectPartOfSpeech } from './pdfService';

const MYMEMORY_URL = 'https://api.mymemory.translated.net/get';
const CONCURRENT = 20;
const DELAY_MS = 50;
const EMAIL = 'naamae2003@gmail.com';

export interface TranslatedWord {
  englishWord: string;
  hebrewTranslation: string;
  partOfSpeech: string;
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

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
  onProgress: (progress: number) => void
): Promise<TranslatedWord[]> {
  const results: TranslatedWord[] = [];
  const total = words.length;

  logger.info('Starting translation via MyMemory', { total });

  for (let i = 0; i < total; i += CONCURRENT) {
    const batch = words.slice(i, i + CONCURRENT);
    const translations = await Promise.all(batch.map(translateOne));

    for (let j = 0; j < batch.length; j++) {
      results.push({
        englishWord: batch[j],
        hebrewTranslation: translations[j],
        partOfSpeech: detectPartOfSpeech(batch[j]),
      });
    }

    const progress = Math.round(((i + batch.length) / total) * 80) + 10;
    onProgress(progress);
    logger.info(`Translated ${Math.min(i + CONCURRENT, total)}/${total} words`);

    if (i + CONCURRENT < total) {
      await sleep(DELAY_MS);
    }
  }

  return results;
}
