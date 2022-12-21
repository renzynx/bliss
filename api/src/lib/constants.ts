import { join } from "path";

export enum ROUTES {
  AUTH = "auth",
  USERS = "users",
  UPLOAD = "upload",
  DELETE = "delete",
  STATISTICS = "statistics",
}

export const rootDir = join(__dirname, "..", "..");
export const uploadDir = join(rootDir, "uploads");
export const thumbnailDir = join(rootDir, "public");
export const logsDir = join(rootDir, "logs");
export const tmpDir = join(rootDir, "tmp");
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "auth";
export const INVITE_PREFIX = "invite:";
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
export const CONFIRM_EMAIL_PREFIX = "confirm-email:";
