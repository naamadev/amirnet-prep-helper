import { Router } from 'express';
import { wordsController } from '../controllers/wordsController';
import { requireAuth } from '../middleware/authMiddleware';

export const wordsRouter = Router();

wordsRouter.get('/', requireAuth, wordsController.getUserWords);
wordsRouter.put('/:id', requireAuth, wordsController.updateUserWord);
