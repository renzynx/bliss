import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { File } from '@prisma/client';
import { Cache } from 'cache-manager';
import { IAppService } from '../lib/interfaces';
import { pathExists, readFile } from 'fs-extra';
import { join } from 'path';
import { UPLOAD_DIR } from '../lib/constants';
import { Response } from 'express';
import axios from 'axios';

@Injectable()
export class AppService implements IAppService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async getFile(slug: string, res: Response, download?: string) {
    return process.env.USE_S3
      ? this.getFromS3(slug, res)
      : this.getFromLocal(slug, res, download);
  }

  async getFromLocal(slug: string, res: Response, download?: string) {
    const [data, exists] = await Promise.all([
      this.cacheManager.get<string>(slug),
      pathExists(join(UPLOAD_DIR, slug)),
    ]);

    if (!data || !exists) throw new NotFoundException('File not found');

    const file: File = JSON.parse(data);

    res
      .header('Content-Type', file.mimetype)
      .header('Content-Length', file.toString())
      .header('Cache-Control', 'public, max-age=31536000')
      .header('Expires', new Date(Date.now() + 31536000 * 1000).toUTCString())
      .header('Last-Modified', new Date(file.createdAt).toUTCString());

    if (download) {
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${file.originalName}"`
      );
    }

    const f = await readFile(join(UPLOAD_DIR, slug));

    return new StreamableFile(f, {
      length: file.size,
      type: file.mimetype,
    });
  }

  async getFromS3(slug: string, res: Response) {
    const url = await this.cacheManager.get<string>(slug);

    if (!url) throw new NotFoundException('File not found');

    const file = await axios.get(url, { responseType: 'stream' });

    if (file.status !== 200) throw new NotFoundException('File not found');

    Object.keys(file.headers).forEach((key) =>
      res.setHeader(key, file.headers[key])
    );

    return new StreamableFile(file.data);
  }
}