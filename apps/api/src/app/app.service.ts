import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { File, User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { createReadStream } from 'node:fs';
import { join } from 'path';
import { UPLOAD_DIR } from '../lib/constants';
import { Response, Request } from 'express';
import { pathExists, readJson } from 'fs-extra';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getFile(slug: string, res: Response, req: Request, download?: string) {
    return process.env.USE_S3 === 'true'
      ? this.getFromS3(slug, res, req, download)
      : this.getFromLocal(slug, res, req, download);
  }

  async getFileJSON(slug: string) {
    const exist = await pathExists(join(UPLOAD_DIR, slug + '.json'));

    if (!exist) throw new NotFoundException('File not found');

    return readJson(join(UPLOAD_DIR, slug + '.json'));
  }

  async getFromLocal(
    slug: string,
    res: Response,
    req: Request,
    download?: string
  ) {
    const raw = await this.cacheManager.get<string>(slug);

    if (!raw) throw new NotFoundException('File not found');

    const data: File & { url: string; user: User } = JSON.parse(raw);

    const path = await pathExists(join(UPLOAD_DIR, data.fileName));

    if (!path) throw new NotFoundException('File not found');

    res
      .header('Accept-Ranges', 'bytes')
      .header('Content-Type', data.mimetype)
      .header('Content-Length', String(data.size));

    if (download) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${data.originalName}"`
      );
    }

    req.headers['x-bliss-data'] &&
      res.setHeader(
        'x-bliss-data',
        JSON.stringify({
          title: data.user.embedTitle,
          description: data.user.embedDesc,
          color: data.user.embedColor,
          uploadedAt: data.createdAt.toString(),
          filename: data.fileName,
          original: data.originalName,
          enabled: data.user.useEmbed ? 'true' : 'false',
          url: data.url,
          username: data.user.username,
        })
      );

    return new StreamableFile(
      createReadStream(join(UPLOAD_DIR, data.fileName)),
      {
        length: data.size,
        type: data.mimetype,
      }
    );
  }

  async getFromS3(
    slug: string,
    res: Response,
    req: Request,
    download?: string
  ) {
    const raw = await this.cacheManager.get<string>(slug);

    if (!raw) throw new NotFoundException('File not found');

    const data: File & { url: string; user: User } = JSON.parse(raw);

    const file = await axios
      .get(data.url, { responseType: 'stream' })
      .catch((err) => {
        Logger.error((err as Error).message, 'AppService.getFromS3');
        throw new NotFoundException('File not found');
      });

    Object.keys(file.headers).forEach((key) =>
      res.setHeader(key, file.headers[key])
    );

    if (download) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${data.originalName}"`
      );
    }

    req.headers['x-bliss-data'] &&
      res.setHeader(
        'x-bliss-data',
        JSON.stringify({
          title: data.user.embedTitle,
          description: data.user.embedDesc,
          color: data.user.embedColor,
          uploadedAt: data.createdAt.toString(),
          filename: data.fileName,
          original: data.originalName,
          enabled: data.user.useEmbed,
          url: data.url,
          username: data.user.username,
        })
      );

    return new StreamableFile(file.data);
  }
}
