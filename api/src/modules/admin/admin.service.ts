import { ForbiddenException, Injectable } from "@nestjs/common";
import { generateApiKey, writeServerSettings } from "lib/utils";
import { PrismaService } from "modules/prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async changeServerSettings(
    data: {
      REGISTRATION_ENABLED: string;
      INVITE_MODE: string;
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

    return writeServerSettings({
      REGISTRATION_ENABLED: data.REGISTRATION_ENABLED === "true",
      INVITE_MODE: data.INVITE_MODE === "true",
    });
  }

  async getInvites(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      throw new ForbiddenException();
    }

    return this.prisma.verificationToken.findMany({
      where: {
        type: "INVITE_CODE",
        identifier: user.username,
      },
    });
  }

  async createInvite(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new ForbiddenException();
    }

    if (user.role !== "ADMIN" && user.role !== "OWNER") {
      throw new ForbiddenException();
    }

    return this.prisma.verificationToken.create({
      data: {
        token: generateApiKey(32),
        type: "INVITE_CODE",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
        identifier: user.username,
      },
    });
  }
}
