import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user) {
    throw new UnauthorizedError('You must be logged in');
  }
  next();
};
