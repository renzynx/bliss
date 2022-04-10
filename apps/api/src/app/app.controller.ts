import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { UPLOAD_DIR } from '../lib/constants';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(':slug')
  async streamFile(
    @Param() { slug }: { slug: string },
    @Res({ passthrough: true }) res: Response
  ) {
    const filePath = join(UPLOAD_DIR, slug);
    const find = await this.appService.getFile(slug);
    if (!find) throw new NotFoundException('File not found');
    const file = createReadStream(filePath);

    file.on('error', () => {
      throw new NotFoundException('File not found');
    });

    res.set({
      'Content-Type': find.mimetype,
      'Content-Length': find.size,
      'Cache-Control': 'no-cache',
      Expires: '0',
      Pragma: 'no-cache',
    });

    return new StreamableFile(file);
  }
}
