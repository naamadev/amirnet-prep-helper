import { Router } from 'express';
import { requireAuth } from '../middleware/authMiddleware';
import { remindersController } from '../controllers/remindersController';

export const remindersRouter = Router();

remindersRouter.use(requireAuth);
remindersRouter.get('/', remindersController.getReminder);
remindersRouter.post('/', remindersController.setReminder);
remindersRouter.delete('/', remindersController.deleteReminder);
