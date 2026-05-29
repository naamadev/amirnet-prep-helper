import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';
import { BadRequestError, NotFoundError } from '../utils/errors';
import {
  createJob,
  getJob,
  setJobProgress,
  completeJob,
  failJob,
} from '../services/jobQueue';
import { extractUniqueWords } from '../services/pdfService';
import { translateWords } from '../services/translationService';

const prisma = new PrismaClient();

async function processJob(jobId: string, filePath: string, userId: number): Promise<void> {
  try {
    setJobProgress(jobId, 5);

    const uniqueWords = await extractUniqueWords(filePath);
    setJobProgress(jobId, 10);

    // Pre-fetch already-translated words to skip redundant API calls
    const existingWords = await prisma.word.findMany({
      where: { englishWord: { in: uniqueWords } },
      select: { englishWord: true, hebrewTranslation: true, partOfSpeech: true },
    });
    const existingMap = new Map(
      existingWords.map((w) => [w.englishWord, { hebrewTranslation: w.hebrewTranslation, partOfSpeech: w.partOfSpeech }])
    );

    const translatedWords = await translateWords(uniqueWords, (p) => setJobProgress(jobId, p), existingMap);
    setJobProgress(jobId, 90);

    // Upsert Words and create UserWords in batches
    let inserted = 0;
    const CHUNK = 50;

    for (let i = 0; i < translatedWords.length; i += CHUNK) {
      const chunk = translatedWords.slice(i, i + CHUNK);

      await prisma.$transaction(
        chunk.map((tw) =>
          prisma.word.upsert({
            where: { englishWord: tw.englishWord },
            update: {},
            create: {
              englishWord: tw.englishWord,
              hebrewTranslation: tw.hebrewTranslation,
              partOfSpeech: tw.partOfSpeech,
            },
          })
        )
      );

      const words = await prisma.word.findMany({
        where: { englishWord: { in: chunk.map((tw) => tw.englishWord) } },
        select: { id: true },
      });

      await prisma.$transaction(
        words.map((w) =>
          prisma.userWord.upsert({
            where: { userId_wordId: { userId, wordId: w.id } },
            update: {},
            create: { userId, wordId: w.id },
          })
        )
      );

      inserted += chunk.length;
    }

    // Cleanup uploaded file
    fs.unlink(filePath, (err) => {
      if (err) logger.warn('Failed to delete temp file', { filePath });
    });

    completeJob(jobId, inserted);
    logger.info('Job completed', { jobId, wordCount: inserted });
  } catch (error) {
    logger.error('Job processing failed', { jobId, error });
    failJob(jobId, (error as Error).message ?? 'Processing failed');
    fs.unlink(filePath, () => {});
  }
}

export const uploadController = {
  uploadPdf: (req: Request, res: Response): void => {
    if (!req.file) {
      throw new BadRequestError('No PDF file provided');
    }

    const user = req.user as { id: number };
    const jobId = uuidv4();

    createJob(jobId);

    // Fire-and-forget async processing
    setImmediate(() => {
      processJob(jobId, req.file!.path, user.id).catch((err) => {
        logger.error('Unhandled processJob error', { jobId, err });
      });
    });

    logger.info('Upload job queued', { jobId, file: req.file.originalname });
    res.status(202).json({ jobId, message: 'File uploaded and processing started' });
  },

  getJobStatus: (req: Request, res: Response): void => {
    const { jobId } = req.params;
    const job = getJob(jobId);

    if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`);
    }

    res.json(job);
  },
};
