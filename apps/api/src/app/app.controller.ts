import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Throttle(100, 60)
  @Get(':slug')
  async streamFile(
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
    @Param() { slug }: { slug: string },
    @Query('download') download?: string
  ) {
    return this.appService.getFile(slug, res, req, download);
  }

  @Get(':slug/oembed')
  OEmbedJSON(@Param() { slug }: { slug: string }) {
    return this.appService.getFileJSON(slug);
  }
}
