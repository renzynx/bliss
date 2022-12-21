import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Redis, { Redis as TypeRedis } from "ioredis";
import { ServerSettings } from "lib/types";

@Injectable()
export class RedisService {
  private readonly redisClient: TypeRedis;

  constructor(private readonly configService: ConfigService) {
    const redisUrl = this.configService.get("REDIS_URL");
    if (!redisUrl) {
      throw new Error("REDIS_URL is not defined");
    }
    this.redisClient = new Redis(redisUrl);
  }

  redis() {
    return this.redisClient;
  }

  async readServerSettings() {
    const data = await this.redisClient.get("settings");
    if (!data)
      return {
        INVITE_MODE: false,
        REGISTRATION_ENABLED: true,
      } as ServerSettings;
    return JSON.parse(data) as ServerSettings;
  }

  async setServerSettings(newData: ServerSettings) {
    await this.redisClient.set("settings", JSON.stringify(newData));
    return this.readServerSettings();
  }
}
