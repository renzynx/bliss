import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { PrismaService } from "modules/prisma/prisma.service";

@Module({
  providers: [UploadService, PrismaService],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
