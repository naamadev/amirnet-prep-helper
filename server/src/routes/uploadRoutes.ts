import { Router } from 'express';
import { uploadController } from '../controllers/uploadController';
import { requireAuth } from '../middleware/authMiddleware';
import { uploadMiddleware } from '../middleware/uploadMiddleware';

export const uploadRouter = Router();

uploadRouter.post('/', requireAuth, uploadMiddleware.single('pdf'), uploadController.uploadPdf);
uploadRouter.get('/status/:jobId', requireAuth, uploadController.getJobStatus);
