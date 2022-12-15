import Redis from "ioredis";
import { Logger } from "@nestjs/common";

// @ts-ignore
const client = new Redis(process.env.REDIS_URL, { keepAlive: 1000 });

const logger = new Logger("Redis");

client.on("error", (error) => {
  if (error.code === "ECONNRESET") {
    logger.debug("Connection to Redis Session Store timed out.");
  } else if (error.code === "ECONNREFUSED") {
    logger.debug("Connection to Redis Session Store refused!");
  } else logger.error(error);
});

client.on("reconnecting", () => {
  if (client.status === "reconnecting")
    logger.debug("Reconnecting to Redis Session Store...");
  else logger.error("Error reconnecting to Redis Session Store.");
});

client.on("connect", (err) => {
  if (!err) logger.log("Connected to Redis Session Store!");
});

export default client;
