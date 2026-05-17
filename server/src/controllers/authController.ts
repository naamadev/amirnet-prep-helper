import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { envConfig } from '../utils/envConfig';

export const authController = {
  getMe: (req: Request, res: Response): void => {
    if (!req.user) {
      res.status(401).json({ user: null });
      return;
    }
    res.json({ user: req.user });
  },

  logout: (req: Request, res: Response): void => {
    req.logout((err) => {
      if (err) {
        logger.error('Logout error', { err });
        res.status(500).json({ message: 'Logout failed' });
        return;
      }
      res.json({ message: 'Logged out successfully' });
    });
  },

  googleCallback: (_req: Request, res: Response): void => {
    res.redirect(`${envConfig.clientUrl}/dashboard`);
  },

  googleAuthFailed: (_req: Request, res: Response): void => {
    res.redirect(`${envConfig.clientUrl}?error=auth_failed`);
  },
};
