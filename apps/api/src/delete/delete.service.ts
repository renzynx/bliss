import { Injectable, Logger } from '@nestjs/common';
import { unlink } from 'node:fs/promises';
import { UPLOAD_DIR } from '../lib/constants';
import { FileCache } from '../main';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DeleteService {
  constructor(private readonly prismaService: PrismaService) {}

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
        FileCache.delete(slug),
      ]);
      return true;
    } catch (error) {
      Logger.error((error as Error).message, 'DeleteService.deleteFile');
      return false;
    }
  }
}
