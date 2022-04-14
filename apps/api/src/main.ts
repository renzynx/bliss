import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { SESSION_OPTIONS } from './lib/constants';
import * as session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());
  app.use(session(SESSION_OPTIONS));
  app.enableCors({
    credentials: true,
    origin: `${process.env.USE_HTTPS ? 'https' : 'http'}://${
      process.env.WEB_DOMAIN
    }`,
  });
  const port = process.env.PORT || 3333;
  await app.listen(port);
  Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
