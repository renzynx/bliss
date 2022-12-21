import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ConfigService } from "@nestjs/config";
import { UsersService } from "modules/users/users.service";
import { MailService } from "modules/mail/mail.service";
import { PrismaService } from "modules/prisma/prisma.service";
import { RedisService } from "modules/redis/redis.service";

@Module({
  providers: [
    AuthService,
    UsersService,
    MailService,
    ConfigService,
    PrismaService,
    RedisService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
