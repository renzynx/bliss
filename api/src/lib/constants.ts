import { join } from "path";

export enum ROUTES {
  AUTH = "auth",
  USERS = "users",
  UPLOAD = "upload",
  DELETE = "delete",
}

export const rootDir = join(__dirname, "..", "..");
export const uploadDir = process.env.UPLOAD_DIR ?? join(rootDir, "uploads");
export const logsDir = join(rootDir, "logs");
export const COOKIE_NAME = process.env.COOKIE_NAME ?? "auth";
export const INVITE_PREFIX = "invite:";
export const FORGOT_PASSWORD_PREFIX = "forgot-password:";
export const CONFIRM_EMAIL_PREFIX = "confirm-email:";
