import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../src/config/env';
import { connectDB } from '../src/config/db';
import { errorHandler } from '../src/middleware/errorHandler';
import authRoutes from '../src/routes/auth';
import teamRoutes from '../src/routes/team';
import meetingRoutes from '../src/routes/meeting';
import integrationRoutes from '../src/routes/integration';

const app = express();

// CORS for Vercel deployment
app.use(cors({
  origin: [
    'https://ai-meetings.vercel.app',
    'https://ai-meet-sable.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true,
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID || 'placeholder',
      clientSecret: config.GOOGLE_CLIENT_SECRET || 'placeholder',
      callbackURL: `${process.env.VERCEL_URL || 'https://ai-meetings.vercel.app'}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        done(null, profile);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: any, done) => done(null, user));

app.use(passport.initialize());

// Use /tmp for uploads in serverless environment
import path from 'path';
import fs from 'fs';
const uploadsDir = path.join('/tmp', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/integrations', integrationRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Connect to DB on first request (serverless optimization)
let isConnected = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
