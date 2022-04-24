import * as session from 'express-session';
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
  VIEW = 'view',
}

export const COOKIE_NAME = 'BLISS_AUTH';

export const SESSION_OPTIONS = (store: session.Store) =>
  ({
    name: COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.USE_HTTPS === 'true',
      domain:
        process.env.NODE_ENV === 'production'
          ? `.${process.env.WEB_DOMAIN.split('/')[2]}`
          : undefined,
    },
  } as session.SessionOptions);

export const UPLOAD_DIR = join(process.cwd(), 'uploads');

export const INVITE_PREFIX = 'invite:';
