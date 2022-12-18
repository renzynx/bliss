import { createWriteStream, existsSync } from "fs";
import { mkdir } from "fs/promises";
import { logsDir, rootDir, thumbnailDir, uploadDir } from "./constants";
import { join } from "path";

const DATABASE_URL = process.env.DATABASE_URL;
const REDIS_URL = process.env.REDIS_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN;
const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM;

const ensure = async () => {
  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  } else if (!REDIS_URL) {
    throw new Error("REDIS_URL is not defined");
  } else if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET is not defined");
  } else if (!CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN is not defined");
  } else if (process.env.USE_MAIL === "true") {
    if (!MAIL_HOST) {
      throw new Error("MAIL_HOST is not defined");
    } else if (!MAIL_PORT) {
      throw new Error("MAIL_PORT is not defined");
    } else if (!MAIL_USER) {
      throw new Error("MAIL_USER is not defined");
    } else if (!MAIL_PASS) {
      throw new Error("MAIL_PASS is not defined");
    } else if (!MAIL_FROM) {
      throw new Error("MAIL_FROM is not defined");
    }
  }

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true });
  } else if (!existsSync(logsDir)) {
    await mkdir(logsDir, { recursive: true });
  }
};

process.env.NODE_ENV === "production" && ensure();
