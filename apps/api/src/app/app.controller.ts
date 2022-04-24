import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle(100, 60)
  @Get(':slug')
  async streamFile(
    @Param() { slug }: { slug: string },
    @Res({ passthrough: true }) res: Response,
    @Query('download') download?: string
  ) {
    return this.appService.getFile(slug, res, download);
  }
}
