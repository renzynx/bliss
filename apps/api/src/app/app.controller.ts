import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { UPLOAD_DIR } from '../lib/constants';
import { join } from 'path';
import { AppService } from './app.service';
import { Throttle } from '@nestjs/throttler';
import { File } from '@prisma/client';

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
    const filePath = join(UPLOAD_DIR, slug);

    const find = await this.appService.getFile(slug);

    if (!find) throw new NotFoundException('File not found');

    const data: File = JSON.parse(find);

    const streamable = createReadStream(filePath);

    streamable.on('error', () => {
      throw new NotFoundException('File not found');
    });

    res
      .header('Content-Type', data.mimetype)
      .header('Content-Length', data.size.toString())
      .header('Cache-Control', 'public, max-age=31536000')
      .header('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString())
      .header('Last-Modified', new Date(data.createdAt).toUTCString());

    if (download) {
      res.header(
        'Content-Disposition',
        `attachment; filename="${data.originalName}"`
      );
    }

    return new StreamableFile(streamable, {
      length: data.size,
      type: data.mimetype,
    });
  }
}
