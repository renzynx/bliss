import { createClient } from 'redis';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SESSION_OPTIONS, UPLOAD_DIR } from './lib/constants';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import { ensureDir } from 'fs-extra';
import { resolve } from 'path';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

async function bootstrap() {
  (process.env.USE_S3 === 'false' || !process.env.USE_S3) &&
    (await ensureDir(UPLOAD_DIR));

  const redisStore = connectRedis(session);
  const client = createClient({ url: process.env.REDIS_URL, legacyMode: true });
  await client.connect();

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());
  app.use(
    session(SESSION_OPTIONS(new redisStore({ client, disableTouch: true })))
  );
  app.enableCors({
    credentials: true,
    origin: process.env.WEB_DOMAIN,
  });

  const port = process.env.PORT || 3333;

  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
