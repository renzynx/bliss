import { Module } from "@nestjs/common";
import { PrismaModule } from "modules/prisma/prisma.module";
import { S3Service } from "./s3.service";
import { S3Controller } from './s3.controller';

@Module({
  imports: [PrismaModule],
  providers: [S3Service],
  controllers: [S3Controller],
})
export class S3Module {}
