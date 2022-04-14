import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { UPLOAD_DIR } from '../lib/constants';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class DeleteService {
  constructor(
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
  ) {}

  findFile(token: string) {
    return this.prismaService.file.findUnique({
      where: { deleteToken: token },
    });
  }

  async deleteFile(token: string, slug: string): Promise<boolean> {
    try {
      await Promise.all([
        this.prismaService.file.delete({
          where: { deleteToken: token },
        }),
        unlink(join(UPLOAD_DIR, slug)),
        this.cacheManager.del(slug),
      ]);
      return true;
    } catch (error) {
      Logger.error((error as Error).message, 'DeleteService.deleteFile');
      return false;
    }
  }
}
