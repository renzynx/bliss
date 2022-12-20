import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { COOKIE_NAME, rootDir, uploadDir } from "lib/constants";
import { serialize } from "lib/utils";
import { join } from "path";
import { AppModule } from "./app.module";
import client from "./lib/redis";
import ConnectStore from "connect-redis";
import session from "express-session";
import helmet from "helmet";
import bp from "body-parser";
import "./lib/setup";

async function bootstrap() {
  const startTime = Date.now();
  const RedisStore = ConnectStore(session);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(uploadDir);
  app.setBaseViewsDir(join(rootDir, "views"));
  app.setViewEngine("hbs");

  app.use(bp.raw({ type: "application/octet-stream", limit: "100mb" }));
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  });

  process.env.USE_PROXY === "true" && app.set("trust proxy", 1);
  app.use(
    session({
      name: COOKIE_NAME,
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production"
            ? "." + serialize(process.env.CORS_ORIGIN)
            : undefined,
      },
      store: new RedisStore({ client, disableTouch: true }),
    })
  );

  await app.listen(process.env.PORT ?? 3000);

  return startTime;
}
bootstrap().then((startTime) => {
  Logger.log(
    `🚀 Listening on port ${process.env.PORT ?? 3000} +${
      Date.now() - startTime
    }ms`,
    "NestApplication"
  );
});
