import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ROUTES } from '../lib/constants';
import { UploadService } from './upload.service';

@Controller(ROUTES.UPLOAD)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    if (!req.headers.authorization)
      throw new UnauthorizedException('Unauthorized');
    const res = await this.uploadService.findUser(req.headers.authorization);
    if (res.error) throw new BadRequestException(res.error);

    const data = await this.uploadService.uploadFile(
      file,
      res.user.id,
      (req.headers.type as string) ?? 'random',
      Boolean(req.headers.perverse) ?? false
    );

    Logger.debug(
      `[UID ${res.user.id}] - ${res.user.username} uploaded file ${file.originalname}`,
      'UploadController'
    );

    return data;
  }

  @Post()
  @UseInterceptors(FileInterceptor('files'))
  async uploadFiles(
    @UploadedFile() files: Express.Multer.File[],
    @Req() req: Request
  ) {
    try {
      if (req.headers.authorization)
        throw new UnauthorizedException('Unauthorized');
      const res = await this.uploadService.findUser(req.headers.authorization);
      if (res.error) throw new BadRequestException(res.error);

      const promises = files.map(async (file) => {
        const data = await this.uploadService.uploadFile(
          file,
          res.user.id,
          (req.headers.type as string) ?? 'random',
          Boolean(req.headers.perverse) ?? false
        );
        return data;
      });

      const data = await Promise.all(promises);

      return data;
    } catch (error) {
      Logger.error((error as Error).message, 'UploadController');
      return { error: 'Something went wrong' };
    }
  }
}
