import { ForbiddenException, Injectable } from "@nestjs/common";
import { INVITE_PREFIX } from "lib/constants";
import { generateApiKey } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";
import { RedisService } from "modules/redis/redis.service";

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  async changeServerSettings(
    data: {
      REGISTRATION_ENABLED: boolean;
      INVITE_MODE: boolean;
    },
    id: string
  ) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      throw new ForbiddenException({
        errors: [
          {
            field: "REGISTRATION_ENABLED",
            message: "You do not have permission to do that",
          },
          {
            field: "INVITE_MODE",
            message: "You do not have permission to do that",
          },
        ],
      });
    }

    return this.redis.setServerSettings(data);
  }

  async getInvites(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      throw new ForbiddenException();
    }

    const invites = await this.redis.redis().keys(INVITE_PREFIX + "*");

    const values = await this.redis.redis().mget(...invites);

    const keys = invites.map((i) => i.replace(INVITE_PREFIX, ""));

    const data: { invite: string; username: string }[] = [];

    for (let i = 0; i < keys.length; i++) {
      data.push({
        invite: keys[i],
        username: values[i],
      });
    }

    return data.filter((v) => v.username === user.username);
  }

  async createInvite(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      throw new ForbiddenException();
    }

    const invite = generateApiKey(64);

    await this.redis
      .redis()
      .set(INVITE_PREFIX + invite, user.username, "EX", 60 * 60 * 24 * 7);

    return invite;
  }
}
