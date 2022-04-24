import {
  Controller,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipThrottle } from '@nestjs/throttler';
import { Request } from 'express';
import { ROUTES } from '../lib/constants';
import { UploadService } from './upload.service';

@Controller(ROUTES.UPLOAD)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @SkipThrottle()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    return this.uploadService.uploadFile(file, req);
  }

  // @SkipThrottle()
  // @Post()
  // @UseInterceptors(FileInterceptor('files'))
  // async uploadFiles(
  //   @UploadedFile() files: Express.Multer.File[],
  //   @Req() req: Request
  // ) {
  //   const key = req.headers.authorization;
  //   if (!key) throw new UnauthorizedException('Unauthorized');
  //   const user = await this.uploadService.findUser(key);

  //   const promises = files.map(async (file) => {
  //     const data = await this.uploadService.uploadFile(
  //       file,
  //       user.id,
  //       (req.headers.type as string) ?? 'random',
  //       (req.headers.uploader as 'sharex' | 'web') ?? 'sharex',
  //       Boolean(req.headers.perverse) ?? false
  //     );
  //     return data;
  //   });

  //   const data = await Promise.all(promises);

  //   return data;
  // }
}
