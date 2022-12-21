import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "modules/prisma/prisma.service";
import { RedisService } from "modules/redis/redis.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

@Module({
  controllers: [AdminController],
  providers: [AdminService, PrismaService, RedisService, ConfigService],
})
export class AdminModule {}
