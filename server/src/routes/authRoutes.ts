import { Router } from 'express';
import passport from 'passport';
import { authController } from '../controllers/authController';

export const authRouter = Router();

authRouter.get('/me', authController.getMe);
authRouter.post('/logout', authController.logout);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/auth/failed' }),
  authController.googleCallback
);

authRouter.get('/failed', authController.googleAuthFailed);
