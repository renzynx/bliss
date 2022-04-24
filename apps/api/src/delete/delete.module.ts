import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Service } from '../s3/s3.service';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

@Module({
  controllers: [DeleteController],
  providers: [DeleteService, PrismaService, S3Service],
})
export class DeleteModule {}
