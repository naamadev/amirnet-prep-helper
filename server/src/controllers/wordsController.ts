import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { BadRequestError, NotFoundError } from '../utils/errors';

const prisma = new PrismaClient();

const updateWordSchema = z.object({
  isLearned: z.boolean().optional(),
  customHebrewTranslation: z.string().nullable().optional(),
});

export const wordsController = {
  getUserWords: async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: number };

    const userWords = await prisma.userWord.findMany({
      where: { userId: user.id },
      include: {
        word: {
          select: {
            id: true,
            englishWord: true,
            hebrewTranslation: true,
            partOfSpeech: true,
          },
        },
      },
      orderBy: { word: { englishWord: 'asc' } },
    });

    const response = userWords.map((uw) => ({
      wordId: uw.wordId,
      englishWord: uw.word.englishWord,
      hebrewTranslation: uw.customHebrewTranslation ?? uw.word.hebrewTranslation,
      originalHebrewTranslation: uw.word.hebrewTranslation,
      partOfSpeech: uw.word.partOfSpeech,
      isLearned: uw.isLearned,
      hasCustomTranslation: !!uw.customHebrewTranslation,
    }));

    logger.info('Fetched user words', { userId: user.id, count: response.length });
    res.json({ words: response, total: response.length });
  },

  updateUserWord: async (req: Request, res: Response): Promise<void> => {
    const user = req.user as { id: number };
    const wordId = parseInt(req.params.id, 10);

    if (isNaN(wordId)) {
      throw new BadRequestError('Invalid word ID');
    }

    const parsed = updateWordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
    }

    const existing = await prisma.userWord.findUnique({
      where: { userId_wordId: { userId: user.id, wordId } },
    });

    if (!existing) {
      throw new NotFoundError('Word not found in your list');
    }

    const updated = await prisma.userWord.update({
      where: { userId_wordId: { userId: user.id, wordId } },
      data: {
        ...(parsed.data.isLearned !== undefined && { isLearned: parsed.data.isLearned }),
        ...(parsed.data.customHebrewTranslation !== undefined && {
          customHebrewTranslation: parsed.data.customHebrewTranslation,
        }),
      },
      include: { word: true },
    });

    logger.info('Updated user word', { userId: user.id, wordId });
    res.json({
      wordId: updated.wordId,
      isLearned: updated.isLearned,
      customHebrewTranslation: updated.customHebrewTranslation,
    });
  },
};
