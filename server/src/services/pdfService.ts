import fs from 'fs';
import pdfParse from 'pdf-parse';
import nlp from 'compromise';
import { logger } from '../utils/logger';

const STOP_WORDS = new Set([
  'the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','have','has','had',
  'do','does','did','will','would','could','should','may','might','shall',
  'this','that','these','those','it','its','i','you','he','she','we','they',
  'me','him','her','us','them','my','your','his','our','their',
]);

export function detectPartOfSpeech(word: string): string {
  const doc = nlp(word);
  if (doc.nouns().length > 0) return 'Noun';
  if (doc.verbs().length > 0) return 'Verb';
  if (doc.adjectives().length > 0) return 'Adjective';
  if (doc.adverbs().length > 0) return 'Adverb';
  return 'Other';
}

export async function extractUniqueWords(filePath: string): Promise<string[]> {
  logger.info('Extracting text from PDF', { filePath });

  const dataBuffer = fs.readFileSync(filePath);
  const data = await pdfParse(dataBuffer);

  const text = data.text.toLowerCase();
  const rawWords = text.match(/\b[a-z]{3,}\b/g) ?? [];

  const uniqueWords = [...new Set(rawWords)].filter(
    (w) => !STOP_WORDS.has(w) && w.length >= 3 && w.length <= 30
  );

  logger.info('Extracted unique words', { count: uniqueWords.length });
  return uniqueWords;
}
