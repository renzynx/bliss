import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, PrismaService],
})
export class UploadModule {}
