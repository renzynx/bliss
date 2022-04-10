import { Injectable, Logger } from '@nestjs/common';
import { SLUG_TYPE, UPLOAD_DIR } from '../lib/constants';
import {
  IUploadService,
  UploadResponse,
  UserResponse,
} from '../lib/interfaces';
import { PrismaService } from '../prisma/prisma.service';
import { writeFile } from 'node:fs/promises';
import { text, emoji, zerowidth } from '../lib/charsets';
import { join } from 'node:path';
import { File } from '@prisma/client';
import { FileCache } from '../main';

@Injectable()
export class UploadService implements IUploadService {
  constructor(private readonly prismaService: PrismaService) {}

  updateCache(file: File) {
    return FileCache.set(file.slug, file);
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

  async findUser(token: string): Promise<UserResponse> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { token },
      });
      delete user.password;
      return { user };
    } catch (error) {
      Logger.error((error as Error).message, 'UploadService.findUser');
      return { error: 'Something went wrong' };
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    uid: number,
    slugType: string,
    perverse?: boolean
  ): Promise<UploadResponse> {
    try {
      const slug =
        slugType === SLUG_TYPE.ZEROWIDTH
          ? this.generateSlug(SLUG_TYPE.ZEROWIDTH)
          : slugType === SLUG_TYPE.EMOJI
          ? this.generateSlug(SLUG_TYPE.EMOJI)
          : this.generateSlug(SLUG_TYPE.RANDOM);

      const filePath = join(UPLOAD_DIR, slug);

      const [data] = await Promise.all([
        this.prismaService.file.create({
          data: {
            fileName: perverse
              ? file.originalname
              : slug + '.' + file.originalname.split('.').pop(),
            mimetype: file.mimetype,
            originalName: file.originalname,
            size: file.size,
            slug,
            uid,
          },
        }),
        writeFile(filePath, file.buffer),
      ]);

      this.updateCache(data);

      return {
        url: `${this.getProtocol()}://${process.env.SERVER_DOMAIN}/${slug}`,
        delete: `${this.getProtocol()}://${process.env.SERVER_DOMAIN}/delete/${
          data.deleteToken
        }`,
      };
    } catch (error) {
      Logger.error((error as Error).message);
      return {
        error: 'Something went wrong',
      };
    }
  }

  getProtocol() {
    return process.env.USE_HTTPS ? 'https' : 'http';
  }
}
