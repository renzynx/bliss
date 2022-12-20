import { createWriteStream, existsSync } from "fs";
import { mkdir } from "fs/promises";
import { logsDir, rootDir, uploadDir } from "./constants";
import { PrismaClient } from "@prisma/client";
import { generateApiKey } from "./utils";
import md5 from "md5";
import argon from "argon2";
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

  const prisma = new PrismaClient();

  await prisma.$connect();

  const user = await prisma.user.findFirst({
    where: { role: "OWNER", username: "root" },
  });

  if (!user) {
    const p = generateApiKey(64);
    const password = await argon.hash(p);

    const stream = createWriteStream(
      join(rootDir, "initial_root_password.txt")
    );

    stream.write(
      `
    Username: root
    Password: ${p}  
    `,
      "utf8"
    );

    stream.end();

    stream.on("finish", () => {
      console.log(
        "Initial root password has been written to initial_root_password.txt file."
      );
    });

    stream.on("error", (err) => {
      console.log(err);
    });

    await prisma.user.create({
      data: {
        email: "root@localhost",
        password,
        role: "OWNER",
        apiKey: generateApiKey(32),
        username: "root",
        emailVerified: new Date(Date.now()),
        image: `https://www.gravatar.com/avatar/${md5("root@localhost")}`,
      },
    });
  }

  await prisma.$disconnect();
};

process.env.NODE_ENV === "production" && ensure();
