import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { BadRequestError } from '../utils/errors';

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = process.env.UPLOADS_DIR || path.join(__dirname, '../../uploads');
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      cb(new BadRequestError('Only PDF files are allowed'));
      return;
    }
    cb(null, true);
  },
});
