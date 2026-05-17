import { v2 } from '@google-cloud/translate';
import { logger } from '../utils/logger';
import { detectPartOfSpeech } from './pdfService';
import { envConfig } from '../utils/envConfig';

const BATCH_SIZE = 128;

export interface TranslatedWord {
  englishWord: string;
  hebrewTranslation: string;
  partOfSpeech: string;
}

async function translateBatch(words: string[]): Promise<string[]> {
  if (!envConfig.google.translateApiKey) {
    logger.warn('No Google Translate API key — returning placeholder translations');
    return words.map((w) => `[${w}]`);
  }

  const translator = new v2.Translate({ key: envConfig.google.translateApiKey });
  const [translations] = await translator.translate(words, { from: 'en', to: 'he' });
  return Array.isArray(translations) ? translations : [translations];
}

export async function translateWords(
  words: string[],
  onProgress: (progress: number) => void
): Promise<TranslatedWord[]> {
  const results: TranslatedWord[] = [];
  const totalBatches = Math.ceil(words.length / BATCH_SIZE);

  for (let i = 0; i < words.length; i += BATCH_SIZE) {
    const batch = words.slice(i, i + BATCH_SIZE);
    const batchIndex = Math.floor(i / BATCH_SIZE);

    try {
      const translations = await translateBatch(batch);

      for (let j = 0; j < batch.length; j++) {
        results.push({
          englishWord: batch[j],
          hebrewTranslation: translations[j] ?? batch[j],
          partOfSpeech: detectPartOfSpeech(batch[j]),
        });
      }

      const progress = Math.round(((batchIndex + 1) / totalBatches) * 80) + 10;
      onProgress(progress);
      logger.info(`Translated batch ${batchIndex + 1}/${totalBatches}`);
    } catch (error) {
      logger.error('Translation batch failed', { batchIndex, error });
      for (const word of batch) {
        results.push({ englishWord: word, hebrewTranslation: `[${word}]`, partOfSpeech: 'Other' });
      }
    }
  }

  return results;
}
