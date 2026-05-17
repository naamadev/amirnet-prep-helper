import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient } from '@prisma/client';
import { envConfig } from './utils/envConfig';
import { logger } from './utils/logger';
import { AppError } from './utils/errors';
import { authRouter } from './routes/authRoutes';
import { uploadRouter } from './routes/uploadRoutes';
import { wordsRouter } from './routes/wordsRoutes';

const prisma = new PrismaClient();

const app = express();

app.use(cors({
  origin: envConfig.clientUrl,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: envConfig.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: envConfig.nodeEnv === 'production',
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
}));

app.use(passport.initialize());
app.use(passport.session());

// Passport Google strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: envConfig.google.clientId,
      clientSecret: envConfig.google.clientSecret,
      callbackURL: envConfig.google.callbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value ?? '';
        const user = await prisma.user.upsert({
          where: { googleId: profile.id },
          update: { name: profile.displayName, email },
          create: {
            googleId: profile.id,
            email,
            name: profile.displayName,
          },
        });
        done(null, user);
      } catch (error) {
        logger.error('Google OAuth error', { error });
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as { id: number }).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.use('/api/auth', authRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/words', wordsRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn('Application error', { message: err.message, statusCode: err.statusCode });
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  logger.error('Unhandled error', { err });
  res.status(500).json({ message: 'Internal server error' });
});

export default app;
