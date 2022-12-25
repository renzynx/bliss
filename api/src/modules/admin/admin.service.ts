import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { User } from "@prisma/client";
import { unlink } from "fs/promises";
import { INVITE_PREFIX, uploadDir } from "lib/constants";
import { UpdateUsers } from "lib/types";
import { generateRandomString } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";
import { RedisService } from "modules/redis/redis.service";
import { join } from "path";

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

    const invite = generateRandomString(64);

    await this.redis
      .redis()
      .set(INVITE_PREFIX + invite, user.username, "EX", 60 * 60 * 24 * 7);

    return invite;
  }

  async getUsers(id: string, skip: number, take: number, search = "") {
    const check = await this.prisma.user.findUnique({ where: { id } });

    if (!check) {
      throw new ForbiddenException();
    }

    if (check.role !== "OWNER") {
      throw new ForbiddenException();
    }

    const total = (await this.prisma.user.count()) - 1;

    const totalPages = Math.ceil(total / take);

    // 1 2 3 4 5 6 7 8 9 10
    //           ^
    // take = 6, left = 4
    //

    let finalTake = take;

    if (take > total - skip) {
      finalTake = total - skip;
    }

    const users = await this.prisma.user
      .findMany({
        skip,
        take: finalTake,
        orderBy: {
          createdAt: "desc",
        },
        where: { username: { contains: search } },
      })
      .then((users) => {
        return users
          .map((u) => {
            delete u.password;
            return u;
          })
          .filter((u) => u.role !== "OWNER");
      });

    return {
      users,
      totalPages,
    };
  }

  async updateUsers(id: string, data: UpdateUsers[]) {
    const check = await this.prisma.user.findUnique({ where: { id } });

    if (!check) {
      throw new ForbiddenException();
    }

    if (check.role !== "OWNER") {
      throw new ForbiddenException();
    }

    const newData: UpdateUsers[] = [];

    for (const u of data) {
      let upgrade: number = 500;
      if (u.role === "ADMIN") {
        upgrade = 2000;
      } else if (u.role === "USER") {
        upgrade = 500;
      }

      const user = await this.prisma.user.update({
        where: { id: u.id },
        data: {
          ...u,
          uploadLimit: upgrade,
        },
      });
      newData.push(user);
    }

    return newData;
  }

  async purgeUserFiles(id: string, userId: string) {
    const check = await this.prisma.user.findUnique({ where: { id } });

    if (!check) {
      throw new ForbiddenException();
    }

    if (check.role !== "OWNER") {
      throw new ForbiddenException();
    }

    if (!userId) {
      throw new BadRequestException();
    }

    // Delete all files from user and remove from database
    const files = await this.prisma.file.findMany({
      where: { userId },
    });

    for (const file of files) {
      const ext = file.filename.split(".").pop();
      await unlink(join(uploadDir, `${file.slug}.${ext}`)).catch(() => {});
    }

    await this.prisma.file.deleteMany({ where: { userId } });

    return true;
  }
}
