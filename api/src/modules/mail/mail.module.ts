import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailService } from "./mail.service";

@Module({
  providers: [MailService, ConfigService],
  exports: [MailService],
})
export class MailModule {}
