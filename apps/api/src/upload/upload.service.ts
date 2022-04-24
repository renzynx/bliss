import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SLUG_TYPE, UPLOAD_DIR } from '../lib/constants';
import { IUploadService } from '../lib/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile } from 'node:fs/promises';
import { text, emoji, zerowidth } from '../lib/charsets';
import { join } from 'node:path';
import { File, User } from '@prisma/client';
import { UploadResponse } from '@bliss/shared-types';
import { Cache } from 'cache-manager';
import { S3Service } from '../s3/s3.service';
import { Request } from 'express';

@Injectable()
export class UploadService implements IUploadService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
    @Inject(CACHE_MANAGER) private readonly cacheManger: Cache
  ) {}

  async findUser(token: string): Promise<User> {
    const user = await this.prismaService.user
      .findUnique({
        where: { token },
        include: { files: true },
      })
      .catch((err) => {
        Logger.error((err as Error).message, 'UploadService.findUser');
        throw new InternalServerErrorException('Something went wrong');
      });

    if (!user) throw new UnauthorizedException('No user found');

    delete user.password;
    return user;
  }

  uploadFile(
    file: Express.Multer.File,
    req: Request
  ): Promise<UploadResponse | string> {
    return process.env.USE_S3
      ? this.uploadToS3(file, req)
      : this.uploadToLocal(file, req);
  }

  async uploadToS3(file: Express.Multer.File, req: Request) {
    const token = req.headers.authorization;

    if (!token) throw new UnauthorizedException('No token provided');

    const user = await this.findUser(token);

    if (!user) throw new UnauthorizedException('No user found');

    const { id: uid, slugType } = user;

    const slug = this.getSlug(slugType);

    const uploader = req.headers.uploader as 'sharex' | 'web';

    const [obj, data] = await Promise.all([
      this.s3Service.s3_upload(file, slug),
      this.prismaService.file.create({
        data: {
          fileName: slug + '.' + file.originalname.split('.').pop(),
          originalName: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
          uid,
          slug,
        },
      }),
    ]).catch((err) => {
      Logger.error((err as Error).message, 'UploadService.uploadToS3');
      throw new InternalServerErrorException('Something went wrong');
    });

    await this.cacheManger.set(slug, obj.Location);

    Logger.debug(
      `[UID ${user.id}] - ${user.username} uploaded file ${file.originalname}`,
      'UploadController'
    );

    return uploader === 'web'
      ? JSON.stringify(data)
      : {
          url: `${this.getProtocol()}://${process.env.SERVER_DOMAIN}/${slug}`,
          delete: `${this.getProtocol()}://${
            process.env.SERVER_DOMAIN
          }/delete/${data.deleteToken}`,
        };
  }

  async uploadToLocal(file: Express.Multer.File, req: Request) {
    if (!req.headers.authorization)
      throw new UnauthorizedException('No token provided');

    const user = await this.findUser(req.headers.authorization);

    if (!user) throw new UnauthorizedException('No user found');

    const { id: uid, slugType } = user;

    const slug = this.getSlug(slugType);

    const preserve = req.headers.preserve as unknown as boolean;

    const uploader = req.headers.uploader as 'sharex' | 'web';

    const [data] = await Promise.all([
      this.prismaService.file.create({
        data: {
          fileName: preserve
            ? file.originalname
            : slug + '.' + file.originalname.split('.').pop(),
          mimetype: file.mimetype,
          originalName: file.originalname,
          size: file.size,
          slug,
          uid,
        },
      }),
      writeFile(join(UPLOAD_DIR, slug), file.buffer),
    ]).catch((e) => {
      Logger.debug((e as Error).message, 'UploadService.uploadFile');
      throw new InternalServerErrorException(
        'Something went wrong, please try again later.'
      );
    });

    await this.updateCache(data);

    Logger.debug(
      `[UID ${user.id}] - ${user.username} uploaded file ${file.originalname}`,
      'UploadController'
    );

    return uploader === 'web'
      ? JSON.stringify(data)
      : {
          url: `${this.getProtocol()}://${process.env.SERVER_DOMAIN}/${slug}`,
          delete: `${this.getProtocol()}://${
            process.env.SERVER_DOMAIN
          }/delete/${data.deleteToken}`,
        };
  }

  getProtocol() {
    return process.env.USE_HTTPS === 'true' ? 'https' : 'http';
  }

  getSlug(slugType: string) {
    return slugType === SLUG_TYPE.ZEROWIDTH
      ? this.generateSlug(SLUG_TYPE.ZEROWIDTH)
      : slugType === SLUG_TYPE.EMOJI
      ? this.generateSlug(SLUG_TYPE.EMOJI)
      : this.generateSlug(SLUG_TYPE.RANDOM);
  }

  updateCache(file: File) {
    return this.cacheManger.set(file.slug, JSON.stringify(file));
  }

  generateSlug(type: SLUG_TYPE, length = 12) {
    switch (type) {
      case SLUG_TYPE.RANDOM:
        // eslint-disable-next-line no-var
        for (var i = 0, random = ''; i < length; ++i)
          random += text[Math.floor(Math.random() * text.length)];
        return random;
      case SLUG_TYPE.ZEROWIDTH:
        // eslint-disable-next-line no-var
        for (var i = 0, random = ''; i < length; ++i)
          random += zerowidth[Math.floor(Math.random() * zerowidth.length)];
        return random;
      case SLUG_TYPE.EMOJI:
        // eslint-disable-next-line no-var
        for (var i = 0, random = ''; i < length; ++i)
          random += emoji[Math.floor(Math.random() * emoji.length)];
        return random;
    }
  }
}
