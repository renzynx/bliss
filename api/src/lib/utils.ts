import { FieldError, ServerSettings } from "./types";
import { randomBytes } from "crypto";
import { join } from "path";
import { readFile, writeFile } from "fs/promises";
import { rootDir } from "./constants";
import { lookup } from "mime-types";

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
  const data = await readFile(join(rootDir, "settings.json"), "utf-8");
  return JSON.parse(data) as ServerSettings;
};

export const writeServerSettings = async (newData: ServerSettings) => {
  return readServerSettings().then(async (data) => {
    data["REGISTRATION_ENABLED"] = newData["REGISTRATION_ENABLED"];
    data["DISABLE_INVITE"] = newData["DISABLE_INVITE"];

    await writeFile(
      join(rootDir, "settings.json"),
      JSON.stringify(data, null, 2)
    );
    return readServerSettings();
  });
};

export const lookUp = (filename: string) => {
  const type = lookup(filename);

  if (type === false) {
    return "application/octet-stream";
  } else {
    return type;
  }
};
