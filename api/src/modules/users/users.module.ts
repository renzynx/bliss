import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MailModule } from "../mail/mail.module";
import { RedisService } from "modules/redis/redis.service";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [PrismaModule, MailModule],
  providers: [UsersService, RedisService, ConfigService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
