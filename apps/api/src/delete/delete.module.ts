import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DeleteController } from './delete.controller';
import { DeleteService } from './delete.service';

@Module({
  controllers: [DeleteController],
  providers: [DeleteService, PrismaService],
})
export class DeleteModule {}
