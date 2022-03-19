import * as path from "path";

export const rootDir = path.join(__dirname, "..", "..");
export const uploadDir = path.join(rootDir, "uploads");
export const __port__ = process.env.PORT ?? 42069;
export const __prod__ = process.env.NODE_ENV === "production";
export const __secure__ = process.env.SECURE === "false" ? false : true;
export const COOKIE_NAME = "BLISS_AUTH";
export const __cors__ = __prod__ ? `http${__secure__ ? "s" : ""}://${process.env.DOMAIN}` : `http://localhost:3000`;
