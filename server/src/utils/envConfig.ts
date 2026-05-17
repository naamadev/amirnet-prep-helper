import dotenv from 'dotenv';
dotenv.config();

export const envConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  sessionSecret: process.env.SESSION_SECRET || 'fallback-secret-change-in-production',
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
    translateApiKey: process.env.GOOGLE_TRANSLATE_API_KEY || '',
  },
  databaseUrl: process.env.DATABASE_URL || 'file:./dev.db',
};
