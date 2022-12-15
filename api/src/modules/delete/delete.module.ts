import { Module } from "@nestjs/common";
import { DeleteController } from "./delete.controller";
import { UploadService } from "modules/upload/upload.service";
import { PrismaService } from "modules/prisma/prisma.service";
import { S3Service } from "modules/s3/s3.service";

@Module({
  providers: [UploadService, PrismaService, S3Service],
  controllers: [DeleteController],
})
export class DeleteModule {}
