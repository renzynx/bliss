import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ViewController } from './view.controller';
import { ViewService } from './view.service';

@Module({
  controllers: [ViewController],
  providers: [ViewService, PrismaService],
})
export class ViewModule {}
