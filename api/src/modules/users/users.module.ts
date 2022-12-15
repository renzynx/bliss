import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { MailModule } from "../mail/mail.module";
import { AuthGuard } from "modules/auth/guard/auth.guard";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [PrismaModule, MailModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
