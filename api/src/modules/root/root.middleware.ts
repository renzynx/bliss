import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { appendFile } from "fs/promises";
import { logsDir } from "lib/constants";
import { join } from "path";
import { randomUUID } from "crypto";
import { formatBytes, formatDate, matchLocalHost } from "lib/utils";

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, path: url } = request;
    const userAgent = request.get("user-agent") || "";

    response.on("close", async () => {
      try {
        if (
          request.headers.origin !== process.env.CORS_ORIGIN &&
          !request.headers.origin &&
          !matchLocalHost(ip)
        ) {
          const { statusCode } = response;
          const contentLength = response.get("content-length");

          this.logger.warn(
            "A request is made from an unknown origin to a protected route."
          );
          this.logger.warn(
            `${method.toUpperCase().padEnd(7)}\t${statusCode
              .toString()
              .padStart(3)}\t${url}\t${formatBytes(
              +contentLength || 0
            )}\t${userAgent}\t${ip}`
          );

          const log = `${formatDate(
            new Date(Date.now())
          )}\t${randomUUID()}\t${method.toUpperCase().padEnd(7)}\t${statusCode
            .toString()
            .padStart(3)}\t${url}\t${formatBytes(
            +contentLength || 0
          )}\t${userAgent}\t${ip}\n`;

          await appendFile(join(logsDir, "unknown.log"), log);
        }
      } catch (error) {
        this.logger.error(error);
      }
    });

    next();
  }
}
