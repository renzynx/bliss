import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SESSION_OPTIONS } from './lib/constants';
import * as session from 'express-session';
import { File } from '@prisma/client';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

export const FileCache = new Map<string, File>();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());
  app.use(session(SESSION_OPTIONS));
  app.enableCors({ credentials: true, origin: 'http://localhost:3001' });
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
