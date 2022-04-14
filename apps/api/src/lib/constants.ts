import * as session from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
import { join } from 'node:path';

export enum SLUG_TYPE {
  RANDOM = 'random',
  ZEROWIDTH = 'zws',
  EMOJI = 'emoji',
}

export enum ROUTES {
  AUTH = 'auth',
  UPLOAD = 'upload',
  DELETE = 'delete',
}

export const COOKIE_NAME = 'BLISS_AUTH';

export const SESSION_OPTIONS = {
  name: COOKIE_NAME,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new PrismaSessionStore(new PrismaClient(), {
    checkPeriod: 2 * 60 * 1000, // the frequency with which expired sessions will be cleared;
    dbRecordIdIsSessionId: true, // if true, the db record id is the same as the session id
    dbRecordIdFunction: undefined, // a function that returns the db record id for a given session;
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.USE_HTTPS === 'true',
    domain:
      process.env.NODE_ENV === 'production'
        ? `.${process.env.WEB_DOMAIN}`
        : undefined,
  },
} as session.SessionOptions;

export const PORT = process.env.PORT || 3000;

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const GLOBAL_PREFIX = 'api';
