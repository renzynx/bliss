import { FieldError, ServerSettings } from "./types";
import { randomBytes } from "crypto";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { rootDir } from "./constants";
import { lookup } from "mime-types";
import Redis from "ioredis";

export const toFieldError = (errors: string[]) => {
  const fieldErrors: FieldError[] = [];

  errors.map((error) => {
    const [field, message] = error.split(": ");
    fieldErrors.push({ field, message });
  });

  return fieldErrors;
};

export const generateApiKey = (len = 32) => {
  return randomBytes(20).toString("hex").substring(0, len);
};

export const serialize = (s: string) => {
  const url = s.replace(/(^\w+:|^)\/\//, "");
  const domain = url.split(".").slice(-2).join(".");
  return domain.replace(/\/$/, "");
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return parseFloat(
    (bytes / Math.pow(1024, i)).toFixed(decimals < 0 ? 0 : decimals)
  )
    .toString()
    .concat(` ${sizes[i]}`);
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, "0");
};

export const formatDate = (date: Date) => {
  return (
    [
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
      date.getFullYear(),
    ].join("/") +
    " " +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(":")
  );
};

export const matchLocalHost = (ip: string) => {
  const ipRegex = /(?:\d{1,3}\.){3}\d{1,3}/;

  if (ip === "::1") return true;

  return ip.match(ipRegex);
};

export const readServerSettings = async () => {
  const client = new Redis(process.env.REDIS_URL);
  const data = await client.get("settings");
  if (!data)
    return {
      INVITE_MODE: false,
      REGISTRATION_ENABLED: true,
    } as ServerSettings;
  client.disconnect();
  return JSON.parse(data) as ServerSettings;
};

export const writeServerSettings = async (newData: ServerSettings) => {
  const redis = new Redis(process.env.REDIS_URL);
  await redis.set("settings", JSON.stringify(newData));
  return readServerSettings();
};

export const lookUp = (filename: string) => {
  const type = lookup(filename);

  if (type === false) {
    return "application/octet-stream";
  } else {
    return type;
  }
};

export const generateRandomHexColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);
